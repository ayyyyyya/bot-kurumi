const axios = "axios".import()
const cheerio = "cheerio".import()

// ======== GET PAGE ========
async function page(url) {
  const { data: html } = await axios.get(url)
  const beforeFooter = html.split('<footer id="footer" class="footer-wrapper">')[0]
  const $ = cheerio.load(beforeFooter)

  let links = []

  $("h5.post-title a").each(
    (i, el) => {
      const href = $(el).attr("href")
      if (href) links.push(href)
    }
  )

  return links
}


// ======== GET WEBSITE ========
async function bestcosplay() {
  const url = "https://cosplaytele.com/best-cosplayer/"
  const { data: html } = await axios.get(url)
  const $ = cheerio.load(html)

  let links = []
  $("a[href*='/category/']").each(
    (i, el) => {
      let href = $(el).attr("href")
      if (href && href.includes("cosplaytele.com/category/")) {
        if (!links.includes(href)) links.push(href)
      }
    }
  )
  
  if (links.length === 0) throw new Error("❗ Tidak ada kategori ditemukan.")
  return links[Math.floor(Math.random() * links.length)]
}

async function explorcosplay(catg = "") {
  if (!catg) {
    throw new Error("❗ Berikan kategori, yang valid seperti: game, manga, anime, freestyle")
  }
  
  const url = "https://cosplaytele.com/explore-categories/"
  const { data } = await axios.get(url)
  const $ = cheerio.load(data)

  let results = []
  let index = 1

  let categoryTitleSelector
  let categoryEndSelector
  switch (catg.toLowerCase()) {
    case 'game':
      categoryTitleSelector = 'span.section-title-main:contains("Cosplay Game")'
      categoryEndSelector = 'span.section-title-main:contains("Cosplay Anime/Manga")'
      break
    case 'anime':
      categoryTitleSelector = 'span.section-title-main:contains("Cosplay Anime/Manga")'
      categoryEndSelector = 'span.section-title-main:contains("Cosplay Freestyle")'
      break
    case 'manga':
      categoryTitleSelector = 'span.section-title-main:contains("Cosplay Anime/Manga")'
      categoryEndSelector = 'span.section-title-main:contains("Cosplay Freestyle")'
      break
    case 'freestyle':
      categoryTitleSelector = 'span.section-title-main:contains("Cosplay Freestyle")'
      categoryEndSelector = 'span.section-title-main:contains("Top VIEW")'
      break
    default:
      throw new Error(`Kategori "${catg}" tidak tersedia. Silakan pilih salah satu dari: game, anime, manga, freestyle.`)
  }

  const startElement = $(categoryTitleSelector).closest('.container')
  if (!startElement.length) {
    throw new Error(`Tidak dapat menemukan bagian untuk kategori "${catg}".`)
  }

  const endElement = $(categoryEndSelector).closest('.container')

  let relevantSection
  if (endElement.length) {
    relevantSection = startElement.nextUntil(endElement)
  } else {
    relevantSection = startElement.nextAll()
  }

  relevantSection.find('div.col.medium-4.small-6.large-4').each(
    (i, element) => {
      let title = $(element).find('p > a > strong').text().trim() || $(element).find('p > a').text().trim()
      let url = $(element).find('.banner-layers.container a').attr('href')
      let thumbnail = $(element).find('.banner-bg.fill img').attr('src')

      if (title.toLowerCase().includes('cosplay')) {
        const titleParts = title.split('cosplay')
        title = titleParts[1].trim().split('“')[0].trim()
      }

      if (title && url && thumbnail) {
        results.push(
          {
            index: index++,
            judul: title,
            thumbnail: thumbnail,
            url: url,
          }
        )
      }
    }
  )

  return {
    website: url,
    category: catg,
    result: results
  }
}

// ======== STPE BY STEP ========
async function step1(url) {
  const { data: html } = await axios.get(url)
  const beforeFooter = html.split('<footer id="footer" class="footer-wrapper">')[0]
  const $ = cheerio.load(beforeFooter)

  let links = []

  if (url.includes("/best-cosplayer/")) {
    $("a").each(
      (i, el) => {
        const href = $(el).attr("href")
        if (href && href.includes("/category/")) {
         links.push(href)
        }
      }
    )
  } else if (
    url.includes("/category/") ||
    url.includes("/tag/")
  ) {
  
    links.push(...await page(url))

    let pages = []
    $("a.page-number").each(
      (i, el) => {
        const href = $(el).attr("href")
        if (href && (href.includes("/page/"))) {
          pages.push(href)
        }
      }
    )

    pages = [...new Set(pages)]

    for (const pageUrl of pages) {
      const pageLinks = await page(pageUrl)
      links.push(...pageLinks)
    }
  }

  links = [...new Set(links)]

  if (links.length === 0) {
    throw new Error("❗ Tidak ada data ditemukan di halaman ini")
  }

  return links[Math.floor(Math.random() * links.length)]
}

async function step2(url) {
  const { data: postHtml } = await axios.get(url)
  const $ = cheerio.load(postHtml)

  let category = $("#content h1.page-title span").text().trim()
  let title = $("h1.entry-title").text().trim()
  let thumbnail = $("img.wp-post-image").first().attr("src")

  let gallery = []
  $("figure.gallery-item img").each(
    (i, el) => {
      let src = $(el).attr("src")
      if (src && src.endsWith(".webp") && src.includes("/wp-content/uploads/")) {
        gallery.push(src)
      }
    }
  )
  
  let photos = gallery.length

  return {
    category, 
    title, 
    url, 
    thumbnail, 
    photos, 
    gallery 
  }
}

export { bestcosplay, explorcosplay, step1, step2 }