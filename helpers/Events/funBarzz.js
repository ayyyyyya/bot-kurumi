const fs = 'fs'.import();
/*=========[ CREDITS BARZZ ]=========*/
// JAGAN DI HAPUS NANTI BARR NGAMBEK
// •• Elaina number (6282396640727)
// •• Barr number (6282238228919)
// •• kalau punya ide fitur hubungi Barr aja🤭
/*=========[ AWAS JATOH ]=========*/

export default async function on({ cht, Exp, store, ev, is }) {
    const { id, sender, reply, edit } = cht
    const { func } = Exp
    let {
      archiveMemories: memories,
      parseTimeString,
      clearSessionConfess,
      findSenderCodeConfess,
      formatDuration,
    } = func;
    const infos = Data.infos;
  
    
    function getRandomDate() {
       const now = new Date()
       const future = new Date(now.getFullYear() + 70, 0, 1)
       const deathTime = new Date(now.getTime() + Math.random() * (future.getTime() - now.getTime()))
       return deathTime.toDateString()
    }
    
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

const moment = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
const fullCek = [
'cekbodoh', 'cekpintar', 'cekfemboy', 'cekgendut', 'cekkurus', 'cektobrut', 'cektepos', 'cektb', 'cekbucin', 'ceksetia', 'cekgabut', 'cekwaras', 'cekstress', 'cekdana', 'ceksange', 'cekskill', 'ceknyali', 'cekganteng', 'cekcantik', 'cekgay', 'ceklesby', 'cekmek', 'cekkon', 'cekttk', 'cektolol', 'cekwibu'
];

ev.on({
 cmd: ['alay'],
 listmenu: ['alay'],
 tag: 'fun',
 args: "*❗ masukkan teks*",
 isGroup: true,
 energy: 5
}, async ({ cht, args }) => {

    const convert = {
        'a': () => '4',
        'b': () => Math.random() > 0.5 ? '8' : '13',
        'e': () => '3',
        'g': () => Math.random() > 0.5 ? '6' : '9',
        'i': () => '1',
        'o': () => '0',
        'r': () => '12',
        's': () => '5'
    };

    const alay = args.split('').map(char => {
      const lower = char.toLowerCase();
      return convert[lower] ? convert[lower]() : char;
    }).join('');

    await reply(`${alay}`);
})

ev.on({
 cmd: ['cekmati', 'cekkhodam', 'suratcinta'],
 listmenu: ['cekmati', 'cekkhodam', 'suratcinta'],
 tag: "fun",
 args: "*❗ Ketik namanya*",
 energy: 5,
 isGroup: true
}, async ({ cht, args }) => {

if (cht.cmd === "suratcinta") {
  const pembuka = [
    `Untukmu, ${args}, yang hadir bagai senja setelah hujan,`,
    `Kepada ${args}, pemilik tatapan yang menggetarkan relung jiwaku,`,
    `Hai ${args}, bintang yang paling terang di langit hatiku,`,
    `Dear ${args}, satu-satunya alasan aku betah online tengah malam,`,
    `Wahai ${args}, namamu adalah doa yang paling sering kusebut diam-diam,`
  ]

  const isi = [
    `Sejak mengenalmu, hatiku tak pernah benar-benar tenang. Seolah kamu adalah notifikasi cinta yang tak pernah mati.`,
    `Aku tak butuh kopi lagi, karena cukup memikirkanmu saja sudah membuatku terjaga semalaman.`,
    `Kamu itu seperti lagu favorit — tak pernah bosan kudengar, meski hanya dalam hati.`,
    `Kalau mencintaimu itu salah, biarlah aku berdosa setiap kali melihat senyummu.`,
    `Aku gak tahu sihir macam apa yang kamu pakai, tapi sejak itu... kamu terus tinggal di kepalaku, tanpa bayar kos.`
  ]
  
  const penutup = [
    `Dengan rindu yang tak tahu arah pulang, dari seseorang yang diam-diam menyayangimu.`,
    `Salam hangat, dari hati yang tak pernah lelah menantikan balasan darimu.`,
    `Dari aku, yang menuliskan ini dengan harap, meski tahu kamu tak akan membaca.`,
    `Yang mencintaimu dalam setiap bait doa dan percakapan khayal.`,
    `Sekian surat ini, sebelum keberanian ini hilang ditelan malam.`
  ]
   
  const pembukaan = pembuka[Math.floor(Math.random() * pembuka.length)]
  const isinya = isi[Math.floor(Math.random() * isi.length)]
  const penutupan = penutup[Math.floor(Math.random() * penutup.length)]
  
  const surat = `${pembukaan}\n\n${isinya}\n\n${penutupan}`
  reply(`💌 *Surat cinta untuk ${args}*...\n\n${surat}`)

} else if (cht.cmd === "cekmati") {
  const nama = args || cht.pushName || 'Kamu'

  const sebab = [
    'keracunan cilok expired 😵',
    'ditabrak mobil odading 😩',
    'terpeleset di kamar mandi pas nyanyi dangdut 🚿🎤',
    'kecanduan scrolling TikTok 48 jam nonstop 📱💀',
    'ngambek sama bot sendiri terus putus asa 😭',
    'kelamaan jomblo sampe badan menghilang 🫥',
    'makan mie pakai kopi dan susu 🤢',
    'diculik alien terus dikira bahan eksperimen 👽🔬',
    'dipukul karma karena suka nyolong meme 🙃',
    'ketawa ngakak sampai lupa napas 😂'
  ]

  const tanggal = getRandomDate()
  const penyebab = sebab[Math.floor(Math.random() * sebab.length)]

  reply(`💀 *Ramalan Kematian* 💀\n\nNama: *${nama}*\nTanggal: *${tanggal}*\nPenyebab: *${penyebab}*`)
     
} else {
  const khodamNames = [
    "Singa birahi",
    "Kucing cukurukuk",
    "Kompor gas",
    "Jigong",
    "Zilong roam",
    "pawang LC",
    "Tuyul gondrong",
    "Tempe goreng",
    "Mie ayam",
    "Nasgor",
    "Nasi padang",
    "Tahu",
    "Ambatukam",
    "Ambatron",
    "Andre barbershop",
    "Mengkudu",
    "Tobrut",
    "Ceker babat",
    "Yali yali",
    "Ksatria pedo",
    "Boss LC",
    "Kuda liar",
    "Tung tung tung sahur",
    "Ban mp",
    "Alok hamil",
    "Konbrut",
    "Ksatria ganteng",
    "ksatria cantik",
    "Kancut pink",
    "Ikan lele",
    "Alucrot",
    "Kairi",
    "BSK Evos",
    "Cahaya",
    "Api",
    "Agus buntung",
    "Agus lapar bu",
    "Pedang suci",
    "Pedang ibelis",
    "Vermeil",
    "Wibu akut",
    "Bintang",
    "Tanah",
    "Listrik",
    "Celana dalam",
    "Mio",
    "Beat",
    "Blade",
    "Ninja rr",
    "Tahu bulat",
    "Tempe rebus",
    "El ketek",
    "Manusia purba",
    "Bh ungu",
    "Bh pink",
    "Bh hitam",
    "Bh putih",
    "Ban botak",
    "Tabung LPG",
    "Chef Arlot",
    "Miawug",
    "Bocil toxic",
    "Bocil caper",
    "Bacil jagoan",
    "Pengendong team",
    "Mie soto",
    "Kursi goyang",
    "Kue pepek",
    "Bubur memek",
    "LC",
    "FF",
    "ML",
    "Moontod",
    "Tobrut baik",
    "Tobrut jahat",
    "Martabak manis",
    "Pisang goreng"
  ];

  const tier = [
    "G Tier",
    "E Tier",
    "C Tier",
    "B Tier",
    "A Tier",
    "S Tier",
    "SS Tier",
    "SSS Tier",
    "Tidak diketahui"
  ];

  const myReaction = [
    "🗿",
    "😹",
    "😮",
    "😋",
    "😈",
    "😱",
    "😰",
    "🥴"
  ];
  
  const randomKhodam = khodamNames[Math.floor(Math.random() * khodamNames.length)];
  const randomTier = tier[Math.floor(Math.random() * tier.length)];
  const randomReaction = myReaction[Math.floor(Math.random() * myReaction.length)];
  
  await reply(`Ternyata selama ini *${args}*, memiliki khodam *${randomKhodam}* tingkat *${randomTier}* ${randomReaction}`);
}
})

ev.on({
  cmd: ['cekkecocokan'],
  listmenu: ['cekkecocokan'],
  tag: "fun",
  args: `*❗ Ketik 2 nama*\n> ${cht.cmd} Barr|Elaina`,
  isGroup: true,
  energy: 5
}, async ({ cht, args }) => {
  const nama = args.split('|');
  if (nama.length === 2 && nama.every(n => n.trim())) {
    const [kamu, dia] = nama.map(n => n.trim());

    const kecocokanRate = Math.floor(Math.random() * 100) + 1;

    let pesanTambahan = '';
    if (kecocokanRate < 30) {
      pesanTambahan = '*Duh, beda frekuensi banget!* Kayak sinyal HP pas di gunung.';
    } else if (kecocokanRate < 60) {
      pesanTambahan = '*Hmm... mulai agak riskan nih.* Mungkin cocoknya buat partner tugas aja.';
    } else if (kecocokanRate < 90) {
      pesanTambahan = '*Ada potensi nih!* Asal sama-sama usaha, bisa jadi pasangan impian.';
    } else {
      pesanTambahan = '*Wah ini sih jodoh banget!* Udah kayak roti sama selai, nempel terus!';
    }
  
    await reply(`\n❤️ \`LOVE DETECTION SYSTEM\`\n\n\`${kamu}\` Dan \`${dia}\` memiliki persentase kecocokan *${kecocokanRate}%*\n\n> •${pesanTambahan}\n`);
    
    
  } else {
    cht.send("Input tidak valid. Pastikan ada dua nama dan dipisahkan dengan '|'.");
  }
})

ev.on(
  {
    cmd: ['citacita'],
    listmenu: ['citacita'],
    tag: "fun",
    isGroup: true,
    energy: 5
  },
  async () => {
    let git = await fetch(
      "https://raw.githubusercontent.com/BadXyz/txt/main/citacita/citacita.json"
    )
    let jsn = await git.json();
    
    let hsil = jsn[Math.floor(Math.random() * jsn.length)]
    
    Exp.sendMessage(
      id,
      {
        audio: {
          url: hsil
        },
        mimetype: "audio/mpeg"
      }, { quoted: cht }
    )
  }
)

ev.on({
 cmd: fullCek,
 listmenu: fullCek,
 tag: "fun",
 isMention: "*❗ Tag orangnya*",
 isGroup: true,
 energy: 5
}, async ({ cht }) => {
   let target = cht.mention[0];
   let targetId = target.split("@")[0];
   let nama = func.getName(target);
   
   if (cht.cmd === "cekpintar") {
         let persen = Math.floor(Math.random() * 101);
         let note = '';
         if (persen <= 20) {
             note = 'Njir... otak lo kayak RAM 2GB penuh mulu 😹';
         } else if (persen <= 40) {
             note = 'Mending uninstall otak terus install ulang deh 😭';
         } else if (persen <= 50) {
             note = 'Belajar napa, masa segini doang 😭🫵';
         } else if (persen <= 60) {
             note = 'Lumayan sih, tapi masih masuk kadang lemot 😹';
         } else if (persen <= 70) {
             note = 'Udah ada harapan, jangan males-malesan doang 🤙';
         } else if (persen <= 80) {
             note = 'Oke juga lo 🥶';
         } else if (persen <= 90) {
             note = 'Gila sih, fix anak rajin belajar ini 😋';
         } else {
             note = 'Omg Albert Einstein, OMG 🥶🥶😱😱';
         }
         
         const teks = `\n🧠 \`CLEVER DETECTION SYSTEM\`\n\n@${targetId} memiliki persentase kepintaran ${persen}%\n- ${note}\n`;
         
         return await reply(
            teks, { 
               mentions: [
                  target
               ]
            }
         );
         
         
   } else if (cht.cmd === "cekbodoh") {
         let persen = Math.floor(Math.random() * 101);
         let note = '';
         if (persen <= 10) {
             note = 'Eleh ga percaya gw 😹🗿';
         } else if (persen <= 20) {
             note = 'Anjrit... kebodohan lo udah kaya virus nyebar 😭';
         } else if (persen <= 40) {
             note = 'Bro, isi kepala lo perlu di bersihkan 🗑️';
         } else if (persen <= 50) {
             note = 'Masih bodoh, tapi bisa diselamatin kalo mau usaha 😮‍💨';
         } else if (persen <= 80) {
             note = 'Kebodohan lo udah di tahap premium 😭✌️';
         } else if (persen <= 90) {
             note = 'Fix lo ngandelin hoki doang tiap ujian 😩🍀';
         } else {
             note = 'Serius deh... lo butuh restu semesta biar pinter 🙏';
         }

         const teks = `\n🧠 \`STUPID DETECTION SYSTEM\`\n\n@${targetId} memiliki persentase kebodohan ${persen}%\n- ${note}\n`;
         
         return await reply(
            teks, { 
               mentions: [
                  target
               ]
            }
         );
         
   
   } else if (cht.cmd === "cekgendut") {
         let persen = Math.floor(Math.random() * 101);
         let note = '';
         if (persen <= 10) {
             note = 'Fix aman bngt ga gentong ini 🗿';
         } else if (persen <= 20) {
             note = 'Perfect body 🤤';
         } else if (persen <= 40) {
             note = 'Masih ada harapan, asal jangan ngemil jam 2 pagi 🍟🌚';
         } else if (persen <= 50) {
             note = 'Sedikit kelebihan... tapi masih bisa diakali jogging sore 😮‍💨';
         } else if (persen <= 80) {
             note = 'Udah mirip toples nastar pas lebaran 😭✌️';
         } else if (persen <= 90) {
             note = 'Fix kalau jalan tanah bergetar 😹';
         } else {
             note = 'Bukan gendut lagi... lo udah masuk fase "bos terakhir" 🍔😹';
         }

         const teks = `\n🐼 \`FAT DETECTION SYSTEM\`\n\n@${targetId} memiliki persentase gendut ${persen}%\n- ${note}\n`;
    
         return await reply(
            teks, { 
               mentions: [
                  target
               ]
            }
         );

   
   } else if (cht.cmd === "cekkurus") {
         let persen = Math.floor(Math.random() * 101);
         let note = '';
         if (persen <= 10) {
             note = 'Lo bukan kurus, lo sehat! Tapi jangan lupa olahraga dikit 🐢🍃';
         } else if (persen <= 20) {
             note = 'Perfect body 🤤';
         } else if (persen <= 40) {
             note = 'Lumayan ramping tapi tulang siku masih kelihatan 🗿';
         } else if (persen <= 50) {
             note = 'Tulang doang, dagingnya udah pensiun 😔🦴';
         } else if (persen <= 70) {
             note = 'Pliss kalau angin di luar kenceng jangan keluar rumah, nanti ke bawa angin 🌪️🗿';
         } else if (persen <= 90) {
             note = 'Kalau jalan pasti bunyi tulang 😭🦴😹😹';
         } else {
             note = 'Tinggal tulang dan dosa 😭😭😹';
         }

         const teks = `\n🐥 \`SKINNY DETECTION SYSTEM\`\n\n@${targetId} memiliki persentase kurus ${persen}%\n- ${note}\n`;

         return await reply(
            teks, { 
               mentions: [
                  target
               ]
            }
         );

   
   } else if (cht.cmd === "cektobrut") {
         let persen = Math.floor(Math.random() * 101);
         let note = '';
         if (persen <= 10) {
             note = 'Datar coy... mirip papan triplek 🪵💀';
         } else if (persen <= 20) {
             note = 'Sedikit tonjolan, tapi harus pake kacamata buat liatnya 😹🧐';
         } else if (persen <= 40) {
             note = 'Ada bentuk sih... tapi belum bisa nyenderin kepala 🥲';
         } else if (persen <= 60) {
             note = 'Lumayan... udah bisa bikin orang salah fokus 🤭';
         } else if (persen <= 80) {
             note = 'Wah ini sih udah kategori tobrut semi-legenda 😳🔥';
         } else if (persen <= 90) {
             note = 'Gila! Lo bisa nyelametin bayi tenggelam pake tetek doang 😭🛟';
         } else {
             note = 'TOBRUT DEWA! Tetek lo udah kayak bantal hotel bintang lima 😋';
         }

         const teks = `\n🍑 \`TOBRUT DETECTION SYSTEM\`\n\n@${targetId} memiliki persentase tobrut ${persen}%\n- ${note}\n`;

         return await reply(
            teks, { 
               mentions: [
                  target
               ]
            }
         );
         

   } else if (cht.cmd === "cektepos") {
         let persen = Math.floor(Math.random() * 101);
         let note = '';
         if (persen <= 10) {
             note = 'Nggak bisa disebut tepos lagi, lo udah masuk tobrut club 🤭🔥';
         } else if (persen <= 20) {
             note = 'Udah nggak terlalu tepos, tapi belum bisa nyelipin pulpen 🖊️';
         } else if (persen <= 40) {
             note = 'Dikit lagi naik level dari "tepos" ke "nongol dikit" 😏';
         } else if (persen <= 60) {
             note = 'Tepos sih tapi udah ada pengembangan 🗿';
         } else if (persen <= 80) {
             note = 'Triplek pun masih ada teksturnya... ini mah datar bener 🪵😹';
         } else if (persen <= 90) {
             note = 'Anj rata 😭🗿';
         } else {
             note = 'Waduh... tetek lo masuk dimensi lain 😭🌀';
         }

         const teks = `\n🍑 \`TEPOS DETECTION SYSTEM\`\n\n@${targetId} memiliki persentase tepos ${persen}%\n- ${note}\n`;

         return await reply(
            teks, { 
               mentions: [
                  target
               ]
            }
         );

   } else if (cht.cmd === "cektb") {
         let persen = Math.floor(Math.random() * 101);
         let note = '';
         if (persen <= 10) {
             note = 'Ihh apeni kurcaci ka? 😭😭';
         } else if (persen <= 20) {
             note = 'Naik angkot masih harus digendong dulu 😭';
         } else if (persen <= 40) {
             note = 'Lo tingginya setara meja makan, bener² low profile 🍽️';
         } else if (persen <= 60) {
             note = 'Lumayan, tinggi aman buat masuk frame foto keluarga 📸';
         } else if (persen <= 80) {
             note = 'Lo udah cukup tinggi buat jadi tiang bendera upacara 🇮🇩';
         } else if (persen <= 90) {
             note = 'Pasti saat orang ngelihat lu harus menghadap ke atas dulu agar nge liat muka lo 🗿';
         } else {
             note = 'Fix lu setara dengan tiang listri g di pinggir jalan 🗿😭';
         }

         const teks = `\n📏 \`TALL DETECTION SYSTEM\`\n\n@${targetId} memiliki persentase tinggi badan ${persen}%\n- ${note}\n`;

         return await reply(
            teks, { 
               mentions: [
                  target
               ]
            }
         );


   } else if (cht.cmd === "cekbucin") {
         let persen = Math.floor(Math.random() * 101);
         let note = '';
         if (persen <= 10) {
             note = 'Lo terlalu dingin buat cinta, kayak es batu di kulkas tetangga ❄️🥶🧊';
         } else if (persen <= 20) {
             note = 'Masih bisa mikir logis, belum nyemplung ke jurang bucin 🧠✨';
         } else if (persen <= 40) {
             note = 'Udah mulai senyum-senyum sendiri baca chat 😳📱';
         } else if (persen <= 60) {
             note = 'Dikit-dikit sebut nama dia... udah mulai parah bro 😩❤️';
         } else if (persen <= 80) {
             note = 'Lo bucin kelas menengah. Disuruh nunggu? Gas! Disuruh transfer? Gas! 😭💸';
         } else if (persen <= 90) {
             note = 'Fix lo budak cinta bersertifikat ISO 9001 🧎‍♂️💍';
         } else {
             note = 'Lo udah ga punya kendali hidup. Semua demi doi. Ini bukan cinta, ini kutukan 😭🗿';
         }

         const teks = `\n💓 \`BUCIN DETECTION SYSTEM\`\n\n@${targetId} memiliki persentase bucin ${persen}%\n- ${note}\n`;

         return await reply(
            teks, { 
               mentions: [
                  target
               ]
            }
         );


   } else if (cht.cmd === "ceksetia") {
         let persen = Math.floor(Math.random() * 101);
         let note = '';
         if (persen <= 10) {
             note = 'Setia? Lo mah ngeliat orang cakep dikit langsung nge-like semua postingan 😒📱';
         } else if (persen <= 20) {
             note = 'Lo setia… kalo gak ada yang lebih baik 😩✌️';
         } else if (persen <= 40) {
             note = 'Masih goyah, kadang inget satu orang, kadang semua orang 😅';
         } else if (persen <= 60) {
             note = 'Setia sih… tapi suka bandingin sama mantan 😭';
         } else if (persen <= 80) {
             note = 'Lo termasuk langka, setia walau disakitin 💔';
         } else if (persen <= 90) {
             note = 'Fix lo calon pasangan idaman, setia pake hati 🥹💘';
         } else {
             note = 'Lo terlalu setia, bahkan sama yang gak pernah anggap lo ada 😭🫶';
         }

         const teks = `\n💓 \`LOYAL DETECTION SYSTEM\`\n\n@${targetId} memiliki persentase setia ${persen}%\n- ${note}\n`;

         return await reply(
            teks, { 
               mentions: [
                  target
               ]
            }
         );


   } else if (cht.cmd === "cekgabut") {
         let persen = Math.floor(Math.random() * 101);
         let note = '';
         if (persen <= 10) {
             note = 'Lo sibuk banget, kayaknya gabut pun harus bikin janji dulu 📅📵';
         } else if (persen <= 20) {
             note = 'Masih ada kerjaan lah, scroll TikTok sambil mikir kerjaan 💼📱';
         } else if (persen <= 40) {
             note = 'Gabut level ringan, paling nyapu kamar yang udah bersih 🧹😆';
         } else if (persen <= 60) {
             note = 'Lo gabut, tapi masih punya batas waras. Belum ngobrol sama tembok 🧱🗣️';
         } else if (persen <= 80) {
             note = 'Gabut berat! Lo udah mulai ngitung ubin lantai rumah 😭🧮';
         } else if (persen <= 90) {
             note = 'Gabut parah! Lo nonton kipas angin muter sambil ngasih nama tiap bilahnya 😵‍💫🌀';
         } else {
             note = 'Terlalu gabut... Lo lagi nunggu hujan turun biar bisa galau random 😭🌧️';
         }

         const teks = `\n🛋️ \`GABUT DETECTION SYSTEM\`\n\n@${targetId} memiliki persentase gabut ${persen}%\n- ${note}\n`;

         return await reply(
            teks, { 
               mentions: [
                  target
               ]
            }
         );


   } else if (cht.cmd === "cekwaras") {
         let persen = Math.floor(Math.random() * 101);
         let note = '';
         if (persen <= 10) {
             note = 'Lo udah nggak waras... bahkan gila pun bingung liat lo 😭🧟‍♂️';
         } else if (persen <= 20) {
             note = 'Lo waras secara teknis... tapi kadang ngobrol sama tembok 🧱🗣️';
         } else if (persen <= 40) {
             note = 'Masih waras, tapi udah mulai suka ketawa sendiri 😅';
         } else if (persen <= 60) {
             note = 'Lumayan stabil, cuma kadang suka overthinking sebelum tidur 🛏️🤯';
         } else if (persen <= 80) {
             note = 'Waras, tapi gampang emosi kalo WiFi lemot 🔥📶';
         } else if (persen <= 90) {
             note = 'Lo termasuk waras, meskipun hidup sering ngetes sabar lo 🙃';
         } else {
             note = 'Waras total! Otak lo masih utuh, hati juga kuat 💪👑';
         }

         const teks = `\n🧠 \`SANE DETECTOON SYSTEM\`\n\n@${targetId} memiliki persentase waras ${persen}%\n- ${note}\n`;

         return await reply(
            teks, { 
               mentions: [
                  target
               ]
            }
         );
   
   
   } else if (cht.cmd === "cekstress") {
         let persen = Math.floor(Math.random() * 101);
         let note = '';
         if (persen <= 10) {
             note = 'Lo chill banget, hidup lo kayak liburan terus 😎🍹';
         } else if (persen <= 20) {
             note = 'Ada stres dikit, tapi masih bisa ngelawak sama temen 😅';
         } else if (persen <= 40) {
             note = 'Mulai ngerasa capek, tapi belum masuk tahap ngelamun di kamar 😶‍🌫️';
         } else if (persen <= 60) {
             note = 'Stres udah lumayan, tidur pun kadang melek sambil mikir hidup 🛏️🧠';
         } else if (persen <= 80) {
             note = 'Udah berat, lo sering nanyain hidup ke langit tiap malam 🌃🤲';
         } else if (persen <= 90) {
             note = 'Stres akut. Kadang pengen hilang 3 hari tanpa jejak 😭📵';
         } else {
             note = 'Waduh... lo butuh pelukan, kopi, dan cuti panjang 🫂☕';
         }

         const teks = `\n🧠 \`STRESS DETECTION SYSTEM\`\n\n@${targetId} memiliki persentase stress ${persen}%\n- ${note}\n`;

         return await reply(
            teks, { 
               mentions: [
                  target
               ]
            }
         );
   
   
   } else if (cht.cmd === "cekdana") {
         let persen = Math.floor(Math.random() * 101);
         let note = '';
         if (persen <= 10) {
             note = 'Dompet lo isinya doa doang, bro... 🙏🪙';
         } else if (persen <= 20) {
             note = 'Masih ada... tapi receh doang, cukup beli permen 😅🍬';
         } else if (persen <= 40) {
             note = 'Isi dompet lo tipis, kayak tisu habis lap nasi goreng 😭🧻';
         } else if (persen <= 60) {
             note = 'Lumayan lah, cukup buat hidup... seminggu 😬💰';
         } else if (persen <= 80) {
             note = 'Dompet lo aman, bisa traktir temen sekali doang ✨🧃';
         } else if (persen <= 90) {
             note = 'Gokil! Uang lo bisa bikin warung sendiri 😎🛒';
         } else {
             note = 'SULTAN DETECTED! Lo butuh dompet 3 dimensi biar muat 💸🔥';
         }

         const teks = `\n💵 \`FINANCIAL SCANNER\`\n\n@${targetId} memiliki tingkat kekayaan sebesar ${persen}%\n- ${note}\n`;

         return await reply(
            teks, { 
               mentions: [
                  target
               ]
            }
         );

   } else if (cht.cmd === "ceksange") {
         let persen = Math.floor(Math.random() * 101);
         let note = '';
         if (persen <= 10) {
             note = 'Suci banget lo... malaikat pun minder 😇📿';
         } else if (persen <= 20) {
             note = 'Masih kalem, liat yang bening pun cuma senyum sopan 😌';
         } else if (persen <= 40) {
             note = 'Lumayan, kadang mikir aneh tapi masih ingat sang pencipta 🤲😅';
         } else if (persen <= 60) {
             note = 'Mulai liar pikirannya, sering buka explore IG 😏📱';
         } else if (persen <= 80) {
             note = 'Fix... kepala lo isinya bokep semua 😭📛';
         } else if (persen <= 90) {
             note = 'Waduh, lo udah rawan kesurupan napsu tiap saat 😩🔥';
         } else {
             note = 'LO BUTUH MANDI TIAP 2 JAM BRO!! Astaghfirullah 😭🚿';
         }

         const teks = `\n🔥 \`LUST DETECTION SYSTEM\`\n\n@${targetId} memiliki persentase sange ${persen}%\n- ${note}\n`;

         return await reply(
            teks, { 
               mentions: [
                  target
               ]
            }
         );

   
   } else if (cht.cmd === "cekskill") {
         let persen = Math.floor(Math.random() * 101);
         let note = '';
         if (persen <= 10) {
             note = 'Skill lo ampas... megang mouse aja gemeter 😭🖱️';
         } else if (persen <= 20) {
             note = 'Baru bisa lari doang, belum bisa mukul 😹';
         } else if (persen <= 40) {
             note = 'Skill cupu, tapi setidaknya niat udah ada 🥲🛠️';
         } else if (persen <= 60) {
             note = 'Lo udah setara NPC aktif... kadang berguna kadang ngilang 😏';
         } else if (persen <= 80) {
             note = 'Skill lo udah mulai terlihat, boleh sparring sama pro 😎🎮';
         } else if (persen <= 90) {
             note = 'Skill Dewa! Lo bisa lawan satu server sendirian 🔥💪';
         } else {
             note = 'Woiii lo bukan player, lo cheat engine berjalan 😭🧠⚡';
         }

         const teks = `\n🔥 \`SKILL DETECTION SYSTEM\`\n\n@${targetId} memiliki persentase skill ${persen}%\n- ${note}\n`;

         return await reply(
            teks, { 
               mentions: [
                  target
               ]
            }
         );
   
   
   } else if (cht.cmd === "ceknyali") {
         let persen = Math.floor(Math.random() * 101);
         let note = '';
         if (persen <= 10) {
             note = 'Liat bayangan sendiri aja lo lari 😭🕳️';
         } else if (persen <= 20) {
             note = 'Masuk kamar gelap? Mending tidur di ruang tamu 🫢';
         } else if (persen <= 40) {
             note = 'Masih takut, tapi pura-pura berani depan gebetan 😬💪';
         } else if (persen <= 60) {
             note = 'Lumayan, bisa disuruh beli mie jam 2 pagi 🍜🌒';
         } else if (persen <= 80) {
             note = 'Lo bisa nonton film horor sendirian tanpa ngedip 👀🍿';
         } else if (persen <= 90) {
             note = 'Dikira indigo, padahal lo emang ga ada takut-takutnya 😎👁️‍🗨️';
         } else {
             note = 'Nyali lo udah level boss final horror... hantu pun minggir 😈🔥';
         }

         const teks = `\n🔥 \`NYALI DETECTION SYSTEM\`\n\n@${targetId} memiliki persentase nyali ${persen}%\n- ${note}\n`;

         return await reply(
            teks, { 
               mentions: [
                  target
               ]
            }
         );



   } else if (cht.cmd === "cekfemboy") {
           let percent = Math.floor(Math.random() * 101);
           let rank = '';
           if (percent >= 95) {
             rank = 'UKE LEGENDARIS';
           } else if (percent >= 85) {
             rank = 'FEMBOY HOTLINE';
           } else if (percent >= 70) {
             rank = 'FEMBOY SIAGA 1';
           } else if (percent >= 50) {
             rank = 'FEMBOY NGEFLIRT';
           } else if (percent >= 30) {
             rank = 'FEMBOY TERPENDAM';
           } else {
             rank = 'TARGET FANTASI';
           }
  
           let komentar = '';
           if (percent >= 95) {
             komentar = 'Lo tuh femboy idaman sugar daddy. Dikit aja dikasih perhatian, langsung manja-manja sambil meringkuk di dada orang. Suara lo? ASMR-nya ngegoda setengah mati.';
           } else if (percent >= 85) {
             komentar = 'Dari cara lo ngetik aja udah kebaca: lo suka dipeluk dari belakang sambil dibisikin pelan. "Udah siap buat nakal belum?" dan lo cuma bisa ngangguk pelan.';
           } else if (percent >= 70) {
             komentar = 'Lo bukan cuma femboy... lo tuh pemicu dosa. Outfit lo selalu kebetulan *nempel banget*. Bikin yang lihat pengen langsung tarik dan bilang "ayo, kamar kosong ada nih."';
           } else if (percent >= 50) {
             komentar = 'Lo diem-diem horny. Di luar keliatan kalem, tapi pas malem sendirian, lo buka headset, pasang playlist "moan compilation", dan... ya, lo ngerti sendiri lanjutannya.';
           } else if (percent >= 30) {
             komentar = 'Aura lo tuh "aku malu, tapi mau". Sering banget dikira polos, padahal tab bookmark lo isinya *doujin* dan video-videonya full dengan tag yang... gak bisa dijelasin di sini.';
           } else {
             komentar = 'Lo bukan femboy. Tapi lo punya muka yang sering jadi thumbnail video "cowok straight dibikin leleh sama trap". Dan lo nonton... sampe habis. Diam-diam ngulang 3x.';
           }
  
           const notes = [
             'Note: Stop nyari "femboy gets bred" di search bar, lo ketauan.',
             'Note: Lo tuh bukan innocent, lo cuman belum ke-ekspos aja.',
             'Note: Lo suka bilang "iya kak..." pas voice? Jangan sok malu deh.',
             'Note: History lo isinya lebih orno dari VPN premium.',
             'Note: Lo udah bukan wibu biasa, lo tuh femboy enjoyer tingkat advance.',
             'Note: Kalau explore IG lo isinya cowok berseragam ketat... lo udah tau lah.',
           ];
  
           const pickNote = notes[Math.floor(Math.random() * notes.length)];
           
           await reply(
              `\n👤 ${targetId}\n🏅 *RANK:* ${rank}\n🔞 *${percent}% Femboy Power*\n\n ▪︎ ${komentar}\n\n ▪︎ ${pickNote}`, { 
                 mentions: [
                    target
                 ]
              }
           );
           
           
   } else if (cht.cmd === "cekganteng") {
         let persen = Math.floor(Math.random() * 101);
         let note = '';
         if (persen <= 10) {
             note = 'Jir orang jayak lu mana ada yang suka 😹';
         } else if (persen <= 20) {
             note = 'Ga usah cari cewek dulu deh, palingan di jadiin yeman gabut doang 😹🤭';
         } else if (persen <= 40) {
             note = 'Ganteng sih... kalau di hantu filter 😹';
         } else if (persen <= 60) {
             note = 'Lumayan, cocok jadi tukang parkir estetik 🤓';
         } else if (persen <= 70) {
             note = 'Awas nanti di culin tante tante 😬';
         } else if (persen <= 80) {
             note = 'Ganteng lo udah mulai ngancem circle nih 😏🔥';
         } else if (persen <= 90) {
             note = 'Udah mayan mirip selep selep tiktok lah 🤭';
         } else {
             note = 'Jir kegantengan lu setara Jefri Nichol 🥶🤯';
         }
         
         const teks = `\n🎭 \`GOOD LOOKING DETECTION SYSTEM\`\n\n@${targetId} memiliki persentase ketampanan ${persen}%\n- ${note}\n`;
         
         return await reply(
            teks, { 
               mentions: [
                  target
               ]
            }
         );
         
         
   } else if (cht.cmd === "cekcantik") {
         let persen = Math.floor(Math.random() * 101);
         let note = '';
         if (persen <= 10) {
             note = 'Pliss kalau nge make up jangan nge dempul 😭';
         } else if (persen <= 20) {
             note = 'Cantik sih, tapi cuma kalo pake filter ig 😹';
         } else if (persen <= 40) {
             note = 'Perbanyam perawtan deh, nanti brondong bisa lari liat lu 😬';
         } else if (persen <= 60) {
             note = 'Lumayan manis, kayak es teh tapi lupa gula 😹';
         } else if (persen <= 70) {
             note = 'Wajah lo udah bisa masuk FYP TikTok 😗📱';
         } else if (persen <= 80) {
             note = 'Cantiknya udah mulai ngancem pacar orang 😏🔥';
         } else if (persen <= 90) {
             note = 'Lo tuh cantik bgt, bikin insecure satu RT 😩💅';
         } else {
             note = 'Ini mah bukan manusia, ini bidadari turun buat healing dunia 😭✨';
         }
         
         const teks = `\n🎭 \`BEAUTY DETECTION SYSTEM\`\n\n@${targetId} memiliki persentase kecantikan ${persen}%\n- ${note}\n`;
         
         return await reply(
            teks, { 
               mentions: [
                  target
               ]
            }
         );
         
   
   } else if (cht.cmd === "cektolol") {
         let persen = Math.floor(Math.random() * 101);
         let note = '';
         if (persen <= 10) {
             note = 'AMAN BANGET!!!';
         } else if (persen <= 20) {
             note = 'Hampir Aman';
         } else if (persen <= 40) {
             note = 'Dah kewat dari jata aman';
         } else if (persen <= 60) {
             note = 'Lumayan Tolol';
         } else if (persen <= 70) {
             note = 'Tolol Banget';
         } else if (persen <= 80) {
             note = 'Dijamin tololnya';
         } else if (persen <= 90) {
             note = 'Setolol Om Deddy 😹';
         } else {
             note = 'LU ORANG TERTOLOL YANG PERNAH ADA!!! 😹';
         }
         
         const teks = `\n🤪 \`CRAZY DETECTION SYSTEM\`\n\n@${targetId} memiliki persentase tolol ${persen}%\n- ${note}\n`;
         
         return await reply(
            teks, { 
               mentions: [
                  target
               ]
            }
         );
               

   } else if (cht.cmd === "cekwibu") {
         let persen = Math.floor(Math.random() * 101);
         let note = '';
         if (persen <= 10) {
             note = 'Masih Aman Lah Yaa!';
         } else if (persen <= 20) {
             note = 'Hampir Aman';
         } else if (persen <= 40) {
             note = 'Setengah Wibu';
         } else if (persen <= 60) {
             note = 'Lu Wibu juga';
         } else if (persen <= 70) {
             note = 'Gak akan Salah Lagi dah Wibunya lu';
         } else if (persen <= 80) {
             note = 'Dijamin Sepuhnya Wibu';
         } else if (persen <= 90) {
             note = 'Udah Elite Sih Ini 😹';
         } else {
             note = 'BAU BAWANGNYA SAMPE SINI CUY!!!';
         }
         
         const teks = `\n🧅 \`WIBU DETECTION SYSTEM\`\n\n@${targetId} memiliki persentase wibu ${persen}%\n- ${note}\n`;
         
         return await reply(
            teks, { 
               mentions: [
                  target
               ]
            }
         );
               
               
   } else if (cht.cmd === "cekgay") {
         let persen = Math.floor(Math.random() * 101);
         let note = '';
         if (persen <= 10) {
             note = 'Jangan lupa Mahkota mu king 👑';
         } else if (persen <= 20) {
             note = 'Masih lurus, tapi kalo dikedipin cowok dikit goyah 😭';
         } else if (persen <= 40) {
             note = 'Lo bilang “bro” tapi nada lo kayak “sayang” 😭';
         } else if (persen <= 60) {
             note = 'Setiap bilang “gak gay”, vibes lo makin gay 😹';
         } else if (persen <= 70) {
             note = 'Lo udah mulai suka liat cowok pake kemeja putih 😩';
         } else if (persen <= 80) {
             note = 'Kalo cowok panggil lo “bang”, lo senyum-senyum sendiri 😭💅';
         } else if (persen <= 90) {
             note = 'Gay lu anj, Najiss nyoo 😷';
         } else {
             note = 'Fix ketua club gay, yang sering mengadakan pesta gay 🤢';
         }
   
         const teks = `\n🏳️‍🌈 \`GAY DETECTION SYSTEM\`\n\n@${targetId} memiliki persentase gay ${persen}%\n- ${note}\n`;
         
         return await reply(
            teks, { 
               mentions: [
                  target
               ]
            }
         );
         
         
   } else if (cht.cmd === "ceklesby") {
         let persen = Math.floor(Math.random() * 101);
         let note = '';
         if (persen <= 10) {
             note = 'Fix lu masih normal 😙';
         } else if (persen <= 20) {
             note = 'Masih aman... tapi mulai suka liat cewek tomboy 😳';
         } else if (persen <= 40) {
             note = 'Bilang “temenan doang”, tapi pelukannya lebih dari sahabat 😭';
         } else if (persen <= 60) {
             note = 'Lo ngaku straight, tapi playlist lo isinya girl crush semua 😏';
         } else if (persen <= 70) {
             note = 'Kalo ada cewek pake kemeja longgar, lo salfok 😩';
         } else if (persen <= 80) {
             note = 'Tiap liat cewek cantik langsung mikir “istri gue nih” 😭💅';
         } else if (persen <= 90) {
             note = 'Lo lesbi? Lo LESBI! 🏳️‍🌈✨ Tapi soft banget ya vibes-nya 😚';
         } else {
             note = 'Fix lo udah ketua geng lesbi tongkrongan 😭';
         }

         const teks = `\n🏳️‍🌈 \`LESBY DETECTION SYSTEM\`\n\n@${targetId} memiliki persentase lesby ${persen}%\n- ${note}\n`;
         
         return await reply(
            teks, { 
               mentions: [
                  target
               ]
            }
         );
         
         
   } else if (cht.cmd === "cekmek") {
   
         const jembut = [ 
           'lebat',
           'ada sedikit',
           'gada jembut',
           'tipis',
           'muluss'
         ];
 
         const lubang = [
           'perawan',
           'ga perawan',
           'udah pernah dimasukin',
           'masih rapet',
           'tembem'
         ];
 
         const warna = [
           'ih item',
           'Belang wkwk',
           'Muluss',
           'Putih Mulus',
           'Black Doff',
           'Pink mulusss 😋',
           'Item Glossy 😹'
         ];

         const randomJembut = jembut[Math.floor(Math.random() * jembut.length)];
         const randomLubang = lubang[Math.floor(Math.random() * lubang.length)];
         const randomWarna = warna[Math.floor(Math.random() * warna.length)];
         
         await reply(
            `🙈 Mulai menganalisa mik @${targetId}`, { 
               mentions: [
                  target
               ]
            }
         );
         
         await sleep(1500);
         
         const teks = `\n*HASIL ANALISA:*\n\nMik punya @${targetId}\n- Jembut: ${randomJembut}\n- Lobang: ${randomLubang}\n- Warna: ${randomWarna}\n`;
         
         return await reply(
            teks, { 
               mentions: [
                  target
               ]
            }
         );
   
   } else if (cht.cmd === "cekttk") {
   
         const ukur = [
            'Tepos',
            'Spek Nasi KFC',
            'Tobrut',
            '32',
            '34',
            '36'
         ]
         
         const penti = [
           'Hytam',
           'Pink 😋',
           'kecil',
           'Perfect'
         ]
         
         const tt = [
           'Putih',
           'Hitam',
           'Putih mulus 🤤',
           'Hytam banget',
           'Karatan ☠️'
         ]
         
         const ttk = tt[Math.floor(Math.random() * tt.length)]
         const pentil = penti[Math.floor(Math.random() * penti.length)]
         const ukuran = ukur[Math.floor(Math.random() * ukur.length)]
         
         await reply(
            `🙈 Mulai menganalisa tetek @${targetId}`, {
               mentions: [
                 target
               ]
            }
         );
         
         await sleep(1500);
         
         const teks = `\n*HASIL ANALISA:*\n\nTetek punya @${targetId}\n- Tetek: ${ttk}\n- Pentil: ${pentil}\n- Ukuran: ${ukuran}\n`;
         
         return await reply(
            teks, { 
               mentions: [
                  target
               ]
            }
         );
         
   } else {
         const jembut = [
           'mirip hutan amazon lebatnya',
           'ada sedikit',
           'gada jembut',
           'tipis',
           'gundul'
         ];
 
         const panjang = [
           '1 meter',
           '5 inc 😹',
           '25 cm',
           'udah ga berdiri'
         ];
 
         const warna = [
           'Black mamba',
           'Belang putih 🤢',
           'Coklat',
           'Putih 🗿',
           'Hitam Karbon'
         ];
         
         const randomJembut = jembut[Math.floor(Math.random() * jembut.length)];
         const randomLubang = panjang[Math.floor(Math.random() * panjang.length)];
         const randomWarna = warna[Math.floor(Math.random() * warna.length)];
         
         await reply(
            `🙈 Mulai menganalisa kon @${targetId}`, {
               mentions: [
                 target
               ]
            }
         );
         
         await sleep(1500);
         
         const teks = `\n*HASIL ANALISA:*\n\nKont punya @${targetId}\n- Jembut: ${randomJembut}\n- Panjang: ${randomLubang}\n- Warna: ${randomWarna}`;
         
         return await reply(
            teks, {
               mentions: [
                  target
               ]
            }
         );
   }
})

ev.on({
  cmd: ['dare', 'truth'],
  listmenu: ['dare', 'truth'],
  tag: "fun",
  isGroup: true,
  energy: 5
}, async ({ cht }) => {

if (cht.cmd === "dare") {
  const Bar = [
    "Ajak orang yg tidak kamu kenal itu selfie berdua dengan mu lalu upload ke snapgram", 
    "Ambil beberapa nomor dari kontakmu secara acak dan kirim sms 'Aku hamil' sama mereka.",
    "Ambil minuman apa saja yg ada didekat mu lalu campurkan dengan cabai dan minum!",
    "Ambil nomor secara acak dari kontakmu, telepon dia, dan bilang 'Aku mencintaimu'",
    "Beli makanan paling murah di kantin (atau beli sebotol aqua) dan bilang sambil tersedu-sedu pada teman sekelasmu 'Ini.. adalah makanan yang paling mahal yang pernah kubeli.. Hiks'",
    "Beli satu botol coca cola dan siram bunga dengan coca cola itu di depan orang banyak.",
    "Berdiri deket kulkas, tutup mata, pilih makanan secara acak didalemnya, pas makanpun mata harus tetep ditutup.",
    "Berdiri di tengah lapangan basket dan berteriak, 'AKU MENCINTAIMU PANGERANKU/PUTRIKU'",
    "Beri hormat pada seseorang di kelas, lalu bilang 'Hamba siap melayani Anda, Yang Mulia.'",
    "Berjalan sambil bertepuk tangan dan menyanyi lagu 'Selamat Ulang Tahun' dari kelas ke koridor.",
    "Berlutut satu kaki dan bilang 'Marry me?' sama orang pertama yang masuk ke ruangan.",
    "Bikin hiasan kepala absurd dari tisu, apapun itu, terus suruh pose didepan kamera, terus upload",
    "Bilang 'KAMU CANTIK BANGET NGGAK BOHONG' sama cewek yang menurutmu paling cantik di kelas ini",
    "Bilang pada seorang guru, 'Bu/Pak, baju saya terasa sempit' dengan ekspresi memelas.",
    "Bilang pada seseorang di kelas, 'Aku baru saja diberi tahu aku adalah kembaranmu dulu, kita dipisahkan, lalu aku menjalani operasi plastik. Dan ini adalah hal paling serius yang pernah aku katakan.'",
    "Buang buku catatan seseorang ke tempat sampah, di depan matanya, sambil bilang 'Buku ini isinya tidak ada yang bisa memahami'",
    "Cabut bulu kaki mu sendiri sebanyak 3x",
    "Chat kedua orangtuamu, katakan bahwa kamu kangen dengan mereka lengkap dengan emoticon sedih.",
    "Coba searcing google mengenai hal-hal yang mengerikan atau menggelikan seperti trypophobia, dll.",
    "Duduk relaks di tengah lapangan basket sambil berpura-pura itu adalah pantai untuk berjemur.",
    "isi mulut penuh dengan air dan harus tahan hingga dua putaran. Jika tertawa dan tumpah atau terminum, maka harus ngisi ulang dan ditambah satu putaran lagi.",
    "Jabat tangan orang pertama yang masuk ke ruangan ini dan bilang 'Selamat datang di Who Wants To Be a Millionaire!'",
    "Kirim sms pada orangtuamu 'Hai, bro! Aku baru beli majalah Playboy edisi terbaru!'",
    "Kirim sms pada orangtuamu, 'Ma, Pa, aku sudah tahu bahwa aku adalah anak adopsi dari Panti Asuhan. Jangan menyembunyikan hal ini lagi.'",
    "Kirim sms pada tiga nomor acak di kontakmu dan tulis 'Aku baru saja menjadi model majalah Playboy.'",
    "Makan 1 Sendok makan kecap manis dan kecap asin!",
    "Makan sesuatu tapi gak pake tangan.",
    "Marah-marah ketemen kamu yang gak dateng padahal udah janjian mau main 'truth or dare' bareng-bareng",
    "Mecahin telur pake kepala.",
    "Memakan makanan yang sudah dicampur-campur dan rasanya pasti aneh, namun pastikan bahwa makanan itu tidak berbahaya untuk kesehatan jangka panjang maupun jangka pendek.",
    "Menari ala Girls' Generation untuk cowok di depan kelas, atau menari ala Super Junior untuk cewek.",
    "Mengerek tiang bendera tanpa ada benderanya.",
    "Menggombali orang yang ditaksir, sahabat terdekat, lawan jenis yang tidak dikenal sama sekali dan  sejenisnya.",
    "Meniru style rambut semua temen kamu.",
    "Menyanyikan lagu HAI TAYO di depan banyak orang sambil menari",
    "Menyanyikan lagu Iwak Peyek dengan keras di ruang kelas.",
    "Minjem sesuatu ke tetangga",
    "Minta tandatangan pada seorang guru yang paling kamu benci sambil bilang 'Anda benar-benar orang yang paling saya kagumi di dunia.'",
    "Minta uang pada seseorang (random/acak) di jalan sambil bilang 'Saya tidak punya uang untuk naik angkot.'",
    "Minum sesuatu yang udah dibuat/disepakatin, tapi pastiin gak berbahaya, bisa kayak minum sirup yang digaremin terus ditambah kecap.",
    "Minum tiga teguk teh atau coke (coca-cola atau sprite) yang dicampur sambal.",
    "Ngomong ke gebetannya emoticon-Takut, ngobrol ngalurngidul apapun lah boleh ,via manapun juga bisa.",
    "Nyanyi-nyanyi lagu favorit difilm disney diluar rumah sambil teriak-teriak.",
    "Nyebutin 1 biru sampai 10 biru dengan cepat dan tidak boleh melakukan kesalahan. Jika salah maka harus diulang dari awal.",
    "Pakai mahkota tiruan dari kertas buku dan bilang sama setiap orang di ruangan 'BERI PENGHORMATAN PADA YANG MULIA RAJA' sambil menunjuk setiap orang dengan penggaris.",
    "Pake celana kebalik sampe besok paginya.",
    "Pegang bola basket, berdiri di depan kelas, dan berteriak, 'ADA YANG TAHU MENGAPA BOLA GOLF INI SANGAT BESAR? APA PABRIKNYA SALAH CETAK?'",
    "Peluk orang yang NGGAK kamu sukai di kelas dan bilang, 'Terimakasih banyak kamu sudah bersedia menjadi orang paling baik untukku.'",
    "Pergi ke lapangan yg luas, lalu berlari sekencang kencangnya sambil mengatakan 'aku gila aku gila'",
    "Petik 1 bunga lalu tancapkan bunga itu ke orang yg tidak kamu kenal (harus lawan jenis ya)",
    "Pilih orang secara acak di jalan, lalu bilang 'You don't know you're beautiful' (ala One Direction)",
    "Pura pura kerasukan ex: kerasukan macan dll",
    "Suruh bersiul pas mulutnya lagi penuh dijejelin makanan.",
    "Suruh jadi pelayan buat ngelayanin kamu sama temen-temen kamu buat makan siang.",
    "Suruh pake kaos kaki buat dijadiin sarung tangan.",
    "Suruh pake topi paling aneh/helm paling absurd selama 3 putaraann kedepan.",
    "Telpon mama kamu dan bilang 'ma, aku mau nikah secepatnya'",
    "Telpon mantan kamu dan bialng 'aku rindu kamu'",
    "Teriak 'WOI GW JACK, DENGER NIH RAUNGAN GW, ROAAAAR!' ditempat rame",
    "Tuker baju sama orang terdekat sampe ronde berikutnya.",
    "Update status di BBM, Line, WA, atau apapun itu dengan kata kata yang semuanya berawalan 'T'",
    "Upload video dia nyanyi ke youtube yang lagi nyanyiin lagu-lagu populer",
    "Warnain kuku kaki dan tangan tapi dengan warna berbeda-beda buat seminggu"
  ];
  
  const Barzz918 = Bar[Math.floor(Math.random() * Bar.length)];
  
  await reply(
    `\n*TRUTH OR DARE* 🎲\n- Dare\n\n• Tantangan:\n- *${Barzz918}*\n`
  );
  
} else {
  const barr = [
    "Acara tv apa yang paling memuakkan? Berikan alasannya!", 
    "Apa baju yang (menurutmu) paling jelek yang pernah kamu pakai, dan kapan kamu memakainya?",
    "Apa binatang patronus yang cocok untuk kamu?", "Apa hal paling buruk yang pernah kamu bilang tentang temenmu?",
    "Apa hal paling memalukan dari dirimu?",
    "Apa hal paling memalukan dari temanmu?", 
    "Apa hal pertama yang kamu lihat saat kamu melihat orang lain (beda gender)?",
    "Apa hal pertama yang terlintas di pikiranmu saat kamu melihat cermin?",
    "Apa hal terbodoh yang pernah kamu lakukan?", "Apa hal terbodoh yg pernah kamu lakukan ?",
    "Apa ketakutan terbesar kamu?",
    "Apa mimpi terburukmu?", "Apa mimpi terkonyol yang pernah kamu inget?",
    "Apa pekerjaan paling konyol yang pernah kamu bayangin kamu akan jadi?",
    "Apa sifat terburukmu menurut kamu?",
    "Apa sifat yang ingin kamu rubah dari dirimu?",
    "Apa sifat yang ingin kamu rubah dari temanmu?",
    "Apa yang akan kamu lakuin bila pacarmu bilang hidung atau jarimu jelek?",
    "Apa yg kamu fikirkan sebelum kamu tidur ? ex: menghayal tentang jodoh,dll.",
    "Apakah hal yang menurutmu paling menonjol dari dirimu?",
    "Bagian tubuh temanmu mana yang paling kamu sukai dan ingin kamu punya?",
    "Bagian tubuhmu mana yang paling kamu benci?", 
    "Dari semua kelas yang ada di sekolah, kelas mana yang paling ingin kamu masuki dan kelas mana yang paling ingin kamu hindari?",
    "Deksripsikan teman terdekat mu!",
    "Deskripsikan dirimu dalam satu kata!",
    "Film dan lagu apa yang pernah bikin kamu nangis?",
    "Hal apa yang kamu rahasiakan sampe, sekarang dan gak ada satu orangpun yang tau?",
    "Hal paling romantis apa yang seseorang (beda gender) pernah lakuin atau kasih ke kamu?","Hal-hal menjijikan apa yang pernah kamu alami ?",
    "Jika kamu lahir kembali dan harus jadi salah satu dari temanmu, siapa yang akan kamu pilih untuk jadi dia?",
    "Jika punya kekuatan super/ super power ingin melakukan apa",
    "Jika sebentar lagi kiamat, apa yg kamu lakukan ?",
    "Kalo kamu disuruh operasi plastik dengan contoh wajah dari teman sekelasmu, wajah siapa yang akan kamu tiru?",
    "Kamu pernah mencuri sesuatu gak?",
    "Kamu takut mati? kenapa?",
    "Kapan terakhir kali menangis dan mengapa?",
    "kemampuan spesial kamu apa?",
    "Kok bisa suka sama orang yang kamu sukai?",
    "Menurutmu, apa sifat baik teman terdekatmu yang nggak dia sadari?",
    "Orang seperti apa yang ingin kamu nikahi suatu saat nanti?",
    "Pekerjaan paling ngenes apa yang menurutmu cocok untuk teman di sebelah kananmu?",
    "Pengen tukeran hidup sehari dengan siapa? (teman terdekat yang kalian sama-sama tahu) dan mengapa",
    "Pernahkah kamu diam-diam berharap hubungan seseorang dengan pacarnya putus? Siapa?",
    "Pilih PACAR atau TEMAN ? berikan alasannya !",
    "Quote apa yang paling kamu ingat dan kamu suka?",
    "Rahasia apa yg belum pernah kamu katakan sampai sekarang kepada teman mu ?",
    "Rolemodel (panutan) kamu siapa?",
    "Siapa di antara temanmu yang kamu pikir matre?",
    "Siapa di antara teman-temanmu yang menurutmu potongan rambutnya paling ngenes (paling nggak banget)?",
    "Siapa diantara temen-temenmu yang paling NGGAK fotogenik dan kalo difoto lagi ketawa mukanya kaya kuda?",
    "Siapa mantan terindah mu? dan mengapa kalian putus ?!",
    "Siapa nama artis yang pernah kamu cium fotonya diam-diam?",
    "Siapa nama guru cowok yang pernah kamu sukai dulu?",
    "Siapa nama mantan pacar teman mu yang pernah kamu sukai diam diam?",
    "Siapa nama orang (beda gender) yang menurutmu akan asyik bila dijadikan pacar?",
    "Siapa nama orang yang kamu benci, tapi kamu rasa orang itu suka sama kamu (nggak harus beda gender)?",
    "Siapa nama orang yang pernah kamu ikutin diam-diam?",
    "Siapa orang (lawan jenis) yang paling sering terlintas di pikiranmu?",
    "Siapa orang yg paling menjengkelkan di antara teman teman mu ? alasannya!",
    "Siapa sebenernya di antara teman-temanmu yang kamu pikir harus di make-over?",
    "Siapa yang paling mendekati tipe pasangan idealmu di sini"
  ];
  
  const barzz918 = barr[Math.floor(Math.random() * barr.length)];
  
  await reply(
    `\n*TRUTH OR DARE* 🎲\n- Truth\n\n• Pertanyaan:\n- *${barzz918}*\n`
  );
}
})

ev.on({
  cmd: ['dimanakah', 'kapankah', 'rate'],
  listmenu: ['dimanakah', 'kapankah', 'rate'],
  tag: "fun",
  args: "*❗ Masukkan pertanyaan*",
  isGroup: true
}, async ({ cht, args }) => {
  await sleep(1500);
  
if (cht.cmd === "kapankah") {

  const angka = Math.floor(Math.random() * 1001);
  const kapan = [
    'detik',
    'menit', 
    'jam', 
    'hari', 
    'minggu',
    'bulan',
    'tahun', 
    'abat'
  ];
  
  const bar = kapan[Math.floor(Math.random() * kapan.length)];
  
  await reply(
    `\nKapankah ${args}?\n\nJawaban nya yaitu:\n> ${angka} ${bar} Lagi\n`
  );
  

} else if (cht.cmd === "rate") {
  const angka = Math.floor(Math.random() * 101);
  
  await reply(
    `\nRate ${args}\n> ${angka}%\n`
  );
  
  
} else {
 const lokasi = [
    "di surga",
    "di neraka ",
    "di dada 🗿",
    "di rumah lu 🏡",
    "di land of down",
    "di Bermuda",
    "di kalahari",
    "di kebun",
    "di langit 🌌",
    "di tanah",
    "di mars",
    "di sungai 🏞️",
    "di pohon 🌲",
    "di pantai 🏖️",
    "di hutan",
    "di epep",
    "di ml",
    "di genshin",
    "di pubg",
    "di kasur 🛏️",
    "di hatimu >///<",
    "ga tau ko tanya ge",
    "ga tau jir",
    "apasih, gw ga tau",
    "ga tawu",
    "ntah",
    "ga tahu",
    "yo nda tau ko tanya saya 😹",
    "tanya Prabowo",
    "tanya Jokowi",
    "di kuburan 🪦",
    "di hotel 🏩",
    "di solokan",
    "di tempat sampah 🗑️",
    "di mana mana hatiku senang, la la lala~ 🎶",
    "nyocot, nanya mulu"
 ];


 const bKp = lokasi[Math.floor(Math.random() * lokasi.length)];
 
 await reply(
   `\nDimanakah ${args}?\n\n- ${bKp}\n`
 );
 
}
})

ev.on({
  cmd: ['kerangajaib', 'benarkah', 'bisakah', 'apakah'],
  listmenu: ['kerangajaib', 'benarkah', 'bisakah', 'apakah'],
  tag: "fun",
  isGroup: true,
  args: "*❗ Masukkan pertanyaan*"
}, async ({ cht, args }) => {
  await sleep(1500);
  
if (cht.cmd === "kerangajaib") {

  let jawaban = [
    'BOLEH', 
    'TIDAK', 
    'YA', 
    'Y', 
    'GA BAKAL'
  ];
  
  let hasil = jawaban[Math.floor(Math.random() * jawaban.length)];
  
  await reply(
    `\nPertanyaan:\n- ${args}\n\nKerang ajaib mengatakan *${hasil}*\n`
  );


} else if (cht.cmd === "apakah") {

  let jawa = [
    'Ya', 
    'Mungkin iya', 
    'Mungkin', 
    'Mungkin tidak', 
    'Tidak', 
    'Tidak mungkin'
  ]
  
  let hasil = jawa[Math.floor(Math.random() * jawa.length)];
  
  await reply(
    `\nApakah ${args}?\n> *${hasil}*\n`
  );


} else if (cht.cmd === "bisakah") {

  let jawa = [
    'Iya',
    'Sudah pasti',
    'Sudah pasti bisa',
    'Tidak',
    'Tentu tidak bisa',
    'Sudah pasti tidak'
  ];
  
  let hasil = jawa[Math.floor(Math.random() * jawa.length)];
  
  await reply(
    `\nBisakah ${args}?\n> *${hasil}*\n`
  );
  
  
} else {

  let jawaban = [
    'Iya',
    'Sudah pasti',
    'Sudah pasti benar',
    'Tidak',
    'Tentu tidak benar',
    'Sudah pasti tidak'
  ];
    
  let hasil = jawaban[Math.floor(Math.random() * jawaban.length)];
  
  await reply(
    `\nBenarkah ${args}?\n> *${hasil}*\n`
  );

}
})

ev.on(
  {
    cmd: [
      'ikhlaskan',
      'tembak',
      'terima', 
      'tolak',
      'mylove', 
      'pacarku',
      'gembok',
      'putus'
    ],
    listmenu: [
      'gembok',
      'ikhlaskan', 
      'pacarku',
      'tembak',
      'terima',
      'tolak',
      'putus'
    ],
    tag: "fun",
    isGroup: true
  },
  async ({ args }) => {
    let user = Data.users[sender.split("@")[0]]
    let cd = cht.cmd

    if (!user.pasangan) user.pasangan = {}

    if (cd === "pacarku" || cd === "mylove") {
      if (!user.pasangan.she) return reply(
        "Kamu belum punya pasangan wkwkwkk"
      )

      if (user.pasangan.status === "gantung") return reply(
        "Kamu masih menunggu jawaban dari seseorang, alias masih di gantung wkwkwk"
      )

      let pacarnya = user.pasangan.she
      let sejak = user.pasangan.waktuTerima

      let teks = `乂  *P A S A N G A N  K A M U*\n\n`
      teks += `Kamu sudah pacaran dengan @${pacarnya.split("@")[0]} sejak \`${sejak}\`\n\n`
      teks += `🥰 Semoga langgeng sampai pelaminan yah...`

      return Exp.sendMessage(
        id,
        {
          text: teks,
          contextInfo: {
            ...contextInfo,
            mentionedJid: [
              pacarnya
            ]
          }
        }, { quoted: cht }
      )
    }

    if (cd === "gembok") {
      let act = ['on', 'off']
      let action = args.toLowerCase()

      if (!act.includes(action)) return reply(
        "*❗ Pilih salah satu dari on/off*\n\n" +
        "- on\n> Membuat seseorang ga bisa nembak kamu\n" +
        "- off\n> Buka hati lagi"
      )

      if (action === "on") {
        if (user.pasangan.gembok === true) return reply(
          "Kamu udah menutup hati sebelumnya..."
        )
        
        if (user.pasangan.she) return reply(
          "💔 Putusin pacarmu dulu kalau mau kunci hati"
        )

        user.pasangan = {
          she: null,
          level: 0,
          gembok: true,
          status: null,
          waktuNembak: null,
          waktuTerima: null
        }
        return reply(
          "♥️ Kini kamu telah nutup pintu hati mu, dan ga bakal nerima siapapun..."
        )

      } else {
        if (user.pasangan.gembok === false) return reply(
          "Hati Kamu sudah terbuka sebelumnya..."
        )
        
        user.pasangan = {}
        
        return reply(
          "♥️ Kini kamu telah membuka pintu hati untuk siapapun lagi..."
        )
      }
    }

    if (cd === "tembak") {
      let she = cht.mention[0]

      if (!she) return reply("*❗ Tag orang yang ingin kamu tembak*")

      let sheMen = she.split("@")[0]

      if (!Data.users[sheMen]) Data.users[sheMen] = {}

      let sheData = Data.users[sheMen]
      
      if (she === sender) return reply(
        "Ngapain nembak diri sendiri, ga ada yg mau yah? wkwkw"
      )
      
      if (user.pasangan?.status === "gantung") return reply(
        "Kamu sedang menunggu jawaban dari seseorang"
      )
      
      if (she === user.pasangan.she) return reply(
        "Kamu sudah pacaran sama dia"
      )
      
      if (user.pasangan.she) return reply(
        "Kamu udah punya pacar, jangan selingkuh dongo"
      )
      
      if (sheData.pasangan?.gembok === true) return reply(
        "💔 Dia sedang nutup pintu hatinya, jadi ga bisa..."
      )
      
      if (sheData.pasangan?.status === "gantung") return reply(
        "Dia udah di tembak oleh seseorang, tapi belum memberi jawaban"
      )
      
      if (sheData.pasangan?.status === "pacaran") return reply(
        "Dia sudah punya pacar..."
      )
      
      let klmt = [
        `💘 @${she.split("@")[0]}, aku nggak pandai merangkai kata... tapi aku tau aku mau kamu ada di sisiku. Mau nggak jadi pasangan aku? ❤️`,
        `🥺 @${she.split("@")[0]}, setiap hari aku kepikiran kamu... sekarang aku berani ngomong, maukah kamu jadi pacarku? 💕`,
        `Kamu tau ga @${she.split("@")[0]}?, kamu itu alasanku senyum tiap hari. Boleh nggak aku jadi alasannya kamu juga? 💖`, 
        `@${she.split("@")[0]}, aku nggak janji sempurna... tapi aku janji setia. Mau nggak kamu jadi pasangan aku? 💞`
      ]
      
      let kalimat = klmt[Math.floor(Math.random() * klmt.length)]
      let now = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }); 

      user.pasangan = {
        she,
        level: 0,
        gembok: false,
        status: "gantung",
        penembak: true,
        waktuNembak: now,
        waktuTerima: null
      }

      sheData.pasangan = {
        she: sender,
        level: 0,
        gembok: false,
        status: "gantung",
        penembak: false,
        waktuNembak: now,
        waktuTerima: null
      }

      return reply(
        kalimat, {
          mentions: [
            she
          ]
        }
      )
    }

    if (cd === "terima") {
      let mention = cht.mention[0]
      
      if (!mention) return reply(
        "*❗ Tag atau reply target*"
      )
      
      if (mention === sender) return replt(
        "Tag orang yang nembak kamu, malah tag diri sendiri"
      )
      
      if (user.pasangan?.status !== "gantung") return reply(
        "Ga ada yang nembak kamu wkwkwk"
      )
      
      if (user.pasangan.penembak) return reply(
        `Tunggu dia yang ngetik \`.${cht.cmd}\``
      )
      
      let now = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
      let she = user.pasangan.she
      let sheData = Data.users[she.split("@")[0]]
      
      if (mention !== she) return reply(
        "Dia bukan orang yang nembak kamu wkwkwk"
      )
      
      user.pasangan.status = "pacaran"
      user.pasangan.waktuTerima = now

      if (sheData?.pasangan) {
        sheData.pasangan.status = "pacaran"
        sheData.pasangan.waktuTerima = now
      }

      return reply(
        `💞 Kini kamu resmi pacaran dengan @${she.split("@")[0]}`, {
          mentions: [
            she
          ]
        }
      )
    }

    if (cd === "tolak") {
      if (user.pasangan?.status !== "gantung") return reply(
        "Ga ada yang nembak kamu wkkkwkwkk"
      )
      
      if (user.pasangan.penembak) return reply(
        `Tunggu dia yang ngetik \`.${cht.cmd}\``
      )
      
      let she = user.pasangan.she
      let sheData = Data.users[she.split("@")[0]]

      user.pasangan = {}
      if (sheData?.pasangan) sheData.pasangan = {}

      return reply(
        `💔 Kamu menolak cinta dari @${she.split("@")[0]}`, {
          mentions: [
            she
          ]
        }
      )
    }

    if (cd === "ikhlaskan") {
      if (user.pasangan?.status !== "gantung") return reply(
        "Kamu tidak sedang menunggu jawaban dari siapapun"
      )
      
      if (user.pasangan.status === "pacaran") return reply(
        "Kamu udah pacaran dengan dia, berarti kamu ga di gantung"
      )
      
      let she = user.pasangan.she
      let sheData = Data.users[she.split("@")[0]]

      user.pasangan = {}
      if (sheData?.pasangan) sheData.pasangan = {}

      return reply(
        `Karena @${she.split("@")[0]} tidak memberikan jawaban nya, dan kamu putuskan untuk mengikhlaskannya...`, {
          mentions: [
            she 
          ]
        }
      )
    }
    
    if (cd === "putus") {
      if (!user.pasangan.she) return reply(
        "Kamu belum punya pacar wkwkwk"
      )

      let she = user.pasangan.she;
      let sheData = Data.users[she.split("@")[0]]

      let exName = `@${she.split("@")[0]}`

      user.pasangan = {}

      if (sheData?.pasangan) {
        sheData.pasangan = {}
      }

      return reply(
        `💔 Kamu resmi putus dengan ${exName}.\nGapapa, jodoh ga kemana kok :)`, {
          mentions: [
            she
          ] 
        }
      )
    }
  }
)

