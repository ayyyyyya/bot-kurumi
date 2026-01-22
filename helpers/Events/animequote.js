/* ✦ CAP HYTAM LEGAM DAKIAN KEK ARANG ✦

 Berbagi fitur SC Bella

 NAMA FITUR : ANIME QUOTE (OTAKOTAKU)
 SOURCE : https://otakotaku.com/quote

 CREATOR : AlbertLazovsky
 CONTACT : 083846359386
 LINK GC : https://chat.whatsapp.com/GGjR1bhh12vBsXtkkcgPAo
 LINK CH : https://whatsapp.com/channel/0029Vb71Xk7EFeXeX06Gpf1
*/

export default async function on({ Exp, ev, store, cht, ai, is }) {
 const axios = await "axios".import()
 const cheerio = await "cheerio".import()

 const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
 const clean = (s) => (s || "").replace(/\s+/g, " ").trim()

 const absUrl = (u, base) => {
 try {
 if (!u) return ""
 return new URL(u, base).href
 } catch {
 return u || ""
 }
 }

 const pickLargestFromSrcset = (srcset) => {
 if (!srcset) return ""
 const parts = srcset
 .split(",")
 .map((x) => x.trim())
 .map((x) => x.split(/\s+/)[0])
 .filter(Boolean)
 return parts.length ? parts[parts.length - 1] : ""
 }

 const getImg = ($, base) => {
 const og = absUrl($('meta[property="og:image"]').attr("content"), base)
 if (og) return og

 const el =
 $(".char-img img").first().length
 ? $(".char-img img").first()
 : $(".char-image img").first().length
 ? $(".char-image img").first()
 : $(".kotodama-image img").first().length
 ? $(".kotodama-image img").first()
 : $(".post-thumb img").first().length
 ? $(".post-thumb img").first()
 : $("article img").first().length
 ? $("article img").first()
 : $("img").first()

 if (!el || !el.length) return ""

 const srcset =
 el.attr("data-srcset") ||
 el.attr("data-lazy-srcset") ||
 el.attr("srcset") ||
 ""

 const largest = pickLargestFromSrcset(srcset)
 const u =
 largest ||
 el.attr("data-original") ||
 el.attr("data-src") ||
 el.attr("data-lazy-src") ||
 el.attr("src") ||
 ""

 return absUrl(u, base)
 }

 async function fetchQuotesFromPage(page) {
 const { data } = await axios.get(`https://otakotaku.com/quote/feed/${page}`, {
 headers: {
 "user-agent":
 "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36",
 accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
 },
 timeout: 20000,
 validateStatus: (s) => s >= 200 && s < 400
 })

 const $ = cheerio.load(data)

 return $("div.kotodama-list")
 .map((_, el) => $(el).find("a.kuroi").attr("href"))
 .get()
 .filter(Boolean)
 .map((u) => absUrl(u, "https://otakotaku.com"))
 }

 async function parseQuoteDetail(url) {
 const { data } = await axios.get(url, {
 headers: {
 "user-agent":
 "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36",
 accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
 referer: "https://otakotaku.com/quote"
 },
 timeout: 20000,
 validateStatus: (s) => s >= 200 && s < 400
 })

 const $q = cheerio.load(data)

 const char = clean($q('.char-info .tebal a[href*="/character/"]').first().text())
 const from_anime = clean($q('.char-info a[href*="/anime/"]').first().text())
 const episode = clean($q(".char-info span.meta").first().text()).replace(/^-\s*/g, "").replace(/^-?\s*/g, "")
 const quote = clean($q(".post-content blockquote p").first().text())
 const img = getImg($q, url)

 return { char, from_anime, episode, quote, url, img }
 }

 async function getRandomAnimeQuote() {
 const page = Math.floor(Math.random() * 184) + 1
 const links = await fetchQuotesFromPage(page)
 if (!links.length) throw new Error("Tidak menemukan quote di halaman tersebut.")

 const chosenLink = pick(links)
 const detail = await parseQuoteDetail(chosenLink)

 if (!detail.quote) throw new Error("Quote kosong (struktur halaman berubah / gagal parse).")
 if (!detail.img) throw new Error("Gambar tidak ditemukan (struktur halaman berubah).")

 return { ...detail, page }
 }

 async function sendImageWithCaption(imageUrl, caption) {
 const res = await axios.get(imageUrl, {
 responseType: "arraybuffer",
 headers: {
 "user-agent":
 "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36",
 accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
 referer: "https://otakotaku.com/"
 },
 timeout: 25000,
 validateStatus: (s) => s >= 200 && s < 400
 })

 const buf = Buffer.from(res.data)
 const mimetype = (res.headers?.["content-type"] || "image/jpeg").split(";")[0]

 if (typeof Exp?.sendMessage === "function") {
 await Exp.sendMessage(cht.id, { image: buf, mimetype, caption })
 return
 }

 if (typeof cht?.sendFile === "function") {
 await cht.sendFile(buf, "animequote-hd.jpg", caption)
 return
 }

 await cht.reply(caption)
 }

 ev.on(
 {
 cmd: ["animequote", "quoteanime", "aq"],
 listmenu: ["animequote"],
 tag: "anime",
 energy: 10,
 isGroup: true
 },
 async () => {
 try {
 cht.react("⏳")

 const q = await getRandomAnimeQuote()

 const caption = [
 "╭─❖ 「 ANIME QUOTE 」",
 "│",
 `│ ❖ Karakter : ${q.char || "-"}`,
 `│ ❖ Anime : ${q.from_anime || "-"}`,
 `│ ❖ Episode : ${q.episode || "-"}`,
 `│ ❖ Page : ${q.page}`,
 "│",
 `│ “${q.quote}”`,
 "│",
 `│ Sumber: ${q.url}`,
 "╰──────────────"
 ].join("\n")

 await sendImageWithCaption(q.img, caption)
 cht.react("✅")
 } catch (e) {
 cht.react("❌")
 await cht.reply(`Gagal ambil anime quote.\nAlasan: ${e?.message || e}`)
 }
 }
 )
}
