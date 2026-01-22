const fs = "fs".import();

export default async function on({ cht, Exp, store, ev, is }) {
const { sender, id, reply, edit } = cht
const { func } = Exp

  function time() {
    return new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
  }

  let contextInfo = {
    externalAdReply: {
      title: `❏ 𝓐𝓵𝔂𝓪 [ アリヤ ]`,
      body: `Time ${time()}`,
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
  
  ev.on(
    {
      cmd: [
        'artinama', 
        'artimimpi'
      ],
      listmenu: [
        'artinama',
        'artimimpi'
      ],
      tag: "primbon",
      args: "*❗ Berikan input yang sesuai*\n\nContoh:\n.artinama Budi\n.artimimpi gigi copot",
      energy: 25
    },
    async ({  args }) => {
   
      let isNama = cht.cmd === "artinama"
      let isMimpi = cht.cmd === "artimimpi"

      let url = isNama
        ? `https://api.botcahx.eu.org/api/primbon/artinama?nama=${encodeURIComponent(args)}&apikey=${cfg.bar}`
        : `https://api.botcahx.eu.org/api/primbon/artimimpi?mimpi=${encodeURIComponent(args)}&apikey=${cfg.bar}`

      fetch(url)
      .then(res => res.json())
      .then(
        data => {
          let hasil = data.result.message
          let text

          if (isNama) {
            text =
              "⊹₊⋆ Arti Nama ⋆₊⊹\n\n" +
              `📛 Nama: *${args}*\n` +
              `✨ Arti: ${hasil.arti}\n`
          } else {
            text =
              "⊹₊⋆ Arti Mimpi ⋆₊⊹\n\n" +
              `💭 Mimpi: ${hasil.mimpi}\n\n` +
              `✨ Arti: ${hasil.arti}`
          }

          Exp.sendMessage(
            id,
            { 
              text, 
              contextInfo
            },
            { quoted: cht }
          )
        }
      )
      .catch(
        e => {
          reply(
            `Gagal mengambil data\n\n*Error*:\n${e}`
          )
        }
      )
    }
  )

  ev.on(
    {
      cmd: ['zodiac'],
      listmenu: ['zodiac'],
      tag: "primbon",
      energy: 5,
      args: "*❗ Berikan bulan dan tanggal lahirnya*\n\nContoh:\n.zodiac mei 31"
    },
    async ({ args }) => {
    
      let [bulan, tanggal] = args.split(' ')
        bulan = bulan?.toLowerCase()
        tanggal = parseInt(tanggal)

      function zodiac(bulan, tanggal) {
        let data = [
          {
            start: [1, 1], 
            end: [1, 19], 
            zodiak: "Capricorn ♑",
            arti: "Capricorn dilambangkan dengan kambing gunung yang kuat mendaki ke puncak. Melambangkan ambisi, kerja keras, dan ketekunan.",
            positive: "Ambisius, disiplin, pekerja keras, bertanggung jawab, sabar.",
            negative: "Keras kepala, terlalu serius, kaku, kadang pesimis, workaholic.",
            char: [
              "Praktis ➟ fokus pada realita dan tujuan nyata",
              "Ambisius ➟ punya target tinggi dan mau mencapainya",
              "Mandiri ➟ lebih suka mengandalkan diri sendiri",
              "Teguh ➟ tidak mudah goyah dengan rintangan",
              "Dewasa ➟ berpikir matang dan penuh perhitungan"
            ]
          },
          {
            start: [1, 20], 
            end: [2, 18], 
            zodiak: "Aquarius ♒", 
            arti: "Aquarius dilambangkan dengan pembawa air. Simbol ini berarti visi, inovasi, dan pemikiran ke depan.",
            positive: "Kreatif, berpikiran luas, humanis, independen, visioner.",
            negative: "Eksentrik, susah ditebak, keras kepala dengan ide sendiri, kadang emosinya dingin.",
            char: [
              "Inovatif ➟ selalu punya ide baru",
              "Sosial ➟ peduli pada orang lain",
              "Unik ➟ beda dari yang lain",
              "Logis ➟ berpikir rasional",
              "Bebas ➟ tidak suka terikat aturan"
            ]
          },
          {
            start: [2, 19],
            end: [3, 20],
            zodiak: "Pisces ♓", 
            arti: "Pisces dilambangkan dengan dua ikan berenang berlawanan arah. Melambangkan intuisi, emosi, dan spiritualitas.",
            positive: "Peka, penuh empati, imajinatif, romantis, penyayang.",
            negative: "Mudah terpengaruh, kadang lari dari kenyataan, moody, gampang baper.",
            char: [
              "Intuitif ➟ sering mengandalkan perasaan",
              "Kreatif ➟ imajinasi yang kuat",
              "Empatik ➟ mudah memahami orang lain",
              "Lembut ➟ penuh kasih sayang",
              "Misterius ➟ kadang sulit ditebak"
            ]
          },
          {
            start: [3, 21],
            end: [4, 19],
            zodiak: "Aries ♈", 
            arti: "Aries dilambangkan dengan domba jantan. Melambangkan energi, keberanian, dan jiwa pemimpin.",
            positive: "Berani, percaya diri, energik, jujur, penuh semangat.",
            negative: "Temperamen tinggi, impulsif, egois, cepat bosan.",
            char: [
              "Pemberani ➟ berani ambil resiko",
              "Energik ➟ selalu penuh semangat",
              "Pemimpin ➟ suka memimpin",
              "Langsung ➟ berbicara apa adanya",
              "Cepat ➟ suka bergerak cepat tanpa banyak mikir"
            ]
          },
          {  
            start: [4, 20], 
            end: [5, 20], 
            zodiak: "Taurus ♉",
            arti: "Taurus dilambangkan dengan banteng. Melambangkan kekuatan, kestabilan, dan keteguhan.",
            positive: "Sabar, setia, praktis, stabil, pekerja keras.",
            negative: "Keras kepala, materialistis, posesif, malas.",
            char: [
              "Stabil ➟ cinta kenyamanan dan keamanan",
              "Teguh ➟ sulit diubah pendiriannya",
              "Sabar ➟ bisa menunggu dengan tenang",
              "Romantis ➟ menghargai keindahan dan cinta",
              "Praktis ➟ realistis dalam hidup"
            ]
          },
          {
            start: [5, 21], 
            end: [6, 20], 
            zodiak: "Gemini ♊",
            arti: "Gemini dilambangkan dengan si kembar (Castor & Pollux). Simbol ini nunjukin dualitas dan sifat ganda mereka. Artinya, orang Gemini punya banyak sisi dalam kepribadiannya, fleksibel, dan sering bisa menyesuaikan diri dengan berbagai situasi",
            positive: "Cerdas dan cepat belajar. Fleksibel, gampang nyatu sama orang baru. Kreatif dan penuh ide. Multitasking, bisa ngerjain banyak hal sekaligus. Menarik & humoris, bikin orang betah bareng dia",
            negative: "Gampang bosen, susah konsisten dalam satu hal. Kadang plin-plan, susah ambil keputusan karena terlalu banyak pertimbangan. Suka kelihatan dangkal karena lompat-lompat topik. Overthinking, sering mikirin terlalu banyak hal sekaligus. Bisa keliatan tidak serius / nggak stabil",
            char: [
              "Komunikatif ➟ suka ngobrol, pintar ngomong, bisa bikin suasana cair",
              "Penasaran ➟ gampang tertarik sama hal baru, haus ilmu",
              "Sosial ➟ gampang dapet temen, suka interaksi",
              "Adaptif ➟ bisa menyesuaikan diri di lingkungan apa aja",
              "Enerjik ➟ jarang bisa diem, selalu ada ide baru"
            ]
          },
          {
            start: [6, 21], 
            end: [7, 22], 
            zodiak: "Cancer ♋", 
            arti: "Cancer dilambangkan dengan kepiting. Melambangkan emosi, perasaan, dan rumah tangga.",
            positive: "Penyayang, setia, protektif, intuitif, penuh perhatian.",
            negative: "Moody, terlalu sensitif, posesif, sulit melepas masa lalu.",
            char: [
              "Emosional ➟ sangat perasa",
              "Setia ➟ loyal pada keluarga & teman",
              "Protektif ➟ melindungi orang terdekat",
              "Intuitif ➟ punya firasat kuat",
              "Rumahan ➟ suka kenyamanan di rumah"
            ]
          },
          { 
            start: [7, 23],
            end: [8, 22], 
            zodiak: "Leo ♌", 
            arti: "Leo dilambangkan dengan singa. Melambangkan kekuatan, kepemimpinan, dan kebanggaan.",
            positive: "Karismatik, percaya diri, dermawan, kreatif, penuh semangat.",
            negative: "Sombong, haus pujian, dominan, keras kepala.",
            char: [
              "Pemimpin ➟ lahir dengan kharisma",
              "Percaya diri ➟ yakin dengan dirinya",
              "Dermawan ➟ suka berbagi",
              "Ekspresif ➟ suka tampil menonjol",
              "Bersemangat ➟ selalu antusias"
            ]
          },
          {
            start: [8, 23],
            end: [9, 22],
            zodiak: "Virgo ♍", 
            arti: "Virgo dilambangkan dengan gadis perawan. Melambangkan kemurnian, detail, dan analisis.",
            positive: "Teliti, perfeksionis, rajin, praktis, setia.",
            negative: "Kritis berlebihan, cerewet, kaku, sulit puas.",
            char: [
              "Perfeksionis ➟ suka detail",
              "Analitis ➟ berpikir logis dan runtut",
              "Pekerja keras ➟ rajin dan teratur",
              "Rendah hati ➟ tidak suka menonjol",
              "Praktis ➟ realistis dalam tindakan"
            ]
          },
          {
            start: [9, 23],
            end: [10, 22], 
            zodiak: "Libra ♎", 
            arti: "Libra dilambangkan dengan timbangan. Melambangkan keseimbangan, keadilan, dan harmoni.",
            positive: "Diplomatis, adil, romantis, artistik, sosial.",
            negative: "Plin-plan, terlalu bergantung, menghindari konflik, mudah terpengaruh.",
            char: [
              "Harmonis ➟ cinta kedamaian",
              "Sosial ➟ suka berteman",
              "Romantis ➟ penuh cinta",
              "Diplomatis ➟ pandai menengahi",
              "Indah ➟ menyukai keindahan & seni"
            ]
          },
          { 
            start: [10, 23],
            end: [11, 21], 
            zodiak: "Scorpio ♏",
            arti: "Scorpio dilambangkan dengan kalajengking. Melambangkan misteri, kekuatan batin, dan transformasi.",
            positive: "Berani, penuh gairah, setia, fokus, punya intuisi tajam.",
            negative: "Cemburuan, obsesif, pendendam, manipulatif.",
            char: [
              "Misterius ➟ sulit ditebak",
              "Penuh gairah ➟ intens dalam segala hal",
              "Setia ➟ sangat loyal",
              "Tegas ➟ tidak suka basa-basi",
              "Kuat ➟ punya ketahanan mental"
            ]
          },
          {
            start: [11, 22],
            end: [12, 21],
            zodiak: "Sagitarius ♐", 
            arti: "Sagitarius dilambangkan dengan pemanah. Melambangkan kebebasan, petualangan, dan filosofi.",
            positive: "Optimis, jujur, penuh petualangan, terbuka, penuh energi.",
            negative: "Tidak sabaran, blak-blakan, sulit komitmen, ceroboh.",
            char: [
              "Petualang ➟ suka menjelajah",
              "Optimis ➟ selalu melihat sisi baik",
              "Jujur ➟ bicara apa adanya",
              "Filosofis ➟ suka merenung soal hidup",
              "Bebas ➟ tidak suka terikat"
            ]
          },
          { 
            start: [12, 22], 
            end: [1, 19],
            zodiak: "Capricorn ♑", 
            arti: "Capricorn dilambangkan dengan kambing gunung yang kuat mendaki ke puncak. Melambangkan ambisi, kerja keras, dan ketekunan.",
            positive: "Ambisius, disiplin, pekerja keras, bertanggung jawab, sabar.",
            negative: "Keras kepala, terlalu serius, kaku, kadang pesimis, workaholic.",
            char: [
              "Praktis ➟ fokus pada realita dan tujuan nyata",
              "Ambisius ➟ punya target tinggi dan mau mencapainya",
              "Mandiri ➟ lebih suka mengandalkan diri sendiri",
              "Teguh ➟ tidak mudah goyah dengan rintangan",
              "Dewasa ➟ berpikir matang dan penuh perhitungan"
            ]
          }
        ]

        let bulanMap = {
          januari: 1, februari: 2, maret: 3, april: 4,
          mei: 5, juni: 6, juli: 7, agustus: 8,
          september: 9, oktober: 10, november: 11, desember: 12,
        }

        let b = bulanMap[bulan]
        if (!b) return null

        let isInRange = (start, end, b, t) => {
          let curr = b * 100 + t
          let s = start[0] * 100 + start[1]
          let e = end[0] * 100 + end[1]
          if (s <= e) return curr >= s && curr <= e
          return curr >= s || curr <= e
        }

        return data.find(d => isInRange(d.start, d.end, b, tanggal))
      }

      let result = zodiac(bulan, tanggal)

      if (!result) return reply("‼️Bulan atau tanggal yang diberikan tidak valid")

      let text = `⊹₊⋆ Cek Zodiac ⋆₊⊹\n\n` +
        `⟡ Bulan : ${bulan}\n` +
        `⟡ Tanggal : ${tanggal}\n` +
        `⟡ Zodiac : ${result.zodiak}\n\n` +
        "`Artinya`:\n" +
          `${result.arti}\n\n` +
        "`Sifatnya`:\n" +
          `${result.char.map((v, i) => `${i + 1}. ${v}`).join("\n")}\n\n` +
        "`Kelebihan`:\n" +
          `${result.positive}\n\n` +
        "`Kekurangan`:\n" +
          `${result.negative}`

      await Exp.sendMessage(
        id,
        {
          text,
          contextInfo
        },
        { quoted: cht }
      )
    }
  )
}