ev.on({
  cmd: ['longtext'],
  listmenu: ['longtext'],
  tag: "fun",
  energy: 5,
  isGroup: true
}, async ({ cht }) => {

await reply(`Wait kak *${cht.pushName}*`);
await sleep(1500);

await cht.edit("Nah dapat...", keys[sender]);
await sleep(1000);

const Bar = [
`Hai, permaisuriku! How are you today? Aku kangen banget sama kamu, lo. Udah lama kita enggak ketemu semenjak aku harus kerja di Jakarta. Enggak sabar, deh, buat ketemu kamu di akhir pekan nanti. Tenang, kita ntar tuntaskan rindu ini dengan hal-hal yang menyenangkan, ya! Kamu mau apa? Nonton, makan, atau jalan-jalan keliling kota? Sabar aja dulu, ya. I love you, beb!`,
`Hi my love! Apa kabar kamu hari ini? Kamu tahu enggak, aku hari ini naik jabatan menjadi leader karena performaku dalam bekerja naik signifikan dalam setahun terakhir. Semoga kamu ikut senang juga, ya. Sabtu kita ketemu, yuk! Dah kangen berat nih aku`,
`My dear! Aku berharap kamu baik-baik saja, ya. My day is always brighter with you in it. Kamu bikin aku nyaman dan tambah semangat menjalani hari. Aku sayang kamu karena kamu adalah sumber inspirasiku. Ya, my sunshine in the cloudy days. Teruslah menyinariku dengan harapan dan kasih sayang, ya, cintaku`,
`Kamu sudah tidur? Hmm… Enggak apa-apa, aku bakal ngomong sendiri aja. Aku mau mengakui kalau kamu adalah sosok yang bisa membuat aku merasa menjadi diri sendiri. Semenjak pacaran sama kamu, aku merasa aku telah menjadi diri sendiri dan tentu saja mengalami perkembangan pesat. Thx buat semuanya, ya.`,
`Hai gadisku yang cantik! Aku enggak bisa berhenti mikirin kamu, lo. Enggak tahu, ngerasa keganggu aja pikiranku sama kamu. Hmm, kamu pake pelet, ya? Haha… becanda, deng. Asal kamu tahu, kamu adalah light in my darkest days dan kamulah reason behind my smile. Terus saling mencintai, ya.`,
`Sayangku, aku kangeeeenn!!! Aneh, ya, padahal baru tadi kita ketemu, tapi kenapa rasa rindu ini terus muncul, sih. Kamu enggak pake jurus-jurus jitu buat bikin aku kangen terus, kan? Oiya, makasih udah nyempetin buat ketemu di tengah kesibukan kamu ngerjain skripsi. Aku bangga banget punya pacar kayak kamu, semoga kita terus begini, ya, selalu senang dan bersama di saat suka dan duka. Awas, besok jangan kesiangan bangunnya, jangan lupa juga kerjain skripsinya. I love you, sayangku!`,
`Sayang, gimana kabar hari ini? Aku lagi ngerasa bener-bener kangen sama kamu, kayak butterfly in my stomach yang terbang bebas. Kamulah yang bikin hidup aku lebih berarti. Aku sayang kamu, more than words can describe. I love you with all my heart, sayang.`,
`Kamu mungkin enggak tahu, dunia ini tidak hanya memiliki 7 keajaiban melainkan delapan keajaiban. Salah satunya adalah kamu yang bisa membuat aku senyum-senyum enggak jelas dan merasa rindu terus sepanjang hari. Kamu harus tahu kalau aku mencintaimu dengan segenap hatiku.`,
`Akan selalu kuingat, sayang. Kamulah yang temani tumbuhku, kembangkan tingkahku. Semua kuingat dalam dan dekat. Beberapa hari ini, aku selalu memejamkan mataku lalu sebutkan namamu hadir. Lantas, muncul rangkaian ribuan cerita penting. Satu yang harus kau tahu, kuinginkan kau ada dalam abadi. I love you!`,
`Hay, beb! Kamu bikin hidupku jadi lebih berarti. Ya, kamu ada buat aku di kala senang maupun sedih. Aku pengen kamu tahu kalau aku tuh ngerasa beruntung bisa pacaran sama kamu. Aku sayang kamu lebih dari apa pun.`,
`Sudah ribuan kata-kata semangat yang kamu lontarkan buat aku di kala aku rapuh. Kini, setidaknya aku telah bisa menghidupi diri sendiri. Aku yakin, kita bakal ada dalam satu atap yang sama. Semoga doa dan harapan kita dikabulkan sesegera mungkin, ya.`,
`Mencintaimu adalah anugerah terbaik yang diberikan Tuhan. Tidak pernah terpikir kalau aku bisa memilikimu, menyayangimu, mencintaimu. Bahkan, lagu-lagu romantis yang diciptakan oleh musisi pun tidak ada apa-apanya. Aku yakin cinta ini akan selalu ada, akan selalu terpancarkan dari hari ke hari. Semoga perasaan ini tidak berubah sampai kita menua. Ketahuilah, aku benar-benar ingin selalu ada di dekatmu.`,
`Tahukah kamu, sayang, bahwa hal romantis yang pernah kamu lakukan kepadaku adalah ketika kamu menerima cintaku. Itu sangat berkesan dan tidak akan pernah aku lupakan. Percayalah, aku akan selalu menjagamu, membuatmu merasa berarti. Aku ingin kamu selalu ada dalam setiap hela napasku.`,
`Hi, beb! I can’t stop thinking about you, you know? Iya, kamu bikin hatiku berdebar-debar setiap hari. Aku juga tidak tahu kenapa bisa begini. Namun, satu yang pasti, perasaan ini timbul begitu saja dan itu artinya kamulah orang yang bisa membuatku lebih “hidup” dan semakin berarti. Salam cinta dariku.`,
`Kini aku punya sosok yang menjadi sumber kebahagiaanku. Selama ini, aku belum pernah merasakan cinta dari seseorang. Hadirnya dirimu membuat aku merasa tenang. Semoga cinta kita selalu bersemi, tumbuh, dan terus bermekaran. Hatimu selalu ada untukku, begitu juga sebaliknya. I love you!`,
`Aku merasa bahwa dalam perjalanan cinta setahun terakhir ini, kamu tidak hanya berperan sebagai pacar. Lebih jauh dari itu, kamu adalah sahabat dan juga ibu. Semoga kita selalu bersama selamanya. Bagaimana, kamu senang juga nggak dengan hubungan ini?`,
`Aku masih ingat betul, kamu datang dari hal yang tidak terduga. Setelah momen pertemuan itu, perasaan ini terus tumbuh. Kamulah yang membuat aku semakin kuat. Semoga hal yang sama juga kamu rasakan ya, sayang. Ingat, apa pun yang kamu rasakan, aku juga.`,
`Hai Cinta, sejak kamu datang dalam hidupku, aku enggak pernah tahu lagi apa itu kesedihan. Hari ini dan mungkin hari-hari selanjutnya, hidupku akan selalu dihiasi dengan harapan dan hal-hal baik. Itu semua berkat kehadiranmu. I love you!`,
`Di setiap detak jantungku, aku selalu terpikirkan dirimu, sayang. Kamu hadir tanpa aba-aba, kerap kali aku merasa belum siap kedatangan cinta darimu. Namun, seiring waktu, aku semakin yakin bahwa kamulah sebenar-benarnya cinta yang Tuhan berikan untukku. Semoga kita bertahan lama.`,
`Mungkin inilah long text yang cukup panjang bagimu. Percayalah, dirimu sangat berarti di hidupku. Aku ingin, apa pun masalah yang mendera, kita bisa bersama-sama mencari jalan keluar. Berceritalah tanpa sungkan. Semua masalahmu adalah masalahku. Pun begitu juga sebaliknya.`,
`Aku tidak tahu mesti berkata apa selain meminta maaf karena telah bersikap buruk. Aku harap kamu bisa melihat lebih jauh dari kesalahan yang telah kuperbuat. Maafkan aku sayang. Aku tidak akan mengecewakanmu untuk kesekian kalinya. Beri aku kesempatan, sekali saja.`,
`Asal kamu tahu, aku tidak pernah bermaksud membuat kamu kecewa. Kamu begitu berharga dalam hidupku. Kehilanganmu akan sangat menghancurkanku. Aku meminta maaf karena telah membuatmu kesal. I love you, beb!`,
`Aku sadar bahwa memaafkan bakal memerlukan waktu dan proses yang cukup panjang. Aku menunggu dengan sabar sebab kamu begitu berharga. Aku janji tidak akan lagi mengulangi kesalahan serupa. Maukah kamu memaafkanku, sayangku?`,
`Kamulah orang yang mengajariku bahwa meminta maaf adalah hal yang paling berani yang bisa dilakukan seseorang. Kali ini, secara tulus, aku ingin mohon maaf atas kesalahanku yang telah menduakanmu. Kini, semua keputusan ada di benakmu.`,
`Seperti yang kamu katakan, di dunia ini tidak ada yang sempurna. Masing-masing dari kita, aku dan kamu, tentu saja mempunyai kekurangan. Aku telah melakukan kesalahan dan mengecewakanmu. Aku minta maaf. Sekali lagi, aku minta maaf.`,
`Ini bisa jadi kesalahan yang sangat membekas. Aku tidak tahu harus berkata apa lagi. Namun, ketahuilah bahwa aku benar-benar ingin meminta maaf. Semoga kamu bisa memafkanku dan kita jalani lagi perjalanan cinta kita bersama. I love you!`,
`hallawwww.sayangkuuu cintakuuuuuu, kenapa yaa?? kmuu mara sama akuu??maafin aku yaa, aku uda buat hal sepelee sampe kmu marah samaa akuu, aku gatauu kaloo hal sepele yang aku lakuinn ini mmbuat kamu maraahh dan kamu kecewaa sama akuu, aku juga ga sengajaaa nglakuin hal ituu, but kmu tauuu akuu ga seburuk apa yang kmu pikirinnn, aku juga ga bermaksud buat kamu marahhh, maaf jugaa kalo aku selama ini egois banget sama kamuuu, aku harap kamu bisa maafin aku yaaa, akuu ga bakal nglakuin/ ngulangin kesalahan akuuu, akuu ndamauu kita asingggg akuu ndaa mauu.tpi kalo semisalnyaa kamu masih marah, jengkel, kesel sama aku gapapa kok, itu hal wajar,jgn di pendem sendiri, baikan yaaa?? jangan berantem lagiii okeii?? maafin akuu, aku egoiss bngett, makasi jugaa yaaa mauu bertahann sama cwe berantakan kaya akuu, dan kamuu juga boleh crita crita hall random kamuuu, klo kamu ad msalaa critaa yaaa, jangan di pendemm sendiriii okeil??kamuu adaa akuu, kamuu ga bolee ngrasa sendiriiii, sekali lagii aku minta maaf yaa, kitaa baikan lagii, okeii? stay with me, whatever the problem, never look for other people's comfort`,
`Hey sayang, rileks dulu. Aku ngerti kamu lagi kesel banget, dan it's okay. Kita semua punya hari-hari kayak gini, kan? Tapi yang penting, jangan sampe emosi kamu ngebuat kamu lupa sama kita berdua. Tenang aja, semuanya bakal baik-baik aja. Aku nggak bisa ngitung berapa kali kita udah lewatin masalah kayak gini, kan? Dan setiap kali, kita selalu bisa ngatasinnya dengan baik. Jadi, sekarang nggak beda jauh. Masalah itu kayak awan gelap yang akhirnya pasti bakal berlalu juga. Kita punya kemampuan buat lewatin ini, sama kayak sebelumnya. Apa yang bikin kamu marah, aku dengerin kok. Aku di sini buat dengerin curhatan kamu, bukan buat nge-judge atau ngelawan. Jadi, ceritain aja, dan kita cari solusinya bersama. Tapi inget ya, marahnya udah cukup. Sekarang, mari kita bicarain dengan kepala dingin. Kita bisa atasin ini bersama-sama, kayak tim superhero yang lagi ngadepin musuh bareng. Jadi, tenang aja, kita bisa lewatin ini. Aku ada buat kamu, selalu sayang`,
`heyy, maaf ganggu waktu kamu, ada satu ha yang mau aku jelasin ke kamu, i have a crush on you, kalo kamu tanya kenapa? aku juga bingung ngejelasin tentang rasa ini ke kamu, perasaan cinta ini tiba-tiba dateng ke aku dan bagi aku kamu sempurna dan spesial di mata aku. iya, i like u, do u love me? aku ngga maksa kamu suka balik. tapi kamu kayak nya gasuka sm aku ya? it's okee, mencintai gak harus memiliki kan? aku akan selalu nunggu kamu disini. kalau ada apa apa kamu boleh banget cerita sama aku, aku selalu sedia buat kamu ko!!! ahaha, segitu aja mungkin dari aku, thanks yaa udah mau baca aku bahagia banget, sehat selalu ya`,
`Hai (nama crush ) maaf ya kalo aku lancang chat kamu, disini aku cuma mau ngungkapin perasaan aku, masalah mau diterima atau ngga itu tergantung kamunya, aku juga gabakal berharap lebih kok, kalo kamu risih bilang aja ya,btw i have crush on you🤍!!!,aku nyatain perasaan ini agar hati ku lega aja karna udah ngungkapin perasaan ke kamuu, semisal kamu udh punya pacar maaf yaa, karna udah confess ke kamu, segitu ajaa ya, ku tunggu balasan nyaa! Terimakasii`,
`heyy, maaf ganggu waktu kamu, ada satu hal yang mau aku jelasin ke kamu, i have a crush on you, kalo kamu tanya kenapa? aku juga bingung ngejelasin tentang rasa ini ke kamu, perasaan cinta ini tiba-tiba dateng ke aku bagi aku kamu sempurna dan spesial di mata aku. iya, i like u, do u love me? aku ngga maksa kamu suka balik. tapi kamu kayak nya gasuka sm aku ya? it's okee, mencintai gak harus memiliki kan? aku akan selalu nunggu kamu disini. kalau ada apa apa kamu boleh banget cerita sama aku, aku selalu siap sedia buat kamu ko!!! ahaha, segitu aja mungkin dari aku, thanks yaa udah mau baca aku bahagia banget, sehat selalu ya`,
`haiiiiii, selamattt malemmm (namanya) kamuu tauu gaaa?? kamuuu tuuu kayaa martabakk, SPESIALL, kamuuu segalanya bagi akuu, kamuu sempumaaa bagiii akuu, kamuu duniaaa akuuu, tapiii kamuuutuuu kenapaa kayaa bintangggg, indahh, cantikkk, menawannn, tapi sayangnyaaa kamuu susaa di gapaiii wkwkw, kaloo kamu nanyaaa akuu tulus ga samaa kamuu? justruu akuu tuluss banget, akuuu sayang samaa kamuu lebih darii akuu sayang sama diri sendiri, semogaa kamuu bacaa inii yaaaa, i lovee uu so muchhh`,
`halooo? how was ür day? aku mau nanya deh sama kamu.. tapi maaf ya kalau ako Lancang, kama engga mau hubungan kita lebih serius? akuu tau kita hts an, tapii kamu ngerasain ga sih apa yang aku rasain? iya, cape digantung sama yang ga pasti.. emang iya kalau sayang ga harus pacaran, kawin aja ayo wk, tapi kenapa harus hts? kita bukan siapa siapa, but.. do you want to be mine or am i yours? kalau kita pacaran gabakal canggung kok kita kan udah kenal cukup lama kecuali kita baru kenal langsung pacaran. hope you understand my feelings, jangan pernah bosen sama aku yaa??? aku bisa jadi rumah kedua buat kamuu Secretttybe happyy, beloved sebelumnya aku minta maaf kirim ini tiba-tiba, aku cuma ingin luapin dan ungkapin yang aku rasain aja. Aku gatau rasanya hal kaya gini wajar apa ngga, tapi jujur Ini ngeganjel bangget buat aku, dan selalu bikin aku bertanya-tanya banyak hal. Kayanya kita udan cukup lama jalin hubungan tanpa status kaya gini, boleh aku nanya satu hai? oke aku anggep boleh, apa kamu selama kita hits ini nyimpen perasaan buat aku? maaf aku kasih pertanyaan kaya gini, karena jujur aku penasaran dan butuh kepastian. Aku takut, aku takut terlalu berharap sama kamu, aku takut ternyata kamu udah dimiliki atau memiliki orang lain, karena dengan status kita ini gak menjamin kan bahwa kamu gak punya yang lain. Jujur juga aku marah saat cemburu aku gabisa apa apa, karena aku sadar posisi aku dimana. Aku bahagia saat bareng kamu dan awalny aku gak memperdulikan tentang status kita, asal sama kamu, aku udah seneng, tapi nyatanya makin kesini aku makin takut kamu ninggalin aku secara tiba-tiba. maafin aku ya udah lancang nanya hal kaya gini, makasih udah mau baca pesanku, aku harap kamu ngerti maksud yang aku sampein ya , aku cuma mau bilang aku sayang banget sama kamu, i know kita memang gaada hubungan apa apa but bisa ga si kamu jangan pergi, aku gamau kehilangan kamu, aku tau manusia itu juga gampang berubah gatau itu dari sikap maupun perasaan, inget walaupun kita gaada hubungan apa apa kalo kamu cape inget ada aku disini yang selalu siap dengerin keluh kesah kamu, aku bisa jadi sandaran buat kamu ya walaupun kita gaada hubungan apa apa hehe..`,
`📢 : Longtext confess\n\nhaloo maaf ya kalau aku bikin risih cuma aku mau ungkapin perasaan aku ke kamuu sebenarnya anu aku suka kamuu hehee aku suka kamu karena kamu lucu baik dan aku juga sukaa kepribadian kamuuu maaf aku ga berani ngomong langsung sama kamu aku cuma berani bilang di sini heheee semoga kamu ga risih yaa anw kamu ga harus bales perasaan aku kokkk aku cuma mau confess aja biar aku lega hehee semogaa kita bisa lebih deket lagi yaa sebenernya aku kepo kamu suka juga ato ga sama akuu cuma ga harus dijawab sekarang kokkk kapan kapan aja kalo kamu siap hehee oh yaa I want to say I love you very much kamu hebat bisa bikin aku se sukaa iniii sama kamuuu anww sekali lagi maaf yaaa kalau kamu risih thank you, be a cheerful person okayy....`,
`halooo, good evening gimana hari ini? ada yang menyenangkan tidaa? semoga aja hari nya menyenangkan ya, kalo tida juga tidapapa kan masi ada hari besok :3 olya makasi ya suda luangin waktunya buat buka pesan aku, dan maaf yaa menganggu waktu nya, maaf juga aku suda lancang tiba tiba chat kamu kaya gini, sebelumnya aku minta maaf aku suda lama suka sama kamu tnpa kamu tau ehehehe, aku tida tau rasa ini tiba tiba muncul begitu saja, sebener nya aku gengsi buat bilang ini sama kamu, tapi kali ini aku turunin dulu rasa gengsi aku ahahaha, langsung intinya aja deh I have crush on you asshssjs aku malu bgt, aku suka sama hal hal yang ada di diri kamu, tngkah kamu, sifat kamu, rambut kamu, semuanya aku suka, kamu tau ga? selain kamu cantik, kamu juga lucu nan gemas ahahaha sampe suka aku juga liatnya, masi banyak lagi deh hal yang membuat aku suka sama kamu, dan sekarang aku lega banget suda bisa confess sama kamu, olya sebelumnya terimakasi ya sudaa mau baca ini semua sampai akhir, maaf kalo ada kata kata aku yang ga enak atau membuat kamu risih, dan. yeahh sekali lagi i have crush on you! :3`,
`selamat malam cantikk, disini aku mw bilang sesuatu sm kamu, sriuss ni yaa, aku gbisa romantis si, disini aku cm mw ngungkapin isi hati akuu, aku cm mw bilang klau aku suka sama kamu, maaf yaa ga romantiss krna aku bukan orang yang sweet hhee, rasa ini tiba - tiba dteng && buat aku jadi bingungg awalnyaa, tapi lama kelamaan aku mngerti apa arti rasa ini, aku suka kamu nm cw yg u suka klau kamu blum bisa jawab skrangg, isssokee, ga masalaa. dan klau misalkn kamu blum suka sama aku, izinin aku buat brjuangg supaya kamu suka sama aku yyaa?? akuu bkall berjuang, demi kamu. sooo, will u be my girlfriend cantikk??`,
`selamat malam cantikk, disini aku mw bilang sesuatu sm kamu, sriuss ni yaa, aku gbisa romantis si, disini aku cm mw ngungkapin isi hati akuu, aku cm mw bilang klau aku suka sama kamu, maaf yaa ga romantiss krna aku bukan orang yang sweet hhee, rasa ini tiba - tiba dteng && buat aku jadi bingungg awalnyaa, tapi lama kelamaan aku mngerti apa arti rasa ini, aku suka kamu nm cw yg u suka. klau kamu blum bisa jawab skrangg, isssokee, ga masalaa. dan klau misalkn kamu blum suka sama aku, izinin aku buat brjuangg supaya kamu suka sama aku yyaa?? akuu bkall berjuang, demi kamu. sooo, will u be my girlfriend cantikk??`,
`haii, can i say something? aku udah mendem ini dari lamaa banget, soalnya ini bukan hal biasa, mungkin buat kamu sepele tapi buat aku enggaa. sebelumnya aku mau nanya, kamu pernah ngga si di crush in sama cewe gitu? and gimana balesan kamu terhadap cewe itu? kalo nerima pasti gampang lah ya bilang nya tapi kalo nolak tuu kaya susah gasii, kali ini aku bakalan bikin kamu ketar ketir lagi wkwkk. oke langsung aja ke intinyaa, i have crush on you. yaa aku naksir kamu / aku suka sama kamu, asli aku gatau kenapa perasaan ini tiba tiba dateng, kalo kamu emang risih it's okey gapapa, aku bisa hilangin perasaan ini, pelan pelan. tapi jangan jauhin aku ya? please, aku gamau lost contact sama kamu cuma gara gara aku confess ke kamu, please jangan jauhin aku aku ga maksa kamu buat ngebales perasaan aku, kalo emang gabisa it's okey aku gamaksaa, makasiii buat waktu nya uda mau baca pesan aku, sampai jumpa nanti lagii\n\nbabayyy!`,
`heyy, maaf ganggu waktu kamu, ada satu hal yang mau aku jelasin ke kamu, i have a crush on you, kalo kamu tanya kenapa? aku juga bingung ngejelasin tentang rasa ini ke kamu, perasaan cinta ini tiba-tiba dateng ke aku dan bagi aku kamu sempurna dan spesial di mata aku. iya, i like u, do u love me? aku ngga maksa kamu suka balik. tapi kamu kayaknya gasuka sm aku ya? it's okee, mencintai gak harus memiliki kan? aku akan selalu nunggu kamu disini. kalau ada apa apa kamu boleh banget cerita sama aku, aku selalu siap sedia buat kamu ko!!! ahaha, segitu aja mungkin dari aku, thanks yaa udah mau baca aku bahagia banget, sehat selalu ya🤍❤️`,
`alooow, maafin aku kalo selama kamu sama aku kamu ngerasa cape bangett sama sifat aku, aku juga mau bilang makasii karna kamu udah mau jadii 24/7 nya akuu, kamu sabar bangett ngadepin aku yang kaya ginii yang suka tiba tiba marah gajelas, jelas, ngomong gajelas, bdmood.. beruntung banget bisa kenal sama km , bisa punya hubungan sama kamu kamu kaya orang yang gapemah aku bayangin di sebelumnya, sebelumnya gaada bayangan bisa ada hubungan sama orang kaya kamu, karna sebelumnya gapernah ketemu orang yang kaya kamu jadi kaget gitu ketemu orang baik, sabar sama sifat aku, kamu orang paling sabar yang bisa ngadepin childishnya aku wkwkwk oh iyaa soal kemarin aku minta maaf kalo kamu ngerasa aku mungkin keliatan cuek gapeduli gitu sama kamu padahal mah engga serius deh, kalo kamu suka ngilang gituu pengen banget nyariin kamu tapi aku kaya mikir takut banget kalo kamu risih atau ga keganggu sama aku, makannya aku kaya lebih milih nunggu kamu daripada aku ganggu kamu, eh tapi ternyata kemarin kamu bilang suka diganggu wkwkwk aku bisa ngetik sebanyak ini, berani ngetik ini waktu kamu bilang itu, sebenernya tu aku juga nungguin kamu, suka kaya mikir ini anak kemana ngilang seharian ga ngabarin kemana gitu, makanya aku kaya suka kesel sendiri gitu, kamu ditungguin malah ga sadarr kalo ditungguin yaudah tapi gapapa yg penting aku dah bilang inii maaf kalo kaya berlebihan gini yaa beee, lain kalii kalo aku ada salah atau ada unek unek yang mau kamu keluarin tentang aku bilang aja yaa beee, kalo kamu gabilang aku gatau kan aku bukan cenayangg :( inget yaa beee bilang kalo ada apa apa ada yang salah di aku bilang aja okayyy? i love u 700 + 300 + 1.500 + 500 beee😡 ❤️`,
`Longtext minta maaf ke cowo yg lgi ngambek :\nhaii bububb maafinnn akuuu yaa?? maafinn akuu yaa udaa buatt kamuu ngambekkk. maafinn semuaaa kesalahann akuuu, iyaaa akuu sadarrr koo akuu salaaa, jadii maafinn akuu. akuu tidaa mau kamuu ngambekk ngambekk kayaa ginii, akuu tidaa sukaa jadii tolongg jangann ngambekk lagii, kitaa happy happy lagii yaa? udaa dongg. pangerankuu tidaa bolee ngambekk lagiii kitaa baikann lagii yaaa? akuu ngerasaa bersalaa bangett.. maafinn yaa? yaa? yaa? akuu fahamm pastii kamuu kesell bangett samaa akuu. maafinn dongg, akuu tauu akuu salaa, udaa dongg jangann ngambekk, jangann cuekk kayaa ginii. akuu tidaa mauu kaloo hubungan kitaa kayaa ginii. awass ajaa kaloo kamuu masii ngambekk kamuu capee? harii inii capee banget yaa? ayoo ayoo ceritaa, apaa yang ngebuatt kamuu capee harii inii. akuu disinii, siapp dengerinn semuaa ceritaa kamuu, curhatann kamuu, kamuu masii punyaa akuu. kamuu ngambekk ngambekk kaya ginii mendingg kitaa ceritaa ceritaa dehh, ceritaa tentangg harii iniii, apaa yang terjadiii tentang harii inii. udahann yaa ngambeknyaa, ayoo bububb maafinn akuu 😡😡`,
`sayanggg, akuu tauu masing' dari kita pasti pngn di ngrtiin, akuu jugaa capee tiap hri brntem muluu, besok besok jangan gitu lagi minta putus yaa? akuu gamauu brntem teruss,kalaw semisal ada masalah dgn hubungan kitaa bicarakan baik' yaa jangan Ingsung ngmbil kputusan buat break!! akuu gamau kehilangan kamuu :(\nmulai sekarang kita harus bisaa ngrtiin satu sama lain yaa!!. aku smakin yakinn klau pasangan yang uda nmenin aku sejauu ini ituu pasangan yang tepat buat aku yaituu kamuu sayangggg, aku gabisaa deskripsiin kamu lebi banyaa lagi dr kata kata, ni yaaa asal bb tauu kamu ituuu trlalu SEMPURNAAAA untukk dicritainn lewat kataa kataa bb :c walaupun kita seringgg berantemm aku ga nyangka kamu masih bertahan sama aku sampai sekarangi really lucky to have u makasi uda mw temenin aku sampai sekarang ini, aku harap kita bisa bertahan lama tanpa harus ada kata putus, skali lagi thank u for being in my life, i lovee uuuu ayangg ❤️💘`,
`akuu minta maaf yaa? mungkin tadi aku salah, makanyaa aku sekarang minta maaf okeyy? maaf kalo kesalahan aku tadi bikin kita malah jadi berantem. aku minta maaf, semoga kamu maafin aku yaaa, kalo ga dimaafin gapapaa koo ini juga salah akuu, tapi aku harap kamu maafin aku. tdi aku salah banget ya sama kamu? bikin kamu jadi badmood? atau marah sama aku? maafin aku yaa? aku gatau kita bakal jadi berantem kaya ginii. sekarang kita baikan yaaa berantem nyaa udahin disinii sajaa, aku gamau lama lama berantemnyaa sama kamu, aku mau baikan samaa kamuu gamau berantem kayaa gini lagii, sekali lagi aku mintaa maaf yaa buat kesalahan aku yang tadi atau yang sebelum sebelumnya okeyy`,
`Aku minta maaf yah cantikk kmu ketemu cowo kaya aku. pemarah, apa apaa dibikin ribet, udah mah gak ganteng punya sifat yang jelek nya minta ampun. udah gak punya muka jelek miskin lagi. nyenengin kmu aja aku gak bisa, cuman bisa bikin kamu sakit hati, kesel, badmood tiap hari. tapi jujur apapun yang aku punya aku kasih semua buat kmu, apa yang kmu minta aku bakal usahain, apa yang kmu mau aku bakal wujudin sebisa aku. aku bakal berusaha, bakal usahain semuanya. aku gak bakal nyerah, aku gak bakal pergi, aku bakal terus sayang sampai kapan pun. klo kamu udah nemu yang lebih segalanya dari aku bilang aja kalopun iyaaa kamu milih diaaa aku bakal terima. aku yakin diaa bisa buat kmu bahagia gak kaya aku, udah jelek miskin punya sifat jelek. tapi klo kmu masih milih aku aku berterima kasih bangett sama kmu aku bakal berusaha lagi lebih keras dari yang sebelumnya. aku yakin aku bakal bisa bahagiain kmu suatu saat nanti. demi kmu aku bakal lakuin apapun walau kesanya gak mungkin tapi apapun bakal aku coba`,
`kamu lagi ngambek sama aku? hei, aku ga bermaksud buat kamu marah kaya gini tapi kamu harusnya tau dong kalau aku ga suka diatur-atur dan aku juga kan udah tau mana hal yang baik buat diri aku sendiri. aku berterima kasih banget kamu udah peduli sama aku apalagi perhatian kaya gini, tapi maaf kalau kamu ngatur-ngaturnya berlebihan aku jadi risih dan bukan bermaksud udah ga sayang sama kamu apalagi gak suka kamu perhatian ke aku lagi, itu salah besar. aku benar-benar suka kamu perhatian maupun peduli ke aku tapi jangan berlebihan aja ya? aku jadi ga enak bilang kaya gini ke kamu tapi lebih baik gini kan daripada gak ngasi tau kamu sama sekali`,
`sayaang, maaf yaa kalo ada masalah yang bikin kamu sampai badmood, aku tau kamu lagi bete sekarang tapii kamu harus ingett ada aku disini yang selalu ada buat kamuu > < > د aku bakaal nunggu sampai ga badmood lagii, kalo ada apa-apa cerita sama aku yyaa? aku bakal dengerin semua keluh kesah kamuu sampai kamu legaa, aku bakal send virtual hug buat kamu, i'm always here for u sayaangg 🫂❤️`,
`I'm lucky to know you, I'm lucky to have you, you are the happiest part oh my life. Thanks`,
`Kalo emang kamu ngerasa gak nyaman sama sikap aku yang kaya gini aku minta maaf ya sayang hehe, aku tau aku yang terlalu sayang dan berlebihan sama kamu, aku tau aku yang terlalu khawatir tentang kamu, makanya aku suka bawel sama kamu, suka marah sama kamu, suka nyari kamu, kangen sama kamu dan randomin kamu, aku sadar itu, tpi kalo semua itu malah bikin kamu gak nyaman sama kamu, aku minta maaf bangett, aku juga minta maaf mungkin aku masih banyak kekurangan nya buat kamu, sering bikin kamu kesel, marah dan masih banyak lagi, maaf juga udah buat kamu risih selama ini, akutau dan sadar kalo aku belum bisa jadi yang terbaik di mata kamu. Kalo kamu emang udah gak bisa sama aku lagi semoga kamu bisa ketemu orang yang lebih baik dari aku, yang lebih segalanya dari aku, yang bisa bikin kamu bahagia melebihi bahagia yang aku kasih, dan yang bisa bikin kamu nyaman tapi semoga tetap aku tempat yang menuju tujuan akhir mu, aku sayang kamu ❤️❤️❤️`,
`Ternyata jadi cowo yg gk pernah nuntut apa selain waktu, selalu ngerti keadaan kamu, itu gk cukup buat di cintai dan disayang selayak nya masih harus ngemis dan nangis. Bingung iya, Sakit iya, Berantakan iya, kecewa iya!!! Gak paham banget udah kayak gini aja gak di hargai`,
`aku cuma mau bilang, mau sejahat apapun dunia dan semesta ke kamu, please don't be hurt & blaming yourself. segala masalah, musibah, kehilangan it's not your control, itu semua bukan kamu yang mengendalikan. jangan salahin diri kamu terus menerus, ya? pokonya jangan nyalahin diri sendiri dalam setiap hal kesedihan yang kamu alami, ya? belajar berdamai dan memaafkan diri sendiri, karena sumber kebahagiaan itu dibuat dari diri sendiri, kalau kamu masih belum bisa memaafkan dan mencitai diri sendiri gimana kebahagiaan itu bisa datang? kebahagiaan ngga akan selalu bisa digantungkan dan di cari dari orang lain. sejauh ini, kamu hebat. besok akan lebih hebat lagi. ga usah sedih lagi ya? terimakasi juga, terimakasi untuk sejauh ini, terimakasi untuk udah bertahan sejauh ini, u so great! so, make your own happiness...`,
`aku ngga tau ini hari keberapa kita bisa jadi temen disini, yang aku tau dari awal kita kenal dan bisa jadi temen, walaupun banyak ributnya tapi ada rasa seneng dan rasa syukur nya yg aku rasain. aku ngga bisa ngerti gimana perasaannya kamu, aku juga ngga bisa tau gimana harinya kamu hari ini. tapi yang jelas dan pasti aku berdoa supaya kamu selalu dalam keadaan yang baik-baik aja, kalaupun kamu lagi dapetin hari yang buruk semoga semuanya bisa lekas membaik. semoga kebahagiaan selalu hadir ke kamu lebih banyak dari ini, semoga dimanapun kamu berada, kamu selalu di jaga dan di lindungin sama tuhan dan juga semesta. pesan aku buat kamu si jangan lupa untuk selalu bersyukur sama apa yang udah kamu dapetin dan kamu laluin hari ini. semoga kamu bisa selalu percaya kalo apapun yang sedang kamu alamin sekarang ataupun nantinya itu semua pasti terjadi karna suatu alasan. pokoknya jangan sampe berhenti dan lupa buat selalu bersyukur yaaa, karna yang aku tau atau mungkin kita semua tau, apa yang kita dapetin di hari ini atau di hari nanti itu cuma titipan sementara dari sang pencipta untuk kita yang harus kita jaga. duh pokoknya jangan lupa bersyukur loyaaa?? seneng bisa ketemu manusia sebaik kamuu!`,
`good nightt sayang, gimanaa harii inii?? ada yg mengecewakan?? ratingg nya dulu dong 0/10 untuk hari iniii eumm. semangaatt yya bbubb untuk melakukan beberapa hal && berusaha dlam bbrapa hal, klau emang gagal, mungkin itu bukan gagal but belum saat nya kamu bisa mencapai keinginan mu, tndanya kamu hruss semangattt smua org pasti harus berusaha  terlebi dahuluu sblum keinginan nya tercapaii, jadii bbub tidak boleh MENYERAH gituu ajaaa!! di dunia ini tda ad yg mudaa bubb, klau km gagal, bangkit lagii, gagal lagii?? bangkit terus smpai menjadi bintang di duniaa jngan pernah kecewa dengan hal-hal yg kamu coba tetapi gagal, coba lagiii, berusaha & pelajaarii :>> tda smuaa ke inginan akan tercpai dngan' mudah ada bbrapa yg susah kaya harus melewati rintangan rintangan yg datang baru bisa mendapatkan keinginan nyaa:0 gagal bukan berarti culun, bodoh, itu ENGGA YYA BBUBB inget kata kata dari aku tda ada manusia yg ingin ini & itu langsung ada di hadapan dia ada yg begitu but rata-rata di dunia ini akan mendapatkan rintangan yg harus bekerja kerass untuk mendapatkan hal itu begitupun kamuu, klau usaha kamu gagal, jngan langsung nyerah begitu sajaa : << BIG NOO cowo aku kan kuaattt && tda gmpang menyeraaa semangattt bubuuu`,
`📢 longtext  buat pacar yang respon nya berubah : \n\n alldo u know? i'm so lucky to have uu. i couldn't imagine a better blessing than having u in my life. u bring so much love and joy to my days and fill my life with such happiness. ur kindness, thoughtfulness and compas- sion are unmatched. u make me feel so lucky to have u as a part of my world. i'm thankful for u every single day. i want to be the song that plays whenever u feel lonely, the word that relieves every pain u feel and the drops of water that takes away every headache u have. i want to be ur everything, because u are everything to me. aku engga akan maksa kamu buat stay sama aku, aku uda liat kamu ngerasa cape banget sama sikap aku, if u found someone better than me, aku engga mau jadi penghambat kebahagiaan kamu, no, bukan aku engga sayang sama kamu, tpi cuma itu yg bisa aku lakuin buat nunjukin seberapa besar rasa cinta dan sayang aku ke kamu, aku uda selalu coba jadi yg terbaik buat kamu but tetap aja never enough buat kamu, u deserve better than me, aku mau jadi support system kamu, even kalo akhirnya bukan aku yg sama kamu nanti, aku engga akan pernah nyesel uda ngelakuin effort yg jujur susah banget buat aku lakuin maaf buat semua kesalahanku yang engga bisa aku tebus sampe saat ini dan maaf buat janji.  yang ak engga bsa aku tepatin sampe hari ini. maaf banyak untuk selalu ngerepotin kamu, aku ngikut kamu sekarang kaya gimana bebass. dan aku rasa juga respon kamu berubah engga kaya kemarin, atau mungkin perasaan aku aja??? i'm so so sorry if it makes u angry or tired with my attitude all this time. aku disini kapanpun kamuu butuh, aku bakal ngehibur kamuu, bakal bikin kamu ngerasa lupa sama masalah-masalah kamu no matter what, even i think someday you will fall for someone new, haha but if she break ur heart, i'll be here for u, tapi jangan deh kamu punya aku doang soalnya.`,
`📢 Long Text mau putuh karna ga di anggap pacar: \n\nhaii makasih ya udah mau jadi yang terbaik buat aku, udah mau mempertahanin hubungan sampai selama ini dan aku cuma mau let's break up. maaf maaf banget, sorry aku egois aku ga punya pilihan lain, selama aku sama kamu aku selalu ngerasa kaya bukan di anggep pacar sama kamu melainkan teman, ya aku tau aku ga pantes buat kamu makannya aku selalu dianggap teman dan ya... Kadang kamu suka nyakitin hati aku, setiap kamu jalan bareng cewe lain dan disaat itu juga ada aku disebelah kamu tapi apa?? kamu malah lebih memilih cwe/wanita itu, kamu pikir? coba, pasti sakit banget kan rasanya kalo kmu ga aku anggap sebagai pacar, mikir sampe situ dong.. aku harap kamu menemukan wanita yang lebih dari akuu. makasih untuk 2 tahun ini, makasih banget kmu tokoh utama di dalam cerita ku, sampai sini aja ya, dan kalau kmu ada masalah boleh cerita ke aku, aku bisa jdi rumah ke 2 buat kamu`,
`📢 Longtext mnta putus secara baik baik \n\naku mw blg sesuatu ke kamuuu, let's break up, cerita kita sampai disini aja yaa? maaf aku kalau selama ini sikap ku krg baik sama kamuu, ku minta maaf, maaf ya ak belum bs bahagiain kamu, makasi uda mw hadir dikehidupan aku, ya walaupun ga berselang lama mwehehe, makasi uda mw berbagi cerita dan makasi uda menjadi support system ku, ak big banyaa2 makasi smaa kamuu, semoga kedepannya kamu bisa cari ce/co yang lebih baik & lebi ngertiin perasaan kamu, kamu harus jaga kesehatan yaa jgn lupa bwt mam yang banyaaa :>>> aku beruntung bgt bs kenal kamu, tp kisah kita cukup disinii, mungkin emg ud bukan jalan ya kita bwt sama2 terus yaa, skrg ud ga ada yang ngelarang & marah sama kamuu. mungkin ini chat terakhir ku untuk mu?¿ jaga kesehatan okey?? babaiii`,
`📢 : Longtext karna ga secantik masalalu \n\nwkwk, maaf yaa aku ngga secantik masalalu, kamu maaf aku ngga sesempurna masalalu kamu, maaf aku gabisa mandiri kaya masalalu kamu, maaf aku gabisa kaya masalalu kamu, aku harus apa biar semua yang aku lakuin bisa kamu pandang?? maaf aku gabisa sehebat dia karna aku itu diri aku kalaupun kamu mau balik ya silahkan ajaa, aku emang bukan wanita yang kaya, cantik dan lainnya tapi hanya wanita yang mempunyai hati tulus dan cukup satu pasangan, kalaupun kamu enggak mikirin masalalu kamu aku jugaa seneng banget karna akhirnya kamu juga lihat aku disini selalu, maaf kalau aku suka insecure sama masalalu kamu karna kenapa bisa kamu dulu pacaran sama cewe cantik sekarang sama cewe kaya aku wkwk, maaf yaa kalau emang aku gabisa kaya dia`,
`📢 : Longtext untuk confes ke teman \n\n hai, lagi senggang ga?? aku mau ngomong sesuatu tapi aku takut kalau semisal nantinya bakal asing. sorry but i have crush on u, be my ( ubah aja ngab gf/bf?. ) kalau pun kamu ga ngasih celah buat aku masuk di hati kamu, tolong jangan asing ya? kalau pun kamu bertanya tanya kenapa aku bisa suka sama kamu, ah perasaan ga bisa di tebak lewat apapun dan rasa suka ga perlu alasan kan?. aku siap lihat jawaban dari kamu, dan aku berharap kamu terima aku sebagaimana teman untuk kamu berteduh. aku selalu anggap kamu lebih dari teman. aku suka kamu, tolong jangan asing ya? kamu rumah buat aku berpulang, untuk tempat cerita. dikala susah senang kita lewatin bareng bareng, trimakasih ya buat semuanya? i'm pround of u!!`,
`hallawwww.sayangkuuu cintakuuuuuu, kenapa yaa?? kmuu mara sama akuu??maafin aku yaa, aku uda buat hal sepelee sampe kmu marah samaa akuu, aku gatauu kaloo hal sepele yang aku lakuinn ini mmbuat kamu maraahh dan kamu kecewaa sama akuu, aku juga ga sengajaaa nglakuin hal ituu, but kmu tauuu akuu ga seburuk apa yang kmu pikirinnn, aku juga ga bermaksud buat kamu marahhh, maaf jugaa kalo aku selama ini egois banget sama kamuuu, aku harap kamu bisa maafin aku yaaa, akuu ga bakal nglakuin/ ngulangin kesalahan akuuu, akuu ndamauu kita asingggg akuu ndaa mauu.tpi kalo semisalnyaa kamu masih marah, jengkel, kesel sama aku gapapa kok, itu hal wajar,jgn di pendem sendiri, baikan yaaa?? jangan\n\nberantem lagiii okeii?? maafin akuu, aku egoiss bngett, makasi jugaa yaaa mauu bertahann sama cwe berantakan kaya akuu, dan kamuu juga boleh crita crita hall random kamuuu, klo kamu ad msalaa critaa yaaa, jangan di pendemm sendiriii okeil??kamuu adaa akuu, kamuu ga bolee ngrasa sendiriiii, sekali lagii aku minta maaf yaa, kitaa baikan lagii, okeii? stay with me, whatever the problem, never look for other people's comfort`
];

const BarrLoveElaina = Bar[Math.floor(Math.random() * Bar.length)];

await reply(`🐱 Nih Long Teks\n\n${BarrLoveElaina}`);

})

