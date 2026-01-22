const fs = "fs".import()

const path = "path".import()

const EVENTS_DIR = path.resolve(process.cwd(), "helpers", "Events")

const MAX_SIZE = 250 * 1024

function pickOwners() {

  const a = global?.config?.owner

  const b = global?.owner

  const c = global?.db?.data?.settings?.owner

  const list = a || b || c || []

  return Array.isArray(list) ? list : []

}

function normNumber(x) {

  return String(x || "").replace(/\D/g, "")

}

function isOwnerSender(sender, fromMe) {

  if (fromMe) return true

  const s = normNumber(String(sender || "").split("@")[0])

  if (!s) return false

  const owners = pickOwners().map(normNumber).filter(Boolean)

  return owners.includes(s)

}

function normalizeJsName(name) {

  const raw = String(name || "").trim()

  if (!raw) return null

  if (raw.includes("/") || raw.includes("\\") || raw.includes("..")) return null

  const base = raw.endsWith(".js") ? raw : raw + ".js"

  if (!/^[a-zA-Z0-9_-]+\.js$/.test(base)) return null

  return base

}

function safeJoin(baseDir, fileName) {

  const full = path.resolve(baseDir, fileName)

  const ok = full.startsWith(baseDir + path.sep)

  return ok ? full : null

}

function getTextFromQuoted(cht) {

  const q = cht?.quoted || {}

  const t = q?.text || q?.caption || q?.msg?.text || ""

  return String(t || "").trim()

}

export default async function on({ cht, Exp, store, ev, is }) {

  ev.on(

    {

      cmd: ["buatfile"],

      listmenu: ["buatfile <nama> <kode>"],

      tag: "owner",

 

   

      args: "Contoh: .buatfile contoh export default async function on(...){}"

    },

    async ({ cht }) => {

      const sender = cht?.sender || ""

      const fromMe = !!(cht?.fromMe || cht?.msg?.key?.fromMe)

      if (!isOwnerSender(sender, fromMe)) return cht.reply("Khusus owner.")

      const input = String(cht?.q || "").trim()

      if (!input) return cht.reply("Format:\n.buatfile <nama> <kode>\nAtau reply kode: .buatfile <nama>")

      const firstSpace = input.search(/\s/)

      const namePart = firstSpace === -1 ? input : input.slice(0, firstSpace)

      const rest = firstSpace === -1 ? "" : input.slice(firstSpace).trim()

      const fileName = normalizeJsName(namePart)

      if (!fileName) return cht.reply("Nama file tidak valid. Hanya boleh huruf/angka/_/- dan .js.\nContoh: .buatfile contoh <kode>")

      const code = rest || getTextFromQuoted(cht)

      if (!code) return cht.reply("Kode kosong. Tulis kode setelah nama, atau reply pesan yang berisi kode.")

      if (Buffer.byteLength(code, "utf8") > MAX_SIZE) return cht.reply("Kode terlalu besar.")

      try {

        fs.mkdirSync(EVENTS_DIR, { recursive: true })

        const fullPath = safeJoin(EVENTS_DIR, fileName)

        if (!fullPath) return cht.reply("Path tidak valid.")

        if (fs.existsSync(fullPath)) return cht.reply(`File sudah ada: ${fileName}`)

        fs.writeFileSync(fullPath, code.endsWith("\n") ? code : code + "\n", "utf8")

        return cht.reply(`✅ Dibuat: helpers/Events/${fileName}`)

      } catch (e) {

        return cht.reply("🚨 Error: " + (e?.message || String(e)))

      }

    }

  )

  ev.on(

    {

      cmd: ["hapusfile"],

      listmenu: ["hapusfile <nama>"],

      tag: "owner",





      args: "Contoh: .hapusfile contoh"

    },

    async ({ cht }) => {

      const sender = cht?.sender || ""

      const fromMe = !!(cht?.fromMe || cht?.msg?.key?.fromMe)

      if (!isOwnerSender(sender, fromMe)) return cht.reply("Khusus owner.")

      const input = String(cht?.q || "").trim()

      if (!input) return cht.reply("Format:\n.hapusfile <nama>")

      const fileName = normalizeJsName(input.split(/\s+/)[0])

      if (!fileName) return cht.reply("Nama file tidak valid. Contoh: .hapusfile contoh")

      try {

        const fullPath = safeJoin(EVENTS_DIR, fileName)

        if (!fullPath) return cht.reply("Path tidak valid.")

        if (!fs.existsSync(fullPath)) return cht.reply(`File tidak ditemukan: ${fileName}`)

        fs.unlinkSync(fullPath)

        return cht.reply(`🗑️ Dihapus: helpers/Events/${fileName}`)

      } catch (e) {

        return cht.reply("🚨 Error: " + (e?.message || String(e)))

      }

    }

  )

}