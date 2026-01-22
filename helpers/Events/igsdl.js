/* ✦ CAP HYTAM LEGAM DAKIAN KEK ARANG ✦

 Berbagi fitur SC Bella

 NAMA FITUR :
 SOURCE :

 CREATOR : AlbertLazovsky
 CONTACT : 083846359386
 LINK GC : https://chat.whatsapp.com/GGjR1bhh12vBsXtkkcgPAo
 LINK CH : https://whatsapp.com/channel/0029Vb71Xk7EFeXeX06Gpf1
*/

const axiosMod = await "axios".import()
const cheerioMod = await "cheerio".import()
const formDataMod = await "form-data".import()

const axios = axiosMod?.default || axiosMod
const cheerio = cheerioMod?.default || cheerioMod
const FormData = formDataMod?.default || formDataMod

function clean(s) {
 return String(s || "").replace(/\s+/g, " ").trim()
}

function pickTextArg(cht, args) {
 if (Array.isArray(args) && args.length) return clean(args.join(" "))
 const q = clean(cht?.q)
 if (q) return q
 const qt = clean(cht?.quoted?.text)
 if (qt) return qt
 const qc = clean(cht?.quoted?.caption)
 if (qc) return qc
 return ""
}

function isIgStoryUrl(url) {
 return /^https:\/\/(www\.)?instagram\.com\/stories\/[a-zA-Z0-9_.]+(\/[0-9]+)?\/?(\?.*)?$/.test(url)
}

function uniq(arr) {
 return Array.from(new Set((arr || []).filter(Boolean)))
}

function looksLikeMedia(u) {
 const s = clean(u)
 if (!/^https?:\/\//i.test(s)) return false
 if (/^https?:\/\/(www\.)?instagram\.com/i.test(s)) return false
 if (/javascript:|mailto:/i.test(s)) return false
 if (/\.(mp4|jpg|jpeg|png|webp)(\?|$)/i.test(s)) return true
 if (/download|dl=|file=|media=|video|image/i.test(s)) return true
 return false
}

function extractLinksFromHtml(html) {
 const $ = cheerio.load(String(html || ""))
 const out = []

 $("a").each((_, el) => {
 const href = $(el).attr("href")
 if (looksLikeMedia(href)) out.push(href)

 const d1 = $(el).attr("data-href")
 if (looksLikeMedia(d1)) out.push(d1)

 const d2 = $(el).attr("data-url")
 if (looksLikeMedia(d2)) out.push(d2)

 const d3 = $(el).attr("data-download")
 if (looksLikeMedia(d3)) out.push(d3)

 const d4 = $(el).attr("data-src")
 if (looksLikeMedia(d4)) out.push(d4)
 })

 $("source,video,img").each((_, el) => {
 const s1 = $(el).attr("src")
 if (looksLikeMedia(s1)) out.push(s1)

 const s2 = $(el).attr("data-src")
 if (looksLikeMedia(s2)) out.push(s2)
 })

 return uniq(out.map(clean))
}

async function igstory(url) {
 if (!isIgStoryUrl(url)) throw new Error("URL IG Story tidak valid")

 const baseHeaders = {
 "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Mobile Safari/537.36",
 accept: "*/*",
 origin: "https://savevid.net",
 referer: "https://savevid.net/",
 "x-requested-with": "XMLHttpRequest"
 }

 const verify = new FormData()
 verify.append("url", url)

 const vr = await axios.post("https://savevid.net/api/userverify", verify, {
 headers: { ...baseHeaders, ...verify.getHeaders() },
 timeout: 30000,
 validateStatus: () => true
 })

 const token = vr?.data?.token
 if (!token) throw new Error("Gagal verifikasi (token kosong)")

 const form = new FormData()
 form.append("q", url)
 form.append("t", "media")
 form.append("lang", "en")
 form.append("v", "v2")
 form.append("cftoken", token)

 const sr = await axios.post("https://v3.savevid.net/api/ajaxSearch", form, {
 headers: { ...baseHeaders, ...form.getHeaders() },
 timeout: 30000,
 validateStatus: () => true
 })

 const d = sr?.data
 const html = d?.data?.data || d?.data || d?.html || d?.result || ""
 const links = extractLinksFromHtml(html)

 return links
}

function guessName(u, i) {
 const s = String(u || "")
 const ext = /\.(mp4|jpg|jpeg|png|webp)(\?|$)/i.exec(s)?.[1]?.toLowerCase()
 return `igstory_${i + 1}.${ext || "mp4"}`
}

export default async function on({ cht, Exp, store, ev, is }) {
 ev.on(
 {
 cmd: ["igstory", "igs", "storyig"],
 listmenu: ["igstory <url>"],
 tag: "tools",
 energy: 35,
 args: "Contoh: .igstory https://www.instagram.com/stories/username/"
 },
 async ({ cht, args }) => {
 const url = pickTextArg(cht, args)

 if (!url) return cht.reply("Masukkan URL IG Story.\nContoh: .igstory https://www.instagram.com/stories/username/")
 if (!isIgStoryUrl(url)) return cht.reply("URL tidak valid.\nFormat: https://www.instagram.com/stories/username/")

 await cht.react("⏳").catch(() => {})

 try {
 const links = await igstory(url)

 if (!links.length) {
 await cht.react("❌").catch(() => {})
 return cht.reply("Tidak ada story yang bisa diambil.\nKemungkinan savevid sedang berubah/menolak request. Coba beberapa menit lagi atau coba story lain.")
 }

 const maxSend = 5
 const toSend = links.slice(0, maxSend)

 for (let i = 0; i < toSend.length; i++) {
 const dl = toSend[i]
 const name = guessName(dl, i)
 await cht.sendFile(dl, name, `IG Story ${i + 1}/${links.length}`).catch(async () => {
 await cht.reply(`Gagal kirim media ${i + 1}.\nLink:\n${dl}`)
 })
 }

 if (links.length > maxSend) {
 const rest = links.slice(maxSend).map((x, i) => `${i + 1 + maxSend}. ${x}`).join("\n")
 await cht.reply(`Sisa link (${links.length - maxSend}):\n${rest}`)
 }

 await cht.react("✅").catch(() => {})
 } catch (e) {
 await cht.react("❌").catch(() => {})
 return cht.reply("Gagal ambil IG Story: " + (e?.message || String(e)))
 }
 }
 )
}
