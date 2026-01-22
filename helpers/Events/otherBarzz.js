/*!-======[ Module Imports ]======-!*/
const fs = "fs".import()
const { buildDashboardImage } = await (fol[2] + 'osDashboard.js').r()
const { downloadContentFromMessage, generateWAMessageFromContent } = "baileys".import()
const os = (await "os".import()).default

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
  const { sender, id, reply, edit, react, animate } = cht
  const { func } = Exp

  async function runSpeedTest() {
    let downloadSpeed = 0,
    uploadSpeed = 0;

    try {
      // Download ~10MB
      const dlStart = performance.now();
      const dlRes = await axios.get("https://speed.cloudflare.com/__down?bytes=10000000", {
        responseType: "arraybuffer",
        timeout: 20000,
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      const dlTime = (performance.now() - dlStart) / 1000;
      downloadSpeed = dlRes.data.byteLength / (dlTime || 1);
    } catch {
      downloadSpeed = 0;
    }

    try {
      // Upload ~1MB
      const upData = "0".repeat(1024 * 1024);
      const upStart = performance.now();
      await axios.post("https://speed.cloudflare.com/__up", upData, {
        headers: { "Content-Length": upData.length },
        timeout: 20000,
      });
      const upTime = (performance.now() - upStart) / 1000;
      uploadSpeed = upData.length / (upTime || 1);
    } catch {
      uploadSpeed = 0;
    }

    const format = (bytesPerSec) => {
      const mbps = (bytesPerSec * 8) / (1024 * 1024);
      return mbps >= 1 ? `${mbps.toFixed(2)} Mbps` : `${(mbps * 1000).toFixed(2)} Kbps`;
    };

    return { dl: format(downloadSpeed), ul: format(uploadSpeed) };
  }

  function fmtTime(sec) {
    const d = Math.floor(sec / 86400);
    const h = Math.floor((sec % 86400) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  }

  function getDiskUsageLinux() {
    // linux/unix: df -B1 / | tail -1
    const df = execSync("df -B1 / | tail -1").toString().trim().split(/\s+/);
    const total = parseInt(df[1] || "0");
    const used = parseInt(df[2] || "0");
    const pct = parseInt(String(df[4] || "0").replace("%", ""));
    return { total, used, pct: isNaN(pct) ? 0 : pct };
  }

  function getDiskUsageFallback() {
    // fallback aman: gak semua host support
    return { total: 0, used: 0, pct: 50 };
  }


/***
  ╭⌗─────────────────────────────────────────╮
  │ ▎ • Thanks to Rifza & Allah SWT.
  │ ▎ • script modified by Barr
  │ ▎ • request fitur Bella → 6282-238-228-919         
  │ ▎ • dan menyediakan apk premium                     
  │ ▎ • jangan hapus credits, mohon pengertiannya
  ╰⌗─────────────────────────────────────────╯
***/
        
  const date = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }))
  const hour = date.getHours()
  let sapaan
  if (hour >= 1 && hour < 4) {
    sapaan = "Ne tenai no? 🙃"
  } else if (hour >= 4 && hour < 11) {
   sapaan = "Ohayōgozaimasu 🌅"
  } else if (hour >= 11 && hour < 15) {
    sapaan = "Kon`nichiwa 🌄"
  } else if (hour >= 15 && hour < 18) {
    sapaan = "Kon`nichiwa 🌇"
  } else {
    sapaan = "Konbawa 🌃"
  }

  function getTime() {
    return new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
  }

  const contextInfo = {
     externalAdReply: {
       title: `❏ 𝓐𝓵𝔂𝓪 [ アリヤ ]`,
       body: `Time ${getTime()}`,
       thumbnail: fs.readFileSync(fol[3] + 'bell.jpg'),
       mediaUrl: `${cfg.gcurl}`,
       sourceUrl: `https://wa.me/${owner[0]}`,
       renderLargerThumbnail: true,
       showAdAttribution: true,
       mediaType: 1,
     },
     forwardingScore: 1999,
     isForwarded: true,
     mentionedJid: [sender],
     forwardedNewsletterMessageInfo: {
         newsletterJid: cfg.chId.newsletterJid,
         newsletterName: cfg.chId.newsletterName,
         //serverMessageId: 152
     }
  }
  
  const contextInfo2 = {
    forwardingScore: 19,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: cfg.chId.newsletterJid,
      newsletterName: cfg.chId.newsletterName,
      //serverMessageId: 152
    }
  }

  const menuCfg = cfg.menu || {}
  const tags = menuCfg.tags || {}
  const tagKeys = Object.keys(tags)
  const tagLookup = tagKeys.map(k => k.toLowerCase())

  ev.on(
    {
      cmd: ["Albert"],
      listmenu: ["Albert"],
      tag: "other"
    }, 
    async () => { 
      await react('💦')
      await ev.contactOwner('nih kontak Albert🥶')
    }
  )

  ev.on(
    {
      cmd: ['cekmasasewa', 'ceksewa'],
      listmenu: ['ceksewa'],
      tag: "other",
      isGroup: true
    },
    async () => {
      let dt = Data.preferences[id]
      let metadata = await Exp.groupMetadata(id)
    
      if (!dt.sewa) return reply("❌ Grup ini tidak memiliki masa sewa")

      let total = dt.sewa.expired - dt.sewa.now
      let left = dt.sewa.expired - Date.now() 
      if (left < 0) left = 0

      let age = func.formatDuration(left)
      let hari = age.days
      let jam = age.hours
      let menit = age.minutes

      let barLength = 10
      let progress = Math.floor((left / total) * barLength)
      let percent = Math.floor((left / total) * 100)
      let bar = `${percent}% ` + "▬".repeat(progress) + "▭".repeat(barLength - progress)

      let text = `Haii kak @${sender.split("@")[0]},\n`
      text += `berikut adalah masa sewa yang dimiliki grup ini:\n\n`
      text += `╭───( *INFO GRUP* )\n` 
      text += `┊ \n`
      text += `┊  Nama grup : ${metadata.subject}\n`
      text += `┊  Id grup   : ${id}\n`
      text += `┊  Pembuat   : @${metadata.owner.split("@")[0] || 'Tidak diketahui'}\n`
      text += `┊ \n`
      text += `╰─ ࣪ 𖥻 ๋ \n\n`
      text += `*Masa sewa tersisa*:\n`
      text += `${bar}\n`
      text += `➪ ${hari > 0 ? hari + 'd, ' : ''}${jam > 0 ? jam + 'h, ' : ''}${menit > 0 ? menit + 'm' : ''}`
      
      await Exp.sendMessage(id, {
        location: {
          degreesLatitude: -99999999,
          degreesLongitude: 999999999,
          name: "y",
          address: "y"
        },
        caption: text,
        footer: "Jika ingin menambah masa sewa silahkan klik tombol dibawah untuk mendapatkan kontak owner...",
        mentions: [sender, metadata.owner],
        buttons: [
          {
            buttonId: '.Albert',
            buttonText: { displayText: '𝙾𝚠𝚗𝚎𝚛' },
            type: 1
          }
        ],
        headerType: 4
      }, { quoted: cht })
    }
  )

  ev.on(
    {
      cmd: ['menu'],
      listmenu: ['menu'],
      tag: 'other'
    },
    async ({args}) => {
  
      await react("⏱️")
  
      let input = args.toLowerCase()
      let matchedIndex = tagLookup.indexOf(input)
      
      let matchedKey = matchedIndex !== -1 ? tagKeys[matchedIndex] : null
      let events = Data.events || {}

      let topcmd =  func.topCmd(3)
      let totalCmd = Object.keys(Data.events).length
      let totalUsr = Object.keys(Data.users).length
  
      let { processStats } = await func.getSystemStats()
      let runtimeText = processStats.runtime

      let greeting = `Hii kak @${sender.split("@")[0]} ${sapaan}.ᐟ` +
      `\nPerkenalkan namaku ${botname}` +
      `\nSemoga harimu selalu menyenangkan, yaa (˶˃ ᵕ ˂˶)` +
      `\n\n℗ = fitur khusus pengguna premium` +
      `\nuntuk akses penuh, bisa beli premium di owner ${ownername}` +
      "\n\n┈ ୨୧ ┈┈┈┈┈┈┈┈┈ ୨୧ ┈" +
      "\n꒰ ₊⁺ 𝚃𝚘𝚝𝚊𝚕 𝙵𝚒𝚝𝚞𝚛 ⁺₊ ꒱  " +
      `\n    ↳ ${totalCmd} fitur aktif` +
      `\n\n꒰ ₊⁺ 𝙵𝚒𝚝𝚞𝚛 𝙿𝚘𝚙𝚞𝚕𝚎𝚛 ⁺₊ ꒱` +
      `\n${topcmd.map(v => `    ↳ \`${v}\``).join("\n")}` +
      "\n┈ ୨୧ ┈┈┈┈┈┈┈┈┈ ୨୧ ┈\n\n"
      
      if (!input) {
        let { cpuUsage, memoryUsage, processStats } = await func.getSystemStats()
        let ram = processStats.memoryUsage.rss
        let speed = processStats.speed
        let runtimeText = processStats.runtime
        let uptime = `${runtimeText.days > 0 ? runtimeText.days + 'd ' : '' }${runtimeText.hours > 0 ? runtimeText.hours + 'h ' : ''}${runtimeText.minutes > 0 ? runtimeText.minutes + 'm ' : ''}${runtimeText.seconds > 0 ? runtimeText.seconds + 's' : ''}`
    
        let mode = cfg.public === "onlyjoingc" ? 'Only join grup' : cfg.public ? 'Public' : 'Self'
        let infoBot =  `Hii kak @${sender.split("@")[0]} ${sapaan}.ᐟ` +
        "\n\nNak tengok menu apa nih?" +
        "\nSilahkan klik tombol paling bawah dan pilih yahh~" +
        "\n\n꒰ ₊⁺ 𝙸𝚗𝚏𝚘 𝙱𝚘𝚝 ⁺₊ ꒱" +
        `\n\`\`\`   ⤷ Speed  : ${speed}` +
        `\n   ⤷ Uptime : ${uptime}` +
        `\n   ⤷ Ram    : ${ram}` +
        `\n   ⤷ Mode   : ${mode}` +
        `\`\`\`\n${ram > 1000 
          ? "\nWaduhh memory ku udah kebanyakan nih, aku harap jangan di spam yahhh :)\n" 
          : ""}` +
        "\nLuangkan waktu sejenak untuk beristirahat" +
        "\nTubuh manusia juga butuh istirahat yang cukup"
        
        let imageMessage = await func.uploadToServer(
          fs.readFileSync(fol[3] + 'bell.jpg')
        )
        
        let msg = generateWAMessageFromContent(id, {
          interactiveMessage: {
            header: {
              title: '',
              imageMessage,
              hasMediaAttachment: true,
            },
            body: {
              text: " ┈─꯭─꯭ֺ─┈      ೀ      ┈─꯭ֺ─꯭─┈"
            },
            footer: { 
              text: infoBot
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: `{"has_multiple_buttons":true}`
                },
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    title: "📔 Daftar menu",
                    sections: [
                      {
                        title: "乂 Jika duit lebih boleh lah minta dikit",
                        highlight_label: "stay halal",
                        rows: [
                          {
                            title: "☕ Donasi ke owner",
                            description: "Kamu bisa dapat pahala gede jika melakukan donasi lohhh :v", 
                            id: ".qris" 
                          },
                        ]
                      },
                      {
                        title: "乂 List harga sewa / premium / energy",
                        highlight_label: "",
                        rows: [
                          {
                            title: "💖 Sewa bot " + botname,
                            description: "Bawa " + botname + " ke grup mu, dan bisrkan dia yang menjaga nya", 
                            id: ".harga sewa" 
                          },
                          {
                            title: "💎 Harga premium",
                            description: "Dapatkan kesempatan untuk mengakses semua fitur yang tersedia dengan membeli premium", 
                            id: ".harga premium" 
                          },
                          {
                            title: "⚡ Harga energy",
                            description: "Akses fitur fitur menggunakan energy yang kamu miliki", 
                            id: ".harga energy" 
                          }
                        ]
                      },
                      {
                        title: "乂 Menu untuk seru-seruan",
                        highlight_label: "",
                        rows: [
                          { 
                            title: "🍔 Menu fun",
                            description: "Kumpulan fitur sederhana tapi bikin seru", 
                            id: ".menu fun" 
                          },
                          {
                            title: "🎮 Menu game",
                            description: "Kumpulan fitur game untuk mengisi waktu luang", 
                            id: ".menu game" 
                          },
                          {
                            title: "🗺️ Menu rpg",
                            description: "Kumpulan fitur dunia rpg/survival yang menarik", 
                            id: ".menu rpg" 
                          },
                          {
                            title: "🔮 Menu primbon",
                            description: "Kumpulan fitur yang sederhana untuk menemani rasa penasaran mu", 
                            id: ".menu primbon" 
                          },
                          {
                            title: "🎰 Menu judi",
                            description: "Kumpulan fitur taruhan (not real)", 
                            id: ".menu judi" 
                          },
                          {
                            title: "📑 Menu kata kata",
                            description: "Kumpulan fitur kata kata bijak/motivasi/bucin dan lain lainnya", 
                            id: ".menu quotes" 
                          },
                          {
                            title: "🎁 Menu hadiah dari own",
                            description: "Kumpulan hadiah dari owner ganteng",
                            id: ".menu hadiah" 
                          }
                        ]
                      },
                      {
                        title: "乂 Menu untung menyenangkan diri",
                        highlight_label: "",
                        rows: [
                          {
                            title: "🎌 Menu random pict waifu",
                            description: "Kumpulan foto foto waifu",
                            id: ".menu anime"
                          }
                        ]
                      },
                      {
                        title: "乂 Menu sosial dan komunitas",
                        highlight_label: "",
                        rows: [
                          {
                            title: "🏢 Menu group",
                            description: "Kebanyakan fturnya khusus admin grup", 
                            id: ".menu group" 
                          },
                          {
                            title: "💍 Menu relationship",
                            description: "Fitur seputar profie, pengakuan, dan hubungan", 
                            id: ".menu relationship" 
                          },
                          {
                            title: "👤 Menu owner",
                            description: "Fitur yang cuma bisa digunakan oleh para owner", 
                            id: ".menu owner" 
                          },
                          {
                            title: "🐱 Menu albert",
                            description: "Fitur yang cuma bisa digunakan oleh Albert", 
                            id: ".menu bar" 
                          },
                          {
                            title: "🎟️ Menu store",
                            description: "Fitur yang bisa dipakai untuk jualan di grup anda",
                            id: ".menu store"
                          },
                          {
                            title: "🔰 Menu layanan",
                            description: "Layanan yang tersedia di bot, seperti harga sewa, prmeium, dan energy", 
                            id: ".menu layanan" 
                          }
                        ]
                      },
                      {
                        title: "乂 Menu yang berkaitan dengan agama",
                        highlight_label: "",
                        rows: [
                          {
                            title: "🌙 Menu islamic",
                            description: "Kumpulan fitur yang berkaitan dengan agama islam", 
                            id: ".menu religion" 
                          }
                        ]
                      },
                      {
                        title: "乂 Menu dengan kecerdasan ai",
                        highlight_label: "",
                        rows: [
                          {
                            title: "🤖 Menu ai",
                            description: "Kumpulan fitur ai yang berotak senku", 
                            id: ".menu ai" 
                          },
                          {
                            title: "🎨 Menu art",
                            description: "Kumpulan fitur ai yang membantu mu mengedit foto", 
                            id: ".menu art" 
                          },
                          {
                            title: "🎙️ Menu tts",
                            description: "Kumpulan fitur untuk mengubah teks menjadi suara", 
                            id: ".menu tts" 
                          },
                          {
                            title: "🗣️ Menu voice changer",
                            description: "Kumpulan fitur pengubah suara", 
                            id: ".menu voicechanger" 
                          },
                          {
                            title: "🫧 Menu generatif ai",
                            description: "Kumpulan fitur ai yang mampu membuat gambar sesuai keinginan (munkin)", 
                            id: ".menu stablediffusion" 
                          }
                        ]
                      },
                      {
                        title: "乂 Menu yang sangat berguna",
                        highlight_label: "",
                        rows: [
                          {
                            title: "⚙️ Menu tools",
                            description: "Kumpulan fitur yang lumayan membantu hari harimu", 
                            id: ".menu tools"
                          },
                          {
                            title: "📥 Menu downloader",
                            description: "Kumpulan fitur pengunduh mendia dari tautan", 
                            id: ".menu downloader" 
                          },
                          {
                            title: "🔀 Menu pengubah media",
                            description: "Kumpulan fitur untuk mengubah jenis media yang dikirim", 
                            id: ".menu converter" 
                          },
                          {
                            title: "🖨️ Menu maker",
                            description: "Kumpulan fitur membuat sesuatu secara cepat dan instan (tapi boong)", 
                            id: ".menu maker" 
                          },
                          {
                            title: "🔎 Menu search",
                            description: "Kumpulan fitur untuk mencari foto/video dan lain lainnya", 
                            id: ".menu search" 
                          },
                          {
                            title: "📺 Menu berita",
                            description: "Kumpulan fitur yang memberikan berita terkini", 
                            id: ".menu news" 
                          },
                          {
                            title: "🙈 Menu stalking",
                            description: "Fitur untuk menguntit akun crush maupun akun mantan", 
                            id: ".menu stalking" 
                          }
                        ]
                      },
                      {
                        title: "乂 Menu yang tetap harus ada walaupun kurang guna",
                        highlight_label: "",
                        rows: [
                          {
                            title: "📂 Menu other",
                            description: "Kumpulan fitur yang memiliki info lumayan berguna", 
                            id: ".menu other" 
                          }
                        ]
                      },
                      {
                        title: "乂 Menu cerita pendek dan cerita nabi",
                        highlight_label: "",
                        rows: [
                          {
                            title: "📖 Menu story",
                            description: "Fitur yang cocok untuk yang suka cerita", 
                            id: ".menu cerita" 
                          }
                        ]
                      },
                      {
                        title: "乂 Menampilkan semua menu yang tersedia",
                        highlight_label: "",
                        rows: [
                          {
                            title: "📋 All menu",
                            description: "", 
                            id: ".allmenu" 
                          },
                        ]
                      }
                    ],
                    has_multiple_buttons: true
                  })
                },
                {
                  name: "cta_url",
                  buttonParamsJson: JSON.stringify({
                    display_text: "Laporkan Masalah",
                    url: "https://wa.me/" + owner[0],
                    merchant_url: cfg.gcurl
                  })
                }
              ],
              messageParamsJson: JSON.stringify({
                limited_time_offer: {
                  text: 'Terimaksih telah menjadi user setia ' + botname,
                  url: cfg.gcurl,
                  copy_code: cfg.gcurl,
                  expiration_time: Date.now() + func.parseTimeString('1 hari'),
                },
                bottom_sheet: {
                  in_thread_buttons_limit: 2,
                  divider_indices: [1, 2, 3, 4, 5, 999],
                  list_title: ownername + " is Here",
                  button_title: "𝐃𝐚𝐟𝐭𝐚𝐫 𝐏𝐢𝐥𝐢𝐡𝐚𝐧"
                },
                tap_target_configuration: {
                  title: "",
                  description: "bomboclard",
                  canonical_url: cfg.ig,
                  domain: "shop.example.com",
                  button_index: 0
                }
              })
            },
            contextInfo: {
              mentionedJid: [sender],
              forwardingScore: 777,
              isForwarded: true,
              externalAdReply: {
                title: "Haii kak " + cht.pushName,
                body: "",
                mediaType: 1,
                thumbnail: fs.readFileSync(fol[3] + 'bell.jpg'),
                mediaUrl: cfg.gcurl,
                sourceUrl: "",
                showAdAttribution: false,
                renderLargerThumbnail: true
              }
            }
          }
        }, { userJid: cht.sender, quoted: Data.fquoted.fbisnis })

        return await Exp.relayMessage(
          id,
          msg.message, 
          { messageId: msg.key.id }
        )
          
      }
  
      if (!matchedKey) return reply('❗ Tidak ditemukan')

      let filtered = {}
      for (const [k, v] of Object.entries(events)) {
        let tag = v.tag?.toLowerCase?.()
        if (tag === matchedKey.toLowerCase()) filtered[k] = v
      }

      if (!Object.keys(filtered).length) {
        return cht.reply(`Kategori *${matchedKey}* belum memiliki fitur.`)
      }
        
      let fitur = ''
      try {
        fitur = func.menuFormatter(filtered, { ...menuCfg, ...cht })
        fitur = fitur.split('\n').slice(1).join('\n')
      } catch {
        fitur = Object.keys(filtered).map(k => `• .${k}`).join('\n')
      }
      
      let totalFitur = Object.keys(filtered).length
      let text = greeting + `*╭──*❪ ${tags[matchedKey] || matchedKey.toUpperCase()} ❫\n${fitur}\n\nJumlah: *${totalFitur}* fitur`
      
      if (cfg?.menu_type == "gift&linkpreview" && cfg.gift.length > 0) {
        let gift = cfg.gift.getRandom()
        
        await Exp.sendMessage(
          id, 
          { video: { url: `${gift.video}` },
            gifPlayback: true,
            caption: text,
            contextInfo
          }, { quoted: Data.fquoted.fbisnis }
        )
        
        await Exp.sendMessage(
          id, 
          { audio: {  url: `${gift.audio}` },
            ptt: true,
            mimetype: "audio/mpeg"
          }
        )  
      } else {
        await Exp.sendMessage(
          id, 
          { text, contextInfo}, 
          { quoted: Data.fquoted.fbisnis }
        )
      } 
    }
  )

  ev.on(
    { 
      cmd: ['own','owner'],
      listmenu: ['owner'],
      tag: 'other'
    },
    async({cht}) => {
      await Exp.sendContacts(cht, owner)
      await reply("Nih nomor ayang Elaina 😼")
    }
  )
    
  ev.on(
    {
      cmd: ["ping", "run", "runtime"],
      listmenu: ["run"],
      tag: "other"
    },
    async () => {
    
      await reply("🚀 *Memeriksa statistik sistem...*")
    
      await sleep(1500)
      await edit("_Sabar ya, lagi cek kecepatan & kondisi server..._", keys[sender])

      const netStats = await runSpeedTest();

      // CPU + RAM
      const cpus = os.cpus();
      const cpuName = (cpus?.[0]?.model || "Unknown CPU").split(" @")[0].trim();
      const cpuSpeed = (cpus?.[0]?.speed || 0) + " MHz";
      const cpuCores = cpus.length || 1;

      const cpuLoad = os.loadavg?.()[0] ?? 0;
      const cpuPercent = Math.min(Math.floor((cpuLoad / cpuCores) * 100), 100);

      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      const memPercent = Math.round((usedMem / totalMem) * 100);

      // Disk
      let diskTotal = 0,
      diskUsed = 0,
      diskPercent = 0;
      try {
        const d = getDiskUsageLinux();
        diskTotal = d.total;
        diskUsed = d.used;
        diskPercent = d.pct;
      } catch {
        const d = getDiskUsageFallback();
        diskTotal = d.total;
        diskUsed = d.used;
        diskPercent = d.pct;
      }

      // uptime
      const botUptime = fmtTime(process.uptime());
      const serverUptime = fmtTime(os.uptime());

      // latency (simple)
      const tStart = process.hrtime();
      const diff = process.hrtime(tStart);
      const latency = (diff[0] * 1e9 + diff[1]) / 1e6;

      const buffer = buildDashboardImage({
        cpuPercent,
        cpuCores,
        cpuName,
        cpuSpeed,
        memPercent,
        usedMem,
        totalMem,
        freeMem,
        diskPercent,
        diskUsed,
        diskTotal,
        latency,
        netStats,
        botUptime,
        serverUptime,
      });
   
      await sleep(1500)
      await edit("✅ Pengambilan statistik sistem selesai", keys[sender])
    
      await Exp.sendMessage(
        id,
        {
          image: buffer,
          caption: `*Dasbor Pemantauan Sistem*`,
          contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: cfg.chId.newsletterJid,
              newsletterName: cfg.chId.newsletterName
            }
          }
        }, { quoted: cht }
      )
    }
  )
  
  ev.on(
    {
      cmd: ['totalfitur'],
      listmenu: ['totalfitur'],
      tag: "other"
    }, 
    async () => {
      let totalCmd = Object.keys(Data.events).length
      let respon = `乂  *T O T A L  F I T U R*\n\n` +
      `⫹⫺ terdapat \`${totalCmd}\` fitur\n\n` +
      `- Gunakan .menu untuk melihat fitur yang tersedia` 

      Exp.sendMessage(
        id,
        {
          text: respon,
          contextInfo
        }, { quoted: cht }
      )
    }
  )

  ev.on(
    {
      cmd: ['request','req'],
      listmenu: ['request'],
      tag: "other",
      args: "*❗ Masukkan request san anda*"
    },
    async ({ args }) => {
      let chId = cfg.chId.newsletterJid
      let text = `乂 *R E Q U E S T*\n\`\`\`\n` +
      `• Nama   : ${cht.pushName}\n` +
      `• Nomor  : wa.me/${sender.split("@")[0]}\n` +
      `• Waktu  : ${getTime()}\n` +
      `• Pesan  :\`\`\`\n- ${args}\n\n` +
      `_Terima kasih atas perhatian dan kerjasamanya. Kami akan segera memproses permintaan ini dan menghubungi Anda kembali. Jika ada pertanyaan lebih lanjut, jangan ragu untuk menghubungi kami_`
      
      try {
        await Exp.sendMessage(
          chId, 
          {
            text,
            contextInfo: contextInfo2
          }
        )

        await Exp.sendMessage(
          id, 
          {
            text: `✅ Request berhasil dikirim ke channel resmi *${botnickname}*\n\nuntuk melihat request yang dikirim silahkan ikuti salurannya ⬇️`,
            contextInfo: contextInfo2
          }, { quoted: cht }
        )
        
      } catch (e) {
        return reply(
          "Gagal mengirim request\n\n*Error*:\n" + e
        )
      }
    }
  )

  ev.on(
    {
      cmd: ['rulesbot', 'aturanbot'],
      listmenu: ['rulesbot'],
      tag: "other"
    },
    async () => {
      let teks = `┏━━━°❀ ❬ *Rules ${botnickname} ArtificialIntelligence* ❭ ❀°━━━┓

1. ✧ *Dilarang Melakukan Spam Kepada Bot*, Jika Ketahuan Akan Di Banned.

2. ✧ Jika Bot Tidak Menjawab 1x, Silahkan Dicoba Lagi. Tapi Jika Bot Tidak Menjawab 2x, Itu Artinya Delay, Jangan Dipakai Dulu.

3. ✧ *Jangan Spam Bot, Kalau Belum Donasi, Sadar Diri Aja Makenya* :)

4. ✧ Jika Limit Habis, Silahkan Bermain Game Untuk Mendapatkan Exp. Contoh Game: Tebak-Tebakan, RPG Game, dll.

5. ✧ *Dilarang Mengirim Virtex/Bug Ke Bot*, Walaupun Tidak Ada Efeknya :v

6. ✧ *Dilarang Keras Menelpon Bot*, Jika Menelpon Akan Otomatis Diblokir.

7. ✧ Jika Tidak Mengerti Cara Menggunakan Bot, Silahkan Bertanya Pada Member Lain. Atau Jika Belum Join Group Bot, Ketik #gcbot Dan Masuk Group Bot.

8. ✧ Jika Ada Fitur Error/Tidak Mengerti Cara Menggunakannya, Silahkan Laporkan/Tanyakan Kepada Owner.

9. ✧ Jika Bot Delay, Jangan Di Spam Terlebih Dahulu.

┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`

      Exp.sendMessage(
        id,
        {
          text: teks,
          contextInfo
        }, { quoted: cht }
      )
    }
  )
}