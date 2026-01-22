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
const fsMod = "fs".import()

const axios = axiosMod?.default || axiosMod
const fs = fsMod?.default || fsMod

const G = globalThis
if (!G.Data || typeof G.Data !== "object") G.Data = {}
if (!G.Data.__ccSess || typeof G.Data.__ccSess?.get !== "function") G.Data.__ccSess = new Map()
const SESS = G.Data.__ccSess

const TTL = 10 * 60 * 1000 // 10 menit

function clean(s) {
 return String(s || "").replace(/\s+/g, " ").trim()
}

function safe(s, max = 120) {
 const t = clean(s)
 if (!t) return "-"
 return t.length > max ? t.slice(0, max) + "..." : t
}

function num(n) {
 const x = Number(n)
 return Number.isFinite(x) ? x.toLocaleString("id-ID") : "-"
}

async function replyText(cht, Exp, opts, text) {
 try {
 return await Exp.sendMessage(cht.id, { text: String(text || "") }, opts || {})
 } catch {}
}

function getQuotedRaw(cht) {
 const c = cht || {}
 const cand = [c?.msg, c?.m, c?.message, c?.raw, c?.quoted?.msg, c?.quoted?.m, c?.quoted]
 for (const x of cand) if (x && x.key && typeof x.key === "object") return x
 return null
}

function extractSelectedId(cht) {
 const msg = cht?.msg?.message || cht?.m?.message || cht?.message?.message || null
 if (!msg) return ""

 const lr = msg.listResponseMessage?.singleSelectReply?.selectedRowId
 if (typeof lr === "string" && lr) return lr

 const br = msg.buttonsResponseMessage?.selectedButtonId
 if (typeof br === "string" && br) return br

 const tb = msg.templateButtonReplyMessage?.selectedId
 if (typeof tb === "string" && tb) return tb

 const ir = msg.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson
 if (typeof ir === "string" && ir) {
 try {
 const o = JSON.parse(ir)
 const sid =
 o?.id ||
 o?.selectedRowId ||
 o?.selected_row_id ||
 o?.single_select_reply?.selected_row_id ||
 o?.singleSelectReply?.selectedRowId
 if (typeof sid === "string" && sid) return sid
 } catch {}
 }

 return ""
}

function parseFlags(s) {
 const out = { sid: "", pick: "" }
 const t = clean(s)
 if (!t) return out

 const mSidEq = t.match(/--sid=([a-zA-Z0-9_-]+)/)
 const mPickEq = t.match(/--pick=([a-zA-Z0-9_-]+)/)

 if (mSidEq?.[1]) out.sid = mSidEq[1]
 if (mPickEq?.[1]) out.pick = mPickEq[1]

 const parts = t.split(/\s+/)
 for (let i = 0; i < parts.length; i++) {
 const p = parts[i]
 if (p === "--sid" && parts[i + 1]) out.sid = parts[i + 1]
 if (p === "--pick" && parts[i + 1]) out.pick = parts[i + 1]
 }

 return out
}

function cleanupSessions() {
 const now = Date.now()
 for (const [k, v] of SESS.entries()) {
 if (!v?.t || now - v.t > TTL) SESS.delete(k)
 }
}

// ================= CAPCUT API & FORMAT =================

async function apiSearchCapcut(q) {
 const r = await axios.get("https://skizoasia.xyz/api/capcut/search", {
 params: { q, limit: 10 },
 timeout: 30000,
 validateStatus: () => true,
 headers: { "user-agent": "Mozilla/5.0", accept: "application/json,*/*" }
 })

 if (r.status !== 200) return []

 const data = r.data
 let list = []

 if (Array.isArray(data?.result)) list = data.result
 else if (Array.isArray(data?.data)) list = data.data
 else if (Array.isArray(data)) list = data

 return list.filter(Boolean).slice(0, 10)
}

function pickTitle(v) {
 return clean(v?.title || v?.name || v?.caption || "")
}

function pickAuthor(v) {
 return clean(v?.author || v?.creator || v?.username || v?.user || "")
}

function pickUsage(v) {
 return v?.use_count ?? v?.usage ?? v?.used ?? v?.views ?? null
}

function pickLink(v) {
 return clean(v?.url || v?.link || v?.capcut || v?.template_url || "")
}

function buildCaption(v) {
 const title = pickTitle(v)
 const author = pickAuthor(v)
 const usage = pickUsage(v)
 const link = pickLink(v)

 const lines = []

 lines.push("🎬 *CapCut Template*")
 lines.push("")

 if (title) lines.push(`• Judul: ${safe(title, 200)}`)
 if (author) lines.push(`• Creator: ${author}`)
 if (usage != null) lines.push(`• Dipakai: ${num(usage)} kali`)
 if (link) {
 lines.push("")
 lines.push(`🔗 Link Template:`)
 lines.push(link)
 }

 lines.push("")
 lines.push("Buka linknya di aplikasi CapCut.")

 return lines.join("\n").trim()
}

