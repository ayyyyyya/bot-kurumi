const axiosMod = await "axios".import()

const fsMod = "fs".import()

let cryptoMod
try {
  cryptoMod = await "node:crypto".import()
} catch {
  cryptoMod = await "crypto".import()
}

const axios = axiosMod?.default || axiosMod

const fs = fsMod?.default || fsMod

const crypto = cryptoMod?.default || cryptoMod

const G = globalThis
if (!G.Data || typeof G.Data !== "object") G.Data = {}
if (!G.Data.__ttsearchSess || typeof G.Data.__ttsearchSess?.get !== "function") G.Data.__ttsearchSess = new Map()
const SESS = G.Data.__ttsearchSess

const TTL = 10 * 60 * 1000

function randHex(n = 12) {

  try {

    const rb = crypto?.randomBytes

    if (typeof rb === "function") return rb(Math.ceil(n / 2)).toString("hex").slice(0, n)

  } catch {}

  let out = ""

  while (out.length < n) out += Math.random().toString(16).slice(2) + Date.now().toString(16)

  return out.slice(0, n)

}

function clean(s) {

  return String(s || "").replace(/\s+/g, " ").trim()

}

function safe(s, max = 120) {

  const t = clean(s)

  if (!t) return "-"

  return t.length > max ? t.slice(0, max) + "..." : t

}

function num(n) {

  const x = Number(n)

  return Number.isFinite(x) ? x.toLocaleString("id-ID") : "-"

}

async function replyText(cht, Exp, opts, text) {
  try { return await replyText(cht, Exp, opts, text) } catch {
    try { return await Exp.sendMessage(cht.id, { text: String(text || "") }, opts || {}) } catch {}
  }
}

function getQuotedRaw(cht) {

  const c = cht || {}

  const cand = [c?.msg, c?.m, c?.message, c?.raw, c?.quoted?.msg, c?.quoted?.m, c?.quoted]

  for (const x of cand) if (x && x.key && typeof x.key === "object") return x

  return null

}

function extractSelectedId(cht) {

  const msg = cht?.msg?.message || cht?.m?.message || cht?.message?.message || null

  if (!msg) return ""

  const lr = msg.listResponseMessage?.singleSelectReply?.selectedRowId

  if (typeof lr === "string" && lr) return lr

  const br = msg.buttonsResponseMessage?.selectedButtonId

  if (typeof br === "string" && br) return br

  const tb = msg.templateButtonReplyMessage?.selectedId

  if (typeof tb === "string" && tb) return tb


  const ir = msg.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson
  if (typeof ir === "string" && ir) {
    try {
      const o = JSON.parse(ir)
      const sid =
        o?.id ||
        o?.selectedRowId ||
        o?.selected_row_id ||
        o?.single_select_reply?.selected_row_id ||
        o?.singleSelectReply?.selectedRowId
      if (typeof sid === "string" && sid) return sid
    } catch {}
  }

  return ""

}

function parseFlags(s) {

  const out = { sid: "", pick: "" }

  const t = clean(s)

  if (!t) return out

  const mSidEq = t.match(/--sid=([a-zA-Z0-9_-]+)/)

  const mPickEq = t.match(/--pick=([a-zA-Z0-9_-]+)/)

  if (mSidEq?.[1]) out.sid = mSidEq[1]

  if (mPickEq?.[1]) out.pick = mPickEq[1]

  const parts = t.split(/\s+/)

  for (let i = 0; i < parts.length; i++) {

    const p = parts[i]

    if (p === "--sid" && parts[i + 1]) out.sid = parts[i + 1]

    if (p === "--pick" && parts[i + 1]) out.pick = parts[i + 1]

  }

  return out

}

function cleanupSessions() {

  const now = Date.now()

  for (const [k, v] of SESS.entries()) {

    if (!v?.t || now - v.t > TTL) SESS.delete(k)

  }

}

async function apiSearch(q) {

  const r = await axios.get("https://manzxy.my.id/search/tiktok", {

    params: { q, limit: 10 },

    timeout: 30000,

    validateStatus: () => true,

    headers: { "user-agent": "Mozilla/5.0", accept: "application/json,*/*" }

  })

  if (r.status !== 200) throw new Error(`HTTP ${r.status}`)

  const data = r.data

  if (!data?.success || !Array.isArray(data?.result)) return []

  return data.result.filter(Boolean).slice(0, 10)

}

