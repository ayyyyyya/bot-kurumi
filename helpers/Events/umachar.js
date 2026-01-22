const axiosMod = "axios".import()

const cheerioMod = "cheerio".import()

const axios = axiosMod?.default || axiosMod

const cheerio = cheerioMod?.default || cheerioMod

async function fetchUmaChar(name) {

  const slug = String(name || "").trim().replace(/\s+/g, "_")

  if (!slug) throw new Error("Namanya kosong, isi dulu woy")

  const url = `https://umamusume.fandom.com/wiki/${slug}`

  const { data } = await axios.get(url, {

    timeout: 30000,

    validateStatus: () => true,

    headers: {

      "user-agent": "Mozilla/5.0",

      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"

    }

  })

  if (!data || typeof data !== "string") throw new Error("Gagal ngambil halaman, coba lagi bentar")

  const $ = cheerio.load(data)

  const info = {}

  const infobox = $("aside.portable-infobox").first()

  if (!infobox || !infobox.length) throw new Error("Karakter nggak ketemu (infobox-nya nggak ada)")

  const getField = (label) => {

    const f = infobox.find(`h3:contains("${label}")`).first().parent()

    if (!f || !f.length) return null

    const v = f.find(".pi-data-value").first().text().trim()

    return v || null

  }

  info.name = getField("Name")

  info.kana = getField("Kana")

  info.romaji = getField("Romaji")

  info.t_chinese = getField("T. Chn.")

  info.species = getField("Species")

  info.birthday = getField("Birthday")

  info.gender = getField("Gender")

  info.height = getField("Height")

  info.three_sizes = getField("Three Sizes")

  info.occupation = getField("Occupation")

  const aff = []

  infobox

    .find(`h3:contains("Affiliation")`)

    .first()

    .parent()

    .find("li")

    .each((i, el) => {

      const t = $(el).text().trim()

      if (t) aff.push(t)

    })

  info.affiliation = aff

  info.voice_actor = getField("Japanese")

  info.images = []

  infobox.find(".pi-image-collection__image").each((i, el) => {

    const caption = $(el).find(".pi-hero-caption").text().trim()

    const img = $(el).find("img").attr("src")

    if (img) info.images.push({ caption, img })

  })

  const jsonLD = $('script[type="application/ld+json"]').first().html()

  if (jsonLD) {

    try {

      const parsed = JSON.parse(jsonLD)

      if (parsed.image)

        info.images.push({ caption: "Main Image", img: parsed.image })

      if (parsed.mainEntity?.image)

        info.images.push({ caption: "Main Entity Image", img: parsed.mainEntity.image })

      if (parsed.about?.image)

        info.images.push({ caption: "About Image", img: parsed.about.image })

      if (parsed.thumbnailUrl)

        info.images.push({ caption: "Thumbnail", img: parsed.thumbnailUrl })

      if (parsed.abstract) info.abstract = parsed.abstract

    } catch {}

  }

  const getSection = (id) => {

    const h = $(`span#${id}`).first().parent()

    if (!h || !h.length) return ""

    const sec = h.next()

    return (sec.text() || "").trim()

  }

  info.profile = getSection("Profile")

  info.appearance = getSection("Appearance")

  info.relationships = []

  $('span#Relationships')

    .first()

    .parent()

    .next("ul")

    .find("li")

    .each((i, el) => {

      const t = $(el).text().trim()

      if (t) info.relationships.push(t)

    })

  info.songs = []

  $('span#Songs')

    .first()

    .parent()

    .next("ul")

    .find("li")

    .each((i, el) => {

      const t = $(el).text().trim()

      if (t) info.songs.push(t)

    })

  const sc = {}

  sc.table = []

  $('span#Special_commentary')

    .first()

    .parent()

    .next("table")

    .find("tbody tr")

    .each((i, el) => {

      const td = $(el).find("td")

      if (td.length === 2) {

        sc.table.push({

          umamusume: td

            .eq(0)

            .text()

            .trim()

            .replace(/\s+/g, " "),

          real_life: td

            .eq(1)

            .text()

            .trim()

            .replace(/\s+/g, " ")

        })

      }

    })

  sc.requirements = []

  $('span#Special_commentary')

    .first()

    .parent()

    .nextAll("ul")

    .first()

    .find("li")

    .each((i, el) => {

      const t = $(el).text().trim()

      if (t) sc.requirements.push(t)

    })

  sc.notes = []

  $("#Notes")

    .first()

    .parent()

    .next("ul")

    .find("li")

    .each((i, el) => {

      const t = $(el).text().trim()

      if (t) sc.notes.push(t)

    })

  info.special_commentary = sc

  info.notes = [...sc.notes]

  info.trivia = []

  $("#Trivia")

    .first()

    .parent()

    .next("ul")

    .find("li")

    .each((i, el) => {

      const t = $(el).text().trim()

      if (t) info.trivia.push(t)

    })

  const seen = new Set()

  info.images = (info.images || []).filter((img) => {

    if (!img?.img) return false

    if (seen.has(img.img)) return false

    seen.add(img.img)

    return true

  })

  return JSON.parse(JSON.stringify(info))

}