ev.on({
  cmd: ['namaninja', 'ramalkan', 'sifat'],
  listmenu: ['namaninja' ,'ramalkan', 'sifat'],
  tag: "fun",
  args: "*❗ Ketik namanya*",
  isGroup: true,
  energy: 5
}, async ({ cht, args }) => {

if (cht.cmd === "namaninja") {

  const Bar = {
    'a': 'ka',
    'b': 'tu',
    'c': 'mi',
    'd': 'te',
    'e': 'ku',
    'f': 'lu',
    'g': 'ji',
    'h': 'ri',
    'i': 'ki',
    'j': 'zu',
    'k': 'me',
    'l': 'ta',
    'm': 'rin',
    'n': 'to',
    'o': 'mo',
    'p': 'no',
    'q': 'ke',
    'r': 'shi',
    's': 'ari',
    't': 'ci',
    'u': 'do',
    'v': 'ru',
    'w': 'mei',
    'x': 'na',
    'y': 'fu',
    'z': 'zi'
  };

  const ninjaName = args.split('').map(char => {
    const lower = char.toLowerCase();
    return Bar[lower] || char;
  }).join('');
  
  await reply('Nama ninja anda adalah...');
  await sleep(1500);
  
  await cht.edit(`\n༺° Nama Ninja °༻\n\n- Asli   : *${args}*\n- Ninja  : *${ninjaName}*\n\n༒━━━━━━━━━━━━━━━━༒\n`, keys[sender]);

} else if (cht.cmd === "sifat") {

   const sifat = [
     'Introvert', 
     'Extrovert', 
     'Ambivert', 
     'Sanguine', 
     'Choleric', 
     'Melancholic',
     'Phlegmatic'
   ];
   
   const deskripsi = {
     'Introvert': 'Kamu memiliki sifat introvert, suka menyendiri dan berpikir dalam 🤔',
     'Extrovert': 'Kamu memiliki sifat extrovert, suka bersosialisasi dan berinteraksi dengan orang lain 🤝',
     'Ambivert': 'Kamu memiliki sifat ambivert, memiliki keseimbangan antara introvert dan extrovert 💡',
     'Sanguine': 'Kamu memiliki sifat sanguine, suka bersenang-senang dan memiliki energi yang tinggi 🎉',
     'Choleric': 'Kamu memiliki sifat choleric, suka memimpin dan memiliki ambisi yang kuat 💪',
     'Melancholic': 'Kamu memiliki sifat melancholic, suka berpikir dalam dan memiliki perasaan yang sensitif 🌧️',
     'Phlegmatic': 'Kamu memiliki sifat phlegmatic, suka menyendiri dan memiliki perasaan yang tenang 🌊'
   };

   const randomSifat = sifat[Math.floor(Math.random() * sifat.length)];
   const randomDeskripsi = deskripsi[randomSifat];
  
   await reply(
     `\n*${args}*, memiliki sifat *${randomSifat}*\n\nArti Sifat\n> ${randomDeskripsi}\n`
   );
           
           
} else {

  const ramalaN = [
    'Anda akan menjadi orang yang Kaya, keluarga yang harmonis, memiliki 2 memiliki anak, memiliki 4 memiliki kendaraan, memiliki 2 rumah',
    'Anda akan menjadi orang yang Sederhana, keluarga yang harmonis, memiliki 3 memiliki anak, memiliki 1 memiliki kendaraan, memiliki 1 rumah',
    'Anda akan menjadi orang yang Miskin, keluarga yang Sederhana, memiliki 1 anak, tidak memiliki kendaraan, rumah ngontrak',
    'Anda akan menjadi orang yang Sederhana, keluarga yang dicerai, memiliki 5 anak, memiliki 2 kendaraan, memiliki 2 rumah',
    'Anda akan menjadi orang yang Sederhana, keluarga yang Sederhana, memiliki 2 anak, memiliki 2 kendaraan, memiliki 1 rumah',
    'Anda akan menjadi orang yang Miskin, keluarga yang dicerai memiliki 2 anak, memiliki 1 kendaraan, memiliki 1 rumah',
    'Anda akan menjadi orang yang Kaya, keluarga yang Sederhana, memiliki 1 anak, memiliki 1 kendaraan, memiliki 2 rumah',
    'Anda akan menjadi orang yang Sederhana, keluarga yang Harmonis, memiliki 1 anak, memiliki 3 kendaraan, memiliki 1 rumah',
    'Anda akan menjadi orang yang Miskin, tidak memiliki keluarga (jomblo), tidak memiliki anak, tidak memiliki kendaraan, tidak memiliki rumah',
    'Anda akan menjadi orang yang Sederhana, keluarga yang Sederhana, memiliki 4 anak, memiliki 1 kendaraan, memiliki 2 rumah',
    'Anda akan menjadi orang yang Sederhana, keluarga yang kacau, tidak memiliki anak (Gugur), memiliki 2 kendaraan, memiliki 1 rumah',
    'Anda akan menjadi orang yang Sangat Kaya, keluarga yang Sangat Harmonis, memiliki 5 anak, memiliki 7 kendaraan, memiliki 9 rumah',
    'Anda akan menjadi orang yang Sangat Miskin, keluarga yang Sederhana, memiliki 9 anak, tidak memiliki kendaraan, rumah ngontrak',
    'Anda akan menjadi orang yang Kaya, keluarga yang Pelit, memiliki 2 anak, memiliki 2 kendaraan, memiliki 2 rumah',
    'Anda akan menjadi orang yang Sederhana, keluarga yang Pelit, memiliki 1 anak, memiliki 1 kendaraan, memiliki 1 rumah',
    'Anda akan menjadi orang yang Sederhana, keluarga yang dicerai, memiliki 2 anak, memiliki 1 kendaraan, rumah ngontrak',
    'Anda akan menjadi orang yang Sangat Sederhana, keluarga yang Sakinah, memiliki 1 anak, memiliki 1 kendaraan, memiliki 1 rumah',
    'Anda akan menjadi orang yang Sederhana, keluarga yang Sangat Sederhana, memiliki 11 anak, memiliki 1 kendaraan, memiliki 1 rumah',
    'Anda akan menjadi orang yang Sederhana, keluarga yang Sangat Sederhana, memiliki 2 anak kembar, memiliki 3 kendaraan, memiliki 2 rumah',
    'Anda akan menjadi orang yang Sederhana keluarga yang Sederhana, memiliki 2 anak kembar dan 1 anak lagi, memiliki 1 kendaraan, memiliki 1 rumah'
  ];

  const memekMulus = ramalaN[Math.floor(Math.random() * ramalaN.length)];

  await reply(`🔮 Mulai meramal masa depan *${args}*...`);
  await sleep(1500);
  
  await cht.edit(
    `\n*${args}*, ${memekMulus}\n`, 
    keys[
      sender
    ]
  );
  
}
})

