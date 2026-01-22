const axiosMod = "axios".import()
const axios = axiosMod?.default || axiosMod

async function fetchDouyin(url) {
 const r = await axios.post(
 "https://snapdouyin.app/wp-json/mx-downloader/video-data/",
 { url },
 {
 timeout: 30000,
 validateStatus: () => true,
 headers: {
 "user-agent": "Mozilla/5.0",
 accept: "application/json,*/*",
 origin: "https://snapdouyin.app",
 referer: "https://snapdouyin.app/"
 }
 }
 )

 if (r.status !== 200) throw new Error(`HTTP ${r.status}`)
 if (!r.data) throw new Error("Response kosong")

 return r.data
}

function normUrl(s) {
 const t = String(s || "").trim()
 if (!t) return null
 if (!t.includes("douyin.com")) return null
 return t
}

function getQuotedRaw(cht) {
 const c = cht || {}
 const cand = [c?.msg, c?.m, c?.message, c?.raw, c?.quoted?.msg, c?.quoted?.m, c?.quoted]
 for (const x of cand) if (x && x.key && typeof x.key === "object") return x
 return null
}

export default async function on({ cht, Exp, store, ev, is }) {
 ev.on(
 {
 cmd: ["douyindl2"],
 listmenu: ["douyindl2 <link douyin>"],
 tag: "downloader",
 energy: 30,
 args: "Masukkan link Douyin / TikTok CN"
 },
 async ({ cht }) => {
 const raw =
 (cht.q || "").trim() ||
 (cht.quoted?.text || "").trim() ||
 (cht.quoted?.caption || "").trim()

 const url = normUrl(raw)
 if (!url) return cht.reply("Contoh:\n.douyindl2 https://v.douyin.com/...")

 const quoted = getQuotedRaw(cht)
 const opts = quoted ? { quoted } : {}

 await cht.react("⏳").catch(() => {})

 try {
 const data = await fetchDouyin(url)

 const title =
 data?.title ||
 data?.video_title ||
 data?.desc ||
 "Douyin Download"

 // Cek jika video
 const video =
 data?.links?.[0]?.url ||
 data?.video?.url ||
 data?.download_url ||
 null

 // Cek jika album foto
 const images =
 Array.isArray(data?.images)
 ? data.images.map((x) => x?.url).filter(Boolean)
 : []

 if (video) {
 await Exp.sendMessage(
 cht.id,
 {
 video: { url: video },
 caption: `🎬 ${title}`
 },
 opts
 )

 await cht.react("✅").catch(() => {})
 return
 }

 if (images.length) {
 for (const img of images) {
 await Exp.sendMessage(
 cht.id,
 { image: { url: img }, caption: `🖼️ ${title}` },
 opts
 )
 }

 await cht.react("✅").catch(() => {})
 return
 }

 await cht.react("❌").catch(() => {})
 return cht.reply("Gagal: media tidak ditemukan.")
 } catch (e) {
 await cht.react("❌").catch(() => {})
 return cht.reply("Error: " + (e?.message || String(e)))
 }
 }
 )
}
