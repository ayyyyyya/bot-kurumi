/* ✦ CAP HYTAM LEGAM DAKIAN KEK ARANG ✦

 Berbagi fitur SC Bella

 NAMA FITUR :
 SOURCE :

 CREATOR : AlbertLazovsky
 CONTACT : 083846359386
 LINK GC : https://chat.whatsapp.com/GGjR1bhh12vBsXtkkcgPAo
 LINK CH : https://whatsapp.com/channel/0029Vb71Xk7EFeXeX06Gpf1
*/

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export default async function on({ cht, Exp, ev, is }) {
 ev.on(
 {
 cmd: ["kudeta2", "kudetagc2"],
 listmenu: ["kudeta(gc)2"],
 tag: "group",
 isGroup: true,
 isOwner: true,
 isBotAdmin: true,
 energy: 9999
 },
 async ({ cht }) => {
 const botJid =
 (Exp.decodeJid?.(Exp.user?.id || "") ||
 Exp.user?.id ||
 Exp.number ||
 "").trim()

 const sender = cht.sender

 let participants = Exp.groupMembers
 if (!Array.isArray(participants) || !participants.length) {
 const meta = await Exp.groupMetadata(cht.id).catch(() => null)
 participants = meta?.participants || []
 }

 if (!Array.isArray(participants) || !participants.length) {
 return cht.reply("Gue gak bisa ambil data member grupnya. Coba lagi bentar.")
 }

 const byId = new Map(
 participants.map((p) => [p.id, p])
 )

 const targets = participants
 .filter((p) => p?.admin)
 .filter((p) => p.id !== botJid && p.id !== sender)
 .map((p) => p.id)

 if (!targets.length) {
 return cht.reply("Gak ada admin lain yang bisa gue turunin (sisanya cuma lu/bot doang).")
 }

 const infoLine = [
 `Total admin target: ${targets.length}`,
 `Catatan: WhatsApp biasanya gak ngizinin owner grup (superadmin) buat didemote.`
 ].join("\n")

 await cht.reply(
 `⚠️ *Kudeta dimulai!*\n` +
 `Gue bakal coba turunin *semua* admin (kecuali lu sama gue).\n\n` +
 infoLine
 )

 let ok = 0
 const fail = []

 for (const jid of targets) {
 const res = await Exp.groupParticipantsUpdate(cht.id, [jid], "demote").catch((e) => e)

 if (res instanceof Error) {
 fail.push({ jid, reason: res.message || "error" })
 } else {
 const isErrorObj =
 res &&
 typeof res === "object" &&
 !Array.isArray(res) &&
 (res.error || res.message)

 if (isErrorObj) {
 fail.push({ jid, reason: res.error || res.message || "error" })
 } else {
 ok++
 }
 }

 await sleep(1200)
 }

 const failLines = fail.map((f) => {
 const p = byId.get(f.jid)
 const role = p?.admin || "-"
 const num = f.jid.split("@")[0]
 return `- @${num} (role: ${role})`
 })

 const superOwnerHint =
 failLines.length &&
 fail.some((f) => (byId.get(f.jid)?.admin || "") === "superadmin")
 ? "\nKemungkinan besar yang status *superadmin* itu owner grup, dan WA emang gak ngizinin dia diturunin."
 : ""

 const failMentions = fail.map((f) => f.jid)

 await cht.reply(
 `✅ *Kudeta selesai.*\n` +
 `Berhasil diturunin: *${ok}/${targets.length} admin*\n` +
 `Gagal diturunin: *${fail.length}/${targets.length} admin*` +
 (failLines.length
 ? `\n\nYang gagal:\n${failLines.join("\n")}${superOwnerHint}`
 : ""),
 { mentions: failMentions }
 )
 }
 )
}