ev.on({
  cmd: ['jodohkan', 'jodohku'],
  listmenu: ['jodohkan', 'jodohku'],
  tag: "fun",
  energy: 5,
  isGroup: true
}, async ({ cht }) => {
  await sleep(1500);
  
if (cht.cmd === "jodohku") {
  const randomIndex = Math.floor(Math.random() * Exp.groupMembers.length);
  const mentionedJid = `@${Exp.groupMembers[randomIndex].id.split("@")[0]}`;
  const mentionedJid2 = [Exp.groupMembers[randomIndex].id];
  
  await reply(`\nJodoh kamu di grup ini adalah: ${mentionedJid}\n> Moga langgeng 🤭\n`, { mentions: mentionedJid2 });
} else {
  const randomIndex = Math.floor(Math.random() * Exp.groupMembers.length);
  const randomIndex2 = Math.floor(Math.random() * Exp.groupMembers.length);
  const bar1 = `@${Exp.groupMembers[randomIndex].id.split("@")[0]}`;
  const bar2 = `@${Exp.groupMembers[randomIndex2].id.split("@")[0]}`;
  const Barzz = [Exp.groupMembers[randomIndex2].id, Exp.groupMembers[randomIndex].id];
  
  const mahar = Math.floor(Math.random() * 101);
  
  await reply(`\nAku jodohkan ${bar1} dengan ${bar2}\nDengan mahar senilai *${mahar} Juta*\n\nGimna para saksih sah!??...\n`, { mentions: Barzz });
}
})

