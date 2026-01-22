let infos = Data.infos.messages ??= {};

/* ---
   PENTING!
   Jangan ubah teks dalam tanda kurung <> karena merupakan format kunci.
--- */

/*!-======[ Default Message]======-!*/
infos.isGroup = "Khusus grup yahh!"
infos.isAdmin = "Kamu cuma member, jadi ga usah belagu"
infos.isOwner = "Lu siapa dah, fitur itu cuma khusus owenerku (⁠ー⁠_⁠ー⁠゛⁠)"
infos.isBotAdmin = "Jadikan gw admin terlebih dahulu"
infos.isQuoted = "Reply pesannya!"
infos.isMedia = `Reply atau kirim <type> dengan caption: <caption>`
infos.isExceedsAudio = `Audio tidak boleh lebih dari <second>detik!`
infos.isExceedsVideo = `Video tidak boleh lebih dari <second>detik!`
infos.isNoAnimatedSticker = "Sticker haris type image yahh!"
infos.isAnimatedSticker = "Sticker haris type video yahh!"
infos.isAvatarSticker = "❗ ꜱᴛɪᴋᴇʀ ʜᴀʀᴜꜱ ᴛʏᴘᴇ ᴀᴠᴀᴛᴀʀ"
infos.isArgs = "❗ ʜᴀʀᴀᴘ ꜱᴇʀᴛᴀᴋᴀɴ ᴛᴇᴋꜱ"
infos.isBadword = `Woii!!, kata *<badword>* tidak diizinkan!`
infos.isMention = `Harap tag orangnya yahh!`
infos.isUrl = "Mana linknya?"
infos.isFormatsUrl = "❗ ᴜʀʟ ʏᴀɴɢ ᴅɪʙᴇʀɪᴋᴀɴ ʜᴀʀᴜꜱ ʙᴇʀᴜᴘᴀ ᴜʀʟ ꜱᴇᴘᴇʀᴛɪ:\n- <formats>"

infos.hasClaimTrial = "Lu udah claim freetrial"
infos.hasPremiumTrial = "❌ ᴛɪᴅᴀᴋ ᴅᴀᴘᴀᴛ ᴄʟᴀɪᴍ ꜰʀᴇᴇᴛʀɪᴀʟ, ᴋᴀᴍᴜ ꜱᴜᴅᴀʜ ᴘʀᴇᴍɪᴜᴍ"
infos.isNotAvailableOnTrial = "Freetrial ga boleh pake fitur ini!\nsono beli premium sama owner ku (⁠ー⁠_⁠ー⁠゛⁠)"

infos.wait = '```Woke tunggu yahh...```'
infos.sending = "```Bentar lagi niehh!```"
infos.failed = 'Ehh terjadi kesalahan :(\n> coba lagi nanti yahh...'

infos.onlyNumber = "<value> Harus berupa angka ihh!"

infos.isEnergy = ({ uEnergy, energy, charging }) => `
╭╼❀⸝⸝ *Energy kamu kurang yaa~* (｡•́︿•̀｡)₊˚ෆ｡˚
│
│ ⊹ 𓍯  Energi kamu : ${uEnergy} ⚡
│ ⊹ 𓍯  Butuhnya     : ${energy} ⚡
│
│ ${charging ? '🍏 Lagi charging yaa~ tunggu yah ( ˘͈ ᵕ ˘͈♡)' : '🍎 Mau isi energi? ketik aja: *.cas* yaa~ (｡•̀ᴗ-)✧'}
│
│ 🌷 Kamu juga bisa ambil bonus harian lhoo~
│    Coba ketik: *.daily* ✿
╰──────── ⋆｡°✩₊˚๑
`.trim();

infos.onlyPremium = (trial, available=true) => `❌ ᴍᴀᴀꜰ ᴇʟᴀɪɴᴀ ᴛᴏʟᴀᴋ, ꜰɪᴛᴜʀ ɪɴɪ ᴋʜᴜꜱᴜꜱ ᴘᴇɴɢɢᴜɴᴀ ᴘʀᴇᴍɪᴜᴍ, ᴊɪᴋᴀ ɪɴɢɪɴ ᴅᴀꜰᴛᴀʀ ᴘʀᴇᴍɪᴜᴍ ꜱɪʟᴀʜᴋᴀɴ ʜᴜʙᴜɴɢɪ ᴏᴡɴᴇʀ\n\n- ᴋᴇᴛɪᴋ *.ᴘʀᴇᴍɪᴜᴍ* ᴜɴᴛᴜᴋ ɪɴꜰᴏ ʟᴇʙɪʜ ʟᴀɴᴊᴜᴛ

*ʙᴇʟᴜᴍ ᴄʟᴀɪᴍ ꜰʀᴇᴇᴛʀɪᴀʟ?*
${Data.infos.others.readMore}
${!trial ? `*ʏᴇʏ ᴋᴀᴍᴜ ᴍᴀꜱɪʜ ʙɪꜱᴀ ᴄʟᴀɪᴍ ᴛʀɪᴀʟ 🎁*\nᴋᴇᴛɪᴋ *.ꜰʀᴇᴇᴛʀɪᴀʟ* ᴜɴᴛᴜᴋ ᴍᴇɴɢ ᴄʟᴀɪᴍ ᴛʀɪᴀʟ 1 ʜᴀʀɪ${available ? '': '_ꜰɪᴛᴜʀ ɪɴɪ ᴛɪᴅᴀᴋ ʙɪꜱᴀ ᴅɪɢᴜɴᴀᴋᴀɴ ᴏʟᴇʜ ᴜꜱᴇʀ ꜰʀᴇᴇᴛʀɪᴀʟ_\n_ᴀɴᴅᴀ ᴛᴇᴛᴀᴘ ᴘᴇʀʟᴜ ᴍᴇᴍʙᴇʟɪ ᴘʀᴇᴍɪᴜᴍ ᴍᴇʟᴀʟᴜɪ ᴏᴡɴᴇʀ ᴜɴᴛᴜᴋ ᴍᴇɴᴅᴀᴘᴀᴛᴋᴀɴ ᴀᴋꜱᴇꜱ ꜰɪᴛᴜʀ ɪɴɪ_'}` : "ᴋᴀᴍᴜ ꜱᴜᴅᴀʜ ᴄʟᴀɪᴍ ʙᴏɴᴜꜱ ɪɴɪ❗"}`

