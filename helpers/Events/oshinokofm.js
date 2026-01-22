
const axiosMod = await "axios".import()

const axios = axiosMod?.default || axiosMod

const BASE = "https://oshinoko.fandom.com"
const API = `${BASE}/api.php`
const TL_ENDPOINT = "https://api.mymemory.translated.net/get"

const TL_CACHE = new Map()
const PROG_MIN = 1400
const PROG_STATE = new Map()
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function clean(s) {
  return String(s || "").replace(/\s+/g, " ").trim()
}

function safe(s, max = 1400) {
  const t = clean(s)
  if (!t) return ""
  return t.length > max ? t.slice(0, max) + "..." : t
}

function decodeEntities(s) {
  return String(s || "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
}

function shouldTranslate(s) {
  const t = clean(s)
  if (!t) return false
  if (t.length < 4) return false
  if (t.length > 2200) return false
  if (!/[a-zA-Z]/.test(t)) return false
  return true
}

async function tlENtoID(text) {
  const input = clean(text)
  if (!shouldTranslate(input)) return input
  if (TL_CACHE.has(input)) return TL_CACHE.get(input)

  let r
  try {
    r = await axios.get(TL_ENDPOINT, {
      timeout: 25000,
      validateStatus: () => true,
      params: { q: input, langpair: "en|id" },
      headers: { "user-agent": "Mozilla/5.0", accept: "application/json,*/*" }
    })
  } catch {
    return input
  }

  if (r?.status !== 200) return input

  const out = decodeEntities(r?.data?.responseData?.translatedText || "")
  const fixed = clean(out) || input
  TL_CACHE.set(input, fixed)
  await sleep(250)
  return fixed
}

function parseFlags(raw) {
  const t = String(raw || "").trim()
  const pickM = t.match(/--pick\s+(\d+)/i)
  const pick = pickM ? parseInt(pickM[1], 10) : null
  const rawMode = /--raw\b/i.test(t)
  const q = clean(t.replace(/--pick\s+\d+/gi, "").replace(/--raw\b/gi, ""))
  return { q, pick, rawMode }
}

function getQuotedRaw(cht) {
  const c = cht || {}
  const cand = [c?.msg, c?.m, c?.message, c?.raw, c?.quoted?.msg, c?.quoted?.m, c?.quoted]
  for (const x of cand) if (x && x.key && typeof x.key === "object") return x
  return null
}

async function progressStart(cht, Exp, opts, text) {
  try {
    const msg = await Exp.sendMessage(cht.id, { text }, opts)
    if (msg?.key?.id) PROG_STATE.set(msg.key.id, { t: Date.now(), last: text })
    return msg
  } catch {
    return null
  }
}

async function progressEdit(cht, Exp, msg, text) {
  if (!msg?.key?.id) return
  const st = PROG_STATE.get(msg.key.id) || { t: 0, last: "" }
  if (st.last === text) return
  const now = Date.now()
  const wait = PROG_MIN - (now - st.t)
  if (wait > 0) await sleep(wait)
  try {
    await Exp.sendMessage(cht.id, { text, edit: msg.key })
    PROG_STATE.set(msg.key.id, { t: Date.now(), last: text })
  } catch {}
}

async function apiGet(params) {
  const r = await axios.get(API, {
    timeout: 30000,
    validateStatus: () => true,
    params: { format: "json", ...params },
    headers: {
      "user-agent": "Mozilla/5.0",
      accept: "application/json,*/*",
      "accept-language": "en-US,en;q=0.9,id;q=0.8"
    }
  })
  if (r.status !== 200) throw new Error(`HTTP ${r.status}`)
  return r.data
}

async function apiSearch(q, limit = 10) {
  const data = await apiGet({
    action: "query",
    list: "search",
    srsearch: q,
    srlimit: Math.max(1, Math.min(10, limit))
  })

  const items = data?.query?.search
  if (!Array.isArray(items)) return []
  return items
    .map((x) => ({
      title: clean(x?.title),
      snippet: clean(String(x?.snippet || "").replace(/<[^>]+>/g, " ")),
      pageid: x?.pageid
    }))
    .filter((x) => x.title)
}

async function apiPage(title) {
  const data = await apiGet({
    action: "query",
    prop: "extracts|pageimages|info|categories",
    inprop: "url",
    exintro: 1,
    explaintext: 1,
    pilicense: "any",
    pithumbsize: 600,
    cllimit: 10,
    titles: title
  })

  const pages = data?.query?.pages || {}
  const page = Object.values(pages)[0] || {}
  const outTitle = clean(page?.title || title)
  const url = clean(page?.fullurl || (outTitle ? `${BASE}/wiki/${encodeURIComponent(outTitle.replace(/ /g, "_"))}` : ""))
  const extract = clean(page?.extract || "")
  const thumb = clean(page?.thumbnail?.source || "")
  const cats = Array.isArray(page?.categories)
    ? page.categories
        .map((c) => clean(String(c?.title || "").replace(/^Category:/i, "")))
        .filter(Boolean)
        .slice(0, 10)
    : []
  return { title: outTitle, url, extract, thumb, categories: cats }
}

export default async function on({ cht, Exp, store, ev, is }) {
  ev.on(
    {
      cmd: ["oshinokofm", "oshi", "oshinoko", "onkwiki"],
      listmenu: ["oshi <query>"],
      tag: "anime",
      energy: 15,
      args: "Contoh: .oshi Ai Hoshino | .oshi Ruby --pick 2 | .oshi Aqua --raw"
    },
    async ({ cht }) => {
      const rawInput = clean(cht.q) || clean(cht.quoted?.text) || clean(cht.quoted?.caption)
      if (!rawInput) {
        return cht.reply(
          "Pakai:\n" +
            ".oshi Ai Hoshino\n" +
            ".oshi Ruby --pick 2\n" +
            ".oshi Aqua --raw"
        )
      }

      const { q, pick, rawMode } = parseFlags(rawInput)
      if (!q) return cht.reply("Query-nya kosong.")

      const quoted = getQuotedRaw(cht)
      const opts = quoted ? { quoted } : {}

      await cht.react("⏳").catch(() => {})
      const prog = await progressStart(cht, Exp, opts, "Nyari dulu di Oshi no Ko Wiki...")

      try {
        await progressEdit(cht, Exp, prog, "Lagi nyari hasil yang paling nyambung...")
        const results = await apiSearch(q, 10)
        if (!results.length) {
          await cht.react("❌").catch(() => {})
          await progressEdit(cht, Exp, prog, "Nggak nemu hasilnya.")
          return
        }

        let chosen = results[0]
        if (Number.isFinite(pick) && pick && pick >= 1 && pick <= results.length) chosen = results[pick - 1]

        await progressEdit(cht, Exp, prog, `Ketemu: ${chosen.title}. Gue ambil detailnya...`)
        const page = await apiPage(chosen.title)

        let title = clean(page.title || chosen.title || q)
        let link = clean(page.url || "")
        let intro = safe(page.extract || chosen.snippet || "", 1600)
        let cats = Array.isArray(page.categories) ? page.categories.slice(0, 10) : []

        if (!rawMode) {
          await progressEdit(cht, Exp, prog, "Bentar, gue bikin versi Indonesia...")
          if (intro) intro = await tlENtoID(intro)
        }

        const topList = results
          .slice(0, 6)
          .map((r, i) => `${i + 1}. ${r.title}`)
          .join("\n")

        const text =
          `*${title}*\n` +
          `Sumber: Oshi no Ko Wiki (Fandom)\n` +
          (link ? `Link: ${link}\n` : "") +
          `\n` +
          (intro ? `*Ringkasan:*\n${safe(intro, 2000)}\n\n` : "") +
          (cats.length ? `*Kategori:*\n${cats.map((x) => `- ${x}`).join("\n")}\n\n` : "") +
          `*Hasil lain (pakai --pick):*\n${topList}\n` +
          `Contoh: .oshi ${q} --pick 2` +
          (rawMode ? "" : `\nVersi asli tanpa translate: .oshi ${q} --raw`)

        await progressEdit(cht, Exp, prog, "Oke, gue kirim hasilnya...")

        if (page.thumb) {
          await Exp.sendMessage(cht.id, { image: { url: page.thumb }, caption: safe(text, 950) }, opts)
          if (text.length > 950) await Exp.sendMessage(cht.id, { text: safe(text, 12000) }, opts)
        } else {
          await Exp.sendMessage(cht.id, { text: safe(text, 12000) }, opts)
        }

        await cht.react("✅").catch(() => {})
        await progressEdit(cht, Exp, prog, "Beres.")
      } catch (e) {
        await cht.react("❌").catch(() => {})
        await progressEdit(cht, Exp, prog, "Gagal.")
        return cht.reply("Error: " + (e?.message || String(e)))
      }
    }
  )
}
