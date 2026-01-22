const fs = "fs".import()
const path = 'path'.import()
const crypto = await "crypto".import()
const baileys = 'baileys'.import()
const chalk = 'chalk'.import()
const pino = 'pino'.import()
const { makeWASocket, Browsers, useMultiFileAuthState } = baileys

export default async function on({ cht, Exp, store, ev, is }) {
  const { sender, id, reply, edit } = cht
  const { func } = Exp
   
  cfg.setpanel ??= {}
  let panel = cfg.setpanel

  function tanggal(ms) {
    const formatWIB = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })

    return formatWIB.format(new Date(ms))
  }

  function getBarzz918() {
    return new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
  }

  let contextInfo = {
    externalAdReply: {
      title: `❏ 𝓐𝓵𝔂𝓪 [ アリヤ ]`,
      body: `Time ${getBarzz918()}`,
      thumbnail: fs.readFileSync(fol[10] + 'thumb1.jpg'),
      mediaUrl: cfg.gcurl,
      sourceUrl: `https://wa.me/${owner[0]}`,
      renderLargerThumbnail: false,
      showAdAttribution: true,
      mediaType: 2,
    },
    forwardingScore: 1999,
    isForwarded: true,
  }
  
  
  let contextInfo2 = {
    forwardingScore: 1,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: cfg.chId.newsletterJid,
      newsletterName: cfg.chId.newsletterName,
      //serverMessageId: 152
    }
  }

  
  let panduan = "Berikut opsi yang tersedia:\n\n" +
    " ⃘✿ ." + cht.cmd + " create\n" +
    " ⃘✿ ." + cht.cmd + " list\n" +
    " ⃘✿ ." + cht.cmd + " del\n" +
    " ⃘✿ ." + cht.cmd + " info\n" +
    " ⃘✿ ." + cht.cmd + " admin, list\n" +
    " ⃘✿ ." + cht.cmd + " admin, del\n" +
    " ⃘✿ ." + cht.cmd + " admin add\n\n" +
    "Contoh\n" +
    "." + cht.cmd + " del, <id_panel>\n" +
    "." + cht.cmd + " info, <id_panel>\n"
    
  let own = owner[0] + from.sender
  
  ev.on(
    {
      cmd: ['addsewa', 'delsewa'],
      listmenu: ['addsewa', 'delsewa'],
      tag: "bar"
    },
    async ({ args } ) => {
      if (sender !== own) return reply(
        "🧢 Malas bngttt"
      )
      
      if (cht.cmd === "addsewa") {
        let [url, dur, bns] = args.split(' ')
        
        if (!url || !dur || !bns) return reply(
          "❗ Sema data harus lengkap, mulai dari link grup durasi dan bonus yang akan di berikan\n\n" +
          "*CONTOH*:\n" +
          ".addsewa <url> <durasi> <bonus>"
        )
        
        let linkGc = url.split('/').slice(-1)?.[0]?.split('?')?.[0]
        let durasi = func.parseTimeString(dur)
        let bonus = parseInt(bns)
        
        let expired = Date.now() + durasi
        let formatDur = func.formatDuration(durasi)
        
        try {
          let info = await Exp.groupGetInviteInfo(linkGc)

          if (info.joinApprovalMode) {
            return reply(
              "❗ Persetujuan admin di grup tersebut aktif, mohon infokan kepada adminya untuk menonaktifkan persetujuan admin untuk sementara"
            )
          } else {
            await Exp.groupAcceptInvite(linkGc)
          }
          
          let data = await Exp.groupMetadata(info.id)
          let allMem = data.participants.map(p => p.id)
          let dataGc = Data.preferences[data.id] || {}
          
          if (!dataGc?.sewa) dataGc.sewa = {}
          
          dataGc.sewa = {
            id: data.id,
            url,
            now: Date.now(),
            expired,
            bonus,
            claim: []
          }
          
          Data.preferences[data.id] = dataGc;
          
          let teks = "乂  *A D D  S E W A*\n\n" +
          "✅ Berhasil menambahkan durasi sewa ke grup tersebut, berikut sedikit informasi dari grupnya\n\n" +
          `╭────( *${botfullname.toUpperCase()}* )\n` +
          "┊```\n" + 
          `┊  Nama grup : ${data.subject}\n` +
          `┊  Id grup   : ${data.id}\n` +
          `┊  Pembuat   : wa.me/${data.owner.split("@")[0] || "Telah out"}\n` +
          "┊```\n" +
          "╰─_-_-_-_-_-_-\n\n" +
          `Grup tersebut di berikan *${bonus} bonus premium gratis💎*, dan cuma admin yang bisa claim bonus tersebut\n\n` +
          "_Terimakasihh owner baiikk..._"
          
          let text = `👋 Halo semua!\n` +
          `Aku adalah bot *${botnickname}* yang bakal stay di grup ini selama ${formatDur.days} hari ke depan. Salam kenal yaa~\n\n` +
          `*📝 Catatan*:\n` +
          `- Grup ini punya *${bonus} bonus premium gratis*, cara mengambil nya cukup ketik *.claim*\n` +
          `- Buat lihat semua fitur yang tersedia, ketik *.menu*\n` +
          `- Buat cek masa sewa grup ini, ketik *.ceksewa*\n` +
          `- Buat lihat info lengkap tentang grup, ketik *.infogc*\n` +
          `- Kalau masih bingung, silakan hubungi owner langsung\n` +
          `- Untuk fitur keamanan grup, ketik *.on* (contoh: *.on antitagsw*)\n` +
          `   ➝ buat matikan, cukup ketik *.off antitagsw*\n\n` +
          `_✨ Terimakasih sudah menyewa bot *${botnickname}*. Dukung terus biar bot ini tetap aktif dengan cara perpanjang sewa atau donasi seikhlasnya. Kalau mau nambah durasi sewa atau ada kendala, hubungi owner: wa.me/${owner[0]}_`
          
          await Exp.sendMessage(
            id,
            {
              text: teks,
              contextInfo
            }, { quoted: cht }
          )
          
          await Exp.sendMessage(
            data.id,
            {
              text,
              contextInfo: {
                ...contextInfo2,
                mentionedJid: allMem
              }
            }
          )
          
        } catch (e) {
          return reply(
            "Gagal menambah durasi sewa ke grup tersebut \n\n*Error*:\n" + e
          )
        }
      
      }
      
      if (cht.cmd === "delsewa") {
        let [url, act] = args.split(' ')
  
        if (!url || !act) return reply(
          "❗ Link gc atau ID grup dan action perlu di isi\n\n" +
          "*CONTOH*:\n" +
          ".delsewa <url/id> <out/tetap>"
        )
  
        let tipeAct = ['out', 'tetap']
        if (!tipeAct.includes(act)) return reply(
          "❗ Pilih ingin hapus data sewa lalu out atau tetap di grup tersebut?\n\n" +
          "`out` ➟ Untuk hapus data sewa dan keluar dari gc\n" +
          "`tetap` ➟ Untuk hapus data sewa tetapi bot masih berada di gc"
        )

        let gcId
        if (url.endsWith('@g.us')) {    
          gcId = url
          
        } else if (url.includes('whatsapp.com')) {
          let linkGc = url.split('/').slice(-1)?.[0]?.split('?')?.[0]
          let info = await Exp.groupGetInviteInfo(linkGc)
          
          if (!info?.id) return reply(
            "❗ Link undangan grup tidak valid"
          )
          
         gcId = info.id
         
        } else {
          return reply(
            "❗ Masukkan ID grup yang valid atau link undangan"
          )
        }

        let dataGc = Data.preferences[gcId] || {}
        let data = await Exp.groupMetadata(gcId)
        let allMem = data.participants.map(p => p.id)
        
        let teksOut = "乂  *D E L  S E W A*\n\n" +
        "👋 Bye bye semuanya, " + botnickname + " akan keluar dari grup ini dengan alasan *penghapusan masa sewa di grup ini*, senang bisa bertemu kalian semua..."
        
        if (!dataGc?.sewa) return reply(
          "❗ Grup tersebut belum memiliki data sewa"
        )

        if (act === "out") {
          await Exp.sendMessage(
            gcId,
            {
              text: teksOut,
              contextInfo: {
                ...contextInfo2,
                mentionedJid: allMem
              }
            }
          )
          
          await sleep(2500)
          
          delete dataGc.sewa
          await Exp.groupLeave(gcId)
        }

        if (act === "tetap") {
          delete dataGc.sewa
        }

        return reply(
          "✅ Berhasil menghapus grup tersebut dari data sewa"
        )
      }
    }
  )
  
  ev.on(
    {
      cmd: ['autobackup'],
      listmenu: ['autobackup'],
      tag: "bar"
    },
    async () => {
      if (sender !== own) return reply(
        "🧢 Malas bngttt"
      )
      
      if (typeof cfg.autobackup !== "object") {
        cfg.autobackup = { status: false, lastDay: null }
      }

      let bb = cht.q.toLowerCase()
      if (!['on', 'off'].includes(bb)) {
        return cht.reply(
          `❗ Pilih mode yang bener bang\n\n` +
          `Contoh:\n.autobackup on\n.autobackup off\n\n` +
          `ℹ️ Status sekarang: ${cfg.autobackup.status ? '✅ ON' : '❌ OFF'}`
        )
      }

      cfg.autobackup.status = bb === 'on'
      reply(
        `✅ Berhasil *me${cfg.autobackup.status ? "ngaktifkan" : "nonaktifkan"}* auto backup`
      )
    }
  )
  
  ev.on(
    {
      cmd: ['fileset'],
      listmenu: ['fileset'],
      tag: "bar",
      args: `\n\`[ CARA MENGUNAKAN NYA ]\`\n\n*CONTOH*:\n- .${cht.cmd} fun\n> Ini bakal menambahkan file js di */helpers/Events/* dengan nama *fun.js*, dan jika file tersebut sudah ada maka file *fun.js* bakal di perbarui dengan dokumen yang lu kasih ke ${botnickname}\n`,
      media: {
        type: ['document']
      }
    }, async ({ media, args }) => {
      if (sender !== own) return reply(
        "🧢 Malas bngttt"
      )

      let name = args.trim()
      let fullPath = `./helpers/Events/${name}.js`
      let content = (await cht.quoted.download()).toString('utf8')
      let fileExists = fs.existsSync(fullPath)
      fs.writeFileSync(fullPath, content, 'utf8')

      return reply(fileExists
        ? `✅ File *${name}* berhasil diperbarui.`
        : `✅ File *${name}* berhasil ditambahkan.`
      )
    }
  )

  ev.on(
    {
      cmd: ['filedel'],
      listmenu: ['filedel'],
      tag: "bar"
    },
    async ({ args }) => {
      if (sender !== own) return reply(
        "🧢 Malas bngttt"
      )
      
      if (!args) return reply(
        `\`[ CARA MENGUNAKAN NYA ]\`\n\n` +
        `*CONTOH*:\n` +
        `- .${cht.cmd} fun\n` +
        `> Ini bakal menghapus file dengan nama *fun.js* di */helpers/Events/*`
      )

      const name = args.trim()
      const fullPath = `./helpers/Events/${name}.js`

      if (!fs.existsSync(fullPath)) return reply(
        `❗ File *${name}* tidak ditemukan`
      )
      
      fs.unlinkSync(fullPath)
      return reply(
        `✅ File *${name}* berhasil dihapus.`
      )
    }
  )
  
  ev.on(
    {
      cmd: ['fileget'],
      listmenu: ['fileget'],
      tag: 'bar',
      isOwner: true,
      args: "*❗ Berikan jalur file nya seperti toolkit/config.json*"
    },
    async ({ args }) => {
      if (sender !== own) return reply(
        "🧢 Malas bngttt"
      )
      
      try {
        let fullPath = path.resolve(args)

        if (!fs.existsSync(fullPath)) {
          return reply(
            `❗ File *${args}* tidak ditemukan.`
          )
        }

        let buffer = fs.readFileSync(fullPath)
        let ext = path.extname(fullPath).toLowerCase()

        let mimeMap = {
          '.json': 'application/json',
          '.js': 'application/javascript',
          '.py': 'text/x-python',
          '.txt': 'text/plain',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.pdf': 'application/pdf'
        }

        let mimetype = mimeMap[ext] || 'application/octet-stream'

        await Exp.sendMessage(
          id, 
          {
            document: buffer,
            fileName: path.basename(fullPath),
            mimetype
          }, 
          { quoted: cht }
        )
        
        await reply(
          "✅ Berhasil mengirim file " + path.basename(fullPath)
        )
        
      } catch (e) {
        return reply(
          "Gagal mengambil file\n\n*Error*: \n" + e
        )
      }
    }
  )
  
  ev.on(
    {
      cmd: [
        'extend', 'perpanjang',
        'swap', 'menukar'
      ],
      listmenu: ['extend', 'swap'],
      tag: "bar"
    },
    async ({ args }) => {
      if (sender !== own) return reply(
        "🧢 Malas bngttt"
      )
      
      if (['extend', 'perpanjang'].includes(cht.cmd)) {
        if (!args) return reply(
          "❗ Masukkan link grup dan durasinya\n\n" +
          "*CONTOH*:\n" +
          ".perpanjang <link grup> <durasi>"
        )
        
        let [url, drs] = args.split(' ')
        if (!url || !drs) return reply(
          "❗ Masukkan link grup dan durasinya"
        )
        
        let linkGc = url.split('/').slice(-1)?.[0]?.split('?')?.[0]
        let durasi = func.parseTimeString(drs)
        
        let info = await Exp.groupGetInviteInfo(linkGc)
        let data = await Exp.groupMetadata(info.id)
        let allMem = data.participants.map(p => p.id)
        
        let { id: idGc } = data
        let dtGc = Data.preferences[idGc] || {}
        
        if (!dtGc.sewa) return reply(
          "❌ Grup tersebut nelum memiliki data sewa"
        )
        
        let formatDur = func.formatDuration(durasi)
        
        dtGc.sewa.expired += durasi
        
        let text = "乂  *I N F O R M A S I*\n\n" +
        `🎉 Yeyy masa sewa grup ini telah di perpanjang, bot ${botnickname} akan tinggal di grup ini selama ${formatDur.days} hari lagi...\n\n` +
        `_✨ Terimakasih... Dukung kami terus dengan cara memperpanjang sewa atau memberikan donasi seikhlasnya agar bot ini tetap bisa aktif dan berkembang. Jika ada kendala silahkan hubungi owner: wa.me/${owner[0]}_`
        
        await Exp.sendMessage(
          idGc,
          {
            text,
            contextInfo: {
              ...contextInfo2,
              mentionedJid: allMem
            }
          }, { quoted: Data.fquoted.fbisnis }
        )
        
        return reply(
          `✅ Berhasil menambahkan durasi sewa selama *${formatDur.days} hari*`
        )
      }
      
      if (['swap', 'menukar'].includes(cht.cmd)) {
        if (!args) return reply(
          "❗ Masukkan 2 link grup yang ingin ditukar\n\n" +
          "*CONTOH*:\n" +
          ".menukar <link grup lama> <link grup baru>"
        )
      
        let [url1, url2] = args.split(' ')
        if (!url1 || !url2) return reply(
          "❗ Masukkan kedua link grup dengan benar"
        )
      
        try {
          let linkGc1 = url1.split('/').slice(-1)?.[0]?.split('?')?.[0]
          let linkGc2 = url2.split('/').slice(-1)?.[0]?.split('?')?.[0]
          
          let info1 = await Exp.groupGetInviteInfo(linkGc1)
          let info2 = await Exp.groupGetInviteInfo(linkGc2)
        
          let data1 = await Exp.groupMetadata(info1.id)
          let data2 = await Exp.groupMetadata(info2.id)
        
          let allMem1 = data1.participants.map(p => p.id)
          let allMem2 = data2.participants.map(p => p.id)
        
          let Gc1 = Data.preferences[data1.id]
          let Gc2 = Data.preferences[data2.id] || {}

          if (!Gc1.sewa) return reply(
            "❌ Grup sebelumnya belum memiliki data sewa"
          )
        
          let {
            id: idGc,
            now, 
            expired,
            bonus 
          } = Gc1.sewa
        
          if (info2.joinApprovalMode) {
            return reply(
              "❗ Persetujuan admin di grup baru tersebut aktif, mohon infokan kepada adminya untuk menonaktifkan persetujuan admin untuk sementara"
            )
          } else {
            await Exp.groupAcceptInvite(linkGc2)
          }
        
          let durasiMs = expired - Date.now()
          let formatDur = func.formatDuration(durasiMs)
        
          let teks1 = "乂  *P E R T U K A R A N*\n\n" +
          "🔄 Melakukan pertukaran grup...\n\n" +
          "Byee semuanya aku akan pindah grup, karena seseorang yang menyewa ingin menukar grupnya, terimakasih kasih telah menerima ku disini😊\n\n" +
          "_See you next time, kita pasti akan bertemu lagi, karena bumi itu bulat_"
        
          let text = `👋 Haii...\n` +
          `Aku adalah bot *${botnickname}* yang akan berada di grup ini selama ${formatDur.days} hari, salam kenal yahhh...\n\n` +
          `*CATATAN*:\n` +
          `- Jika ingin melihat daftar fitur yang tersedia silahkan ketik *.menu*\n` +
          `- Jika ingin melihat masa sewa grup ini silahkan ketik *.ceksewa*\n` +
          `- Jika masih bingung silahkan hubungi owner aja\n` +
          `- Untuk mengaktifkan fitur keamanan grup silahkan ketik *.on* ntar bakalan muncul semua opsinya dan cara aktifkan nya gini *.on antitagsw*, cara nonaktifkan nya gini *.off antitagsw*\n\n` +
          `_✨ Terimakasih telah melakukan order sewa bot ${botnickname}, dukung kami terus dengan cara memperpanjang sewa atau memberikan donasi seikhlasnya agar bot ini tetap bisa aktif dan berkembang. Jika ingin nambah durasi sewa atau ada kendala silahkan hubungi owner: wa.me/${owner[0]}_`
          
          await Exp.sendMessage(
            data1.id,
            {
              text: teks1,
              contextInfo: {
                ...contextInfo2,
                mentionedJid: allMem1
              }
            }, { quoted: Data.fquoted.fbisnis }
          )

          await sleep(2500)
          await Exp.groupLeave(data1.id)
        
          Gc2.sewa = {
            id: idGc,
            url: url2,
            now,
            expired,
            bonus,
            claim: []
          }
        
          delete Gc1.sewa
        
          await Exp.sendMessage(
            data2.id,
            {
              text,
              contextInfo: {
                ...contextInfo2,
                mentionedJid: allMem2
              }
            }
          )
        
          return reply(
            "✅ Berhasil menukar data grup lama ke grup baru"
          )
          
        } catch (e) {
          return reply(
            "Gagal menukar data sewa grup\n\n*Error*:\n" + e
          )
        }
      }
    }
  )

  ev.on(
    {
      cmd: ["jadibot"],
      tag: "owner",
      listmenu: ["jadibot"],
      isOwner: true
    },
    async ({ args }) => {
      if (sender !== own) return reply("🧢 Malas bngttt")
    
      Data.jadiBot ??= {}
      
      if (!global.jadibot) {
        global.jadibot = (await `${fol[2]}jadibot.js`.r()).default;
      }

      if (!args) return reply(
        "❗ Berikan input seperti dibawah:\n\n" +
        "Contoh\n" +
        ".jadibot nomor_bot, nomot_utama, expired\n" +
        ".jadibot 628xxxxxx, 628xxxxxx, 5hari\n\n" +
        "Sedikit catatan:\n" +
        "- nomor_bot = nomor yang akan jadi bot\n" +
        "- nomor_utama = nomor yang akan di beri info jika masa bot udah berakhir"
      )
  
      let [bot, ownrbt, hari] = args.split(",").map(a => a.trim())

      let onbot = await Exp.onWhatsApp(bot)
      let onown = await Exp.onWhatsApp(ownrbt)
      if (onbot.length < 1 || onown.length < 1)
        return reply("❗ Nomor bot / owner tidak terdaftar di WhatsApp")


      await reply("🔗 *Mode Jadibot*\nSedang menyiapkan pairing...");

      await global.jadibot(bot, ownrbt, hari, async (ev) => {
        if (ev.type === "qr") {
          await reply("📱 *Scan QR Jadibot*\n\n" + ev.data);
        }

        if (ev.type === "pairing") {
          await reply(
            "🔑 *Kode Pairing Jadibot*\n```" + ev.data + "```"
          );
        }

        if (ev.type === "ready") {
          await reply("✅ *Jadibot berhasil tersambung*");
        }

        if (ev.type === "error") {
          await reply("❌ Pairing gagal:\n" + ev.data);
        }

        if (ev.type === "fatal") {
          await reply("💥 Error sistem:\n" + ev.data);
        }
      });
    }
  );

  ev.on(
    {
      cmd: ['botlist', 'listbot'],
      listmenu: ['listbot'],
      tag: "bar",
      isOwner: true
    }, 
    async () => {
      if (sender !== own) return reply("🧢 Malas bngttt")
    
      try {
        const bots = Data.jadiBot || {}
        const totalBots = Object.keys(bots).length
      
        if (totalBots === 0) {
          return reply("📭 Tidak ada bot yang aktif saat ini")
        }
    
        let text = "📋 *DAFTAR BOT YANG AKTIF*\n\n"
        text += `Total ${totalBots} bot\n\n`
    
        let index = 1
        const now = Date.now()
    
        for (const [botNumber, botData] of Object.entries(bots)) {
          if (!botData) continue
        
          const expired = botData.expired
          const expiredAt = new Date(expired).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
        
          const timeLeft = expired - now
          const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
          const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

          let timeLeftText = ''
          if (daysLeft > 0) timeLeftText = `${daysLeft} hari ${hoursLeft} jam`
          else if (hoursLeft > 0) timeLeftText = `${hoursLeft} jam`
          else timeLeftText = 'Kurang dari 1 jam'

          const sessionPath = fol[8] + `jadibot-${botNumber}/creds.json`
          const status = fs.existsSync(sessionPath) ? '🟢 Aktif' : '🟡 Pairing / Belum Login'

          text += `*${index}.* ${botNumber}\n`
          text += `  ├ Status: ${status}\n`
          text += `  ├ Owner: ${botData.own}\n`
          text += `  ├ Expired: ${expiredAt}\n`
          text += `  └ Sisa: ${timeLeftText}\n\n`
      
          index++
        }
    
        text += "\n_ℹ️ Gunakan *.stopbot 628xxxxx* untuk menghentikan bot sebelum expired_"
    
        return reply(text)
    
      } catch (e) {
        console.error(e)
        return reply("Terjadi kesalahan saat mengambil daftar bot.\n\n*Error:*\n" + e)
      }
    }
  )

  ev.on(
    {
      cmd: ['stopbot'],
      listmenu: ['stopbot'],
      tag: "bar",
      isOwner: true,
      args: "❗ Berikan nomor bot yang ingin dihentikan.\nContoh: *.stopbot 628xxxxxx*"
    }, 
    async ({ args }) => {
      if (sender !== own) return reply("🧢 Malas bngttt")
  
      const botNumber = args.trim()
      const bots = Data.jadiBot || {}
  
      if (!bots[botNumber]) {
        return reply(`❌ Bot dengan nomor *${botNumber}* tidak ditemukan atau sudah tidak aktif`)
      }
  
      try {
        const botData = bots[botNumber]
        const sessionPath = path.resolve(fol[8], `jadibot-${botNumber}`)

        if (fs.existsSync(sessionPath)) {
          fs.rmSync(sessionPath, { recursive: true, force: true })
          console.log(`[STOPBOT] Session deleted for ${botNumber}`)
        }

        delete Data.jadiBot[botNumber]

        const textToBotOwner =
          "‼️ *BOT ANDA TELAH DINONAKTIFKAN*\n\n" +
          `Nomor Bot : ${botNumber}\n` +
          "Alasan : *Dihentikan oleh Owner Utama*\n" +
          "\n_Terima kasih telah menggunakan layanan jadi bot._"
    
        await Exp.sendMessage(botData.own + from.sender, { text: textToBotOwner })
    
        const successText =
          "✅ *Bot Berhasil Dihentikan*\n" +
          `Bot: ${botNumber}\n` +
          `Owner: ${botData.own}\n\n` +
          "_Session telah dihapus dan bot otomatis disconnect._"
    
        return reply(successText)
    
      } catch (e) {
        console.error(`[STOPBOT] Error stopping bot ${botNumber}:`, e)
        return reply(`Gagal menghentikan bot *${botNumber}*\nError: ${e.message}`)
      }
    }
  )
  
  ev.on(
    {
      cmd: ['setlinkgc'],
      listmenu: ['setlinkgc'],
      tag: "bar",
      args: "*❗ Berikan link grupnya*"
    },
    async () => {
      if (sender !== own) return reply(
        "🧢 Malas bngttt"
      )
      
      let gc = cht.q.split("?")[0]
      if (!cfg.gcurl) cfg.gcurl = ""
      
      cfg.gcurl = gc
      return reply(
        "✅ Berhasil memperbarui link grup resmi bot"
      )
    }
  )
  
  ev.on(
    {
      cmd: ['listsewa'],
      listmenu: ['listsewa'],
      tag: "bar"
    },
    async () => {
      if (sender !== own) return reply("🧢 Malas bngttt")
    
      try {
        let prefs = Data.preferences || {}
        let teks = `乂  *D A F T A R  S E W A*\n\n`
        let no = 1

        for (const [gid, pref] of Object.entries(prefs)) {
          if (!pref?.sewa) continue

          let metadata
          try {
            metadata = await Exp.groupMetadata(gid)
          } catch {
            metadata = { subject: "Tidak diketahui" }
          }

          let expired = pref.sewa.expired 
            ? new Date(pref.sewa.expired).toLocaleString("id-ID") 
            : "-"

          let url = pref.sewa.url
          if (!url) {
            try {
              let invite = await Exp.groupInviteCode(gid)
              url = `https://chat.whatsapp.com/${invite}`
              pref.sewa.url = url
            } catch {
              url = "-"
            }
          } // lakukan falback ke masa sewa sebelumnya, karena sebelumnya data url belum ada di database grup

          teks += `*${no++}. ${metadata.subject}*\n`;
          teks += `   • Url grup : ${url}\n`;
          teks += `   • ID grup : ${gid}\n`;
          teks += `   • Expired : ${expired}\n\n`;
        }

        if (no == 1) teks += `❌ Tidak ada grup dengan sewa aktif.`;

        await Exp.sendMessage(
          id,
          {
            text: teks,
            contextInfo
          },
          { quoted: cht }
        )
    
      } catch (e) {
        reply(
          "Gagal mendapatkan data semua grup\n\n*Error*:\n" + e
        )
      }
    }
  )
  
  ev.on(
    { 
      cmd: ['panel'],
      listmenu: ["panel"],
      tag: "bar",
      isOwner: true,
      args: panduan
    },
    async ({ args }) => {
      if (sender !== own) return reply("🧢 Malas bngttt")
      if (!Object.keys(cfg.setpanel).length) return reply('Silahkan set data servernya terlebih dahulu dengan perintah `.setpanel`')
      
      let [ops, inp, inp2, inp3] = args.split(',').map(v => v.trim())
      if (!ops) return reply(panduan)
      
      let panel = cfg.setpanel
      let domain = panel.domain
      let apikey = panel.apikey
      let capikey = panel.capikey
      
      let opsi = ops.toLowerCase()
      if (opsi == "create") {
        let listgb =  ["1gb","2gb","3gb","4gb","5gb","6gb","7gb","8gb","9gb","10gb","unli"]
        if (!inp || !inp2 || !inp3) return reply("❗ Memory, username dan nomor buyer harus terisi\n\nContoh buat panel\n.panel create, 10gb, name, 62xxxxxx")
        
        if (!listgb.includes(inp)) return reply("❗ Memory yang tersedia mulai 1gb - 10gb & unli")
     
        let onWa = await Exp.onWhatsApp(inp3)
          if (onWa.length < 1) return reply("❗ Nomor tersebut tidak terdaftar di whatsapp")
          
        let gb = inp.toLowerCase()
        let username = inp2.trim()
        let buyer = inp3 + from.sender
        
        const resourceMap = {
          "1gb": { ram: 1024, disk: 1024, cpu: 30 },
          "2gb": { ram: 2048, disk: 2048, cpu: 50 },
          "3gb": { ram: 3072, disk: 3072, cpu: 70 },
          "4gb": { ram: 4096, disk: 4096, cpu: 90 },
          "5gb": { ram: 5120, disk: 5120, cpu: 110 },
          "6gb": { ram: 6144, disk: 6144, cpu: 125 },
          "7gb": { ram: 7168, disk: 7168, cpu: 150 },
          "8gb": { ram: 8192, disk: 8192, cpu: 170 },
          "9gb": { ram: 9216, disk: 9216, cpu: 180 },
          "10gb": { ram: 10240, disk: 10240, cpu: 200 },
          "unli": { ram: 0, disk: 0, cpu: 0 }
        }

        let { ram, disk, cpu } = resourceMap[gb]

        let domain = panel.domain
        let apikey = panel.apikey
        let nestid = panel.nestid
        let mail = panel.mail
        let egg = panel.egg
        let loc = panel.loc

        let email = username + crypto.randomBytes(2).toString('hex') + mail
        let password = username + crypto.randomBytes(3).toString('hex')
        let name = username.charAt(0).toUpperCase() + username.slice(1)
        const formatWIB = new Intl.DateTimeFormat('id-ID', {
          timeZone: 'Asia/Jakarta',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })

        let expiredString
        let exp = new Date()
        exp.setDate(exp.getDate() + 28)
        expiredString = formatWIB.format(exp)

        await reply('_⏳ Proses..._')
        await sleep(2500)

        try {
          const userRes = await fetch(domain + "/api/application/users", {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": "Bearer " + apikey
            },
            body: JSON.stringify({
              email: email,
              username: username,
              first_name: name,
              last_name: "Server",
              language: "en",
              password: password
            })
          })

          const user = await userRes.json()
          if (user.errors) throw user.errors[0].detail

          const eggRes = await fetch(`${domain}/api/application/nests/${nestid}/eggs/${egg}`, {
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": "Bearer " + apikey
            }
          })

          const eggData = await eggRes.json()
          const startup_cmd = eggData.attributes.startup || "npm start"

          const serverRes = await fetch(domain + "/api/application/servers", {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": "Bearer " + apikey,
            },
            body: JSON.stringify({
              name: name,
              description: ` ⃘✿ Expired: ${expiredString}`,
              user: user.attributes.id,
              egg: parseInt(egg),
              docker_image: "ghcr.io/parkervcp/yolks:nodejs_20",
              startup: startup_cmd,
              environment: {
                INST: "npm",
                USER_UPLOAD: "0",
                AUTO_UPDATE: "0",
                CMD_RUN: "npm start"
              },
              limits: {
                memory: ram,
                swap: 0,
                disk: disk,
                io: 500,
                cpu: cpu
              },
              feature_limits: {
                databases: 5,
                backups: 5,
                allocations: 5
              },
              deploy: {
                locations: [parseInt(loc)],
                dedicated_ip: false,
                port_range: []
              }
            })
          })

          const server = await serverRes.json()
          if (server.errors) throw server.errors[0].detail
    
          let caption = "╭╮𖣂  *🎉𝙿𝚊𝚗𝚎𝚕 𝚊𝚗𝚍𝚊 𝚝𝚎𝚕𝚊𝚑 𝚜𝚒𝚊𝚙*  ⸼╭╮\n" +
            `││  ⃘✿ 𝚄𝚜𝚎𝚛𝚗𝚊𝚖𝚎 ⵓ ${username}\n` +
            `││  ⃘✿ 𝙿𝚊𝚜𝚜𝚠𝚘𝚛𝚍 ⵓ ${password}\n` +
            `││  ⃘✿ 𝙴𝚖𝚊𝚒𝚕    ⵓ ${email}\n` +
            "││\n" +
            `││ 𝚁𝚊𝚖  ⵓ ${ram ? ram/1024 + "𝙶𝙱" : "𝚞𝚗𝚕𝚒𝚖𝚒𝚝𝚎𝚍"}\n` +
            `││ 𝙳𝚒𝚜𝚔 ⵓ ${disk ? disk/1024 + "𝙶𝙱" : "𝚞𝚗𝚕𝚒𝚖𝚒𝚝𝚎𝚍"}\n` +
            `││ 𝙲𝚙𝚞  ⵓ ${cpu ? cpu + "%" : "𝚞𝚗𝚕𝚒𝚖𝚒𝚝𝚎𝚍"}\n` +
            "││\n" +
            "││  𖦹.ᐟˡᵒᵍⁱⁿ ᵖᵃⁿᵉˡ ᵐᵉˡᵃˡᵘⁱ\n" +
            `││  ${domain}\n` +
            "╰╯⸼────────────⤾"
            
          await  Exp.sendMessage(buyer, {
            image: fs.readFileSync(fol[10] + 'Barr.jpg'),
              caption,
              interactiveButtons: [
              {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                  display_text: "Copy Email",
                  copy_code: email
                })
              },
              {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                  display_text: "Copy Password",
                  copy_code: password
                })
              },
              {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                  display_text: "Copy Username",
                  copy_code: username
                })
              },
              {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                  display_text: "Login Panel",
                  url: domain
                })
              },
              {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                  display_text: "Hubungi Owner",
                  url: 'https://wa.me/' + owner[0]
                })
              }
            ]
          }, { quoted: Data.fquoted.fbisnis})

          return edit("✅ Panel berhasil dibuat, dan yelah dikirim ke buyer", keys[sender])

        } catch (e) {
          console.error(e)
          return reply("Gagal membuat panel\n\n*Error*:\n" + e)
        }
      } else
      
      if (opsi == "list") {
        try {
          let f = await fetch(domain + "/api/application/servers?page=1", {
            method: "GET",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": "Bearer " + apikey
            }
          })
    
          let res = await f.json()
          let servers = res.data

          if (!servers || servers.length < 1) 
          return reply("Tidak ada server panel")

          let messageText = "── 𝗟𝗶𝘀𝘁 𝗦𝗲𝗿𝘃𝗲𝗿 𝗣𝘁𝗲𝗿𝗼𝗱𝗮𝗰𝘁𝘆𝗹 ── 𖦹.ᐟ\n\n"
    
          for (let server of servers) {
            let s = server.attributes

            let f3 = await fetch(`${domain}/api/client/servers/${s.uuid.split('-')[0]}/resources`, {
              method: "GET",
              headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + capikey
              }
            })

            let data = await f3.json();
            let status = data.attributes ? data.attributes.current_state : s.status;
  
            messageText += `╭⸼𖣂⸼╮ 📡 *${s.id} >> [ ${s.name} ]* ╭⸼𖣂⸼╮\n` +
              `│ ⃘✿ ⵓ Ram     : ${s.limits.memory == 0 ? "Unlimited" : s.limits.memory.toString().length > 4 ? s.limits.memory.toString().slice(0,2) + "GB" : s.limits.memory.toString().length < 4 ? s.limits.memory.toString().charAt(1) + "GB" : s.limits.memory.toString().charAt(0) + "GB"}\n` +
              `│ ⃘✿ ⵓ CPU     : ${s.limits.cpu == 0 ? "Unlimited" : s.limits.cpu + "%"}\n` +
              `│ ⃘✿ ⵓ Disk    : ${s.limits.disk == 0 ? "Unlimited" : s.limits.disk.toString().length > 3 ? s.limits.disk.toString().charAt(1) + "GB" : s.limits.disk.toString().charAt(0) + "GB"}\n` +
              `│ ⃘✿ ⵓ Created : ${s.created_at.split("T")[0]}\n` +
              `│ ⃘✿ ⵓ Status  : ${status === "starting" ? "🟡Starting" : status === "offline" ? "🔴Offline" : "🟢Running"}\n` +
              "╰⸼────────────⤾\n\n"
          }

          return reply(messageText)
   
        } catch (e) {
          return reply("Gagal mendapatkan list panel\n\n*Error*:\n" + e)
        }
      } else
      
      if (opsi == "del") {
        if (!inp) return reply("❗ Berikan id server")
        
        let panelid = parseInt(inp)
        try {
          let f = await fetch(domain + "/api/application/servers?page=1", {
            method: "GET",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": "Bearer " + apikey
             }
          })

          let result = await f.json()
          let servers = result.data
  
          let sections
          let nameSrv

          for (let server of servers) {
            let s = server.attributes

            if (Number(panelid) === s.id) {
              sections = s.name.toLowerCase()
              nameSrv = s.name
              
              let delSrv = await fetch(`${domain}/api/application/servers/${s.id}`, {
                method: "DELETE",
                headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json",
                  "Authorization": "Bearer " + apikey
                }
              })
  
              if (!delSrv.ok) {
                let err = await delSrv.json();
                return reply(`‼️ Gagal menghapus server: ${err.errors?.[0]?.detail}`)
              }
            }
          }

          if (!sections) return reply("❗ Id server tidak ditemukan")

          let cek = await fetch(domain + "/api/application/users?page=1", {
            method: "GET",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": "Bearer " + apikey
            }
          })

          let res2 = await cek.json()
          let users = res2.data

          for (let user of users) {
            let u = user.attributes

            if (u.first_name.toLowerCase() === sections) {
              await fetch(`${domain}/api/application/users/${u.id}`, {
                method: "DELETE",
                headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json",
                  "Authorization": "Bearer " + apikey
                }
              })
            }
          }

          return reply(`✅ Berhasil menghapus panel \`${nameSrv}\``)

        } catch (e) {
          return reply("Gagal menghapus panel\n\n*Error*:\n" + e)
        }
      } 
      
      if (opsi == "admin") {
        let input = inp.toLowerCase()
        if (input == "add") {
          if (!inp2 || !inp3) return reply("❗ Berikan username dan nomornya\n\nContoh\n.panel admin, add, Name, 62xxxxxx")
          
          let onWa = await Exp.onWhatsApp(inp3)
            if (onWa.length < 1) return reply("❗ Nomor tersebut tidak terdaftar di whatsapp")
          
          let nomor = inp3 + from.sender
          let usernem = inp2
          let username = usernem.toLowerCase()
          let email = username + "@gmail.com"
          let password = username + Date.now().toString(36).slice(-3)
          
          let now = new Date()
          let expiredDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
          let garansiDate = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000)

          let createdString = tanggal(now.getTime())
          let expiredString = tanggal(expiredDate.getTime())
          let garansiString = tanggal(garansiDate.getTime())
          
          let f = await fetch(domain + "/api/application/users", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + apikey
            },
            body: JSON.stringify({
              email: email,
              username: username,
              first_name: username,
              last_name: "Admin",
              root_admin: true,
              language: "en",
              password: password
            })
          })

          let data = await f.json()
          if (data.errors) return reply(JSON.stringify(data.errors[0], null, 2))

          let user = data.attributes
          let orang = nomor

          if (is.group) {
            await reply(`✅ Berhasil membuat akun panel\ndata akun sudah dikirim ke ${nomor == cht.sender ? "private chat" : nomor.split("@")[0]}`)
          }

          if (nomor !== cht.sender && !is.group) {
            await reply(`✅ Berhasil membuat akun panel\ndata akun sudah dikirim ke ${nomor.split("@")[0]}`);
          }

          let teks = "╭╮𖣂  *✧ 𝙳𝚎𝚝𝚊𝚒𝚕 𝙰𝚔𝚞𝚗 𝙰𝚍𝚖𝚒𝚗 ✧*  ⸼╭╮\n" +
          `││   ⃘✿ 𝙸𝙳 𝚄𝚜𝚎𝚛        ⵓ ${user.id}\n` +
          `││   ⃘✿ 𝚄𝚜𝚎𝚛𝚗𝚊𝚖𝚎       ⵓ ${user.username}\n` +
          `││   ⃘✿ 𝙿𝚊𝚜𝚜𝚠𝚘𝚛𝚍       ⵓ ${password}\n` +
          `││   ⃘✿ 𝙳𝚒𝚋𝚞𝚊𝚝         ⵓ ${createdString}\n` +
          `││   ⃘✿ 𝙴𝚡𝚙𝚒𝚛𝚎𝚍        ⵓ ${expiredString}\n` +
          "││\n" +
          "││  𖦹.ᐟ 𝙰𝚕𝚊𝚖𝚊𝚝 𝙿𝚊𝚗𝚎𝚕\n" +
          `││  ${domain}\n` +
          "││\n" +
          `││  ✦ 𝚂𝚢𝚊𝚛𝚊𝚝 & 𝙺𝚎𝚝𝚎𝚗𝚝𝚞𝚊𝚗 ✦\n` +
          "││  • Masa aktif: 30 hari\n" +
          "││  • Dilarang open reseller\n" +
          "││  • Dilarang create admin\n" +
          "││  • Jangan asal hapus server\n" +
          "││  • Simpan data baik-baik (hanya dikirim 1x)\n" +
          "││  • Rusuh = akun dihapus tanpa refund\n" +
          "││  • Maling = akun dihapus tanpa refund\n" +
          "││  • Akses server orang = akun dihapus\n" +
          "╰╯⸼────────────⤾"

          return Exp.sendMessage(
            orang, 
            { text: teks }
          )
        } else 
        
        if (input == "list") {
          try {
            let cek = await fetch(`${domain}/api/application/users?page=1`, {
              method: "GET",
              headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + apikey
              }
            })

            let res2 = await cek.json()
            let users = res2.data

            if (!users || users.length < 1)
              return reply("Belum ada panel")

            let teks = "╭╮𖣂  *✧ 𝙻𝚒𝚜𝚝 𝙰𝚍𝚖𝚒𝚗 𝙿𝚊𝚗𝚎𝚕 ✧*  ⸼╭╮\n"

            for (let i of users) {
              if (i.attributes.root_admin !== true) continue;
              
              teks += 
                `││  ⃘✿ 𝙰𝚍𝚖𝚒𝚗 : ${i.attributes.first_name}\n` +
                `││  ⃘✿ 𝙸𝙳     : ${i.attributes.id}\n` +
                `││  ⃘✿ 𝙳𝚒𝚋𝚞𝚊𝚝 : ${i.attributes.created_at.split("T")[0]}\n` +
                `││────────────────────────────\n` 
            }
            
            teks += "╰╯⸼────────────⤾"

            return reply(teks)

          } catch (e) {
            return reply("Gagal mendapatkan data admin panel\n\n*Error*:\n" + e)
          }
        } else 
        
        if (input == "del") {
          if (!inp2) return reply("❗ Berikan id admin panelnya")
          
          let targetId = parseInt(inp2)
          if (isNaN(targetId)) return reply("❗ Id harus angka")
            
          let cek = await fetch(domain + "/api/application/users?page=1", {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + apikey
            }
          })
             
          let res2 = await cek.json()
          let users = res2.data
          let found = null
            
          for (let u of users) {
            let x = u.attributes

            if (x.id === targetId && x.root_admin === true) {
              found = x
                break
            }
          }

          if (!found) return reply("‼️ Gagal menghapus akun\nId user tidak ditemukan")

          let delusr = await fetch(domain + `/api/application/users/${found.id}`, {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + apikey
            }
          })

          if (!delusr.ok) {
            let er = await delusr.json()
            return reply("Gagal menghapus akun\n" + JSON.stringify(er, null, 2))
          }
   
          return reply(`✅ Sukses menghapus akun admin panel *${found.username}*`)
        }
      } else
      
      if (opsi == "info") {
        if (!inp) return reply("❗ Masukkan id server.\nContoh: .panel info, 12")
      
        let idServer = parseInt(inp)
        if (isNaN(idServer)) return reply("❗ Id harus berupa angka")
       
        try {
          let get = await fetch(`${domain}/api/application/servers/${idServer}`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + apikey
            }
          })

          let json = await get.json()
          if (!json.attributes) return reply("‼️ Server tidak ditemukan")

          let s = json.attributes

          let res = await fetch(`${domain}/api/client/servers/${s.uuid.split('-')[0]}/resources`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + capikey
            }
          })

       
          let rs = await res.json()
          let r = rs?.attributes?.resources || {}

          const toMB = x => (x / 1024 / 1024).toFixed(1)
          const toGB = x => (x / 1024 / 1024 / 1024).toFixed(1)

          let limitRam = s.limits.memory == 0 ? "Unli" : s.limits.memory + "MB"
          let limitDisk = s.limits.disk == 0 ? "Unli" : s.limits.disk + "MB"
          let limitCpu = s.limits.cpu == 0 ? "Unli" : s.limits.cpu + "%"

          let usedRam = r.memory_bytes ? `${toMB(r.memory_bytes)}MB` : "-"
          let usedDisk = r.disk_bytes ? `${toGB(r.disk_bytes)}GB` : "-"
          let usedCpu = r.cpu_absolute ? `${r.cpu_absolute.toFixed(1)}%` : "-"

          let status = rs?.attributes?.current_state
          let emoji = status === "running" ? "🟢Running" :
                status === "offline" ? "🔴Offline" :
                "🟡Starting"

          let teks = "```╭╮𖣂  *✧ 𝚂𝚎𝚛𝚟𝚎𝚛 𝙸𝚗𝚏𝚘 ✧*  ⸼╭╮\n" +
          `││   ⃘✿ 𝙽𝚊𝚖𝚊 𝚂𝚎𝚛𝚟𝚎𝚛 ⵓ ${s.name}\n` +
          `││   ⃘✿ 𝙸𝙳 𝚂𝚎𝚛𝚟𝚎𝚛   ⵓ ${s.id}\n` +
          `││   ⃘✿ 𝚄𝚄𝙸𝙳          ⵓ ${s.uuid}\n` +
          "││\n" +
          `││   ⃘✿ 𝚁𝚊𝚖         ⵓ ${usedRam}/${limitRam}\n` +
          `││   ⃘✿ 𝙲𝙿𝚄         ⵓ ${usedCpu}/${limitCpu}\n` +
          `││   ⃘✿ 𝙳𝚒𝚜𝚔        ⵓ ${usedDisk}/${limitDisk}\n` +
          "││\n" +
          `││   ⃘✿ 𝚂𝚝𝚊𝚝𝚞𝚜      ⵓ ${emoji}\n` +
          `││   ⃘✿ 𝙳𝚒𝚋𝚞𝚊𝚝     ⵓ ${s.created_at.split("T")[0]}\n` +
          "╰╯⸼────────────⤾```"

          return reply(teks)

        } catch (e) {
          return reply("Gagal mendapatkan data server.\n" + e)
        }
      }
    }
  )
  
  ev.on(
    {
      cmd: ["setpanel"],
      listmenu: ["setpanel"],
      tag: "bar",
      isOwner: true,
      args: `*❗ Berikan input seperti berikut*\n\nSilahkan salin ini dan isi \negg:\nnestid:\nloc:\ndomain:\napikey:\ncapikey:\nmail:\n\nContoh pengisian\n${cht.prefix}${cht.cmd}\negg: 15\nnestid: 5\nloc: 1\ndomain: https://botmd.my.id\napikey: ptla_xxxxxx\ncapikey: ptlc_xxxxxx\nmail: @Elin.md`
    },

    async ({ args }) => {
      if (sender !== own) return reply("🧢 Malas bngttt")
    
      let setpanel = cfg.setpanel
      let lines = args.split(/\n|\r/).map(v => v.trim())

      let data = {
        egg: null,
        nestid: null,
        loc: null,
        domain: null,
        apikey: null,
        capikey: null,
        mail: null
      }

      for (let line of lines) {
        if (/^egg:/i.test(line)) data.egg = line.replace(/^egg:\s*/i, "");
        if (/^nestid:/i.test(line)) data.nestid = line.replace(/^nestid:\s*/i, "");
        if (/^loc:/i.test(line)) data.loc = line.replace(/^loc:\s*/i, "");
        if (/^domain:/i.test(line)) data.domain = line.replace(/^domain:\s*/i, "");
        if (/^apikey:/i.test(line)) data.apikey = line.replace(/^apikey:\s*/i, "");
        if (/^capikey:/i.test(line)) data.capikey = line.replace(/^capikey:\s*/i, "");
        if (/^mail:/i.test(line)) data.mail = line.replace(/^mail:\s*/i, "");
      }

      let missing = Object.entries(data)
        .filter(([key, val]) => !val)
        .map(([key]) => key);

      if (missing.length)
        return reply(`❗ Berikut data yang bekum terisi:\n- ${missing.join("\n- ")}`);

      setpanel.egg = data.egg
      setpanel.nestid = data.nestid
      setpanel.loc = data.loc
      setpanel.domain = data.domain
      setpanel.apikey = data.apikey
      setpanel.capikey = data.capikey
      setpanel.mail = data.mail

      return reply("✅ Berhasil menyimpan data panel anda, sekarang sudah siap untuk create panel")
    }
  )
}