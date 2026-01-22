const axiosMod = "axios".import()

const axios = axiosMod?.default || axiosMod

const BASE_URL = "https://image-editor.org"
const API_BASE = BASE_URL + "/api"
const CF_ENDPOINT = "https://api.nekolabs.web.id/tools/bypass/cf-turnstile"

const PROG_MIN = 1200
const PROG_STATE = new Map()
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function randId(len = 16) {
 let out = ""
 for (let i = 0; i < len; i++) {
 out += Math.floor(Math.random() * 16).toString(16)
 }
 return out
}

function fakeUUID() {
 const base = (Date.now().toString(16) + randId(16)).slice(0, 32)
 const parts = [
 base.slice(0, 8),
 base.slice(8, 12),
 base.slice(12, 16),
 base.slice(16, 20),
 base.slice(20, 32)
 ]
 return parts.join("-")
}

function simpleHash(buf) {
 let h = 0
 for (let i = 0; i < buf.length; i++) {
 h = (h * 31 + buf[i]) >>> 0
 }
 return h.toString(16).padStart(8, "0")
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
 try {
 await cht.reply(text)
 } catch {}
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

// ------------------- CORE SCRAPER -------------------

async function getTurnstileToken() {
 const r = await axios.post(
 CF_ENDPOINT,
 {
 url: "https://image-editor.org/editor",
 siteKey: "0x4AAAAAAB8ClzQTJhVDd_pU"
 },
 {
 timeout: 25000,
 validateStatus: () => true,
 headers: {
 "user-agent": "Mozilla/5.0",
 accept: "application/json,*/*"
 }
 }
 )

 if (r.status !== 200) throw new Error("Gagal ambil token turnstile (HTTP " + r.status + ")")
 const token = r?.data?.result
 if (!token) throw new Error("Token turnstile kosong")
 return token
}

async function uploadImage(inst, buf) {
 const upRes = await inst.post("/upload/presigned", {
 filename: `${Date.now()}_alya.jpg`,
 contentType: "image/jpeg"
 })

 const up = upRes?.data
 const upData = up?.data
 if (!upData?.uploadUrl || !upData?.fileUrl || !upData?.uploadId) {
 throw new Error("Upload info dari server nggak lengkap")
 }

 const putRes = await axios.put(upData.uploadUrl, buf, {
 timeout: 60000,
 maxBodyLength: Infinity,
 headers: {
 "content-type": "image/jpeg",
 "user-agent": "Mozilla/5.0"
 },
 validateStatus: () => true
 })

 if (putRes.status < 200 || putRes.status >= 300) {
 throw new Error("Upload gambar gagal (HTTP " + putRes.status + ")")
 }

 return upData
}

async function createEditTask(inst, { prompt, fileUrl, uploadId, buf, turnstileToken }) {
 const userUUID = fakeUUID()
 const imageHash = simpleHash(buf)

 const { data } = await inst.post("/edit", {
 prompt,
 image_urls: [fileUrl],
 image_size: "auto",
 turnstileToken,
 uploadIds: [uploadId],
 userUUID,
 imageHash
 })

 const taskId = data?.data?.taskId
 if (!taskId) throw new Error("Task ID nggak ketemu dari server")
 return taskId
}

async function waitForResult(inst, taskId) {
 const maxLoop = 90
 for (let i = 0; i < maxLoop; i++) {
 const { data } = await inst.get(`/task/${taskId}`, {
 timeout: 25000,
 validateStatus: () => true
 })

 const st = data?.data?.status
 if (st === "completed") {
 return data?.data?.result
 }
 if (st === "failed" || st === "error") {
 throw new Error("Task gagal di server")
 }
 await sleep(1000)
 }
 throw new Error("Timeout nunggu hasil edit (kelamaan)")
}

async function nanobanana(prompt, imageBuf) {
 if (!prompt) throw new Error("Prompt kosong")
 if (!Buffer.isBuffer(imageBuf)) throw new Error("Image bukan buffer")

 const inst = axios.create({
 baseURL: API_BASE,
 timeout: 45000,
 validateStatus: () => true,
 headers: {
 origin: BASE_URL,
 referer: BASE_URL + "/editor",
 "user-agent":
 "Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36",
 accept: "application/json,*/*"
 }
 })

 const upData = await uploadImage(inst, imageBuf)
 const token = await getTurnstileToken()
 const taskId = await createEditTask(inst, {
 prompt,
 fileUrl: upData.fileUrl,
 uploadId: upData.uploadId,
 buf: imageBuf,
 turnstileToken: token
 })

 const result = await waitForResult(inst, taskId)
 return result
}

// ------------------- PROMPT GENERATOR -------------------

function mapIndoToEnglishColor(raw) {
 const t = String(raw || "").toLowerCase().trim()
 if (!t) return ""
 const map = [
 ["hitam", "black"],
 ["putih", "white"],
 ["biru", "blue"],
 ["merah", "red"],
 ["kuning", "yellow"],
 ["hijau", "green"],
 ["ungu", "purple"],
 ["coklat", "brown"],
 ["abu", "gray"],
 ["abu-abu", "gray"],
 ["jingga", "orange"],
 ["oren", "orange"],
 ["emas", "gold"],
 ["emas", "gold"],
 ["perak", "silver"],
 ["sawo matang", "tan brown"],
 ["gelap", "dark"],
 ["terang", "light"],
 ["muda", "light"],
 ["tua", "dark"]
 ]

 for (const [id, en] of map) {
 if (t.includes(id)) return `${en}`
 }
 return t
}

function buildSkinPrompt(cmd, userColorRaw) {
 if (cmd === "hitamkan3") {
 return "change skin color to dark brown / black, natural realistic, keep hair, eyes, clothes, and background same, do not change facial features"
 }
 if (cmd === "putihkan3") {
 return "change skin color to light / fair tone, natural realistic, keep hair, eyes, clothes, and background same, do not change facial features"
 }
 if (cmd === "birukan3") {
 return "change skin color to blue fantasy tone, keep lighting and shading natural, keep hair, eyes, clothes, and background same, do not distort the face"
 }

 const colorIndo = (userColorRaw || "").trim()
 const colorEn = mapIndoToEnglishColor(colorIndo)
 const desc = colorEn || "different tone"

 return (
 `change skin color to ${desc}, keep everything else identical, ` +
 `do not change face structure, hair, clothes, or background, natural realistic skin shading`
 )
}

function colorLabel(cmd, userColorRaw) {
 if (cmd === "hitamkan3") return "kulit gelap"
 if (cmd === "putihkan3") return "kulit lebih cerah"
 if (cmd === "birukan3") return "kulit biru"
 const t = (userColorRaw || "").trim()
 return t ? `kulit warna ${t}` : "ubah warna kulit"
}

function extractResultUrl(res) {
 if (!res) return ""
 if (typeof res === "string") return res
 if (Array.isArray(res)) {
 const first = res[0]
 if (!first) return ""
 if (typeof first === "string") return first
 return first.url || first.image_url || first.image || ""
 }
 return res.url || res.image_url || res.image || ""
}

// ------------------- EVENT PLUGIN -------------------

export default async function on({ cht, Exp, store, ev, is }) {
 ev.on(
 {
 cmd: ["hitamkan3", "putihkan3", "birukan3", "warnakulit", "warnakulit3", "skincolor", "skincolor3"],
 listmenu: [
 "hitamkan3 (reply foto)",
 "putihkan3 (reply foto)",
 "birukan3 (reply foto)",
 "warnakulit <warna/deskripsi> (reply foto)"
 ],
 tag: "image",
 premium: true,
 energy: 70,
 limit: true,
 args: "Reply/kirim foto orang yang mau diedit. Untuk warnakulit, tulis warna yang diinginkan.",
 media: { type: ["image"], msg: "Kirim / reply foto dulu." }
 },
 async ({ cht, media }) => {
 const cmd = (cht.cmd || "").toLowerCase()

 const text =
 (cht.q || "").trim() ||
 (cht.quoted?.text || "").trim() ||
 (cht.quoted?.caption || "").trim()

 if (!["hitamkan3", "putihkan3", "birukan3"].includes(cmd)) {
 if (!text) {
 return cht.reply(
 "Untuk ganti warna bebas, pake gini:\n" +
 "• .warnakulit ungu pastel (reply foto)\n" +
 "• .warnakulit sawo matang\n" +
 "• .skincolor hijau neon"
 )
 }
 }

 const colorText = ["hitamkan3", "putihkan3", "birukan3"].includes(cmd) ? "" : text

 const quoted = getQuotedRaw(cht)
 const opts = quoted ? { quoted } : {}

 await cht.react("⏳").catch(() => {})

 const lbl = colorLabel(cmd, colorText)

 const warn =
 `🎨 Mode: ${lbl}\n` +
 `Note: hasil tergantung foto & server, proses bisa agak lama dikit...\n` +
 `Lagi upload fotonya dulu...`

 const prog = await progressStart(cht, Exp, opts, warn)

 try {
 if (!Buffer.isBuffer(media)) throw new Error("Media nggak kebaca (bukan buffer). Coba kirim ulang fotonya.")

 await progressEdit(cht, Exp, prog, `📤 Upload foto ke server...`)
 const prompt = buildSkinPrompt(cmd, colorText)

 await progressEdit(cht, Exp, prog, `🧠 Lagi ngedit warna kulit (${lbl})...`)
 const result = await nanobanana(prompt, media)

 const url = extractResultUrl(result)
 if (!url) throw new Error("Server nggak ngasih link hasil edit")

 await progressEdit(cht, Exp, prog, `📥 Ambil hasil jadi...`)

 await Exp.sendMessage(
 cht.id,
 {
 image: { url },
 caption:
 `✅ Udah jadi versi ${lbl}.\n` +
 `Kalau kurang pas, coba ulang pakai deskripsi warna yang lebih jelas (mis: "ungu pastel", "coklat sawo matang", dll).`
 },
 opts
 )

 await cht.react("✅").catch(() => {})
 await progressEdit(cht, Exp, prog, `✅ Beres. Mau eksperimen warna lain, tinggal panggil lagi.`)
 } catch (e) {
 await cht.react("❌").catch(() => {})
 await progressEdit(cht, Exp, prog, `❌ Gagal ngedit warna kulit.`)
 return cht.reply("Error: " + (e?.message || String(e)))
 }
 }
 )
}
