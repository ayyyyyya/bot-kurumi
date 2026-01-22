const axiosMod = "axios".import()

const axios = axiosMod?.default || axiosMod

const PROGRESS_MIN_INTERVAL = 1400

const _pState = new Map()

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function getQuotedRaw(cht) {

  const c = cht || {}

  const cand = [c?.msg, c?.m, c?.message, c?.raw, c?.quoted?.msg, c?.quoted?.m, c?.quoted]

  for (const x of cand) if (x && x.key && typeof x.key === "object") return x

  return null

}

async function progressStart(cht, Exp, opts, text) {

  try {

    const msg = await Exp.sendMessage(cht.id, { text }, opts)

    const k = msg?.key?.id || ""

    if (k) _pState.set(k, { t: Date.now(), last: text })

    return msg

  } catch {

    return null

  }

}

async function progressUpdate(cht, Exp, msg, text) {

  if (!msg?.key?.id) return

  const k = msg.key.id

  const st = _pState.get(k) || { t: 0, last: "" }

  if (st.last === text) return

  const now = Date.now()

  const wait = PROGRESS_MIN_INTERVAL - (now - st.t)

  if (wait > 0) await sleep(wait)

  try {

    await Exp.sendMessage(cht.id, { text, edit: msg.key })

    st.t = Date.now()

    st.last = text

    _pState.set(k, st)

  } catch {}

}

function normalizeThreadsUrl(u) {

  const s = String(u || "").trim()

  if (!s) return null

  try {

    const url = new URL(s)

    if (!/threads\.net|threads\.com/i.test(url.hostname)) return null

    return url.toString()

  } catch {

    return null

  }

}

function bytesToSize(n) {

  const x = Number(n || 0)

  if (!isFinite(x) || x <= 0) return "0 B"

  const units = ["B", "KB", "MB", "GB"]

  let i = 0

  let v = x

  while (v >= 1024 && i < units.length - 1) {

    v /= 1024

    i++

  }

  return `${v.toFixed(i === 0 ? 0 : 2)} ${units[i]}`

}

function detectType(buf) {

  if (!Buffer.isBuffer(buf) || buf.length < 12) return "unknown"

  if (buf.slice(4, 8).toString() === "ftyp") return "video"

  const b0 = buf[0],

    b1 = buf[1],

    b2 = buf[2],

    b3 = buf[3]

  if (b0 === 0xff && b1 === 0xd8 && b2 === 0xff) return "image"

  if (b0 === 0x89 && b1 === 0x50 && b2 === 0x4e && b3 === 0x47) return "image"

  if (b0 === 0x47 && b1 === 0x49 && b2 === 0x46) return "image"

  if (b0 === 0x52 && b1 === 0x49 && b2 === 0x46 && b3 === 0x46) return "webp"

  return "unknown"

}

function extractLinks(apiData) {

  const d = apiData || {}

  const candidates = []

  const push = (x) => {

    if (!x) return

    if (Array.isArray(x)) x.forEach(push)

    else if (typeof x === "string") candidates.push(x)

    else if (typeof x === "object") {

      const u =

        x.directLink ||

        x.url ||

        x.link ||

        x.download ||

        x.downloadUrl ||

        x.mediaUrl ||

        x.src ||

        x.path

      if (typeof u === "string") candidates.push(u)

    }

  }

  push(d.directLink)

  push(d.direct_link)

  push(d.url)

  push(d.data?.directLink)

  push(d.data?.url)

  push(d.result?.directLink)

  push(d.result?.url)

  push(d.result?.media)

  push(d.media)

  push(d.medias)

  push(d.items)

  push(d.links)

  push(d.files)

  const uniq = [...new Set(candidates.map((s) => String(s).trim()).filter(Boolean))]

  return uniq

}

function extractMeta(apiData) {

  const d = apiData || {}

  const meta = d.data || d.result || d || {}

  const pick = (...keys) => {

    for (const k of keys) {

      const v = meta?.[k] ?? d?.[k]

      if (typeof v === "string" && v.trim()) return v.trim()

    }

    return ""

  }

  return {

    title: pick("title", "judul", "name"),

    caption: pick("caption", "description", "desc", "text"),

    author: pick("author", "username", "user", "owner"),

    createdAt: pick("createdAt", "created_at", "date", "timestamp"),

    provider: pick("provider", "source") || "snapthreads.net"

  }

}

