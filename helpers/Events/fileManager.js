const fs = "fs".import()
const path = "path".import()

const TARGET_DIR = "./helpers/Events"

function safeName(name) {
  const raw = String(name || "").trim()
  if (!raw) return null
  const cleaned = raw.replace(/[^a-zA-Z0-9._-]/g, "_")
  if (!cleaned) return null
  if (!cleaned.endsWith(".js")) return cleaned + ".js"
  return cleaned
}

function eventFilePath(name) {
  const safe = safeName(name)
  if (!safe) return null
  return path.join(TARGET_DIR, safe)
}

export default async function on({ cht, Exp, store, ev, is }) {
  const ownerGuard = () => {
    if (!is || (!is.owner && !is.creator && !is.me)) {
      cht.reply("Fitur ini khusus owner bot.")
      return false
    }
    return true
  }

  ev.on(
    {
      cmd: ["eventwrite", "addevent"],
      listmenu: ["eventwrite <nama.js> | <isi>"],
      tag: "tools",
      energy: 0,
      premium: false,
      args: "eventwrite nama.js | isi file"
    },
    async ({ cht }) => {
      if (!ownerGuard()) return

      const raw = (cht.q || "").trim()
      const [namePart, ...rest] = raw.split("|")
      if (!namePart || rest.length === 0) {
        return cht.reply("Format: .eventwrite nama.js | isi file")
      }

      const name = namePart.trim()
      const content = rest.join("|").trim()

      if (!content) return cht.reply("Isi file kosong.")

      const fp = eventFilePath(name)
      if (!fp) return cht.reply("Nama file tidak valid.")

      try {
        fs.writeFileSync(fp, content, "utf8")
        return cht.reply(`Event berhasil dibuat.\nNama: ${path.basename(fp)}`)
      } catch (e) {
        return cht.reply("Gagal membuat file: " + (e?.message || e))
      }
    }
  )

  ev.on(
    {
      cmd: ["eventread", "readevent"],
      listmenu: ["eventread <nama.js>"],
      tag: "tools",
      energy: 0,
      premium: false,
      args: "eventread <nama.js>"
    },
    async ({ cht }) => {
      if (!ownerGuard()) return

      const name = (cht.q || "").trim()
      if (!name) return cht.reply("Masukkan nama file.")

      const fp = eventFilePath(name)
      if (!fp) return cht.reply("Nama file tidak valid.")
      if (!fs.existsSync(fp)) return cht.reply("File tidak ditemukan.")

      try {
        const data = fs.readFileSync(fp, "utf8")
        const max = 3500
        const out = data.length > max ? data.slice(0, max) + "\n\n[...dipotong]" : data
        return cht.reply(`Isi event: ${path.basename(fp)}\n\n${out}`)
      } catch (e) {
        return cht.reply("Gagal membaca file: " + (e?.message || e))
      }
    }
  )

  ev.on(
    {
      cmd: ["eventdel", "delevent", "rmevent"],
      listmenu: ["eventdel <nama.js>"],
      tag: "tools",
      energy: 0,
      premium: false,
      args: "eventdel <nama.js>"
    },
    async ({ cht }) => {
      if (!ownerGuard()) return

      const name = (cht.q || "").trim()
      if (!name) return cht.reply("Masukkan nama file.")

      const fp = eventFilePath(name)
      if (!fp) return cht.reply("Nama file tidak valid.")
      if (!fs.existsSync(fp)) return cht.reply("File tidak ditemukan.")

      try {
        fs.unlinkSync(fp)
        return cht.reply(`Event dihapus.\nNama: ${path.basename(fp)}`)
      } catch (e) {
        return cht.reply("Gagal menghapus file: " + (e?.message || e))
      }
    }
  )

  ev.on(
    {
      cmd: ["eventlist", "lsevent"],
      listmenu: ["eventlist"],
      tag: "tools",
      energy: 0,
      premium: false
    },
    async ({ cht }) => {
      if (!ownerGuard()) return

      try {
        const list = fs.readdirSync(TARGET_DIR)
          .filter((x) => x.endsWith(".js") && !x.startsWith("."))

        if (!list.length) return cht.reply("Belum ada event di folder.")

        const lines = ["Daftar event:"]
        for (const f of list) lines.push("- " + f)

        return cht.reply(lines.join("\n"))
      } catch (e) {
        return cht.reply("Gagal membaca daftar file: " + (e?.message || e))
      }
    }
  )
}
