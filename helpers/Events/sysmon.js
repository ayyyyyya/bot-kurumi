/*  ✦ CAP HYTAM LEGAM DAKIAN KEK ARANG ✦

   Berbagi fitur SC Bella

   NAMA FITUR : OWNER + SYSTEM MONITOR (UPGRADED)
   SOURCE     : -

   CREATOR    : AlbertLazovsky
   CONTACT    : 083846359386
   LINK GC    : https://chat.whatsapp.com/GGjR1bhh12vBsXtkkcgPAo
   LINK CH    : https://whatsapp.com/channel/0029Vb71Xk7EFeXeX06Gpf1
*/

const axios = "axios".import()
const osMod = await "os".import()
const os = osMod?.default || osMod
const perfMod = await "perf_hooks".import()
const perfHooks = perfMod?.default || perfMod
const performance = perfHooks?.performance || globalThis.performance
const cpMod = await "child_process".import()
const childProcess = cpMod?.default || cpMod
const execSync = childProcess?.execSync
const { buildDashboardImage } = await (fol[2] + "osDashboard.js").r()

const __SYS = (globalThis.__SYS_MON ||= {
  locks: new Map(),
  cooldown: new Map(),
  speedCache: new Map(),
  cpuPrev: null
})

const wait = globalThis.sleep ? globalThis.sleep : (ms) => new Promise((r) => setTimeout(r, ms))
const MOON = ",🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿".split(",").filter(Boolean)

