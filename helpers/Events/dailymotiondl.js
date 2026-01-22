const axiosMod = await "axios".import()
const axios = axiosMod?.default || axiosMod

async function daily(url) {
  const res = await axios.post(
    "https://vidomon.com/wp-json/aio-dl/video-data/",
    { url },
    {
      headers: {
        "content-type": "application/json",
        "origin": "https://vidomon.com",
        "referer": "https://vidomon.com/"
      }
    }
  )
  return res.data
}

export default async function on({ ev }) {
  ev.on(
    {
      cmd: ["dailymotion","daily"],
      tag: "downloader",
      energy: 35,
      args: 1
    },
    async ({ cht, args, reply }) => {
      const url = args[0]
      try {
        cht.react("⏳")
        const data = await daily(url)
        const vid = data?.medias?.[0]?.url || data?.url
        if (!vid) return reply("Gagal mengambil video.")
        await cht.sendFile(vid, "dailymotion.mp4", data?.title || "Video")
        cht.react("✅")
      } catch (e) {
        cht.react("❌")
        reply("Gagal memproses link.")
      }
    }
  )
}