ev.on({
  cmd: ['sipaling'],
  listmenu: ['sipaling'],
  tag: "fun",
  args: "*❓ Sipaling apa*\n> Contoh .sipaling alim",
  isGroup: true
}, async ({ args, cht }) => {

  const emoj = [
    "😹", 
    "🗿", 
    "😭", 
    "🤫🧏‍♂️",
    "✋😐🤚",
    "😳"
  ];

  const randomIndex = Math.floor(Math.random() * Exp.groupMembers.length);
  const mentionedId = Exp.groupMembers[randomIndex].id;
  const mentionedJid = `@${mentionedId.split("@")[0]}`;

  await reply(`\nTerbukti sipaling *${args}* adalah:\n${mentionedJid} ${emoj[Math.floor(Math.random() * emoj.length)]}\n`, { mentions: [mentionedId] })

})

ev.on({
  cmd: ['halu', 'nenen', 'curhat', 'genjot', 'ngefans', 'perkosa'],
  listmenu: ['halu', 'nenen', 'curhat', 'genjot', 'ngefans', 'perkosa'],
  tag: "fun",
  args: "*❗ Ketik namanya*",
  energy: 5,
  isGroup: true
}, async ({ cht, args }) => {
   await sleep(1500);
   
if (cht.cmd === "halu") {
   await reply(`\n*${args}* *${args}* *${args}* ❤️ ❤️ ❤️ WANGI WANGI WANGI WANGI HU HA HU HA HU HA, aaaah baunya rambut *${args}* wangi aku mau nyiumin aroma wanginya *${args}* AAAAAAAAH ~ Rambutnya.... aaah rambutnya juga pengen aku elus-elus ~~ AAAAAH *${args}* keluar pertama kali di anime juga manis ❤️ ❤️ ❤️ banget AAAAAAAAH *${args}* AAAAA LUCCUUUUUUUUUUUUUUU............ *${args}* AAAAAAAAAAAAAAAAAAAAGH ❤️ ❤️ ❤️apa ? *${args}* itu gak nyata ? Cuma HALU katamu ? nggak, ngak ngak ngak ngak NGAAAAAAAAK GUA GAK PERCAYA ITU DIA NYATA NGAAAAAAAAAAAAAAAAAK PEDULI BANGSAAAAAT !! GUA GAK PEDULI SAMA KENYATAAN POKOKNYA GAK PEDULI. ❤️ ❤️ ❤️ *${args}* gw ... *${args}* di laptop ngeliatin gw, *${args}* .. kamu percaya sama aku ? aaaaaaaaaaah syukur *${args}* aku gak mau merelakan *${args}* aaaaaah ❤️ ❤️ ❤️ YEAAAAAAAAAAAH GUA MASIH PUNYA *${args}* SENDIRI PUN NGGAK SAMA AAAAAAAAAAAAAAH\n`);

} else if (cht.cmd === "nenen") {
   await reply(`\nNENEN NENEN KEPENGEN NENEN SAMA *${args}*. TETEK GEDE NAN KENCANG MILIK *${args}* MEMBUATKU KEPENGEN NENEN. DIBALUT PAKAIAN KETAT YANG ADUHAI CROOOOTOTOTOTOTOT ANJING SANGE GUA BANGSAT. *${args}*, PLIS DENGERIN BAIK BAIK. TOLONG BUKA BAJU SEBENTAR SAJA PLISSS TOLOOONG BANGET, BIARKAN MULUT KERINGKU BISA MENGECAP NENEN *${args}*. BIARKAN AKU MENGENYOT NENENMU *${args}*. AKU RELA NGASIH SESEMBAHAN APA AJA BERAPAPUN ITU DUIT YANG AKU BAKAR KHUSUS TERKHUSUS BUATMU. TAPI TOLOOOONG BANGET BUKA BAJUMU AKU MAU NENEN. NENEN NENEEEEN NENEN *${args}* WANGIIII\n`);

} else if (cht.cmd === "curhat") {
   await reply(`\nSebenarnya aku sangat mencintai *${args}*, aku punya semua Figurine dan wallpapernya. Aku berdoa setiap malam dan berterima kasih atas segala hal yang telah ia berikan kepadaku. "*${args}* adalah cinta" aku bilang "*${args}* adalah Tujuan Hidupku". Temanku datang ke kamarku dan berkata "HALU LU ANJING !!". Aku tau dia cemburu atas kesetiaanku kepada *${args}*. Lalu kukatakan padanya "BACOT NJING !!". Temanku menampol kepalaku dan menyuruhku untuk tidur. Kepalaku sakit dan aku menangis. Aku rebahan di kasur yang dingin, lalu ada sesuatu yang hangat menyentuhku. Ternyata *${args}* datang ke dalam kamarku, Aku begitu senang bertemu *${args}*. Dia membisikan ke telingaku, "Kamu adalah impianku" Dengan tangannya dia meraih diriku. Aku melebarkan pantatku keatas demi *${args}*. Dia menusukan sesuatu kedalam Anggusku. begitu sakit, tapi kulakukan itu demi *${args}*. Aku ingin memberikan kepuasan kepada *${args}*. Dia meraum bagaikan singa, disaat dia melepaskan cintanya kedalam Anggusku. Temanku masuk kekamarku dan berkata "....... Anjing". *${args}* melihat temanku dan berkata " Semua sudah berakhir" Dengan menggunakan kemampuannya Stellar Restoration *${args}* pergi meninggalkan kamarku. "*${args}* itu cinta" "*${args}* itu kehidupan"\n`);
 
} else if (cht.cmd === "genjot") {
   await reply(`\nBuruan, panggil gue SIMP, ato BAPERAN. ini MURNI PERASAAN GUE. Gue pengen genjot bareng *${args}*. Ini seriusan, suaranya yang imut, mukanya yang cantik, apalagi badannya yang aduhai ningkatin gairah gue buat genjot *${args}*. Setiap lapisan kulitnya pengen gue jilat. Saat gue mau crot, gue bakal moncrot sepenuh hati, bisa di perut, muka, badan, teteknya, sampai lubang burit pun bakal gue crot sampai puncak klimaks. Gue bakal meluk dia abis gue moncrot, lalu nanya gimana kabarnya, ngrasain enggas bareng saat telanjang. Dia bakal bilang kalau genjotan gue mantep dan nyatain perasaannya ke gue, bilang kalo dia cinta ama gue. Gue bakal bilang balik seberapa gue cinta ama dia, dan dia bakal kecup gue di pipi. Terus kita ganti pakaian dan ngabisin waktu nonton film, sambil pelukan ama makan hidangan favorit. Gue mau *${args}* jadi pacar, pasangan, istri, dan idup gue. Gue cinta dia dan ingin dia jadi bagian tubuh gue. Lo kira ini copypasta? Kagak cok. Gue ngetik tiap kata nyatain prasaan gue. Setiap kali elo nanya dia siapa, denger ini baik-baik : DIA ISTRI GUE. Gue sayang *${args}*, dan INI MURNI PIKIRAN DAN PERASAAN GUE\n`);

} else if (cht.cmd === "ngefans") {
   await reply(`\nAku ngefans banget sama *${args}*! Saking ngefans-nya, aku rela beli merch-nya walau isinya cuma stiker. Kalau ada fans club *${args}*, aku ketua pertamanya\n`);

} else {
   await reply(`\nGW BENAR-BENAR PENGEN JILAT KAKI *${args}*,GW PENGEN BANGET MENJILAT SETIAP BAGIAN KAKINYA SAMPAI AIR LIUR GW BERCUCURAN KAYAK AIR KERINGAT LALU NGENTOD DENGAN NYA SETIAP HARI SAMPAI TUBUH KITA MATI RASA, YA TUHAN GW INGIN MEMBUAT ANAK ANAK DENGAN *${args}* SEBANYAK SATU TIM SEPAK BOLA DAN MEMBUAT SATU TIM SEPAK BOLA LAINYA UNTUK MELAWAN ANAK-ANAK TIM SEPAK BOLA PERTAMA GW  YANG GW BUAT SAMA *${args}* GW PENGEN MASUK KE SETIAP LUBANG TUBUHNYA, MAU ITU LUBANG HIDUNG LUBANG MATA MAUPUN LUBANG BOOL, KEMUDIAN GW AKAN MANUSIA YANG TIDAK BISA HIDUP KALO GW GA ENTOD SETIAP HARI\n`);

}
})