async function threadsApi(url) {

  const api = `https://snapthreads.net/api/download?url=${encodeURIComponent(url)}`

  const r = await axios.get(api, {

    timeout: 60000,

    validateStatus: () => true,

    headers: {

      "user-agent": "Mozilla/5.0",

      accept: "application/json,text/plain,*/*",

      referer: "https://snapthreads.net/"

    }

  })

  if (r.status !== 200) throw new Error(`HTTP ${r.status}`)

  return r.data

}

async function downloadToBuffer(url) {

  const r = await axios.get(url, {

    responseType: "arraybuffer",

    timeout: 90000,

    maxBodyLength: Infinity,

    validateStatus: () => true,

    headers: {

      "user-agent": "Mozilla/5.0",

      accept: "*/*",

      referer: "https://snapthreads.net/"

    }

  })

  if (r.status !== 200) throw new Error(`Media HTTP ${r.status}`)

  const buf = Buffer.from(r.data)

  return { buf, headers: r.headers || {} }

}

export default async function on({ cht, Exp, store, ev, is }) {

  ev.on(

    {

      cmd: ["threads", "thdl"],

      listmenu: ["threads <link threads>"],

      tag: "downloader",

      energy: 20,

      args: "Masukkan link Threads. Contoh: .threads https://www.threads.net/@user/post/xxxx",

      limit: true

    },

    async ({ cht }) => {

      const input = (cht.q || "").trim()

      const url = normalizeThreadsUrl(input)

      if (!url) {

        return cht.reply("Contoh:\n.threads https://www.threads.net/@user/post/xxxx")

      }

      const quoted = getQuotedRaw(cht)

      const opts = quoted ? { quoted } : {}

      await cht.react("⏳").catch(() => {})

      const prog = await progressStart(cht, Exp, opts, "⏳ threads: ambil data…")

      let data

      try {

        data = await threadsApi(url)

      } catch (e) {

        await cht.react("❌").catch(() => {})

        await progressUpdate(cht, Exp, prog, "❌ threads: gagal ambil data")

        return cht.reply("🚨 Error: " + (e?.message || String(e)))

      }

      const links = extractLinks(data)

      const meta = extractMeta(data)

      if (!links.length) {

        await cht.react("❌").catch(() => {})

        await progressUpdate(cht, Exp, prog, "❌ threads: link media kosong")

        return cht.reply("Gagal: tidak ada media yang bisa diambil dari link itu.")

      }

      const maxSend = Math.min(10, links.length)

      await progressUpdate(cht, Exp, prog, `⏳ threads: download 1/${maxSend}…`)

      const headerCaption =

        `✅ *Threads Downloader*\n\n` +

        `• Sumber: ${url}\n` +

        `• Provider: ${meta.provider}\n` +

        `• Total media: ${links.length}\n` +

        (meta.author ? `• Author: ${meta.author}\n` : "") +

        (meta.createdAt ? `• Created: ${meta.createdAt}\n` : "") +

        (meta.title ? `• Title: ${meta.title}\n` : "") +

        (meta.caption ? `\n*Caption:*\n${safeText(meta.caption, 900)}` : "")

      await Exp.sendMessage(cht.id, { text: headerCaption }, opts)

      for (let i = 0; i < maxSend; i++) {

        await progressUpdate(cht, Exp, prog, `⏳ threads: download ${i + 1}/${maxSend}…`)

        let dl

        try {

          dl = await downloadToBuffer(links[i])

        } catch (e) {

          await Exp.sendMessage(

            cht.id,

            { text: `⚠️ Gagal ambil media ${i + 1}/${maxSend}\nDetail: ${(e?.message || String(e)).slice(0, 200)}` },

            opts

          )

          continue

        }

        const { buf, headers } = dl

        const kind = detectType(buf)

        const size = bytesToSize(buf.length)

        const ct = String(headers["content-type"] || "").trim()

        const mediaCaption = `• Media: ${i + 1}/${maxSend}\n• Type: ${kind}${ct ? ` (${ct})` : ""}\n• Size: ${size}`

        if (kind === "video") {

          await Exp.sendMessage(cht.id, { video: buf, caption: mediaCaption }, opts)

        } else {

          await Exp.sendMessage(cht.id, { image: buf, caption: mediaCaption }, opts)

        }

      }

      await cht.react("✅").catch(() => {})

      await progressUpdate(cht, Exp, prog, "✅ threads: selesai")

    }

  )

}