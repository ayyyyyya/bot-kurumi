const axiosMod = "axios".import()

const axios = axiosMod?.default || axiosMod

const API_BASE = "https://api.nekolabs.web.id/img.gen/nano-banana?prompt="

const PROG_MIN = 1700
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
 const id = msg?.key?.id
 if (id) PROG_STATE.set(id, { t: Date.now(), last: text })
 return msg
 } catch {
 try {
 await cht.reply(text)
 } catch {}
 return null
 }
}

async function progressEdit(cht, Exp, msg, text) {
 if (!msg?.key?.id) return
 const id = msg.key.id
 const st = PROG_STATE.get(id) || { t: 0, last: "" }
 if (st.last === text) return
 const wait = PROG_MIN - (Date.now() - st.t)
 if (wait > 0) await sleep(wait)
 try {
 await Exp.sendMessage(cht.id, { text, edit: msg.key })
 PROG_STATE.set(id, { t: Date.now(), last: text })
 } catch {}
}

function pickMime(cht) {
 const q = cht?.quoted ? cht.quoted : cht
 return q?.mimetype || q?.mediaType || q?.msg?.mimetype || ""
}

function extFromMime(mime) {
 const m = String(mime || "")
 const x = (m.split("/")[1] || "jpg").split(";")[0].trim()
 if (!x) return "jpg"
 if (x === "jpeg") return "jpg"
 return x
}

function toPromptColor(input) {
 const t = clean(input).toLowerCase()
 if (!t) return ""
 const map = new Map([
 ["hitam", "black"],
 ["putih", "pale"],
 ["cerah", "lighter skin tone"],
 ["gelap", "darker skin tone"],
 ["coklat", "brown"],
 ["sawo", "tan"],
 ["sawo matang", "tan"],
 ["kuning", "yellow"],
 ["merah", "red"],
 ["biru", "blue"],
 ["hijau", "green"],
 ["ungu", "purple"],
 ["pink", "pink"],
 ["abu", "gray"],
 ["abu-abu", "gray"],
 ["oranye", "orange"],
 ["jingga", "orange"]
 ])
 if (map.has(t)) return map.get(t)
 return input
}

function buildSkinPrompt(color) {
 const c = clean(color)
 return (
 `Change ONLY the person's skin color to ${c}. ` +
 `Keep face identity, hairstyle, clothes, background, pose, and lighting the same. ` +
 `Make it realistic, natural skin texture, no artifacts, no over-smoothing.`
 )
}

function buildMultipart({ fieldName, fileBuf, filename, mime }) {
 const boundary = "----bell_" + Math.random().toString(16).slice(2) + Date.now().toString(16)
 const head = Buffer.from(
 `--${boundary}\r\n` +
 `Content-Disposition: form-data; name="${fieldName}"; filename="${filename}"\r\n` +
 `Content-Type: ${mime}\r\n\r\n`,
 "utf-8"
 )
 const tail = Buffer.from(`\r\n--${boundary}--\r\n`, "utf-8")
 const body = Buffer.concat([head, fileBuf, tail])
 return { boundary, body }
}

