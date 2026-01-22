/*!-======[ Module Imports ]======-!*/
const fs = 'fs'.import();

function getBarzz918() {
  return new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
}

const contextInfo = {
   externalAdReply: {
      title: `❏ 𝓐𝓵𝔂𝓪 [ アリヤ ]`,
      body: `Time ${getBarzz918()}`,
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

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
  const { id, sender, reply } = cht;
  const { func } = Exp;
  const { archiveMemories: memories, dateFormatter } = func;
  let infos = Data.infos;
  const chatDb = Data.preferences[cht.id] || {};

  ev.on(
    {
      cmd: ['group', 'resetlink', 'open', 'close', 'linkgc', 'setppgc'],
      listmenu: [
        'group <options>',
        'resetlink',
        'linkgc',
        'open',
        'close',
        'setppgc',
      ],
      tag: 'group',
      isGroup: true,
      isAdmin: true,
      isBotAdmin: true,
    },
    async () => {
      let opts = {
        open: ['buka', 'open'],
        close: ['tutup', 'close'],
        link: ['link', 'linkgroup', 'linkgc'],
        reset: ['resetlink', 'revokelink', 'revokeinvitelink'],
        locked: ['locked-change'],
        onephemeral: ['on-ephemeral'],
        offephemeral: ['off-ephemeral'],
        unlocked: ['unlocked-change'],
        setdesc: ['setdesc', 'setdescription', 'setname', 'setsubject'],
        setpp: ['setppgc', 'setthumb', 'setpp'],
      };
      let k = Object.keys(opts);
      let text = func.tagReplacer(infos.group.settings, {
        options: Object.values(opts).flat().join('\n- '),
      });
      let [a, ..._b] = (cht.q || '').split(' ');
      let b = _b.join(' ');
      if (!Boolean(a)) a = cht.cmd;

      opts[k[0]].includes(a)
        ? Exp.groupSettingUpdate(id, 'not_announcement')
        : opts[k[1]].includes(a)
          ? Exp.groupSettingUpdate(id, 'announcement')
          : opts[k[2]].includes(a)
            ? cht.reply(
                'https://chat.whatsapp.com/' +
                  (await Exp.groupInviteCode(cht.id))
              )
            : opts[k[3]].includes(a)
              ? Exp.groupRevokeInvite(cht.id)
              : opts[k[4]].includes(a)
                ? Exp.groupSettingUpdate(id, 'locked')
                : opts[k[5]].includes(a)
                  ? Exp.groupSettingUpdate(id, 'unlocked')
                  : opts[k[6]].includes(a)
                    ? Exp.groupSettingUpdate(id, !0)
                    : opts[k[7]].includes(a)
                      ? Exp.groupSettingUpdate(id, !1)
                      : opts[k[8]].includes(a)
                        ? (async (v) => {
                            let isDesc = ['setdesc', 'setdescription'].includes(
                              a
                            );

                            if (!v) {
                              let exp = Date.now() + 60000 * 5;
                              let area = 'Asia/Jakarta';
                              let date = dateFormatter(exp, area);
                              let { key } = await cht.reply(
                                `*Silahkan reply pesan ini dengan ${isDesc ? 'deskripsi' : 'nama'} group yang baru*\n> _Expired on ${date} (${area})_`
                              );
                              let qcmds =
                                memories.getItem(sender, 'quotedQuestionCmd') ||
                                {};
                              qcmds[key.id] = {
                                emit: `${cht.cmd} ${a}`,
                                exp,
                                accepts: [],
                              };
                              return memories.setItem(
                                sender,
                                'quotedQuestionCmd',
                                qcmds
                              );
                            }
                            Exp[
                              `groupUpdate${isDesc ? 'Description' : 'Subject'}`
                            ](cht.id, b);
                          })(b)
                        : opts[k[9]].includes(a)
                          ? (async () => {
                              let { quoted, type } = ev.getMediaType();
                              if (!(is.image || is.quoted.image)) {
                                let exp = Date.now() + 60000 * 5;
                                let area = 'Asia/Jakarta';
                                let date = dateFormatter(exp, area);
                                let { key } = await cht.reply(
                                  `*Silahkan reply pesan ini dengan foto yang akan dijadikan thumbnail/foto profile group!*\n> _Expired on ${date} (${area})_`
                                );
                                let qcmds =
                                  memories.getItem(
                                    sender,
                                    'quotedQuestionCmd'
                                  ) || {};
                                qcmds[key.id] = {
                                  emit: `${cht.cmd} setpp`,
                                  exp,
                                  accepts: [],
                                };
                                return memories.setItem(
                                  sender,
                                  'quotedQuestionCmd',
                                  qcmds
                                );
                              }
                              let media = quoted
                                ? await cht.quoted.download()
                                : await cht.download();
                              await cht.reply(infos.messages.wait);
                              Exp.setProfilePicture(cht.id, media)
                                .then((a) => cht.reply('Success...✅️'))
                                .catch((e) =>
                                  cht.reply('TypeErr: ' + e.message)
                                );
                            })()
                          : cht.reply(text);

      let accepts = Object.values(opts).flat();
      if (!accepts.includes(a)) {
        func.archiveMemories.setItem(sender, 'questionCmd', {
          emit: `${cht.cmd}`,
          exp: Date.now() + 60000,
          accepts,
        });
      }
    }
  );

  ev.on(
    {
      cmd: ['kick', 'add'],
      listmenu: ['kick', 'add'],
      tag: 'group',
      isGroup: true,
      isAdmin: true,
      isMention: func.tagReplacer(infos.group.kick_add, {
        prefix: cht.prefix,
        cmd: cht.cmd,
      }),
      isBotAdmin: true,
    },
    async () => {
      if (is.botMention && cht.cmd == 'kick')
        return cht.reply('Saya tidak ingin keluar!');
      let { status } = (
        await Exp.groupParticipantsUpdate(
          id,
          await func.getMentions(cht, true),
          cht.cmd == 'kick' ? 'remove' : 'add'
        )
      )[0];
      if (status == 408)
        return cht.reply('Dia baru-baru saja keluar dari grub ini!');
      if (status == 409) return cht.reply('Dia sudah join!');
      if (status == 500) return cht.reply('Grub penuh!');
      if (status == 403)
        return cht.reply('Maaf, gabisa ditambah karna private acc');
    }
  );

  ev.on(
    {
      cmd: ['getpp'],
      listmenu: ['getpp'],
      tag: 'group',
      isMention: true,
    },
    async () => {
      try {
        let pp = await Exp.profilePictureUrl(cht.mention[0]);
        Exp.sendMessage(cht.id, {
          image: {
            url: pp,
          },
        });
      } catch {
        cht.reply('Gabisa, keknya dia gapake pp');
      }
    }
  );

  ev.on(
    { 
       cmd: ['tagall','hidetag', 'h'],
       listmenu: ['tagall','hidetag'],
       tag: 'group',
       isGroup: true,
       isAdmin: true
    }, 
    async() => {
      if(Data.preferences[id]["antitagall"]) return cht.reply("Tagall tidak di izinkan disini!")

      let mentions = Exp.groupMembers.map(a => a.id)
      let { quoted, type: mediaType } = ev.getMediaType()
      let cmds = cht.cmd

      if (cmds == "tagall") {
        let text = `\`${cht?.q ?? ''}\`\n`
        for(let i = 0; i < mentions.length; i++){
            text += `\n${i+1}. @${mentions[i]?.split("@")[0]}`
        }
        
        Exp.sendMessage(
          id, 
          {
            text, 
            mentions 
          },
          { 
            quoted: Data.fquoted.fbisnis 
          }
        )
      }
        
      if (["hidetag", "h"].includes(cmds)) {
        if (quoted) {
          let caption = cht.q ||
            cht.quoted?.imageMessage?.caption ||
            cht.quoted?.videoMessage?.caption ||
            cht.quoted?.conversation ||
            ""
            
          let buffer = null
          if (
            cht.quoted?.imageMessage || 
            cht.quoted?.videoMessage 
          ) {
            buffer = await cht.quoted.download()
          }
        
          return Exp.sendMessage(
            id,
            {
              [mediaType]: buffer,
              caption,
              mentions
            },
            { quoted: Data.fquoted.fbisnis }
          )
        }
        
        Exp.sendMessage(
          id, 
          { 
            text: cht.q || '',
            mentions 
          }, 
          {
            quoted: Data.fquoted.fbisnis 
          }
        )
      }
    }
  )
 
  ev.on(
    {
      cmd: ['jadwalsholat'],
      listmenu: ['jadwalsholat'],
      tag: 'religion',
      args: 'Silahkan input daerahnya!',
    },
    async ({ args }) => {
      let { status, data, msg, timeZone, list } = await jadwal.init('no', args);
      if (!status) {
        func.archiveMemories.setItem(sender, 'questionCmd', {
          emit: `${cht.cmd}`,
          exp: Date.now() + 20000,
          accepts: [],
        });
        return cht.reply(
          `*${msg}*${list ? `\n\nList daerah:\n- ${list.join('\n- ')}` : ''}`
        );
      }
      const formatter = new Intl.DateTimeFormat('id-ID', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      const parts = formatter.formatToParts(new Date());
      const d = String(
        parseInt(parts.find((p) => p.type === 'day').value, 10)
      ).padStart(2, '0');
      const m = String(
        parseInt(parts.find((p) => p.type === 'month').value, 10)
      ).padStart(2, '0');

      let dm = `${d}/${m}`;
      let a = data.find((a) => a.tanggal == dm);
      console.log({ data, a, dm });
      let text = `*JADWAL SHOLAT*\n\nHari ini: *${func.dateFormatter(Date.now(), timeZone)}*\n- imsak: ${a.imsak || 'only ramadhan'}\n- subuh: ${a.subuh}\n- dzuhur: ${a.dzuhur}\n- ashar: ${a.ashar}\n- magrib: ${a.magrib}\n- isya: ${a.isya}\n\n*Jadwal bulan ini*:\n${infos.others.readMore}\n${data.map((a) => ` \n 🗓️ \`${a.tanggal}\`\n- imsak: ${a.imsak}\n- subuh: ${a.subuh}\n- dzuhur: ${a.dzuhur}\n- ashar: ${a.ashar}\n- magrib: ${a.magrib}\n- isya: ${a.isya}\n`).join('\n')}`;
      cht.reply(text);
    }
  );

  ev.on(
    {
      cmd: ['on', 'off'],
      listmenu: ['on', 'off'],
      tag: 'group',
      isGroup: true,
      isAdmin: true,
    },
    async () => {
      let [input, v, ...etc] = cht.q?.trim().toLowerCase().split(' ');
      let actions = [
        "antich", 
        "antiedit",
        "antidelete",
        "antilink", 
        "antidokumen",
        "antistickerpack",
        "antisticker",
        "antitoxic",
        "antiimage", 
        "antivideo",
        "antivoice",
        "antitagall", 
        "antitagsw", 
        "antievent",
        "antikontak",
        "antitag", 
        "mute",
        "nsfw",
        "swgc",
        "livechart",
        "onlyadmin",
        "antibot",
        "playgame",
        "jadwalsholat", 
        "autodownload",
        "welcome"
      ];
      let text = `°❀⋆.ೃ࿔*:･ﾟ  𝑶𝒑𝒔𝒊 𝒀𝒂𝒏𝒈 𝑻𝒆𝒓𝒔𝒆𝒅𝒊𝒂  ﾟ･*:࿔*:･ﾟ❀⋆°

Pilih salah satu opsi di bawah ini ya~ ⸜(｡˃ ᵕ ˂ )⸝♡

${actions.map(v => `⟡ ${v}`).join("\n")}

🔰 𝘊𝘰𝘯𝘵𝘰𝘩:
↳ ${cht.prefix + cht.cmd} antilink

૮₍´｡• ᵕ •｡\`₎ა Pilih yang mana?`
      if (!actions.includes(input)) {
        func.archiveMemories.setItem(sender, 'questionCmd', {
          emit: `${cht.cmd}`,
          exp: Date.now() + 60000,
          accepts: actions,
        });
        return cht.reply(text);
      }
      let sets = Data.preferences[id];
      sets[input] = sets[input] || false;
      let sholat = {};
      if (input == 'jadwalsholat' && cht.cmd == 'on') {
        if (!v)
          return cht.reply(`*Harap sertakan daerahnya!*
- Contoh: ${cht.prefix + cht.cmd + ' jadwalsholat kab-bungo'}

_Anda juga bisa menyertakan type di sebelah input daerah untuk kebutuhan tertentu_

\`List type:\`
- ramadhan
> Untuk bulan ramadhan, ini akan sekaligus mengingatkan waktu imsak dan ucapan selamat berbuka saat adzan Maghrib berkumandang
- tutup
> otomatis menutup grup(selama 5 menit) saat tiba waktu sholat

- Contoh penggunaan type: .on jadwalsholat kab-bungo ramadhan tutup

_Jika sudah mengaktifkan jadwalsholat dengan tipe diatas, anda bisa memastikannya dengan .off jadwalsholat lalu meng-aktifkan kembali .on jadwalsholat tanpa menyertakan type_

> *❗Dengan teks ini, admin sangat berharap kepada user untuk membaca dengan teliti agar tidak menanyakan lagi!*`);
        let isOpt = false;
        if (etc.length > 0) {
          let acts = ['ramadhan', 'tutup'];
          let notf = etc.find((a) => !acts.includes(a));
          if (notf)
            return cht.reply(
              `Pilihan opsi ${notf} tidak tersedia!\n\nOpsi yang tersedia: ${acts.join(', ')}`
            );
          isOpt = true;
        }
        let _txt = `${infos.group.on(cht.cmd, input)}`;
        if (isOpt) {
          _txt += `\n\n\`Type\`:`;
          for (let i of etc) {
            _txt += `\n- ${i}`;
            sholat[i] = true;
          }
        }
        let { status, msg, data, list, db } = await jadwal.init(id, v, sholat);
        if (!status)
          return cht.reply(
            `*${msg}*${list ? `\n\nList daerah:\n- ${list.join('\n- ')}` : ''}`
          );
        sets['jadwalsholat'] = db;
        return await cht.reply(_txt);
      } else {
        if (cht.cmd == 'on' && sets[input])
          return cht.reply(`🧸 Hehe~ \`${input}\` udah aktif dari tadi kok\nNggak usah diaktifin lagi yaa~ ꒰｡• ᴗ •｡꒱`);
        if (cht.cmd !== 'on' && !sets[input])
          return cht.reply(`🧸 Hehe~ \`${input}\` udah nonaktif dari tadi kok\nNggak usah nonaktifkan lagi yaa~ ꒰｡• ᴗ •｡꒱`);
        sets[input] = cht.cmd == 'on';
        if (input == 'antilink') {
          sets.links = sets.links || ['chat.whatsapp.com'];
        }
        if (input == 'jadwalsholat' && cht.cmd !== 'on')
          delete jadwal.groups[id];
      }

      cht.reply(infos.group.on(cht.cmd, input));
    }
  );

  ev.on(
    {
      cmd: ['antilink'],
      listmenu: ['antilink'],
      tag: 'group',
      args: infos.about.antilink,
      isGroup: true,
      isAdmin: true,
    },
    async ({ args }) => {
      let [action, ...etc] = args.split(' ');
      let value = etc?.join(' ');
      let sets = Data.preferences[cht.id];
      sets[cht.cmd] = sets[cht.cmd] || false;
      sets.links = sets.links || ['chat.whatsapp.com'];
      if (['on', 'off'].includes(action)) {
        if (action == 'on' && sets[cht.cmd])
          return cht.reply(`*${cht.cmd}* sudah aktif disini!`);
        if (action !== 'on' && !sets[cht.cmd])
          return cht.reply(`*${cht.cmd}* sudah non-aktif disini!`);
        sets[cht.cmd] = action == 'on';
        cht.reply(infos.group.on(action, cht.cmd));
      } else if (['add', 'del', 'delete'].includes(action)) {
        if (!value)
          return cht.reply('Please put link!\n\n' + infos.about.antilink);
        if (action == 'add') {
          sets.links.push(value);
          sets.links = [...new Set(sets.links)];
          cht.reply(`Success add link ${value}`);
        } else {
          sets.links = [...new Set(sets.links.filter((a) => a !== value))];
          cht.reply(`Success delete link ${value}`);
        }
      } else if (action == 'list') {
        cht.reply(
          `\`Group ID: ${cht.id}\`\n\n*Include links*\n- ${sets.links.join('\n- ')}`
        );
      } else {
        cht.reply(infos.about.antilink);
      }
    }
  );

  ev.on(
    {
      cmd: ['afk'],
      listmenu: ['afk'],
      tag: 'group',
      isGroup: true,
    },
    async ({ args, urls }) => {
      let alasan = args || 'Rahasia...';
      if (urls?.length > 0)
        return cht.reply('Alasan tidak boleh menggunakan link/promosi!');
      if (alasan.length > 100)
        return cht.reply('Alasan tidak boleh lebih dari 100 karakter!');
      func.archiveMemories.setItem(sender, 'afk', {
        time: Date.now(),
        reason: alasan,
      });
      reply(`\`𝙼𝙾𝙳𝙴 𝙰𝙵𝙺\`
ⵓ  @${sender.split('@')[0]} 𝚜𝚎𝚍𝚊𝚗𝚐 𝙰𝙵𝙺

➪ 𝙰𝚕𝚊𝚜𝚊𝚗 : ${alasan}
➪ 𝚂𝚎𝚓𝚊𝚔 : ${func.dateFormatter(Date.now(), 'Asia/Jakarta')}

‼️  𝙹𝚊𝚗𝚐𝚊𝚗 𝚍𝚒 𝚝𝚊𝚐 𝚍𝚞𝚕𝚞 𝚢𝚊~`, { mentions: [sender]})
    }
  );

  let schedule = `Format: .${cht.cmd} type msg|action|hh:mm,Time/Zone  
\`*Type*\`: add, delete, list

# *MENAMBAH SCHEDULE*
- format: .${cht.cmd} add msg|action|hh:mm,Time/Zone
> _Contoh: .${cht.cmd} add Hai semua, udah malam nih, jadi grup aku tutup ya|tutup|22:00,Asia/Jakarta_ 
*Detail:*  
 ℹ️ \`msg\` adalah pesan yang akan dikirim saat bot menjalankan action sesuai jadwal yang telah ditentukan.  

 ℹ️ \`action\` adalah tindakan yang akan dilakukan oleh bot:  
  _List: close,tutup,open,buka,none,silent,-_
  > Keterangan:
- *close/tutup* → Menutup grup  
- *open/buka* → Membuka grup
- *none/silent/- → Hanya mengirimkan pesan 

 ℹ️ \`hh:mm,Time/Zone\` adalah waktu eksekusi berdasarkan zona waktu yang dipilih.  
- *Daftar TimeZone*: Asia/Jakarta, Asia/Makassar, Asia/Jayapura  

# *MENGHAPUS SCHEDULE*
- format: .${cht.cmd} delete time
> _Contoh: .${cht.cmd} delete 22:00

# *MELIHAT LIST SCHEDULE*
> .${cht.cmd} list

\`Kami sangat berharap panduan ini dibaca dengan teliti agar tidak lagi menanyakan kepada admin terkait cara penggunaanya, terimakasih\`
 `;

  function calculateSoon(timeZone, hh, mm) {
    let now = new Date();
    let formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
    let [currentHour, currentMinute] = formatter
      .format(now)
      .split(':')
      .map(Number);

    let nowDate = new Date(
      new Date().toLocaleString('en-US', {
        timeZone,
      })
    );

    let targetDate = new Date(nowDate);
    targetDate.setHours(hh, mm, 0, 0);

    if (targetDate < nowDate) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    let diffMs = targetDate - nowDate;
    let diffMinutes = Math.floor(diffMs / 60000);
    let remainingHours = Math.floor(diffMinutes / 60);
    let remainingMinutes = diffMinutes % 60;
    return {
      remainingHours,
      remainingMinutes,
    };
  }
  ev.on(
    {
      cmd: ['schedule', 'schedules'],
      listmenu: ['schedules'],
      tag: 'group',
      args: schedule,
      isGroup: true,
      isAdmin: true,
      isBotAdmin: true,
    },
    async ({ args }) => {
      let [type, ...format] = args.split(' ');
      let q = format.join(' ')?.trim();
      chatDb.schedules ??= [];
      if (type == 'add') {
        let [msg, action, timezone] = q.split('|');
        let actions = {
          open: 'not_announcement',
          close: 'announcement',
          buka: 'not_announcement',
          tutup: 'announcement',
          none: '-',
          silent: '-',
          '-': '-',
        };
        if (!msg || !action || !timezone)
          return cht.reply(
            `*Harap masukkan ${!msg ? 'pesan' : !action ? 'action' : 'timezone'} nya!*\n\n${schedule}`
          );
        if (!actions[action])
          return cht.reply(
            `Action tidak tersedia, silahkan baca lagi!\n\n${schedule}`
          );
        let [time, zone] = timezone.split(',');
        if (!time)
          return cht.reply(`*Harap sertakan time nya!*\n\n${schedule}`);
        if (chatDb.schedules.find((a) => a.time == time))
          return cht.reply(
            `*Schedule dengan waktu ${time} sudah ada, harap gunakan waktu lain!*`
          );
        let [hh, mm] = time.split(':');

        if (!hh || !mm || isNaN(hh) || isNaN(mm))
          return cht.reply(`*Time tidak valid!*\n\n${schedule}`);
        if (!zone)
          return cht.reply(`*Harap sertakan Zona waktunya!*\n\n${schedule}`);
        let LSZone = ['Asia/Jakarta', 'Asia/Jayapura', 'Asia/Makassar'];

        let timeZone = func.getTopSimilar(
          await func.searchSimilarStrings(zone, LSZone, 0.7)
        ).item;
        if (!timeZone)
          return cht.reply(
            `*Zona waktu tidak valid, harap baca kembali!* \n\n${schedule}`
          );

        let { remainingHours, remainingMinutes } = calculateSoon(
          timeZone,
          hh,
          mm
        );

        chatDb.schedules.push({
          time,
          timeZone,
          msg,
          action: actions[action],
        });
        chatDb.schedules = chatDb.schedules
          .map(JSON.stringify)
          .filter((v, i, a) => a.indexOf(v) === i)
          .map(JSON.parse);
        cht.reply(
          `✅ Success menambahkan schedule!  \n\n🕒 Waktu: ${time}, ${timeZone}  \n⚡ Action: ${action}  \n💬 Pesan: ${msg}  \n\n_⏳ ${remainingHours} jam ${remainingMinutes} menit lagi._`
        );
      } else if (type == 'delete') {
        if (!q) return cht.reply(`*Harap sertakan time nya!*\n\n${schedule}`);
        let [hh, mm] = q.split(':');
        if (!hh || !mm || isNaN(hh) || isNaN(mm))
          return cht.reply(`*Time tidak valid!*\n\n${schedule}`);
        let fTime = chatDb.schedules.find((a) => a.time == q);
        if (!fTime)
          return cht.reply(`*Schedule dengan waku tersebut tidak ditemukan!*`);
        chatDb.schedules = chatDb.schedules.filter((a) => a.time !== q);
        cht.reply(`✅ Success menghapus schedule!\n🕒 Waktu: ${q}`);
      } else if (type == 'list') {
        if (chatDb.schedules.length < 1)
          return cht.reply('Tidak ada schedule yang aktif disini!');
        let txt = '*[ LIST SCHEDULE ]*\n';
        let l = 0;
        for (let i of chatDb.schedules) {
          l++;
          let [hh, mm] = i.time.split(':');
          let { remainingHours, remainingMinutes } = calculateSoon(
            i.timeZone,
            hh,
            mm
          );
          txt += `
# \`${i.time}, ${i.timeZone}\`
- ⚡ Action: ${i.action}
- 💬 Pesan: ${i.msg}
_⏳ ${remainingHours} jam ${remainingMinutes} menit lagi._
`;
        }

        cht.reply(txt);
      } else {
        cht.reply(`*Type tidak valid!*\n\n${schedule}`);
      }
    }
  );

  ev.on(
    {
      cmd: ['inviteinfo'],
      listmenu: ['inviteinfo'],
      tag: 'group',
      energy: 10,
      args: 'Masukkan link grup yang valid!',
    },
    async ({ args }) => {
      let inviteCodeMatch = args.match(/chat\.whatsapp\.com\/([\w-]+)/);
      if (!inviteCodeMatch)
        return cht.reply('Gunakan perintah ini dengan link grup yang valid!');

      let inviteCode = inviteCodeMatch[1];
      let groupInfo = await Exp.groupGetInviteInfo(inviteCode);
      let groupId = groupInfo.id;
      let isBotInGroup = false;
      let joinedGroups = await Exp.groupFetchAllParticipating();
      let groupData = isBotInGroup
        ? await Exp.groupMetadata(groupId)
        : groupInfo;

      if (joinedGroups[groupId]) {
        isBotInGroup = true;
      }

      let data = {
        id: groupData.id,
        name: groupData.subject,
        createdAt: func.dateFormatter(
          groupData.creation * 1000,
          'Asia/Jakarta'
        ),
        owner: groupData.owner
          ? `@${groupData.owner.split('@')[0]}`
          : 'Tidak diketahui',
        totalMembers: groupData.size || groupData.participants.length,
        admins: groupData.participants
          .filter((p) => p.admin)
          .map((p) => `@${p.id.split('@')[0]}`),
        totalAdmins: groupData.participants.filter((p) => p.admin).length,
        description: groupData.desc || 'Tidak ada deskripsi',
        isCommunity: groupData.isCommunity ? '✅ Ya' : '❌ Tidak',
        isAnnouncement: groupData.announce ? '✅ Ya' : '❌ Tidak',
        isRestricted: groupData.restrict ? '✅ Ya' : '❌ Tidak',
        joinApproval: groupData.joinApprovalMode ? '✅ Ya' : '❌ Tidak',
        ephemeralDuration: groupData.ephemeralDuration
          ? `${groupData.ephemeralDuration} detik`
          : 'Tidak aktif',
      };
      let text = `╭─♡・🎀 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗙𝗢 🎀・♡─╮\n` +
`│ 💌 *Nama Grup:* ${data.name}\n` +
`│ 🆔 *ID Grup:* ${data.id}\n` +
`│ 🏡 *Dibuat:* ${data.createdAt}\n` +
`│ ✍️ *Pembuat:* ${data.owner}\n` +
`│ 👥 *Anggota:* ${data.totalMembers}\n` +
`│ 👤 *Admin:* ${data.totalAdmins}\n` +
`╰───────────────♡───────────────╯\n\n` +

`╭─♡・💬 𝗗𝗘𝗦𝗞𝗥𝗜𝗣𝗦𝗜・♡─╮\n` +
`${data.description}\n` +
`╰────────────♡────────────╯\n\n` +

`╭─♡・🧷 𝗔𝗗𝗠𝗜𝗡・♡─╮\n` +
`${data.admins.length > 0 ? data.admins.join(', ') : 'Tidak ada admin'}\n` +
`╰────────────♡────────────╯\n\n` +

`╭─♡・⚙️ 𝗣𝗘𝗡𝗚𝗔𝗧𝗨𝗥𝗔𝗡・♡─╮\n` +
`- Komunitas: ${data.isCommunity}\n` +
`- Pengumuman: ${data.isAnnouncement}\n` +
`- Dibatasi: ${data.isRestricted}\n` +
`- Join Approval: ${data.joinApproval}\n` +
`- Pesan Sementara: ${data.ephemeralDuration}\n` +
`- 🔗 Link Group: https://chat.whatsapp.com/${inviteCode}\n` +
`╰────────────♡────────────╯`

      cht.reply(text, {
        mentions: groupData.participants.map((p) => p.id),
      });
    }
  );

  ev.on(
    {
      cmd: ['topenergy', 'topglobalenergy'],
      listmenu: ['topenergy', 'topglobalenergy'],
      tag: 'group',
    },
    async ({ args }) => {
      if(cht.cmd == 'topenergy' && !is.group) return cht.reply("Khusus group!")
      let topUsers = [];
      let topEnergy = await Promise.all(
        [
          ...(is.group && cht.cmd !== 'topglobalenergy'
            ? Exp.groupMembers
            : Object.keys(Data.users).map((a) => ({
                id: String(a),
              }))),
        ].map((a) => ({
          id: a.id,
          energy: memories.get(a.id)?.energy || 0,
        }))
      ).then((members) =>
        members
          .sort((a, b) => b.energy - a.energy)
          .slice(0, args && !isNaN(args) ? parseInt(args) * 1 : 10)
          .map((a, i) => {
            topUsers.push(a.id);
            let aid = a.id.includes('@') ? a.id.split('@')[0] : a.id;
            let name = func.getName(aid);
            let emoji =
               i === 0 ? '(🏆)' : i === 1 ? '(🥈)' : i === 2 ? '(🥉)' : '';

           return `╭━━〔 \`TOP KE-${i + 1}\` 〕 ${emoji}
┃❏ Nama   : ${name.extractMentions().length == 0 ? name : name.slice(0, 5) + '****' + name.slice(-4)}
┃❏ ID     : ${cht.cmd == 'topglobalenergy' ? aid.slice(0, 5) + '****' + aid.slice(-4) : aid}
┃❏ Energy : ${a.energy} ⚡
╰━━━━━━━━━━⬣`;
          })
          .join('\n\n')
      );
      let di =
        cht.cmd !== 'topglobalenergy'
          ? `DI GROUP \`${Exp.groupMetdata.subject}\``
          : `DARI TOTAL \`${Object.keys(Data.users).length} USERS\``;
      cht.reply(`*TOP ${args && !isNaN(args) ? parseInt(args) * 1 : 10} ENERGY TERBANYAK ${di}*\n\n${topEnergy}`);
    }
  );

  ev.on(
    {
      cmd: ['promote', 'demote'],
      listmenu: ['promote', 'demote'],
      tag: 'group',
      isGroup: true,
      isAdmin: true,
      isMention: true,
      isBotAdmin: true,
    },
    async () => {
      try {
        if (is.botMention)
          return cht.reply(
            'Promote/demote ke diri sendiri tidak dapat dilakukan!'
          );
        await Exp.groupParticipantsUpdate(
          id,
          await func.getMentions(cht, true),
          cht.cmd
        );
        const text = `✧˚ · . 🕊️ 𝒂𝒄𝒕 𝒐𝒇 𝒄𝒂𝒓𝒊𝒏𝒈 . · ˚✧
╭♡━━ ༝༚༝༚━━♡
┃ 🌟 *${cht.cmd}* berhasil ke @${cht.mention[0].replace(from.sender, '')}
╰♡━━༝༚༝༚━━♡`

         await Exp.sendMessage(
           id,
           {
             text,
             contextInfo: {
               ...contextInfo,
               mentionedJid: [
                 cht.mention
               ]
             }
           },
           { 
             quoted: cht
           }
         )
      } catch (e) {
        cht.reply(`Enggak bisa!${infos.others.readMore}\n\n${e}`);
      }
    }
  );
}