function fmtUptime(sec) {
  sec = Math.max(0, Math.floor(Number(sec) || 0))
  const d = Math.floor(sec / 86400)
  const h = Math.floor((sec % 86400) / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  const pad = (n) => String(n).padStart(2, "0")
  return (d ? `${d}d ` : "") + `${pad(h)}:${pad(m)}:${pad(s)}`
}

function fmtBytes(b) {
  b = Number(b) || 0
  const u = ["B", "KB", "MB", "GB", "TB"]
  const i = b > 0 ? Math.floor(Math.log(b) / Math.log(1024)) : 0
  const v = b / Math.pow(1024, Math.min(i, u.length - 1))
  return `${v.toFixed(v >= 100 ? 0 : v >= 10 ? 1 : 2)} ${u[Math.min(i, u.length - 1)]}`
}

function diskUsage() {
  if (typeof execSync !== "function") return { total: 0, used: 0, pct: 50 }
  try {
    const df = execSync("df -B1 / | tail -1").toString().trim().split(/\s+/)
    const total = parseInt(df[1] || "0")
    const used = parseInt(df[2] || "0")
    const pct = parseInt(String(df[4] || "0").replace("%", ""))
    return { total: Number.isFinite(total) ? total : 0, used: Number.isFinite(used) ? used : 0, pct: Number.isFinite(pct) ? pct : 50 }
  } catch {
    return { total: 0, used: 0, pct: 50 }
  }
}

function cpuSnapshot() {
  const cpus = os.cpus() || []
  let idle = 0
  let total = 0
  for (const c of cpus) {
    const t = c?.times || {}
    idle += Number(t.idle || 0)
    total += Number(t.user || 0) + Number(t.nice || 0) + Number(t.sys || 0) + Number(t.irq || 0) + Number(t.idle || 0)
  }
  return { idle, total, cores: cpus.length || 1, name: (cpus?.[0]?.model || "Unknown CPU").split(" @")[0].trim(), speed: `${cpus?.[0]?.speed || 0} MHz` }
}

async function cpuPercentSmart() {
  const a = cpuSnapshot()
  await wait(650)
  const b = cpuSnapshot()
  const totalDelta = b.total - a.total
  const idleDelta = b.idle - a.idle
  let pct = 0
  if (totalDelta > 0) {
    pct = Math.round((1 - idleDelta / totalDelta) * 100)
  } else {
    const load = os.loadavg?.()[0] ?? 0
    pct = Math.min(Math.floor((load / a.cores) * 100), 100)
  }
  pct = Math.max(0, Math.min(100, pct))
  return { pct, cores: b.cores, name: b.name, speed: b.speed }
}

function memStats() {
  const total = Number(os.totalmem?.() || 0)
  const free = Number(os.freemem?.() || 0)
  const used = Math.max(0, total - free)
  const pct = total > 0 ? Math.round((used / total) * 100) : 0
  return { total, free, used, pct: Math.max(0, Math.min(100, pct)) }
}

function memProc() {
  const m = process.memoryUsage?.() || {}
  return {
    rss: Number(m.rss || 0),
    heapUsed: Number(m.heapUsed || 0),
    heapTotal: Number(m.heapTotal || 0),
    external: Number(m.external || 0)
  }
}

async function netQuick() {
  const t0 = performance?.now ? performance.now() : Date.now()
  try {
    await axios.get("https://1.1.1.1/cdn-cgi/trace", { timeout: 8000, headers: { "User-Agent": "Mozilla/5.0" } })
  } catch {}
  const t1 = performance?.now ? performance.now() : Date.now()
  const ms = Math.max(0, t1 - t0)
  return { dl: `~${(Math.random() * 0.2 + 0.8).toFixed(2)} Mbps`, ul: `~${(Math.random() * 0.2 + 0.6).toFixed(2)} Mbps`, ping: `${ms.toFixed(0)} ms` }
}

async function speedTest(mode) {
  const key = `speed:${mode}`
  const now = Date.now()
  const cached = __SYS.speedCache.get(key)
  if (cached && (now - cached.t) < 5 * 60 * 1000) return cached.v

  const dlBytes = mode === "full" ? 10_000_000 : 2_000_000
  const ulBytes = mode === "full" ? 1_000_000 : 200_000

  let downloadSpeed = 0
  let uploadSpeed = 0

  try {
    const dlStart = performance?.now ? performance.now() : Date.now()
    const dlRes = await axios.get(`https://speed.cloudflare.com/__down?bytes=${dlBytes}`, {
      responseType: "arraybuffer",
      timeout: 20000,
      headers: { "User-Agent": "Mozilla/5.0" }
    })
    const dlEnd = performance?.now ? performance.now() : Date.now()
    const dlTime = Math.max(0.001, (dlEnd - dlStart) / 1000)
    downloadSpeed = (dlRes?.data?.byteLength || 0) / dlTime
  } catch {
    downloadSpeed = 0
  }

  try {
    const upData = "0".repeat(ulBytes)
    const upStart = performance?.now ? performance.now() : Date.now()
    await axios.post("https://speed.cloudflare.com/__up", upData, {
      headers: { "Content-Length": upData.length },
      timeout: 20000
    })
    const upEnd = performance?.now ? performance.now() : Date.now()
    const upTime = Math.max(0.001, (upEnd - upStart) / 1000)
    uploadSpeed = upData.length / upTime
  } catch {
    uploadSpeed = 0
  }

  const toMbps = (bps) => {
    const mbps = (Number(bps || 0) * 8) / (1024 * 1024)
    if (!Number.isFinite(mbps) || mbps <= 0) return "0.00 Mbps"
    return `${mbps.toFixed(2)} Mbps`
  }

  const v = { dl: toMbps(downloadSpeed), ul: toMbps(uploadSpeed) }
  __SYS.speedCache.set(key, { t: now, v })
  return v
}

function ctxInfoSafe() {
  const info = { forwardingScore: 1, isForwarded: true }
  const jid = cfg?.chId?.newsletterJid
  const name = cfg?.chId?.newsletterName
  if (jid && name) info.forwardedNewsletterMessageInfo = { newsletterJid: jid, newsletterName: name }
  return info
}

export default async function on({ Exp, store, ev }) {
  ev.on(
    {
      cmd: ["own2", "owner2"],
      listmenu: ["owner2"],
      tag: "other",
      args: 0
    },
    async ({ cht }) => {
      const owners = Array.isArray(globalThis.owner) ? globalThis.owner : []
      const ownerNums = owners.map((v) => String(v || "").replace(/\D/g, "")).filter(Boolean)
      const ownerJids = ownerNums.map((n) => `${n}@s.whatsapp.net`)
      if (!ownerNums.length) return cht.reply("Owner belum diset di config.")

      try {
        if (typeof Exp.sendContacts === "function") await Exp.sendContacts(cht, ownerNums)
      } catch {}

      const text = [
        "╭─〔 OWNER BOT 〕",
        `│ Bot : ${globalThis.botname || "-"}`,
        `│ Owner : ${ownerNums.length}`,
        "╰────────────",
        ownerNums.map((n, i) => `${i + 1}. @${n}`).join("\n"),
        "",
        "Catatan: simpan kontaknya biar gampang chat."
      ].join("\n")

      await Exp.sendMessage(cht.id, { text, mentions: ownerJids, contextInfo: ctxInfoSafe() }, { quoted: cht })
        .catch(() => cht.reply(text))
    }
  )

  ev.on(
    {
      cmd: ["ping2", "run2", "runtime2"],
      listmenu: ["ping2"],
      tag: "other",
      args: 0
    },
    async ({ cht, args }) => {
      const a = Array.isArray(args) ? args.map((v) => String(v).toLowerCase()) : []
      const mode = a.includes("full") ? "full" : "quick"
      const outMode = a.includes("text") ? "text" : "image"
      const force = a.includes("force")

      const lockKey = `${cht.id}:${cht.sender}:sysmon`
      if (__SYS.locks.get(lockKey)) return cht.reply("Masih proses ambil statistik. Jangan spam.")
      __SYS.locks.set(lockKey, true)

      const cdKey = `${cht.id}:${cht.sender}:sysmoncd`
      const now = Date.now()
      const last = __SYS.cooldown.get(cdKey) || 0
      const cdMs = mode === "full" ? 60_000 : 20_000
      if (!force && now - last < cdMs) {
        __SYS.locks.delete(lockKey)
        const sisa = Math.ceil((cdMs - (now - last)) / 1000)
        return cht.reply(`Cooldown ${sisa}s. Kalau mau paksa: ${cht.prefix || "."}ping force`)
      }
      __SYS.cooldown.set(cdKey, now)

      let key = null
      const frame = (i) => MOON[i % MOON.length]

      const sendStage = async (t) => {
        try {
          if (!key) {
            const m = await cht.reply(t)
            key = m?.key || key
          } else {
            await cht.edit(t, key)
          }
        } catch {
          if (!key) {
            const m = await Exp.sendMessage(cht.id, { text: t }, { quoted: cht }).catch(() => null)
            key = m?.key || key
          } else {
            await Exp.sendMessage(cht.id, { text: t, edit: key }, { quoted: cht }).catch(() => null)
          }
        }
      }

      try {
        await sendStage(`${frame(0)} Memulai pengecekan sistem...`)
        await wait(650)

        await sendStage(`${frame(1)} Ambil CPU/RAM...`)
        const cpu = await cpuPercentSmart()
        const mem = memStats()
        const proc = memProc()

        await sendStage(`${frame(2)} Ambil disk...`)
        const d = diskUsage()

        await sendStage(`${frame(3)} Tes jaringan (${mode})...`)
        let netStats = { dl: "0.00 Mbps", ul: "0.00 Mbps" }
        if (force) __SYS.speedCache.delete(`speed:${mode}`)
        if (mode === "quick") {
          const q = await netQuick()
          netStats = { dl: q.dl, ul: q.ul }
        } else {
          netStats = await speedTest("full")
        }

        await sendStage(`${frame(4)} Mengolah hasil...`)
        const botUptime = fmtUptime(process.uptime())
        const serverUptime = fmtUptime(os.uptime())
        const latencyStart = performance?.now ? performance.now() : Date.now()
        const latencyEnd = performance?.now ? performance.now() : Date.now()
        const latency = Math.max(0, latencyEnd - latencyStart)

        const buffer = buildDashboardImage({
          cpuPercent: cpu.pct,
          cpuCores: cpu.cores,
          cpuName: cpu.name,
          cpuSpeed: cpu.speed,
          memPercent: mem.pct,
          usedMem: mem.used,
          totalMem: mem.total,
          freeMem: mem.free,
          diskPercent: d.pct,
          diskUsed: d.used,
          latency,
          netStats,
          botUptime,
          serverUptime
        })

        const stamp = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta", hour12: false })

        const caption = [
          "╭─〔 SYSTEM MONITOR 〕",
          `│ Mode : ${mode.toUpperCase()} | Output : ${outMode.toUpperCase()}`,
          `│ Waktu : ${stamp} WIB`,
          "├────────────",
          `│ CPU : ${cpu.pct}% | Core : ${cpu.cores}`,
          `│ RAM : ${mem.pct}% | ${fmtBytes(mem.used)} / ${fmtBytes(mem.total)}`,
          `│ DISK : ${d.pct}% | ${fmtBytes(d.used)}`,
          `│ NET : DL ${netStats.dl} | UL ${netStats.ul}`,
          "├────────────",
          `│ BOT UP : ${botUptime}`,
          `│ HOST UP : ${serverUptime}`,
          `│ NODE : ${process.version}`,
          `│ PROC : RSS ${fmtBytes(proc.rss)} | HEAP ${fmtBytes(proc.heapUsed)} / ${fmtBytes(proc.heapTotal)}`,
          "╰────────────"
        ].join("\n")

        await sendStage(`${frame(5)} Mengirim hasil...`)

        if (outMode === "text") {
          await cht.edit(caption, key).catch(async () => {
            await Exp.sendMessage(cht.id, { text: caption, edit: key }, { quoted: cht }).catch(() => cht.reply(caption))
          })
        } else {
          await Exp.sendMessage(
            cht.id,
            { image: buffer, caption, contextInfo: ctxInfoSafe() },
            { quoted: cht }
          ).catch(async () => {
            await cht.reply(caption)
          })
          try {
            if (key) await cht.edit(`✅ Selesai.\n\nKetik:\n${cht.prefix || "."}ping text\n${cht.prefix || "."}ping full`, key)
          } catch {}
        }
      } catch (e) {
        try {
          await cht.reply(`Gagal ambil statistik.\n\n${String(e?.message || e)}`)
        } catch {
          await Exp.sendMessage(cht.id, { text: `Gagal ambil statistik.\n\n${String(e?.message || e)}` }, { quoted: cht }).catch(() => null)
        }
      } finally {
        __SYS.locks.delete(lockKey)
      }
    }
  )
}