function pickVideoUrl(v) {

  return clean(v?.video || v?.play || v?.videoUrl || v?.url_video || v?.nowm || v?.wm || "")

}

function pickLink(v) {

  return clean(v?.url || v?.link || v?.tiktok || "")

}

function pickAuthor(v) {

  return clean(v?.author || v?.username || v?.user || v?.creator || "")

}

function pickTitle(v) {

  return clean(v?.title || v?.desc || v?.description || v?.caption || "")

}

function pickMusic(v) {

  const a = clean(v?.music?.author || v?.musicAuthor || v?.soundAuthor || v?.music_author || "")

  const t = clean(v?.music?.title || v?.musicTitle || v?.soundTitle || v?.music_title || v?.music || "")

  if (!a && !t) return ""

  if (a && t) return `${t} — ${a}`

  return t || a

}

function pickStats(v) {

  const views = v?.views ?? v?.view ?? v?.viewCount ?? v?.playCount ?? null

  const like = v?.like ?? v?.likes ?? v?.likeCount ?? null

  const comment = v?.comment ?? v?.comments ?? v?.commentCount ?? null

  const share = v?.share ?? v?.shares ?? v?.shareCount ?? null

  return { views, like, comment, share }

}

function extraLines(v, usedKeys) {

  const keys = Object.keys(v || {})

  const out = []

  for (const k of keys) {

    if (usedKeys.has(k)) continue

    const val = v[k]

    if (val == null) continue

    if (typeof val === "object") continue

    const s = clean(val)

    if (!s) continue

    if (s.length > 80) continue

    out.push(`• ${k}: ${s}`)

    if (out.length >= 10) break

  }

  return out

}

function buildCaption(v) {

  const title = pickTitle(v)

  const author = pickAuthor(v)

  const dur = v?.duration != null ? `${v.duration}s` : (v?.duration_s != null ? `${v.duration_s}s` : "-")

  const link = pickLink(v)

  const music = pickMusic(v)

  const st = pickStats(v)

  const used = new Set([

    "video","play","videoUrl","url_video","nowm","wm",

    "url","link","tiktok",

    "author","username","user","creator",

    "title","desc","description","caption",

    "duration","duration_s",

    "views","view","viewCount","playCount",

    "like","likes","likeCount",

    "comment","comments","commentCount",

    "share","shares","shareCount",

    "music","musicTitle","musicAuthor","soundTitle","soundAuthor","music_title","music_author"

  ])

  const lines = []

  lines.push("🎵 *TikTok Search*")

  lines.push("")

  if (title) lines.push(`• Judul: ${safe(title, 240)}`)

  if (author) lines.push(`• Creator: ${author}`)

  lines.push(`• Durasi: ${dur}`)

  if (st.views != null) lines.push(`• Views: ${num(st.views)}`)

  if (st.like != null) lines.push(`• Like: ${num(st.like)}`)

  if (st.comment != null) lines.push(`• Komen: ${num(st.comment)}`)

  if (st.share != null) lines.push(`• Share: ${num(st.share)}`)

  if (music) lines.push(`• Musik: ${safe(music, 180)}`)

  if (link) lines.push(`• Link: ${link}`)

  const extras = extraLines(v, used)

  if (extras.length) {

    lines.push("")

    lines.push("*Info tambahan:*")

    lines.push(extras.join("\n"))

  }

  return lines.join("\n").trim()

}

async function sendList(cht, Exp, opts, sid, q, results) {

  const rows = results.map((v, i) => {
    const title = safe(pickTitle(v) || `Video ${i + 1}`, 34)
    const author = pickAuthor(v) || "-"
    const dur = v?.duration != null ? `${v.duration}s` : "-"
    const st = pickStats(v)
    const statMini =
      st.like != null || st.views != null
        ? `❤️${st.like != null ? num(st.like) : "-"} · 👁️${st.views != null ? num(st.views) : "-"}`
        : ""
    const desc = safe(`@${author} · ${dur}${statMini ? " · " + statMini : ""}`, 72)
    return {
      title,
      description: desc,
      id: `.ttsearch --sid=${sid} --pick=${i + 1}`
    }
  })

  const sections = [{ title: "Pilih hasil (langsung gue kirim videonya)", rows }]

  const caption =
    `Nih hasil buat: *${safe(q, 80)}*\n` +
    `Pilih salah satu dari list.\n\n` +
    `Kalau yang kepilih gagal (link 403), tinggal pick yang lain.`

  const paramsJson = JSON.stringify({ title: "TikTok Search", sections })

  return await Exp.sendMessage(
    cht.id,
    {
      image: fs.readFileSync(fol[3] + "bell.jpg"),
      caption,
      footer: "Alya AI • ttsearch",
      buttons: [
        {
          buttonId: "ttsearch_list",
          buttonText: { displayText: "[ PILIH VIDEO ]" },
          type: 4,
          nativeFlowInfo: { name: "single_select", paramsJson }
        }
      ],
      headerType: 6,
      viewOnce: true
    },
    opts
  )

}

