let ghurl = "https://raw.githubusercontent.com/Rifza123/lib/refs/heads"

let raw = {
  tebakgambar: ghurl + "/main/db/game/tebakgambar.json",
  susunkata: ghurl + "/main/db/game/susunkata.json",
  family100: ghurl + "/main/db/game/family100.json",
  
}

let { Chess } = await (fol[2]+'chess.js').r()
const chess = new Chess();

let exif = await (fol[0] + 'exif.js').r()

global.timeouts = global.timeouts || {}
cfg.hadiah = cfg.hadiah || {

 /* Set hadiah bukan disini tapi di config.json ya
   ini buat antisipasi aja kalo belum update config.json
 */
   
  tebakgambar: 35,
  susunkata: 25,
  family100: 75
}

export default 
async function on({Exp, cht, ev }) {
    const { id, reply, edit } = cht
    const { func } = Exp
    let { archiveMemories:memories, parseTimeString, clearSessionConfess, findSenderCodeConfess, formatDuration } = func
    
    function setQCmd(__id, players, emit){
      for(let { id:_id } of players){
        let qcmds = memories.getItem(_id+from.sender, "quotedQuestionCmd") ||{}
           qcmds[__id] = {
             emit,
             exp: Date.now() + 60000 * 4,
             accepts: []
           }
        memories.setItem(_id+from.sender, "quotedQuestionCmd", qcmds)
      }
    }
    
    const bar = cfg.bar
              
    let metadata = Data.preferences[id]
    let game = metadata?.game || false
    if(game){
      let isEnd = Date.now() >= game.endTime
      if(isEnd) delete metadata.game
    }
    
    let hasGame = game ? `*Masih ada game yang aktif disini!*

- Game: ${game.type}
- Start Time: ${func.dateFormatter(game.startTime, "Asia/Jakarta")}
- End Time: ${func.dateFormatter(game.endTime, "Asia/Jakarta")}
- Creator: @${game.creator.id.split("@")[0]}
- Creator Name: ${game.creator.name}

Untuk memulai game baru:
_Tunggu game berakhir atau bisa dengan mengetik .cleargame atau .nyerah_
` : ""
    
  //=====================================
  //====================================
  
ev.on({
    cmd: ['tfenergy','transferenergy'],
    listmenu: ['tfenergy'],
    tag: 'other',
    isGroup: true,
    isMention: "Gunakan perintah ini dengan mention seseorang!",
}, async ({ cht, args }) => {
    let target = cht.mention[0];
    if (!target) return cht.reply("⚠️ Silakan mention penerima energy.");

    let amount = parseInt(args);
    if (isNaN(amount) || amount <= 0) return cht.reply("⚠️ Masukkan jumlah energy yang valid.");

    let senderID = cht.sender.split("@")[0];
    let targetID = target.split("@")[0];

    // Cek apakah pengguna terdaftar
    if (!(senderID in Data.users)) return cht.reply("⚠️ Anda belum terdaftar dalam sistem.");
    if (!(targetID in Data.users)) return cht.reply("⚠️ Pengguna yang dituju belum terdaftar.");

    let senderData = await func.archiveMemories.get(senderID);
    let targetData = await func.archiveMemories.get(targetID);

    // Biaya admin & pajak
    let biayaAdmin = 7;
    let pajak = Math.ceil(amount * 0.05); // 5% dari jumlah transfer
    let totalBiaya = biayaAdmin + pajak;
    let totalDipotong = amount + totalBiaya;

    // Cek apakah sender memiliki cukup energy
    if (senderData.energy < totalDipotong) {
        let kekurangan = totalDipotong - senderData.energy;
        return cht.reply(`❗ \`𝐓𝐑𝐀𝐍𝐒𝐀𝐊𝐒𝐈 𝐆𝐀𝐆𝐀𝐋\` ❗\n\n𝚂𝚊𝚕𝚍𝚘 𝚎𝚗𝚎𝚛𝚐𝚢 𝙰𝚗𝚍𝚊 𝚝𝚒𝚍𝚊𝚔 𝚖𝚎𝚗𝚌𝚞𝚔𝚞𝚙𝚒\n\n📌 \`𝐃𝐈𝐁𝐔𝐓𝐔𝐇𝐊𝐀𝐍: ${totalDipotong} 𝙴𝚗𝚎𝚛𝚐𝚢\`\n📌 \`𝐄𝐍𝐄𝐑𝐆𝐘 𝐀𝐍𝐃𝐀: ${senderData.energy} ⚡\`\n📌 \`𝐊𝐔𝐑𝐀𝐍𝐆 𝐒𝐄𝐊𝐈𝐓𝐀𝐑: ${kekurangan} 𝙴𝚗𝚎𝚛𝚐𝚢\`\n\n𝚂𝚒𝚕𝚊𝚔𝚊𝚗 𝚒𝚜𝚒 𝚞𝚕𝚊𝚗𝚐 𝚎𝚗𝚎𝚛𝚐𝚢 𝙰𝚗𝚍𝚊 𝚝𝚎𝚛𝚕𝚎𝚋𝚒𝚑 𝚍𝚊𝚑𝚞𝚕𝚞`);
    }

    // Simpan saldo sebelum transaksi
    let senderBefore = senderData.energy;
    let targetBefore = targetData.energy;

    // Proses transfer energy
    senderData.energy -= totalDipotong;
    targetData.energy += amount;

    // Simpan perubahan ke database
    Data.users[senderID] = senderData;
    Data.users[targetID] = targetData;

    // Ambil waktu transaksi
    let time = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

    // Format struk transaksi (menggunakan format lama yang kamu suka)
    let message = `\`\`\`
==========================
  𝐓𝐑𝐀𝐍𝐒𝐀𝐊𝐒𝐈 𝐁𝐄𝐑𝐇𝐀𝐒𝐈𝐋
==========================

Waktu       : ${time}
Pengirim    : @${senderID}  
Penerima    : @${targetID}  
Jumlah      : ${amount} Energy

Biaya Admin : ${biayaAdmin} Energy
Pajak (5%)  : ${pajak} Energy
Total Dipotong: ${totalDipotong} Energy

Energy Pengirim:
   Sebelum  : ${senderBefore} Energy
   Sesudah  : ${senderData.energy} Energy

Energy Penerima:
   Sebelum  : ${targetBefore} Energy
   Sesudah  : ${targetData.energy} Energy
==========================
\`\`\``;

    // Kirim struk transaksi ke pengirim dan penerima
    cht.reply(message, { mentions: [cht.sender, target] });
});
  
  ev.on({
    cmd: ["tebakbom"],
    listmenu: ["tebakbom"],
    tag: "game",
    isGroup: true,
    energy: 20
}, async () => {
    cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 50
    if ("game" in metadata) return cht.reply(hasGame)

    let maxAge = 120000 // 2 menit
    
    try {
        let _key = keys[cht.sender]
        await cht.edit("\`𝐆𝐀𝐌𝐄 𝐒𝐓𝐀𝐑𝐓\`", _key)
        
        // Buat array buah untuk ditampilkan
        const fruits = ['🍇', '🍊', '🍋', '🍎', '🍉', '🍌', '🍒', '🍓', '🍐']
        
        // Acak posisi bom (1-9)
        const bombPosition = Math.floor(Math.random() * 9) + 1
        
        // Buat grid awal
        let grid = [
            ['1️⃣', '2️⃣', '3️⃣'],
            ['4️⃣', '5️⃣', '6️⃣'],
            ['7️⃣', '8️⃣', '9️⃣']
        ]
        
        // Data untuk permainan
        metadata.game = {
            type: "tebakbom",
            startTime: Date.now(),
            endTime: Date.now() + maxAge,
            bombPosition,
            grid,
            revealedPositions: [],
            history: [],
            baseEnergy: cfg.hadiah[cht.cmd],
            currentEnergy: cfg.hadiah[cht.cmd],
            creator: {
                name: cht.pushName,
                id: cht.sender
            },
            fruits,
            players: [],
            id_message: []
        }
        
        let formatDur = func.formatDuration(maxAge)
        
        // Tampilkan grid dalam bentuk teks
        let gridDisplay = grid.map(row => row.join('')).join('\n')
        
        let caption = `\`𝐓𝐄𝐁𝐀𝐊 𝐁𝐎𝐌\`\n\n${gridDisplay}\n\n𝚆𝚊𝚔𝚝𝚞 𝚖𝚎𝚗𝚓𝚊𝚠𝚊𝚋: ${formatDur.minutes} 𝚖𝚎𝚗𝚒𝚝 ${formatDur.seconds} 𝚍𝚎𝚝𝚒𝚔\n𝙿𝚎𝚝𝚞𝚗𝚓𝚞𝚔:\n- 𝙳𝚒 𝚋𝚊𝚕𝚒𝚔 𝚊𝚗𝚐𝚔𝚊 𝟷-𝟿 𝚝𝚎𝚛𝚍𝚊𝚙𝚊𝚝 𝚋𝚎𝚛𝚊𝚗𝚎𝚔𝚊 𝚋𝚞𝚊𝚑, 𝚗𝚊𝚖𝚞𝚗 𝚝𝚎𝚛𝚍𝚊𝚙𝚊𝚝 𝚜𝚊𝚕𝚊𝚑 𝚜𝚊𝚝𝚞 𝚊𝚗𝚐𝚔𝚊 𝚢𝚊𝚗𝚐 𝚋𝚎𝚛𝚒𝚜𝚒 𝚋𝚘𝚖\n- 𝚃𝚎𝚋𝚊𝚔𝚕𝚊𝚑 𝚊𝚗𝚐𝚔𝚊 𝟷-𝟿 𝚍𝚊𝚗 𝚓𝚊𝚗𝚐𝚊𝚗 𝚜𝚊𝚖𝚙𝚊𝚒 𝚖𝚎𝚗𝚍𝚊𝚙𝚊𝚝𝚔𝚊𝚗 𝚋𝚘𝚖\n\n\`𝐇𝐀𝐃𝐈𝐀𝐇 𝐀𝐖𝐀𝐋:\` ${cfg.hadiah[cht.cmd]} 𝙴𝚗𝚎𝚛𝚐𝚢⚡`
        
        let { key } = await Exp.sendMessage(id, { text: caption }, { quoted: cht })
        metadata.game.id_message.push(key.id)
        metadata.game.key = key
        
        global.timeouts[id] = setTimeout(async () => {
            if (metadata.game?.type === "tebakbom") {
                // Tampilkan posisi bom
                const row = Math.floor((bombPosition - 1) / 3)
                const col = (bombPosition - 1) % 3
                let finalGrid = [...metadata.game.grid]
                finalGrid[row][col] = '💣'
                
                let finalGridDisplay = finalGrid.map(row => row.join('')).join('\n')
                
                await cht.reply(`\`𝐆𝐀𝐌𝐄 𝐁𝐄𝐑𝐀𝐊𝐇𝐈𝐑\`\n\n𝙱𝚘𝚖 𝚋𝚎𝚛𝚊𝚍𝚊 𝚍𝚒𝚙𝚘𝚜𝚒𝚜𝚒 ${bombPosition}\n\n${finalGridDisplay}`)
                
                // Hapus data permainan
                delete Data.preferences[id].game
                delete global.timeouts[id]
                Exp.sendMessage(cht.id, { delete: key })
            }
        }, maxAge)
    } catch (error) {
        console.error("Error saat memulai game Tebak Bom:", error)
        return cht.reply(`❌ Gagal memulai game!\nError: ${error.message}`)
    }
}) // tebakbom
  
  ev.on({
    cmd: ["tebakkanji"],
    listmenu: ["tebakkanji"],
    tag: "game",
    isGroup: true,
    energy: 20
}, async ({ args }) => {
    cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 50
    if ("game" in metadata) return cht.reply(hasGame)

    let maxAge = 60000 // 1 menit
    let level = args ? args.toLowerCase() : "n5" // Default ke N5 jika tidak ada level

    // Database soal Kanji per level dengan detail tambahan
    let kanjiDB = {
      n1: [
            { kanji: "環境", hiragana: "かんきょう", romaji: "kankyō", answer: "lingkungan", contoh: "環境を守る (kankyō o mamoru) → Melindungi lingkungan." },
            { kanji: "貿易", hiragana: "ぼうえき", romaji: "bōeki", answer: "perdagangan", contoh: "国際貿易 (kokusai bōeki) → Perdagangan internasional." },
            { kanji: "具体", hiragana: "ぐたい", romaji: "gutai", answer: "konkret", contoh: "具体的な例 (gutaiteki na rei) → Contoh konkret." },
            { kanji: "推進", hiragana: "すいしん", romaji: "suishin", answer: "promosi", contoh: "プロジェクトを推進する (purojekuto o suishin suru) → Mempromosikan proyek." },
            { kanji: "措置", hiragana: "そち", romaji: "sochi", answer: "tindakan", contoh: "緊急措置 (kinkyū sochi) → Tindakan darurat." },
            { kanji: "施設", hiragana: "しせつ", romaji: "shisetsu", answer: "fasilitas", contoh: "公共施設 (kōkyō shisetsu) → Fasilitas umum." },
            { kanji: "展開", hiragana: "てんかい", romaji: "tenkai", answer: "perkembangan", contoh: "物語の展開 (monogatari no tenkai) → Perkembangan cerita." },
            { kanji: "解明", hiragana: "かいめい", romaji: "kaimei", answer: "klarifikasi", contoh: "真実を解明する (shinjitsu o kaimei suru) → Mengklarifikasi kebenaran." },
            { kanji: "確立", hiragana: "かくりつ", romaji: "kakuritsu", answer: "pendirian", contoh: "基準を確立する (kijun o kakuritsu suru) → Mendirikan standar." },
            { kanji: "概念", hiragana: "がいねん", romaji: "gainen", answer: "konsep", contoh: "抽象的な概念 (chūshōteki na gainen) → Konsep abstrak." },
            { kanji: "構造", hiragana: "こうぞう", romaji: "kōzō", answer: "struktur", contoh: "建物の構造 (tatemono no kōzō) → Struktur bangunan." },
            { kanji: "論点", hiragana: "ろんてん", romaji: "ronten", answer: "isu", contoh: "重要な論点 (jūyōna ronten) → Isu penting." },
            { kanji: "議論", hiragana: "ぎろん", romaji: "giron", answer: "diskusi", contoh: "熱い議論 (atsui giron) → Diskusi yang hangat." },
            { kanji: "特性", hiragana: "とくせい", romaji: "tokusei", answer: "karakteristik", contoh: "材料の特性 (zairyō no tokusei) → Karakteristik material." },
            { kanji: "傾向", hiragana: "けいこう", romaji: "keikō", answer: "tendensi", contoh: "最近の傾向 (saikin no keikō) → Tendensi terkini." },
            { kanji: "要素", hiragana: "ようそ", romaji: "yōso", answer: "elemen", contoh: "重要な要素 (jūyōna yōso) → Elemen penting." },
            { kanji: "相違", hiragana: "そうい", romaji: "sōi", answer: "perbedaan", contoh: "意見の相違 (iken no sōi) → Perbedaan pendapat." },
            { kanji: "定義", hiragana: "ていぎ", romaji: "teigi", answer: "definisi", contoh: "言葉の定義 (kotoba no teigi) → Definisi kata." },
            { kanji: "仮説", hiragana: "かせつ", romaji: "kasetsu", answer: "hipotesis", contoh: "仮説を立てる (kasetsu o tateru) → Membuat hipotesis." },
            { kanji: "理論", hiragana: "りろん", romaji: "riron", answer: "teori", contoh: "新しい理論 (atarashii riron) → Teori baru." },
            { kanji: "分析", hiragana: "ぶんせき", romaji: "bunseki", answer: "analisis", contoh: "データを分析する (dēta o bunseki suru) → Menganalisis data." },
            { kanji: "評価", hiragana: "ひょうか", romaji: "hyōka", answer: "evaluasi", contoh: "業績の評価 (gyōseki no hyōka) → Evaluasi kinerja." },
            { kanji: "査定", hiragana: "さてい", romaji: "satei", answer: "penilaian", contoh: "財産の査定 (zaisan no satei) → Penilaian properti." },
            { kanji: "解釈", hiragana: "かいしゃく", romaji: "kaishaku", answer: "interpretasi", contoh: "法律の解釈 (hōritsu no kaishaku) → Interpretasi hukum." },
            { kanji: "妥当", hiragana: "だとう", romaji: "datō", answer: "kelayakan", contoh: "妥当な判断 (datō na handan) → Penilaian yang layak." },
            { kanji: "相応", hiragana: "そうおう", romaji: "sōō", answer: "sesuai", contoh: "能力に相応しい (nōryoku ni sōōshii) → Sesuai dengan kemampuan." },
            { kanji: "規模", hiragana: "きぼ", romaji: "kibo", answer: "skala", contoh: "大規模な計画 (daikibo na keikaku) → Rencana skala besar." },
            { kanji: "配慮", hiragana: "はいりょ", romaji: "hairyo", answer: "pertimbangan", contoh: "環境への配慮 (kankyō e no hairyo) → Pertimbangan terhadap lingkungan." },
            { kanji: "実態", hiragana: "じったい", romaji: "jittai", answer: "realitas", contoh: "実態を把握する (jittai o haaku suru) → Memahami realitas." },
            { kanji: "実績", hiragana: "じっせき", romaji: "jisseki", answer: "prestasi", contoh: "過去の実績 (kako no jisseki) → Prestasi masa lalu." },
            { kanji: "策定", hiragana: "さくてい", romaji: "sakutei", answer: "formulasi", contoh: "計画を策定する (keikaku o sakutei suru) → Memformulasikan rencana." },
            { kanji: "主張", hiragana: "しゅちょう", romaji: "shuchō", answer: "pernyataan", contoh: "自分の主張を述べる (jibun no shuchō o noberu) → Menyatakan pendapat sendiri." },
            { kanji: "継続", hiragana: "けいぞく", romaji: "keizoku", answer: "keberlanjutan", contoh: "継続的な支援 (keizokuteki na shien) → Dukungan berkelanjutan." },
            { kanji: "促進", hiragana: "そくしん", romaji: "sokushin", answer: "akselerasi", contoh: "経済成長を促進する (keizai seichō o sokushin suru) → Mempercepat pertumbuhan ekonomi." },
            { kanji: "拡大", hiragana: "かくだい", romaji: "kakudai", answer: "ekspansi", contoh: "事業を拡大する (jigyō o kakudai suru) → Memperluas bisnis." },
            { kanji: "集約", hiragana: "しゅうやく", romaji: "shūyaku", answer: "konsolidasi", contoh: "意見を集約する (iken o shūyaku suru) → Mengkonsolidasikan pendapat." },
            { kanji: "統合", hiragana: "とうごう", romaji: "tōgō", answer: "integrasi", contoh: "システムを統合する (shisutemu o tōgō suru) → Mengintegrasikan sistem." },
            { kanji: "検証", hiragana: "けんしょう", romaji: "kenshō", answer: "verifikasi", contoh: "理論を検証する (riron o kenshō suru) → Memverifikasi teori." },
            { kanji: "根拠", hiragana: "こんきょ", romaji: "konkyo", answer: "dasar", contoh: "主張の根拠 (shuchō no konkyo) → Dasar pernyataan." },
            { kanji: "論理", hiragana: "ろんり", romaji: "ronri", answer: "logika", contoh: "論理的な思考 (ronriteki na shikō) → Pemikiran logis." },
            { kanji: "背景", hiragana: "はいけい", romaji: "haikei", answer: "latar belakang", contoh: "歴史的背景 (rekishiteki haikei) → Latar belakang sejarah." },
            { kanji: "合理", hiragana: "ごうり", romaji: "gōri", answer: "rasional", contoh: "合理的な判断 (gōriteki na handan) → Keputusan rasional." },
            { kanji: "矛盾", hiragana: "むじゅん", romaji: "mujun", answer: "kontradiksi", contoh: "矛盾を解消する (mujun o kaishō suru) → Menghilangkan kontradiksi." },
            { kanji: "見解", hiragana: "けんかい", romaji: "kenkai", answer: "pandangan", contoh: "異なる見解 (kotonaru kenkai) → Pandangan berbeda." },
            { kanji: "争点", hiragana: "そうてん", romaji: "sōten", answer: "kontroversi", contoh: "選挙の争点 (senkyo no sōten) → Kontroversi pemilu." },
            { kanji: "指標", hiragana: "しひょう", romaji: "shihyō", answer: "indikator", contoh: "経済指標 (keizai shihyō) → Indikator ekonomi." },
            { kanji: "確率", hiragana: "かくりつ", romaji: "kakuritsu", answer: "probabilitas", contoh: "成功の確率 (seikō no kakuritsu) → Probabilitas kesuksesan." },
            { kanji: "把握", hiragana: "はあく", romaji: "haaku", answer: "pemahaman", contoh: "状況を把握する (jōkyō o haaku suru) → Memahami situasi." },
            { kanji: "着手", hiragana: "ちゃくしゅ", romaji: "chakushu", answer: "permulaan", contoh: "プロジェクトに着手する (purojekuto ni chakushu suru) → Memulai proyek." },
            { kanji: "設置", hiragana: "せっち", romaji: "secchi", answer: "instalasi", contoh: "機械を設置する (kikai o secchi suru) → Menginstal mesin." },
            { kanji: "達成", hiragana: "たっせい", romaji: "tassei", answer: "pencapaian", contoh: "目標を達成する (mokuhyō o tassei suru) → Mencapai tujuan." },
            { kanji: "軽減", hiragana: "けいげん", romaji: "keigen", answer: "pengurangan", contoh: "負担を軽減する (futan o keigen suru) → Mengurangi beban." },
            { kanji: "排除", hiragana: "はいじょ", romaji: "haijo", answer: "eliminasi", contoh: "障害を排除する (shōgai o haijo suru) → Mengeliminasi hambatan." },
            { kanji: "抑制", hiragana: "よくせい", romaji: "yokusei", answer: "pengendalian", contoh: "感情を抑制する (kanjō o yokusei suru) → Mengendalikan emosi." },
            { kanji: "誘致", hiragana: "ゆうち", romaji: "yūchi", answer: "undangan", contoh: "企業を誘致する (kigyō o yūchi suru) → Mengundang perusahaan." },
            { kanji: "遂行", hiragana: "すいこう", romaji: "suikō", answer: "pelaksanaan", contoh: "任務を遂行する (ninmu o suikō suru) → Melaksanakan tugas." },
            { kanji: "導入", hiragana: "どうにゅう", romaji: "dōnyū", answer: "pengenalan", contoh: "新システムを導入する (shin shisutemu o dōnyū suru) → Memperkenalkan sistem baru." },
            { kanji: "委託", hiragana: "いたく", romaji: "itaku", answer: "delegasi", contoh: "仕事を委託する (shigoto o itaku suru) → Mendelegasikan pekerjaan." },
            { kanji: "充実", hiragana: "じゅうじつ", romaji: "jūjitsu", answer: "pengayaan", contoh: "内容を充実させる (naiyō o jūjitsu saseru) → Memperkaya konten." }
        ],
        n2: [
            { kanji: "制度", hiragana: "せいど", romaji: "seido", answer: "sistem", contoh: "教育制度 (kyōiku seido) → Sistem pendidikan." },
            { kanji: "価値", hiragana: "かち", romaji: "kachi", answer: "nilai", contoh: "価値のあるもの (kachi no aru mono) → Sesuatu yang bernilai." },
            { kanji: "資源", hiragana: "しげん", romaji: "shigen", answer: "sumber daya", contoh: "自然資源 (shizen shigen) → Sumber daya alam." },
            { kanji: "景気", hiragana: "けいき", romaji: "keiki", answer: "ekonomi", contoh: "景気が回復する (keiki ga kaifuku suru) → Ekonomi pulih." },
            { kanji: "政策", hiragana: "せいさく", romaji: "seisaku", answer: "kebijakan", contoh: "政府の政策 (seifu no seisaku) → Kebijakan pemerintah." },
            { kanji: "義務", hiragana: "ぎむ", romaji: "gimu", answer: "kewajiban", contoh: "法的義務 (hōteki gimu) → Kewajiban hukum." },
            { kanji: "権利", hiragana: "けんり", romaji: "kenri", answer: "hak", contoh: "人権 (jinken) → Hak asasi manusia." },
            { kanji: "影響", hiragana: "えいきょう", romaji: "eikyō", answer: "pengaruh", contoh: "良い影響を与える (yoi eikyō o ataeru) → Memberikan pengaruh baik." },
            { kanji: "調査", hiragana: "ちょうさ", romaji: "chōsa", answer: "penelitian", contoh: "市場調査 (shijō chōsa) → Penelitian pasar." },
            { kanji: "対象", hiragana: "たいしょう", romaji: "taishō", answer: "sasaran", contoh: "研究の対象 (kenkyū no taishō) → Sasaran penelitian." },
            { kanji: "傾向", hiragana: "けいこう", romaji: "keikō", answer: "kecenderungan", contoh: "最近の傾向 (saikin no keikō) → Kecenderungan terkini." },
            { kanji: "状況", hiragana: "じょうきょう", romaji: "jōkyō", answer: "situasi", contoh: "現在の状況 (genzai no jōkyō) → Situasi saat ini." },
            { kanji: "選択", hiragana: "せんたく", romaji: "sentaku", answer: "pilihan", contoh: "選択肢 (sentakushi) → Pilihan." },
            { kanji: "解決", hiragana: "かいけつ", romaji: "kaiketsu", answer: "penyelesaian", contoh: "問題を解決する (mondai o kaiketsu suru) → Menyelesaikan masalah." },
            { kanji: "発見", hiragana: "はっけん", romaji: "hakken", answer: "penemuan", contoh: "新しい発見 (atarashii hakken) → Penemuan baru." },
            { kanji: "提案", hiragana: "ていあん", romaji: "teian", answer: "proposal", contoh: "提案を受け入れる (teian o ukeireru) → Menerima proposal." },
            { kanji: "参加", hiragana: "さんか", romaji: "sanka", answer: "partisipasi", contoh: "大会に参加する (taikai ni sanka suru) → Berpartisipasi dalam acara." },
            { kanji: "実現", hiragana: "じつげん", romaji: "jitsugen", answer: "realisasi", contoh: "夢を実現する (yume o jitsugen suru) → Merealisasikan mimpi." },
            { kanji: "認識", hiragana: "にんしき", romaji: "ninshiki", answer: "kesadaran", contoh: "問題の認識 (mondai no ninshiki) → Kesadaran akan masalah." },
            { kanji: "適当", hiragana: "てきとう", romaji: "tekitō", answer: "tepat", contoh: "適当な判断 (tekitō na handan) → Penilaian yang tepat." },
            { kanji: "判断", hiragana: "はんだん", romaji: "handan", answer: "penilaian", contoh: "自分で判断する (jibun de handan suru) → Membuat penilaian sendiri." },
            { kanji: "全体", hiragana: "ぜんたい", romaji: "zentai", answer: "keseluruhan", contoh: "全体的に見る (zentaiteki ni miru) → Melihat secara keseluruhan." },
            { kanji: "原因", hiragana: "げんいん", romaji: "gen'in", answer: "penyebab", contoh: "事故の原因 (jiko no gen'in) → Penyebab kecelakaan." },
            { kanji: "結果", hiragana: "けっか", romaji: "kekka", answer: "hasil", contoh: "良い結果 (yoi kekka) → Hasil yang baik." },
            { kanji: "連絡", hiragana: "れんらく", romaji: "renraku", answer: "kontak", contoh: "連絡を取る (renraku o toru) → Mengambil kontak." },
            { kanji: "規則", hiragana: "きそく", romaji: "kisoku", answer: "peraturan", contoh: "会社の規則 (kaisha no kisoku) → Peraturan perusahaan." },
            { kanji: "責任", hiragana: "せきにん", romaji: "sekinin", answer: "tanggung jawab", contoh: "責任を持つ (sekinin o motsu) → Memiliki tanggung jawab." },
            { kanji: "比較", hiragana: "ひかく", romaji: "hikaku", answer: "perbandingan", contoh: "二つを比較する (futatsu o hikaku suru) → Membandingkan dua hal." },
            { kanji: "要求", hiragana: "ようきゅう", romaji: "yōkyū", answer: "permintaan", contoh: "高い要求 (takai yōkyū) → Permintaan yang tinggi." },
            { kanji: "記録", hiragana: "きろく", romaji: "kiroku", answer: "catatan", contoh: "記録を破る (kiroku o yaburu) → Memecahkan rekor." },
            { kanji: "設定", hiragana: "せってい", romaji: "settei", answer: "pengaturan", contoh: "目標を設定する (mokuhyō o settei suru) → Mengatur tujuan." },
            { kanji: "環境", hiragana: "かんきょう", romaji: "kankyō", answer: "lingkungan", contoh: "作業環境 (sagyō kankyō) → Lingkungan kerja." },
            { kanji: "限界", hiragana: "げんかい", romaji: "genkai", answer: "batas", contoh: "限界を超える (genkai o koeru) → Melampaui batas." },
            { kanji: "基本", hiragana: "きほん", romaji: "kihon", answer: "dasar", contoh: "基本的な知識 (kihonteki na chishiki) → Pengetahuan dasar." },
            { kanji: "創造", hiragana: "そうぞう", romaji: "sōzō", answer: "kreasi", contoh: "創造力 (sōzōryoku) → Daya kreasi." },
            { kanji: "輸出", hiragana: "ゆしゅつ", romaji: "yushutsu", answer: "ekspor", contoh: "製品を輸出する (seihin o yushutsu suru) → Mengekspor produk." },
            { kanji: "輸入", hiragana: "ゆにゅう", romaji: "yunyū", answer: "impor", contoh: "外国から輸入する (gaikoku kara yunyū suru) → Mengimpor dari luar negeri." },
            { kanji: "批判", hiragana: "ひはん", romaji: "hihan", answer: "kritik", contoh: "批判を受ける (hihan o ukeru) → Menerima kritik." },
            { kanji: "証明", hiragana: "しょうめい", romaji: "shōmei", answer: "bukti", contoh: "証明書 (shōmeisho) → Sertifikat bukti." },
            { kanji: "変化", hiragana: "へんか", romaji: "henka", answer: "perubahan", contoh: "急激な変化 (kyūgeki na henka) → Perubahan drastis." },
            { kanji: "存在", hiragana: "そんざい", romaji: "sonzai", answer: "keberadaan", contoh: "生命の存在 (seimei no sonzai) → Keberadaan kehidupan." },
            { kanji: "維持", hiragana: "いじ", romaji: "iji", answer: "pemeliharaan", contoh: "健康を維持する (kenkō o iji suru) → Memelihara kesehatan." },
            { kanji: "確保", hiragana: "かくほ", romaji: "kakuho", answer: "pengamanan", contoh: "安全を確保する (anzen o kakuho suru) → Mengamankan keselamatan." },
            { kanji: "独自", hiragana: "どくじ", romaji: "dokuji", answer: "unik", contoh: "独自の方法 (dokuji no hōhō) → Cara yang unik." },
            { kanji: "抵抗", hiragana: "ていこう", romaji: "teikō", answer: "perlawanan", contoh: "抵抗する力 (teikō suru chikara) → Kekuatan untuk melawan." },
            { kanji: "適用", hiragana: "てきよう", romaji: "tekiyō", answer: "penerapan", contoh: "法律を適用する (hōritsu o tekiyō suru) → Menerapkan hukum." },
            { kanji: "複雑", hiragana: "ふくざつ", romaji: "fukuzatsu", answer: "kompleks", contoh: "複雑な問題 (fukuzatsu na mondai) → Masalah yang kompleks." },
            { kanji: "修正", hiragana: "しゅうせい", romaji: "shūsei", answer: "koreksi", contoh: "間違いを修正する (machigai o shūsei suru) → Mengoreksi kesalahan." },
            { kanji: "説得", hiragana: "せっとく", romaji: "settoku", answer: "persuasi", contoh: "相手を説得する (aite o settoku suru) → Membujuk lawan bicara." },
            { kanji: "強調", hiragana: "きょうちょう", romaji: "kyōchō", answer: "penekanan", contoh: "重要性を強調する (jūyōsei o kyōchō suru) → Menekankan pentingnya." },
            { kanji: "注目", hiragana: "ちゅうもく", romaji: "chūmoku", answer: "perhatian", contoh: "注目を集める (chūmoku o atsumeru) → Menarik perhatian." },
            { kanji: "共通", hiragana: "きょうつう", romaji: "kyōtsū", answer: "umum", contoh: "共通の関心事 (kyōtsū no kanshin-goto) → Kepentingan umum." },
            { kanji: "予測", hiragana: "よそく", romaji: "yosoku", answer: "prediksi", contoh: "未来を予測する (mirai o yosoku suru) → Memprediksi masa depan." }
        ],
        n3: [
            { kanji: "希望", hiragana: "きぼう", romaji: "kibō", answer: "harapan", contoh: "希望を持つ (kibō o motsu) → Memiliki harapan." },
            { kanji: "条件", hiragana: "じょうけん", romaji: "jōken", answer: "syarat", contoh: "入学の条件 (nyūgaku no jōken) → Syarat masuk sekolah." },
            { kanji: "決定", hiragana: "けっていする", romaji: "kettei suru", answer: "keputusan", contoh: "決定を下す (kettei o kudasu) → Membuat keputusan." },
            { kanji: "説明", hiragana: "せつめいする", romaji: "setsumei suru", answer: "penjelasan", contoh: "詳しく説明する (kuwashiku setsumei suru) → Menjelaskan secara detail." },
            { kanji: "相談", hiragana: "そうだんする", romaji: "sōdan suru", answer: "konsultasi", contoh: "先生に相談する (sensei ni sōdan suru) → Berkonsultasi dengan guru." },
            { kanji: "予定", hiragana: "よてい", romaji: "yotei", answer: "rencana", contoh: "明日の予定 (ashita no yotei) → Rencana untuk besok." },
            { kanji: "迷惑", hiragana: "めいわく", romaji: "meiwaku", answer: "gangguan", contoh: "迷惑をかける (meiwaku o kakeru) → Menyebabkan gangguan." },
            { kanji: "成功", hiragana: "せいこう", romaji: "seikō", answer: "sukses", contoh: "試験に成功した (shiken ni seikō shita) → Berhasil dalam ujian." },
            { kanji: "失敗", hiragana: "しっぱい", romaji: "shippai", answer: "kegagalan", contoh: "失敗から学ぶ (shippai kara manabu) → Belajar dari kegagalan." },
            { kanji: "返事", hiragana: "へんじ", romaji: "henji", answer: "balasan", contoh: "返事を待つ (henji o matsu) → Menunggu balasan." },
            { kanji: "約束", hiragana: "やくそく", romaji: "yakusoku", answer: "janji", contoh: "約束を守る (yakusoku o mamoru) → Menepati janji." },
            { kanji: "信じる", hiragana: "しんじる", romaji: "shinjiru", answer: "percaya", contoh: "友達を信じる (tomodachi o shinjiru) → Percaya pada teman." },
            { kanji: "考える", hiragana: "かんがえる", romaji: "kangaeru", answer: "berpikir", contoh: "よく考える (yoku kangaeru) → Berpikir dengan baik." },
            { kanji: "助ける", hiragana: "たすける", romaji: "tasukeru", answer: "membantu", contoh: "友達を助ける (tomodachi o tasukeru) → Membantu teman." },
            { kanji: "招待", hiragana: "しょうたい", romaji: "shōtai", answer: "undangan", contoh: "パーティーに招待する (pātī ni shōtai suru) → Mengundang ke pesta." },
            { kanji: "許可", hiragana: "きょか", romaji: "kyoka", answer: "izin", contoh: "許可をもらう (kyoka o morau) → Mendapatkan izin." },
            { kanji: "禁止", hiragana: "きんし", romaji: "kinshi", answer: "larangan", contoh: "喫煙禁止 (kitsuen kinshi) → Dilarang merokok." },
            { kanji: "印象", hiragana: "いんしょう", romaji: "inshō", answer: "kesan", contoh: "良い印象を与える (yoi inshō o ataeru) → Memberikan kesan baik." },
            { kanji: "注意", hiragana: "ちゅうい", romaji: "chūi", answer: "perhatian", contoh: "注意を払う (chūi o harau) → Memberikan perhatian." },
            { kanji: "準備", hiragana: "じゅんび", romaji: "junbi", answer: "persiapan", contoh: "試験の準備をする (shiken no junbi o suru) → Mempersiapkan ujian." },
            { kanji: "反対", hiragana: "はんたい", romaji: "hantai", answer: "pertentangan", contoh: "意見に反対する (iken ni hantai suru) → Menentang pendapat." },
            { kanji: "意見", hiragana: "いけん", romaji: "iken", answer: "pendapat", contoh: "意見を述べる (iken o noberu) → Menyatakan pendapat." },
            { kanji: "経験", hiragana: "けいけん", romaji: "keiken", answer: "pengalaman", contoh: "貴重な経験 (kichō na keiken) → Pengalaman berharga." },
            { kanji: "残念", hiragana: "ざんねん", romaji: "zannen", answer: "sayang", contoh: "残念なお知らせ (zannen na oshirase) → Kabar yang disayangkan." },
            { kanji: "最近", hiragana: "さいきん", romaji: "saikin", answer: "belakangan", contoh: "最近の出来事 (saikin no dekigoto) → Kejadian belakangan ini." },
            { kanji: "特別", hiragana: "とくべつ", romaji: "tokubetsu", answer: "khusus", contoh: "特別な日 (tokubetsu na hi) → Hari yang khusus." },
            { kanji: "必要", hiragana: "ひつよう", romaji: "hitsuyō", answer: "penting", contoh: "必要なもの (hitsuyō na mono) → Hal yang penting." },
            { kanji: "自由", hiragana: "じゆう", romaji: "jiyū", answer: "kebebasan", contoh: "自由な時間 (jiyū na jikan) → Waktu bebas." },
            { kanji: "安全", hiragana: "あんぜん", romaji: "anzen", answer: "keamanan", contoh: "安全を確保する (anzen o kakuho suru) → Memastikan keamanan." },
            { kanji: "努力", hiragana: "どりょく", romaji: "doryoku", answer: "usaha", contoh: "努力する価値がある (doryoku suru kachi ga aru) → Usaha yang berharga." },
            { kanji: "利用", hiragana: "りよう", romaji: "riyō", answer: "penggunaan", contoh: "インターネットを利用する (intānetto o riyō suru) → Menggunakan internet." },
            { kanji: "態度", hiragana: "たいど", romaji: "taido", answer: "sikap", contoh: "彼の態度が変わった (kare no taido ga kawatta) → Sikapnya berubah." },
            { kanji: "表現", hiragana: "ひょうげん", romaji: "hyōgen", answer: "ekspresi", contoh: "感情を表現する (kanjō o hyōgen suru) → Mengekspresikan perasaan." },
            { kanji: "結婚", hiragana: "けっこん", romaji: "kekkon", answer: "pernikahan", contoh: "結婚式に出席する (kekkonshiki ni shusseki suru) → Menghadiri pernikahan." },
            { kanji: "運転", hiragana: "うんてん", romaji: "unten", answer: "mengemudi", contoh: "車を運転する (kuruma o unten suru) → Mengemudi mobil." },
            { kanji: "練習", hiragana: "れんしゅう", romaji: "renshū", answer: "latihan", contoh: "毎日練習する (mainichi renshū suru) → Latihan setiap hari." },
            { kanji: "会話", hiragana: "かいわ", romaji: "kaiwa", answer: "percakapan", contoh: "日本語で会話する (nihongo de kaiwa suru) → Bercakap dalam bahasa Jepang." },
            { kanji: "心配", hiragana: "しんぱい", romaji: "shinpai", answer: "khawatir", contoh: "心配しないで (shinpai shinaide) → Jangan khawatir." },
            { kanji: "真剣", hiragana: "しんけん", romaji: "shinken", answer: "serius", contoh: "真剣に考える (shinken ni kangaeru) → Berpikir dengan serius." },
            { kanji: "整理", hiragana: "せいり", romaji: "seiri", answer: "merapikan", contoh: "部屋を整理する (heya o seiri suru) → Merapikan kamar." }
        ],
        n4: [
            { kanji: "料金", hiragana: "りょうきん", romaji: "ryōkin", answer: "biaya", contoh: "電車の料金 (densha no ryōkin) → Biaya kereta." },
            { kanji: "感動", hiragana: "かんどう", romaji: "kandō", answer: "emosi", contoh: "映画に感動した (eiga ni kandō shita) → Terharu oleh film." },
            { kanji: "理由", hiragana: "りゆう", romaji: "riyū", answer: "alasan", contoh: "遅れた理由 (okureta riyū) → Alasan terlambat." },
            { kanji: "経験", hiragana: "けいけん", romaji: "keiken", answer: "pengalaman", contoh: "仕事の経験 (shigoto no keiken) → Pengalaman kerja." },
            { kanji: "説明", hiragana: "せつめい", romaji: "setsumei", answer: "penjelasan", contoh: "詳しい説明 (kuwashii setsumei) → Penjelasan detail." },
            { kanji: "練習", hiragana: "れんしゅう", romaji: "renshū", answer: "latihan", contoh: "日本語の練習 (nihongo no renshū) → Latihan bahasa Jepang." },
            { kanji: "注意", hiragana: "ちゅうい", romaji: "chūi", answer: "perhatian", contoh: "注意してください (chūi shite kudasai) → Harap perhatian." },
            { kanji: "努力", hiragana: "どりょく", romaji: "doryoku", answer: "usaha", contoh: "努力する (doryoku suru) → Berusaha." },
            { kanji: "準備", hiragana: "じゅんび", romaji: "junbi", answer: "persiapan", contoh: "準備ができた (junbi ga dekita) → Persiapan sudah selesai." },
            { kanji: "結婚", hiragana: "けっこん", romaji: "kekkon", answer: "pernikahan", contoh: "結婚式 (kekkonshiki) → Upacara pernikahan." },
            { kanji: "予定", hiragana: "よてい", romaji: "yotei", answer: "rencana", contoh: "明日の予定 (ashita no yotei) → Rencana besok." },
            { kanji: "旅行", hiragana: "りょこう", romaji: "ryokō", answer: "perjalanan", contoh: "海外旅行 (kaigai ryokō) → Perjalanan luar negeri." },
            { kanji: "写真", hiragana: "しゃしん", romaji: "shashin", answer: "foto", contoh: "写真を撮る (shashin o toru) → Mengambil foto." },
            { kanji: "漢字", hiragana: "かんじ", romaji: "kanji", answer: "kanji", contoh: "漢字を勉強する (kanji o benkyō suru) → Belajar kanji." },
            { kanji: "映画", hiragana: "えいが", romaji: "eiga", answer: "film", contoh: "映画を見る (eiga o miru) → Menonton film." },
            { kanji: "技術", hiragana: "ぎじゅつ", romaji: "gijutsu", answer: "teknologi", contoh: "新しい技術 (atarashii gijutsu) → Teknologi baru." },
            { kanji: "医者", hiragana: "いしゃ", romaji: "isha", answer: "dokter", contoh: "医者に行く (isha ni iku) → Pergi ke dokter." },
            { kanji: "病院", hiragana: "びょういん", romaji: "byōin", answer: "rumah sakit", contoh: "病院で働く (byōin de hataraku) → Bekerja di rumah sakit." },
            { kanji: "質問", hiragana: "しつもん", romaji: "shitsumon", answer: "pertanyaan", contoh: "質問がある (shitsumon ga aru) → Ada pertanyaan." },
            { kanji: "答え", hiragana: "こたえ", romaji: "kotae", answer: "jawaban", contoh: "答えを教えて (kotae o oshiete) → Beritahu jawabannya." },
            { kanji: "音楽", hiragana: "おんがく", romaji: "ongaku", answer: "musik", contoh: "音楽を聴く (ongaku o kiku) → Mendengarkan musik." },
            { kanji: "意味", hiragana: "いみ", romaji: "imi", answer: "arti", contoh: "この言葉の意味 (kono kotoba no imi) → Arti kata ini." },
            { kanji: "特別", hiragana: "とくべつ", romaji: "tokubetsu", answer: "khusus", contoh: "特別な日 (tokubetsu na hi) → Hari khusus." },
            { kanji: "便利", hiragana: "べんり", romaji: "benri", answer: "praktis", contoh: "便利なアプリ (benri na apuri) → Aplikasi yang praktis." },
            { kanji: "急", hiragana: "きゅう", romaji: "kyū", answer: "terburu-buru", contoh: "急いでください (isoide kudasai) → Silakan cepat." },
            { kanji: "悪い", hiragana: "わるい", romaji: "warui", answer: "buruk", contoh: "天気が悪い (tenki ga warui) → Cuaca buruk." },
            { kanji: "痛い", hiragana: "いたい", romaji: "itai", answer: "sakit", contoh: "頭が痛い (atama ga itai) → Kepala sakit." },
            { kanji: "閉める", hiragana: "しめる", romaji: "shimeru", answer: "menutup", contoh: "窓を閉める (mado o shimeru) → Menutup jendela." },
            { kanji: "開ける", hiragana: "あける", romaji: "akeru", answer: "membuka", contoh: "ドアを開ける (doa o akeru) → Membuka pintu." },
            { kanji: "建物", hiragana: "たてもの", romaji: "tatemono", answer: "bangunan", contoh: "高い建物 (takai tatemono) → Bangunan tinggi." },
            { kanji: "道", hiragana: "みち", romaji: "michi", answer: "jalan", contoh: "道を歩く (michi o aruku) → Berjalan di jalan." },
            { kanji: "通る", hiragana: "とおる", romaji: "tōru", answer: "melewati", contoh: "橋を通る (hashi o tōru) → Melewati jembatan." },
            { kanji: "住所", hiragana: "じゅうしょ", romaji: "jūsho", answer: "alamat", contoh: "住所を書く (jūsho o kaku) → Menulis alamat." },
            { kanji: "広い", hiragana: "ひろい", romaji: "hiroi", answer: "luas", contoh: "広い公園 (hiroi kōen) → Taman yang luas." },
            { kanji: "狭い", hiragana: "せまい", romaji: "semai", answer: "sempit", contoh: "狭い部屋 (semai heya) → Kamar yang sempit." },
            { kanji: "相談", hiragana: "そうだん", romaji: "sōdan", answer: "konsultasi", contoh: "相談する (sōdan suru) → Berkonsultasi." },
            { kanji: "違う", hiragana: "ちがう", romaji: "chigau", answer: "berbeda", contoh: "意見が違う (iken ga chigau) → Pendapat berbeda." },
            { kanji: "続く", hiragana: "つづく", romaji: "tsuzuku", answer: "berlanjut", contoh: "雨が続く (ame ga tsuzuku) → Hujan berlanjut." },
            { kanji: "進む", hiragana: "すすむ", romaji: "susumu", answer: "maju", contoh: "前に進む (mae ni susumu) → Maju ke depan." },
            { kanji: "決める", hiragana: "きめる", romaji: "kimeru", answer: "memutuskan", contoh: "日程を決める (nittei o kimeru) → Memutuskan jadwal." },
            { kanji: "会議", hiragana: "かいぎ", romaji: "kaigi", answer: "rapat", contoh: "会議に出席する (kaigi ni shusseki suru) → Menghadiri rapat." },
            { kanji: "約束", hiragana: "やくそく", romaji: "yakusoku", answer: "janji", contoh: "約束を守る (yakusoku o mamoru) → Menjaga janji." },
            { kanji: "遅い", hiragana: "おそい", romaji: "osoi", answer: "lambat", contoh: "電車が遅い (densha ga osoi) → Kereta lambat." },
            { kanji: "早い", hiragana: "はやい", romaji: "hayai", answer: "cepat", contoh: "早く起きる (hayaku okiru) → Bangun cepat." },
            { kanji: "暑い", hiragana: "あつい", romaji: "atsui", answer: "panas", contoh: "今日は暑い (kyō wa atsui) → Hari ini panas." },
            { kanji: "寒い", hiragana: "さむい", romaji: "samui", answer: "dingin", contoh: "冬は寒い (fuyu wa samui) → Musim dingin itu dingin." },
            { kanji: "難しい", hiragana: "むずかしい", romaji: "muzukashii", answer: "sulit", contoh: "難しい問題 (muzukashii mondai) → Masalah sulit." },
            { kanji: "優しい", hiragana: "やさしい", romaji: "yasashii", answer: "baik hati", contoh: "優しい人 (yasashii hito) → Orang yang baik hati." },
            { kanji: "強い", hiragana: "つよい", romaji: "tsuyoi", answer: "kuat", contoh: "強い風 (tsuyoi kaze) → Angin kuat." },
            { kanji: "弱い", hiragana: "よわい", romaji: "yowai", answer: "lemah", contoh: "体が弱い (karada ga yowai) → Tubuh lemah." },
            { kanji: "必要", hiragana: "ひつよう", romaji: "hitsuyō", answer: "perlu", contoh: "必要なもの (hitsuyō na mono) → Hal yang diperlukan." },
            { kanji: "場所", hiragana: "ばしょ", romaji: "basho", answer: "tempat", contoh: "会議の場所 (kaigi no basho) → Tempat rapat." },
            { kanji: "持つ", hiragana: "もつ", romaji: "motsu", answer: "memegang", contoh: "かばんを持つ (kaban o motsu) → Memegang tas." },
            { kanji: "文化", hiragana: "ぶんか", romaji: "bunka", answer: "budaya", contoh: "日本文化 (nihon bunka) → Budaya Jepang." },
            { kanji: "社会", hiragana: "しゃかい", romaji: "shakai", answer: "masyarakat", contoh: "現代社会 (gendai shakai) → Masyarakat modern." },
            { kanji: "政治", hiragana: "せいじ", romaji: "seiji", answer: "politik", contoh: "政治の話 (seiji no hanashi) → Pembicaraan politik." },
            { kanji: "経済", hiragana: "けいざい", romaji: "keizai", answer: "ekonomi", contoh: "世界経済 (sekai keizai) → Ekonomi dunia." },
            { kanji: "産業", hiragana: "さんぎょう", romaji: "sangyō", answer: "industri", contoh: "自動車産業 (jidōsha sangyō) → Industri mobil." },
            { kanji: "情報", hiragana: "じょうほう", romaji: "jōhō", answer: "informasi", contoh: "重要な情報 (jūyō na jōhō) → Informasi penting." },
            { kanji: "運動", hiragana: "うんどう", romaji: "undō", answer: "olahraga", contoh: "運動する (undō suru) → Berolahraga." },
            { kanji: "動物", hiragana: "どうぶつ", romaji: "dōbutsu", answer: "hewan", contoh: "動物園 (dōbutsuen) → Kebun binatang." },
            { kanji: "植物", hiragana: "しょくぶつ", romaji: "shokubutsu", answer: "tumbuhan", contoh: "植物を育てる (shokubutsu o sodateru) → Menumbuhkan tanaman." }
        ],
        n5: [
            { kanji: "水", hiragana: "みず", romaji: "mizu", answer: "air", contoh: "水を飲む (mizu o nomu) → Minum air." },
            { kanji: "火", hiragana: "ひ", romaji: "hi", answer: "api", contoh: "火をつける (hi o tsukeru) → Menyalakan api." },
            { kanji: "山", hiragana: "やま", romaji: "yama", answer: "gunung", contoh: "富士山 (fujisan) → Gunung Fuji." },
            { kanji: "川", hiragana: "かわ", romaji: "kawa", answer: "sungai", contoh: "川で泳ぐ (kawa de oyogu) → Berenang di sungai." },
            { kanji: "木", hiragana: "き", romaji: "ki", answer: "pohon", contoh: "大きい木 (ōkii ki) → Pohon besar." },
            { kanji: "日", hiragana: "ひ", romaji: "hi", answer: "hari", contoh: "今日は良い日です (kyō wa ii hi desu) → Hari ini adalah hari yang baik." },
            { kanji: "月", hiragana: "つき", romaji: "tsuki", answer: "bulan", contoh: "満月 (mangetsu) → Bulan purnama." },
            { kanji: "人", hiragana: "ひと", romaji: "hito", answer: "orang", contoh: "日本人 (nihonjin) → Orang Jepang." },
            { kanji: "口", hiragana: "くち", romaji: "kuchi", answer: "mulut", contoh: "口を開ける (kuchi o akeru) → Membuka mulut." },
            { kanji: "目", hiragana: "め", romaji: "me", answer: "mata", contoh: "目を閉じる (me o tojiru) → Menutup mata." },
            { kanji: "耳", hiragana: "みみ", romaji: "mimi", answer: "telinga", contoh: "耳が痛い (mimi ga itai) → Telinga sakit." },
            { kanji: "手", hiragana: "て", romaji: "te", answer: "tangan", contoh: "手を洗う (te o arau) → Mencuci tangan." },
            { kanji: "足", hiragana: "あし", romaji: "ashi", answer: "kaki", contoh: "足が速い (ashi ga hayai) → Kaki cepat." },
            { kanji: "車", hiragana: "くるま", romaji: "kuruma", answer: "mobil", contoh: "新しい車 (atarashii kuruma) → Mobil baru." },
            { kanji: "本", hiragana: "ほん", romaji: "hon", answer: "buku", contoh: "面白い本 (omoshiroi hon) → Buku menarik." },
            { kanji: "大", hiragana: "おお", romaji: "ō", answer: "besar", contoh: "大きい (ōkii) → Besar." },
            { kanji: "小", hiragana: "ちい", romaji: "chii", answer: "kecil", contoh: "小さい (chiisai) → Kecil." },
            { kanji: "上", hiragana: "うえ", romaji: "ue", answer: "atas", contoh: "上に行く (ue ni iku) → Pergi ke atas." },
            { kanji: "下", hiragana: "した", romaji: "shita", answer: "bawah", contoh: "下に落ちる (shita ni ochiru) → Jatuh ke bawah." },
            { kanji: "中", hiragana: "なか", romaji: "naka", answer: "tengah", contoh: "部屋の中 (heya no naka) → Di dalam kamar." },
            { kanji: "外", hiragana: "そと", romaji: "soto", answer: "luar", contoh: "外に出る (soto ni deru) → Keluar." },
            { kanji: "右", hiragana: "みぎ", romaji: "migi", answer: "kanan", contoh: "右に曲がる (migi ni magaru) → Belok kanan." },
            { kanji: "左", hiragana: "ひだり", romaji: "hidari", answer: "kiri", contoh: "左に曲がる (hidari ni magaru) → Belok kiri." },
            { kanji: "前", hiragana: "まえ", romaji: "mae", answer: "depan", contoh: "前に進む (mae ni susumu) → Maju ke depan." },
            { kanji: "後", hiragana: "うし", romaji: "ushi", answer: "belakang", contoh: "後ろを見る (ushiro o miru) → Melihat ke belakang." },
            { kanji: "白", hiragana: "しろ", romaji: "shiro", answer: "putih", contoh: "白い紙 (shiroi kami) → Kertas putih." },
            { kanji: "黒", hiragana: "くろ", romaji: "kuro", answer: "hitam", contoh: "黒い靴 (kuroi kutsu) → Sepatu hitam." },
            { kanji: "赤", hiragana: "あか", romaji: "aka", answer: "merah", contoh: "赤いりんご (akai ringo) → Apel merah." },
            { kanji: "青", hiragana: "あお", romaji: "ao", answer: "biru", contoh: "青い空 (aoi sora) → Langit biru." },
            { kanji: "円", hiragana: "えん", romaji: "en", answer: "yen", contoh: "百円 (hyaku-en) → Seratus yen." },
            { kanji: "百", hiragana: "ひゃく", romaji: "hyaku", answer: "seratus", contoh: "百人 (hyakunin) → Seratus orang." },
            { kanji: "千", hiragana: "せん", romaji: "sen", answer: "seribu", contoh: "千円 (sen-en) → Seribu yen." },
            { kanji: "万", hiragana: "まん", romaji: "man", answer: "sepuluh ribu", contoh: "一万円 (ichiman-en) → Sepuluh ribu yen." },
            { kanji: "時", hiragana: "とき", romaji: "toki", answer: "waktu", contoh: "時間 (jikan) → Waktu." },
            { kanji: "分", hiragana: "ふん", romaji: "fun", answer: "menit", contoh: "五分 (gofun) → Lima menit." },
            { kanji: "何", hiragana: "なに", romaji: "nani", answer: "apa", contoh: "何ですか (nan desu ka) → Apa ini?" },
            { kanji: "今", hiragana: "いま", romaji: "ima", answer: "sekarang", contoh: "今日 (kyō) → Hari ini." },
            { kanji: "名", hiragana: "な", romaji: "na", answer: "nama", contoh: "名前 (namae) → Nama." },
            { kanji: "国", hiragana: "くに", romaji: "kuni", answer: "negara", contoh: "外国 (gaikoku) → Negara asing." },
            { kanji: "学", hiragana: "まな", romaji: "mana", answer: "belajar", contoh: "学校 (gakkō) → Sekolah." },
            { kanji: "生", hiragana: "い", romaji: "i", answer: "hidup", contoh: "生まれる (umareru) → Lahir." },
            { kanji: "先", hiragana: "さき", romaji: "saki", answer: "dulu", contoh: "先生 (sensei) → Guru." },
            { kanji: "友", hiragana: "とも", romaji: "tomo", answer: "teman", contoh: "友達 (tomodachi) → Teman." },
            { kanji: "父", hiragana: "ちち", romaji: "chichi", answer: "ayah", contoh: "お父さん (otōsan) → Ayah." },
            { kanji: "母", hiragana: "はは", romaji: "haha", answer: "ibu", contoh: "お母さん (okāsan) → Ibu." },
            { kanji: "子", hiragana: "こ", romaji: "ko", answer: "anak", contoh: "子供 (kodomo) → Anak-anak." },
            { kanji: "男", hiragana: "おとこ", romaji: "otoko", answer: "laki-laki", contoh: "男の子 (otoko no ko) → Anak laki-laki." },
            { kanji: "女", hiragana: "おんな", romaji: "onna", answer: "perempuan", contoh: "女の子 (onna no ko) → Anak perempuan." },
            { kanji: "見", hiragana: "み", romaji: "mi", answer: "melihat", contoh: "見る (miru) → Melihat." },
            { kanji: "行", hiragana: "い", romaji: "i", answer: "pergi", contoh: "行く (iku) → Pergi." },
            { kanji: "来", hiragana: "く", romaji: "ku", answer: "datang", contoh: "来る (kuru) → Datang." },
            { kanji: "食", hiragana: "た", romaji: "ta", answer: "makan", contoh: "食べる (taberu) → Makan." },
            { kanji: "飲", hiragana: "の", romaji: "no", answer: "minum", contoh: "飲む (nomu) → Minum." },
            { kanji: "聞", hiragana: "き", romaji: "ki", answer: "mendengar", contoh: "聞く (kiku) → Mendengar." },
            { kanji: "読", hiragana: "よ", romaji: "yo", answer: "membaca", contoh: "読む (yomu) → Membaca." },
            { kanji: "書", hiragana: "か", romaji: "ka", answer: "menulis", contoh: "書く (kaku) → Menulis." },
            { kanji: "休", hiragana: "やす", romaji: "yasu", answer: "istirahat", contoh: "休む (yasumu) → Beristirahat." },
            { kanji: "入", hiragana: "はい", romaji: "hai", answer: "masuk", contoh: "入る (hairu) → Masuk." },
            { kanji: "出", hiragana: "で", romaji: "de", answer: "keluar", contoh: "出る (deru) → Keluar." },
            { kanji: "高", hiragana: "たか", romaji: "taka", answer: "tinggi", contoh: "高い (takai) → Tinggi." },
            { kanji: "安", hiragana: "やす", romaji: "yasu", answer: "murah", contoh: "安い (yasui) → Murah." },
            { kanji: "新", hiragana: "あたら", romaji: "atara", answer: "baru", contoh: "新しい (atarashii) → Baru." },
            { kanji: "古", hiragana: "ふる", romaji: "furu", answer: "lama", contoh: "古い (furui) → Lama/tua." },
            { kanji: "電", hiragana: "でん", romaji: "den", answer: "listrik", contoh: "電気 (denki) → Listrik." },
            { kanji: "話", hiragana: "はな", romaji: "hana", answer: "bicara", contoh: "話す (hanasu) → Berbicara." },
            { kanji: "語", hiragana: "ご", romaji: "go", answer: "bahasa", contoh: "日本語 (nihongo) → Bahasa Jepang." },
            { kanji: "買", hiragana: "か", romaji: "ka", answer: "membeli", contoh: "買う (kau) → Membeli." },
            { kanji: "店", hiragana: "みせ", romaji: "mise", answer: "toko", contoh: "本屋さん (honya-san) → Toko buku." }
        ]
    }

    // Cek level valid atau tidak
    if (!kanjiDB[level]) return cht.reply("❌ Level tidak ditemukan! Gunakan `.tebakkanji <n1/n2/n3/n4/n5>`")

    let { kanji, hiragana, romaji, answer, contoh } = kanjiDB[level][Math.floor(Math.random() * kanjiDB[level].length)]

    metadata.game = {
        type: cht.cmd,
        startTime: Date.now(),
        endTime: Date.now() + maxAge,
        kanji,
        hiragana,
        romaji,
        answer,
        level,
        contoh,
        energy: cfg.hadiah[cht.cmd],
        creator: {
            name: cht.pushName,
            id: cht.sender
        },
        id_message: []
    }

    let formatDur = func.formatDuration(maxAge)

    let caption = `🈸 \`𝐓𝐄𝐁𝐀𝐊 𝐊𝐀𝐍𝐉𝐈\` 🈲\n\n`
        + `𝙻𝚎𝚟𝚎𝚕: *${level.toUpperCase()}*\n`
        + `𝙺𝚊𝚗𝚓𝚒: *${kanji}*\n`
        + `𝙷𝚒𝚛𝚊𝚐𝚊𝚗𝚊: *${hiragana}*\n`
        + `𝚁𝚘𝚖𝚊𝚓𝚒: *${romaji}*\n`
        + `📖 *𝙰𝚛𝚝𝚒 𝚍𝚊𝚕𝚊𝚖 𝚋𝚊𝚑𝚊𝚜𝚊 𝙸𝚗𝚍𝚘𝚗𝚎𝚜𝚒𝚊?*\n\n`
        + `⏳ 𝚆𝚊𝚔𝚝𝚞: ${formatDur.minutes} 𝚖𝚎𝚗𝚒𝚝 ${formatDur.seconds} 𝚍𝚎𝚝𝚒𝚔\n`
        + `🏆 𝙷𝚊𝚍𝚒𝚊𝚑: ${cfg.hadiah[cht.cmd]} 𝙴𝚗𝚎𝚛𝚐𝚢⚡\n\n`
        + `*𝚁𝚎𝚙𝚕𝚢 𝚙𝚎𝚜𝚊𝚗 𝚒𝚗𝚒 𝚞𝚗𝚝𝚞𝚔 𝚖𝚎𝚗𝚓𝚊𝚠𝚊𝚋!*`

    let { key } = await Exp.sendMessage(id, { text: caption }, { quoted: cht })
    metadata.game.id_message.push(key.id)
    metadata.game.key = key

    global.timeouts[id] = setTimeout(async () => {
        delete Data.preferences[id].game
        delete global.timeouts[id]

        await cht.reply(`\`𝐆𝐀𝐌𝐄 𝐁𝐄𝐑𝐀𝐊𝐇𝐈𝐑\`\n\n𝙹𝚊𝚠𝚊𝚋𝚊𝚗: *${answer}*\n📖 *𝙷𝚒𝚛𝚊𝚐𝚊𝚗𝚊:* ${hiragana}\n🗣️ *𝙲𝚊𝚛𝚊 𝚋𝚊𝚌𝚊:* ${romaji}\n📌 *𝙲𝚘𝚗𝚝𝚘𝚑:* ${contoh}`)
        Exp.sendMessage(cht.id, { delete: key })
    }, maxAge)
}) // tebakkanji



 ev.on({
    cmd: ["tebakkimia"],
    listmenu: ["tebakkimia"],
    tag: "game",
    isGroup: true,
    energy: 20
}, async () => {
    cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 35
    if ("game" in metadata) return cht.reply(hasGame)

    let maxAge = 60000 // 1 menit
    let apiUrl = "https://api.siputzx.my.id/api/games/tebakkimia"

    try {
        let response = await fetch(apiUrl)
        if (!response.ok) throw new Error(`Gagal mengambil soal, status: ${response.status}`)
        
        let { data } = await response.json()
        let { unsur: question, lambang: answer } = data

        if (!question || !answer) throw new Error("Data API tidak lengkap!")

        metadata.game = {
            type: cht.cmd,
            startTime: Date.now(),
            endTime: Date.now() + maxAge,
            question,
            answer,
            energy: cfg.hadiah[cht.cmd],
            creator: {
                name: cht.pushName,
                id: cht.sender
            },
            id_message: []
        }

        let _key = keys[cht.sender]
        await cht.edit("\`𝐆𝐀𝐌𝐄 𝐒𝐓𝐀𝐑𝐓\`", _key)
        let formatDur = func.formatDuration(maxAge)

        let caption = `🧪 \`𝐓𝐄𝐁𝐀𝐊 𝐊𝐈𝐌𝐈𝐀\` 🧪\n\n`
            + `𝙻𝚊𝚖𝚋𝚊𝚗𝚐 𝚍𝚊𝚛𝚒: *${question}*\n\n`
            + `𝚆𝚊𝚔𝚝𝚞 𝚖𝚎𝚗𝚓𝚊𝚠𝚊𝚋: *${formatDur.minutes} 𝚖𝚎𝚗𝚒𝚝 ${formatDur.seconds} 𝚍𝚎𝚝𝚒𝚔*\n`
            + `𝙱𝚎𝚛𝚊𝚔𝚑𝚒𝚛 𝚙𝚊𝚍𝚊: *${func.dateFormatter(metadata.game.endTime, "Asia/Jakarta")}*\n\n`
            + `𝙷𝚊𝚍𝚒𝚊𝚑: *${cfg.hadiah[cht.cmd]} 𝙴𝚗𝚎𝚛𝚐𝚢⚡*\n\n`
            + `*𝚁𝚎𝚙𝚕𝚢 𝚙𝚎𝚜𝚊𝚗 𝚒𝚗𝚒 𝚞𝚗𝚝𝚞𝚔 𝚖𝚎𝚗𝚓𝚊𝚠𝚊𝚋!*`

        let { key } = await Exp.sendMessage(id, { text: caption }, { quoted: cht })
        metadata.game.id_message.push(key.id)
        metadata.game.key = key

        global.timeouts[id] = setTimeout(async () => {
            delete Data.preferences[id].game
            delete global.timeouts[id]

            await cht.reply(`\`𝐆𝐀𝐌𝐄 𝐁𝐄𝐑𝐀𝐊𝐇𝐈𝐑\`\n\n𝙹𝚊𝚠𝚊𝚋𝚊𝚗: ${answer}`)
            Exp.sendMessage(cht.id, { delete: key })
        }, maxAge)
    } catch (error) {
        console.error("Error saat memulai game Tebak kimia:", error)
        return cht.reply(`❌ Gagal memulai game!\nError: ${error.message}`)
    }
}) // tebakkimia

 ev.on({
    cmd: ["tekateki"],
    listmenu: ["tekateki"],
    tag: "game",
    isGroup: true,
    energy: 20
}, async () => {
    cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 35
    if ("game" in metadata) return cht.reply(hasGame)

    let maxAge = 60000 // 1 menit
    let apiUrl = "https://api.siputzx.my.id/api/games/tekateki"

    try {
        let response = await fetch(apiUrl)
        if (!response.ok) throw new Error(`Gagal mengambil soal, status: ${response.status}`)
        
        let { data } = await response.json()
        let { soal: question, jawaban: answer } = data

        if (!question || !answer) throw new Error("Data API tidak lengkap!")

        metadata.game = {
            type: cht.cmd,
            startTime: Date.now(),
            endTime: Date.now() + maxAge,
            question,
            answer,
            energy: cfg.hadiah[cht.cmd],
            creator: {
                name: cht.pushName,
                id: cht.sender
            },
            id_message: []
        }

        let _key = keys[cht.sender]
        await cht.edit("Starting game Siapakah Aku...", _key)
        let formatDur = func.formatDuration(maxAge)

        let caption = `TEKA TEKI \n\n`
            + `Soal *${question}*\n\n`
            + `Waktu menjawab: ${formatDur.minutes} menit ${formatDur.seconds} detik\n`
            + `End Time: ${func.dateFormatter(metadata.game.endTime, "Asia/Jakarta")}\n\n`
            + `Hadiah: ${cfg.hadiah[cht.cmd]} Energy⚡\n\n`
            + `*Reply pesan ini untuk menjawab!*`

        let { key } = await Exp.sendMessage(id, { text: caption }, { quoted: cht })
        metadata.game.id_message.push(key.id)
        metadata.game.key = key

        global.timeouts[id] = setTimeout(async () => {
            delete Data.preferences[id].game
            delete global.timeouts[id]

            await cht.reply(`*WAKTU HABIS*\n\nJawaban: ${answer}`)
            Exp.sendMessage(cht.id, { delete: key })
        }, maxAge)
    } catch (error) {
        console.error("Error saat memulai game Teka Teki:", error)
        return cht.reply(`❌ Gagal memulai game!\nError: ${error.message}`)
    }
}) // tekateki

ev.on({
    cmd: ["tebakheroml"],
    listmenu: ["tebakheroml"],
    tag: "game",
    isGroup: true,
    energy: 20
}, async () => {
    cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 35
    if ("game" in metadata) return cht.reply("Masih ada game yang belum selesai!")

    const maxAge = 60000 // 1 menit
    const apiUrl = "https://api.siputzx.my.id/api/games/tebakheroml"

    try {
        const res = await fetch(apiUrl)
        if (!res.ok) throw new Error(`Gagal ambil data, status: ${res.status}`)
        
        const json = await res.json()
        const { name: jawaban, audio: soal } = json.data

        if (!soal) throw new Error("Audio hero tidak tersedia.")

        metadata.game = {
            type: cht.cmd,
            startTime: Date.now(),
            endTime: Date.now() + maxAge,
            answer: jawaban.toLowerCase(),
            energy: cfg.hadiah[cht.cmd],
            creator: {
                name: cht.pushName,
                id: cht.sender
            },
            id_message: []
        }

        let _key = keys[cht.sender]
        await edit("Starting game tebak hero ml...", _key)
        
        const formatDur = func.formatDuration(maxAge)
        const caption = `🎮 *TEBAK SUARA HERO MLBB* 🎮
        
Tebak hero dari suaranya...
⏳ Waktu menjawab: \`${formatDur.minutes} menit ${formatDur.seconds} detik\`
⏱️ Berakhir setelah: \`${func.dateFormatter(metadata.game.endTime, "Asia/Jakarta")}\`
🎁 Hadiah: ${cfg.hadiah[cht.cmd]} Energy ⚡

*Reply audio ini untuk menjawab!*`
        
        await cht.reply(caption)
        
        const { key } = await Exp.sendMessage(id, {
            audio: { url: soal },
            mimetype: 'audio/ogg',
            ptt: true
        }, { quoted: cht })

        metadata.game.id_message.push(key.id)
        metadata.game.key = key

        global.timeouts[cht.id] = setTimeout(async () => {
            delete metadata.game
            delete global.timeouts[cht.id]
            await cht.reply(`⌛ *WAKTU HABIS!*\nJawaban yang benar adalah: *${jawaban}*`)
            Exp.sendMessage(cht.id, { delete: key })
        }, maxAge)

    } catch (err) {
        console.error(err)
        return reply(`❌ Gagal memulai game!\nError: ${err.message}`)
    }
})

ev.on({
    cmd: ["tebakkata"],
    listmenu: ["tebakkata"],
    tag: "game",
    isGroup: true,
    energy: 20
}, async () => {

    cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 35
    if ("game" in metadata) return cht.reply(hasGame)

    let maxAge = 60000
    let apiUrl = "https://api.siputzx.my.id/api/games/tebakkata"

    try {
        let response = await fetch(apiUrl)
        if (!response.ok) throw new Error(`Gagal mengambil soal, status: ${response.status}`)

        let { data } = await response.json()
        let { soal: question, jawaban: answer } = data

        if (!question || !answer) throw new Error("Data API tidak lengkap!")

        metadata.game = {
            type: cht.cmd,
            startTime: Date.now(),
            endTime: Date.now() + maxAge,
            question,
            answer,
            energy: cfg.hadiah[cht.cmd],
            creator: {
                name: cht.pushName,
                id: cht.sender
            },
            id_message: []
        }

        let _key = keys[cht.sender]
        await edit("Starting game tebak kata...", _key)

        let formatDur = func.formatDuration(maxAge)
        let caption = `🗯️ *TEBAK KATA* 🗯️

Soal: *${question}*

⏳ Waktu menjawab: \`${formatDur.minutes} menit ${formatDur.seconds} detik\`
⏱️ Berakhir setelah: \`${func.dateFormatter(metadata.game.endTime, "Asia/Jakarta")}\`
🎁 Hadiah: ${cfg.hadiah[cht.cmd]} Energy ⚡

*Reply pesan ini untuk menjawab!*`

        let { key } = await Exp.sendMessage(id, {
           text: caption 
        }, {
           quoted: cht 
        })
        
        metadata.game.id_message.push(key.id)
        metadata.game.key = key

        global.timeouts[id] = setTimeout(async () => {
            delete Data.preferences[id].game
            delete global.timeouts[id]

            await cht.reply(`⌛ *WAKTU HABIS!*\nJawaban yang benar adalah: *${answer}*`)
            Exp.sendMessage(cht.id, { delete: key })
        }, maxAge)

    } catch (error) {
        console.error(error)
        return cht.reply(`❌ Gagal memulai game!\nError: ${error.message}`)
    }
})

ev.on({
    cmd: ["tebakkabupaten"],
    listmenu: ["tebakkabupaten"],
    tag: "game",
    isGroup: true,
    energy: 25
}, async () => {

    cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 35
    if ("game" in metadata) return cht.reply(hasGame)

    let maxAge = 60000 // 1 menit
    let apiUrl = "https://api.siputzx.my.id/api/games/kabupaten"

    try {
        let response = await fetch(apiUrl)
        if (!response.ok) throw new Error(`Gagal mengambil soal, status: ${response.status}`)

        let data = await response.json()
        let { title: answer, url: imageUrl, link: wikiLink } = data

        if (!answer || !imageUrl || !wikiLink) throw new Error("Data API tidak lengkap!")

        metadata.game = {
            type: cht.cmd,
            startTime: Date.now(),
            endTime: Date.now() + maxAge,
            answer,
            wikiLink,
            energy: cfg.hadiah[cht.cmd],
            creator: {
                name: cht.pushName,
                id: cht.sender
            },
            id_message: []
        }

        let _key = keys[cht.sender]
        await edit("Starting game tebak kabupaten...", _key)

        let formatDur = func.formatDuration(maxAge)
        let caption = `🏛️ *TEBAK KABUPATEN* 🏛️
        
Kabupaten apakah ini berdasarkan gambar lambangnya?

⏳ Waktu menjawab: \`${formatDur.minutes} menit ${formatDur.seconds} detik\`
⏱️ Berakhir setelah: \`${func.dateFormatter(metadata.game.endTime, "Asia/Jakarta")}\`
🎁 Hadiah: ${cfg.hadiah[cht.cmd]} Energy ⚡

*Reply pesan ini untuk menjawab!*`

        let { key } = await Exp.sendMessage(id, {
            image: { 
              url: imageUrl 
            },
            caption 
        }, {
            quoted: cht 
        })
        
        metadata.game.id_message.push(key.id)
        metadata.game.key = key

        global.timeouts[id] = setTimeout(async () => {
            delete Data.preferences[id].game
            delete global.timeouts[id]

            await reply(`⌛ *WAKTU HABIS!*\nJawaban yang benar adalah: *${answer}*`)
            Exp.sendMessage(cht.id, { delete: key })
        }, maxAge)

    } catch (error) {
        console.error("Error saat memulai game Tebak Kabupaten:", error)
        return reply(`❌ Gagal memulai game!\nError: ${error.message}`)
    }

})
  
ev.on({
    cmd: ["siapakahaku"],
    listmenu: ["siapakahaku"],
    tag: "game",
    isGroup: true,
    energy: 20
}, async () => {

    cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 35
    if ("game" in metadata) return cht.reply(hasGame)

    let maxAge = 60000 // 1 menit
    let apiUrl = "https://api.siputzx.my.id/api/games/siapakahaku"

    try {
        let response = await fetch(apiUrl)
        if (!response.ok) throw new Error(`Gagal mengambil soal, status: ${response.status}`)

        let { data } = await response.json()
        let { soal: question, jawaban: answer } = data

        if (!question || !answer) throw new Error("Data API tidak lengkap!")

        metadata.game = {
            type: cht.cmd,
            startTime: Date.now(),
            endTime: Date.now() + maxAge,
            question,
            answer,
            energy: cfg.hadiah[cht.cmd],
            creator: {
                name: cht.pushName,
                id: cht.sender
            },
            id_message: []
        }

        let _key = keys[cht.sender]
        await edit("Starting game siapakah aku...", _key)

        let formatDur = func.formatDuration(maxAge)
        let caption = `❓ *SIAPAKAH AKU* ❓

Soal: *${question}*

⏳ Waktu menjawab: \`${formatDur.minutes} menit ${formatDur.seconds} detik\`
⏱️ Berakhir setelah: \`${func.dateFormatter(metadata.game.endTime, "Asia/Jakarta")}\`
Hadiah: ${cfg.hadiah[cht.cmd]} Energy ⚡

*Reply pesan ini untuk menjawab!*`

        let { key } = await Exp.sendMessage(id, {
            text: caption 
        }, {
            quoted: cht 
        })
        
        metadata.game.id_message.push(key.id)
        metadata.game.key = key

        global.timeouts[id] = setTimeout(async () => {
            delete Data.preferences[id].game
            delete global.timeouts[id]

            await reply(`⌛ *WAKTU HABIS!*\nJawaban yang benar adalah: *${answer}*`)
            Exp.sendMessage(cht.id, { delete: key })
        }, maxAge)

    } catch (error) {
        console.error(error)
        return reply(`❌ Gagal memulai game!\nError: ${error.message}`)
    }

})
  
ev.on({
    cmd: ["lengkapikalimat"],
    listmenu: ["lengkapikalimat"],
    tag: "game",
    isGroup: true,
    energy: 20
}, async () => {

    cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 35
    if ("game" in metadata) return cht.reply(hasGame)

    let maxAge = 60000 // 1 menit
    let apiUrl = "https://api.siputzx.my.id/api/games/lengkapikalimat"

    try {
        let response = await fetch(apiUrl)
        if (!response.ok) throw new Error(`Gagal mengambil soal, status: ${response.status}`)

        let { data } = await response.json()
        let { pertanyaan: question, jawaban: answer } = data

        if (!question || !answer) throw new Error("Data API tidak lengkap!")

        metadata.game = {
            type: cht.cmd,
            startTime: Date.now(),
            endTime: Date.now() + maxAge,
            question,
            answer,
            energy: cfg.hadiah[cht.cmd],
            creator: {
                name: cht.pushName,
                id: cht.sender
            },
            id_message: []
        }

        let _key = keys[cht.sender]
        await cht.edit("Starting game lengkapi kalimat...", _key)

        let formatDur = func.formatDuration(maxAge)
        let caption = `✍️ *LENGKAPI KALIMAT* ✍️
        
Soal: *${question}*

⏳ Waktu menjawab: \`${formatDur.minutes} menit ${formatDur.seconds} detik\`
⏱️ Berakhir setelah: \`${func.dateFormatter(metadata.game.endTime, "Asia/Jakarta")}\`
🎁 Hadiah: ${cfg.hadiah[cht.cmd]} Energy ⚡

*Reply pesan ini untuk menjawab!*`

        let { key } = await Exp.sendMessage(id, {
           text: caption 
        }, {
            quoted: cht 
        })
        
        metadata.game.id_message.push(key.id)
        metadata.game.key = key

        global.timeouts[id] = setTimeout(async () => {
            delete Data.preferences[id].game
            delete global.timeouts[id]

            await reply(`⌛ *WAKTU HABIS!*\nJawaban yang benar adalah: *${answer}*`)
            Exp.sendMessage(cht.id, { delete: key })
        }, maxAge)

    } catch (error) {
        console.error("Error saat memulai game Lengkapi Kalimat:", error)
        return cht.reply(`❌ Gagal memulai game!\nError: ${error.message}`)
    }

})

ev.on({
    cmd: ["asahotak"],
    listmenu: ["asahotak"],
    tag: "game",
    isGroup: true,
    energy: 20
}, async () => {

    cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 35
    if ("game" in metadata) return cht.reply(hasGame)

    let maxAge = 60000 // 1 menit
    let apiUrl = "https://api.siputzx.my.id/api/games/asahotak"

    try {
        let response = await fetch(apiUrl)
        if (!response.ok) throw new Error(`Gagal mengambil soal, status: ${response.status}`)

        let { data } = await response.json()
        let { soal: question, jawaban: answer } = data

        if (!question || !answer) throw new Error("Data API tidak lengkap!")

        metadata.game = {
            type: cht.cmd,
            startTime: Date.now(),
            endTime: Date.now() + maxAge,
            question,
            answer,
            energy: cfg.hadiah[cht.cmd],
            creator: {
                name: cht.pushName,
                id: cht.sender
            },
            id_message: []
        }

        let _key = keys[cht.sender]
        await edit("Starting game asah otak...", _key)

        let formatDur = func.formatDuration(maxAge)
        let caption = `💡 *ASAH OTAK* 💡
        
soal: *${question}*

⏳ Waktu menjawab: ${formatDur.minutes} menit ${formatDur.seconds} detik\`
⏱️ Berakhir setelah: ${func.dateFormatter(metadata.game.endTime, "Asia/Jakarta")}\`
🎁 Hadiah: ${cfg.hadiah[cht.cmd]} Energy ⚡

*Reply pesan ini untuk menjawab!*`

        let { key } = await Exp.sendMessage(id, {
           text: caption 
        }, { 
           quoted: cht 
        })
        
        metadata.game.id_message.push(key.id)
        metadata.game.key = key

        global.timeouts[id] = setTimeout(async () => {
            delete Data.preferences[id].game
            delete global.timeouts[id]

            await reply(`⌛ *WAKTU HABIS!*\nJawaban yang benar adalah: *${answer}*`)
            Exp.sendMessage(cht.id, { delete: key })
        }, maxAge)

    } catch (error) {
        console.error(error)
        return cht.reply(`❌ Gagal memulai game!\nError: ${error.message}`)
    }

})

ev.on({
    cmd: ["slot", "slots"],
    listmenu: ["slot"],
    tag: "judi",
    isGroup: true,
    energy: 50,
}, async ({ cht, Exp }) => {
    try {
        const symbols = ["🍒", "🍋", "🍊", "💎", "🔔", "👑", "💰", "🍌"];
        const rewards = {
            "🔔": { name: "🥇 Legend", chance: 0.05, min: 200, max: 400 },
            "👑": { name: "🥈 Epic", chance: 0.10, min: 100, max: 250 },
            "💎": { name: "🥉 Rare", chance: 0.15, min: 50, max: 150 },
            "🍒": { name: "📦 Common", chance: 0.70, min: 10, max: 50 },
            "🍋": { name: "📦 Common", chance: 0.70, min: 10, max: 50 },
            "🍊": { name: "📦 Common", chance: 0.70, min: 10, max: 50 },
            "💰": { name: "📦 Common", chance: 0.70, min: 10, max: 50 },
            "🍌": { name: "📦 Common", chance: 0.70, min: 10, max: 50 },
        };

        function rand() {
            return symbols[Math.floor(Math.random() * symbols.length)];
        }

        function getRandomSlot() {
            let row1 = [rand(), rand(), rand()];
            let commonSymbol = rand();
            let row2 = [commonSymbol, Math.random() < 0.3 ? commonSymbol : rand(), Math.random() < 0.3 ? commonSymbol : rand()];
            let row3 = [rand(), rand(), rand()];
            return [row1, row2, row3];
        }

        let message = await cht.reply("🎰 *Memutar slot...*");
        let messageKey = message.key;

        for (let i = 0; i < 5; i++) {
            let slotResult = getRandomSlot();
            let slotText = `
🎰 | SLOTS 
-------------------
${slotResult[0].join(" : ")}
${slotResult[1].join(" : ")}
${slotResult[2].join(" : ")}
-------------------
⏳ Memutar...`;

            await new Promise(res => setTimeout(res, 800));
            await cht.edit(slotText, messageKey);
        }

        let finalSlot = getRandomSlot();
        let finalText = `
🎰 | SLOTS 
-------------------
${finalSlot[0].join(" : ")}
${finalSlot[1].join(" : ")}  <=====
${finalSlot[2].join(" : ")}
-------------------`;

        let userID = cht.sender.split("@")[0];
        let winningSymbol = finalSlot[1][0];

        // **🔧 Kurangi peluang menang jadi 20%**
        let menang = Math.random() < 0.2 || (finalSlot[1][0] === finalSlot[1][1] && finalSlot[1][1] === finalSlot[1][2]);

        if (menang) {
            let reward = rewards[winningSymbol] || rewards["🍒"];
            let amount = Math.floor(Math.random() * (reward.max - reward.min + 1)) + reward.min;
            
            // **🔥 JACKPOT x2 (10% kemungkinan)**
            if (["🔔", "👑", "💎"].includes(winningSymbol) && Math.random() < 0.1) {
                amount *= 2;
                finalText += "\n🎉 🎊 JACKPOT! x2 🎊";
            }

            finalText += `\n🎉 Kamu menang! +${amount} Energy ⚡\nItem: ${winningSymbol} (${reward.name})`;

            // **🔧 Simpan energy ke database**
            let success = false;
            try { await Exp.addEnergy(cht.sender, amount); success = true; } catch (e) {}
            try { await Exp.updateEnergy?.(cht.sender, amount); success = true; } catch (e) {}

            if (!success) {
                if (!(userID in Data.users)) {
                    Data.users[userID] = { energy: 0 };
                }
                Data.users[userID].energy += amount;
            }
        } else {
            finalText += "\n😢 Kamu kalah.";
        }

        await cht.edit(finalText, messageKey);

    } catch (error) {
        console.error("❌ Error di game Slot Machine:", error);
        return cht.reply(`⚠️ *Terjadi kesalahan saat bermain slot!* \nError: ${error.message}`);
    }
});

ev.on({
  cmd: ["tebaklagu"],
  listmenu: ["tebaklagu"],
  tag: "game",
  isGroup: true,
  energy: 10
}, async () => {
  cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 50;
  if ("game" in metadata) return cht.reply(hasGame);
    let _key = keys[cht.sender];
    await cht.edit("Starting game...", _key);

  const maxAge = 60000;
  const apiUrl = "https://api.siputzx.my.id/api/games/tebaklagu";

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`Gagal ambil soal: ${res.statusText}`);

    const json = await res.json();
    const audio = json?.data?.lagu;
    const answer = json?.data?.judul;

  if (!audio || !answer) {
  console.error("Struktur data API tidak sesuai:", JSON.stringify(json, null, 2));
  throw new Error("Data tidak lengkap dari API!");
}

    metadata.game = {
      type: cht.cmd,
      startTime: Date.now(),
      endTime: Date.now() + maxAge,
      question: "Tebak judul lagu dari potongan suara ini",
      answer: answer.toLowerCase(),
      audio,
      energy: cfg.hadiah[cht.cmd],
      creator: {
        name: cht.pushName,
        id: cht.sender
      },
      id_message: []
    };

    const caption = `🎵 *TEBAK LAGU INDONESIA*\n\n` +
      `🔊 Dengarkan potongan lagu berikut.\n` +
      `📝 Tebak judul lagu-nya!\n\n` +
      `⏱️ Waktu: 1 menit\n` +
      `🎁 Hadiah: ${cfg.hadiah[cht.cmd]} Energy⚡\n\n` +
      `*Balas audio ini untuk menjawab!*`;

    // Kirim audio
    const { key } = await Exp.sendMessage(id, {
      audio: { url: audio },
      mimetype: "audio/mpeg",
      ptt: true
    }, { quoted: cht });

    // Kirim caption terpisah
    const { key: keyCaption } = await cht.reply(caption);

    metadata.game.id_message.push(key.id);
    metadata.game.id_message.push(keyCaption.id);
    metadata.game.key = key;

    global.timeouts[id] = setTimeout(async () => {
      for (const msgId of metadata.game.id_message) {
        try {
          await Exp.sendMessage(cht.id, {
            delete: { remoteJid: cht.id, id: msgId, fromMe: true }
          });
        } catch (err) {
          console.error("Gagal hapus pesan:", msgId, err);
        }
      }

      await cht.reply(`⏰ *WAKTU HABIS!*\nJawaban: *${answer}*`);
      delete Data.preferences[id].game;
      delete global.timeouts[id];
    }, maxAge);

  } catch (err) {
    console.error("Error saat memulai game:", err);
    return cht.reply(`❌ Gagal memulai game!\nError: ${err.message}`);
  }
})

