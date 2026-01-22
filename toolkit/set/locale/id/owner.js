let infos = (Data.infos.owner ??= {});

/*/------- 
   MESSAGES
/*/

infos.succesSetLang = `*Berhasil merubah bahasa default ke bahasa:* \`<lang>\``;
infos.lockedPrem = 'Dapatkan akses premium untuk membuka fitur² terkunci';
infos.unBannedSuccess = `*Berhasil, user @<sender> telah dihapus di hapus dari banned`;
infos.delBanned = `Anda telah dihapus dari daftar banned!\n_Sekarang anda telah diizinkan kembali mengunakan bot_!`;

infos.bannedSuccess = `*Berhasil membanned user!*\n ▪︎ User:\n- @<sender>\n ▪︎ Waktu ditambahkan: \n- <days>hari <hours>jam <minutes>menit <seconds>detik <milliseconds>ms\n\n`;
infos.addBanned = `\`Anda telah diblokir dari bot❗️\`\nWaktu: <days>hari <hours>jam <minutes>menit <seconds>detik <milliseconds>ms`;

infos.successSetVoice = `Success✅️\n\n- Voice: _<voice>_`;
infos.successSetLogic = `Sukses mengubah logic ai chat✅️\n\n\`New Logic:\`\n<logic>`;

infos.userNotfound = 'Nomor salah atau user tidak terdaftar!';
infos.wrongFormat = '*❗Format salah, silahkan periksa kembali*';

infos.successDelBadword = `Berhasil menghapus <input> kedalam list badword!`;
infos.successSetThumb = 'Berhasil mengganti thumbnail menu!';
infos.successAddBadword = `Berhasil menambahkan <input> kedalam list badword!`;
infos.isModeOn = `Maaf, <mode> sudah dalam mode on!`;
infos.isModeOff = `Maaf, <mode> sudah dalam mode off!`;

infos.isModeOnSuccess = `Sukses mengaktifkan <mode>`;
infos.isModeOffSuccess = `Sukses menonaktifkan <mode>`;

infos.badword = `Mau add, delete atau lihat list?\nContoh: <cmd> add|tobrut`;
infos.badwordAddNotfound = `Action mungkin tidak ada dalam list!\n*List Action*: add, delete, list\n\n_Contoh: <cmd> add|tobrut_`;

infos.listSetmenu = `\`List type menu yang tersedia:\`\n\n- <list>`;
infos.successSetMenu = `Berhasil mengganti menu ke <menu>`;
infos.audiolist = `Sukses menambahkan audio ke dalam list <list>✅️\n\nAudio: <url>\n> Untuk melihat list silahkan ketik *.getdata audio <list>*`;
infos.menuLiveLocationInfo =
  '_Menu liveLocation tidak dapat terlihat di private chat. Harap pertimbangkan kembali untuk menggunakan menu ini_';
infos.checkJson = `Harap periksa kembali JSON Object anda!\n\nTypeError:\n<rm>\n> <e>`;

/*!-======[ Set Info ]======-!*/
infos.set = `
[ PENGATURAN BOT ]

- public <on/off>
- autotyping <on/off>
- autoreadsw <on/off>
- autoreadpc <on/off>
- autoreadgc <on/of>
- similarCmd <on/off>
- premium_mode <on/of>
- editmsg <on/off>
- fquoted <name> <objek oratau quoted>
- welcome <tipe>
- logic <logic>
- lang <kode negara>
- voice <nama model>
- menu <tipe>
- call <off atau action>
- autoreactsw <off atau emojis>
- checkpoint <checkpoint_id>
- lora <lora_id>
- apikey <apikey>
- antitagowner <(on/off) atau balas pesan>
- keyChecker <on/off>
- chid <reply pesan (teruskan dari channel)
- register <on/off>

_Example: .set public on_`;