async function sendList(cht, Exp, opts, sid, q, results) {
 const rows = results.map((v, i) => {
 const title = safe(pickTitle(v) || `Template ${i + 1}`, 34)
 const author = pickAuthor(v) || "-"
 const usage = pickUsage(v)
 const desc =
 usage != null
 ? safe(`@${author} • ${num(usage)} pemakaian`, 72)
 : safe(`@${author}`, 72)

 return {
 title,
 description: desc,
 id: `.ccsearch --sid=${sid} --pick=${i + 1}`
 }
 })

 const sections = [{ title: "Pilih Template CapCut", rows }]

 const caption =
 `🔍 Hasil pencarian CapCut untuk: *${safe(q, 80)}*\n` +
 `Pilih salah satu dari list di bawah.\n\n` +
 `Kalau linknya error atau template kehapus, tinggal pilih hasil lain.`

 const paramsJson = JSON.stringify({ title: "CapCut Template", sections })

 return await Exp.sendMessage(
 cht.id,
 {
 image: fs.readFileSync(fol[3] + "bell.jpg"),
 caption,
 footer: "Alya AI • CapCut Finder",
 buttons: [
 {
 buttonId: "ccsearch_list",
 buttonText: { displayText: "[ PILIH TEMPLATE ]" },
 type: 4,
 nativeFlowInfo: { name: "single_select", paramsJson }
 }
 ],
 headerType: 6,
 viewOnce: true
 },
 opts
 )
}

// ================= REGISTER EVENT =================

export default async function on({ cht, Exp, store, ev, is }) {
 ev.on(
 {
 cmd: ["ccsearch", "capcut"],
 listmenu: ["ccsearch <query>"],
 tag: "tools",
 energy: 55,
 args: "Contoh: .ccsearch jedag jedug viral"
 },

 async ({ cht }) => {
 cleanupSessions()

 const selectedId = extractSelectedId(cht)
 const asText =
 clean(selectedId) ||
 clean(cht?.q) ||
 clean(cht?.quoted?.text) ||
 clean(cht?.quoted?.caption)

 const flags = parseFlags(asText)

 const quoted = getQuotedRaw(cht)
 const opts = quoted ? { quoted } : {}

 // === MODE PICK DARI LIST ===
 if (flags.sid) {
 const sess = SESS.get(flags.sid)

 if (!sess) {
 return replyText(cht, Exp, opts, "Listnya udah ilang. Cari ulang: .ccsearch <query>")
 }

 if (Date.now() - sess.t > TTL) {
 SESS.delete(flags.sid)
 return replyText(cht, Exp, opts, "Listnya udah kadaluarsa. Cari ulang aja.")
 }

 if (sess.sender && sess.sender !== cht.sender) {
 return replyText(cht, Exp, opts, "Itu list punya orang lain, jangan numpang.")
 }

 if (!flags.pick) {
 await sendList(cht, Exp, opts, flags.sid, sess.q || "(tanpa query)", sess.results)
 return
 }

 const idx = parseInt(flags.pick, 10)
 if (!Number.isFinite(idx) || idx < 1 || idx > sess.results.length) {
 return replyText(cht, Exp, opts, "Pilihan nggak valid.")
 }

 const v = sess.results[idx - 1]
 const link = pickLink(v)
 if (!link) return replyText(cht, Exp, opts, "Link template kosong dari API. Coba pilih yang lain.")

 await cht.react("⏳").catch(() => {})

 const caption = buildCaption(v)
 await replyText(cht, Exp, opts, caption)

 await cht.react("✅").catch(() => {})
 return
 }

 // === MODE SEARCH BARU ===
 const q =
 clean(cht.q) ||
 clean(cht.quoted?.text) ||
 clean(cht.quoted?.caption)

 if (!q) {
 return replyText(
 cht,
 Exp,
 opts,
 "Masukin kata kunci template CapCut.\nContoh:\n.ccsearch jedag jedug bokeh"
 )
 }

 await cht.react("⏳").catch(() => {})

 try {
 const results = await apiSearchCapcut(q)

 if (!results.length) {
 await cht.react("❌").catch(() => {})
 return replyText(cht, Exp, opts, "Nggak nemu template-nya. Coba kata kunci lain.")
 }

 const sid = Math.random().toString(16).slice(2, 16)
 SESS.set(sid, { t: Date.now(), sender: cht.sender, chat: cht.id, q, results })

 await sendList(cht, Exp, opts, sid, q, results)
 await cht.react("✅").catch(() => {})
 } catch (e) {
 await cht.react("❌").catch(() => {})
 return replyText(
 cht,
 Exp,
 opts,
 "Gagal search CapCut.\nDetail: " + (e?.message || String(e))
 )
 }
 }
 )
}
