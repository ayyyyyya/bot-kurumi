/* ✦ CAP HYTAM LEGAM DAKIAN KEK ARANG ✦

 Berbagi fitur SC Bella

 NAMA FITUR : HackWa
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

 const getTarget = (cht, args) => {
 const q = cht?.quoted
 const qSender = q?.sender || q?.participant || q?.key?.participant || null
 if (qSender) return qSender

 const ms = cht?.mentions || cht?.mentionedJid || []
 const m0 = Array.isArray(ms) ? ms[0] : null
 if (m0) return m0

 const a0 = Array.isArray(args) ? String(args[0] || "") : ""
 const num = a0.replace(/\D/g, "")
 if (num.length >= 8) return num + "@s.whatsapp.net"
 return null
 }

 const caseId = () => {
 const a = Math.random().toString(36).slice(2, 6).toUpperCase()
 const b = Math.random().toString(36).slice(2, 6).toUpperCase()
 const c = Date.now().toString(36).slice(-4).toUpperCase()
 return `WA-${c}-${a}${b}`
 }

 ev.on(
 {
 cmd: ["hackwa"],
 listmenu: ["hackwa"],
 isOwner: true,
 tag: "owner",
 args: 0
 },
 async ({ args }) => {
 const target = getTarget(cht, args)
 if (!target) return cht.reply("pakai reply/tag .hackwa @tag")

 const now = new Date()
 const stamp = now.toLocaleString("id-ID", { timeZone: "Asia/Jakarta", hour12: false })
 const subject = (await Exp.groupMetadata(cht.id).catch(() => null))?.subject || "-"
 const targetName = pickName(target)
 const idCase = caseId()

 try {
 await cht.react("⏳")
 } catch {}

 await sleep(650)

 const lines = [
 "╭─〔 WHATSAPP SESSION SECURITY AUDIT 〕",
 `│ Case ID : ${idCase}`,
 `│ Timestamp : ${stamp} WIB`,
 `│ Scope : Session health-check (simulation)`,
 `│ Group : ${subject}`,
 `│ Target : ${fmt(target)} (${targetName})`,
 "╰────────────",
 "",
 "╭─〔 EXECUTION SUMMARY 〕",
 "│ Status : COMPLETED",
 "│ Severity : LOW",
 "│ Risk Score: 18/100",
 "╰────────────",
 "",
 "╭─〔 CHECKS 〕",
 "│ 1) Session footprint : NORMAL",
 "│ 2) Linked-device anomaly : NOT OBSERVED",
 "│ 3) Token exposure signal : NOT PRESENT",
 "│ 4) Spam/abuse pattern : NOT DETECTED",
 "╰────────────",
 "",
 "╭─〔 RECOMMENDATIONS 〕",
 "│ • Aktifkan Verifikasi Dua Langkah (2FA) WhatsApp",
 "│ • Audit Perangkat Tertaut (Linked Devices) secara berkala",
 "│ • Jangan pernah bagikan OTP/kode verifikasi ke siapa pun",
 "│ • Waspadai link phishing dan aplikasi mod",
 "╰────────────",
 "",
 "Catatan: GACOR BERHASIL DIHACK WA DIA, SIKAT BERT😈."
 ].join("\n")

 await Exp.sendMessage(cht.id, { text: lines, mentions: [target] }, { quoted: cht }).catch(() => cht.reply(lines))

 try {
 await cht.react("✅")
 } catch {}
 }
 )
}