ev.on({
    cmd: ["tebakbendera"],
    listmenu: ["tebakbendera"],
    tag: "game",
    isGroup: true,
    energy: 20
}, async () => {
    cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 35
    if ("game" in metadata) return cht.reply(hasGame)

    let maxAge = 60000 // 1 menit
    let apiUrl = "https://api.siputzx.my.id/api/games/tebakbendera"

    try {
        let response = await fetch(apiUrl)
        if (!response.ok) throw new Error(`Gagal mengambil data, status: ${response.status}`)

        let data = await response.json()
        let { name: answer, img: url } = data

        if (!url) throw new Error("URL gambar kosong!")

        metadata.game = {
            type: cht.cmd,
            startTime: Date.now(),
            endTime: Date.now() + maxAge,
            answer,
            energy: cfg.hadiah[cht.cmd],
            creator: {
                name: cht.pushName,
                id: cht.sender
            },
            id_message: []
        }

        let _key = keys[cht.sender]
        await cht.edit("Starting game tebak bendera...", _key)

        let formatDur = func.formatDuration(maxAge)

        let caption = `🏳️ *TEBAK BENDERA* 🏳️

Tebak foto bendera berikut dengan benar
⏳ Waktu menjawab: \`${formatDur.minutes} menit ${formatDur.seconds} detik\`
⏱️ Berakhir setelah: \`${func.dateFormatter(metadata.game.endTime, "Asia/Jakarta")}\`
🎁 Hadiah: ${cfg.hadiah[cht.cmd]} Energy⚡

*Reply pesan ini untuk menjawab!*`

        let { key } = await Exp.sendMessage(id, {
            image: {
               url 
            },
            caption
        }, { quoted: cht })

        metadata.game.id_message.push(key.id)
        metadata.game.key = key

        global.timeouts[id] = setTimeout(async () => {
            delete Data.preferences[id].game
            delete global.timeouts[id]

            await reply(`⌛ *WAKTU HABIS!*\nJawaban yang benar adalah: *${answer}*`)
            Exp.sendMessage(cht.id, { delete: key })
        }, maxAge)

    } catch (error) {
        console.error(error)
        return reply(`❌ Gagal memulai game!\nError: ${error.message}`)
    }
})

