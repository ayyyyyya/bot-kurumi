const axiosMod = await "axios".import()
const axios = axiosMod?.default || axiosMod

async function subfind(domain) {
  try {
    const { data } = await axios.get("https://api.subdomainfinder.in/", {
      params: { domain },
      headers: {
        "accept": "application/json,text/plain,*/*",
        "user-agent": "Mozilla/5.0"
      },
      timeout: 20000
    })
    return data
  } catch (e) {
    return null
  }
}

function cleanDomain(s) {
  return String(s || "")
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .toLowerCase()
}

export default async function on({ ev }) {
  ev.on(
    {
      cmd: ["subfind", "subdomain"],
      tag: "tools",
      energy: 20,
      args: 1
    },
    async ({ cht, args, reply }) => {
      const domain = cleanDomain(args[0])
      if (!domain || !domain.includes(".")) return reply("Domain tidak valid.")

      try {
        cht.react("⏳")
        const res = await subfind(domain)
        if (!res) return reply("Gagal ambil data subdomain.")

        const arr = res?.subdomains || res?.data || res?.result || res
        const list = Array.isArray(arr) ? arr : []

        if (!list.length) return reply("Tidak ada subdomain ditemukan.")

        const out = list
          .slice(0, 200)
          .map((v, i) => `${i + 1}. ${String(v).trim()}`)
          .join("\n")

        cht.react("✅")
        reply(`*Subdomain Finder*\nDomain: ${domain}\nTotal: ${list.length}\n\n${out}`)
      } catch (e) {
        cht.react("❌")
        reply("Error saat memproses.")
      }
    }
  )
}
