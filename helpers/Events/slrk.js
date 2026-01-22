/* ✦ CAP HYTAM LEGAM DAKIAN KEK ARANG ✦

 Berbagi fitur SC Bella

 NAMA FITUR : LIRIK / GETLIRIK (LRCLIB)
 SOURCE : https://lrclib.net

 CREATOR : AlbertLazovsky
 CONTACT : 083846359386
 LINK GC : https://chat.whatsapp.com/GGjR1bhh12vBsXtkkcgPAo
 LINK CH : https://whatsapp.com/channel/0029Vb71Xk7EFeXeX06Gpf1
*/

export default async function on({ Exp, ev, store, cht, ai, is }) {
 const axiosMod = await "axios".import()
 const axios = axiosMod?.default || axiosMod

 const lyricCache = (globalThis.__LRCLIB_CACHE ||= new Map())

 const formatDuration = (sec) => {
 const n = Number(sec)
 if (!Number.isFinite(n) || n <= 0) return "N/A"
 const m = Math.floor(n / 60)
 const s = Math.floor(n % 60)
 return `${m}:${String(s).padStart(2, "0")}`
 }

 const parseText = (cht, args) => {
 const q = String(cht?.q || "").trim()
 if (q) return q
 if (Array.isArray(args)) return args.map((v) => String(v || "")).join(" ").trim()
 if (typeof args === "string") return args.trim()
 return ""
 }

 const searchLyrics = async (query) => {
 try {
 const { data } = await axios.get("https://lrclib.net/api/search", {
 params: { q: query },
 timeout: 20000,
 headers: { "user-agent": "Mozilla/5.0" }
 })
 if (!Array.isArray(data) || data.length === 0) return { error: "Lirik Tidak Ditemukan" }
 return { results: data.slice(0, 10) }
 } catch (e) {
 return { error: String(e?.message || e) }
 }
 }

 const getLyricsById = async (id) => {
 try {
 const { data } = await axios.get(`https://lrclib.net/api/get/${id}`, {
 timeout: 20000,
 headers: { "user-agent": "Mozilla/5.0" }
 })
 return data
 } catch (e) {
 return { error: String(e?.message || e) }
 }
 }

 const buildLyricText = (lyric, title) => {
 const lyr = lyric?.plainLyrics || lyric?.syncedLyrics || "Lirik tidak tersedia"
 return [
 `╭─〔 ${title} 〕`,
 `│ Judul : ${lyric?.trackName || "-"}`,
 `│ Artis : ${lyric?.artistName || "-"}`,
 `│ Album : ${lyric?.albumName || "N/A"}`,
 `│ Durasi : ${formatDuration(lyric?.duration)}`,
 "╰────────────",
 "",
 lyr
 ].join("\n")
 }

 ev.on(
 {
 cmd: ["lirik", "lyrics"],
 listmenu: ["lirik"],
 tag: "search",
 energy: 20,
 args: 1
 },
 async ({ cht, args }) => {
 const query = parseText(cht, args)
 const prefix = cht?.prefix || "."

 if (!query) return cht.reply(`Contoh:\n${prefix}lirik Yellow - Coldplay`)

 await cht.react("⏳").catch(() => {})

 const res = await searchLyrics(query)
 if (res?.error) {
 await cht.react("❌").catch(() => {})
 return cht.reply(`Kesalahan: ${res.error}`)
 }

 const results = Array.isArray(res?.results) ? res.results : []
 lyricCache.set(cht.id, results)

 if (results.length === 1) {
 const lyric = await getLyricsById(results[0].id)
 if (lyric?.error) {
 await cht.react("❌").catch(() => {})
 return cht.reply(`❌ ${lyric.error}`)
 }
 await cht.react("✅").catch(() => {})
 return cht.reply(buildLyricText(lyric, "LIRIK DITEMUKAN"))
 }

 const lines = results.map((v, i) => `│ ${i + 1}. ${v.trackName} — ${v.artistName}`)
 const msg = [
 "╭─〔 HASIL PENCARIAN LIRIK 〕",
 `│ Query : ${query}`,
 `│ Hasil : ${results.length}`,
 "├────────────",
 ...lines,
 "╰────────────",
 "",
 `Ketik:\n${prefix}getlirik <nomor>\nContoh: ${prefix}getlirik 1`
 ].join("\n")

 await cht.react("✅").catch(() => {})
 return cht.reply(msg)
 }
 )

 ev.on(
 {
 cmd: ["getlirik"],
 listmenu: ["getlirik"],
 tag: "search",
 energy: 20,
 args: 1
 },
 async ({ cht, args }) => {
 const text = parseText(cht, args)
 const prefix = cht?.prefix || "."
 const cache = lyricCache.get(cht.id)

 if (!Array.isArray(cache) || cache.length === 0) {
 return cht.reply(`Belum ada hasil pencarian.\nPakai: ${prefix}lirik <judul - artis>`)
 }

 const idx = parseInt(String(text || "").trim())
 if (!idx || idx < 1 || idx > cache.length) return cht.reply("Nomor tidak valid.")

 await cht.react("⏳").catch(() => {})

 const song = cache[idx - 1]
 const lyric = await getLyricsById(song.id)
 if (lyric?.error) {
 await cht.react("❌").catch(() => {})
 return cht.reply(`Kesalahan: ${lyric.error}`)
 }

 await cht.react("✅").catch(() => {})
 return cht.reply(buildLyricText(lyric, "LIRIK LAGU"))
 }
 )
}
