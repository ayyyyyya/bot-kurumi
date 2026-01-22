/*!-======[ Module Imports ]======-!*/
const fs = "fs".import()

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
    let { sender, id, reply } = cht
    let { func } = Exp 
    let infos = Data.infos

const bar = cfg.bar;

const barzz =  [
  'cerpen-remaja','cerpen-anak','cerpen-misteri','cerpen-cinta','cerpen-budaya',
  'cerpen-romantis','cerpen-galau','cerpen-gokil','cerpen-inspiratif','cerpen-kehidupan',
  'cerpen-sastra','cerpen-jepang','cerpen-korea','cerpen-keluarga','cerpen-persahabatan',
  'cerpen-kristen','cerpen-ramadhan','cerpen-liburan','cerpen-lingkungan','cerpen-mengharukan',
  'cerpen-motivasi','cerpen-perjuangan','cerpen-nasihat','cerpen-pendidikan','cerpen-petualangan'
];

ev.on({
  cmd: barzz,
  listmenu: barzz,
  tag: 'cerita',
  enrgy: 15
}, async ({ cht }) => {
  await Exp.sendMessage(cht.id, { react: { text: "⏱️", key: cht.key } });

  try {
    const type = cht.cmd.replace("cerpen-", ""); 
    const res = await fetch(`https://api.botcahx.eu.org/api/story/cerpen?type=${type}&apikey=${bar}`);
    const json = await res.json();

    if (!json.status || !json.result) {
      return cht.reply("👾 Upss sepertinya terjadi kesalahan saat pengambilan data...");
    }

    const { title, author, kategori, lolos, cerita } = json.result;

    const teks = `
📖 Cerpen: *${title}*
👤 Penulis: *${author}*
📅 Lolos: *${lolos}*

🗂️ Kategori: *${kategori}*

📝 Cerita:
${cerita}
`.trim();

    await Exp.sendMessage(cht.id, {
      text: teks,
      contextInfo: {
        externalAdReply: {
          title: `Cerita Pendek`,
          body: `© Alya AI`,
          thumbnail: fs.readFileSync(fol[10] + 'ch3.jpg'),
          mediaUrl: cfg.gcurl,
          sourceUrl: cfg.tt,
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
    return cht.reply("⚠️ Terjadi kesalahan saat mengambil cerpen.");
  }
});

const kisahCmd = [
  "kisah-adam",
  "kisah-idris",
  "kisah-nuh",
  "kisah-hud",
  "kisah-shaleh",
  "kisah-ibrahim",
  "kisah-luth",
  "kisah-ismail",
  "kisah-ishaq",
  "kisah-yaqub",
  "kisah-yusuf",
  "kisah-syuaib",
  "kisah-ayub",
  "kisah-zulkifli",
  "kisah-musa",
  "kisah-harun",
  "kisah-dzulkarnain",
  "kisah-daud",
  "kisah-sulaiman",
  "kisah-ilyas",
  "kisah-ilyasa",
  "kisah-yunus",
  "kisah-zakaria",
  "kisah-yahya",
  "kisah-muhammad"
];

ev.on({
  cmd: kisahCmd,
  listmenu: kisahCmd,
  tag: "cerita",
  energy: 5
}, async () => {
const b = cht.cmd.split("-")[1];

/* 
⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑
   ＷＭ・ＢＡＲＲ・ＪＡＮＧＡＮ・ＤＩＨＡＰＵＳ
⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑

✦ We open jasa rekber ye, pakai lah qris ku nganggur nih 🗿
✦ Gw juga menyediakan jasa post akun, nanti gw post di seluruh gc gw
✦ Pastikan akun yang di beli udah di amankan sepenuh nya agar terhindari hb (Hack Back)
✦ Jika ada kendala akun di liar transaksi itu hukan tanggung jawab admin
✦ Admin cuma menjaga uang agar tetap aman saat proses transaksi ‼️

[ JASA ADMIN ]
- wa.me/6282238228919

⟡ Selalu pakai jasa admin agar terhindar dari penipuan,
*/

try {

const api = `https://api.botcahx.eu.org/api/muslim/kisahnabi?nabi=${b.toLowerCase()}&apikey=Barzz918`;
const BARR918 = await fetch(api);

if (!BARR918.ok) {
  return reply(`Terjadi kesalahan saat mengambil cerita nabi, pastikan nama nabi nya udah bener`);
}

const json = await BARR918.json();
const { name, kelahiran, wafat_usia: wafat, singgah, kisah } = json.result;

const txt = `
\`[ CERITA NABI ${b.toUpperCase()} ]\`

👳‍♂️ Nama: ${name}
🌟 Lahir: ${kelahiran}
📍 Singgah: ${singgah}
🥀 Wafat: ${wafat}

📖 *CERITA*
${kisah}
` 
await Exp.sendMessage(cht.id, {
 text: txt,
   contextInfo: {
     externalAdReply: {
       title: `Kisah Nabi 🌙`,
        body: `© Alya AI`,
        thumbnail: fs.readFileSync(fol[10] + 'kisah.jpg'),
        mediaUrl: cfg.gcurl,
        sourceUrl: cfg.tt,
        renderLargerThumbnail: true,
        showAdAttribution: true,
        mediaType: 1,
     },
      forwardingScore: 1999,
      isForwarded: true,
     forwardedNewsletterMessageInfo: {
       newsletterJid: cfg.chId.newsletterJid,
       newsletterName: cfg.chId.newsletterName,
     //serverMessageId: 152
     }
   }
}, { quoted: cht })

} catch (e) {
  console.error(e);
  return reply(`Gagal mengambil data kisah nabi\n\n• *Error*:\n${e.message}\n\n> Segera lapor ke owner`);
}
});
}