function pickUrlFromJson(x) {
 const d = x && typeof x === "object" ? x : null
 if (!d) return ""
 const cands = [
 d.url,
 d.image,
 d.imageUrl,
 d.result,
 d.output,
 d.data?.url,
 d.data?.image,
 d.data?.imageUrl,
 d.data?.result,
 d.result?.url,
 d.result?.image,
 d.result?.imageUrl,
 d.result?.output,
 Array.isArray(d.result) ? d.result[0] : "",
 Array.isArray(d.data) ? d.data[0] : ""
 ]
 for (const v of cands) {
 const s = clean(v)
 if (s && /^https?:\/\//i.test(s)) return s
 }
 return ""
}

async function callNanoBanana(prompt, buf, filename, mime) {
 const url = API_BASE + encodeURIComponent(prompt)

 const tryOnce = async (fieldName) => {
 const mp = buildMultipart({ fieldName, fileBuf: buf, filename, mime })
 const r = await axios.post(url, mp.body, {
 timeout: 180000,
 maxBodyLength: Infinity,
 responseType: "arraybuffer",
 validateStatus: () => true,
 headers: {
 "content-type": `multipart/form-data; boundary=${mp.boundary}`,
 accept: "application/json,image/*,*/*",
 "user-agent": "Mozilla/5.0",
 origin: "https://api.nekolabs.web.id",
 referer: "https://api.nekolabs.web.id/"
 }
 })
 return r
 }

 let r = await tryOnce("image")
 if (r.status >= 400 && r.status !== 413) {
 const s = Buffer.from(r.data || []).toString("utf-8")
 if (s && /file|image|upload|multipart|form/i.test(s)) r = await tryOnce("file")
 }

 const ct = clean(r?.headers?.["content-type"] || "")
 const raw = Buffer.from(r.data || [])

 if (r.status < 200 || r.status >= 300) {
 const t = raw.toString("utf-8").slice(0, 500)
 throw new Error(`HTTP ${r.status}${t ? ` | ${t}` : ""}`)
 }

 if (/^image\//i.test(ct)) {
 if (!raw.length) throw new Error("Hasil gambar kosong")
 return { kind: "buffer", buffer: raw, mime: ct.split(";")[0] || "image/png" }
 }

 const text = raw.toString("utf-8")
 let json = null
 try {
 json = JSON.parse(text)
 } catch {}

 const directUrl = pickUrlFromJson(json) || (clean(text).startsWith("http") ? clean(text) : "")
 if (directUrl) return { kind: "url", url: directUrl }

 throw new Error("Respon API nggak kebaca / nggak ada hasil gambarnya")
}

export default async function on({ cht, Exp, store, ev, is }) {
 ev.on(
 {
 cmd: ["warnakulit2"],
 listmenu: ["warnakulit2 <warna> (reply foto)"],
 tag: "ai",
 premium: true,
 energy: 70,
 limit: true,
 args: "Contoh: .warnakulit2 hitam | .warnakulit2 sawo matang | .warnakulit2 #ffccaa",
 media: { type: ["image"], msg: "Reply/kirim fotonya dulu, baru ketik: .warnakulit2 <warna>" }
 },
 async ({ cht, media }) => {
 const rawColor = clean(cht.q) || clean(cht.quoted?.text) || clean(cht.quoted?.caption)
 if (!rawColor) {
 return cht.reply(
 "Pake gini:\n" +
 ".warnakulit2 hitam\n" +
 ".warnakulit2 putih\n" +
 ".warnakulit2 sawo matang\n" +
 ".warnakulit2 biru\n" +
 '.warnakulit2 "pink pastel"\n' +
 ".warnakulit2 #ffccaa\n\n" +
 "Catatan: ini khusus ganti warna kulit doang, yang lain gue usahain tetep sama."
 )
 }

 const mime = pickMime(cht) || "image/jpeg"
 const ext = extFromMime(mime)
 const filename = `image.${ext}`

 const quoted = getQuotedRaw(cht)
 const opts = quoted ? { quoted } : {}

 const colorForPrompt = toPromptColor(rawColor)
 const prompt = buildSkinPrompt(colorForPrompt)

 await cht.react("⏳").catch(() => {})
 const prog = await progressStart(
 cht,
 Exp,
 opts,
 `🎨 Oke, gue ubah warna kulit jadi *${clean(rawColor)}*...\nTahan bentar ya.`
 )

 try {
 await progressEdit(cht, Exp, prog, "🧩 Lagi nyiapin gambar & request...")
 if (!Buffer.isBuffer(media) || !media.length) throw new Error("Gambarnya nggak kebaca. Coba kirim ulang.")

 await progressEdit(cht, Exp, prog, `🧪 Lagi proses edit warna kulit: *${clean(rawColor)}*...`)
 const out = await callNanoBanana(prompt, media, filename, mime)

 await progressEdit(cht, Exp, prog, "📤 Oke dapet hasilnya, gue kirim...")

 const caption = `✅ Jadi.\nWarna kulit: *${clean(rawColor)}*`

 if (out.kind === "url") {
 await Exp.sendMessage(cht.id, { image: { url: out.url }, caption }, opts)
 } else {
 await Exp.sendMessage(cht.id, { image: out.buffer, mimetype: out.mime, caption }, opts)
 }

 await cht.react("✅").catch(() => {})
 await progressEdit(cht, Exp, prog, "✅ Beres.")
 } catch (e) {
 await cht.react("❌").catch(() => {})
 await progressEdit(cht, Exp, prog, "❌ Gagal, coba lagi.")
 return cht.reply("Error: " + (e?.message || String(e)))
 }
 }
 )
}
