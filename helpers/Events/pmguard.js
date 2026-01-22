/*  ✦ CAP HYTAM LEGAM DAKIAN KEK ARANG ✦

   Berbagi fitur SC Bella

   NAMA FITUR :
   SOURCE     :

   CREATOR    : AlbertLazovsky
   CONTACT    : 083846359386
   LINK GC    : https://chat.whatsapp.com/GGjR1bhh12vBsXtkkcgPAo
   LINK CH    : https://whatsapp.com/channel/0029Vb71Xk7EFeXeX06Gpf1
   NOTE       : Taruh logic dibawah ini ke helpers/cilent.js blok try sebelum if (cht.memories?.banned && !is.owner) {
      if (cht.memories.banned * 1 > Date.now()) return;
      func.archiveMemories.delItem(cht.sender, 'banned');
    }

Nih Logicnya
    Data.pmLog ??= {}
  if (!is.group) {
    const jid = String(cht?.sender || "")
  if (jid && jid !== "status@broadcast") {
    const key = jid.split("@")[0]
    const now = Date.now()
    const cur = Data.pmLog[key] ??= { jid, first: now, last: now, count: 0, lastText: "" }
    cur.jid = jid
    cur.first = cur.first || now
    cur.last = now
    cur.count = (cur.count || 0) + 1
    const t = String(cht?.q || cht?.text || "").replace(/\s+/g, " ").trim()
    cur.lastText = t ? (t.length > 80 ? t.slice(0, 80) + "…" : t) : cur.lastText
  }
}

*/
const fs = "fs".import();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export default async function on({ cht, Exp, store, ev, is }) {
  const ownerNums = (global.owner || [])
    .map((v) => String(v).replace(/[^\d]/g, ""))
    .filter(Boolean)

  const ownerJids = ownerNums.map((n) => n + "@s.whatsapp.net")

  function isOwnerJid(jid) {
    return ownerJids.includes(String(jid || ""))
  }

  function clean(s) {
    return String(s || "").replace(/\s+/g, " ").trim()
  }

  function safeText(s, max = 70) {
    const t = clean(s)
    if (!t) return "-"
    return t.length > max ? t.slice(0, max) + "..." : t
  }

  function toJid(x) {
    const raw = clean(x)
    if (!raw) return ""
    if (raw.includes("@s.whatsapp.net")) return raw
    const num = raw.replace(/[^\d]/g, "")
    if (!num) return ""
    const fixed = num.startsWith("0") ? "62" + num.slice(1) : num
    return fixed + "@s.whatsapp.net"
  }

  function pickTarget(cht, args) {
    const qSender = cht?.quoted?.sender ? String(cht.quoted.sender) : ""
    if (qSender) return qSender

    const m0 = Array.isArray(cht?.mention) ? cht.mention[0] : ""
    if (m0) return String(m0)

    const a0 = args?.[0] ? toJid(args[0]) : ""
    if (a0) return a0

    return ""
  }

  function fmtClock(ts) {
    const n = Number(ts || 0)
    if (!n) return "-"
    return new Date(n).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
  }

  function fmtAgo(ts) {
    const n = Number(ts || 0)
    if (!n) return "-"
    const d = Date.now() - n
    const s = Math.floor(d / 1000)
    if (s < 60) return `${s}d lalu`
    const m = Math.floor(s / 60)
    if (m < 60) return `${m}m lalu`
    const h = Math.floor(m / 60)
    if (h < 48) return `${h}j lalu`
    const day = Math.floor(h / 24)
    return `${day}h lalu`
  }

  function getPM() {
    Data.pmLog ??= {}
    return Data.pmLog
  }

  function headerBox(title, lines) {
    const out = []
    out.push(`╭─〔 ${title} 〕`)
    for (const l of lines) out.push(`│ ${l}`)
    out.push(`╰──────────────`)
    return out.join("\n")
  }

  function buildListText(arr, limit) {
    const out = []
    out.push(`╭─〔 LIST TERBARU (Top ${limit}) 〕`)
    for (let i = 0; i < arr.length; i++) {
      const it = arr[i]
      const jid = String(it.jid || "")
      const num = jid.split("@")[0] || "-"
      const cnt = Number(it.count || 0)
      const mark = it.blocked ? "⛔" : "✅"
      const lastAgo = fmtAgo(it.last)
      const snip = safeText(it.lastText, 72)
      out.push(`│ ${i + 1}. ${mark} @${num}  • ${cnt}x  • ${lastAgo}`)
      out.push(`│    └─ ${snip}`)
    }
    out.push(`╰──────────────`)
    return out.join("\n")
  }

  function footerHelp() {
    return (
      `\n` +
      `╭─〔 PERINTAH 〕\n` +
      `│ • .pmlist (default 15)\n` +
      `│ • .pmlist 30 / .pmlist --all\n` +
      `│ • .pmlist --blocked / --unblocked\n` +
      `│ • .pmblock (reply/tag/nomor)\n` +
      `│ • .pmblockall\n` +
      `│ • .pmclear\n` +
      `╰──────────────`
    )
  }

  ev.on(
    {
      cmd: ["pmlist"],
      listmenu: ["pmlist"],
      tag: "owner",
      owner: true
    },
    async ({ cht }) => {
      const pm = getPM()
      const keys = Object.keys(pm || {})
      const raw = clean(cht.q)

      const wantAll = /\b--all\b/i.test(raw)
      const wantBlocked = /\b--blocked\b/i.test(raw)
      const wantUnblocked = /\b--unblocked\b/i.test(raw)

      let limit = 15
      const m = raw.match(/\b(\d{1,3})\b/)
      if (m?.[1]) {
        const n = parseInt(m[1], 10)
        if (Number.isFinite(n) && n > 0 && n <= 100) limit = n
      }
      if (wantAll) limit = 100

      if (!keys.length) {
        const diag =
          headerBox("PM MONITOR", [
            "Data PM masih kosong.",
            "Ini bukan error command.",
            "Biasanya logger PM di client.js belum kepasang / kena return duluan."
          ]) +
          `\n\n` +
          headerBox("SOLUSI CEPAT", [
            "Pasang logger PM di client.js BEFORE autoblock return.",
            "Habis itu tunggu ada orang PM bot (bot ga perlu bales).",
            "Baru jalankan .pmlist lagi."
          ]) +
          footerHelp()

        return Exp.sendMessage(cht.id, { text: diag }, { quoted: cht })
      }

      let arr = keys
        .map((jid) => pm[jid])
        .filter(Boolean)
        .sort((a, b) => (b.last || 0) - (a.last || 0))

      if (wantBlocked) arr = arr.filter((x) => !!x.blocked)
      if (wantUnblocked) arr = arr.filter((x) => !x.blocked)

      const totalSender = arr.length
      let totalMsg = 0
      for (const it of arr) totalMsg += Number(it.count || 0)

      const top = arr.slice(0, limit)
      const mentions = top.map((x) => x.jid).filter(Boolean)

      const head =
        headerBox("PM MONITOR", [
          `Total pengirim : ${totalSender}`,
          `Total pesan    : ${totalMsg}`,
          `Update         : ${fmtClock(Date.now())}`
        ]) +
        `\n\n` +
        buildListText(top, top.length)

      const text = head + footerHelp()
      return Exp.sendMessage(cht.id, { text, mentions }, { quoted: cht })
    }
  )

  ev.on(
    {
      cmd: ["pmblock"],
      listmenu: ["pmblock"],
      tag: "owner",
      owner: true
    },
    async ({ cht, args }) => {
      const target = pickTarget(cht, args)
      if (!target) {
        const t =
          headerBox("PM BLOCK", [
            "Target belum kebaca.",
            "Pakai salah satu cara di bawah."
          ]) +
          `\n\n` +
          `• .pmblock (reply pesan target)\n` +
          `• .pmblock @tag\n` +
          `• .pmblock 08xxxx / 62xxxx\n` +
          footerHelp()
        return Exp.sendMessage(cht.id, { text: t }, { quoted: cht })
      }

      if (isOwnerJid(target)) {
        return Exp.sendMessage(cht.id, { text: "Itu owner. Ga gue block." }, { quoted: cht })
      }

      await cht.react("⏳").catch(() => {})

      let ok = true
      try {
        await Exp.updateBlockStatus(target, "block")
      } catch {
        ok = false
      }

      const pm = getPM()
      pm[target] ??= { jid: target, count: 0, first: Date.now(), last: 0, lastText: "", blocked: false, blockedAt: 0 }
      pm[target].blocked = ok
      pm[target].blockedAt = ok ? Date.now() : (pm[target].blockedAt || 0)

      await cht.react(ok ? "✅" : "❌").catch(() => {})

      const num = target.split("@")[0]
      const msg =
        headerBox("PM BLOCK", [
          ok ? `Sukses: @${num} diblock.` : `Gagal block: @${num}.`,
          `Waktu: ${fmtClock(Date.now())}`
        ])

      return Exp.sendMessage(cht.id, { text: msg, mentions: [target] }, { quoted: cht })
    }
  )

  ev.on(
    {
      cmd: ["pmblockall"],
      listmenu: ["pmblockall"],
      tag: "owner",
      owner: true
    },
    async ({ cht }) => {
      const pm = getPM()
      const keys = Object.keys(pm || {})
      if (!keys.length) return Exp.sendMessage(cht.id, { text: "Data PM kosong." }, { quoted: cht })

      await cht.react("⏳").catch(() => {})

      let ok = 0
      let skip = 0
      let fail = 0

      for (const jid of keys) {
        if (!jid || jid === "status@broadcast") {
          skip++
          continue
        }
        if (isOwnerJid(jid)) {
          skip++
          continue
        }
        const rec = pm[jid] || {}
        if (rec.blocked) {
          skip++
          continue
        }

        let done = true
        try {
          await Exp.updateBlockStatus(jid, "block")
        } catch {
          done = false
        }

        pm[jid] ??= { jid, count: 0, first: Date.now(), last: 0, lastText: "", blocked: false, blockedAt: 0 }
        pm[jid].blocked = done
        pm[jid].blockedAt = done ? Date.now() : (pm[jid].blockedAt || 0)

        if (done) ok++
        else fail++

        await sleep(850)
      }

      await cht.react(fail ? "❌" : "✅").catch(() => {})

      const msg =
        headerBox("PM BLOCKALL", [
          `Berhasil : ${ok}`,
          `Gagal    : ${fail}`,
          `Skip     : ${skip}`,
          `Waktu    : ${fmtClock(Date.now())}`
        ]) + footerHelp()

      return Exp.sendMessage(cht.id, { text: msg }, { quoted: cht })
    }
  )

  ev.on(
    {
      cmd: ["pmclear"],
      listmenu: ["pmclear"],
      tag: "owner",
      owner: true
    },
    async ({ cht }) => {
      Data.pmLog = {}
      const msg = headerBox("PM CLEAR", ["Data PM sudah dibersihkan."]) + footerHelp()
      return Exp.sendMessage(cht.id, { text: msg }, { quoted: cht })
    }
  )
}