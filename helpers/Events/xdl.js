const axiosMod = "axios".import()
const axios = axiosMod?.default || axiosMod

const PROGRESS_MIN_INTERVAL = 1700
const _pState = new Map()
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

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
 if (k) _pState.set(k, { t: Date.now(), last: text })
 return msg
 } catch {
 return null
 }
}

async function progressUpdate(cht, Exp, msg, text) {
 if (!msg?.key?.id) return
 const k = msg.key.id
 const st = _pState.get(k) || { t: 0, last: "" }
 if (st.last === text) return

 const now = Date.now()
 const wait = PROGRESS_MIN_INTERVAL - (now - st.t)
 if (wait > 0) await sleep(wait)

 try {
 await Exp.sendMessage(cht.id, { text, edit: msg.key })
 st.t = Date.now()
 st.last = text
 _pState.set(k, st)
 } catch {}
}

function normalizeXUrl(input) {
 const s = String(input || "").trim()
 if (!s) return null
 try {
 const u = new URL(s)
 const h = u.hostname.toLowerCase()
 if (!h.includes("x.com") && !h.includes("twitter.com") && !h.includes("mobile.twitter.com")) return null
 return u.toString()
 } catch {
 return null
 }
}

function extractLinks(html) {
 const s = String(html || "")
 const out = []
 for (const m of s.matchAll(/href="(https:\/\/dl\.snapcdn\.app\/get\?token=[^"]+)"/g)) {
 if (m?.[1]) out.push(m[1])
 }
 return [...new Set(out)]
}

async function callSaveTwitter(url) {
 const body = new URLSearchParams({ q: url, lang: "en", cftoken: "" }).toString()
 const r = await axios.post("https://savetwitter.net/api/ajaxSearch", body, {
 timeout: 60000,
 maxBodyLength: Infinity,
 validateStatus: () => true,
 headers: {
 "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
 Accept: "*/*",
 "X-Requested-With": "XMLHttpRequest",
 origin: "https://savetwitter.net",
 referer: "https://savetwitter.net/",
 "user-agent": "Mozilla/5.0"
 }
 })
 if (r.status !== 200) throw new Error(`HTTP ${r.status}`)
 return r.data
}

async function resolveContentType(url) {
 const r = await axios.get(url, {
 timeout: 60000,
 maxRedirects: 6,
 responseType: "arraybuffer",
 validateStatus: () => true,
 headers: { "user-agent": "Mozilla/5.0", accept: "*/*" }
 })
 if (r.status !== 200) throw new Error(`Media HTTP ${r.status}`)
 const ct = String(r.headers?.["content-type"] || "").toLowerCase()
 const buf = Buffer.from(r.data || [])
 return { ct, buf }
}

export default async function on({ cht, Exp, store, ev, is }) {
 ev.on(
 {
 cmd: ["xdl", "twitter", "tw", "x"],
 listmenu: ["xdl <link>"],
 tag: "downloader",
 premium: false,
 energy: 7,
 args: "Masukin link tweet. Contoh: .xdl https://x.com/.../status/..."
 },
 async ({ cht }) => {
 const input = (cht.q || "").trim()
 const url = normalizeXUrl(input)

 if (!url) return cht.reply("Contoh:\n.xdl https://x.com/username/status/123")

 const quoted = getQuotedRaw(cht)
 const opts = quoted ? { quoted } : {}

 await cht.react("⏳").catch(() => {})
 const prog = await progressStart(cht, Exp, opts, "🔎 *nyari link download…*")

 try {
 const data = await callSaveTwitter(url)
 const html = data?.data || data?.html || data
 const links = extractLinks(html)

 if (!links.length) {
 await cht.react("❌").catch(() => {})
 await progressUpdate(cht, Exp, prog, "❌ linknya nggak ketemu")
 return cht.reply("Gagal: link download nggak ketemu dari provider.")
 }

 const pick = links[0]

 await progressUpdate(cht, Exp, prog, "📦 *ngambil file…*")
 const { ct, buf } = await resolveContentType(pick)

 await progressUpdate(cht, Exp, prog, "📤 *ngirim ke chat…*")

 if (ct.startsWith("video/")) {
 await Exp.sendMessage(cht.id, { video: buf, caption: "✅ *nih videonya*" }, opts)
 } else if (ct.startsWith("image/")) {
 await Exp.sendMessage(cht.id, { image: buf, caption: "✅ *nih gambarnya*" }, opts)
 } else {
 await Exp.sendMessage(
 cht.id,
 { document: buf, mimetype: ct || "application/octet-stream", fileName: "xdl.bin", caption: "✅ *file berhasil diambil*" },
 opts
 )
 }

 await cht.react("✅").catch(() => {})
 await progressUpdate(cht, Exp, prog, "✅ kelar")
 } catch (e) {
 await cht.react("❌").catch(() => {})
 await progressUpdate(cht, Exp, prog, "❌ gagal")
 return cht.reply("Error: " + (e?.message || String(e)))
 }
 }
 )
}
