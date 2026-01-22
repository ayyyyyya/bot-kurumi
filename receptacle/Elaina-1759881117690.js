import axios from "axios";
import cheerio from "cheerio";

const BASE_URL = "https://www.mynimeku.com/search/";

class MyNimeku {
  constructor() {
    this.headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    };
  }

  async getOngoingAnime() {
    try {
      const response = await axios.get(
        `${BASE_URL}?asp=1&s_status[]=airing&s_orderby=updated&s_order=desc`,
        { headers: this.headers }
      );

      const $ = cheerio.load(response.data);
      const animeList = [];

      $(".w-full.bg-gradient-to-t").each((index, element) => {
        const $anime = $(element);

        const statusEl = $anime.find(".bg-accent-2\\/80, .bg-accent-2");
        const status = statusEl.text().trim();
        if (status !== "Airing") return;

        const linkEl = $anime.find("a").first();
        const link = linkEl.attr("href");
        if (!link || !link.includes("/anime/")) return;

        let title = "";
        const h3Link = $anime.find("h3 a");
        const enTitle = h3Link.find("[data-en-title]").text().trim();
        title = enTitle || h3Link.clone().children().remove().end().text().trim();
        title = title.replace(/\s+/g, " ").trim();
        if (!title) return;

        const imgEl = $anime.find("img");
        let image = imgEl.attr("src") || imgEl.attr("data-src") || "";
        if (image && !image.startsWith("http")) image = "https://www.mynimeku.com" + image;

        let episode = "";
        $anime.find("span").each((i, el) => {
          const text = $(el).text().trim();
          if (text.startsWith("E ") || text.match(/^E\s*\d+/)) {
            episode = text;
            return false;
          }
        });

        let type = "";
        $anime.find(".text-xs span").each((i, el) => {
          const text = $(el).text().trim();
          if (text.match(/^(TV|OVA|MOVIE|SPECIAL|ONA)$/i)) {
            type = text.toUpperCase();
            return false;
          }
        });

        const slug = link.split("/anime/")[1]?.replace("/", "") || "";
        animeList.push({
          title,
          slug,
          link: link.startsWith("http") ? link : "https://www.mynimeku.com" + link,
          image,
          episode: episode || "Unknown",
          type: type || "TV",
          status: "Ongoing",
        });
      });

      return animeList.filter(
        (anime, i, self) => i === self.findIndex((a) => a.slug === anime.slug)
      );
    } catch (err) {
      console.error("Error:", err.message);
      return [];
    }
  }

  async searchAnime(query) {
    try {
      const response = await axios.get(BASE_URL, { params: { s_keyword: query } });
      const html = response.data;
      const $ = cheerio.load(html);
      const searchResults = [];

      $("#first_load_result > div").each((i, el) => {
        const title = $(el).find("h3 a span[data-en-title]").text().trim();
        const url = $(el).find("h3 a").attr("href");
        const imageUrl = $(el).find("img").attr("src");
        const status = $(el).find("span.text-text-accent.block").text().trim();

        let episode = "";
        $(el)
          .find("ul.anime-metadata li, .anime-metadata span, .anime-metadata a")
          .each((j, meta) => {
            const text = $(meta).text().trim();
            const epMatch = text.match(/^E\s*(\d+)$/i) || text.match(/Episode\s*(\d+)/i);
            if (epMatch) episode = epMatch[0];
          });

        if (!episode) {
          const epEl = $(el)
            .find("[class*='episode'], [class*='ep'], span, div")
            .filter((k, e) => {
              const text = $(e).text().trim();
              return /^E\s*\d+$/i.test(text) || /Episode\s*\d+/i.test(text);
            });
          if (epEl.length > 0) episode = $(epEl[0]).text().trim();
        }

        const type = $(el)
          .find(
            "div.text-xs.text-text-color.w-full.line-clamp-1.absolute.bottom-1.text-opacity-75 span:first-child"
          )
          .text()
          .trim();
        const duration = $(el)
          .find(
            "div.text-xs.text-text-color.w-full.line-clamp-1.absolute.bottom-1.text-opacity-75 span:last-child"
          )
          .text()
          .trim();

        if (title)
          searchResults.push({
            title,
            url: url || "",
            imageUrl,
            status,
            episode: episode || "N/A",
            type,
            duration,
          });
      });

      return searchResults;
    } catch (error) {
      console.error("Error fetching anime data:", error.message);
      return [];
    }
  }

  async getAnimeDetail(url) {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      const title = $("h1 span[data-en-title]").text().trim();
      const synopsis = $("div[data-synopsis]").text().trim().replace(/\s+/g, " ");

      let imageUrl = $("div.anime-image img").attr("src");
      if (imageUrl?.startsWith("//")) imageUrl = "https:" + imageUrl;

      const details = {};
      $("section.max-h-full ul.text-\\[13px\\] li").each((i, el) => {
        const key = $(el).find("span.font-semibold").text().trim().replace(":", "");
        const value = $(el).find("span.font-normal").text().trim();
        if (key && value) details[key] = value;
      });

      const genres = [];
      $("li:contains('Genre:') a").each((i, el) => genres.push($(el).text().trim()));
      const studios = [];
      $("li:contains('Studio:') a").each((i, el) => studios.push($(el).text().trim()));
      const producers = [];
      $("li:contains('Produser:') a").each((i, el) => producers.push($(el).text().trim()));

      const episodeList = [];
      $("div.swiper-episode-anime a").each((i, el) => {
        const episodeTitle = $(el).attr("title");
        const episodeUrl = $(el).attr("href");
        if (episodeTitle && episodeUrl) episodeList.push({ title: episodeTitle, url: episodeUrl });
      });

      return { title, imageUrl, synopsis, details, genres, studios, producers, episodeList };
    } catch (error) {
      console.error("Error fetching anime detail:", error.message);
      return null;
    }
  }

  async getEpisodeDownloadLinks(url) {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      const episodeTitle =
        $("ol li:last-child a").attr("title") ||
        $("ol li:last-child a").text().trim() ||
        $("h1.title").text().trim();

      const downloadLinks = [];
      $(".download-section-item").each((i, el) => {
        const resolution = $(el).find(".download-section-item-res").text().trim();
        $(el)
          .find(".download-section-item-link")
          .each((j, linkEl) => {
            const host = $(linkEl).text().trim();
            const url = $(linkEl).attr("href");
            if (url && host) downloadLinks.push({ resolution, host, url });
          });
      });

      return { episodeTitle, downloadLinks };
    } catch (error) {
      console.error("Error scraping episode page:", error.message);
      return null;
    }
  }

  async getCloud(url) {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const title = $(".judul-mydriveku strong").text().trim();
      const fileSize = $(".label-mydriveku strong").text().trim();
      let downloadLink = $("#drive").attr("href") || $("#workers").attr("href");
      return { title, size: fileSize, downloadUrl: downloadLink };
    } catch (error) {
      return { error: error.message };
    }
  }
}

const query = process.argv.slice(2).join(" ");
if (query) {
  console.log(`🔍 Mencari anime: ${query}\n`);
  const mynimeku = new MyNimeku();
  const result = await mynimeku.searchAnime(query);
  if (!result.length) console.log("❌ Tidak ditemukan hasil.");
  else console.log("✅ Hasil pencarian:\n", result);
} else {
  console.log("❌ Masukkan nama anime!\ncontoh: node anime.js 'Otonari No Tenshi'");
}

export default MyNimeku;