const axiosMod = "axios".import()
const axios = axiosMod?.default || axiosMod

const API_URL = "https://yt-to-text.com/api/v1/Subtitles"

const PROG_MIN = 1400
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

function extractVideoId(input) {
 const raw = clean(input)
 if (!raw) return null

 const direct = raw.match(/^[a-zA-Z0-9_-]{6,}$/)
 if (direct) return raw

 let url
 try {
 url = new URL(raw)
 } catch {
 const m = raw.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([a-zA-Z0-9_-]{6,})/i)
 return m?.[1] || null
 }

 const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "")
 if (host === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] || null

 if (host === "youtube.com" || host.endsWith(".youtube.com")) {
 if (url.pathname === "/watch") return url.searchParams.get("v")
 if (url.pathname.startsWith("/shorts/")) return url.pathname.split("/").filter(Boolean)[1] || null
 if (url.pathname.startsWith("/embed/")) return url.pathname.split("/").filter(Boolean)[1] || null
 if (url.pathname.startsWith("/live/")) return url.pathname.split("/").filter(Boolean)[1] || null
 }

 return null
}

function splitText(text, max = 3500) {
 const t = String(text || "")
 if (!t) return []
 if (t.length <= max) return [t]

 const out = []
 let i = 0
 while (i < t.length) {
 let end = Math.min(i + max, t.length)
 let chunk = t.slice(i, end)

 if (end < t.length) {
 const lastSpace = chunk.lastIndexOf(" ")
 if (lastSpace > max * 0.6) {
 end = i + lastSpace
 chunk = t.slice(i, end)
 }
 }

 out.push(chunk.trim())
 i = end
 }
 return out.filter(Boolean)
}

async function transcribeYT(youtubeUrlOrId) {
 const videoId = extractVideoId(youtubeUrlOrId)
 if (!videoId) throw new Error("Gue butuh link YouTube / Shorts / youtu.be / atau ID video yang bener.")

 const r = await axios.post(
 API_URL,
 { video_id: videoId },
 {
 timeout: 60000,
 validateStatus: () => true,
 headers: {
 Accept: "*/*",
 "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
 "Content-Type": "application/json",
 Origin: "https://tubetranscript.com",
 Referer: "https://tubetranscript.com/",
 "User-Agent":
 "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36",
 "sec-ch-ua": `"Chromium";v="139", "Not;A=Brand";v="99"`,
 "sec-ch-ua-mobile": "?1",
 "sec-ch-ua-platform": `"Android"`,
 "x-app-version": "1",
 "x-source": "tubetranscript"
 }
 }
 )

 if (r.status !== 200) {
 const raw = typeof r.data === "string" ? r.data : JSON.stringify(r.data || {})
 throw new Error(`API error HTTP ${r.status}: ${clean(raw).slice(0, 200)}`)
 }

 const transcripts = r?.data?.data?.transcripts
 if (!Array.isArray(transcripts) || !transcripts.length) throw new Error("Transcript-nya kosong / video nggak ada subtitle.")

 const text = clean(transcripts.map((v) => v?.t).filter(Boolean).join(" "))
 if (!text) throw new Error("Transcript kebaca tapi hasilnya kosong.")

 return { videoId, text }
}

export default async function on({ cht, Exp, store, ev, is }) {
 ev.on(
 {
 cmd: ["yttrans", "ytrans", "yttranscribe"],
 listmenu: ["yttrans <link/id>"],
 tag: "tools",
 energy: 10,
 args: "Contoh: .yttrans https://youtu.be/xxxx atau .yttrans dQw4w9WgXcQ"
 },
 async ({ cht }) => {
 const raw =
 clean(cht.q) ||
 clean(cht.quoted?.text) ||
 clean(cht.quoted?.caption)

 if (!raw) {
 return cht.reply(
 "Pake gini:\n" +
 "• .yttrans https://youtu.be/xxxx\n" +
 "• .yttrans https://youtube.com/watch?v=xxxx\n" +
 "• .yttrans https://youtube.com/shorts/xxxx\n" +
 "• .yttrans <videoId>"
 )
 }

 const quoted = getQuotedRaw(cht)
 const opts = quoted ? { quoted } : {}

 await cht.react("⏳").catch(() => {})
 const prog = await progressStart(cht, Exp, opts, "⏳ Oke, gue ambil transcript-nya dulu...")

 try {
 await progressEdit(cht, Exp, prog, "🔎 Lagi ngecek video ID...")
 const { videoId, text } = await transcribeYT(raw)

 await progressEdit(cht, Exp, prog, "🧾 Transcript ketemu, gue rapihin & pecah jadi beberapa part...")

 const parts = splitText(text, 3500)
 const head =
 `🎬 *YouTube Transcribe*\n` +
 `• Video ID: ${videoId}\n` +
 `• Total: ${parts.length} part\n\n`

 await Exp.sendMessage(cht.id, { text: head + parts[0] }, opts)

 for (let i = 1; i < parts.length; i++) {
 await sleep(650)
 await Exp.sendMessage(cht.id, { text: `*(Part ${i + 1}/${parts.length})*\n` + parts[i] }, opts)
 }

 await cht.react("✅").catch(() => {})
 await progressEdit(cht, Exp, prog, "✅ Done.")
 } catch (e) {
 await cht.react("❌").catch(() => {})
 await progressEdit(cht, Exp, prog, "❌ Gagal ambil transcript.")
 return cht.reply("Error: " + (e?.message || String(e)))
 }
 }
 )
}