ev.on({
  cmd: ['fitnah', 'roasting'],
  listmenu: ['fitnah', 'roasting'],
  tag: "fun",
  energy: 5,
  isMention: "*❗ Tag orangnya*",
  isGroup: true
}, async ({ cht }) => {
   await sleep(1500);
   let target = cht.mention[0];
   let targetId = target.split("@")[0];

if (cht.cmd === "roasting") {
const rost = [
    `kadang gue mikir, kamu tuh kayak sinyal 1 bar di tengah hutan—nggak berguna tapi selalu muncul pas gak dibutuhin.`,
    `lu tuh kayak charger 15 ribuan—bisa dipake, tapi bikin panas dan ngerusak semuanya.`,
    `kalau otak kamu dijual di marketplace, kemungkinan besar masuk kategori "rusak parah, dijual kiloan".`,
    `kamu kayak WiFi tetangga—kelihatan tapi nggak bisa dipake. Ngeselin banget!`,
    `kalau ngomong tuh kayak lagu remix—banyak noise tapi gak jelas maksudnya.`,
    `kamu itu bukan toxic sih, tapi lebih kayak limbah beracun yang seharusnya dikarantina 40 tahun.`,
    `gaya hidupmu tuh kayak skripsi anak semester 9—jalan di tempat, banyak alasan, hasil nol.`,
    `lu tuh kayak CAPTCHA yang gak bisa ditebak, cuma nyusahin orang doang.`,
    `kalau jadi karakter game, kamu tuh pasti NPC yang ngasih misi gagal dari awal.`,
    `jujur aja... tiap kamu buka mulut, IQ ruangan turun 10 poin.`,
    `muka kamu tuh kayak error 404—nggak ketemu solusinya, bikin stres.`,
    `kalau jadi hewan, kamu pasti masuk kategori hewan mitos, soalnya gak ada yang ngerti eksistensimu.`,
    `kamu tuh kayak alarm jam 5 pagi pas libur—gak penting, cuma ganggu tidur orang.`,
    `IQ kamu tuh kayak ping server merah—tinggi banget tapi gak berguna.`,
    `lu tuh kayak file corrupt—dibuka bikin kesel, dihapus sayang kuota.`,
    `kalau ada lomba jadi beban, lu pasti juara bertahan 5 tahun berturut-turut.`,
    `jokes kamu tuh kayak sinetron azab—maksa, basi, tapi tetep aja nongol.`,
    `ngomong sama lu tuh kayak ngisi CAPTCHA terus gagal, muter-muter gak jelas.`,
    `kalau ketawa lu direkam, bisa dipake buat usir tuyul.`,
    `gaya kamu tuh kayak intro YouTuber 2012—lebay, norak, dan pengen skip.`,
    `lu tuh kayak charger rusak—bisa nyambung tapi nyetrum perasaan orang.`,
    `setiap kamu muncul, vibes-nya kayak error di Windows—tiba-tiba, bikin panik, dan nyusahin.`,
    `kamu itu kayak sandi WiFi yang udah nggak aktif—masih diingat, tapi udah gak guna.`,
    `kamu tuh kayak grup WA keluarga—rame, tapi gak ada faedahnya.`,
    `kalau jadi app, kamu pasti butuh update tiap hari tapi tetep nge-lag.`,
    `tampangmu kayak file zip, kecil tapi isinya berat semua.`,
    `vibes kamu kayak baterai 1%—mau dimanfaatin aja orang males.`,
    `kalau lu jadi sinetron, pasti judulnya *“Anak Durhaka Gagal Update Otak.”*`,
    `lu tuh kayak file download-an gagal—udah nunggu lama, eh error juga.`,
    `otak lu kayak server gratis—down terus tiap dibutuhin.`,
    `kalo jadi emoji, lu tuh pasti "buffering".`,
    `IQ lu kayak koneksi WiFi publik—semua bisa pake, tapi nggak bisa diandalkan.`,
    `tiap kali lu ngomong, grammar dunia ikut menangis.`,
    `kalo jadi film, lu dapet rating 1 bintang dari netizen dan makhluk halus.`,
    `jokes kamu tuh kayak status Facebook 2010—garing, jadul, dan bikin malu.`
];

   const Bar = rost[Math.floor(Math.random() * rost.length)];
   
   await reply(
      `\n@${targetId}, ${Bar}\n`, {
         mentions: [
            target
         ]
      }
   );
   
   
} else {
const fit = [
  "Katanya suka banget sama privacy, tapi setiap kali ada janda lewat, matanya langsung ikutan ikut mandi.",
  "Bilangnya nggak suka ganggu orang, tapi kalau ada janda lagi mandi, dia pasti jadi pengamat rahasia.",
  "Ngaku jago ngatur waktu, tapi tiap malam cuma ngintipin janda lewat jendela sambil bawa popcorn.",
  "Bilangnya nggak pernah iseng, tapi kalau ada janda mandi, dia jadi detektif dadakan.",
  "Sering bilang 'aku nggak suka cari masalah', tapi kalau ada janda mandi di sebelah, langsung jadi masalah besar.",
  "Ngaku nggak suka ngurusin orang, tapi kalau janda lagi mandi, dia jadi pengamat setia di balik tirai.",
  "Bilangnya pura-pura sibuk, padahal selalu nyuri pandang ke arah janda yang lagi mandi.",
  "Sering bilang 'aku nggak gitu', tapi kalau ada janda mandi, dia malah jadi fotografer rahasia.",
  "Katanya nggak suka ikut campur, tapi kalau ada janda mandi, dia siap jadi komentator.",
  "Bilangnya nggak tertarik sama yang aneh-aneh, tapi kalau janda lagi mandi, dia malah jadi pasukan mata-mata.",
  "Ngaku gak pernah ganggu, tapi kalau ada janda mandi, dia kayak jadi fotografer tanpa izin.",
  "Sering bilang ‘aku nggak peduli’, tapi kalau ada janda mandi, langsung jadi pengamat cuaca dadakan.",
  "Bilangnya selalu menghargai privasi, tapi kalau ada janda di depan, dia langsung jadi detektif kebetulan.",
  "Katanya nggak suka drama, tapi kalau ada janda mandi, dia jadi pemeran utama dalam drama 'terkuak'!",
  "Ngaku cinta damai, tapi selalu bikin chaos setiap kali ada janda mandi di sebelah rumah.",
  "Sering bilang 'aku sibuk', tapi selalu punya waktu buat ngintipin janda lagi mandi.",
  "Katanya pinter, tapi kalau ulangan, masih ngandelin contekan temen sebelah.",
  "Bilangnya nggak nyontek, tapi pas liat ujian, tangannya udah kayak tentara ngatur formasi.",
  "Sering bilang ‘aku nggak suka ribut’, tapi kalau pelajaran, suaranya udah kayak di pasar.",
  "Ngaku bisa ngerjain soal, tapi buka HP pas ujian, cari jawaban di Google.",
  "Bilangnya nggak ngerti, tapi udah jago banget nyontek dari temen yang duduk sebelah.",
  "Katanya fokus banget, tapi kalau guru ngomong, dia malah sibuk chat-an sama yang lain.",
  "Ngaku nggak nyontek, tapi pas ujian bawa 3 pulpen biar bisa markirin jawaban temen.",
  "Sering bilang ‘santai aja’, tapi pas denger tugas, udah kayak anak hilang akal.",
  "Bilangnya nggak tidur di kelas, tapi kayaknya bisa ngalahin bayi dalam hal tidur sambil duduk.",
  "Katanya nggak ganggu orang, tapi pas ujian, dia yang paling ribut ketawa ngakak nggak jelas.",
  "Ngaku nggak pernah curang, tapi jawabannya kayak jiplakan langsung dari buku temen.",
  "Bilangnya ‘aku serius belajar’, tapi lebih sering jadi pengamat tidur pas teman lain lagi fokus.",
  "Sering bilang ‘nggak bisa diganggu’, tapi begitu ada soal, langsung cari-cari bantuan temen.",
  "Bilangnya nggak nyontek, tapi punya jawaban kayak buku pelajaran gitu aja.",
  "Ngaku pengen jadi ilmuwan, tapi soal ulangan malah jawabnya ngasal aja.",
  "Bilangnya nggak suka ramai, tapi kalau kelas lagi ujian, dia yang bikin heboh duluan.",
  "Sering bilang ‘aku nggak bisa ngerjain’, tapi kalau ditanya, jawabannya udah kayak jawabanku waktu jaman dulu.",
  "Katanya belajar terus, tapi lebih sering tidur pas pelajaran, malah bisa jadi raja tidur di kelas.",
  "Ngaku nggak pelit, tapi kalau tugas kelompok, pasti ada aja alasan nggak mau bantu."
];

   const Bar2 = fit[Math.floor(Math.random() * fit.length)];
   
   await reply(
      `\n@${targetId}, ${Bar2}\n`, {
         mentions: [
            target
         ]
      }
   );
    
    
}
})

