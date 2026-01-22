/*!-======[ Module Imports ]======-!*/
const chalk = 'chalk'.import();
const fs = 'fs'.import()
/*!-======[ Default Export Function ]======-!*/
export default async function client({ Exp, store, cht, is }) {
  let { func } = Exp;

let jam = parseInt(func.newDate().split(", ")[2].split(":")[0]);
  let ucapan;
  if (jam >= 4 && jam < 10) {
    ucapan = 'Selamat pagi... 🌄';
  } else if (jam >= 10 && jam < 15) {
    ucapan = 'Selamat siang... ☀️';
  } else if (jam >= 15 && jam < 18) {
    ucapan = 'Selamat Sore... 🌇';
  } else if (jam >= 18 && jam <= 23) {
  ucapan = 'Selamat malam... 🌃';
  } else {
    ucapan = 'Kamu gak tidur? 🙃';
  }

  function getBarzz918() {
    return new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
  }

  const contextInfo = {
     externalAdReply: {
        title: `❏ 𝓐𝓵𝔂𝓪 [ アリヤ ]`,
        body: `Time ${getBarzz918()}`,
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


  try {
    const chatDb = Data.preferences[cht.id] || {};
    let m = store.messages[cht.id];
    m.idmsg ??= [];
    if (m.idmsg.includes(cht.key.id)) return;
    m.idmsg = [...m.idmsg, cht.key.id].slice(-7);

    Data.pmLog ??= {}
  if (!is.group) {
    const jid = String(cht?.sender || "")
  if (jid && jid !== "status@broadcast") {
    const key = jid.split("@")[0]
    const now = Date.now()
    const cur = Data.pmLog[key] ??= { jid, first: now, last: now, count: 0, lastText: "" }
    cur.jid = jid
    cur.first = cur.first || now
    cur.last = now
    cur.count = (cur.count || 0) + 1
    const t = String(cht?.q || cht?.text || "").replace(/\s+/g, " ").trim()
    cur.lastText = t ? (t.length > 80 ? t.slice(0, 80) + "…" : t) : cur.lastText
  }
}

    if (cht.memories?.banned && !is.owner) {
      if (cht.memories.banned * 1 > Date.now()) return;
      func.archiveMemories.delItem(cht.sender, 'banned');
    }
      
      
    if (is.group) {
      chatDb.cap ??= {}; 
    
      const cooldown = 60 * 60 * 1000;
      Data.capCooldown ??= {};
      Data.capCooldown[cht.id] ??= 0;
      
      Data.ownerMentioned ??= {};
      Data.ownerMentioned[cht.id] ??= 0;
      
      let thisOwn = owner.map(num => num + from.sender);
      let own = thisOwn.includes(cht.sender)
      let lastPing = Data.ownerMentioned[cht.id];
      
      let sapaMem = Date.now() - Data.capCooldown[cht.id] > cooldown
      let sapaOwn = Date.now() - lastPing > cooldown
      
      if (own && sapaOwn) {
        Data.ownerMentioned[cht.id] = Date.now();
        Data.capCooldown[cht.id] = Date.now();
        
        const teksList = [
          `⋆｡ﾟ☁︎ Owhh haii *${cht.pushName}*, ${ucapan}~`,
          `Ksatria *${cht.pushName}* telah tiba 🥶`,
          `⸝⸝໒꒰ྀིっ˕ -｡꒱ྀིっ ayo peluk *${cht.pushName}* duluu~`,
          `⋆꙳☁︎ Ayang *${cht.pushName}* telah online~ ⸜(｡˃ ᵕ ˂ )⸝`,
          `😳 Ehh... ayang *${cht.pushName}*, apa kabar? Btw *${ucapan}*`,
          `😨 Alamak owner *${cht.pushName}* datang, ihkk takokknyee...`,
          `💗 Welcome *${cht.pushName}*, gimna kabarmu?`,
          `Owner *${cht.pushName}* terpantau 🤭`,
          `Wo'hooo pahlawan ${cht.pushName} telah tiba 🥶`
        ];

        let teks = teksList[Math.floor(Math.random() * teksList.length)];

        return Exp.sendMessage(
          cht.id, 
          {
            text: teks,
            contextInfo: {
              mentionedJid: [cht.sender] 
            }
          }, { quoted: Data.fquoted.fbisnis }
        );
      } else if (sapaMem) {
      
        if (chatDb.cap[cht.sender]) {
          Data.capCooldown[cht.id] = Date.now();
          let julukan = chatDb.cap[cht.sender];

          const listTeks = [
            `alamak si ${julukan} datang lagi🗿`,
            `ihh si ${julukan} datang 😳`,
            `waduhh si ${julukan} nongol lagi 🫣`,
            `🙄 hadehh si ${julukan} on lagi`,
            `larii ada si ${julukan} `,
            `astagaa ${julukan} masih hidup rupanya 😭`,
            `😏 siapa ni... ohh si ${julukan} ternyata`,
            `👀 tuh kan si ${julukan} aktif lagi`,
            `🥴 ${julukan} detected online`,
            `👋 hai ${julukan}~`,
            `😹 ${julukan} terlihat di obrolan`
          ];

          let teks = listTeks[Math.floor(Math.random() * listTeks.length)];

          return Exp.sendMessage(
            cht.id,
            {
              text: teks,
              mentions: [cht.sender]
            }, { quoted: cht }
          );
        }
      }
      
      let now = new Date();
      let today = now.toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta" });

      if (chatDb.lastReset !== today) {
        chatDb.totalChat = 0;
        chatDb.userChat = {};
        chatDb.lastReset = today;
        console.log(
          chalk.yellow(
            `[RESET CHAT] Grup: ${cht.id} reset chat harian (${today})`
          )
        );
      }

      chatDb.totalChat ??= 0;
      chatDb.userChat ??= {};

      chatDb.totalChat++;

      chatDb.userChat[cht.sender] ??= 0;
      chatDb.userChat[cht.sender]++;
    }
    
    chatDb.ai_interactive ??= Data.preferences[cht.id].ai_interactive =
      cfg.ai_interactive[is.group ? 'group' : 'private'];
    let frmtEdMsg = cht.reaction ? cht.reaction.emoji : cht?.msg?.length > 50 ? `\n${cht.msg}` : cht.msg;
    
    if (cht.msg || cht.reaction) {
      cfg['autotyping'] && (await Exp.sendPresenceUpdate('composing', cht.id));
      cfg[is.group ? 'autoreadgc' : 'autoreadpc'] &&
        (await Exp.readMessages([cht.key]));
      console.log(
        func.logMessage(
          is.group ? 'GROUP' : 'PRIVATE',
          is.group ? cht.id : cht.sender,
          func.getName(cht.sender),
          frmtEdMsg
        )
      );
    }
    
    /*!-======[ Block Chat ]======-!*/
    if (!cfg.public && !is.owner && !is.me && !is.offline) return;
    if (cfg.public === 'onlygc' && !is.group && !is.owner) return;
    if (cfg.public === 'onlypc' && is.group && !is.owner) return;
    if (
      cfg.public === 'onlyjoingc' &&
      !is.owner &&
      cht.cmd &&
      cht.memories?.premium?.time < Date.now() &&
      cfg.urlgc?.length > 0
    ) {
      let isJoin;
      let list = cfg.urlgc.map((a) => `- ${a}`).join('\n');
      for (let i of cfg.urlgc) {
        let ii = i.split('/').slice(-1)?.[0]?.split('?')?.[0]
        keys[ii] ??= await Exp.groupGetInviteInfo(ii).then((a) => a.id);
        let mem = await func
          .getGroupMetadata(keys[ii], Exp)
          .then((a) =>
            a.participants.map(
              (a) => a[cht.sender.endsWith('@lid') ? 'lid' : 'id']
            )
          );
        if (mem.includes(cht.sender)) {
          isJoin = true;
          break;
        }
      }
      if (
        !isJoin &&
        (!cht.memories.cdIsJoin || cht.memories.cdIsJoin >= Date.now())
      ) {
        cht.memories.cdIsJoin = Date.now() + func.parseTimeString('10 menit');
        let tekks = `Haiii kak ${func.getName(cht.sender)}, kamu harus gabung di grup resmi ${botnickname} sebelum menggunakan bot, atau kamu bisa beli premium agar bisa menggunakan bot tanpa harus join di grup resmi\n\n\`LIST INVITELINK\`\n${list}\n\n*CATATAN*:\n_Setelah bergabung harap tunggu selama 2 menit sebelum menggunakan bot, data anggota grup hanya di perbarui setiap 2 menit sekali..._`
        
        return Exp.sendMessage(
          cht.id,
          {
            text: tekks,
            contextInfo
          }, { quoted: cht }
        )
      }
    }

    /*
      🔧 Handling LID (Linked ID / PC user)
      - getSender akan mencari ID dalam Data.lids
      - Jika user masih @lid, minta mereka bergabung ke grup dengan addressingMode @lid
      - func.getGroupMetadata otomatis menyimpan data peserta (lid -> id) ke Data.lids
    */
    
    if (!is.group && cht.sender.endsWith('@lid')) {
      let isJoin = false;
      let urlgc = Array.isArray(cfg.urlgc) ? cfg.urlgc : [];

      let urls = urlgc.length === 0
      ? []
      : urlgc;

      let metadata;

      if (urls.length > 0) {
        for (let url of urls) {
          let code = url.split('/').slice(-1)?.[0]?.split('?')?.[0]
          keys[code] ??= await Exp.groupGetInviteInfo(code).then(a => a.id);
          metadata = await func.getGroupMetadata(keys[code], Exp);
  
          let mem = metadata.participants.map(a => a.lid);
          if (mem.includes(cht.sender)) {
            isJoin = true;
            break;
          }
        }
      }

      if (
        metadata?.addressingMode === 'lid' &&
        !isJoin &&
        (!cht.memories.cdIsJLid || cht.memories.cdIsJLid >= Date.now())
      ) {
        cht.memories.cdIsJLid = Date.now() + func.parseTimeString('10 menit');
        let listText = urls.map(a => `- ${a}`).join('\n');
    
        let teks = `Nomor asli Anda tidak dapat terdeteksi karena menggunakan @lid. \nSilakan bergabung ke grup resmi bot ${botnickname} agar sistem dapat mengenali nomor Anda. \n> Tanpa bergabung, data Anda hanya akan tersimpan sebagai @lid dan tidak lengkap\n\n\`LIST UNDANGAN GRUP\`\n${listText}\n\n*CATATAN*:\n_Setelah bergabung, harap tunggu 2 menit sebelum menggunakan bot. \nData anggota grup diperbarui setiap 2 menit sekali...`

        await Exp.sendMessage(
          cht.id, 
          {
            text: teks,
            contextInfo
          }, { quoted: cht }
        )
          
        await sleep(1000);
      }
    }

    let except = is.antiTagall || is.antibot || is.antilink;
    if ((is.baileys || is.mute || is.onlyadmin) && !except) return;
    
    let exps = { Exp, store, cht, is, chatDb };
    let ev = new Data.EventEmitter(exps);
    Data.ev ??= ev;
    
    if (
      (
        cht.type === 'groupInviteMessage' || 
        (typeof cht.msg === "string" && (
          cht.msg.startsWith('Undangan untuk bergabung') ||
          cht.msg.startsWith('Invitation to join') ||
          cht.msg.startsWith('Buka tautan ini') ||
          cht.msg.includes('chat.whatsapp.com')
        ))
      ) &&
      !is.baileys &&
      !is.group &&
      !is.newsletter &&
      !is.owner
    ) {
     
      Exp.sendMessage(cht.id, {
        text: `♥︎ Haii kak @${cht.sender.split("@")[0]},\n` +
          `sebelum itu, jika ingin *${botname}* gabung di grupnya silahkan sewa bot dulu yahh...\n\n` +
          "Jika ingin melakukan sewa bot,\n" +
          "silahkan hubungi nomor ownerku yang dibawah, hehehe :3\n\n" +
          "Owh iya satu lagi, kalau dia off tunggu aja yah soal nya munkin dia sibuk dengan keseharian nya",
        contextInfo: {
          mentionedJid: [cht.sender]
        }
      }, { quoted: cht });
      await sleep(500);
      return ev.contactOwner("⌗ Silahkan hubungi ownerku jika ingin menyewa bot");
    }
    
    if (!is.offline && !is.afk && ((is.group ? cht.cmd : cht.msg) || cht.reaction)) {
      if (
        cfg.register &&
        !func.archiveMemories.has(cht.sender) &&
        !is.newsletter &&
        !['register','daftar'].includes(cht.cmd?.toLowerCase())
      )
        return Exp.sendMessage(cht.id, {
          text: `♥︎ Haii kak @${cht.sender.split("@")[0]},\nsepertinya kamu belum terdaftar nihh\n\nsilahkan daftar terlebih dahulu yahh!! biar aku bisa mengenali mu\n\n⌗ cara daftar\n.daftar nama-kamu | umur-kamu | jenis-kelamin`,
          contextInfo: {
            mentionedJid: [cht.sender]
          },
          footer: "jika ga ingin ribet silahkan pencet tombol dibawah ini, biar bisa daftar otomatis :)",
          buttons: [
            {
              buttonId: `.daftar ${cht.pushName}-${String(Math.floor(Math.random() * 999999999)).padStart(9, '0')}|${Math.floor(Math.random() * 20) + 10}|${['pria', 'wanita'][Math.floor(Math.random() * ['pria', 'wanita'].length)]}`, 
              buttonText: { 
                displayText: "Daftar"
              } 
            }
          ],
          viewOnce: true,
          headerType: 6
        }, { quoted: cht })
      cht.cmd &&
        (await Promise.all([
          'questionCmd' in cht.memories &&
            func.archiveMemories.delItem(cht.sender, 'questionCmd'),
          ev.emit(cht.cmd),
        ]));
      cht.reaction && (await Data.reaction({ ev, ...exps }));
    } else {
      await Data.In({ ev, ...exps });
    }

    /*!-======[ Chat Interactions Add ]======-!*/
    !cht.cmd &&
      is.botMention &&
      (await func.archiveMemories.addChat(cht.sender));

    await func.archiveMemories.setItem(cht.sender, 'name', cht.pushName);
    func.archiveMemories.setItem(cht.sender, 'lastChat', Date.now());
  } catch (error) {
    console.error('Error in client.js:', error);
  }
  return;
}
