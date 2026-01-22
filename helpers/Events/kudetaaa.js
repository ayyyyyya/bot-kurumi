const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export default async function on({ cht, Exp, ev }) {
 ev.on(
 {
 cmd: ["kudeta", "kudetagc"],
 listmenu: ["kudeta(gc)"],
 tag: "group",
 isGroup: true,
 isOwner: true,
 isBotAdmin: true,
 energy: 5
 },
 async ({ cht }) => {
 const botNumber = Exp.number || Exp.decodeJid?.(Exp.user?.id) || ""
 const sender = cht.sender

 let participants = Exp.groupMembers
 if (!Array.isArray(participants) || !participants.length) {
 const meta = await Exp.groupMetadata(cht.id).catch(() => null)
 participants = meta?.participants || []
 }

 if (!Array.isArray(participants) || !participants.length) {
 return cht.reply("Gue gak bisa ambil data member grupnya. Coba lagi bentar.")
 }

 const targets = participants
 .filter((p) => p?.admin)
 .filter((p) => p.id !== botNumber && p.id !== sender)
 .filter((p) => p.admin !== "superadmin")
 .map((p) => p.id)

 if (!targets.length) return cht.reply("Gak ada admin lain yang bisa gue turunin (atau sisanya owner grup).")

 await cht.reply(
 `⚠️ *Kudeta dimulai!*\n` +
 `Gue turunin ${targets.length} admin...\n` +
 `Catatan: owner grup (superadmin) gak bisa diturunin.`
 )

 let ok = 0
 const fail = []

 for (const jid of targets) {
 const res = await Exp.groupParticipantsUpdate(cht.id, [jid], "demote").catch((e) => e)
 if (res && typeof res === "object" && res?.message) {
 fail.push(jid)
 } else {
 ok++
 }
 await sleep(1200)
 }

 const failTxt = fail.length ? `\n\nYang gagal: ${fail.slice(0, 12).map((v) => `@${v.split("@")[0]}`).join(", ")}` : ""
 await cht.reply(
 `✅ *Selesai.*\n` +
 `Berhasil: ${ok}/${targets.length}\n` +
 `Gagal: ${fail.length}/${targets.length}` +
 failTxt,
 { mentions: fail }
 )
 }
 )
}
