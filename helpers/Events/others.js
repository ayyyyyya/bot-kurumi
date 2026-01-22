/*!-======[ Module Imports ]======-!*/
const fs = "fs".import();
const { downloadContentFromMessage } = "baileys".import();
const { TermaiCdn } = await (fol[0] + "cdn.termai.js").r();

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
  const { id, reply, edit, sender, animate, react } = cht;
  const { func } = Exp;
  let infos = Data.infos
  
  const date = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }))
  const hour = date.getHours()
  let sapaan
  if (hour >= 1 && hour < 4) {
    sapaan = "kamu tidak tidur?"
  } else if (hour >= 4 && hour < 11) {
    sapaan = "🌄selamat pagi"
  } else if (hour >= 11 && hour < 15) {
    sapaan = "☀️selamat siang"
  } else if (hour >= 15 && hour < 18) {
    sapaan = "🌇selamat sore"
  } else {
    sapaan = "🌃selamat malam"
  }
  
  ev.on(
    {
      cmd: ['allmenu', 'semuamenu', 'menuall'],
      listmenu: ['allmenu'],
      tag: 'other' 
    }, 
    async () => {   
      
      await react('⏱️')
        
      let hit = func.getTotalCmd()
      let topcmd =  func.topCmd(3)
      let totalCmd = Object.keys(Data.events).length
      
      let head = `Hii kak @${sender.split("@")[0]} ${sapaan}.ᐟ` +
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
      
      let text = head + func.menuFormatter(Data.events, { ...cfg.menu, ...cht })
      let menu = {} 
      
      if(cfg?.menu_type == "text"){
        menu.text = text
        await Exp.sendMessage(id, menu, { quoted: cht })
      } else if(cfg?.menu_type == "image" ){         
        menu.image = fs.readFileSync(fol[3] + "bell.jpg")
        menu.caption = text
        await Exp.sendMessage(id, menu, { quoted: cht })
      } else if(cfg?.menu_type == "liveLocation"){
        await Exp.relayMessage(cht.id, {
	      liveLocationMessage: {
	        degreesLatitude: -76.01801,
	        degreesLongitude: 22.662851,
	        caption: text,
            contextInfo: { participant: sender, quotedMessage: cht.message }
	      }
	    }, {})
      } else if(cfg?.menu_type == "order"){
        await Exp.relayMessage(cht.id, {
         "orderMessage": {
           "orderId": "530240676665078",
           "status": "INQUIRY",
           "surface": "CATALOG",
           "ItemCount": 0,
           "message": text,
           "sellerJid": "6281414210401@s.whatsapp.net",
           "token": "AR6oiV5cQjZsGfjvfDwl0DXfnAE+OPRkWAQtFDaB9wxPlQ==",
           "thumbnail": (await fs.readFileSync(fol[3] + "bell.jpg")).toString("base64"),
         }
       },{})
      } else if (cfg?.menu_type == "gift&linkpreview" && cfg.gift?.length > 0){
        let gift = cfg.gift.getRandom()
        menu = {
          video: { url: `${gift.video}` },
          gifPlayback: true,
          caption:  text,
          contextInfo: { 
            externalAdReply: {
              title: 'Hii kak ' + cht.pushName,
              body: "bagaimana kabarmu?",
              thumbnail: fs.readFileSync(fol[3] + "bell.jpg"),
              sourceUrl: cfg.tt,
              mediaUrl: "",
              renderLargerThumbnail: true,
              showAdAttribution: true,
              mediaType: 1,
            },
            forwardingScore: 1,
            isForwarded: true,
            mentionedJid: [sender],
            forwardedNewsletterMessageInfo: {
              newsletterJid: cfg.chId.newsletterJid,
              newsletterName: cfg.chId.newsletterName
            }
          }
        }
        await Exp.sendMessage(id, menu, { quoted: Data.fquoted.fbisnis })
        await Exp.sendMessage(id, { audio: { url: `${gift.audio}` }, ptt: true, mimetype: "audio/mpeg" })
        return 
      } else {
        menu = {
          text,
          contextInfo: { 
            externalAdReply: {
              title: 'Hii kak ' + cht.pushName,
              body: "bagaimana kabarmu?",
              thumbnail: fs.readFileSync(fol[3] + "bell.jpg"),
              sourceUrl: cfg.tt,
              mediaUrl: "",
              renderLargerThumbnail: true,
              showAdAttribution: true,
              mediaType: 1,
            },
            forwardingScore: 1,
            isForwarded: true,
            mentionedJid: [sender],
            forwardedNewsletterMessageInfo: {
              newsletterJid: cfg.chId.newsletterJid,
              newsletterName: cfg.chId.newsletterName
            }
          }
        }
        await Exp.sendMessage(id, menu, { quoted: Data.fquoted.fbisnis })
      }
       
      Data.audio?.menu?.length > 0 &&
      Exp.sendMessage(
        id,
        {
          audio: { url: Data.audio.menu.getRandom() },
          ptt: true,
          mimetype: 'audio/mpeg',
        }
      )
    }
  )

  ev.on(
    {
      cmd: ["reaction", "menureaction", "reactionmenu"],
      listmenu: ["reactionmenu"],
      tag: "other",
    },
    () => {
      cht.reply(infos.reaction.menu);
    },
  );

  ev.on(
    {
      cmd: ["rvome", "rvo", "getviewonce"],
      listmenu: ["getviewonce ℗", "rvome ℗"],
      tag: "others",
      premium: true,
      isMention: true,
      energy: 25,
    },
    async () => {
      try {
        let isV1 = ["image", "audio", "video", "viewOnce"].includes(
          cht.quoted.type,
        );
        let ab = isV1
          ? [
              {
                message: cht.quoted,
                key: {
                  remoteJid: cht.id,
                  fromMe: cht.quoted.sender == cht.id,
                  id: cht.quoted.stanzaId,
                  participant: cht.quoted.sender,
                },
              },
            ]
          : store.messages[id].array.filter(
              (a) =>
                a.key.participant.includes(cht.mention[0]) &&
                (a.message?.viewOnceMessageV2 ||
                  a.message?.viewOnceMessageV2Extension),
            );
        if (ab.length == 0) return cht.reply(infos.others.noDetectViewOnce);
        for (let aa of ab) {
          let thay = {
            msg:
              aa.message.viewOnceMessageV2?.message?.imageMessage ||
              aa.message.viewOnceMessageV2?.message?.videoMessage ||
              aa.message.viewOnceMessageV2Extension?.message?.audioMessage,
            type: isV1
              ? cht.quoted.type
              : aa.message.viewOnceMessageV2?.message?.imageMessage
                ? "image"
                : aa.message.viewOnceMessageV2?.message?.videoMessage
                  ? "video"
                  : "audio",
          };
          let buffer;
          if (isV1) {
            buffer = await cht.quoted.download();
          } else {
            let stream = await downloadContentFromMessage(thay.msg, thay.type);
            buffer = Buffer.from([]);
            for await (const chunk of stream) {
              buffer = Buffer.concat([buffer, chunk]);
            }
          }
          let mssg = {};
          if (cht.quoted.text) mssg.caption = cht.quoted.text || undefined;
          thay.type == "audio" && (mssg.ptt = true);
          await Exp.sendMessage(
            cht.cmd == "rvome" ? sender : id,
            { [thay.type]: buffer, ...mssg },
            { quoted: aa },
          );
        }
      } catch (e) {
        console.error(e);
        cht.reply(infos.others.noDetectViewOnce);
      }
    },
  );

  ev.on(
    {
      cmd: ["d", "del", "delete"],
      listmenu: ["delete"],
      tag: "other",
      isQuoted: true,
    },
    async () => {
      try {
        if (cht.quoted.sender !== Exp.number && !is.groupAdmins && !is.owner)
          return cht.reply(infos.messages.isAdmin);
        if (!is.groupAdmins && !is.owner) {
          let qsender = (await store.loadMessage(cht.id, cht.quoted.stanzaId))
            ?.message?.extendedTextMessage?.contextInfo.quotedMessage?.sender;
          if (qsender && qsender !== sender)
            return cht.reply(`*Anda tidak diizinkan menghapus pesan itu!*
\`Sebab:\`
${infos.others.readMore}
- Quoted pesan tersebut bukan berasal dari anda
- Anda bukan owner atau admin untuk mendapatkan izin khusus`);
        }
        cht.quoted.delete();
      } catch {
        cht.reply(infos.messages.failed);
      }
    },
  );

  ev.on(
    {
      cmd: ["statistic", "stats"]
    },
    async () => {
      const { cpuUsage, memoryUsage, processStats } =
        await func.getSystemStats();
      const runtimeText = processStats.runtime;

      const txt =
        cpuUsage
          .map(
            (cpu) =>
              `💻 *CPU ${cpu.cpu + 1}*\n` +
              `   Model: ${cpu.model}\n` +
              `   Usage: ${cpu.usage}\n`,
          )
          .join("\n") +
        `🧠 *Memory Usage*\n` +
        `   Total: ${memoryUsage.totalMemory}\n` +
        `   Free: ${memoryUsage.freeMemory}\n` +
        `   Used: ${memoryUsage.usedMemory}\n` +
        `📊 *Process Memory Usage*\n` +
        `   RSS: ${processStats.memoryUsage.rss}\n` +
        `   Heap Total: ${processStats.memoryUsage.heapTotal}\n` +
        `   Heap Used: ${processStats.memoryUsage.heapUsed}\n` +
        `   External: ${processStats.memoryUsage.external}\n` +
        `🚀 *Speed*: ${processStats.speed}\n` +
        `🕒 *Runtime*\n` +
        `   ${runtimeText.days}d ${runtimeText.hours}h ${runtimeText.minutes}m ${runtimeText.seconds}s ${runtimeText.milliseconds}ms\n` +
        `🔧 *Process Info*\n` +
        `   PID: ${processStats.pid}\n` +
        `   Title: ${processStats.title}\n` +
        `   Exec Path: ${processStats.execPath}`;
      return cht.reply(txt);
    },
  );
}
