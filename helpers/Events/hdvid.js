
const fsMod = "fs".import()
const pathMod = "path".import()

let cryptoMod
try { cryptoMod = await "node:crypto".import() } catch { cryptoMod = await "crypto".import() }

let ffmpegMod
try { ffmpegMod = await "fluent-ffmpeg".import() } catch { ffmpegMod = null }

const fs = fsMod?.default || fsMod
const path = pathMod?.default || pathMod
const crypto = cryptoMod?.default || cryptoMod
const ffmpeg = ffmpegMod?.default || ffmpegMod

const PROG_MIN = 1400
const PROG_STATE = new Map()
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const MAX_DIM = 16384

const KMAP = {
  "144p": 144,
  "240p": 240,
  "360p": 360,
  "480p": 480,
  "540p": 540,
  "720p": 720,
  "1080p": 1080,
  "1440p": 1440,
  "2160p": 2160,
  "2k": 1440,
  "4k": 2160,
  "5k": 2880,
  "8k": 4320,
  "10k": 10000,
  "12k": 12000,
  "16k": 8640
}

const COMMON = [144, 240, 360, 480, 540, 720, 1080, 1440, 2160, 2880, 4320, 5760, 7680, 8640, 10000, 12000, 15360]

function tmpRoot() {
  const candidates = [
    process?.env?.TMPDIR,
    process?.env?.TEMP,
    process?.env?.TMP,
    "/tmp",
    path.join(process.cwd(), ".tmp")
  ].filter(Boolean)

  for (const p of candidates) {
    try {
      if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true })
      const test = path.join(p, `.__test_${Date.now()}`)
      fs.writeFileSync(test, "1")
      fs.unlinkSync(test)
      return p
    } catch {}
  }
  return process.cwd()
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true })
}

function randHex(n = 10) {
  try {
    const rb = crypto?.randomBytes
    if (typeof rb === "function") return rb(Math.ceil(n / 2)).toString("hex").slice(0, n)
  } catch {}
  return Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2)
}

function clean(s) {
  return String(s || "").replace(/\s+/g, " ").trim()
}

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
    if (k) PROG_STATE.set(k, { t: Date.now(), last: text })
    return msg
  } catch {
    try { await cht.reply(text) } catch {}
    return null
  }
}

async function progressEdit(cht, Exp, msg, text) {
  if (!msg?.key?.id) return
  const k = msg.key.id
  const st = PROG_STATE.get(k) || { t: 0, last: "" }
  if (st.last === text) return
  const now = Date.now()
  const wait = PROG_MIN - (now - st.t)
  if (wait > 0) await sleep(wait)
  try {
    await Exp.sendMessage(cht.id, { text, edit: msg.key })
    PROG_STATE.set(k, { t: Date.now(), last: text })
  } catch {}
}

function parseTimemark(tm) {
  const s = String(tm || "").trim()
  if (!s) return 0
  const parts = s.split(":").map((x) => x.trim())
  if (parts.length === 3) {
    const h = parseFloat(parts[0]) || 0
    const m = parseFloat(parts[1]) || 0
    const sec = parseFloat(parts[2]) || 0
    return h * 3600 + m * 60 + sec
  }
  if (parts.length === 2) {
    const m = parseFloat(parts[0]) || 0
    const sec = parseFloat(parts[1]) || 0
    return m * 60 + sec
  }
  return parseFloat(s) || 0
}

function fmtTime(sec) {
  const n = Math.max(0, Math.floor(Number(sec) || 0))
  const h = Math.floor(n / 3600)
  const m = Math.floor((n % 3600) / 60)
  const s = n % 60
  const pad = (x) => String(x).padStart(2, "0")
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}

function bar(pct) {
  const p = Math.max(0, Math.min(100, Math.floor(pct || 0)))
  const total = 12
  const fill = Math.round((p / 100) * total)
  return "█".repeat(fill) + "░".repeat(total - fill)
}

function fileSizeMB(p) {
  try {
    const s = fs.statSync(p)
    return s.size / 1024 / 1024
  } catch {
    return 0
  }
}

async function bufferToTmp(buf) {
  const dir = path.join(tmpRoot(), "bell-hdvideo")
  ensureDir(dir)
  const fp = path.join(dir, `in_${Date.now()}_${randHex(8)}.bin`)
  fs.writeFileSync(fp, buf)
  return fp
}

function resolveExistingFile(p) {
  if (!p) return null
  const a = path.isAbsolute(p) ? p : path.resolve(process.cwd(), p)
  if (fs.existsSync(a)) return a
  if (fs.existsSync(p)) return p
  return null
}

function even(n) {
  const x = Math.max(2, Math.floor(Number(n) || 0))
  return x % 2 === 0 ? x : x - 1
}