function getQuotedRaw(cht) {

  const c = cht || {}

  const cand = [c?.msg, c?.m, c?.message, c?.raw, c?.quoted?.msg, c?.quoted?.m, c?.quoted]

  for (const x of cand) if (x && x.key && typeof x.key === "object") return x

  return null

}

function safeText(s, max = 800) {

  const t = String(s || "").trim()

  if (!t) return ""

  return t.length > max ? t.slice(0, max) + "…" : t

}

export default async function on({ cht, Exp, store, ev, is }) {

  ev.on(

    {

      cmd: ["uma", "umamusume"],

      listmenu: ["uma <nama karakter>"],

      tag: "anime",

      energy: 15,

      args: "Contoh: .uma Daiwa Scarlet"

    },

    async ({ cht }) => {

      const raw =

        (cht.q || "").trim() ||

        (cht.quoted?.text || "").trim() ||

        (cht.quoted?.caption || "").trim()

      if (!raw) {

        return cht.reply("Contoh:\n.uma Daiwa Scarlet")

      }

      const quoted = getQuotedRaw(cht)

      const opts = quoted ? { quoted } : {}

      await cht.react("⏳").catch(() => {})

      try {

        const info = await fetchUmaChar(raw)

        if (!info || (!info.name && !info.romaji)) {

          throw new Error("Karakter nggak ketemu, cek lagi penulisannya")

        }

        const titleLine =

          `*${info.name || raw}*` +

          (info.romaji ? ` (${info.romaji})` : "") +

          (info.kana ? `\n${info.kana}` : "")

        const lines = [titleLine]

        if (info.species) lines.push(`• Ras / species : ${info.species}`)

        if (info.birthday) lines.push(`• Ulang tahun   : ${info.birthday}`)

        if (info.gender) lines.push(`• Gender        : ${info.gender}`)

        if (info.height) lines.push(`• Tinggi badan  : ${info.height}`)

        if (info.three_sizes) lines.push(`• 3 ukuran      : ${info.three_sizes}`)

        if (info.occupation) lines.push(`• Pekerjaan     : ${info.occupation}`)

        if (info.voice_actor) lines.push(`• Pengisi suara : ${info.voice_actor}`)

        if (info.affiliation?.length) {

          lines.push(

            "",

            "*Affiliasi / kelompok:*",

            info.affiliation.slice(0, 6).map((v) => `- ${v}`).join("\n")

          )

        }

        if (info.profile) {

          lines.push("", "*Profil singkat:*", safeText(info.profile, 600))

        } else if (info.abstract) {

          lines.push("", "*Profil singkat:*", safeText(info.abstract, 600))

        }

        if (info.appearance) {

          lines.push("", "*Penampilan:*", safeText(info.appearance, 400))

        }

        if (info.relationships?.length) {

          lines.push(

            "",

            "*Relasi / hubungan:*",

            info.relationships.slice(0, 8).map((v) => `- ${v}`).join("\n")

          )

        }

        if (info.songs?.length) {

          lines.push(

            "",

            "*Lagu-lagu:*",

            info.songs.slice(0, 6).map((v) => `- ${v}`).join("\n")

          )

        }

        if (info.trivia?.length) {

          lines.push(

            "",

            "*Trivia / fun fact:*",

            safeText(

              info.trivia

                .slice(0, 5)

                .map((v) => `- ${v}`)

                .join("\n"),

              800

            )

          )

        }

        const caption = lines.join("\n")

        const img = info.images?.[0]?.img || null

        if (img) {

          await Exp.sendMessage(

            cht.id,

            {

              image: { url: img },

              caption

            },

            opts

          )

        } else {

          await Exp.sendMessage(cht.id, { text: caption }, opts)

        }

        await cht.react("✅").catch(() => {})

      } catch (e) {

        await cht.react("❌").catch(() => {})

        return cht.reply("Error: " + (e?.message || String(e)))

      }

    }

  )

}

