const axiosMod = "axios".import()
const cheerioMod = "cheerio".import()

const axios = axiosMod?.default || axiosMod

const loadCheerio = () => {
  if (typeof cheerioMod?.load === "function") return cheerioMod.load
  if (typeof cheerioMod?.default?.load === "function") return cheerioMod.default.load
  return null
}

const UA = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
]

const pickUA = () => UA[Math.floor(Math.random() * UA.length)]

const baseHeaders = (referer) => ({
  "user-agent": pickUA(),
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
  "cache-control": "no-cache",
  pragma: "no-cache",
  "upgrade-insecure-requests": "1",
  referer: referer || "https://www.wallpaperflare.com/"
})

function getQuotedRaw(cht) {
  const c = cht || {}
  const cand = [c?.msg, c?.m, c?.message, c?.raw, c?.quoted?.msg, c?.quoted?.m, c?.quoted]
  for (const x of cand) if (x && x.key && typeof x.key === "object") return x
  return null
}

const PROGRESS_MIN_INTERVAL = 1400
const _progressState = new Map()

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function progressStart(cht, Exp, opts, text) {
  try {
    const msg = await Exp.sendMessage(cht.id, { text }, opts)
    const k = msg?.key?.id || ""
    if (k) _progressState.set(k, { t: Date.now(), last: text })
    return msg
  } catch {
    return null
  }
}

async function progressUpdate(cht, Exp, msg, text) {
  if (!msg?.key) return
  const k = msg.key.id || ""
  if (!k) return

  const st = _progressState.get(k) || { t: 0, last: "" }
  if (st.last === text) return

  const now = Date.now()
  const wait = PROGRESS_MIN_INTERVAL - (now - st.t)
  if (wait > 0) await sleep(wait)

  try {
    await Exp.sendMessage(cht.id, { text, edit: msg.key })
    st.t = Date.now()
    st.last = text
    _progressState.set(k, st)
  } catch {}
}

async function fetchHtml(url, referer) {
  const r = await axios.get(url, {
    timeout: 30000,
    maxRedirects: 5,
    validateStatus: () => true,
    headers: baseHeaders(referer)
  })
  if (r.status === 200) return String(r.data || "")
  const r2 = await axios.get(url, {
    timeout: 30000,
    maxRedirects: 5,
    validateStatus: () => true,
    headers: baseHeaders(referer)
  })
  if (r2.status === 200) return String(r2.data || "")
  throw new Error(`HTTP ${r2.status}`)
}

async function wallpaperflareSearch(query) {
  const load = loadCheerio()
  if (!load) throw new Error("Cheerio tidak tersedia")

  const searchUrl = `https://www.wallpaperflare.com/search?wallpaper=${encodeURIComponent(query)}`
  const html = await fetchHtml(searchUrl, "https://www.wallpaperflare.com/")
  const $ = load(html)
  const results = []

  $('li[itemprop="associatedMedia"]').each((_, el) => {
    const title = $(el).find('figcaption[itemprop="caption description"]').text().trim()
    const image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || ""
    const page = $(el).find('a[itemprop="url"]').attr("href") || ""
    const resolution = $(el).find(".res").text().trim()

    if (image && page) {
      results.push({
        title,
        resolution,
        image,
        page: `https://www.wallpaperflare.com${page}`
      })
    }
  })

  if (!results.length) return null
  return { searchUrl, results }
}

async function wallpaperflareFullImage(pageUrl, referer) {
  const load = loadCheerio()
  if (!load) return null

  const html = await fetchHtml(pageUrl, referer || "https://www.wallpaperflare.com/")
  const $ = load(html)

  const og =
    $('meta[property="og:image"]').attr("content") ||
    $('meta[name="og:image"]').attr("content") ||
    $('meta[property="twitter:image"]').attr("content") ||
    ""

  if (og) return og

  const contentUrl =
    $('img[itemprop="contentUrl"]').attr("src") ||
    $('img[itemprop="contentUrl"]').attr("data-src") ||
    ""

  if (contentUrl) return contentUrl

  const dl =
    $('a#download_button').attr("href") ||
    $("a[href*='/download/']").attr("href") ||
    ""

  if (dl) return dl.startsWith("http") ? dl : `https://www.wallpaperflare.com${dl}`

  return null
}

async function wallhavenFallback(query) {
  const r = await axios.get(`https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(query)}&sorting=relevance`, {
    timeout: 30000,
    validateStatus: () => true,
    headers: { "user-agent": pickUA(), accept: "application/json" }
  })
  if (r.status !== 200) return null
  const data = r.data && typeof r.data === "object" ? r.data : null
  const it = data?.data?.[0]
  if (!it?.path) return null

  return {
    title: it.id ? `Wallhaven ${it.id}` : "Wallhaven",
    resolution: it.resolution || "-",
    image: it.path,
    page: it.url || "https://wallhaven.cc/"
  }
}

export default async function on({ cht, Exp, store, ev, is }) {
  ev.on(
    {
      cmd: ["wallpapersearch", "wp"],
      listmenu: ["wallpapersearch <kata kunci>"],
      tag: "search",
      energy: 30,
      premium: true,
      args: "Masukkan kata kunci wallpaper",
      limit: true
    },
    async ({ cht }) => {
      const q =
        (cht.q || "").trim() ||
        (cht.quoted?.text || "").trim() ||
        (cht.quoted?.caption || "").trim()

      if (!q) return cht.reply("Contoh: .wallpaper kucing hitam")

      const quoted = getQuotedRaw(cht)
      const opts = quoted ? { quoted } : {}

      await cht.react("⏳").catch(() => {})
      const prog = await progressStart(cht, Exp, opts, "*Ku cari dulu yaa*")

      let picked = null
      let searchMeta = null

      try {
        await progressUpdate(cht, Exp, prog, "*Nahh ketemuu*")
        const wf = await wallpaperflareSearch(q)
        if (wf?.results?.length) {
          searchMeta = wf
          const first = wf.results[0]
          await progressUpdate(cht, Exp, prog, "*Bentarr yaa ku ambilin duluu*")
          const full = await wallpaperflareFullImage(first.page, wf.searchUrl).catch(() => null)
          picked = {
            title: first.title || "-",
            resolution: first.resolution || "-",
            image: full || first.image,
            page: first.page
          }
        }
      } catch (e) {
        picked = null
      }

      if (!picked) {
        await progressUpdate(cht, Exp, prog, "_BNTR_")
        picked = await wallhavenFallback(q)
      }

      if (!picked?.image) {
        await cht.react("❌").catch(() => {})
        await progressUpdate(cht, Exp, prog, "Sorry ga bisa")
        return cht.reply("Tidak ditemukan wallpaper (Wallpaperflare kemungkinan 403).")
      }

      const caption =
        `🖼️ *Wallpaper*\n\n` +
        `• Judul: ${picked.title || "-"}\n` +
        `• Resolusi: ${picked.resolution || "-"}\n` +
        `• Sumber: ${picked.page || "-"}`

      await progressUpdate(cht, Exp, prog, "*Nih ku kirimmm*")
      await Exp.sendMessage(cht.id, { image: { url: picked.image }, caption }, opts)

      await cht.react("✅").catch(() => {})
      await progressUpdate(cht, Exp, prog, "*Udahh selesaiiii😄*")
    }
  )
}