async function ffprobeMeta(inputPath) {
  if (!ffmpeg || typeof ffmpeg !== "function") return { dur: 0, w: 0, h: 0 }
  const fp = ffmpeg?.ffprobe
  if (typeof fp !== "function") return { dur: 0, w: 0, h: 0 }

  return await new Promise((resolve) => {
    try {
      fp(inputPath, (err, data) => {
        if (err) return resolve({ dur: 0, w: 0, h: 0 })
        const dur = Number(data?.format?.duration || 0)
        const streams = Array.isArray(data?.streams) ? data.streams : []
        const v = streams.find((s) => s?.codec_type === "video") || {}
        let w = Number(v?.width || 0)
        let h = Number(v?.height || 0)
        let rot = 0
        const tr = v?.tags?.rotate
        if (tr != null) rot = Number(tr) || 0
        const sdl = Array.isArray(v?.side_data_list) ? v.side_data_list : []
        const sr = sdl.find((x) => x && typeof x === "object" && x.rotation != null)
        if (sr?.rotation != null) rot = Number(sr.rotation) || rot
        rot = ((rot % 360) + 360) % 360
        if (rot === 90 || rot === 270) {
          const tmp = w
          w = h
          h = tmp
        }
        resolve({
          dur: Number.isFinite(dur) ? dur : 0,
          w: Number.isFinite(w) ? w : 0,
          h: Number.isFinite(h) ? h : 0
        })
      })
    } catch {
      resolve({ dur: 0, w: 0, h: 0 })
    }
  })
}

function parseTargetShort(raw) {
  const t = clean(raw).toLowerCase()
  if (!t) return null
  if (KMAP[t]) return KMAP[t]
  const mk = t.match(/^(\d{1,3})k$/)
  if (mk?.[1]) {
    const k = parseInt(mk[1], 10)
    if (k === 4) return 2160
    if (k === 8) return 4320
    if (k === 16) return 8640
    const px = k * 1000
    return px > 0 ? px : null
  }
  const mp = t.match(/^(\d{2,5})p?$/)
  if (mp?.[1]) {
    const n = parseInt(mp[1], 10)
    return Number.isFinite(n) && n > 0 ? n : null
  }
  return null
}

function calcTargetDims(srcW, srcH, targetShort) {
  const w0 = Number(srcW) || 0
  const h0 = Number(srcH) || 0
  const t = Math.max(2, Number(targetShort) || 0)
  if (w0 <= 0 || h0 <= 0) return { outW: even(t * 16 / 9), outH: even(t) }

  const ar = w0 / h0
  const portrait = h0 > w0
  let outW = portrait ? t : Math.round(t * ar)
  let outH = portrait ? Math.round(t / ar) : t

  let max = Math.max(outW, outH)
  if (max > MAX_DIM) {
    const s = MAX_DIM / max
    outW = Math.floor(outW * s)
    outH = Math.floor(outH * s)
  }

  outW = even(outW)
  outH = even(outH)

  outW = Math.max(2, Math.min(MAX_DIM, outW))
  outH = Math.max(2, Math.min(MAX_DIM, outH))

  return { outW, outH }
}

async function runFfmpegUpscale({ inputPath, outputPath, outW, outH, onProg }) {
  if (!ffmpeg || typeof ffmpeg !== "function") {
    throw new Error(
      "Dependensi fluent-ffmpeg belum kebaca. Pastikan paket fluent-ffmpeg terpasang dan binary ffmpeg tersedia di server (command `ffmpeg`)."
    )
  }

  return await new Promise((resolve, reject) => {
    const vf = `scale=${outW}:${outH}:flags=lanczos`
    ffmpeg(inputPath)
      .outputOptions([
        "-vf", vf,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-profile:v", "high",
        "-preset", "veryfast",
        "-crf", "20",
        "-c:a", "aac",
        "-b:a", "160k",
        "-movflags", "+faststart"
      ])
      .on("progress", (p) => { try { onProg && onProg(p) } catch {} })
      .on("end", () => resolve(true))
      .on("error", (err) => reject(err))
      .save(outputPath)
  })
}

function helpText() {
  const lines = []
  lines.push("Mau naikin resolusi (tanpa bikin tampilan jadi kecil/letterbox).")
  lines.push("")
  lines.push("Pakai: .hdvid <angka/k> (reply videonya)")
  lines.push("Contoh: .hdvid 1080 | .hdvid 4k | .hdvid 8k | .hdvid 12000")
  lines.push("")
  lines.push("Pilihan umum:")
  lines.push(COMMON.map((n) => `• ${n}${n <= 4320 ? "p" : ""}`).join("\n"))
  lines.push("")
  lines.push(`Catatan: input angka dianggap \"short edge\" (landscape=tinggi, portrait=lebar).`)
  lines.push(`Batas teknis: maksimal ${MAX_DIM}px per sisi. Di atas itu gue tolak karena bakal nge-crash dan WhatsApp juga gak bakal ngangkat.`)
  return lines.join("\n")
}

