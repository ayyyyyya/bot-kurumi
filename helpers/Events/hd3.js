const axiosMod = "axios".import()
const axios = axiosMod?.default || axiosMod

const PROGRESS_MIN_INTERVAL = 1400
const _progressState = new Map()

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function progressStart(cht, Exp, opts, text) {
  try {
    const msg = await Exp.sendMessage(cht.id, { text }, opts)
    const k = msg?.key?.id || ""
    if (k) _progressState.set(k, { t: Date.now(), last: text })
    return msg
  } catch {
    return null
  }
}

async function progressUpdate(cht, Exp, msg, text) {
  if (!msg?.key?.id) return
  const k = msg.key.id
  const st = _progressState.get(k) || { t: 0, last: "" }
  if (st.last === text) return

  const now = Date.now()
  const wait = PROGRESS_MIN_INTERVAL - (now - st.t)
  if (wait > 0) await sleep(wait)

  try {
    await Exp.sendMessage(cht.id, { text, edit: msg.key })
    st.t = Date.now()
    st.last = text
    _progressState.set(k, st)
  } catch {}
}

function getQuotedRaw(cht) {
  const c = cht || {}
  const cand = [c?.msg, c?.m, c?.message, c?.raw, c?.quoted?.msg, c?.quoted?.m, c?.quoted]
  for (const x of cand) if (x && x.key && typeof x.key === "object") return x
  return null
}

function clampInt(n, min, max, def) {
  const x = parseInt(n, 10)
  if (!Number.isFinite(x)) return def
  return Math.max(min, Math.min(max, x))
}

async function fetchWithTimeout(url, options = {}, timeout = 60000) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeout)
  try {
    const res = await fetch(url, { ...options, signal: ctrl.signal })
    return res
  } finally {
    clearTimeout(t)
  }
}

class PicsartEnhancer {
  constructor() {
    this.uploadUrl = "https://upload.picsart.com/files"
    this.aiUrl = "https://ai.picsart.com"
    this.jsUrl = "https://picsart.com/-/landings/4.310.0/static/index-C3-HwnoW-GZgP7cLS.js"
    this.token = null
    this.headers = {
      origin: "https://picsart.com",
      referer: "https://picsart.com/",
      "user-agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
      accept: "*/*"
    }
  }

  async getToken() {
    const res = await fetchWithTimeout(this.jsUrl, { headers: this.headers }, 60000)
    if (!res.ok) throw new Error(`Token fetch HTTP ${res.status}`)
    const text = await res.text()
    const m = text.match(/"x-app-authorization":"Bearer\s+([^"]+)"/)
    if (!m?.[1]) throw new Error("Token not found")
    this.token = m[1]
    return this.token
  }

  async upload(buffer) {
    const boundary = "----WebKitFormBoundary" + Math.random().toString(36).slice(2)
    const part1 = Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="type"\r\n\r\nediting-temp-landings\r\n--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="image.png"\r\nContent-Type: image/png\r\n\r\n`,
      "utf-8"
    )
    const part2 = Buffer.from(
      `\r\n--${boundary}\r\nContent-Disposition: form-data; name="url"\r\n\r\n\r\n--${boundary}\r\nContent-Disposition: form-data; name="metainfo"\r\n\r\n\r\n--${boundary}--\r\n`,
      "utf-8"
    )
    const body = Buffer.concat([part1, buffer, part2])

    const r = await fetchWithTimeout(
      this.uploadUrl,
      {
        method: "POST",
        headers: {
          ...this.headers,
          "content-type": `multipart/form-data; boundary=${boundary}`,
          accept: "application/json"
        },
        body
      },
      60000
    )

    const j = await r.json().catch(() => null)
    if (!r.ok) throw new Error(`Upload HTTP ${r.status}`)
    if (!j || typeof j !== "object") throw new Error("Upload response invalid")
    return j
  }

  async enhance(url, scale) {
    if (!this.token) await this.getToken()

    const params = new URLSearchParams({
      picsart_cdn_url: url,
      format: "PNG",
      model: "REALESERGAN"
    })

    const body = JSON.stringify({
      image_url: url,
      colour_correction: { enabled: false, blending: 0.5 },
      seed: 42,
      upscale: { enabled: true, node: "esrgan", target_scale: scale },
      face_enhancement: {
        enabled: true,
        blending: 1,
        max_faces: 1000,
        impression: false,
        gfpgan: true,
        node: "ada"
      }
    })

    const r = await fetchWithTimeout(
      `${this.aiUrl}/gw1/diffbir-enhancement-service/v1.7.6?${params}`,
      {
        method: "POST",
        headers: {
          ...this.headers,
          accept: "application/json",
          "content-type": "application/json",
          platform: "website",
          "x-app-authorization": `Bearer ${this.token}`,
          "x-touchpoint": "widget_EnhancedImage",
          "x-touchpoint-referrer": "/id/ai-image-enhancer/"
        },
        body
      },
      90000
    )

    const j = await r.json().catch(() => null)
    if (!r.ok) throw new Error(`Enhance HTTP ${r.status}`)
    if (!j || typeof j !== "object") throw new Error("Enhance response invalid")
    return j
  }

  async process(buffer, scale) {
    const u = await this.upload(buffer)
    if (u?.status !== "success" || !u?.result?.url) throw new Error("Upload failed")
    const out = await this.enhance(u.result.url, scale)
    const img = out?.result?.image_url || out?.result?.url || out?.image_url || null
    if (!img) throw new Error("Hasil gambar tidak ditemukan")
    return img
  }
}

export default async function on({ cht, Exp, store, ev, is }) {
  ev.on(
    {
      cmd: ["hd3"],
      listmenu: ["hd3 (reply image)"],
      tag: "tools",
      premium: true,
      energy: 30,
      args: "Reply gambar. Opsional: .hd3 4 (scale 2-16)",
      media: {
        type: ["image"],
        msg: "Reply/kirim gambarnya."
      }
    },
    async ({ cht, media }) => {
      const quoted = getQuotedRaw(cht)
      const opts = quoted ? { quoted } : {}

      const scale = clampInt((cht.q || "").trim(), 2, 16, 4)

      await cht.react("⏳").catch(() => {})
      const prog = await progressStart(cht, Exp, opts, `_Bentar ku cek_ (x${scale})`)

      try {
        await progressUpdate(cht, Exp, prog, "_Okee sebentar ya_")

        let imgBuf = media
        if (typeof imgBuf === "string") {
          const r = await axios.get(imgBuf, { responseType: "arraybuffer", timeout: 60000 })
          imgBuf = Buffer.from(r.data)
        }
        if (!Buffer.isBuffer(imgBuf)) throw new Error("Media bukan buffer")

        await progressUpdate(cht, Exp, prog, "_BNTR_")
        const enhancer = new PicsartEnhancer()

        await progressUpdate(cht, Exp, prog, "_Lagi dienhance nih_")
        const outUrl = await enhancer.process(imgBuf, scale)

        await progressUpdate(cht, Exp, prog, "_Ku kirimm yaa_")
        await Exp.sendMessage(cht.id, { image: { url: outUrl } }, opts)

        await cht.react("✅").catch(() => {})
        await progressUpdate(cht, Exp, prog, "_Selesaiiiiii_")
      } catch (e) {
        await cht.react("❌").catch(() => {})
        await progressUpdate(cht, Exp, prog, "_Yahhh gagal_")
        return cht.reply("🚨 Error: " + (e?.message || String(e)))
      }
    }
  )
}
