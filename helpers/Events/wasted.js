const fs = "fs".import()
const axiosMod = "axios".import()

const axios = axiosMod?.default || axiosMod

const rand = () => Math.random().toString(16).slice(2)
const boundary = () => "----WebKitFormBoundary" + rand() + rand()

function buildMultipart({ fields = {}, fileField, filename, contentType, fileBuffer }) {
  const b = boundary()
  const chunks = []

  const push = (x) => chunks.push(Buffer.isBuffer(x) ? x : Buffer.from(String(x)))

  for (const [k, v] of Object.entries(fields)) {
    push(`--${b}\r\n`)
    push(`Content-Disposition: form-data; name="${k}"\r\n\r\n`)
    push(String(v))
    push(`\r\n`)
  }

  push(`--${b}\r\n`)
  push(
    `Content-Disposition: form-data; name="${fileField}"; filename="${filename}"\r\n` +
      `Content-Type: ${contentType}\r\n\r\n`
  )
  push(fileBuffer)
  push(`\r\n`)
  push(`--${b}--\r\n`)

  const body = Buffer.concat(chunks)
  return { body, boundary: b }
}

async function wastedGenerator(inputBuffer, options = {}) {
  if (!inputBuffer) throw new Error("Input gambar kosong")

  const buffer = Buffer.isBuffer(inputBuffer)
    ? Buffer.from(inputBuffer)
    : Buffer.from(new Uint8Array(inputBuffer))

  const { bannerTopPercent = 50, bannerWidthPercent = 80, isPublic = false } = options

  const { body, boundary: b } = buildMultipart({
    fields: {
      bannerTopPercent: String(bannerTopPercent),
      bannerWidthPercent: String(bannerWidthPercent),
      isPublic: String(isPublic)
    },
    fileField: "image",
    filename: "image.jpg",
    contentType: "image/jpeg",
    fileBuffer: buffer
  })

  const res = await axios.post("https://wastedgenerator.com/generate", body, {
    headers: {
      "Content-Type": `multipart/form-data; boundary=${b}`,
      "Content-Length": String(body.length),
      origin: "https://wastedgenerator.com",
      referer: "https://wastedgenerator.com/",
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107 Safari/537.36"
    },
    maxBodyLength: Infinity,
    timeout: 60000
  })

  const data = res?.data && typeof res.data === "object" ? res.data : (() => {
    try {
      return JSON.parse(String(res.data || ""))
    } catch {
      return null
    }
  })()

  if (!data?.success || !data?.filePath) throw new Error("API gagal membuat gambar")

  return { url: "https://wastedgenerator.com" + data.filePath }
}

function getQuotedRaw(cht) {
  const c = cht || {}
  const cand = [c?.msg, c?.m, c?.message, c?.raw, c?.quoted?.msg, c?.quoted?.m, c?.quoted]
  for (const x of cand) {
    if (x && x.key && typeof x.key === "object") return x
  }
  return null
}

export default async function on({ cht, Exp, store, ev, is }) {
  ev.on(
    {
      cmd: ["wasted"],
      listmenu: ["wasted"],
      tag: "maker",
      premium: true,
      energy: 7,
      media: { type: ["image"], msg: "Reply/kirim gambarnya." }
    },
    async ({ cht, media }) => {
      await cht.react("⏳").catch(() => {})

      try {
        let imgBuffer = media
        if (typeof imgBuffer === "string") imgBuffer = fs.readFileSync(imgBuffer)
        if (!Buffer.isBuffer(imgBuffer)) throw new Error("Media bukan buffer")

        const result = await wastedGenerator(imgBuffer, {
          bannerTopPercent: 50,
          bannerWidthPercent: 80,
          isPublic: false
        })

        const quoted = getQuotedRaw(cht)
        const opts = quoted ? { quoted } : {}

        await Exp.sendMessage(
          cht.id,
          { image: { url: result.url }, caption: "🔫 *Wasted!*" },
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