infos.premium_add = `
╭─❍「 *Panduan Premium* 」❍─╮
│
│ 👤 Only my owner
│
├─ ✦ *Opsi yang Tersedia:*
│   ├─ 🎁 \`.addprem\` – Tambah waktu premium
│   ├─ 🔻 \`.kurangprem\` – Kurangi waktu premium
│   └─ ❌ \`.delprem\` – Hapus status premium user
│
├─ ✦ *Cara Penggunaan:*
│   _Wajib sertakan nomor / reply / tag user target!_
│
│   📍 *#1. Reply Pesan Target:*
│     - \`.addprem 1d\`
│     - \`.kurangprem 1d\`
│     - \`.delprem\`
│
│   📍 *#2. Tag User:*
│     - \`.addprem @Barr|1d\`
│     - \`.kurangprem @Barr|1d\`
│     - \`.delprem @Barr|1d\`
│
│   📍 *#3. Nomor Langsung:*
│     - \`.addprem +62xxx|1d\`
│     - \`.kurangprem +62xxx|1d\`
│     - \`.delprem +62xxx|1d\`
│
├─ ✦ *Unit Waktu yang Didukung:*
│   \`s\` = detik │ \`m\` = menit │ \`h\` = jam  
│   \`d\` = hari │ \`w\` = minggu
│
├─ ✦ *Contoh Variasi Waktu:*
│   - \`.addprem @Barr|30s\` → 30 detik  
│   - \`.addprem @Barr|1m\` → 1 menit  
│   - \`.addprem @Barr|1h 15s\` → 1 jam 15 detik  
│   - \`.addprem @Barr|2d 4h\` → 2 hari 4 jam  
│   - \`.addprem @Barr|1w\` → 1 minggu  
│   - \`.addprem @Barr|1w 2d 3h\`  
│   - \`.addprem @Barr|1d 2h 30m 15s\`
│
╰─❍ *Bacalah baik-baik agar tidak tanya Barr lagi* ❍─╯`

infos.setCall = `
\`Cara Penggunaan:\`
 ▪︎ .set call <off or action>
- Contoh: .set call reject

_Anda juga bisa menambahkan action lain dengan cara memberi tanda *+*_

Contoh: .set call reject+block

\`LIST ACTION\`
- reject (menolak panggilan)
- block (memblokir pemanggil)
`;
infos.successSetCall = 'Berhasil mengatur anti call!\nAction: <action>';
infos.successOffCall = 'Berhasil menonaktifkan anti call!';

infos.setAutoreactSw = `
\`Cara Penggunaan:\`

 ▪︎ .set autoreactsw <off or emojis>
- Contoh: .set autoreactsw 😀😂🤣😭😘🥰😍🤩🥳🤢🤮

_Anda bisa menambahkan emoji sebanyak-banyaknya_
`;
infos.successSetAutoreactSw =
  'Berhasil mengatur Autoreact SW!\nEmoji: <action>';
infos.successOffAutoreactSw = 'Berhasil menonaktifkan Autoreact SW!';

infos.setHadiah = `
\`Cara Penggunaan:\`
 ▪︎ .set hadiah <Game> <Energy>
- Contoh: .set hadiah tebakgambar 60

\`LIST GAME\`
<game>
`;

infos.setFquoted = `
\`Contoh penggunaan:\`

- *Cara 1*
   ~ _Reply pesan dengan mengirimkan perintah *.set fquoted <name>_
     \`Contoh\`:
     - .set fquoted welcome

- *Cara 2*
   ~ _Kirimkan pesan dengan perintah *.set fquoted <name> <objek quoted>*_
     \`Contoh\`:
     - .set fquoted welcome {
    "key": {
      "fromMe": false,
      "participant": "0@whatsapp.net"
    },
    "message": {
      "conversation": "Termai"
    }
  }
`;

infos.setAudio = `
\`Contoh penggunaan:\`

- *Cara 1*
   ~ _Reply pesan dengan mengirimkan perintah *.set audio <name>*_
     \`Contoh\`:
     - .setdata audio welcome

- *Cara 2*
   ~ _Kirimkan pesan dengan perintah *.set audio <name> <url>*_
     \`Contoh\`:
     - .setdata audio welcome https://catbox.moe/xxxxxxx.mp3
`;

infos.delAudio = `
  ~ _Kirimkan pesan dengan perintah *.deldata audio <name> <url>*_
   \`Contoh\`:
   - .deldata audio welcome https://catbox.moe/xxxxxxx.mp3
`;

infos.setLogic = `*Untuk mengubah logic:*

_Kirimkan perintah *<cmd> logic* dengan format seperti berikut:_

<cmd> logic 
Nickainame: <your ai name>
Fullainame: <your nick ai name>
Profile: <Your Logic Here>

\`Logic saat ini:\`
Fullainame: <botfullname>
Nickainame: <botnickname>
Profile: <logic>`;

