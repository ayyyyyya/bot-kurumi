const fs = "fs".import()

export default async function on({ cht, Exp, store, ev, is }) {
  const { sender, id, reply, edit, pushName } = cht
  const { func } = Exp
  const { archiveMemories: memories } = func

  Data.preferences ??= {}
  Data.rpg ??= {}
  const metadata = Data.preferences[id] ??= {}

  const core = global.__RPG_CORE__ ??= {
    lastSweep: 0,
    sweepInterval: 60_000,
    maxNominal: 999_999_999_999_999
  }

    const _H_CORE = global.__RPG_HOUSE_CORE__ ??= {
    started: false,
    sweepEvery: 60_000
  }

  function normalizePlayer(p) {
    if (!p) return null
    p.ekonomi ??= { uang: 0, bank: 0 }
    p.life ??= { level: 1, exp: 0, nyawa: 100, tenaga: 100, max_exp: 100 }
    p.peralatan ??= {}
    p.stat ??= { attack: 10, defense: 2, speed: 5, luck: 0 }
    p.inventori ??= {}
    p.cooldown ??= {}
    p.kandang ??= {}
    p.akuarium ??= {}
    p.riwayat ??= {}
    p.riwayat.transaksi ??= []
    p.rumah ??= {}
    p.lahan ??= {}
    p.pet ??= {}
    p.limit ??= { transfer: 100000, unbox: 500 }
    p.party ??= {}
    p.tier ??= settier(p.life.level).nama
    return p
  }

  const nowCore = Date.now()
  if (nowCore - core.lastSweep >= core.sweepInterval) {
    core.lastSweep = nowCore
    for (let uid in Data.rpg) {
      let usr = normalizePlayer(Data.rpg[uid])
      if (!usr) continue
      job(usr)
      if (usr.ekonomi.uang > core.maxNominal) usr.ekonomi.uang = core.maxNominal
      if (usr.ekonomi.bank > core.maxNominal) usr.ekonomi.bank = core.maxNominal
    }
  }

  const userKey = sender.split('@')[0]
  const self = normalizePlayer(Data.rpg?.[userKey])
  if (self) {
    job(self)
    if (self.ekonomi.uang > core.maxNominal) self.ekonomi.uang = core.maxNominal
    if (self.ekonomi.bank > core.maxNominal) self.ekonomi.bank = core.maxNominal
  }

  Data.rpg ??= {}

  const TOOL_MAX = {
    armor: 150,
    pedang: 100,
    panah: 100,
    perisai: 100,
    kapak: 90,
    beliung: 90,
    pancing: 55,
    kunci: 95
  }

  const uidOf = (jid = '') => (jid || '').split('@')[0]

  const getPlayer = (uid, ensure = false) => {
    if (ensure && !Data.rpg[uid]) Data.rpg[uid] = {}
    return normalizePlayer(Data.rpg[uid])
  }

  const clamp0 = n => (n < 0 ? 0 : n)

  const fmtMoney = n => (Number(n) || 0).toLocaleString('id-ID')

  const fmtWait = ms => {
    const d = func.formatDuration(ms)
    const h = d.hours > 0 ? d.hours + ' jam ' : ''
    const m = d.minutes > 0 ? d.minutes + ' menit ' : ''
    const s = d.seconds > 0 ? d.seconds + ' detik' : ''
    return (h + m + s).trim()
  }

  const clampLife = p => {
    p.life.nyawa = clamp0(Number(p.life.nyawa) || 0)
    p.life.tenaga = clamp0(Number(p.life.tenaga) || 0)
    p.ekonomi.uang = clamp0(Number(p.ekonomi.uang) || 0)
    p.ekonomi.bank = clamp0(Number(p.ekonomi.bank) || 0)
  }

  const invGet = (p, k) => clamp0(Number(p.inventori?.[k]) || 0)

  const invAdd = (p, k, v = 1) => {
    if (!v) return
    p.inventori ??= {}
    const next = invGet(p, k) + Number(v)
    if (next > 0) p.inventori[k] = next
    else delete p.inventori[k]
  }

  const invTake = (p, k, v = 1) => {
    v = Number(v)
    if (invGet(p, k) < v) return false
    invAdd(p, k, -v)
    return true
  }

  const cdLeft = (p, key, cd) => {
    p.cooldown ??= {}
    const last = Number(p.cooldown[key]) || 0
    const left = cd - (Date.now() - last)
    return left > 0 ? left : 0
  }

  const cdGate = (p, key, cd, msg) => {
    const left = cdLeft(p, key, cd)
    if (left <= 0) return false
    reply(msg.replace('{sisa}', fmtWait(left)))
    return true
  }

  const cdSet = (p, key, ts = Date.now()) => {
    p.cooldown ??= {}
    p.cooldown[key] = ts
  }

  const removeToolEffect = (p, tool) => {
    if (!tool?.efek) return
    if (tool.efek.attack) p.stat.attack = clamp0((p.stat.attack || 0) - tool.efek.attack)
    if (tool.efek.defense) p.stat.defense = clamp0((p.stat.defense || 0) - tool.efek.defense)
    if (tool.efek.speed) p.stat.speed = clamp0((p.stat.speed || 0) - tool.efek.speed)
    if (tool.efek.luck) p.stat.luck = clamp0((p.stat.luck || 0) - tool.efek.luck)
  }

  const toolUse = (p, key, amount = 1) => {
    p.peralatan ??= {}
    const tool = p.peralatan[key]
    if (!tool) return { ok: false, missing: true }
    tool.durability = (Number(tool.durability) || 0) - Number(amount)
    if (tool.durability <= 0) {
      removeToolEffect(p, tool)
      delete p.peralatan[key]
      return { ok: false, broken: true, max: TOOL_MAX[key] || 0 }
    }
    return { ok: true, durability: tool.durability, max: TOOL_MAX[key] || tool.durability }
  }

  const requireVital = (p, req, msg) => {
    const tenaga = Number(req?.tenaga) || 0
    const nyawa = Number(req?.nyawa) || 0
    if (p.life.tenaga < tenaga || p.life.nyawa < nyawa) {
      reply(msg)
      return false
    }
    return true
  }

  const grantLoot = (p, loot) => {
    const lines = []
    for (const [k, v] of Object.entries(loot)) {
      const n = Number(v) || 0
      if (n <= 0) continue
      invAdd(p, k, n)
      lines.push(`✦ ${n}x ${k}`)
      updateQuestProgress(uidOf(sender), 'loot', { item: k, amount: n })
    }
    return lines
  }

  const pick = arr => arr[Math.floor(Math.random() * arr.length)]

  function job(user) {
    try {
      if (!user.riwayat) return

      let riw = user.riwayat
      let total = {
        hunter: riw.hunt || 0,
        miner: riw.mining || 0,
        fisher: riw.fishing || 0,
        crafter: riw.craft || 0,
        worker: riw.work || 0,
        tebang: riw.tebang || 0
      }
  
      let maxKey = Object.keys(total).reduce((a, b) => total[a] > total[b] ? a : b)

      if (!user.pekerjaan && total[maxKey] >= 100) {
        switch (maxKey) {
          case 'hunter':
            user.pekerjaan = 'Pemburu'
            user.stat.attack += 20
            break
          case 'miner':
            user.pekerjaan = 'Penambang'
            user.stat.defense += 20
            break
          case 'fisher':
            user.pekerjaan = 'Nelayan'
            user.stat.luck += 10
            break
          case 'crafter':
            user.pekerjaan = 'Perajin'
            user.stat.attack += 10
            user.stat.defense += 10
            break
          case 'tebang': 
            user.pekerjaan = 'Tukang kayu'
            user.stat.defense += 10
            break
        }
      }
    } catch (e) {
      console.error("Error di cek job:", e)
    }
  }


  function settier(level) {
    if (level <= 10) return { nama: 'F', emoj: '' }
    if (level <= 50) return { nama: 'E', emoj: '' }
    if (level <= 90) return { nama: 'D', emoj: '' }
    if (level <= 150) return { nama: 'C', emoj: '🥉' }
    if (level <= 300) return { nama: 'B', emoj: '🥈' }
    if (level <= 600) return { nama: 'A', emoj: '🥇' }
    if (level <= 900) return { nama: 'S', emoj: '🎖️' }
    if (level <= 1300) return { nama: 'SS', emoj: '🎖️' }
    if (level <= 10000) return { nama: 'SSS', emoj: '👑' }
    return { nama: 'UNKNOWN', emoj: '💀' }
  }


  function levelup(data) {
    try {
      const MAX_LEVEL = 10000;
    
      while (data.life.exp >= data.life.max_exp && data.life.level < MAX_LEVEL) {
        data.life.exp -= data.life.max_exp;
        data.life.level += 1;

        if (data.life.level <= 100) {
          data.life.max_exp = Math.floor(100 * Math.pow(1.5, data.life.level - 1));
        } else if (data.life.level <= 1000) {
          data.life.max_exp = Math.floor(5000 + (data.life.level - 100) * 200);
        } else {
          data.life.max_exp = Math.floor(185000 + (data.life.level - 1000) * 50);
        }

        const MAX_EXP = 1_000_000;
        if (data.life.max_exp > MAX_EXP) {
          data.life.max_exp = MAX_EXP;
        }

        let reward = {
          uang: Math.floor(Math.random() * 5000) + 2000 + (data.life.level * 100), 
          potion: Math.floor(Math.random() * 2) + 3 + Math.floor(data.life.level / 100),
          berlian: Math.floor(Math.random() * 15) + Math.floor(data.life.level / 200)
        }

        reward.uang = Math.min(reward.uang, 50000);
        reward.potion = Math.min(reward.potion, 10);
        reward.berlian = Math.min(reward.berlian, 50);

        data.ekonomi.uang += reward.uang;
        data.inventori.potion = (data.inventori.potion || 0) + reward.potion
        data.inventori.berlian = (data.inventori.berlian || 0) + reward.berlian
      
        const tier = settier(data.life.level)
        data.tier = tier.nama
      
        Exp.sendMessage(
          id,
          {
            text:
              "˖ ݁𖥔 ݁˖   ₊˚⊹  𝗟𝗘𝗩𝗘𝗟 𝗨𝗣  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n" +
              `Selamat! Kamu naik ke level *${data.life.level}*${tier.emoj ? ` ${tier.emoj}` : ''}\n` +
              `Tier: *${tier.nama}*\n\n` +
              "🎁Reward yang di dapatkan:\n" +
              "╭─────────────────────────────\n" +
              `│  💵Uang       : +Rp${reward.uang.toLocaleString('id-ID')}\n` +
              `│  💎Berlian    : +${reward.berlian}\n` +
              `│  🥤Potion     : +${reward.potion}\n` +
              "╰─────────────────────────────"
          }, { quoted: cht }
        )
      }

      if (data.life.level >= MAX_LEVEL) {
        data.life.max_exp = 1_000_000
      }
    } catch (e) {
      console.error("Error di cekLevelUp:", e)
    }
  }

  
  if (!cfg.rpg) cfg.rpg = {}
  if (!cfg.rpg.toko) cfg.rpg.toko = {
    barang: {
      potion: { buy: 10000, sell: 5000 },
      umpan: { buy: 2000, sell: 1000 },
      kayu: { buy: 5000, sell: 2500 },
      besi: { buy: 15000, sell: 7500 },
      batu: { buy: 3000, sell: 1500 },
      herb: { buy: 4000, sell: 2000 }
    },
    lahan: {
      jagung: { buy: 500000, sell: 250000 },
      tomat: { buy: 600000, sell: 300000 },
      gandum: { buy: 700000, sell: 350000 }
    },
    kandang: {
      sapi: { buy: 800000, sell: 400000 },
      ayam: { buy: 500000, sell: 250000 },
      kambing: { buy: 700000, sell: 350000 }
    },
    akuarium: {
      ikan: { buy: 3000, sell: 1500 },
      udang: { buy: 5000, sell: 2500 },
      kepiting: { buy: 8000, sell: 4000 },
      cumi: { buy: 10000, sell: 5000 },
      lobster: { buy: 25000, sell: 12500 }
    },
    pet: {
      kucing: { buy: 120000, sell: 60000 },
      anjing: { buy: 150000, sell: 75000 },
      naga: { buy: 500000, sell: 250000 }
    }
  }
  
  let nomtf = 20000 //atur nominal tf disini

  function getTime() {
    return new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
  }
  
  
  function VERIFIKASI(length = 10) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let code = ""
    for (let i = 0; i < length; i++) code += chars[Math.floor(Math.random() * chars.length)]
    return code
  }
  
  
  async function rek(db, awl, length = 10) {
    const chars = "0123456789"
    const prefix = awl.slice(0, 2).toUpperCase() + "-" 
    const MAX_TRIES = 1000

    function randomDigits(len) {
      let s = ""
      for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)]
      return s
    }

    for (let i = 0; i < MAX_TRIES; i++) {
      const rekening = prefix + randomDigits(length)
      const exists = Object.values(db).some(u => u?.rekening === rekening)
      if (!exists) return rekening
    }

    return prefix + Date.now().toString().slice(-length)
  }
  
  let contextInfo = {
    externalAdReply: {
      title: `❏ 𝓐𝓵𝔂𝓪 [ アリヤ ]`,
      body: `Time ${getTime()}`,
      thumbnail: fs.readFileSync(fol[10] + 'thumb1.jpg'),
      mediaUrl: `${cfg.gcurl}`,
      sourceUrl: `https://wa.me/${owner[0]}`,
      renderLargerThumbnail: false,
      showAdAttribution: true,
      mediaType: 2,
    },
    forwardingScore: 1999,
    isForwarded: true,
  }
  
  const quests = {
    daily1: {
      id: 'daily1',
      name: 'Mengumpulkan kayu',
      type: 'daily',
      description: 'Kumpulkan 20 kayu dengan menebang pohon',
      objective: { type: 'collect', item: 'kayu', amount: 20 },
      reward: { uang: 15000, exp: 50, items: { potion: 2 } },
      maxDaily: 1
    },
    daily2: {
      id: 'daily2',
      name: 'Menambang',
      type: 'daily', 
      description: 'Dapatkan 10 batu dari menambang',
      objective: { type: 'collect', item: 'batu', amount: 10 },
      reward: { uang: 12000, exp: 40, items: { umpan: 3 } },
      maxDaily: 1
    },
    daily3: {
      id: 'daily3',
      name: 'Mancing',
      type: 'daily',
      description: 'Tangkap 5 ikan dengan memancing',
      objective: { type: 'collect', item: 'ikan', amount: 5 },
      reward: { uang: 10000, exp: 35, items: { herb: 2 } },
      maxDaily: 1
    },
    daily4: {
      id: 'daily4',
      name: 'Ngamen di Kota',
      type: 'daily',
      description: 'Ngamen sebanyak 3 kali dan hibur penduduk setempat',
      objective: { type: 'activity', activity: 'ngamen', amount: 3 },
      reward: { uang: 20000, exp: 60, items: { potion: 2 } },
      maxDaily: 1
    },
    daily5: {
      id: 'daily5',
      name: 'Kerja taxi',
      type: 'daily',
      description: 'Antar orang menunju tujuan nya dengan taxi sebanyak 3x',
      objective: { type: 'activity', activity: 'taxi', amount: 3 },
      reward: { uang: 25000, exp: 70, items: { potion: 2 } },
      maxDaily: 1
    },
    main1: {
      id: 'main1',
      name: 'Bekerja',
      type: 'main',
      description: 'Selesaikan 5 kali pekerjaan apa pun',
      objective: { type: 'activity', activity: 'work', amount: 5 },
      reward: { uang: 50000, exp: 200, items: { armor: 1 } },
      requirement: { level: 5 }
    },
    main2: {
      id: 'main2', 
      name: 'Berburu hewan',
      type: 'main',
      description: 'Berburu hewan 3 kali',
      objective: { type: 'activity', activity: 'hunt', amount: 3 },
      reward: { uang: 75000, exp: 300, items: { pedang: 1 } },
      requirement: { level: 10 }
    },
    main3: {
      id: 'main3',
      name: 'Farm exp',
      type: 'main', 
      description: 'Kumpulkan 50 exp dari berburu',
      objective: { type: 'gain_exp', source: 'hunt', amount: 50 },
      reward: { uang: 100000, exp: 500, items: { panah: 1 } },
      requirement: { level: 15 }
    },
    explore1: {
      id: 'explore1',
      name: 'Tebang pohon',
      type: 'exploration',
      description: 'Tebang pohon 10 kali',
      objective: { type: 'activity', activity: 'tebang', amount: 10 },
      reward: { uang: 30000, exp: 150, items: { kayu: 10 } }
    },
    explore2: {
      id: 'explore2',
      name: 'Mencari berlian',
      type: 'exploration',
      description: 'Kumpulkan 3 berlian dari menambang',
      objective: { type: 'collect', item: 'berlian', amount: 3 },
      reward: { uang: 50000, exp: 200, items: { berlian: 1 } }
    },
    combat1: {
      id: 'combat1',
      name: 'Pembunuh bayaran',
      type: 'combat',
      description: 'Bunuh 5 pemain lain',
      objective: { type: 'pvp', action: 'kill', amount: 5 },
      reward: { uang: 80000, exp: 400, items: { potion: 5 } },
    requirement: { level: 20 }
   }
  }
      
  function updateQuestProgress(userId, type, details) {
    const data = Data.rpg[userId]
    if (!data?.quest?.active) return

    const q = quests[data.quest.active]

    if (!q) return

    let shouldUpdate = false

    switch (q.objective.type) {
      case 'collect':
        if (q.objective.item === details.item) {
          data.quest.progress[q.id] = (data.quest.progress[q.id] || 0) + details.amount
          shouldUpdate = true
        }
        break
      case 'activity':
        if (q.objective.activity === type) {
          data.quest.progress[q.id] = (data.quest.progress[q.id] || 0) + 1
          shouldUpdate = true
        }
        break    
      case 'gain_exp':
        if (q.objective.source === type) {
          data.quest.progress[q.id] = (data.quest.progress[q.id] || 0) + details.exp
          shouldUpdate = true
        }
        break    
      case 'pvp':
        if (q.objective.action === type) {
          data.quest.progress[q.id] = (data.quest.progress[q.id] || 0) + 1
          shouldUpdate = true
        }
      break
    }

    if (shouldUpdate && data.quest.progress[q.id] >= q.objective.amount) {
      setTimeout(() => {
        Exp.sendMessage(
          id,
          { 
            text: `✅ Quest \`${q.name}\` telah selesai\nsilahkan kirim pesan *.quest klaim* untuk mengambil reward` 
          }
        )
      }, 1000)
    }
  }
  
  const timeoutMaling = 799999999

function msToTime(duration) {
  let seconds = Math.floor((duration / 1000) % 60)
  let minutes = Math.floor((duration / (1000 * 60)) % 60)
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
  let days = Math.floor(duration / (1000 * 60 * 60 * 24))

  const pad = n => (n < 10 ? '0' + n : '' + n)

  let parts = []
  if (days > 0) parts.push(days + ' hari')
  parts.push(pad(hours) + ' jam')
  parts.push(pad(minutes) + ' menit')
  parts.push(pad(seconds) + ' detik')

  return parts.join(' ')
}

  const _MARKET_INTERVAL = 5 * 60 * 1000
  const _MARKET_SPREAD = { stock: 0.005, crypto: 0.010 }
  const _FAKSI_MISI_CD = 8 * 60 * 1000
  const _FAKSI_RANK_MAX = 10

  const _FAKSI = {
    koboy: {
      key: "koboy",
      name: "Koboy",
      type: "netral",
      minLevel: 1,
      desc: "Pemburu bayaran & pengelana. Fokus: bounty, duel, perjalanan."
    },
    kartel: {
      key: "kartel",
      name: "Kartel",
      type: "kriminal",
      minLevel: 5,
      desc: "Sindikat terorganisir. Fokus: distribusi, pemerasan, ekspansi."
    },
    polisi: {
      key: "polisi",
      name: "Polisi",
      type: "hukum",
      minLevel: 3,
      desc: "Penegak hukum. Fokus: patroli, penyitaan, penertiban."
    },
    tentara: {
      key: "tentara",
      name: "Tentara",
      type: "hukum",
      minLevel: 7,
      desc: "Operasi skala besar. Fokus: pengamanan, operasi gabungan, disiplin."
    },
    matamata: {
      key: "matamata",
      name: "Mata-mata",
      type: "hukum",
      minLevel: 8,
      desc: "Intelijen & kontra-intelijen. Fokus: infiltrasi, analisa, operasi senyap."
    },
    pembunuh: {
      key: "pembunuh",
      name: "Pembunuh Bayaran",
      type: "kriminal",
      minLevel: 9,
      desc: "Operasi presisi. Fokus: pelacakan target, risiko tinggi."
    },
    dealer: {
      key: "dealer",
      name: "Drug Dealer",
      type: "kriminal",
      minLevel: 4,
      desc: "Perdagangan barang haram. Fokus: pasokan, penjualan, pengamanan wilayah."
    },
    mafia: {
      key: "mafia",
      name: "Mafia",
      type: "kriminal",
      minLevel: 6,
      desc: "Bisnis bayangan. Fokus: kontrol wilayah, diplomasi keras."
    },
    teroris: {
      key: "teroris",
      name: "Teroris",
      type: "kriminal",
      minLevel: 10,
      desc: "Faksi fiksi berisiko tinggi. Fokus: agitasi & sabotase fiktif."
    },
    pemerintah: {
      key: "pemerintah",
      name: "Pemerintah",
      type: "hukum",
      minLevel: 10,
      desc: "Kebijakan & stabilitas. Fokus: administrasi, pengawasan, operasi terpadu."
    }
  }


const _fmt = (n) => (Number(n) || 0).toLocaleString("id-ID")
const _pct = (x) => `${x >= 0 ? "+" : "-"}${Math.abs(Number(x) || 0).toFixed(2)}%`

const _time = (ms) => {
  const d = new Date(ms)
  const hh = String(d.getHours()).padStart(2, "0")
  const mm = String(d.getMinutes()).padStart(2, "0")
  const ss = String(d.getSeconds()).padStart(2, "0")
  return `${hh}:${mm}:${ss}`
}

const _toParts = (args) => {
  if (Array.isArray(args)) return args.map(String).filter(Boolean)
  return String(args || "").trim().split(/\s+/).filter(Boolean)
}

const _uid = (jid) => String(jid || "").split("@")[0]
const _player = (jid) => normalizePlayer(Data.rpg?.[_uid(jid)])

const _short = (s, n = 14) => {
  s = String(s || "")
  return s.length > n ? s.slice(0, n - 1) + "…" : s
}

const _pad = (s, n) => String(s ?? "").padEnd(n, " ")
const _table = (headers, rows) => {
  const cols = headers.length
  const w = new Array(cols).fill(0)
  for (let i = 0; i < cols; i++) w[i] = String(headers[i]).length
  for (const r of rows) for (let i = 0; i < cols; i++) w[i] = Math.max(w[i], String(r[i] ?? "").length)
  const line = (arr) => arr.map((v, i) => _pad(v, w[i])).join("  ")
  const sep = w.map(x => "─".repeat(x)).join("  ")
  return "```" + "\n" + line(headers) + "\n" + sep + "\n" + rows.map(line).join("\n") + "\n" + "```"
}

const _invOf = (p) => {
  p.invest ??= { holdings: {}, last: 0 }
  p.invest.holdings ??= {}
  p.invest.last ??= 0
  return p.invest
}

const _mkSeed = () => 1000 + Math.floor(Math.random() * 5000)

const _mkBase = () => ({
  TSLA: { type: "stock", name: "Tesla", p: 250000, v: 0.020, seed: _mkSeed(), prev: 250000 },
  NVDA: { type: "stock", name: "NVIDIA", p: 900000, v: 0.030, seed: _mkSeed(), prev: 900000 },
  AAPL: { type: "stock", name: "Apple", p: 300000, v: 0.015, seed: _mkSeed(), prev: 300000 },
  MSFT: { type: "stock", name: "Microsoft", p: 420000, v: 0.016, seed: _mkSeed(), prev: 420000 },
  AMZN: { type: "stock", name: "Amazon", p: 380000, v: 0.018, seed: _mkSeed(), prev: 380000 },
  GOOGL: { type: "stock", name: "Google", p: 410000, v: 0.017, seed: _mkSeed(), prev: 410000 },
  META: { type: "stock", name: "Meta", p: 360000, v: 0.019, seed: _mkSeed(), prev: 360000 },
  AMD: { type: "stock", name: "AMD", p: 290000, v: 0.022, seed: _mkSeed(), prev: 290000 },
  NFLX: { type: "stock", name: "Netflix", p: 520000, v: 0.021, seed: _mkSeed(), prev: 520000 },
  INTC: { type: "stock", name: "Intel", p: 180000, v: 0.019, seed: _mkSeed(), prev: 180000 },

  BTC: { type: "crypto", name: "Bitcoin", p: 900000000, v: 0.045, seed: _mkSeed(), prev: 900000000 },
  ETH: { type: "crypto", name: "Ethereum", p: 45000000, v: 0.055, seed: _mkSeed(), prev: 45000000 },
  SOL: { type: "crypto", name: "Solana", p: 2500000, v: 0.070, seed: _mkSeed(), prev: 2500000 },
  BNB: { type: "crypto", name: "BNB", p: 9500000, v: 0.060, seed: _mkSeed(), prev: 9500000 },
  XRP: { type: "crypto", name: "XRP", p: 9500, v: 0.090, seed: _mkSeed(), prev: 9500 },
  ADA: { type: "crypto", name: "Cardano", p: 7200, v: 0.095, seed: _mkSeed(), prev: 7200 },
  DOGE: { type: "crypto", name: "Dogecoin", p: 1800, v: 0.120, seed: _mkSeed(), prev: 1800 },
  LTC: { type: "crypto", name: "Litecoin", p: 1450000, v: 0.060, seed: _mkSeed(), prev: 1450000 },
  TRX: { type: "crypto", name: "TRON", p: 2200, v: 0.110, seed: _mkSeed(), prev: 2200 },
  DOT: { type: "crypto", name: "Polkadot", p: 118000, v: 0.085, seed: _mkSeed(), prev: 118000 },
  LINK: { type: "crypto", name: "Chainlink", p: 265000, v: 0.080, seed: _mkSeed(), prev: 265000 },
  AVAX: { type: "crypto", name: "Avalanche", p: 420000, v: 0.085, seed: _mkSeed(), prev: 420000 },
  MATIC: { type: "crypto", name: "Polygon", p: 14500, v: 0.105, seed: _mkSeed(), prev: 14500 },
  SHIB: { type: "crypto", name: "Shiba Inu", p: 12, v: 0.180, seed: _mkSeed(), prev: 12 },
  PEPE: { type: "crypto", name: "Pepe", p: 7, v: 0.220, seed: _mkSeed(), prev: 7 },
  SUI: { type: "crypto", name: "Sui", p: 18000, v: 0.140, seed: _mkSeed(), prev: 18000 },
  TON: { type: "crypto", name: "Toncoin", p: 52000, v: 0.090, seed: _mkSeed(), prev: 52000 },
  ARB: { type: "crypto", name: "Arbitrum", p: 23000, v: 0.120, seed: _mkSeed(), prev: 23000 },
  OP: { type: "crypto", name: "Optimism", p: 21000, v: 0.125, seed: _mkSeed(), prev: 21000 }
})

const _mkMerge = (items, base) => {
  for (const sym in base) {
    if (!items[sym]) items[sym] = base[sym]
    const it = items[sym]
    const b = base[sym]
    it.type ??= b.type
    it.name ??= b.name
    it.v ??= b.v
    it.seed ??= b.seed
    it.p = Number(it.p ?? b.p) || 1
    it.prev = Number(it.prev ?? it.p) || it.p
  }
}

const _mkEnsure = () => {
  Data.rpgMarket ??= { lastUpdate: 0, items: {}, refreshCD: {} }
  Data.rpgMarket.items ??= {}
  Data.rpgMarket.refreshCD ??= {}
  _mkMerge(Data.rpgMarket.items, _mkBase())
  return Data.rpgMarket
}

const _mkTick = (force = false) => {
  const mk = _mkEnsure()
  const now = Date.now()
  const last = mk.lastUpdate || 0
  if (!force && now - last < _MARKET_INTERVAL) return mk

  const items = mk.items
  for (const k in items) {
    const it = items[k]
    const cur = Number(it.p) || 1
    it.prev = cur

    const vol = (Number(it.v) || 0.02) * (0.6 + Math.random() * 0.8)
    const drift = (Math.random() - 0.5) * 0.6
    const shock = Math.random() < 0.08 ? (Math.random() - 0.5) * 4 : 0
    const move = (drift + shock) * vol

    let next = Math.floor(cur * (1 + move))
    if (next < 1) next = 1
    it.p = next
    it.seed = (it.seed || 0) + Math.floor(Math.random() * 100)
  }
  mk.lastUpdate = now
  return mk
}

const _quote = (sym) => {
  sym = String(sym || "").toUpperCase()
  const mk = _mkTick(false)
  const it = mk.items?.[sym]
  if (!it) return null

  const mid = Number(it.p) || 1
  const prev = Number(it.prev) || mid
  const spread = _MARKET_SPREAD[it.type] || 0.01
  const buy = Math.max(1, Math.floor(mid * (1 + spread)))
  const sell = Math.max(1, Math.floor(mid * (1 - spread)))
  const chg = prev ? ((mid - prev) / prev) * 100 : 0

  return { sym, type: it.type, name: it.name || sym, mid, buy, sell, chg }
}

const _mkList = (type = "") => {
  const mk = _mkTick(false)
  const out = []
  for (const sym in mk.items) {
    const q = _quote(sym)
    if (!q) continue
    if (type && q.type !== type) continue
    out.push(q)
  }
  out.sort((a, b) => b.mid - a.mid)
  return out
}

const _invBuy = (p, sym, qtyRaw) => {
  const q = _quote(sym)
  if (!q) return { ok: false, msg: "Kode tidak ada di market." }

  let qty
  const qv = String(qtyRaw || "").toLowerCase()
  if (qv === "all") qty = Math.floor((p.ekonomi?.uang || 0) / q.buy)
  else qty = Math.floor(Number(qtyRaw) || 0)

  if (qty <= 0) return { ok: false, msg: "Qty harus > 0 (atau pakai all)." }

  const cost = q.buy * qty
  if ((p.ekonomi?.uang || 0) < cost) return { ok: false, msg: `Uang kamu kurang. Butuh ${_fmt(cost)}.` }

  const inv = _invOf(p)
  inv.holdings[q.sym] ??= { qty: 0, avg: 0, type: q.type, name: q.name }
  const h = inv.holdings[q.sym]

  const oldQty = Number(h.qty) || 0
  const oldAvg = Number(h.avg) || 0
  const newQty = oldQty + qty
  const newAvg = newQty ? Math.floor((oldQty * oldAvg + qty * q.buy) / newQty) : 0

  p.ekonomi.uang -= cost
  h.qty = newQty
  h.avg = newAvg
  h.type = q.type
  h.name = q.name

  return {
    ok: true,
    msg:
      `✅ BUY BERHASIL\n` +
      `Asset : ${q.sym} (${q.type})\n` +
      `Qty   : ${_fmt(qty)}\n` +
      `Buy   : ${_fmt(q.buy)}\n` +
      `Total : ${_fmt(cost)}\n` +
      `Uang  : ${_fmt(p.ekonomi?.uang || 0)}`
  }
}

const _invSell = (p, sym, qtyRaw) => {
  sym = String(sym || "").toUpperCase()
  const inv = _invOf(p)
  const h = inv.holdings?.[sym]
  if (!h || (Number(h.qty) || 0) <= 0) return { ok: false, msg: `Kamu tidak punya ${sym}.` }

  const q = _quote(sym)
  if (!q) return { ok: false, msg: "Kode tidak ada di market." }

  let qty
  const qv = String(qtyRaw || "").toLowerCase()
  if (qv === "all") qty = Number(h.qty) || 0
  else qty = Math.floor(Number(qtyRaw) || 0)

  if (qty <= 0) return { ok: false, msg: "Qty harus > 0 (atau pakai all)." }
  if ((Number(h.qty) || 0) < qty) return { ok: false, msg: `Qty kamu kurang. Kamu punya ${_fmt(h.qty)}.` }

  const gain = q.sell * qty
  h.qty = (Number(h.qty) || 0) - qty
  if (h.qty <= 0) delete inv.holdings[sym]
  p.ekonomi.uang += gain

  return {
    ok: true,
    msg:
      `✅ SELL BERHASIL\n` +
      `Asset : ${q.sym} (${q.type})\n` +
      `Qty   : ${_fmt(qty)}\n` +
      `Sell  : ${_fmt(q.sell)}\n` +
      `Total : ${_fmt(gain)}\n` +
      `Uang  : ${_fmt(p.ekonomi?.uang || 0)}`
  }
}

const _invPortfolioMsg = (p, prefix) => {
  const inv = _invOf(p)
  const holdings = inv.holdings || {}
  const syms = Object.keys(holdings)
  if (!syms.length) {
    return { ok: true, msg: `📊 PORTFOLIO\nPortofolio kosong.\nBuka market: ${prefix}market` }
  }

  let totalValue = 0
  let totalCost = 0
  const rows = []

  for (const sym of syms) {
    const h = holdings[sym]
    const qty = Number(h.qty) || 0
    const avg = Number(h.avg) || 0
    const q = _quote(sym)
    if (!q) continue

    const value = qty * q.sell
    const cost = qty * avg
    const pnl = value - cost
    const pnlPct = cost ? (pnl / cost) * 100 : 0

    totalValue += value
    totalCost += cost

    rows.push([
      sym,
      _fmt(qty),
      _fmt(avg),
      _fmt(q.sell),
      _fmt(value),
      `${pnl >= 0 ? "+" : "-"}${_fmt(Math.abs(pnl))}`,
      _pct(pnlPct)
    ])
  }

  const totalPnL = totalValue - totalCost
  const totalPnLPct = totalCost ? (totalPnL / totalCost) * 100 : 0

  const head =
    `📊 PORTFOLIO\n` +
    `Cash: ${_fmt(p.ekonomi?.uang || 0)}\n` +
    `Assets: ${rows.length}\n` +
    `Total Value: ${_fmt(totalValue)}\n` +
    `Total PnL : ${totalPnL >= 0 ? "+" : "-"}${_fmt(Math.abs(totalPnL))} (${_pct(totalPnLPct)})\n`

  const t = _table(["CODE", "QTY", "AVG", "SELL", "VALUE", "PNL", "PNL%"], rows)
  return { ok: true, msg: head + "\n" + t }
}

const _isJailed = (p) => (typeof _fIsJailed === 'function' ? _fIsJailed(p) : false)
const _jailRem = (p) => (typeof _fJailRemaining === 'function' ? _fJailRemaining(p) : 0)
const _safeClamp = (p) => {
  if (typeof clampLife === 'function') clampLife(p)
  if (typeof econClamp === 'function') econClamp(p)
}

  const _fIsJailed = (p) => {
    const f = _fGet(p)
    return Date.now() < (f.jail?.until || 0)
  }

  const _fJailRemaining = (p) => {
    const f = _fGet(p)
    const rem = (f.jail?.until || 0) - Date.now()
    return rem > 0 ? rem : 0
  }

  const _fJoin = (p, key) => {
    const def = _FAKSI[key]
    if (!def) return { ok: false, msg: "Faksi tidak ditemukan." }
    if ((p.life?.level || 1) < def.minLevel) return { ok: false, msg: `Level minimal untuk join ${def.name} adalah ${def.minLevel}.` }
    const f = _fGet(p)
    f.key = key
    f.rank = Math.max(1, f.rank || 1)
    f.exp = f.exp || 0
    f.rep = f.rep || 0
    f.heat = f.heat || 0
    p.faksi = f
    return { ok: true, msg: `✅ Kamu join faksi *${def.name}*.` }
  }

  const _fInfo = (p) => {
    const f = _fGet(p)
    if (!f.key) {
      const list = Object.values(_FAKSI)
        .map(x => `- ${x.key} (${x.name}) | minLv ${x.minLevel} | ${x.type}`)
        .join("\n")
      return { ok: true, msg: `Kamu belum punya faksi.\n\nDaftar faksi:\n${list}\n\nJoin: .faksi join <key>` }
    }
    const def = _FAKSI[f.key]
    const jailed = _fIsJailed(p)
    const rem = _fJailRemaining(p)
    const msg =
      `🏴 Faksi: ${def?.name || f.key}\n` +
      `Tipe: ${def?.type || "-"}\n` +
      `Rank: ${f.rank || 1}/${_FAKSI_RANK_MAX}\n` +
      `Exp Faksi: ${_fmt(f.exp || 0)}\n` +
      `Rep: ${_fmt(f.rep || 0)}\n` +
      `Heat: ${_fmt(f.heat || 0)}\n` +
      (jailed ? `Status: DIPENJARA (${msToTime(rem)})\nAlasan: ${f.jail?.reason || "-"}` : `Status: Bebas`)
    return { ok: true, msg }
  }

  const _fTryRankUp = (p) => {
    const f = _fGet(p)
    if (!f.key) return { ok: false, msg: "Kamu belum punya faksi." }
    if ((f.rank || 1) >= _FAKSI_RANK_MAX) return { ok: false, msg: "Rank sudah maksimal." }
    const need = (f.rank || 1) * 2500
    if ((f.exp || 0) < need) return { ok: false, msg: `Exp faksi kurang. Butuh ${_fmt(need)}.` }
    f.exp -= need
    f.rank += 1
    p.faksi = f
    return { ok: true, msg: `✅ Rank naik jadi ${f.rank}.` }
  }

  const _fMission = (p) => {
    const f = _fGet(p)
    if (!f.key) return { ok: false, msg: "Join faksi dulu: .faksi join <key>" }
    if (_fIsJailed(p)) return { ok: false, msg: `Kamu masih dipenjara. Sisa ${msToTime(_fJailRemaining(p))}.` }

    const now = Date.now()
    const remaining = _FAKSI_MISI_CD - (now - (f.last || 0))
    if (remaining > 0) return { ok: false, msg: `Cooldown misi. Tunggu ${msToTime(remaining)}.` }

    const def = _FAKSI[f.key]
    const pool = [
      { key: "patroli", name: "Patroli wilayah", type: "hukum", baseU: 25000, baseE: 300, rep: 10, heat: -3, fail: 0.08 },
      { key: "razia", name: "Razia dadakan", type: "hukum", baseU: 45000, baseE: 520, rep: 18, heat: -6, fail: 0.12 },
      { key: "infiltrasi", name: "Infiltrasi", type: "hukum", baseU: 60000, baseE: 800, rep: 26, heat: -2, fail: 0.18 },

      { key: "deal", name: "Transaksi gelap", type: "kriminal", baseU: 35000, baseE: 420, rep: 8, heat: 6, fail: 0.14 },
      { key: "pemerasan", name: "Pemerasan", type: "kriminal", baseU: 65000, baseE: 760, rep: 16, heat: 12, fail: 0.22 },
      { key: "perampokan", name: "Perampokan", type: "kriminal", baseU: 90000, baseE: 1100, rep: 22, heat: 18, fail: 0.28 },

      { key: "duel", name: "Duel kehormatan", type: "netral", baseU: 30000, baseE: 380, rep: 6, heat: 0, fail: 0.16 },
      { key: "bounty", name: "Bounty hunt", type: "netral", baseU: 70000, baseE: 900, rep: 14, heat: 2, fail: 0.20 }
    ]

    const eligible = pool.filter(x => x.type === def.type || def.type === "netral" || x.type === "netral")
    const pick = eligible[Math.floor(Math.random() * eligible.length)]
    const mult = 0.8 + Math.random() * 0.9
    const uang = Math.floor(pick.baseU * mult + (f.rank || 1) * 2500)
    const exp = Math.floor(pick.baseE * mult + (f.rank || 1) * 25)
    const rep = Math.floor(pick.rep * mult + (f.rank || 1))
    const heatDelta = Math.floor(pick.heat * (0.8 + Math.random() * 0.8))
    const failChance = Math.min(0.55, pick.fail + Math.max(0, (f.heat || 0) / 250))

    f.last = now

    if (Math.random() < failChance) {
      const fine = Math.floor(Math.max(15000, uang * (0.4 + Math.random() * 0.4)))
      const jailMin = Math.floor(6 + Math.random() * 10)
      f.jail = { until: now + jailMin * 60 * 1000, reason: "Operasi gagal / ketahuan" }
      p.ekonomi.uang = Math.max(0, (p.ekonomi.uang || 0) - fine)
      if (def.type === "kriminal") f.heat = Math.min(999, (f.heat || 0) + Math.abs(heatDelta) + 15)
      if (def.type === "hukum") f.heat = Math.max(0, (f.heat || 0) + 5)
      p.faksi = f
      return { ok: false, msg: `Misi: ${pick.name}\nOperasi gaga.... Kamu ditahan ${jailMin} menit dan kena denda ${_fmt(fine)}.` }
    }

    p.ekonomi.uang += uang
    f.exp += exp
    f.rep += rep
    if (def.type === "kriminal") f.heat = Math.min(999, (f.heat || 0) + Math.max(0, heatDelta))
    if (def.type === "hukum") f.heat = Math.max(0, (f.heat || 0) + heatDelta)

    p.faksi = f
    return {
      ok: true,
      msg:
        `Misi: ${pick.name}\n` +
        `+Uang: ${_fmt(uang)}\n` +
        `+Exp Faksi: ${_fmt(exp)}\n` +
        `+Rep: ${_fmt(rep)}\n` +
        `Heat: ${_fmt(f.heat || 0)}`
    }
  }

  const _fBail = (p) => {
    const f = _fGet(p)
    if (!_fIsJailed(p)) return { ok: false, msg: "Kamu tidak sedang dipenjara." }
    const rem = _fJailRemaining(p)
    const minutes = Math.ceil(rem / 60000)
    const cost = Math.floor(25000 + minutes * 4000 + (f.heat || 0) * 50)
    if ((p.ekonomi.uang || 0) < cost) return { ok: false, msg: `Uang kamu kurang. Butuh ${_fmt(cost)}.` }
    p.ekonomi.uang -= cost
    f.jail = { until: 0, reason: "" }
    p.faksi = f
    return { ok: true, msg: `Kamu bebas. Bayar tebusan ${_fmt(cost)}.` }
  }

  const _pickMentionJid = () => {
    const q = cht?.quoted?.sender || ""
    if (q) return q
    const m = cht?.mention || cht?.mentionedJid || []
    if (Array.isArray(m) && m.length) return m[0]
    const t = String(cht?.q || "").match(/@([0-9]{7,16})/)
    if (t?.[1]) return t[1] + "@s.whatsapp.net"
    return ""
  }

const _RPG_ADMIN_ROOTS = new Set([
  'nama', 'name', 'tier',
  'ekonomi', 'life', 'stat', 'peralatan', 'inventori', 'cooldown', 'limit',
  'kandang', 'akuarium', 'riwayat', 'rumah', 'lahan', 'pet', 'party', 'quest',
  'invest'
])

const _RPG_ADMIN_GUIDE = `╭─〔 𖦹 ࣪˖ ᴘᴀɴᴅᴜᴀɴ sᴇᴛ sᴛᴀᴛs ʀᴘɢ ˖ ࣪ 𖦹 〕─╮

*ʜᴀɴʏᴀ ᴏᴡɴᴇʀ ʏᴀɴɢ ʙɪsᴀ ᴘᴀᴋᴇ ꜰɪᴛᴜʀ ɪɴɪ!*

✦ ᴄᴏᴍᴍᴀɴᴅ:
 ── ❯ \`rpgset\`   — set value (overwrite)
 ── ❯ \`rpgadd\`   — tambah/kurang angka (delta)
 ── ❯ \`rpgget\`   — cek value path
 ── ❯ \`rpgdel\`   — hapus field/path
 ── ❯ \`rpgreset\` — reset data user (konfirmasi \`yes\`)
 ── ❯ \`rpgpaths\` — lihat root path yang diizinkan

✦ ᴄᴀʀᴀ ᴘᴀᴋᴇ:
» bisa pakai *reply* / *@tag* / *nomor* / atau kosong (default: diri sendiri / reply target)

❖ ᴄᴏɴᴛᴏʜ (set):
  ⟶ .rpgset @628xxx ekonomi.uang 500000
  ⟶ .rpgset 628xxx life.level 50
  ⟶ .rpgset (reply) stat.attack 999
  ⟶ .rpgset 08xxxx stat.speed 20

❖ ᴄᴏɴᴛᴏʜ (add):
  ⟶ .rpgadd @628xxx life.exp 2500
  ⟶ .rpgadd 628xxx ekonomi.uang -100000

❖ ᴄᴏɴᴛᴏʜ (get/del):
  ⟶ .rpgget @628xxx cooldown.ngewe
  ⟶ .rpgdel @628xxx cooldown.ngewe

✦ ɴᴏᴛᴇ:
- value bisa angka / string / true/false / null / JSON { } atau [ ]
- root yang boleh hanya dari \`rpgpaths\`

╰─── ❝ ʙᴀᴄᴀ ᴅᴇɴɢᴀɴ ᴛᴇʟɪᴛɪ ᴀɢᴀʀ ɢᴀᴋ sᴀʟᴀʜ ❞ ───╯`

const _rpgParts = (args) => {
  if (Array.isArray(args)) return args.map(v => String(v)).filter(Boolean)
  return String(args || '').trim().split(/\s+/).filter(Boolean)
}

const _rpgNumKey = (x) => String(x || '').replace(/[^\d]/g, '')

const _rpgNormKey = (digits) => {
  const d = String(digits || '')
  if (!d) return ''
  if (d.startsWith('0') && d.length > 1) return '62' + d.slice(1)
  return d
}

const _rpgJidToKey = (jid) => _rpgNormKey(String(jid || '').split('@')[0])

const _rpgLooksLikePath = (s) => {
  if (!s) return false
  if (s.includes('.')) return true
  return _RPG_ADMIN_ROOTS.has(s)
}

const _rpgPickTargetKey = (cht, parts) => {
  const senderKey = _rpgJidToKey(cht?.sender)
  const qKey = cht?.quoted?.sender ? _rpgJidToKey(cht.quoted.sender) : ''
  const m0 = parts[0] || ''

  if (!m0) return { targetKey: qKey || senderKey, shift: 0 }
  if (_rpgLooksLikePath(m0)) return { targetKey: qKey || senderKey, shift: 0 }

  const d0 = _rpgNormKey(_rpgNumKey(m0))
  if (d0) return { targetKey: d0, shift: 1 }

  if (m0.includes('@')) {
    const k = _rpgJidToKey(m0)
    if (k) return { targetKey: k, shift: 1 }
  }

  return { targetKey: qKey || senderKey, shift: 0 }
}

const _rpgParseValue = (raw) => {
  const s = String(raw ?? '').trim()
  if (!s.length) return { ok: false, val: null, err: 'Value kosong.' }

  const low = s.toLowerCase()
  if (low === 'null') return { ok: true, val: null }
  if (low === 'true') return { ok: true, val: true }
  if (low === 'false') return { ok: true, val: false }

  if (/^-?\d+(\.\d+)?$/.test(s)) return { ok: true, val: Number(s) }

  if ((s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'))) {
    try { return { ok: true, val: JSON.parse(s) } } catch { return { ok: false, val: null, err: 'JSON invalid.' } }
  }

  return { ok: true, val: s }
}

const _rpgSafePath = (path) => {
  const pth = String(path || '').trim()
  if (!pth) return { ok: false, err: 'Path kosong.' }
  if (pth.includes('[') || pth.includes(']')) return { ok: false, err: 'Path tidak boleh pakai [ ]' }

  const seg = pth.split('.').filter(Boolean)
  if (!seg.length) return { ok: false, err: 'Path invalid.' }

  for (const k of seg) {
    if (k === '__proto__' || k === 'prototype' || k === 'constructor') return { ok: false, err: 'Path terlarang.' }
  }

  if (!_RPG_ADMIN_ROOTS.has(seg[0])) return { ok: false, err: `Root tidak diizinkan: ${seg[0]}` }
  return { ok: true, seg }
}

const _rpgGetByPath = (obj, seg) => {
  let cur = obj
  for (const k of seg) {
    if (cur == null) return undefined
    cur = cur[k]
  }
  return cur
}

const _rpgSetByPath = (obj, seg, val) => {
  let cur = obj
  for (let i = 0; i < seg.length - 1; i++) {
    const k = seg[i]
    if (typeof cur[k] !== 'object' || cur[k] == null) cur[k] = {}
    cur = cur[k]
  }
  const last = seg[seg.length - 1]
  const before = cur[last]
  cur[last] = val
  return before
}

const _rpgDelByPath = (obj, seg) => {
  let cur = obj
  for (let i = 0; i < seg.length - 1; i++) {
    const k = seg[i]
    if (typeof cur?.[k] !== 'object' || cur[k] == null) return false
    cur = cur[k]
  }
  const last = seg[seg.length - 1]
  if (!(last in cur)) return false
  delete cur[last]
  return true
}

const _rpgAdminPost = (p) => {
  normalizePlayer(p)
  if (typeof job === 'function') job(p)
  if (p?.life?.level != null && typeof settier === 'function') p.tier = settier(p.life.level).nama

  if (p?.ekonomi) {
    p.ekonomi.uang = Math.max(0, Math.floor(Number(p.ekonomi.uang) || 0))
    p.ekonomi.bank = Math.max(0, Math.floor(Number(p.ekonomi.bank) || 0))
  }
  if (p?.life) {
    p.life.level = Math.max(1, Math.floor(Number(p.life.level) || 1))
    p.life.exp = Math.max(0, Math.floor(Number(p.life.exp) || 0))
    p.life.max_exp = Math.max(1, Math.floor(Number(p.life.max_exp) || 100))
    p.life.nyawa = Math.max(0, Math.floor(Number(p.life.nyawa) || 0))
    p.life.tenaga = Math.max(0, Math.floor(Number(p.life.tenaga) || 0))
  }
  if (p?.stat) {
    p.stat.attack = Math.max(0, Math.floor(Number(p.stat.attack) || 0))
    p.stat.defense = Math.max(0, Math.floor(Number(p.stat.defense) || 0))
    p.stat.speed = Math.max(0, Math.floor(Number(p.stat.speed) || 0))
    p.stat.luck = Math.floor(Number(p.stat.luck) || 0)
  }
}

const _rpgFmt = (v) => {
  if (v === null) return 'null'
  if (v === undefined) return 'undefined'
  if (typeof v === 'number') return v.toLocaleString('id-ID')
  if (typeof v === 'object') { try { return JSON.stringify(v) } catch { return String(v) } }
  return String(v)
}

const _rpgPlayerOf = (key) => {
  Data.rpg ??= {}
  const p = Data.rpg?.[key]
  if (!p) return null
  return normalizePlayer(p)
}

const _K_TAX = 0.15
const _K_DAILY_SELL_CAP = 3_000_000
const _K_DAILY_TRADE_CAP = 7_500_000
const _K_DAILY_TRADE_COUNT = 10
const _K_OFFER_TTL = 2 * 60 * 1000

const _KQ = {
  C: { name: 'Common', mult: 1.0, w: 700 },
  U: { name: 'Uncommon', mult: 1.15, w: 210 },
  R: { name: 'Rare', mult: 1.35, w: 70 },
  E: { name: 'Epic', mult: 1.6, w: 18 },
  L: { name: 'Legendary', mult: 2.0, w: 2 }
}
const _KQ_ORDER_SELL = ['L', 'E', 'R', 'U', 'C']
const _KQ_ORDER_SHOW = ['C', 'U', 'R', 'E', 'L']

const _K_ITEMS = {
  telur: { name: 'Telur', cat: 'bahan', buy: 3500, sell: 2500 },
  tepung_roti: { name: 'Tepung Roti', cat: 'bahan', buy: 4200, sell: 3000 },
  tepung_terigu: { name: 'Tepung Terigu', cat: 'bahan', buy: 4000, sell: 2800 },
  gula: { name: 'Gula', cat: 'bahan', buy: 3000, sell: 2000 },
  garam: { name: 'Garam', cat: 'bahan', buy: 1500, sell: 900 },
  minyak: { name: 'Minyak', cat: 'bahan', buy: 5000, sell: 3500 },
  bawang: { name: 'Bawang', cat: 'bahan', buy: 2800, sell: 1800 },
  sayur: { name: 'Sayur', cat: 'bahan', buy: 3200, sell: 2200 },
  ayam: { name: 'Ayam', cat: 'bahan', buy: 12000, sell: 8500 },
  daging: { name: 'Daging', cat: 'bahan', buy: 15000, sell: 10500 },
  susu: { name: 'Susu', cat: 'bahan', buy: 6500, sell: 4500 },
  coklat: { name: 'Coklat', cat: 'bahan', buy: 7000, sell: 4800 },
  kopi: { name: 'Kopi', cat: 'bahan', buy: 5000, sell: 3500 },
  teh: { name: 'Teh', cat: 'bahan', buy: 3500, sell: 2400 },
  beras: { name: 'Beras', cat: 'bahan', buy: 8000, sell: 5600 },
  kecap: { name: 'Kecap', cat: 'bahan', buy: 4200, sell: 3000 },
  cabai: { name: 'Cabai', cat: 'bahan', buy: 3000, sell: 2000 },
  keju: { name: 'Keju', cat: 'bahan', buy: 9000, sell: 6500 },
  mentega: { name: 'Mentega', cat: 'bahan', buy: 6500, sell: 4500 },
  mie_mentah: { name: 'Mie Mentah', cat: 'bahan', buy: 4500, sell: 3200 },
  ikan: { name: 'Ikan', cat: 'bahan', buy: 11000, sell: 7800 }
}

const _K_RECIPES = {
  roti: { name: 'Roti', out: 1, exp: 30, sell: 14000, need: { telur: 1, tepung_roti: 2, gula: 1 } },
  bakwan: { name: 'Bakwan', out: 1, exp: 28, sell: 12000, need: { telur: 1, tepung_terigu: 2, sayur: 1, garam: 1 } },
  mie: { name: 'Mie', out: 1, exp: 26, sell: 13000, need: { telur: 1, tepung_terigu: 2, minyak: 1 } },
  donat: { name: 'Donat', out: 1, exp: 35, sell: 16000, need: { tepung_terigu: 2, gula: 1, telur: 1, mentega: 1 } },
  kue: { name: 'Kue', out: 1, exp: 40, sell: 18000, need: { tepung_terigu: 2, gula: 2, telur: 1, susu: 1 } },
  omelet: { name: 'Omelet', out: 1, exp: 22, sell: 11000, need: { telur: 2, garam: 1, bawang: 1 } },
  ayam_goreng: { name: 'Ayam Goreng', out: 1, exp: 45, sell: 26000, need: { ayam: 1, tepung_roti: 1, minyak: 1, garam: 1 } },
  sate: { name: 'Sate', out: 1, exp: 50, sell: 30000, need: { daging: 1, kecap: 1, bawang: 1 } },
  nasi: { name: 'Nasi', out: 1, exp: 15, sell: 9000, need: { beras: 1 } },
  nasi_goreng: { name: 'Nasi Goreng', out: 1, exp: 38, sell: 21000, need: { beras: 1, telur: 1, kecap: 1, bawang: 1, cabai: 1 } },
  mie_goreng: { name: 'Mie Goreng', out: 1, exp: 36, sell: 20000, need: { mie_mentah: 1, telur: 1, kecap: 1, bawang: 1 } },
  sup_ikan: { name: 'Sup Ikan', out: 1, exp: 42, sell: 24000, need: { ikan: 1, sayur: 1, garam: 1, bawang: 1 } },
  roti_keju: { name: 'Roti Keju', out: 1, exp: 48, sell: 26000, need: { roti: 1, keju: 1, mentega: 1 } },
  coklat_panas: { name: 'Coklat Panas', out: 1, exp: 25, sell: 15000, need: { coklat: 1, susu: 1, gula: 1 } },
  kopi_susu: { name: 'Kopi Susu', out: 1, exp: 25, sell: 14000, need: { kopi: 1, susu: 1, gula: 1 } },
  es_teh: { name: 'Es Teh', out: 1, exp: 12, sell: 8000, need: { teh: 1, gula: 1 } },
  roti_telur: { name: 'Roti Telur', out: 1, exp: 34, sell: 19000, need: { roti: 1, telur: 1, mentega: 1 } },
  martabak: { name: 'Martabak', out: 1, exp: 60, sell: 38000, need: { tepung_terigu: 3, telur: 2, gula: 1, mentega: 1, coklat: 1 } },
  burger: { name: 'Burger', out: 1, exp: 65, sell: 42000, need: { roti: 1, daging: 1, keju: 1, bawang: 1 } },
  nugget: { name: 'Nugget', out: 1, exp: 55, sell: 34000, need: { ayam: 1, tepung_roti: 2, telur: 1, garam: 1 } }
}

const _kFmt = (n) => (Number(n) || 0).toLocaleString('id-ID')
const _kParts = (args) => (Array.isArray(args) ? args : String(args || '').trim().split(/\s+/)).map(v => String(v)).filter(Boolean)

const _kJidToKey = (jid) => {
  const raw = String(jid || '').split('@')[0]
  const digits = raw.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('0') && digits.length > 1) return '62' + digits.slice(1)
  return digits
}

const _kPickTargetKey = (cht) => {
  const qKey = cht?.quoted?.sender ? _kJidToKey(cht.quoted.sender) : ''
  const mentionKey = Array.isArray(cht?.mentions) && cht.mentions[0] ? _kJidToKey(cht.mentions[0]) : ''
  return mentionKey || qKey || ''
}

const _kData = () => (global.Data ??= {})
const _kRpg = () => {
  const D = _kData()
  D.rpg ??= {}
  return D.rpg
}

const _kDay = () => {
  try {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

const _kDailyOf = (p) => {
  p.kitchenDaily ??= { date: '', sellValue: 0, tradeValue: 0, tradeCount: 0 }
  const d = _kDay()
  if (p.kitchenDaily.date !== d) {
    p.kitchenDaily.date = d
    p.kitchenDaily.sellValue = 0
    p.kitchenDaily.tradeValue = 0
    p.kitchenDaily.tradeCount = 0
  }
  return p.kitchenDaily
}

const _kSkillOf = (p) => {
  p.kitchenSkill ??= { level: 1, exp: 0, max_exp: 180 }
  p.kitchenSkill.level = Math.max(1, Math.floor(Number(p.kitchenSkill.level) || 1))
  p.kitchenSkill.exp = Math.max(0, Math.floor(Number(p.kitchenSkill.exp) || 0))
  p.kitchenSkill.max_exp = Math.max(50, Math.floor(Number(p.kitchenSkill.max_exp) || 180))
  return p.kitchenSkill
}

const _kSkillGain = (p, addExp) => {
  const sk = _kSkillOf(p)
  sk.exp += Math.max(0, Math.floor(Number(addExp) || 0))
  let ups = 0
  while (sk.exp >= sk.max_exp) {
    sk.exp -= sk.max_exp
    sk.level += 1
    sk.max_exp = 180 + (sk.level - 1) * 70
    ups += 1
  }
  return { ups, level: sk.level, exp: sk.exp, max_exp: sk.max_exp }
}

const _kGetPlayer = (key) => {
  const rpg = _kRpg()
  const p = rpg?.[key]
  if (!p) return null
  return normalizePlayer(p)
}

const _kInv = (p) => {
  p.kitchenInv ??= {}
  if (typeof p.kitchenInv !== 'object' || p.kitchenInv == null || Array.isArray(p.kitchenInv)) p.kitchenInv = {}
  return p.kitchenInv
}

const _kAddItem = (p, id, qty) => {
  const inv = _kInv(p)
  const q0 = Number(inv[id]) || 0
  const q1 = q0 + qty
  if (q1 <= 0) delete inv[id]
  else inv[id] = q1
  return q1
}

const _kQty = (p, id) => Number(_kInv(p)?.[id]) || 0
const _kHasItem = (p, id, qty) => _kQty(p, id) >= qty

const _kClamp = (p) => {
  normalizePlayer(p)
  if (typeof job === 'function') job(p)
  if (typeof econClamp === 'function') econClamp(p)
  if (typeof clampLife === 'function') clampLife(p)
  if (p?.ekonomi) {
    p.ekonomi.uang = Math.max(0, Math.floor(Number(p.ekonomi.uang) || 0))
    p.ekonomi.bank = Math.max(0, Math.floor(Number(p.ekonomi.bank) || 0))
  }
  _kDailyOf(p)
  _kSkillOf(p)
}

const _kQualKey = (base, q) => `${base}#${q}`
const _kSplitQual = (id) => {
  const s = String(id || '')
  const ix = s.lastIndexOf('#')
  if (ix <= 0) return { base: s, q: '' }
  const base = s.slice(0, ix)
  const q = s.slice(ix + 1).toUpperCase()
  if (!_KQ[q]) return { base: s, q: '' }
  return { base, q }
}

const _kQualMult = (q) => (_KQ[q]?.mult || 1)
const _kQualName = (q) => (_KQ[q]?.name || '-')

const _kQualRoll = (p) => {
  const sk = _kSkillOf(p)
  const luck = Math.max(0, Math.floor(Number(p?.stat?.luck) || 0))
  const level = Math.max(1, Math.floor(Number(sk.level) || 1))
  const boost = 1 + Math.min(0.9, (level - 1) * 0.02 + luck * 0.003)

  const wC = _KQ.C.w
  const wU = Math.floor(_KQ.U.w * boost)
  const wR = Math.floor(_KQ.R.w * boost)
  const wE = Math.floor(_KQ.E.w * boost)
  const wL = Math.floor(_KQ.L.w * boost)

  const total = wC + wU + wR + wE + wL
  let r = Math.floor(Math.random() * total)

  if ((r -= wL) < 0) return 'L'
  if ((r -= wE) < 0) return 'E'
  if ((r -= wR) < 0) return 'R'
  if ((r -= wU) < 0) return 'U'
  return 'C'
}

const _kNeedText = (need) => Object.keys(need).map(id => `${id} x${need[id]}`).join(', ')
const _kPad = (s, n) => String(s).padEnd(n, ' ')

const _kGuide = (p) => `╭─〔 🍳 KITCHEN & TRADE 〕─╮

Cara cuan:
1) Beli bahan → 2) Craft produk → 3) Jual (profit)

Menu:
• ${p}bahan
• ${p}produk
• ${p}invk
• ${p}kitchenskill

Proses:
• ${p}buybahan <id> <qty>
• ${p}buat <produk> <qty>
• ${p}sellk <id[#Q]|id> <qty>

Trade Player:
• ${p}sellp @user <id[#Q]|id> <qty> <hargaTotal>
• ${p}buyp <idOffer>
• ${p}offerp
• ${p}cancelp <idOffer>

Quality produk: C/U/R/E/L (pengaruh harga)
Tax trade: 15% (masuk vault)
TTL offer: ${Math.floor(_K_OFFER_TTL / 1000)} detik

╰───────────────────────╯`

const _kMeta = (id) => {
  const { base, q } = _kSplitQual(id)
  const m = _K_ITEMS[base] || _K_RECIPES[base] || null
  if (!m) return null
  if (!q) return { ...m, id: base, base, q: '' }
  return { ...m, id: `${base}#${q}`, base, q, qname: _kQualName(q), qmult: _kQualMult(q) }
}

const _kListBahan = () => Object.keys(_K_ITEMS).sort((a, b) => (_K_ITEMS[a].buy - _K_ITEMS[b].buy))
const _kListProduk = () => Object.keys(_K_RECIPES).sort((a, b) => (_K_RECIPES[b].sell - _K_RECIPES[a].sell))

const _kTotalBase = (p, base) => {
  const inv = _kInv(p)
  let sum = Number(inv[base]) || 0
  for (const q of _KQ_ORDER_SHOW) sum += Number(inv[_kQualKey(base, q)]) || 0
  return sum
}

const _kConsumeAny = (p, base, qty) => {
  const inv = _kInv(p)
  let need = qty
  const take = []

  for (const q of _KQ_ORDER_SELL) {
    const k = _kQualKey(base, q)
    const have = Number(inv[k]) || 0
    if (have <= 0) continue
    const use = Math.min(have, need)
    if (use > 0) {
      take.push({ id: k, q, qty: use })
      inv[k] = have - use
      if (inv[k] <= 0) delete inv[k]
      need -= use
      if (need <= 0) break
    }
  }

  if (need > 0) {
    const have = Number(inv[base]) || 0
    const use = Math.min(have, need)
    if (use > 0) {
      take.push({ id: base, q: '', qty: use })
      inv[base] = have - use
      if (inv[base] <= 0) delete inv[base]
      need -= use
    }
  }

  if (need > 0) {
    for (const t of take) _kAddItem(p, t.id, t.qty)
    return { ok: false, take: [], err: 'Item kurang.' }
  }

  return { ok: true, take }
}

const _kResolveSingleQualOrFail = (p, base, qty) => {
  const inv = _kInv(p)
  for (const q of ['L', 'E', 'R', 'U', 'C']) {
    const k = _kQualKey(base, q)
    if ((Number(inv[k]) || 0) >= qty) return { ok: true, id: k, q, qty }
  }
  if ((Number(inv[base]) || 0) >= qty) return { ok: true, id: base, q: '', qty }
  const total = _kTotalBase(p, base)
  if (total <= 0) return { ok: false, err: 'Item tidak ada.' }
  return { ok: false, err: `Quality campur. Pilih spesifik: ${_KQ_ORDER_SHOW.map(q => `${base}#${q}`).join(', ')} atau ${base}` }
}

const _kEnsureTrade = () => {
  const D = _kData()
  D.rpgKitchenTrade ??= { seq: 100, offers: {} }
  D.rpgKitchenTrade.seq ??= 100
  D.rpgKitchenTrade.offers ??= {}
  D.rpgKitchenTaxVault ??= 0
  return D.rpgKitchenTrade
}

const _kOfferNew = (sellerKey, buyerKey, itemId, qty, price) => {
  const T = _kEnsureTrade()
  T.seq += 1
  const id = `KCH-${T.seq}`
  const now = Date.now()
  T.offers[id] = { id, sellerKey, buyerKey, itemId, qty, price, createdAt: now, expiresAt: now + _K_OFFER_TTL }
  return id
}

const _kOfferGet = (id) => _kEnsureTrade().offers?.[id] || null
const _kOfferDel = (id) => { delete _kEnsureTrade().offers[id] }

const _YT_LIVE_CD = 6 * 60 * 60 * 1000

const _ytKey = (jid) => String(jid || '').split('@')[0]
const _ytNum = (n) => Math.max(0, Math.floor(Number(n) || 0))

const _ytCompact = (n) => {
  n = Number(n) || 0
  const abs = Math.abs(n)
  if (abs < 1000) return String(Math.floor(n))
  const units = [
    { v: 1e12, s: 'T' },
    { v: 1e9, s: 'B' },
    { v: 1e6, s: 'M' },
    { v: 1e3, s: 'K' }
  ]
  for (const u of units) {
    if (abs >= u.v) {
      const x = n / u.v
      const d = x >= 10 ? 0 : 1
      return `${x.toFixed(d)}${u.s}`.replace('.0', '')
    }
  }
  return String(Math.floor(n))
}

const _ytMoney = (n) => `Rp ${_ytNum(n).toLocaleString('id-ID')}`

const _ytMs = (ms) => {
  ms = _ytNum(ms)
  const s = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const ss = s % 60
  const pad = (x) => String(x).padStart(2, '0')
  if (h > 0) return `${h}j ${pad(m)}m ${pad(ss)}d`
  return `${m}m ${pad(ss)}d`
}

const _ytBar = (cur, max, w = 14) => {
  cur = _ytNum(cur)
  max = Math.max(1, _ytNum(max))
  const p = Math.max(0, Math.min(1, cur / max))
  const on = Math.round(p * w)
  return '█'.repeat(on) + '░'.repeat(Math.max(0, w - on))
}

const _ytClampPlayer = (p) => {
  if (!p) return null
  p.ekonomi ??= { uang: 0, bank: 0 }
  p.life ??= { exp: 0, level: 1, nyawa: 100, tenaga: 100, max_exp: 100 }
  p.eris ??= 0
  p.yt ??= {}

  const yt = p.yt

  if (!yt.channel && p.youtube_account) yt.channel = String(p.youtube_account || '')
  yt.channel = String(yt.channel || '').trim()

  yt.niche ??= 'general'
  yt.createdAt ??= Date.now()

  yt.level ??= 1
  yt.exp ??= 0
  yt.max_exp ??= 220

  yt.subs ??= (p.subscribers ?? 0)
  yt.views ??= (p.viewers ?? 0)
  yt.likes ??= (p.like ?? 0)
  yt.videos ??= (p.ytVideos ?? 0)
  yt.liveCount ??= (p.ytLives ?? 0)
  yt.watchHours ??= (p.ytWatchHours ?? 0)
  yt.revenue ??= (p.ytRevenue ?? 0)

  yt.strikes ??= (p.ytStrikes ?? 0)
  yt.demonetized ??= (p.ytDemonetized ?? false)
  yt.reputation ??= (p.ytReputation ?? 0)
  yt.burnout ??= (p.ytBurnout ?? 0)

  yt.lastLiveAt ??= (p.lastLiveTime ?? 0)
  yt.lastRenameAt ??= (p.ytLastRenameAt ?? 0)

  yt.gear ??= {}
  yt.gear.mic ??= 1
  yt.gear.cam ??= 1
  yt.gear.pc ??= 1
  yt.gear.net ??= 1

  p.youtube_account = yt.channel || null
  p.subscribers = _ytNum(yt.subs)
  p.viewers = _ytNum(yt.views)
  p.like = _ytNum(yt.likes)
  p.playButton = _ytNum(p.playButton)

  p.lastLiveTime = _ytNum(yt.lastLiveAt)
  p.ytVideos = _ytNum(yt.videos)
  p.ytLives = _ytNum(yt.liveCount)
  p.ytWatchHours = _ytNum(yt.watchHours)
  p.ytRevenue = _ytNum(yt.revenue)

  p.ytStrikes = _ytNum(yt.strikes)
  p.ytDemonetized = !!yt.demonetized
  p.ytReputation = _ytNum(yt.reputation)
  p.ytBurnout = _ytNum(yt.burnout)
  p.ytLastRenameAt = _ytNum(yt.lastRenameAt)

  yt.level = Math.max(1, _ytNum(yt.level))
  yt.exp = _ytNum(yt.exp)
  yt.max_exp = Math.max(120, _ytNum(yt.max_exp))

  yt.subs = _ytNum(yt.subs)
  yt.views = _ytNum(yt.views)
  yt.likes = _ytNum(yt.likes)
  yt.videos = _ytNum(yt.videos)
  yt.liveCount = _ytNum(yt.liveCount)
  yt.watchHours = _ytNum(yt.watchHours)
  yt.revenue = _ytNum(yt.revenue)

  yt.strikes = Math.min(3, _ytNum(yt.strikes))
  yt.reputation = Math.min(100, _ytNum(yt.reputation))
  yt.burnout = Math.min(100, _ytNum(yt.burnout))

  yt.gear.mic = Math.min(10, Math.max(1, _ytNum(yt.gear.mic)))
  yt.gear.cam = Math.min(10, Math.max(1, _ytNum(yt.gear.cam)))
  yt.gear.pc = Math.min(10, Math.max(1, _ytNum(yt.gear.pc)))
  yt.gear.net = Math.min(10, Math.max(1, _ytNum(yt.gear.net)))

  return p
}

const _ytGain = (p, addExp) => {
  const yt = p.yt
  yt.exp += _ytNum(addExp)
  let ups = 0
  while (yt.exp >= yt.max_exp) {
    yt.exp -= yt.max_exp
    yt.level += 1
    yt.max_exp = 220 + (yt.level - 1) * 80
    ups += 1
  }
  return ups
}

const _ytAwards = (subs) => ({
  bronze: subs >= 10_000,
  silver: subs >= 100_000,
  gold: subs >= 1_000_000,
  diamond: subs >= 10_000_000,
  red: subs >= 100_000_000
})

const _ytUpdatePlayButton = (p) => {
  const subs = p.yt.subs
  const a = _ytAwards(subs)

  let tier = 0
  if (a.silver) tier = 1
  if (a.gold) tier = 2
  if (a.diamond) tier = 3

  const prev = _ytNum(p.playButton)
  if (tier > prev) p.playButton = tier
  return { prev, now: p.playButton, a }
}

const _ytMonet = (p) => {
  const subs = p.yt.subs
  const wh = p.yt.watchHours
  const ok = subs >= 1000 && wh >= 4000 && p.yt.strikes === 0 && !p.yt.demonetized
  return { ok, subs, wh }
}

const _ytNicheMult = (niche) => {
  niche = String(niche || '').toLowerCase()
  if (niche === 'gaming') return 1.12
  if (niche === 'music') return 1.08
  if (niche === 'education') return 1.10
  if (niche === 'irl') return 1.06
  if (niche === 'podcast') return 1.04
  return 1.00
}

const _ytTargetKey = (cht) => {
  const m = cht?.mentions || cht?.mention || []
  const mj = Array.isArray(m) && m[0] ? String(m[0]) : ''
  const qj = cht?.quoted?.sender ? String(cht.quoted.sender) : ''
  const s = String(cht?.sender || '')
  return _ytKey(mj || qj || s)
}

const _YT_APPEAL_CD = 12 * 60 * 60 * 1000
const _YT_REHAB_CD = 4 * 60 * 60 * 1000

const _ytP = (a) => (Array.isArray(a) ? a : String(a || '').trim().split(/\s+/)).map(v => String(v || '').trim()).filter(Boolean)

const _YT_NICHE_INFO = {
  general: { name: 'General', mult: 1.00, desc: 'Stabil, aman buat awal' },
  gaming: { name: 'Gaming', mult: 1.12, desc: 'Growth cepat, kompetitif' },
  education: { name: 'Education', mult: 1.10, desc: 'Trust tinggi, monet kuat' },
  music: { name: 'Music', mult: 1.08, desc: 'Viral chance bagus' },
  irl: { name: 'IRL', mult: 1.06, desc: 'Engagement smooth' },
  podcast: { name: 'Podcast', mult: 1.04, desc: 'Konsisten, pelan tapi naik' }
}

const _ytGearPartNorm = (s) => {
  s = String(s || '').toLowerCase()
  if (['mic', 'micro', 'microphone'].includes(s)) return 'mic'
  if (['cam', 'camera'].includes(s)) return 'cam'
  if (['pc', 'komputer'].includes(s)) return 'pc'
  if (['net', 'internet', 'wifi'].includes(s)) return 'net'
  return ''
}

const _ytGearPartName = (p) => ({ mic: 'Mic', cam: 'Cam', pc: 'PC', net: 'Net' }[p] || p)

const _ytGearStepCost = (part, toLevel) => {
  const base = 45000
  const m = { mic: 1.00, cam: 1.10, pc: 1.28, net: 0.92 }[part] || 1.00
  const lv = Math.max(1, Math.min(10, Math.floor(Number(toLevel) || 1)))
  return Math.floor(base * m * (lv * lv + lv * 1.2))
}

const _ytGearTotalCost = (part, fromLevel, toLevel) => {
  const f = Math.max(1, Math.min(10, Math.floor(Number(fromLevel) || 1)))
  const t = Math.max(1, Math.min(10, Math.floor(Number(toLevel) || 1)))
  if (t <= f) return 0
  let sum = 0
  for (let lv = f + 1; lv <= t; lv++) sum += _ytGearStepCost(part, lv)
  return sum
}

const _ytNeedYtLevel = (toGearLevel) => Math.max(1, 1 + Math.floor((Number(toGearLevel) || 1) * 1.6))

/*
const _SPIN_CD = 60 * 1000

const _spinFmt = (n) => (Number(n) || 0).toLocaleString('id-ID')

const _spinParseBet = (x) => {
  let s = String(x || '').trim().toLowerCase()
  if (!s) return 0
  s = s.replace(/\s+/g, '')
  if (s.endsWith('rb')) s = s.slice(0, -2) + 'k'
  if (s.endsWith('jt')) s = s.slice(0, -2) + 'm'
  if (s.endsWith('miliar')) s = s.replace(/miliar$/, 'b')

  let mult = 1
  if (s.endsWith('k')) { mult = 1_000; s = s.slice(0, -1) }
  else if (s.endsWith('m')) { mult = 1_000_000; s = s.slice(0, -1) }
  else if (s.endsWith('b')) { mult = 1_000_000_000; s = s.slice(0, -1) }

  const num = Math.floor(parseFloat(s.replace(/,/g, '')) * mult)
  return Number.isFinite(num) ? num : 0
}

const _spinMsToTime = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(s / 60)
  const r = s % 60
  if (m <= 0) return `${r}s`
  return `${m}m ${String(r).padStart(2, '0')}s`
}

const _spinGetPlayer = (jid) => {
  const D = global.Data ??= {}
  D.rpg ??= {}
  const id = String(jid || '').split('@')[0]
  const p = D.rpg[id]
  if (!p) return null
  p.ekonomi ??= { uang: 0, bank: 0 }
  p.ekonomi.uang = Math.max(0, Math.floor(Number(p.ekonomi.uang) || 0))
  p.ekonomi.bank = Math.max(0, Math.floor(Number(p.ekonomi.bank) || 0))
  p.spin ??= { last: 0, win: 0, lose: 0 }
  p.spin.last = Math.floor(Number(p.spin.last) || 0)
  p.spin.win = Math.floor(Number(p.spin.win) || 0)
  p.spin.lose = Math.floor(Number(p.spin.lose) || 0)
  p.debt = Math.max(0, Math.floor(Number(p.debt) || 0))
  return { id, p }
}

const _spinRollReels = (isWin) => {
  const sym = ['🍒', '🍋', '🔔', '⭐', '💎', '7️⃣']
  if (isWin) return ['💎', '💎', '💎']
  const pick = () => sym[Math.floor(Math.random() * sym.length)]
  let a = pick(), b = pick(), c = pick()
  if (a === b && b === c) c = sym[(sym.indexOf(c) + 1) % sym.length]
  return [a, b, c]
}

const _spinBaseRate = (bet) => {
  let r = 0.365
  if (bet >= 1_000_000) r = 0.350
  if (bet >= 5_000_000) r = 0.340
  if (bet >= 20_000_000) r = 0.330
  if (bet >= 100_000_000) r = 0.320
  return r
}

const _spinWinRate = (bet, wins) => {
  const base = _spinBaseRate(bet)
  const w = Math.max(0, Math.floor(Number(wins) || 0))
  const rate = base * Math.pow(0.97, w)
  return Math.max(0.08, Math.min(0.37, rate))
}

const _spinEnsureFunds = (p, need) => {
  const n = Math.max(0, Math.floor(Number(need) || 0))
  if (n <= 0) return { bankTaken: 0, debtTaken: 0, filled: 0 }

  const uang0 = Math.floor(Number(p.ekonomi.uang) || 0)
  if (uang0 >= n) return { bankTaken: 0, debtTaken: 0, filled: 0 }

  let bankTaken = 0
  let debtTaken = 0

  const lack0 = n - uang0
  const bank0 = Math.floor(Number(p.ekonomi.bank) || 0)
  bankTaken = Math.min(lack0, bank0)
  if (bankTaken > 0) {
    p.ekonomi.bank = bank0 - bankTaken
    p.ekonomi.uang = uang0 + bankTaken
  }

  const uang1 = Math.floor(Number(p.ekonomi.uang) || 0)
  const lack1 = Math.max(0, n - uang1)
  if (lack1 > 0) {
    debtTaken = lack1
    p.debt = Math.max(0, Math.floor(Number(p.debt) || 0) + debtTaken)
    p.ekonomi.uang = uang1 + debtTaken
  }

  return { bankTaken, debtTaken, filled: bankTaken + debtTaken }
}*/


const _H_TAX_WEEK = 7 * 24 * 60 * 60 * 1000
  const _H_SITA_GRACE = 5 * 24 * 60 * 60 * 1000
  const _H_RENT_CD = 6 * 60 * 60 * 1000

  const _H_CLASS_ORDER = ['rendah', 'menengah', 'tinggi', 'vip']

  const _H_CLASS = {
    rendah:   { label: 'Rendah',   price: 350_000,    tax: 25_000,   fineRate: 0.15, stash: 80,  rent: 8_000  },
    menengah: { label: 'Menengah', price: 1_250_000,  tax: 80_000,   fineRate: 0.18, stash: 160, rent: 25_000 },
    tinggi:   { label: 'Tinggi',   price: 4_500_000,  tax: 220_000,  fineRate: 0.22, stash: 320, rent: 70_000 },
    vip:      { label: 'VIP',      price: 12_500_000, tax: 500_000,  fineRate: 0.28, stash: 600, rent: 160_000 }
  }

  const _H_fmtMoney = (n) => {
    const v = Math.floor(Number(n) || 0)
    if (typeof fmtMoney === 'function') return fmtMoney(v)
    return v.toLocaleString('id-ID')
  }

  const _H_dt = (ts) => {
    const t = Number(ts) || 0
    if (!t) return '-'
    return new Date(t).toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const _H_msToTime = (ms) => {
    ms = Math.max(0, Math.floor(Number(ms) || 0))
    const s = Math.floor(ms / 1000)
    const d = Math.floor(s / 86400)
    const h = Math.floor((s % 86400) / 3600)
    const m = Math.floor((s % 3600) / 60)
    const ss = s % 60
    const pad = (x) => String(x).padStart(2, '0')
    const parts = []
    if (d > 0) parts.push(`${d} hari`)
    parts.push(`${pad(h)} jam`)
    parts.push(`${pad(m)} menit`)
    parts.push(`${pad(ss)} detik`)
    return parts.join(' ')
  }

  const _H_ensureHouse = (p) => {
    p.ekonomi ??= { uang: 0, bank: 0 }
    p.rumah ??= {}
    const r = p.rumah

    r.owned ??= false
    r.class ??= null
    r.boughtAt ??= 0

    r.tax ??= {}
    r.tax.nextAt ??= 0
    r.tax.unpaid ??= 0

    r.seized ??= false
    r.seizedAt ??= 0
    r.seizeUntil ??= 0
    r.foreclosed ??= false
    r.foreclosedAt ??= 0

    r.rent ??= {}
    r.rent.lastClaim ??= 0

    r.stash ??= {}
    r.stash.items ??= {}
    r.stash.used ??= 0
    return r
  }

  const _H_recalcStashUsed = (p) => {
    const r = _H_ensureHouse(p)
    const items = r.stash.items || {}
    let used = 0
    for (const k in items) used += Math.max(0, Math.floor(Number(items[k]) || 0))
    r.stash.used = used
    return used
  }

  const _H_payAuto = (p, amount) => {
    amount = Math.floor(Number(amount) || 0)
    if (amount <= 0) return { ok: true, walletTake: 0, bankTake: 0, paid: 0 }

    p.ekonomi ??= { uang: 0, bank: 0 }
    let w = Math.floor(Number(p.ekonomi.uang) || 0)
    let b = Math.floor(Number(p.ekonomi.bank) || 0)
    if (w < 0) w = 0
    if (b < 0) b = 0

    const walletTake = Math.min(w, amount)
    let remain = amount - walletTake
    const bankTake = Math.min(b, remain)
    remain -= bankTake

    if (remain > 0) return { ok: false, shortage: remain, walletTake, bankTake, paid: amount - remain }

    p.ekonomi.uang = w - walletTake
    p.ekonomi.bank = b - bankTake
    return { ok: true, walletTake, bankTake, paid: amount }
  }

  const _H_resetHouse = (p) => {
    const r = _H_ensureHouse(p)
    r.owned = false
    r.class = null
    r.boughtAt = 0
    r.tax.nextAt = 0
    r.tax.unpaid = 0
    r.seized = false
    r.seizedAt = 0
    r.seizeUntil = 0
    r.foreclosed = false
    r.foreclosedAt = 0
    r.rent.lastClaim = 0
    r.stash.items = {}
    r.stash.used = 0
  }

  const _H_tickHouse = (p, now = Date.now()) => {
    const r = _H_ensureHouse(p)
    if (!r.owned || !r.class || !_H_CLASS[r.class]) return
    if (r.foreclosed) return

    if (r.seized) {
      if (now >= (Number(r.seizeUntil) || 0)) {
        r.foreclosed = true
        r.foreclosedAt = now
        _H_resetHouse(p)
      }
      return
    }

    const nextAt = Number(r.tax.nextAt) || 0
    if (!nextAt) {
      r.tax.nextAt = now + _H_TAX_WEEK
      return
    }

    if (now >= nextAt) {
      const missedWeeks = Math.max(1, Math.floor((now - nextAt) / _H_TAX_WEEK) + 1)
      const baseTax = Math.floor(Number(_H_CLASS[r.class].tax) || 0)
      const add = baseTax * missedWeeks

      r.tax.unpaid = Math.floor(Number(r.tax.unpaid) || 0) + add
      r.seized = true
      r.seizedAt = now
      r.seizeUntil = now + _H_SITA_GRACE
    }
  }

  const _H_houseStatus = (p) => {
    const r = _H_ensureHouse(p)
    if (!r.owned || !r.class) return { ok: false, reason: 'NO_HOUSE' }
    if (r.foreclosed) return { ok: false, reason: 'FORECLOSED' }
    if (r.seized) return { ok: false, reason: 'SEIZED' }
    return { ok: true }
  }

  const _H_houseBox = (title, bodyLines, footLines = []) => {
    const body = Array.isArray(bodyLines) ? bodyLines : [String(bodyLines || '')]
    const foot = Array.isArray(footLines) ? footLines : [String(footLines || '')]
    const content = [
      '```',
      `╭─「 ${title} 」─╮`,
      ...body.map(x => `│ ${x}`),
      `╰────────────────────╯`,
      ...foot.filter(Boolean),
      '```'
    ].join('\n')
    return content
  }

  if (!_H_CORE.started) {
    _H_CORE.started = true
    setInterval(() => {
      try {
        Data.rpg ??= {}
        const now = Date.now()
        for (const uid in Data.rpg) {
          const p = normalizePlayer(Data.rpg[uid])
          if (!p) continue
          _H_tickHouse(p, now)
        }
      } catch {}
    }, _H_CORE.sweepEvery)
  }



/* ─=─=─=─=─=─=─=─=─=  ELAINA  ─=─=─=─=─=─=─=─=─=─ */
  
  
  
  ev.on(
    {
      cmd: ['daftar', 'register'],
      listmenu: ['daftar'],
      tag: "rpg",
      args: "`𝗣𝗮𝗻𝗱𝘂𝗮𝗻 𝗣𝗲𝗻𝗱𝗮𝗳𝘁𝗮𝗿𝗮𝗻 𝗥𝗣𝗚`\n\n" +
        "Haii " + cht.pushName + " 👋\n" +
        "Silakan ikuti contoh berikut untuk mendaftar ke dunia rpg:\n\n" +
        "𖤓 Contoh:\n" +
        cht.prefix + cht.cmd + " Nama | Umur | Jenis Kelamin\n\n" +
        "_Gunakan tanda ‘|’ untuk memisahkan setiap data, ya..._"
    },
    async ({ args }) => {
      let user = sender.split('@')[0]
      let data = Data.rpg[user]
      
      if (data) return reply(
        "anda telah terdaftar di rpg sebelumnya, silahkan ketik status untuk mengeceknya..."
      )
      
      let [nama, umr, kelamin] = args.split('|').map(v => v.trim())

      if (!nama || !umr || !kelamin)
        return reply("‼️ Nama,  umur, dan jenis kelamin harus terisi")
      
      let umur = parseInt(umr)
      if (umur < 10 || umur > 50) {
        return reply(
          `${umur > 50 ? 'Tua bangka, bukannya menikmati hidup malah sibuk main hp =⁠_⁠=' : 'Bocil di larang main gini ┐⁠(⁠￣⁠ヘ⁠￣⁠)'}`
        )
      }
      
      for (let id in Data.rpg) {
        if (Data.rpg[id]?.name?.toLowerCase() === nama.toLowerCase()) {
          return reply("‼️ Nickname tersebut udah di gunakan oleh player lain, silahkan buat nickname baru")
        }
      }
      
      let gender = kelamin.toLowerCase()
      if (!['pria', 'wanita'].includes(gender))
        return reply("‼️ Jenis kelamin yang valid cuma `pria` dan `wanita`")
      
      let verifcode = `${botname}-${VERIFIKASI(10)}-${Date.now().toString(36).toUpperCase()}`
      let rekening = await rek(Data.rpg, botname, 10)
      let tanggal = new Date().toLocaleDateString('id-ID', {
        timeZone: 'Asia/Jakarta',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    
      Data.rpg[user] = {
        nama,
        umur,
        gender,
        tier: 'F',
        pekerjaan: null,
        join: Date.now(),
        rekening,
        ekonomi: {
          uang: 50000,
          bank: 0,
        },
        life: {
          level: 1,
          exp: 10,
          nyawa: 100,
          tenaga: 100,
          max_exp: 100
        },
        peralatan: {},
        stat: {
          attack: 10,
          defense: 2,
          speed: 5,
          luck: 0,
        },
        inventori: {
          kayu: 5,
          potion: 2
        },
        cooldown: {},
        kandang: {},
        akuarium: {},
        riwayat: {
          transaksi: []
        },
        rumah: {},
        lahan: {},
        pet: {},
        limit: {
          transfer: 100000,
          unbox: 500
        },
        party: {},
        verifcode
      }
      
      await memories.add(sender)
      
      let text = "˖ ݁𖥔 ݁˖ 𝗥𝗘𝗚𝗜𝗦𝗧𝗥𝗔𝗦𝗜 𝗕𝗘𝗥𝗛𝗔𝗦𝗜𝗟 ˖ ݁𖥔 ݁˖\n\n" +
        "┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n\n" +
        "˖ ݁𖥔 ݁˖ *Data Pendaftaranmu* ⊹₊⋆\n" +
        `   ⊹ Nama: ${nama}\n` +
        `   ⊹ Umur: ${umur} tahun\n` +
        `   ⊹ Jenis Kelamin: ${kelamin}\n\n` +
        "˖ ݁𖥔 ݁˖ *Pendapatan Awal* ⊹₊⋆\n" +
        `   ⊹ Uang: 20.000\n` +
        `   ⊹ Potion: 2\n` +
        `   ⊹ Kayu: 5\n\n` +
        "🪶 Catatan dari Kak " + botname + ":\n" +
        "*.status* untuk melihat profilmu\n" +
        "*.unreg* untuk memulai lagi dari 0\n\n" +
        "┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n\n" +
        "🔏 Verifcode: " + verifcode + "\n" +
        `  - di buat pada ${tanggal}\n\n` + 
        "❔ Apasih kegunaan verifcode ini?\n" +
        "  - verifcode cuma digunakan saat ingin mereset ulang progres"
      
      await Exp.sendMessage(
        id,
        {
          text,
          contextInfo
        },
        { quoted: cht }
      )
    } 
  )

  ev.on(
    {
      cmd: ['unreg'],
      listmenu: ['unreg'],
      tag: 'rpg',
      isGroup: true
    },
    async ({args}) => {
      let user = sender.split('@')[0]
      let data = Data.rpg[user]

      let verifcode = data.verifcode
      let maxAge = 60000
      let now = Date.now()
      
      if (!args) {
        metadata.unreg ??= {}
          metadata.unreg[sender] = {
          type: 'unreg',
          startTime: now,
          endTime: now + maxAge,
          verifcode,
          usr: { name: pushName, id: sender }
        }
      
        let formatDur = func.formatDuration(maxAge)
  
        let caption = `‼️ *KONFIRMASI UNREG*\n\n` +
          "apakah anda yakin ingin menghapus semua progres yang telah di capai?\ndan semua data data anda akan hilang"
        
        let { key } = await Exp.sendMessage(
          id,
          {
            text: caption,
            footer: `jika anda yakin silahkan klik tombol dibawah, dan jika tidak cukup abaikan pesan ini\n\nBatas waktu: ${formatDur.minutes} menit`,
            buttons: [
              {
                buttonId: ".unreg " + verifcode,
                buttonText: { 
                  displayText: "Confirm"
                }
              }
            ],
            viewOnce: true,
            headerType: 6
          }, { quoted: cht }
        )

        metadata.unreg[sender].key = key

        global.timeouts ??= {}
        global.timeouts[`unreg-${sender}`] = setTimeout(async () => {
          delete metadata.unreg[sender]
          delete global.timeouts[`unreg-${sender}`]
        
          Exp.sendMessage(id, { delete: key })
        }, maxAge)
        return
      }
      
      if (args !== verifcode)
        return reply("❗ Kode verifikasi yang kamu berikan tidak sesuai dengan kode verifikasi milik mu")
        
      delete Data.rpg[user]
      delete Data.users[user]
      clearTimeout(global.timeouts?.[`unreg-${sender}`])
      delete metadata.unreg[sender]

      return reply("✅ Berhasil, unreg berhasil dilakukan\nsilahkan kirim pesan `.daftar nama | umur | jenis kelamin` jikaningin bermain rpg lagi")
    }
  )
  
  ev.on(
    {
      cmd: ['status'],
      listmenu: ['status'],
      tag: "rpg",
      isGroup: true
    },
    async () => {
      let user = sender.split('@')[0]
      let data = Data.rpg[user]
    
      if (!data) return reply("❌ Data RPG tidak ditemukan. Silakan daftar terlebih dahulu dengan .daftar")
    
      let { nama, umur, pekerjaan, ekonomi, life } = data
    
      let job = pekerjaan || 'Pengangguran'
    
      let text = "𖥔 ⟡ 𝗦𝗧𝗔𝗧𝗨𝗦 𝗣𝗘𝗧𝗨𝗔𝗟𝗔𝗡𝗚 ⟡ 𖥔݁\n"
      text += "```┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n"
      text += "\n𖥔 Nama      : " + nama  
      text += "\n𖥔 Tier      : " + data.tier
      text += "\n𖥔 Exp       : " + life.exp + "/" + life.max_exp
      text += "\n𖥔 Level     : " + life.level
      text += "\n𖥔 Pekerjaan : " + job
      text += "\n𖥔 Health    : " + life.nyawa
      text += "\n𖥔 Tenaga    : " + life.tenaga

      if (data.party && data.party.name) {
        let partyData = Data.party?.[data.party.leader]
      
        if (partyData) {
          text += "\n𖥔 Party       : " + data.party.name
          text += "\n  - " + data.party.pangkat
          text += "\n  - " + ((partyData.anggota && partyData.anggota.length > 0) ? partyData.anggota.length + " anggota" : '-')
          text += "\n  - Level " + data.party.level
        } else {
          text += "\n𖥔 Party       : (Data party tidak ditemukan)"
        }
      } else {
        text += "\n𖥔 Party       : -"
      }
    
      text += "\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈```\n"
            
      text += "⟡ Ingat: Istirahatlah sejenak, bahkan pahlawan pun butuh waktu untuk tenang"
      
      return Exp.sendMessage(
        id,
        { text, contextInfo },
        { quoted: cht}
      )
    }
  )
  
  ev.on(
    {
      cmd: ['inv', 'inventory'],
      listmenu: ['inventory'],
      tag: "rpg",
      isGroup: true
    },
    async () => {
      let user = sender.split('@')[0]
      let data = Data.rpg[user]
      let inv = data.inventori
      
      let items = Object.entries(inv)
        .filter(([key, val]) => val > 0)
        .sort((a, b) => b[1] - a[1])
        .map(([key, val]) => `𖥔 ${key.charAt(0).toUpperCase() + key.slice(1)}  : ${val}`)
        .join('\n')

      if (!items) return reply("Inventorimu masih kosong~")

      let text = "˖ ݁𖥔 ݁˖  𐙚  ˖ ݁𖥔 ݁˖  \n"
      text += "⟡ 𝗜𝗡𝗩𝗘𝗡𝗧𝗢𝗥𝗜 𝗣𝗘𝗧𝗨𝗔𝗟𝗔𝗡𝗚  ⟡\n"
      text += "┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n"
      text += items + "\n"
      text += "┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n"
      text += "🪶 Barang yang kamu dapatkan bisa di jual di toko"

      await Exp.sendMessage(
        id,
        {
          text,
          contextInfo
        },
        { quoted: cht }
      )
    }
  )
  
  ev.on(
    {
      cmd: ['atm', 'bank', 'uang'],
      listmenu: ['bank', 'uang'],
      tag: 'rpg',
      isGroup: true
    },
    async () => {
      let user = sender.split('@')[0]
      let data = Data.rpg[user]

      let uang = data.ekonomi.uang || 0
      let bank = data.ekonomi.bank || 0
      
      let pp
      try {
        pp = await Exp.profilePictureUrl(sender)
      } catch {
        pp = 'https://c.termai.cc/i77/340svy.jpg'
      }
        
      let caption = 
        `˖ ݁𖥔 ݁˖   ₊˚⊹  𝗦𝗔𝗟𝗗𝗢 𝗞𝗔𝗠𝗨  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n` +
        "╭───────────────────────\n" +
        `│  Saldo Dompet : Rp${uang.toLocaleString('id-ID')}\n` +
        `│  Saldo Bank   : Rp${bank.toLocaleString('id-ID')}\n` +
        "╰───────────────────────\n\n" +
        "✧ 𝐍𝐨𝐦𝐨𝐫 𝐑𝐞𝐤𝐞𝐧𝐢𝐧𝐠 ✧\n" +
        `${data.rekening}\n\n` +
        "✧ 𝐏𝐚𝐧𝐝𝐮𝐚𝐧 𝐓𝐫𝐚𝐧𝐬𝐚𝐤𝐬𝐢 ✧\n" +
        "•  .tabung <jumlah>  →  menabung ke bank\n" +
        "•  .tarik <jumlah>   →  menarik uang dari bank\n" +
        "•  .tranfes <nomor rek> | <jumlah> → transfer uang ke rekening tujuan\n\n" +
        "────────────────────────\n" +
        "“Tabunglah sebagian hartamu, petualang bijak tahu cara mengamankan hasil jerih payahnya”"
        
      let mes = {
        image: { url: pp }, 
        caption,
        footer: "klik tombol di bawah untuk menyalin nomor rekening anda",
        interactiveButtons: [
          {
            name: 'cta_copy',
            buttonParamsJson: JSON.stringify({
              display_text: 'salin',
              copy_code: `${data.rekening}`
            })
          }
        ]
      }
      
      await Exp.sendMessage(id, mes, { quoted: cht })
    }
  )
  
  ev.on(
    {
      cmd: ['transfer', 'tf'],
      listmenu: ['transfer'],
      tag: "rpg",
       isGroup: true,
      args: "*❗ Berikan nomor rekening tujuan dan nominalnya*\n\nSebagai contoh:\n.tf EL-9823647123 | 20000\n\n> minimal nominal Rp" + nomtf.toLocaleString('id-ID')
    },
    async ({ args }) => {
      let user = sender.split('@')[0]
      let data = Data.rpg[user]
      
      let [rekTujuan, jumlahStr] = args.split('|').map(p => p.trim())
      if (!rekTujuan || !jumlahStr) 
        return reply("‼️ Kek gini caranya `.tf EL-9823647123 | 20000`")

      let jumlah = parseInt(jumlahStr)
      if (isNaN(jumlah) || jumlah < nomtf)
        return reply(`‼️ Minimal transfer Rp${nomtf.toLocaleString('id-ID')}`)

      if (jumlah > data.limit.transfer)
        return reply(`‼️ Batas transfer harian kamu hanya Rp${data.limit.transfer.toLocaleString('id-ID')}`)

      if (data.ekonomi.uang < jumlah)
        return reply("‼️ Saldo kamu tidak cukup untuk melakukan transfer ini")

      let iduser = Object.keys(Data.rpg).find(k => Data.rpg[k].rekening === rekTujuan)
      if (!iduser) 
        return reply("‼️ Nomor rekening tujuan tidak ditemukan")
      
      if (iduser === user)
        return reply("‼️ Tidak bisa transfer ke rekening sendiri")

      let penerima = Data.rpg[iduser]
      let biayaAdmin = Math.floor(jumlah * 0.15)
      let diterima = jumlah - biayaAdmin

      data.ekonomi.uang -= jumlah
      penerima.ekonomi.bank += diterima

      data.limit.transfer -= jumlah

      let waktu = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
      data.riwayat.transaksi.push({ 
        jenis: 'Transfer Keluar', 
        jumlah, 
        admin: biayaAdmin, 
        tanggal: waktu, 
        ke: rekTujuan 
      })
      
      penerima.riwayat.transaksi.push({ 
        jenis: 'Transfer Masuk', 
        jumlah: diterima, 
        tanggal: waktu, 
        dari: data.rekening 
      })
      
      let text =  "˖ ݁𖥔 ݁˖   ₊˚⊹  𝗧𝗥𝗔𝗡𝗦𝗙𝗘𝗥  𝗕𝗘𝗥𝗛𝗔𝗦𝗜𝗟  ⊹˚₊   ˖ ݁𖥔 ݁˖  \n\n" +
        "╭─────────────────────────────\n" +
        `│  Nomor Rekening Tujuan : ${rekTujuan}\n` +
        `│  Jumlah Transfer       : Rp${jumlah.toLocaleString('id-ID')}\n` +
        `│  Biaya Admin (15%)     : Rp${biayaAdmin.toLocaleString('id-ID')}\n` +
        `│  Jumlah Diterima       : Rp${diterima.toLocaleString('id-ID')}\n` +
        "│  Status                : Sukses\n" +
        "╰─────────────────────────────\n\n" +
        `📅 ${waktu}\n` +
        "─────────────────────────────\n" +
        "Catatan: Transaksi telah tercatat dalam riwayat bank"
        
      await Exp.sendMessage(
        id,
        {
          text,
          contextInfo
        },
        { quoted: cht }
      )
    }
  )
    
  ev.on(
    {
      cmd: ['nabung', 'menabung'],
      listmenu: ['nabung'],
      tag: 'rpg',
      isGroup: true
    },
    async ({ args }) => {
      let user = sender.split('@')[0]
      let data = Data.rpg[user]
      
      if (data.ekonomi.uang <= 0) 
        return reply("‼️ Saldo kamu sisa Rp0")
        
      if (!args) 
        return reply("*❗ Berikan nominal yang ingin di tabung ke atm*")
       
      let jumlah
      if (args.toLowerCase() === "all") {
        jumlah = data.ekonomi.uang
      } else {
        jumlah = parseInt(args)
        if (isNaN(jumlah) || jumlah <= 0) 
          return reply("‼️ Masukkan jumlah uang yang ingin ditabung")
      }
      
      if (data.ekonomi.uang < jumlah)
        return reply("‼️ Uang di dompetmu tidak cukup")

      data.ekonomi.uang -= jumlah
      data.ekonomi.bank += jumlah
      data.riwayat.nabung = (data.riwayat.nabung || 0) + jumlah
      data.riwayat.transaksi.push({
        jenis: 'Menabung',
        jumlah,
        tanggal: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
      })

      reply(`✅ Berhasil menabung Rp${jumlah.toLocaleString('id-ID')} ke bank`)
    }
  )

  ev.on(
    {
      cmd: ['tarik'],
      listmenu: ['tarik'],
      tag: 'rpg',
      isGroup: true
    },
    async ({ args }) => {
      let user = sender.split('@')[0]
      let data = Data.rpg[user]
      
      if (data.ekonomi.bank <= 0) 
        return reply("‼️ Saldo bank kamu sisa Rp0")
      
      if (!args) 
        return reply("*❗ Berikan nominal yang ingin di tarik dari bank*")
        
      let jumlah
      if (args.toLowerCase() === "all") {
        jumlah = data.ekonomi.bank
      } else {
        jumlah = parseInt(args)
        if (isNaN(jumlah) || jumlah <= 0) 
          return reply("‼️ Masukkan jumlah uang yang ingin ditabung")
      }

      if (data.ekonomi.bank < jumlah) 
        return reply("‼️ Saldo bank kamu tidak cukup")

      data.ekonomi.bank -= jumlah
      data.ekonomi.uang += jumlah
      data.riwayat.tarik = (data.riwayat.tarik || 0) + jumlah
      data.riwayat.transaksi.push({
        jenis: 'Penarikan',
        jumlah,
        tanggal: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
      })
      
      reply(`✅ Berhasil menarik Rp${jumlah.toLocaleString('id-ID')} dari bank`)
    }
  )
  
  ev.on(
    {
      cmd: ['mutasi', 'riwayatbank'],
      listmenu: ['mutasi'],
      tag: 'rpg',
      isGroup: true
    },
    async () => {
      let user = sender.split('@')[0]
      let data = Data.rpg[user]

      let riwayat = data.riwayat?.transaksi || []

      if (riwayat.length === 0) 
        return reply("‼️ Belum ada riwayat transaksi bank")
        
      let recent = riwayat.slice(-10).reverse().map((t, i) => {
        return `${i + 1}. [${t.tanggal}] ${t.jenis.toUpperCase()} Rp${t.jumlah.toLocaleString('id-ID')}`
      }).join('\n')

      let totalNabung = data.riwayat.nabung || 0
      let totalTarik = data.riwayat.tarik || 0

      let text = "˖ ݁𖥔 ݁˖   ₊˚⊹  𝗥𝗜𝗪𝗔𝗬𝗔𝗧 𝗕𝗔𝗡𝗞  ⊹˚₊   ˖ ݁𖥔 ݁˖  \n\n" +
                 "╭───────────────────────\n" +
                 `│  Total Menabung : Rp${totalNabung.toLocaleString('id-ID')}\n` +
                 `│  Total Tarik    : Rp${totalTarik.toLocaleString('id-ID')}\n` +
                 "╰───────────────────────\n\n" +
                 "✧ 10 Transaksi Terakhir ✧\n" +
                 `${recent}\n\n` +
                 "────────────────────────\n" +
                 "“Catatan kecil yang menyimpan jejak kekayaanmu.”"

      await Exp.sendMessage(
        id, 
        { 
          text, 
          contextInfo
        }, 
        { quoted: cht }
      )
    }
  )
  
  ev.on(
    {
      cmd: ['craft', 'crafting'],
      listmenu: ['crafting'],
      tag: "rpg",
      isGroup: true
    },
    async ({ args }) => {
      const user = uidOf(sender)
      const data = getPlayer(user, true)

      data.riwayat.craft ??= 0

      const resep = {
        armor: { besi: 10, biaya: 50000, durability: 150, defense: 55 },
        pedang: { besi: 8, kayu: 2, biaya: 45000, durability: 100, attack: 40 },
        panah: { kayu: 5, benang: 2, biaya: 60000, durability: 100, attack: 15 },
        perisai: { besi: 8, kayu: 2, biaya: 55000, durability: 100, defense: 85 },
        kapak: { besi: 5, kayu: 3, biaya: 40000, durability: 90 },
        beliung: { besi: 6, kayu: 4, biaya: 50000, durability: 90 },
        pancing: { kayu: 3, benang: 3, biaya: 35000, durability: 55 },
        kunci: { besi: 2, biaya: 20000, durability: 95 },
        benang: { jaring: 2, biaya: 2000 }
      }

      if (!args) {
        const list = Object.entries(resep)
          .map(([nama, obj]) => {
            const bahanList = Object.entries(obj)
              .filter(([k]) => !['biaya', 'durability', 'attack', 'defense'].includes(k))
              .map(([k, v]) => `${v}x ${k}`)
              .join(', ')
            const efek = obj.attack ? `⚔️ Attack +${obj.attack}` : obj.defense ? `🛡️ Defense +${obj.defense}` : '—'
            const dur = obj.durability ? obj.durability : '—'
            return `𖥔 ${nama.charAt(0).toUpperCase() + nama.slice(1)}
   ⊹ Bahan : ${bahanList}
   ⊹ Biaya : Rp${fmtMoney(obj.biaya)}
   ⊹ Efek  : ${efek}
   ⊹ Durability : ${dur}`
          })
          .join('\n\n')

        const text =
          "˖ ݁𖥔 ݁˖   ₊˚⊹  𝗣𝗔𝗡𝗗𝗨𝗔𝗡 𝗖𝗥𝗔𝗙𝗧𝗜𝗡𝗚  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n" +
          "```┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n" +
          `${list}\n` +
          "┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈```\n\n" +
          "🪶 Cara pakai:\n" +
          "• .craft <nama_item>\n" +
          "Contoh: .craft pedang\n\n" +
          "✧ Peralatan memiliki durability terbatas. ✧"

        return Exp.sendMessage(id, { text, contextInfo }, { quoted: cht })
      }

      const item = args.trim().toLowerCase()
      const bahan = resep[item]
      if (!bahan) return reply("‼️ Barang tersebut tidak ada di daftar resep craft")

      if (bahan.durability && data.peralatan?.[item])
        return reply(`‼️ Kamu sudah punya *${item}*. Pakai dulu sampai habis durability.`)

      for (const bhn in bahan) {
        if (['biaya', 'durability', 'attack', 'defense'].includes(bhn)) continue
        if (invGet(data, bhn) < bahan[bhn])
          return reply(`‼️ Kamu kekurangan ${bhn}, butuh ${bahan[bhn]} tapi kamu hanya punya ${invGet(data, bhn)}`)
      }

      if (data.ekonomi.uang < bahan.biaya)
        return reply(`‼️ Uangmu tidak cukup. Butuh Rp${fmtMoney(bahan.biaya)}`)

      for (const bhn in bahan) {
        if (['biaya', 'durability', 'attack', 'defense'].includes(bhn)) continue
        invTake(data, bhn, bahan[bhn])
      }
      data.ekonomi.uang -= bahan.biaya

      data.peralatan ??= {}

      let efekLine = '𖥔 Efek : —'
      let durLine = '𖥔 Durability : —'

      if (!bahan.durability) {
        invAdd(data, item, 1)
        data.riwayat.craft += 1

        const text =
          "˖ ݁𖥔 ݁˖   ₊˚⊹  𝗛𝗔𝗦𝗜𝗟 𝗖𝗥𝗔𝗙𝗧𝗜𝗡𝗚  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n" +
          "┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n" +
          `𖥔 Barang : ${item.charAt(0).toUpperCase() + item.slice(1)}\n` +
          "𖥔 Status : ✅ Berhasil dibuat\n" +
          `𖥔 Biaya : Rp${fmtMoney(bahan.biaya)}\n` +
          "┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n\n" +
          "🪶 “Terbuat rapi, siap dipakai.”"

        return Exp.sendMessage(id, { text, contextInfo }, { quoted: cht })
      }

      data.peralatan[item] = {
        status: true,
        durability: bahan.durability,
        efek: {}
      }

      durLine = `𖥔 Durability : ${bahan.durability}`

      if (bahan.attack) {
        data.peralatan[item].efek.attack = bahan.attack
        data.stat.attack += bahan.attack
        efekLine = `𖥔 Efek : ⚔️ +${bahan.attack} Attack`
      } else if (bahan.defense) {
        data.peralatan[item].efek.defense = bahan.defense
        data.stat.defense += bahan.defense
        efekLine = `𖥔 Efek : 🛡️ +${bahan.defense} Defense`
      }

      data.riwayat.craft += 1

      const text =
        "˖ ݁𖥔 ݁˖   ₊˚⊹  𝗛𝗔𝗦𝗜𝗟 𝗖𝗥𝗔𝗙𝗧𝗜𝗡𝗚  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n" +
        "┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n" +
        `𖥔 Barang : ${item.charAt(0).toUpperCase() + item.slice(1)}\n` +
        "𖥔 Status : ✅ Berhasil dibuat\n" +
        `${durLine}\n` +
        `𖥔 Biaya : Rp${fmtMoney(bahan.biaya)}\n` +
        `${efekLine}\n` +
        "┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n\n" +
        "🪶 “Tempa dengan tekad, gunakan dengan kehormatan”"

      return Exp.sendMessage(id, { text, contextInfo }, { quoted: cht })
    }
  )

  ev.on(
    {
      cmd: ['kill', 'bunuh'],
      listmenu: ['kill'],
      tag: "rpg",
      isGroup: true,
      isMention: "*❗ Tag target yang ingin dibunuh/rampas*"
    },
    async () => {
      const user = uidOf(sender)
      const data = getPlayer(user)

      const target = cht.mention?.[0]
      if (!target) return reply("*❗ Tag target yang ingin dibunuh/rampas*")

      const t = uidOf(target)
      if (t === user) return reply("‼️ Kamu tidak bisa membunuh diri sendiri.")

      data.riwayat.killsuc ??= 0
      data.riwayat.killfail ??= 0

      const cd = 30 * 60 * 1000
      if (cdGate(data, 'kill', cd, "‼️ Kamu terlalu lelah untuk merampas orang lain, tunggu `{sisa} lagi`")) return

      const tdate = getPlayer(t)
      if (!tdate) return reply("❗ Target belum terdaftar di rpg, coba cari target lain")

      cdSet(data, 'kill')

      const invtar = tdate.inventori ??= {}
      const pertahanan = Number(tdate.stat?.defense) || 0
      const serangan = Number(data.stat?.attack) || 0

      const peluangMenang = (serangan / (pertahanan + serangan + 1e-9)) * 100
      const menang = Math.random() * 100 < peluangMenang

      if (menang) {
        updateQuestProgress(user, 'kill', {})
        data.riwayat.killsuc += 1

        const dropKeys = Object.keys(invtar).filter(k => invtar[k] > 0)
        let dropText = "Tapi sayangnya target gak punya barang berharga..."
        if (dropKeys.length > 0) {
          const dropItem = pick(dropKeys)
          const maxDrop = Math.max(1, Math.floor(invtar[dropItem] * (Math.random() * 0.3 + 0.1)))
          const dropJumlah = Math.min(invtar[dropItem], maxDrop)
          invTake(tdate, dropItem, dropJumlah)
          invAdd(data, dropItem, dropJumlah)
          dropText = `${dropItem} sebanyak ${dropJumlah}`
        }

        const dmg = Math.floor(Math.random() * (serangan / 2)) + 10
        tdate.life.nyawa = clamp0((tdate.life.nyawa || 0) - dmg)

        const rewardExp = Math.floor(Math.random() * 50) + 20
        const rewardUang = Math.floor(Math.random() * 10000) + 5000
        data.life.exp += rewardExp
        data.ekonomi.uang += rewardUang

        await Exp.sendMessage(
          id,
          {
            text:
              "˖ ݁𖥔 ݁˖   ₊˚⊹  𝗣𝗘𝗡𝗔𝗥𝗚𝗘𝗧𝗔𝗡 𝗕𝗘𝗥𝗛𝗔𝗦𝗜𝗟  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n" +
              `Dalam sunyi malam, kamu mendekati @${t} tanpa jejak...\n` +
              "Satu serangan cepat menuntaskan segalanya.\n\n" +
              "```╭─────────────────────────────\n" +
              `│ Korban terluka   : -${dmg} HP\n` +
              `│ Rampasan         : ${dropText}\n` +
              `│ Pengalaman       : +${rewardExp} Exp\n` +
              `│ Bayaran          : +Rp${fmtMoney(rewardUang)}\n` +
              "╰─────────────────────────────```\n\n" +
              "“Bayangan bergerak... dan dunia pun terdiam”",
            contextInfo: {
              ...contextInfo,
              mentionedJid: [target]
            }
          },
          { quoted: cht }
        )

        levelup(data)
        return
      }

      data.riwayat.killfail += 1

      const loseHP = Math.floor(Math.random() * 15) + 10
      const loseUang = Math.floor(Math.random() * 10000) + 5000
      data.life.nyawa = clamp0((data.life.nyawa || 0) - loseHP)
      data.ekonomi.uang = clamp0((data.ekonomi.uang || 0) - loseUang)

      await Exp.sendMessage(
        id,
        {
          text:
            "˖ ݁𖥔 ݁˖   ₊˚⊹  𝗣𝗘𝗡𝗔𝗥𝗚𝗘𝗧𝗔𝗡 𝗚𝗔𝗚𝗔𝗟  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n" +
            `Kamu mencoba menghabisi @${t}, tapi langkahmu terdeteksi...\n` +
            "Pisau gagal menembus, dan serangan balik membuatmu tumbang.\n\n" +
            "╭─────────────────────────────\n" +
            `│ Luka serius : -${loseHP} HP\n` +
            `│ Kehilangan  : -Rp${fmtMoney(loseUang)}\n` +
            "╰─────────────────────────────\n\n" +
            "“Bahkan bayangan pun bisa tersandung oleh cahaya”",
          contextInfo: {
            ...contextInfo,
            mentionedJid: [target]
          }
        },
        { quoted: cht }
      )
    }
  )

  ev.on(
    {
      cmd: ['tebang', 'menebang'],
      listmenu: ['tebang'],
      tag: 'rpg',
      isGroup: true
    },
    async () => {
      const user = uidOf(sender)
      const data = getPlayer(user)

      data.riwayat.tebang ??= 0

      const cd = 30 * 60 * 1000
      if (cdGate(data, 'tebang', cd, "‼️ Kamu baru saja selesai menebang pohon, istirahatlah dulu selama `{sisa}`")) return

      if (!data.peralatan?.kapak)
        return reply("‼️ Kamu belum punya *Kapak*, Craft dulu dengan `.craft kapak`")

      if (!requireVital(data, { tenaga: 15, nyawa: 10 }, "‼️ Kamu terlalu lemah untuk menebang pohon, butuh istirahat atau minum potion"))
        return

      const tool = toolUse(data, 'kapak', 1)
      if (!tool.ok) return reply("🪓 *Kapakmu patah!* Kamu kehilangan alat menebangmu.")

      const hasil = {
        kayu: Math.floor(Math.random() * 5) + 3,
        ranting: Math.floor(Math.random() * 4) + 1,
        daun: Math.floor(Math.random() * 3) + 1,
        herb: Math.random() < 0.3 ? Math.floor(Math.random() * 2) + 1 : 0,
        jaring: Math.random() < 0.15 ? 1 : 0
      }

      updateQuestProgress(user, 'tebang', {})

      const hasilText = grantLoot(data, hasil)

      let cederaText = ''
      if (Math.random() < 0.3) {
        const cederaList = [
          { text: "Kamu terpeleset dan kapak hampir kena kaki sendiri!", hp: 10, tenaga: 8 },
          { text: "Serpihan kayu beterbangan, kena matamu sedikit.", hp: 5, tenaga: 5 },
          { text: "Kamu kelelahan menebang batang besar.", hp: 8, tenaga: 10 }
        ]
        const c = pick(cederaList)
        data.life.nyawa -= c.hp
        data.life.tenaga -= c.tenaga
        clampLife(data)
        cederaText = `\n\nKamu cedera: ${c.text}\n> [ ♥️ -${c.hp} HP | ☕ -${c.tenaga} Tenaga ]`
      } else {
        data.life.tenaga -= 10
        clampLife(data)
      }

      cdSet(data, 'tebang')
      data.riwayat.tebang += 1

      const text =
        "˖ ݁𖥔 ݁˖   ₊˚⊹  𝗛𝗔𝗦𝗜𝗟 𝗡𝗘𝗕𝗔𝗡𝗚  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n" +
        "🪓 Kamu menebang beberapa pohon dan mendapatkan:\n" +
        hasilText.join('\n') + "\n\n" +
        `Durability Kapak: ${data.peralatan.kapak?.durability || 0}/${TOOL_MAX.kapak}${cederaText}\n` +
        "┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n" +
        "🪶 “Setiap ayunan kapakmu adalah langkah menuju kemakmuran.”"

      await Exp.sendMessage(id, { text, contextInfo }, { quoted: cht })
    }
  )

  ev.on(
    {
      cmd: ['menambang', 'mining', 'nambang'],
      listmenu: ['nambang'],
      tag: 'rpg',
      isGroup: true
    },
    async () => {
      const user = uidOf(sender)
      const data = getPlayer(user)

      data.riwayat.mining ??= 0

      const cd = 30 * 60 * 1000
      if (cdGate(data, 'mining', cd, "‼️ Kamu baru saja selesai menambang, silahkan tunggu sekitar `{sisa} lagi`")) return

      if (!data.peralatan?.beliung)
        return reply("‼️ Kamu belum punya *Beliung*, Craft dulu dengan .craft beliung")

      if (!requireVital(data, { tenaga: 10, nyawa: 10 }, "‼️ Kamu kelelahan, butuh istirahat sebelum melanjutkan menambang."))
        return

      const tool = toolUse(data, 'beliung', 1)
      if (!tool.ok) return reply("⛏️ *Beliungmu patah* Kamu kehilangan alat menambangmu.")

      const hasil = {
        berlian: Math.random() < 0.25 ? Math.floor(Math.random() * 2) + 1 : 0,
        besi: Math.floor(Math.random() * 5) + 2,
        emas: Math.random() < 0.3 ? Math.floor(Math.random() * 3) + 1 : 0,
        batu: Math.floor(Math.random() * 4) + 2,
        herb: Math.random() < 0.5 ? Math.floor(Math.random() * 2) + 1 : 0
      }

      updateQuestProgress(user, 'mining', {})

      const hasilText = grantLoot(data, hasil)

      let cederaText
      if (Math.random() < 0.35) {
        const cederaList = [
          { text: "Kamu terpeleset di bebatuan tajam, kaki tergores parah.", hp: 10, tenaga: 8 },
          { text: "Batu besar jatuh dan hampir menghimpitmu, kamu menahan dengan bahu.", hp: 15, tenaga: 10 },
          { text: "Serangan gas beracun dari celah gua membuatmu batuk-batuk", hp: 8, tenaga: 12 },
          { text: "Tanganmu terjepit di antara bebatuan, kamu berusaha melepaskannya dengan susah payah.", hp: 20, tenaga: 15 },
          { text: "Kamu terpukul pantulan ledakan kecil dari dinamit, tubuhmu lebam-lebam.", hp: 25, tenaga: 20 }
        ]
        const cedera = pick(cederaList)
        data.life.nyawa -= cedera.hp
        data.life.tenaga -= cedera.tenaga
        cederaText = `\n\nKamu cedera saat menambang tadi:\n${cedera.text}\n> [ ♥️ -${cedera.hp} HP | ☕ -${cedera.tenaga} Tenaga ]`
      } else {
        data.life.tenaga -= 10
      }

      clampLife(data)

      cdSet(data, 'mining')
      data.riwayat.mining += 1

      const text =
        "˖ ݁𖥔 ݁˖   ₊˚⊹  𝗛𝗔𝗦𝗜𝗟 𝗠𝗘𝗡𝗔𝗠𝗕𝗔𝗡𝗚  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n" +
        "⛏️ Kamu menggali dalam gua gelap dan menemukan:\n" +
        `${hasilText.join('\n')}\n\n` +
        `Durability Beliung: ${data.peralatan.beliung?.durability || 0}/${TOOL_MAX.beliung}${cederaText || ''}\n`

      return Exp.sendMessage(id, { text, contextInfo }, { quoted: cht })
    }
  )

  ev.on(
    {
      cmd: ['mancing', 'memancing'],
      listmenu: ['mancing'],
      tag: 'rpg',
      isGroup: true
    },
    async () => {
      const user = uidOf(sender)
      const data = getPlayer(user)

      data.riwayat.fishing ??= 0

      const cd = 30 * 60 * 1000
      if (cdGate(data, 'mancing', cd, "‼️ Kamu baru saja selesai memancing, tunggu sekitar `{sisa} lagi`")) return

      if (!data.peralatan?.pancing)
        return reply("‼️ Kamu belum punya *Pancing*, Craft dulu pakai .craft pancing")

      if (invGet(data, 'umpan') <= 5)
        return reply("‼️ Jumlah umpan kamu kurang, minimal punya lebih dari 5 umpan")

      if (!requireVital(data, { tenaga: 11, nyawa: 11 }, "‼️ Kamu kelelahan dan tidak bisa memancing sekarang"))
        return

      const tool = toolUse(data, 'pancing', 1)
      if (!tool.ok) return reply("🎣 Pancing kamu patah, ga jadi untuk pergi ke spot terbaik")

      updateQuestProgress(user, 'mancing', {})

      const hewan = [
        { nama: 'ikan', emoji: '🐟', chance: 0.7, jumlah: [2, 5], harga: 3000 },
        { nama: 'udang', emoji: '🦐', chance: 0.4, jumlah: [1, 3], harga: 5000 },
        { nama: 'kepiting', emoji: '🦀', chance: 0.25, jumlah: [1, 2], harga: 8000 },
        { nama: 'cumi', emoji: '🦑', chance: 0.15, jumlah: [1, 2], harga: 10000 },
        { nama: 'buntal', emoji: '🐡', chance: 0.1, jumlah: [1, 1], harga: 2000 },
        { nama: 'kerang', emoji: '🐚', chance: 0.08, jumlah: [1, 2], harga: 4000 },
        { nama: 'paus', emoji: '🐋', chance: 0.02, jumlah: [1, 1], harga: 50000 },
        { nama: 'lobster', emoji: '🦞', chance: 0.03, jumlah: [1, 1], harga: 25000 },
        { nama: 'sampah', emoji: '🪣', chance: 0.1, jumlah: [1, 1], harga: 0 }
      ]

      const hasilTangkap = []
      for (const item of hewan) {
        if (Math.random() >= item.chance) continue
        const jml = Math.floor(Math.random() * (item.jumlah[1] - item.jumlah[0] + 1)) + item.jumlah[0]
        hasilTangkap.push({ ...item, jml })
        data.akuarium[item.nama] = (data.akuarium[item.nama] || 0) + jml
        updateQuestProgress(user, 'loot', { item: item.nama, amount: jml })
      }

      if (hasilTangkap.length === 0) {
        cdSet(data, 'mancing')
        data.life.tenaga -= 5
        clampLife(data)
        return reply("🥲 Kamu melempar kailmu... tapi tidak ada yang menggigit umpan kali ini~")
      }

      const umpanTerpakai = Math.floor(Math.random() * 5) + 1
      invTake(data, 'umpan', umpanTerpakai)

      const totalHarga = hasilTangkap.reduce((a, b) => a + (b.harga * b.jml), 0)
      if (totalHarga > 0) data.ekonomi.uang += totalHarga

      data.life.tenaga -= 10
      cdSet(data, 'mancing')
      data.riwayat.fishing += 1
      clampLife(data)

      const hasilText = hasilTangkap
        .map(x => `${x.emoji} ${x.nama} x${x.jml} ${x.harga ? `(+Rp${fmtMoney(x.harga * x.jml)})` : ''}`)
        .join('\n')

      const text =
        "˖ ݁𖥔 ݁˖   ₊˚⊹  𝗛𝗔𝗦𝗜𝗟 𝗠𝗔𝗡𝗖𝗜𝗡𝗚  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n" +
        "🎣 Kamu mendapatkan tangkapan:\n" +
        `${hasilText}\n\n` +
        `Umpan terpakai: ${umpanTerpakai}x (sisa: ${invGet(data, 'umpan')}x)\n` +
        `Pendapatan: Rp${fmtMoney(totalHarga)}\n` +
        `Tenaga: ${data.life.tenaga}/100\n` +
        `Durability Pancing: ${data.peralatan.pancing?.durability || 0}/${TOOL_MAX.pancing}`

      return Exp.sendMessage(id, { text, contextInfo }, { quoted: cht })
    }
  )

  ev.on(
    {
      cmd: ['berburu', 'hunt'],
      listmenu: ['berburu'],
      tag: "rpg",
      isGroup: true
    },
    async () => {
      const user = uidOf(sender)
      const data = getPlayer(user)

      data.riwayat.hunt ??= 0

      const cd = 30 * 60 * 1000
      if (cdGate(data, 'hunt', cd, "‼️ Kamu baru saja selesai berburu, tunggu sekitar `{sisa} lagi`")) return

      if (!requireVital(data, { tenaga: 11, nyawa: 11 }, "‼️ Kamu kelelahan, butuh istirahat atau minum potion yang kamu miliki"))
        return

      const weaponKey = data.peralatan?.panah ? 'panah' : data.peralatan?.pedang ? 'pedang' : null
      if (!weaponKey)
        return reply("‼️ Kamu tidak punya senjata untuk berburu! Craft dulu panah atau pedang dengan `.craft panah` atau `.craft pedang`")

      const weapon = toolUse(data, weaponKey, 1)
      if (!weapon.ok) {
        const msg = weaponKey === 'panah'
          ? "🏹 Panah kamu patah, ga jadi berburu, kemas barang dan kembali ke penginapan"
          : "⚔️ Pedang kamu patah, ga jadi berburu, kemas barang dan kembali ke penginapan"
        return reply(msg)
      }

      const hewan = [
        { nama: "kelinci", emoji: "🐇", chance: 0.6, exp: 15 },
        { nama: "rusa", emoji: "🦌", chance: 0.4, exp: 25 },
        { nama: "beruang", emoji: "🐻", chance: 0.25, exp: 45 },
        { nama: "babi hutan", emoji: "🐗", chance: 0.2, exp: 50 },
        { nama: "harimau", emoji: "🐅", chance: 0.15, exp: 60 },
        { nama: "serigala", emoji: "🐺", chance: 0.2, exp: 30 },
        { nama: "ular", emoji: "🐍", chance: 0.1, exp: 20 },
        { nama: "naga", emoji: "🐉", chance: 0.03, exp: 100 },
        { nama: "zebra", emoji: "🦓", chance: 0.02, exp: 35 },
        { nama: "ayam", emoji: "🐓", chance: 0.25, exp: 10 },
        { nama: "gajah", emoji: "🐘", chance: 0.03, exp: 85 }
      ]

      const copy = [...hewan]
      const hasil = []
      for (let i = 0; i < 3 && copy.length > 0; i++) {
        hasil.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0])
      }

      updateQuestProgress(user, 'hunt', {})

      let totalExp = 0
      let hasilText = ''

      for (const h of hasil) {
        const jml = Math.floor(Math.random() * 2) + 2
        const exp = h.exp * jml

        totalExp += exp
        data.life.exp += exp
        data.kandang[h.nama] = (data.kandang[h.nama] || 0) + jml
        updateQuestProgress(user, 'hunt', { exp })

        hasilText += `${h.emoji} ${h.nama.charAt(0).toUpperCase() + h.nama.slice(1)} x${jml}\n└─┉─ ✨ +${exp} Exp\n\n`
      }

      const nyawaHilang = Math.floor(Math.random() * 10)
      data.life.tenaga -= 10
      data.life.nyawa -= nyawaHilang
      clampLife(data)

      cdSet(data, 'hunt')
      data.riwayat.hunt += 1

      const durNow = data.peralatan?.[weaponKey]?.durability || 0
      const durMax = TOOL_MAX[weaponKey] || durNow

      const text =
        "˖ ݁𖥔 ݁˖   ₊˚⊹  𝗛𝗔𝗦𝗜𝗟 𝗕𝗘𝗥𝗕𝗨𝗥𝗨  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n" +
        "Kamu menyiapkan senjatamu dan masuk ke dalam hutan...\n" +
        "Beberapa jam kemudian kamu kembali dengan hasil berikut:\n\n" +
        hasilText + "\n" +
        "┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n" +
        `Total Exp    : +${totalExp}\n` +
        `Durability   : ${durNow}/${durMax}\n` +
        `Tenaga -10 | Nyawa -${nyawaHilang}\n` +
        "┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n\n" +
        "Kamu bisa menjual hasil buruan ini atau menyimpannya di inventori."

      await Exp.sendMessage(id, { text, contextInfo }, { quoted: cht })

      levelup(data)
    }
  )

ev.on( 
    {  
      cmd: ['settingshop', 'setshop'],
      listmenu: ['setshop'],
      tag: 'rpg',
      isOwner: true
    },
    async ({ args }) => {

      let kategoriList = Object.keys(cfg.rpg.toko)

      if (!args) {
        let list = kategoriList
          .map(k => `𖥔 ${k.charAt(0).toUpperCase() + k.slice(1)}`)
          .join('\n')

        let text = 
          "˖ ݁𖥔 ݁˖   ₊˚⊹  𝗣𝗔𝗡𝗗𝗨𝗔𝗡 𝗠𝗔𝗡𝗔𝗝𝗘𝗠𝗘𝗡 𝗧𝗢𝗞𝗢  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n" +
          "╭───────────────────────\n" +
          "│  Tambah / Hapus item toko.\n" +
          "│  Format penggunaan:\n" +
          `│  .setshop add | kategori | nama | harga_beli | harga_jual\n` +
          `│  .setshop del | kategori | nama\n` +
          "│  Contoh:\n" +
          `│  .setshop add | barang | potion | 5000 | 2000\n` +
          `│  .setshop del | barang | potion\n` +
          "╰───────────────────────\n\n" +
          "🪶 *Kategori yang tersedia:*\n" +
          `${list}`

        return reply(text)
      }

      let [aksi, kategori, nama, hargaBeliStr, hargaJualStr] = args.split('|').map(a => a?.toLowerCase()?.trim())

      if (!aksi || !kategori || !nama)
        return reply("‼️ Format salah\nGunakan contoh:\n.setshop add | barang | potion | 5000 | 2000")
      
      if (!['add', 'del'].includes(aksi))
        return reply("‼️ Opsi yang tersedia cuma 2 yaitu `add` dan `del`")
        
      if (!kategoriList.includes(kategori))
        return reply(`‼️ Kategori \`${kategori}\` tidak ditemukan\nKategori tersedia: ${kategoriList.join(', ')}`)

      if (aksi === 'add') {
        if (!hargaBeliStr || !hargaJualStr)
          return reply("‼️ Format salah\nGunakan contoh:\n.setshop add | barang | potion | 5000 | 2000")

        let harga_beli = parseInt(hargaBeliStr)
        let harga_jual = parseInt(hargaJualStr)

        if (isNaN(harga_beli) || isNaN(harga_jual))
          return reply("‼️ Harga harus berupa angka")
      
        if (cfg.rpg.toko[kategori]?.[nama])
          return reply(`‼️ Barang \`${nama}\` sudah ada di kategori \`${kategori}\``)
  
        cfg.rpg.toko[kategori] ??= {}
        cfg.rpg.toko[kategori][nama] = { buy: harga_beli, sell: harga_jual }

        let text = 
          "˖ ݁𖥔 ݁˖   ₊˚⊹  𝗕𝗘𝗥𝗛𝗔𝗦𝗜𝗟 𝗗𝗜𝗧𝗔𝗠𝗕𝗔𝗛𝗞𝗔𝗡  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n" +
          "╭───────────────────────\n" +
          `│  Kategori : ${kategori}\n` +
          `│  Nama     : ${nama.charAt(0).toUpperCase() + nama.slice(1)}\n` +
          `│  Beli     : Rp${harga_beli.toLocaleString('id-ID')}\n` +
          `│  Jual     : Rp${harga_jual.toLocaleString('id-ID')}\n` +
          "╰───────────────────────\n\n" +
          "🪶 Barang baru berhasil ditambahkan ke toko petualang."

        return reply(text)
      }

      if (aksi === 'del') {
        if (!cfg.rpg.toko[kategori]?.[nama])
          return reply(`‼️ Barang \`${nama}\` tidak ditemukan di kategori \`${kategori}\``)

        delete cfg.rpg.toko[kategori][nama]
 
        let text =
          "˖ ݁𖥔 ݁˖   ₊˚⊹  𝗕𝗘𝗥𝗛𝗔𝗦𝗜𝗟 𝗗𝗜𝗛𝗔𝗣𝗨𝗦  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n" +
          "╭───────────────────────\n" +
          `│  Kategori : ${kategori}\n` +
          `│  Nama     : ${nama.charAt(0).toUpperCase() + nama.slice(1)}\n` +
          "╰───────────────────────\n\n" +
          "🪶 Barang telah dihapus dari daftar toko petualang."

        return reply(text)
      }
    }
  )

  ev.on(
    {
      cmd: ['shop', 'toko'],
      listmenu: ['shop'],
      tag: "rpg",
      isGroup: true
    },
    async ({ args }) => {
      let user = sender.split('@')[0]
      let data = Data.rpg[user]
      let uang = data.ekonomi.uang
      let toko = cfg.rpg.toko
      
      data.shopping ??= {}
      data.shopping.buy ??= []
      data.shopping.sell ??= []
    
      let lokasi_barang = {
        barang: 'inventori',
        pet: 'pet',
        akuarium: 'akuarium',
        kandang: 'kandang',
        lahan: 'lahan'
      }

      if (!args) {
        let list = Object.keys(toko)
          .map(k => `𖥔 ${k.charAt(0).toUpperCase() + k.slice(1)}`)
          .join('\n')

        let text =
          "˖ ݁𖥔 ݁˖   ₊˚⊹  𝗧𝗢𝗞𝗢 𝗣𝗘𝗧𝗨𝗔𝗟𝗔𝗡𝗚  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n" +
          "╭───────────────────────\n" +
          "│  Berikut kategori yang tersedia:\n" +
          `${list.split('\n').map(l => "│  " + l).join('\n')}\n` +
          "╰───────────────────────\n\n" +
          "🪶 *Panduan Belanja:*\n" +
          "• .shop ➟ lihat semua kategori\n" +
          "• .shop kategori | beli | nama_barang | jumlah\n" +
          "• .shop kategori | jual | nama_barang | jumlah\n\n" +
          "ℹ️ *Contoh:*\n" +
          "• .shop barang ➟ bakal menampilkan barang yang di jual\n" +
          "• .shop barang | beli | herb | jumlah ➟ untuk membeli"

        return Exp.sendMessage(
          id, 
          {
            text,
            contextInfo
          }, 
          { quoted: cht }
        )
      }

      let [kategori, aksi, nama, jumlahStr] = args.split('|').map(a => a?.toLowerCase()?.trim())

      if (!toko[kategori]) {
        return reply(
          `‼️ Kategori '${kategori}' tidak ditemukan.\n` +
          `Kategori tersedia: ${Object.keys(toko).join(', ')}`
        )
      }
      
      if (!aksi) {
        let list = Object.entries(toko[kategori])
          .map(([nama, harga]) =>
            `𖥔 ${nama.charAt(0).toUpperCase() + nama.slice(1)}\n` +
            `   ⊹ Beli : Rp${harga.buy.toLocaleString('id-ID')}\n` +
            `   ⊹ Jual : Rp${harga.sell.toLocaleString('id-ID')}`
          )
        .join('\n\n')
  
        let text =
          `˖ ݁𖥔 ݁˖   ₊˚⊹  𝗞𝗔𝗧𝗘𝗚𝗢𝗥𝗜 ${kategori.toUpperCase()}  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n` +
          "```┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n" +
          list + "\n" +
          "┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈```\n\n" +
          "🪶 Panduan:\n" +
          `.shop ${kategori} | beli | nama_barang | jumlah (opsional)\n` +
          `.shop ${kategori} | jual | nama_barang | jumlah (opsional)`

        return Exp.sendMessage(
          id, 
          { text, contextInfo }, 
          { quoted: cht }
        )
      }

      if (!['beli', 'jual'].includes(aksi)) {
        return reply("‼️ Aksi " + aksi + " tidak valid. Gunakan `beli` atau `jual`")
      }

      if (!nama) {
        return reply("‼️ Masukkan nama barang yang ingin dibeli atau dijual")
      }

      let dataBarang = toko[kategori][nama]
      if (!dataBarang) {
        let barangTersedia = Object.keys(toko[kategori])
        let barangMirip = barangTersedia.filter(b => 
          b.toLowerCase().includes(nama.toLowerCase()) || 
          nama.toLowerCase().includes(b.toLowerCase())
        )
      
        let pesanError = `‼️ Barang *${nama}* tidak ditemukan di kategori \`${kategori}\``
        
        if (barangMirip.length > 0) {
          pesanError += `\n\nMungkin maksudmu:\n${barangMirip.map(b => `• ${b}`).join('\n')}`
        } else {
          pesanError += `\n\nBarang tersedia di kategori ${kategori}:\n${barangTersedia.map(b => `• ${b}`).join('\n')}`
        }
      
        return reply(pesanError)
      }

      let lokasi = lokasi_barang[kategori]
      if (!lokasi) {
        return reply("‼️ Kategori ini belum memiliki lokasi penyimpanan di data user")
      }

      if (!data[lokasi]) data[lokasi] = {}

      if (aksi === 'beli') {
      
        let jumlah = jumlahStr ? parseInt(jumlahStr) : 1
        if (isNaN(jumlah) || jumlah <= 0) {
          return reply("‼️ Jumlah harus berupa angka yang valid dan lebih dari 0")
        }
      
        let total = dataBarang.buy * jumlah
        if (uang < total) {
          return reply(
            `‼️ Uangmu tidak cukup untuk membeli \`${jumlah} ${nama}\`\n` +
            `Total: Rp${total.toLocaleString('id-ID')}\n` +
            `Uangmu: Rp${uang.toLocaleString('id-ID')}`
          )
        }
 
        data.ekonomi.uang -= total
        data[lokasi][nama] = (data[lokasi][nama] || 0) + jumlah
        /*if (kategori === 'lahan') {
          for (let i = 0; i < jumlah; i++) {
            if (data.lahan[nama] === undefined) {
              data.lahan[nama] = null
            } else {
              return reply(`‼️ Kamu sudah punya lahan ${nama}.`)
            }
          }
        } else {
          data[lokasi][nama] = (data[lokasi][nama] || 0) + jumlah
        }*/

        data.shopping.buy.push({
          item: nama,
          jumlah,
          total,
          waktu: Date.now()
        })

        let text =
          "˖ ݁𖥔 ݁˖   ₊˚⊹  𝗧𝗥𝗔𝗡𝗦𝗔𝗞𝗦𝗜 𝗕𝗘𝗥𝗛𝗔𝗦𝗜𝗟  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n" +
          "```╭───────────────────────\n" +
          `│  Barang    : ${nama.charAt(0).toUpperCase() + nama.slice(1)} x${jumlah}\n` +
          `│  Kategori  : ${kategori}\n` +
          `│  Total     : Rp${total.toLocaleString('id-ID')}\n` +
          `│  Sisa Uang : Rp${data.ekonomi.uang.toLocaleString('id-ID')}\n` +
          "╰───────────────────────```"

        return Exp.sendMessage(
          id, 
          { text, contextInfo }, 
          { quoted: cht }
        )
      }

      if (aksi === 'jual') {
        let stokUser = data[lokasi][nama] || 0

        if (!stokUser || stokUser <= 0) 
          return reply(`‼️ Kamu tidak punya ${nama} di kategori ${kategori} untuk dijual.`)

        let jumlah
        if (jumlahStr === 'all') {
          jumlah = stokUser
        } else {
          jumlah = jumlahStr ? parseInt(jumlahStr) : 1
          if (isNaN(jumlah) || jumlah <= 0) {
            return reply("‼️ Jumlah harus berupa angka yang valid, atau tulis 'all' untuk menjual semuanya.")
          }
          if (stokUser < jumlah) {
            return reply(
              `‼️ Kamu tidak punya cukup ${nama} untuk dijual.\n` +
              `Stokmu: ${stokUser}x\n` +
              `Yang ingin dijual: ${jumlah}x`
            )
          }
        }
        
        //if (kategori === 'lahan') return reply("❗ Lahan tidak bisa dijual.")
 
        let total = dataBarang.sell * jumlah
        data[lokasi][nama] -= jumlah
        if (data[lokasi][nama] <= 0) delete data[lokasi][nama]

        data.ekonomi.uang += total
        data.shopping.sell.push({
          item: nama,
          jumlah,
          total,
          waktu: Date.now()
        })

        let text =
          "˖ ݁𖥔 ݁˖   ₊˚⊹  𝗛𝗔𝗦𝗜𝗟 𝗣𝗘𝗡𝗝𝗨𝗔𝗟𝗔𝗡  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n" +
          "```╭───────────────────────\n" +
          `│  Barang   : ${nama.charAt(0).toUpperCase() + nama.slice(1)} x${jumlah} ${jumlahStr === 'all' ? '(semua stok)' : ''}\n` +
          `│  Kategori : ${kategori}\n` +
          `│  Total    : Rp${total.toLocaleString('id-ID')}\n` +
          `│  Uangmu   : Rp${data.ekonomi.uang.toLocaleString('id-ID')}\n` +
          "╰───────────────────────```"

        return Exp.sendMessage(
          id, 
          { text, contextInfo }, 
          { quoted: cht }
        )
      }
    }
  )
  
  ev.on(
    {
      cmd: ['kerja', 'work'],
      listmenu: ['kerja'],
      tag: "rpg",
      isGroup: true
    },
    async () => {
      const user = uidOf(sender)
      const data = getPlayer(user)

      data.riwayat.work ??= 0

      const cd = 30 * 60 * 1000
      if (cdGate(data, 'kerja', cd, "‼️ Kamu masih kelelahan setelah bekerja, tunggu `{sisa} lagi` sebelum mulai bekerja lagi.")) return

      if (data.life.tenaga < 20)
        return reply("‼️ Tenagamu terlalu lemah untuk bekerja. Istirahat dulu atau minum potion")

      const jobs = [
        {
          nama: "Tukang Kayu",
          gaji: [5000, 15000],
          exp: [10, 25],
          tenaga: 15,
          pesan: "🪵 Kamu menebang pohon dan membuat perabotan dari kayu. Hasil kerjamu berguna bagi banyak orang."
        },
        {
          nama: "Penambang",
          gaji: [8000, 20000],
          exp: [15, 30],
          tenaga: 20,
          pesan: "⛏️ Kamu turun ke tambang dalam dan menemukan serpihan emas berkilau!"
        },
        {
          nama: "Petani",
          gaji: [3000, 10000],
          exp: [5, 20],
          tenaga: 10,
          pesan: "🌾 Kamu menanam dan memanen hasil bumi dengan penuh ketekunan."
        },
        {
          nama: "Nelayan",
          gaji: [6000, 18000],
          exp: [12, 28],
          tenaga: 18,
          pesan: "🎣 Kamu berlayar dan menjaring ikan di lautan biru, hasil tangkapanmu melimpah!"
        },
        {
          nama: "Pedagang",
          gaji: [10000, 25000],
          exp: [20, 40],
          tenaga: 25,
          pesan: "🧺 Kamu membuka lapak di pasar dan melayani pelanggan dengan ramah. Daganganmu laris manis!"
        }
      ]

      const job = pick(jobs)
      if (data.life.tenaga < job.tenaga)
        return reply(`‼️ Tenagamu kurang untuk kerja sebagai ${job.nama}. Butuh minimal ${job.tenaga} tenaga.`)

      updateQuestProgress(user, 'work', {})

      let gaji = Math.floor(Math.random() * (job.gaji[1] - job.gaji[0] + 1)) + job.gaji[0]
      let exp = Math.floor(Math.random() * (job.exp[1] - job.exp[0] + 1)) + job.exp[0]

      const profesi = (data.pekerjaan || '').toLowerCase()
      if (profesi && profesi === job.nama.toLowerCase()) {
        gaji = Math.floor(gaji * 1.5)
        exp = Math.floor(exp * 1.3)
      }

      let bonusItem = null
      if (Math.random() < 0.3) {
        const items = ['kayu', 'besi', 'batu', 'herb', 'umpan']
        bonusItem = pick(items)
        invAdd(data, bonusItem, 1)
      }

      data.riwayat.work += 1
      data.ekonomi.uang += gaji
      data.life.exp += exp
      data.life.tenaga -= job.tenaga
      clampLife(data)
      cdSet(data, 'kerja')

      const text =
        "˖ ݁𖥔 ݁˖   ₊˚⊹  𝗛𝗔𝗦𝗜𝗟 𝗞𝗘𝗥𝗝𝗔 𝗛𝗔𝗥𝗜 𝗜𝗡𝗜  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n" +
        `${job.pesan}\n\n` +
        "```╭───────────────────────\n" +
        `│  Pekerjaan : ${job.nama}\n` +
        `│  Gaji      : Rp${fmtMoney(gaji)}\n` +
        `│  Exp       : +${exp}\n` +
        `│  Tenaga    : -${job.tenaga}\n` +
        (bonusItem ? `│  Bonus     : 1x ${bonusItem}\n` : "") +
        "╰───────────────────────```\n\n" +
        (profesi && profesi === job.nama.toLowerCase() ? "🎁 Bonus ahli pekerjaan aktif" : "")

      await Exp.sendMessage(id, { text, contextInfo }, { quoted: cht })

      levelup(data)
    }
  )

ev.on(
    {
      cmd: ['heal', 'sembuhkan'],
      listmenu: ['heal'],
      tag: "rpg",
      isGroup: true
    },
    async () => {
      let user = sender.split('@')[0]
      let data = Data.rpg[user]
    
      data.riwayat.heal ??= 0
    
      if (data.life.nyawa >= 100 && data.life.tenaga >= 100)
        return reply("‼️ Nyawamu dan tenagamu sudah penuh, kamu terlihat sangat segar")

      let potionDibutuhkan = 0
      if (data.life.nyawa < 100) potionDibutuhkan++
      if (data.life.tenaga < 100) potionDibutuhkan++

      if (!data.inventori.potion || data.inventori.potion < potionDibutuhkan)
        return reply(`‼️ Kamu butuh ${potionDibutuhkan} potion untuk menyembuhkan diri, tapi stokmu tidak cukup.`)

      data.riwayat.heal += 1
      data.inventori.potion -= potionDibutuhkan

      data.life.nyawa = Math.min(data.life.nyawa + 50, 100)
      data.life.tenaga = Math.min(data.life.tenaga + 50, 100)

      let text =
        "˖ ݁𖥔 ݁˖   ₊˚⊹  𝗣𝗘𝗡𝗬𝗘𝗠𝗕𝗨𝗛𝗔𝗡  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n" +
        "✨ Kamu meneguk potion, rasanya hangat dan menyegarkan...\n" +
        "Tubuhmu mulai pulih setengah dari kondisi semula.\n\n" +
        "╭───────────────────────\n" +
        `│  Potion digunakan : ${potionDibutuhkan}x\n` +
        `│  Nyawa            : ${data.life.nyawa}/100\n` +
        `│  Tenaga           : ${data.life.tenaga}/100\n` +
        `│  Sisa Potion      : ${data.inventori.potion}x\n` +
        "╰───────────────────────\n\n" +
        "🪶 Tubuhmu belum sepenuhnya pulih, tapi cukup untuk melanjutkan perjalananmu."

      await Exp.sendMessage(
        id,
        { text, contextInfo },
        { quoted: cht }
      )
    }
  )

  ev.on(
    {
      cmd: ['petualang', 'adventure', 'jelajah', 'menjelajah'],
      listmenu: ['petualang'],
      tag: "rpg",
      isGroup: true
    },
    async () => {
      const user = uidOf(sender)
      const data = getPlayer(user)

      data.riwayat.adven ??= 0

      const cd = 2 * 60 * 60 * 1000
      if (cdGate(data, 'adventure', cd, "‼️ Kamu masih trauma dengan petualangan terakhir, tunggu `{sisa} lagi`")) return

      if (!requireVital(data, { tenaga: 11, nyawa: 11 }, "‼️ Kondisimu terlalu lemah untuk petualangan berbahaya, istirahatlah dulu!"))
        return

      if (!data.peralatan?.pedang || !data.peralatan?.armor)
        return reply("‼️ Kamu butuh *pedang* dan *armor* untuk menghadapi bahaya di luar sana!")

      const events = [
        {
          nama: "Gua Misterius",
          kesulitan: "Sedang",
          success: 0.7,
          reward: { exp: 100, uang: 50000, item: "berlian" },
          penalty: { nyawa: -30, tenaga: -40 }
        },
        {
          nama: "Hutan Terkutuk",
          kesulitan: "Sulit",
          success: 0.5,
          reward: { exp: 200, uang: 100000, item: "emas" },
          penalty: { nyawa: -50, tenaga: -60 }
        },
        {
          nama: "Gunung Berapi",
          kesulitan: "Sangat Sulit",
          success: 0.3,
          reward: { exp: 300, uang: 200000, item: "berlian" },
          penalty: { nyawa: -70, tenaga: -80 }
        },
        {
          nama: "Lembah Angin Hitam",
          kesulitan: "Sulit",
          success: 0.45,
          reward: { exp: 250, uang: 120000, item: "kristal" },
          penalty: { nyawa: -60, tenaga: -65 }
        },
        {
          nama: "Kuil Kuno yang Terlupakan",
          kesulitan: "Sangat Sulit",
          success: 0.35,
          reward: { exp: 350, uang: 180000, item: "emas" },
          penalty: { nyawa: -75, tenaga: -85 }
        },
        {
          nama: "Rawa Arwah Gelap",
          kesulitan: "Sulit",
          success: 0.5,
          reward: { exp: 220, uang: 90000, item: "coal" },
          penalty: { nyawa: -55, tenaga: -60 }
        },
        {
          nama: "Menara Penyihir",
          kesulitan: "Sangat Sulit",
          success: 0.3,
          reward: { exp: 400, uang: 220000, item: "kristal" },
          penalty: { nyawa: -80, tenaga: -90 }
        },
        {
          nama: "Padang Pasir Terlarang",
          kesulitan: "Sedang",
          success: 0.65,
          reward: { exp: 150, uang: 70000, item: "berlian" },
          penalty: { nyawa: -35, tenaga: -50 }
        },
        {
          nama: "Desa yang Hilang",
          kesulitan: "Sedang",
          success: 0.6,
          reward: { exp: 180, uang: 85000, item: "herb" },
          penalty: { nyawa: -40, tenaga: -55 }
        },
        {
          nama: "Kastil Raja Iblis",
          kesulitan: "Ekstrem",
          success: 0.2,
          reward: { exp: 500, uang: 350000, item: "kristal" },
          penalty: { nyawa: -90, tenaga: -100 }
        }
      ]

      updateQuestProgress(user, 'adventure', {})

      const event = pick(events)
      const success = Math.random() < event.success

      let text =
        "˖ ݁𖥔 ݁˖   ₊˚⊹  𝗣𝗘𝗧𝗨𝗔𝗟𝗔𝗡𝗚𝗔𝗡 𝗗𝗜𝗠𝗨𝗟𝗔𝗜  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n" +
        `🌍 Kamu memasuki wilayah: *${event.nama}*\n` +
        `⚔️ Tingkat Kesulitan: ${event.kesulitan}\n\n`

      if (success) {
        const exp = event.reward.exp
        const uang = event.reward.uang
        const item = event.reward.item

        data.life.exp += exp
        data.ekonomi.uang += uang
        invAdd(data, item, 1)

        const nyawaLoss = Math.floor(Math.abs(event.penalty.nyawa) / 2)
        const tenagaLoss = Math.floor(Math.abs(event.penalty.tenaga) / 2)

        data.life.nyawa -= nyawaLoss
        data.life.tenaga -= tenagaLoss

        text +=
          "╭───────────────────────\n" +
          "│  🌟 *PETUALANGAN SUKSES!*\n" +
          "│───────────────────────\n" +
          `│  Exp     : +${exp}\n` +
          `│  Uang    : Rp${fmtMoney(uang)}\n` +
          `│  Item    : 1x ${item}\n` +
          `│  Nyawa   : -${nyawaLoss}\n` +
          `│  Tenaga  : -${tenagaLoss}\n` +
          "╰───────────────────────"
      } else {
        const exp = Math.floor(event.reward.exp * 0.3)
        data.life.exp += exp
        data.life.nyawa += event.penalty.nyawa
        data.life.tenaga += event.penalty.tenaga

        text +=
          "╭───────────────────────\n" +
          "│  💀 *PETUALANGAN GAGAL!*\n" +
          "│───────────────────────\n" +
          `│  Nyawa   : ${event.penalty.nyawa}\n` +
          `│  Tenaga  : ${event.penalty.tenaga}\n` +
          `│  Exp     : +${exp}\n` +
          "╰───────────────────────"
      }

      const p = toolUse(data, 'pedang', 5)
      if (!p.ok && p.broken) text += "\n⚔️ *Pedangmu hancur* dalam petualangan ini!"

      const a = toolUse(data, 'armor', 5)
      if (!a.ok && a.broken) text += "\n🛡️ *Armormu hancur* dalam pertempuran sengit!"

      clampLife(data)

      cdSet(data, 'adventure')
      data.riwayat.adven += 1

      await Exp.sendMessage(id, { text, contextInfo }, { quoted: cht })

      levelup(data)
    }
  )

ev.on(
    {
      cmd: ['party', 'guild'],
      listmenu: ['party'],
      tag: "rpg",
      isGroup: true
    },
    async ({ args }) => {
      let user = sender.split('@')[0]
      let data = Data.rpg[user]
      data.party ??= {}

      if (!Data.party) Data.party = {}
      let part = Data.party
    
      if (!args) {
        return reply(
          "˖ ݁𖥔 ݁˖  𐙚  ˖ ݁𖥔 ݁˖\n" +
          "╭─『 𝗣𝗔𝗡𝗗𝗨𝗔𝗡 𝗣𝗔𝗥𝗧𝗬 』─╮\n" +
          "│  .party buat <nama>\n" +
          "│  .party join <nama>\n" +
          "│  .party leave\n" +
          "│  .party info\n" +
          "│  .party list\n" +
          "│  .party kick @tag\n" +
          "╰────────────────╯\n\n" +
          "🪶 Party berguna untuk ekspedisi bersama, bonus exp, dan sistem event ke depannya"
        )
      }

      const [cmd, ...rest] = args.split(' ')
      const nama = rest.join(' ')

      if (cmd === 'buat') {
        if (!nama) return reply("‼️ Kasih nama party-nya, contoh: `.party buat PemburuHutan`")
        if (data.party.name) return reply("‼️ Kamu sudah ada di party lain, keluar dulu dengan `.party leave`")
      
        let biaya = 100000
        if (data.ekonomi.uang < biaya)
          return reply("‼️ Uang kamu tidak cukup, biaya pembuatan party membutuhkan uang sebesar Rp" + biaya.toLocaleString('id-ID'))

        let existingParty = Object.values(part).find(p => p && p.name && p.name.toLowerCase() === nama.toLowerCase())
        if (existingParty)
        return reply("‼️ Nama party sudah dipakai orang lain")

        Data.party[user] = {
          name: nama,
          leader: user,
          anggota: [],
          level: 1,
          exp: 0,
          created: Date.now()
        }
      
        data.party = {
          name: nama,
          leader: user,
          pangkat: "Leader",
          level: 1
        }
      
        data.ekonomi.uang -= biaya
      
        return reply("✅ Party *" + nama + "* berhasil dibuat dengan biaya Rp" + biaya.toLocaleString('id-ID') + " Kamu adalah *Leader* party ini")
      }

      else if (cmd === 'join') {
        if (!nama) return reply("‼️ Masukkan nama party yang mau kamu gabung")
        if (data.party.name) return reply("‼️ Kamu udah punya party, keluar dulu dari yang sekarang")

        let target = null
        let targetKey = null
      
        for (let key in part) {
          if (part[key] && part[key].name && part[key].name.toLowerCase() === nama.toLowerCase()) {
            target = part[key]
            targetKey = key
            break
          }
        }
      
        if (!target) return reply("‼️ Party tidak ditemukan")

        if (!target.anggota) target.anggota = []

        if (target.anggota.includes(user))
          return reply("‼️ Kamu sudah ada di party itu")
  
        if (target.anggota.length >= 5)
          return reply("‼️ Party ini sudah penuh (maks 5 anggota)")

        target.anggota.push(user)
        data.party = {
          name: target.name,
          leader: targetKey,
          pangkat: "Anggota",
          level: target.level || 1
        }

        return reply(`✅ Kamu bergabung ke party *${target.name}*`)
      }

      else if (cmd === 'leave') {
        if (!data.party.name) return reply("‼️ Kamu tidak ada di party mana pun")

        let target = null
        let targetKey = null
      
        for (let key in part) {
          if (part[key] && part[key].name === data.party.name) {
            target = part[key]
            targetKey = key
            break
          }
        }
        
        if (!target) {
          delete data.party
          return reply("‼️ Kamu tidak berada di party mana pun")
        }
        
        if (!target.anggota) target.anggota = []
      
        target.anggota = target.anggota.filter(a => a !== user)

        if (targetKey === user) {
          if (target.anggota && target.anggota.length > 0) {
            for (let u of target.anggota) {
              if (Data.rpg[u]) Data.rpg[u].party = {}
            }
          }
          delete Data.party[targetKey]
          return reply(`👋 Karena kamu pemimpin, party *${target.name}* dibubarkan`)
        } else {
          data.party = {}
          return reply(`👋 Kamu keluar dari party *${target.name}*`)
        }
      }

      else if (cmd === 'info') {
        if (!data.party.name) return reply("‼️ Kamu tidak berada di party mana pun")

        let target = null
        
        for (let key in part) {
          if (part[key] && part[key].name === data.party.name) {
            target = part[key]
            break
          }
        }
      
        if (!target) return reply("‼️ Party tidak ditemukan")

        if (!target.anggota) target.anggota = []

        let listAnggota = target.anggota.map(a => {
          let nm = Data.rpg[a]?.nama || a
          let pangkat = target.leader === a ? "⭐Leader" : "👤Member"
          return `⟡ ${nm} (${pangkat})`
        }).join('\n')

        if (!target.anggota.includes(target.leader)) {
          let leaderNm = Data.rpg[target.leader]?.nama || target.leader
          listAnggota = `⟡ ${leaderNm} (⭐Leader)\n` + listAnggota
        }

        let text =
          "˖ ݁𖥔 ݁˖   ₊˚⊹  𝗜𝗡𝗙𝗢 𝗣𝗔𝗥𝗧𝗬  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n```" +
          `Nama    : ${target.name}\n` +
          `Leader  : ${Data.rpg[target.leader]?.nama || target.leader}\n` +
          `Level   : ${target.level || 1}\n` +
          `Anggota (${target.anggota.length + 1}/5):\n${listAnggota}\n\n` +
          "──────────────────────\n```" +
          "🪶 Bersama lebih kuat — bonus exp party akan ditambahkan di update berikutnya"

        return Exp.sendMessage(id, { text, contextInfo }, { quoted: cht })
      }
      
      else if (cmd === 'list') {
        if (!part || Object.keys(part).length === 0)
        return reply("‼️ Belum ada party yang aktif saat ini.")

        let list = Object.entries(part)
          .filter(([key, p]) => p && p.name)
          .map(([key, p]) => `𐙚  *${p.name}* (Lv.${p.level || 1}) — ${(p.anggota ? p.anggota.length : 0) + 1}/5 anggota`)
          .join('\n\n')

        reply("˖ ݁𖥔 ݁˖   ₊˚⊹  𝗗𝗔𝗙𝗧𝗔𝗥 𝗣𝗔𝗥𝗧𝗬  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n" + list)
      }

      else if (cmd === 'kick') {
        if (!data.party.name) return reply("‼️ Kamu tidak ada di party")

        let targetParty = null
        let targetKey = null
      
        for (let key in part) {
          if (part[key] && part[key].name === data.party.name) {
            targetParty = part[key]
            targetKey = key
            break
          }
        }
      
        if (!targetParty) return reply("‼️ Party tidak ditemukan")
        if (targetKey !== user) return reply("‼️ Hanya leader yang bisa mengeluarkan anggota")

        let mentioned = cht.mention[0]
        if (!mentioned) return reply("‼️ Tag anggota yang ingin kamu keluarkan")
        let kickId = mentioned.split('@')[0]

        if (!targetParty.anggota) targetParty.anggota = []

        if (!targetParty.anggota.includes(kickId))
          return reply("‼️ Orang itu bukan anggota party ini")

        targetParty.anggota = targetParty.anggota.filter(a => a !== kickId)
        if (Data.rpg[kickId]) Data.rpg[kickId].party = {}

        return reply(`✅ Anggota berhasil dikeluarkan dari party *${targetParty.name}*`)
      }
    }
  )

  ev.on(
    {
      cmd: ['quest', 'misi', 'tugas'],
      listmenu: ['quest'],
      tag: "rpg",
      isGroup: true
    },
    async ({ args }) => {
       let user = sender.split('@')[0]
       let data = Data.rpg[user]
       
      if (!Data.quests) Data.quests = {}
      if (!data.quest) {
        data.quest = {
          active: null,
          completed: [],
          progress: {},
          daily: {
            completed: 0,
            lastReset: Date.now()
          }
        }
      }

      const now = Date.now()
      const oneDay = 24 * 60 * 60 * 1000
      if (now - data.quest.daily.lastReset > oneDay) {
        data.quest.daily.completed = 0
        data.quest.daily.lastReset = now
      }

      if (!args) {
        let availableQuests = []
        let activeQuest = data.quest.active ? quests[data.quest.active] : null

        Object.values(quests).forEach(quest => {
          const isCompleted = data.quest.completed.includes(quest.id)
          const meetsRequirement = !quest.requirement || data.life.level >= quest.requirement.level
          const isDailyAvailable = quest.type !== 'daily' || data.quest.daily.completed < quest.maxDaily
        
          if (!isCompleted && meetsRequirement && isDailyAvailable) {
            availableQuests.push(quest)
          }
        })

        let text = "˖ ݁𖥔 ݁˖   ₊˚⊹  𝗦𝗜𝗦𝗧𝗘𝗠 𝗤𝗨𝗘𝗦𝗧  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n"

        if (activeQuest) {
          const progress = data.quest.progress[activeQuest.id] || 0
          const percent = Math.min(Math.floor((progress / activeQuest.objective.amount) * 100), 100)
          const bar = '█'.repeat(Math.floor(percent / 10)) + '░'.repeat(10 - Math.floor(percent / 10))
        
          text += `🎯 *QUEST AKTIF*\n` +
            `📜 ${activeQuest.name}\n` +
            `📝 ${activeQuest.description}\n` +
            `📊 Progress: ${progress}/${activeQuest.objective.amount}\n` +
            ` ${bar} ${percent}%\n\n`
        }

        text += "📋 *QUEST YANG TERSEDIA:*\n"
        availableQuests.forEach(quest => {
          text += `\n𖥔 ${quest.name}\n`
          text += `  ⊹ ${quest.description}\n`
          text += `  ⊹ Reward: Rp${quest.reward.uang.toLocaleString()} + ${quest.reward.exp} Exp\n`
          if (quest.reward.items) {
            Object.entries(quest.reward.items).forEach(([item, amount]) => {
              text += `  ⊹ ${amount}x ${item}\n`
            })
          }
          text += `  ⊹ Ketik: .quest ambil ${quest.id}\n`
        })

        if (data.quest.completed.length > 0) {
          text += `\n✅ *QUEST SELESAI:* ${data.quest.completed.length}\n`
        }

        text += `\n🪶 *Total Quest Harian:* ${data.quest.daily.completed}/3`
  
        return Exp.sendMessage(id, { text, contextInfo }, { quoted: cht })
      }

      const [action, questId] = args.split(' ')

      if (action === 'ambil' || action === 'accept') {
        if (!questId) return reply("‼️ Tentukan ID quest yang ingin diambil. Contoh: .quest ambil daily1")

        const quest = quests[questId]
          if (!quest) return reply("‼️ Quest tidak ditemukan!")

        if (quest.requirement && data.life.level < quest.requirement.level) {
          return reply(`‼️ Butuh level ${quest.requirement.level} untuk mengambil quest ini!`)
        }

        if (data.quest.completed.includes(questId)) {
          return reply("‼️ Quest ini sudah pernah diselesaikan!")
        }

        if (quest.type === 'daily' && data.quest.daily.completed >= quest.maxDaily) {
          return reply("‼️ Quest harian sudah mencapai batas maksimal hari ini!")
        }

        data.quest.active = questId
        data.quest.progress[questId] = 0

        reply(`✅ Quest "${quest.name}" berhasil diambil!\n\n${quest.description}`)
      }

      else if (action === 'batalkan' || action === 'cancel') {
        if (!data.quest.active) return reply("‼️ Tidak ada quest yang aktif!")

        const quest = quests[data.quest.active]
        data.quest.active = null
        delete data.quest.progress[quest.id]

        reply(`❌ Quest "${quest.name}" dibatalkan.`)
      }

      else if (action === 'progress' || action === 'cek') {
        if (!data.quest.active) return reply("‼️ Tidak ada quest yang aktif!")

        const quest = quests[data.quest.active]
        const progress = data.quest.progress[quest.id] || 0
        const percent = Math.min(Math.floor((progress / quest.objective.amount) * 100), 100)
        const bar = '█'.repeat(Math.floor(percent / 10)) + '░'.repeat(10 - Math.floor(percent / 10))

        let text = `🎯 *PROGRESS QUEST*\n\n` +
          `📜 ${quest.name}\n` +
          `📝 ${quest.description}\n\n` +
          `📊 Progress: ${progress}/${quest.objective.amount}\n` +
          ` ${bar} ${percent}%\n\n` +
          `🎁 Reward:\n` +
          `  ⊹ Uang: Rp${quest.reward.uang.toLocaleString()}\n` +
          `  ⊹ Exp: ${quest.reward.exp}\n`

        if (quest.reward.items) {
          Object.entries(quest.reward.items).forEach(([item, amount]) => {
            text += `  ⊹ ${amount}x ${item}\n`
          })
        }

        Exp.sendMessage(id, { text, contextInfo }, { quoted: cht })
      }

      else if (action === 'klaim' || action === 'claim') {
        if (!data.quest.active) return reply("‼️ Tidak ada quest yang aktif!")

        const quest = quests[data.quest.active]
        const progress = data.quest.progress[quest.id] || 0

        if (progress < quest.objective.amount) {
          return reply(`‼️ Quest belum selesai! Progress: ${progress}/${quest.objective.amount}`)
        }

        data.ekonomi.uang += quest.reward.uang
        data.life.exp += quest.reward.exp

        if (quest.reward.items) {
          Object.entries(quest.reward.items).forEach(([item, amount]) => {
            data.inventori[item] = (data.inventori[item] || 0) + amount
          })
        }

        data.quest.completed.push(quest.id)
        if (quest.type === 'daily') {
          data.quest.daily.completed += 1
        }

        data.quest.active = null
        delete data.quest.progress[quest.id]

        let text = "˖ ݁𖥔 ݁˖   ₊˚⊹  𝗤𝗨𝗘𝗦𝗧 𝗦𝗘𝗟𝗘𝗦𝗔𝗜  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n" +
          `🎉 Selamat! Quest "${quest.name}" telah diselesaikan!\n\n` +
          "🎁 Reward yang didapat:\n" +
          "╭───────────────────────\n" +
          `│  Uang    : Rp${quest.reward.uang.toLocaleString()}\n` +
          `│  Exp     : +${quest.reward.exp}\n`
      
        if (quest.reward.items) {
          Object.entries(quest.reward.items).forEach(([item, amount]) => {
            text += `│  ${item.charAt(0).toUpperCase() + item.slice(1)} : +${amount}\n`
          })
        }
      
        text += "╰───────────────────────\n\n" +
          "🪶 Terus lanjutkan petualanganmu"

        Exp.sendMessage(id, { text, contextInfo }, { quoted: cht })

        levelup(data)
      }
    }
  )
  
  ev.on(
    {
      cmd: ['ngamen'],
      listmenu: ['ngamen'],
      tag: "rpg",
      isGroup: true
    },
    async () => {
      const user = uidOf(sender)
      const data = getPlayer(user)

      data.riwayat.ngamen ??= 0

      const cd = 10 * 60 * 1000
      if (cdGate(data, 'ngamen', cd, "‼️ Kamu baru saja ngamen, tunggu sekitar `{sisa}` lagi sebelum lanjut perform lagi")) return

      if (!requireVital(data, { tenaga: 15, nyawa: 10 }, "‼️ Kamu kelelahan untuk ngamen, isi tenaga dulu dengan potion atau istirahat"))
        return

      const hasilUang = Math.floor(Math.random() * 25000) + 10000
      const hasilPotion = Math.floor(Math.random() * 3) + 1
      const hasilExp = Math.floor(Math.random() * 30) + 20

      data.ekonomi.uang += hasilUang
      invAdd(data, 'potion', hasilPotion)
      data.life.exp += hasilExp
      data.life.tenaga -= 10

      clampLife(data)
      data.riwayat.ngamen += 1
      cdSet(data, 'ngamen')

      updateQuestProgress(user, 'work', {})
      updateQuestProgress(user, 'ngamen', {})

      const teksRandom = [
        "🎸 Kamu tampil di pasar dengan gitar tua dan suara serak-serak basah. Warga melempar koin ke topi!",
        "🎤 Suaramu menggema di sepanjang jalan. Beberapa orang berhenti dan memberikan sedikit uang.",
        "🎶 Kamu ngamen bareng teman di perempatan lampu merah. Walau panas, hasilnya lumayan.",
        "🪕 Kamu ngamen dengan ember bekas dan sendok, tapi entah kenapa semua orang enjoy banget!",
        "🎻 Kamu menyanyikan lagu galau di taman kota. Beberapa pasangan tersentuh dan ngasih donasi."
      ]

      const cerita = pick(teksRandom)

      const text =
        "˖ ݁𖥔 ݁˖   ₊˚⊹  𝗡𝗚𝗔𝗠𝗘𝗡  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n" +
        `${cerita}\n\n` +
        "```╭─────────────────────────────\n" +
        `│ Pendapatan : Rp${fmtMoney(hasilUang)}\n` +
        `│ Potion     : +${hasilPotion}\n` +
        `│ Exp        : +${hasilExp}\n` +
        `│ Tenaga     : -10\n` +
        "╰─────────────────────────────```\n\n" +
        "“Kadang suara sumbang pun bisa membawa rezeki.”"

      await Exp.sendMessage(id, { text, contextInfo }, { quoted: cht })

      levelup(data)
    }
  )

  ev.on(
    {
      cmd: ['taxi', 'taxy'],
      listmenu: ['taxi'],
      tag: "rpg",
      isGroup: true
    },
    async () => {
      const user = uidOf(sender)
      const data = getPlayer(user)

      data.riwayat.taxi ??= 0

      const cd = 10 * 60 * 1000
      if (cdGate(data, 'taxi', cd, "‼️ Kamu baru saja selesai narik penumpang, tunggu sekitar `{sisa}` lagi sebelum dapat orderan baru!")) return

      if (!requireVital(data, { tenaga: 20, nyawa: 10 }, "‼️ Kamu terlalu lelah untuk narik taxi. Isi tenaga dulu dengan potion atau istirahat"))
        return

      const lok = ['pasar', 'bandara', 'marowali', 'jawa', 'palembang', 'kantor', 'rumah sakit', 'mall']
      const lokasi = pick(lok)

      await reply("🚖 *Sedang mencari penumpang...*\nMobil kamu meluncur di jalan kota...")
      await sleep(1500)
      const kk = keys[sender]

      await edit(`🚗 *Orderan masuk!* Pelanggan ingin diantar ke *${lokasi}*`, kk)
      await sleep(1500)

      await edit("🚦 *Mengantar penumpang...*\nLalu lintas padat tapi kamu tetap fokus menyetir...", kk)
      await sleep(1500)

      const bintang = Math.floor(Math.random() * 5) + 1
      const review = {
        1: "🤬 Supirnya bau ketek, ga lake deodorant",
        2: "🥱 Terlalu lambat, hampir telat ke kantor",
        3: "😐 Biasa aja, tapi mobilnya lumayan bersih",
        4: "😄 Ramah banget, nyetirnya juga halus",
        5: "🌟 Luar biasa! Perjalanan cepat dan nyaman"
      }

      const bonus = bintang * 2000
      const gaji = Math.floor(Math.random() * 10000) + 8000 + bonus
      const exp = Math.floor(Math.random() * 30) + 25
      const potion = Math.floor(Math.random() * 2) + 1

      data.ekonomi.uang += gaji
      data.life.exp += exp
      invAdd(data, 'potion', potion)
      data.life.tenaga -= 20

      clampLife(data)
      data.riwayat.taxi += 1
      cdSet(data, 'taxi')

      updateQuestProgress(user, 'taxi', {})
      updateQuestProgress(user, 'work', {})

      const teks =
        "˖ ݁𖥔 ݁˖   ₊˚⊹  𝗧𝗔𝗫𝗜  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n" +
        "🚖 Kamu berhasil mengantar pelanggan ke tujuan dengan selamat!\n\n" +
        "```╭─────────────────────────────\n" +
        `│ Rating     : ${'⭐'.repeat(bintang)}${'☆'.repeat(5 - bintang)}\n` +
        `│ Ulasan     : "${review[bintang]}"\n` +
        `│ Gaji       : Rp${fmtMoney(gaji)}\n` +
        `│ Exp        : +${exp}\n` +
        `│ Potion     : +${potion}\n` +
        `│ Tenaga     : -20\n` +
        "╰─────────────────────────────```\n\n" +
        "“Jalan boleh macet, tapi rezeki tetap lancar.”"

      await Exp.sendMessage(id, { text: teks, contextInfo }, { quoted: cht })

      levelup(data)
    }
  )

ev.on(
    {
      cmd: ['sikaya', 'topmoney', 'topuang'],
      listmenu: ['sikaya'],
      tag: 'rpg',
      isGroup: true
    },
    async ({ args }) => {
      let user = sender.split('@')[0]
      let data = Data.rpg[user]

      let mode = args?.toLowerCase()?.includes('global') ? 'global' : 'group'
      let topUsers = []

      let groupMembers = []
      if (mode === 'group' && is.group) {
        try {
          let metadata = await Exp.groupMetadata(id)
          groupMembers = metadata.participants.map(p => ({
            id: p.jid.split('@')[0]
          }))
        } catch (e) {
          console.error("Error getting group members:", e)
          return reply("‼️ Gagal mendapatkan data member group")
        }
      }

      let allPlayersData = Object.entries(Data.rpg).map(([playerId, playerData]) => ({
        id: playerId,
        nama: playerData.nama,
        uang: playerData.ekonomi?.uang || 0,
        bank: playerData.ekonomi?.bank || 0,
        total: (playerData.ekonomi?.uang || 0) + (playerData.ekonomi?.bank || 0)
      }))

      let filteredPlayers = mode === 'global'
        ? allPlayersData
        : allPlayersData.filter(player =>
          groupMembers.some(member => member.id === player.id)
        )

      if (filteredPlayers.length === 0)
        return reply(`‼️ Belum ada data pemain ${mode === 'group' ? 'di grup ini' : 'secara global'}`)

      let topPlayers = filteredPlayers
        .sort((a, b) => b.total - a.total)
        .slice(0, 10)

      let leaderboardText = topPlayers
        .map((player, i) => {
          topUsers.push(player.id)
          let rankEmoji = i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : ''


        let displayId = mode === 'global'
          ? (player.id.length > 6
              ? player.id.slice(0, 4) + "****" + player.id.slice(-4)
              : player.id)
          : player.id

        return `*${i + 1}. ${player.nama}* ${rankEmoji}\n` +
               `   🆔 ID: ${displayId}\n` +
               `   💰 Total: Rp${player.total.toLocaleString('id-ID')}\n` +
               `     ⤷ Dompet: Rp${player.uang.toLocaleString('id-ID')}\n` +
               `     ⤷ Bank: Rp${player.bank.toLocaleString('id-ID')}`
        })
        .join('\n\n')

      let userPosition = filteredPlayers.findIndex(p => p.id === user) + 1

      let contextText = mode === 'group'
        ? `di group ini`
        : `dari total ${Object.keys(Data.rpg).length} pemain`

      let teks =
        "˖ ݁𖥔 ݁˖   ₊˚⊹  𝗟𝗘𝗔𝗗𝗘𝗥𝗕𝗢𝗔𝗥𝗗  𝗨𝗔𝗡𝗚  ⊹˚₊   ˖ ݁𖥔 ݁˖\n\n" +
        `🏆 *Top 10 orang terkaya ${contextText}*\n\n` +
        leaderboardText +
        "\n\n─────────────────────────────\n" +
        `⌗ Kamu berada di posisi ke-${userPosition} dari ${filteredPlayers.length} pemain\n\n` +
        "Kekayaan bukan cuma tentang uang, tapi juga siapa yang punya paling banyak potion :v"

      await Exp.sendMessage(
        id,
        { text: teks, contextInfo },
        { quoted: cht }
      )
    }
  )

  ev.on(
    {
      cmd: ['maling'],
      listmenu: ['maling'],
      tag: 'rpg',
      isGroup: true
    },
    async () => {
      const user = uidOf(sender)
      const data = getPlayer(user)

      if (cdGate(data, 'maling', timeoutMaling, "‼️ Kamu sudah merampok bank.\nTunggu selama {sisa} lagi.")) return

      const money = Math.floor(Math.random() * 30000)
      const exp = Math.floor(Math.random() * 999)
      const kardus = Math.floor(Math.random() * 1000)

      data.ekonomi.uang += money
      data.life.exp += exp
      invAdd(data, 'kardus', kardus)

      cdSet(data, 'maling')
      clampLife(data)

      await reply(
        `✅ Berhasil merampok bank dan mendapatkan:\n` +
          `+Rp${fmtMoney(money)} Uang\n` +
          `+${kardus} Kardus\n` +
          `+${exp} Exp`
      )

      levelup(data)
    }
  )

 ev.on(
  { 
    cmd: ["market"], 
    listmenu: ["market", "market all", "market stock", "market crypto", "market <kode>", "market refresh"], 
    tag: "rpg", 
    isGroup: true 
  },
  async ({ cht, args }) => {
    const { sender, reply } = cht
    const self = _player(sender)
    if (!self) return reply("❌ Kamu belum terdaftar di RPG. Daftar dulu dengan .daftar")

    const a = _toParts(args)
    const sub = (a[0] || "").toLowerCase()

    const mk = _mkEnsure()
    if (sub === "refresh") {
      const last = mk.refreshCD[sender] || 0
      const now = Date.now()
      if (now - last < 30_000) return reply(`Tunggu ${msToTime(30_000 - (now - last))} untuk refresh lagi.`)
      mk.refreshCD[sender] = now
      _mkTick(true)
    } else {
      _mkTick(false)
    }

    const mk2 = _mkEnsure()
    const next = _MARKET_INTERVAL - (Date.now() - (mk2.lastUpdate || 0))
    const updatedAt = mk2.lastUpdate ? _time(mk2.lastUpdate) : "-"
    const prefix = cht.prefix || "."

    if (sub && !["all", "stock", "crypto", "refresh"].includes(sub)) {
      const sym = sub.toUpperCase()
      const q = _quote(sym)
      if (!q) return reply(`Kode tidak ditemukan.\nCek daftar: ${prefix}market all`)

      const msg =
        `📌 MARKET QUOTE\n` +
        `Updated: ${updatedAt}\n` +
        `Next: ${msToTime(next > 0 ? next : 0)}\n\n` +
        `Asset : ${q.sym} — ${q.name}\n` +
        `Type  : ${q.type}\n` +
        `Buy   : ${_fmt(q.buy)}\n` +
        `Sell  : ${_fmt(q.sell)}\n` +
        `Mid   : ${_fmt(q.mid)}\n` +
        `Δ     : ${_pct(q.chg)}\n\n` +
        `Buy : ${prefix}beli2 ${q.sym} <qty|all>\n` +
        `Sell: ${prefix}jual2 ${q.sym} <qty|all>\n` +
        `Port: ${prefix}portfolio`
      return reply(msg)
    }

    const type = sub === "stock" ? "stock" : sub === "crypto" ? "crypto" : ""
    const list = _mkList(type)
    const stocks = list.filter(x => x.type === "stock")
    const cryptos = list.filter(x => x.type === "crypto")

    const header =
      `📈 MARKET (BUY/SELL)\n` +
      `Updated: ${updatedAt}\n` +
      `Next: ${msToTime(next > 0 ? next : 0)}\n` +
      `Spread: Stock ${(100 * _MARKET_SPREAD.stock).toFixed(2)}% | Crypto ${(100 * _MARKET_SPREAD.crypto).toFixed(2)}%\n`

    const mkRows = (arr) => arr.map(q => [
      q.sym,
      _short(q.name, 14),
      _fmt(q.buy),
      _fmt(q.sell),
      _pct(q.chg)
    ])

    const stockBlock = stocks.length
      ? `\n📌 STOCKS (${stocks.length})\n` + _table(["CODE", "NAME", "BUY", "SELL", "Δ"], mkRows(stocks))
      : `\n📌 STOCKS (0)\n—`

    const cryptoBlock = cryptos.length
      ? `\n\n🪙 CRYPTO (${cryptos.length})\n` + _table(["CODE", "NAME", "BUY", "SELL", "Δ"], mkRows(cryptos))
      : `\n\n🪙 CRYPTO (0)\n—`

    const footer =
      `\nCommands:\n` +
      `${prefix}beli2 <kode> <qty|all>\n` +
      `${prefix}jual2 <kode> <qty|all>\n` +
      `${prefix}portfolio\n` +
      `${prefix}market <kode>\n` +
      `${prefix}market stock | ${prefix}market crypto | ${prefix}market all\n` +
      `${prefix}market refresh\n` +
      `${prefix}marketwatch <detik>`

    return reply(header + (type === "crypto" ? "" : stockBlock) + (type === "stock" ? "" : cryptoBlock) + "\n\n" + footer)
  }
)

ev.on(
  { 
    cmd: ["beli"], 
    listmenu: ["beli <kode> <qty|all>"], 
    tag: "rpg", 
    isGroup: true 
  },
  async ({ cht, args }) => {
    const { sender, reply } = cht
    const self = _player(sender)
    if (!self) return reply("❌ Kamu belum terdaftar di RPG. Daftar dulu dengan .daftar")

    const a = _toParts(args)
    const sym = (a[0] || "").toUpperCase()
    const qty = a[1] || ""
    const prefix = cht.prefix || "."

    if (!sym) return reply(`Format: ${prefix}beli2 <kode> <qty|all>\nContoh: ${prefix}beli2 DOGE 300`)

    const r = _invBuy(self, sym, qty)
    _safeClamp(self)
    return reply(r.msg)
  }
)

ev.on(
  { 
    cmd: ["jual"], 
    listmenu: ["jual <kode> <qty|all>"], 
    tag: "rpg", 
    isGroup: true 
  },
  async ({ cht, args }) => {
    const { sender, reply } = cht
    const self = _player(sender)
    if (!self) return reply("❌ Kamu belum terdaftar di RPG. Daftar dulu dengan .daftar")

    const a = _toParts(args)
    const sym = (a[0] || "").toUpperCase()
    const qty = a[1] || ""
    const prefix = cht.prefix || "."

    if (!sym) return reply(`Format: ${prefix}jual2 <kode> <qty|all>\nContoh: ${prefix}jual2 DOGE 100`)

    const r = _invSell(self, sym, qty)
    _safeClamp(self)
    return reply(r.msg)
  }
)

ev.on(
  { 
    cmd: ["portfolio", "porto"], 
    listmenu: ["portfolio"], 
    tag: "rpg", 
    isGroup: true 
  },
  async ({ cht }) => {
    const { sender, reply } = cht
    const self = _player(sender)
    if (!self) return reply("❌ Kamu belum terdaftar di RPG. Daftar dulu dengan .daftar")

    const prefix = cht.prefix || "."
    const r = _invPortfolioMsg(self, prefix)
    _safeClamp(self)
    return reply(r.msg)
  }
)

ev.on(
  { 
    cmd: ["marketwatch", "watchmarket", "ticker"], 
    listmenu: ["marketwatch <detik>"], 
    tag: "rpg", 
    isGroup: true 
  },
  async ({ cht, args }) => {
    const { sender, reply, edit } = cht
    const self = _player(sender)
    if (!self) return reply("❌ Kamu belum terdaftar di RPG. Daftar dulu dengan .daftar")
    if (typeof edit !== "function") return reply("Bot kamu belum support edit message untuk marketwatch.")

    const a = _toParts(args)
    const dur = Math.max(10, Math.min(180, Math.floor(Number(a[0]) || 30)))
    const step = 4000

    global.__RPG_MARKETWATCH__ ??= {}
    if (global.__RPG_MARKETWATCH__[sender]) return reply("Marketwatch kamu masih berjalan. Tunggu selesai.")
    global.__RPG_MARKETWATCH__[sender] = true

    const first = await reply(`📡 MARKET WATCH (${dur}s)`)
    const kk = first?.key || first?.message?.key || keys?.[sender]
    if (!kk) {
      delete global.__RPG_MARKETWATCH__[sender]
      return reply("Gagal ambil key untuk edit. Coba ulang.")
    }

    const wait = (ms) => new Promise(r => setTimeout(r, ms))
    const start = Date.now()

    while (Date.now() - start < dur * 1000) {
      _mkTick(false)
      const mk = _mkEnsure()
      const next = _MARKET_INTERVAL - (Date.now() - (mk.lastUpdate || 0))
      const updatedAt = mk.lastUpdate ? _time(mk.lastUpdate) : "-"

      const stocks = _mkList("stock")
      const cryptos = _mkList("crypto")

      const rowsS = stocks.map(q => [q.sym, _short(q.name, 12), _fmt(q.buy), _fmt(q.sell), _pct(q.chg)])
      const rowsC = cryptos.map(q => [q.sym, _short(q.name, 12), _fmt(q.buy), _fmt(q.sell), _pct(q.chg)])

      const body =
        `📡 MARKET WATCH\n` +
        `Updated: ${updatedAt}\n` +
        `Next: ${msToTime(next > 0 ? next : 0)}\n\n` +
        `📌 STOCKS (${rowsS.length})\n` +
        _table(["CODE", "NAME", "BUY", "SELL", "Δ"], rowsS) +
        `\n\n🪙 CRYPTO (${rowsC.length})\n` +
        _table(["CODE", "NAME", "BUY", "SELL", "Δ"], rowsC)

      await edit(body, kk)
      await wait(step)
    }

    delete global.__RPG_MARKETWATCH__[sender]
    return reply("✅ Marketwatch selesai.")
  }
)

  ev.on(
    {
      cmd: ["faksi"],
      listmenu: ["faksi", "faksi join <key>", "faksi misi", "faksi rankup", "faksi tebus"],
      tag: "rpg",
      isGroup: true
    },
    async ({ args }) => {
      const self = getPlayer(uidOf(sender))
      if (!self) return reply("❌ Kamu belum terdaftar di RPG. Daftar dulu dengan .daftar")

      const parts = String(args || "").trim().split(/\s+/).filter(Boolean)
      const sub = (parts[0] || "").toLowerCase()

      if (!sub) {
        const info = _fInfo(self)
        clampLife(self)
        return reply(info.msg)
      }

      if (sub === "join") {
        const key = (parts[1] || "").toLowerCase()
        if (!key) return reply("Format: .faksi join <key>")
        const r = _fJoin(self, key)
        clampLife(self)
        return reply(r.msg)
      }

      if (sub === "misi") {
        const r = _fMission(self)
        clampLife(self)
        levelup(self)
        return reply(r.msg)
      }

      if (sub === "rankup") {
        const r = _fTryRankUp(self)
        clampLife(self)
        return reply(r.msg)
      }

      if (sub === "tebus") {
        const r = _fBail(self)
        clampLife(self)
        return reply(r.msg)
      }

      return reply("Subcommand: join | misi | rankup | tebus")
    }
  )

  ev.on(
    {
      cmd: ["tangkap", "arrest"],
      listmenu: ["tangkap @tag"],
      tag: "rpg",
      isGroup: true
    },
    async () => {
      const self = getPlayer(uidOf(sender))
      if (!self) return reply("❌ Kamu belum terdaftar di RPG. Daftar dulu dengan .daftar")
      const f = _fGet(self)
      if (!f.key) return reply("Join faksi dulu. (.faksi join polisi / tentara / dll)")
      const def = _FAKSI[f.key]
      if (def?.type !== "hukum") return reply("Hanya faksi hukum yang bisa menangkap.")

      const targetJid = _pickMentionJid()
      if (!targetJid) return reply("Tag target yang mau ditangkap.")
      const tKey = uidOf(targetJid)
      if (tKey === uidOf(sender)) return reply("Kamu tidak bisa menangkap diri sendiri.")

      const target = getPlayer(tKey)
      if (!target) return reply("Target belum terdaftar di RPG.")
      const tf = _fGet(target)

      if (_fIsJailed(target)) return reply("Target sudah dipenjara.")
      const jailMin = Math.floor(6 + Math.random() * 10)
      const fine = Math.floor(20000 + Math.random() * 60000 + (tf.heat || 0) * 40)

      tf.jail = { until: Date.now() + jailMin * 60 * 1000, reason: `Ditangkap oleh ${def.name}` }
      target.ekonomi.uang = Math.max(0, (target.ekonomi.uang || 0) - fine)
      tf.heat = Math.max(0, (tf.heat || 0) - Math.floor(10 + Math.random() * 25))
      target.faksi = tf

      const repGain = Math.floor(6 + Math.random() * 12)
      const expGain = Math.floor(250 + Math.random() * 550)
      f.rep = (f.rep || 0) + repGain
      f.exp = (f.exp || 0) + expGain
      self.faksi = f

      clampLife(target)
      clampLife(self)
      levelup(self)

      return reply(`✅ Target ditangkap ${jailMin} menit. Denda ${_fmt(fine)}.\nRep +${_fmt(repGain)} | ExpFaksi +${_fmt(expGain)}`)
    }
  )

  ev.on(
    {
      cmd: ["penjara", "jail"],
      listmenu: ["penjara"],
      tag: "rpg",
      isGroup: true
    },
    async () => {
      const self = getPlayer(uidOf(sender))
      if (!self) return reply("❌ Kamu belum terdaftar di RPG. Daftar dulu dengan .daftar")
      const f = _fGet(self)
      if (!_fIsJailed(self)) return reply("Kamu tidak sedang dipenjara.")
      return reply(`⛓️ Kamu dipenjara.\nSisa: ${msToTime(_fJailRemaining(self))}\nAlasan: ${f.jail?.reason || "-"}`)
    }
  )

  ev.on(
    {
      cmd: ["tebus", "bail"],
      listmenu: ["tebus"],
      tag: "rpg",
      isGroup: true
    },
    async () => {
      const self = getPlayer(uidOf(sender))
      if (!self) return reply("❌ Kamu belum terdaftar di RPG. Daftar dulu dengan .daftar")
      const r = _fBail(self)
      clampLife(self)
      return reply(r.msg)
    }
  )

  let regSlot = 1000
let slotCooldown = 5000

ev.on(
  {
    cmd: ['slot2'],
    listmenu: ['slot2'],
    tag: 'rpg',
    isGroup: true
  },
  async ({ args }) => {
    let user = sender.split('@')[0]
    let data = Data.rpg?.[user]
    if (!data) return reply("❌ Data RPG tidak ditemukan. Silakan daftar terlebih dahulu dengan .daftar")

    let usage = `Berapa banyak yang ingin Anda pertaruhkan?\n\n📌 Contoh:\n${cht.prefix + cht.cmd} 100`
    if (!args) return reply(usage)

    let bet = parseInt(String(args).trim())
    if (isNaN(bet)) return reply(usage)
    if (bet < 100) return reply("‼️ Minimal taruhan Rp100")

    data.cooldown ??= {}
    let now = Date.now()
    let last = data.cooldown.slot || 0
    if (now - last < slotCooldown) {
      return reply(`⏳ Tunggu *${msToTime(slotCooldown - (now - last))}* untuk menggunakan lagi`)
    }

    data.ekonomi ??= { uang: 0, bank: 0 }
    if (data.ekonomi.uang < bet) {
      return reply(`‼️ Uang kamu tidak cukup\nSaldo: Rp${data.ekonomi.uang.toLocaleString('id-ID')}`)
    }

    let emojis = ["🕊️", "🦀", "🦎"]
    let a0 = Math.floor(Math.random() * emojis.length)
    let b0 = Math.floor(Math.random() * emojis.length)
    let c0 = Math.floor(Math.random() * emojis.length)

    let x = [], y = [], z = []
    let a = a0, b = b0, c = c0

    for (let i = 0; i < 3; i++) { x[i] = emojis[a]; a = (a + 1) % emojis.length }
    for (let i = 0; i < 3; i++) { y[i] = emojis[b]; b = (b + 1) % emojis.length }
    for (let i = 0; i < 3; i++) { z[i] = emojis[c]; c = (c + 1) % emojis.length }

    let end
    if (a0 === b0 && b0 === c0) {
      end = `🎁 *GACOR KANG!!!* WON\n*+${(bet + bet).toLocaleString('id-ID')} uang*`
      data.ekonomi.uang += bet + bet
    } else if (a0 === b0 || a0 === c0 || b0 === c0) {
      end = `🔮 Lanjut lagi bang, belum stop kalau belum gacor 💲💲\nTambahan *+${regSlot.toLocaleString('id-ID')} uang*`
      data.ekonomi.uang += regSlot
    } else {
      end = `😔 Rungkad *-${bet.toLocaleString('id-ID')} uang*`
      data.ekonomi.uang -= bet
    }

    data.cooldown.slot = now

    let text =
      `🎰 ┃ *gacha uang*\n` +
      `───────────\n` +
      `${x[0]} : ${y[0]} : ${z[0]}\n` +
      `${x[1]} : ${y[1]} : ${z[1]}\n` +
      `${x[2]} : ${y[2]} : ${z[2]}\n` +
      `───────────\n` +
      `🎰┃🎰┃🎰\n\n` +
      `${end}`

    return Exp.sendMessage(id, { text, contextInfo }, { quoted: cht })
  }
)

ev.on(
  {
    cmd: ['copet'],
    listmenu: ['copet'],
    tag: 'rpg',
    isGroup: true
  },
  async () => {
    let user = sender.split('@')[0]
    let data = Data.rpg[user]

    if (!data) return reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu dengan .daftar`)

    data.cooldown.copet ??= 0
    data.riwayat.copet ??= 0

    let now = Date.now()
    let cd = 12 * 60 * 60 * 1000

    if (now - data.cooldown.copet < cd) {
      let dur = func.formatDuration(cd - (now - data.cooldown.copet))
      let sisa = `${dur.minutes > 0 ? dur.minutes + ' menit ' : ''}${dur.seconds > 0 ? dur.seconds + ' detik ' : ''}`
      return reply(`Sepertinya kamu masih kelelahan untuk mencopet.\nTunggu sekitar \`${sisa}\` lagi.`)
    }

    if (data.life.tenaga < 20)
      return reply(`Stamina kamu tidak cukup untuk mencopet.\nIsi tenaga dulu dengan potion atau istirahat.`)

    if (data.life.nyawa < 15)
      return reply(`Nyawa kamu terlalu sedikit untuk ambil risiko mencopet.`)

    let rndm1 = Math.floor(Math.random() * 10) + 1
    let rndm2 = Math.floor(Math.random() * 10) + 1

    let uang = rndm1 * 1000
    let exp = rndm2 * 10

    await reply(`🔍 Mencari target di keramaian...`)
    await sleep(3000)
    await reply(`👀 Mengincar target yang lengah...`)
    await sleep(3000)
    await reply(`🤏 Memulai aksi pencopetan...`)
    await sleep(3000)

    let outcome = Math.random()
    let text

    if (outcome < 0.55) {
      data.ekonomi.uang += uang
      data.life.exp += exp
      data.life.tenaga -= 20
      if (data.life.tenaga < 0) data.life.tenaga = 0
      data.riwayat.copet += 1
      data.cooldown.copet = now

      text = `
*—[ Hasil Copet ]—*

➕ 💹 Uang   : Rp${uang.toLocaleString('id-ID')}
➕ ✨ Exp    : ${exp}
➕ 📦 Aksi copet berhasil

Stamina berkurang -20
`.trim()
    } else if (outcome < 0.85) {
      data.life.tenaga -= 20
      if (data.life.tenaga < 0) data.life.tenaga = 0
      data.riwayat.copet += 1
      data.cooldown.copet = now

      text = `
*—[ Copet Gagal ]—*

Targetmu curiga dan kamu gagal mengambil dompetnya.
Untungnya kamu berhasil kabur sebelum massa datang.

Stamina berkurang -20
`.trim()
    } else {
      let damage = Math.floor(Math.random() * 16) + 10
      data.life.tenaga -= 20
      if (data.life.tenaga < 0) data.life.tenaga = 0

      data.life.nyawa -= damage
      if (data.life.nyawa < 0) data.life.nyawa = 0

      data.riwayat.copet += 1
      data.cooldown.copet = now

      let statusNyawa = data.life.nyawa <= 0
        ? `Kamu pingsan dan diseret ke pos ronda.\nNyawa kamu habis dan perlu dipulihkan dulu.`
        : `Nyawa berkurang -${damage}\nSisa nyawa: ${data.life.nyawa}`

      text = `
*—[ Copet Gagal Total ]—*

Kamu ketahuan warga saat mencopet.
Massa marah dan kamu dihakimi ramai-ramai.

${statusNyawa}

Stamina berkurang -20
`.trim()
    }

    return reply(text)
  }
)

const HITMAN_CD = 24 * 60 * 60 * 1000

ev.on(
  {
    cmd: ['bunuh', 'hitman'],
    listmenu: ['bunuh', 'hitman'],
    tag: 'rpg',
    isGroup: true
  },
  async () => {
    let userId = sender.split('@')[0]
    let data = Data.rpg?.[userId]

    if (!data) return reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu dengan .daftar`)

    if (data.life.level < 10) {
      return reply(
        `Fitur ini hanya untuk level 10 ke atas.\n` +
        `Level kamu sekarang: ${data.life.level}.`
      )
    }

    data.cooldown ??= {}
    data.riwayat ??= {}
    data.riwayat.bunuh ??= 0
    if (typeof data.pelanggaran !== 'number') data.pelanggaran = 0

    let now = Date.now()
    let last = data.cooldown.bunuh || 0
    let diff = now - last

    if (diff < HITMAN_CD) {
      let sisa = HITMAN_CD - diff
      if (sisa < 0) sisa = 0
      let h = Math.floor(sisa / 3600000)
      let m = Math.floor(sisa / 60000) % 60
      let s = Math.floor(sisa / 1000) % 60
      let timers = [h, m, s].map(v => String(v).padStart(2, '0')).join(':')

      return reply(
        `Silakan menunggu selama ${timers}, ` +
        `untuk menyelesaikan misi kembali.`
      )
    }

    if (data.life.tenaga < 25) {
      return reply(`Tenaga kamu tidak cukup untuk menjalankan misi pembunuhan.`)
    }

    data.life.tenaga -= 25
    if (data.life.tenaga < 0) data.life.tenaga = 0

    let randomUang = Math.floor(Math.random() * 10) || 1
    let randomExp = Math.floor(Math.random() * 10) || 1

    let uang = randomUang * 100000
    let exp = randomExp * 1000

    let roll = Math.random()
    let hasilText = ''
    let detailText = ''
    let damage = 0

    if (roll < 0.5) {
      // Misi berhasil
      data.ekonomi.uang += uang
      data.life.exp += exp
      data.pelanggaran += 1
      data.riwayat.bunuh += 1

      detailText =
        `🕵️ Mendapatkan target...\n` +
        `⚔️ Menusuk tubuhnya dalam sekali gerak...\n` +
        `☠️ Target meninggal dan kamu mengambil barang-barangnya.`

      hasilText =
        `*—[ Misi Berhasil ]—*\n` +
        `➕ 💹 Uang       : Rp${uang.toLocaleString('id-ID')}\n` +
        `➕ ✨ Exp        : ${exp}\n` +
        `➕ 👮 Pelanggaran: +1\n` +
        `➕ ☑️ Misi       : +1\n` +
        `➖ Tenaga       : -25`
    } else if (roll < 0.75) {
      // Serangan meleset
      detailText =
        `🕵️ Mendekati target dengan hati-hati...\n` +
        `⚔️ Kamu mengayunkan senjata, tapi target bergerak tiba-tiba.\n` +
        `😮 Seranganmu meleset dan kamu terpaksa mundur.`

      hasilText =
        `*—[ Misi Gagal: Serangan Meleset ]—*\n` +
        `Seranganmu tidak mengenai sasaran.\n` +
        `Tidak ada hadiah yang didapat.\n` +
        `Tenaga -25.`
    } else if (roll < 0.9) {
      // Target kabur
      detailText =
        `🕵️ Mengincar target dari kejauhan...\n` +
        `👀 Target menyadari gerakan mencurigakanmu.\n` +
        `🏃 Target kabur ke keramaian dan kamu kehilangan jejak.`

      hasilText =
        `*—[ Misi Gagal: Target Kabur ]—*\n` +
        `Target berhasil melarikan diri sebelum kamu bisa menghabisinya.\n` +
        `Tidak ada hadiah yang didapat.\n` +
        `Tenaga -25.`
    } else {
      // Posisi diketahui
      damage = Math.floor(Math.random() * 21) + 10
      data.life.nyawa -= damage
      if (data.life.nyawa < 0) data.life.nyawa = 0
      data.pelanggaran += 2

      detailText =
        `🕵️ Mengintai dari balik bayangan...\n` +
        `👀 Seseorang menyadari keberadaanmu dan berteriak.\n` +
        `📢 Posisi kamu terbongkar, massa mulai mengepung.\n` +
        `🏃 Kamu kabur sambil menerima beberapa serangan.`

      let statusNyawa =
        data.life.nyawa <= 0
          ? `Nyawa kamu habis dan kamu pingsan.\nPulihkan dulu sebelum menjalankan misi lagi.`
          : `Nyawa berkurang -${damage}.\nSisa nyawa: ${data.life.nyawa}.`

      hasilText =
        `*—[ Misi Gagal: Posisi Terbongkar ]—*\n` +
        `Posisimu diketahui dan kamu diserang balik.\n` +
        `${statusNyawa}\n\n` +
        `Tenaga -25.\nPelanggaran +2.`
    }

    data.cooldown.bunuh = now

    let text =
      `🔍 Mencari target pembunuhan...\n\n` +
      `${detailText}\n\n` +
      `${hasilText}`

    return reply(text)
  }
)

let buatall = 1
const JUDI_CD = 5000

ev.on(
  {
    cmd: ['judi'],
    listmenu: ['judi <jumlah|all>'],
    tag: 'rpg',
    isGroup: true
  },
  async ({ args }) => {
    global.__RPG_JUDI_LOCK__ ??= {}
    if (global.__RPG_JUDI_LOCK__[id]) return reply('Masih ada yang melakukan judi disini, tunggu sampai selesai!!')
    global.__RPG_JUDI_LOCK__[id] = true

    try {
      let userId = sender.split('@')[0]
      let data = Data.rpg?.[userId]
      if (!data) return reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu dengan .daftar`)

      data.cooldown ??= {}
      data.ekonomi ??= { uang: 0, bank: 0 }

      let raw = String(args ?? '').trim()
      if (!raw) return reply(`• Example : ${cht.prefix + cht.cmd} 1000`)

      let now = Date.now()
      let last = data.cooldown.judi || 0
      if (now - last < JUDI_CD) {
        return reply(`Kamu sudah judi, tidak bisa judi kembali..\nMohon tunggu ${msToTime(JUDI_CD - (now - last))} lagi untuk judi kembali`)
      }

      let token = raw.split(/\s+/)[0]
      let count

      if (/all/i.test(token)) {
        count = Math.floor((data.ekonomi.uang || 0) / buatall)
      } else {
        count = parseInt(token)
      }

      if (!Number.isFinite(count)) return reply(`• Example : ${cht.prefix + cht.cmd} 1000`)
      count = Math.max(1, count)

      if ((data.ekonomi.uang || 0) < count) {
        return reply(`Money kamu tidak cukup untuk melakukan judi sebesar ${count} money`)
      }

      data.cooldown.judi = now

      let Aku = Math.floor(Math.random() * 350)
      let Kamu = Math.floor(Math.random() * 50)

      data.ekonomi.uang -= count

      if (Aku > Kamu) {
        return reply(`aku roll:${Aku}\nKamu roll: ${Kamu}\n\nkamu *Kalah*, kamu kehilangan ${count} money`)
      }

      if (Aku < Kamu) {
        data.ekonomi.uang += count * 2
        return reply(`aku roll:${Aku}\nKamu roll: ${Kamu}\n\nkamu *Menang*, kamu Mendapatkan ${count * 2} money`)
      }

      data.ekonomi.uang += count
      return reply(`aku roll:${Aku}\nKamu roll: ${Kamu}\n\nkamu *Seri*, kamu Mendapatkan ${count} money`)
    } finally {
      delete global.__RPG_JUDI_LOCK__[id]
    }
  }
)

const ROB_CD = 12 * 60 * 60 * 1000
const ROB_TENAGA = 20
const ROB_MIN_TARGET = 10000

ev.on(
  {
    cmd: ['rampok'],
    listmenu: ['rampok @user'],
    tag: 'rpg',
    isGroup: true
  },
  async () => {
    let userId = sender.split('@')[0]
    let data = normalizePlayer(Data.rpg?.[userId])
    if (!data) return reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu dengan .daftar`)

    let targetJid = cht.mention?.[0]
    if (!targetJid) return reply('Tag salah satu lah')

    let targetId = targetJid.split('@')[0]
    if (targetId === userId) return reply('Ngapain ngerampok diri sendiri?')

    let target = normalizePlayer(Data.rpg?.[targetId])
    if (!target) return reply('Pengguna tidak ada didalam data base RPG')

    let now = Date.now()
    let last = data.cooldown.merampok || 0
    let remaining = ROB_CD - (now - last)
    if (remaining > 0) return reply(`Anda sudah merampok dan berhasil sembunyi, tunggu ${msToTime(remaining)} untuk merampok lagi`)

    if (data.life.tenaga < ROB_TENAGA) return reply('Tenaga kamu tidak cukup untuk merampok')
    if (data.life.nyawa < 15) return reply('Nyawa kamu terlalu tipis buat ambil risiko merampok')

    let targetMoney = target.ekonomi.uang || 0
    if (targetMoney < ROB_MIN_TARGET) return reply('Target gaada uang, kismin dia')

    data.life.tenaga -= ROB_TENAGA
    if (data.life.tenaga < 0) data.life.tenaga = 0

    let atkLuck = data.stat?.luck || 0
    let atkSpeed = data.stat?.speed || 0
    let defLuck = target.stat?.luck || 0
    let defSpeed = target.stat?.speed || 0

    let pSuccess = 0.45 + (atkLuck - defLuck) * 0.004 + (atkSpeed - defSpeed) * 0.002
    pSuccess = Math.max(0.15, Math.min(0.80, pSuccess))

    let pKabur = 0.30 + (defSpeed - atkSpeed) * 0.001
    pKabur = Math.max(0.10, Math.min(0.45, pKabur))

    let pMeleset = 0.15
    let pKetahuan = 1 - (pSuccess + pKabur + pMeleset)
    if (pKetahuan < 0.05) pKetahuan = 0.05

    let total = pSuccess + pKabur + pMeleset + pKetahuan
    pSuccess /= total
    pKabur /= total
    pMeleset /= total

    data.cooldown.merampok = now

    let roll = Math.random()
    let namaTarget = target.nama || targetId

    if (roll < pSuccess) {
      let max = Math.min(150000, Math.floor(targetMoney * 0.15))
      if (max < 5000) max = 5000
      let ambil = Math.floor(Math.random() * (max - 5000 + 1)) + 5000
      if (ambil > target.ekonomi.uang) ambil = target.ekonomi.uang

      target.ekonomi.uang -= ambil
      data.ekonomi.uang += ambil

      data.riwayat.merampok_sukses = (data.riwayat.merampok_sukses || 0) + 1

      return reply(
        `✅ Berhasil merampok ${namaTarget}\n` +
        `➕ Uang: Rp${ambil.toLocaleString('id-ID')}\n` +
        `➖ Tenaga: -${ROB_TENAGA}\n` +
        `Sisa tenaga: ${data.life.tenaga}`
      )
    }

    if (roll < pSuccess + pKabur) {
      data.riwayat.merampok_gagal = (data.riwayat.merampok_gagal || 0) + 1

      return reply(
        `❌ Gagal merampok ${namaTarget}\n` +
        `Target sadar lalu kabur ke keramaian.\n` +
        `➖ Tenaga: -${ROB_TENAGA}\n` +
        `Sisa tenaga: ${data.life.tenaga}`
      )
    }

    if (roll < pSuccess + pKabur + pMeleset) {
      data.riwayat.merampok_gagal = (data.riwayat.merampok_gagal || 0) + 1

      return reply(
        `❌ Gagal merampok ${namaTarget}\n` +
        `Tanganmu meleset, kamu panik lalu mundur.\n` +
        `➖ Tenaga: -${ROB_TENAGA}\n` +
        `Sisa tenaga: ${data.life.tenaga}`
      )
    }

    let damage = Math.floor(Math.random() * 16) + 10
    let denda = Math.floor(Math.random() * 30001) + 10000
    if (denda > data.ekonomi.uang) denda = data.ekonomi.uang

    data.life.nyawa -= damage
    if (data.life.nyawa < 0) data.life.nyawa = 0

    if (denda > 0) {
      data.ekonomi.uang -= denda
      target.ekonomi.uang += denda
    }

    data.riwayat.merampok_ketahuan = (data.riwayat.merampok_ketahuan || 0) + 1

    let status = data.life.nyawa <= 0
      ? `Kamu pingsan. Nyawa habis, pulihkan dulu.`
      : `Sisa nyawa: ${data.life.nyawa}`

    return reply(
      `🚨 Ketahuan saat merampok ${namaTarget}\n` +
      `Posisimu diketahui, kamu dihajar warga.\n` +
      `➖ Nyawa: -${damage}\n` +
      `${status}\n` +
      `➖ Denda: Rp${denda.toLocaleString('id-ID')}\n` +
      `➖ Tenaga: -${ROB_TENAGA}\n` +
      `Sisa tenaga: ${data.life.tenaga}`
    )
  }
)

ev.on(
  {
    cmd: ['mengaji', 'ngaji', 'ustad', 'ustadz', 'ustaz'],
    listmenu: ['ngaji'],
    tag: 'rpg',
    isGroup: true
  },
  async () => {
    const user = sender.split('@')[0]
    const data = Data.rpg?.[user]
    if (!data) return reply('‼️ Kamu belum terdaftar di RPG. Ketik `.reg` dulu.')

    data.cooldown ??= {}
    data.riwayat ??= {}

    const now = Date.now()
    const cd = 6 * 60 * 60 * 1000

    if (now - (data.cooldown.ngaji || 0) < cd) {
      const dur = func.formatDuration(cd - (now - (data.cooldown.ngaji || 0)))
      const sisa = `${dur.minutes > 0 ? dur.minutes + ' menit ' : ''}${dur.seconds > 0 ? dur.seconds + ' detik' : ''}`.trim()
      return reply(`‼️ Kamu baru ngaji. Tunggu sekitar \`${sisa}\` lagi.`)
    }

    if ((data.life?.tenaga ?? 0) < 10) return reply('‼️ Tenaga kamu kurang. Isi dulu sebelum ngaji.')

    const uang = (Math.floor(Math.random() * 5) + 1) * 15729
    const exp = (Math.floor(Math.random() * 10) + 1) * 20000

    data.ekonomi ??= { uang: 0, bank: 0 }
    data.life ??= { level: 1, exp: 0, nyawa: 100, tenaga: 100, max_exp: 100 }

    data.ekonomi.uang += uang
    data.life.exp += exp
    data.life.tenaga = Math.max(0, data.life.tenaga - 10)

    data.riwayat.ngaji = (data.riwayat.ngaji || 0) + 1
    data.riwayat.pelanggaran = Math.max(0, (data.riwayat.pelanggaran || 0) - 1)

    data.cooldown.ngaji = now

    await reply('🔍 Mencari guru ngaji...')
    await sleep(1200)
    const kk = keys[sender]

    const log = []
    log.push('🔍 Mencari guru ngaji...')
    await edit(log.join('\n'), kk)

    await sleep(1500)
    log.push('🕌 Ketemu ustadz...')
    await edit(log.join('\n'), kk)

    await sleep(1500)
    log.push('📖 Mulai mengaji...')
    await edit(log.join('\n'), kk)

    await sleep(1500)
    log.push('✅ Diajarin tajwid & qalqalah dipantulkan.')
    await edit(log.join('\n'), kk)

    await sleep(1500)
    log.push('')
    log.push(`—[ Hasil Ngaji ]—`)
    log.push(`➕💹 Uang jajan: Rp${uang.toLocaleString('id-ID')}`)
    log.push(`➕✨ Exp: +${exp.toLocaleString('id-ID')}`)
    log.push(`➖⚡ Tenaga: -10 (sisa ${data.life.tenaga})`)
    log.push(`➖👮 Pelanggaran: -1 (sisa ${data.riwayat.pelanggaran})`)
    await edit(log.join('\n'), kk)

    levelup(data)
  }
)

const NGEWE_CD = 6 * 60 * 60 * 1000
const NGEWE_LOCK_MS = 27000

ev.on(
  {
    cmd: ['ngentot'],
    listmenu: ['ngentot'],
    tag: 'rpg',
    isGroup: true
  },
  async () => {
    const delay = (ms) => new Promise(r => setTimeout(r, ms))

    global.__RPG_MISI_LOCK__ ??= {}

    let userId = sender?.split('@')?.[0]
    if (!userId) return reply('Terjadi error: sender tidak ditemukan.')

    if (global.__RPG_MISI_LOCK__[sender]) return reply('Selesaikan misi sebelumnya terlebih dahulu.')

    let data = normalizePlayer(Data.rpg?.[userId])
    if (!data) return reply('❌ Kamu belum terdaftar di RPG. Daftar dulu dengan .daftar')

    if ((data.life?.level || 0) < 70) return reply(`Fitur ini butuh level 70.\nLevel kamu: ${data.life?.level || 0}`)

    data.cooldown ??= {}
    data.riwayat ??= {}
    data.ekonomi ??= { uang: 0, bank: 0 }
    data.life ??= { nyawa: 100, tenaga: 100, level: 1, exp: 0, max_exp: 100 }

    let now = Date.now()
    let last = data.cooldown.ngentot || 0
    let remaining = NGEWE_CD - (now - last)
    if (remaining > 0) return reply(`Silahkan menunggu *${msToTime(remaining)}* untuk melakukan lagi`)

    if ((data.life.nyawa || 0) < 80) return reply('Anda harus memiliki minimal 80 nyawa')
    if ((data.life.tenaga || 0) < 50) return reply('Tenaga tidak cukup. Coba isi tenaga dulu.')

    global.__RPG_MISI_LOCK__[sender] = true
    setTimeout(() => { delete global.__RPG_MISI_LOCK__[sender] }, NGEWE_LOCK_MS)

    let uang = Math.floor(Math.random() * 10) * 100000
    let exp = Math.floor(Math.random() * 10) * 1000

    data.ekonomi.uang += uang
    data.life.exp += exp
    data.warn = (data.warn || 0) + 1
    data.riwayat.ngentot = (data.riwayat.ngentot || 0) + 1
    data.life.nyawa = Math.max(0, (data.life.nyawa || 0) - 80)
    data.life.tenaga = Math.max(0, (data.life.tenaga || 0) - 40)
    data.cooldown.ngentot = now

    let name = pushName || data.nama || userId

    await reply(`🔍 ${name} mencari order...`)
    let kk = keys?.[sender]

    if (!kk || typeof edit !== 'function') {
      let text =
        `📲 Order masuk\n\n` +
        `✅ Order selesai\n\n` +
        `*—[ Hasil ${name} ]—*\n` +
        `➕ 💹 Uang = ${uang.toLocaleString('id-ID')}\n` +
        `➕ ✨ Exp = ${exp.toLocaleString('id-ID')}\n` +
        `➕ 📥 Total bookingan: ${data.riwayat.ngentot}\n` +
        `➖ ❤️ Nyawa: -80 (sisa ${data.life.nyawa})\n` +
        `➖ ⚡ Tenaga: -40 (sisa ${data.life.tenaga})`
      levelup(data)
      delete global.__RPG_MISI_LOCK__[sender]
      return reply(text)
    }

    let log = []
    log.push(`🔍 ${name} mencari order...`)
    await edit(log.join('\n'), kk)

    await delay(2500)
    log.push(`📲 Order masuk, menuju lokasi...`)
    await edit(log.join('\n'), kk)

    await delay(2500)
    log.push(`🏨 Check-in dan mulai menjalankan order...`)
    await edit(log.join('\n'), kk)

    await delay(2500)
    log.push(`⏳ Order berjalan...`)
    await edit(log.join('\n'), kk)

    await delay(2500)
    log.push(`✅ Order selesai.`)
    await edit(log.join('\n'), kk)

    await delay(2000)
    log.push(``)
    log.push(`*—[ Hasil ${name} ]—*`)
    log.push(`➕ 💹 Uang = ${uang.toLocaleString('id-ID')}`)
    log.push(`➕ ✨ Exp = ${exp.toLocaleString('id-ID')}`)
    log.push(`➕ 📥 Total bookingan: ${data.riwayat.ngentot}`)
    log.push(`➖ ❤️ Nyawa: -80 (sisa ${data.life.nyawa})`)
    log.push(`➖ ⚡ Tenaga: -40 (sisa ${data.life.tenaga})`)
    await edit(log.join('\n'), kk)

    levelup(data)
    delete global.__RPG_MISI_LOCK__[sender]
  }
)

const NGEPE_CD = 6 * 60 * 60 * 1000

ev.on(
  {
    cmd: ['ngepet', 'ngefet'],
    listmenu: ['ngepet'],
    tag: 'rpg',
    isGroup: true
  },
  async () => {
    const wm = global.wm || ''

    const userId = sender.split('@')[0]
    const data = normalizePlayer(Data.rpg?.[userId])
    if (!data) return reply('❌ Kamu belum terdaftar di RPG. Daftar dulu dengan .daftar')

    data.cooldown ??= {}
    data.ekonomi ??= { uang: 0, bank: 0 }

    const now = Date.now()
    const last = data.cooldown.ngepet || 0
    const remaining = NGEPE_CD - (now - last)

    if (remaining > 0) {
      return Exp.sendMessage(
        id,
        {
          text: `Kamu sudah melakukan *ngepet*\nTunggu *${msToTime(remaining)}* untuk ngepet lagi.`,
          contextInfo: {
            externalAdReply: {
              title: 'C O O L D O W N',
              body: msToTime(remaining),
              thumbnailUrl: 'https://telegra.ph/file/295949ff5494f3038f48c.jpg',
              mediaType: 1,
              showAdAttribution: false,
              renderLargerThumbnail: true
            }
          }
        },
        { quoted: cht }
      )
    }

    const Aku = Math.floor(Math.random() * 150)
    const Kamu = Math.floor(Math.random() * 20)

    data.cooldown.ngepet = now

    if (Aku > Kamu) {
      data.ekonomi.uang -= 10000000
      return Exp.sendMessage(
        id,
        {
          text: `Kamu lengah saat ngepet, dan kamu minus *10.000.000* uang.`,
          contextInfo: {
            externalAdReply: {
              title: 'Nooo, kamu punya hutang 10JT 😞',
              body: wm,
              thumbnailUrl: 'https://telegra.ph/file/c6c4a6946a354317fe970.jpg',
              mediaType: 1,
              showAdAttribution: false,
              renderLargerThumbnail: true
            }
          }
        },
        { quoted: cht }
      )
    }

    if (Aku < Kamu) {
      data.ekonomi.uang += 5000000
      return Exp.sendMessage(
        id,
        {
          text: `Kamu berhasil ngepet, dan kamu mendapatkan *5.000.000* uang.`,
          contextInfo: {
            externalAdReply: {
              title: 'Selamat! Dapat 5JT',
              body: wm,
              thumbnailUrl: 'https://telegra.ph/file/6a6a440d7f123bed78263.jpg',
              mediaType: 1,
              showAdAttribution: false,
              renderLargerThumbnail: true
            }
          }
        },
        { quoted: cht }
      )
    }

    return Exp.sendMessage(
      id,
      {
        text: `Kamu gagal dapat duit dan memilih kabur sebelum kejadian makin parah.\n${wm}`
      },
      { quoted: cht }
    )
  }
)

const SAWER_LOCK_MS = 8000

ev.on(
  {
    cmd: ['sawer', 'nyawer'],
    listmenu: ['sawer 1000'],
    tag: 'rpg',
    isGroup: true
  },
  async ({ args }) => {
    global.__RPG_SAWER_LOCK__ ??= {}
    if (global.__RPG_SAWER_LOCK__[id]) return reply('Masih ada saweran yang berjalan di grup ini, tunggu sebentar.')

    let raw = Array.isArray(args) ? String(args[0] ?? '').trim() : String(args ?? '').trim()
    if (!raw || isNaN(raw)) return reply(`*Example*: ${cht.prefix + cht.cmd} 1000`)

    let count = parseInt(raw)
    if (!Number.isFinite(count) || count < 1) return reply(`*Example*: ${cht.prefix + cht.cmd} 1000`)

    let userId = sender.split('@')[0]
    let data = normalizePlayer(Data.rpg?.[userId])
    if (!data) return reply('❌ Kamu belum terdaftar di RPG. Daftar dulu dengan .daftar')

    data.ekonomi ??= { uang: 0, bank: 0 }
    data.riwayat ??= {}

    if ((data.ekonomi.uang || 0) < count) return reply(`money kamu tidak cukup untuk sawer sebanyak ${count}`)

    let meta =
      store?.groupMetadata?.[id] ||
      cht?.groupMetadata ||
      null

    if (!meta && typeof Exp?.groupMetadata === 'function') {
      try { meta = await Exp.groupMetadata(id) } catch {}
    }

    let ps =
      (meta?.participants || [])
        .map(v => (typeof v === 'string' ? v : (v?.id || v?.jid)))
        .filter(Boolean)

    let eligible = ps.filter(j => {
      if (!j || j === sender) return false
      let uid = j.split('@')[0]
      return !!Data.rpg?.[uid]
    })

    if (!eligible.length) return reply('Tidak ada anggota yang terdaftar RPG untuk menerima saweran.')

    let targetJid = eligible[Math.floor(Math.random() * eligible.length)]
    let targetId = targetJid.split('@')[0]
    let target = normalizePlayer(Data.rpg?.[targetId])

    global.__RPG_SAWER_LOCK__[id] = true
    setTimeout(() => { delete global.__RPG_SAWER_LOCK__[id] }, SAWER_LOCK_MS)

    await reply('💸 Memproses saweran...')
    let kk = keys?.[sender]

    data.ekonomi.uang -= count
    target.ekonomi.uang += count

    data.riwayat.sawer = (data.riwayat.sawer || 0) + 1
    target.riwayat.terima_sawer = (target.riwayat.terima_sawer || 0) + 1

    let text = `*@${targetId}* Kamu mendapatkan saweran dari *@${userId}* sebesar *${count.toLocaleString('id-ID')}*`

    if (kk) {
      return Exp.sendMessage(
        id,
        { text, edit: kk, mentions: [sender, targetJid] },
        { quoted: cht }
      )
    }

    return Exp.sendMessage(
      id,
      { text, mentions: [sender, targetJid] },
      { quoted: cht }
    )
  }
)

const EWEPAKSA_CD = 12 * 60 * 60 * 1000   // 2 jam

const EWEPAKSA_STEP = 5000               // jeda edit 5 detik

ev.on(

  {

    cmd: ['ewe-paksa'],

    listmenu: ['ewe-paksa'],

    tag: 'rpg',

    isGroup: true

  },

  async () => {

    const sleep = (ms) => new Promise(r => setTimeout(r, ms))

    global.__RPG_EWEPAKSA_LOCK__ ??= {}

    if (global.__RPG_EWEPAKSA_LOCK__[sender]) return reply('Selesaikan aksi sebelumnya dulu.')

    const userId = sender.split('@')[0]

    const data = normalizePlayer(Data.rpg?.[userId])

    if (!data) return reply('❌ Kamu belum terdaftar di RPG. Daftar dulu dengan .daftar')

    data.cooldown ??= {}

    data.riwayat ??= {}

    data.ekonomi ??= { uang: 0, bank: 0 }

    data.life ??= { exp: 0, level: 1 }

    const now = Date.now()

    const last = data.cooldown.ewepaksa || 0

    const remain = EWEPAKSA_CD - (now - last)

    if (remain > 0) {

      return reply(`Silahkan menunggu selama *${msToTime(remain)}* lagi untuk melakukan *Ewe-paksa* kembali`)

    }

    const name = pushName || data.nama || userId

    const uang = Math.floor(Math.random() * 1000000)

    const exp  = Math.floor(Math.random() * 10000)

    // update langsung (biar pasti masuk)

    data.ekonomi.uang += uang

    data.life.exp += exp

    data.riwayat.ewepaksa = (data.riwayat.ewepaksa || 0) + 1

    data.cooldown.ewepaksa = now

    global.__RPG_EWEPAKSA_LOCK__[sender] = true

    await reply('🤭 mulai ewe paksa..')

    const kk = keys?.[sender]

    const arr = [

      "👙 kamu paksa dia buka baju🤭",

      "🥵💦 sszz Ahhhh.....",

      "🥵Ahhhh, Sakitttt!! >////<\n 💦Crotttt.....\n  💦Crottt lagi",

      "🥵💦💦Ahhhhhh😫",

      `*—[ Hasil Ewe Paksa ${name} ]—*

➤ 💰 Uang = [ ${uang} ]

➤ ✨ Exp = [ ${exp} ]

➤ 😍 Order Selesai = +1`

    ]

    if (kk && typeof edit === 'function') {

      for (let line of arr) {

        await sleep(EWEPAKSA_STEP)

        await edit(line, kk)

      }

    } else {

      // fallback kalau edit tidak tersedia

      await reply(

        `*—[ Hasil Ewe Paksa ${name} ]—*

➤ 💰 Uang = [ ${uang} ]

➤ ✨ Exp = [ ${exp} ]

➤ 😍 Order Selesai = +1`

      )

    }

    levelup(data)

    delete global.__RPG_EWEPAKSA_LOCK__[sender]

  }

)

const HACK_ATM_CD = 12 * 60 * 60 * 1000      // 30 menit
const HACK_ATM_MIN_BALANCE = 50_000     // minimal saldo buat ikut main

ev.on(
  {
    cmd: ['hackatm', 'atm-hack'],
    listmenu: ['hackatm @user'],
    tag: 'rpg',
    isGroup: true
  },
  async () => {
    const userId = sender.split('@')[0]
    const me = normalizePlayer(Data.rpg?.[userId])
    if (!me) return reply('❌ Kamu belum terdaftar di RPG. Daftar dulu dengan .daftar')

    me.cooldown ??= {}
    me.ekonomi ??= { uang: 0, bank: 0 }

    const now = Date.now()
    const last = me.cooldown.hackatm || 0
    const diff = now - last
    const remaining = HACK_ATM_CD - diff

    if (remaining > 0) {
      return reply(
        `Kamu baru saja mencoba hack ATM.\n` +
        `Tunggu *${msToTime(remaining)}* sebelum mencoba lagi.`
      )
    }

    const targetJid = cht.mention?.[0]
    if (!targetJid) return reply('Tag salah satu target: *hackatm @user*')

    const targetId = targetJid.split('@')[0]
    if (targetId === userId) return reply('Ngapain hack ATM kamu sendiri?')

    const target = normalizePlayer(Data.rpg?.[targetId])
    if (!target) return reply('Target belum terdaftar di RPG.')

    target.ekonomi ??= { uang: 0, bank: 0 }

    if ((me.ekonomi.uang || 0) < HACK_ATM_MIN_BALANCE) {
      return reply(
        `Saldo kamu terlalu tipis buat hack ATM.\n` +
        `Minimal punya Rp${HACK_ATM_MIN_BALANCE.toLocaleString('id-ID')}.`
      )
    }

    if ((target.ekonomi.uang || 0) < HACK_ATM_MIN_BALANCE) {
      return reply('ATM target hampir kosong, nggak worth buat di-hack.')
    }

    me.cooldown.hackatm = now

    // peluang sukses: ~55%
    const roll = Math.random()
    const successRate = 0.55

    if (roll < successRate) {
      // BERHASIL
      const targetBalance = target.ekonomi.uang
      const minSteal = HACK_ATM_MIN_BALANCE
      const maxSteal = Math.min(
        Math.max(minSteal, Math.floor(targetBalance * 0.35)), // maksimal 35% saldo target
        300_000
      )

      if (targetBalance < minSteal) {
        return reply('ATM target keburu ditarik owner, uangnya tinggal receh.')
      }

      let jumlah = Math.floor(Math.random() * (maxSteal - minSteal + 1)) + minSteal
      if (jumlah > target.ekonomi.uang) jumlah = target.ekonomi.uang

      target.ekonomi.uang -= jumlah
      me.ekonomi.uang += jumlah

      const text =
        `✅ *Hack ATM Berhasil*\n\n` +
        `👤 Hacker : @${userId}\n` +
        `🎯 Target : @${targetId}\n\n` +
        `💰 Uang dicuri : Rp${jumlah.toLocaleString('id-ID')}\n` +
        `💳 Saldo kamu sekarang : Rp${me.ekonomi.uang.toLocaleString('id-ID')}`

      return reply(text)
    } else {
      // GAGAL: uang kita yang hilang, target dapat kompensasi
      const myBalance = me.ekonomi.uang
      const minLoss = Math.min(HACK_ATM_MIN_BALANCE, myBalance)
      const maxLoss = Math.min(Math.max(minLoss, 150_000), myBalance)

      let loss = Math.floor(Math.random() * (maxLoss - minLoss + 1)) + minLoss
      if (loss > me.ekonomi.uang) loss = me.ekonomi.uang

      me.ekonomi.uang -= loss
      target.ekonomi.uang += Math.floor(loss * 0.6) // 60% jadi kompensasi buat target

      const text =
        `❌ *Hack ATM Gagal*\n\n` +
        `👤 Hacker : @${userId}\n` +
        `🎯 Target : @${targetId}\n\n` +
        `🚨 Sistem keamanan bank mendeteksi percobaan hack.\n` +
        `💸 Uang kamu hilang : Rp${loss.toLocaleString('id-ID')}\n` +
        `💳 Saldo kamu sekarang : Rp${me.ekonomi.uang.toLocaleString('id-ID')}`

      return reply(text)
    }
  }
)

const NGEWEE_CD = 6 * 60 * 60 * 1000        // 5 menit
const NGEWE_STEP = 4000         // jeda edit 4 detik

ev.on(
  {
    cmd: ['ngewe', 'anu'],
    listmenu: ['ngewe'],
    tag: 'rpg',
    isGroup: true
  },
  async () => {
    const wait = (ms) => new Promise(r => setTimeout(r, ms))
    const wm = global.wm || ''

    global.__RPG_NGEWE_LOCK__ ??= {}
    if (global.__RPG_NGEWE_LOCK__[sender]) return reply('Selesaikan misi sebelumnya dulu.')

    const userId = sender.split('@')[0]
    const data = normalizePlayer(Data.rpg?.[userId])
    if (!data) return reply('❌ Kamu belum terdaftar di RPG. Daftar dulu dengan .daftar')

    data.cooldown ??= {}
    data.riwayat ??= {}
    data.ekonomi ??= { uang: 0, bank: 0 }
    data.life ??= { level: 1, exp: 0, max_exp: 100, nyawa: 100, tenaga: 100 }

    const now = Date.now()
    const last = data.cooldown.ngewe || 0
    const remaining = NGEWEE_CD - (now - last)
    if (remaining > 0) {
      return reply(`Kamu baru selesai misi.\nTunggu *${msToTime(remaining)}* untuk melakukannya lagi.`)
    }

    data.cooldown.ngewe = now
    global.__RPG_NGEWE_LOCK__[sender] = true

    const order = data.riwayat.ngewe || 0
    const uang = Math.floor(Math.random() * 5) * 15729
    const exp  = Math.floor(Math.random() * 10) * 20000

    data.warn = (data.warn || 0) + 1
    data.ekonomi.uang += uang
    data.life.exp += exp
    data.riwayat.ngewe = order + 1

    await reply('🔍Mencari pelanggan.....')
    const kk = keys?.[sender]

    // ====================================================
    //  MASUKKAN TEKS ASLI KAMU DI SINI (SATU PER SATU)
    //  jangan ubah variabel di kurung kurawal {}
    // ====================================================
    const arr = [
    "✔️ Mendapatkan pelanggan....",
    "🥵 Mulai mengocok.....",
    "🥵Ahhhh, Sakitttt!! >////<\n💦Crotttt.....,",
    "🥵💦💦Ahhhhhh😫",
      `—[ Hasil Ngewe ${pushName || data.nama || userId} ]—
➕ 💹 Uang = [ ${uang} ]
➕ ✨ Exp = [ ${exp} ]
➕ 📛 Warn = +1
➕ 😍 Order Selesai = +1
➕ 📥 Total Order Sebelumnya : ${order}
${wm}`
    ]

    if (kk && typeof edit === 'function' && arr.length) {
      for (let i = 0; i < arr.length; i++) {
        await wait(NGEWE_STEP)
        await edit(arr[i], kk)
      }
    } else {
      await reply(arr[arr.length - 1])
    }

    levelup(data)
    delete global.__RPG_NGEWE_LOCK__[sender]
  }
)

const OPENBO_CD = 6 * 60 * 60 * 1000 // 8 menit 20 detik

ev.on(
  {
    cmd: ['openbo'],
    listmenu: ['openbo'],
    tag: 'rpg',
    isGroup: true
  },
  async () => {
    const wait = (ms) => new Promise(r => setTimeout(r, ms))

    let userId = sender.split('@')[0]
    let data = Data.rpg[userId]
    if (!data) return reply("‼️ Kamu belum terdaftar di RPG. Daftar dulu dengan `.daftar nama | umur | jenis kelamin`")

    // normalisasi struktur
    data.ekonomi ??= { uang: 0, bank: 0 }
    data.life ??= { level: 1, exp: 0, nyawa: 100, tenaga: 100, max_exp: 100 }
    data.cooldown ??= {}
    data.riwayat ??= {}

    const now = Date.now()
    const last = data.cooldown.openbo || 0
    const remaining = OPENBO_CD - (now - last)

    if (remaining > 0) {
      return reply(
        `*Kamu sudah kecapekan*\nSilakan istirahat selama *${msToTime(remaining)}*`
      )
    }

    const steps = [
      'Sedang mencari pelanggan…',
      'Kamu mendapatkan pelanggan dan pergi ke hotel',
      'Kamu mulai menerima order tersebut',
      'Kamu dipaksa melayaninya seharian…',
      'Kamu terbaring lemas, tetapi mendapatkan:\n\n3000 Uang\n1000 Exp\n10 Limit\n+ Bonus minuman & makan'
    ]

    // pesan pertama
    await reply(steps[0])
    const kk = keys?.[sender]

    if (kk && typeof edit === 'function') {
      // 1 chat di-edit terus
      for (let i = 1; i < steps.length; i++) {
        await wait(4000)
        await edit(steps[i], kk)
      }
    } else {
      // fallback kalau nggak ada keys/edit
      for (let i = 1; i < steps.length; i++) {
        await wait(4000)
        await reply(steps[i])
      }
    }

    // reward
    data.ekonomi.uang += 3000
    data.life.exp += 1000
    data.riwayat.openbo = (data.riwayat.openbo || 0) + 1
    // kalau lo mau bener-bener ada "limit", taruh di sini, misal:
    // data.limitOpenbo = (data.limitOpenbo || 0) + 10

    data.cooldown.openbo = now
    levelup(data)
  }
)

;(() => {
  if (false) {
    user.money += 3000
    user.exp += 1000
    user.limit += 10
    user.lastngewe = now
  }
})()

ev.on(
  {
    cmd: ['akunyt'],
    listmenu: ['akunyt'],
    tag: 'rpg',
    isGroup: true
  },
  async ({ cht }) => {
    const pfx = cht.prefix || '.'
    const targetId = _ytTargetKey(cht)
    const raw = global.Data?.rpg?.[targetId]
    const target = _ytClampPlayer(raw ? normalizePlayer(raw) : null)

    if (!target || !target.yt?.channel) {
      return cht.reply(
        `\`\`\`txt\n` +
        `╭─「 YOUTUBE ACCOUNT 」─╮\n` +
        `│ Status : NOT FOUND\n` +
        `├──────────────────────┤\n` +
        `│ Buat dulu:\n` +
        `│ ${pfx}createakunyt <nama channel>\n` +
        `╰──────────────────────╯\n` +
        `\`\`\``
      )
    }

    const yt = target.yt
    const me = `@${targetId}`

    const a = _ytAwards(yt.subs)
    const pb = _ytUpdatePlayButton(target)

    const sSilver = a.silver ? '✅' : '❎'
    const sGold = a.gold ? '✅' : '❎'
    const sDiamond = a.diamond ? '✅' : '❎'
    const sBronze = a.bronze ? '✅' : '❎'
    const sRed = a.red ? '✅' : '❎'

    const monet = _ytMonet(target)
    const cd = Math.max(0, _YT_LIVE_CD - (Date.now() - (yt.lastLiveAt || 0)))

    const lvlLine = `Lv ${yt.level}  (${_ytBar(yt.exp, yt.max_exp)}  ${_ytNum(yt.exp)}/${_ytNum(yt.max_exp)})`
    const monetLine = monet.ok
      ? `YES`
      : `NO  (Subs ${_ytNum(monet.subs)}/1000 ${_ytBar(monet.subs, 1000, 10)} | WH ${_ytNum(monet.wh)}/4000 ${_ytBar(monet.wh, 4000, 10)})`

    const gear = `Mic ${yt.gear.mic}/10 | Cam ${yt.gear.cam}/10 | PC ${yt.gear.pc}/10 | Net ${yt.gear.net}/10`

    const rep = `${yt.reputation}/100`
    const burn = `${yt.burnout}/100`
    const strikes = `${yt.strikes}/3`
    const statusRisk = yt.strikes >= 2 ? 'HIGH' : (yt.strikes === 1 ? 'MED' : 'LOW')

    return cht.reply(
      `\`\`\`txt\n` +
      `╭─「 YOUTUBE CHANNEL 」─╮\n` +
      `│ Streamer : ${me}\n` +
      `│ Channel  : ${yt.channel}\n` +
      `│ Niche    : ${yt.niche}\n` +
      `│ Level    : ${lvlLine}\n` +
      `├──────────────────────────────┤\n` +
      `│ Subs     : ${_ytCompact(yt.subs)}\n` +
      `│ Views    : ${_ytCompact(yt.views)}\n` +
      `│ Likes    : ${_ytCompact(yt.likes)}\n` +
      `│ Videos   : ${_ytNum(yt.videos)}\n` +
      `│ Lives    : ${_ytNum(yt.liveCount)}\n` +
      `│ WatchHr  : ${_ytCompact(yt.watchHours)}\n` +
      `│ Revenue  : ${_ytMoney(yt.revenue)}\n` +
      `├──────────────────────────────┤\n` +
      `│ Awards   : Bronze ${sBronze} | Silver ${sSilver} | Gold ${sGold}\n` +
      `│           Diamond ${sDiamond} | Red ${sRed}\n` +
      `│ PlayBtn  : ${pb.now}/3\n` +
      `│ Monetize : ${monetLine}\n` +
      `├──────────────────────────────┤\n` +
      `│ Gear     : ${gear}\n` +
      `│ Rep/Burn : ${rep} / ${burn}\n` +
      `│ Strikes  : ${strikes} (Risk ${statusRisk})\n` +
      `│ Cooldown : ${cd > 0 ? _ytMs(cd) : 'READY'}\n` +
      `╰──────────────────────────────╯\n` +
      `\`\`\``
    )
  }
)

ev.on(
  {
    cmd: ['createakunyt'],
    listmenu: ['createakunyt <nama channel>'],
    tag: 'rpg',
    isGroup: true
  },
  async ({ cht, args }) => {
    const pfx = cht.prefix || '.'
    const userId = _ytKey(cht.sender)
    const raw = global.Data?.rpg?.[userId]
    const data = _ytClampPlayer(raw ? normalizePlayer(raw) : null)
    if (!data) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)

    const name = (Array.isArray(args) ? args.join(' ') : String(args || '')).trim()
    if (!name) {
      return cht.reply(
        `\`\`\`txt\n` +
        `╭─「 CREATE YT ACCOUNT 」─╮\n` +
        `│ Format:\n` +
        `│ ${pfx}createakunyt <nama channel>\n` +
        `│ Contoh:\n` +
        `│ ${pfx}createakunyt Mahiru Gaming\n` +
        `╰────────────────────────╯\n` +
        `\`\`\``
      )
    }

    const now = Date.now()
    const renameCd = 6 * 60 * 60 * 1000
    if (data.yt?.channel && now - (data.yt.lastRenameAt || 0) < renameCd) {
      const left = renameCd - (now - (data.yt.lastRenameAt || 0))
      return cht.reply(`❌ Rename cooldown. Tunggu ${_ytMs(left)}.`)
    }

    data.yt.channel = name
    data.yt.lastRenameAt = now
    data.youtube_account = name

    return cht.reply(
      `\`\`\`txt\n` +
      `╭─「 YT ACCOUNT SAVED 」─╮\n` +
      `│ Channel : ${name}\n` +
      `├────────────────────────┤\n` +
      `│ Cek akun : ${pfx}akunyt\n` +
      `│ Live     : ${pfx}ytlive <judul>\n` +
      `╰────────────────────────╯\n` +
      `\`\`\``
    )
  }
)

ev.on(
  {
    cmd: ['deleteakun'],
    listmenu: ['deleteakun confirm'],
    tag: 'rpg',
    isGroup: true
  },
  async ({ cht, args }) => {
    const pfx = cht.prefix || '.'
    const userId = _ytKey(cht.sender)
    const raw = global.Data?.rpg?.[userId]
    const data = _ytClampPlayer(raw ? normalizePlayer(raw) : null)
    if (!data) return cht.reply(`❌ Kamu belum terdaftar di RPG.`)

    if (!data.yt?.channel) return cht.reply('❌ Kamu belum punya akun YouTube di sistem.')

    const a0 = (Array.isArray(args) ? args[0] : String(args || '')).trim().toLowerCase()
    if (a0 !== 'confirm') {
      return cht.reply(
        `\`\`\`txt\n` +
        `╭─「 DELETE YT ACCOUNT 」─╮\n` +
        `│ Ini menghapus data YouTube kamu.\n` +
        `│ Konfirmasi:\n` +
        `│ ${pfx}deleteakun confirm\n` +
        `╰────────────────────────╯\n` +
        `\`\`\``
      )
    }

    data.yt = {}
    data.youtube_account = null
    data.subscribers = 0
    data.viewers = 0
    data.like = 0
    data.playButton = 0
    data.lastLiveTime = 0
    data.ytVideos = 0
    data.ytLives = 0
    data.ytWatchHours = 0
    data.ytRevenue = 0
    data.ytStrikes = 0
    data.ytDemonetized = false
    data.ytReputation = 0
    data.ytBurnout = 0
    data.ytLastRenameAt = 0

    return cht.reply('✅ Akun YouTube kamu sudah dihapus dari sistem.')
  }
)

ev.on(
  {
    cmd: ['ytlive', 'ytstreaming'],
    listmenu: ['ytlive <judul live>'],
    tag: 'rpg',
    isGroup: true
  },
  async ({ cht, args }) => {
    const pfx = cht.prefix || '.'
    const userId = _ytKey(cht.sender)
    const raw = global.Data?.rpg?.[userId]
    const data = _ytClampPlayer(raw ? normalizePlayer(raw) : null)
    if (!data) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)

    if (!data.yt?.channel) {
      return cht.reply(
        `❌ Kamu belum punya akun YouTube.\nBuat dulu: ${pfx}createakunyt <nama channel>`
      )
    }

    const title = (Array.isArray(args) ? args.join(' ') : String(args || '')).trim()
    if (!title || title.length > 60) {
      return cht.reply(
        `❌ Judul live wajib diisi (maks 60 karakter).\nContoh: ${pfx}ytlive Push rank malam minggu`
      )
    }

    const now = Date.now()
    const since = now - (data.yt.lastLiveAt || 0)
    const cdLeft = Math.max(0, _YT_LIVE_CD - since)
    if (cdLeft > 0) return cht.reply(`❌ Cooldown.\nTunggu: ${_ytMs(cdLeft)}`)

    const tenagaCost = Math.min(35, 18 + Math.floor(title.length / 4) + Math.floor(data.yt.burnout / 10))
    if (_ytNum(data.life?.tenaga) < tenagaCost) {
      return cht.reply(`❌ Tenaga kurang.\nButuh: ${tenagaCost}\nTenaga: ${_ytNum(data.life?.tenaga)}`)
    }

    data.life.tenaga = Math.max(0, _ytNum(data.life.tenaga) - tenagaCost)

    const yt = data.yt

    const gearAvg = (yt.gear.mic + yt.gear.cam + yt.gear.pc + yt.gear.net) / 4
    const nicheMult = _ytNicheMult(yt.niche)
    const repMult = 1 + (yt.reputation / 250)
    const burnMult = 1 - (yt.burnout / 170)
    const strikeMult = yt.strikes === 0 ? 1 : (yt.strikes === 1 ? 0.82 : 0.62)

    const base = Math.max(60, Math.floor((yt.subs + 250) * (0.06 + gearAvg * 0.012)))
    const rng = (a, b) => a + Math.random() * (b - a)

    let viewers = Math.floor(base * rng(14, 34) * nicheMult * repMult * burnMult * strikeMult)
    let views = Math.floor(viewers * rng(1.8, 4.6))
    let likeRate = rng(0.015, 0.065) + gearAvg * 0.002 + yt.reputation * 0.0001
    likeRate = Math.min(0.14, Math.max(0.01, likeRate))
    let likes = Math.floor(viewers * likeRate)
    let subConv = rng(0.0008, 0.006) + gearAvg * 0.0004 + yt.reputation * 0.00004
    subConv = Math.min(0.02, Math.max(0.0003, subConv))
    let subs = Math.floor(views * subConv)

    const events = []
    const roll = Math.random()

    if (roll < 0.055) {
      const mult = rng(1.8, 3.6)
      viewers = Math.floor(viewers * mult)
      views = Math.floor(views * mult * rng(1.2, 1.6))
      likes = Math.floor(likes * mult)
      subs = Math.floor(subs * mult)
      yt.reputation = Math.min(100, yt.reputation + 6)
      events.push('VIRAL CLIP')
    } else if (roll < 0.085) {
      yt.strikes = Math.min(3, yt.strikes + 1)
      yt.reputation = Math.max(0, yt.reputation - 8)
      events.push('COMMUNITY STRIKE')
    } else if (roll < 0.125) {
      yt.demonetized = true
      yt.reputation = Math.max(0, yt.reputation - 10)
      events.push('DEMONETIZED')
    } else if (roll < 0.185) {
      yt.reputation = Math.min(100, yt.reputation + 4)
      events.push('POSITIVE TREND')
    }

    const wh = Math.max(1, Math.floor((views / 120) * rng(0.7, 1.4)))
    yt.watchHours += wh

    const monet = _ytMonet(data)
    let donation = Math.floor(viewers * rng(35, 140) * (1 + gearAvg * 0.06))
    donation = Math.min(500_000_000, Math.max(0, donation))

    let revenue = 0
    if (monet.ok && !yt.demonetized) {
      revenue = Math.floor(views * rng(0.8, 2.4) * (1 + yt.reputation / 220))
      revenue = Math.min(1_000_000_000, Math.max(0, revenue))
    }

    yt.subs += Math.max(0, subs)
    yt.likes += Math.max(0, likes)
    yt.views += Math.max(0, views)
    yt.liveCount += 1
    yt.videos += 0

    yt.revenue += revenue
    data.ekonomi.uang = _ytNum(data.ekonomi?.uang) + donation + revenue

    yt.burnout = Math.min(100, yt.burnout + Math.floor(rng(6, 14)) + (yt.strikes > 0 ? 2 : 0))
    if (yt.burnout >= 85) events.push('BURNOUT HIGH')

    const exp = Math.floor(40 + (views / 9000) + gearAvg * 6 + yt.reputation * 0.6)
    const ups = _ytGain(data, exp)

    data.life.exp = _ytNum(data.life?.exp) + Math.floor(exp * 0.55)
    if (typeof levelup === 'function') levelup(data)

    yt.lastLiveAt = now
    data.lastLiveTime = now

    const pb = _ytUpdatePlayButton(data)
    let awardText = ''
    if (pb.now > pb.prev) {
      if (pb.now === 1) {
        data.eris += 250_000 + Math.floor(rng(0, 250_000))
        data.life.exp += 900
        awardText = 'SILVER PLAY BUTTON UNLOCKED'
      } else if (pb.now === 2) {
        data.eris += 700_000 + Math.floor(rng(0, 600_000))
        data.life.exp += 2200
        awardText = 'GOLD PLAY BUTTON UNLOCKED'
      } else if (pb.now === 3) {
        data.eris += 1_600_000 + Math.floor(rng(0, 1_200_000))
        data.life.exp += 5200
        awardText = 'DIAMOND PLAY BUTTON UNLOCKED'
      }
    }

    const cd = _YT_LIVE_CD
    const nextCdText = _ytMs(cd)

    const evLine = events.length ? events.join(' | ') : 'NORMAL SESSION'
    const upLine = ups > 0 ? `LEVEL UP +${ups} (Now Lv ${yt.level})` : '-'

    return cht.reply(
      `\`\`\`txt\n` +
      `╭─「 LIVE RESULT 」─╮\n` +
      `│ Streamer : @${userId}\n` +
      `│ Channel  : ${yt.channel}\n` +
      `│ Title    : ${title}\n` +
      `├────────────────────────┤\n` +
      `│ +Subs    : ${_ytCompact(subs)}\n` +
      `│ +Views   : ${_ytCompact(views)}\n` +
      `│ +Likes   : ${_ytCompact(likes)}\n` +
      `│ +WHours  : ${_ytCompact(wh)}\n` +
      `│ +Income  : ${_ytMoney(donation + revenue)}\n` +
      `├────────────────────────┤\n` +
      `│ TotalSubs: ${_ytCompact(yt.subs)}\n` +
      `│ TotalView: ${_ytCompact(yt.views)}\n` +
      `│ TotalLike: ${_ytCompact(yt.likes)}\n` +
      `│ Revenue  : ${_ytMoney(yt.revenue)}\n` +
      `├────────────────────────┤\n` +
      `│ Event    : ${evLine}\n` +
      `│ EXP      : +${_ytNum(exp)}  (${upLine})\n` +
      `│ Tenaga   : -${tenagaCost}  (Sisa ${_ytNum(data.life.tenaga)})\n` +
      `│ NextLive : ${nextCdText}\n` +
      (awardText ? `├────────────────────────\n│ ${awardText}\n` : '') +
      `╰────────────────────────╯\n` +
      `\`\`\`\n` +
      `Cek progress: ${pfx}akunyt`
    )
  }
)

ev.on(
  {
    cmd: ['ytniche'],
    listmenu: ['ytniche <type>'],
    tag: 'rpg',
    isGroup: true
  },
  async ({ cht, args }) => {
    const pfx = cht.prefix || '.'
    const userId = _ytKey(cht.sender)
    const raw = global.Data?.rpg?.[userId]
    const data = _ytClampPlayer(raw ? normalizePlayer(raw) : null)
    if (!data) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)
    if (!data.yt?.channel) return cht.reply(`❌ Kamu belum punya akun YouTube.\nBuat dulu: ${pfx}createakunyt <nama channel>`)

    const parts = _ytP(args)
    const pick = String(parts[0] || '').toLowerCase()

    const cur = String(data.yt.niche || 'general').toLowerCase()
    const curInfo = _YT_NICHE_INFO[cur] || _YT_NICHE_INFO.general

    if (!pick) {
      const lines = Object.keys(_YT_NICHE_INFO).map(k => {
        const x = _YT_NICHE_INFO[k]
        const mark = k === cur ? '•' : ' '
        return `${mark} ${k.padEnd(9)}  x${x.mult.toFixed(2)}  ${x.desc}`
      }).join('\n')

      return cht.reply(
        `\`\`\`txt\n` +
        `╭─「 YT NICHE 」─╮\n` +
        `│ Current : ${cur} (x${curInfo.mult.toFixed(2)})\n` +
        `├────────────────────────\n` +
        `${lines}\n` +
        `├────────────────────────\n` +
        `│ Set: ${pfx}ytniche <type>\n` +
        `╰────────────────────────╯\n` +
        `\`\`\``
      )
    }

    const info = _YT_NICHE_INFO[pick]
    if (!info) {
      return cht.reply(
        `❌ Niche tidak valid.\n` +
        `Lihat list: ${pfx}ytniche`
      )
    }

    if (pick === cur) return cht.reply(`❌ Niche kamu sudah ${pick}.`)

    const now = Date.now()
    data.yt.nicheSwapAt ??= 0
    const cd = 2 * 60 * 60 * 1000
    const left = Math.max(0, cd - (now - (data.yt.nicheSwapAt || 0)))
    if (left > 0) return cht.reply(`❌ Cooldown ganti niche.\nTunggu: ${_ytMs(left)}`)

    data.yt.niche = pick
    data.yt.nicheSwapAt = now
    data.yt.reputation = Math.max(0, Math.min(100, _ytNum(data.yt.reputation) + 1))

    return cht.reply(
      `\`\`\`txt\n` +
      `╭─「 NICHE UPDATED 」─╮\n` +
      `│ New Niche : ${pick}\n` +
      `│ Mult      : x${info.mult.toFixed(2)}\n` +
      `│ Note      : ${info.desc}\n` +
      `├──────────────────────\n` +
      `│ Cek akun : ${pfx}akunyt\n` +
      `│ Live     : ${pfx}ytlive <judul>\n` +
      `╰──────────────────────╯\n` +
      `\`\`\``
    )
  }
)

ev.on(
  {
    cmd: ['ytupgrade', 'ytgear'],
    listmenu: ['ytupgrade <mic|cam|pc|net> [targetLevel]'],
    tag: 'rpg',
    isGroup: true
  },
  async ({ cht, args }) => {
    const pfx = cht.prefix || '.'
    const userId = _ytKey(cht.sender)
    const raw = global.Data?.rpg?.[userId]
    const data = _ytClampPlayer(raw ? normalizePlayer(raw) : null)
    if (!data) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)
    if (!data.yt?.channel) return cht.reply(`❌ Kamu belum punya akun YouTube.\nBuat dulu: ${pfx}createakunyt <nama channel>`)

    const yt = data.yt
    const parts = _ytP(args)
    const part = _ytGearPartNorm(parts[0])

    if (!part) {
      const mic = yt.gear.mic
      const cam = yt.gear.cam
      const pc = yt.gear.pc
      const net = yt.gear.net

      const nextMic = _ytMoney(_ytGearTotalCost('mic', mic, Math.min(10, mic + 1)))
      const nextCam = _ytMoney(_ytGearTotalCost('cam', cam, Math.min(10, cam + 1)))
      const nextPc = _ytMoney(_ytGearTotalCost('pc', pc, Math.min(10, pc + 1)))
      const nextNet = _ytMoney(_ytGearTotalCost('net', net, Math.min(10, net + 1)))

      return cht.reply(
        `\`\`\`txt\n` +
        `╭─「 YT GEAR 」─╮\n` +
        `│ Mic : ${mic}/10  Next: ${nextMic}\n` +
        `│ Cam : ${cam}/10  Next: ${nextCam}\n` +
        `│ PC  : ${pc}/10  Next: ${nextPc}\n` +
        `│ Net : ${net}/10  Next: ${nextNet}\n` +
        `├────────────────────────\n` +
        `│ Money : ${_ytMoney(data.ekonomi?.uang || 0)}\n` +
        `│ YT Lv  : ${yt.level}\n` +
        `├────────────────────────\n` +
        `│ Upgrade:\n` +
        `│ ${pfx}ytupgrade mic 5\n` +
        `│ ${pfx}ytupgrade pc 3\n` +
        `╰────────────────────────╯\n` +
        `\`\`\``
      )
    }

    const cur = _ytNum(yt.gear[part])
    const wantRaw = Number(parts[1])
    const target = wantRaw ? Math.max(1, Math.min(10, Math.floor(wantRaw))) : Math.min(10, cur + 1)

    if (cur >= 10) return cht.reply(`❌ ${_ytGearPartName(part)} sudah max level (10).`)
    if (target <= cur) return cht.reply(`❌ Target level harus > level sekarang (${cur}).`)
    if (target > 10) return cht.reply('❌ Max gear level adalah 10.')

    const needLv = _ytNeedYtLevel(target)
    if (yt.level < needLv) {
      return cht.reply(
        `❌ YT level belum cukup untuk upgrade sampai Lv ${target}.\n` +
        `Butuh: YT Lv ${needLv}\n` +
        `Punya: YT Lv ${yt.level}`
      )
    }

    const cost = _ytGearTotalCost(part, cur, target)
    const money = _ytNum(data.ekonomi?.uang)

    if (money < cost) {
      return cht.reply(
        `❌ Uang kurang.\n` +
        `Butuh: ${_ytMoney(cost)}\n` +
        `Uang : ${_ytMoney(money)}`
      )
    }

    data.ekonomi.uang = money - cost
    yt.gear[part] = target

    yt.reputation = Math.min(100, _ytNum(yt.reputation) + Math.max(1, Math.floor((target - cur) * 1.5)))
    yt.burnout = Math.min(100, _ytNum(yt.burnout) + Math.max(2, Math.floor((target - cur) * 3)))

    return cht.reply(
      `\`\`\`txt\n` +
      `╭─「 GEAR UPGRADED 」─╮\n` +
      `│ Part   : ${_ytGearPartName(part)}\n` +
      `│ Level  : ${cur} → ${target}\n` +
      `│ Cost   : ${_ytMoney(cost)}\n` +
      `├────────────────────────\n` +
      `│ Money  : ${_ytMoney(data.ekonomi?.uang || 0)}\n` +
      `│ Rep    : ${yt.reputation}/100\n` +
      `│ Burn   : ${yt.burnout}/100\n` +
      `╰────────────────────────╯\n` +
      `\`\`\``
    )
  }
)

ev.on(
  {
    cmd: ['ytappeal'],
    listmenu: ['ytappeal'],
    tag: 'rpg',
    isGroup: true
  },
  async ({ cht }) => {
    const pfx = cht.prefix || '.'
    const userId = _ytKey(cht.sender)
    const raw = global.Data?.rpg?.[userId]
    const data = _ytClampPlayer(raw ? normalizePlayer(raw) : null)
    if (!data) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)
    if (!data.yt?.channel) return cht.reply(`❌ Kamu belum punya akun YouTube.\nBuat dulu: ${pfx}createakunyt <nama channel>`)

    const yt = data.yt
    if (!yt.demonetized && _ytNum(yt.strikes) === 0) return cht.reply('✅ Tidak ada kasus untuk di-appeal (no demonetize, no strikes).')

    const now = Date.now()
    yt.appealAt ??= 0
    const left = Math.max(0, _YT_APPEAL_CD - (now - (yt.appealAt || 0)))
    if (left > 0) return cht.reply(`❌ Appeal cooldown.\nTunggu: ${_ytMs(left)}`)

    const rep = _ytNum(yt.reputation)
    const burn = _ytNum(yt.burnout)
    const strikes = _ytNum(yt.strikes)
    const lvl = _ytNum(yt.level)

    let p = 0.22
    p += rep / 210
    p += lvl / 260
    p -= burn / 260
    p -= strikes * 0.12
    if (yt.demonetized) p -= 0.08
    p = Math.max(0.05, Math.min(0.78, p))

    const roll = Math.random()
    yt.appealAt = now

    let action = ''
    let outcome = ''
    let extra = ''

    if (yt.demonetized) action = 'DEMONETIZATION APPEAL'
    else action = 'STRIKE APPEAL'

    if (roll <= p) {
      if (yt.demonetized) {
        yt.demonetized = false
        yt.reputation = Math.min(100, rep + 6)
        yt.burnout = Math.min(100, burn + 8)
        outcome = 'APPROVED'
        extra = 'Monetization restored'
      } else {
        yt.strikes = Math.max(0, strikes - 1)
        yt.reputation = Math.min(100, rep + 4)
        yt.burnout = Math.min(100, burn + 6)
        outcome = 'APPROVED'
        extra = '1 strike removed'
      }
    } else {
      yt.reputation = Math.max(0, rep - 6)
      yt.burnout = Math.min(100, burn + 10)
      outcome = 'REJECTED'
      extra = 'Improve Rep / reduce Burnout then retry'

      if (Math.random() < 0.06 && !yt.demonetized) {
        yt.strikes = Math.min(3, _ytNum(yt.strikes) + 1)
        extra = 'Rejected + additional strike risk triggered'
      }
    }

    return cht.reply(
      `\`\`\`txt\n` +
      `╭─「 YT APPEAL 」─╮\n` +
      `│ Case    : ${action}\n` +
      `│ Chance  : ${(p * 100).toFixed(1)}%\n` +
      `│ Result  : ${outcome}\n` +
      `├────────────────────────\n` +
      `│ Note    : ${extra}\n` +
      `├────────────────────────\n` +
      `│ Strikes : ${_ytNum(yt.strikes)}/3\n` +
      `│ Demon   : ${yt.demonetized ? 'YES' : 'NO'}\n` +
      `│ Rep     : ${_ytNum(yt.reputation)}/100\n` +
      `│ Burn    : ${_ytNum(yt.burnout)}/100\n` +
      `╰────────────────────────╯\n` +
      `\`\`\`\n` +
      `Tip: turunin Burnout pakai ${pfx}ytrehab`
    )
  }
)

ev.on(
  {
    cmd: ['ytrehab'],
    listmenu: ['ytrehab [rest|agency]'],
    tag: 'rpg',
    isGroup: true
  },
  async ({ cht, args }) => {
    const pfx = cht.prefix || '.'
    const userId = _ytKey(cht.sender)
    const raw = global.Data?.rpg?.[userId]
    const data = _ytClampPlayer(raw ? normalizePlayer(raw) : null)
    if (!data) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)
    if (!data.yt?.channel) return cht.reply(`❌ Kamu belum punya akun YouTube.\nBuat dulu: ${pfx}createakunyt <nama channel>`)

    const yt = data.yt
    const parts = _ytP(args)
    const mode = String(parts[0] || 'agency').toLowerCase()

    const now = Date.now()
    yt.rehabAt ??= 0
    const left = Math.max(0, _YT_REHAB_CD - (now - (yt.rehabAt || 0)))
    if (left > 0) return cht.reply(`❌ Rehab cooldown.\nTunggu: ${_ytMs(left)}`)

    const burn0 = _ytNum(yt.burnout)
    const rep0 = _ytNum(yt.reputation)

    let burnDown = 0
    let repUp = 0
    let cost = 0
    let note = ''

    if (mode === 'rest') {
      burnDown = 14 + Math.floor(Math.random() * 10)
      repUp = 1 + Math.floor(Math.random() * 3)
      cost = 0
      note = 'Rest mode: murah tapi efek kecil'
    } else {
      burnDown = 26 + Math.floor(Math.random() * 18)
      repUp = 4 + Math.floor(Math.random() * 8)
      cost = 150000 + Math.floor((burn0 + yt.strikes * 20) * 2200)
      note = 'Agency mode: mahal tapi efek besar'
    }

    const money = _ytNum(data.ekonomi?.uang)
    if (money < cost) {
      return cht.reply(
        `❌ Uang kurang.\n` +
        `Butuh: ${_ytMoney(cost)}\n` +
        `Uang : ${_ytMoney(money)}\n` +
        `Coba: ${pfx}ytrehab rest`
      )
    }

    data.ekonomi.uang = money - cost
    yt.burnout = Math.max(0, burn0 - burnDown)
    yt.reputation = Math.min(100, rep0 + repUp)
    yt.rehabAt = now

    if (yt.burnout <= 20 && yt.strikes === 1 && Math.random() < 0.08) {
      yt.strikes = 0
      note = `${note} | Bonus: 1 strike auto-cleared`
    }

    return cht.reply(
      `\`\`\`txt\n` +
      `╭─「 YT RECOVERY 」─╮\n` +
      `│ Mode   : ${mode.toUpperCase()}\n` +
      `│ Cost   : ${_ytMoney(cost)}\n` +
      `├────────────────────────\n` +
      `│ Burn   : ${burn0} → ${_ytNum(yt.burnout)}\n` +
      `│ Rep    : ${rep0} → ${_ytNum(yt.reputation)}\n` +
      `│ Money  : ${_ytMoney(data.ekonomi?.uang || 0)}\n` +
      `├────────────────────────\n` +
      `│ Note   : ${note}\n` +
      `╰────────────────────────╯\n` +
      `\`\`\`\n` +
      `Next: ${pfx}ytappeal (kalau ada demonetize/strike)`
    )
  }
)


ev.on(
  {
    cmd: ['rpgadmin', 'rpghelpadmin'],
    listmenu: ['rpgadmin'],
    tag: 'rpg',
    isOwner: true
  },
  async ({ cht }) => cht.reply(_RPG_ADMIN_GUIDE)
)

ev.on(
  {
    cmd: ['rpgpaths'],
    listmenu: ['rpgpaths'],
    tag: 'rpg',
    isOwner: true
  },
  async ({ cht }) => {
    const prefix = cht.prefix || '.'
    return cht.reply(
      `🛠️ RPG ADMIN ROOT PATHS\n` +
      `${Array.from(_RPG_ADMIN_ROOTS).sort().join(', ')}\n\n` +
      `Commands:\n` +
      `${prefix}rpgadmin\n` +
      `${prefix}rpgset [@user/nomor/reply] <path> <value>\n` +
      `${prefix}rpgadd [@user/nomor/reply] <path> <delta>\n` +
      `${prefix}rpgget [@user/nomor/reply] <path>\n` +
      `${prefix}rpgdel [@user/nomor/reply] <path>\n` +
      `${prefix}rpgreset [@user/nomor/reply] yes`
    )
  }
)

ev.on(
  {
    cmd: ['rpgset', 'setrpg', 'setstat'],
    listmenu: ['rpgset [@user/nomor] <path> <value>'],
    tag: 'rpg',
    isOwner: true,
    args: true,
    isArgs: _RPG_ADMIN_GUIDE
  },
  async ({ cht, args }) => {
    const prefix = cht.prefix || '.'
    const parts = _rpgParts(args)
    const { targetKey, shift } = _rpgPickTargetKey(cht, parts)

    const path = parts[shift] || ''
    const valueRaw = parts.slice(shift + 1).join(' ')

    if (!path || !valueRaw) return cht.reply(_RPG_ADMIN_GUIDE)

    const sp = _rpgSafePath(path)
    if (!sp.ok) return cht.reply(`❌ ${sp.err}`)

    const pv = _rpgParseValue(valueRaw)
    if (!pv.ok) return cht.reply(`❌ ${pv.err}`)

    const p = _rpgPlayerOf(targetKey)
    if (!p) return cht.reply(`❌ Target belum terdaftar di RPG.\nDaftarkan dulu dengan ${prefix}daftar`)

    const before = _rpgGetByPath(p, sp.seg)
    _rpgSetByPath(p, sp.seg, pv.val)
    _rpgAdminPost(p)

    return cht.reply(
      `✅ RPG SET\n` +
      `User : ${targetKey}\n` +
      `Path : ${sp.seg.join('.')}\n` +
      `Before: ${_rpgFmt(before)}\n` +
      `After : ${_rpgFmt(_rpgGetByPath(p, sp.seg))}`
    )
  }
)

ev.on(
  {
    cmd: ['rpgadd', 'addrpg', 'addstat'],
    listmenu: ['rpgadd [@user/nomor] <path> <delta>'],
    tag: 'rpg',
    isOwner: true,
    args: true,
    isArgs: _RPG_ADMIN_GUIDE
  },
  async ({ cht, args }) => {
    const prefix = cht.prefix || '.'
    const parts = _rpgParts(args)
    const { targetKey, shift } = _rpgPickTargetKey(cht, parts)

    const path = parts[shift] || ''
    const deltaRaw = parts[shift + 1] || ''

    if (!path || !deltaRaw) return cht.reply(_RPG_ADMIN_GUIDE)

    const sp = _rpgSafePath(path)
    if (!sp.ok) return cht.reply(`❌ ${sp.err}`)

    const d = Number(deltaRaw)
    if (!Number.isFinite(d)) return cht.reply('❌ Delta harus angka.')

    const p = _rpgPlayerOf(targetKey)
    if (!p) return cht.reply(`❌ Target belum terdaftar di RPG.\nDaftarkan dulu dengan ${prefix}daftar`)

    const before = _rpgGetByPath(p, sp.seg)
    const base = Number(before) || 0
    _rpgSetByPath(p, sp.seg, base + d)
    _rpgAdminPost(p)

    return cht.reply(
      `✅ RPG ADD\n` +
      `User : ${targetKey}\n` +
      `Path : ${sp.seg.join('.')}\n` +
      `Before: ${_rpgFmt(before)}\n` +
      `Delta : ${_rpgFmt(d)}\n` +
      `After : ${_rpgFmt(_rpgGetByPath(p, sp.seg))}`
    )
  }
)

ev.on(
  {
    cmd: ['rpgget', 'getrpg', 'getstat'],
    listmenu: ['rpgget [@user/nomor] <path>'],
    tag: 'rpg',
    isOwner: true,
    args: true,
    isArgs: _RPG_ADMIN_GUIDE
  },
  async ({ cht, args }) => {
    const prefix = cht.prefix || '.'
    const parts = _rpgParts(args)
    const { targetKey, shift } = _rpgPickTargetKey(cht, parts)

    const path = parts[shift] || ''
    if (!path) return cht.reply(_RPG_ADMIN_GUIDE)

    const sp = _rpgSafePath(path)
    if (!sp.ok) return cht.reply(`❌ ${sp.err}`)

    const p = _rpgPlayerOf(targetKey)
    if (!p) return cht.reply(`❌ Target belum terdaftar di RPG.`)

    return cht.reply(
      `📌 RPG GET\n` +
      `User : ${targetKey}\n` +
      `Path : ${sp.seg.join('.')}\n` +
      `Value: ${_rpgFmt(_rpgGetByPath(p, sp.seg))}`
    )
  }
)

ev.on(
  {
    cmd: ['rpgdel', 'delrpg', 'delstat'],
    listmenu: ['rpgdel [@user/nomor] <path>'],
    tag: 'rpg',
    isOwner: true,
    args: true,
    isArgs: _RPG_ADMIN_GUIDE
  },
  async ({ cht, args }) => {
    const prefix = cht.prefix || '.'
    const parts = _rpgParts(args)
    const { targetKey, shift } = _rpgPickTargetKey(cht, parts)

    const path = parts[shift] || ''
    if (!path) return cht.reply(_RPG_ADMIN_GUIDE)

    const sp = _rpgSafePath(path)
    if (!sp.ok) return cht.reply(`❌ ${sp.err}`)

    const p = _rpgPlayerOf(targetKey)
    if (!p) return cht.reply(`❌ Target belum terdaftar di RPG.`)

    const ok = _rpgDelByPath(p, sp.seg)
    _rpgAdminPost(p)
    return cht.reply(ok ? `✅ Deleted: ${sp.seg.join('.')} (user ${targetKey})` : `❌ Path tidak ditemukan di user ${targetKey}`)
  }
)

ev.on(
  {
    cmd: ['rpgreset'],
    listmenu: ['rpgreset [@user/nomor] yes'],
    tag: 'rpg',
    isOwner: true,
    args: true,
    isArgs: _RPG_ADMIN_GUIDE
  },
  async ({ cht, args }) => {
    const prefix = cht.prefix || '.'
    const parts = _rpgParts(args)
    const { targetKey } = _rpgPickTargetKey(cht, parts)
    const confirm = String(parts[parts.length - 1] || '').toLowerCase()

    if (confirm !== 'yes') {
      return cht.reply(
        `Perintah ini akan reset data RPG user.\n` +
        `Konfirmasi wajib:\n` +
        `${prefix}rpgreset ${targetKey} yes`
      )
    }

    Data.rpg ??= {}
    const old = Data.rpg?.[targetKey]
    if (!old) return cht.reply('❌ Target belum terdaftar di RPG.')

    const keepName = old?.nama || old?.name
    Data.rpg[targetKey] = { nama: keepName || targetKey }
    normalizePlayer(Data.rpg[targetKey])
    if (typeof job === 'function') job(Data.rpg[targetKey])

    return cht.reply(`✅ RPG RESET\nUser: ${targetKey}\nNama: ${Data.rpg[targetKey].nama || Data.rpg[targetKey].name || '-'}`)
  }
)

ev.on(
  { 
    cmd: ['kitchen', 'kitchenhelp', 'masakhelp'], 
    listmenu: ['kitchen'], 
    tag: 'rpg', 
    isGroup: true 
  },
  async ({ cht }) => cht.reply(_kGuide(cht.prefix || '.'))
)

ev.on(
  {
    cmd: ['bahan', 'bahanbaku'],
    listmenu: ['bahan'],
    tag: 'rpg',
    isGroup: true
  },
  async ({ cht }) => {
    const p = cht.prefix || '.'
    const self = _kGetPlayer(_kJidToKey(cht.sender))
    if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${p}daftar`)
    _kClamp(self)

    const ids = _kListBahan()

    const wId = Math.min(14, Math.max(6, ...ids.map(v => String(v).length)))
    const wNm = Math.min(12, Math.max(4, ...ids.map(v => String(_K_ITEMS[v]?.name || '').length)))

    const head =
      `│ No │ ${'ID'.padEnd(wId)} │ ${'Nama'.padEnd(wNm)} │ ${'Buy'.padStart(8)} │ ${'Sell'.padStart(8)} │\n` +
      `├────┼─${'─'.repeat(wId)}─┼─${'─'.repeat(wNm)}─┼────────┼──────────┤`

    const lines = ids.map((id, i) => {
      const it = _K_ITEMS[id]
      const no = String(i + 1).padStart(2, '0')
      const idc = String(id).padEnd(wId, ' ')
      const nmc = String(it.name).padEnd(wNm, ' ')
      const buy = _kFmt(it.buy).padStart(8, ' ')
      const sell = _kFmt(it.sell).padStart(8, ' ')
      return `│ ${no} │ ${idc} │ ${nmc} │ ${buy} │ ${sell} │`
    }).join('\n')

    const foot = `╰────┴─${'─'.repeat(wId)}─┴─${'─'.repeat(wNm)}─┴────────┴──────────╯`

    return cht.reply(
      '```' + '\n' +
      `╭─「 BAHAN BAKU • ${ids.length} ITEM 」─╮\n` +
      `${head}\n` +
      `${lines}\n` +
      `${foot}\n` +
      `Buy: ${p}buybahan <id> <qty>\n` +
      `Inv: ${p}invk\n` +
      '```'
    )
  }
)

ev.on(
  {
    cmd: ['produk', 'produkmasak'],
    listmenu: ['produk'],
    tag: 'rpg',
    isGroup: true
  },
  async ({ cht }) => {
    const p = cht.prefix || '.'
    const self = _kGetPlayer(_kJidToKey(cht.sender))
    if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${p}daftar`)
    _kClamp(self)

    const ids = _kListProduk()

    const wId = Math.min(14, Math.max(6, ...ids.map(v => String(v).length)))
    const wNm = Math.min(12, Math.max(4, ...ids.map(v => String(_K_RECIPES[v]?.name || '').length)))

    const head =
      `│ No │ ${'Produk'.padEnd(wId)} │ ${'Nama'.padEnd(wNm)} │ ${'Sell'.padStart(8)} │ ${'EXP'.padStart(4)} │\n` +
      `├────┼─${'─'.repeat(wId)}─┼─${'─'.repeat(wNm)}─┼────────┼──────┤`

    const lines = ids.map((id, i) => {
      const r = _K_RECIPES[id]
      const no = String(i + 1).padStart(2, '0')
      const idc = String(id).padEnd(wId, ' ')
      const nmc = String(r.name).padEnd(wNm, ' ')
      const sell = _kFmt(r.sell).padStart(8, ' ')
      const exp = String(r.exp).padStart(4, ' ')
      return `│ ${no} │ ${idc} │ ${nmc} │ ${sell} │ ${exp} │`
    }).join('\n')

    const foot = `╰────┴─${'─'.repeat(wId)}─┴─${'─'.repeat(wNm)}─┴────────┴──────╯`

    return cht.reply(
      '```' + '\n' +
      `╭─「 PRODUK • ${ids.length} ITEM 」─╮\n` +
      `${head}\n` +
      `${lines}\n` +
      `${foot}\n` +
      `Resep: ${p}resep <produk>\n` +
      `Buat : ${p}buat <produk> <qty>\n` +
      `Jual : ${p}sellk <id[#Q]|id> <qty>\n` +
      `Inv  : ${p}invk\n` +
      '```'
    )
  }
)

ev.on(
  {
    cmd: ['invk', 'invkitchen'],
    listmenu: ['invk'],
    tag: 'rpg',
    isGroup: true
  },
  async ({ cht }) => {
    const p = cht.prefix || '.'
    const self = _kGetPlayer(_kJidToKey(cht.sender))
    if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${p}daftar`)
    _kClamp(self)

    const inv = _kInv(self)
    const keys = Object.keys(inv).filter(k => (Number(inv[k]) || 0) > 0)
    if (!keys.length) {
      return cht.reply(
        '```' + '\n' +
        '╭─「 INVENTORY KITCHEN 」─╮\n' +
        '│ Status : Kosong\n' +
        '├────────────────────────┤\n' +
        `│ Beli bahan: ${p}bahan\n` +
        '╰────────────────────────╯\n' +
        '```'
      )
    }

    const grouped = {}
    for (const k of keys) {
      const { base, q } = _kSplitQual(k)
      grouped[base] ??= {}
      grouped[base][q || ''] = (grouped[base][q || ''] || 0) + (Number(inv[k]) || 0)
    }

    const bases = Object.keys(grouped).sort()
    const wId = Math.min(14, Math.max(6, ...bases.map(v => String(v).length)))
    const wNm = Math.min(12, Math.max(4, ...bases.map(v => String(_kMeta(v)?.name || '').length)))

    const head =
      `│ ${'ID'.padEnd(wId)} │ ${'Nama'.padEnd(wNm)} │ Qty\n` +
      `├─${'─'.repeat(wId)}─┼─${'─'.repeat(wNm)}─┼────────────────────────`

    const rows = bases.map(base => {
      const meta = _kMeta(base)
      const nm = String(meta?.name || '-').slice(0, wNm).padEnd(wNm, ' ')
      const seg = grouped[base]
      const qParts = _KQ_ORDER_SHOW.map(q => seg[q] ? `${q}:${_kFmt(seg[q])}` : '').filter(Boolean)
      const plain = seg[''] ? `N:${_kFmt(seg[''])}` : ''
      const tail = [...qParts, plain].filter(Boolean).join(' | ')
      return `│ ${String(base).padEnd(wId)} │ ${nm} │ ${tail || '0'}`
    }).join('\n')

    const sk = _kSkillOf(self)
    const uang = _kFmt(self.ekonomi?.uang || 0)

    return cht.reply(
      '```' + '\n' +
      '╭─「 INVENTORY KITCHEN 」─╮\n' +
      `│ Uang  : ${uang}\n` +
      `│ Skill : Lv ${sk.level}\n` +
      '├────────────────────────┤\n' +
      `${head}\n` +
      `${rows}\n` +
      '╰────────────────────────╯\n' +
      '```'
    )
  }
)
ev.on(
  { 
    cmd: ['buybahan', 'buyk'], 
    listmenu: ['buybahan <id> <qty>'], 
    tag: 'rpg', 
    isGroup: true, 
    args: true, 
    isArgs: 'Format: .buybahan <id> <qty>\nContoh: .buybahan telur 10' 
  },
  async ({ cht, args }) => {
    const p = cht.prefix || '.'
    const self = _kGetPlayer(_kJidToKey(cht.sender))
    if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${p}daftar`)
    _kClamp(self)

    const parts = _kParts(args)
    const id = String(parts[0] || '').toLowerCase()
    const qty = Math.floor(Number(parts[1]) || 0)

    const it = _K_ITEMS[id]
    if (!it) return cht.reply(`❌ Bahan tidak ditemukan.\nCek: ${p}bahan`)
    if (qty <= 0) return cht.reply('❌ Qty harus > 0.')

    const cost = it.buy * qty
    if ((self.ekonomi?.uang || 0) < cost) {
      return cht.reply(`❌ Uang kurang.\nButuh: ${_kFmt(cost)}\nUang : ${_kFmt(self.ekonomi?.uang || 0)}`)
    }

    self.ekonomi.uang -= cost
    _kAddItem(self, id, qty)
    _kClamp(self)

    return cht.reply(
  '```' + '\n' +
  '╭─「 PURCHASE SUCCESS 」─╮\n' +
  `│ Item  : ${id} (${it.name})\n` +
  `│ Qty   : ${_kFmt(qty)}\n` +
  `│ Total : ${_kFmt(cost)}\n` +
  '├────────────────────────┤\n' +
  `│ Uang  : ${_kFmt(self.ekonomi?.uang || 0)}\n` +
  `│ Inv   : ${p}invk\n` +
  '╰────────────────────────╯\n' +
  '```'
)
  }
)

ev.on(
  { 
    cmd: ['buat', 'craftk'], 
    listmenu: ['buat <produk> <qty>'], 
    tag: 'rpg', 
    isGroup: true, 
    args: true, 
    isArgs: 'Format: .buat <produk> <qty>\nContoh: .buat roti 2' 
  },
  async ({ cht, args }) => {
    const p = cht.prefix || '.'
    const self = _kGetPlayer(_kJidToKey(cht.sender))
    if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${p}daftar`)
    _kClamp(self)

    const parts = _kParts(args)
    const base = String(parts[0] || '').toLowerCase()
    const qtyReq = Math.max(1, Math.floor(Number(parts[1]) || 1))

    const r = _K_RECIPES[base]
    if (!r) return cht.reply(`❌ Produk tidak ditemukan.\nCek: ${p}produk`)

    for (const needId in r.need) {
      const needQty = (Number(r.need[needId]) || 0) * qtyReq
      const have = _K_RECIPES[needId] ? _kTotalBase(self, needId) : _kQty(self, needId)
      if (have < needQty) {
        return cht.reply(
          `❌ Bahan kurang.\n` +
          `Butuh: ${needId} x${_kFmt(needQty)}\n` +
          `Punya : ${_kFmt(have)}\n` +
          `Cek  : ${p}invk`
        )
      }
    }

    for (const needId in r.need) {
      const needQty = (Number(r.need[needId]) || 0) * qtyReq
      if (_K_RECIPES[needId]) {
        const take = _kConsumeAny(self, needId, needQty)
        if (!take.ok) return cht.reply(`❌ Bahan kurang.\nCek: ${p}invk`)
      } else {
        _kAddItem(self, needId, -needQty)
      }
    }

    const outTotal = (Number(r.out) || 1) * qtyReq
    const made = { C: 0, U: 0, R: 0, E: 0, L: 0 }

    for (let i = 0; i < outTotal; i++) {
      const q = _kQualRoll(self)
      made[q] += 1
    }

    for (const q of _KQ_ORDER_SHOW) {
      const n = made[q] || 0
      if (n > 0) _kAddItem(self, _kQualKey(base, q), n)
    }

    const sk = _kSkillOf(self)
    const skillBonus = 1 + Math.min(0.6, (sk.level - 1) * 0.03)
    const expGain = Math.floor((Number(r.exp) || 0) * qtyReq * skillBonus)

    const up = _kSkillGain(self, expGain)
    self.life.exp = (Number(self.life?.exp) || 0) + Math.floor(expGain * 0.6)
    if (typeof levelup === 'function') levelup(self)
    _kClamp(self)

    const madeLine = _KQ_ORDER_SHOW.map(q => (made[q] ? `${q}:${_kFmt(made[q])}` : '')).filter(Boolean).join(' | ')
    const lvNote = up.ups > 0 ? `\n🎉 Skill up: Lv ${up.level - up.ups} → Lv ${up.level}` : ''

    return cht.reply(
  '```' + '\n' +
  '╭─「 CRAFT SUCCESS 」─╮\n' +
  `│ Produk  : ${base} (${r.name})\n` +
  `│ Output  : ${_kFmt(outTotal)}\n` +
  `│ Quality : ${madeLine || 'C:0'}\n` +
  '├──────────────────────┤\n' +
  `│ EXP     : +${_kFmt(expGain)} (Lv ${up.level})\n` +
  `│ Inv     : ${p}invk\n` +
  '╰──────────────────────╯\n' +
  '```' +
  (lvNote ? `\n${lvNote}` : '')
)
  }
)

ev.on(
  { 
    cmd: ['sellk', 'jualk'], 
    listmenu: ['sellk <id> <qty>'], 
    tag: 'rpg', 
    isGroup: true, 
    args: true, 
    isArgs: 'Format: .sellk <id[#Q]|id> <qty>\nContoh: .sellk roti#R 2' 
  },
  async ({ cht, args }) => {
    const p = cht.prefix || '.'
    const self = _kGetPlayer(_kJidToKey(cht.sender))
    if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${p}daftar`)
    _kClamp(self)

    const parts = _kParts(args)
    const rawId = String(parts[0] || '').toLowerCase()
    const qty = Math.floor(Number(parts[1]) || 0)
    if (qty <= 0) return cht.reply('❌ Qty harus > 0.')

    const m0 = _kMeta(rawId)
    if (!m0) return cht.reply(`❌ Item tidak dikenal.\nCek: ${p}invk`)

    const d = _kDailyOf(self)

    if (_K_RECIPES[m0.base] && !m0.q) {
      const take = _kConsumeAny(self, m0.base, qty)
      if (!take.ok) return cht.reply(`❌ Item kurang.\nCek: ${p}invk`)

      let gain = 0
      const detail = []
      for (const t of take.take) {
        const qm = t.q ? _kQualMult(t.q) : 1
        const price = Math.floor((Number(_K_RECIPES[m0.base].sell) || 0) * qm)
        const g = price * t.qty
        gain += g
        detail.push(`- ${t.id} x${_kFmt(t.qty)} = ${_kFmt(g)}`)
      }

      if (d.sellValue + gain > _K_DAILY_SELL_CAP) {
        for (const t of take.take) _kAddItem(self, t.id, t.qty)
        const left = Math.max(0, _K_DAILY_SELL_CAP - d.sellValue)
        return cht.reply(`❌ Daily cap sell NPC.\nSisa: ${_kFmt(left)}\nCek: ${p}kitchenskill`)
      }

      d.sellValue += gain
      self.ekonomi.uang = (Number(self.ekonomi?.uang) || 0) + gain
      _kClamp(self)

      return cht.reply(
  '```' + '\n' +
  '╭─「 SELL TO NPC 」─╮\n' +
  `│ Item   : ${m0.base} (${m0.name})\n` +
  `│ Qty    : ${_kFmt(qty)} (auto best)\n` +
  `│ Total  : ${_kFmt(gain)}\n` +
  '├───────────────────┤\n' +
  `│ Uang   : ${_kFmt(self.ekonomi?.uang || 0)}\n` +
  `│ Daily  : ${_kFmt(d.sellValue)} / ${_kFmt(_K_DAILY_SELL_CAP)}\n` +
  '├───────────────────┤\n' +
  `${detail.map(x => `│ ${x}`).join('\n')}\n` +
  '╰───────────────────╯\n' +
  '```'
)
    }

    if (!_kHasItem(self, rawId, qty)) return cht.reply(`❌ Item kurang.\nPunya: ${_kFmt(_kQty(self, rawId))}`)

    const price = Math.floor((Number(m0.sell) || 0) * (m0.q ? _kQualMult(m0.q) : 1))
    if (price <= 0) return cht.reply('❌ Item ini tidak bisa dijual.')
    const gain = price * qty

    if (d.sellValue + gain > _K_DAILY_SELL_CAP) {
      const left = Math.max(0, _K_DAILY_SELL_CAP - d.sellValue)
      return cht.reply(`❌ Daily cap sell NPC.\nSisa: ${_kFmt(left)}\nCek: ${p}kitchenskill`)
    }

    _kAddItem(self, rawId, -qty)
    d.sellValue += gain
    self.ekonomi.uang = (Number(self.ekonomi?.uang) || 0) + gain
    _kClamp(self)

    return cht.reply(
  '```' + '\n' +
  '╭─「 SELL TO NPC 」─╮\n' +
  `│ Item   : ${rawId} (${m0.name}${m0.q ? ` • ${m0.q}/${m0.qname}` : ''})\n` +
  `│ Qty    : ${_kFmt(qty)}\n` +
  `│ Harga  : ${_kFmt(price)}\n` +
  `│ Total  : ${_kFmt(gain)}\n` +
  '├───────────────────┤\n' +
  `│ Uang   : ${_kFmt(self.ekonomi?.uang || 0)}\n` +
  `│ Daily  : ${_kFmt(d.sellValue)} / ${_kFmt(_K_DAILY_SELL_CAP)}\n` +
  '╰───────────────────╯\n' +
  '```'
)
  }
)

ev.on(
  { 
    cmd: ['sellp'], 
    listmenu: ['sellp @user <id[#Q]|id> <qty> <hargaTotal>'], 
    tag: 'rpg', 
    isGroup: true, 
    args: true, 
    isArgs: 'Format: .sellp @user <id[#Q]|id> <qty> <hargaTotal>\nContoh: .sellp @628xxx roti#R 5 50000' 
  },
  async ({ cht, args }) => {
    const p = cht.prefix || '.'
    const sellerKey = _kJidToKey(cht.sender)
    const seller = _kGetPlayer(sellerKey)
    if (!seller) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${p}daftar`)
    _kClamp(seller)

    const buyerKey = _kPickTargetKey(cht)
    if (!buyerKey) return cht.reply(`❌ Target tidak ditemukan.\nTag atau reply target.\nContoh: ${p}sellp @user roti#R 5 50000`)
    if (buyerKey === sellerKey) return cht.reply('❌ Tidak bisa jual ke diri sendiri.')

    const buyer = _kGetPlayer(buyerKey)
    if (!buyer) return cht.reply(`❌ Target belum terdaftar di RPG.\nSuruh daftar: ${p}daftar`)
    _kClamp(buyer)

    const parts = _kParts(args).filter(x => !String(x).startsWith('@'))
    const raw0 = String(parts[0] || '').toLowerCase()
    const qty = Math.floor(Number(parts[1]) || 0)
    const price = Math.floor(Number(parts[2]) || 0)
    if (!raw0 || qty <= 0 || price <= 0) return cht.reply(_kGuide(p))

    const { base, q } = _kSplitQual(raw0)
    const metaBase = _kMeta(base)
    if (!metaBase) return cht.reply(`❌ Item tidak dikenal.\nCek: ${p}invk`)

    let itemId = raw0
    if (_K_RECIPES[base] && !q) {
      const pick = _kResolveSingleQualOrFail(seller, base, qty)
      if (!pick.ok) return cht.reply(`❌ ${pick.err}`)
      itemId = pick.id
    }

    const meta = _kMeta(itemId)
    if (!meta) return cht.reply(`❌ Item tidak dikenal.\nCek: ${p}invk`)
    if (!_kHasItem(seller, itemId, qty)) return cht.reply(`❌ Item kurang.\nPunya: ${_kFmt(_kQty(seller, itemId))}`)

    const ds = _kDailyOf(seller)
    if (ds.tradeCount + 1 > _K_DAILY_TRADE_COUNT) return cht.reply(`❌ Daily trade count cap.\nCek: ${p}kitchenskill`)
    if (ds.tradeValue + price > _K_DAILY_TRADE_CAP) return cht.reply(`❌ Daily trade value cap.\nCek: ${p}kitchenskill`)

    const offerId = _kOfferNew(sellerKey, buyerKey, itemId, qty, price)
    const tax = Math.floor(price * _K_TAX)
    const net = price - tax

    return cht.reply(
      `🧾 OFFER TERBUAT\n` +
      `ID    : ${offerId}\n` +
      `Item  : ${itemId} — ${meta.name}${meta.q ? ` (${meta.q}/${meta.qname})` : ''}\n` +
      `Qty   : ${_kFmt(qty)}\n` +
      `Harga : ${_kFmt(price)}\n` +
      `Tax   : ${_kFmt(tax)} (15%)\n` +
      `Net   : ${_kFmt(net)}\n` +
      `TTL   : ${Math.floor(_K_OFFER_TTL / 1000)}s\n\n` +
      `Buyer : ${p}buyp ${offerId}\n` +
      `Seller: ${p}cancelp ${offerId}`
    )
  }
)

ev.on(
  { 
    cmd: ['buyp'], 
    listmenu: ['buyp <idOffer>'], 
    tag: 'rpg', 
    isGroup: true, 
    args: true, 
    isArgs: 'Format: .buyp <idOffer>\nContoh: .buyp KCH-101' 
  },
  async ({ cht, args }) => {
    const p = cht.prefix || '.'
    const buyerKey = _kJidToKey(cht.sender)
    const buyer = _kGetPlayer(buyerKey)
    if (!buyer) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${p}daftar`)
    _kClamp(buyer)

    const id = String(_kParts(args)[0] || '').trim()
    const off = _kOfferGet(id)
    if (!off) return cht.reply('❌ Offer tidak ditemukan / sudah selesai.')

    if (Date.now() > (off.expiresAt || 0)) {
      _kOfferDel(id)
      return cht.reply('❌ Offer expired.')
    }

    if (off.buyerKey !== buyerKey) return cht.reply('❌ Offer ini bukan untuk kamu.')

    const sellerKey = off.sellerKey
    const seller = _kGetPlayer(sellerKey)
    if (!seller) {
      _kOfferDel(id)
      return cht.reply('❌ Seller tidak valid / belum terdaftar.')
    }
    _kClamp(seller)

    const itemId = String(off.itemId || '')
    const qty = Math.floor(Number(off.qty) || 0)
    const price = Math.floor(Number(off.price) || 0)
    if (!itemId || qty <= 0 || price <= 0) {
      _kOfferDel(id)
      return cht.reply('❌ Offer rusak.')
    }

    if ((buyer.ekonomi?.uang || 0) < price) return cht.reply(`❌ Uang kamu kurang.\nButuh: ${_kFmt(price)}\nUang : ${_kFmt(buyer.ekonomi?.uang || 0)}`)
    if (!_kHasItem(seller, itemId, qty)) {
      _kOfferDel(id)
      return cht.reply('❌ Seller sudah tidak punya item yang ditawarkan.')
    }

    const db = _kDailyOf(buyer)
    const ds = _kDailyOf(seller)
    if (ds.tradeCount + 1 > _K_DAILY_TRADE_COUNT) return cht.reply('❌ Seller kena cap trade harian.')
    if (ds.tradeValue + price > _K_DAILY_TRADE_CAP) return cht.reply('❌ Seller kena cap value trade harian.')
    if (db.tradeCount + 1 > _K_DAILY_TRADE_COUNT) return cht.reply('❌ Kamu kena cap trade harian.')
    if (db.tradeValue + price > _K_DAILY_TRADE_CAP) return cht.reply('❌ Kamu kena cap value trade harian.')

    const tax = Math.floor(price * _K_TAX)
    const net = price - tax

    buyer.ekonomi.uang -= price
    seller.ekonomi.uang += net
    _kData().rpgKitchenTaxVault = Math.max(0, Math.floor(Number(_kData().rpgKitchenTaxVault) || 0) + tax)

    _kAddItem(seller, itemId, -qty)
    _kAddItem(buyer, itemId, qty)

    db.tradeCount += 1
    db.tradeValue += price
    ds.tradeCount += 1
    ds.tradeValue += price

    _kClamp(seller)
    _kClamp(buyer)
    _kOfferDel(id)

    const meta = _kMeta(itemId)
    return cht.reply(
      `✅ TRADE SELESAI\n` +
      `Offer: ${id}\n` +
      `Item : ${itemId} — ${meta?.name || itemId}${meta?.q ? ` (${meta.q}/${meta.qname})` : ''}\n` +
      `Qty  : ${_kFmt(qty)}\n` +
      `Price: ${_kFmt(price)}\n` +
      `Tax  : ${_kFmt(tax)}\n` +
      `Net  : ${_kFmt(net)}\n\n` +
      `Buyer uang : ${_kFmt(buyer.ekonomi?.uang || 0)}\n` +
      `Seller uang: ${_kFmt(seller.ekonomi?.uang || 0)}`
    )
  }
)

ev.on(
  { 
    cmd: ['offerp'], 
    listmenu: ['offerp'], 
    tag: 'rpg', 
    isGroup: true 
  },
  async ({ cht }) => {
    const key = _kJidToKey(cht.sender)
    const T = _kEnsureTrade()
    const now = Date.now()

    const active = Object.values(T.offers || {}).filter(o =>
      o && now <= (o.expiresAt || 0) && (o.buyerKey === key || o.sellerKey === key)
    )

    if (!active.length) return cht.reply('📭 Tidak ada offer aktif.')

    const lines = active
      .sort((a, b) => (a.expiresAt || 0) - (b.expiresAt || 0))
      .map(o => {
        const meta = _kMeta(o.itemId)
        const left = Math.max(0, (o.expiresAt || 0) - now)
        const sisa = typeof msToTime === 'function' ? msToTime(left) : `${Math.ceil(left / 1000)}s`
        const tax = Math.floor((Number(o.price) || 0) * _K_TAX)
        const net = (Number(o.price) || 0) - tax
        return `• ${o.id}\n  Item: ${o.itemId} — ${meta?.name || o.itemId}${meta?.q ? ` (${meta.q})` : ''}\n  Qty : ${_kFmt(o.qty)} | Price: ${_kFmt(o.price)} | Net: ${_kFmt(net)} | sisa ${sisa}`
      })
      .join('\n\n')

    return cht.reply(`📨 OFFER AKTIF\n\n${lines}`)
  }
)

ev.on(
  { 
    cmd: ['cancelp'], 
    listmenu: ['cancelp <idOffer>'], 
    tag: 'rpg', 
    isGroup: true, 
    args: true, 
    isArgs: 'Format: .cancelp <idOffer>\nContoh: .cancelp KCH-101' 
  },
  async ({ cht, args }) => {
    const sellerKey = _kJidToKey(cht.sender)
    const id = String(_kParts(args)[0] || '').trim()
    const off = _kOfferGet(id)
    if (!off) return cht.reply('❌ Offer tidak ditemukan.')
    if (off.sellerKey !== sellerKey) return cht.reply('❌ Kamu bukan seller offer ini.')
    _kOfferDel(id)
    return cht.reply(`✅ Offer dibatalkan: ${id}`)
  }
)

if (!global.__FARM_RPG_V3__) {
  global.__FARM_RPG_V3__ = true

  const Data = (global.Data ??= {})
  Data.rpg ??= {}
  Data.farmWorld ??= { date: '', season: {}, weather: '', market: {}, orders: [] }

  const _fmt = (n) => (Number(n) || 0).toLocaleString('id-ID')
  const _jidKey = (jid) => String(jid || '').split('@')[0]
  const _dayStr = () => {
    try {
      return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })
    } catch {
      return new Date().toISOString().slice(0, 10)
    }
  }
  const _code = (s) => '```' + '\n' + String(s || '') + '\n' + '```'
  const _msToTime = (ms) => {
    let s = Math.max(0, Math.floor((Number(ms) || 0) / 1000))
    const d = Math.floor(s / 86400); s %= 86400
    const h = Math.floor(s / 3600); s %= 3600
    const m = Math.floor(s / 60); s %= 60
    const p2 = (x) => String(x).padStart(2, '0')
    const out = []
    if (d > 0) out.push(`${d}h`)
    out.push(`${p2(h)}j`, `${p2(m)}m`, `${p2(s)}d`)
    return out.join(' ')
  }
  const _hash = (s) => {
    const str = String(s || '')
    let h = 2166136261
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i)
      h = Math.imul(h, 16777619)
    }
    return (h >>> 0)
  }
  const _rand01 = (seed) => {
    let x = (Number(seed) >>> 0) || 1
    x ^= x << 13; x >>>= 0
    x ^= x >> 17; x >>>= 0
    x ^= x << 5; x >>>= 0
    return (x >>> 0) / 4294967296
  }
  const _parseDay = (d) => {
    const m = String(d || '').match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (!m) return { y: 1970, mo: 1, da: 1 }
    return { y: Number(m[1]), mo: Number(m[2]), da: Number(m[3]) }
  }
  const _dayNum = (d) => {
    const { y, mo, da } = _parseDay(d)
    return Math.floor(Date.UTC(y, mo - 1, da) / 86400000)
  }
  const _numToDay = (n) => {
    const dt = new Date(Number(n) * 86400000)
    const y = dt.getUTCFullYear()
    const mo = String(dt.getUTCMonth() + 1).padStart(2, '0')
    const da = String(dt.getUTCDate()).padStart(2, '0')
    return `${y}-${mo}-${da}`
  }

  const _FQ = {
    C: { name: 'Common', mult: 1.00, w: 720 },
    U: { name: 'Uncommon', mult: 1.12, w: 210 },
    R: { name: 'Rare', mult: 1.30, w: 60 },
    E: { name: 'Epic', mult: 1.55, w: 9 },
    L: { name: 'Legendary', mult: 1.95, w: 1 }
  }
  const _FQ_SHOW = ['C', 'U', 'R', 'E', 'L']
  const _FQ_SELL = ['L', 'E', 'R', 'U', 'C']
  const _qualKey = (base, q) => `${base}#${q}`
  const _splitQual = (id) => {
    const s = String(id || '')
    const ix = s.lastIndexOf('#')
    if (ix <= 0) return { base: s, q: '' }
    const base = s.slice(0, ix)
    const q = s.slice(ix + 1).toUpperCase()
    if (!_FQ[q]) return { base: s, q: '' }
    return { base, q }
  }
  const _seedId = (base) => `seed_${String(base || '').toLowerCase()}`
  const _isSeed = (id) => String(id || '').startsWith('seed_')
  const _seedBase = (id) => String(id || '').replace(/^seed_/, '')

  const _CROPS = {
    padi: { name: 'Padi', level: 1, seedBuy: 2500, grow: 2 * 60 * 60 * 1000, yield: 8, sell: 900, exp: 14, tags: ['grain'] },
    jagung: { name: 'Jagung', level: 1, seedBuy: 3200, grow: 2.5 * 60 * 60 * 1000, yield: 7, sell: 1100, exp: 16, tags: ['grain'] },
    kentang: { name: 'Kentang', level: 1, seedBuy: 3000, grow: 2.2 * 60 * 60 * 1000, yield: 7, sell: 1050, exp: 15, tags: ['root'] },
    tomat: { name: 'Tomat', level: 2, seedBuy: 4200, grow: 3.0 * 60 * 60 * 1000, yield: 6, sell: 1600, exp: 20, tags: ['fruit'] },
    cabai: { name: 'Cabai', level: 2, seedBuy: 4800, grow: 3.2 * 60 * 60 * 1000, yield: 6, sell: 1850, exp: 22, tags: ['spice'] },
    wortel: { name: 'Wortel', level: 2, seedBuy: 4500, grow: 3.1 * 60 * 60 * 1000, yield: 6, sell: 1700, exp: 21, tags: ['root'] },
    bawang: { name: 'Bawang', level: 3, seedBuy: 5600, grow: 3.6 * 60 * 60 * 1000, yield: 5, sell: 2400, exp: 26, tags: ['spice'] },
    ketimun: { name: 'Ketimun', level: 3, seedBuy: 5200, grow: 3.5 * 60 * 60 * 1000, yield: 6, sell: 2100, exp: 25, tags: ['fruit'] },
    semangka: { name: 'Semangka', level: 4, seedBuy: 9800, grow: 5.0 * 60 * 60 * 1000, yield: 4, sell: 5200, exp: 40, tags: ['fruit'] },
    melon: { name: 'Melon', level: 4, seedBuy: 9200, grow: 4.8 * 60 * 60 * 1000, yield: 4, sell: 4800, exp: 38, tags: ['fruit'] },
    stroberi: { name: 'Stroberi', level: 5, seedBuy: 12500, grow: 5.3 * 60 * 60 * 1000, yield: 4, sell: 6500, exp: 52, tags: ['fruit'] },
    teh: { name: 'Teh', level: 5, seedBuy: 14000, grow: 6.0 * 60 * 60 * 1000, yield: 3, sell: 8200, exp: 66, tags: ['leaf'] },
    anggur: { name: 'Anggur', level: 6, seedBuy: 15500, grow: 6.2 * 60 * 60 * 1000, yield: 3, sell: 8600, exp: 70, tags: ['fruit'] },
    kopi: { name: 'Kopi', level: 6, seedBuy: 16000, grow: 6.6 * 60 * 60 * 1000, yield: 3, sell: 9000, exp: 75, tags: ['bean'] },
    kakao: { name: 'Kakao', level: 6, seedBuy: 17000, grow: 7.0 * 60 * 60 * 1000, yield: 3, sell: 9800, exp: 82, tags: ['bean'] }
  }

  const _MAT = {
    botol: { name: 'Botol', buy: 1500, tags: ['pack'] },
    kemasan: { name: 'Kemasan', buy: 1800, tags: ['pack'] },
    gula: { name: 'Gula', buy: 2200, tags: ['add'] },
    garam: { name: 'Garam', buy: 1200, tags: ['add'] }
  }

  const _FERT = {
    kompos: { name: 'Pupuk Kompos', buy: 5000, yield: 0.08, time: 0.03, q: 0.04, max: 2, cd: 30 * 60 * 1000 },
    npk: { name: 'Pupuk NPK', buy: 12000, yield: 0.15, time: 0.06, q: 0.08, max: 2, cd: 35 * 60 * 1000 },
    super: { name: 'Pupuk Super', buy: 28000, yield: 0.28, time: 0.10, q: 0.15, max: 2, cd: 45 * 60 * 1000 },
    pestisida: { name: 'Pestisida', buy: 9000 }
  }

  const _TOOLS = {
    cangkul: { name: 'Cangkul', type: 'hoe', buy: 25000, max: 120, y: 0.00, q: 0.00, s: 0.00 },
    cangkul_pro: { name: 'Cangkul Pro', type: 'hoe', buy: 75000, max: 360, y: 0.06, q: 0.05, s: 0.04 },
    siram: { name: 'Penyiram', type: 'water', buy: 20000, max: 140, y: 0.00, q: 0.00, s: 0.00 },
    siram_pro: { name: 'Penyiram Pro', type: 'water', buy: 65000, max: 420, y: 0.04, q: 0.03, s: 0.03 },
    sabit: { name: 'Sabit', type: 'harvest', buy: 28000, max: 120, y: 0.00, q: 0.00, s: 0.00 },
    sabit_pro: { name: 'Sabit Pro', type: 'harvest', buy: 88000, max: 380, y: 0.08, q: 0.05, s: 0.00 },
    sprayer: { name: 'Sprayer', type: 'spray', buy: 22000, max: 110, y: 0.00, q: 0.00, s: 0.00 },
    sprayer_pro: { name: 'Sprayer Pro', type: 'spray', buy: 70000, max: 360, y: 0.00, q: 0.04, s: 0.00 }
  }

  const _SEASONS = [
    { id: 'kemarau', name: 'Musim Kemarau', grow: 0.94, yield: 1.06, pests: 0.92, market: 1.03, tag: { spice: 1.15, fruit: 1.08, grain: 0.96, leaf: 0.92, root: 1.00, bean: 1.05 } },
    { id: 'hujan', name: 'Musim Hujan', grow: 1.06, yield: 1.05, pests: 1.18, market: 0.98, tag: { grain: 1.12, leaf: 1.10, root: 1.03, fruit: 0.95, spice: 0.92, bean: 0.98 } },
    { id: 'panen', name: 'Musim Panen', grow: 0.98, yield: 1.10, pests: 1.00, market: 1.07, tag: { grain: 1.10, fruit: 1.07, root: 1.06, spice: 1.03, leaf: 1.03, bean: 1.04 } },
    { id: 'peralihan', name: 'Musim Peralihan', grow: 1.00, yield: 1.00, pests: 1.05, market: 1.00, tag: { grain: 1.00, fruit: 1.00, root: 1.00, spice: 1.00, leaf: 1.00, bean: 1.00 } }
  ]

  const _FAC = {
    mill: { name: 'Gilingan', maxTier: 3, baseCost: 90000 },
    roaster: { name: 'Roaster', maxTier: 3, baseCost: 120000 },
    dryer: { name: 'Pengering', maxTier: 3, baseCost: 110000 },
    press: { name: 'Press', maxTier: 3, baseCost: 130000 },
    packer: { name: 'Packer', maxTier: 3, baseCost: 140000 }
  }

  const _PRODUCTS = {
    beras: { name: 'Beras', sell: 2200, tags: ['grain', 'proc'] },
    tepung_jagung: { name: 'Tepung Jagung', sell: 3800, tags: ['grain', 'proc'] },
    keripik_kentang: { name: 'Keripik Kentang', sell: 7200, tags: ['root', 'proc'] },
    saus_pedas: { name: 'Saus Pedas', sell: 8400, tags: ['spice', 'proc'] },
    kopi_bubuk: { name: 'Kopi Bubuk', sell: 9800, tags: ['bean', 'proc'] },
    teh_kering: { name: 'Teh Kering', sell: 9000, tags: ['leaf', 'proc'] },
    coklat_bubuk: { name: 'Coklat Bubuk', sell: 11200, tags: ['bean', 'proc'] },
    selai_stroberi: { name: 'Selai Stroberi', sell: 10500, tags: ['fruit', 'proc'] },
    minuman_semangka: { name: 'Minuman Semangka', sell: 9800, tags: ['fruit', 'proc'] },
    nasi_instans: { name: 'Nasi Instans', sell: 6800, tags: ['grain', 'proc'] },
    kopi_sachet: { name: 'Kopi Sachet', sell: 12200, tags: ['bean', 'proc', 'pack'] }
  }

  const _PROC = {
    beras: { name: 'Beras', level: 1, fac: 'mill', time: 14 * 60 * 1000, exp: 18, out: 3, need: { padi: 6 } },
    nasi_instans: { name: 'Nasi Instans', level: 2, fac: 'dryer', time: 18 * 60 * 1000, exp: 26, out: 2, need: { beras: 4, kemasan: 2 } },
    tepung_jagung: { name: 'Tepung Jagung', level: 1, fac: 'mill', time: 15 * 60 * 1000, exp: 19, out: 2, need: { jagung: 6 } },
    keripik_kentang: { name: 'Keripik Kentang', level: 2, fac: 'dryer', time: 20 * 60 * 1000, exp: 28, out: 2, need: { kentang: 6, garam: 2, kemasan: 2 } },
    saus_pedas: { name: 'Saus Pedas', level: 3, fac: 'press', time: 22 * 60 * 1000, exp: 34, out: 2, need: { tomat: 4, cabai: 4, botol: 2, gula: 1 } },
    kopi_bubuk: { name: 'Kopi Bubuk', level: 4, fac: 'roaster', time: 24 * 60 * 1000, exp: 38, out: 2, need: { kopi: 4, kemasan: 2 } },
    kopi_sachet: { name: 'Kopi Sachet', level: 5, fac: 'packer', time: 20 * 60 * 1000, exp: 44, out: 3, need: { kopi_bubuk: 3, gula: 2, kemasan: 3 } },
    teh_kering: { name: 'Teh Kering', level: 4, fac: 'dryer', time: 22 * 60 * 1000, exp: 36, out: 2, need: { teh: 4, kemasan: 2 } },
    coklat_bubuk: { name: 'Coklat Bubuk', level: 5, fac: 'roaster', time: 26 * 60 * 1000, exp: 46, out: 2, need: { kakao: 4, gula: 2, kemasan: 2 } },
    selai_stroberi: { name: 'Selai Stroberi', level: 4, fac: 'press', time: 23 * 60 * 1000, exp: 40, out: 2, need: { stroberi: 5, gula: 2, botol: 2 } },
    minuman_semangka: { name: 'Minuman Semangka', level: 3, fac: 'press', time: 16 * 60 * 1000, exp: 30, out: 2, need: { semangka: 2, botol: 2, gula: 1 } }
  }

  const _dailySellCap = 6_500_000

  const _tagMult = (tags, season) => {
    const t = Array.isArray(tags) ? tags : []
    let m = 1.0
    for (const x of t) {
      const v = Number(season?.tag?.[x]) || 1
      m *= v
    }
    return m
  }

  const _getWorld = () => {
    const d = _dayStr()
    const dn = _dayNum(d)
    const seasonIdx = Math.floor(dn / 7) % _SEASONS.length
    const season = _SEASONS[(seasonIdx + _SEASONS.length) % _SEASONS.length]
    const inSeason = (dn % 7) + 1
    const start = dn - (inSeason - 1)
    const end = start + 6
    const seasonInfo = {
      id: season.id,
      name: season.name,
      day: inSeason,
      start: _numToDay(start),
      end: _numToDay(end),
      grow: season.grow,
      yield: season.yield,
      pests: season.pests,
      market: season.market,
      tag: season.tag
    }

    if (Data.farmWorld.date === d && Data.farmWorld.season?.id === seasonInfo.id && Data.farmWorld.weather && Data.farmWorld.market && Array.isArray(Data.farmWorld.orders)) {
      return Data.farmWorld
    }

    Data.farmWorld.date = d
    Data.farmWorld.season = seasonInfo

    const r0 = _rand01(_hash(`WTH|${d}|${seasonInfo.id}`))
    const pick = (pC, pM, pH) => {
      const x = r0
      if (x < pC) return 'Cerah'
      if (x < pC + pM) return 'Mendung'
      if (x < pC + pM + pH) return 'Hujan'
      return 'Badai'
    }
    let weather = 'Mendung'
    if (seasonInfo.id === 'kemarau') weather = pick(0.65, 0.25, 0.08)
    else if (seasonInfo.id === 'hujan') weather = pick(0.15, 0.20, 0.60)
    else if (seasonInfo.id === 'panen') weather = pick(0.55, 0.30, 0.12)
    else weather = pick(0.45, 0.30, 0.20)

    Data.farmWorld.weather = weather

    const weatherMarket =
      weather === 'Cerah' ? 1.03 :
      weather === 'Mendung' ? 1.00 :
      weather === 'Hujan' ? 0.98 :
      0.95

    const market = {}
    for (const id of Object.keys(_CROPS)) {
      const base = _CROPS[id]
      const r = _rand01(_hash(`${d}|MK|${id}`))
      const swing = 0.86 + r * 0.34
      const tm = _tagMult(base.tags, seasonInfo)
      const m = Math.max(0.78, Math.min(1.28, swing * weatherMarket * seasonInfo.market * tm))
      market[id] = m
    }
    for (const id of Object.keys(_PRODUCTS)) {
      const base = _PRODUCTS[id]
      const r = _rand01(_hash(`${d}|MKP|${id}`))
      const swing = 0.90 + r * 0.26
      const tm = _tagMult(base.tags, seasonInfo)
      const m = Math.max(0.82, Math.min(1.22, swing * weatherMarket * seasonInfo.market * tm))
      market[id] = m
    }
    Data.farmWorld.market = market

    const pool = []
    for (const k of Object.keys(_CROPS)) pool.push({ id: k, cat: 'crop' })
    for (const k of Object.keys(_PRODUCTS)) pool.push({ id: k, cat: 'prod' })

    const orders = []
    for (let i = 0; i < 3; i++) {
      const pr = pool[Math.floor(_rand01(_hash(`${d}|ORDP|${i}`)) * pool.length)] || pool[0]
      const baseId = pr.id
      const isProd = pr.cat === 'prod'
      const meta = isProd ? _PRODUCTS[baseId] : _CROPS[baseId]
      const qty = isProd
        ? (12 + Math.floor(_rand01(_hash(`${d}|Q|${i}`)) * 18))
        : (40 + Math.floor(_rand01(_hash(`${d}|Q|${i}`)) * 70))

      const unitBase = Math.floor((Number(meta.sell) || 0) * (Number(market[baseId]) || 1))
      const payPer = Math.floor(unitBase * (1.22 + _rand01(_hash(`${d}|PM|${i}`)) * 0.55))
      const bonusExp = 50 + Math.floor(_rand01(_hash(`${d}|EX|${i}`)) * 120)

      orders.push({
        id: `F-ORD-${_hash(`${d}|OID|${i}`).toString(16).slice(0, 5).toUpperCase()}`,
        item: baseId,
        qty,
        payPer,
        bonusExp
      })
    }
    Data.farmWorld.orders = orders

    return Data.farmWorld
  }

  const _metaName = (id) => (_CROPS[id]?.name || _PRODUCTS[id]?.name || _MAT[id]?.name || _FERT[id]?.name || id)
  const _priceNow = (id) => {
    const W = _getWorld()
    const m = Number(W.market?.[id]) || 1
    const meta = _CROPS[id] || _PRODUCTS[id]
    if (!meta) return 0
    return Math.max(1, Math.floor((Number(meta.sell) || 0) * m))
  }

  const _ensurePlayer = (jid) => {
    const key = _jidKey(jid)
    const p = Data.rpg?.[key]
    if (!p) return null

    p.ekonomi ??= { uang: 0, bank: 0 }
    p.ekonomi.uang = Math.max(0, Math.floor(Number(p.ekonomi.uang) || 0))
    p.ekonomi.bank = Math.max(0, Math.floor(Number(p.ekonomi.bank) || 0))

    p.farm ??= {}
    const f = p.farm

    f.skill ??= { level: 1, exp: 0, max_exp: 220 }
    f.skill.level = Math.max(1, Math.floor(Number(f.skill.level) || 1))
    f.skill.exp = Math.max(0, Math.floor(Number(f.skill.exp) || 0))
    f.skill.max_exp = Math.max(120, Math.floor(Number(f.skill.max_exp) || 220))

    f.daily ??= { date: '', sellValue: 0, orderDone: {} }
    if (typeof f.daily.orderDone !== 'object' || f.daily.orderDone == null || Array.isArray(f.daily.orderDone)) f.daily.orderDone = {}

    f.storage ??= { level: 1, cap: 260 }
    f.storage.level = Math.max(1, Math.floor(Number(f.storage.level) || 1))
    f.storage.cap = Math.max(120, Math.floor(Number(f.storage.cap) || 260))

    f.inv ??= {}
    if (typeof f.inv !== 'object' || f.inv == null || Array.isArray(f.inv)) f.inv = {}

    f.tools ??= {}
    if (typeof f.tools !== 'object' || f.tools == null || Array.isArray(f.tools)) f.tools = {}

    f.fac ??= {}
    if (typeof f.fac !== 'object' || f.fac == null || Array.isArray(f.fac)) f.fac = {}

    f.jobs ??= []
    if (!Array.isArray(f.jobs)) f.jobs = []

    f.land ??= { slots: 2, plots: [] }
    f.land.slots = Math.max(1, Math.floor(Number(f.land.slots) || 2))
    if (!Array.isArray(f.land.plots)) f.land.plots = []
    while (f.land.plots.length < f.land.slots) f.land.plots.push(null)
    while (f.land.plots.length > f.land.slots) f.land.plots.length = f.land.slots

    const d = _dayStr()
    if (f.daily.date !== d) {
      f.daily.date = d
      f.daily.sellValue = 0
      f.daily.orderDone = {}
    }

    return p
  }

  const _invQty = (p, id) => Math.max(0, Math.floor(Number(p.farm.inv?.[id]) || 0))
  const _invAdd = (p, id, qty) => {
    const inv = (p.farm.inv ??= {})
    const a = Math.floor(Number(inv[id]) || 0)
    const b = a + Math.floor(Number(qty) || 0)
    if (b <= 0) delete inv[id]
    else inv[id] = b
    return b
  }
  const _invCount = (p) => {
    const inv = p.farm.inv || {}
    let t = 0
    for (const k of Object.keys(inv)) t += Math.max(0, Math.floor(Number(inv[k]) || 0))
    return t
  }

  const _toolOwned = (p, id) => p.farm.tools?.[id] && typeof p.farm.tools[id] === 'object'
  const _toolBest = (p, type) => {
    const ids = Object.keys(p.farm.tools || {})
      .filter(id => (_TOOLS[id]?.type === type) && ((p.farm.tools[id]?.dur || 0) > 0))
      .sort((a, b) => (_TOOLS[b].buy - _TOOLS[a].buy))
    return ids[0] || ''
  }
  const _toolBonus = (p, type) => {
    const id = _toolBest(p, type)
    const m = _TOOLS[id]
    if (!m) return { y: 0, q: 0, s: 0, id: '', name: '-' }
    return { y: Number(m.y) || 0, q: Number(m.q) || 0, s: Number(m.s) || 0, id, name: m.name }
  }
  const _toolUse = (p, type, n = 1) => {
    const id = _toolBest(p, type)
    if (!id) return { ok: false }
    const t = p.farm.tools[id]
    t.dur = Math.max(0, Math.floor(Number(t.dur) || 0) - Math.max(1, Math.floor(Number(n) || 1)))
    if (t.dur <= 0) t.dur = 0
    return { ok: true, id, dur: t.dur, max: t.max }
  }

  const _facState = (p, id) => {
    p.farm.fac ??= {}
    p.farm.fac[id] ??= { tier: 0, dur: 0, max: 0 }
    const f = p.farm.fac[id]
    f.tier = Math.max(0, Math.floor(Number(f.tier) || 0))
    f.max = Math.max(0, Math.floor(Number(f.max) || 0))
    f.dur = Math.max(0, Math.floor(Number(f.dur) || 0))
    return f
  }
  const _facMax = (tier) => (tier <= 0 ? 0 : 260 + (tier - 1) * 220)
  const _facSpeed = (tier) => (tier <= 0 ? 1.0 : Math.max(0.55, 1.0 - tier * 0.15))
  const _facYield = (tier) => (tier <= 0 ? 0.00 : Math.min(0.24, tier * 0.08))
  const _facQual = (tier) => (tier <= 0 ? 0.00 : Math.min(0.18, tier * 0.06))

  const _skillGain = (p, addExp) => {
    const sk = p.farm.skill
    sk.exp += Math.max(0, Math.floor(Number(addExp) || 0))
    while (sk.exp >= sk.max_exp) {
      sk.exp -= sk.max_exp
      sk.level += 1
      sk.max_exp = 220 + (sk.level - 1) * 90
    }
    return sk
  }

  const _qualRoll = (p, extraQ = 0) => {
    const sk = p.farm.skill
    const lv = Math.max(1, Math.floor(Number(sk.level) || 1))
    const boost = 1 + Math.min(1.1, (lv - 1) * 0.025 + (Number(extraQ) || 0))
    const wC = _FQ.C.w
    const wU = Math.floor(_FQ.U.w * boost)
    const wR = Math.floor(_FQ.R.w * boost)
    const wE = Math.floor(_FQ.E.w * boost)
    const wL = Math.floor(_FQ.L.w * boost)
    const total = wC + wU + wR + wE + wL
    let r = Math.floor(Math.random() * total)
    if ((r -= wL) < 0) return 'L'
    if ((r -= wE) < 0) return 'E'
    if ((r -= wR) < 0) return 'R'
    if ((r -= wU) < 0) return 'U'
    return 'C'
  }

  const _consumeAny = (p, base, qty) => {
    const need = Math.max(1, Math.floor(Number(qty) || 0))
    let left = need
    const take = []
    for (const q of _FQ_SELL) {
      const k = _qualKey(base, q)
      const have = _invQty(p, k)
      if (have <= 0) continue
      const use = Math.min(have, left)
      if (use > 0) {
        take.push({ id: k, q, qty: use })
        _invAdd(p, k, -use)
        left -= use
        if (left <= 0) break
      }
    }
    if (left > 0) {
      for (const t of take) _invAdd(p, t.id, t.qty)
      return { ok: false, take: [] }
    }
    return { ok: true, take }
  }

  const _jobsClean = (p) => {
    const now = Date.now()
    p.farm.jobs = (p.farm.jobs || []).filter(j => j && (Number(j.endAt) || 0) > 0 && (Number(j.startAt) || 0) > 0 && (Number(j.batch) || 0) > 0 && !j.done && (j.endAt - now > -7 * 24 * 60 * 60 * 1000))
  }
  const _jobMax = (p) => {
    const sk = p.farm.skill.level
    const base = 2 + Math.floor(sk / 4)
    let facBonus = 0
    for (const k of Object.keys(_FAC)) {
      const st = _facState(p, k)
      facBonus += st.tier >= 2 ? 1 : 0
    }
    return Math.min(10, base + Math.floor(facBonus / 3))
  }
  const _jobsReadyCount = (p) => {
    const now = Date.now()
    let n = 0
    for (const j of (p.farm.jobs || [])) if ((Number(j.endAt) || 0) <= now) n++
    return n
  }

  const _plotLine = (plot, i) => {
    if (!plot) return `│ #${String(i).padStart(2, '0')} : Kosong`
    const now = Date.now()
    const left = Math.floor((Number(plot.readyAt) || 0) - now)
    const name = _CROPS[plot.base]?.name || plot.base
    const st = left <= 0 ? 'SIAP PANEN' : `Siap ${_msToTime(left)}`
    const w = Math.max(0, Math.floor(Number(plot.water) || 0))
    const pests = plot.pests ? 'Ya' : 'Tidak'
    const fert = plot.fert || {}
    const ftxt = ['kompos', 'npk', 'super'].map(k => (fert[k] ? `${k}:${fert[k]}` : '')).filter(Boolean).join(' ')
    return `│ #${String(i).padStart(2, '0')} : ${name}\n│      ${st} | Air:${w}/3 | Pupuk:${ftxt || '-'} | Hama:${pests}`
  }

  const _facCost = (id, nextTier) => {
    const base = Number(_FAC[id]?.baseCost) || 100000
    return Math.floor(base * Math.pow(1.42, Math.max(0, nextTier - 1)))}

  ev.on(
    { 
      cmd: ['farm', 'berkebun', 'kebun'], 
      listmenu: ['farm'], 
      tag: 'rpg', 
      isGroup: true 
    },
    async ({ cht }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)

      const W = _getWorld()
      const sk = self.farm.skill
      const used = _invCount(self)
      const cap = self.farm.storage.cap

      const out =
        '╭─「 FARMING 」─╮\n' +
        `│ Musim  : ${W.season.name} (Hari ${W.season.day}/7)\n` +
        `│ Rentang: ${W.season.start} s/d ${W.season.end}\n` +
        `│ Cuaca  : ${W.weather}\n` +
        '├────────────────────────┤\n' +
        `│ Uang   : ${_fmt(self.ekonomi.uang)}\n` +
        `│ Skill  : Lv ${sk.level} (${_fmt(sk.exp)}/${_fmt(sk.max_exp)})\n` +
        `│ Lahan  : ${self.farm.land.slots} petak\n` +
        `│ Gudang : ${used}/${cap}\n` +
        '├────────────────────────┤\n' +
        `│ Shop   : ${pfx}farmshop\n` +
        `│ Musim  : ${pfx}farmseason\n` +
        `│ Petak  : ${pfx}farmplot\n` +
        `│ Inv    : ${pfx}farminv\n` +
        `│ Skill  : ${pfx}farmskill\n` +
        `│ Order  : ${pfx}farmorder\n` +
        `│ Proses : ${pfx}processlist\n` +
        `│ Jobs   : ${pfx}farmjobs\n` +
        '╰────────────────────────╯\n'

      return cht.reply(_code(out))
    }
  )

  ev.on(
    { 
      cmd: ['farmseason', 'musim'], 
      listmenu: ['farmseason'], 
      tag: 'rpg', 
      isGroup: true 
    },
    async ({ cht }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)

      const W = _getWorld()
      const s = W.season

      const score = (id) => {
        const m = _CROPS[id]
        const tm = _tagMult(m.tags, s)
        const mk = Number(W.market?.[id]) || 1
        return tm * mk
      }
      const top = Object.keys(_CROPS)
        .sort((a, b) => score(b) - score(a))
        .slice(0, 6)
        .map((id, i) => `│ ${String(i + 1).padStart(2, '0')}. ${id} — ${_CROPS[id].name}`)

      const out =
        '╭─「 MUSIM & MARKET 」─╮\n' +
        `│ Musim  : ${s.name}\n` +
        `│ Hari   : ${s.day}/7\n` +
        `│ Rentang: ${s.start} s/d ${s.end}\n` +
        `│ Cuaca  : ${W.weather}\n` +
        '├────────────────────────┤\n' +
        `│ Mod Grow : x${(Number(s.grow) || 1).toFixed(2)}\n` +
        `│ Mod Yield: x${(Number(s.yield) || 1).toFixed(2)}\n` +
        `│ Mod Hama : x${(Number(s.pests) || 1).toFixed(2)}\n` +
        `│ Mod Harga: x${(Number(s.market) || 1).toFixed(2)}\n` +
        '├────────────────────────┤\n' +
        '│ Rekomendasi tanam:\n' +
        top.join('\n') + '\n' +
        '├────────────────────────┤\n' +
        `│ Cek shop: ${pfx}farmshop\n` +
        '╰────────────────────────╯\n'

      return cht.reply(_code(out))
    }
  )

  ev.on(
    { 
      cmd: ['farmskill'], 
      listmenu: ['farmskill'], 
      tag: 'rpg', 
      isGroup: true 
    },
    async ({ cht }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)

      const W = _getWorld()
      const sk = self.farm.skill
      const d = self.farm.daily
      const maxJobs = _jobMax(self)
      const readyJobs = _jobsReadyCount(self)

      const out =
        '╭─「 FARM SKILL 」─╮\n' +
        `│ Skill : Lv ${sk.level}\n` +
        `│ EXP   : ${_fmt(sk.exp)} / ${_fmt(sk.max_exp)}\n` +
        '├────────────────────────┤\n' +
        `│ Daily Sell : ${_fmt(d.sellValue)} / ${_fmt(_dailySellCap)}\n` +
        `│ Jobs Max   : ${maxJobs}\n` +
        `│ Jobs Ready : ${readyJobs}\n` +
        '├────────────────────────┤\n' +
        `│ Musim : ${W.season.name}\n` +
        `│ Cuaca : ${W.weather}\n` +
        '╰────────────────────────╯\n'

      return cht.reply(_code(out))
    }
  )

  ev.on(
    { 
      cmd: ['farmshop'], 
      listmenu: ['farmshop'], 
      tag: 'rpg', 
      isGroup: true 
    },
    async ({ cht }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)

      const W = _getWorld()
      const skLv = self.farm.skill.level

      const nextLand = (() => {
        const n = Math.max(0, self.farm.land.slots - 2)
        return Math.floor(50000 * Math.pow(1.18, n))
      })()
      const gudangCost = Math.floor(60000 * Math.pow(1.22, (self.farm.storage.level - 1)))

      const seedLines = Object.keys(_CROPS)
        .sort((a, b) => (_CROPS[a].level - _CROPS[b].level) || (_CROPS[a].seedBuy - _CROPS[b].seedBuy))
        .slice(0, 12)
        .map(id => {
          const c = _CROPS[id]
          const lock = skLv < c.level ? `LOCK Lv${c.level}` : 'OK'
          const pr = _priceNow(id)
          return `│ • ${id} (${lock}) | Bibit ${_fmt(c.seedBuy)} | Sell ~${_fmt(pr)}`
        })

      const matLines = Object.keys(_MAT).map(k => `│ • ${k} — ${_MAT[k].name} | Buy ${_fmt(_MAT[k].buy)}`)
      const fertLines = Object.keys(_FERT).map(k => `│ • ${k} — ${_FERT[k].name} | Buy ${_fmt(_FERT[k].buy)}`)

      const out =
        '╭─「 FARM SHOP 」─╮\n' +
        `│ Musim: ${W.season.name} | Cuaca: ${W.weather}\n` +
        '├────────────────────────┤\n' +
        `│ Lahan +1   : ${_fmt(nextLand)}  (${pfx}buyland 1)\n` +
        `│ Gudang Lv+1: ${_fmt(gudangCost)}  (${pfx}buygudang)\n` +
        '├────────────────────────┤\n' +
        `│ Bibit (${pfx}buyseed <id> <qty>)\n` +
        seedLines.join('\n') + '\n' +
        '├────────────────────────┤\n' +
        `│ Material (${pfx}buymat <id> <qty>)\n` +
        matLines.join('\n') + '\n' +
        '├────────────────────────┤\n' +
        `│ Pupuk/Item (${pfx}buyfert <id> <qty>)\n` +
        fertLines.join('\n') + '\n' +
        '├────────────────────────┤\n' +
        `│ Alat (${pfx}buytool <id>) | Repair: ${pfx}repairtool <id>\n` +
        `│ Cangkul  : cangkul / cangkul_pro\n` +
        `│ Siram   : siram / siram_pro\n` +
        `│ Sabit   : sabit / sabit_pro\n` +
        `│ Sprayer : sprayer / sprayer_pro\n` +
        '╰────────────────────────╯\n'

      return cht.reply(_code(out))
    }
  )

  ev.on(
    { 
      cmd: ['farmplot'], 
      listmenu: ['farmplot'], 
      tag: 'rpg', 
      isGroup: true 
    },
    async ({ cht }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)

      const W = _getWorld()
      const land = self.farm.land
      const lines = []
      lines.push('╭─「 FARM PLOTS 」─╮')
      lines.push(`│ Musim: ${W.season.name} | Cuaca: ${W.weather}`)
      lines.push('├────────────────────────┤')
      for (let i = 0; i < land.plots.length; i++) lines.push(_plotLine(land.plots[i], i + 1))
      lines.push('├────────────────────────┤')
      lines.push(`│ Tanam : ${pfx}plant <bibit> <qty|petak>`)
      lines.push(`│ Siram : ${pfx}water <petak|all>`)
      lines.push(`│ Pupuk : ${pfx}fert <petak|all> <kompos|npk|super>`)
      lines.push(`│ Spray : ${pfx}spray <petak|all>`)
      lines.push(`│ Panen : ${pfx}harvest <petak|all>`)
      lines.push('╰────────────────────────╯')
      return cht.reply(_code(lines.join('\n')))
    }
  )

  ev.on(
    { 
      cmd: ['farminv'], 
      listmenu: ['farminv'], 
      tag: 'rpg', 
      isGroup: true 
    },
    async ({ cht }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)

      const inv = self.farm.inv || {}
      const keys = Object.keys(inv).filter(k => (Number(inv[k]) || 0) > 0).sort()
      const used = _invCount(self)
      const cap = self.farm.storage.cap

      const seeds = []
      const mats = []
      const ferts = []
      const crops = []
      const prods = []
      const other = []

      for (const k of keys) {
        const q = Math.max(0, Math.floor(Number(inv[k]) || 0))
        if (q <= 0) continue
        if (_isSeed(k)) { seeds.push(`│ • ${_seedBase(k)} (${_metaName(_seedBase(k))}) x${_fmt(q)}`); continue }
        if (_MAT[k]) { mats.push(`│ • ${k} (${_MAT[k].name}) x${_fmt(q)}`); continue }
        if (_FERT[k]) { ferts.push(`│ • ${k} (${_FERT[k].name}) x${_fmt(q)}`); continue }
        const s = _splitQual(k)
        if (_CROPS[s.base]) { crops.push(`│ • ${k} (${_CROPS[s.base].name}) x${_fmt(q)}`); continue }
        if (_PRODUCTS[s.base]) { prods.push(`│ • ${k} (${_PRODUCTS[s.base].name}) x${_fmt(q)}`); continue }
        other.push(`│ • ${k} x${_fmt(q)}`)
      }

      const toolLines = Object.keys(self.farm.tools || {}).sort().map(id => {
        const t = self.farm.tools[id]
        const m = _TOOLS[id]
        const dur = Math.max(0, Math.floor(Number(t?.dur) || 0))
        const mx = Math.max(1, Math.floor(Number(t?.max) || (m?.max || 1)))
        return `│ • ${id} (${m?.name || id}) Dur ${_fmt(dur)}/${_fmt(mx)}`
      })

      const section = (title, arr, limit = 12) => {
        if (!arr.length) return `│ ${title} : -\n`
        const cut = arr.slice(0, limit)
        const more = arr.length > limit ? `│ (… +${arr.length - limit} item)\n` : ''
        return `│ ${title} :\n` + cut.join('\n') + '\n' + more
      }

      const out =
        '╭─「 FARM INVENTORY 」─╮\n' +
        `│ Uang  : ${_fmt(self.ekonomi.uang)}\n` +
        `│ Gudang: ${used}/${cap}\n` +
        '├────────────────────────┤\n' +
        section('ALAT', toolLines, 10) +
        '├────────────────────────┤\n' +
        section('BIBIT', seeds, 12) +
        '├────────────────────────┤\n' +
        section('MATERIAL', mats, 12) +
        '├────────────────────────┤\n' +
        section('PUPUK/ITEM', ferts, 12) +
        '├────────────────────────┤\n' +
        section('HASIL PANEN', crops, 12) +
        '├────────────────────────┤\n' +
        section('HASIL OLAH', prods, 12) +
        (other.length ? ('├────────────────────────┤\n' + section('LAINNYA', other, 8)) : '') +
        '├────────────────────────┤\n' +
        `│ Jual  : ${pfx}sellfarm <id[#Q]|id> <qty>\n` +
        `│ Proses: ${pfx}process <produk> <batch>\n` +
        '╰────────────────────────╯\n'

      return cht.reply(_code(out))
    }
  )

  ev.on(
    { 
      cmd: ['buyseed'], 
      listmenu: ['buyseed <bibit> <qty>'], 
      tag: 'rpg', 
      isGroup: true, 
      args: true, 
      isArgs: 'Format: .buyseed <bibit> <qty>\nContoh: .buyseed padi 10' 
    },
    async ({ cht, args }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)
      const a = (Array.isArray(args) ? args : String(args || '').split(/\s+/)).filter(Boolean)
      const base = String(a[0] || '').toLowerCase().replace(/^seed_/, '')
      const qty = Math.max(1, Math.floor(Number(a[1]) || 0))
      const c = _CROPS[base]
      if (!c) return cht.reply(`❌ Bibit tidak ditemukan.\nCek: ${pfx}farmshop`)
      if (self.farm.skill.level < c.level) return cht.reply(`❌ Bibit terkunci.\nButuh Lv ${c.level}`)
      const used = _invCount(self)
      if (used + qty > self.farm.storage.cap) return cht.reply(`❌ Gudang penuh.\nSisa: ${_fmt(self.farm.storage.cap - used)}\nUpgrade: ${pfx}buygudang`)
      const cost = Math.floor(Number(c.seedBuy) || 0) * qty
      if (self.ekonomi.uang < cost) return cht.reply(_code(
        '╭─「 BUY FAILED 」─╮\n' +
        `│ Bibit : ${base} (${c.name})\n` +
        `│ Qty   : ${_fmt(qty)}\n` +
        `│ Butuh : ${_fmt(cost)}\n` +
        '├────────────────────────┤\n' +
        `│ Uang  : ${_fmt(self.ekonomi.uang)}\n` +
        '╰────────────────────────╯'
      ))
      self.ekonomi.uang -= cost
      _invAdd(self, _seedId(base), qty)
      return cht.reply(_code(
        '╭─「 BUY SUCCESS 」─╮\n' +
        `│ Bibit : ${base} (${c.name})\n` +
        `│ Qty   : ${_fmt(qty)}\n` +
        `│ Total : ${_fmt(cost)}\n` +
        '├────────────────────────┤\n' +
        `│ Uang  : ${_fmt(self.ekonomi.uang)}\n` +
        `│ Inv   : ${pfx}farminv\n` +
        '╰────────────────────────╯'
      ))
    }
  )

  ev.on(
    { 
      cmd: ['buymat'], 
      listmenu: ['buymat <id> <qty>'], 
      tag: 'rpg', 
      isGroup: true, 
      args: true, 
      isArgs: 'Format: .buymat <id> <qty>\nContoh: .buymat botol 10' 
    },
    async ({ cht, args }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)
      const a = (Array.isArray(args) ? args : String(args || '').split(/\s+/)).filter(Boolean)
      const id = String(a[0] || '').toLowerCase()
      const qty = Math.max(1, Math.floor(Number(a[1]) || 0))
      const m = _MAT[id]
      if (!m) return cht.reply(`❌ Material tidak ditemukan.\nCek: ${pfx}farmshop`)
      const used = _invCount(self)
      if (used + qty > self.farm.storage.cap) return cht.reply(`❌ Gudang penuh.\nSisa: ${_fmt(self.farm.storage.cap - used)}\nUpgrade: ${pfx}buygudang`)
      const cost = Math.floor(Number(m.buy) || 0) * qty
      if (self.ekonomi.uang < cost) return cht.reply(_code(
        '╭─「 BUY FAILED 」─╮\n' +
        `│ Item  : ${id} (${m.name})\n` +
        `│ Qty   : ${_fmt(qty)}\n` +
        `│ Butuh : ${_fmt(cost)}\n` +
        '├────────────────────────┤\n' +
        `│ Uang  : ${_fmt(self.ekonomi.uang)}\n` +
        '╰────────────────────────╯'
      ))
      self.ekonomi.uang -= cost
      _invAdd(self, id, qty)
      return cht.reply(_code(
        '╭─「 BUY SUCCESS 」─╮\n' +
        `│ Item  : ${id} (${m.name})\n` +
        `│ Qty   : ${_fmt(qty)}\n` +
        `│ Total : ${_fmt(cost)}\n` +
        '├────────────────────────┤\n' +
        `│ Uang  : ${_fmt(self.ekonomi.uang)}\n` +
        `│ Inv   : ${pfx}farminv\n` +
        '╰────────────────────────╯'
      ))
    }
  )

  ev.on(
    { 
      cmd: ['buyfert'], 
      listmenu: ['buyfert <id> <qty>'], 
      ag: 'rpg', 
      isGroup: true, 
      args: true, 
      isArgs: 'Format: .buyfert <id> <qty>\nContoh: .buyfert kompos 5' 
    },
    async ({ cht, args }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)
      const a = (Array.isArray(args) ? args : String(args || '').split(/\s+/)).filter(Boolean)
      const id = String(a[0] || '').toLowerCase()
      const qty = Math.max(1, Math.floor(Number(a[1]) || 0))
      const f = _FERT[id]
      if (!f) return cht.reply(`❌ Item tidak ditemukan.\nCek: ${pfx}farmshop`)
      const used = _invCount(self)
      if (used + qty > self.farm.storage.cap) return cht.reply(`❌ Gudang penuh.\nSisa: ${_fmt(self.farm.storage.cap - used)}\nUpgrade: ${pfx}buygudang`)
      const cost = Math.floor(Number(f.buy) || 0) * qty
      if (self.ekonomi.uang < cost) return cht.reply(_code(
        '╭─「 BUY FAILED 」─╮\n' +
        `│ Item  : ${id} (${f.name})\n` +
        `│ Qty   : ${_fmt(qty)}\n` +
        `│ Butuh : ${_fmt(cost)}\n` +
        '├────────────────────────┤\n' +
        `│ Uang  : ${_fmt(self.ekonomi.uang)}\n` +
        '╰────────────────────────╯'
      ))
      self.ekonomi.uang -= cost
      _invAdd(self, id, qty)
      return cht.reply(_code(
        '╭─「 BUY SUCCESS 」─╮\n' +
        `│ Item  : ${id} (${f.name})\n` +
        `│ Qty   : ${_fmt(qty)}\n` +
        `│ Total : ${_fmt(cost)}\n` +
        '├────────────────────────┤\n' +
        `│ Uang  : ${_fmt(self.ekonomi.uang)}\n` +
        `│ Inv   : ${pfx}farminv\n` +
        '╰────────────────────────╯'
      ))
    }
  )

  ev.on(
    { 
      cmd: ['buytool'], 
      listmenu: ['buytool <alat>'], 
      tag: 'rpg', 
      isGroup: true, 
      args: true, 
      isArgs: 'Format: .buytool <alat>\nContoh: .buytool cangkul_pro' 
    },
    async ({ cht, args }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)
      const a = (Array.isArray(args) ? args : String(args || '').split(/\s+/)).filter(Boolean)
      const id = String(a[0] || '').toLowerCase()
      const m = _TOOLS[id]
      if (!m) return cht.reply(`❌ Alat tidak ditemukan.\nCek: ${pfx}farmshop`)
      if (_toolOwned(self, id)) return cht.reply(`❌ Kamu sudah punya alat itu.\nCek: ${pfx}farminv`)
      const cost = Math.floor(Number(m.buy) || 0)
      if (self.ekonomi.uang < cost) return cht.reply(_code(
        '╭─「 BUY FAILED 」─╮\n' +
        `│ Alat  : ${id} (${m.name})\n` +
        `│ Harga : ${_fmt(cost)}\n` +
        '├────────────────────────┤\n' +
        `│ Uang  : ${_fmt(self.ekonomi.uang)}\n` +
        '╰────────────────────────╯'
      ))
      self.ekonomi.uang -= cost
      self.farm.tools[id] = { dur: m.max, max: m.max }
      return cht.reply(_code(
        '╭─「 BUY SUCCESS 」─╮\n' +
        `│ Alat  : ${id} (${m.name})\n` +
        `│ Dur   : ${_fmt(m.max)}/${_fmt(m.max)}\n` +
        '├────────────────────────┤\n' +
        `│ Uang  : ${_fmt(self.ekonomi.uang)}\n` +
        `│ Inv   : ${pfx}farminv\n` +
        '╰────────────────────────╯'
      ))
    }
  )

  ev.on(
    { 
      cmd: ['repairtool'], 
      listmenu: ['repairtool <alat>'], 
      tag: 'rpg', 
      isGroup: true, 
      args: true, 
      isArgs: 'Format: .repairtool <alat>\nContoh: .repairtool cangkul' 
    },
    async ({ cht, args }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)
      const a = (Array.isArray(args) ? args : String(args || '').split(/\s+/)).filter(Boolean)
      const id = String(a[0] || '').toLowerCase()
      const m = _TOOLS[id]
      if (!m) return cht.reply(`❌ Alat tidak ditemukan.`)
      if (!_toolOwned(self, id)) return cht.reply(`❌ Kamu belum punya alat itu.\nBeli: ${pfx}buytool ${id}`)
      const t = self.farm.tools[id]
      const dur = Math.max(0, Math.floor(Number(t.dur) || 0))
      const mx = Math.max(1, Math.floor(Number(t.max) || m.max || 1))
      if (dur >= mx) return cht.reply(`✅ Durability sudah penuh.`)
      const missing = mx - dur
      const cost = Math.max(1, Math.floor((Number(m.buy) || 0) * 0.20 * (missing / mx)))
      if (self.ekonomi.uang < cost) return cht.reply(`❌ Uang kurang.\nButuh: ${_fmt(cost)}`)
      self.ekonomi.uang -= cost
      t.dur = mx
      return cht.reply(_code(
        '╭─「 REPAIR TOOL 」─╮\n' +
        `│ Alat  : ${id} (${m.name})\n` +
        `│ Biaya : ${_fmt(cost)}\n` +
        `│ Dur   : ${_fmt(mx)}/${_fmt(mx)}\n` +
        '├────────────────────────┤\n' +
        `│ Uang  : ${_fmt(self.ekonomi.uang)}\n` +
        '╰────────────────────────╯'
      ))
    }
  )

  ev.on(
    { 
      cmd: ['buyland'], 
      listmenu: ['buyland <qty>'], 
      tag: 'rpg', 
      isGroup: true, 
      args: true, 
      isArgs: 'Format: .buyland <qty>\nContoh: .buyland 1' 
    },
    async ({ cht, args }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)
      const a = (Array.isArray(args) ? args : String(args || '').split(/\s+/)).filter(Boolean)
      const qty = Math.max(1, Math.floor(Number(a[0]) || 0))
      const maxSlots = 22 + Math.floor(self.farm.skill.level / 2)
      if (self.farm.land.slots + qty > maxSlots) return cht.reply(`❌ Batas lahan Lv kamu: ${maxSlots} petak.`)
      let total = 0
      for (let i = 0; i < qty; i++) {
        const n = Math.max(0, (self.farm.land.slots - 2) + i)
        total += Math.floor(50000 * Math.pow(1.18, n))
      }
      if (self.ekonomi.uang < total) return cht.reply(`❌ Uang kurang.\nButuh: ${_fmt(total)}\nUang : ${_fmt(self.ekonomi.uang)}`)
      self.ekonomi.uang -= total
      self.farm.land.slots += qty
      while (self.farm.land.plots.length < self.farm.land.slots) self.farm.land.plots.push(null)
      return cht.reply(_code(
        '╭─「 BUY LAND 」─╮\n' +
        `│ Tambah: ${_fmt(qty)} petak\n` +
        `│ Total : ${_fmt(total)}\n` +
        '├────────────────────────┤\n' +
        `│ Lahan : ${self.farm.land.slots} petak\n` +
        `│ Uang  : ${_fmt(self.ekonomi.uang)}\n` +
        '╰────────────────────────╯'
      ))
    }
  )

  ev.on(
    { 
      cmd: ['buygudang'], 
      listmenu: ['buygudang'], 
      tag: 'rpg', 
      isGroup: true 
    },
    async ({ cht }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)
      const lv = self.farm.storage.level
      const cost = Math.floor(60000 * Math.pow(1.22, lv - 1))
      if (self.ekonomi.uang < cost) return cht.reply(`❌ Uang kurang.\nButuh: ${_fmt(cost)}`)
      self.ekonomi.uang -= cost
      self.farm.storage.level += 1
      self.farm.storage.cap += 140
      return cht.reply(_code(
        '╭─「 UPGRADE GUDANG 」─╮\n' +
        `│ Lv    : ${lv} → ${self.farm.storage.level}\n` +
        `│ Cap   : ${_fmt(self.farm.storage.cap)}\n` +
        `│ Biaya : ${_fmt(cost)}\n` +
        '├────────────────────────┤\n' +
        `│ Uang  : ${_fmt(self.ekonomi.uang)}\n` +
        '╰────────────────────────╯'
      ))
    }
  )

  ev.on(
    { 
      cmd: ['plant', 'tanam'], 
      listmenu: ['plant <bibit> <qty|petak>'], 
      tag: 'rpg', 
      isGroup: true, 
      args: true, 
      isArgs: 'Format: .plant <bibit> <qty|petak>\nContoh: .plant padi 3' 
    },
    async ({ cht, args }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)
      const hoe = _toolBest(self, 'hoe')
      if (!hoe) return cht.reply(`❌ Kamu butuh cangkul.\nBeli: ${pfx}buytool cangkul`)

      const W = _getWorld()
      const a = (Array.isArray(args) ? args : String(args || '').split(/\s+/)).filter(Boolean)
      const base = String(a[0] || '').toLowerCase().replace(/^seed_/, '')
      const x = Math.max(1, Math.floor(Number(a[1]) || 0))
      const c = _CROPS[base]
      if (!c) return cht.reply(`❌ Bibit tidak ditemukan.\nCek: ${pfx}farmshop`)
      if (self.farm.skill.level < c.level) return cht.reply(`❌ Bibit terkunci.\nButuh Lv ${c.level}`)
      const seed = _seedId(base)
      if (_invQty(self, seed) <= 0) return cht.reply(`❌ Bibit habis.\nBeli: ${pfx}buyseed ${base} 10`)

      const land = self.farm.land
      const idx = (x >= 1 && x <= land.slots) ? x : 0

      const plantOne = (iPlot) => {
        if (land.plots[iPlot - 1]) return { ok: false, why: 'Petak terisi' }
        if (_invQty(self, seed) <= 0) return { ok: false, why: 'Bibit kurang' }

        const hoeB = _toolBonus(self, 'hoe')
        const wSpeed =
          W.weather === 'Cerah' ? 0.00 :
          W.weather === 'Mendung' ? 0.03 :
          W.weather === 'Hujan' ? 0.06 :
          0.10

        const seasonGrow = Number(W.season.grow) || 1
        const growBase = Math.floor((Number(c.grow) || 0) * seasonGrow)
        const speed = Math.max(0, wSpeed - (hoeB.s || 0))
        const grow = Math.max(35 * 60 * 1000, Math.floor(growBase * (1 + speed)))

        const pBase =
          W.weather === 'Badai' ? 0.20 :
          W.weather === 'Hujan' ? 0.14 :
          0.10

        const pestsChance = Math.min(0.35, pBase * (Number(W.season.pests) || 1))
        const pests = Math.random() < pestsChance

        const now = Date.now()
        land.plots[iPlot - 1] = {
          base,
          plantedAt: now,
          readyAt: now + grow,
          growMs: grow,
          water: 0,
          fert: { kompos: 0, npk: 0, super: 0 },
          lastWaterAt: 0,
          lastFertAt: 0,
          pests
        }

        _invAdd(self, seed, -1)
        _toolUse(self, 'hoe', 1)
        const exp = Math.floor((Number(c.exp) || 0) * 0.45) + 4
        _skillGain(self, exp)
        return { ok: true, exp }
      }

      let planted = 0
      let expSum = 0

      if (idx) {
        const r = plantOne(idx)
        if (!r.ok) return cht.reply(`❌ ${r.why}\nCek: ${pfx}farmplot`)
        planted = 1
        expSum = r.exp
      } else {
        const want = x
        for (let i = 1; i <= land.slots && planted < want; i++) {
          const r = plantOne(i)
          if (r.ok) { planted++; expSum += r.exp }
        }
        if (planted <= 0) return cht.reply(`❌ Tidak ada petak kosong / bibit kurang.\nCek: ${pfx}farmplot`)
      }

      return cht.reply(_code(
        '╭─「 TANAM BERHASIL 」─╮\n' +
        `│ Bibit : ${base} (${c.name})\n` +
        `│ Tanam : ${_fmt(planted)} petak\n` +
        `│ EXP   : +${_fmt(expSum)}\n` +
        '├────────────────────────┤\n' +
        `│ Sisa  : ${_fmt(_invQty(self, seed))} bibit\n` +
        `│ Cek   : ${pfx}farmplot\n` +
        '╰────────────────────────╯'
      ))
    }
  )

  ev.on(
    { 
      cmd: ['water', 'siram'], 
      listmenu: ['water <petak|all>'], 
      tag: 'rpg', 
      isGroup: true, 
      args: true, 
      isArgs: 'Format: .water <petak|all>\nContoh: .water all' 
    },
    async ({ cht, args }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)
      const tool = _toolBest(self, 'water')
      if (!tool) return cht.reply(`❌ Kamu butuh penyiram.\nBeli: ${pfx}buytool siram`)
      const a = (Array.isArray(args) ? args : String(args || '').split(/\s+/)).filter(Boolean)
      const tgt = String(a[0] || '').toLowerCase()
      const land = self.farm.land
      const cd = 20 * 60 * 1000

      const doOne = (i) => {
        const plot = land.plots[i - 1]
        if (!plot) return { ok: false, why: 'Kosong' }
        const now = Date.now()
        if (now >= (plot.readyAt || 0)) return { ok: false, why: 'Siap panen' }
        const last = Math.floor(Number(plot.lastWaterAt) || 0)
        if (last && (now - last) < cd) return { ok: false, why: `CD ${_msToTime(cd - (now - last))}` }
        const w = Math.floor(Number(plot.water) || 0)
        if (w >= 3) return { ok: false, why: 'Air max' }
        plot.water = w + 1
        plot.lastWaterAt = now
        const b = _toolBonus(self, 'water')
        const cut = Math.floor((plot.growMs || 0) * (0.03 + (b.s || 0)))
        plot.readyAt = Math.max(now + 10 * 60 * 1000, Math.floor(plot.readyAt - cut))
        _toolUse(self, 'water', 1)
        _skillGain(self, 3)
        return { ok: true }
      }

      const ok = []
      const fail = []
      if (tgt === 'all') {
        for (let i = 1; i <= land.slots; i++) {
          const r = doOne(i)
          if (r.ok) ok.push(`#${i}`)
          else fail.push(`#${i} ${r.why}`)
        }
      } else {
        const ix = Math.floor(Number(tgt) || 0)
        if (ix < 1 || ix > land.slots) return cht.reply(`❌ Petak tidak valid.\nContoh: ${pfx}water 2 / ${pfx}water all`)
        const r = doOne(ix)
        if (r.ok) ok.push(`#${ix}`)
        else fail.push(`#${ix} ${r.why}`)
      }

      return cht.reply(_code(
        '╭─「 SIRAM 」─╮\n' +
        `│ OK   : ${ok.length ? ok.join(', ') : '-'}\n` +
        '├────────────────────────┤\n' +
        `│ FAIL : ${fail.length ? fail.slice(0, 4).join(' | ') : '-'}\n` +
        '├────────────────────────┤\n' +
        `│ Cek  : ${pfx}farmplot\n` +
        '╰────────────────────────╯'
      ))
    }
  )

  ev.on(
    { 
      cmd: ['fert', 'pupuk'], 
      listmenu: ['fert <petak|all> <kompos|npk|super>'], 
      tag: 'rpg', 
      isGroup: true, 
      args: true, 
      isArgs: 'Format: .fert <petak|all> <kompos|npk|super>\nContoh: .fert all npk' 
    },
    async ({ cht, args }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)
      const a = (Array.isArray(args) ? args : String(args || '').split(/\s+/)).filter(Boolean)
      const tgt = String(a[0] || '').toLowerCase()
      const fid = String(a[1] || '').toLowerCase()
      const f = _FERT[fid]
      if (!f || fid === 'pestisida') return cht.reply(`❌ Pupuk tidak valid.`)
      if (_invQty(self, fid) <= 0) return cht.reply(`❌ Pupuk habis.\nBeli: ${pfx}buyfert ${fid} 5`)

      const land = self.farm.land

      const doOne = (i) => {
        const plot = land.plots[i - 1]
        if (!plot) return { ok: false, why: 'Kosong' }
        const now = Date.now()
        if (now >= (plot.readyAt || 0)) return { ok: false, why: 'Siap panen' }
        plot.fert ??= { kompos: 0, npk: 0, super: 0 }
        const n = Math.floor(Number(plot.fert[fid]) || 0)
        if (n >= f.max) return { ok: false, why: `Max ${f.max}` }
        const last = Math.floor(Number(plot.lastFertAt) || 0)
        if (last && (now - last) < f.cd) return { ok: false, why: `CD ${_msToTime(f.cd - (now - last))}` }
        if (_invQty(self, fid) <= 0) return { ok: false, why: 'Pupuk kurang' }
        plot.fert[fid] = n + 1
        plot.lastFertAt = now
        const cut = Math.floor((plot.growMs || 0) * (Number(f.time) || 0) * 0.55)
        plot.readyAt = Math.max(now + 10 * 60 * 1000, Math.floor(plot.readyAt - cut))
        _invAdd(self, fid, -1)
        _skillGain(self, 4)
        return { ok: true }
      }

      const ok = []
      const fail = []
      if (tgt === 'all') {
        for (let i = 1; i <= land.slots; i++) {
          const r = doOne(i)
          if (r.ok) ok.push(`#${i}`)
          else fail.push(`#${i} ${r.why}`)
        }
      } else {
        const ix = Math.floor(Number(tgt) || 0)
        if (ix < 1 || ix > land.slots) return cht.reply(`❌ Petak tidak valid.`)
        const r = doOne(ix)
        if (r.ok) ok.push(`#${ix}`)
        else fail.push(`#${ix} ${r.why}`)
      }

      return cht.reply(_code(
        '╭─「 PUPUK 」─╮\n' +
        `│ Pupuk: ${fid} (${f.name})\n` +
        '├────────────────────────┤\n' +
        `│ OK   : ${ok.length ? ok.join(', ') : '-'}\n` +
        `│ FAIL : ${fail.length ? fail.slice(0, 4).join(' | ') : '-'}\n` +
        '╰────────────────────────╯'
      ))
    }
  )

  ev.on(
    { 
      cmd: ['spray', 'semprot'], 
      listmenu: ['spray <petak|all>'], 
      tag: 'rpg', 
      isGroup: true, 
      args: true, 
      isArgs: 'Format: .spray <petak|all>\nContoh: .spray all' 
    },
    async ({ cht, args }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)
      const tool = _toolBest(self, 'spray')
      if (!tool) return cht.reply(`❌ Kamu butuh sprayer.\nBeli: ${pfx}buytool sprayer`)
      if (_invQty(self, 'pestisida') <= 0) return cht.reply(`❌ Pestisida habis.\nBeli: ${pfx}buyfert pestisida 5`)

      const a = (Array.isArray(args) ? args : String(args || '').split(/\s+/)).filter(Boolean)
      const tgt = String(a[0] || '').toLowerCase()
      const land = self.farm.land

      const doOne = (i) => {
        const plot = land.plots[i - 1]
        if (!plot) return { ok: false, why: 'Kosong' }
        if (!plot.pests) return { ok: false, why: 'Tidak ada hama' }
        if (_invQty(self, 'pestisida') <= 0) return { ok: false, why: 'Pestisida kurang' }
        plot.pests = false
        _invAdd(self, 'pestisida', -1)
        _toolUse(self, 'spray', 1)
        _skillGain(self, 3)
        return { ok: true }
      }

      const ok = []
      const fail = []
      if (tgt === 'all') {
        for (let i = 1; i <= land.slots; i++) {
          const r = doOne(i)
          if (r.ok) ok.push(`#${i}`)
          else fail.push(`#${i} ${r.why}`)
        }
      } else {
        const ix = Math.floor(Number(tgt) || 0)
        if (ix < 1 || ix > land.slots) return cht.reply(`❌ Petak tidak valid.`)
        const r = doOne(ix)
        if (r.ok) ok.push(`#${ix}`)
        else fail.push(`#${ix} ${r.why}`)
      }

      return cht.reply(_code(
        '╭─「 SPRAY HAMA 」─╮\n' +
        `│ OK   : ${ok.length ? ok.join(', ') : '-'}\n` +
        '├────────────────────────┤\n' +
        `│ FAIL : ${fail.length ? fail.slice(0, 4).join(' | ') : '-'}\n` +
        '├────────────────────────┤\n' +
        `│ Sisa pestisida: ${_fmt(_invQty(self, 'pestisida'))}\n` +
        '╰────────────────────────╯'
      ))
    }
  )

  ev.on(
    { 
      cmd: ['harvest', 'panen'], 
      listmenu: ['harvest <petak|all>'], 
      tag: 'rpg', 
      isGroup: true, 
      args: true, 
      isArgs: 'Format: .harvest <petak|all>\nContoh: .harvest all' 
    },
    async ({ cht, args }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)
      const tool = _toolBest(self, 'harvest')
      if (!tool) return cht.reply(`❌ Kamu butuh sabit.\nBeli: ${pfx}buytool sabit`)
      const W = _getWorld()

      const a = (Array.isArray(args) ? args : String(args || '').split(/\s+/)).filter(Boolean)
      const tgt = String(a[0] || '').toLowerCase()
      const land = self.farm.land

      const harvestOne = (i) => {
        const plot = land.plots[i - 1]
        if (!plot) return { ok: false, why: 'Kosong' }
        const now = Date.now()
        const left = Math.floor((Number(plot.readyAt) || 0) - now)
        if (left > 0) return { ok: false, why: `Belum siap ${_msToTime(left)}` }
        const base = plot.base
        const c = _CROPS[base]
        if (!c) return { ok: false, why: 'Tanaman rusak' }

        const fert = plot.fert || {}
        const yF =
          (Number(fert.kompos) || 0) * (_FERT.kompos.yield || 0) +
          (Number(fert.npk) || 0) * (_FERT.npk.yield || 0) +
          (Number(fert.super) || 0) * (_FERT.super.yield || 0)

        const w = Math.max(0, Math.floor(Number(plot.water) || 0))
        const yW = Math.min(0.14, w * 0.05)

        const skLv = self.farm.skill.level
        const yS = Math.min(0.45, (skLv - 1) * 0.03)

        const harvB = _toolBonus(self, 'harvest')
        const hoeB = _toolBonus(self, 'hoe')
        const waterB = _toolBonus(self, 'water')

        const seasonYield = Number(W.season.yield) || 1
        const pestsPenalty = plot.pests ? 0.40 : 0.0

        const baseYield = Number(c.yield) || 1
        const varr = 0.90 + Math.random() * 0.20
        let qty = Math.floor(baseYield * varr * seasonYield * (1 + yF + yW + yS + (harvB.y || 0) + (hoeB.y || 0) + (waterB.y || 0)))
        qty = Math.max(1, qty)
        if (pestsPenalty > 0) qty = Math.max(1, Math.floor(qty * (1 - pestsPenalty)))

        if (_invCount(self) + qty > self.farm.storage.cap) return { ok: false, why: `Gudang penuh (butuh ${qty} slot)` }

        const extraQ =
          (Number(_FERT.kompos.q || 0) * (Number(fert.kompos) || 0)) +
          (Number(_FERT.npk.q || 0) * (Number(fert.npk) || 0)) +
          (Number(_FERT.super.q || 0) * (Number(fert.super) || 0)) +
          (harvB.q || 0) + (hoeB.q || 0) + (waterB.q || 0) +
          (W.weather === 'Cerah' ? 0.02 : 0.00)

        const made = { C: 0, U: 0, R: 0, E: 0, L: 0 }
        for (let k = 0; k < qty; k++) {
          const q = _qualRoll(self, extraQ)
          made[q] += 1
        }

        for (const q of _FQ_SHOW) {
          const n = made[q] || 0
          if (n > 0) _invAdd(self, _qualKey(base, q), n)
        }

        land.plots[i - 1] = null
        _toolUse(self, 'harvest', 1)
        const exp = Math.floor((Number(c.exp) || 0) * 1.2) + 8
        _skillGain(self, exp)

        return { ok: true, qty, made, exp }
      }

      const idxs = []
      if (tgt === 'all') for (let i = 1; i <= land.slots; i++) idxs.push(i)
      else {
        const ix = Math.floor(Number(tgt) || 0)
        if (ix < 1 || ix > land.slots) return cht.reply(`❌ Petak tidak valid.\nContoh: ${pfx}harvest all`)
        idxs.push(ix)
      }

      const ok = []
      const fail = []
      const sum = { C: 0, U: 0, R: 0, E: 0, L: 0 }
      let expSum = 0

      for (const i of idxs) {
        const r = harvestOne(i)
        if (!r.ok) fail.push(`#${i} ${r.why}`)
        else {
          ok.push(`#${i}`)
          expSum += r.exp
          for (const q of _FQ_SHOW) sum[q] += (r.made[q] || 0)
        }
      }

      const madeLine = _FQ_SHOW.map(q => sum[q] ? `${q}:${_fmt(sum[q])}` : '').filter(Boolean).join(' | ') || '-'

      return cht.reply(_code(
        '╭─「 PANEN 」─╮\n' +
        `│ OK   : ${ok.length ? ok.length : 0} petak\n` +
        `│ Hasil: ${madeLine}\n` +
        `│ EXP  : +${_fmt(expSum)}\n` +
        '├────────────────────────┤\n' +
        `│ FAIL : ${fail.length ? fail.slice(0, 4).join(' | ') : '-'}\n` +
        '├────────────────────────┤\n' +
        `│ Inv  : ${pfx}farminv\n` +
        '╰────────────────────────╯'
      ))
    }
  )

  ev.on(
    { 
      cmd: ['sellfarm'], 
      listmenu: ['sellfarm <id[#Q]|id> <qty>'], 
      tag: 'rpg', 
      isGroup: true, 
      args: true, 
      isArgs: 'Format: .sellfarm <id[#Q]|id> <qty>\nContoh: .sellfarm padi 20\nAtau  : .sellfarm kopi_bubuk#R 5' 
    },
    async ({ cht, args }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)

      const a = (Array.isArray(args) ? args : String(args || '').split(/\s+/)).filter(Boolean)
      const raw = String(a[0] || '').toLowerCase()
      const qty = Math.max(1, Math.floor(Number(a[1]) || 0))
      const s = _splitQual(raw)
      const base = s.base
      const q = s.q

      const meta = _CROPS[base] || _PRODUCTS[base]
      if (!meta) return cht.reply(`❌ Item tidak dikenal di FARM.\nCek: ${pfx}farminv`)

      const d = self.farm.daily
      const basePrice = _priceNow(base)

      if (!q) {
        const take = _consumeAny(self, base, qty)
        if (!take.ok) return cht.reply(`❌ Item kurang.\nCek: ${pfx}farminv`)

        let gain = 0
        const detail = []
        for (const t of take.take) {
          const mult = _FQ[t.q]?.mult || 1
          const unit = Math.floor(basePrice * mult)
          const total = unit * t.qty
          gain += total
          detail.push(`│ • ${t.id} x${_fmt(t.qty)} = ${_fmt(total)}`)
        }

        if (d.sellValue + gain > _dailySellCap) {
          for (const t of take.take) _invAdd(self, t.id, t.qty)
          const left = Math.max(0, _dailySellCap - d.sellValue)
          return cht.reply(_code(
            '╭─「 SELL FAILED 」─╮\n' +
            `│ Limit harian.\n` +
            `│ Sisa: ${_fmt(left)}\n` +
            '├────────────────────────┤\n' +
            `│ Cek : ${pfx}farmskill\n` +
            '╰────────────────────────╯'
          ))
        }

        d.sellValue += gain
        self.ekonomi.uang += gain

        return cht.reply(_code(
          '╭─「 SELL TO NPC 」─╮\n' +
          `│ Item   : ${base} (${_metaName(base)})\n` +
          `│ Qty    : ${_fmt(qty)} (auto best)\n` +
          `│ Total  : ${_fmt(gain)}\n` +
          '├────────────────────────┤\n' +
          `│ Uang   : ${_fmt(self.ekonomi.uang)}\n` +
          `│ Daily  : ${_fmt(d.sellValue)} / ${_fmt(_dailySellCap)}\n` +
          '├────────────────────────┤\n' +
          detail.slice(0, 10).join('\n') + '\n' +
          '╰────────────────────────╯'
        ))
      }

      if (_invQty(self, raw) < qty) return cht.reply(`❌ Item kurang.\nPunya: ${_fmt(_invQty(self, raw))}`)

      const mult = _FQ[q]?.mult || 1
      const unit = Math.floor(basePrice * mult)
      const gain = unit * qty

      if (d.sellValue + gain > _dailySellCap) {
        const left = Math.max(0, _dailySellCap - d.sellValue)
        return cht.reply(_code(
          '╭─「 SELL FAILED 」─╮\n' +
          `│ Limit harian.\n` +
          `│ Sisa: ${_fmt(left)}\n` +
          '├────────────────────────┤\n' +
          `│ Cek : ${pfx}farmskill\n` +
          '╰────────────────────────╯'
        ))
      }

      _invAdd(self, raw, -qty)
      d.sellValue += gain
      self.ekonomi.uang += gain

      return cht.reply(_code(
        '╭─「 SELL TO NPC 」─╮\n' +
        `│ Item   : ${raw} (${_metaName(base)} • ${q}/${_FQ[q].name})\n` +
        `│ Qty    : ${_fmt(qty)}\n` +
        `│ Harga  : ${_fmt(unit)}\n` +
        `│ Total  : ${_fmt(gain)}\n` +
        '├────────────────────────┤\n' +
        `│ Uang   : ${_fmt(self.ekonomi.uang)}\n` +
        `│ Daily  : ${_fmt(d.sellValue)} / ${_fmt(_dailySellCap)}\n` +
        '╰────────────────────────╯'
      ))
    }
  )

  ev.on(
    { 
      cmd: ['farmfac'], 
      listmenu: ['farmfac'], 
      tag: 'rpg', 
      isGroup: true 
    },
    async ({ cht }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)
      const rows = []
      for (const id of Object.keys(_FAC)) {
        const st = _facState(self, id)
        rows.push(`│ • ${id} (${_FAC[id].name})`)
        rows.push(`│   Tier: ${st.tier}/${_FAC[id].maxTier} | Dur: ${_fmt(st.dur)}/${_fmt(st.max)}`)
      }
      return cht.reply(_code(
        '╭─「 FARM FACILITIES 」─╮\n' +
        `│ Upgrade: ${pfx}upfac <id>\n` +
        `│ Repair : ${pfx}repairfac <id>\n` +
        '├────────────────────────┤\n' +
        rows.join('\n') + '\n' +
        '╰────────────────────────╯'
      ))
    }
  )

  ev.on(
    { 
      cmd: ['upfac'], 
      listmenu: ['upfac <id>'], 
      tag: 'rpg', 
      isGroup: true, 
      args: true, 
      isArgs: 'Format: .upfac <id>\nContoh: .upfac mill' 
    },
    async ({ cht, args }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)
      const a = (Array.isArray(args) ? args : String(args || '').split(/\s+/)).filter(Boolean)
      const id = String(a[0] || '').toLowerCase()
      if (!_FAC[id]) return cht.reply(`❌ Fasilitas tidak valid.\nCek: ${pfx}farmfac`)
      const st = _facState(self, id)
      if (st.tier >= _FAC[id].maxTier) return cht.reply(`✅ Tier sudah maksimal.`)
      const nextTier = st.tier + 1
      const cost = _facCost(id, nextTier)
      if (self.ekonomi.uang < cost) return cht.reply(`❌ Uang kurang.\nButuh: ${_fmt(cost)}`)
      self.ekonomi.uang -= cost
      st.tier = nextTier
      st.max = _facMax(st.tier)
      st.dur = st.max
      return cht.reply(_code(
        '╭─「 UPGRADE FACILITY 」─╮\n' +
        `│ Fac   : ${id} (${_FAC[id].name})\n` +
        `│ Tier  : ${st.tier}/${_FAC[id].maxTier}\n` +
        `│ Dur   : ${_fmt(st.dur)}/${_fmt(st.max)}\n` +
        `│ Biaya : ${_fmt(cost)}\n` +
        '├────────────────────────┤\n' +
        `│ Uang  : ${_fmt(self.ekonomi.uang)}\n` +
        '╰────────────────────────╯'
      ))
    }
  )

  ev.on(
    { 
      cmd: ['repairfac'], 
      listmenu: ['repairfac <id>'], 
      tag: 'rpg', 
      isGroup: true, 
      args: true, 
      isArgs: 'Format: .repairfac <id>\nContoh: .repairfac mill' 
    },
    async ({ cht, args }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)
      const a = (Array.isArray(args) ? args : String(args || '').split(/\s+/)).filter(Boolean)
      const id = String(a[0] || '').toLowerCase()
      if (!_FAC[id]) return cht.reply(`❌ Fasilitas tidak valid.`)
      const st = _facState(self, id)
      if (st.tier <= 0) return cht.reply(`❌ Fasilitas belum dibeli.\nUpgrade: ${pfx}upfac ${id}`)
      if (st.dur >= st.max) return cht.reply(`✅ Durability sudah penuh.`)
      const miss = st.max - st.dur
      const base = _facCost(id, st.tier)
      const cost = Math.max(1, Math.floor(base * 0.18 * (miss / st.max)))
      if (self.ekonomi.uang < cost) return cht.reply(`❌ Uang kurang.\nButuh: ${_fmt(cost)}`)
      self.ekonomi.uang -= cost
      st.dur = st.max
      return cht.reply(_code(
        '╭─「 REPAIR FACILITY 」─╮\n' +
        `│ Fac   : ${id} (${_FAC[id].name})\n` +
        `│ Tier  : ${st.tier}\n` +
        `│ Biaya : ${_fmt(cost)}\n` +
        `│ Dur   : ${_fmt(st.dur)}/${_fmt(st.max)}\n` +
        '├────────────────────────┤\n' +
        `│ Uang  : ${_fmt(self.ekonomi.uang)}\n` +
        '╰────────────────────────╯'
      ))
    }
  )

  ev.on(
    { 
      cmd: ['processlist'], 
      listmenu: ['processlist'], 
      tag: 'rpg', 
      isGroup: true 
    },
    async ({ cht }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)
      const skLv = self.farm.skill.level
      const ids = Object.keys(_PROC).sort((a, b) => (_PROC[a].level - _PROC[b].level) || a.localeCompare(b))

      const lines = ids.slice(0, 14).map((id, i) => {
        const r = _PROC[id]
        const lock = skLv < r.level ? `LOCK Lv${r.level}` : 'OK'
        const need = Object.keys(r.need).map(k => `${k}x${r.need[k]}`).join(', ')
        return `│ ${String(i + 1).padStart(2, '0')}. ${id} (${lock})\n│    Need: ${need}\n│    Fac : ${r.fac} | Time: ${_msToTime(r.time)} | Out: x${r.out}`
      })

      return cht.reply(_code(
        '╭─「 PROCESSING LIST 」─╮\n' +
        `│ Proses: ${pfx}process <produk> <batch>\n` +
        `│ Jobs  : ${pfx}farmjobs | Claim: ${pfx}claimprocess <id|all>\n` +
        '├────────────────────────┤\n' +
        lines.join('\n') + '\n' +
        '╰────────────────────────╯'
      ))
    }
  )

  ev.on(
    { 
      cmd: ['process'], 
      listmenu: ['process <produk> <batch>'], 
      tag: 'rpg', 
      isGroup: true, 
      args: true, 
      isArgs: 'Format: .process <produk> <batch>\nContoh: .process beras 3' 
    },
    async ({ cht, args }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)

      _jobsClean(self)

      const a = (Array.isArray(args) ? args : String(args || '').split(/\s+/)).filter(Boolean)
      const prod = String(a[0] || '').toLowerCase()
      const batch = Math.max(1, Math.floor(Number(a[1]) || 0))

      const r = _PROC[prod]
      if (!r) return cht.reply(`❌ Resep tidak ditemukan.\nCek: ${pfx}processlist`)
      if (self.farm.skill.level < r.level) return cht.reply(`❌ Terkunci.\nButuh Lv ${r.level}`)

      const fac = _facState(self, r.fac)
      if (fac.tier <= 0) return cht.reply(`❌ Butuh fasilitas: ${r.fac} (${_FAC[r.fac].name}).\nUpgrade: ${pfx}upfac ${r.fac}`)
      if (fac.dur < batch) return cht.reply(`❌ Dur fasilitas kurang.\nRepair: ${pfx}repairfac ${r.fac}`)

      const maxJobs = _jobMax(self)
      if ((self.farm.jobs || []).length >= maxJobs) return cht.reply(`❌ Slot job penuh.\nMax: ${maxJobs}\nCek: ${pfx}farmjobs`)

      for (const k of Object.keys(r.need)) {
        const need = Math.floor(Number(r.need[k]) || 0) * batch
        if (_CROPS[k] || _PRODUCTS[k]) {
          const take = _consumeAny(self, k, need)
          if (!take.ok) return cht.reply(`❌ Bahan kurang: ${k} x${_fmt(need)}\nCek: ${pfx}farminv`)
        } else {
          if (_invQty(self, k) < need) return cht.reply(`❌ Bahan kurang: ${k} x${_fmt(need)}\nCek: ${pfx}farminv`)
          _invAdd(self, k, -need)
        }
      }

      const W = _getWorld()
      const fSpeed = _facSpeed(fac.tier)
      const seasonSpeed = Number(W.season.grow) || 1
      fac.dur = Math.max(0, fac.dur - batch)

      const per = Math.floor((Number(r.time) || 0) * fSpeed * seasonSpeed)
      const totalMs = Math.max(60 * 1000, per * batch)

      const now = Date.now()
      const id = `JOB-${_hash(`${now}|${prod}|${batch}|${Math.random()}`).toString(16).slice(0, 6).toUpperCase()}`
      self.farm.jobs.push({
        id,
        prod,
        batch,
        startAt: now,
        endAt: now + totalMs,
        fac: r.fac,
        tier: fac.tier,
        season: W.season.id
      })

      return cht.reply(_code(
        '╭─「 PROCESS STARTED 」─╮\n' +
        `│ Job   : ${id}\n` +
        `│ Produk: ${prod} (${_PRODUCTS[prod]?.name || r.name})\n` +
        `│ Batch : ${_fmt(batch)}\n` +
        `│ Fac   : ${r.fac} T${fac.tier} | Dur sisa ${_fmt(fac.dur)}/${_fmt(fac.max)}\n` +
        '├────────────────────────┤\n' +
        `│ Estimasi selesai: ${_msToTime(totalMs)}\n` +
        `│ Cek Jobs: ${pfx}farmjobs\n` +
        '╰────────────────────────╯'
      ))
    }
  )

  ev.on(
    { 
      cmd: ['farmjobs'], 
      listmenu: ['farmjobs'], 
      tag: 'rpg', 
      isGroup: true 
    },
    async ({ cht }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)
      _jobsClean(self)
      const now = Date.now()
      const jobs = (self.farm.jobs || []).slice().sort((a, b) => (a.endAt - b.endAt))
      if (!jobs.length) return cht.reply(_code(
        '╭─「 FARM JOBS 」─╮\n' +
        '│ Kosong.\n' +
        '├────────────────────────┤\n' +
        `│ Buat job: ${pfx}processlist\n` +
        '╰────────────────────────╯'
      ))
      const lines = jobs.slice(0, 8).map(j => {
        const left = Math.floor((Number(j.endAt) || 0) - now)
        const st = left <= 0 ? 'READY' : _msToTime(left)
        return `│ • ${j.id} | ${j.prod} x${_fmt(j.batch)} | ${st}`
      })
      return cht.reply(_code(
        '╭─「 FARM JOBS 」─╮\n' +
        lines.join('\n') + '\n' +
        '├────────────────────────┤\n' +
        `│ Claim: ${pfx}claimprocess <id|all>\n` +
        '╰────────────────────────╯'
      ))
    }
  )

  ev.on(
    { 
      cmd: ['claimprocess'], 
      listmenu: ['claimprocess <id|all>'], 
      tag: 'rpg', 
      isGroup: true, 
      args: true, 
      isArgs: 'Format: .claimprocess <id|all>\nContoh: .claimprocess all' 
    },
    async ({ cht, args }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)
      _jobsClean(self)

      const a = (Array.isArray(args) ? args : String(args || '').split(/\s+/)).filter(Boolean)
      const target = String(a[0] || '').trim()
      const now = Date.now()
      const jobs = self.farm.jobs || []
      const pick = []
      if (String(target).toLowerCase() === 'all') {
        for (const j of jobs) if ((Number(j.endAt) || 0) <= now) pick.push(j)
      } else {
        const j = jobs.find(x => String(x.id) === String(target))
        if (j && (Number(j.endAt) || 0) <= now) pick.push(j)
      }

      if (!pick.length) return cht.reply(_code(
        '╭─「 CLAIM FAILED 」─╮\n' +
        '│ Tidak ada job siap.\n' +
        '├────────────────────────┤\n' +
        `│ Cek: ${pfx}farmjobs\n` +
        '╰────────────────────────╯'
      ))

      let expSum = 0
      const got = {}
      const W = _getWorld()

      for (const j of pick) {
        const r = _PROC[j.prod]
        if (!r) continue
        const yB = _facYield(Math.max(1, Math.floor(Number(j.tier) || 1)))
        const qB = _facQual(Math.max(1, Math.floor(Number(j.tier) || 1)))
        const seasonBonus =
          W.season.id === 'panen' ? 0.06 :
          W.season.id === 'kemarau' ? 0.03 :
          W.season.id === 'hujan' ? 0.02 :
          0.00

        const outUnits = Math.max(1, Math.floor((Number(r.out) || 1) * (1 + yB + seasonBonus)))
        const totalOut = outUnits * Math.max(1, Math.floor(Number(j.batch) || 1))
        if (_invCount(self) + totalOut > self.farm.storage.cap) continue

        for (let i = 0; i < totalOut; i++) {
          const q = _qualRoll(self, qB)
          const k = _qualKey(j.prod, q)
          _invAdd(self, k, 1)
          got[q] = (got[q] || 0) + 1
        }

        const exp = Math.floor((Number(r.exp) || 0) * Math.max(1, Math.floor(Number(j.batch) || 1)) * (1 + seasonBonus))
        expSum += exp
        _skillGain(self, exp)
        j.done = true
      }

      self.farm.jobs = (self.farm.jobs || []).filter(j => !j.done)

      const gotLine = _FQ_SHOW.map(q => got[q] ? `${q}:${_fmt(got[q])}` : '').filter(Boolean).join(' | ') || '-'
      return cht.reply(_code(
        '╭─「 CLAIM SUCCESS 」─╮\n' +
        `│ Hasil : ${gotLine}\n` +
        `│ EXP   : +${_fmt(expSum)}\n` +
        '├────────────────────────┤\n' +
        `│ Inv   : ${pfx}farminv\n` +
        `│ Jobs  : ${pfx}farmjobs\n` +
        '╰────────────────────────╯'
      ))
    }
  )

  ev.on(
    { 
      cmd: ['farmorder'], 
      listmenu: ['farmorder'], 
      tag: 'rpg', 
      isGroup: true 
    },
    async ({ cht }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)
      const W = _getWorld()
      const done = self.farm.daily.orderDone || {}
      const lines = W.orders.map(o => {
        const flag = done[o.id] ? '✓ DONE' : 'OPEN'
        return `│ • ${o.id} (${flag})\n│   Item: ${o.item} (${_metaName(o.item)})\n│   Qty : ${_fmt(o.qty)} | Pay: ${_fmt(o.payPer)}/unit | EXP +${_fmt(o.bonusExp)}`
      })
      return cht.reply(_code(
        '╭─「 FARM ORDER 」─╮\n' +
        `│ ${W.season.name} | ${W.weather}\n` +
        '├────────────────────────┤\n' +
        lines.join('\n') + '\n' +
        '├────────────────────────┤\n' +
        `│ Kirim: ${pfx}fillorder <ID>\n` +
        '╰────────────────────────╯'
      ))
    }
  )

  ev.on(
    { 
      cmd: ['fillorder'], 
      listmenu: ['fillorder <ID>'], 
      tag: 'rpg', 
      isGroup: true, 
      args: true, 
      isArgs: 'Format: .fillorder <ID>\nContoh: .fillorder F-ORD-ABCDE' 
    },
    async ({ cht, args }) => {
      const pfx = cht.prefix || '.'
      const self = _ensurePlayer(cht.sender)
      if (!self) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)
      const a = (Array.isArray(args) ? args : String(args || '').split(/\s+/)).filter(Boolean)
      const id = String(a[0] || '').trim().toUpperCase()
      const W = _getWorld()
      const ord = (W.orders || []).find(o => String(o.id).toUpperCase() === id)
      if (!ord) return cht.reply(`❌ Order tidak ditemukan.\nCek: ${pfx}farmorder`)
      const done = self.farm.daily.orderDone || {}
      if (done[ord.id]) return cht.reply(`✅ Order ini sudah kamu selesaikan hari ini.`)

      const take = _consumeAny(self, ord.item, ord.qty)
      if (!take.ok) return cht.reply(`❌ Stok kurang.\nButuh: ${ord.item} x${_fmt(ord.qty)}\nCek: ${pfx}farminv`)

      let pay = 0
      for (const t of take.take) {
        const mult = _FQ[t.q]?.mult || 1
        pay += Math.floor((Number(ord.payPer) || 0) * mult) * t.qty
      }

      self.ekonomi.uang += pay
      _skillGain(self, ord.bonusExp)
      done[ord.id] = true
      self.farm.daily.orderDone = done

      const detail = take.take.map(t => `│ • ${t.id} x${_fmt(t.qty)}`).slice(0, 8).join('\n')

      return cht.reply(_code(
        '╭─「 ORDER DONE 」─╮\n' +
        `│ ID    : ${ord.id}\n` +
        `│ Item  : ${ord.item} (${_metaName(ord.item)})\n` +
        `│ Bayar : ${_fmt(pay)}\n` +
        `│ EXP   : +${_fmt(ord.bonusExp)}\n` +
        '├────────────────────────┤\n' +
        `│ Uang  : ${_fmt(self.ekonomi.uang)}\n` +
        '├────────────────────────┤\n' +
        detail + '\n' +
        '╰────────────────────────╯'
      ))
    }
  )
 }

/*
ev.on(
  {
    cmd: ['214949818904213245321`34567890-=098765432', '14u21848190898765467890-=0987654', '149817416987768976543567890-'],
    listmenu: ['spin <taruhan>'],
    tag: 'rpg',
    isGroup: true,
    args: true,
    isArgs: 'Format: .spin <taruhan>\nContoh: .spin 10000\nBisa: .spin 10k / .spin 2m'
  },
  async ({ cht, args }) => {
    const pfx = cht.prefix || '.'
    const me = _spinGetPlayer(cht.sender)
    if (!me) return cht.reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)

    const bet = _spinParseBet(Array.isArray(args) ? args[0] : args)
    if (bet <= 0) return cht.reply(`❌ Taruhan tidak valid.\nContoh: ${pfx}spin 10k`)

    const now = Date.now()
    const cdLeft = _SPIN_CD - (now - (me.p.spin.last || 0))
    if (cdLeft > 0) {
      return cht.reply(
        '```' + '\n' +
        '╭─「 🎰 CASINO SPIN 」─╮\n' +
        `│ Cooldown: ${_spinMsToTime(cdLeft)}\n` +
        '╰─────────────────────╯\n' +
        '```'
      )
    }

    const winMult = 3
    const loseMult = 5
    const risk = bet * loseMult
    const prize = bet * winMult

    const beforeWallet = Math.floor(Number(me.p.ekonomi.uang) || 0)
    const beforeBank = Math.floor(Number(me.p.ekonomi.bank) || 0)
    const beforeDebt = Math.floor(Number(me.p.debt) || 0)

    const ensured = _spinEnsureFunds(me.p, risk)

    const wallet = Math.floor(Number(me.p.ekonomi.uang) || 0)
    const rate = _spinWinRate(bet, me.p.spin.win)
    const win = Math.random() < rate

    const delta = win ? prize : -risk
    const before = Math.floor(Number(me.p.ekonomi.uang) || 0)
    const after = Math.max(0, before + delta)

    me.p.ekonomi.uang = after
    me.p.spin.last = now
    if (win) me.p.spin.win += 1
    else me.p.spin.lose += 1

    const reels = _spinRollReels(win)
    const resultLabel = win ? 'JACKPOT ✅' : 'ZONK ❌'
    const sign = delta >= 0 ? '+' : '-'

    const bankNote = ensured.bankTaken > 0 ? `│ Bank→Dompet: +${_spinFmt(ensured.bankTaken)}\n` : ''
    const debtNote = ensured.debtTaken > 0 ? `│ Hutang dibuat: +${_spinFmt(ensured.debtTaken)}\n` : ''
    const prepBlock = (bankNote || debtNote)
      ? ('├─────────────────────┤\n' + bankNote + debtNote)
      : ''

    const afterBank = Math.floor(Number(me.p.ekonomi.bank) || 0)
    const afterDebt = Math.floor(Number(me.p.debt) || 0)

    return cht.reply(
      '```' + '\n' +
      '╭─「 🎰 CASINO SPIN 」─╮\n' +
      `│ Taruhan : ${_spinFmt(bet)}\n` +
      `│ Menang  : +${winMult}x (${_spinFmt(prize)})\n` +
      `│ Kalah   : -${loseMult}x (${_spinFmt(risk)})\n` +
      `│ Chance  : ${(rate * 100).toFixed(4)}%\n` +
      prepBlock +
      '├─────────────────────┤\n' +
      `│ Spin    : ${reels[0]} | ${reels[1]} | ${reels[2]}\n` +
      `│ Hasil   : ${resultLabel}\n` +
      `│ Impact  : ${sign}${_spinFmt(Math.abs(delta))}\n` +
      '├─────────────────────┤\n' +
      `│ Dompet  : ${_spinFmt(before)} → ${_spinFmt(after)}\n` +
      `│ Bank    : ${_spinFmt(beforeBank)} → ${_spinFmt(afterBank)}\n` +
      `│ Hutang  : ${_spinFmt(beforeDebt)} → ${_spinFmt(afterDebt)}\n` +
      `│ Record  : W ${me.p.spin.win} | L ${me.p.spin.lose}\n` +
      '╰─────────────────────╯\n' +
      '```'
    )
  }
)
*/
ev.on(
    {
      cmd: ['listrumah', 'katalogrumah'],
      listmenu: ['listrumah'],
      tag: 'rpg',
      isGroup: true
    },
    async () => {
      const pfx = cht.prefix || '.'
      const rows = _H_CLASS_ORDER.map((k, i) => {
        const c = _H_CLASS[k]
        const no = String(i + 1).padStart(2, '0')
        return [
          `#${no} ${c.label}`,
          `Harga : ${_H_fmtMoney(c.price)}`,
          `Pajak : ${_H_fmtMoney(c.tax)}/minggu`,
          `Denda : ${Math.floor(c.fineRate * 100)}% (jika telat)`,
          `Gudang: ${c.stash} slot`,
          `Sewa  : ${_H_fmtMoney(c.rent)}/6 jam`
        ].join(' | ')
      })

      return reply(
        '```' + '\n' +
        '╭─「 KATALOG RUMAH 」─╮\n' +
        rows.map(x => `│ ${x}`).join('\n') + '\n' +
        '╰────────────────────╯\n' +
        `Buy   : ${pfx}belirumah <rendah|menengah|tinggi|vip>\n` +
        `Info  : ${pfx}rumah\n` +
        `Pajak : ${pfx}bayarpajak\n` +
        '```'
      )
    }
  )

  ev.on(
    {
      cmd: ['rumah', 'house'],
      listmenu: ['rumah'],
      tag: 'rpg',
      isGroup: true
    },
    async () => {
      const pfx = cht.prefix || '.'
      const uid = sender.split('@')[0]
      const targetJid = (cht.mention && cht.mention[0]) || sender
      const targetId = targetJid.split('@')[0]

      const target = normalizePlayer(Data.rpg?.[targetId])
      if (!target) return reply(`❌ @${targetId} belum terdaftar RPG.`, { mentions: [targetJid] })

      _H_tickHouse(target)

      const r = _H_ensureHouse(target)
      if (!r.owned || !r.class || !_H_CLASS[r.class]) {
        return reply(
          '```' + '\n' +
          '╭─「 DATA RUMAH 」─╮\n' +
          `│ Pemilik : @${targetId}\n` +
          '│ Status  : Belum punya rumah\n' +
          '├────────────────────┤\n' +
          `│ Lihat katalog: ${pfx}listrumah\n` +
          `│ Beli rumah   : ${pfx}belirumah rendah\n` +
          '╰────────────────────╯\n' +
          '```',
          { mentions: [targetJid] }
        )
      }

      const cls = _H_CLASS[r.class]
      _H_recalcStashUsed(target)

      const now = Date.now()
      const nextTax = Number(r.tax.nextAt) || 0
      const unpaid = Math.floor(Number(r.tax.unpaid) || 0)

      let status = 'Aktif'
      let note = ''
      let fine = 0

      if (r.seized) {
        status = 'DISITA'
        fine = Math.floor((cls.tax + unpaid) * cls.fineRate)
        const left = Math.max(0, (Number(r.seizeUntil) || 0) - now)
        note = `Tebus <= ${_H_msToTime(left)}`
      }

      const rentReady = now - (Number(r.rent.lastClaim) || 0)
      const rentLeft = Math.max(0, _H_RENT_CD - rentReady)

      const lines = [
        `Pemilik : @${targetId}`,
        `Kelas   : ${cls.label}`,
        `Status  : ${status}${note ? ` (${note})` : ''}`,
        `Harga   : ${_H_fmtMoney(cls.price)}`,
        '────────────────────',
        `Pajak/mg: ${_H_fmtMoney(cls.tax)}`,
        `Jatuh T : ${_H_dt(nextTax)}`,
        `Tunggak : ${_H_fmtMoney(unpaid)}`,
        `Denda   : ${_H_fmtMoney(fine)}`,
        '────────────────────',
        `Gudang  : ${r.stash.used}/${cls.stash} slot`,
        `Sewa/6j : ${_H_fmtMoney(cls.rent)}`,
        `Claim   : ${rentLeft > 0 ? _H_msToTime(rentLeft) : 'Siap'}`
      ]

      const foot = [
        `Menu  : ${pfx}listrumah`,
        `Pajak : ${pfx}bayarpajak`,
        `Sewa  : ${pfx}kumpulsewa`,
        `Gudang: ${pfx}gudangrumah`
      ]

      return reply(
        '```' + '\n' +
        '╭─「 DATA RUMAH 」─╮\n' +
        lines.map(x => `│ ${x}`).join('\n') + '\n' +
        '╰────────────────────╯\n' +
        foot.join('\n') + '\n' +
        '```',
        { mentions: [targetJid] }
      )
    }
  )

  ev.on(
    {
      cmd: ['belirumah'],
      listmenu: ['belirumah <kelas>'],
      tag: 'rpg',
      isGroup: true,
      args: true,
      isArgs: 'Format: .belirumah <rendah|menengah|tinggi|vip>\nContoh: .belirumah rendah'
    },
    async ({ args }) => {
      const pfx = cht.prefix || '.'
      const uid = sender.split('@')[0]
      const self = normalizePlayer(Data.rpg?.[uid])
      if (!self) return reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)

      const r = _H_ensureHouse(self)
      _H_tickHouse(self)

      if (r.owned && r.class && _H_CLASS[r.class]) {
        return reply(`❌ Kamu sudah punya rumah.\nCek: ${pfx}rumah`)
      }

      const raw = String((args || [])[0] || '').toLowerCase().trim()
      const key = _H_CLASS[raw] ? raw : null
      if (!key) return reply(`❌ Kelas tidak valid.\nPilih: rendah | menengah | tinggi | vip\nCek: ${pfx}listrumah`)

      const cls = _H_CLASS[key]
      const pay = _H_payAuto(self, cls.price)
      if (!pay.ok) {
        const totalHave = (Number(self.ekonomi?.uang) || 0) + (Number(self.ekonomi?.bank) || 0)
        return reply(
          '```' + '\n' +
          '╭─「 BELI RUMAH 」─╮\n' +
          `│ Status : Gagal\n` +
          `│ Kelas  : ${cls.label}\n` +
          `│ Harga  : ${_H_fmtMoney(cls.price)}\n` +
          '├────────────────────┤\n' +
          `│ Uang   : ${_H_fmtMoney(self.ekonomi?.uang || 0)}\n` +
          `│ Bank   : ${_H_fmtMoney(self.ekonomi?.bank || 0)}\n` +
          `│ Total  : ${_H_fmtMoney(totalHave)}\n` +
          '╰────────────────────╯\n' +
          '```'
        )
      }

      r.owned = true
      r.class = key
      r.boughtAt = Date.now()
      r.tax.unpaid = 0
      r.tax.nextAt = Date.now() + _H_TAX_WEEK
      r.seized = false
      r.seizedAt = 0
      r.seizeUntil = 0
      r.foreclosed = false
      r.foreclosedAt = 0
      r.rent.lastClaim = 0
      r.stash.items = {}
      r.stash.used = 0

      return reply(
        '```' + '\n' +
        '╭─「 BELI RUMAH 」─╮\n' +
        `│ Status : Berhasil\n` +
        `│ Kelas  : ${cls.label}\n` +
        `│ Bayar  : ${_H_fmtMoney(cls.price)}\n` +
        '├────────────────────┤\n' +
        `│ Dompet : -${_H_fmtMoney(pay.walletTake)}\n` +
        `│ Bank   : -${_H_fmtMoney(pay.bankTake)}\n` +
        `│ Pajak  : ${_H_fmtMoney(cls.tax)}/minggu\n` +
        `│ JatuhT : ${_H_dt(r.tax.nextAt)}\n` +
        '╰────────────────────╯\n' +
        `Cek: ${pfx}rumah\n` +
        '```'
      )
    }
  )

  ev.on(
    {
      cmd: ['upgraderumah'],
      listmenu: ['upgraderumah'],
      tag: 'rpg',
      isGroup: true
    },
    async () => {
      const pfx = cht.prefix || '.'
      const uid = sender.split('@')[0]
      const self = normalizePlayer(Data.rpg?.[uid])
      if (!self) return reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)

      _H_tickHouse(self)
      const r = _H_ensureHouse(self)
      if (!r.owned || !r.class || !_H_CLASS[r.class]) return reply(`❌ Kamu belum punya rumah.\nCek: ${pfx}listrumah`)
      if (r.seized) return reply(`❌ Rumah kamu sedang DISITA.\nTebus dulu: ${pfx}bayarpajak`)
      if (r.foreclosed) return reply(`❌ Rumah kamu sudah hangus.\nBeli ulang: ${pfx}belirumah rendah`)

      const idx = _H_CLASS_ORDER.indexOf(r.class)
      if (idx < 0 || idx >= _H_CLASS_ORDER.length - 1) return reply(`✅ Rumah kamu sudah level tertinggi (VIP).`)

      const from = _H_CLASS[r.class]
      const toKey = _H_CLASS_ORDER[idx + 1]
      const to = _H_CLASS[toKey]
      const upgradeCost = Math.max(0, to.price - from.price)

      const pay = _H_payAuto(self, upgradeCost)
      if (!pay.ok) {
        return reply(
          '```' + '\n' +
          '╭─「 UPGRADE RUMAH 」─╮\n' +
          `│ Status : Gagal\n` +
          `│ Dari   : ${from.label}\n` +
          `│ Ke     : ${to.label}\n` +
          `│ Biaya  : ${_H_fmtMoney(upgradeCost)}\n` +
          '├────────────────────┤\n' +
          `│ Uang   : ${_H_fmtMoney(self.ekonomi?.uang || 0)}\n` +
          `│ Bank   : ${_H_fmtMoney(self.ekonomi?.bank || 0)}\n` +
          '╰────────────────────╯\n' +
          '```'
        )
      }

      r.class = toKey

      return reply(
        '```' + '\n' +
        '╭─「 UPGRADE RUMAH 」─╮\n' +
        `│ Status : Berhasil\n` +
        `│ Dari   : ${from.label}\n` +
        `│ Ke     : ${to.label}\n` +
        `│ Biaya  : ${_H_fmtMoney(upgradeCost)}\n` +
        '├────────────────────┤\n' +
        `│ Dompet : -${_H_fmtMoney(pay.walletTake)}\n` +
        `│ Bank   : -${_H_fmtMoney(pay.bankTake)}\n` +
        `│ Pajak  : ${_H_fmtMoney(to.tax)}/minggu\n` +
        `│ Gudang : ${to.stash} slot\n` +
        '╰────────────────────╯\n' +
        `Cek: ${pfx}rumah\n` +
        '```'
      )
    }
  )

  ev.on(
    {
      cmd: ['bayarpajak', 'pajakrumah', 'tebusrumah'],
      listmenu: ['bayarpajak'],
      tag: 'rpg',
      isGroup: true
    },
    async () => {
      const pfx = cht.prefix || '.'
      const uid = sender.split('@')[0]
      const self = normalizePlayer(Data.rpg?.[uid])
      if (!self) return reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)

      _H_tickHouse(self)
      const r = _H_ensureHouse(self)
      if (!r.owned || !r.class || !_H_CLASS[r.class]) return reply(`❌ Kamu belum punya rumah.\nCek: ${pfx}listrumah`)

      const cls = _H_CLASS[r.class]
      const now = Date.now()

      if (r.foreclosed) return reply(`❌ Rumah kamu sudah hangus.\nBeli ulang: ${pfx}belirumah rendah`)

      const unpaid = Math.floor(Number(r.tax.unpaid) || 0)
      const baseTax = Math.floor(Number(cls.tax) || 0)

      let due = baseTax
      let fine = 0

      if (r.seized) {
        fine = Math.floor((unpaid || baseTax) * cls.fineRate)
        due = (unpaid || baseTax) + fine
      } else {
        if (unpaid > 0) due = unpaid + baseTax
        else due = baseTax
      }

      const pay = _H_payAuto(self, due)
      if (!pay.ok) {
        const left = r.seized ? Math.max(0, (Number(r.seizeUntil) || 0) - now) : 0
        return reply(
          '```' + '\n' +
          '╭─「 BAYAR PAJAK RUMAH 」─╮\n' +
          `│ Status : Gagal\n` +
          `│ Kelas  : ${cls.label}\n` +
          `│ Tagihan: ${_H_fmtMoney(due)}\n` +
          '├────────────────────┤\n' +
          `│ Tunggak: ${_H_fmtMoney(unpaid)}\n` +
          `│ Denda  : ${_H_fmtMoney(fine)}\n` +
          (r.seized ? `│ Sisa   : ${_H_msToTime(left)}\n` : '') +
          '├────────────────────┤\n' +
          `│ Uang   : ${_H_fmtMoney(self.ekonomi?.uang || 0)}\n` +
          `│ Bank   : ${_H_fmtMoney(self.ekonomi?.bank || 0)}\n` +
          '╰────────────────────╯\n' +
          '```'
        )
      }

      r.tax.unpaid = 0
      r.tax.nextAt = now + _H_TAX_WEEK

      if (r.seized) {
        r.seized = false
        r.seizedAt = 0
        r.seizeUntil = 0
      }

      return reply(
        '```' + '\n' +
        '╭─「 BAYAR PAJAK RUMAH 」─╮\n' +
        `│ Status : Berhasil\n` +
        `│ Kelas  : ${cls.label}\n` +
        `│ Bayar  : ${_H_fmtMoney(due)}\n` +
        '├────────────────────┤\n' +
        `│ Dompet : -${_H_fmtMoney(pay.walletTake)}\n` +
        `│ Bank   : -${_H_fmtMoney(pay.bankTake)}\n` +
        `│ Next   : ${_H_dt(r.tax.nextAt)}\n` +
        '╰────────────────────╯\n' +
        `Cek: ${pfx}rumah\n` +
        '```'
      )
    }
  )

  ev.on(
    {
      cmd: ['kumpulsewa', 'sewarumah', 'claimsewa'],
      listmenu: ['kumpulsewa'],
      tag: 'rpg',
      isGroup: true
    },
    async () => {
      const pfx = cht.prefix || '.'
      const uid = sender.split('@')[0]
      const self = normalizePlayer(Data.rpg?.[uid])
      if (!self) return reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)

      _H_tickHouse(self)
      const r = _H_ensureHouse(self)
      if (!r.owned || !r.class || !_H_CLASS[r.class]) return reply(`❌ Kamu belum punya rumah.\nCek: ${pfx}listrumah`)
      if (r.seized) return reply(`❌ Rumah kamu DISITA.\nTebus dulu: ${pfx}bayarpajak`)

      const cls = _H_CLASS[r.class]
      const now = Date.now()
      const last = Number(r.rent.lastClaim) || 0
      const passed = now - last

      if (last && passed < _H_RENT_CD) {
        return reply(
          '```' + '\n' +
          '╭─「 SEWA RUMAH 」─╮\n' +
          `│ Status : Cooldown\n` +
          `│ Kelas  : ${cls.label}\n` +
          `│ Sisa   : ${_H_msToTime(_H_RENT_CD - passed)}\n` +
          '╰────────────────────╯\n' +
          `Cek: ${pfx}rumah\n` +
          '```'
        )
      }

      const stacks = last ? Math.max(1, Math.min(4, Math.floor(passed / _H_RENT_CD))) : 1
      const gain = Math.floor(cls.rent * stacks)

      self.ekonomi ??= { uang: 0, bank: 0 }
      self.ekonomi.uang = Math.floor(Number(self.ekonomi.uang) || 0) + gain
      r.rent.lastClaim = now

      return reply(
        '```' + '\n' +
        '╭─「 SEWA RUMAH 」─╮\n' +
        `│ Status : Berhasil\n` +
        `│ Kelas  : ${cls.label}\n` +
        `│ Claim  : x${stacks}\n` +
        `│ Dapat  : +${_H_fmtMoney(gain)}\n` +
        '├────────────────────┤\n' +
        `│ Uang   : ${_H_fmtMoney(self.ekonomi?.uang || 0)}\n` +
        '╰────────────────────╯\n' +
        `Cek: ${pfx}rumah\n` +
        '```'
      )
    }
  )

  ev.on(
    {
      cmd: ['gudangrumah', 'invrmh', 'invr'],
      listmenu: ['gudangrumah'],
      tag: 'rpg',
      isGroup: true
    },
    async () => {
      const pfx = cht.prefix || '.'
      const uid = sender.split('@')[0]
      const self = normalizePlayer(Data.rpg?.[uid])
      if (!self) return reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)

      _H_tickHouse(self)
      const r = _H_ensureHouse(self)
      if (!r.owned || !r.class || !_H_CLASS[r.class]) return reply(`❌ Kamu belum punya rumah.\nCek: ${pfx}listrumah`)
      if (r.seized) return reply(`❌ Rumah kamu DISITA.\nGudang terkunci sampai ditebus.\nCek: ${pfx}bayarpajak`)

      const cls = _H_CLASS[r.class]
      _H_recalcStashUsed(self)

      const items = r.stash.items || {}
      const keys = Object.keys(items).filter(k => (Number(items[k]) || 0) > 0).sort()
      if (!keys.length) {
        return reply(
          '```' + '\n' +
          '╭─「 GUDANG RUMAH 」─╮\n' +
          `│ Kelas : ${cls.label}\n` +
          `│ Slot  : ${r.stash.used}/${cls.stash}\n` +
          '├────────────────────┤\n' +
          '│ Gudang kosong.\n' +
          '╰────────────────────╯\n' +
          `Simpan: ${pfx}simpangudang <item> <qty>\n` +
          '```'
        )
      }

      const list = keys.slice(0, 40).map((k, i) => {
        const no = String(i + 1).padStart(2, '0')
        return `│ ${no}. ${k} x${_H_fmtMoney(items[k])}`
      }).join('\n')

      const more = keys.length > 40 ? `│ ... +${keys.length - 40} item lagi` : ''

      return reply(
        '```' + '\n' +
        '╭─「 GUDANG RUMAH 」─╮\n' +
        `│ Kelas : ${cls.label}\n` +
        `│ Slot  : ${r.stash.used}/${cls.stash}\n` +
        '├────────────────────┤\n' +
        list + (more ? `\n${more}` : '') + '\n' +
        '╰────────────────────╯\n' +
        `Simpan: ${pfx}simpangudang <item> <qty>\n` +
        `Ambil : ${pfx}ambilgudang <item> <qty>\n` +
        '```'
      )
    }
  )

  ev.on(
    {
      cmd: ['simpangudang', 'storermh'],
      listmenu: ['simpangudang <item> <qty>'],
      tag: 'rpg',
      isGroup: true,
      args: true,
      isArgs: 'Format: .simpangudang <item> <qty>\nContoh: .simpangudang kayu 10'
    },
    async ({ args }) => {
      const pfx = cht.prefix || '.'
      const uid = sender.split('@')[0]
      const self = normalizePlayer(Data.rpg?.[uid])
      if (!self) return reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)

      _H_tickHouse(self)
      const r = _H_ensureHouse(self)
      if (!r.owned || !r.class || !_H_CLASS[r.class]) return reply(`❌ Kamu belum punya rumah.\nCek: ${pfx}listrumah`)
      if (r.seized) return reply(`❌ Rumah kamu DISITA.\nGudang terkunci sampai ditebus.\nCek: ${pfx}bayarpajak`)

      const cls = _H_CLASS[r.class]
      const item = String((args || [])[0] || '').toLowerCase().trim()
      const qty = Math.floor(Number((args || [])[1]) || 0)
      if (!item) return reply(`❌ Item tidak valid.`)
      if (qty <= 0) return reply(`❌ Qty harus > 0.`)

      self.inventori ??= {}
      const have = Math.floor(Number(self.inventori[item]) || 0)
      if (have < qty) return reply(`❌ Item kurang.\nPunya: ${_H_fmtMoney(have)}`)

      _H_recalcStashUsed(self)
      const free = Math.max(0, cls.stash - (Number(r.stash.used) || 0))
      if (qty > free) return reply(`❌ Gudang penuh.\nSisa slot: ${_H_fmtMoney(free)}`)

      self.inventori[item] = have - qty
      r.stash.items[item] = Math.floor(Number(r.stash.items[item]) || 0) + qty
      _H_recalcStashUsed(self)

      return reply(
        '```' + '\n' +
        '╭─「 GUDANG RUMAH 」─╮\n' +
        `│ Status: Disimpan\n` +
        `│ Item  : ${item}\n` +
        `│ Qty   : ${_H_fmtMoney(qty)}\n` +
        '├────────────────────┤\n' +
        `│ Slot  : ${_H_fmtMoney(r.stash.used)}/${_H_fmtMoney(cls.stash)}\n` +
        '╰────────────────────╯\n' +
        `Cek: ${pfx}gudangrumah\n` +
        '```'
      )
    }
  )

  ev.on(
    {
      cmd: ['ambilgudang', 'takermh'],
      listmenu: ['ambilgudang <item> <qty>'],
      tag: 'rpg',
      isGroup: true,
      args: true,
      isArgs: 'Format: .ambilgudang <item> <qty>\nContoh: .ambilgudang kayu 10'
    },
    async ({ args }) => {
      const pfx = cht.prefix || '.'
      const uid = sender.split('@')[0]
      const self = normalizePlayer(Data.rpg?.[uid])
      if (!self) return reply(`❌ Kamu belum terdaftar di RPG.\nDaftar dulu: ${pfx}daftar`)

      _H_tickHouse(self)
      const r = _H_ensureHouse(self)
      if (!r.owned || !r.class || !_H_CLASS[r.class]) return reply(`❌ Kamu belum punya rumah.\nCek: ${pfx}listrumah`)
      if (r.seized) return reply(`❌ Rumah kamu DISITA.\nGudang terkunci sampai ditebus.\nCek: ${pfx}bayarpajak`)

      const cls = _H_CLASS[r.class]
      const item = String((args || [])[0] || '').toLowerCase().trim()
      const qty = Math.floor(Number((args || [])[1]) || 0)
      if (!item) return reply(`❌ Item tidak valid.`)
      if (qty <= 0) return reply(`❌ Qty harus > 0.`)

      const have = Math.floor(Number(r.stash.items[item]) || 0)
      if (have < qty) return reply(`❌ Gudang kurang.\nPunya: ${_H_fmtMoney(have)}`)

      r.stash.items[item] = have - qty
      self.inventori ??= {}
      self.inventori[item] = Math.floor(Number(self.inventori[item]) || 0) + qty
      _H_recalcStashUsed(self)

      return reply(
        '```' + '\n' +
        '╭─「 GUDANG RUMAH 」─╮\n' +
        `│ Status: Diambil\n` +
        `│ Item  : ${item}\n` +
        `│ Qty   : ${_H_fmtMoney(qty)}\n` +
        '├────────────────────┤\n' +
        `│ Slot  : ${_H_fmtMoney(r.stash.used)}/${_H_fmtMoney(cls.stash)}\n` +
        '╰────────────────────╯\n' +
        `Cek: ${pfx}gudangrumah\n` +
        '```'
      )
    }
  )



}