export default async function on({ cht, Exp, store, ev, is }) {
  ev.on(
    {
      cmd: ["hdvideo", "hdvid"],
      listmenu: ["hdvid <144..> (reply video)"],
      tag: "tools",
      premium: true,
      energy: 150,
      args: "Contoh: .hdvid 1080 (reply videonya)",
      media: { type: ["video"], msg: "Reply/kirim videonya dulu." }
    },
    async ({ cht, media }) => {
      const arg = String(cht.q || "").trim().split(/\s+/)[0] || ""
      if (!arg) return cht.reply(helpText())

      const targetShort = parseTargetShort(arg)
      if (!targetShort) return cht.reply(helpText())

      if (targetShort > MAX_DIM) {
        return cht.reply(`Angka kamu kebesaran (${targetShort}). Batas maksimal per sisi: ${MAX_DIM}.`)
      }

      const quoted = getQuotedRaw(cht)
      const opts = quoted ? { quoted } : {}

      await cht.react("⏳").catch(() => {})
      const prog = await progressStart(cht, Exp, opts, `🎚️ Target short-edge: ${targetShort}px\nNyiapin dulu...`)

      let inPath = null
      let outPath = null
      let delIn = false

      try {
        const dir = path.join(tmpRoot(), "bell-hdvideo")
        ensureDir(dir)

        if (typeof media === "string") {
          inPath = resolveExistingFile(media)
          if (!inPath) throw new Error("File video gak ketemu di storage")
        } else if (Buffer.isBuffer(media)) {
          inPath = await bufferToTmp(media)
          delIn = true
        } else {
          throw new Error("Medianya gak kebaca, coba reply video beneran")
        }

        await progressEdit(cht, Exp, prog, "🎬 Ngecek meta video...")
        const meta = await ffprobeMeta(inPath)
        const dur = meta.dur || 0
        const srcW = meta.w || 0
        const srcH = meta.h || 0

        const { outW, outH } = calcTargetDims(srcW, srcH, targetShort)
        const label = `${outW}x${outH}`

        outPath = path.join(dir, `hd_${label}_${Date.now()}_${randHex(8)}.mp4`)

        await progressEdit(
          cht,
          Exp,
          prog,
          `🎚️ Source: ${srcW && srcH ? `${srcW}x${srcH}` : "?"}\n🎯 Output: ${label}\n⚙️ Mulai render...`
        )

        let lastPct = -1
        let lastText = ""
        const startAt = Date.now()

        await runFfmpegUpscale({
          inputPath: inPath,
          outputPath: outPath,
          outW,
          outH,
          onProg: async (p) => {
            const timemark = p?.timemark || ""
            const cur = parseTimemark(timemark)
            const pct1 = Number.isFinite(p?.percent) ? p.percent : 0
            const pct2 = dur > 0 ? (cur / dur) * 100 : 0
            const pct = Math.max(pct1 || 0, pct2 || 0)
            const pctN = Math.max(0, Math.min(100, Math.floor(pct)))
            if (pctN === lastPct) return
            lastPct = pctN
            const el = (Date.now() - startAt) / 1000
            const spd = el > 0 && cur > 0 ? (cur / el).toFixed(2) : ""
            const line =
              `⚙️ ${label} | ${bar(pctN)} ${pctN}%` +
              (dur > 0 ? ` | ${fmtTime(cur)}/${fmtTime(dur)}` : "") +
              (spd ? ` | ${spd}x` : "")
            if (line === lastText) return
            lastText = line
            await progressEdit(cht, Exp, prog, line)
          }
        })

        const mb = fileSizeMB(outPath)
        await progressEdit(cht, Exp, prog, `📦 ${label} kelar | ${mb.toFixed(2)} MB | ngirim...`)

        try {
          await Exp.sendMessage(
            cht.id,
            { video: { url: outPath }, mimetype: "video/mp4", caption: `✅ Done: ${label}` },
            opts
          )
        } catch {
          await Exp.sendMessage(
            cht.id,
            { document: { url: outPath }, fileName: `hdvideo_${label}.mp4`, mimetype: "video/mp4", caption: `✅ Done: ${label}` },
            opts
          )
        }

        await cht.react("✅").catch(() => {})
        await progressEdit(cht, Exp, prog, `✅ ${label} beres.`)
      } catch (e) {
        await cht.react("❌").catch(() => {})
        await progressEdit(cht, Exp, prog, "❌ Gagal.")
        return cht.reply("Error: " + (e?.message || String(e)))
      } finally {
        try { if (delIn && inPath && fs.existsSync(inPath)) fs.unlinkSync(inPath) } catch {}
        try {
          if (outPath && fs.existsSync(outPath)) {
            await sleep(1500)
            fs.unlinkSync(outPath)
          }
        } catch {}
      }
    }
  )
}
