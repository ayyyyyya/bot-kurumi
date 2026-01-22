/* ✦ CAP HYTAM LEGAM DAKIAN KEK ARANG ✦

 Berbagi fitur SC Bella

 NAMA FITUR : CEK BAILEYS (PRESENCE CAPABILITY)
 SOURCE : -

 CREATOR : AlbertLazovsky
 CONTACT : 083846359386
 LINK GC : https://chat.whatsapp.com/GGjR1bhh12vBsXtkkcgPAo
 LINK CH : https://whatsapp.com/channel/0029Vb71Xk7EFeXeX06Gpf1
*/

export default async function on({ Exp, store, ev }) {
 ev.on(
 {
 cmd: ["cekbaileys", "checkbaileys", "cekpresence", "checkpresence"],
 tag: "owner",
 isOwner: true,
 args: 0
 },
 async ({ cht }) => {
 const fsMod = await "fs".import()
 const fs = fsMod?.default || fsMod

 let dep = "-"
 let ver = "-"
 let name = "-"
 try {
 const p = process.cwd() + "/package-lock.json"
 if (fs?.existsSync?.(p)) {
 const raw = fs.readFileSync(p, "utf8")
 const lock = JSON.parse(raw)
 dep = lock?.packages?.[""]?.dependencies?.["@whiskeysockets/baileys"] ?? "-"
 const nodePkg = lock?.packages?.["node_modules/@whiskeysockets/baileys"]
 ver = nodePkg?.version ?? "-"
 name = nodePkg?.name ?? "-"
 }
 } catch {}

 const hasSockEv = !!Exp?.ev
 const hasPresenceSubscribe = typeof Exp?.presenceSubscribe === "function"
 const hasSendPresenceUpdate = typeof Exp?.sendPresenceUpdate === "function"

 const pres = store?.presences
 const presType = pres ? (Array.isArray(pres) ? "array" : typeof pres) : "missing"
 const presKeys = pres && typeof pres === "object" ? Object.keys(pres) : []
 const groupKeys = presKeys.filter(k => String(k).endsWith("@g.us"))
 const sampleGroups = groupKeys.slice(0, 5)
 const chatKey = cht?.id
 const chatHas = !!(pres && chatKey && pres[chatKey])

 const out = [
 "╭─〔 CEK BAILEYS / PRESENCE 〕",
 `│ Dep baileys : ${dep}`,
 `│ Package : ${name}`,
 `│ Version : ${ver}`,
 "├────────────",
 `│ Exp.ev : ${hasSockEv ? "ADA" : "TIDAK ADA"}`,
 `│ Exp.presenceSubscribe : ${hasPresenceSubscribe ? "ADA" : "TIDAK ADA"}`,
 `│ Exp.sendPresenceUpdate : ${hasSendPresenceUpdate ? "ADA" : "TIDAK ADA"}`,
 "├────────────",
 `│ store.presences : ${presType}`,
 `│ keys(presences) : ${presKeys.length}`,
 `│ group keys : ${groupKeys.length}`,
 `│ presences[chat] : ${chatHas ? "ADA" : "KOSONG"}`,
 sampleGroups.length ? "├────────────" : null,
 sampleGroups.length ? "│ contoh group keys:" : null,
 ...sampleGroups.map((v, i) => `│ ${i + 1}. ${v}`),
 "╰────────────",
 "",
 "Catatan:",
 "1) Tidak ada API resmi WhatsApp untuk 'list online grup'.",
 "2) store.presences[gid] baru terisi kalau bot menerima presence update (biasanya setelah subscribe per user & tergantung privacy)."
 ].filter(Boolean).join("\n")

 return cht.reply(out)
 }
 )
}
