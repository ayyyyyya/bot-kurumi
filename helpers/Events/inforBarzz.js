/*!-======[ Module Imports ]======-!*/
const fs = "fs".import()

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
   const { sender, id, reply, edit } = cht
   const { func } = Exp
   
ev.on({
  cmd: ['cnnnews'],
  listmenu: ['cnnnews'],
  tag: "news",
  energy: 15
}, async ({ cht }) => {
 try {
   const res = await fetch('https://api.siputzx.my.id/api/berita/cnn');
   const json = await res.json();
   
   if (!json.status || !json.data || ! json.data.length) {
     return cht.reply("❌ Gagal mendapatkan berita terbaru");
   }
   
   const berita = json.data[Math.floor(Math.random() * json.data.length)];
   
   const teks = `
📰 *Berita cnn Terbaru*

*${berita.title}*
- Tanggal: ${berita.time || 'Tidak diketahui'}

Berisi:
${berita.content}

Baca selengkapnya: ⬇️⬇️⬇️
*${berita.link}*
`;

    await Exp.sendMessage(cht.id, {
      text: teks,
      contextInfo: {
        externalAdReply: {
          title: `${cht.cmd} 📰`,
          body: `Berita terbaru dari Cnn News`,
          thumbnailUrl: berita.image_thumbnail,
          mediaUrl: cfg.gcurl,
          sourceUrl: berita.link,
          renderLargerThumbnail: false,
          showAdAttribution: true,
          mediaType: 2,
        },
        forwardingScore: 2000,
        isForwarded: true,
      }
    }, { quoted: cht });

  } catch (err) {
    console.error(err);
    cht.reply("❌ Terjadi kesalahan saat mengambil berita Kompas.com.");
  }
})
   