infos.banned = `╭─〔 𖦹 ࣪˖ ᴘᴀɴᴅᴜᴀɴ ʙᴀɴɴᴇᴅ ᴜꜱᴇʀ ˖ ࣪ 𖦹 〕─╮

*ʜᴀɴʏᴀ ᴏᴡɴᴇʀ ʏᴀɴɢ ᴅᴀᴘᴀᴛ ᴍᴇɴɢɢᴜɴᴀᴋᴀɴ ꜰɪᴛᴜʀ ɪɴɪ!*

✦ ᴏᴘꜱɪ ʏᴀɴɢ ᴛᴇʀꜱᴇᴅɪᴀ:
 ── ❯ \`banned\` — ᴍᴇʟᴀᴋᴜᴋᴀɴ ʙᴀɴɴᴇᴅ ꜱᴇᴍᴇɴᴛᴀʀᴀ  
 ── ❯ \`unbanned\` — ᴍᴇɴɢʜᴀᴘᴜꜱ ꜱᴛᴀᴛᴜꜱ ʙᴀɴɴᴇᴅ

✦ ᴄᴀʀᴀ ᴘᴇɴɢɢᴜɴᴀᴀɴ:
» *_ꜱᴇʀᴛᴀᴋᴀɴ ɴᴏᴍᴏʀ/ʀᴇᴘʟʏ/ᴛᴀɢ ᴛᴀʀɢᴇᴛ_*

❖ *ᴄᴏɴᴛᴏʜ ①* — ᴅᴇɴɢᴀɴ ʀᴇᴘʟʏ
  ⟶ .banned 1d  
  ⟶ .unbanned

❖ *ᴄᴏɴᴛᴏʜ ②* — ᴅᴇɴɢᴀɴ ᴛᴀɢ  
  ⟶ .banned @Barr|1d  
  ⟶ .unbanned @Barr

❖ *ᴄᴏɴᴛᴏʜ ③* — ᴅᴇɴɢᴀɴ ɴᴏᴍᴏʀ  
  ⟶ .banned +62xxxx|1d  
  ⟶ .unbanned +62xxxx

✦ *ᴜɴɪᴛ ᴡᴀᴋᴛᴜ ʏᴀɴɢ ᴅɪᴅᴜᴋᴜɴɢ:*  
- s / second / seconds / detik  
- m / minute / minutes / menit  
- h / hour / hours / jam  
- d / day / days / hari  
- w / week / weeks / minggu

✦ *ᴄᴏɴᴛᴏʜ ᴋᴏᴍʙɪɴᴀꜱɪ:*  
⟶ .banned @Barr|30 detik  
⟶ .banned @Barr|1 menit  
⟶ .banned @Barr|1 jam 15 detik  
⟶ .banned @Barr|2 hari 4 jam  
⟶ .banned @Barr|1 minggu  
⟶ .banned @Barr|1w 2d 3h  
⟶ .banned @Barr|1d 2h 30m 15s

╰─── ❝ ʙᴀᴄᴀ ᴅᴇɴɢᴀɴ ᴛᴇʟɪᴛɪ ᴀɢᴀʀ ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴋᴇꜱᴀʟᴀʜᴀɴ ❞ ───╯`

infos.setRole = `╭─〔 ⊹⟡ ᴘᴀɴᴅᴜᴀɴ ᴜɴᴛᴜᴋ ᴍᴇɴɢᴜʙᴀʜ ʀᴏʟᴇ ⟡⊹ 〕─╮

Pilih role yang diinginkan
<role>

🪷 Hanya untuk *pemilik sihir tertinggi* (Owner)  
🪷 Gunakan dengan bijak, seperti Elaina memilih takdirnya
╰────────────────────╯`

infos.setAntiTagOwner = `*✦ PETUNJUK ANTI-TAG OWNER ✦*

• *Aktifkan fitur:*
Ketik \`.set antitagowner on\`

• *Nonaktifkan fitur:* 
Ketik \`.set antitagowner off\`

• *Atur respon saat owner di-tag:*
Balas pesan yang ingin dijadikan respon, lalu ketik:  
\`.set antitagowner\`
`;