async function trySendVideo(Exp, chatId, url, caption, opts) {

  try {

    await Exp.sendMessage(chatId, { video: { url }, caption }, opts)

    return true

  } catch {}

  try {

    const r = await axios.get(url, {

      responseType: "arraybuffer",

      timeout: 60000,

      maxBodyLength: Infinity,

      validateStatus: () => true,

      headers: { "user-agent": "Mozilla/5.0" }

    })

    if (r.status !== 200) return false

    const buf = Buffer.from(r.data || [])

    if (!buf.length) return false

    await Exp.sendMessage(chatId, { video: buf, caption }, opts)

    return true

  } catch {

    return false

  }

}

export default async function on({ cht, Exp, store, ev, is }) {

  ev.on(

    {

      cmd: ["ttsearch"],

      listmenu: ["ttsearch <query>"],

      tag: "search",

      energy: 55,

      args: "Contoh: .ttsearch elaina"

    },

    async ({ cht }) => {

      cleanupSessions()

      const selectedId = extractSelectedId(cht)

      const asText = clean(selectedId) || clean(cht?.q) || clean(cht?.quoted?.text) || clean(cht?.quoted?.caption)

      const flags = parseFlags(asText)

      const quoted = getQuotedRaw(cht)

      const opts = quoted ? { quoted } : {}

      if (flags.sid) {

        const sess = SESS.get(flags.sid)

        if (!sess) return replyText(cht, Exp, opts, "Listnya udah ilang. Search ulang: .ttsearch <query>")

        if (Date.now() - sess.t > TTL) {
          SESS.delete(flags.sid)
          return replyText(cht, Exp, opts, "Listnya udah kadaluarsa. Search ulang: .ttsearch <query>")
        }

        if (sess.sender && sess.sender !== cht.sender) return replyText(cht, Exp, opts, "Ini list punya orang lain, jangan numpang.")

        if (!flags.pick) {
          await sendList(cht, Exp, opts, flags.sid, sess.q || "(tanpa query)", sess.results)
          return
        }

        const idx = parseInt(flags.pick, 10)

        if (!Number.isFinite(idx) || idx < 1 || idx > sess.results.length) return replyText(cht, Exp, opts, "Pilihan nggak valid.")

        const v = sess.results[idx - 1]

        const videoUrl = pickVideoUrl(v)

        if (!videoUrl) return replyText(cht, Exp, opts, "Link videonya kosong dari API. Coba pilih hasil lain.")

        await cht.react("⏳").catch(() => {})

        const caption = buildCaption(v)

        const ok = await trySendVideo(Exp, cht.id, videoUrl, caption, opts)

        if (!ok) {

          await cht.react("❌").catch(() => {})

          const link = pickLink(v) || videoUrl

          return replyText(cht, Exp, opts, "Gagal ngirim videonya (linknya kehalang/403).\nCoba pilih hasil lain, atau nih linknya:\n" + link)

        }

        await cht.react("✅").catch(() => {})

        return

      }

      const q = clean(cht.q) || clean(cht.quoted?.text) || clean(cht.quoted?.caption)

      if (!q) return replyText(cht, Exp, opts, "Masukin query TikTok.\nContoh: .ttsearch elaina")

      await cht.react("⏳").catch(() => {})

      try {

        const results = await apiSearch(q)

        if (!results.length) {

          await cht.react("❌").catch(() => {})

          return replyText(cht, Exp, opts, "Nggak nemu hasilnya. Coba kata kunci lain.")

        }

        const sid = randHex(14)

        SESS.set(sid, { t: Date.now(), sender: cht.sender, chat: cht.id, q, results })

        await sendList(cht, Exp, opts, sid, q, results)

        await cht.react("✅").catch(() => {})

      } catch (e) {

        await cht.react("❌").catch(() => {})

        return replyText(cht, Exp, opts, "Gagal search TikTok.\nDetail: " + (e?.message || String(e)))

      }

    }

  )

}