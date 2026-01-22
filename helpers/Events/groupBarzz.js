/*!-======[ Module Imports ]======-!*/
const fs = "fs".import()
const { default: ms } = await "ms".import()
const { ppGC } = await (fol[2] + 'makerMach.js').r()
const baileys = "baileys".import()
const crypto = await "node:crypto".import()

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
  const { id, sender, reply } = cht
  const { func } = Exp
  let { 
    archiveMemories:memories, 
    parseTimeString, 
    clearSessionConfess, 
    findSenderCodeConfess, 
    formatDuration 
  } = func

  function getTime() {
    return new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
  }

  const contextInfo = {
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
  
  ev.on(
    {
      cmd: ['absen'],
      listmenu: ['absen'],
      tag: "group",
      isAdmin: true,
      isGroup: true
    },
    async ({ args }) => {
      let dataGc = Data.preferences[id]
      
      if (!dataGc.absen) dataGc.absen = {}
      let tipe = ['create', 'list', 'delete']
      let act = args.toLowerCase()

      let tutor = "📜 *CARA MENGGUNAKAN FITUR ABSEN*\n\n"
      tutor += "1️⃣. `.absen create` ➟ Untuk membuat absen hari ini\n"
      tutor += "2️⃣. `.absen list` ➟ Untuk mengecek siapa saja yang hadir hari ini\n"
      tutor += "3️⃣. `.absen delete` ➟ Untuk menghapus absen hari ini\n\n"
      tutor += "_Untuk mengisi absen cukup kirim pesan dengan kata *hadir*_"
      
      if (!tipe.includes(act) || !args) return Exp.sendMessage(
        id,
        {
          text: tutor,
          contextInfo 
        }, { quoted: cht }
      )
      
      if (act === "create") {
        if (dataGc.absen?.status === "berlangsung") return reply(
          "Absen hari ini sudah dibuat sebelumnya"
        )
         
        let now = new Date(
          new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
        )
        let tanggal = now.toLocaleDateString(
          'id-ID', {
            weekday: 'long', 
            day: 'numeric',
            month: 'long', 
            year: 'numeric' 
          }
        )
        
        let meta = await Exp.groupMetadata(id)
        let allmembers = meta.participants.map(m => m.id)

        dataGc.absen = {
          status: "berlangsung",
          create: sender,
          present: []
        }
         
       let teks = "✅ *Berhasil membuat absen*...\n\n"
        teks += `📅 *Tanggal*:  ${tanggal}\n`
        teks += `👤 *Pembuat*: @${sender.split("@")[0]} \n\n`
        teks += "*CATATAN*:\n"
        teks += "- Hasil absen hari ini akan di kirim pada jam 00:00 WIB, dan melakuka reset absen\n"
        Exp.relayMessage(
          id,
          {
            viewOnceMessage: {
              message: {
                interactiveMessage: {
                  contextInfo: {
                    mentionedJid: [
                      sender, ...allmembers
                    ]
                  },
                  body: {
                    text: teks,
                  },
                  footer: {
                    text: '_Untuk mengisi absen cukup kirim pesan *hadir* di grup ini_',
                  },
                  carouselMessage: {},
                },
              },
            },
          }, {}
        );
      }
      
      if (act === "list") {
        if (dataGc.absen?.status !== "berlangsung") return reply(
          "Belum ada absen yang di buat, ketik `.absen create` terlebih dahulu"
        )

        let hadir = dataGc.absen.present || []
        let total = hadir.length

        let teks = `👥 *DAFTAR ANGGOTA GRUP YANG HADIR*\n\n`
        if (total === 0) {
          teks += "🍃 Belum ada yang hadir hari ini\n"
        } else {
          teks += hadir.map((id, i) => `${i + 1}. @${id.split('@')[0]} ➟ Hadir`).join("\n")
        }

        teks += `\n\n🔢 Total anggota yang hadir yaitu \`${total} anggota\``

        await Exp.sendMessage(
          id,
          {
            text: teks,
            contextInfo: {
              ...contextInfo,
              mentionedJid: hadir
            }
          }, { quoted: cht }
        )
      }
      
      if (act === "delete") {
        if (dataGc.absen?.status !== "berlangsung") return reply(
          "Belum ada absen yang di buat, ketik `.absen create` terlebih dahulu"
        )
        
        dataGc.absen = {}
        
        reply(
          "✅ Data absen berhssil di hapus..."
        )
      }
      
    }
  )

  ev.on(
    {
      cmd: ['acak'],
      isGroup: true
    },
    async () => {
      let data = Data.preferences[id]?.giveaway
      
      if (!data) return reply(
        "❗ Tidak ada giveaway yang sedang berlangsung"
      )
       
      if (data.create !== sender) return reply(
        "❗ Cuma @" + data.create.split("@")[0] + " yang bisa mengacak pemenang giveaway ini", 
        {
          mentions: [
            data.create
          ]
        }
      )
      
      let maksParti = data.participant
      let ygJoin = data.members.length
      
      if (ygJoin < maksParti) return reply(
        "❗ Jumlah orang yang join belum cukup, orang yang dibutuhkan " + maksParti + " orang\n" +
        "jumlah orang yang udah join:  " + ygJoin + " orang"
      )

      let winner = data.members[Math.floor(Math.random() * ygJoin)]
      let user = Data.users[winner.split("@")[0]] || {}

      if (data.type == "premium") {
        user.premium = user.premium || { time: 0 }
        
        let val = func.parseTimeString(data.value)
        let now = Date.now()
        let base = user.premium.time < now ? now : user.premium.time
        user.premium.time = base + val
      }

      if (data.type == "energy") {
        user.energy = user.energy || 0
        await func.archiveMemories["addEnergy"](user, data.value)
      }

      Data.users[winner.split("@")[0]] = user
      delete Data.preferences[id].giveaway

      let text = 
        "乂  *G I V E  A W A Y*\n\n" +
        `🎉Selamat kepada @${winner.split("@")[0]} telah menjadi pemenang giveaway kali ini\n\n` +
        `• *Hadiah* : ${data.type == "premium" ? data.value + " premium" : data.value + " energy"}\n\n` +
        "_yang belum beruntung jangan menyerah, coba lagi lain waktu..._"

      await Exp.sendMessage(
        id,
        {
          text,
          contextInfo: {
            ...contextInfo,
            mentionedJid: [
              winner
            ]
          }
        },
        { quoted: cht }
      )
    }
  )

  ev.on(
    {
      cmd: ['accall', 'amproveall'],
      listmenu: ['accall', 'amproveall'],
      tag: 'group',
      isGroup: true,
      isAdmin: true,
      botAdmin: true
    },
    async () => {
      try {
        let groupId = cht.id;
        let joinRequestList = await Exp.groupRequestParticipantsList(groupId);

        if (!joinRequestList || joinRequestList.length === 0) {
          return reply(
            '❌ Tidak ada permintaan gabung yang tertunda.'
          )
        }

        for (const request of joinRequestList) {
          await Exp.groupRequestParticipantsUpdate(groupId, [request.jid], 'approve');
        }

        reply(`✅ Berhasil menyetujui semua permintaan gabung sebanyak \`${joinRequestList.length}\` member`);

      } catch (e) {
        console.error(e);
        reply(
          `Gagal menyetujui member yang ingin join\n\n• *Error*:\n${e.messsge}`
        );
      }
    }
  )
  
  ev.on(
    {
      cmd: ['cap', 'tandai', 'julukan'],
      listmenu: ['cap'],
      tag: "group",
      isGroup: true,
      isAdmin: true
    },
    async ({ args }) => {
      let data = Data.preferences[id].cap || {}

      let mode = args.toLowerCase()
      let target = cht.mention[0] 
    
      if (mode === "list") {
        if (!Object.keys(data).length)
          return reply("❗ Belum ada member yang diberi julukan")

        let gc = await Exp.groupMetadata(id)

        let list = Object.entries(data)
          .map(([number, julukan], i) =>
            `${i + 1}. @${number.split('@')[0]}\n   julukan: ${julukan}`
          )
          .join('\n\n')

        let mentions = Object.keys(data)

        return reply(`*Daftar julukan member di grup ${gc.subject}:*\n\n${list}`, {
          mentions
        })
      }

      if (["del", "delete"].includes(mode)) {
        if (!target)
          return reply("❗ Tag / reply member yang ingin dihapus julukannya")

        if (!data[target])
          return reply("❗ Member ini belum punya julukan")

        let old = data[target]
        delete data[target]

        return reply(
          `✅ Julukan *${old}* telah dihapuskan dari @${target.split("@")[0]}`,
          { mentions: [target] }
        )
      }

      if (!target)
        return reply(
          "❗ Tag / reply member lalu tulis julukannya\n\nContoh:\n.cap @arya pedo"
        )

      let julukan = args.trim() || null
      if (!julukan) return reply("❗ Tulis julukannya!")

      data[target] = julukan

      return reply(
        `✅ @${target.split("@")[0]} sekarang dijuluki: *${julukan}*`,
        { mentions: [target] }
      )
    }
  )
  
  ev.on(
    {
      cmd: ['claim', 'klaim'],
      listmenu: ['claim'],
      tag: "group",
      isGroup: true,
      isAdmin: true
    },
    async () => {
      let dt = Data.preferences[id]
      
      if (!dt?.sewa) return reply(
        "Group ini tidak memiliki data sewa..."
      )
      
      if (dt.sewa.bonus <= 0) return reply(
        "❌ Bonus premium gratis untuk grup ini telah habis"
      )
      
      if (dt.sewa.claim.includes(sender)) return reply(
        "❗ Kamu sudah pernah claim bonus premium sebelumnya..."
      )
      
      let user = Data.users[sender.split("@")[0]] || {}
      user.premium = user.premium || { time: 0 }
      
      let timeBonus = func.parseTimeString('15d')
      let now = Date.now()
      let base = user.premium.time < now ? now : user.premium.time
      user.premium.time = base + timeBonus
      
      Data.users[sender.split("@")[0]] = user;
      dt.sewa.bonus -= 1
      dt.sewa.claim.push(sender)
      
      let ygKlaim = dt.sewa.claim.map((v, i) => `${i+1}. @${v.split('@')[0]}`).join('\n')
      
      let text = `乂 *B O N U S  C L A I M*\n\n` +
      `✅ Berhasil klaim bonus premium...\n` +
      `- Bonus premium dengan durasi 15 hari\n\n` +
      `Berikut daftar admin yang udah claim:\n` +
      `${ygKlaim}`
      
      await Exp.sendMessage(
        id,
        {
          text,
          contextInfo: {
            ...contextInfo,
            mentionedJid: dt.sewa.claim
          }
        }, { quoted: cht }
      )
    }
  )
  
  ev.on(
    {
      cmd: ["intro"],
      listmenu: ["intro"],
      tag: "group"
    },
    async () => {
      let intro = Data.preferences[cht.id]?.welcomeCard?.welcome || null
      if (!intro) return reply("❗ Silahkan `.setwelcome` terlebih dahulu")
      
      return reply(intro[0])
    }
  )

  ev.on(
    {
      cmd: ['infogc', 'infogroup', 'informasigroup'],
      listmenu: ['infogroup'],
      tag: "group",
      isGroup: true
    },
    async () => {
      let metadata = await Exp.groupMetadata(id)
      let pref = Data.preferences[id]
      let status = name => pref?.[name] ? '✅ON' : '❌OFF'

      let {
        subject: namaGc,
        owner: pembuat,
        creation,
        desc,
        restrict: editInfoGc,
        announce: onlyAdmin,
        joinApprovalMode: persetujuanAdmin,
        size,
        participants
      } = metadata
      
      let ppGc= await Exp.profilePictureUrl(id)
      let admin = participants.filter(p => p.admin !== null)
      let listadmin = admin.map(p => `┝   @${p.id.split('@')[0]}`).join('\n')
      let mentions = admin.map(p => p.id) 
      let ageMs = Date.now() - (creation * 1000)
      let age = func.formatDuration(ageMs)

      let teks = `╭──( *Info Grup* ) \`\`\`` +
      `\n│` +
      `\n│  Nama grup  : ${namaGc}` +
      `\n│  Id grup    : ${id}` +
      `\n│  Anggota    : ${size} orang` +
      `\n│  Pembuat    : @${pembuat.split("@")[0] || '-'}` +
      `\n│  Dibuat     : sejak ${age.days} hari yang lalu` +
      `\n│  Admin      : ${admin.length} orang` +
      `\n│  Status     : ${onlyAdmin ? '🔒CLOSE' : '🔓OPEN'}` +
      `\n│  Persetujuan: ${persetujuanAdmin ? '✅ONN' : '❌OFF'}\`\`\`` +
      `\n│` +
      `\n┝───( *List Admin* )` +
      `\n│` +
      `\n${listadmin}` +
      `\n╰﹒⋆｡ﾟ･ﾟ｡⋆｡˚ ❀\n` +
      `\n*GROUP RULES*:` +
      `\n ${desc}\n` +
      `\n*GROUP SETTING*:` +
      `\n- anti bot ➟ ${status('antibot')}` +
      `\n- anti link ➟ ${status('antilink')}` +
      `\n- anti spam ➟ ${status('antispam')}` +
      `\n- anti delete ➟ ${status('antidelete')}` +
      `\n- anti sticker pack ➟ ${status('antistickerpack')}` +
      `\n- anti sticker ➟ ${status('antisticker')}` +
      `\n- anti toxic ➟ ${status('antitoxic')}` +
      `\n- anti channel ➟ ${status('antich')} ` +
      `\n- anti image ➟ ${status('antiimage')}` +
      `\n- anti video ➟ ${status('antivideo')}` +
      `\n- anti voice ➟ ${status('antivoice')}` +
      `\n- anti tagAll ➟ ${status('antitagall')} ` +
      `\n- anti tagSW ➟ ${status('antitagsw')}` +
      `\n- mute group ➟ ${status('mute')}` +
      `\n- only admin ➟ ${status('onlyadmin')} ` +
      `\n- main game ➟ ${status('playgame')}` +
      `\n- jadwal sholat ➟ ${status('jadwalsholat')}` +
      `\n- welcome ➟ ${status('welcome')}`
      
      Exp.sendMessage(
        id, 
        {
          text: teks,
          contextInfo: {
            externalAdReply: {
              title: `Haii kak ` + cht.pushName,
              body: `${namaGc}`,
              thumbnailUrl: ppGc,
              mediaUrl: `${cfg.gcurl}`,
              sourceUrl: `https://wa.me/${owner[0]}`,
              renderLargerThumbnail: true,
              showAdAttribution: true,
              mediaType: 1,
           },
            forwardingScore: 20,
            isForwarded: true,
            mentionedJid: [ 
              ...mentions,  
              pembuat
            ],
            forwardedNewsletterMessageInfo: {
              newsletterJid: cfg.chId.newsletterJid,
              newsletterName: cfg.chId.newsletterName,
              //serverMessageId: 152
            }
          }
        }, { quoted: cht }
      )
    }
  )
  
  ev.on(
    {
      cmd: ['giveaway'],
      listmenu: ['giveaway'],
      tag: "group",
      isAdmin: true,
      isGroup: true,
      args: "*❗ Berikan tipe hadiah, jumlah peserta dan jumlahnya, tipe nya cuma 2 yaitu energy dan premium*"
    },
    async ({ args }) => {
      let data = Data.preferences[id] || {}
      if (!data.giveaway) data.giveaway = {}
      
      if (data.giveaway.create) return reply(
        "❗ Masih ada giveaway yang sedang berlangsung"
      )
      
      let [tpe, angt, jmlh] = args.split(' ')
      let tipe = tpe.toLowerCase()
      let anggota = parseInt(angt)
      
      let dataGc = await Exp.groupMetadata(id)
      let allmem = dataGc.participants.map(p => p.id)
      
      if (!tipe || !angt || !jmlh) return reply(
        "❗ Berikan tipe dan jumlahnya\n\n" +
        "*CONTOH*:\n" +
        ".giveaway <tipe> <jumlah peserta> <jumlahnya>\n" +
        ".giveaway premium 5 1d"
      )
      
      let tip = ['premium', 'energy']
      if (!tip.includes(tipe)) return reply(
        "❗ Tipe cuma 2 yaitu energy dan premium"
      )
      
      let user = Data.users[sender.split("@")[0]] || {}
      user.premium = user.premium || { time: 0 }
      
      if (tipe == "premium") {
        if (user.premium.time == 0) return reply(
          "❗ Kamu harus premium terlebih dahulu jika ingin mengadakan giveaway premium"
        )
  
        let val = func.parseTimeString(jmlh)
        let sisaPremium = user.premium.time - Date.now()
        
        if (val > sisaPremium) {
          return reply(
            "❗ Premium milikmu tidak cukup untuk mengadakan giveaway premium sebesar itu"
          )
        }
        
        user.premium.time -= val
        let dur = func.formatDuration(val)

        data.giveaway = {
          type: tipe,
          value: jmlh,
          now: Date.now(),
          create: sender,
          participant:  anggota,
          members: []
        }

        let text = 
          "乂  *G I V E A W A Y*\n\n" +
          `✅ Berhasil... admin @${sender.split("@")[0]} mengadakan giveaway *${tipe}* (⁠ ⁠╹⁠▽⁠╹⁠ ⁠)\n\n` +
          `• *Tipe* : ${tipe}\n` +
          `• *Sebanyak* : ${dur.days} hari, ${dur.hours} jam\n\n` +
          "jumlah peserta yang dibutuhkan sebanyak " + anggota + " orang\n\n" +
          "_kalau mau join giveaway silahkan ketik *join* aja di grup ini, dan jika ingin cek peserta yang join giveaway silahkan kirim *giveaway* di grup ini juga_"

        await Exp.sendMessage(
          id,
          {
            text,
            contextInfo: {
              mentionedJid: [
                ...allmem,
                sender
              ]
            }
          }, 
          { quoted: cht }
        )
      }
      
      if (tipe == "energy") {
        if (isNaN(jmlh)) return reply(
          "❗ Jumlah energy harus angka"
        )
        
        let enrgy = user.energy 
        let jumlahnya = parseInt(jmlh)
        
        if (jumlahnya > enrgy) return reply(
          "❗ Jumlah energy kamu kurang untuk mengadakan giveaway energy sebanyak itu"
        )
        
        await func.archiveMemories["reduceEnergy"](sender.split("@")[0], jumlahnya)

        data.giveaway = {
          type: tipe,
          value: jumlahnya,
          now: Date.now(),
          create: sender,
          participant:  anggota,
          members: []
        }

        let text = 
          "乂  *G I V E A W A Y*\n\n" +
          `✅ Berhasil... admin @${sender.split("@")[0]} mengadakan giveaway *${tipe}* (⁠ ⁠╹⁠▽⁠╹⁠ ⁠)\n\n` +
          `• *Tipe* : ${tipe}\n` +
          `• *Sebanyak* : ${jmlh} energy\n\n` +
          "jumlah peserta yang dibutuhkan sebanyak " + anggota + " orang\n\n" +
          "_kalau mau join giveaway silahkan ketik *join* aja di grup ini, dan jika ingin cek peserta yang join giveaway silahkan kirim *giveaway* di grup ini juga_"

        await Exp.sendMessage(
          id,
          {
            text,
            contextInfo: {
              mentionedJid: [
                ...allmem,
                sender
              ]
            }
          }, 
          { quoted: cht }
        )
      }
    }
  )
  
  ev.on(
    {
      cmd: ['invite', 'undang'],
      listmenu: ['invite'],
      tag: 'group',
      isMention: "*❗ Ketik nomor nya*",
      isGroup: true,
      isAdmin: true,
      isBotAdmin: true
    }, 
    async ({ cht }) => {
      let target = cht.mention[0]

      let linkCode = await Exp.groupInviteCode(cht.id)
      let link = 'https://chat.whatsapp.com/' + linkCode
      let nama = func.getName(target) 
      
      await Exp.sendMessage(
        target, 
        {
          text: `╭˚₊‧୨ *GROUP INVITATION* ୧‧₊˚╮\n\nHalo, ${nama} ♡  \nKamu telah menerima undangan untuk bergabung ke grup!\n\nSilakan klik link dibawah untuk bergabung:\n➟ ${link}\n\n╰─┈⟡`,
          contextInfo: {
            externalAdReply: {
              title: `Haii kak ${nama}`,
              body: `Undangan grup whatsApp`,
              thumbnail: fs.readFileSync(fol[10] + 'thumb1.jpg'),
              mediaUrl: `${link}`,
              sourceUrl: `https://wa.me//6283846359386`,
              renderLargerThumbnail: false,
              showAdAttribution: true,
              mediaType: 2,
            },
            forwardingScore: 1999,
            isForwarded: true,
          }
        }
      )

      await reply(
        `✅ Link undangan sudah dikirim ke nomor tersebut.`
      )
    }
  )

  ev.on(
    {
      cmd: [
        'setbye',
        'setwelcome'
      ],
      listmenu: [
        'setbye',
        'setwelcome'
      ],
      tag: "group",
      isGrou: true,
      isAdmin: true,
      isAdminBot: true,
      args: "*❗ Berikan pesan welcome/bye nya*\n\n*Panduan*:\njika ingin welcome dan bye nge tag oran tersebut maka cukup tambahin kata @user di pesan welcome/bye tersebut. Contoh nya gini .setwelcome haii @user selamat bergabung"
    },
    async ({ args }) => {
      let data = Data.preferences[id] || {}
      
      if (!data.welcomeCard) data.welcomeCard = { welcome: [], bye: [] }
      let gb = data.welcomeCard
      
      if (cht.cmd == "setwelcome") {
        gb.welcome = [args]
        return reply(
          "✅ Pesan welcome berhasil diperbarui"
        )
      } 
      
      if (cht.cmd == "setbye") {
        gb.bye = [args]
        return reply(
          "✅ Pesan bye berhasil diperbarui"
        )
      }
    }
  )

  ev.on(
    {
      cmd: ['totalchat', 'semuachat'],
      listmenu: ['totalchat'],
      tag: 'group',
      isGroup: true,
      isAdmin: true
    }, 
    async ({ args }) => {
      let grpDb = Data.preferences[id];
      if (!grpDb || !grpDb.totalChat) {
        return reply(
          "❌ Belum ada data chat yang tercatat di grup ini"
        );
      }
  
      let totalTop = parseInt(args) || 10;
      let total = grpDb.totalChat;
      let userChat = grpDb.userChat || {};

      let metadata = await func.getGroupMetadata(cht.id);
      let groupName = metadata.subject;
      let totalMember = metadata.participants.length; 
  
      if (totalTop > totalMember) return reply(
        `❗ Grup ini cuma memiliki \`${totalMember}\` anggota, jumlah tol ga boleh lebih dari anggota grup`
      );

      let sorted = Object.entries(userChat)
        .sort((a, b) => b[1] - a[1]) 
        .slice(0, totalTop); 

      let teks = `💬 *Statistik Chat Grup*\n\n` +
      `• *Nama grup* ′: ${groupName}\n` +
      `• *Total member*: ${totalMember}\n` +
      `• *Total chat*  : ${total}\n\n` +
      `🏆 Top ${totalTop} anggota grup yang paling aktif:\n`;

      let rank = 1;
      for (let [jid, count] of sorted) {
        teks += `${rank}. @${jid.split('@')[0]} — ${count} chat\n`;
        rank++;
      }

      await Exp.sendMessage(
        id,
        { 
          text: teks,
          contextInfo: {
            ...contextInfo,
            mentionedJid: sorted.map(([jid]) => jid)
          }
        }, { quoted: cht }
      );
        
    }
  );

  ev.on(
    {
      cmd: ['listadmin'],
      listmenu: ['listadmin'],
      tag: "group",
      isAdmin: true,
      isGroup: true
    },
    async () => {
      let groupMetadata = await Exp.groupMetadata(id)
      let admins = groupMetadata.participants.filter(p => p.admin)
      let mentions = admins.map(p => p.id)
      let listAdmin = admins.map((p, i) => `${i + 1}. @${p.id.split('@')[0]}`).join('\n')

      reply(
        `🔰 \`LIST ADMIN DI GRUP ${groupMetadata.subject}\`\n─────────────────\n\n${listAdmin}`, 
        {
          mentions 
       }
      )
    }
  )

  ev.on(
    {
      cmd: ['myenergy', 'cekenergy'],
      listmenu: ['myenergy'],
      tag: "group",
      isGroup: true
    }, async () => {     
      let user = Data.users[sender.split("@")[0]]    
      let text = "乂   *E N E R G Y* ➜ " + user.energy;
   
      Exp.sendMessage(
        id,
        {
          text,
          contextInfo
        }, { quoted: cht }
      );    
    }
  )

  ev.on(
    {
      cmd: ['poll', 'polling'],
      listmenu: ['polling'],
      tag: 'group',
      args: `❗ Format salah.\nContoh: \`.poll Barr gantng ga? | yah, iya ding, jelas | 1\``,
      isGroup: true,
      isAdmin: true
    }, 
    async ({ cht }) => {
      const input = cht.q?.trim()
      if (!input || !input.includes('|')) {
        return reply('❗ Format salah.\nContoh: `.poll siapa yg paling keren? | gua, admin, bot | 1`')
      }

      const parts = input.split('|').map(x => x.trim())
      const judulPoll = parts[0]
      const pilihan = parts[1]?.split(',').map(x => x.trim()).filter(Boolean)
      const selectableCount = parseInt(parts[2] || '1')

      if (!judulPoll || !pilihan || pilihan.length < 2) return reply(
        `❌ Judul atau pilihan tidak valid!\nMinimal 2 pilihan ya.`
      )


      if (isNaN(selectableCount) || selectableCount < 1 || selectableCount > pilihan.length) return reply(
        `❌ Jumlah maksimal pilihan harus antara 1 sampai ${pilihan.length}`
      )

      const metadata = await Exp.groupMetadata(cht.id)
      const namaGroup = metadata.subject || 'Grup Tidak Diketahui'
      const peserta = metadata.participants.map(p => p.id).filter(Boolean)

      const now = new Date()
      const partsTime = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).formatToParts(now)

      const hari = partsTime.find(p => p.type === 'weekday')?.value || '-'
      const tanggal = partsTime.filter(p => ['day', 'month', 'year'].includes(p.type)).map(p => p.value).join(' ')
      const jam = partsTime.filter(p => ['hour', 'minute'].includes(p.type)).map(p => p.value).join(':') + ' WIB'

      const teksAbsen = `*📊 POLLING GROUP!!*\n*SILAHKAN ISI POLLING DIBAWAH INI:*\n\n` +
        `🏠 *Group:* ${namaGroup}\n` +
        `🌄 *Hari:* ${hari}\n` +
        `📆 *Tanggal:* ${tanggal}\n` +
        `🕒 *Jam:* ${jam}`

      await Exp.sendMessage(
        id,
        {
          text: teksAbsen,
          mentions: peserta
        }, { quoted: cht }
      )

      await Exp.sendMessage(
        id,
        {
          poll: {
            name: judulPoll,
            values: pilihan,
           selectableCount
          }
        } 
      )
    }
  )

  ev.on(
    {
      cmd: ['swgroup', 'swgc'],
      listmenu: ['swgc'],
      tag: 'group',
      energy: 150,
      premium: true,
      isGroup: true,
      isBotAdmin: true
    },
    async ({ args }) => {
      if (!Data.preferences[id].swgc) return reply("❗ sw gc tidak di izinkan di grup ini")
      
      try {
        let { quoted, type: mediaType } = ev.getMediaType(cht)
        let caption = args || null
        let messageSecret = crypto.randomBytes(32)

        await Exp.sendMessage(
          id,
          {
            react: {
              text: '📤', 
              key: cht.key 
            }
          }
        )
        
        let content

        if (quoted && mediaType) {
          let media = await cht.quoted.download()

          switch (mediaType) {
            case 'sticker':
            case 'image':
              content = { image: media, caption }
              break
            case 'video':
              content = { video: media, caption }
              break
            case 'audio':
              content = { audio: media, mimetype: 'audio/mpeg', ptt: false }
              break
            case 'document':
              content = {
                document: media,
                mimetype: cht.quoted.mimetype,
                fileName: cht.quoted.fileName || 'file'
              }
              break
            default:
              content = { text: caption || 'Haii semua!! yang buat sw ini adalah ' + cht.pushName }
            }
          } else {
          content = { text: caption || 'Haii semua!! yang buat sw ini adalah ' + cht.pushName }
        }

        let inside = await baileys.generateWAMessageContent(content, {
          upload: Exp.waUploadToServer,
        })

        const m = baileys.generateWAMessageFromContent(
          id,
          {
           groupStatusMessageV2: {
              message: {
                ...inside,
                messageContextInfo: { messageSecret },
              },
            },
          }, {}
        )

        await Exp.relayMessage(
          id,
          m.message, 
          { messageId: m.key.id }
        )
      
        await Exp.sendMessage(
          id,
          { 
            react: { 
              text: '✅',
              key: cht.key 
            }
          }
        )

        return reply(`✅ Berhasil membuat status grup${caption ? `\ncaption: ${caption}` : ''}`)
      
      } catch (e) {
        return reply("Gagal membuat status grup\n\n*Error:*\n" + e)
      }
    }
  )
}