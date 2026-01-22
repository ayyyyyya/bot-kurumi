const axiosMod = "axios".import()
const fs = "fs".import()
const crypto = "crypto".import()

const axios = axiosMod?.default || axiosMod

function rnd() {
  return crypto.randomBytes(8).toString("hex")
}

function getQuotedRaw(cht) {
  const c = cht || {}
  const cand = [c?.msg, c?.m, c?.message, c?.raw, c?.quoted?.msg, c?.quoted?.m, c?.quoted]
  for (const x of cand) if (x && x.key && typeof x.key === "object") return x
  return null
}

async function removeBgFromBuffer(imgBuf) {
  const base64 = Buffer.isBuffer(imgBuf) ? imgBuf.toString("base64") : Buffer.from(imgBuf).toString("base64")

  const res = await axios.post(
    "https://background-remover.com/removeImageBackground",
    {
      encodedImage: `data:image/jpeg;base64,${base64}`,
      title: "image.jpg",
      mimeType: "image/jpeg"
    },
    {
      timeout: 90000,
      maxBodyLength: Infinity,
      validateStatus: () => true,
      headers: {
        "sec-ch-ua-platform": `"Android"`,
        "user-agent":
          "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36 EdgA/143.0.0.0",
        "sec-ch-ua": `"Microsoft Edge";v="143", "Chromium";v="143", "Not A(Brand";v="24"`,
        "content-type": "application/json",
        "sec-ch-ua-mobile": "?1",
        accept: "*/*",
        origin: "https://background-remover.com",
        referer: "https://background-remover.com/upload",
        "accept-language": "id"
      }
    }
  )

  if (res.status >= 400) throw new Error(`HTTP ${res.status}`)
  const enc = res?.data?.encodedImageWithoutBackground
  if (!enc || typeof enc !== "string" || !enc.includes(",")) throw new Error("Response invalid / hasil kosong")

  const outB64 = enc.split(",")[1]
  const outBuf = Buffer.from(outB64, "base64")
  if (!outBuf.length) throw new Error("Output kosong")

  return outBuf
}

export default async function on({ cht, Exp, store, ev, is }) {
  ev.on(
    {
      cmd: ["removebg3", "rbg3"],
      listmenu: ["removebg3 (reply image)"],
      tag: "tools",
      energy: 30,
      premium: true,
      args: "Reply/kirim gambar yang mau dihapus background-nya",
      media: {
        type: ["image"],
        msg: "Reply/kirim gambarnya."
      }
    },
    async ({ cht, media }) => {
      const quoted = getQuotedRaw(cht)
      const opts = quoted ? { quoted } : {}

      await cht.react("⏳").catch(() => {})

      try {
        let imgBuf = media
        if (typeof imgBuf === "string") imgBuf = fs.readFileSync(imgBuf)
        if (!Buffer.isBuffer(imgBuf)) throw new Error("Media bukan buffer")

        const outBuf = await removeBgFromBuffer(imgBuf)

        await Exp.sendMessage(
          cht.id,
          {
            image: outBuf,
            caption: "✅ Background dihapus"
          },
          opts
        )

        await cht.react("✅").catch(() => {})
      } catch (e) {
        await cht.react("❌").catch(() => {})
        return cht.reply("🚨 Error: " + (e?.message || String(e)))
      }
    }
  )
}
