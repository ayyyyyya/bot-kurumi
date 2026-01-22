const axiosMod = "axios".import()
const axios = axiosMod?.default || axiosMod

function extractId(url) {
  try {
    const u = new URL(String(url || ""))
    const parts = u.pathname.split("/").filter(Boolean)
    const id = parts.pop()
    return id || null
  } catch {
    return null
  }
}

function getQuotedRaw(cht) {
  const c = cht || {}
  const cand = [c?.msg, c?.m, c?.message, c?.raw, c?.quoted?.msg, c?.quoted?.m, c?.quoted]
  for (const x of cand) if (x && x.key && typeof x.key === "object") return x
  return null
}

async function getGist(id) {
  const r = await axios.get(`https://api.github.com/gists/${id}`, {
    timeout: 30000,
    validateStatus: () => true,
    headers: {
      "user-agent": "Mozilla/5.0",
      accept: "application/vnd.github+json"
    }
  })
  if (r.status !== 200) throw new Error(`HTTP ${r.status}`)
  return r.data
}

export default async function on({ cht, Exp, store, ev, is }) {
  ev.on(
    {
      cmd: ["gits", "getgits"],
      listmenu: ["gits <link gist> [--doc]"],
      tag: "tools",
      energy: 5,
      args: "Masukkan link GitHub Gist. Tambahkan --doc untuk kirim sebagai document."
    },
    async ({ cht }) => {
      const input = (cht.q || "").trim()
      if (!input) return cht.reply("Contoh:\n.gits https://gist.github.com/user/ID\n.gits https://gist.github.com/user/ID --doc")

      const parts = input.split(/\s+/).filter(Boolean)
      const link = parts[0] || ""
      const asDoc = parts.includes("--doc")

      if (!/gist\.github\.com|api\.github\.com\/gists/.test(link)) {
        return cht.reply("⚠️ Masukan link GitHub Gist.\nTambahkan `--doc` untuk kirim sebagai document.")
      }

      const id = extractId(link) || link.split("/").pop()
      if (!id) return cht.reply("ID gist tidak ditemukan dari link itu.")

      const quoted = getQuotedRaw(cht)
      const opts = quoted ? { quoted } : {}

      await cht.react("⏳").catch(() => {})

      try {
        const data = await getGist(id)
        const filesObj = data?.files && typeof data.files === "object" ? data.files : {}
        const files = Object.values(filesObj)

        if (!files.length) {
          await cht.react("❌").catch(() => {})
          return cht.reply("Gist kosong / file tidak ditemukan.")
        }

        for (const file of files) {
          const name = file?.filename || "file.txt"
          const type = file?.type || "text/plain"
          const content = String(file?.content || "")

          if (asDoc) {
            const buffer = Buffer.from(content, "utf-8")
            await Exp.sendMessage(
              cht.id,
              {
                document: buffer,
                fileName: name,
                mimetype: type
              },
              opts
            )
          } else {
            const text = content.length > 4000 ? content.slice(0, 4000) + "\n\n[terpotong]" : content
            await Exp.sendMessage(cht.id, { text }, opts)
          }
        }

        await cht.react("✅").catch(() => {})
      } catch (e) {
        await cht.react("❌").catch(() => {})
        return cht.reply("❌ Error: " + (e?.message || String(e)))
      }
    }
  )
}
