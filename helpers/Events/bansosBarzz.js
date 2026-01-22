/*!-======[ Module Imports ]======-!*/
const fs = "fs".import();
const { default: ms } = await "ms".import();
const redeemPath = '.toolkit/db/redeem.json';
const claimPath = '.toolkit/db/claim.json';

export default async function on({ cht, Exp, store, ev, is }) {
  const { sender } = cht;
  const { func } = Exp;

global.cooldownB = global.cooldownB || new Map();
const cooldownBansos = global.cooldownB;

ev.on({
  cmd: ['bansos'],
  listmenu: ['bansos ℗'],
  tag: "hadiah",
  premium: true
}, async ({cht}) => {
  const now = Date.now();
  const cd = 25 * 60 * 1000;
  const last = cooldownBansos.get(sender) || 0;

  if (now - last < cd) {
    const sisa = Math.ceil((cd - (now - last)) / 1000);
    return cht.reply(`Kamu sudah menerima bansos, tunggu *${sisa} detik* lagi`);
  }

  cooldownBansos.set(sender, now);
  
  const nominalBansos = Math.floor(Math.random() * 150) + 255
  await func.archiveMemories["addEnergy"](sender, nominalBansos);
  
  await cht.reply(`Kamu menerima bansos sebesar *${nominalBansos} Energy* ⚡`);
})

  ev.on({
    cmd: ['listredeem','listredem'],
    listmenu: ['listredeem'],
    tag: 'other',
    premium: true
  }, async ({ cht }) => {
    if (!fs.existsSync(redeemPath)) fs.writeFileSync(redeemPath, '{}');
    const redeemData = JSON.parse(fs.readFileSync(redeemPath));

    const active = Object.entries(redeemData)
      .filter(([_, val]) => val.stock > 0)
      .map(([code, val]) =>
        `🧧 *${code}*\n📦 Sisa: ${val.stock}\n⚡ Energy: ${val.energy}`
      );

    if (active.length === 0) return cht.reply('❌ Tidak ada kode redeem aktif.');

    cht.reply(`🏷️ \`DAFTAR KODE REDEEM AKTIF:\`\n\n${active.join('\n\n')}`);
  })

  ev.on({
  cmd: ['dredeem'],
  isOwner: true
}, async ({ cht, args }) => {
  const code = (Array.isArray(args) ? args.join(' ') : String(args || '')).trim().toUpperCase()
  if (!code) return cht.reply('❌ Kirim kode yang ingin dihapus.\n> Contoh: `.hapusredeem REDEEM123`')

  if (!fs.existsSync(redeemPath)) fs.writeFileSync(redeemPath, '{}')
  const redeemData = JSON.parse(fs.readFileSync(redeemPath))

  if (!redeemData[code]) return cht.reply('❌ Kode tidak ditemukan.')

  delete redeemData[code]
  fs.writeFileSync(redeemPath, JSON.stringify(redeemData, null, 2))

  cht.reply(`✅ Kode *${code}* berhasil dihapus.`)
})

  ev.on({
    cmd: ['credeem'],
    isOwner: true
  }, async ({ cht, args }) => {
    const query = Array.isArray(args) ? args.join(' ') : String(args || '');
    if (!query) return cht.reply('❌ Format kosong. Contoh: .addredeem redem01|5|5000');

    const [codeRaw, stockStr, energyStr] = query.split('|');
    const code = codeRaw?.trim().toUpperCase();
    const stock = parseInt(stockStr);
    const energy = parseInt(energyStr);

    if (!code || isNaN(stock) || isNaN(energy)) {
      return cht.reply('❌ Format salah. Gunakan: .addredeem redem01|5|5000');
    }

    if (!fs.existsSync(redeemPath)) fs.writeFileSync(redeemPath, '{}');
    const data = JSON.parse(fs.readFileSync(redeemPath));

    if (data[code]) return cht.reply(`⚠️ Kode *${code}* sudah ada. Gunakan kode lain.`);

    data[code] = {
      stock,
      energy,
      claimed: []
    };

    fs.writeFileSync(redeemPath, JSON.stringify(data, null, 2));

    cht.reply(`✅ *Kode redeem berhasil dibuat*
    
🧧 Kode: \`${code}\`
📦 Stok: *${stock}*
🎁 Hadiah: *${energy} Energy* ⚡`);
  })

  // Redeem kode
  ev.on({
    cmd: ['redeem','redem'],
    listmenu: ['redeem'],
    tag: 'hadiah'
  }, async ({ cht, args }) => {
    const query = Array.isArray(args) ? args.join(' ') : String(args || '');
    const code = query.trim().toUpperCase();

    if (!code) return cht.reply('❌ Kirim kode yang ingin kamu redeem\n> Contoh: `.redeem redem01`');

    if (!fs.existsSync(redeemPath)) fs.writeFileSync(redeemPath, '{}');
    if (!fs.existsSync(claimPath)) fs.writeFileSync(claimPath, '{}');

    const redeemData = JSON.parse(fs.readFileSync(redeemPath));
    const claimData = JSON.parse(fs.readFileSync(claimPath));
    const user = cht.sender;

    if (!redeemData[code]) return cht.reply('❌ Kode tidak valid atau belum tersedia.');
    if (redeemData[code].claimed.includes(user)) return cht.reply('❗ Kamu sudah pernah redeem kode ini.');
    if (redeemData[code].stock <= 0) return cht.reply('❌ Stok kode ini sudah habis.');

    redeemData[code].stock -= 1;
    redeemData[code].claimed.push(user);
    fs.writeFileSync(redeemPath, JSON.stringify(redeemData, null, 2));

    const energy = redeemData[code].energy;
    if (!claimData[user]) claimData[user] = { pending: 0 };
    claimData[user].pending += energy;
    fs.writeFileSync(claimPath, JSON.stringify(claimData, null, 2));

    cht.reply(`\`Berhasil redeem kode\` 🎊
Anda mendapatkan *${energy}* energy. Telah ditambahkan ke pending. Ketik *.ambil* untuk mengambil.`);
  })

  // Ambil energi yang tertunda
  ev.on({
    cmd: ['ambil'],
    listmenu: ['ambil'],
    tag: 'hadiah'
  }, async ({ cht }) => {
    if (!fs.existsSync(claimPath)) fs.writeFileSync(claimPath, '{}');

    const claimData = JSON.parse(fs.readFileSync(claimPath));
    const user = cht.sender;

    if (!claimData[user] || claimData[user].pending <= 0) {
      return cht.reply('❌ Kamu tidak memiliki bonus yang bisa diklaim, silakan redeem kode yang benar terlebih dahulu.');
    }

    const energy = claimData[user].pending;

    await func.archiveMemories["addEnergy"](user, energy);

    claimData[user].pending = 0;
    fs.writeFileSync(claimPath, JSON.stringify(claimData, null, 2));

    cht.reply(`✅ \`BERHASIL\`
Kamu menerima *${energy} Energy* ⚡`);
  });
}