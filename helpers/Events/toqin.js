const axiosMod = "axios".import()
const axios = axiosMod?.default || axiosMod

const API_URL = "https://ai-studio.anisaofc.my.id/api/edit-image"

const DEFAULT_PROMPT = `
Buat saya memakai kostum Qin Shi Huang dari anime Record of Ragnarok, termasuk desain penutup mata dan pakaian yang dikenakan Qin Shi Huang di dalam anime Record of Ragnarok. Buatkan pose khasnya.

Characterized by stark cinematic lighting and intense contrast. Captured with a slightly low, upward-facing angle that dramatizes the subject's jawline and neck, the composition evokes quiet dominance and sculptural elegance. The background is a deep, saturated crimson red, creating a bold visual clash with the model's luminous skin and dark wardrobe.

Lighting is tightly directional, casting warm golden highlights on one side of the face while plunging the other into velvety shadow, emphasizing bone structure with almost architectural precision.

The subject's expression is unreadable, cool-toned eyes half-lidded, lips relaxed—suggesting detachment or quiet defiance. The model wears a highly detailed and realistic costume inspired by the anime, preserving anime-like colors and textures.

Minimal retouching preserves skin texture and slight imperfections, adding realism. Editorial tension is created through close cropping, tonal control, and the almost oppressive intimacy of the camera's proximity.

Make the face and hairstyle as similar as possible to the one in the photo. Pertahankan gaya rambut dan warna yang sama. Buat kostumnya sangat detail dan realistis. Gunakan warna dan tekstur yang mirip anime.
`.trim()

const PROG_MIN = 1400
const PROG_STATE = new Map()
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

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

async function postEditImage(base64, prompt) {
 if (!axios) throw new Error("axios gak kebaca")

 const r = await axios.post(
 API_URL,
 { image: base64, prompt },
 {
 timeout: 120000,
 maxBodyLength: Infinity,
 headers: {
 "User-Agent": "Mozilla/5.0",
 Accept: "*/*",
 "Content-Type": "application/json",
 Origin: "https://ai-studio.anisaofc.my.id",
 Referer: "https://ai-studio.anisaofc.my.id/"
 },
 validateStatus: () => true
 }
 )

 if (r.status !== 200) {
 const msg = clean(r?.data?.message || r?.data?.error || r?.statusText || "")
 throw new Error(`Server error (HTTP ${r.status})${msg ? `: ${msg}` : ""}`)
 }

 const data = r.data
 const imageUrl =
 data?.imageUrl ||
 data?.result?.imageUrl ||
 data?.result?.url ||
 data?.url ||
 ""

 if (!imageUrl) {
 const raw = typeof data === "string" ? data : JSON.stringify(data || {})
 throw new Error("Gagal: server gak ngasih imageUrl.\n" + clean(raw).slice(0, 240))
 }

 return imageUrl
}

export default async function on({ cht, Exp, store, ev, is }) {
 ev.on(
 {
 cmd: ["toqin"],
 listmenu: ["toqin (reply gambar)"],
 tag: "ai",
 premium: true,
 energy: 35,
 args: "Reply/kirim gambar dulu",
 media: { type: ["image"], msg: "Reply gambar yang mau diedit dulu." }
 },
 async ({ cht, media }) => {
 const quoted = getQuotedRaw(cht)
 const opts = quoted ? { quoted } : {}

 await cht.react("⏳").catch(() => {})

 const prog = await progressStart(
 cht,
 Exp,
 opts,
 "🎭 Oke, gue siapin style Qin Shi Huang dulu..."
 )

 try {
 const buf = media
 if (!Buffer.isBuffer(buf) || !buf.length) throw new Error("Gambarnya kebaca kosong. Coba kirim/reply ulang.")

 await progressEdit(cht, Exp, prog, "🧠 Lagi proses AI... (ini yang agak lama)")
 const base64 = Buffer.from(buf).toString("base64")
 const outUrl = await postEditImage(base64, DEFAULT_PROMPT)

 await progressEdit(cht, Exp, prog, "📤 Otw gue kirim hasilnya...")
 await Exp.sendMessage(cht.id, { image: { url: outUrl } }, opts)

 await cht.react("✅").catch(() => {})
 await progressEdit(cht, Exp, prog, "✅ Done. Nih hasilnya.")
 } catch (e) {
 await cht.react("❌").catch(() => {})
 await progressEdit(cht, Exp, prog, "❌ Gagal, coba lagi bentar.")
 return cht.reply("Error: " + (e?.message || String(e)))
 }
 }
 )
}
