const YTMusicMod = "ytmusic-api".import()

const YTMusicClass =

  typeof YTMusicMod === "function"

    ? YTMusicMod

    : typeof YTMusicMod?.default === "function"

      ? YTMusicMod.default

      : YTMusicMod?.YTMusic || null

let ytmusicPromise = null

async function getYTMusic() {

  if (!YTMusicClass) throw new Error("Module ytmusic-api nggak kebaca")

  if (!ytmusicPromise) {

    const inst = new YTMusicClass()

    ytmusicPromise = inst.initialize().then(() => inst)

  }

  return ytmusicPromise

}

async function searchSongs(q, limit = 3) {

  const api = await getYTMusic()

  const res = await api.search(q)

  const songs = (res || [])

    .filter((v) => v?.type === "SONG")

    .slice(0, limit)

    .map((v) => ({

      title: v.name || "-",

      artist: v.artist?.name || "",

      url: v.videoId ? `https://music.youtube.com/watch?v=${v.videoId}` : "",

      thumbnail: v.thumbnails?.length ? v.thumbnails[v.thumbnails.length - 1].url : ""

    }))

  if (!songs.length) throw new Error("Lagu nggak ketemu")

  return songs

}

function getQuotedRaw(cht) {

  const c = cht || {}

  const cand = [c?.msg, c?.m, c?.message, c?.raw, c?.quoted?.msg, c?.quoted?.m, c?.quoted]

  for (const x of cand) if (x && x.key && typeof x.key === "object") return x

  return null

}

export default async function on({ cht, Exp, store, ev, is }) {

  ev.on(

    {

      cmd: ["ytm-s", "ytmusic"],

      listmenu: ["ytm-s <judul[,limit]>"],

      tag: "search",

      energy: 20,

      args: "Contoh: .ytm-s Kimi No Toriko,6"

    },

    async ({ cht }) => {

      const raw =

        (cht.q || "").trim() ||

        (cht.quoted?.text || "").trim() ||

        (cht.quoted?.caption || "").trim()

      if (!raw) {

        return cht.reply("Contoh:\n.ytm-s Kimi No Toriko,6")

      }

      const [queryPart, limitPart] = raw.split(",")

      const query = (queryPart || "").trim()

      const lim = parseInt((limitPart || "").trim(), 10)

      const limit = Number.isFinite(lim) && lim > 0 && lim <= 10 ? lim : 3

      if (!query) return cht.reply("Isi judul/keyword lagunya dulu.")

      const quoted = getQuotedRaw(cht)

      const opts = quoted ? { quoted } : {}

      await cht.react("⏳").catch(() => {})

      try {

        const results = await searchSongs(query, limit)

        const caption = results

          .map(

            (v, i) =>

              `*${i + 1}. ${v.title}*\n` +

              `• Artist : ${v.artist || "-"}\n` +

              (v.url ? `• Link   : ${v.url}` : "")

          )

          .join("\n\n")

        const thumb = results[0]?.thumbnail || null

        if (thumb) {

          await Exp.sendMessage(

            cht.id,

            {

              image: { url: thumb },

              caption

            },

            opts

          )

        } else {

          await Exp.sendMessage(cht.id, { text: caption }, opts)

        }

        await cht.react("✅").catch(() => {})

      } catch (e) {

        await cht.react("❌").catch(() => {})

        return cht.reply("Error: " + (e?.message || String(e)))

      }

    }

  )

}