ev.on({
  cmd: ['jkt48news'],
  listmenu: ['jkt48news'],
  tag: "news",
  energy: 15
}, async ({ cht }) => {
  try {
    const res = await fetch(`https://api.siputzx.my.id/api/berita/jkt48`);
    const json = await res.json();

    if (!json.status || !json.data || !json.data.length) {
      return cht.reply("❌ Gagal mendapatkan berita terbaru");
    }

    const berita = json.data[Math.floor(Math.random() * json.data.length)];

    const teks = `
📰 *Berita JKT48 Terbaru*

*${berita.title}*
- Tanggal: ${berita.date || 'Tidak diketahui'}

Baca selengkapnya: ⬇️⬇️⬇️
*${berita.link}*
`;

    await Exp.sendMessage(cht.id, {
      text: teks,
      contextInfo: {
        externalAdReply: {
          title: `${cht.cmd}`,
          body: `Berita terbaru  dari Jkt48 News`,
          thumbnail: fs.readFileSync(fol[10] + 'jkt48.jpg'),
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

  } catch (err) {
    console.error(err);
    cht.reply("❌ Terjadi kesalahan saat mengambil berita.");
  }
})

ev.on({
  cmd: ['kompasnews'],
  listmenu: ['kompasnews'],
  tag: "news",
  energy: 15
}, async ({ cht }) => {
  try {
    const res = await fetch(`https://api.siputzx.my.id/api/berita/kompas`);
    const json = await res.json();

    if (!json.status || !json.data || !json.data.length) {
      return cht.reply("❌ Gagal mengambil berita dari Kompas.com.");
    }

    const berita = json.data[Math.floor(Math.random() * json.data.length)];
    const teks = `
📰 *Berita Kompas News*

*${berita.title}*
- Kategori: ${berita.category}
- Tanggal: ${berita.date}

${berita.description}

Baca selengkapnya: ⬇️⬇️⬇️
*${berita.link}*
`;

    await Exp.sendMessage(cht.id, {
      text: teks,
      contextInfo: {
        externalAdReply: {
          title: `${cht.cmd} 📰`,
          body: `Berita terbaru dari Kompas News`,
          thumbnailUrl: berita.image,
          mediaUrl: cfg.gcurl,
          sourceUrl: berita.link,
          renderLargerThumbnail: false,
          showAdAttribution: true,
          mediaType: 2,
        },
        forwardingScore: 2000,
        isForwarded: true,
      }
    }, { quoted: cht });

  } catch (err) {
    console.error(err);
    cht.reply("❌ Terjadi kesalahan saat mengambil berita Kompas.com.");
  }
})

ev.on({
  cmd: ['merdekanews'],
  listmenu: ['merdekanews'],
  tag: "news",
  energy: 15
}, async ({ cht }) => {
  try {
    const res = await fetch(`https://api.siputzx.my.id/api/berita/merdeka`);
    const json = await res.json();

    if (!json.status || !json.data || !json.data.length) {
      return cht.reply("❌ Gagal mengambil berita dari Merdeka.com.");
    }

    const berita = json.data[Math.floor(Math.random() * json.data.length)];
    const teks = `
📰 *Berita Merdeka News*

*${berita.title}*
- Kategori: ${berita.category}
- Tanggal: ${berita.date}

${berita.description}

Baca selengkapnya: ⬇️⬇️⬇️
*${berita.link}*
`;

    await Exp.sendMessage(cht.id, {
      text: teks,
      contextInfo: {
        externalAdReply: {
          title: `${cht.cmd} 📰`,
          body: `Berita terbaru dari Merdeka News`,
          thumbnailUrl: berita.image,
          mediaUrl: cfg.gcurl,
          sourceUrl: berita.link,
          renderLargerThumbnail: false,
          showAdAttribution: true,
          mediaType: 2,
        },
        forwardingScore: 2000,
        isForwarded: true,
      }
    }, { quoted: cht });

  } catch (err) {
    console.error(err);
    cht.reply("❌ Terjadi kesalahan saat mengambil berita Merdeka.com.");
  }
})

ev.on({
    cmd: ['newyear'],
    listmenu: ['newyear'],
    tag: "news",
    energy: 15
}, async () => {
    let now = new Date();
    let nextYear = new Date(now.getFullYear() + 1, 0, 1);
    let diff = nextYear - now;

    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    let minutes = Math.floor((diff / (1000 * 60)) % 60);
    let seconds = Math.floor((diff / 1000) % 60);

    const teks = `
🎉 *Hitung Mundur Tahun Baru:*
🗓 ${days} Hari ${hours} Jam ${minutes} Menit ${seconds} Detik
`;

   await Exp.sendMessage(cht.id, {
      text: teks,
       contextInfo: {
        externalAdReply: {
          title: `Starting from the new year`,
          body: `© Elaina MD V1.0`,
          thumbnail: fs.readFileSync(fol[10] + 'jpm4.jpg'),
          mediaUrl: cfg.gcurl,
          sourceUrl: cfg.ig,
          renderLargerThumbnail: false,
          showAdAttribution: true,
          mediaType: 2,
        },
        forwardingScore: 1999,
        isForwarded: true,
      }
    },{ quoted: cht });
})

ev.on({
  cmd: ['suaranews'],
  listmenu: ['suaranews'],
  tag: "news",
  energy: 15
}, async ({ cht }) => {
  try {
    const res = await fetch(`https://api.siputzx.my.id/api/berita/suara`);
    const json = await res.json();

    if (!json.status || !json.data || !json.data.length) {
      return cht.reply("❌ Gagal mendapatkan berita dari Suara.com");
    }

    const berita = json.data[Math.floor(Math.random() * json.data.length)];
    const teks = `
📰 *Berita Suara.com*

*${berita.title}*
- Tanggal: ${berita.date || 'Tidak diketahui'}

Baca selengkapnya: ⬇️⬇️⬇️
*${berita.link}*
`;

    await Exp.sendMessage(cht.id, {
      text: teks,
      contextInfo: {
        externalAdReply: {
          title: `${cht.cmd} 📰`,
          body: `Berita terbaru dari Suara News`,
          thumbnailUrl: berita.image,
          mediaUrl: cfg.gcurl,
          sourceUrl: berita.link,
          renderLargerThumbnail: false,
          showAdAttribution: true,
          mediaType: 2,
        },
        forwardingScore: 1999,
        isForwarded: true,
      }
    }, { quoted: cht });

  } catch (err) {
    console.error(err);
    cht.reply("❌ Terjadi kesalahan saat mengambil berita Suara.com.");
  }
})

ev.on({
  cmd: ['tribunnews'],
  listmenu: ['tribunnews'],
  tag: "news",
  energy: 15
}, async ({ cht }) => {
  try {
    const res = await fetch(`https://api.siputzx.my.id/api/berita/tribunnews`);
    const json = await res.json();

    if (!json.status || !json.data || !json.data.length) {
      return cht.reply("❌ Gagal mendapatkan berita dari Tribunnews");
    }

    const berita = json.data[Math.floor(Math.random() * json.data.length)];
    const linkFull = `https://www.tribunnews.com/${berita.link}`;
    const teks = `
📰 *Berita Tribunnews*

*${berita.title}*
- Tanggal: ${berita.time || 'Tidak diketahui'}

Baca selengkapnya: ⬇️⬇️⬇️
*${linkFull}*
`;

    await Exp.sendMessage(cht.id, {
      text: teks,
      contextInfo: {
        externalAdReply: {
          title: `${cht.cmd} 📰`,
          body: `Berita terbaru dari Tribun News`,
          thumbnailUrl: berita.image_thumbnail,
          mediaUrl: cfg.gcurl,
          sourceUrl: linkFull,
          renderLargerThumbnail: false,
          showAdAttribution: true,
          mediaType: 2,
        },
        forwardingScore: 1999,
        isForwarded: true,
      }
    }, { quoted: cht });

  } catch (err) {
    console.error(err);
    cht.reply("❌ Terjadi kesalahan saat mengambil berita Tribunnews.");
  }
})

}