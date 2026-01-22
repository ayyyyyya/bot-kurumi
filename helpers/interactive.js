const { exec } = await 'child'.import();
const { getContentType } = 'baileys'.import();
const util = await 'util'.import();
const _exec = util.promisify(exec);
const fs = 'fs'.import();
const moment = 'timezone'.import();
const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss');
const { transcribe } = await (fol[2] + 'transcribe.js').r();
const { ai } = await `${fol[2]}reasoner.js`.r();

function getBarzz918() {
  return new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
}

const maxCommandExpired = 7000;

let urls = {
  tiktok: 'tiktok',
  youtu: 'youtube',
  instagram: 'instagram',
  'fb.watch': 'facebook',
  facebook: 'facebook',
  'pin.it': 'pinterest',
  pinterest: 'pinterest',
  mediafire: 'mediafire',
  xiaohongshu: 'rednote',
  'xhslink.com': 'rednote',
  'github.com': 'github',
  'spotify.com': 'spotify',
};

export default async function In({ cht, Exp, store, is, ev }) {
  const { func } = Exp;
  let { archiveMemories: memories, parseTimeString } = func;
  let { sender } = cht;
  
  try {
    const commandExpired = memories.getItem(sender, 'commandExpired');
    let isPendingCmd =
      ['y', 'iy', 'iya', 'yakin', 'hooh', 'iye', 'iyh'].includes(
        cht?.msg?.toLowerCase()
      ) && Date.now() < commandExpired
        ? memories.getItem(sender, 'command')
        : false;
    cht.msg = isPendingCmd ? isPendingCmd : cht.msg;
    if (isPendingCmd) {
      await memories.delItem(sender, 'command');
      await memories.delItem(sender, 'commandExpired');
    }
    let quotedQuestionCmd = memories.getItem(sender, 'quotedQuestionCmd') || {};
    let questionCmd =
      quotedQuestionCmd[cht?.quoted?.stanzaId] ||
      memories.getItem(sender, 'questionCmd');
    let isQuestionCmd =
      questionCmd &&
      cht.quoted &&
      (quotedQuestionCmd[cht?.quoted?.stanzaId] ||
        String(cht.quoted.sender) === String(Exp.number))
        ? questionCmd.accepts.some((i) => i == cht?.msg?.toLowerCase()) ||
          questionCmd.accepts.length < 1
        : false;
    if (isQuestionCmd) {
      if (Date.now() > questionCmd.emit.exp) {
        if (quotedQuestionCmd?.[cht?.quoted?.stanzaId]) {
          delete quotedQuestionCmd[cht.quoted.stanzaId];
          memories.setItem(sender, 'quotedQuestionCmd', quotedQuestionCmd);
        } else {
          memories.delItem(sender, 'questionCmd');
        }
      }
    }
    let isMsg =
      !is?.cmd && !is?.me && !is?.baileys && cht.id !== 'status@broadcast';
    let isEval = cht?.msg?.startsWith('>');
    let isEvalSync = cht?.msg?.startsWith('=>');
    let isExec = cht?.msg?.startsWith('$');
    let danger = cht?.msg?.slice(2) || '';
    const sanitized = danger.replace(/\s/g, '');
    const dangerous = [
      'rm-rf',
      'rm-rf--no-preserve-root',
      'mkfs',
      'rm-f',
      'rm-drf',
      'wipe',
      'shred',
      'chmod-r777',
      'chown',
      'find/-name*.log-delete',
      '/*',
      '*.*',
      '*',
      '/.',
      '/..',
      '>/dev/null',
    ];

    const chatDb = Data.preferences[cht.id] || {}

	const deletable = { delete: cht.key }
	const isNotPrivileged = !is.me && !is.owner && !is.groupAdmins && is.botAdmin

	const replyPayload = (type = 'media') => ({
	   text: `‼️ \`𝗣𝗘𝗥𝗜𝗡𝗚𝗔𝗧𝗔𝗡\` ‼️\n\nHaii kak @${cht.sender.split('@')[0]}...\nKamu tau ga? pesan tipe \`${type}\`\nnggak diperbolehkan di grup ini 🙄\n\nTolong ikuti aturan grup yang telah diterapkan,\ndan terimakasih atas pengertiannya...`,
	    contextInfo: {
	      externalAdReply: {
			title: `❏ 𝓐𝓵𝔂𝓪 [ アリヤ ]`,
            body: `time ${getBarzz918()}`,
			thumbnail: fs.readFileSync(fol[10] + 'thumb1.jpg'),
			mediaUrl: cfg.gcurl,
			sourceUrl: `https://wa.me/${owner[0]}`,
			renderLargerThumbnail: false,
			showAdAttribution: true,
			mediaType: 2,
		  },
		  forwardingScore: 1999,
	      isForwarded: true,
		   mentionedJid: [cht.sender]
	    }
	})

    if (
       is.group &&
       chatDb.antistickerpack &&
       cht.message?.stickerPackMessage &&
       isNotPrivileged
    ) {
       await Exp.sendMessage(cht.id, deletable)
       await sleep(1500)
	   await Exp.sendMessage(cht.id, replyPayload("stiker pack"))
	} else if (
	    is.group && 
	    chatDb.antisticker && 
	    cht.message?.stickerMessage && 
	    isNotPrivileged
    ) {
       await Exp.sendMessage(cht.id, deletable)
       await sleep(1500)
	   await Exp.sendMessage(cht.id, replyPayload("stiker"))

	} else if (
	   is.group && 
	   chatDb.antitagsw && 
	   cht.message?.groupStatusMentionMessage &&
	   isNotPrivileged
	) {
	   await Exp.sendMessage(cht.id, deletable)
	   await sleep(1500)
	   await Exp.sendMessage(cht.id, replyPayload("tag sw"))
 
    } else if (
       is.group && 
       chatDb.antiimage &&
       cht.message?.imageMessage && 
       isNotPrivileged
    ) {
       await Exp.sendMessage(cht.id, deletable)
       await sleep(1500)
       await Exp.sendMessage(cht.id, replyPayload("image"))

    } else if (
       is.group && 
       chatDb.antivideo && 
       cht.message?.videoMessage && 
       isNotPrivileged
    ) {
       await Exp.sendMessage(cht.id, deletable)
	   await sleep(1500)
	   await Exp.sendMessage(cht.id, replyPayload("video"))

	} else if (
	    is.group && 
	    chatDb.antivoice && 
	    cht.message?.audioMessage?.ptt === true && 
	    isNotPrivileged
	) {
	   await Exp.sendMessage(cht.id, deletable)
	   await sleep(1500)
	   await Exp.sendMessage(cht.id, replyPayload("voice note"))
    
    } else if (
       is.group && 
       chatDb.antich && 
       cht.message?.extendedTextMessage?.contextInfo?.forwardedNewsletterMessageInfo && 
       isNotPrivileged
    ) {
	   await Exp.sendMessage(cht.id, deletable)
	   await sleep(1500)
	   await Exp.sendMessage(cht.id, replyPayload("pesan channel"))
			
	} else if (
	   is.group && 
	   chatDb.antikontak && 
	   cht.message?.contactMessage && 
	   isNotPrivileged
	) {
	   await Exp.sendMessage(cht.id, deletable)
	   await sleep(1500)
	   await Exp.sendMessage(cht.id, replyPayload("kontak"))
	    
    } else if (
       is.group && 
       chatDb.antidokumen && 
       cht.message?.documentMessage && 
       isNotPrivileged
    ) {
	   await Exp.sendMessage(cht.id, deletable)
       await sleep(1500)
	   await Exp.sendMessage(cht.id, replyPayload("dokumen"))
			
	} else if (
	   is.group && 
	   chatDb.antievent && 
	   cht.message?.eventMessage && 
	   isNotPrivileged
	) {
	   await Exp.sendMessage(cht.id, deletable)
	   await sleep(1500)
	   await Exp.sendMessage(cht.id, replyPayload("event"))
			
    } else if (
       is.group && 
       chatDb.antitag && 
       cht.mention?.length && 
       isNotPrivileged
    ) {
	   await Exp.sendMessage(cht.id, deletable)
	   await sleep(1500)
	   await Exp.sendMessage(cht.id, replyPayload("tag"))
			
    }
    
    if (
      chatDb.antitoxic &&
      is.group &&
      !is.me &&
      !is.groupAdmins &&
      !is.owner &&
      is.botAdmin &&
      cht.msg
    ) {
      const toxicWords = [
        "anjing", "anjir", "anjay", "anjaylah", "anjg", "anj", "ajg",
        "bangsat", "bngst", "bngsat", 
        "bajingan", "bji", "bjn",
        "kontol", "kntl", "kontl",
        "memek", "mmk", "meki",
        "jancok", "jancuk", "jancukkk", "jancokk",
        "goblok", "gblk", "goblog", "goblogg",
        "babi", "bbi", "babik",
        "tolol", "tololl", "tolool",
        "ngentot", "ngntot", "ngentd", "ngewe", "ngewew",
        "idiot", "idiott",
        "kampret", "kmpret",
        "keparat", "kprat",
        "setan", "syetan", "saiton", "satan",
        "dongo", "dongok",
        "pantek", "pntk", "pant*k", 
        "lonte", "l0nte", "lonthe", 
        "pelacur", "lacur", "cabul",
        "colmek", "colok", "coli", "masturb",
        "bokep", "b0kep", "bkp",
        "jembut", "jmbut", "jembod", "jemboot",
        "pepek", "pep3k", 
        "titit", "tete", "tetek", "totong",
        "peju", "airmani", "mani", 
        "peler", "pler", "pler*",
        "kimak", "kim4k",
        "asu", "asw",
        "monyet", "mnyet",
        "tolol", "bloon", "blo’on",
        "brengsek", "brngsek", "breegsek",
        "bodoh", "bdh",
        "koplak", "koplok",
        "gila", "gile",
        "edun", "edan",
        "tai", "tae", "tayi", "taii",
        "bejad", "bejat", "bjad",
        "brengsek", "brengsekku",
        "kacung",
        "paria",
        "bencong", "banci", "homo", "lesbi",
        "sarap", "saraf",
        "brengsek", "brengsekke",
        "anjrit",
        "ngehe", "ngentd",
        "fuck", "fck", "fcku", "fckyou",
        "shit", "shet", "shitt",
        "bitch", "btch", "bicth",
        "dick", "d1ck",
        "pussy", "pusy", "pusey",
        "cock", "c0ck",
        "asshole", "ashole",
        "motherfucker", "mf", "mthrfckr",
        "bastard",
        "damn", "damnit", "damnny",
        "nigga", "nigger", "niga"
      ];

      const msgLower = cht.msg.toLowerCase();
      const detected = toxicWords.find(word => msgLower.includes(word));

      if (detected) {
        chatDb.toxicDb ??= {};
        chatDb.toxicDb[cht.sender] ??= { count: 0, last: 0 };

        let userToxic = chatDb.toxicDb[cht.sender];
        userToxic.count = parseInt(userToxic.count || 0) + 1;
        userToxic.last = Date.now();

        if (userToxic.count >= 3) {
          await Exp.groupParticipantsUpdate(
            cht.id, 
            [cht.sender], 
            'remove'
          );
          
          await Exp.sendMessage(
            cht.id,
            deletable
          )
          
          await sleep(1500)
          
          let teek = "‼️ `𝗣𝗘𝗥𝗜𝗡𝗚𝗔𝗧𝗔𝗡` ‼️\n\n" +
          `👋 Sayonara...\n` +
          `@${cht.sender.split("@")[0]} si bro udah di peringati ampe 3x dan masih ngeyel mending aku kick...\n\n` +
          `See you next time, lalu kita kasih paham🤭`
          
          await Exp.sendMessage(
            cht.id,
            {
              text: teek,
              contextInfo: {
                mentionedJid: [
                  cht.sender
                ]
              }
            }, { quoted: Data.fquoted.fbisnis }
          )
          
          delete barDB.toxicDb[cht.sender];
      
        } else {
      
          await Exp.sendMessage(
            cht.id,
            deletable
          )
          
          await sleep(1500)
          
          let teks = "‼️ `𝗣𝗘𝗥𝗜𝗡𝗚𝗔𝗧𝗔𝗡` ‼️\n\n" +
          `😇 Astaghfirullah brother @${cht.sender.split("@")[0]}, kata ~${detected}~ gitu tuh seharusnya ga boleh di ucapin...\n\n` +
          `Karena kamu telah ngirim kata kasar/jorok, maka kamu di beri peringatan...\n\n` +
          `Peringatan ke-${userToxic.count}\n` +
          `Dosa +2`
          
          await Exp.sendMessage(
            cht.id,
            {
              text: teks,
              contextInfo: {
                mentionedJid: [
                  cht.sender
                ] 
              }
            }, { quoted: Data.fquoted.fbisnis }
          )
        }
      }
    }

    const isDangerous =
      dangerous.some((pattern) => sanitized.includes(pattern)) && !isPendingCmd;

    /*!-======[ Automatic Ai ]======-!*/
    let isBella =
      isMsg &&
      (chatDb?.ai_interactive || (is.group && is.owner)) &&
      !is?.document &&
      !is.baileys &&
      !is?.sticker &&
      ((cht?.msg
        ?.toLowerCase()
        .startsWith(
          botnickname.toLowerCase().slice(0, botnickname.length - 1)
        ) &&
        !cht?.me) ||
        cht?.msg?.toLowerCase().startsWith(botnickname.toLowerCase()) ||
        is?.botMention ||
        !is?.group ||
        (is?.owner &&
          cht?.msg
            ?.toLowerCase()
            .startsWith(
              botnickname.toLowerCase().slice(0, botnickname.length - 1)
            ) &&
          !cht?.me) ||
        (is?.owner && is?.botMention));
    let usr = sender.split('@')[0];

    let usr_swap = memories.getItem(usr, 'fswaps');
    let isSwap =
      usr_swap &&
      usr_swap?.list?.length > 0 &&
      is.image &&
      cht.quoted &&
      cht.quoted.sender == Exp.number &&
      !cht.msg;

    let usr_babygenerator = memories.getItem(usr, 'babygenerator');
    let isBabyGen =
      usr_babygenerator &&
      cht.quoted &&
      usr_babygenerator.messages_id.includes(cht.quoted.stanzaId) &&
      !cht.cmd;

    let isTagAfk =
      cht.mention?.length > 0 &&
      (cht.quoted ? true : cht.msg.includes('@')) &&
      cht.mention?.some((a) => memories.getItem(a, 'afk') && a !== sender) &&
      !is.owner &&
      !is.me &&
      is.group;

    let isGame =
      'game' in chatDb && chatDb.game.id_message.includes(cht.quoted?.stanzaId);
    
    let isAbsen =
      is.group && chatDb.absen && /^(hadir)$/i.test(cht.msg)
    
    let isSalam = /(ass?alamu[']?alaikum)/i.test(
    cht.msg
      ?.toLowerCase()
      .replace(/[\s]/g, '')
      .replace(/[^a-z']/g, '')
    );

    const conff = !is.group
      ? await (async (_id) => {
          let s1 = memories.getItem(_id, 'confess')?.sess || {};
          if (s1.target && s1.acc) {
            let dses = memories.getItem(s1.target, 'confess')?.sess || {};
            if (
              s1.last &&
              s1.max &&
              Date.now() - s1.last <= parseTimeString(s1.max) &&
              dses.target?.split('@')[0] === _id.split('@')[0]
            ) {
              return `${String(s1.target)?.split('@')[0] + from.sender}|${s1.code?.toUpperCase()}|${s1.inviter ? 'inviter' : 'participant'}|${s1.max}`;
            } else {
              await func.clearSessionConfess(_id, s1.target);
              await cht.reply(
                `‼️ Sessi percakapan \`${s1.code?.toUpperCase()}\` telah berakhir!`
              );
              return false;
            }
          }
          return false;
        })(sender)
      : false;
    let isConfess = Boolean(conff);
    let isAfkBack = Boolean(is.afk);
    let isAntiTagOwner =
      cfg.antitagowner &&
      !is.owner &&
      cht?.msg?.includes('@') &&
      cht.mention.some((m) => owner.some((o) => m.includes(o)));
    let Response = cht.msg
      ? Object.keys(Data.response).find(
          (a) => a == cht.msg.toLowerCase().replace(/ /g, '')
        )
      : null;
    let isResponse = Response in Data.response;
    
    let storeList = Data.preferences[cht.id]?.store?.list || [];
    let isStore = storeList.some(v => 
      v.produk.toLowerCase() === cht.msg?.toLowerCase().trim()
    );
    
    let introCard = Data.preferences[cht.id]?.welcomeCard?.welcome || null;
    let isIntro = is.group && /^(intro)$/i.test(cht.msg);

    let isGwJoin = is.group && /^(join)$/i.test(cht.msg);
    let isGwList = is.group && /^(giveaway)$/i.test(cht.msg);

    switch (!0) {
      case isIntro: {
        if (!introCard) return;

        Exp.sendMessage(
          cht.id,
          { text: introCard[0] },
          { quoted: cht }
        );
      }
      break
      case isGwJoin:
        {
          let giveaway = Data.preferences[cht.id]?.giveaway
          if (!giveaway) return

          if (giveaway.members.includes(sender)) {
            return cht.reply("❗ Kamu sudah ikut giveaway ini")
          }

          if (giveaway.members.length >= giveaway.participant) {
            return cht.reply("❗ Slot peserta sudah penuh")
          }

          giveaway.members.push(cht.sender)

          await Exp.sendMessage(
            cht.id,
            {
              react: { 
                text: "✅", 
                key: cht.key 
              }
            }
          )

          await cht.reply(
            `✅ Berhasil join giveaway *${giveaway.type}*\n` +
            `Sekarang sudah ada ${giveaway.members.length}/${giveaway.participant} peserta`
          )

          if (giveaway.members.length === giveaway.participant) {
            let teks = "乂  *G I V E A W A Y  R E A D Y*\n\n" +
              `@${giveaway.create.split("@")[0]} jumlah peserta yang join giveaway kali ini udah pas nih, silahkan ketik *.acak* untuk mencari pemenang giveaway✨🎉\n\n` +
              "_semoga kalian beruntung..._"

            await Exp.sendMessage(
              cht.id,
              {
                text: teks,
                 contextInfo: {
                   mentionedJid: [ 
                     giveaway.create 
                   ]
                 }
              }
            )
          }
        }
        break
      case isGwList:
        {
          let giveaway = Data.preferences[cht.id]?.giveaway
          if (!giveaway) return cht.reply("❗ Tidak ada giveaway yang sedang berlangsung")

          let teks =
            "乂  *G I V E A W A Y  A K T I F*\n\n" +
            `• *Tipe* : ${giveaway.type}\n` +
            `• *Hadiah* : ${giveaway.type == "premium" ? giveaway.value + " premium" : giveaway.value + " energy"}\n` +
            `• *Peserta* : ${giveaway.members.length}/${giveaway.participant}\n` +
            `• *Dibuat oleh* : @${giveaway.create.split("@")[0]}\n\n` +
            `➡️ Untuk join, cukup ketik *join* di grup ini`

          await Exp.sendMessage(
            cht.id,
            {
              text: teks,
              contextInfo: {
                mentionedJid: [
                  giveaway.create, ...giveaway.members
                ]
              }
            }, { quoted: cht }
          )
        }
        break
      case isAbsen:
        if (!chatDb.absen?.status || chatDb.absen?.status !== "berlangsung") return

        if (chatDb.absen.present.includes(sender)) return

        chatDb.absen.present.push(sender)

        await Exp.sendMessage(
          cht.id, 
          {
            react: { 
              text: "✅",
              key: cht.key 
            }
          }
        );
        break
      case isTagAfk:
        let maxTag = 10;
        let tagAfk = memories.getItem(cht.mention[0], 'afk');
        let userData = await memories.get(sender);
        tagAfk.taggedBy = tagAfk.taggedBy || {};
        if (!(sender in tagAfk.taggedBy)) tagAfk.taggedBy[sender] = 0;
        tagAfk.taggedBy[sender]++;
        if (tagAfk.taggedBy[sender] >= maxTag) {
          await cht.reply(
            `\`INFORMATION FOR YOU\`\n\nKamu telah di banned dari bot selama 1 hari karena melakukan tag hingga ${maxTag}x ‼️`
          );
          delete tagAfk.taggedBy[sender];
          let tme = '1 Hari';
          let _time = parseTimeString(tme);
          if (!('banned' in userData)) {
            userData.banned = 0;
          }
          let date =
            userData.banned && userData.banned > Date.now()
              ? userData.banned
              : Date.now();
          let bantime = date + _time;
          await Exp.sendMessage(sender, {
            text: `\`INFORMATION FOR YOU\`\n\nKamu telah di baned selama ${tme} karena terus melakuka tag hingga ${maxTag}x ‼️`,
          });
          return memories.setItem(sender, 'banned', bantime);
        }
        if(is.botAdmin) await cht.delete()

        let rsn = `‼️ \`JANGAN DI TAG\` ‼️\n\nKamu terdeteksi nge tag\nuser yang sedang afk!\n\ndengan alasan:\n\`${tagAfk.reason}\`\n\n⚠️ \`PERINGATAN\` ⚠️\njika kamu telah ngetag user sebanyak *${maxTag}x*,\nmaka kamu di banned dari bot ${botnickname}, \nkarena itu termasuk spam, yang mengganggu sistem kerja ku 😑🙄\n\ndan kamu telah ngetag user yang afk sebanyak \`${tagAfk.taggedBy[sender]}\``
        await cht.reply(rsn);
        memories.setItem(cht.mention[0], 'afk', tagAfk);
        break;
      case isAfkBack:
        let dur = func.formatDuration(Date.now() - is.afk.time);
        let text = `🎉 \`WELCOME BACK\` 🎉\n\n@${sender.split('@')[0]} telah kembali dari afk!\n\nDengan alasan:\n- ${is.afk.reason} \n\n⏳ Selama:\n- ${dur.days > 0 ? dur.days + 'hari ' : ''}${dur.hours > 0 ? dur.hours + 'jam ' : ''}${dur.minutes > 0 ? dur.minutes + 'menit ' : ''}${dur.seconds > 0 ? dur.seconds + 'detik ' : ''}${dur.milisecondss > 0 ? dur.milisecondss + 'ms ' : ''}`;
        await cht.reply(text, {
          mentions: [sender],
        });
        memories.delItem(sender, 'afk');
        break;
      case is.antibot:
        cht.warnGc({
          type: 'antibot',
          warn: 'Bot terdeteksi!, harap aktifkan mute di group ini atau ubah mode menjadi self!',
          kick: 'Anda akan dikeluarkan karena tidak menonaktifkan bot hingga peringatan terakhir!',
          max: 5,
        });
        break;
      case is.antiedit:
        {
          let edited = await store.loadMessage(cht.id, cht[cht.type].key.id);

          let originalMessage = edited.message;
          let editedMessage = cht.message.protocolMessage.editedMessage;

          let getMessageText = (message) => {
            const msgType = getContentType(message);
            switch (msgType) {
              case 'conversation':
                return message[msgType];
              case 'extendedTextMessage':
                return message[msgType]?.text;
              case 'imageMessage':
              case 'videoMessage':
                return message[msgType]?.caption;
              default:
              return '[Media/Unsupported Type]';
            }
          };

          let originalText = getMessageText(originalMessage) || '[No Text]';
          let editedText = getMessageText(editedMessage) || '[No Text]';

          let bodyText =  `♥︎ ۪۪┈─𝗮𝗻𝘁𝗶 𝗲𝗱𝗶𝘁 𝗮𝗰𝘁𝗶𝘃𝗲──────╮\n\n` +
            `╭── ࣪ 𖥻 ๋ ℹ️ *𝐈𝐧𝐟𝐨 𝐔𝐬𝐞𝐫*\n` +
            `┊  ⃘✿ 𝚄𝚜𝚎𝚛       : @${cht.sender.split('@')[0]}\n` +
            `┊  ⃘✿ 𝙽𝚊𝚖𝚊       : ${func.getName(cht.sender)}\n` +
            `╰─────────────────\n\n` +
            `࣪ 𖥻 ๋  *Pesan sebelum di edit*\n` +
            `⤷ ${originalText.replace(/\n/g, '\n')}\n` +
            `\n\n` +
            `࣪ 𖥻 ๋  *Pesan setelah di edit*\n` +
            `⤷ ${editedText.replace(/\n/g, '\n')}\n` +
            `﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏`;

          let contextInfo = {
            stanzaId: edited.key.id,
            participant: cht.sender,
            quotedMessage: edited,
            mentionedJid: [cht.sender]
          };

          await Exp.relayMessage(
            cht.id,
            {
              viewOnceMessage: {
                 message: {
                   interactiveMessage: {
                     contextInfo,
                     body: {
                       text: bodyText,
                     },
                     footer: {
                       text: '⸙ *Catatan*:\nUntuk menonaktifkan sistem anti edit silahkan ketik *.off antiedit*\n\n_khusus admin grup atau owner aja..._',
                     },
                     carouselMessage: {},
                   },
                 },
              },
            }, {}
          );
        }
      break;
      
      case is.antidelete:
        let deleted = await store.loadMessage(cht.id, cht[cht.type].key.id);
        await Data.utils({ cht: deleted, Exp, is: {}, store });
        let bodyText = `♥︎ ۪۪┈─𝗮𝗻𝘁𝗶 𝗱𝗲𝗹𝗲𝘁𝗲 𝗮𝗰𝘁𝗶𝘃𝗲──────╮\n\n` +
        `╭── ࣪ 𖥻 ๋ ℹ️ *𝐈𝐧𝐟𝐨 𝐏𝐞𝐬𝐚𝐧*\n` +
        `┊  ⃘✿ 𝚄𝚜𝚎𝚛       : @${cht.sender.split('@')[0]}\n` +
        `┊  ⃘✿ 𝙽𝚊𝚖𝚊       : ${func.getName(cht.sender)}\n` +
        `┊  ⃘✿ 𝚃𝚒𝚙𝚎 𝚙𝚎𝚜𝚊𝚗 : ${deleted.type}\n` +
        `╰─────────────────`
        let contextInfo = {
          stanzaId: deleted.key.id,
          participant:
            deleted.sender || deleted.key.participant || deleted.key.remoteJid,
          quotedMessage: deleted,
          mentionedJid: [cht.sender]
        };
        
        await Exp.relayMessage(
          cht.id,
          {
            viewOnceMessage: {
              message: {
                interactiveMessage: {
                  contextInfo,
                  body: {
                    text: bodyText,
                  },
                  footer: {
                    text: '⸙ *Catatan*:\nUntuk menonaktifkan sistem anti delete silahkan ini, ketik *.off antidelete*\n\n_khusus admin grup atau owner aja..._',
                  },
                  carouselMessage: {},
                },
              },
            },
          },
          {}
        );
        let message = deleted.message;
        let type = getContentType(message);

        if (type == 'conversation') {
          message = {
            extendedTextMessage: {
              text: message[type],
            },
          };
          type = getContentType(message);
        }

        message[type].contextInfo = {
          isForwarded: true,
        };
        await Exp.relayMessage(cht.id, message, {});
        break;
      case is.antilink:
        await cht.warnGc({
          type: 'antilink',
          warn: 'Anda terdeteksi mengirimkan link!. Harap ikuti peraturan disini untuk tidak mengirim link!',
          kick: 'Anda akan dikeluarkan karena melanggar peraturan grup untuk tidak mengirim link hingga peringatan terakhir!',
          max: 3,
        });
        cht.delete();
        break;
      case is.antiTagall:
        await cht.warnGc({
          type: 'antitagall',
          warn: 'Anda terdeteksi melakukan tagall/hidetag. Harap ikuti peraturan disini untuk tidak melakukan tagall/hidetag karena akan mengganggu member disini!',
          kick: 'Anda akan dikeluarkan karena melanggar peraturan grup untuk tidak melakukan tagall/hidetag hingga peringatan terakhir!',
          max: 3,
        });
        cht.delete();
        break;
      case isEvalSync:
        if (!is?.owner) return;
        if (isDangerous) {
          memories.setItem(sender, 'command', cht.msg);
          memories.setItem(
            sender,
            'commandExpired',
            Date.now() + maxCommandExpired
          );
          return cht.reply('Yakin ga bg?');
        }
        try {
          let evsync = await eval(`(async () => { ${cht?.msg?.slice(3)} })()`);
          if (typeof evsync !== 'string') evsync = await util.inspect(evsync);
          cht.reply(evsync);
        } catch (e) {
          cht.reply(String(e));
        }
        break;

      case isEval:
        if (!is?.owner) return;
        if (isDangerous) {
          memories.setItem(sender, 'command', cht.msg);
          memories.setItem(
            sender,
            'commandExpired',
            Date.now() + maxCommandExpired
          );
          return cht.reply('Yakin?');
        }
        try {
          let evaled = await eval(cht?.msg?.slice(2));
          if (typeof evaled !== 'string') evaled = await util.inspect(evaled);
          if (evaled !== 'undefined') {
            cht.reply(evaled);
          }
        } catch (err) {
          cht.reply(String(err));
        }
        break;

      case isExec:
        if (!is?.owner) return;
        if (isDangerous) {
          memories.setItem(sender, 'command', cht.msg);
          memories.setItem(
            sender,
            'commandExpired',
            Date.now() + maxCommandExpired
          );
          return cht.reply('Yakin?');
        }
        let txt;
        try {
          const { stdout, stderr } = await _exec(cht?.msg?.slice(2));
          txt = stdout || stderr;
        } catch (error) {
          txt = `Error: ${error}`;
        }
        cht.reply(txt);
        break;
      case isQuestionCmd:
        let [cmd, ...q] = questionCmd.emit.split` `;
        cht.cmd = cmd;
        cht.isQuestionCmd = true;
        cht.q =
          q && q.length > 0
            ? `${q.join(' ')} ${cht.msg?.trim()}`.trim()
            : `${cht.msg?.trim()}`.trim();
        ev.emit(cmd);
        memories.delItem(sender, 'questionCmd');
        if (quotedQuestionCmd?.[cht?.quoted?.stanzaId]) {
          delete quotedQuestionCmd[cht.quoted.stanzaId];
          memories.setItem(sender, 'quotedQuestionCmd', quotedQuestionCmd);
        } else {
          memories.delItem(sender, 'questionCmd');
        }
        break;
      case is.offline:
        {
          global.offresponse = global.offresponse || {};
          global.offresponse[sender] = global.offresponse[sender] || 0;
          global.offresponse[sender]++;
          if (global.offresponse[sender] > cfg.offline.max) return;
          let chat = cht.msg || '';
          let isImage = is?.image
            ? true
            : is.quoted?.image
              ? cht.quoted.sender !== Exp.number
              : false;
          if (cht?.type === 'audio') {
            try {
              chat = (await transcribe(await cht?.download()))?.text || '';
            } catch (error) {
              console.error('Error transcribing audio:', error);
              chat = '';
            }
          }
          if (isImage) {
            let download = is.image ? cht?.download : cht?.quoted?.download;
            isImage = await func.minimizeImage(await download());
          }

          try {
            let _ai = await ai({
              text: chat,
              id: cht?.sender,
              fullainame: botfullname,
              nickainame: botnickname,
              senderName: cht?.pushName,
              ownerName: ownername,
              date: func.newDate(),
              role: `temennya ${ownername}`,
              msgtype: cht?.type,
              custom_profile: func.tagReplacer(
                `Kamu adalah asisten pemilikmu/ownermu yang bernama ${ownername}. Tugasmu adalah memberitahu siapa pun yang menghubungi bahwa ${ownername} sedang off karena alasan "${cfg.offline.reason}" dan telah offline sejak ${func.dateFormatter(cfg.offline.time, 'Asia/Jakarta')} jadi kamu bertugas untuk memberitahukan itu. Jika mereka bertanya tentang alasan ${ownername} offline, ulangi informasi yang sama dengan nada sopan.\n\n**Sifat dan kepribadianmu**:\n${cfg.logic}`,
                {
                  botfullname,
                  botnickname,
                }
              ),
              image: isImage,
              commands: [
                {
                  description:
                    'Jika perlu atau kamu sedang ingin membalas dengan suara',
                  output: {
                    cmd: 'voice',
                    msg: `Pesan di sini. Gunakan gaya bicara ${botnickname} yang menarik dan realistis, lengkap dengan tanda baca yang tepat agar terdengar hidup saat diucapkan.`,
                  },
                },
              ],
            });
            let config = _ai?.data || {};
            await func.addAiResponse();
            switch (config?.cmd) {
              case 'voice':
                try {
                  cfg.ai_voice = cfg.ai_voice || 'bella';
                  await Exp.sendPresenceUpdate('recording', cht?.id);
                  return Exp.sendMessage(
                    cht?.id,
                    {
                      audio: {
                        url: `${api.xterm.url}/api/text2speech/elevenlabs?key=${api.xterm.key}&text=${config?.msg}&voice=${cfg.ai_voice}&speed=0.9`,
                      },
                      mimetype: 'audio/mpeg',
                      ptt: true,
                    },
                    {
                      quoted: cht,
                    }
                  );
                } catch (e) {
                  return console.error(e.response);
                }
            }

            if (config?.cmd !== 'voice') {
              const method =
                cfg.editmsg && config?.energyreply ? 'edit' : 'reply';

              function isFormatMsg(lines) {
                const listRegex = /^[\d\w$&-]+\.\s?.+$/m;
                const symbolListRegex = /^[$\-&]\s?.+$/m;
                return lines
                  .split('\n')
                  .some(
                    (a) =>
                      listRegex.test(a.trim()) || symbolListRegex.test(a.trim())
                  );
              }

              if (config?.msg) {
                if (
                  cfg.ai_interactive?.partResponse &&
                  !config.msg.split('\n').some((a) => a.trim().startsWith('**'))
                ) {
                  let sp = config.msg.split('\n\n');
                  for (let line of sp) {
                    if (!line) return;
                    let isFormat = isFormatMsg(line);
                    if (!isFormat) {
                      let parts = line.split('. ');
                      for (let part of parts) {
                        let typing = part.length * 50;
                        await Exp.sendPresenceUpdate('composing', cht.id);
                        await sleep(typing);
                        await cht.reply(part.trim(), {
                          ai: true,
                        });
                        await sleep(2000);
                      }
                    } else {
                      let typing = line.length * 50;
                      await Exp.sendPresenceUpdate('composing', cht.id);
                      await sleep(typing);
                      await cht.reply(line.trim(), {
                        ai: true,
                      });
                      await sleep(2000);
                    }
                  }
                } else {
                  await cht['reply'](config.msg, {
                    ai: true,
                  });
                }
              }
            }
          } catch (error) {
            console.error('Offline: Error parsing AI response:', error);
          }
        }
        break;
      case isGame:
        Data.eventGame({
          cht,
          Exp,
          store,
          is,
          ev,
          chatDb,
        });
        break;

      case isSwap:
        is?.quoted?.image && delete is.quoted.image;
        cht.cmd = 'faceswap';
        ev.emit('faceswap');
        break;

      case isBabyGen:
        delete cht.q;
        ev.emit('babygenerator');
        break;

      case isConfess:
        {
          let [jid, code, _type, _max] = conff.split('|');
          let kcid1 = `confess|${sender.split('@')[0]}`;
          let kcid2 = `confess|${jid.split('@')[0]}`;

          let _text = `${cht.msg}` + `\n\n> ${code}`;
          let _mess = {
            contextInfo: {
              isForwarded: true,
            },
          };
          let { type } = ev.getMediaType();
          let value;
          let isText = ['conversation', 'extendedTextMessage'].includes(type);
          if (!isText) {
            value = await cht?.download();
            _mess['caption'] = _text;
          } else {
            type = 'text';
            value = _text;
          }
          _mess[type] = value;
          await Exp.sendMessage(
            jid,
            _mess,
            cht.quoted ? keys[kcid2] : undefined
          );
          await sleep(500);
          await Exp.sendMessage(cht.id, {
            react: {
              text: '📤',
              key: cht.key,
            },
          });
          keys[kcid1] = {
            quoted: {
              message: cht.message,
              key: cht.key,
            },
          };
        }
        break;

      case isBella:
        {
          let usr = sender.split('@')[0];
          let user = Data.users[usr];
          let premium = user?.premium ? Date.now() < user.premium.time : false;
          user.autoai.use += 1;
          if (Date.now() >= user?.autoai?.reset && !premium) {
            user.autoai.use = 0;
            user.autoai.reset = Date.now() + parseInt(user?.autoai?.delay);
            user.autoai.response = false;
          }
          if (user?.autoai?.use > user?.autoai?.max && !premium) {
            let formatTimeDur = func.formatDuration(
              user?.autoai?.reset - Date.now()
            );
            let resetOn = func.dateFormatter(
              user?.autoai?.reset,
              'Asia/Jakarta'
            );
            let txt = `\`LIMIT INTERAKSI TELAH HABIS\`\n\n*Waktu tunggu:*\n- ${formatTimeDur.days}hari ${formatTimeDur.hours}jam ${formatTimeDur.minutes}menit ${formatTimeDur.seconds}detik ${formatTimeDur.milliseconds}ms\n⏱️*Direset Pada:* ${resetOn}\n\n*Ingin interaksi tanpa batas?*\nDapatkan premium!, untuk info lebih lanjut ketik *.harga premium*`;
            if (!user?.autoai?.response) {
              user.autoai.response = true;
              cht.reply(txt);
              return;
            } else {
              return;
            }
          }

          let chat = cht?.msg?.startsWith(botnickname.toLowerCase())
            ? cht?.msg?.slice(botnickname.length)
            : cht?.msg || '';
          let isImage = is?.image
            ? true
            : is.quoted?.image
              ? cht.quoted.sender !== Exp.number
              : false;
          if (cht?.type === 'audio') {
            try {
              chat = (await transcribe(await cht?.download()))?.text || '';
            } catch (error) {
              console.error('Error transcribing audio:', error);
              chat = '';
            }
          }
          if (isImage) {
            let download = is.image ? cht?.download : cht?.quoted?.download;
            isImage = await func.minimizeImage(await download());
          }
          chat = func.clearNumbers(chat);
          try {
            let _ai = await ai({
              text: chat,
              id: cht?.sender,
              fullainame: botfullname,
              nickainame: botnickname,
              senderName: cht?.pushName,
              ownerName: ownername,
              date: func.newDate(),
              role: cht?.memories?.role,
              msgtype: cht?.type,
              custom_profile: func.tagReplacer(cfg.logic, {
                botfullname,
                botnickname,
              }),
              image: isImage,
              commands: [
                {
                  description: 'Jika perlu direspon dengan suara',
                  output: {
                    cmd: 'voice',
                    msg: `Pesan di sini. Gunakan gaya bicara ${botnickname} yang menarik dan realistis, lengkap dengan tanda baca yang tepat agar terdengar hidup saat diucapkan.`,
                  },
                },
                {
                  description:
                    'Jika dalam pesan ada yang ingin memberikan donasi atau donate',
                  output: {
                    cmd: 'donasi',
                    msg: 'Isi pesan kamu seperti sedang memberikan metode pembayaran qris untuk donasi',
                  },
                },
                {
                  description: 'Jika pesan berisi permintaan foto atau pap',
                  output: {
                    cmd: 'pap',
                    msg: 'Tulis pesan seakan-akan kamu baru saja selesai selfie dan sedang mengirimkan fotomu',
                  },
                },
                {
                  description:
                    'Jika dalam pesan ada link tiktok.com dan lalu diminta untuk mendownloadnya',
                  output: {
                    cmd: 'tiktok',
                    cfg: {
                      url: 'isi link tiktok yang ada dalam pesan',
                    },
                  },
                },
                {
                  description:
                    'Jika dalam pesan ada link instagram.com dan diminta untuk mendownloadnya',
                  output: {
                    cmd: 'ig',
                    cfg: {
                      url: 'isi link instagram yang ada dalam pesan',
                    },
                  },
                },
                {
                  description:
                    'Jika pesan adalah perintah/permintaan untuk mencarikan sebuah gambar',
                  output: {
                    cmd: 'pinterest',
                    cfg: {
                      query:
                        "isi gambar apa yang ingin dicari dalam pesan (tambahkan '--geser <jumlah>' di ujung query jika gambar yang diminta lebih dari satu!, contoh: ayam --geser 5)",
                    },
                  },
                },
                {
                  description:
                    'Jika pesan adalah perintah untuk membuka/menutup group',
                  output: {
                    cmd: ['opengroup', 'closegroup'],
                  },
                },
                {
                  description:
                    'Jika pesan adalah perintah untuk menampilkan menu',
                  output: {
                    cmd: 'menu',
                  },
                },
                {
                  description:
                    'Jika pesan adalah meminta lora kamu',
                  output: {
                    cmd: 'lora',
                    cfg: {
                      prompt:
                        'isi teks prompt yang menggambarkan tentang kamu, prompt yang menghasilkan gambar seolah-olah kamu itu sedang selfie ((tulis prompt dalam bahasa inggris))',
                    },
                  },
                },
                {
                  description:
                    'Jika pesan adalah permintaan untuk mencarikan sebuah video',
                  output: {
                    cmd: 'ytmp4',
                    cfg: {
                      url: 'isi judul video yang diminta',
                    },
                  },
                },
                {
                  description:
                    'Jika pesan adalah permintaan untuk memutar sebuah lagu',
                  output: {
                    cmd: 'ytm4a',
                    cfg: {
                      url: 'isi judul lagu yang diminta',
                    },
                  },
                },
                {
                  description:
                    'Jika pesan adalah permintaan untuk membuatkan gambar',
                  output: {
                    cmd: 'txt2img',
                    cfg: {
                      prompt:
                        'isi teks prompt yang menggambarkan gambar yang diinginkan. Tulis dalam bahasa Inggris.',
                    },
                  },
                },
                {
                  description:
                    'Jika dalam pesan ada link pin.it atau pinterest.com dan diminta untuk mendownloadnya',
                  output: {
                    cmd: 'pinterestdl',
                    cfg: {
                      url: 'isi link instagram yang ada dalam pesan',
                    },
                  },
                },
                {
                  description:
                    'Jika pesan adalah perintah untuk mendownload menggunakan link youtube',
                  output: {
                    cmd: 'ytm4a',
                    cfg: {
                      url: 'isi link youtube yang ada dalam pesan',
                    },
                  },
                },
                {
                  description:
                    'Jika pesan adalah permintaan untuk membuat sticker atau mengubah sebuah gambar menjadi sticker. (Abaikan isi konten pada gambar!)',
                  output: {
                    cmd: 'sticker',
                  },
                },
                {
                  description:
                    'Jika berisi pesan yang membutuhkan jawaban dari internet atau search engine',
                  output: {
                    cmd: 'bard',
                    cfg: {
                      query: 'isi pertanyaan yg dimaksud dalam pesan',
                    },
                  },
                },
                {
                  description:
                    'Jika pesan adalah permintaan melakukan pengeditan atau perubahan pada gambar',
                  output: {
                    cmd: 'img2img',
                    cfg: {
                      prompt:
                        'isi teks prompt yang menjelaskan perubahan yang diinginkan pada gambar. Tulis dalam bahasa Inggris',
                    },
                  },
                },
                {
                  description:
                    'Jika pesan adalah permintaan untuk mengubah gambar menjadi video atau melakukan penganimasian gambar',
                  output: {
                    cmd: 'img2video',
                    cfg: {
                      prompt:
                        'Jelaskan animasi atau transformasi video yang diinginkan dari gambar. Tentukan elemen seperti gerakan, transisi, atau efek. Tulis dalam bahasa Inggris.',
                    },
                  },
                },
              ],
            });
            let paprdm = cfg.pap || []
            let config = _ai?.data || {};
            await func.addAiResponse();
            let noreply = false;
            switch (config?.cmd) {
              case 'sticker':
                await cht.reply(config?.msg || 'woke (⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧');
                return ev.emit('s');
              case 'afk':
                await cht.reply(config?.msg || 'woke (⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧');
                cht.q = config?.cfg?.reason;
                return ev.emit('afk');
              case 'bard':
                await cht.reply(config?.msg || 'woke (⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧');
                cht.q = config.cfg?.query;
                return ev.emit('bard');
              case 'public':
                if (!is?.owner) return cht.reply('males nanggepin 🧢');
                global.cfg.public = true;
                return cht.reply('✅ Berhasil... mode publik telah aktif');
              case 'self':
                if (!is?.owner) return cht.reply(`males nanggepin 🧢`);
                global.cfg.public = false;
                return cht.reply('✅ Berhasil... mode publik telah nonaktif');
              case 'voice':
                try {
                  cfg.ai_voice = cfg.ai_voice || 'bella';
                  await Exp.sendPresenceUpdate('recording', cht?.id);
                  return Exp.sendMessage(
                    cht?.id,
                    {
                      audio: {
                        url: `${api.xterm.url}/api/text2speech/elevenlabs?key=${api.xterm.key}&text=${config?.msg}&voice=${cfg.ai_voice}&speed=0.9`,
                      },
                      mimetype: 'audio/mpeg',
                      ptt: true,
                    },
                    {
                      quoted: cht,
                    }
                  );
                } catch (e) {
                  console.log(e.response);
                }
              case "pap":
		        noreply = true
		        if (!cfg.pap.length) return cht.reply("Aku belum punya pap hehew :)")
		        return Exp.sendMessage(
		           cht.id, 
		           { image: { url: paprdm.getRandom()  }, 
		             caption: config?.msg 
		           }, { quoted: cht }
		        );
              case 'donasi':
                noreply = true;
                return Exp.sendMessage(
                  cht.id,
                  { image: fs.readFileSync(fol[10] + 'qris.jpg'),
                    caption: config?.msg,
                  }, { quoted: cht }
                );
              case 'tiktok':
              case 'pinterestdl':
              case 'menu':
              case 'ig':
                noreply = true;
                is.url = [config?.cfg?.url || ''];
                await cht.reply(config?.msg || 'woke (⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧');
                return ev.emit(config?.cmd);
              case 'ytm4a':
              case 'ytmp4':
                noreply = true;
                cht.cmd = config?.cmd;
                is.url = [config?.cfg?.url || ''];
                await cht.reply(config?.msg || 'woke (⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧');
                return ev.emit(config?.cmd);
              case 'lora':
                noreply = true;
                cfg.models = cfg.models || {
                  checkpoint: 1552,
                  loras: [2067],
                };
                let { checkpoint, loras } = cfg.models;
                cht.q = `${checkpoint}${JSON.stringify(loras)}|${config?.cfg?.prompt}|blurry, low quality, low resolution, deformed, distorted, poorly drawn, bad anatomy, bad proportions, unrealistic, oversaturated, underexposed, overexposed, watermark, text, logo, cropped, cluttered background, cartoonish, bad face, double face, abnormal`;
                await cht.reply(config?.msg || 'woke (⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧');
                return ev.emit('txt2img');
              case 'txt2img':
                cht.q = config?.cfg?.prompt || '';
                await cht.reply(config?.msg || 'woke (⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧');
                return ev.emit('dalle3');
              case 'img2img':
                cht.q = config?.cfg?.prompt || '';
                await cht.reply(config?.msg || 'woke (⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧');
                return ev.emit('edit');
              case 'pinterest':
                noreply = true;
                await cht.reply(config?.msg || 'woke (⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧');
                cht.q = config?.cfg?.query || '';
                return ev.emit(config?.cmd);
              case 'closegroup':
                noreply = true;
                cht.q = 'close';
                return ev.emit('group');
              case 'opengroup':
                noreply = true;
                cht.q = 'open';
                return ev.emit('group');
              case 'img2video':
                cht.q = config?.cfg?.prompt || '';
                await cht.reply(config?.msg || 'woke (⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧');
                return ev.emit('i2v');
            }

            if (config?.energy && cfg.ai_interactive.energy) {
              let conf = {};
              conf.energy = /[+-]/.test(`${config.energy}`)
                ? `${config.energy}`
                : `+${config.energy}`;
              if (conf.energy.startsWith('-')) {
                conf.action = 'reduceEnergy';
              } else {
                conf.action = 'addEnergy';
              }
              await memories[conf.action](
                cht?.sender,
                parseInt(conf.energy.slice(1))
              );
              await cht.reply(`*${config.energy}* ᴇɴᴇʀɢʏ ᴛᴇʀᴘᴀᴋᴀɪ⚡*`);
              config.energyreply = true;
            }
            if (config?.cmd !== 'voice' && !noreply) {
              const method =
                cfg.editmsg && config?.energyreply ? 'edit' : 'reply';

              function isFormatMsg(lines) {
                const listRegex = /^[\d\w$&-]+\.\s?.+$/m;
                const symbolListRegex = /^[$\-&]\s?.+$/m;
                return lines
                  .split('\n')
                  .some(
                    (a) =>
                      listRegex.test(a.trim()) || symbolListRegex.test(a.trim())
                  );
              }

              if (config?.msg) {
                if (
                  cfg.ai_interactive?.partResponse &&
                  !config.msg.split('\n').some((a) => a.trim().startsWith('**'))
                ) {
                  let sp = config.msg.split('\n\n');
                  for (let line of sp) {
                    if (!line) return;
                    let isFormat = isFormatMsg(line);
                    if (!isFormat) {
                      let parts = line.split('. ');
                      for (let part of parts) {
                        let typing = part.length * 50;
                        await Exp.sendPresenceUpdate('composing', cht.id);
                        await sleep(typing);
                        await cht.reply(part.trim());
                        await sleep(2000);
                      }
                    } else {
                      let typing = line.length * 50;
                      await Exp.sendPresenceUpdate('composing', cht.id);
                      await sleep(typing);
                      await cht.reply(line.trim());
                      await sleep(2000);
                    }
                  }
                } else {
                  await cht[method](config.msg, keys[sender]);
                }
              }
            }
          } catch (error) {
            console.error('Error parsing AI response:', error);
          }
        }
        break;
      case isSalam:
         Exp.sendMessage(
            cht.id, 
            { 
              audio: {
                url: "https://files.catbox.moe/4z7mcy.opus" 
              }, 
              mimetype: 'audio/mpeg',
              ptt: true, 
			  contextInfo: {
                 externalAdReply: {
                    title: `❏ 𝓐𝓵𝔂𝓪 [ アリヤ ]`,
                    body: `time ${getBarzz918()}`,
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
            },
            {
              quoted: cht 
            }
         );
        break;

      case isAntiTagOwner:
        {
          let message = Data.response['tagownerresponse'];
          if (message) {
            let type = getContentType(message);
            message[type].contextInfo = {
              stanzaId: cht.key.id,
              participant: cht.key.participant || cht?.quoted?.key.remoteJid,
              quotedMessage: cht,
            };
            Exp.relayMessage(cht.id, message, {});
          } else {
            Exp.sendMessage(
              cht.id,
              {
                image: {
                  url: "https://files.catbox.moe/1umz7t.png"
                },
                caption: "1x tag owner = 1k🤭😋"
              },
              {
                quoted: cht
              }
            )
          }
        }
        break;

      case isResponse:
        {
          let message = Data.response[Response];
          let type = getContentType(message);
          if (typeof message[type] === 'object') {
            message[type].contextInfo = {
              stanzaId: cht.key.id,
              participant: cht.key.participant || cht?.quoted?.key.remoteJid,
              quotedMessage: cht,
              mentionedJid: message[type]?.contextInfo?.mentionedJid,
            };
          }
          Exp.relayMessage(cht.id, message, {});
        }
        break;
        
      case isStore:
        {
          let storeData = Data.preferences[cht.id]?.store;
          let produk = storeData?.list?.find(
            v => v.produk.toLowerCase() === cht.msg.toLowerCase().trim()
          );
    
          if (!produk) return
      
         cht.reply(`${produk.harga}`);
        }
        break;
      
      case is.autodownload:
        {
          let _url = is.url[0];
          let cmd =
            _url &&
            Object.entries(urls).find(([keyword]) => _url.includes(keyword))
              ? urls[
                  Object.entries(urls).find(([keyword]) =>
                    _url.includes(keyword)
                  )[0]
                ]
              : null;
          cmd &&
            (
              await cht.reply(
                `♥︎ ۪۪┈─ 𝗔𝘂𝘁𝗼 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗗𝗲𝘁𝗲𝗰𝘁𝗲𝗱 ─────╮\n\n` +
                `╭── ࣪ 𖥻 ๋ ✨ *AUTO DOWNLOAD*\n` +
                `┊   ✧ 𝗟𝗶𝗻𝗸 *${cmd.slice(0, 1).toUpperCase() + cmd.slice(1)}*\n` +
                `┊   𝘁𝗲𝗿𝗱𝗲𝘁𝗲𝗸𝘀𝗶 𝘀𝗲𝗰𝗮𝗿𝗮 𝗮𝘂𝘁𝗼\n` +
                `┊   𝗽𝗿𝗼𝘀𝗲𝘀 𝗱𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗱𝗶𝗺𝘂𝗹𝗮𝗶...\n` +
                `╰─────────────────\n\n` +
                `⏳ 𝗠𝗼𝗵𝗼𝗻 𝘁𝘂𝗻𝗴𝗴𝘂 𝘀𝗮𝗺𝗽𝗮𝗶 𝘀𝗲𝗹𝗲𝘀𝗮𝗶...`
              )
            );
          cmd &&
            ev.emit(
              cmd == 'github'
                ? 'gitclone'
                : cmd == 'youtube'
                  ? 'ytm4a'
                  : cmd == 'pinterest'
                    ? 'pinterestdl'
                    : cmd
            );
        }
      break;
      
    }
  } catch (error) {
    console.error('Error in Interactive:', error);
  }
}