/*!-======[ Premium ]======-!*/
infos.premium = (trial, available=true) => `
_*ᴅᴀᴘᴀᴛᴋᴀɴ ᴀᴋꜱᴇꜱ ᴜɴᴛᴜᴋ ᴍᴇɴɢɢᴜɴᴀᴋᴀɴ ꜰɪᴛᴜʀ ꜰɪᴛᴜʀ ᴘʀᴇᴍɪᴜᴍ*_

\`𝗺𝗮𝗻𝗳𝗮𝗮𝘁 𝗽𝗿𝗲𝗺𝗶𝘂𝗺\`
- ᴀᴋꜱᴇꜱ ꜰɪᴛᴜʀ ᴛᴇʀᴋᴜɴᴄɪ ✔️
- ᴇɴᴇʀɢʏ: +${cfg.first.trialPrem.energy} ✔️
- ᴄʜᴀʀɢᴇʀ ʀᴀᴛᴇ: +${cfg.first.trialPrem.chargeRate} ✔️
- ᴍᴀx ᴄʜᴀʀɢᴇʀ: +${cfg.first.trialPrem.maxCharge} ✔️
- ᴄʜᴀᴛ ʙᴏᴛ ᴀɪ ᴛᴀɴᴘᴀ ʙᴀᴛᴀꜱ ✔️
 (ʜᴀɴʏᴀ ʙᴇʀʟᴀᴋᴜ ꜱᴇʟᴀᴍᴀ ᴍᴇɴᴊᴀᴅɪ ᴜꜱᴇʀ ᴘʀᴇᴍɪᴜᴍ)

*]==------------------==[*
      _「 \`[𝗣𝗥𝗘𝗠𝗜𝗨𝗠]\` 」_
*]==------------------==[*
\`\`\`
╭─❖ 𝐏𝐑𝐈𝐂𝐄𝐋𝐈𝐒𝐓 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 ❖─╮
│
│  ⟣  3   hari   =   2.000
│  ⟣  7   hari   =   4.000
│  ⟣  14  hari   =   7.000
│  ⟣  30  hari   =  12.000
│  ⟣  45  hari   =  16.000
│  ⟣  60  hari   =  20.000
│  ⟣  90  hari   =  27.000
│  ⟣ 120  hari   =  33.000
│  ⟣ 150  hari   =  38.000
│  ⟣ 200  hari   =  45.000
│
╰──────────────────────╯
\`\`\`
💬 _ᴜɴᴛᴜᴋ ᴍᴇᴍʙᴇʟɪ ᴘʀᴇᴍɪᴜᴍ ꜱɪʟᴀʜᴋᴀɴ ᴋᴇᴛɪᴋ ".ᴏᴡɴᴇʀ" ᴜɴᴛᴜᴋ ᴍᴇɴɢʜᴜʙᴜɴɢɪ ᴏᴡɴᴇʀ_

*ʙᴇʟᴜᴍ ᴄʟᴀɪᴍ ꜰʀᴇᴇᴛʀɪᴀʟ❓*
${Data.infos.others.readMore}
${!trial ? `*ʏᴇʏ ᴋᴀᴍᴜ ᴍᴀꜱɪʜ ʙɪꜱᴀ ᴄʟᴀɪᴍ ᴛʀɪᴀʟ 🎁*\nᴋᴇᴛɪᴋ *.ꜰʀᴇᴇᴛʀɪᴀʟ* ᴜɴᴛᴜᴋ ᴍᴇɴɢ ᴄʟᴀɪᴍ ᴛʀɪᴀʟ 1 ʜᴀʀɪ${available ? '': '_ꜰɪᴛᴜʀ ɪɴɪ ᴛɪᴅᴀᴋ ʙɪꜱᴀ ᴅɪɢᴜɴᴀᴋᴀɴ ᴏʟᴇʜ ᴜꜱᴇʀ ꜰʀᴇᴇᴛʀɪᴀʟ_\n_ᴀɴᴅᴀ ᴛᴇᴛᴀᴘ ᴘᴇʀʟᴜ ᴍᴇᴍʙᴇʟɪ ᴘʀᴇᴍɪᴜᴍ ᴍᴇʟᴀʟᴜɪ ᴏᴡɴᴇʀ ᴜɴᴛᴜᴋ ᴍᴇɴᴅᴀᴘᴀᴛᴋᴀɴ ᴀᴋꜱᴇꜱ ꜰɪᴛᴜʀ ɪɴɪ_'}` : "ᴋᴀᴍᴜ ꜱᴜᴅᴀʜ ᴄʟᴀɪᴍ ʙᴏɴᴜꜱ ɪɴɪ❗"}`

