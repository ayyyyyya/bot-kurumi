/* ✦ CAP HYTAM LEGAM DAKIAN KEK ARANG ✦

 Berbagi fitur SC Bella

 NAMA FITUR : HD4 (IMGUPSCALER)
 SOURCE : https://imgupscaler.com

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

 const ImgUpscaler = {
 config: {
 uploadUrl: "https://get1.imglarger.com/api/UpscalerNew/UploadNew",
 statusUrl: "https://get1.imglarger.com/api/UpscalerNew/CheckStatusNew",
 agent:
 "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36"
 },
 process: async (buffer, scale = 4) => {
 if (!buffer) return { status: 400, success: false, message: "Image buffer is required." }

 const form = new FormData()
 form.append("myfile", buffer, { filename: "upload.png", contentType: "image/png" })
 form.append("scaleRadio", String(scale))

 const { data: uploadRes } = await axios.post(ImgUpscaler.config.uploadUrl, form, {
 headers: {
 ...form.getHeaders(),
 Origin: "https://imgupscaler.com",
 Referer: "https://imgupscaler.com/",
 "User-Agent": ImgUpscaler.config.agent
 },
 timeout: 30000,
 maxBodyLength: Infinity,
 maxContentLength: Infinity
 })

 if (uploadRes?.code !== 200 || !uploadRes?.data?.code) {
 throw new Error("Failed to upload image to upscaler server.")
 }

 const jobCode = uploadRes.data.code

 for (let i = 0; i < 30; i++) {
 const { data: statusRes } = await axios.post(
 ImgUpscaler.config.statusUrl,
 { code: jobCode, scaleRadio: scale },
 {
 headers: {
 "Content-Type": "application/json",
 Origin: "https://imgupscaler.com",
 Referer: "https://imgupscaler.com/",
 "User-Agent": ImgUpscaler.config.agent
 },
 timeout: 25000
 }
 )

 if (statusRes?.code === 200 && statusRes?.data?.status === "success") {
 const url = statusRes?.data?.downloadUrls?.[0]
 if (!url) throw new Error("Result URL kosong.")
 return {
 status: 200,
 success: true,
 payload: { job_code: jobCode, scale, result_url: url }
 }
 }

 await new Promise((r) => setTimeout(r, 5000))
 }

 throw new Error("Upscaling process timeout.")
 }
 }

 const getImageBuffer = async (cht) => {
 try {
 if (cht?.quoted?.download) {
 const q = await cht.quoted.download().catch(() => null)
 if (Buffer.isBuffer(q)) return q
 if (q?.data && Buffer.isBuffer(q.data)) return q.data
 }
 } catch {}
 try {
 if (cht?.download) {
 const m = await cht.download().catch(() => null)
 if (Buffer.isBuffer(m)) return m
 if (m?.data && Buffer.isBuffer(m.data)) return m.data
 }
 } catch {}
 return null
 }

 ev.on(
 {
 cmd: ["hd4"],
 listmenu: ["hd4"],
 tag: "tools",
 energy: 55,
 args: 0
 },
 async ({ cht }) => {
 const buf = await getImageBuffer(cht)
 if (!buf) return cht.reply(`Kirim/reply gambar dengan caption: ${cht?.prefix || "."}hd4`)

 await cht.react("⏳").catch(() => {})

 try {
 const res = await ImgUpscaler.process(buf, 4)
 if (!res?.success) throw new Error(String(res?.message || "Upscale gagal."))

 const url = res.payload.result_url
 const job = res.payload.job_code

 let out = null
 try {
 const r = await axios.get(url, {
 responseType: "arraybuffer",
 timeout: 60000,
 maxBodyLength: Infinity,
 maxContentLength: Infinity,
 headers: { "User-Agent": ImgUpscaler.config.agent }
 })
 out = Buffer.from(r.data)
 } catch {
 out = null
 }

 const caption = ["╭─〔 HD4 UPSCALE 〕", "│ Scale : 4x", `│ Job : ${job}`, "╰────────────"].join("\n")

 if (out && out.length) {
 const sent = await Exp.sendMessage(cht.id, { image: out, caption }, { quoted: cht }).catch(() => null)
 if (!sent) await cht.reply(caption + "\n\n" + url).catch(() => null)
 } else {
 await cht.reply(caption + "\n\n" + url).catch(() => null)
 }

 await cht.react("✅").catch(() => {})
 } catch (e) {
 await cht.react("❌").catch(() => {})
 await cht.reply("Gagal HD4.\n" + String(e?.message || e)).catch(() => null)
 }
 }
 )
}
