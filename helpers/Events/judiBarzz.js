/*!-======[ Module Imports ]======-!*/
const fs = "fs".import()
const { default: ms } = await "ms".import()

export default async function on({ cht, Exp, store, ev, is }) {
    const { sender, id, reply, edit } = cht;
    const { func } = Exp;
    let { archiveMemories:memories, parseTimeString, clearSessionConfess, findSenderCodeConfess, formatDuration } = func
    let infos = Data.infos;
    
global.cooldownBet = global.cooldownBet || new Map();
const cooldownBet = global.cooldownBet;

ev.on({
  cmd: ['bet'],
  listmenu: ['bet'],
  tag: "judi",
  isGroup: true
}, async ({ cht, args }) => {
  const query = Array.isArray(args) ? args.join('') : String(args || '');
  const jumlah = parseInt(query);
   const now = Date.now();
  const cd = 60 * 1000;
  const last = cooldownBet.get(cht.sender) || 0;

  if (now - last < cd) {
    const sisa = Math.ceil((cd - (now - last)) / 1000);
    return Exp.sendMessage(cht.id, {
      text: `⏳ Tunggu ${sisa} detik lagi sebelum bertaruh lagi.`,
    }, { quoted: cht });
  }

  cooldownBet.set(cht.sender, now);
  
  const tJ = "⚠️ Masukkan jumlah energi yang valid untuk bertaruh!\n\nContoh: *.bet 100*";
  const gC = "💤 Energi kamu tidak cukup untuk bertaruh sebanyak itu.\n\n👉 Coba kurangi jumlah taruhanmu!";
  const roll = "```🎰 Menyalakan mesin taruhan...\n🌀 Mesin semakin cepat berputar...\n\n⏳ Menunggu mesin berhenti...```";
  const LoSe = `😿 Kamu *kalah* dan kehilangan ${jumlah}⚡ energi.\n\n🎲 Keberuntungan belum berpihak hari ini...\n> Jangan menyerah, coba lagi nanti!`;

  if (!jumlah || isNaN(jumlah) || jumlah <= 0) {
    return Exp.sendMessage(cht.id, {
      text: tJ,
      contextInfo: {
        externalAdReply: {
          title: `Alya Gambling Game 🎲`,
          body: `© Alisa Mikhailovna Kujou`,
          thumbnail: fs.readFileSync(fol[10] + 'judi2.jpg'),
          mediaUrl: cfg.gcurl,
          sourceUrl: cfg.ig,
          renderLargerThumbnail: false,
          showAdAttribution: true,
          mediaType: 2,
        },
        forwardingScore: 1999,
        isForwarded: true,
      }
    }, { quoted: cht });
  }

  const user = await memories.get(cht.sender);
  if (user.energy < jumlah) {
    return Exp.sendMessage(cht.id, {
      text: gC,
      contextInfo: {
        externalAdReply: {
          title: `Alya Gambling Game 🎲`,
          body: `© Alisa Mikhailovna Kujou`,
          thumbnail: fs.readFileSync(fol[10] + 'judi2.jpg'),
          mediaUrl: cfg.gcurl,
          sourceUrl: cfg.ig,
          renderLargerThumbnail: false,
          showAdAttribution: true,
          mediaType: 2,
        },
        forwardingScore: 1999,
        isForwarded: true,
      }
    }, { quoted: cht });
  }
  
  if (jumlah >= 100000) {
    return Exp.sendMessage(cht.id, {
      text: `\`\`\`JUMLAH TERLALU BANYAK...\n\nBatas nominal di atas 99.999\`\`\``,
      contextInfo: {
        externalAdReply: {
          title: `Alya Gambling Game 🎲`,
          body: `© Alisa Mikhailovna Kujou`,
          thumbnail: fs.readFileSync(fol[10] + 'judi2.jpg'),
          mediaUrl: cfg.gcurl,
          sourceUrl: cfg.ig,
          renderLargerThumbnail: false,
          showAdAttribution: true,
          mediaType: 2,
        },
        forwardingScore: 1999,
        isForwarded: true,
      }
    }, { quoted: cht });
  }
  
  await Exp.sendMessage(cht.id, {
    text: roll,
    contextInfo: {
      externalAdReply: {
        title: `Alya Gambling Game 🎲`,
        body: `© Alisa Mikhailovna Kujou`,
        thumbnail: fs.readFileSync(fol[10] + 'judi.jpg'),
        mediaUrl: cfg.gcurl,
        sourceUrl: cfg.ig,
        renderLargerThumbnail: true,
        showAdAttribution: true,
        mediaType: 1,
      },
      forwardingScore: 1999,
      isForwarded: true,
    }
  }, { quoted: cht });

  await sleep(5000);

  const menang = Math.random() < 0.25;
  if (!menang) {
    return Exp.sendMessage(cht.id, {
      text: LoSe,
      contextInfo: {
        externalAdReply: {
          title: `Alya Gambling Game 🎲`,
          body: `© Alisa Mikhailovna Kujou`,
          thumbnail: fs.readFileSync(fol[10] + 'judi2.jpg'),
          mediaUrl: cfg.gcurl,
          sourceUrl: cfg.ig,
          renderLargerThumbnail: false,
          showAdAttribution: true,
          mediaType: 2,
        },
        forwardingScore: 1999,
        isForwarded: true,
      }
    }, { quoted: cht });
  }

  const kategori = Math.floor(Math.random() * 4);
  let hasil = 0;
  let pesan = "";

  const Bar1 = Math.floor(Math.random() * 51) + 50;
  const Bar2 = Math.floor(Math.random() * 21) + 40;
  const Bar3 = Math.floor(Math.random() * 6) + 15;

  switch (kategori) {
    case 0:
      hasil = jumlah * Bar2;
      pesan = `🎉 *JACKPOT BESAR!!!*\n- ${jumlah} x ${Bar2}\n\n🎊 Total Hadiah: *${hasil} energi⚡*`;
      break;
    case 1:
      hasil = jumlah * Bar1;
      pesan = `🔥 *SUPER JACKPOT!!*\n- ${jumlah} x ${Bar1}\n\n🎊 Kamu menang *${hasil} energi!⚡*`;
      break;
    case 2:
      hasil = jumlah * Bar3;
      pesan = `✨ *MENANG BESAR!*\n- ${jumlah} x ${Bar3}\n\n🎊 Kamu mendapatkan *${hasil} energi ⚡*`;
      break;
    case 3:
      hasil = jumlah;
      pesan = `🪄 *Seriii*\n- Energi kamu kembali utuh sebesar *${jumlah}⚡*\n> Setidaknya kamu nggak rugi!`;
      break;
  }

  await func.archiveMemories["addEnergy"](cht.sender, hasil);

  await Exp.sendMessage(cht.id, {
    text: pesan,
    contextInfo: {
      externalAdReply: {
        title: `Alya Gambling Game 🎲`,
        body: `© Alisa Mikhailovna Kujou`,
        thumbnail: fs.readFileSync(fol[10] + 'judi2.jpg'),
        mediaUrl: cfg.gcurl,
        sourceUrl: cfg.ig,
        renderLargerThumbnail: false,
        showAdAttribution: true,
        mediaType: 2,
      },
      forwardingScore: 1999,
      isForwarded: true,
    }
  }, { quoted: cht });
});
}