ev.on({ 
   cmd: ['tagboom', 'tagme', 'tag'],
   listmenu: ['tagboom', 'tagme', 'tag'],
   tag: "fun",
}, async ({ cht, args }) => {
  
  if (cht.cmd === "tag") {
    const target = cht.mention[0];
     if (!target) { 
        return reply("*❗ Ketik nomor nya*")
     }
    
     await Exp.sendMessage(
       id, 
       {
         delete: cht.key
       }
     )
    
     await Exp.sensMessage(
       id, 
       {
         text: `Woi bujang @${target.split("@")[0]}`, 
         contextInfo: {
            mentionedJid: [
              target
            ]
         }
       }
     );
  }
  
  if (cht.cmd === "tagboom") {
      const target = cht.mention[0];
      if (!args.includes('|')) {
        return reply('❗ Format salah!\nContoh: .tagboom @user|5')
      }

      const [, jumlahRaw] = args.split('|')
      const jumlah = Math.min(Number(jumlahRaw), 10)

     if (!jumlah || isNaN(jumlah)) {
       return reply('❗ Jumlah boom harus berupa angka.\nContoh: .tagboom @user|5')
     }
     
     await Exp.sendMessage(cht.id, { delete: cht.key})
     
     for (
        let i = 0; i < jumlah; i++
     ) 
     {
        await Exp.sendMessage(
           id,
           {
             text: `${i + 1} @${target.split('@')[0]}`,
              contextInfo: {
                 mentionedJid: [
                    target
                 ]
              }
           }
        );
       await sleep(1000)
     }
     
  }
  
  if (cht.cmd === "tagme") {
    const senderId = cht.sender;
    
    reply(
      `@${senderId.split("@")[0]}`, {
         mentions: [
           senderId
         ]
      }
    );
    
  }

})

