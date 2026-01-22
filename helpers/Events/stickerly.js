/* ✦ CAP HYTAM LEGAM DAKIAN KEK ARANG ✦

 Berbagi fitur SC Bella

 NAMA FITUR : STICKERLY SEARCH
 SOURCE : -

 CREATOR : AlbertLazovsky
 CONTACT : 083846359386
 LINK GC : https://chat.whatsapp.com/GGjR1bhh12vBsXtkkcgPAo
 LINK CH : https://whatsapp.com/channel/0029Vb71Xk7EFeXeX06Gpf1
*/

const axiosMod = await "axios".import()
const axios = axiosMod?.default || axiosMod

let sharp = null
try {
 const sharpMod = await "sharp".import()
 sharp = sharpMod?.default || sharpMod
} catch {
 sharp = null
}

const searchCache = new Map()
const usedStickerIndex = new Map()

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export default async function on({ Exp, store, ev }) {
 ev.on(
 {
 cmd: ["stickerly", "stickersearch"],
 listmenu: ["stickerly"],
 tag: "tools",
 energy: 55,
 args: 1
 },
 async ({ cht, args }) => {
 const text = (Array.isArray(args) ? args.join(" ") : String(args || "")).trim()
 if (!text) return cht.reply(`Contoh: ${cht.prefix || "."}stickerly anime`)
 if (!sharp) return cht.reply("Module sharp belum tersedia. Install dulu: npm i sharp")

 await cht.react("⏳").catch(() => {})

 try {
 const timestamp = Date.now()
 const { data: json } = await axios.request({
 method: "POST",
 url: "https://api.sticker.ly/v4/stickerPack/smartSearch",
 timeout: 20000,
 headers: {
 "User-Agent": "androidapp.stickerly/3.25.2 (220333QAG; U; Android 30; ms-MY; id;)",
 "Content-Type": "application/json",
 Accept: "application/json",
 "Accept-Encoding": "gzip",
 "x-duid": Buffer.from(String(timestamp)).toString("base64")
 },
 data: {
 keyword: text,
 enabledKeywordSearch: true,
 filter: {
 extendSearchResult: true,
 sortBy: "RECOMMENDED",
 languages: ["ALL"],
 minStickerCount: 10,
 searchBy: "ALL",
 stickerType: "ALL"
 }
 }
 })

 const packs = json?.result?.stickerPacks
 if (!Array.isArray(packs) || packs.length === 0) return cht.reply("🍂 Sticker tidak ditemukan")

 const availablePacks = packs.filter(
 (pack) => pack?.resourceFiles && Array.isArray(pack.resourceFiles) && pack.resourceFiles.length >= 5
 )
 if (!availablePacks.length) return cht.reply("🍂 Tidak ada pack dengan cukup sticker")

 const cacheKey = `${text}-${cht.sender}`
 const startPackIndex = searchCache.get(cacheKey) || 0
 const selectedPack = availablePacks[startPackIndex % availablePacks.length]

 const allStickers = Array.isArray(selectedPack?.resourceFiles) ? selectedPack.resourceFiles : []
 const usedKey = `${text}-${selectedPack?.packId || "nopack"}`
 let usedIndices = usedStickerIndex.get(usedKey)
 if (!(usedIndices instanceof Set)) usedIndices = new Set()

 const availableStickers = allStickers
 .map((sticker, index) => ({ sticker, index }))
 .filter((item) => !usedIndices.has(item.index))

 let stickersToSend = []

 if (availableStickers.length >= 5) {
 const shuffled = availableStickers.slice().sort(() => Math.random() - 0.5)
 stickersToSend = shuffled.slice(0, 5).map((item) => {
 usedIndices.add(item.index)
 return item.sticker
 })
 } else {
 usedIndices.clear()
 const randomIndices = new Set()
 while (randomIndices.size < 5 && randomIndices.size < allStickers.length) {
 randomIndices.add(Math.floor(Math.random() * allStickers.length))
 }
 stickersToSend = Array.from(randomIndices).map((idx) => {
 usedIndices.add(idx)
 return allStickers[idx]
 })
 }

 usedStickerIndex.set(usedKey, usedIndices)
 searchCache.set(cacheKey, startPackIndex + 1)

 const prefix = String(selectedPack?.resourceUrlPrefix || "")
 let successCount = 0

 for (let i = 0; i < stickersToSend.length; i++) {
 const file = stickersToSend[i]
 if (!file) continue
 const url = String(file).startsWith("http") ? String(file) : prefix + String(file)

 try {
 const imgRes = await axios.get(url, { responseType: "arraybuffer", timeout: 15000 })
 const buffer = Buffer.from(imgRes.data)

 let stickerBuffer = null
 try {
 stickerBuffer = await sharp(buffer)
 .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
 .webp({ quality: 90, effort: 6, nearLossless: true })
 .toBuffer()
 } catch {
 continue
 }

 await Exp.sendMessage(cht.id, { sticker: stickerBuffer }, { quoted: cht }).catch(() => null)
 successCount++

 if (i < stickersToSend.length - 1) await sleep(650)
 } catch {}
 }

 if (successCount === 0) return cht.reply("🍂 Semua sticker gagal dikirim")
 if (successCount < 5) await cht.reply(`✅ ${successCount} sticker berhasil dikirim`)
 } catch {
 await cht.reply("🍂 Terjadi kesalahan saat memproses sticker")
 } finally {
 await cht.react("✅").catch(() => {})
 }
 }
 )
}
