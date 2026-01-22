/*  ✦ CAP HYTAM LEGAM DAKIAN KEK ARANG ✦

   Berbagi fitur SC Bella

   NAMA FITUR : LIST ONLINE (STORE.PRESENCES)

   SOURCE     : -

   CREATOR    : AlbertLazovsky

   CONTACT    : 083846359386

   LINK GC    : https://chat.whatsapp.com/GGjR1bhh12vBsXtkkcgPAo

   LINK CH    : https://whatsapp.com/channel/0029Vb71Xk7EFeXeX06Gpf1

*/

export default async function on({ Exp, store, ev }) {

  ev.on(

    {

      cmd: ["listonline", "liston", "online", "onlinelist"],

      listmenu: ["listonline", "liston"],

      tag: "owner",

      isOwner: true,

      args: 0

    },

    async ({ cht, args }) => {

      const isGroup = !!cht?.id && String(cht.id).endsWith("@g.us")

      if (!isGroup) return cht.reply("Fitur ini hanya bisa dipakai di grup.")

      const argv = Array.isArray(args)

        ? args

        : (typeof args === "string" ? args.trim().split(/\s+/).filter(Boolean) : [])

      const pickTarget = (v) => {

        const s = String(v || "").trim()

        if (/@g\.us$/i.test(s)) return s

        return null

      }

      const wantScan = argv.some(v => {

        const s = String(v || "").toLowerCase()

        return s === "scan" || s === "a" || s === "agresif"

      })

      const wantFull = argv.some(v => {

        const s = String(v || "").toLowerCase()

        return s === "full" || s === "all"

      })

      const target = pickTarget(argv[0]) || cht.id

      const meta = await Exp.groupMetadata(target).catch(() => null)

      const subject = meta?.subject || (target === cht.id ? "Grup ini" : target)

      const getJid = (p) => p?.id || p?.jid || p?.participant || null

      const participants = Array.isArray(meta?.participants) ? meta.participants : []

      const botJid = Exp?.user?.id || Exp?.user?.jid || ""

      const pickName = (jid) => {

        try {

          if (Exp?.func?.getName) return Exp.func.getName(jid)

        } catch {}

        return String(jid || "").split("@")[0] || "Unknown"

      }

      const fmt = (jid) => "@" + String(jid).replace(/@.+/, "")

      const delay = (ms) => new Promise(r => setTimeout(r, ms))

      if (wantScan && typeof Exp?.presenceSubscribe === "function") {

        const ids = participants.map(getJid).filter(Boolean).filter(j => j !== botJid)

        const cap = wantFull ? ids.length : Math.min(ids.length, 160)

        const targets = ids.length > cap ? ids.slice(0, cap) : ids

        let idx = 0

        const conc = targets.length > 120 ? 10 : 6

        const worker = async () => {

          while (true) {

            const i = idx++

            if (i >= targets.length) break

            try {

              await Exp.presenceSubscribe(targets[i])

            } catch {}

            await delay(90 + (i % 10 === 0 ? 130 : 0))

          }

        }

        await Promise.all(Array.from({ length: conc }, () => worker())).catch(() => null)

        await delay(1200)

      }

      const presGroup = store?.presences?.[target]

      if (!presGroup || typeof presGroup !== "object") {

        return cht.reply(

          [

            "Tidak ada data presence yang masuk.",

            "Coba:",

            "1) restart bot (setelah store.js diganti)",

            "2) jalankan: .liston scan",

            "Catatan: presence tergantung privacy WhatsApp, jadi tidak selalu ada."

          ].join("\n")

        )

      }

      const now = Date.now()

      const ttl = 5 * 60 * 1000

      const rows = []

      for (const jid of Object.keys(presGroup)) {

        const p = presGroup[jid]

        const t = Number(p?._t || 0)

        if (!t || (now - t) > ttl) continue

        const s = String(p?.lastKnownPresence || p?.presence || "").toLowerCase()

        let bucket = "other"

        let label = s ? s.toUpperCase() : "UNKNOWN"

        if (s === "composing") {

          bucket = "typing"

          label = "TYPING"

        } else if (s === "recording") {

          bucket = "recording"

          label = "RECORDING"

        } else if (s === "available") {

          bucket = "online"

          label = "ONLINE"

        } else if (s === "unavailable") {

          bucket = "offline"

          label = "OFFLINE"

        }

        rows.push({ jid, name: pickName(jid), bucket, label })

      }

      const rank = { typing: 1, recording: 2, online: 3, offline: 4, other: 5 }

      rows.sort((a, b) => (rank[a.bucket] - rank[b.bucket]) || a.name.localeCompare(b.name))

      const buckets = {

        typing: rows.filter(v => v.bucket === "typing"),

        recording: rows.filter(v => v.bucket === "recording"),

        online: rows.filter(v => v.bucket === "online"),

        offline: rows.filter(v => v.bucket === "offline"),

        other: rows.filter(v => v.bucket === "other")

      }

      const render = (title, arr, emptyText, cap = 40) => {

        const show = arr.slice(0, cap)

        const more = arr.length - show.length

        const lines = show.map((v, i) => `${i + 1}. ${fmt(v.jid)} — ${v.name}`)

        const body = lines.length ? lines : [emptyText]

        return [

          `\n╭─〔 ${title} 〕`,

          ...body.map(x => `│ ${x}`),

          ...(more > 0 ? [`│ … dan ${more} lainnya`] : []),

          "╰────────────"

        ].join("\n")

      }

      const mentionList = Array.from(

        new Set([...buckets.typing, ...buckets.recording, ...buckets.online].map(v => v.jid))

      ).slice(0, 120)

      const text =

        [

          "╭─〔 LIST ONLINE 〕",

          `│ Grup   : ${subject}`,

          `│ TTL    : 5 menit`,

          `│ Typing : ${buckets.typing.length}`,

          `│ Record : ${buckets.recording.length}`,

          `│ Online : ${buckets.online.length}`,

          "╰────────────",

          "Catatan: Ini berdasarkan presence event yang berhasil masuk (privacy bisa bikin kosong)."

        ].join("\n") +

        render("TYPING", buckets.typing, "Tidak ada yang terdeteksi mengetik.") +

        render("RECORDING", buckets.recording, "Tidak ada yang terdeteksi merekam.") +

        render("ONLINE", buckets.online, "Tidak ada yang terdeteksi online.") +

        render("OFFLINE", buckets.offline, "Tidak ada data offline.") +

        render("OTHER", buckets.other, "Tidak ada data lainnya.")

      await Exp.sendMessage(cht.id, { text, mentions: mentionList }, { quoted: cht }).catch(() => cht.reply(text))

    }

  )

}