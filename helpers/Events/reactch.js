/*  ✦ CAP HYTAM LEGAM DAKIAN KEK ARANG ✦

   Berbagi fitur SC Bella

   NAMA FITUR :

   SOURCE     :

   CREATOR    : AlbertLazovsky

   CONTACT    : 083846359386

   LINK GC    : https://chat.whatsapp.com/GGjR1bhh12vBsXtkkcgPAo

   LINK CH    : https://whatsapp.com/channel/0029Vb71Xk7EFeXeX06Gpf1

*/

const API_KEY = "3af810489cc38ce48c7c6edf3c675d52c6478998e76594138402700b6c93d8d0"

function clean(s) {

  return String(s || "").trim()

}

function pickLinkAndEmojis(raw) {

  const t = clean(raw)

  if (!t) return { link: "", emojis: [] }

  const parts = t.split(/\s+/)

  const link = parts.shift() || ""

  const rest = parts.join(" ")

  const emojis = rest

    .replace(/,/g, " ")

    .split(/\s+/)

    .map((x) => clean(x))

    .filter(Boolean)

  return { link, emojis }

}

export default async function on({ cht, Exp, store, ev, is }) {

  ev.on(

    {

      cmd: ["rch", "react"],

      tag: "tools",

      args: "Contoh: .rch <link_channel> 😆 😭 🔥 / atau pakai koma 😆,😭,🔥",

      isOwner: true,

      energy: 1

    },

    async ({ cht }) => {

      const { link, emojis } = pickLinkAndEmojis(cht.q)

      if (!link) return cht.reply("Masukin link channelnya.\nContoh: .rch <link> 😆 😭 🔥")

      if (!emojis.length) return cht.reply("Masukin emoji-nya.\nContoh: .rch <link> 😆 😭 🔥")

      await cht.react("⏳").catch(() => {})

      try {

        const url =

          `https://react.whyux-xec.my.id/api/rch?link=${encodeURIComponent(link)}` +

          `&emoji=${encodeURIComponent(emojis.join(","))}`

        const r = await fetch(url, {

          headers: { "x-api-key": API_KEY, "user-agent": "Mozilla/5.0", accept: "application/json,*/*" }

        })

        const text = await r.text()

        let json = null

        try { json = JSON.parse(text) } catch {}

        if (!r.ok) {

          await cht.react("❌").catch(() => {})

          return cht.reply(`Gagal (${r.status}).\n${clean(json?.message || json?.error || text || "Unknown error")}`)

        }

        const okMsg =

          clean(json?.message) ||

          clean(json?.result?.message) ||

          "Berhasil react."

        await cht.react("✅").catch(() => {})

        return cht.reply(

          `✅ Sukses.\n` +

          `• Link: ${link}\n` +

          `• Emoji: ${emojis.join(", ")}\n` +

          `• Info: ${okMsg}`

        )

      } catch (e) {

        await cht.react("❌").catch(() => {})

        return cht.reply("Gagal ngontak API.\nDetail: " + (e?.message || String(e)))

      }

    }

  )

}