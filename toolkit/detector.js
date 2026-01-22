const chokidar = 'chokidar'.import();
const chalk = 'chalk'.import();
const path = 'path'.import();
const fs = 'fs'.import();
let { JadwalSholat } = await (fol[2] + 'jadwalsholat.js').r();
global.keys['livechart'] ??= await (fol[2] + 'livechart.js').r();

const cacheSent = new Map();
const { default: moment } = await 'moment'.import();
const {
  getContentType,
  generateWAMessage,
  STORIES_JID,
  generateWAMessageFromContent,
} = 'baileys'.import();

const conf = fol[3] + 'config.json';
const db = fol[5];
let config = JSON.parse(fs.readFileSync(conf));
let keys = Object.keys(config);

let onreload = false;
Data.notify = Data.notify || {
  every: 60,
  h: 0,
  first: !1,
};

export default async function detector({ Exp, store }) {
  const { func } = Exp;

  function getTime() {
    return new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
  }
  
  const contextInfo = {
     externalAdReply: {
       title: `❏ Elaina [ イレイナ ]`,
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
    
  const reloadData = async (files) => {
    try {
      for (const [key, filePath] of Object.entries(files)) {
        Data[key] = (await filePath.r()).default;
      }
      Data.initialize({
        Exp,
        store,
      });
      console.log(chalk.green(`Helpers reloaded successfully!`));
    } catch (error) {
      console.error(chalk.red('Error reloading helpers:', error));
    }
  };

  const setupWatcher = (path, delay, onChangeCallback, onUnlinkCallback) => {
    const watcher = chokidar.watch(path, {
      ignored: /(^|[\/\\])\../,
      persistent: true,
      usePolling: true,
      interval: 1000,
    });

    watcher.on('change', async (filePath) => {
      if (onreload) return;
      onreload = true;

      console.log(chalk.yellow(`File changed: ${filePath}`));
      setTimeout(async () => {
        await onChangeCallback(filePath);
        onreload = false;
      }, delay);
    });

    if (onUnlinkCallback) {
      watcher.on('unlink', async (filePath) => {
        console.log(chalk.yellow(`File deleted: ${filePath}`));
        await onUnlinkCallback(filePath);
      });
    }
  };

  /*!-======[ Helpers Update detector ]======-!*/
  setupWatcher(path.resolve(fol[1], '**/*.js'), 1000, async (filePath) => {
    const files = {
      helper: `${fol[1]}client.js`,
      In: `${fol[1]}interactive.js`,
      utils: `${fol[1]}utils.js`,
      reaction: `${fol[1]}reaction.js`,
      EventEmitter: `${fol[1]}events.js`,
      stubTypeMsg: `${fol[1]}stubTypeMsg.js`,
      eventGame: `${fol[1]}eventGame.js`,
      initialize: `${fol[1]}initialize.js`,
    };
    await reloadData(files);
  });

  /*!-======[ Events Update Detector ]======-!*/
  setupWatcher(
    path.resolve(fol[7], '**/*.js'),
    2000,
    async () => {
      try {
        await Data?.ev?.reloadEventHandlers();
        console.log(chalk.green('Event handlers reloaded successfully!'));
      } catch (error) {
        console.error(chalk.red('Error reloading event handlers:', error));
      }
    },
    async (filePath) => {
      const fileName = path.basename(filePath);
      const eventKeys = Object.keys(Data.events);

      for (const key of eventKeys) {
        const { eventFile } = Data.events[key];
        if (eventFile.includes(fileName)) {
          delete Data.events[key];
          console.log(chalk.red(`[ EVENT DELETED ] => ${key}`));
        }
      }
    }
  );

  /*!-======[ Locale Update detector ]======-!*/
  setupWatcher(path.resolve(fol[9], '**/*.js'), 500, async (filePath) => {
    await filePath.r();
    console.log(chalk.yellow(`Locale file reloaded: ${filePath}`));
  });

  /*!-======[ Toolkit Update detector ]======-!*/
  setupWatcher(path.resolve(fol[0], '**/*.js'), 1000, async (filePath) => {
    try {
      Exp.func = new (await `${fol[0]}func.js`.r()).func({
        Exp,
        store,
      });
      console.log(chalk.green('Toolkit reloaded successfully!'));
    } catch (error) {
      console.error(chalk.red('Error reloading toolkit:', error));
    }
  });

  /*!-======[ Auto Update ]======-!*/
  async function keyChecker(url, key) {
    try {
      Data.notify.h++;
      if (Data.notify.h == 1 && Exp.authState) {
        let own = owner[0].split('@')[0] + from.sender;
        let res = await fetch(
          `${api.xterm.url}/api/tools/key-checker?key=${api.xterm.key}`
        );
        let inf =
          '\n\n> _Jika ini dirasa mengganggu, anda bisa menonaktifkan dengan mengetik *.set keyChecker off*_';
        if (!res.ok)
          return Exp.sendMessage(own, {
            text: `*[❗Notice ]*\n\`SERVER API ERROR\`\n Response status: ${res.status}${inf}`,
          });
        let { status, data, msg } = await res.json();
        if (!status) {
          await Exp.sendMessage(own, {
            text: `*[❗Notice ]*\n\`API KEY STATUS IS FALSE\`\n\n*Key*: ${api.xterm.key}\nMsg: ${msg}${inf}`,
          });
        } else {
          let {
            limit,
            usage,
            totalHit,
            remaining,
            resetEvery,
            reset,
            expired,
            isExpired,
            features,
          } = data;
          let interval =
            resetEvery.hours > 0
              ? String(new Date().getHours()) == String(Data.notify.reset)
              : String(new Date().getDate()) == String(Data.notify.reset);
          if (usage >= limit && (!Data.notify?.reset || interval)) {
            Data.notify.reset =
              resetEvery.hours > 0
                ? reset.split(' ')[1]?.split(':')[0]
                : reset.split('/')[0];
            await Exp.sendMessage(own, {
              text: `*[❗Notice ]*\n\`LIMIT GLOBAL HARIAN API KEY TELAH TERCAPAI\`\n\n*Today:* ${usage}\n*Total Hit*: ${totalHit}\n\n*Reset*: ${reset}${inf}`,
            });
          } else if (isExpired) {
            await Exp.sendMessage(own, {
              text: `*[❗Notice ]*\n\`API KEY EXPIRED\`\n\n*Key*: ${api.xterm.key}\n*Expired on*: ${expired}${inf}`,
            });
          } else {
            let kfeatures = Object.keys(features);
            for (let i of kfeatures) {
              let { ms, max, use, hit, lastReset } = features[i];
              if (
                use >= max &&
                (!Data.notify?.[i] || Date.now() >= Data.notify[i])
              ) {
                Data.notify[i] = lastReset
                  ? parseInt(lastReset) + parseInt(ms)
                  : Date.now() + parseInt(ms);
                let msg = i.includes('elevenlabs')
                  ? '> _Fitur text2speech *.elevenlabs* tidak dapat digunakan sebelum limit di reset!_'
                  : i.includes('filters')
                    ? '> _Fitur *.filters* seperti *.toanime* dan *.toreal* tidak dapat digunakan sebelum limit di reset!_'
                    : i.includes('luma')
                      ? '> _Fitur *.i2v* atau *.img2video* tidak dapat digunakan sebelum limit di reset!_'
                      : i.includes('logic-bell')
                        ? '_Auto ai chat tidak akan merespon/tidak dapat digunakan sebelum limit di reset!_'
                        : i.includes('enlarger')
                          ? '_Fitur *.enlarger* tidak dapat digunakan sebelum limit di reset!_'
                          : '';
                await Exp.sendMessage(own, {
                  text: `*[❗Notice ]*\n\`LIMIT FEATURE API KEY TELAH TERCAPAI\`\n\n*Feature*: \`${i.slice(1)}\`\n*Now*: ${use}\n*Max*: ${max}\n*Reset*: ${func.dateFormatter(Data.notify[i], 'Asia/Jakarta')}\n\n${msg}${inf}`,
                });
                await sleep(3000 + Math.floor(Math.random() * 2000));
              }
            }
          }
        }
      } else if (Data.notify.h >= Data.notify.every) {
        Data.notify.h = 0;
      }
    } catch (e) {
      console.error('Error in key checker', e);
    }
  }

  async function schedule() {
    try {
      let chatDb = Object.entries(Data.preferences).filter(
        ([a, b]) => a.endsWith(from.group) && b.schedules?.length > 0
      );
      for (let [id, b] of chatDb) {
        let d;
        let n = b.schedules.findIndex((a) => {
          let {
            h,
            min,
            d: D,
          } = func.formatDateTimeParts(new Date(), a.timeZone);
          d = D;
          let [sh, sm] = a.time.split(':').map(Number);
          return (
            sh == h &&
            parseInt(min) - sm <= 10 &&
            parseInt(min) >= sm &&
            (!a.now || a.now !== d)
          );
        });
        if (n >= 0) {
          let s = b.schedules[n];
          if (!s.now || s.now !== d) {
            b.schedules[n].now = d;
            await Exp.relayMessage(
              id,
              {
                viewOnceMessage: {
                  message: {
                    interactiveMessage: {
                      footer: {
                        text: s.msg,
                      },
                      carouselMessage: {},
                    },
                  },
                },
              },
              {}
            );
            await sleep(2000 + Math.floor(Math.random() * 1000));
            s.action !== '-' && (await Exp.groupSettingUpdate(id, s.action));
          }
        }
      }
    } catch (e) {
      console.error('Error in schedule', e);
    }
  }

  async function cekSewa() {
    try {
      const now = Date.now();
      const prefs = Data.preferences || {};

      for (const [gid, pref] of Object.entries(prefs)) {
        const sewa = pref?.sewa;
        if (!sewa || !sewa.expired) continue;
        
        const own = owner[0] + from.sender
            
        if (now >= sewa.expired) {
          try {
            const data = await Exp.groupMetadata(gid)
            const allMem = data.participants.map(p => p.id)
            
            const expiredAt = func.dateFormatter(sewa.expired, 'Asia/Jakarta') || new Date(sewa.expired).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
            const teksGc = "乂  *G O O D B Y E  A L L*\n\n" +
            "Masa sewa grup ini telah habis heheh (⁠◠⁠‿⁠◕⁠), aku out dulu yah bye bye...\n" +
            "```\n" +
            `• ID Grup : ${sewa.id}\n` +
            `• Expired : ${expiredAt}\n` +
            "```\n" +
            "_ℹ️ Jika ingin melakukan sewa lagi silahkan hubungi nomor owner yang di bawah ini yah, jika ragu ga usah..._\n" +
            `\`👤 wa.me/${owner[0]}\``

            await Exp.sendMessage(
              gid, {
                text: teksGc, 
                contextInfo 
              }
            )
            
            await sleep(2500)
            await Exp.groupLeave(gid)
            
            const teks = "*[ Success ]*\n\n" +
            `✅ Sewa grup ${gid} telah berakhir\n` +
            "```\n" +
            `• ID group : ${sewa.id}\n` +
            `• Expired  : ${expiredAt}\n` +
            "```\n" +
            "_Berhasil out dari grup tersebut_"

            await Exp.sendMessage(
              own,
              {
                text: teks
              }
            )
            
            delete Data.preferences[gid];

            console.log(`cek sewa: sewa expired -> cleared for ${gid}`);
            
          } catch (e) {
            const tek = "*[ Failed ]*\n\n" +
            `❗ Sewa grup ${gid} telah berakhir\n` +
            "```\n" +
            `• ID group : ${sewa.id}\n` +
            "```\n" +
            "_Gagal out dari grup tersebut, kepada owner yang ganteng silahkan lakukan tindakan lanjut_"
            
            await Exp.sendMessage(
              own,
              {
                text: tek
              }
            )
            
            console.error('cek sewa: error handling expired sewa for', gid, e);
          }
          
        } else {
          const oneDay = 24 * 60 * 60 * 1000;
          const timeLeft = sewa.expired - now;

          if (timeLeft <= oneDay && !sewa.warned) {
            try {
              const due = func.dateFormatter(sewa.expired, 'Asia/Jakarta') || new Date(sewa.expired).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
              const warnMsg = "乂  *I N F O R M A S I*\n\n" +
              "Masa sewa grup ini akan berakhir dalam kurang dari 24 jam lagi (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠✧⁠*⁠。\n" +
              "```\n" +
              `• ID group  : ${sewa.id}\n` +
              `• Berakhir  : ${due}\n` +
              "```\n" +
              "_ℹ️ jika ingin memperpanjang masa sewa silahkan hubungi nomor owner yang di bawah ini yahh..._\n" +
              `\`👤 wa.me/${owner[0]}\``

              await Exp.sendMessage(
                gid, 
                {
                  text: warnMsg, 
                  contextInfo 
                }
              ).catch(() => {});
              
              Data.preferences[gid].sewa.warned = true;

              console.log(`cek sewa: warning sent for ${gid}`);
            } catch (e) {
              console.error('cekSewa: error sending warning for', gid, e);
            }
          }
        }
      }
    } catch (e) {
      console.error('Error in cek sewa', e);
    }
  }
  
  async function autoBackup() {
    try {
      if (!cfg?.autobackup.status) return;

      const now = new Date(
         new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
      );
      
      const jam = now.getHours();
      const menit = now.getMinutes();
      const hari = now.getDate();
      const own = owner[0] + from.sender

      if (jam === 21 && menit === 0) {
        if (cfg?.autobackup.lastDay === hari) return;
        cfg.autobackup.lastDay = hari;
        
        let b = './backup.tar.gz';
        let s = await Exp.func.createTarGz('./', b);
        if (!s.status) return console.log('[ AUTO BACKUP ] gagal:', s.msg);
        
        const formatSize = (bytes) => {
          const units = ['B', 'KB', 'MB', 'GB', 'TB'];
          let i = 0;
          while (bytes >= 1024 && i < units.length - 1) {
            bytes /= 1024;
             i++;
          }
          return `${bytes.toFixed(2)} ${units[i]}`;
        };
        
        const projectName = botnickname;
        const dateStr = Exp.func.dateFormatter(Date.now(), 'Asia/Jakarta');
        const fileName = `${projectName} || ${dateStr}.tar.gz`;

        const stats = fs.statSync(b);
        const fileSize = formatSize(stats.size);
        const caption = "乂  *A U T O  B A C K U P*\n\n" +
        `• *File name* : ${fileName}\n` +
        `• *File size* : ${fileSize}\n` +
        `• *Status* : ✅Suksess`

        await Exp.sendMessage(
          own,
          {
            document: { url: b },
            mimetype: 'application/zip',
            fileName,
            caption
          }
        );

        fs.unlinkSync(b);
        console.log(
          chalk.cyan(
            `[ AUTO BACKUP ] sukses mengirim backup (${fileName}, ${fileSize})`
          )
        );
      }
    } catch (e) {
      console.error('Error auto backup:', e);
      const text = "乂  *A U T O  B A C K U P*\n\n" + 
      `*Error*:\n` +
      `- ${e.message}`
      
      await Exp.sendMessage(
        own,
        {
          text
        }
      )
    }
  }
     
  async function resetAbsen() {
    try {
      const waktu = new Date(
         new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
      );
      
      const jam = waktu.getHours();
      const menit = waktu.getMinutes();
      
      for (let [id, pref] of Object.entries(Data.preferences)) {
        if (!pref.absen) continue;
        
        if (jam === 0 && menit === 0) {
          let hadir = pref.absen.present || [];
          let total = hadir.length;

          let teks = `📋 *H A S I L  A B S E N*\n\n`;
          teks += "Berikut hasil untuk hari ini:\n\n"
          if (total === 0) {
            teks += "- 🍃\n";
            teks += "Tidak ada anggota yang mengisi absen hari ini ini\n";
          } else {
            teks += hadir.map((uid, i) => `${i + 1}. @${uid.split('@')[0]} ➟ Hadir`).join("\n");
            teks += `\n\nTerdapat ${total} anggota grup yang hadir...`;
          }
          
          await Exp.sendMessage(
            id,
            {
              text: teks,
              contextInfo: {
                ...contextInfo,
                mentionedJid: hadir
              }
           }
          );
          
          delete Data.preferences[id].absen;
        
        }
      }
    
    } catch (e) { 
      console.error("Error in reset absen", e);
    }
  }
  
  async function ulangTahun() {
    try {
      const today = new Date();
      const d = today.getDate().toString().padStart(2, '0');
      const m = (today.getMonth() + 1).toString().padStart(2, '0');
      const todayStr = `${d}-${m}`;
      const chBot = cfg.chId.newsletterJid;

      const hariList = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu"
      ];
      
      const bulanList = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"
      ];

      const hari = hariList[today.getDay()];
      const tanggal = today.getDate();
      const bulan = bulanList[today.getMonth()];
      const tahun = today.getFullYear();

      let users = Data.users || {};

      for (let [id, user] of Object.entries(users)) {
        if (!user.ultah?.tanggal) continue;

        if (user.ultah.tanggal === todayStr) {

          if (user.ultah.lastNotifDate === todayStr) continue;

          let teksCH = `乂  *H A P P Y  B I R T H D A Y*\n\n`;
          teksCH += `🤭 Cieee, ada yang ulang tahun nih...\n`;
          teksCH += `Mari kita ucapkan selamat ulang tahun kepada ${func.getName(id)}🎉\n\n`;
          teksCH += `Semoga panjang umur, sehat selalu, dan sukses selalu...`;

          let teksPm = `🎊 \`HAPPY BIRTHDAY\` 🎊\n\n`;
          teksPm += `👋 Haii kak *${func.getName(id)}, aku ${botnickname}* ingin mengucapkan...\n\n`;
          teksPm += `Selamat ulang tahun kak *${func.getName(id)}🥳*, semoga panjang umur, sehat selalu dan rezekinya lancar selalu 🤗 aku *${botnickname}* akan selalu ada untukmu...\n\n`;
          teksPm += `📅Hari ini \`${hari}\` tanggal  \`${tanggal} ${bulan} ${tahun}\``;

          await Exp.sendMessage(
            id + from.sender, 
            {
              text: teksPm,
              contextInfo 
            }
          );

          await Exp.sendMessage(
            chBot, 
            { 
              text: teksCH,
              contextInfo 
            }
          );

          await Exp.sendMessage(
            chBot,
            {
              audio: {
                url: "https://files.catbox.moe/zg29zd.mp4",
                mimetype: "audio/mpeg",
                ptt: true
              }
            }
          );

          user.ultah.lastNotifDate = todayStr;
        }
      }

    } catch (e) {
      console.error("Error saat mengecek ulang tahun user", e);
    }
  }
  
  async function cekJadibot() {
    try {
      const now = Date.now()
      const bots = Data.jadiBot || {}

      for (const [botNumber, botData] of Object.entries(bots)) {
        if (!botData || !botData.expired) continue

        const botOwner = botData.own + from.sender
        const mainOwner = owner[0] + from.sender

        if (now >= botData.expired) {
          try {
            const sessionPath = path.resolve(fol[8], `jadibot-${botNumber}`)

            if (fs.existsSync(sessionPath)) {
              fs.rmSync(sessionPath, { recursive: true, force: true })
              console.log(`[JADIBOT] Session deleted for ${botNumber}`)
            }

            const expiredAt =
              func.dateFormatter(botData.expired, 'Asia/Jakarta') ||
              new Date(botData.expired).toLocaleString('id-ID', {
                timeZone: 'Asia/Jakarta'
              })

            const notifOwner =
              "乂  *B O T  E X P I R E D*\n\n" +
              `Masa aktif jadibot nomor *${botNumber}* telah habis.\n\n` +
              "```\n" +
              `• Bot     : ${botNumber}\n` +
              `• Expired : ${expiredAt}\n` +
              "```\n" +
              "_Session telah dihapus dan bot otomatis disconnect._"

            await Exp.sendMessage(botOwner, { text: notifOwner })

            const notifMain =
              "乂  *B O T  E X P I R E D*\n\n" +
              `Bot *${botNumber}* telah expired dan session dibersihkan.\n\n` +
              "```\n" +
              `• Bot    : ${botNumber}\n` +
              `• Owner  : ${botData.own}\n` +
              `• Exp    : ${expiredAt}\n` +
              "```"

            await Exp.sendMessage(mainOwner, { text: notifMain })

            delete Data.jadiBot[botNumber]
            console.log(`[JADIBOT] Removed expired bot: ${botNumber}`)

          } catch (err) {
            console.error(`[JADIBOT] Error expired cleanup for ${botNumber}:`, err)

            delete Data.jadiBot[botNumber]

            await Exp.sendMessage(mainOwner, {
              text: `*[JADIBOT ERROR]*\nGagal membersihkan session ${botNumber}\nError: ${err.message}`
            })
          }

        } else {

          const oneDay = 24 * 60 * 60 * 1000
          const timeLeft = botData.expired - now

          if (timeLeft <= oneDay && !botData.warned) {
            try {
              const expiredAt =
                func.dateFormatter(botData.expired, 'Asia/Jakarta') ||
                new Date(botData.expired).toLocaleString('id-ID', {
                  timeZone: 'Asia/Jakarta'
                })

              const warnMsg =
                "乂  *B O T  W A R N I N G*\n\n" +
                `Masa aktif jadibot nomor *${botNumber}* akan habis < 24 Jam!\n\n` +
                "```\n" +
                `• Bot     : ${botNumber}\n` +
                `• Expired : ${expiredAt}\n` +
                "```\n" +
                "_silahkan hubungi owner Jika ingin menambah durasi jadi bot_"

              await Exp.sendMessage(botOwner, { text: warnMsg })

              Data.jadiBot[botNumber].warned = true

              console.log(`[JADIBOT] Warning sent for ${botNumber}`)
            } catch (err) {
              console.error(`[JADIBOT] Warning error for ${botNumber}:`, err)
            }
          }
        }
      }
    } catch (err) {
      console.error('Error in cekJadibot:', err)
    }
  }

  async function sholat() {
    let chatDb = Object.entries(Data.preferences).filter(
      ([a, b]) => a.endsWith(from.group) && b.jadwalsholat
    );
    for (let [id, b] of chatDb) {
      try {
        if (!(id in jadwal.groups)) await jadwal.init(id, b.jadwalsholat.v);
        let { status, data, db } = await jadwal.now(id);

        let { ramadhan, tutup } = b.jadwalsholat;

        let w = '5 menit';
        //console.log(data)
        if (data.now && !data.hasNotice) {
          let { participants, subject } = await func.getGroupMetadata(id, Exp);
          let groupAdmins = func.getGroupAdmins(participants);
          let isBotAdmin = groupAdmins.includes(Exp.number);

          let emoji =
            {
              imsak: '🌄',
              subuh: '🌅',
              dzuhur: '☀️',
              ashar: '🌇',
              maghrib: '🌆',
              isya: '🌙',
            }[data.now] || '';
          let text =
            data.now == 'magrib' && ramadhan
              ? `*Hai seluruh umat Muslim yang berada di grup \`${subject}\`!*\n\nSelamat berbuka puasa 🍽️! Semoga puasanya diterima oleh Allah SWT.\nWaktu sholat *${data.now}${emoji}* di daerah ${b.jadwalsholat.v} sudah masuk! Jangan lupa menunaikan shalat tepat waktu.\n\n*"Allahumma laka shumtu wa bika aamantu wa ‘ala rizq-ika aftartu, bi rahmatika ya arhamar rahimin."*  \n(Ya Allah, kepada-Mu aku berpuasa, kepada-Mu aku beriman, dan dengan rezeki-Mu aku berbuka. Dengan rahmat-Mu, wahai Tuhan yang Maha Pengasih).  \n\nSemoga Allah menerima ibadah kita semua. Aamiin.`
              : data.now == 'isya' && ramadhan
                ? `*Hai seluruh umat Muslim yang berada di grup \`${subject}\`!*\n\nWaktu sholat *${data.now}${emoji}* di wilayah ${b.jadwalsholat.v} telah masuk. Mari kita laksanakan sholat fardhu tepat waktu.\n\nBagi yang memiliki kesempatan, jangan lupa menunaikan sholat sunnah Tarawih.\n\nSemoga Allah SWT menerima amal ibadah kita semua. Aamiin.`
                : data.now == 'imsak'
                  ? `*Hai seluruh umat Muslim yang berada di grup \`${subject}\`!*\n\nWaktu *imsak* di daerah ${b.jadwalsholat.v} telah tiba!\nSilakan menyelesaikan santap sahurnya, dan bersiap untuk menunaikan ibadah puasa.`
                  : `*Hai seluruh umat muslim yang berada di group \`${subject}\`!*\n\nWaktu sholat *${data.now}${emoji}* di daerah ${b.jadwalsholat.v} sudah masuk!`;
          await Exp.relayMessage(
            id,
            {
              viewOnceMessage: {
                message: {
                  interactiveMessage: {
                    body: {
                      text,
                    },
                    footer: {
                      text:
                        data.now == 'imsak'
                          ? `*"Nawaitu shauma ghadin an adā’i fardhi syahri ramadhāna hadzihis sanati lillāhi ta‘ālā."*\n(Aku niat berpuasa esok hari untuk menunaikan kewajiban di bulan Ramadan tahun ini karena Allah Ta’ala).\n\nSemoga puasa kita diterima Allah dan diberikan kekuatan serta kelancaran sepanjang hari. Aamiin.`
                          : `Buat semua yang ada di daerah ${b.jadwalsholat.v}, yuk segera tunaikan sholat!${isBotAdmin && tutup ? `\n\n_Group akan ditutup selama ${w}_` : ''}`,
                    },
                    ...(['magrib'].includes(data.now)
                      ? {
                          contextIntfo: {
                            mentionedJid: participants,
                          },
                        }
                      : {}),
                    carouselMessage: {},
                  },
                },
              },
            },
            {}
          );

          if (isBotAdmin && tutup && data.now !== 'imsak') {
            await Exp.groupSettingUpdate(id, 'announcement');
            setTimeout(
              () => Exp.groupSettingUpdate(id, 'not_announcement'),
              func.parseTimeString(w)
            );
          }

          data.now !== 'imsak' &&
            (await Exp.sendMessage(id, {
              audio: {
                url: data.adzan,
              },
              mimetype: 'audio/mpeg',
              ptt: true,
            }));
          Data.preferences[id].jadwalsholat = db;
        }
        await sleep(2000 + Math.floor(Math.random() * 1000));
      } catch (e) {
        console.error('Error in detector.js > jadwalsholat', e);
        if (e.message.includes('forbidden')) delete Data.preferences[id];
      }
    }
    for (let i of Object.keys(jadwal.groups)) {
      if (!chatDb.map((a) => a[0]).includes(i)) delete jadwal.groups[i];
    }
  }
  
  async function livechartNotifier() {
    const data = Data.livechart || [];
    const now = moment().tz('Asia/Jakarta');

    const siapKirim = data.filter((item) => {
      const rilis = moment.tz(
        `${item.tanggal} ${item.time}`,
        'YYYY-MM-DD HH:mm',
        'Asia/Jakarta'
      );
      return rilis.isBetween(now.clone().subtract(20, 'minutes'), now);
    });

    if (!siapKirim.length) return;
    if (!Data.sent_livechart) Data.sent_livechart = {};

    for (const anime of siapKirim) {
      for (const [groupId, pref] of Object.entries(Data.preferences)) {
        try {
          if (!pref.livechart) continue;

          const key = `${anime.tanggal} | ${anime.time} | ${anime.link}`;
          if (Data.sent_livechart[groupId]?.includes(key)) continue;

          // === Pesan utama === // terserah mau nambah apa lagi cek aja dlu di dbnya
          const img = await Exp.func.uploadToServer(anime.poster);
          const caption = [
            `*${anime.title}*`,
            `_*Jam tayang:* ${anime.hari}, ${anime.tanggal} | ${anime.time}_`,
            `*Episode:* ${anime.episode}`,
            anime.genre?.length ? `*Genre:* ${anime.genre.join(', ')}` : null,
            anime.studio ? `*Studio:* ${anime.studio}` : null,
            anime.season ? `*Season:* ${anime.season}` : null,
            anime.tanggal_rilis
              ? `*Anime Rilis:* ${anime.tanggal_rilis}`
              : null,
          ]
            .filter(Boolean)
            .join('\n');

          const hasVideos = anime.videos?.length > 0;
          const buttons = hasVideos
            ? anime.videos.slice(0, 7).map((url, i) => ({
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                  display_text:
                    anime.videos.length === 1 ? 'Trailer' : `Trailer ${i + 1}`,
                  url,
                }),
              }))
            : [
                {
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                    display_text: 'Lihat',
                    url: 'https://tinyurl.com/Lilia-Yukine',
                  }),
                },
              ];

          const card = {
            header: { imageMessage: img, hasMediaAttachment: true },
            body: { text: caption },
            footer: {
              text: anime.deskripsi || '',
            },
            nativeFlowMessage: { buttons },
          };

          const msg = generateWAMessageFromContent(
            groupId,
            {
              viewOnceMessage: {
                message: {
                  interactiveMessage: {
                    body: {
                      text: '🎌 *Live Chart*',
                    },
                    carouselMessage: { cards: [card], messageVersion: 1 },
                  },
                },
              },
            },
            {}
          );

          await Exp.relayMessage(groupId, msg.message, {
            messageId: msg.key.id,
          });

          if (!Data.sent_livechart[groupId]) Data.sent_livechart[groupId] = [];
          Data.sent_livechart[groupId].push(key);

          // === Visual === // block aja jika ga pengen di notif
          if (Array.isArray(anime.visuals) && anime.visuals.length > 0) {
            await new Promise((r) => setTimeout(r, 5000));

            const visualCards = await Promise.all(
              anime.visuals.map(async (vlink) => ({
                header: {
                  imageMessage: await Exp.func.uploadToServer(vlink),
                  hasMediaAttachment: true,
                },
                body: { text: '' },
                nativeFlowMessage: {
                  buttons: [
                    {
                      name: 'cta_url',
                      buttonParamsJson: JSON.stringify({
                        display_text: 'Lihat',
                        url: 'https://tinyurl.com/Lilia-Yukine',
                      }),
                    },
                  ],
                },
              }))
            );

            const visualMsg = generateWAMessageFromContent(
              groupId,
              {
                viewOnceMessage: {
                  message: {
                    interactiveMessage: {
                      body: { text: 'LIVE CHART PREVIEW📡' },
                      carouselMessage: {
                        cards: visualCards,
                        messageVersion: 1,
                      },
                    },
                  },
                },
              },
              {}
            );

            await Exp.relayMessage(groupId, visualMsg.message, {
              messageId: visualMsg.key.id,
            });
          }

          await new Promise((r) => setTimeout(r, 20000));
        } catch (e) {
          console.error('[Livechart Notifier Error]:', e);
          if (e.message.includes('forbidden')) delete Data.preferences[groupId];
        }
      }
    }
  }
  
  async function rpgsistem() {
    try {
      const waktu = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
      );

      const jam = waktu.getHours();
      const tanggal = waktu.getDate();

      if (!Data.rpg) return;

      const limitDefault = { transfer: 500000, unbox: 500 };

      for (let [uid, user] of Object.entries(Data.rpg)) {
        user.limit ??= {};
        user.resetlimit ??= 0;

        if (user.resetlimit !== tanggal) {
          for (let key in limitDefault) {
            const batas25 = limitDefault[key] * 0.25;
            if (
              typeof user.limit[key] !== "number" ||
              user.limit[key] <= batas25
            ) {
              user.limit[key] = limitDefault[key];
              console.log(
                `[ RESET LIMIT ] ${uid} - ${key} direset (sisa ${user.limit[key] <= batas25 ? 'dibawah 25%' : 'invalid'})`
              );
            }
          }
          user.resetlimit = tanggal;
        }
      }
    } catch (e) {
      console.error("Error di rpg sistem:", e);
    }
  }

  async function saveData(name) {
    let data = name == 'cmd' ? Data.use.cmds : Data[name];
    if (Data.mongo) {
      await Data.mongo.db.set(name, data);
    } else {
      const filepath = (name === 'users' ? fol[6] : db) + name + '.json';
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    }
  }

  //initialize available setup group jadwalsholat
  let jdwl = {};
  Object.entries(Data.preferences)
    .filter(([a, b]) => a.endsWith(from.group) && b.jadwalsholat)
    .forEach(([a, b]) => {
      jdwl[a] = b.jadwalsholat;
    });

  global.jadwal = new JadwalSholat(jdwl);

  cfg.keyChecker ??= true;
  keys['detector'] = setInterval(async () => {
    autoBackup();
    await cekJadibot();
    await rpgsistem();
    await sholat();
    await schedule();
    await ulangTahun();
    await resetAbsen();
    await cekSewa();
    livechartNotifier();
    cfg.keyChecker && (await keyChecker());

    const DB = global._DB || [
      'cmd',
      'preferences',
      'users',
      'badwords',
      'links',
      'fquoted',
      'audio',
      'setCmd',
      'response',
      'lids',
    ];

    try {
      for (let i of keys) {
        config[i] = global[i];
      }

      for (const name of DB) {
        await saveData(name);
      }

      await fs.writeFileSync(conf, JSON.stringify(config, null, 2));

    } catch (error) {
      console.error('Terjadi kesalahan dalam penulisan file', error);
    }
  }, 20000);

}