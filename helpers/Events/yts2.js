const ytsMod = "yt-search".import()
const axiosMod = "axios".import()

const axios = axiosMod?.default || axiosMod

const ytsFn =
  typeof ytsMod === "function"
    ? ytsMod
    : typeof ytsMod?.default === "function"
      ? ytsMod.default
      : typeof ytsMod?.search === "function"
        ? ytsMod.search
        : null

const yt = {
  url: Object.freeze({
    audio128: "https://api.apiapi.lat",
    video: "https://api5.apiapi.lat",
    else: "https://api3.apiapi.lat",
    referrer: "https://ogmp3.pro/"
  }),
  encUrl: (s) => s.split("").map((c) => c.charCodeAt()).reverse().join(";"),
  xor: (s) => s.split("").map((v) => String.fromCharCode(v.charCodeAt() ^ 1)).join(""),
  genRandomHex: () =>
    Array.from({ length: 32 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join(""),
  postJson: async function (url, data, headers = {}) {
    const baseHeaders = {
      "Content-Type": "application/json",
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36",
      origin: this.url.referrer.replace(/\/$/, ""),
      referer: this.url.referrer
    }
    const r = await axios.post(url, data, {
      headers: { ...baseHeaders, ...headers },
      timeout: 60000,
      maxBodyLength: Infinity,
      validateStatus: () => true
    })
    if (r.status >= 400) throw new Error("HTTP " + r.status)
    return r.data
  },
  init: async function (rpObj) {
    const { apiOrigin, payload } = rpObj
    const api =
      apiOrigin +
      "/" +
      this.genRandomHex() +
      "/init/" +
      this.encUrl(this.xor(payload.data)) +
      "/" +
      this.genRandomHex() +
      "/"
    return this.postJson(api, payload)
  },
  genFileUrl: function (i, pk, rpObj) {
    const { apiOrigin } = rpObj
    const pkValue = pk ? pk + "/" : ""
    const downloadUrl =
      apiOrigin + "/" + this.genRandomHex() + "/download/" + i + "/" + this.genRandomHex() + "/" + pkValue
    return { downloadUrl }
  },
  statusCheck: async function (i, pk, rpObj) {
    const { apiOrigin } = rpObj
    let json
    let count = 0
    do {
      await new Promise((r) => setTimeout(r, 5000))
      count++
      const pkVal = pk ? pk + "/" : ""
      const api = apiOrigin + "/" + this.genRandomHex() + "/status/" + i + "/" + this.genRandomHex() + "/" + pkVal
      json = await this.postJson(api, { data: i })
      if (count >= 100) throw Error("pooling mencapai 100, dihentikan")
    } while (json?.s === "P")
    if (json?.s === "E") throw Error(JSON.stringify(json))
    return this.genFileUrl(i, pk, rpObj)
  },
  resolvePayload: function (ytUrl, userFormat) {
    const valid = ["64k", "96k", "128k", "192k", "256k", "320k", "240p", "360p", "480p", "720p", "1080p"]
    if (!valid.includes(userFormat)) throw Error(`format salah. tersedia: ${valid.join(", ")}`)

    let apiOrigin = this.url.audio128
    let data = this.xor(ytUrl)
    let referer = this.url.referrer
    let format = "0"
    let mp3Quality = "128"
    let mp4Quality = "720"

    if (/^\d+p$/.test(userFormat)) {
      apiOrigin = this.url.video
      format = "1"
      mp4Quality = userFormat.replace("p", "")
    } else if (userFormat !== "128k") {
      apiOrigin = this.url.else
      mp3Quality = userFormat.replace("k", "")
    }

    return {
      apiOrigin,
      payload: { data, format, referer, mp3Quality, mp4Quality, userTimeZone: "-480" }
    }
  },
  download: async function (url, fmt = "128k") {
    const rpObj = this.resolvePayload(url, fmt)
    const initObj = await this.init(rpObj)
    const { i, pk, s } = initObj || {}
    if (!i) throw Error("Gagal init download")
    if (s === "C") return this.genFileUrl(i, pk, rpObj)
    return this.statusCheck(i, pk, rpObj)
  }
}

const SEARCH_ENDPOINTS = [
  "https://invidious.fdn.fr",
  "https://yewtu.be",
  "https://invidious.privacydev.net",
  "https://inv.nadeko.net",
  "https://invidious.slipfox.xyz",
  "https://invidious.0011.lt",
  "https://inv.riverside.rocks",
  "https://invidious.tiekoetter.com",
  "https://iv.melmac.space",
  "https://invidious.no-logs.com"
]

function getQuotedRaw(cht) {
  const c = cht || {}
  const cand = [c?.msg, c?.m, c?.message, c?.raw, c?.quoted?.msg, c?.quoted?.m, c?.quoted]
  for (const x of cand) {
    if (x && x.key && typeof x.key === "object") return x
  }
  return null
}

function safeName(s) {
  return String(s || "audio")
    .replace(/[\\/:*?"<>|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80)
}

function secToTimestamp(sec) {
  const n = Math.max(0, parseInt(sec || 0, 10) || 0)
  const h = Math.floor(n / 3600)
  const m = Math.floor((n % 3600) / 60)
  const s = n % 60
  const pad = (x) => String(x).padStart(2, "0")
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}

function pickThumb(it) {
  const t = it?.videoThumbnails
  if (Array.isArray(t) && t.length) return t[t.length - 1]?.url || t[0]?.url || ""
  return ""
}

function normalizeFromInvidious(it) {
  if (!it?.videoId) return null
  return {
    title: it.title || "Unknown",
    url: "https://www.youtube.com/watch?v=" + it.videoId,
    thumbnail: pickThumb(it),
    views: it.viewCount || 0,
    timestamp: secToTimestamp(it.lengthSeconds || 0),
    ago: it.publishedText || "-",
    author: { name: it.author || "-" }
  }
}

async function searchViaInvidious(base, query) {
  const url = `${base}/api/v1/search?q=${encodeURIComponent(query)}&type=video&sort=relevance`
  const r = await axios.get(url, {
    timeout: 20000,
    validateStatus: () => true,
    headers: { "user-agent": "Mozilla/5.0" }
  })
  if (r.status !== 200) throw new Error(`${base} status ${r.status}`)
  const arr = Array.isArray(r.data) ? r.data : []
  const it = arr.find((x) => x && x.videoId) || null
  const v = normalizeFromInvidious(it)
  if (!v?.url) throw new Error(`${base} hasil kosong`)
  return v
}

async function searchYT(query) {
  if (ytsFn) {
    try {
      const res = await ytsFn(query)
      const v = res?.videos?.[0]
      if (v?.url) return v
    } catch {}
  }

  let last = null
  for (const base of SEARCH_ENDPOINTS) {
    try {
      return await searchViaInvidious(base, query)
    } catch (e) {
      last = e
    }
  }

  throw last || new Error("Search gagal")
}

async function fetchAudioBuffer(url) {
  const r = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: 60000,
    maxBodyLength: Infinity,
    validateStatus: () => true,
    headers: {
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36",
      referer: yt.url.referrer,
      origin: yt.url.referrer.replace(/\/$/, "")
    }
  })
  if (r.status >= 400) throw new Error("HTTP " + r.status)
  return Buffer.from(r.data)
}

export default async function on({ cht, Exp, store, ev, is }) {
  ev.on(
    {
      cmd: ["play2", "ytplay2"],
      listmenu: ["play2 <query>"],
      tag: "search",
      energy: 7,
      args: "Masukkan judul lagu / keyword pencarian"
    },
    async ({ cht }) => {
      const q =
        (cht.q || "").trim() ||
        (cht.quoted?.text || "").trim() ||
        (cht.quoted?.caption || "").trim()

      if (!q) return cht.reply("Mw Cari Lagu Apa")

      await cht.react("⏳").catch(() => {})

      let v
      try {
        v = await searchYT(q)
      } catch (e) {
        await cht.react("❌").catch(() => {})
        return cht.reply("Gagal search YouTube.\nDetail: " + (e?.message || String(e)))
      }

      const quoted = getQuotedRaw(cht)
      const opts = quoted ? { quoted } : {}

      await Exp.sendMessage(
        cht.id,
        {
          image: { url: v.thumbnail },
          caption:
            `*${v.title}*\n\n` +
            `*Author :* ${v.author?.name || "-"}\n` +
            `*Views :* ${(v.views || 0).toLocaleString("id-ID")}\n` +
            `*Durasi :* ${v.timestamp || "-"}\n` +
            `*Upload :* ${v.ago || "-"}\n` +
            `*Link :* ${v.url}\n\n` +
            `> Send Audio…`
        },
        opts
      )

      let dl
      try {
        dl = await yt.download(v.url, "128k")
      } catch (e) {
        await cht.react("❌").catch(() => {})
        return cht.reply("Gagal download audio dari server.\nDetail: " + (e?.message || String(e)))
      }

      if (!dl?.downloadUrl) {
        await cht.react("❌").catch(() => {})
        return cht.reply("Gagal mendapatkan link audio.")
      }

      let buf
      try {
        buf = await fetchAudioBuffer(dl.downloadUrl)
      } catch (e) {
        await cht.react("❌").catch(() => {})
        return cht.reply("Link audio terblokir (403) saat diambil.\nDetail: " + (e?.message || String(e)))
      }

      await Exp.sendMessage(
        cht.id,
        {
          audio: buf,
          mimetype: "audio/mpeg",
          fileName: safeName(v.title) + ".mp3"
        },
        opts
      )

      await cht.react("✅").catch(() => {})
    }
  )
}