ev.on({
    cmd: ["tebaklirik"],
    listmenu: ["tebaklirik"],
    tag: "game",
    isGroup: true,
    energy: 20
}, async () => {
    cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 35
    if ("game" in metadata) return cht.reply(hasGame)

    let maxAge = 60000 // 1 menit
    let apiUrl = "https://api.siputzx.my.id/api/games/tebaklirik"

    try {
        let response = await fetch(apiUrl)
        if (!response.ok) throw new Error(`Gagal mengambil soal, status: ${response.status}`)

        let { data } = await response.json()
        let { soal: question, jawaban: answer } = data

        if (!question || !answer) throw new Error("Data API tidak lengkap!")

        metadata.game = {
            type: cht.cmd,
            startTime: Date.now(),
            endTime: Date.now() + maxAge,
            question,
            answer,
            energy: cfg.hadiah[cht.cmd],
            creator: {
                name: cht.pushName,
                id: cht.sender
            },
            id_message: []
        }

        let _key = keys[cht.sender]
        await cht.edit("Starting game tebak lirik...", _key)

        let formatDur = func.formatDuration(maxAge)

        let caption = `🎶 *TEBAK LIRIK* 🎶
        
Soal: *${question}*

⏳ Waktu menjawab: \`${formatDur.minutes} menit ${formatDur.seconds} detik\`
⏱️ Berakhir setelah: \`${func.dateFormatter(metadata.game.endTime, "Asia/Jakarta")}\`
🎁 Hadiah: ${cfg.hadiah[cht.cmd]} Energy ⚡

*Reply pesan ini untuk menjawab!*`

        let { key } = await Exp.sendMessage(id, { text: caption }, { quoted: cht })
        metadata.game.id_message.push(key.id)
        metadata.game.key = key

        global.timeouts[id] = setTimeout(async () => {
            delete Data.preferences[id].game
            delete global.timeouts[id]

            await reply(`⌛ *WAKTU HABIS!*\nJawaban yang benar adalah: *${answer}*`)
            Exp.sendMessage(cht.id, { delete: key })
        }, maxAge)

    } catch (error) {
        console.error("Error saat memulai game Tebak Lirik:", error)
        return cht.reply(`❌ Gagal memulai game!\nError: ${error.message}`)
    }
})
    
    ev.on({
    cmd: ["caklontong"],
    listmenu: ["caklontong"],
    tag: "game",
    isGroup: true,
    energy: 20
}, async () => {
    cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 100
    if ("game" in metadata) return cht.reply(hasGame)

    let maxAge = 60000 // 1 menit
    let apiUrl = "https://api.siputzx.my.id/api/games/caklontong"

    try {
        let response = await fetch(apiUrl)
        if (!response.ok) throw new Error(`Gagal mengambil data, status: ${response.status}`)
        
        let { data } = await response.json()
        let { soal: question, jawaban: answer, deskripsi: clue } = data

        if (!question || !answer) throw new Error("Data API tidak lengkap!")

        metadata.game = {
            type: cht.cmd,
            startTime: Date.now(),
            endTime: Date.now() + maxAge,
            question,
            answer,
            clue,
            energy: cfg.hadiah[cht.cmd],
            creator: {
                name: cht.pushName,
                id: cht.sender
            },
            id_message: []
        }

        let _key = keys[cht.sender]
        await cht.edit("Starting game...", _key)
        let formatDur = func.formatDuration(maxAge)

        let caption = `*CAK LONTONG*\n\n`
            + `❓ *${question}*\n\n`
            + `Waktu menjawab: ${formatDur.minutes} menit ${formatDur.seconds} detik\n`
            + `End Time: ${func.dateFormatter(metadata.game.endTime, "Asia/Jakarta")}\n\n`
            + `Hadiah: ${cfg.hadiah[cht.cmd]} Energy⚡\n\n`
            + `*Reply pesan ini untuk menjawab!*`

        let { key } = await Exp.sendMessage(id, { text: caption }, { quoted: cht })
        metadata.game.id_message.push(key.id)
        metadata.game.key = key

        global.timeouts[id] = setTimeout(async () => {
            delete Data.preferences[id].game
            delete global.timeouts[id]

            await cht.reply(`*WAKTU HABIS*\n\nJawaban: ${answer}\n\n💡 *Penjelasan:* ${clue}`)
            Exp.sendMessage(cht.id, { delete: key })
        }, maxAge)
    } catch (error) {
        console.error("Error saat memulai game caklontong:", error)
        return cht.reply(`❌ Gagal memulai game!\nError: ${error.message}`)
    }
}) // caklontong
    
    ev.on({
        cmd: ["tebakgambar"],
        listmenu: ["tebakgambar"],
        tag: "game",
        isGroup: true,
        energy: 20
    }, async () => {
      cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 35
      if("game" in metadata) return cht.reply(hasGame)
      let maxAge = 60000
      Data[cht.cmd] = Data[cht.cmd] || await fetch(raw[cht.cmd]).then(a => a.json())
      let { img:url, answer, desc } = Data[cht.cmd].getRandom()
      metadata.game = {
        type: cht.cmd,
        startTime: Date.now(),
        endTime: Date.now() + maxAge,
        answer,
        energy: cfg.hadiah[cht.cmd],
        creator: {
          name: cht.pushName,
          id: cht.sender
        },
        id_message: []
      }
      let _key = keys[cht.sender]
      await cht.edit("Starting game...", _key)
      let formatDur = func.formatDuration(maxAge)
      let caption = `🖼️ *TEBAK GAMBAR* 🖼️

Apa jawaban dari soal ini

Petunjuk: ${desc}

⏳ Waktu menjawab: ${formatDur.minutes}menit ${formatDur.seconds}detik
⏱️ Berakhir setelah: ${func.dateFormatter(metadata.game.endTime, "Asia/Jakarta")}
🎁 Hadiah: ${cfg.hadiah[cht.cmd]} Energy⚡

*Reply pesan game untuk menjawab*
`
      let { key } = await Exp.sendMessage(id, { image: { url }, caption }, { quoted: cht })
      metadata.game.id_message.push(key.id)
      metadata.game.key = key
      global.timeouts[id] = setTimeout(async()=> {
        delete Data.preferences[id].game
        delete global.timeouts[id]

        await reply(`⌛ *WAKTU HABIS!*\nJawaban yang benar adalah: *${answer}*`)
      Exp.sendMessage(cht.id, { delete: key })
      }, maxAge)
    }); // tebakgambar
    
    ev.on({
        cmd: ["susunkata"],
        listmenu: ["susunkata"],
        tag: "game",
        isGroup: true,
        energy: 20
    }, async () => {
      cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 35
      if("game" in metadata) return cht.reply(hasGame)
      let maxAge = 60000
      Data[cht.cmd] = Data[cht.cmd] || await fetch(raw[cht.cmd]).then(a => a.json())
      let { type, question, answer } = Data[cht.cmd].getRandom()
      metadata.game = {
        type: cht.cmd,
        startTime: Date.now(),
        endTime: Date.now() + maxAge,
        answer,
        energy: cfg.hadiah[cht.cmd],
        creator: {
          name: cht.pushName,
          id: cht.sender
        },
        id_message: []
      }

      let _key = keys[cht.sender]
      await cht.edit("Starting game susun kata...", _key)
      let formatDur = func.formatDuration(maxAge)
      let text = `🧩 *SUSUN KATA* 🧩

Susun ini menjadi kata yang benar

Tipe: ${type}
Kata: ${question}

⏳ Waktu menjawab: ${formatDur.minutes}menit ${formatDur.seconds}detik
⏱️ Berakhir setelah: ${func.dateFormatter(metadata.game.endTime, "Asia/Jakarta")}
🎁 Hadiah: ${cfg.hadiah[cht.cmd]} Energy⚡

*Reply pesan game untuk menjawab*
`
      let { key } = await Exp.sendMessage(id, { text }, { quoted: cht })
      metadata.game.id_message.push(key.id)
      metadata.game.key = key
      global.timeouts[id] = setTimeout(async()=> {
        delete Data.preferences[id].game
        delete global.timeouts[id]

        await reply(`⌛ *WAKTU HABIS!*\nJawaban yang benar adalah: *${answer}*`)
      Exp.sendMessage(cht.id, { delete: key })
      }, maxAge)
    }); // susunkata
    
    ev.on({
        cmd: ["family100"],
        listmenu: ["family100"],
        tag: "game",
        isGroup: true,
        energy: 20
    }, async () => {
      cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 100
      if("game" in metadata) return cht.reply(hasGame)
      let maxAge = 60000 * 5
      Data[cht.cmd] = Data[cht.cmd] || await fetch(raw[cht.cmd]).then(a => a.json())
      let { question, answer } = Data[cht.cmd].getRandom()
      metadata.game = {
        type: cht.cmd,
        startTime: Date.now(),
        endTime: Date.now() + maxAge,
        question,
        answer,
        answered: {},
        energy: cfg.hadiah[cht.cmd],
        creator: {
          name: cht.pushName,
          id: cht.sender
        },
        id_message: []
      }

      let _key = keys[cht.sender]
      await cht.edit("Starting game...", _key)
      let formatDur = func.formatDuration(maxAge)
      let text = `*FAMILY 100*

Pertanyaan: *${question}*

Jawaban:
${answer.map((item, index) => `${index + 1}. ?? ${index == 0 ? "\`TOP SURVEY\`" : ''}`).join("\n")}

Waktu menjawab: ${formatDur.minutes}menit ${formatDur.seconds}detik
End Time: ${func.dateFormatter(metadata.game.endTime, "Asia/Jakarta")}

Hadiah:
${answer.map((item, index) => `${index + 1}. ${index == 0 ? "\`TOP SURVEY\`" : ''} ?? Energy⚡`).join("\n")}

*Reply pesan game untuk menjawab*
> (Dimulai dari pesan ini)

`
      let { key } = await Exp.sendMessage(id, { text }, { quoted: cht })
      metadata.game.id_message.push(key.id)
      metadata.game.key = key
      global.timeouts[id] = setTimeout(async()=> {
        delete Data.preferences[id].game
        delete global.timeouts[id]

        await cht.reply(`*WAKTU HABIS*

Jawaban: 
${answer.map((item, index) => `${index + 1}. ${item} ${index == 0 ? "\`TOP SURVEY\`" : ''} (${((cfg.hadiah[cht.cmd] * (index == 0 ? 1 : 1.5)) / (index + 1)).toFixed()} Energy⚡)`).join("\n")}
`)
        let { answered } = Data.preferences[id].game
        let answeredKey = Object.keys(answered)
        await sleep(1000)
        await Exp.sendMessage(cht.id, { delete: key })
        await sleep(1000)
        if(answeredKey.length > 0){
          await cht.reply("Membagiakan semua hadiah yang didapat....🎁")
          Object.entries(answered).forEach(async([_,___]) => {
            let idx = answer.findIndex(item => item == _)
            let gift = ((cfg.hadiah[type] * (idx === 0 ? 1 : 1.5)) / (idx + 1)).toFixed()
            await func.archiveMemories["addEnergy"](__, gift)
          })
        }
      }, maxAge)
    }); // family100
    
    ev.on({
        cmd: ["cleargame"],
        listmenu: ["cleargame"],
        isAdmin: true,
        tag: "game",
        isGroup: true
    }, async () => {
      if((!"game" in metadata)) return cht.reply("Tidak ada game yang aktif disini!")
      await Exp.sendMessage(cht.id, { delete: metadata.game.key })
      clearTimeout(global.timeouts[id])
      delete metadata.game
      delete global.timeouts[id]
      cht.reply("Success✅")
    }) // cleargame
    
    ev.on({
    cmd: ["nyerah"],
    listmenu: ["nyerah"],
    tag: "game",
    isGroup: true
}, async () => {
    if((!"game" in metadata)) return cht.reply("Tidak ada game yang aktif disini!")
    if(cht.sender !== game.creator.id) return cht.reply("Hanya creator game yang dapat melaksanakan tindakan ini!")
    if (game.type === "tebakbom") {
        const row = Math.floor((game.bombPosition - 1) / 3)
        const col = (game.bombPosition - 1) % 3
        let finalGrid = [...game.grid]
        finalGrid[row][col] = '💣' // Bom langsung terlihat di grid

        let finalGridDisplay = finalGrid.map(row => row.join('')).join('\n')

        // Buat history
        let historyText = game.history.length > 0 
            ? game.history.map(h => `\n- ${h.position} oleh @${h.player.split('@')[0]} (${h.energy} Energy⚡)`).join("")
            : "Tidak ada history"

        await cht.reply(`*ANDA MENYERAH!*\n\nBom berada di petak ${game.bombPosition}\n\n${finalGridDisplay}\n\n*History* ${historyText}`)
    } else {
        await cht.reply(`*Anda menyerah!*
Jawaban: 
${Array.isArray(game.answer) ? game.answer.map((item, index) => `${index + 1}. ${item} ${index == 0 ? "\`TOP SURVEY\`" : ''} (${((cfg.hadiah[game.type] * (index == 0 ? 1 : 1.5)) / (index + 1)).toFixed()} Energy⚡)`).join("\n") : game.answer}`)
    }
    
    await Exp.sendMessage(cht.id, { delete: metadata.game.key })
    clearTimeout(global.timeouts[id])
    delete metadata.game
    delete global.timeouts[id]
}) // nyerah
    
    ev.on({
      cmd: ['chess'],
      listmenu: ['chess'],
      tag: 'game',
      isGroup: true,
      //  energy: 35, opsional
    }, async ({ args }) => {
      let _id1;
      const senderNumber = cht.sender.split('@')[0];
      const [action, param1] = (args || '').split(' ', 2);
      const chatId = cht.id;
      
      let games = Data.preferences[cht.id]?.chess || {}
      /*
          [ '––『CREDIT THANKS TO』––' ]
          ┊ALLAH S.W.T.
          ┊RIFZA
          ┊Penyedia Modul
          ❏═•═━〈 SORRY WATERMARK
          ┊sorry ada watermark
          ┊donasi ovo/dana: ┊083147309847 (Hanif)
          ┊wa: 083147309847 (Hanif)
          ┊request fitur juga boleh
          ┊buat beli lauk dan nasi hehe
          ┊
          ┊Numpang ya bang, hehe.
          ┊  ###By: Hanif Skizo
          ┗–––––––––––––––––––––––––✦
        */
      if (!action) {
        return cht.reply(
          '❌ Gunakan perintah berikut:\n' +
          '• `.chess create <room>` - Buat game baru\n' +
          '• `.chess join <room>` - Gabung game\n' +
          '• `.chess start <room>` - Mulai game\n' +
          '• `.chess move <from>to<to>` - Lakukan langkah (contoh: e2>e4)\n' +
          '• `.chess delete <room>` - Hapus game\n' +
          '• `.chess help` - Bantuan perintah'
        );
      }
  
      if (action === 'help') {
        return cht.reply(
          '🌟 *Chess Game Commands:*\n\n' +
          '*chess create <room>* - Mulai permainan catur\n' +
          '*chess join <room>* - Bergabung dengan permainan\n' +
          '*chess start <room>* - Memulai permainan setelah 2 pemain bergabung\n' +
          '*chess move <from>to<to>* - Melakukan langkah (contoh: e2>e4)\n' +
          '*chess delete <room>* - Menghapus permainan\n\n' +
          '*Contoh:* \n' +
          '`chess create HanifRoom` - Membuat room bernama HanifRoom\n' +
          '`chess move e2 e4` - Melakukan langkah e2 ke e4'
        );
      }
  
      if (action === 'create') {
        if (!param1) return cht.reply('❌ Harap masukkan nama room. Contoh: `.chess create HanifRoom`.');
        if (param1 in games) return cht.reply('❌ Room sudah ada. Pilih nama lain.');
  
        games[param1] = {
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          players: [{ id: senderNumber, color: 'white' }],
          turn: 'white',
        };
      
        Data.preferences[cht.id].chess = games;
        return cht.reply(`✅ Room "${param1}" berhasil dibuat!\nAnda berada di room ini sebagai Putih`);
      }

      if (action === 'join') {
        if (!param1) return cht.reply('❌ Masukkan nama room. Contoh: `.chess join HanifRoom`.');
        if (!games[param1]) return cht.reply('❌ Room tidak ditemukan.');
        if (games[param1].players.length >= 2) return cht.reply('⚠️ Room sudah penuh.');
        if (games[param1].players.some(a => a.id.includes(senderNumber))) return cht.reply("Anda sudah join room ini!")
        games[param1].players.push({ id: senderNumber, color: 'black' });
        games[param1].players = [...new Map(games[param1].players.map(item => [item.id, item])).values()]
        Data.preferences[cht.id].chess = games;
        return cht.reply(`✅ Anda bergabung di room "${param1}" sebagai Hitam.`);
      }

      if (action === 'start') {
        if (!param1) return cht.reply('❌ Masukkan nama room. Contoh: `.chess start HanifRoom`.');
        const room = games[param1];
        if (!room) return cht.reply('❌ Room tidak ditemukan.');
        if (room.players.length < 2) return cht.reply('⚠️ Butuh dua pemain untuk memulai game.');

        const boardUrl = `https://chessboardimage.com/${room.fen}.png`;
        let { key: key1 } = await Exp.sendMessage(cht.id, {
          image: { url: boardUrl },
          caption: `🎲 Permainan dimulai! Giliran: ${room.turn.toUpperCase()}`
        });
        setQCmd(key1.id, room.players, `${cht.cmd} move`)
        return;
      }
      

      if (action === 'move') {
        const [_, from, to, promotion] = args.toLowerCase().split(/\s+/); // buat promosi 🗿(e.g. e7 e8 q)
    
   
        if (!from || !to) {
          let { key: key1 } = await cht.reply(
              '❌ Format salah. Contoh penggunaan:\n' +
              '• `.chess move e2 e4` - Langkah biasa\n' +
              '• `.chess move e7 e8 q` - Promosi pion ke ratu'
          )
          return setQCmd(key1.id, [{ id: cht.sender.split("@")[0] }], `${cht.cmd} move`)
          
        }

        const senderNumber = cht.sender.split('@')[0];

        const roomName = Object.keys(games).find(r => 
          games[r].players.some(p => p.id === senderNumber)
        );
    
        if (!roomName) {
          let { key:key1 } = await cht.reply('❌ Anda belum bergabung dalam permainan!');
          return setQCmd(key1.id, [{ id: cht.sender.split("@")[0] }], `${cht.cmd} move`)
        }

        const room = games[roomName];

        try {
        
          chess.load(room.fen);
        } catch (error) {
       
          room.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
          Data.preferences[cht.id].chess = games;
          return cht.reply('⚠️ Permainan direset ke posisi awal karena error!');
        }

  
        const player = room.players.find(p => p.id === senderNumber);
        if (!player) {
          return cht.reply('❌ Anda bukan peserta dalam game ini!');
        }
    
        if (player.color !== room.turn) {
          let { key:key1 } = await cht.reply(`⏳ Bukan giliran Anda! Giliran ${room.turn.toUpperCase()}`);
          return setQCmd(key1.id, [{ id: cht.sender.split("@")[0] }], `${cht.cmd} move`)
        }

  
        try {
          const moveOptions = { from, to };
          if (promotion) moveOptions.promotion = promotion[0].toLowerCase();
        
          const move = chess.move(moveOptions);
          if (!move) throw new Error('Langkah tidak valid!');
   
          room.fen = chess.fen();
          room.turn = chess.turn() === 'w' ? 'white' : 'black';
          Data.preferences[cht.id].chess = games;
          // const encodedFEN = room.fen.replace(/ /g, '_');
          const boardUrl = `https://chessboardimage.com/${room.fen}` + (room.turn === 'black' ? '-flip.png' : '.png');
         
          let buff = await func.getBuffer(boardUrl)
  		  let res = await exif["writeExifImg"](buff, {
			packname: 'Chess',
			author: 'Ⓒ' + cht.pushName
		  })
		  let { key:key } = await Exp.sendMessage(id, {
			sticker: {
				url: res
			}
		  }, {
			quoted: cht
		  })
		  setQCmd(key.id, [{ id: cht.sender.split("@")[0] }], `${cht.cmd} move`)
          let { key: key1 } = await cht.reply(`✅ Berhasil pindah ${from}➡️${to}\nGiliran ${room.turn.toUpperCase()}`)
          return setQCmd(key1.id, [{ id: cht.sender.split("@")[0] }], `${cht.cmd} move`)
          /* 
           ### KALO MAU DIUBAH KE IMAGE ###
           await Exp.sendMessage(chatId, {
             image: { url: boardUrl},
             caption: `✅ Berhasil pindah ${from}→${to}\nGiliran ${room.turn.toUpperCase()}`
           });
          */
          if (chess.isCheckmate()) {
            delete games[roomName];
            Data.preferences[cht.id].chess = games;
            return cht.reply(`🏆 SKAKMAT! Pemenang: ${player.color.toUpperCase()}`);
          }
        
          if (chess.isDraw()) {
           delete games[roomName];
           Data.preferences[cht.id].chess = games;
           return cht.reply('🤝 PERMAINAN BERAKHIR REMIS!');
          }

        } catch (error) {
          // Detailed error messages
          let errorMessage = `❌ Gagal: ${error.message}\n`;
        
          if (error.message.includes('invalid square')) {
            errorMessage += 'Format posisi salah (contoh: e2)';
          } else if (error.message.includes('invalid move')) {
            errorMessage += 'Langkah tidak sesuai aturan catur';
          } else {
            errorMessage += 'Contoh: `.chess move e2 e4` atau `.chess move e7 e8 q`';
          }
          let { key:key1 } = await cht.reply(errorMessage);
          return setQCmd(key1.id, [{ id: cht.sender.split("@")[0] }], `${cht.cmd} move`)
       }
    }

    if (action === 'delete') {
      if (!param1) return cht.reply('❌ Masukkan nama room. Contoh: `.chess delete HanifRoom`.');
      if (!games[param1]) return cht.reply('❌ Room tidak ditemukan.');
      if(games[param1].players[0].id !== senderNumber) return cht.reply("Hanya pembuat room yang dapat menghapus sesi!")
      delete games[param1];
      Data.preferences[cht.id].chess = games;
      return cht.reply(`✅ Room "${param1}" berhasil dihapus.`);
    }

    return cht.reply('❌ Perintah tidak dikenal. Gunakan `.chess help` untuk melihat daftar perintah.');
  }); // chess
    
  ev.on({
    cmd: ["sos"],
    //listmenu: ["sos"],
    args: `Format: .sos <create/join/leave/theme/move> <room_name>`,
  }, async ({ cht }) => {
    const [action, param1, param2] = (cht.q || "").split(" ");
    const chatId = cht.id;
    const senderNumber = cht.sender.split('@')[0];

    let sessions = Data.preferences[chatId].sos || {}

    function formatBoard(board) {
        return `\n${board[0]} | ${board[1]} | ${board[2]}\n` +
               `---------\n` +
               `${board[3]} | ${board[4]} | ${board[5]}\n` +
               `---------\n` +
               `${board[6]} | ${board[7]} | ${board[8]}\n`;
    }
    
    /* BELUM KELAR!!
          [ '––『CREDIT THANKS TO』––' ]
          ┊ALLAH S.W.T.
          ┊RIFZA
          ┊Penyedia Modul
          ❏═•═━〈 SORRY WATERMARK
          ┊sorry ada watermark
          ┊donasi ovo/dana: ┊083147309847 (Hanif)
          ┊wa: 083147309847 (Hanif)
          ┊request fitur juga boleh
          ┊buat beli lauk dan nasi hehe
          ┊
          ┊Numpang ya bang, hehe.
          ┊  ###By: Hanif Skizo
          ┗–––––––––––––––––––––––––✦
        */

    function checkGameStatus(board) {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Baris
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Kolom
            [0, 4, 8], [2, 4, 6],           // Diagonal
        ];

        for (const condition of winConditions) {
            const [a, b, c] = condition;
            if (board[a] === board[b] && board[b] === board[c]) {
                return "win";
            }
        }
        if (!board.some(cell => typeof cell === "number")) {
            return "draw";
        }
        return "ongoing";
    }

    if (!action) {
        return cht.reply(
            "❌ Gunakan perintah berikut:\n" +
            "• `.sos create <room>` - Buat game baru\n" +
            "• `.sos join <room>` - Gabung game\n" +
            "• `.sos leave` - Keluar dari game\n" +
            "• `.sos theme <1/2/3>` - Pilih tema simbol\n" +
            "• `.sos move <posisi>` - Letakkan simbol"
        );
    }

    if (action === "theme") {
        if (!param1 || !["1", "2", "3"].includes(param1)) {
            return cht.reply(
                "❌ Harap pilih tema dengan angka 1, 2, atau 3. Contoh: `.sos theme 1`.\n" +
                "Tema yang tersedia:\n" +
                "1. 🧿(1) 👾(2)\n2. 🐱(1) 🐶(2)\n3. 🌋(1) 🏔️(2)"
            );
        }

        const themes = {
            1: ["🧿", "👾"],
            2: ["🐱", "🐶"],
            3: ["🌋", "🏔️"],
        };
        
        sessions.theme = themes[param1];
        Data.preferences[chatId].sos = sessions
        return cht.reply(`✅ Tema "${param1}" berhasil dipilih! Simbol: ${themes[param1][0]} (1) & ${themes[param1][1]} (2).`);
    }

    if (action === "create") {
        if (!param1) return cht.reply("❌ Harap masukkan nama room. Contoh: `.sos create HanifRoom`.");
        if (sessions[param1]) return cht.reply("❌ Room sudah ada. Pilih nama lain.");

        const symbols = sessions.theme || ["⭕", "❌"];
        sessions[param1] = {
            board: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            players: [{ id: senderNumber, symbol: symbols[0] }],
            turn: symbols[0],
        };
        Data.preferences[chatId].sos = sessions
        return cht.reply(`✅ Room "${param1}" berhasil dibuat!`);
    }

    if (action === "join") {
        if (!param1) return cht.reply("❌ Masukkan nama room. Contoh: `.sos join HanifRoom`.");
        if (!sessions[param1]) return cht.reply("❌ Room tidak ditemukan.");
        if (sessions[param1].players.length >= 2) return cht.reply("❌ Room sudah penuh.");

        const symbols = sessions[param1].players[0].symbol === "⭕" ? "❌" : "⭕";
        sessions[param1].players.push({ id: senderNumber, symbol: symbols });
        Data.preferences[chatId].sos = sessions
        let { key: key1 } = await cht.reply(`✅ Anda bergabung dalam room "${param1}"!`);
        return setQCmd(key1.id, [{ id: cht.sender.split("@")[0] }], `${cht.cmd} move`)
    }

    if (action === "leave") {
        const roomName = Object.keys(sessions).find(r => 
            sessions[r].players.some(p => p.id === senderNumber)
        );

        if (!roomName) return cht.reply("❌ Anda tidak berada di game mana pun.");

        delete sessions[roomName];
        Data.preferences[chatId].sos = sessions
        return cht.reply(`✅ Anda keluar dari room "${roomName}".`);
    }

    if (action === "move") {
        if (!param1){
          let { key: key1 } = await cht.reply("❌ Masukkan posisi angka (1-9). Contoh: `.sos move 5`.");
          return setQCmd(key1.id, [{ id: cht.sender.split("@")[0] }], `${cht.cmd} move`)
        }
        
        const roomName = Object.keys(sessions).find(r =>
            sessions[r].players.some(p => p.id === senderNumber)
        );

        if (!roomName){
          let { key: key1 } = await cht.reply("❌ Anda belum bergabung dalam permainan!");
          return setQCmd(key1.id, [{ id: cht.sender.split("@")[0] }], `${cht.cmd} move`)
        }

        const room = sessions[roomName];
        const player = room.players.find(p => p.id === senderNumber);

        if (!player){
          let { key: key1 } = await cht.reply("❌ Anda bukan peserta dalam game ini!");
          return setQCmd(key1.id, [{ id: cht.sender.split("@")[0] }], `${cht.cmd} move`)
        }
        if (room.turn !== player.symbol){
          let { key: key1 } = await cht.reply(`⏳ Bukan giliran Anda! Giliran: ${room.turn}`);
          return setQCmd(key1.id, [{ id: cht.sender.split("@")[0] }], `${cht.cmd} move`)
        }

        const position = parseInt(param1) - 1;
        if (isNaN(position) || position < 0 || position > 8) {
            let { key: key1 } = await cht.reply("❌ Posisi tidak valid. Gunakan angka 1-9.");
            return setQCmd(key1.id, [{ id: cht.sender.split("@")[0] }], `${cht.cmd} move`)
        }

        if (typeof room.board[position] !== "number") {
            let { key: key1 } = await cht.reply("❌ Posisi sudah terisi. Pilih tempat lain.");
            return setQCmd(key1.id, [{ id: cht.sender.split("@")[0] }], `${cht.cmd} move`)
        }

        room.board[position] = player.symbol;
        room.turn = player.symbol === "⭕" ? "❌" : "⭕";
        
        const status = checkGameStatus(room.board);

        let boardText = `🎲 *Papan Permainan:*\n${formatBoard(room.board)}`;
        
        if (status === "win") {
            delete sessions[roomName];
            return cht.reply(`🏆 *${player.symbol} Menang!*\n${boardText}`);
        } else if (status === "draw") {
            delete sessions[roomName];
            return cht.reply(`🤝 Permainan Seri!\n${boardText}`);
        }
        Data.preferences[chatId].sos[roomName] = room
        return cht.reply(`${boardText}\nGiliran: ${room.turn}`);
    }

    return cht.reply("❌ Perintah tidak dikenal. Gunakan `.sos help` untuk melihat  daftar perintah.");
}); // sos

}