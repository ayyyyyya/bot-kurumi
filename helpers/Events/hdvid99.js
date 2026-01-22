/* ✦ CAP HYTAM LEGAM DAKIAN KEK ARANG ✦

 Berbagi fitur SC Bella

 NAMA FITUR : AI VIDEO ENHANCER (UNBLURIMAGE.AI)
 SOURCE : https://api.unblurimage.ai

 CREATOR : AlbertLazovsky
 CONTACT : 083846359386
 LINK GC : https://chat.whatsapp.com/GGjR1bhh12vBsXtkkcgPAo
 LINK CH : https://whatsapp.com/channel/0029Vb71Xk7EFeXeX06Gpf1
*/

export default async function on({ Exp, ev, store, cht, ai, is }) {
 const axiosMod = await "axios".import()
 const axios = axiosMod?.default || axiosMod

 const fdMod = await "form-data".import()
 const FormData = fdMod?.default || fdMod

 const fsMod = await "fs".import()
 const fs = fsMod?.default || fsMod

 const pathMod = await "path".import()
 const path = pathMod?.default || pathMod

 const osMod = await "os".import()
 const os = osMod?.default || osMod

 const cryptoMod = await "crypto".import()
 const crypto = cryptoMod?.default || cryptoMod

 const UA =
 "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36"
 const API = "https://api.unblurimage.ai/api/upscaler"

 const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

 const productserial = () => {
 const raw = [UA, process.platform, process.arch, Date.now(), Math.random()].join("|")
 return crypto.createHash("md5").update(raw).digest("hex")
 }

 const product = productserial()

 const ensureDir = (p) => {
 try {
 if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true })
 return true
 } catch {
 return false
 }
 }

 const pickName = (jid) => {
 const c = store?.contacts?.[jid]
 const n = c?.name || c?.notify || c?.verifiedName || ""
 if (n && String(n).trim()) return String(n).trim()
 return String(jid || "").split("@")[0] || "Unknown"
 }

 const fmtBytes = (b) => {
 b = Number(b) || 0
 const u = ["B", "KB", "MB", "GB"]
 const i = b > 0 ? Math.min(u.length - 1, Math.floor(Math.log(b) / Math.log(1024))) : 0
 const v = b / Math.pow(1024, i)
 return `${v.toFixed(v >= 10 ? 1 : 2)} ${u[i]}`
 }

 const parseRes = (args) => {
 const a = (Array.isArray(args) ? args : []).map((v) => String(v || "").toLowerCase())
 if (a.includes("8k")) return "8k"
 if (a.includes("4k")) return "4k"
 if (a.includes("2k")) return "2k"
 if (a.includes("1080") || a.includes("1080p") || a.includes("fhd")) return "1080p"
 if (a.includes("720") || a.includes("720p") || a.includes("hd")) return "720p"
 return "4k"
 }

 const uploadvid = async (filePath) => {
 if (!fs.existsSync(filePath)) throw new Error("file not found")
 const form = new FormData()
 form.append("video_file_name", path.basename(filePath))
 const res = await axios.post(`${API}/v1/ai-video-enhancer/upload-video`, form, {
 headers: {
 ...form.getHeaders(),
 "user-agent": UA,
 origin: "https://unblurimage.ai",
 referer: "https://unblurimage.ai/"
 },
 timeout: 20000,
 maxBodyLength: Infinity,
 maxContentLength: Infinity
 })
 return res?.data?.result
 }

 const putoOss = async (uploadUrl, filePath) => {
 const stream = fs.createReadStream(filePath)
 await axios.put(uploadUrl, stream, {
 headers: { "content-type": "video/mp4" },
 timeout: 600000,
 maxBodyLength: Infinity,
 maxContentLength: Infinity
 })
 }

 const createJob = async (originalVideoUrl, resolution = "4k", preview = false) => {
 const form = new FormData()
 form.append("original_video_file", originalVideoUrl)
 form.append("resolution", resolution)
 form.append("is_preview", preview ? "true" : "false")

 const res = await axios.post(`${API}/v2/ai-video-enhancer/create-job`, form, {
 headers: {
 ...form.getHeaders(),
 "user-agent": UA,
 origin: "https://unblurimage.ai",
 referer: "https://unblurimage.ai/",
 "product-serial": product
 },
 timeout: 20000,
 maxBodyLength: Infinity,
 maxContentLength: Infinity
 })

 if (res?.data?.code !== 100000) throw new Error(JSON.stringify(res?.data || {}))
 return res.data.result.job_id
 }

 const getjob = async (jobId) => {
 const res = await axios.get(`${API}/v2/ai-video-enhancer/get-job/${jobId}`, {
 headers: {
 "user-agent": UA,
 origin: "https://unblurimage.ai",
 referer: "https://unblurimage.ai/",
 "product-serial": product
 },
 timeout: 20000
 })
 return res?.data
 }

 const pollJob = async (jobId, interval = 5000, maxMs = 12 * 60 * 1000) => {
 const start = Date.now()
 while (true) {
 if (Date.now() - start > maxMs) throw new Error("timeout: job terlalu lama, coba lagi nanti")
 const res = await getjob(jobId)

 if (res?.code === 100000 && res?.result?.output_url) return res.result
 if (res?.code !== 300010) throw new Error(JSON.stringify(res || {}))

 await sleep(interval)
 }
 }

 const downloadInput = async (cht) => {
 try {
 if (cht?.quoted?.download) return await cht.quoted.download()
 } catch {}
 try {
 if (cht?.download) return await cht.download()
 } catch {}
 return null
 }

 const resolveInputPath = async (cht) => {
 const tempBase = path.join(process.cwd(), "toolkit", "tmp")
 if (!ensureDir(tempBase)) {
 const alt = path.join(os.tmpdir(), "bella_tmp")
 ensureDir(alt)
 return { base: alt }
 }
 return { base: tempBase }
 }

 const safeEdit = async (msg, text, cht) => {
 if (!msg) return null
 const key = msg?.key || msg
 try {
 if (typeof cht?.edit === "function") return await cht.edit(text, key)
 } catch {}
 try {
 return await Exp.sendMessage(cht.id, { text, edit: key }, { quoted: cht })
 } catch {
 return null
 }
 }

 const safeReply = async (text, cht) => {
 try {
 return await cht.reply(text)
 } catch {
 try {
 return await Exp.sendMessage(cht.id, { text }, { quoted: cht })
 } catch {
 return null
 }
 }
 }

 ev.on(
 {
 cmd: ["hdvid4"],
 listmenu: ["hdvid4"],
 tag: "tools",
 premium: true,
 args: 0
 },
 async ({ cht, args }) => {
 const reso = parseRes(args)
 const q = (Array.isArray(args) ? args : []).join(" ").trim()

 const isUrl = (s) => /^https?:\/\/\S+/i.test(String(s || "").trim())
 const urlArg = Array.isArray(args) ? args.find((v) => isUrl(v)) : null

 if (!urlArg && !cht?.quoted && !cht?.type) {
 return safeReply(
 `Kirim/reply video.\nContoh:\n${cht.prefix || "."}unblurvid 4k (reply video)\n${cht.prefix || "."}unblurvid 2k https://...`,
 cht
 )
 }

 await cht.react("⏳").catch(() => {})

 const progress = await safeReply(
 [
 "╭─〔 AI VIDEO ENHANCER 〕",
 `│ Target : ${fmtBytes(0)}`,
 `│ Resolusi : ${reso.toUpperCase()}`,
 "│ Status : menyiapkan file...",
 "╰────────────"
 ].join("\n"),
 cht
 )

 let inputPath = null
 let cleanupInput = false

 try {
 const { base } = await resolveInputPath(cht)
 const stamp = Date.now()
 inputPath = path.join(base, `unblur_${stamp}.mp4`)

 if (urlArg) {
 await safeEdit(
 progress,
 [
 "╭─〔 AI VIDEO ENHANCER 〕",
 `│ Resolusi : ${reso.toUpperCase()}`,
 "│ Status : mengunduh video dari URL...",
 "╰────────────"
 ].join("\n"),
 cht
 )

 const dl = await axios.get(String(urlArg), {
 responseType: "arraybuffer",
 timeout: 120000,
 maxBodyLength: Infinity,
 maxContentLength: Infinity,
 headers: { "user-agent": UA }
 })

 fs.writeFileSync(inputPath, Buffer.from(dl.data))
 cleanupInput = true
 } else {
 await safeEdit(
 progress,
 [
 "╭─〔 AI VIDEO ENHANCER 〕",
 `│ Resolusi : ${reso.toUpperCase()}`,
 "│ Status : mengunduh video dari chat...",
 "╰────────────"
 ].join("\n"),
 cht
 )

 const dl = await downloadInput(cht)
 if (!dl) throw new Error("gagal mengambil video dari chat")

 if (Buffer.isBuffer(dl)) {
 fs.writeFileSync(inputPath, dl)
 cleanupInput = true
 } else if (typeof dl === "string" && fs.existsSync(dl)) {
 inputPath = dl
 cleanupInput = false
 } else if (dl?.data && Buffer.isBuffer(dl.data)) {
 fs.writeFileSync(inputPath, dl.data)
 cleanupInput = true
 } else {
 throw new Error("format video tidak didukung")
 }
 }

 const stat = fs.existsSync(inputPath) ? fs.statSync(inputPath) : null
 const size = stat?.size || 0

 await safeEdit(
 progress,
 [
 "╭─〔 AI VIDEO ENHANCER 〕",
 `│ Resolusi : ${reso.toUpperCase()}`,
 `│ Ukuran : ${fmtBytes(size)}`,
 "│ Status : upload metadata...",
 "╰────────────"
 ].join("\n"),
 cht
 )

 const upload = await uploadvid(inputPath)
 if (!upload?.url || !upload?.object_name) throw new Error("upload init gagal")

 await safeEdit(
 progress,
 [
 "╭─〔 AI VIDEO ENHANCER 〕",
 `│ Resolusi : ${reso.toUpperCase()}`,
 `│ Ukuran : ${fmtBytes(size)}`,
 "│ Status : upload video ke storage...",
 "╰────────────"
 ].join("\n"),
 cht
 )

 await putoOss(upload.url, inputPath)

 const cdnUrl = "https://cdn.unblurimage.ai/" + upload.object_name

 await safeEdit(
 progress,
 [
 "╭─〔 AI VIDEO ENHANCER 〕",
 `│ Resolusi : ${reso.toUpperCase()}`,
 "│ Status : membuat job enhancer...",
 "╰────────────"
 ].join("\n"),
 cht
 )

 const jobId = await createJob(cdnUrl, reso, false)

 await safeEdit(
 progress,
 [
 "╭─〔 AI VIDEO ENHANCER 〕",
 `│ Resolusi : ${reso.toUpperCase()}`,
 `│ Job ID : ${jobId}`,
 "│ Status : memproses (polling)...",
 "╰────────────"
 ].join("\n"),
 cht
 )

 const result = await pollJob(jobId, 5000, 12 * 60 * 1000)
 const outUrl = result?.output_url
 if (!outUrl) throw new Error("output url kosong")

 await safeEdit(
 progress,
 [
 "╭─〔 AI VIDEO ENHANCER 〕",
 `│ Resolusi : ${reso.toUpperCase()}`,
 `│ Job ID : ${jobId}`,
 "│ Status : mengirim hasil...",
 "╰────────────"
 ].join("\n"),
 cht
 )

 const caption = [
 "╭─〔 AI VIDEO ENHANCER 〕",
 `│ Target : ${pickName(cht.sender)}`,
 `│ Resolusi : ${reso.toUpperCase()}`,
 `│ Job ID : ${jobId}`,
 "╰────────────",
 "",
 "Hasil sudah selesai."
 ].join("\n")

 const sent = await Exp.sendMessage(cht.id, { video: { url: outUrl }, caption }, { quoted: cht }).catch(() => null)

 if (!sent) {
 const outBuf = await axios.get(outUrl, {
 responseType: "arraybuffer",
 timeout: 240000,
 maxBodyLength: Infinity,
 maxContentLength: Infinity,
 headers: { "user-agent": UA }
 })
 const buf = Buffer.from(outBuf.data)
 await Exp.sendMessage(cht.id, { video: buf, caption }, { quoted: cht }).catch(() => cht.reply(caption))
 }

 await safeEdit(
 progress,
 [
 "╭─〔 AI VIDEO ENHANCER 〕",
 `│ Resolusi : ${reso.toUpperCase()}`,
 "│ Status : selesai ✅",
 "╰────────────"
 ].join("\n"),
 cht
 )

 await cht.react("✅").catch(() => {})
 } catch (e) {
 await cht.react("❌").catch(() => {})
 await safeEdit(
 progress,
 [
 "╭─〔 AI VIDEO ENHANCER 〕",
 "│ Status : gagal",
 "╰────────────",
 "",
 String(e?.message || e)
 ].join("\n"),
 cht
 )
 } finally {
 try {
 if (cleanupInput && inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath)
 } catch {}
 }
 }
 )
}
