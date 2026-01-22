/* ✦ CAP HYTAM LEGAM DAKIAN KEK ARANG ✦

 Berbagi fitur SC Bella

 NAMA FITUR : hacking wa
 SOURCE : -

 CREATOR : AlbertLazovsky
 CONTACT : 083846359386
 LINK GC : https://chat.whatsapp.com/GGjR1bhh12vBsXtkkcgPAo
 LINK CH : https://whatsapp.com/channel/0029Vb71Xk7EFeXeX06Gpf1
*/

export default async function on({ Exp, ev, store, cht, ai, is }) {
 const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
 const pickName = (jid) => {
 const c = store?.contacts?.[jid]
 const n = c?.name || c?.notify || c?.verifiedName || ""
 if (n && String(n).trim()) return String(n).trim()
 return String(jid || "").split("@")[0] || "Unknown"
 }
 const fmt = (jid) => "@" + String(jid || "").replace(/@.+/, "")
 const safeSend = async (chatId, text, quoted, mentions) => {
 try {
 return await Exp.sendMessage(chatId, { text, mentions: mentions || [] }, { quoted })
 } catch {
 try {
 return await quoted?.reply?.(text)
 } catch {
 return null
 }
 }
 }
 const safeEdit = async (chatId, key, text, quoted) => {
 if (!key) return null
 try {
 return await Exp.sendMessage(chatId, { text, edit: key }, { quoted })
 } catch {
 try {
 if (typeof quoted?.edit === "function") return await quoted.edit(text, key)
 } catch {}
 return null
 }
 }
 const getTarget = (cht, args) => {
 const qSender = cht?.quoted?.sender || cht?.quoted?.participant || null
 if (qSender) return qSender
 const ms = cht?.mentions || cht?.mentionedJid || []
 const m0 = Array.isArray(ms) ? ms[0] : null
 if (m0) return m0
 const a0 = Array.isArray(args) ? String(args[0] || "") : ""
 const num = a0.replace(/\D/g, "")
 if (num.length >= 8) return num + "@s.whatsapp.net"
 return null
 }

 ev.on(
 {
 cmd: ["hackwa2"],
 listmenu: ["hackwa2"],
 tag: "owner",
 isOwner: true,
 args: 0
 },
 async ({ cht, args }) => {
 const isGroup = !!cht?.id && String(cht.id).endsWith("@g.us")
 const target = getTarget(cht, args)

 if (!target) {
 const ex = `${cht?.prefix || "."}hackwa @tag`
 return cht.reply(`Pakai reply/tag user.\nContoh: ${ex}`)
 }

 const chatId = cht.id
 const targetName = pickName(target)
 const mentions = [target]

 const stamp = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta", hour12: false })
 const header = [
 "╭─〔 WHATSAPP HACKING 〕",
 "│ Mode : HACKING",
 `│ Target : ${fmt(target)} (${targetName})`,
 `│ Waktu : ${stamp} WIB`,
 `│ Scope : Metadata & session health check`,
 "╰────────────"
 ].join("\n")

 const steps = [
 { t: "Inisialisasi modul audit & policy gate...", d: 900 },
 { t: "Validasi integritas identitas & endpoint profile...", d: 1100 },
 { t: "Enumerasi status session token...", d: 1200 },
 { t: "Analisis anomali aktivitas...", d: 1400 },
 { t: "Pemeriksaan indikasi hijack / multi-device...", d: 1400 },
 { t: "Konsolidasi hasil & generating report...", d: 1200 }
 ]

 const first = await safeSend(chatId, header + "\n\nStatus: memulai hacking...", cht, mentions)
 const key = first?.key || null

 for (let i = 0; i < steps.length; i++) {
 const s = steps[i]
 const body = header + `\n\nStep ${i + 1}/${steps.length}: ${s.t}`
 if (key) await safeEdit(chatId, key, body, cht)
 else await safeSend(chatId, body, cht, mentions)
 await sleep(s.d)
 }

 const findings = [
 "• Session integrity : OK",
 "• Token exposure : NOT DETECTED",
 "• Device anomaly : NONE",
 "• Risk score : LOW"
 ].join("\n")

 const footer = [
 header,
 "",
 "╭─〔 REPORT 〕",
 findings,
 "╰────────────",
 "",
 "Cek PM bert udah gw kirim, langsung *SIKAT😈*"
 ].join("\n")

 if (key) await safeEdit(chatId, key, footer, cht)
 else await safeSend(chatId, footer, cht, mentions)

 if (!isGroup) return
 }
 )
}