ev.on({
  cmd: ['sulap'],
  listmenu: ['sulap'],
  tag: "fun",
  isAdmin: true,
  isBotAdmin: true,
  isGroup: true,
  isMention: "*🎩 Tag orangnya yang ingin di sulap*"
}, async ({ cht }) => {
  const botNumber = "6282396640727@s.whatsapp.net"
  if (cht.mention === botNumber) {
    return reply(`😅 Gak bisa nyulap diri sendiri dong...`);
  }

  await reply(`🧙‍♂️ Persiapkan diri kalian... dan perhatikan secara seksama`);
  await sleep(1500);

  await reply(`✨ Satu...`);
  const _key = keys[sender];

  await sleep(1000);
  await cht.edit(`✨ Dua...`, _key);
  await sleep(1000);
  await cht.edit(`✨ TIGAAA!!`, _key);
  await sleep(1200);
  await cht.edit(`💥 *Poof!* anggota ini menghilang dari grup 💥`, _key);
  await sleep(1500);

  try {
    await Exp.groupParticipantsUpdate(cht.id, cht.mention, "remove");
    
    await reply(`*🪄 Berhasil mengeluarkan @${cht.mention[0].split('@')[0]} dari grup*`, { mentions: [cht.mention] });
  } catch (e) {
    console.error(e);
    return reply(`😣 Gagal mengeluarkan @${cht.mention[0].split('@')[0]} mungkin dia owner grup\n\nAtu munkin *Error*:\n${e.message}\n\n> Segera lapor ke owner`, { mentions: [cht.mention] });
  }
});

  ev.on(
    {
      cmd: ['ultah', 'ulangtahun'],
      listmenu: ['ultah'],
      tag: "fun"
    },
    async () => {
      const type = ['set', 'del', 'cek'];

      let user = Data.users[sender.split("@")[0]];
      if (!user.ultah) user.ultah = {};

      const tip = cht.q.trim().split(' ');
      const action = tip[0].toLowerCase();

      if (!type.includes(action)) {
        return reply(
          `❗ Format salah\n\nContoh:\n.${cht.cmd} set 14-08-2005\n.${cht.cmd} del\n.${cht.cmd} cek`
        );
      }

      if (action === 'set') {
        const dateStr = tip[1];
        if (!dateStr) return reply(
          `❗ Sertakan tanggalnya! Contoh: .${cht.cmd} set 14-08-2005`
        );

        const regex = /^(\d{1,2})-(\d{1,2})(?:-(\d{4}))?$/;
        const match = dateStr.match(regex);
        if (!match) return reply(
          `❗ Format tanggal salah! Gunakan DAY-MONTH atau DAY-MONTH-YEAR`
        );

        const day = parseInt(match[1]);
        const month = parseInt(match[2]);
        const year = match[3] ? parseInt(match[3]) : null;

        if (day < 1 || day > 31 || month < 1 || month > 12) {
          return reply(`❗ Tanggal tidak valid!`);
        }

        user.ultah = {
          tanggal: `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}`,
          tahun: year || null,
          lastNotifDate: null
        };

        let teks = `乂  *S E T  U L T A H*\n\n`;
        teks += `✅ Berhasil mengatur tanggal ulang tahun...\n`;
        teks += `📅 Disetiap ${user.ultah.tanggal} aku akan mengucapkan selamat ulang tahun kepadamu 🎈🎉`;
        return Exp.sendMessage(
          id,
          {
            text: teks,
            contextInfo
          }, { quoted: cht }
        )
      }

      if (action === 'del') {
        if (!user.ultah.tanggal) return reply(
          `❌ Kamu belum set ulang tahun!`
        );

        delete user.ultah;
        user.ultah = {};
        return reply(
          `✅ *Berhasil*... Tanggal ulang tahun kamu sudah dihapus`
        );
      }

      if (action === 'cek') {
        const mention = cht.mention[0]
        
        if (!mention) {
          if (!user.ultah.tanggal) return reply(
            `❌ Kamu belum set ulang tahun!`
          );
          
          const today = new Date();
          const [day, month] = user.ultah.tanggal.split('-').map(n => parseInt(n));
          const nextBirthday = new Date(today.getFullYear(), month - 1, day);
  
          if (nextBirthday < today) {
            nextBirthday.setFullYear(today.getFullYear() + 1);
          }
  
          const diffTime = nextBirthday - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          let teks = `乂  *C E K  U L T A H*\n\n`;
          teks += `👶🏻 lahir pada *${user.ultah.tanggal}${user.ultah.tahun ? `-${user.ultah.tahun}` : ''}*\n`;
          teks += `🎂 Ulang tahun tersisa *${diffDays}* hari lagi 🎉`;
  
          return Exp.sendMessage(
            id,
            {
              text: teks,
              contextInfo: {
                ...contextInfo,
                mentionedJid: [sender]
              }
            }, { quoted: cht }
          );
        }
        
        const mentions = mention.split("@")[0]
        let target = Data.users[mentions];
        if (!target || !target.ultah || !target.ultah.tanggal) {
          return reply(`❌ Dia belum memberitahu ku tanggal ulang tahunnya...`);
        }

        let teks2 = `乂  *C E K  U L T A H*\n\n`;
        teks2 += `Tanggal ulang tahun @${mention.split("@")[0]} yaitu:\n*${target.ultah.tanggal}${target.ultah.tahun ? `-${target.ultah.tahun}` : ''}*`;

        return Exp.sendMessage(
          id,
          {
            text: teks2,
            contextInfo: {
              ...contextInfo,
              mentionedJid: [mention]
            }
          }, { quoted: cht }
        );
      }
    }
  );
  
ev.on({
  cmd: ['soulmatch'],
  listmenu: ['soulmatch'],
  tag: "fun",
  args: "*❗ Masukkan dua nama*",
  energy: 5
}, async ({cht, args}) => {
    if (!args || !args.includes('|')) {
        return reply(`
╭═══❯ *BELAHAN JIWA* ❮═══
│
│ ❌ Masukkan 2 nama untuk dianalisis!
│ 
│ 📝 *Format:*
│ .${cht.cmd} nama1|nama2
│
│ 📌 *Contoh:*
│ .${cht.cmd} Elaina|Barr
│
╰════════════════════
`);
    }

    try {
        const [nama1, nama2] = args.split("|").map(name => name.trim());

        if (!nama2) {
            return reply(`❌ Format salah! Gunakan tanda '|' untuk memisahkan nama\nContoh: .${cht.cmd} Elaian|Barri`);
        }

        const generateSoulData = (name, previousElement) => {
            const numerologyValue = name.toLowerCase().split('')
                .map(char => char.charCodeAt(0) - 96)
                .reduce((a, b) => a + b, 0) % 9 + 1;

            const elements = ['Api 🔥', 'Air 💧', 'Tanah 🌍', 'Angin 🌪️', 'Petir ⚡', 'Es ❄️', 'Cahaya ✨', 'Bayangan 🌑'];


            let element;
            do {
                element = elements[Math.floor(Math.random() * elements.length)];
            } while (element === previousElement); 

            const zodiacSigns = ['♈ Aries', '♉ Taurus', '♊ Gemini', '♋ Cancer', '♌ Leo', '♍ Virgo', 
                                 '♎ Libra', '♏ Scorpio', '♐ Sagittarius', '♑ Capricorn', '♒ Aquarius', '♓ Pisces'];
            const zodiac = zodiacSigns[Math.floor(Math.random() * zodiacSigns.length)]; 

            return { numerologyValue, element, zodiac };
        };

        let previousElement = null; 
        const soul1 = generateSoulData(nama1, previousElement);
        previousElement = soul1.element; 

        const soul2 = generateSoulData(nama2, previousElement);

        const calculateCompatibility = () => Math.floor(Math.random() * 100) + 1;

        const compatibility = calculateCompatibility();

    
        const soulTypes = [
            "Pemimpin Yang Berani", "Penyeimbang Bijaksana", "Kreator Ekspresif", "Pembangun Solid", 
            "Petualang Bebas", "Pelindung Setia", "Pemikir Mistis", "Penakluk Kuat", "Humanitarian Murni"
        ];

        const getRandomSoulType = () => soulTypes[Math.floor(Math.random() * soulTypes.length)];

        const getMatchDescription = (score) => {
            if (score >= 90) return "💫 Takdir Sejati";
            if (score >= 80) return "✨ Harmoni Sempurna";
            if (score >= 70) return "🌟 Koneksi Kuat";
            if (score >= 60) return "⭐ Potensi Bagus";
            if (score >= 50) return "🌙 Perlu Perjuangan";
            return "🌑 Tantangan Berat";
        };

        const generateSoulReading = (compatibility) => {
            const readings = [
                compatibility >= 90 ? [
                    "│ ✨ Jiwa kalian memiliki koneksi yang sangat",
                    "│    istimewa dan langka",
                    "│ 🌟 Takdir telah merencanakan pertemuan ini",
                    "│ 💫 Resonansi jiwa kalian menciptakan",
                    "│    harmoni sempurna"
                ] : compatibility >= 80 ? [
                    "│ 🌟 Ada chemistry yang sangat kuat di antara",
                    "│    kalian",
                    "│ ✨ Jiwa kalian saling melengkapi dengan",
                    "│    cara yang unik",
                    "│ 💫 Pertemuan kalian membawa energi positif"
                ] : compatibility >= 70 ? [
                    "│ 🌙 Potensi hubungan yang dalam dan berarti",
                    "│ ✨ Perbedaan kalian justru menciptakan",
                    "│    harmoni",
                    "│ 💫 Ada pelajaran berharga dalam pertemuan",
                    "│    ini"
                ] : compatibility >= 60 ? [
                    "│ 🌟 Butuh waktu untuk saling memahami",
                    "│ 💫 Setiap tantangan akan memperkuat ikatan",
                    "│ ✨ Fokus pada hal positif dari perbedaan",
                    "│    kalian"
                ] : compatibility >= 50 ? [
                    "│ 🌙 Perlu usaha ekstra untuk harmonisasi",
                    "│ ✨ Tantangan akan menguji kesungguhan",
                    "│ 💫 Komunikasi jadi kunci utama hubungan"
                ] : [
                    "│ 🌑 Perbedaan yang signifikan dalam energi",
                    "│    jiwa",
                    "│ ✨ Butuh banyak adaptasi dan pengertian",
                    "│ 💫 Setiap hubungan punya maksud tersendiri"
                ]
            ];

            return readings[0].join('\n');
        };

        const caption = `
╭═══❯ *BELAHAN JIWA* ❮═══
│
│ 👤 *${nama1}*
│ ├ 🔮 Soul Type: ${getRandomSoulType()}
│ ├ 🌟 Element: ${soul1.element}
│ └ 🎯 Zodiac: ${soul1.zodiac}
│
│ 👤 *${nama2}*
│ ├ 🔮 Soul Type: ${getRandomSoulType()}
│ ├ 🌟 Element: ${soul2.element}
│ └ 🎯 Zodiac: ${soul2.zodiac}
│
│ 💫 *COMPATIBILITY*
│ ├ 📊 Score: ${compatibility}%
│ └ 🎭 Status: ${getMatchDescription(compatibility)}
│
│ 🔮 *Soul Reading*
${generateSoulReading(compatibility)}
│
╰════════════════════

📅 *Analysis Date:* ${moment}`;

        return reply(caption);

    } catch (error) {
        console.error('Error in soulmatch command:', error);
        return reply(`
╭══════════════════════
│ ❌ *Terjadi Kesalahan*
│ Mohon coba beberapa saat lagi
╰═════════════════════
`);
    }
});

}