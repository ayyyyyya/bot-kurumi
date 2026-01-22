/*!-======[ Module Imports ]======-!*/
const fs = "fs".import()

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
  const { sender, id, reply, edit } = cht
  const { func } = Exp
   
  const { catbox } = await (fol[0] + 'catbox.js').r()
   
  const date = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }))
  const hour = date.getHours()
   
  let sapaan
  if (hour >= 1 && hour < 4) {
    sapaan = "Ga tidur nih?😴"
  } else if (hour >= 4 && hour < 11) {
    sapaan = "Selamat pagi semuanya🌅"
  } else if (hour >= 11 && hour < 15) {
    sapaan = "Selamat siang semuanya☀️"
  } else if (hour >= 15 && hour < 18) {
    sapaan = "Selamat sore semuanya🌇"
  } else {
    sapaan = "Selamat malam semuanya🌙"
  }
  
  function getBarzz918() {
    return new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
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
    forwardingScore: 19,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: cfg.chId.newsletterJid,
      newsletterName: cfg.chId.newsletterName,
      //serverMessageId: 152
    }
  }

  let fakeQuoted = {
    key: {
      fromMe: false,
      participant: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
    },
    message: {
      productMessage: {
        product: {
          productImage: {
            mimetype: "image/jpeg",
            jpegThumbnail: fs.readFileSync(fol[10] + 'thumb1.jpg'),
          },
          title: "AlbertOffc",
          description: "Albert Hytam",
          currencyCode: "IDR",
          priceAmount1000: "99999999999",
          retailerId: "ID123456",
          productImageCount: 1,
        },
        businessOwnerJid: "6283846359386@s.whatsapp.net",
      },
    },
  };
  
  
  let thumbAcak2 = [
    'jpm.jpg',
    'jpm2.jpg',
    'jpm3.jpg',
    'jpm4.jpg',
    'jpm5.jpg'
  ]

  let piLih2 = Math.floor(Math.random() * thumbAcak2.length)
  let haSil2 = thumbAcak2[piLih2]

  ev.on(
    {
      cmd: ['blok', 'unblok'],
      listmenu: ['blok', 'unblok'],
      isMention: "tag orangnya syg 💋",
      isOwner: true
    }, 
    async () => {
      let target = cht.mention[0]
  
      let isBlok = cht.cmd === 'blok'
      let actionText = isBlok ? 'memblokir' : 'membuka blokir'
      let status = isBlok ? 'block' : 'unblock'

      if (!target) return reply(
        '❗ *Tag orang yang mau di-' + (isBlok ? 'blokir' : 'unblokir') + '*'
      )

      try {
        await Exp.updateBlockStatus(
          target, 
          status
        )
        
        await reply(
          `✅ *Berhasil ${actionText} @${target.split('@')[0]}.*`,
          {
            mentions: [
              target
            ] 
          }
        )
        
      } catch (e) {
        return reply(
          "Gagal " + actionText + " user tersebut \n\n*Error*:\n" + e
        )
      }
    }
  )

  ev.on(
    {
      cmd: ['cekapi', 'api'],
      isOwner: true
    }, 
    async () => {
    
      await Exp.sendMessage(
        id, 
        {
          react: { 
            text: "⏱️",
            key: cht.key 
          } 
        }
      )
 
      let api = await fetch(
        `https://api.botcahx.eu.org/api/checkkey?apikey=${cfg.bar}`
      )
        
      let body = await api.json()
      let { 
        email, 
        username, 
        limit, 
        premium, 
        expired, 
        todayHit,
        totalHit
      } = body.result
   
      let text = `乂 *C H E C K   A P I K E Y*\n` + 
      `\n◦ *Email*: ${email}` +
      `\n◦ *Username*: ${username}` +
      `\n◦ *Limit*: ${limit}` +
      `\n◦ *Premium*: ${premium}` +
      `\n◦ *Expired*: ${expired}` +
      `\n◦ *Today Hit*: ${todayHit}` +
      `\n◦ *Total Hit*: ${totalHit}`
   
      await Exp.sendMessage(
        id,
        {
          text,
          contextInfo
        }, { quoted: cht }
      )
    }
  )

  ev.on(
    {
      cmd: ['listuser'],
      listmenu: ['listuser'],
      tag: 'owner',
      isOwner: true,
      args: "Mau liat list user apa sayang? user premium, user afk atau user banned"
    },
    async ({ args }) => {
    
      let now = Date.now()
      let mode = args.includes('afk')
        ? 'afk'
        : args.includes('premium')
          ? 'premium'
          : args.includes('banned')
            ? 'banned'
            : null

      if (!mode) {
        return reply(
          "*❗ Berikut list user yang tersedia*\n\n" +
            "⟡ listuser premium\n" +
            "⟡ listuser banned\n" +
            "⟡ listuser afk\n\n" +
            "Contoh:\n" +
            ".listuser afk"
        )
      }

      let list = []
      for (const [id, user] of Object.entries(Data.users)) {
        if (mode === 'afk' && user.afk?.time) {
          let dur = func.formatDuration(now - user.afk.time)
          let lamaAfk =
            `${dur.days > 0 ? dur.days + 'd ' : ''}` +
            `${dur.hours > 0 ? dur.hours + 'h ' : ''}` +
            `${dur.minutes > 0 ? dur.minutes + 'm ' : ''}` +
            `${dur.seconds > 0 ? dur.seconds + 's ' : ''}`
            
          list.push(
            {
              id,
              name: user.name || id,
              reason: user.afk.reason,
              lamaAfk: lamaAfk.trim(),
            }
          )
        }

        if (mode === 'premium' && user.premium?.time > now) {
          list.push(
            {
              id,
              name: user.name || id,
              role: user.role,
              expPrem: new Date(user.premium.time).toLocaleString("id-ID"),
            }
          )
        }

        if (mode === 'banned' && user.banned && user.banned > now) {
          let dur = func.formatDuration(user.banned - now)
          let sisa =
            `${dur.days > 0 ? dur.days + 'd ' : ''}` +
            `${dur.hours > 0 ? dur.hours + 'h ' : ''}` +
            `${dur.minutes > 0 ? dur.minutes + 'm ' : ''}` +
            `${dur.seconds > 0 ? dur.seconds + 's ' : ''}`
          list.push(
            {
              id,
              name: user.name || id,
              until: new Date(user.banned).toLocaleString("id-ID"),
              remaining: sisa.trim(),
            }
          )
        }
      }

      if (list.length === 0) {
        return reply(
          mode === 'afk'
            ? "❌ Tidak ada user yang sedang afk"
            : mode === 'premium'
              ? "❌ User premium belum ada satu pun"
              : "❌ Tidak ada user yang dibanned"
        )
      }

      let teks =
        mode === 'afk'
          ? `Berikut list user yang sedang afk\n\n`
          : mode === 'premium'
            ? `Berikut list user yang telah upgrade ke premium\n\n`
            : `Berikut list user yang sedang dibanned\n\n`

      list.forEach(
        (u, i) => {
          teks += `${i + 1}. ${u.id}\n`
          teks += `    • Nama : ${u.name}\n`
          if (mode === 'afk') {
            teks += `    • Lama afk : ${u.lamaAfk}\n`
            teks += `    • Alasan : ${u.reason}\n\n`
          } else if (mode === 'premium') {
            teks += `    • Role : ${u.role?.split(",")[0]}\n`
            teks += `    • Expired : ${u.expPrem}\n\n`
          } else if (mode === 'banned') {
            teks += `    • Banned sampai : ${u.until}\n`
            teks += `    • Sisa waktu : ${u.remaining}\n\n`
          }
        }
      )

      teks += `Terdapat \`${list.length} user\``

      await Exp.sendMessage(
        id,
        {
          text: teks,
          contextInfo,
        },
        { quoted: cht }
      )
    }
  )
  
  ev.on(
    {
      cmd: ['sendch', 'kirimkech'],
      listmenu: ['sendch'],
      tag: "owner",
      isOwner: true
    },
    async ({ args }) => {
      let chId = cfg.chId.newsletterJid
      
      let [tipeArg, ...psn] = args.split(' ')
      let pesan = psn.join(' ')
      
      let allowed = ['teks', 'audio']
      let act = tipeArg.toLowerCase()
      if (!allowed.includes(act)) return reply(
        "Tipe nya cuma dua yaitu teks dan audio, sialhkan pilih salah satu"
      )
      
      let thm = [
        'https://files.catbox.moe/jd0b79.jpg',
        'https://files.catbox.moe/0y09h3.jpg',
        'https://files.catbox.moe/4qmgqx.jpg',
        'https://files.catbox.moe/re0hlp.jpg',
        'https://files.catbox.moe/aw9urh.jpg'
      ]
      
      let randomThm = thm[Math.floor(Math.random() * thm.length)]
      
      await Exp.sendMessage(
        id,
        { 
          react: { 
            text: "🌸",
            key: cht.key
          } 
        }
      )
      
      if (act !== "audio") {
        if (!pesan) return reply(
          "Masukkan teks yang akan di kirim ke channel resmi " + botnickname
        )
        
        try {
          await Exp.sendMessage(
            chId,
            {
              text: pesan,
              contextInfo: contextInfo2
            }
          )
        
          return await reply(
            "✅ Pesan berhasil di kirim ke channel..."
          )
          
        } catch (e) {
          return reply(
            "Gagal mengirim pesan ke channel \n\n*Error*:\n" + e
          )
        }
        
      } else {
        if (!pesan) return reply(
          "Masukkan judul lagu yang ingin di kirim ke channel resmi " + botnickname 
        )
        
        try {
          let searchRes = await fetch(
            `https://api.siputzx.my.id/api/s/soundcloud?query=${encodeURIComponent(pesan)}`
          ).then(res => res.json())
      
          let data = searchRes.data || []
          if (!Array.isArray(data) || data.length === 0) {
            return reply("❌ Data lagu tersebut kosong...")
          }
      
          let yo = data[Math.floor(Math.random() * data.length)]
          let url = yo.permalink_url  

          try {
            let dlRes = await fetch(
              `https://api.siputzx.my.id/api/d/soundcloud?url=${encodeURIComponent(url)}`
            ).then(ros => ros.json())
         
            let dt = dlRes.data 
        
            if (!dt || !dt.url) {
              return reply("❌ Url lagu tersebut kosong...")
            }
          
            await Exp.sendMessage(
              chId,
              {
                audio: {
                  url: dt.url
                },
                mimetype: "audio/mpeg",
                ptt: true,
                contextInfo: {
                  externalAdReply: {
                    title: sapaan,
                    body: `❏ 𝓐𝓵𝔂𝓪 [ アリヤ ]`,
                    thumbnailUrl: randomThm,
                    sourceUrl: url,
                    renderLargerThumbnail: true,
                    showAdAttribution: true,
                    mediaType: 1,
                  },
                  forwardingScore: 19,
                  isForwarded: true,
                  forwardedNewsletterMessageInfo: {
                    newsletterJid: cfg.chId.newsletterJid,
                    newsletterName: cfg.chId.newsletterName,
                    //serverMessageId: 152
                  }
                }
              }
            )
            
            return reply(
              "✅ Berhasil kirim audio ke channel"
            )
            
          } catch (e) {
            return reply(
              "Gagal mendapatkan data lagu tersebut\n\n*Error*:\n" + e
            )
          }
        
        } catch (e) {
          return reply(
            "Gagal mengirim audio ke channel \n\n*Error*:\n" + e
          )
        }
      }
    }
  )   

  ev.on(
    {
      cmd: ['sendch2', 'kirimkech2'],
      listmenu: ['sendch2'],
      tag: "owner",
      isOwner: true,
      media: {
        type: [
          'image', 'video'
        ]
      }
    },
    async ({ media }) => {
      let chId = cfg.chId.newsletterJid
    
      await Exp.sendMessage(
        id,
        { 
          react: { 
            text: "🌸",
            key: cht.key
          } 
        }
      )
      
      let caption = cht.q
      
      try {
        if (media.type !== 'video') {
          await Exp.sendMessage(
            chId,
            {     
              image: media,
              caption,
              contextInfo: contextInfo2
            }
          )
          
          return reply(
            "✅ Berhasil mengirim image ke channel"
          )
        
        } else {
          await Exp.sendMessage(
            chId,
            {
              video: media,
              caption,
              contextInfo: contextInfo2
            }
          )
          
          return reply(
            "✅ Berhasil mebgirim video ke channel"
          )
        }
      } catch (e) {
        return reply(
          "Gagal mengirim media ke channel \n\n*Error*:\n" +e
        )
      }
    }
  )
    
  ev.on(
    {
      cmd: ['setgift'],
      listmenu: ['setgift'],
      tag: "owner",
      isOwner: true,
      media: {
        type: [
          'video'
        ]
      }
    },
    async ({ media }) => {

      if (!cht.q) {
        return reply(
          `Harap reply/kirim video dengan caption .${cht.cmd} <url>\n\n` +
          `\`[ CONTOH ]\`\n` +
          `${cht.cmd} https://files.catbox.moe/xxxx.mp3\n` +
          `> _Sambil reply/kirim video_`
        )
      }
 
      let CroT = await termaiCdn(media)
      let total = Object.keys(cfg.gift || {}).length
      let nextId = total + 1
 
      if (!cfg.gift) cfg.gift = {}
      cfg.gift[nextId] = [
        {
          video: CroT,
          audio: cht.q.trim()
        }
      ]

      return reply(
        `✅ Berhasil menambahkan gift\n\n` +
        `- Video: *${CroT}*\n` +
        `- Audio: *${cht.q.trim()}*\n\n` +
        `📁 Data tersebut telah tersimpan di /toolkit/set/config.json, dengan urutan ke-${nextId}`
      )
    }
  )

  ev.on(
    {
      cmd: ['delgift'],
      listmenu: ['delgift'],
      tag: "owner",
      isOwner: true
    }, 
    async ({ args }) => {
      if (!cfg.gift || Object.keys(cfg.gift).length === 0) {
        return reply(
          '🍃 Belum ada gift yang tersimpan.'
        )
      }

      let semuaGift = []
      for (let id of Object.keys(cfg.gift)) {
        for (let item of cfg.gift[id]) {
          semuaGift.push(
            {
              video: item.video,
              audio: item.audio 
            }
          )
        }
      }

      const nomor = args

      if (!nomor || isNaN(nomor)) {
        let teks = `\`[ DAFTAR GIFT TERSIMPAN ]\`\n\n`
        semuaGift.forEach(
          (gift, i) => {
            teks += `🌟 *GIFT KE-${i + 1}*\n`
            teks += `   ├ *Video*: *${gift.video}*\n`
            teks += `   └ *Audio*: *${gift.audio}*\n`
            teks += `*────────────────────────*\n`
          }
        )
        teks += `\n> Ketik .${cht.cmd} 1\n> Untuk menghapus gift dengan urutan pertama`
        return reply(teks)
      }

      if (nomor < 1 || nomor > semuaGift.length) {
        return reply(
          `❌ Gift ke-${nomor} tidak ditemukan\nTotal gift: ${semuaGift.length}`
        )
      }

      semuaGift.splice(nomor - 1, 1)

      cfg.gift = {}
      semuaGift.forEach(
        (item, index) => {
          let key = String(index + 1)
          if (!cfg.gift[key]) cfg.gift[key] = []
          cfg.gift[key].push(item)
        }
      )

      return reply(
        `✅ Berhasil menghapus gift dengan nomor urutan ke-${nomor}\n\n` +
        `> _Ketik .listgift untuk melihat daftar gift yang tersedia_`
      )
    }
  )

  ev.on(
    {
      cmd: ['listgift'],
      listmenu: ['listgift'],
      tag: 'owner',
      isOwner: true
    }, 
    async () => {
      if (!cfg.gift || Object.keys(cfg.gift).length === 0) return reply(
        '🍃 Belum ada gift yang tersimpan.'
      )

      let semuaGift = []
      for (let id of Object.keys(cfg.gift)) {
        for (let item of cfg.gift[id]) {
          semuaGift.push(
            {
              no: semuaGift.length + 1,
              video: item.video,
              audio: item.audio
            }
          )
        }
      }

      let teks = `\`[ DAFTAR GIFT TERSIMPAN ]\`\n\n`

      for (let gift of semuaGift) {
        teks += `🌟 *GIFT KE-${gift.no}*\n`
        teks += `   ├ *Video*: *${gift.video}*\n`
        teks += `   └ *Audio*: *${gift.audio}*\n`
        teks += `*────────────────────────*\n`
      }

      return reply(teks)
    }
  )

  ev.on(
    {
      cmd: ['jpm'],
      listmenu: ['jpm'],
      tag: "owner",
      args: "*❗ Silahkan masukkan informasi yabg ingin di sampaikan*",
      isOwner: true,
    },
    async () => {
      const teks = cht.q
      let total = 0

      const allGroups = await Exp.groupFetchAllParticipating()
      const groupList = Object.values(allGroups)
      const groupIds = groupList.map(group => group.id)
      const metadata = await Exp.groupMetadata(cht.id)
      const mentionsAllMem = metadata.participants.map(p => p.id)
      
      reply(
        `📨 Mengirim pesan ke *${groupIds.length} grup*\n` +
        `_Harap tunggu sebentar..._`
      )

      for (let jid of groupIds) {
        try {
          await Exp.sendMessage(
            jid, 
            {
              text: `${teks}`,
               contextInfo: {
                 ...contextInfo2,
                 mentionedJid: mentionsAllMem
               }
            }
          )
          total++
          
        } catch (err) {
          console.log(`❌ Gagal kirim ke ${jid}:` + err)
        }
        await sleep(1000)
      }

      await reply(
        `✅ Pesan berhasil dikirim ke *${total} grup* dari total *${groupIds.length} grup*`
      )
    }
  )

  ev.on(
    { 
      cmd: ['kickall'], 
      listmenu: ['kickall'],
     tag: "owner",
     isOwner: true,
     isGroup: true,
     isBotAdmin: true
    }, 
    async() => {
      let members = Exp.groupMembers.map(a => a.id).filter(a => !(a == Exp.number || owner.includes(a)))
      await Exp.groupParticipantsUpdate(id, members, "remove")
    }
  )

  ev.on(
    {
      cmd: ['listgb', 'listgrup', 'listgc'],
      listmenu: ['listgc'],
      tag: 'owner',
      isOwner: true
    }, async () => {
      try {
        const groups = Object.values(await Exp.groupFetchAllParticipating())
        if (!groups || groups.length === 0) return reply(
          `Bot ${botnickname} belum join di gc mana pun....`
        )

        let teks = `Berikut adalah semua daftar grup yang telah di masuki bot *${botnickname}*\n\n`
        let total = 0
        let mentions = []

        for (let g of groups) { 
          const pemilik = g.owner ? '@' + g.owner.split('@')[0] : 'Tidak diketahui'
       
          if (g.owner) mentions.push(g.owner)

          teks += `╭───────🌷˚₊‧୨୧‧₊˚🌷───────╮\n`
          teks += `│ 🏷️ *Nama:* ${g.subject}\n`
          teks += `│ 🆔 *ID:* ${g.id}\n`
          teks += `│ 🐣 *Member:* ${g.participants.length} orang\n`
          teks += `│ 🛜 *Status:* ${g.announce ? '🔒' : '🔓'}\n`
          teks += `│ 👤 *Pembuat:* ${pemilik}\n`
          teks += `╰───────🌸˚₊‧୨୧‧₊˚🌸───────╯\n\n\n`
          total++
        }

        teks += `Total grup: \`${total} Grup\``
        mentions = [...new Set(mentions)]

        reply(
          teks,
          {
            mentions
          }
        )
      } catch (e) {
        return reply(
          "Gagal mendapatkan data semua grup\n\n*Error*:\n" + e
        )
      }
    }
  )
}