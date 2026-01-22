const fs = "fs".import()

export default async function on({ cht, Exp, store, ev, is }) {
  const { id, sender, reply } = cht
  const { func } = Exp

  function getBarzz918() {
    return new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
  }

  let contextInfo = {
    externalAdReply: {
      title: `❏ 𝓐𝓵𝔂𝓪 [ アリヤ ]`,
      body: `Time ${getBarzz918()}`,
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
  
  let bijak = [
    "Keyakinan merupakan suatu pengetahuan di dalam hati, jauh tak terjangkau oleh bukti.",
    "Rasa bahagia dan tak bahagia bukan berasal dari apa yang kamu miliki, bukan pula berasal dari siapa diri kamu, atau apa yang kamu kerjakan. Bahagia dan tak bahagia berasal dari pikiran kamu.",
    "Sakit dalam perjuangan itu hanya sementara. Bisa jadi kamu rasakan dalam semenit, sejam, sehari, atau setahun. Namun jika menyerah, rasa sakit itu akan terasa selamanya.",
    "Hanya seseorang yang takut yang bisa bertindak berani. Tanpa rasa takut itu tidak ada apapun yang bisa disebut berani.",
    "Jadilah diri kamu sendiri. Siapa lagi yang bisa melakukannya lebih baik ketimbang diri kamu sendiri?",
    "Kesempatan kamu untuk sukses di setiap kondisi selalu dapat diukur oleh seberapa besar kepercayaan kamu pada diri sendiri.",
    "Kebanggaan kita yang terbesar adalah bukan tidak pernah gagal, tetapi bangkit kembali setiap kali kita jatuh.",
    "Suatu pekerjaan yang paling tak kunjung bisa diselesaikan adalah pekerjaan yang tak kunjung pernah dimulai.",
    "Pikiran kamu bagaikan api yang perlu dinyalakan, bukan bejana yang menanti untuk diisi.",
    "Kejujuran adalah batu penjuru dari segala kesuksesan. Pengakuan adalah motivasi terkuat. Bahkan kritik dapat membangun rasa percaya diri saat disisipkan di antara pujian.",
    "Segala sesuatu memiliki kesudahan, yang sudah berakhir biarlah berlalu dan yakinlah semua akan baik-baik saja.",
    "Setiap detik sangatlah berharga karena waktu mengetahui banyak hal, termasuk rahasia hati.",
    "Jika kamu tak menemukan buku yang kamu cari di rak, maka tulislah sendiri.",
    "Jika hatimu banyak merasakan sakit, maka belajarlah dari rasa sakit itu untuk tidak memberikan rasa sakit pada orang lain.",
    "Hidup tak selamanya tentang pacar.",
    "Rumah bukan hanya sebuah tempat, tetapi itu adalah perasaan.",
    "Pilih mana: Orang yang memimpikan kesuksesan atau orang yang membuatnya menjadi kenyataan?",
    "Kamu mungkin tidak bisa menyiram bunga yang sudah layu dan berharap ia akan mekar kembali, tapi kamu bisa menanam bunga yang baru dengan harapan yang lebih baik dari sebelumnya.",
    "Bukan bahagia yang menjadikan kita bersyukur, tetapi dengan bersyukurlah yang akan menjadikan hidup kita bahagia.",
    "Aku memang diam. Tapi aku tidak buta.",
  ]

  let galau = [
    "Gak salah kalo aku lebih berharap sama orang yang lebih pasti tanpa khianati janji-janji",
    "Kalau aku memang tidak sayang sama kamu ngapain aku mikirin kamu. Tapi semuanya kamu yang ngganggap aku gak sayang sama kamu",
    "Jangan iri dan sedih jika kamu tidak memiliki kemampuan seperti yang orang miliki. Yakinlah orang lain juga tidak memiliki kemampuan sepertimu",
    "Hanya kamu yang bisa membuat langkahku terhenti, sambil berkata dalam hati mana bisa aku meninggalkanmu",
    "Tetap tersenyum walaluku masih dibuat menunggu dan rindu olehmu, tapi itu demi kamu",
    "Tak semudah itu melupakanmu",
    "Secuek-cueknya kamu ke aku, aku tetap sayang sama kamu karena kamu telah menerima aku apa adanya",
    "Aku sangat bahagia jika kamu bahagia didekatku, bukan didekatnya",
    "Jadilah diri sendiri, jangan mengikuti orang lain, tetapi tidak sanggup untuk menjalaninya",
    "Cobalah terdiam sejenak untuk memikirkan bagaimana caranya agar kita dapat menyelesaikan masalah ini bersama-sama",
    "Bisakah kita tidak bermusuhan setelah berpisah, aku mau kita seperti dulu sebelum kita jadian yang seru-seruan bareng, bercanda dan yang lainnya",
    "Aku ingin kamu bisa langgeng sama aku dan yang aku harapkan kamu bisa jadi jodohku",
    "Cinta tak bisa dijelaskan dengan kata-kata saja, karena cinta hanya mampu dirasakan oleh hati",
    "Masalah terbesar dalam diri seseorang adalah tak sanggup melawan rasa takutnya",
    "Selamat pagi buat orang yang aku sayang dan orang yang membenciku, semoga hari ini hari yang lebih baik daripada hari kemarin buat aku dan kamu",
    "Jangan menyerah dengan keadaanmu sekarang, optimis karena optimislah yang bikin kita kuat",
    "Kepada pria yang selalu ada di doaku aku mencintaimu dengan tulus apa adanya",
    "Tolong jangan pergi saat aku sudah sangat sayang padamu",
    "Coba kamu yang berada diposisiku, lalu kamu ditinggalin gitu aja sama orang yang lo sayang banget",
    "Aku takut kamu kenapa-napa, aku panik jika kamu sakit, itu karena aku cinta dan sayang padamu",
    "Sakit itu ketika cinta yang aku beri tidak kamu hargai",
    "Kamu tiba-tiba berubah tanpa sebab tapi jika memang ada sebabnya kamu berubah tolong katakan biar saya perbaiki kesalahan itu",
    "Karenamu aku jadi tau cinta yang sesungguhnya",
    "Senyum manismu sangatlah indah, jadi janganlah sampai kamu bersedih",
    "Berawal dari kenalan, bercanda bareng, ejek-ejekan kemudian berubah menjadi suka, nyaman dan akhirnya saling sayang dan mencintai",
    "Tersenyumlah pada orang yang telah menyakitimu agar sia tau arti kesabaran yang luar biasa",
    "Aku akan ingat kenangan pahit itu dan aku akan jadikan pelajaran untuk masa depan yang manis",
    "Kalau memang tak sanggup menepati janjimu itu setidaknya kamu ingat dan usahakan jagan membiarkan janjimu itu sampai kau lupa",
    "Hanya bisa diam dan berfikir Kenapa orang yang setia dan baik ditinggalin yang nakal dikejar-kejar giliran ditinggalin bilangnya laki-laki itu semuanya sama",
    "Walaupun hanya sesaat saja kau membahagiakanku tapi rasa bahagia yang dia tidak cepat dilupakan",
    "Aku tak menyangka kamu pergi dan melupakan ku begitu cepat",
    "Jomblo gak usah diam rumah mumpung malam minggu ya keluar jalan lah kan jomblo bebas bisa dekat sama siapapun pacar orang mantan sahabat bahkan sendiri atau bareng setan pun bisa",
    "Kamu adalah teman yang selalu di sampingku dalam keadaan senang maupun susah Terimakasih kamu selalu ada di sampingku",
    "Aku tak tahu sebenarnya di dalam hatimu itu ada aku atau dia",
    "Tak mudah melupakanmu karena aku sangat mencintaimu meskipun engkau telah menyakiti aku berkali-kali",
    "Hidup ini hanya sebentar jadi lepaskan saja mereka yang menyakitimu Sayangi Mereka yang peduli padamu dan perjuangan mereka yang berarti bagimu",
    "Tolong jangan pergi meninggalkanku aku masih sangat mencintai dan menyayangimu",
    "Saya mencintaimu dan menyayangimu jadi tolong jangan engkau pergi dan meninggalkan ku sendiri",
    "Saya sudah cukup tahu bagaimana sifatmu itu kamu hanya dapat memberikan harapan palsu kepadaku",
    "Aku berusaha mendapatkan cinta darimu tetapi Kamunya nggak peka",
    "Aku bangkit dari jatuh ku setelah kau jatuhkan aku dan aku akan memulainya lagi dari awal Tanpamu",
    "Mungkin sekarang jodohku masih jauh dan belum bisa aku dapat tapi aku yakin jodoh itu Takkan kemana-mana dan akan ku dapatkan",
    "Datang aja dulu baru menghina orang lain kalau memang dirimu dan lebih baik dari yang kau hina",
    "Membelakanginya mungkin lebih baik daripada melihatnya selingkuh didepan mata sendiri",
    "Bisakah hatimu seperti angsa yang hanya setia pada satu orang saja",
    "Aku berdiri disini sendiri menunggu kehadiran dirimu",
    "Aku hanya tersenyum padamu setelah kau menyakitiku agar kamu tahu arti kesabaran",
    "Maaf aku lupa ternyata aku bukan siapa-siapa",
    "Untuk memegang janjimu itu harus ada buktinya jangan sampai hanya janji palsu",
    "Aku tidak bisa selamanya menunggu dan kini aku menjadi ragu Apakah kamu masih mencintaiku",
    "Jangan buat aku terlalu berharap jika kamu tidak menginginkanku",
    "Lebih baik sendiri daripada berdua tapi tanpa kepastian",
    "Pergi bukan berarti berhenti mencintai tapi kecewa dan lelah karena harus berjuang sendiri",
    "Bukannya aku tidak ingin menjadi pacarmu Aku hanya ingin dipersatukan dengan cara yang benar",
    "Akan ada saatnya kok aku akan benar-benar lupa dan tidak memikirkan mu lagi",
    "Kenapa harus jatuh cinta kepada orang yang tak bisa dimiliki",
    "Jujur aku juga memiliki perasaan terhadapmu dan tidak bisa menolakmu tapi aku juga takut untuk mencintaimu",
    "Maafkan aku sayang tidak bisa menjadi seperti yang kamu mau",
    "Jangan memberi perhatian lebih seperti itu cukup biasa saja tanpa perlu menimbulkan rasa",
    "Aku bukan mencari yang sempurna tapi yang terbaik untukku",
    "Sendiri itu tenang tidak ada pertengkaran kebohongan dan banyak aturan",
    "Cewek strong itu adalah yang sabar dan tetap tersenyum meskipun dalam keadaan terluka",
    "Terima kasih karena kamu aku menjadi lupa tentang masa laluku",
    "Cerita cinta indah tanpa masalah itu hanya di dunia dongeng saja",
    "Kamu tidak akan menemukan apa-apa di masa lalu Yang ada hanyalah penyesalan dan sakit hati",
    "Mikirin orang yang gak pernah mikirin kita itu emang bikin gila",
    "Dari sekian lama menunggu apa yang sudah didapat",
    "Perasaan Bodo gue adalah bisa jatuh cinta sama orang yang sama meski udah disakiti berkali-kali",
    "Yang sendiri adalah yang bersabar menunggu pasangan sejatinya",
    "Aku terlahir sederhana dan ditinggal sudah biasa",
    "Aku sayang kamu tapi aku masih takut untuk mencintaimu",
    "Bisa berbagi suka dan duka bersamamu itu sudah membuatku bahagia",
    "Aku tidak pernah berpikir kamu akan menjadi yang sementara",
    "Jodoh itu bukan seberapa dekat kamu dengannya tapi seberapa yakin kamu dengan Allah",
    "Jangan paksa aku menjadi cewek seperti seleramu",
    "Hanya yang sabar yang mampu melewati semua kekecewaan",
    "Balikan sama kamu itu sama saja bunuh diri dan melukai perasaan ku sendiri",
    "Tak perlu membalas dengan menyakiti biar Karma yang akan urus semua itu",
    "Aku masih ingat kamu tapi perasaanku sudah tidak sakit seperti dulu",
    "Punya kalimat sendiri & mau ditambahin? chat *.owner*"
  ]

  let gombal = [
    "Hal yang paling aku suka yaitu ngemil, namun tau gak ngemil apa yang paling aku suka? ngemilikin kamu sepenuhnya.",
    "Seandainya sekarang adalah tanggal 28 oktober 1928, aku akan ubah naskah sumpah pemuda menjadi sumpah aku cinta kamu.",
    "Aku gak pernah merasakan ketakutan sedikit pun ketika berada didekat kamu, karena kamulah kekuatanku.",
    "Kamu tahu apa persamaan rasa sayangku ke kamu dengan matahari? Persamaannya adalah sama-sama terbit setiap hari dan hanya akan berakhir sampai kiamat.",
    "Kalau bus kota jauh dekat ongkosnya sama, tapi cinta ini dekat-dekat makin saling cinta.",
    "Kalausaja aku harus mengorbankan semua kebahagiaanku hanya untuk sekedar membuat kamu tertawa. Aku rela.",
    "Anjing menggonggong kafilah berlalu, tiap hari bengong mikirin kamu melulu.",
    "Kalau aku jadi wakil rakyat kayaknya bakalan gagal deh. Gimana aku mau mikiran rakyat kalau yang ada dipikiran aku itu cuman ada kamu.",
    "denganambah satu sama dengan dua. Aku sama kamu sama dengan saling cinta.",
    "Kalo kita beda kartu GSM, itu gak masalah asalkan nantinya nama kita berdua ada di kartu Keluarga yang sama.",
    "Masalah yang selalu sulit untukku membuat mu mencintai ku, tapi lebih sulit memaksa hatiku untuk berhenti memikirkan dirimu.",
    "Aku harap kamu tidak menanyakan hal terindah yang pernah singgah di kehidupanku, karena jawaban nya adalah kamu.",
    "Hal yang paling aku suka yaitu ngemil, namun tau gak ngemil apa yang paling aku suka? ngemilikin kamu sepenuhnya.",
    "seandainyaa sekarang adalah tanggal 28 oktober 1928, aku akan ubah naskah sumpah pemuda menjadi sumpah aku cinta kamu.",
    "kuu gak pernah merasakan ketakutan sedikit pun ketika berada didekat kamu, karena kamulah kekuatanku.",
    "kamuu tahu apa persamaan rasa sayangku ke kamu dengan matahari? Persamaannya adalah sama-sama terbit setiap hari dan hanya akan berakhir sampai kiamat.",
    "Kalau bus kota jauh dekat ongkosnya sama, tapi cinta ini dekat-dekat makin saling cinta.",
    "jikaa saja aku harus mengorbankan semua kebahagiaanku hanya untuk sekedar membuat kamu tertawa. Aku rela.",
    "Anjing menggonggong kafilah berlalu, tiap hari bengong mikirin kamu melulu.",
    "Kalau aku jadi wakil rakyat kayaknya bakalan gagal deh. Gimana aku mau mikiran rakyat kalau yang ada dipikiran aku itu cuman ada kamu.",
    "atuu tambah satu sama dengan dua. Aku sama kamu sama dengan saling cinta,.",
    "aloo kita beda kartu GSM, itu gak masalah asalkan nantinya nama kita berdua ada di kartu Keluarga yang sama.",
    "Masalah yang selalu sulit untukku membuat mu mencintai ku, tapi lebih sulit memaksa hatiku untuk berhenti memikirkan dirimu.",
    "Aku tak pernah berjanji untuk sebuah perasaan, namun aku berusaha berjanji untuk sebuah kesetiaan.",
    "Aku sangat berharap kamu tau, kalau aku tidak pernah menyesali cintaku untuk mu, karena bagiku memiliki kamu sudah cukup bagi ku.",
    "Jangankan memilikimu, mendengar kamu kentut aja aku sudah bahagia.",
    "Aku mohon jangan jalan-jalan terus di pikiranku, duduk yang manis di hatiku saja.",
    "Berulang tahun memang indah, namun bagiku yang lebih indah jika berulang kali bersamamu.",
    "Napas aku kok sesek banget ya?, karena separuh nafasku ada di kamu.",
    "Jika ada seseorang lebih memilih pergi meninggalkan kamu, jangan pernah memohon padanya untuk tetap bertahan. Karena jika dia cinta, dia tak akan mau pergi.",
    "jangann diam aja dong, memang diam itu emas, tapi ketahuilah suara kamu itu seperti berlian.",
    "Kesasar itu serasa rugi banget, namun aku nggak merasa rugi karena cintaku sudah Biasanya orang yang lagi nyasar itu rugi ya, tapi tau gak? Aku gak merasa rugi sebab cintaku sudah nyasar ke hati bidadari.",
    "Ada 3 hal yang paling aku sukai di dunia ini, yaitu Matahari, Bulan dan Kamu. Matahari untuk siang hari, Bulan untuk malam hari dan Kamu untuk selamanya dihatiku.",
    "Sayang, kamu itu seperti garam di lautan, tidak terlihat namun akan selalu ada untuk selamanya.",
    "kuu gak perlu wanita yang sholeha, tapi bagaimana menuntun wanita yang aku cintai menjadi seorang yang sholehah.",
    "Aku tidak minta bintang atau bulan kepadamu. Cukup temani aku selamanya di bawah cahayanya.",
    "Akuana kalo kita berdua jadi komplotan penjahat: Aku mencuri hatimu, dan kamu mencuri hatiku?",
    "Aku gak perlu wanita yang cantik, tapi bagaimana aku menyanjung wanita yang aku cintai seperti wanita yang paling cantik di bumi ini.",
    "Aku pengen bersamamu cuma pada dua waktu: SEKARANG dan SELAMANYA.",
    "Akuu tuh bikin aku ga bisa tidur tau ga?",
    "Soalnya kamu selalu ada dibayang-bayang aku terus.",
    "Jika aku bisa jadi bagian dari dirimu,aku mau jadi air matamu,yang tersimpan di hatimu, lahir dari matamu, hidup di pipimu, dan mati di bibirmu.",
    "Papa kamu pasti kerja di apotik ya? | kenapa bang? | karena cuma kamu obat sakit hatiku.",
    "akuu selalu berusaha tak menangis karenamu, karena setiap butir yang jatuh, hanya makin mengingatkan, betapa aku tak bisa melepaskanmu.",
    "mauu nanya jalan nih. Jalan ke hatimu lewat mana ya?",
    "Andai sebuah bintang akan jatuh setiap kali aku mengingatmu, bulan pasti protes. Soalnya dia bakal sendirian di angkasa.",
    "Andai kamu gawang aku bolanya. Aku rela ditendang orang-orang demi aku dapat bersamamu,",
    "Dingin malam ini menusuk tulang. Kesendirian adalah kesepian. Maukah kau jadi selimut penghangat diriku?",
    "Keindahan Borobudur keajaiban dunia, keindahan kamu keajaiban cinta.",
    "Aku ingin mengaku dosa. Jangan pernah marah ya. Maafkan sebelumnya. Tadi malam aku mimpiin kamu jadi pacarku. Setelah bangun, akankah mimpiku jadi nyata?",
    "Kalau nggak sih aku bilang aku cinta kamu hari ini? Kalau besok gimana? Besok lusa? Besoknya besok lusa? Gimana kalau selamanya?",
    "Orangtuamu pengrajin bantal yah? Karena terasa nyaman jika di dekatmu.",
    "Jika malam adalah jeruji gelap yang menjadi sangkar, saya ingin terjebak selamanya di sana bersamamu.",
    "Sekarang aku gendutan gak sih? Kamu tau gak kenapa ? Soalnya kamu sudah mengembangkan cinta yang banyak di hatiku.",
    "Di atas langit masih ada langit. Di bawah langit masih ada aku yang mencintai kamu.",
    "Tau tidak kenapa malam ini tidak ada bintang? Soalnya bintangnya pindah semua ke matamu?",
    "Aku mencintaimu! Jika kamu benci aku, panah saja diriku. Tapi jangan di hatiku ya, karena di situ kamu berada.",
    "Bapak kamu pasti seorang astronot? | kok tau? | Soalnya aku melihat banyak bintang di matamu.",
    "Bapak kamu dosen ya? | kok tau? | karena nilai kamu A+ di hatiku.",
    "Kamu pasti kuliah di seni pahat ya? | kok tau sih? | Soalnya kamu pintar sekali memahat namamu di hatiku.",
    "Ya Tuhan, jika dia jodohku, menangkanlah tender pembangunan proyek menara cintaku di hatinya.",
    "Kamu mantan pencuri ya? | kok tau? | Abisnya kamu mencuri hatiku sih!",
    "Cowok : Aku suka senyum-senyum sendiri lho. | Cewek : Hah .. Gila Ya | Cowok : Nggak. Aku sedang mikirin kamu.",
    "Setiap malam aku berjalan-jalan di suatu tempat. Kamu tau di mana itu ? | gatau, emang dimana? | Di hatimu.",
    "Kamu pake Telkomesl ya? Karena sinyal-sinyal cintamu sangat kuat sampai ke hatiku.",
    "Kamu tahu gak sih? AKu tuh capek banget. Capek nahan kangen terus sama kamu.",
    "katanyaa kalau sering hujan itu bisa membuat seseorang terhanyut, kalau aku sekarang sedang terhanyut di dalam cintamu.",
    "Aku harap kamu jangan pergi lagi ya? karena, bila aku berpisah dengamu sedetik saja bagaikan 1000 tahun rasanya.",
    "Aku sih gak butuh week end, yang aku butuhkan hanyalah love you till the end.",
    "Emak kamu tukang Gado gado ya?, kok tau sih?, Pantesan saja kamu telah mencampur adukan perasaanku",
    "Walau hari ini cerah, tetapi tanpa kamu disisiku sama saja berselimutkan awan gelap di hati ini",
    "Kamu ngizinin aku kangen sehari berapa kali neng? Abang takut over dosis.",
    "cintaa aku ke kamu tuh bagaikan hutang, awalnya kecil, lama-lama didiemin malah tambah gede.",
    "Berulang tahun adalah hari yang indah. Tapih akin lebih indah kalo udah berulang-ulang kali bersama kamu."
  ]

  let motivasi = [
    "ᴊᴀɴɢᴀɴ ʙɪᴄᴀʀᴀ, ʙᴇʀᴛɪɴᴅᴀᴋ ꜱᴀᴊᴀ. ᴊᴀɴɢᴀɴ ᴋᴀᴛᴀᴋᴀɴ, ᴛᴜɴᴊᴜᴋᴋᴀɴ ꜱᴀᴊᴀ. ᴊᴀɴɢᴀɴ ᴊᴀɴᴊɪ, ʙᴜᴋᴛɪᴋᴀɴ ꜱᴀᴊᴀ.",
    "ᴊᴀɴɢᴀɴ ᴘᴇʀɴᴀʜ ʙᴇʀʜᴇɴᴛɪ ᴍᴇʟᴀᴋᴜᴋᴀɴ ʏᴀɴɢ ᴛᴇʀʙᴀɪᴋ ʜᴀɴʏᴀ ᴋᴀʀᴇɴᴀ ꜱᴇꜱᴇᴏʀᴀɴɢ ᴛɪᴅᴀᴋ ᴍᴇᴍʙᴇʀɪ ᴀɴᴅᴀ ᴘᴇɴɢʜᴀʀɢᴀᴀɴ.",
    "ʙᴇᴋᴇʀᴊᴀ ꜱᴀᴀᴛ ᴍᴇʀᴇᴋᴀ ᴛɪᴅᴜʀ. ʙᴇʟᴀᴊᴀʀ ꜱᴀᴀᴛ ᴍᴇʀᴇᴋᴀ ʙᴇʀᴘᴇꜱᴛᴀ. ʜᴇᴍᴀᴛ ꜱᴇᴍᴇɴᴛᴀʀᴀ ᴍᴇʀᴇᴋᴀ ᴍᴇɴɢʜᴀʙɪꜱᴋᴀɴ. ʜɪᴅᴜᴘʟᴀʜ ꜱᴇᴘᴇʀᴛɪ ᴍɪᴍᴘɪ ᴍᴇʀᴇᴋᴀ.",
    "ᴋᴜɴᴄɪ ꜱᴜᴋꜱᴇꜱ ᴀᴅᴀʟᴀʜ ᴍᴇᴍᴜꜱᴀᴛᴋᴀɴ ᴘɪᴋɪʀᴀɴ ꜱᴀᴅᴀʀ ᴋɪᴛᴀ ᴘᴀᴅᴀ ʜᴀʟ-ʜᴀʟ ʏᴀɴɢ ᴋɪᴛᴀ ɪɴɢɪɴᴋᴀɴ, ʙᴜᴋᴀɴ ʜᴀʟ-ʜᴀʟ ʏᴀɴɢ ᴋɪᴛᴀ ᴛᴀᴋᴜᴛɪ.",
    "ᴊᴀɴɢᴀɴ ᴛᴀᴋᴜᴛ ɢᴀɢᴀʟ. ᴋᴇᴛᴀᴋᴜᴛᴀɴ ʙᴇʀᴀᴅᴀ ᴅɪ ᴛᴇᴍᴘᴀᴛ ʏᴀɴɢ ꜱᴀᴍᴀ ᴛᴀʜᴜɴ ᴅᴇᴘᴀɴ ꜱᴇᴘᴇʀᴛɪ ᴀɴᴅᴀ ꜱᴀᴀᴛ ɪɴɪ.",
    "ᴊɪᴋᴀ ᴋɪᴛᴀ ᴛᴇʀᴜꜱ ᴍᴇʟᴀᴋᴜᴋᴀɴ ᴀᴘᴀ ʏᴀɴɢ ᴋɪᴛᴀ ʟᴀᴋᴜᴋᴀɴ, ᴋɪᴛᴀ ᴀᴋᴀɴ ᴛᴇʀᴜꜱ ᴍᴇɴᴅᴀᴘᴀᴛᴋᴀɴ ᴀᴘᴀ ʏᴀɴɢ ᴋɪᴛᴀ ᴅᴀᴘᴀᴛᴋᴀɴ.",
    "ᴊɪᴋᴀ ᴀɴᴅᴀ ᴛɪᴅᴀᴋ ᴅᴀᴘᴀᴛ ᴍᴇɴɢᴀᴛᴀꜱɪ ꜱᴛʀᴇꜱ, ᴀɴᴅᴀ ᴛɪᴅᴀᴋ ᴀᴋᴀɴ ᴍᴇɴɢᴇʟᴏʟᴀ ᴋᴇꜱᴜᴋꜱᴇꜱᴀɴ.",
    "ʙᴇʀꜱɪᴋᴀᴘ ᴋᴇʀᴀꜱ ᴋᴇᴘᴀʟᴀ ᴛᴇɴᴛᴀɴɢ ᴛᴜᴊᴜᴀɴ ᴀɴᴅᴀ ᴅᴀɴ ꜰʟᴇᴋꜱɪʙᴇʟ ᴛᴇɴᴛᴀɴɢ ᴍᴇᴛᴏᴅᴇ ᴀɴᴅᴀ.",
    "ᴋᴇʀᴊᴀ ᴋᴇʀᴀꜱ ᴍᴇɴɢᴀʟᴀʜᴋᴀɴ ʙᴀᴋᴀᴛ ᴋᴇᴛɪᴋᴀ ʙᴀᴋᴀᴛ ᴛɪᴅᴀᴋ ʙᴇᴋᴇʀᴊᴀ ᴋᴇʀᴀꜱ.",
    "ɪɴɢᴀᴛʟᴀʜ ʙᴀʜᴡᴀ ᴘᴇʟᴀᴊᴀʀᴀɴ ᴛᴇʀʙᴇꜱᴀʀ ᴅᴀʟᴀᴍ ʜɪᴅᴜᴘ ʙɪᴀꜱᴀɴʏᴀ ᴅɪᴘᴇʟᴀᴊᴀʀɪ ᴅᴀʀɪ ꜱᴀᴀᴛ-ꜱᴀᴀᴛ ᴛᴇʀʙᴜʀᴜᴋ ᴅᴀɴ ᴅᴀʀɪ ᴋᴇꜱᴀʟᴀʜᴀɴ ᴛᴇʀʙᴜʀᴜᴋ.",
    "ʜɪᴅᴜᴘ ʙᴜᴋᴀɴ ᴛᴇɴᴛᴀɴɢ ᴍᴇɴᴜɴɢɢᴜ ʙᴀᴅᴀɪ ʙᴇʀʟᴀʟᴜ, ᴛᴇᴛᴀᴘɪ ʙᴇʟᴀᴊᴀʀ ᴍᴇɴᴀʀɪ ᴅɪ ᴛᴇɴɢᴀʜ ʜᴜᴊᴀɴ.",
    "ᴊɪᴋᴀ ʀᴇɴᴄᴀɴᴀɴʏᴀ ᴛɪᴅᴀᴋ ʙᴇʀʜᴀꜱɪʟ, ᴜʙᴀʜ ʀᴇɴᴄᴀɴᴀɴʏᴀ ʙᴜᴋᴀɴ ᴛᴜᴊᴜᴀɴɴʏᴀ.",
    "ᴊᴀɴɢᴀɴ ᴛᴀᴋᴜᴛ ᴋᴀʟᴀᴜ ʜɪᴅᴜᴘᴍᴜ ᴀᴋᴀɴ ʙᴇʀᴀᴋʜɪʀ; ᴛᴀᴋᴜᴛʟᴀʜ ᴋᴀʟᴀᴜ ʜɪᴅᴜᴘᴍᴜ ᴛᴀᴋ ᴘᴇʀɴᴀʜ ᴅɪᴍᴜʟᴀɪ.",
    "ᴏʀᴀɴɢ ʏᴀɴɢ ʙᴇɴᴀʀ-ʙᴇɴᴀʀ ʜᴇʙᴀᴛ ᴀᴅᴀʟᴀʜ ᴏʀᴀɴɢ ʏᴀɴɢ ᴍᴇᴍʙᴜᴀᴛ ꜱᴇᴛɪᴀᴘ ᴏʀᴀɴɢ ᴍᴇʀᴀꜱᴀ ʜᴇʙᴀᴛ.",
    "ᴘᴇɴɢᴀʟᴀᴍᴀɴ ᴀᴅᴀʟᴀʜ ɢᴜʀᴜ ʏᴀɴɢ ʙᴇʀᴀᴛ ᴋᴀʀᴇɴᴀ ᴅɪᴀ ᴍᴇᴍʙᴇʀɪᴋᴀɴ ᴛᴇꜱ ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ, ᴋᴇᴍᴜᴅɪᴀɴ ᴘᴇʟᴀᴊᴀʀᴀɴɴʏᴀ.",
    "ᴍᴇɴɢᴇᴛᴀʜᴜɪ ꜱᴇʙᴇʀᴀᴘᴀ ʙᴀɴʏᴀᴋ ʏᴀɴɢ ᴘᴇʀʟᴜ ᴅɪᴋᴇᴛᴀʜᴜɪ ᴀᴅᴀʟᴀʜ ᴀᴡᴀʟ ᴅᴀʀɪ ʙᴇʟᴀᴊᴀʀ ᴜɴᴛᴜᴋ ʜɪᴅᴜᴘ.",
    "ꜱᴜᴋꜱᴇꜱ ʙᴜᴋᴀɴʟᴀʜ ᴀᴋʜɪʀ, ᴋᴇɢᴀɢᴀʟᴀɴ ᴛɪᴅᴀᴋ ꜰᴀᴛᴀʟ. ʏᴀɴɢ ᴛᴇʀᴘᴇɴᴛɪɴɢ ᴀᴅᴀʟᴀʜ ᴋᴇʙᴇʀᴀɴɪᴀɴ ᴜɴᴛᴜᴋ ᴍᴇʟᴀɴᴊᴜᴛᴋᴀɴ.",
    "ʟᴇʙɪʜ ʙᴀɪᴋ ɢᴀɢᴀʟ ᴅᴀʟᴀᴍ ᴏʀɪꜱɪɴᴀʟɪᴛᴀꜱ ᴅᴀʀɪᴘᴀᴅᴀ ʙᴇʀʜᴀꜱɪʟ ᴍᴇɴɪʀᴜ.",
    "ʙᴇʀᴀɴɪ ʙᴇʀᴍɪᴍᴘɪ, ᴛᴀᴘɪ ʏᴀɴɢ ʟᴇʙɪʜ ᴘᴇɴᴛɪɴɢ, ʙᴇʀᴀɴɪ ᴍᴇʟᴀᴋᴜᴋᴀɴ ᴛɪɴᴅᴀᴋᴀɴ ᴅɪ ʙᴀʟɪᴋ ɪᴍᴘɪᴀɴᴍᴜ.",
    "ᴛᴇᴛᴀᴘᴋᴀɴ ᴛᴜᴊᴜᴀɴ ᴀɴᴅᴀ ᴛɪɴɢɢɪ-ᴛɪɴɢɢɪ, ᴅᴀɴ ᴊᴀɴɢᴀɴ ʙᴇʀʜᴇɴᴛɪ ꜱᴀᴍᴘᴀɪ ᴀɴᴅᴀ ᴍᴇɴᴄᴀᴘᴀɪɴʏᴀ.",
    "ᴋᴇᴍʙᴀɴɢᴋᴀɴ ᴋᴇꜱᴜᴋꜱᴇꜱᴀɴ ᴅᴀʀɪ ᴋᴇɢᴀɢᴀʟᴀɴ. ᴋᴇᴘᴜᴛᴜꜱᴀꜱᴀᴀɴ ᴅᴀɴ ᴋᴇɢᴀɢᴀʟᴀɴ ᴀᴅᴀʟᴀʜ ᴅᴜᴀ ʙᴀᴛᴜ ʟᴏɴᴄᴀᴛᴀɴ ᴘᴀʟɪɴɢ ᴘᴀꜱᴛɪ ᴍᴇɴᴜᴊᴜ ꜱᴜᴋꜱᴇꜱ.",
    "ᴊᴇɴɪᴜꜱ ᴀᴅᴀʟᴀʜ ꜱᴀᴛᴜ ᴘᴇʀꜱᴇɴ ɪɴꜱᴘɪʀᴀꜱɪ ᴅᴀɴ ꜱᴇᴍʙɪʟᴀɴ ᴘᴜʟᴜʜ ꜱᴇᴍʙɪʟᴀɴ ᴘᴇʀꜱᴇɴ ᴋᴇʀɪɴɢᴀᴛ.",
    "ꜱᴜᴋꜱᴇꜱ ᴀᴅᴀʟᴀʜ ᴛᴇᴍᴘᴀᴛ ᴘᴇʀꜱɪᴀᴘᴀɴ ᴅᴀɴ ᴋᴇꜱᴇᴍᴘᴀᴛᴀɴ ʙᴇʀᴛᴇᴍᴜ.",
    "ᴋᴇᴛᴇᴋᴜɴᴀɴ ɢᴀɢᴀʟ 19 ᴋᴀʟɪ ᴅᴀɴ ʙᴇʀʜᴀꜱɪʟ ᴘᴀᴅᴀ ᴋᴇꜱᴇᴍᴘᴀᴛᴀᴍ ʏᴀɴɢ ᴋᴇ-20.",
    "ᴊᴀʟᴀɴ ᴍᴇɴᴜᴊᴜ ꜱᴜᴋꜱᴇꜱ ᴅᴀɴ ᴊᴀʟᴀɴ ᴍᴇɴᴜᴊᴜ ᴋᴇɢᴀɢᴀʟᴀɴ ʜᴀᴍᴘɪʀ ᴘᴇʀꜱɪꜱ ꜱᴀᴍᴀ.",
    "ꜱᴜᴋꜱᴇꜱ ʙɪᴀꜱᴀɴʏᴀ ᴅᴀᴛᴀɴɢ ᴋᴇᴘᴀᴅᴀ ᴍᴇʀᴇᴋᴀ ʏᴀɴɢ ᴛᴇʀʟᴀʟᴜ ꜱɪʙᴜᴋ ᴍᴇɴᴄᴀʀɪɴʏᴀ.",
    "ᴊᴀɴɢᴀɴ ᴛᴜɴᴅᴀ ᴘᴇᴋᴇʀᴊᴀᴀɴᴍᴜ ꜱᴀᴍᴘᴀɪ ʙᴇꜱᴏᴋ, ꜱᴇᴍᴇɴᴛᴀʀᴀ ᴋᴀᴜ ʙɪꜱᴀ ᴍᴇɴɢᴇʀᴊᴀᴋᴀɴɴʏᴀ ʜᴀʀɪ ɪɴɪ.",
    "20 ᴛᴀʜᴜɴ ᴅᴀʀɪ ꜱᴇᴋᴀʀᴀɴɢ, ᴋᴀᴜ ᴍᴜɴɢᴋɪɴ ʟᴇʙɪʜ ᴋᴇᴄᴇᴡᴀ ᴅᴇɴɢᴀɴ ʜᴀʟ-ʜᴀʟ ʏᴀɴɢ ᴛɪᴅᴀᴋ ꜱᴇᴍᴘᴀᴛ ᴋᴀᴜ ʟᴀᴋᴜᴋᴀɴ ᴀʟɪʜ-ᴀʟɪʜ ʏᴀɴɢ ꜱᴜᴅᴀʜ.",
    "ᴊᴀɴɢᴀɴ ʜᴀʙɪꜱᴋᴀɴ ᴡᴀᴋᴛᴜᴍᴜ ᴍᴇᴍᴜᴋᴜʟɪ ᴛᴇᴍʙᴏᴋ ᴅᴀɴ ʙᴇʀʜᴀʀᴀᴘ ʙɪꜱᴀ ᴍᴇɴɢᴜʙᴀʜɴʏᴀ ᴍᴇɴᴊᴀᴅɪ ᴘɪɴᴛᴜ.",
    "ᴋᴇꜱᴇᴍᴘᴀᴛᴀɴ ɪᴛᴜ ᴍɪʀɪᴘ ꜱᴇᴘᴇʀᴛɪ ᴍᴀᴛᴀʜᴀʀɪ ᴛᴇʀʙɪᴛ. ᴋᴀʟᴀᴜ ᴋᴀᴜ ᴍᴇɴᴜɴɢɢᴜ ᴛᴇʀʟᴀʟᴜ ʟᴀᴍᴀ, ᴋᴀᴜ ʙɪꜱᴀ ᴍᴇʟᴇᴡᴀᴛᴋᴀɴɴʏᴀ.",
    "ʜɪᴅᴜᴘ ɪɴɪ ᴛᴇʀᴅɪʀɪ ᴅᴀʀɪ 10 ᴘᴇʀꜱᴇɴ ᴀᴘᴀ ʏᴀɴɢ ᴛᴇʀᴊᴀᴅɪ ᴘᴀᴅᴀᴍᴜ ᴅᴀɴ 90 ᴘᴇʀꜱᴇɴ ʙᴀɢᴀɪᴍᴀɴᴀ ᴄᴀʀᴀᴍᴜ ᴍᴇɴʏɪᴋᴀᴘɪɴʏᴀ.",
    "ᴀᴅᴀ ᴛɪɢᴀ ᴄᴀʀᴀ ᴜɴᴛᴜᴋ ᴍᴇɴᴄᴀᴘᴀɪ ᴋᴇꜱᴜᴋꜱᴇꜱᴀɴ ᴛᴇʀᴛɪɴɢɢɪ: ᴄᴀʀᴀ ᴘᴇʀᴛᴀᴍᴀ ᴀᴅᴀʟᴀʜ ʙᴇʀꜱɪᴋᴀᴘ ʙᴀɪᴋ. ᴄᴀʀᴀ ᴋᴇᴅᴜᴀ ᴀᴅᴀʟᴀʜ ʙᴇʀꜱɪᴋᴀᴘ ʙᴀɪᴋ. ᴄᴀʀᴀ ᴋᴇᴛɪɢᴀ ᴀᴅᴀʟᴀʜ ᴍᴇɴᴊᴀᴅɪ ʙᴀɪᴋ.",
    "ᴀʟᴀꜱᴀɴ ɴᴏᴍᴏʀ ꜱᴀᴛᴜ ᴏʀᴀɴɢ ɢᴀɢᴀʟ ᴅᴀʟᴀᴍ ʜɪᴅᴜᴘ ᴀᴅᴀʟᴀʜ ᴋᴀʀᴇɴᴀ ᴍᴇʀᴇᴋᴀ ᴍᴇɴᴅᴇɴɢᴀʀᴋᴀɴ ᴛᴇᴍᴀɴ, ᴋᴇʟᴜᴀʀɢᴀ, ᴅᴀɴ ᴛᴇᴛᴀɴɢɢᴀ ᴍᴇʀᴇᴋᴀ.",
    "ᴡᴀᴋᴛᴜ ʟᴇʙɪʜ ʙᴇʀʜᴀʀɢᴀ ᴅᴀʀɪᴘᴀᴅᴀ ᴜᴀɴɢ. ᴋᴀᴍᴜ ʙɪꜱᴀ ᴍᴇɴᴅᴀᴘᴀᴛᴋᴀɴ ʟᴇʙɪʜ ʙᴀɴʏᴀᴋ ᴜᴀɴɢ, ᴛᴇᴛᴀᴘɪ ᴋᴀᴍᴜ ᴛɪᴅᴀᴋ ʙɪꜱᴀ ᴍᴇɴᴅᴀᴘᴀᴛᴋᴀɴ ʟᴇʙɪʜ ʙᴀɴʏᴀᴋ ᴡᴀᴋᴛᴜ.",
    "ᴘᴇɴᴇᴛᴀᴘᴀɴ ᴛᴜᴊᴜᴀɴ ᴀᴅᴀʟᴀʜ ʀᴀʜᴀꜱɪᴀ ᴍᴀꜱᴀ ᴅᴇᴘᴀɴ ʏᴀɴɢ ᴍᴇɴᴀʀɪᴋ.",
    "ꜱᴀᴀᴛ ᴋɪᴛᴀ ʙᴇʀᴜꜱᴀʜᴀ ᴜɴᴛᴜᴋ ᴍᴇɴᴊᴀᴅɪ ʟᴇʙɪʜ ʙᴀɪᴋ ᴅᴀʀɪ ᴋɪᴛᴀ, ꜱᴇɢᴀʟᴀ ꜱᴇꜱᴜᴀᴛᴜ ᴅɪ ꜱᴇᴋɪᴛᴀʀ ᴋɪᴛᴀ ᴊᴜɢᴀ ᴍᴇɴᴊᴀᴅɪ ʟᴇʙɪʜ ʙᴀɪᴋ.",
    "ᴘᴇʀᴛᴜᴍʙᴜʜᴀɴ ᴅɪᴍᴜʟᴀɪ ᴋᴇᴛɪᴋᴀ ᴋɪᴛᴀ ᴍᴜʟᴀɪ ᴍᴇɴᴇʀɪᴍᴀ ᴋᴇʟᴇᴍᴀʜᴀɴ ᴋɪᴛᴀ ꜱᴇɴᴅɪʀɪ.",
    "ᴊᴀɴɢᴀɴʟᴀʜ ᴘᴇʀɴᴀʜ ᴍᴇɴʏᴇʀᴀʜ ᴋᴇᴛɪᴋᴀ ᴀɴᴅᴀ ᴍᴀꜱɪʜ ᴍᴀᴍᴘᴜ ʙᴇʀᴜꜱᴀʜᴀ ʟᴀɢɪ. ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴋᴀᴛᴀ ʙᴇʀᴀᴋʜɪʀ ꜱᴀᴍᴘᴀɪ ᴀɴᴅᴀ ʙᴇʀʜᴇɴᴛɪ ᴍᴇɴᴄᴏʙᴀ.",
    "ᴋᴇᴍᴀᴜᴀɴ ᴀᴅᴀʟᴀʜ ᴋᴜɴᴄɪ ꜱᴜᴋꜱᴇꜱ. ᴏʀᴀɴɢ-ᴏʀᴀɴɢ ꜱᴜᴋꜱᴇꜱ, ʙᴇʀᴜꜱᴀʜᴀ ᴋᴇʀᴀꜱ ᴀᴘᴀ ᴘᴜɴ ʏᴀɴɢ ᴍᴇʀᴇᴋᴀ ʀᴀꜱᴀᴋᴀɴ ᴅᴇɴɢᴀɴ ᴍᴇɴᴇʀᴀᴘᴋᴀɴ ᴋᴇɪɴɢɪɴᴀɴ ᴍᴇʀᴇᴋᴀ ᴜɴᴛᴜᴋ ᴍᴇɴɢᴀᴛᴀꜱɪ ꜱɪᴋᴀᴘ ᴀᴘᴀᴛɪꜱ, ᴋᴇʀᴀɢᴜᴀɴ ᴀᴛᴀᴜ ᴋᴇᴛᴀᴋᴜᴛᴀɴ.",
    "ᴊᴀɴɢᴀɴʟᴀʜ ᴘᴇʀɴᴀʜ ᴍᴇɴʏᴇʀᴀʜ ᴋᴇᴛɪᴋᴀ ᴀɴᴅᴀ ᴍᴀꜱɪʜ ᴍᴀᴍᴘᴜ ʙᴇʀᴜꜱᴀʜᴀ ʟᴀɢɪ. ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴋᴀᴛᴀ ʙᴇʀᴀᴋʜɪʀ ꜱᴀᴍᴘᴀɪ ᴀɴᴅᴀ ʙᴇʀʜᴇɴᴛɪ ᴍᴇɴᴄᴏʙᴀ.",
    "ᴋᴇᴍᴀᴜᴀɴ ᴀᴅᴀʟᴀʜ ᴋᴜɴᴄɪ ꜱᴜᴋꜱᴇꜱ. ᴏʀᴀɴɢ-ᴏʀᴀɴɢ ꜱᴜᴋꜱᴇꜱ, ʙᴇʀᴜꜱᴀʜᴀ ᴋᴇʀᴀꜱ ᴀᴘᴀ ᴘᴜɴ ʏᴀɴɢ ᴍᴇʀᴇᴋᴀ ʀᴀꜱᴀᴋᴀɴ ᴅᴇɴɢᴀɴ ᴍᴇɴᴇʀᴀᴘᴋᴀɴ ᴋᴇɪɴɢɪɴᴀɴ ᴍᴇʀᴇᴋᴀ ᴜɴᴛᴜᴋ ᴍᴇɴɢᴀᴛᴀꜱɪ ꜱɪᴋᴀᴘ ᴀᴘᴀᴛɪꜱ, ᴋᴇʀᴀɢᴜᴀɴ ᴀᴛᴀᴜ ᴋᴇᴛᴀᴋᴜᴛᴀɴ.",
    "ʜᴀʟ ᴘᴇʀᴛᴀᴍᴀ ʏᴀɴɢ ᴅɪʟᴀᴋᴜᴋᴀɴ ᴏʀᴀɴɢ ꜱᴜᴋꜱᴇꜱ ᴀᴅᴀʟᴀʜ ᴍᴇᴍᴀɴᴅᴀɴɢ ᴋᴇɢᴀɢᴀʟᴀɴ ꜱᴇʙᴀɢᴀɪ ꜱɪɴʏᴀʟ ᴘᴏꜱɪᴛɪꜰ ᴜɴᴛᴜᴋ ꜱᴜᴋꜱᴇꜱ.",
    "ᴄɪʀɪ ᴋʜᴀꜱ ᴏʀᴀɴɢ ꜱᴜᴋꜱᴇꜱ ᴀᴅᴀʟᴀʜ ᴍᴇʀᴇᴋᴀ ꜱᴇʟᴀʟᴜ ʙᴇʀᴜꜱᴀʜᴀ ᴋᴇʀᴀꜱ ᴜɴᴛᴜᴋ ᴍᴇᴍᴘᴇʟᴀᴊᴀʀɪ ʜᴀʟ-ʜᴀʟ ʙᴀʀᴜ.",
    "ꜱᴜᴋꜱᴇꜱ ᴀᴅᴀʟᴀʜ ᴍᴇɴᴅᴀᴘᴀᴛᴋᴀɴ ᴀᴘᴀ ʏᴀɴɢ ᴋᴀᴍᴜ ɪɴɢɪɴᴋᴀɴ, ᴋᴇʙᴀʜᴀɢɪᴀᴀɴ ᴍᴇɴɢɪɴɢɪɴᴋᴀɴ ᴀᴘᴀ ʏᴀɴɢ ᴋᴀᴍᴜ ᴅᴀᴘᴀᴛᴋᴀɴ.",
    "ᴏʀᴀɴɢ ᴘᴇꜱɪᴍɪꜱ ᴍᴇʟɪʜᴀᴛ ᴋᴇꜱᴜʟɪᴛᴀɴ ᴅɪ ꜱᴇᴛɪᴀᴘ ᴋᴇꜱᴇᴍᴘᴀᴛᴀɴ. ᴏʀᴀɴɢ ʏᴀɴɢ ᴏᴘᴛɪᴍɪꜱ ᴍᴇʟɪʜᴀᴛ ᴘᴇʟᴜᴀɴɢ ᴅᴀʟᴀᴍ ꜱᴇᴛɪᴀᴘ ᴋᴇꜱᴜʟɪᴛᴀɴ.",
    "ᴋᴇʀᴀɢᴜᴀɴ ᴍᴇᴍʙᴜɴᴜʜ ʟᴇʙɪʜ ʙᴀɴʏᴀᴋ ᴍɪᴍᴘɪ ᴅᴀʀɪᴘᴀᴅᴀ ᴋᴇɢᴀɢᴀʟᴀɴ.",
    "ʟᴀᴋᴜᴋᴀɴ ᴀᴘᴀ ʏᴀɴɢ ʜᴀʀᴜꜱ ᴋᴀᴍᴜ ʟᴀᴋᴜᴋᴀɴ ꜱᴀᴍᴘᴀɪ ᴋᴀᴍᴜ ᴅᴀᴘᴀᴛ ᴍᴇʟᴀᴋᴜᴋᴀɴ ᴀᴘᴀ ʏᴀɴɢ ɪɴɢɪɴ ᴋᴀᴍᴜ ʟᴀᴋᴜᴋᴀɴ.",
    "ᴏᴘᴛɪᴍɪꜱᴛɪꜱ ᴀᴅᴀʟᴀʜ ꜱᴀʟᴀʜ ꜱᴀᴛᴜ ᴋᴜᴀʟɪᴛᴀꜱ ʏᴀɴɢ ʟᴇʙɪʜ ᴛᴇʀᴋᴀɪᴛ ᴅᴇɴɢᴀɴ ᴋᴇꜱᴜᴋꜱᴇꜱᴀɴ ᴅᴀɴ ᴋᴇʙᴀʜᴀɢɪᴀᴀɴ ᴅᴀʀɪᴘᴀᴅᴀ ʏᴀɴɢ ʟᴀɪɴ.",
    "ᴘᴇɴɢʜᴀʀɢᴀᴀɴ ᴘᴀʟɪɴɢ ᴛɪɴɢɢɪ ʙᴀɢɪ ꜱᴇᴏʀᴀɴɢ ᴘᴇᴋᴇʀᴊᴀ ᴋᴇʀᴀꜱ ʙᴜᴋᴀɴʟᴀʜ ᴀᴘᴀ ʏᴀɴɢ ᴅɪᴀ ᴘᴇʀᴏʟᴇʜ ᴅᴀʀɪ ᴘᴇᴋᴇʀᴊᴀᴀɴ ɪᴛᴜ, ᴛᴀᴘɪ ꜱᴇʙᴇʀᴀᴘᴀ ʙᴇʀᴋᴇᴍʙᴀɴɢ ɪᴀ ᴅᴇɴɢᴀɴ ᴋᴇʀᴊᴀ ᴋᴇʀᴀꜱɴʏᴀ ɪᴛᴜ.",
    "ᴄᴀʀᴀ ᴛᴇʀʙᴀɪᴋ ᴜɴᴛᴜᴋ ᴍᴇᴍᴜʟᴀɪ ᴀᴅᴀʟᴀʜ ᴅᴇɴɢᴀɴ ʙᴇʀʜᴇɴᴛɪ ʙᴇʀʙɪᴄᴀʀᴀ ᴅᴀɴ ᴍᴜʟᴀɪ ᴍᴇʟᴀᴋᴜᴋᴀɴ.",
    "ᴋᴇɢᴀɢᴀʟᴀɴ ᴛɪᴅᴀᴋ ᴀᴋᴀɴ ᴘᴇʀɴᴀʜ ᴍᴇɴʏᴜꜱᴜʟ ᴊɪᴋᴀ ᴛᴇᴋᴀᴅ ᴜɴᴛᴜᴋ ꜱᴜᴋꜱᴇꜱ ᴄᴜᴋᴜᴘ ᴋᴜᴀᴛ."
  ]

  let bucin = [
    "Aku memilih untuk sendiri, bukan karena menunggu yang sempurna, tetapi butuh yang tak pernah menyerah.",
    "Seorang yang single diciptakan bersama pasangan yang belum ditemukannya.",
    "Jomblo. Mungkin itu cara Tuhan untuk mengatakan 'Istirahatlah dari cinta yang salah'.",
    "Jomblo adalah anak muda yang mendahulukan pengembangan pribadinya untuk cinta yang lebih berkelas nantinya.",
    "Aku bukan mencari seseorang yang sempurna, tapi aku mencari orang yang menjadi sempurna berkat kelebihanku.",
    "Pacar orang adalah jodoh kita yang tertunda.",
    "Jomblo pasti berlalu. Semua ada saatnya, saat semua kesendirian menjadi sebuah kebersamaan dengannya kekasih halal. Bersabarlah.",
    "Romeo rela mati untuk juliet, Jack mati karena menyelamatkan Rose. Intinya, kalau tetap mau hidup, jadilah single.",
    "Aku mencari orang bukan dari kelebihannya tapi aku mencari orang dari ketulusan hatinya.",
    "Jodoh bukan sendal jepit, yang kerap tertukar. Jadi teruslah berada dalam perjuangan yang semestinya.",
    "Kalau kamu jadi senar gitar, aku nggak mau jadi gitarisnya. Karena aku nggak mau mutusin kamu.",
    "Bila mencintaimu adalah ilusi, maka izinkan aku berimajinasi selamanya.",
    "Sayang... Tugas aku hanya mencintaimu, bukan melawan takdir.",
    "Saat aku sedang bersamamu rasanya 1 jam hanya 1 detik, tetapi jika aku jauh darimu rasanya 1 hari menjadi 1 tahun.",
    "Kolak pisang tahu sumedang, walau jarak membentang cintaku takkan pernah hilang.",
    "Aku ingin menjadi satu-satunya, bukan salah satunya.",
    "Aku tidak bisa berjanji untuk menjadi yang baik. Tapi aku berjanji akan selalu mendampingi kamu.",
    "Kalau aku jadi wakil rakyat aku pasti gagal, gimana mau mikirin rakyat kalau yang selalu ada dipikiran aku hanyalah dirimu.",
    "Lihat kebunku, penuh dengan bunga. Lihat matamu, hatiku berbunga-bunga.",
    "Berjanjilah untuk terus bersamaku sekarang, esok, dan selamanya.",
    "Rindu tidak hanya muncul karena jarak yang terpisah. Tapi juga karena keinginan yang tidak terwujud.",
    "Kamu tidak akan pernah jauh dariku, kemanapun aku pergi kamu selalu ada, karena kamu selalu di hatiku, yang jauh hanya raga kita bukan hati kita.",
    "Aku tahu dalam setiap tatapanku, kita terhalang oleh jarak dan waktu. Tapi aku yakin kalau nanti kita pasti bisa bersatu.",
    "Merindukanmu tanpa pernah bertemu sama halnya dengan menciptakan lagu yang tak pernah ternyayikan.",
    "Ada kalanya jarak selalu menjadi penghalang antara aku sama kamu, namun tetap saja di hatiku kita selalu dekat.",
    "Jika hati ini tak mampu membendung segala kerinduan, apa daya tak ada yang bisa aku lakukan selain mendoakanmu.",
    "Mungkin di saat ini aku hanya bisa menahan kerinduan ini. Sampai tiba saatnya nanti aku bisa bertemu dan melepaskan kerinduan ini bersamamu.",
    "Melalui rasa rindu yang bergejolak dalam hati, di situ terkadang aku sangat membutuhkan dekap peluk kasih sayangmu.",
    "Dalam dinginnya malam, tak kuingat lagi; Berapa sering aku memikirkanmu juga merindukanmu.",
    "Merindukanmu itu seperti hujan yang datang tiba-tiba dan bertahan lama. Dan bahkan setelah hujan reda, rinduku masih terasa.",
    "Sejak mengenalmu bawaannya aku pengen belajar terus, belajar menjadi yang terbaik buat kamu.",
    "Tahu gak perbedaan pensi sama wajah kamu? Kalau pensil tulisannya bisa dihapus, tapi kalau wajah kamu gak akan ada yang bisa hapus dari pikiran aku.",
    "Bukan Ujian Nasional besok yang harus aku khawatirkan, tapi ujian hidup yang aku lalui setelah kamu meninggalkanku.",
    "Satu hal kebahagiaan di sekolah yang terus membuatku semangat adalah bisa melihat senyumanmu setiap hari.",
    "Kamu tahu gak perbedaanya kalau ke sekolah sama ke rumah kamu? Kalo ke sekolah pasti yang di bawa itu buku dan pulpen, tapi kalo ke rumah kamu, aku cukup membawa hati dan cinta.",
    "Aku gak sedih kok kalo besok hari senin, aku sedihnya kalau gak ketemu kamu.",
    "Momen cintaku tegak lurus dengan momen cintamu. Menjadikan cinta kita sebagai titik ekuilibrium yang sempurna.",
    "Aku rela ikut lomba lari keliling dunia, asalkan engkai yang menjadi garis finishnya.",
    "PR-ku adalah merindukanmu. Lebih kuat dari Matematika, lebih luas dari Fisika, lebih kerasa dari Biologi.",
    "Cintaku kepadamu itu bagaikan metabolisme, yang gak akan berhenti sampai mati.",
    "Kalau jelangkungnya kaya kamu, dateng aku jemput, pulang aku anter deh.",
    "Makan apapun aku suka asal sama kamu, termasuk makan ati.",
    "Cinta itu kaya hukuman mati. Kalau nggak ditembak, ya digantung.",
    "Mencintaimu itu kayak narkoba: sekali coba jadi candu, gak dicoba bikin penasaran, ditinggalin bikin sakaw.",
    "Gue paling suka ngemil karena ngemil itu enak. Apalagi ngemilikin kamu sepenuhnya...",
    "Dunia ini cuma milik kita berdua. Yang lainnya cuma ngontrak.",
    "Bagi aku, semua hari itu adalah hari Selasa. Selasa di Surga bila dekat denganmu...",
    "Bagaimana kalau kita berdua jadi komplotan penjahat? Aku curi hatimu dan kamu curi hatiku.",
    "Kamu itu seperti kopi yang aku seruput pagi ini. Pahit, tapi bikin nagih.",
    "Aku sering cemburu sama lipstikmu. Dia bisa nyium kamu tiap hari, dari pagi sampai malam.",
    "Hanya mendengar namamu saja sudah bisa membuatku tersenyum seperti orang bodoh.",
    "Aku tau teman wanitamu bukan hanya satu, dan menyukaimu pun bukan hanya aku.",
    "Semenjak aku berhenti berharap pada dirimu, aku jadi tidak semangat dalam segala hal..",
    "Denganmu, jatuh cinta adalah patah hati paling sengaja.",
    "Sangat sulit merasakan kebahagiaan hidup tanpa kehadiran kamu disisiku.",
    "Melalui rasa rindu yang bergejolak dalam hati, di situ terkadang aku sangat membutuhkan dekap peluk kasih sayangmu.",
    "Sendainya kamu tahu, sampai saat ini aku masih mencintaimu.",
    "Terkadang aku iri sama layangan..talinya putus saja masih dikejar kejar dan gak rela direbut orang lain...",
    "Aku tidak tahu apa itu cinta, sampai akhirnya aku bertemu denganmu. Tapi, saat itu juga aku tahu rasanya patah hati.",
    "Mengejar itu capek, tapi lebih capek lagi menunggu\nMenunggu kamu menyadari keberadaanku...",
    "Jangan berhenti mencinta hanya karena pernah terluka. Karena tak ada pelangi tanpa hujan, tak ada cinta sejati tanpa tangisan.",
    "Aku punya sejuta alasan unutk melupakanmu, tapi tak ada yang bisa memaksaku untuk berhenti mencintaimu.",
    "Terkadang seseorang terasa sangat bodoh hanya untuk mencintai seseorang.",
    "Kamu adalah patah hati terbaik yang gak pernah aku sesali.",
    "Bukannya tak pantas ditunggu, hanya saja sering memberi harapan palsu.",
    "Sebagian diriku merasa sakit, Mengingat dirinya yang sangat dekat, tapi tak tersentuh.",
    "Hal yang terbaik dalam mencintai seseorang adalah dengan diam-diam mendo akannya.",
    "Kuharap aku bisa menghilangkan perasaan ini secepat aku kehilanganmu.",
    "Demi cinta kita menipu diri sendiri. Berusaha kuat nyatanya jatuh secara tak terhormat.",
    "Anggaplah aku rumahmu, jika kamu pergi kamu mengerti kemana arah pulang. Menetaplah bila kamu mau dan pergilah jika kamu bosan...",
    "Aku bingung, apakah aku harus kecewa atu tidak? Jika aku kecewa, emang siapa diriku baginya?\n\nKalau aku tidak kecewa, tapi aku menunggu ucapannya.",
    "Rinduku seperti ranting yang tetap berdiri.Meski tak satupun lagi dedaunan yang menemani, sampai akhirnya mengering, patah, dan mati.",
    "Kurasa kita sekarang hanya dua orang asing yang memiliki kenangan yang sama.",
    "Buatlah aku bisa membencimu walau hanya beberapa menit, agar tidak terlalu berat untuk melupakanmu.",
    "Aku mencintaimu dengan segenap hatiku, tapi kau malah membagi perasaanmu dengan orang lain.",
    "Mencintaimu mungkin menghancurkanku, tapi entah bagaimana meninggalkanmu tidak memperbaikiku.",
    "Kamu adalah yang utama dan pertama dalam hidupku. Tapi, aku adalah yang kedua bagimu.",
    "Jika kita hanya bisa dipertemukan dalam mimpi, aku ingin tidur selamanya.",
    "Melihatmu bahagia adalah kebahagiaanku, walaupun bahagiamu tanpa bersamaku.",
    "Aku terkadang iri dengan sebuah benda. Tidak memiliki rasa namun selalu dibutuhkan. Berbeda dengan aku yang memiliki rasa, namun ditinggalkan dan diabaikan...",
    "Bagaimana mungkin aku berpindah jika hanya padamu hatiku bersinggah?",
    "Kenangan tentangmu sudah seperti rumah bagiku. Sehingga setiap kali pikiranku melayang, pasti ujung-ujungnya akan selalu kembali kepadamu.",
    "Kenapa tisue bermanfaat? Karena cinta tak pernah kemarau. - Sujiwo Tejo",
    "Kalau mencintaimu adalah kesalahan, yasudah, biar aku salah terus saja.",
    "Sejak kenal kamu, aku jadi pengen belajar terus deh. Belajar jadi yang terbaik buat kamu.",
    "Ada yang bertingkah bodoh hanya untuk melihatmu tersenyum. Dan dia merasa bahagia akan hal itu.",
    "Aku bukan orang baik, tapi akan belajar jadi yang terbaik untuk kamu.",
    "Kita tidak mati, tapi lukanya yang membuat kita tidak bisa berjalan seperti dulu lagi.",
    "keberadaanmu bagaikan secangkir kopi yang aku butuhkan setiap pagi, yang dapat mendorongku untuk tetap bersemangat menjalani hari.",
    "Aku mau banget ngasih dunia ke kamu. Tapi karena itu nggak mungkin, maka aku akan kasih hal yang paling penting dalam hidupku, yaitu duniaku.",
    "Mending sing humoris tapi manis, ketimbang sok romantis tapi akhire tragis.",
    "Ben akhire ora kecewa, dewe kudu ngerti kapan waktune berharap lan kapan kudu mandeg.",
    "Aku ki wong Jowo seng ora ngerti artine 'I Love U'. Tapi aku ngertine mek 'Aku tresno awakmu'.",
    "Ora perlu ayu lan sugihmu, aku cukup mok setiani wes seneng ra karuan.",
    "Cintaku nang awakmu iku koyok kamera, fokus nang awakmu tok liyane mah ngeblur.",
    "Saben dino kegowo ngimpi tapi ora biso nduweni.",
    "Ora ketemu koe 30 dino rasane koyo sewulan.",
    "Aku tanpamu bagaikan sego kucing ilang karete. Ambyar.",
    "Pengenku, Aku iso muter wektu. Supoyo aku iso nemokne kowe lewih gasik. Ben Lewih dowo wektuku kanggo urip bareng sliramu.",
    "Aku ora pernah ngerti opo kui tresno, kajaba sak bare ketemu karo sliramu.",
    "Cinta aa ka neng moal leungit-leungit sanajan aa geus kawin deui.",
    "Kasabaran kaula aya batasna, tapi cinta kaula ka anjeun henteu aya se epna.",
    "Kanyaah akang moal luntur najan make Bayclean.",
    "Kenangan endah keur babarengan jeung anjeun ek tuluy diinget-inget nepi ka poho.",
    "Kuring moal bakal tiasa hirup sorangan, butuh bantosan jalmi sejen.",
    "Nyaahna aa ka neg teh jiga tukang bank keur nagih hutang (hayoh mumuntil).",
    "Kasabaran urang aya batasna, tapi cinta urang ka maneh moal aya beakna.",
    "Hayang rasana kuring ngarangkai kabeh kata cinta anu aya di dunya ieu, terus bade ku kuring kumpulkeun, supaya anjeun nyaho gede pisan rasa cinta kuring ka anjeun.",
    "Tenang wae neng, ari cinta Akang mah sapertos tembang krispatih; Tak lekang oleh waktu.",
    "Abdi sanes jalmi nu sampurna pikeun anjeun, sareng sanes oge nu paling alus kanggo anjeun. Tapi nu pasti, abdi jalmi hiji-hijina nu terus emut ka anjeun.",
    "Cukup jaringan aja yang hilang, kamu jangan.",
    "Sering sih dibikin makan ati. Tapi menyadari kamu masih di sini bikin bahagia lagi.",
    "Musuhku adalah mereka yang ingin memilikimu juga.",
    "Banyak yang selalu ada, tapi kalo cuma kamu yang aku mau, gimana?",
    "Jam tidurku hancur dirusak rindu.",
    "Cukup China aja yang jauh, cinta kita jangan.",
    "Yang penting itu kebahagiaan kamu, aku sih gak penting..",
    "Cuma satu keinginanku, dicintai olehmu..",
    "Aku tanpamu bagaikan ambulans tanpa wiuw wiuw wiuw.",
    "Cukup antartika aja yang jauh. Antarkita jangan."
  ]

  let bacot = [
    'Kamu suka kopi nggak? Aku sih suka. Tau kenapa alesannya? Kopi itu ibarat kamu, pahit sih tapi bikin candu jadi pingin terus.',
    'Gajian itu kayak mantan ya? Bisanya cuman lewat sebentar saja.',
    'Kata pak haji, cowok yang nggak mau pergi Sholat Jumat disuruh pakai rok aja.',
    'Kamu tahu mantan nggak? Mantan itu ibarat gajian, biasa numpang lewat dong di kehidupan kita.',
    'Aku suka kamu, kamu suka dia, tapi dia sayangnya nggak ke kamu. Wkwkw lucu ya? Cinta serumit ini.',
    'Google itu hebat ya? Tapi sayang sehebat-hebatnya Google nggak bisa menemukan jodoh kita.',
    'Terlalu sering memegang pensil alis dapat membuat mata menjadi buta, jika dicolok-colokkan ke mata.',
    'Saya bekerja keras karena sadar kalau uang nggak punya kaki buat jalan sendiri ke kantong saya.',
    'Jika kamu tak mampu meyakinkan dan memukau orang dengan kepintaranmu, bingungkan dia dengan kebodohanmu.',
    'Selelah-lelahnya bekerja, lebih lelah lagi kalau nganggur.',
    'Kita hidup di masa kalau salah kena marah, pas bener dibilang tumben.',
    'Nggak ada bahu pacar? Tenang aja, masih ada bahu jalan buat nyandar.',
    'Mencintai dirimu itu wajar, yang gak wajar mencintai bapakmu.',
    'Katanya enggak bisa bohong. Iyalah, mata kan cuma bisa melihat.',
    'Madu di tangan kananmu, racun di tangan kirimu, jodoh tetap di tangan tuhan.',
    'Selingkuh terjadi bukan karena ada niat, selingkuh terjadi karna pacar kamu masih laku.',
    'Netizen kalau senam jempol di ponsel nggak pakai pendinginan, pantes komennya bikin panas terus.',
    'Jodoh memang enggak kemana, tapi saingannya ada dimana-mana.',
    'Perasaan aku salah terus di matamu. Kalu gitu, besok aku pindah ke hidungmu.',
    'Jomblo tidak perlu malu, jomblo bukan berarti tidak laku, tapi memang tidak ada yang mau.',
    'Jika doamu belum terkabul maka bersabar, ingatlah bahwa yang berdoa bukan cuma kamu!',
    'Masih berharap dan terus berharap lama-lama aku jadi juara harapan.',
    'Manusia boleh berencana, tapi akhirnya saldo juga yang menentukan.',
    'Statusnya rohani, kelakuannya rohalus.',
    'Kegagalan bukan suatu keberhasilan.',
    'Tadi mau makan bakso, cuma kok panas banget, keliatannya baksonya lagi demam.',
    'Aku juga pernah kaya, waktu gajian.',
    'Aku diputusin sama pacar karena kita beda keyakinan. Aku yakin kalau aku ganteng, tapi dia enggak.',
    'Masa depanmu tergantung pada mimpimu, maka perbanyaklah tidur.',
    'Seberat apapun pekerjaanmu, akan semakin ringan jika tidak dibawa.',
    'Jangan terlalu berharap! nanti jatuhnya sakit!',
    'Ingat! Anda itu jomblo',
    'Gak tau mau ngetik apa',
  ]

  let kataKata = [
    "Orang bilang jadi penyair itu susah Nggak Mereka belum jatuh cinta aja",
    "Kalau misal aku lahir seribu tahun yang lalu, aku pasti akan tetap menunggumu",
    "Kamu tau gak, kenapa kalo belajar menghafal aku selalu melihat ke atas? Soalnya kalo merem langsung kebayang wajah kamu",
    "Aneh rasanya bagaimana dengan hanya mendengar namamu saja, hatiku bisa tersayat teriris ngilu seperti luka basah yang tersiram cuka?",
    "Kalau jadi ksatria itu gampang Yang susah itu jadi pahlawan hati kamu",
    "Kalau pahlawan punya baju besi, aku nggak Soalnya aku rela tertusuk cinta kamu",
    "Ketika kamu telah membuatnya bahagia dan dia masih memilih orang lain, yakinlah Mungkin kamu belum kaya!",
    "Kamu seperti pensil warna deh, bisa mewarnai hari-hariku",
    "Kalo kamu bidadari, akan kupatahkan semua sayapmu karena aku gak rela kamu kembali ke surga",
    "Pahlawan itu kan mereka yang berjuang buat negara, berarti aku juga pahlawan dong, soalnya merjuangin masa depan kita",
    "Kamu itu kayak pahlawan ya, hebat meruntuhkan pertahanan hatiku",
    "Kalau pahlawan dikenang, kamu nggak bakalan jadi kenangan",
    "Makan apa pun aku suka asal sama kamu, termasuk makan ati",
    "Kalau kamu jadi senar gitar, aku nggak mau jadi gitaris Aku nggak mau ada risiko mutusin kamu",
    "Aku itu kayak kipas angin Meski tengok kanan tengok kiri, tetap ada di tempat yang sama Tetep sama kamu, tetep mencintai kamu",
    "Kalau aku jadi wakil rakyat, pasti aku gagal Soalnya aku selalu mikirin kamu, bukan rakyat",
    "Kalau aku jadi gubernur, aku pasti langsung dimarahi rakyat Soalnya, aku nggak bisa ngomong lancar kalau kamu nggak di sampingku",
    "Aku adalah murid teladan karena setiap hari aku selalu belajar, belajar mencintaimu sepenuh hati",
    "Lihat kebunku, penuh dengan bunga Lihat matamu, hatiku berbunga-bunga",
    "Beda operator nggak apa-apa deh, asal nanti nama kamu sama aku di Kartu Keluarga yang sama",
    "Aku rela menunggu, meski kamu tak memberiku kabar, bahkan aku sadar jika ingin kamu tinggalkan",
    "Aku tidak bisa berjanji untuk menjadi yang baik, tapi aku berjanji akan selalu mendampingi kamu",
    "Sampai detik ini kamu masih menjadi alasan kenapa hatiku belum mau menerima siapapun",
    "Jika aku bisa menjadi segalanya, aku ingin menjadi air mata kamu Lalu aku bisa lahir di matamu, hidup di pipimu, dan mati di bibirmu",
    "Kalau aku jadi wakil rakyat aku pasti gagal, gimana mau mikirin rakyat kalau yang selalu ada dipikiran aku hanyalah dirimu",
    "Entah mengapa tiap melihat kamu, aku keingat akan ujian Susah sih, tetapi tetap saja harus diperjuangkan demi mendapatkanmu",
    "Semua orang bisa bilang cinta, akan tetapi tak semua orang bisa setia",
    "Aku mencintaimu lebih dari arti kata-kata, mengungkapkan perasaan, dan memikirkan pikiran",
    "Cinta aku tuh kaya kamera, kalau udah fokus ke satu orang yang lain pasti ngeblur",
    "Aku lebih suka apel daripada anggur, soalnya aku lebih suka ngapelin kamu daripada nganggurin kamu",
    "Hidup tidak selalu mudah, tapi jauh lebih mudah dengan kamu di sisiku",
    "Hanya dengan hitungan jam kita akan bertemu lagi, tapi rasanya sangat lama bagaikan satu dekade Tak terbayang seberapa girangnya hati ini berada dalam pelukanmu",
    "Saat aku sedang bersamamu rasanya 1 jam hanya 1 detik, tetapi jika aku jauh darimu rasanya 1 hari menjadi 1 tahun",
    "Kolak pisang tahu sumedang, walau jarak membentang cintaku takkan pernah hilang",
    "Aku ingin menjadi satu-satunya, bukan salah satunya",
    "Lihat kebunku, penuh dengan bunga Lihat matamu, hatiku berbunga-bunga",
    "Berjanjilah untuk terus bersamaku sekarang, esok, dan selamanya",
    "Semenjak aku berhenti berharap pada dirimu, aku jadi tidak semangat dalam segala hal",
    "Mungkin kebahagiaan bersamamu hanya seperti mimpi, tapi biarlah mimpi itu terus menemani di setiap tidurku",
    "Semakin aku tahu bagaimana sikapmu, semakin aku lelah untuk mempertahankan hubungan ini",
    "Rindu tidak hanya muncul karena jarak yang terpisah, tapi juga karena keinginan yang tidak terwujud",
    "Kamu tidak akan pernah jauh dariku, kemanapun aku pergi kamu selalu ada, karena kamu selalu di hatiku, yang jauh hanya raga kita bukan hati kita",
    "Aku tahu dalam setiap tatapanku, kita terhalang oleh jarak dan waktu, tapi aku yakin kalau nanti kita pasti bisa bersatu",
    "Merindukanmu tanpa pernah bertemu sama halnya dengan menciptakan lagu yang tak pernah ternyayikan",
    "Ada kalanya jarak selalu menjadi penghalang antara aku sama kamu, tapi tetap saja di hatiku kita selalu dekat",
    "Jika hati ini tak mampu membendung segala kerinduan, apa daya tak ada yang bisa aku lakukan selain mendoakanmu",
    "Mungkin di saat ini aku hanya bisa menahan kerinduan ini Sampai tiba saatnya nanti aku bisa bertemu dan melepaskan kerinduan ini bersamamu",
    "Melalui rasa rindu yang bergejolak dalam hati, di situ terkadang aku sangat membutuhkan dekap peluk kasih sayangmu",
    "Dalam dinginnya malam, tak kuingat lagi; Berapa sering aku memikirkanmu juga merindukanmu",
    "Merindukanmu itu seperti hujan yang datang tiba-tiba dan bertahan lama Dan bahkan setelah hujan reda, rinduku masih terasa",
    "Kalau jelangkungnya kaya kamu, dateng aku jemput, pulang aku anter, deh",
    "Makan apapun aku suka asal sama kamu, termasuk makan hati",
    "Cinta itu kaya hukuman mati Kalau nggak ditembak, ya digantung",
    "Mencintaimu itu kayak narkoba: sekali coba jadi candu, gak dicoba bikin penasaran, ditinggalin bikin sakau",
    "Gue paling suka ngemil karena ngemil itu enak Apalagi ngemilikin kamu sepenuhnya",
    "Dunia ini cuma milik kita berdua Yang lainnya cuma ngontrak",
    "Bagi aku, semua hari itu adalah hari Selasa Selasa di Surga bila dekat denganmu",
    "Bagaimana kalau kita berdua jadi komplotan penjahat? Aku curi hatimu dan kamu curi hatiku",
    "Kamu itu seperti kopi yang aku seruput pagi ini Pahit, tapi bikin nagih",
    "Aku sering cemburu sama lipstikmu Dia bisa nyium kamu tiap hari, dari pagi sampai malam",
    "Di jiwa yang santuy terdapat jiwa kebucinan yang mendarah daging Kwkwk",
    "Bingung pengen marah-marah Tapi bingung pengen marah ke siapa? Terkadang diam memang jalan terbaik buat masyarakat santuy",
    "Awalnya sih diperlakukan dengan istimewa Tapi akhir-akhirnya meninggalkan rasa kecewa sadd bngst 🙁",
    "Gak butuh orang yang sayangnya cuma sementara",
    "Pengen punya temen yang bisa di tabokin",
    "Melalui rasa rindu yang bergejolak dalam hati, di situ terkadang aku sangat membutuhkan dekap peluk kasih sayangmu",
    "Hanya mendengar namamu saja sudah bisa membuatku tersenyum seperti orang bodoh",
    "Aku tau teman wanitamu bukan hanya satu dan menyukaimu pun bukan hanya aku",
    "Semenjak aku berhenti berharap pada dirimu, aku jadi tidak semangat dalam segala hal",
    "Terkadang aku iri sama layangan Talinya putus saja masih dikejar kejar dan gak rela direbut orang lain",
    "Aku tidak tahu apa itu cinta, sampai akhirnya aku bertemu denganmu Namun, saat itu juga aku tahu rasanya patah hati",
    "Mengejar itu capek, tapi lebih capek lagi menunggu Menunggu kamu menyadari keberadaanku",
    "Denganmu, jatuh cinta adalah patah hati paling sengaja",
    "Sangat sulit merasakan kebahagiaan hidup tanpa kehadiran kamu disisiku",
    "Sendainya kamu tahu, sampai saat ini aku masih mencintaimu",
    "Kamu sudah menjadi bagian dari rencana masa depanku, kamu pergi, aku takut masa depanku tak lagi sempurna tanpamu",
    "Ketika Tuhan memberikan satu kebahagiaan untukku, maka aku memilih memberikan kebahagiaan itu untukmu",
    "Cinta tapi tak dianggap itu seperti sakit tapi tak berdarah",
    "Aku tidak tahu apakah tempatku benar-benar di sini Aku tidak punya seorangpun untuk diajak bicara",
    "Kamu benar-benar mencintai seseorang ketika kamu tidak bisa membencinya meskipun ia telah menyakitimu",
    "Tidak peduli seberapa ingin kamu kembali ke masa lalu, di sana tetap tidak akan ada hal baru yang bisa kamu lihat",
    "Aku mencintaimu dengan segenap hatiku, tapi kau malah membagi perasaanmu dengan orang lain",
    "Aku bingung, apakah aku harus kecewa atu tidak? Jika aku kecewa, emang siapa diriku baginya? Kalau aku tidak kecewa, tapi aku menunggu ucapannya",
    "Melihatmu bahagia adalah kebahagiaanku, walaupun bahagiamu tanpa bersamaku",
    "Rinduku seperti ranting yang tetap berdiriMeski tak satupun lagi dedaunan yang menemani, sampai akhirnya mengering, patah, dan mati",
    "Kurasa kita sekarang hanya dua orang asing yang memiliki kenangan yang sama",
    "Buatlah aku bisa membencimu walau hanya beberapa menit agar tidak terlalu berat untuk melupakanmu",
    "Aku terkadang iri dengan sebuah benda Tidak memiliki rasa namun selalu dibutuhkan Berbeda dengan aku yang memiliki rasa, namun ditinggalkan dan diabaikan",
    "Demi cinta kita menipu diri sendiri Berusaha kuat nyatanya jatuh secara tak terhormat",
    "Mencintaimu mungkin menghancurkanku, tapi entah bagaimana meninggalkanmu tidak memperbaikiku",
    "Kamu adalah yang utama dan pertama dalam hidupku, tapi aku adalah yang kedua bagimu",
    "Jangan berhenti mencinta hanya karena pernah terluka Karena tak ada pelangi tanpa hujan, tak ada cinta sejati tanpa tangisan",
    "Aku punya sejuta alasan untuk melupakanmu, tapi tak ada yang bisa memaksaku untuk berhenti mencintaimu",
    "Terkadang seseorang terasa sangat bodoh hanya untuk mencintai seseorang",
    "Bukannya tak pantas ditunggu, hanya saja sering memberi harapan palsu",
    "Sebagian diriku merasa sakit, mengingat dirinya yang sangat dekat, tapi tak tersentuh",
    "Hal yang terbaik dalam mencintai seseorang adalah dengan diam-diam mendoakannya",
    "Kuharap aku bisa menghilangkan perasaan ini secepat aku kehilanganmu",
    "Anggaplah aku rumahmu, jika kamu pergi kamu mengerti kemana arah pulang Menetaplah bila kamu mau dan pergilah jika kamu bosan",
    "Kamu adalah patah hati terbaik yang gak pernah aku sesali",
    "Jika mencintaimu itu seperti bersekolah, tanggal merah pun aku akan hadir Karena mencintaimu tak ada kata libur bagiku",
    "Balon kalau diisi angin semakin lama semakin ringan Hatiku kalau diisi kamu semakin lama semakin ingin ke pelaminan",
    "Menahan lapar aku bisa, menahan rindu padamu aku tak mampu",
    "Cintaku ke kamu tuh kayak utang, awalnya kecil, didiemin, tau-tau gede sendiri",
    "Kamu punya spidol item ga? Buat apa? Mau warnain kalender, biar ga ada kata libur dalam mencintaimu",
    "Kalau aku jadi wakil rakyat aku pasti gagal deh Gimana mau mikirin rakyat, kalau yang selalu ada di pikiranku hanyalah kamu",
    "Aku sukanya sih apel dibandingkan anggur, makanya aku suka ngapelin kamu ketimbang nganggurin kamu",
    "Saat di sampingmu, aku seperti mentega di atas wajan panas Langsung meleleh",
    "Daripada aku daftar jadi boyband, mending aku daftar jadi boyfriend kamu aja dech",
    "Untung rinduku padamu itu tidak bayar Kalau bayar, aku sudah jadi gembel",
    "Kamu duduk di sampingku dan kurasa aku lupa bagaimana bernafas",
    "Sungguh menakjubkan bagaimana satu percakapan kecil dapat mengubah segalanya selamanya",
    "Kamu harus membiarkan aku mencintaimu, biarkan aku menjadi orang yang memberimu semua yang kamu inginkan dan butuhkan",
    "Aku membutuhkanmu karena kamu membuatku tersenyum bahkan ketika kamu tidak di sisiku",
    "Aku mengagumi pikiranmu Aku jatuh cinta pada kepribadianmu Penampilanmu hanya bonus",
    "Mencintaimu dan dicintai olehmu adalah hadiah paling berharga yang pernah aku terima",
    "Aku tidak ingin menjadi favoritmu atau yang terbaik untukmu Aku ingin menjadi satu-satunya dalam hatimu dan melupakan sisanya",
    "Sulit bagiku untuk berpura-pura bahwa aku tidak menyukaimu padahal pada kenyataannya aku tergila-gila padamu",
    "Ketika aku memikirkanmu, aku akhirnya memiliki seringai bodoh di wajahku",
    "Biarkan aku membuatmu bahagia selamanya Kamu hanya perlu melakukan satu hal: jatuh cinta denganku",
    "Kolak pisang tahu Sumedang, walau jarak membentang cintaku takkan hilang",
    "Bagiku, semua hari itu Selasa Selasa indah bila di dekatmu",
    "Aku tanpamu bagaikan ambulans tanpa wiuw wiuw wiuw",
    "Sayang, kita putus saja, ya? Kita sudah nggak cocok buat pacaran, kita cocoknya itu menikah",
    "Kamu sebaiknya selalu pakai wifi agar hati kita selalu terkoneksi",
    "Ngemil apa yang paling enak? Ngemilikin kamu sepenuhnya",
    "Kamu adalah alasanku tetap bertahan di tanggal tua",
    "Aku rela dibilang bucin, yang penting kamu nggak ngilang",
    "Saat bertemu denganmu, jantung hatiku terasa berhenti berdetak Tapi, kenapa nggak mati-mati, ya?",
    "Aku nggak rela kalau kamu demam, tapi aku rela kalau aku demam rindu sama kamu",
    "Nggak apa-apa kok kamu gendutan, hatiku masih muat tuh buat kamu",
    "Beda operator nggak apa-apa deh, asal nanti nama kamu sama aku di Kartu Keluarga yang sama",
    "Laut kan kusebrangi, gunung pun akan kudaki hanya untukmu",
    "Tatapanmu memanglah sederhana, namun dapat mengalihkan dunia",
    "Aku nggak suka kalau kehujanan, tapi aku selalu suka kalau kehujanan cinta kamu",
    "Kamu tahu nggak, aku seperti mentega, kamu seperti wajan panas Soalnya aku meleleh tiap lihat kamu",
    "Kalau aku jadi wakil rakyat, pasti aku gagal Soalnya aku selalu mikirin kamu, bukan rakyat",
    "Aku divonis menjadi terdakwa karena telah mengambil hatimu Dan hukumannya mencintaimu seumur hidupku",
    "Lampu itu pasti cemburu sama kamu, soalnya mata kamu terang banget buat menerangi masa depanku",
    "Kalau pahlawan punya baju besi, aku nggak Soalnya aku rela tertusuk cinta kamu",
    "Lihat kebunku, penuh dengan bunga Lihat matamu, hatiku berbunga-bunga",
    "Jika rindu ibarat uang, mungkin aku sudah menjadi orang terkaya di dunia karena telah menanggung rindu padamu",
    "Kamu itu kayak pahlawan ya, hebat meruntuhkan pertahanan hatiku",
    "Kalau aku jadi gubernur, aku pasti langsung dimarahi rakyat Soalnya, aku nggak bisa ngomong lancar kalau kamu nggak di sampingku",
    "Tiap kali kamu senyum, seluruh dunia juga sedang tersenyum",
    "Tatapanmu memanglah sederhana, namun dapat mengalihkan dunia",
    "Berjanjilah untuk terus bersamaku sekarang, esok, dan selamanya",
    "Bila mencintaimu adalah ilusi, maka izinkan aku berimajinasi selamanya",
    "Aku nggak percaya sama pandangan pertama Aku percayanya sama takdir kalau kamu bakalan jadi jodohku",
    "Aku nggak rela kalau harus jadi penikmat senja, aku maunya jadi penikmat senyummu",
    "Kamu tahu kalau sungai Danube itu terpanjang di Eropa? Sepanjang itulah cintaku sama kamu",
    "Mata kamu itu sama persis energinya sama matahari kalau digabungin sama bulan Nggak tertandingi",
    "Jika kamu adalah bunga, maka aku adalah sang lebah yang senantiasa membuatmu indah",
    "Di bumi, gerak jatuh namanya gravitasi, di hati namanya cinta selalu bersemi",
    "Aku mencintaimu seperti anak kecil yang suka es krim",
    "Cinta laksana pembodohan Hanya karena namamu saja sudah membuatku gila",
    "Aku memang pendiam, diam-diam jatuh cinta sama kamu",
    "Aku selalu mendung tiap kali kamu pergi jauh",
    "Aku tak butuh hartamu, yang aku butuhkan hanyalah senyum bahagia dan canda tawamu saja",
    "Ketemu sama kamu itu kayak mau melihat meteor Susah, tapi indah",
    "Aku bersedia menjadi badutmu setiap hari dengan bertingkah lucu untuk membuatmu selalu tertawa dan melupakan air mata",
    "Kamu itu kayak kopi Bukan pahit, tapi candu",
    "Kamu itu kayak pelangi, ya Ada sehabis mendung di hatiku",
    "Cintaku seperti jam pasir Semakin hati kian terpenuhi, maka otak akan kian tak terisi",
    "Kalau kamu jadi senar gitar, aku nggak mau jadi gitaris Aku nggak mau ada risiko mutusin kamu",
    "Jangan rindu, berat, kamu nggak akan kuat Biar aku saja yang merindukanmu",
    "Kalau sabar adalah barang yang diperjualbelikan, maka penantianku akan kehadiran dirimu ini sudah membuatku menjadi gelandangan",
    "Hujan pergi ninggalin pelangi, kalau kamu pergi ninggalin air mataku",
    "Tuku lilin, entuk bonus fanta Meskipun kowe nyebelin, nanging aku tetap cinta(Beli lilin, dapat bonus fanta Msekipun kamu nyebelin, aku tetap cinta)",
    "Ora penting mikir malam mingguan, seng penting malam lamaran(Nggak penting mikir malam minggu, yang penting malam lamaran)",
    "Kacang iku gurih, tapi nek dikacangin iku perih(Kacang itu gurih, tapi kalau dikacangin itu perih)",
    "Saat dewe podo–podo adoh, siji sing kudu koe ngerti, bakal tak jogo tresno iki sampe matek(Saat jarak memisahkan kita, satu hal yang harus kamu tahu, aku akan menjaga cinta ini sampai mati)",
    "Sing wis lunga lalekno, sing durung teko entenono, sing wis ono syukurono(Yang sudah pergi lupakanlah, yang belum datang tunggulah, dan yang sudah ada syukurilah)",
    "Koe kuwi koyo bintang, sing indah didelok tapi susah untuk digapai”(Kamu itu seperti bintang, yang indah dilihat tapi susah untuk digapai)",
    "Wajahmu jan koyo wong susah Iyo, susah dilalekne(Wajahmu seperti orang susah Iya, susah untuk dilupakan)",
    "Akeh manungsa ngrasakaken tresna, tapi lalai lan ora kenal opo kui hakekate atresna(Banyak manusia merasakan cinta, namun mereka lupa tidak mengenal hakikat cinta sebenarnya)",
    "Mergo seng gaene ngekek’i cokelat bakal kalah karo seng ngewehi seperangkat alat sholat karo nyanyi lagu akad(Karena yang sering memberi cokelat akan kalah dengan yang memberi seperangkat alat solat dan nyanyi lagu akad)",
    "Rasa nyaman sing sempurna yo iku lek kowe gelem meluk aku(Rasa nyaman yang sempurna ya itu kalau kamu mau meluk aku)",
    "Iso ae aku ngelalikne koe tapi kenangane kui seng susah dilaleke(Bisa saja aku melupakan kamu tapi kenangannya itu yang susah dilupakan)",
    "Uwong duwe pacar iku kudu sabar ambek pasangane Opo meneh sing gak duwe(Orang yang punya pacar itu haruslah bersabar dengan pasangan yang dimilikinya Apalagi yang gak punya)",
    "Aku ra njaluk luweh, aku nggur njalok ojo lungo nek ati(Aku nggak minta banyak, aku hanya minta jangan pergi dari hati)",
    "Jelas aku butuh atimu, butuh awakmu, butuh perhatianmu, ora butuh duwitmu(Jelas aku butuh hatimu, butuh kamu, butuh perhatianmu, tidak butuh uangmu)",
    "Aku ora butuh GPS, nek karo kowe aku wis yakin kudu ning ngendi(Aku tidak butuh GPS, kalau sama kamu, aku sudah yakin mau ke mana)",
    "Kawula mung saderma, mobah-mosik kersaning hyang sukmo(Lakukan yang kita bisa, setelahnya serahkan kepada Tuhan)",
    "Dalan lurus akeh jeglongan, menggok sithik nemu tikungan Yen wis cinta kudu bertahan, ben gak ngrasakke kelangan(Jalan lurus banyak berlubang, belok sedikit ada tikungan Kalau sudah cinta harus bertahan, agar tak merasakan kehilangan)",
    "Konco dadi cinta Sampek kegowo turu, ngimpi ngusap pipimu Tansah nyoto keroso konco dadi tresno(Teman jadi cinta sampai terbawa tidur, mimpi mengusap pipimu Seperti kenyataan terasa seperti teman jadi cinta)",
    "Gusti iku cedhak tanpa senggolan, adoh tanpa wangenan(Tuhan itu dekat meski tubuh kita tidak dapat menyentuhnya, jauh tiada batasan)",
    "Aku pancen lelah, tapi aku janji ora bakal nyerah nggo nyanding sliramu(Aku memang lelah, tapi aku janji tidak akan menyerah untuk bersanding denganmu)",
    "Move on kuwi dudu berusaha nglalekke ya, tapi ngikhlaske lan berusaha ngentukke sing luwih apik luwih seko sing mbiyen-mbiyen(Move on itu bukan berusaha melupakan ya, tapi mengikhlaskan dan berusaha mendapatkan yang lebih baik dari sebelum-sebelumnya)",
    "Natas, nitis, netes(Dari Tuhan kita ada, bersama Tuhan kita hidup, dan bersatu dengan Tuhan kita kembali)",
    "Cintaku nang awakmu iku koyok kamera, fokus nang awakmu tok liyane ngeblur(Cintaku padamu seperti kamera, fokus pada dirimu, yang lain ngeblur)",
    "Aku duduk cah romantis sing iso berkata kata manis, nanging aku mung bocah humoris sing iso berkata manis(Aku bukan anak romantis yang bisa berkata manis, tapi aku anak humoris yang bisa berkata manis)",
    "Kowe gelem ngajari aku ora? Ngajari ben pantes nggo kowe(Kamu mau tidak mengajari aku? Ajari aku agar pantas untukmu)",
    "Witing tresno jalaran seko sering dijak dolan rono-rono(Cinta tumbuh dari sering diajak jalan ke sana kemari)",
    "Ojo lungo, aku jek tresno(Jangan pergi, aku masih cinta)",
    "Nyenderlah neng pundak ku, Sampek koe ngrasak ke nyaman, Mergo wes kudune koyo ngunu aku nggawe nyaman atimu(Bersandarlah di pundakku sampai kau merasakan nyaman, karena sudah seharusnnya aku memang aku membuatmu nyaman)",
    "Rino wengi aku tansah kelingan sliramu(Siang malam aku selalu teringat dirimu)",
    "Seng paling tak wedeni orep neng dunio udu kelangan koe, tapi wedi nek koe kelangan kebahagiaan ne sampean(Yang paling ku takutkan dalam dunia ini bukanlah kehilanganmu, tapi aku takut kamu kehilangan kebahagiaanmu)",
    "Mak deg, mak tratap Makmu makku besanan(Bikin deg-degan, bikin tratapan Ibumu, ibuku jadi besan)",
    "Kerjo tak lakoni, duwet tak tabungi, insyaallah tahun ngarep, sholatmu tak imami(Kerja aku lakukan, uang aku tabung, Insya Allah tahun depan, salatmu aku imami)",
    "Aku tanpamu bagaikan sego kucing ilang karete Ambyar(Aku tanpamu bagai nasi kucing hilang karetnya, hancur)",
    "Gusti yen arek iku jodohku tulung dicidakaken, yen mboten joduhku tulung dijodohaken(Tuhan jika dia adalah jodohku tolong didekatkan, dan jika bukan tolong dijodohkan)",
    "Kaosku suwek kecantol lawang Gayane cuek, asline sayang(Kaosku robek tergores pintu Bergaya cuek, aslinya sayang)",
    "Rino wengi aku tansah kelingan, pengenku kowe tak sayang(Siang malam aku selalu teringat, inginku kau kucintai)",
    "Prinsipku saiki mung maju tak gentar, mundur tak ganjel, sisane serahke Gusti Allah(Prinsipku sekarang maju tak gentar, mundur diganjel, sisanya pasrahkan ke Allah)",
    "Kowe wis tak wanti wanti ojo nganti ninggal janji, ojo nganti medot taline asmoro, welasno aku sing nunggu awakmu nganti awak ku tinggal balung karo kulit(Kamu sudah aku ingatkan jangan melupakan janji, jangan sampai memutuskan ikatan cinta ini, ingatlah diriku yang menunggu dirimu sampai badanku hanya tersisa tulang dan kulit)",
    "Gusti Allah paring pitedah bisa lewat bungah, bisa lewat susah(Allah memberikan petunjuk bisa melalui bahagia, bisa melalui derita)",
    "Tresno iku kadang koyo criping telo Iso ajur nek ora ngati-ati le nggowo(Cinta terkadang seperti keripik singkong, bisa hancur jika tidak hati-hati dibawa)",
    "Mergo nyawang fotomu, dadi nyungsep neng lendutan(Gara-gara melihat fotomu, jadi nyungsep di lumpur)",
    "Aku ora pernah ngerti opo kui tresno, kajaba sak bare ketemu karo sliramu(Aku tidak pernah tahu cinta itu apa, kecuali setelah bertemu denganmu)",
    "Cinta dudu perkoro sepiro kerepe kowe ngucapke, tapi sepiro akehe seng mbok buktike(Cinta bukan perkara seberapa sering kamu mengucapkannya, tapi seberapa banyak kamu membuktikannya)",
    "Suket teles kudanan sore, atiku ngenes mikirna kowe(Rumput basah kehujanan di sore hari, hatiku sakit karena memikirkan kamu terus)",
    "Pengenku, aku iso muter wektu Supoyo aku iso nemokne kowe lewih gasik Ben lewih dowo wektuku kanggo urip bareng sliramu(Aku berharap, aku bisa memutar waktu kembali Di mana aku bisa lebih awal menemukan dan mencintaimu lebih lama)",
    "Mbangun kromo ingkang satuhu, boten cekap bilih ngagem sepisan roso katresnan Hananging butuh pirang pirang katresnan lumeber ning pasangan uripmu siji kui(Pernikahan yang sukses tidak membutuhkan sekali jatuh cinta, tetapi berkali kali jatuh cinta pada orang yang sama)",
    "Kowe ngeluh etuk wong seng salah terus, coba kowe luwih peka sitik pas dicedakke karo uwong seng bener yo(Kamu terus mengeluh dapat orang yang salah terus, coba kamu lebih peka sedikit ketika bersama orang yang benar)",
    "Witing tresno jalaran soko kulino Witing mulyo jalaran wani rekoso(Bahwa cinta itu tumbuh lantaran ada kebiasaan, kemakmuran itu timbul karena berani bersusah dahulu)",
    "Sek penting kowe bahagia, tapi mung karo aku Ora karo wong liya(Yang penting kamu bahagia, tapi cuma sama aku Bukan sama orang lain)",
    "Kadang mripat iso salah ndelok, kuping iso salah krungu, lambe iso salah ngomong, tapi ati ora bakal iso diapusi(Terkadang mata bisa salah melihat, telinga bisa salah mendengar, mulut bisa salah mengucap, tapi hati tak bisa dibohongi dan membohongi)",
    "Semoga jodohku adalah orang yang selalu aku sebut dalam doaku tiap hari",
    "Cinta memang aneh, bahkan kau tak bisa memilih dengan siapa kau akan jatuh cinta",
    "Aku tetap mencintai kamu, meski mungkin jiwa ini tak akan pernah saling memiliki",
    "Aku memilih untuk sendiri, bukan karena menunggu yang sempurna, tetapi butuh yang tak pernah menyerah",
    "Seorang yang single diciptakan bersama pasangan yang belum ditemukannya",
    "Jomblo Mungkin itu cara Tuhan untuk mengatakan 'Istirahatlah dari cinta yang salah'",
    "Jomblo adalah anak muda yang mendahulukan pengembangan pribadinya untuk cinta yang lebih berkelas nantinya",
    "Aku bukan mencari seseorang yang sempurna, tapi aku mencari orang yang menjadi sempurna berkat kelebihanku",
    "Pacar orang adalah jodoh kita yang tertunda",
    "Jomlo pasti berlalu Semua ada saatnya, saat semua kesendirian menjadi sebuah kebersamaan dengannya kekasih halal Bersabarlah",
    "Romeo rela mati untuk Juliet, Jack mati karena menyelamatkan Rose Intinya, kalau tetap mau hidup, jadilah single",
    "Aku mencari orang bukan dari kelebihannya, tapi aku mencari orang dari ketulusan hatinya",
    "Jodoh bukan sendal jepit, yang kerap tertukar Jadi teruslah berada dalam perjuangan yang semestinya",
    "Jika kamu penikmat kopi dan senja, maka izinkan aku mencintaimu tanpa henti dan jeda",
    "Tuhan baik banget ya, aku minta bahagia, dikasihnya kamu",
    "Kalau mawar itu warna merah, kalau hadirmu itu warna-warni dalam hidupku",
    "Kalau kamu jadi senar gitar, aku nggak mau jadi gitarisnya Karena aku nggak mau mutusin kamu",
    "Bila mencintaimu adalah ilusi, maka izinkan aku berimajinasi selamanya",
    "Sayang tugas aku hanya mencintaimu, bukan melawan takdir",
    "Saat aku sedang bersamamu rasanya 1 jam hanya 1 detik, tetapi jika aku jauh darimu rasanya 1 hari menjadi 1 tahun",
    "Kolak pisang tahu sumedang, walau jarak membentang cintaku takkan pernah hilang",
    "Aku ingin menjadi satu-satunya, bukan salah satunya",
    "Aku tidak bisa berjanji untuk menjadi yang baik, tapi aku berjanji akan selalu mendampingi kamu",
    "Kalau aku jadi wakil rakyat aku pasti gagal, gimana mau mikirin rakyat kalau yang selalu ada dipikiran aku hanyalah dirimu",
    "Lihat kebunku, penuh dengan bunga Lihat matamu, hatiku berbunga-bunga",
    "Berjanjilah untuk terus bersamaku sekarang, esok, dan selamanya",
    "Kangen kamu itu sudah jadi hobi aku",
    "Kamu salah satu alasanku untuk beli paket internet, kangen terus soalnya",
    "Rindu tak akan pernah jemu, membuat candu, membuat malam semakin biru, kamu",
    "Rindu tidak hanya muncul karena jarak yang terpisah, tapi juga karena keinginan yang tidak terwujud",
    "Kamu tidak akan pernah jauh dariku, kemanapun aku pergi kamu selalu ada, karena kamu selalu di hatiku, yang jauh hanya raga kita bukan hati kita",
    "Aku tahu dalam setiap tatapanku, kita terhalang oleh jarak dan waktu, tapi aku yakin kalau nanti kita pasti bisa bersatu",
    "Merindukanmu tanpa pernah bertemu sama halnya dengan menciptakan lagu yang tak pernah ternyayikan",
    "Ada kalanya jarak selalu menjadi penghalang antara aku sama kamu, tapi tetap saja di hatiku kita selalu dekat",
    "Jika hati ini tak mampu membendung segala kerinduan, apa daya tak ada yang bisa aku lakukan selain mendoakanmu",
    "Mungkin di saat ini aku hanya bisa menahan kerinduan ini Sampai tiba saatnya nanti aku bisa bertemu dan melepaskan kerinduan ini bersamamu",
    "Melalui rasa rindu yang bergejolak dalam hati, di situ terkadang aku sangat membutuhkan dekap peluk kasih sayangmu",
    "Dalam dinginnya malam, tak kuingat lagi; Berapa sering aku memikirkanmu juga merindukanmu",
    "Merindukanmu itu seperti hujan yang datang tiba-tiba dan bertahan lama Dan bahkan setelah hujan reda, rinduku masih terasa",
    "Mau tanggal merah sekalipun, aku nggak akan libur untuk mikirin kamu",
    "Teringat kisah cinta di masa SMA yang begitu indah dan menyenangkan bersamamu",
    "Bolehkah aku belajar mencintaimu mengalahkan Matematika dan Fisika?",
    "Tahu gak perbedaan pensil sama wajah kamu? Kalau pensil tulisannya bisa dihapus, tapi kalau wajah kamu gak akan ada yang bisa hapus dari pikiran aku",
    "Bukan Ujian Nasional besok yang harus aku khawatirkan, tapi ujian hidup yang aku lalui setelah kamu meninggalkanku",
    "Satu hal kebahagiaan di sekolah yang terus membuatku semangat adalah bisa melihat senyumanmu setiap hari",
    "Kamu tahu gak perbedaanya kalau ke sekolah sama ke rumah kamu? Kalo ke sekolah pasti yang di bawa itu buku dan pulpen, tapi kalo ke rumah kamu, aku cukup membawa hati dan cinta",
    "Aku gak sedih kok kalo besok hari Senin, aku sedihnya kalau gak ketemu kamu",
    "Momen cintaku tegak lurus dengan momen cintamu Menjadikan cinta kita sebagai titik ekuilibrium yang sempurna",
    "Aku rela ikut lomba lari keliling dunia, asalkan engkau yang menjadi garis finish-nya",
    "PR-ku adalah merindukanmu Lebih kuat dari Matematika, lebih luas dari Fisika, lebih kerasa dari Biologi",
    "Cintaku kepadamu itu bagaikan metabolisme, yang gak akan berhenti sampai mati",
    "Aku tanpamu bagaikan ambulans tanpa wiuw wiuw wiuw",
    "Kamu nggak capek? Tiap kali aku memejamkan mata muncul kamu terus",
    "Kamu tahu nggak apa persamaannya kamu sama AC? Sama-sama bikin aku sejuk",
    "Kalau jelangkungnya kaya kamu, dateng aku jemput, pulang aku anter, deh",
    "Makan apapun aku suka asal sama kamu, termasuk makan hati",
    "Cinta itu kaya hukuman mati Kalau nggak ditembak, ya digantung",
    "Mencintaimu itu kayak narkoba: sekali coba jadi candu, gak dicoba bikin penasaran, ditinggalin bikin sakau",
    "Gue paling suka ngemil karena ngemil itu enak Apalagi ngemilikin kamu sepenuhnya",
    "Dunia ini cuma milik kita berdua Yang lainnya cuma ngontrak",
    "Bagi aku, semua hari itu adalah hari Selasa Selasa di Surga bila dekat denganmu",
    "Bagaimana kalau kita berdua jadi komplotan penjahat? Aku curi hatimu dan kamu curi hatiku",
    "Kamu itu seperti kopi yang aku seruput pagi ini Pahit, tapi bikin nagih",
    "Aku sering cemburu sama lipstikmu Dia bisa nyium kamu tiap hari, dari pagi sampai malam",
    "Hanya mendengar namamu saja sudah bisa membuatku tersenyum seperti orang bodoh",
    "Aku tau teman wanitamu bukan hanya satu dan menyukaimu pun bukan hanya aku",
    "Semenjak aku berhenti berharap pada dirimu, aku jadi tidak semangat dalam segala hal",
    "Denganmu, jatuh cinta adalah patah hati paling sengaja",
    "Sangat sulit merasakan kebahagiaan hidup tanpa kehadiran kamu disisiku",
    "Melalui rasa rindu yang bergejolak dalam hati, di situ terkadang aku sangat membutuhkan dekap peluk kasih sayangmu",
    "Sendainya kamu tahu, sampai saat ini aku masih mencintaimu",
    "Terkadang aku iri sama layangan Talinya putus saja masih dikejar kejar dan gak rela direbut orang lain",
    "Aku tidak tahu apa itu cinta, sampai akhirnya aku bertemu denganmu Namun, saat itu juga aku tahu rasanya patah hati",
    "Mengejar itu capek, tapi lebih capek lagi menunggu Menunggu kamu menyadari keberadaanku",
    "Jangan berhenti mencinta hanya karena pernah terluka Karena tak ada pelangi tanpa hujan, tak ada cinta sejati tanpa tangisan",
    "Aku punya sejuta alasan untuk melupakanmu, tapi tak ada yang bisa memaksaku untuk berhenti mencintaimu",
    "Terkadang seseorang terasa sangat bodoh hanya untuk mencintai seseorang",
    "Kamu adalah patah hati terbaik yang gak pernah aku sesali",
    "Bukannya tak pantas ditunggu, hanya saja sering memberi harapan palsu",
    "Sebagian diriku merasa sakit, mengingat dirinya yang sangat dekat, tapi tak tersentuh",
    "Hal yang terbaik dalam mencintai seseorang adalah dengan diam-diam mendoakannya",
    "Kuharap aku bisa menghilangkan perasaan ini secepat aku kehilanganmu",
    "Demi cinta kita menipu diri sendiri Berusaha kuat nyatanya jatuh secara tak terhormat",
    "Anggaplah aku rumahmu, jika kamu pergi kamu mengerti kemana arah pulang Menetaplah bila kamu mau dan pergilah jika kamu bosan",
    "Aku bingung, apakah aku harus kecewa atu tidak? Jika aku kecewa, emang siapa diriku baginya? Kalau aku tidak kecewa, tapi aku menunggu ucapannya",
    "Rinduku seperti ranting yang tetap berdiri Meski tak satupun lagi dedaunan yang menemani, sampai akhirnya mengering, patah, dan mati",
    "Kurasa kita sekarang hanya dua orang asing yang memiliki kenangan yang sama",
    "Buatlah aku bisa membencimu walau hanya beberapa menit agar tidak terlalu berat untuk melupakanmu",
    "Aku mencintaimu dengan segenap hatiku, tapi kau malah membagi perasaanmu dengan orang lain",
    "Mencintaimu mungkin menghancurkanku, tapi entah bagaimana meninggalkanmu tidak memperbaikiku",
    "Kamu adalah yang utama dan pertama dalam hidupku, tapi aku adalah yang kedua bagimu",
    "Jika kita hanya bisa dipertemukan dalam mimpi, aku ingin tidur selamanya",
    "Melihatmu bahagia adalah kebahagiaanku, walaupun bahagiamu tanpa bersamaku",
    "Aku terkadang iri dengan sebuah benda Tidak memiliki rasa namun selalu dibutuhkan Berbeda dengan aku yang memiliki rasa, namun ditinggalkan dan diabaikan",
    "To the person I stayed up with until 3 am I should've slept",
    "Love is being stupid together",
    "I love you more today than yesterday, and I will continue to fall in love with you, over and over again, until the day I die",
    "I want someone who will look at me the same way I look at chocolate cake",
    "I love you with every beat of my heart",
    "You taught me how to love, but not how to stop",
    "Loving you was my favorite mistake",
    "You broke my heart But I still love you with all the pieces",
    "In past, you are like an oxygen for me and I always need you to stay alive But now, you are like a carbon dioxide, go out from me",
    "My life used to be in dull grey Thank you, now it is in brighter colors",
    "Roses are red Violets are blue I know that it's often said But I really love you",
    "If dreaming is the only way to be with you, then i'il never open my eyes",
    "My favorite place is inside your hug, even you leave me",
    "Bagaimana mungkin aku berpindah jika hanya padamu hatiku bersinggah?",
    "Kenangan tentangmu sudah seperti rumah bagiku Sehingga setiap kali pikiranku melayang, pasti ujung-ujungnya akan selalu kembali kepadamu",
    "Kenapa tisue bermanfaat? Karena cinta tak pernah kemarau - Sujiwo Tejo",
    "Kalau mencintaimu adalah kesalahan, yasudah, biar aku salah terus saja",
    "Sejak kenal kamu, aku jadi pengen belajar terus deh Belajar jadi yang terbaik buat kamu",
    "Ada yang bertingkah bodoh hanya untuk melihatmu tersenyum Dan dia merasa bahagia akan hal itu",
    "Aku bukan orang baik, tapi akan belajar jadi yang terbaik untuk kamu",
    "Kita tidak mati, tapi lukanya yang membuat kita tidak bisa berjalan seperti dulu lagi",
    "Keberadaanmu bagaikan secangkir kopi yang aku butuhkan setiap pagi, yang dapat mendorongku untuk tetap bersemangat menjalani hari",
    "Aku mau banget ngasih dunia ke kamu Namun, karena itu nggak mungkin, maka aku akan kasih hal yang paling penting dalam hidupku, yaitu duniaku",
    "Mending sing humoris tapi manis, ketimbang sok romantis tapi akhire tragis",
    "Ben akhire ora kecewa, dewe kudu ngerti kapan waktune berharap lan kapan kudu mandeg",
    "Aku ki wong Jowo seng ora ngerti artine 'I Love U', tapi aku ngertine mek 'Aku tresno awakmu'",
    "Ora perlu ayu lan sugihmu, aku cukup mok setiani wes seneng ra karuan",
    "Cintaku nang awakmu iku koyok kamera, fokus nang awakmu tok liyane mah ngeblur",
    "Saben dino kegowo ngimpi tapi ora biso nduweni",
    "Ora ketemu koe 30 dino rasane koyo sewulan",
    "Aku tanpamu bagaikan sego kucing ilang karete Ambyar",
    "Pengenku, Aku iso muter wektu Supoyo aku iso nemokne kowe lewih gasik Ben Lewih dowo wektuku kanggo urip bareng sliramu",
    "Aku ora pernah ngerti opo kui tresno, kajaba sak bare ketemu karo sliramu",
    "Cinta Aa ka Neng moal leungit-leungit sanajan aa geus kawin deui",
    "Kasabaran kaula aya batasna, tapi cinta kaula ka anjeun henteu aya seepna",
    "Kanyaah akang moal luntur najan make Bayclean",
    "Kenangan endah keur babarengan jeung anjeun ek tuluy diinget-inget nepi ka poho",
    "Kuring moal bakal tiasa hirup sorangan, butuh bantosan jalmi sejen",
    "Nyaahna aa ka neg teh jiga tukang bank keur nagih hutang (hayoh mumuntil)",
    "Kasabaran urang aya batasna, tapi cinta urang ka maneh moal aya beakna",
    "Hayang rasana kuring ngarangkai kabeh kata cinta anu aya di dunya ieu, terus bade ku kuring kumpulkeun, supaya anjeun nyaho gede pisan rasa cinta kuring ka anjeun",
    "Tenang wae neng, ari cinta Akang mah sapertos tembang krispatih; Tak lekang oleh waktu",
    "Abdi sanes jalmi nu sampurna pikeun anjeun, sareng sanes oge nu paling alus kanggo anjeun Tapi nu pasti, abdi jalmi hiji-hijina nu terus emut ka anjeun",
    "Cukup jaringan aja yang hilang, kamu jangan",
    "Sering sih dibikin makan hati, tapi menyadari kamu masih di sini bikin bahagia lagi",
    "Musuhku adalah mereka yang ingin memilikimu juga",
    "Banyak yang selalu ada, tapi kalo cuma kamu yang aku mau, gimana?",
    "Jam tidurku hancur dirusak rindu",
    "Cukup China aja yang jauh, cinta kita jangan",
    "Yang penting itu kebahagiaan kamu, aku sih gak penting",
    "Cuma satu keinginanku, dicintai olehmu",
    "Aku tanpamu bagaikan ambulans tanpa wiuw wiuw wiuw",
    "Cukup antartika aja yang jauh Antarkita jangan"
  ]

  ev.on(
    {
      cmd: ['qrandom'],
      listmenu: ['qrandom'],
      tag: 'quotes',
      isGroup: true
    }, 
    async () => {
      
      await Exp.sendMessage(
        id, 
        {
          react: {
            text: "⏱️", 
            key: cht.key
          }
        }
      )
      
      let choice = kataKata[Math.floor(Math.random() * kataKata.length)]
      let text = "乂  *Q U O T E S  R A N D O M*\n\n" + choice
      
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

  ev.on(
    {
      cmd: ['qgalau'],
      listmenu: ['qgalau'],
      tag: 'quotes',
      isGroup: true
    }, 
    async () => {
      
      await Exp.sendMessage(
        id, 
        {
          react: {
            text: "⏱️", 
            key: cht.key
          }
        }
      )
      
      let choice = galau[Math.floor(Math.random() * galau.length)]
      let text = "乂  *Q U O T E S  G A L A U*\n\n" + choice
      
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
  
  ev.on(
    {
      cmd: ['qbucin'],
      listmenu: ['qbucin'],
      tag: 'quotes',
      isGroup: true
    }, 
    async () => {
      
      await Exp.sendMessage(
        id, 
        {
          react: {
            text: "⏱️", 
            key: cht.key
          }
        }
      )
      
      let choice = bucin[Math.floor(Math.random() * bucin.length)]
      let text = "乂  *Q U O T E S  B U C I N*\n\n" + choice
      
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
  
  ev.on(
    {
      cmd: ['qgombal'],
      listmenu: ['qgombal'],
      tag: 'quotes',
      isGroup: true
    }, 
    async () => {
      
      await Exp.sendMessage(
        id, 
        {
          react: {
            text: "⏱️", 
            key: cht.key
          }
        }
      )
      
      let choice = gombal[Math.floor(Math.random() * gombal.length)]
      let text = "乂  *Q U O T E S  G O M B A L*\n\n" + choice
      
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

  ev.on(
    {
      cmd: ['qnyocot'],
      listmenu: ['qnyocot'],
      tag: 'quotes',
      isGroup: true
    }, 
    async () => {
      
      await Exp.sendMessage(
        id, 
        {
          react: {
            text: "⏱️", 
            key: cht.key
          }
        }
      )
      
      let choice = bacot[Math.floor(Math.random() * bacot.length)]
      let text = "乂  *Q U O T E S  N Y O C O T*\n\n" + choice
      
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

  ev.on(
    {
      cmd: ['qmotivasi'],
      listmenu: ['qmotivasi'],
      tag: 'quotes',
      isGroup: true
    }, 
    async () => {
      
      await Exp.sendMessage(
        id, 
        {
          react: {
            text: "⏱️", 
            key: cht.key
          }
        }
      )
      
      let choice = motivasi[Math.floor(Math.random() * motivasi.length)]
      let text = "乂  *Q U O T E S  M O T I V A S I*\n\n" + choice
      
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
  
  ev.on(
    {
      cmd: ['qbijak'],
      listmenu: ['qbijak'],
      tag: 'quotes',
      isGroup: true
    }, 
    async () => {
      
      await Exp.sendMessage(
        id, 
        {
          react: {
            text: "⏱️", 
            key: cht.key
          }
        }
      )
      
      let choice = bijak[Math.floor(Math.random() * bijak.length)]
      let text = "乂  *Q U O T E S  B I J A K*\n\n" + choice
      
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