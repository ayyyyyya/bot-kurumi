/*!-======[ Messages ]======-!*/
let { messages } = Data.infos;

/*!-======[ Module Imports ]======-!*/
const { readdirSync } = 'fs'.import();
const fs = 'fs'.import()
const path = 'path'.import();
let isLoad = false;
/*!-======[ Fubctions Imports ]======-!*/
const { ArchiveMemories } = await (fol[0] + 'usr.js').r();
const { bgcolor } = await (fol[0] + 'color.js').r();
const { GeminiImage } = await (fol[2] + 'gemini.js').r();

const timestamp = () => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Jakarta',
  }).format(new Date());
};

function getBarzz918() {
  return new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
}

function makeContextInfo() {
  return {
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
}

export default class EventEmitter {
  constructor({ Exp, store, cht, ai, is }) {
    this.Exp = Exp;
    this.store = store;
    this.cht = cht;
    this.ai = ai;
    this.is = is;
    this.eventFiles = [];
    this.dataEvents = Data.Events;
  }

  getMediaType() {
    let notmedia = ['conversation', 'extendedTextMessage'];
    return this.is.quoted && !notmedia.includes(this.is.quoted.type)
      ? { quoted: true, type: this.is.quoted.type }
      : this.is.reaction && !notmedia.includes(this.is.reaction.mtype)
        ? { quoted: false, type: this.is.reaction.mtype }
        : { quoted: false, type: this.cht.type };
  }

  on(eventMap, resolve) {
    try {
      if (typeof eventMap !== 'object' || Array.isArray(eventMap)) {
        throw new Error('Argumen pertama harus berupa objek');
      }
      const { cmd, energy, ...rest } = eventMap;
      if (!Array.isArray(cmd)) {
        throw new Error("'cmd' harus berupa array");
      }
      const stack = new Error().stack.split('\n');
      const callerLine = stack[2];
      const fileNameMatch = callerLine.match(/\((.*?):\d+:\d+\)/);
      let eventFile = path.basename(
        fileNameMatch ? fileNameMatch[1] : 'Unknown file'
      );
      cmd.forEach((event) => {
        Data.events[event] = { ...rest, resolve, energy, eventFile };
      });
    } catch (error) {
      console.error(
        `${bgcolor('[ERROR]', 'red')} ${timestamp()}\n- Error in 'on' method:\nDetails: ${error.stack}`
      );
    }
  }

  async loadEventHandler(file) {
    try {
      let on = Data.Events.get(file);
      if (!on) {
        const module = (await `${fol[7] + file}`.r()).default;
        on = module;
        Data.Events.set(file, on);
      }
      await on({ ...this, ev: this });
      return;
    } catch (error) {
      console.error(`[ERROR] load file: ${file}\n\nStack: ${error.stack}`);
      return;
    }
  }

  async loadEventHandlers() {
    if (isLoad) return;
    try {
      isLoad = true;
      if (this.eventFiles.length === 0) {
        this.eventFiles = readdirSync(fol[7]).filter((file) =>
          file.endsWith('.js')
        );
      }
      for (const file of this.eventFiles) {
        await this.loadEventHandler(file);
      }
    } catch (error) {
      console.error(`[ERROR] Loading Event Handlers:\n${error.stack}`);
    }
  }
  
  async contactOwner(text = "") {
    let cht = this.cht
    let { func } = this.Exp
    let name = await func.getName(owner[0] + from.sender)
    
    await this.Exp.relayMessage(cht.id, {
      contactMessage: {
        displayName: name,
        vcard: "BEGIN:VCARD\n" +
        "VERSION:3.0\n" +
        `N:${name};;\n` +
        `FN:${name}\n` +
        `ORG:${name}\n` +
        "TITLE:\n" +
        `item1.TEL;waid=${owner[0]}:${owner[0]}\n` +
        "item1.X-ABLabel:Ponsel\n" +
        `X-WA-BIZ-DESCRIPTION:${text || "My owner ꉂ(˵˃ ᗜ ˂˵)"}\n` +
        `X-WA-BIZ-NAME:${name}\n` +
         "END:VCARD"
      }
    }, { quoted: cht })
  }
  
  async sendPremiumMsg(trial = true, trialAvailable = true, opts) {
    let cht = opts?.cht || this.cht
    await cht.reply(`♥︎ Haii kak @${cht.sender.split("@")[0]},\nsbeelum itu ${botname} minta maaf karena fitur tersebut cuma bisa di akses oleh pengguna premium, mwhehehe\n\nKamu bisa menghubungi owner jika ingin membeli prmeium :)`, { mentions: [cht.sender] })
    await sleep(500)
    return this.contactOwner("⌗︎ Silahkan hubungi owner untuk membeli premium")
  }

  async reloadEventHandlers() {
    try {
      this.eventFiles = readdirSync(fol[7]).filter((file) =>
        file.endsWith('.js')
      );
      for (const file of this.eventFiles) {
        Data.Events.delete(file);
        await this.loadEventHandler(file);
      }
    } catch (error) {
      console.error(
        `${bgcolor('[ERROR]', 'red')} ${timestamp()}\n- Error reloading event handlers:\nDetails: ${error.stack}`
      );
    }
  }

  addQuestion(sender, cmd, accepts = []) {
    ArchiveMemories.setItem(sender, 'questionCmd', {
      emit: `${cmd}`,
      exp: Date.now() + 20000,
      accepts,
    });
  }
  async emit(event, opts) {
    try {
      !isLoad && (await this.loadEventHandlers());
      const eventFile = Data.events[event]?.eventFile;
      if (!eventFile) return;
      await this.loadEventHandler(eventFile);
      const ev = Data.events[event];
      if (!ev) return;
      let cht = opts?.cht || this.cht;
      let urls =
        cht.quoted?.url?.length > 0
          ? cht.quoted?.url
          : cht.url?.length > 0
            ? cht.url
            : this.is.quoted?.url?.length > 0
              ? this.is.quoted?.url
              : this.is.url?.length > 0
                ? this.is.url
                : [];

      let args = opts?.args || cht?.q;
      let sender = cht.sender;
      let user = sender.split('@')[0];
      let isPremium = Data.users[user]?.premium?.time
        ? Data.users[user]?.premium?.time >= Date.now()
        : false;
      let media = null;
      if (!isPremium && Data.users[user]?.premium?.time)
        Data.users[user].premium = { time: 0 };
      let trial = Data.users[user]?.claimPremTrial;
      let metadata = Data.preferences[cht?.id] || {};
      let notAllowPlayGame = Data.infos?.group?.nallowPlayGame;
      let notAllowNsfw = Data.infos?.group?.notAllowNsfw;
      let registerNeeded = Data.infos?.group?.registerNeeded;
      
    cfg.sewa_mode ??= {};
      let sewaMode = cfg.sewa_mode;
      let sewaOnly = sewaMode.only === true;
      let autoLeave = sewaMode.auto_leave === true;

      let allowCmd = Array.isArray(sewaMode.allow_cmd)
  ? sewaMode.allow_cmd.map(v => String(v).toLowerCase())
  : [];

      let freeGroups = Array.isArray(sewaMode.free_groups) ? sewaMode.free_groups : [];

      let cmdNow = String(cht.cmd || event || '').toLowerCase();
      let sewaActive = !!(metadata?.sewa?.expired && Date.now() < metadata.sewa.expired);

      if (
  this.is.group &&
  sewaOnly &&
  !this.is.owner &&
  !freeGroups.includes(cht.id) &&
  !sewaActive &&
  !allowCmd.includes(cmdNow)
) {
  await this.Exp.sendMessage(
    this.cht.id,
    {
      text: `Bot ini hanya aktif di grup yang sudah sewa.\nHubungi owner: wa.me/${owner[0]}`,
      contextInfo: {
        ...makeContextInfo(),
        mentionedJid: [cht.sender]
      }
    },
    { quoted: this.cht }
  );

       if (autoLeave) {
    await sleep(1500);
    await this.Exp.groupLeave(this.cht.id).catch(() => {});
  }
  return;
 }
      
      let { func } = this.Exp;
      let max = 3;
      let interval = 15000;
      let cd = func.archiveMemories.getItem(sender, 'cooldown') || { use: 0 };
      if (!cd.reset || Date.now() >= cd.reset) {
        cd.use = 0;
        cd.reset = Date.now() + interval;
        delete cd.notice;
      }
      cd.use++;
      func.archiveMemories.setItem(sender, 'cooldown', cd);
      if (cd.use >= max) {
        !cd.notice && await cht.reply(`♥︎ Haii kak @${sender.split("@")[0]},\nmohon tunggu ${func.formatDuration(cd.reset - Date.now()).seconds} detik lagi,\n\nKalau aku di spam aku capek juga tauu (⁠-⁠_⁠-⁠メ⁠)`, { mentions: [sender] })
        cd.notice = true;
        func.archiveMemories.setItem(sender, 'cooldown', cd);
        return;
      }

      const checks = [
        {
          condition: ev.isOwner && !this.is.owner,
          message:
            typeof ev.isOwner === 'boolean' ? messages.isOwner : ev.isOwner,
        },
        {
          condition: ev.isGroup && !this.is.group,
          message:
            typeof ev.isGroup === 'boolean' ? messages.isGroup : ev.isGroup,
        },
        {
          condition: ev.isAdmin && !(this.is.groupAdmins || this.is.owner),
          message:
            typeof ev.isAdmin === 'boolean' ? messages.isAdmin : ev.isAdmin,
        },
        {
          condition: ev.isBotAdmin && !this.is.botAdmin,
          message:
            typeof ev.isBotAdmin === 'boolean'
              ? messages.isBotAdmin
              : ev.isBotAdmin,
        },
        {
          condition: ev.isQuoted && !cht.quoted,
          message:
            typeof ev.isQuoted === 'boolean' ? messages.isQuoted : ev.isQuoted,
        },
        {
          condition: ev.tag == 'game' && !metadata.playgame && this.is.group,
          message: notAllowPlayGame,
        },
        {
          condition: ev.tag == 'nsfw' && !metadata.nsfw && this.is.group,
          message: notAllowNsfw,
        },
        {
          condition: ev.tag == 'rpg' && !['daftar', 'register'].includes(cht.cmd) && !Data.rpg[cht.sender.split("@")[0]] && this.is.group,
          message: registerNeeded,
        }
      ];

      for (const { condition, message } of checks) {
        if (condition) return this.Exp.sendMessage(
           this.cht.id, 
           {
             text: message,
             contextInfo: makeContextInfo()
           },
           {
             quoted: this.cht 
           }
        )
           
      }

      if (ev.tag == 'rpg' && !['daftar', 'register', 'penjara', 'jail', 'bail', 'tebus', 'faksi'].includes(cht.cmd)) {
        const u = Data.rpg[cht.sender.split("@")[0]]
        const jail = u?.faksi?.jail
        if (jail && jail * 1 > Date.now()) {
          const ms = jail * 1 - Date.now()
          const mins = Math.ceil(ms / 60000)
          const h = Math.floor(mins / 60)
          const m = mins % 60
          const t = h > 0 ? `${h} jam ${m} menit` : `${m} menit`
          return this.Exp.sendMessage(
            this.cht.id,
            {
              text: `Kamu lagi di penjara. Sisa: ${t}.\nCek: .penjara\nTebus: .bail`,
              contextInfo: makeContextInfo()
            },
            { quoted: this.cht }
          )
        }
      }
      if (cfg.premium_mode && ev.premium && !isPremium)
        return this.sendPremiumMsg(trial, 'trial' in ev ? ev.trial : true);
      if (cfg.premium_mode && ev.premium && ev.trial === false) {
        cfg.first.trialPrem.time = cfg.first.trialPrem.time || '1 hari';
        if (
          !isNaN(cht.memories.claimPremTrial) &&
          Date.now() - cht.memories.claimPremTrial <
            func.parseTimeString(cfg.first.trialPrem.time)
        )
          return this.Exp.sendMessage(
             this.cht.id,
             {
               text: messages.isNotAvailableOnTrial,
               contextInfo: makeContextInfo()
             },
             { 
               quoted: this.cht
             }
          )
      }

      if (ev.energy && !isNaN(ev.energy) && cht.memories.energy < ev.energy) {
        return this.Exp.sendMessage(
          this.cht.id, 
          {
            text: messages.isEnergy({
               uEnergy: cht.memories.energy,
               energy: ev.energy,
               charging: cht.memories.charging,
            }),
            contextInfo: makeContextInfo()
          },
          {
            quoted: this.cht
          }
        )
      }

      if (ev.args) {
        if (!cht.q) {
          this.addQuestion(sender, cht.cmd);
          return this.Exp.sendMessage(
            this.cht.id, 
            {
              text: ev.args !== true ? ev.args : ev.isArgs,
              contextInfo: makeContextInfo()
            },
            {
              quoted: this.cht
            }
          )
        }
        const badword = Data.badwords.filter((a) => cht.q.includes(a));
        this.is.badword = badword.length > 0;
        if (ev.badword && this.is.badword)
          return this.Exp.sendMessage(
            this.cht.id, 
            {
              text: func.tagReplacer(messages.isBadword, {
                 badword: badword.join(', '),
              }),
              contextInfo: makeContextInfo()
            },
            {
              quoted: this.cht
            }
          );
      }

      if (ev.isMention && cht.mention.length < 1)
        return this.Exp.sendMessage(
          this.cht.id, 
          {
            text: ev.isMention !== true ? ev.isMention : messages.isMention,
            contextInfo: makeContextInfo()
          },
          { 
            quoted: this.cht
          }
        );

      if (ev.urls) {
        if (!(urls?.length > 0)) {
          this.addQuestion(sender, cht.cmd);
          return this.Exp.sendMessage(
            this.cht.id,
            {
              text: ev.urls.msg !== true ? ev.urls.msg : messages.isUrl,
              contextInfo: makeContextInfo()
            },
            { 
              quoted: this.cht
            }
          )
        }
        if (ev.urls.formats) {
          let isFormatsUrl = urls.some((url) =>
            ev.urls.formats.some((keyword) =>
              url.toLowerCase().includes(keyword.toLowerCase())
            )
          );
          if (!isFormatsUrl) {
            this.addQuestion(sender, cht.cmd);
            return this.Exp.sendMessage(
              this.cht.id,
              {
                text: func.tagReplacer(messages.isFormatsUrl, {
                   formats: ev.urls.formats.join('\n- '),
                }),
                contextInfo: makeContextInfo()
              },
              {
                quoted: this.cht
              }
            );
          }
        }
      }

      if (ev.media) {
        const { type, msg, etc } = ev.media;
        let { type: mediaType, quoted: isQuotedMedia } = this.getMediaType();
        if (!type.includes(mediaType)) {
          this.addQuestion(sender, cht.cmd);
          return this.Exp.sendMessage(
            this.cht.id,
            {
              text: msg ||
              func.tagReplacer(messages.isMedia, {
                type: type.join('/'),
                caption: cht.msg,
              }),
              contextInfo: makeContextInfo()
            },
            {
              quoted: this.cht
            }
          );
        }

        if (mediaType === 'audio') {
          if (etc && this.is.quoted?.audio?.seconds > etc.seconds) {
            this.addQuestion(sender, cht.cmd);
            return this.Exp.sendMessage(
              this.cht.id, 
              {
                text: func.tagReplacer(
                  messages.isExceedsAudio, { second: etc.seconds }
                ),
                contextInfo: makeContextInfo()
              },
              {
                quoted: this.cht
              }
            );
          }
        }

        if (mediaType === 'video') {
          if (etc && this.is.quoted?.video?.seconds > etc.seconds) {
            this.addQuestion(sender, cht.cmd);
            return this.Exp.sendMessage(
              this.cht.id,
              {
                text: func.tagReplacer(
                  messages.isExceedsVideo, { second: etc.seconds }
                ),
                contextInfo: makeContextInfo()
              },
              {
                quoted: this.cht
              }
            );
          }
        }

        if (mediaType === 'sticker') {
          if (etc && etc.isNoAnimated && this.is.quoted?.sticker?.isAnimated) {
            this.addQuestion(sender, cht.cmd);
            return this.Exp.sendMessage(
              this.cht.id,
              {
                text: etc.isNoAnimated !== true
                ? etc.isNoAnimated
                : messages.isNoAnimatedSticker,
                contextInfo: makeContextInfo()
              },
              {
                quoted: this.cht
              }
            );
          }
          if (etc && etc.isAnimated && !this.is.quoted?.sticker?.isAnimated) {
            this.addQuestion(sender, cht.cmd);
            return this.Exp.sendMessage(
              this.cht.id,
              {
                text: etc.isAnimated !== true
                ? etc.isAnimated
                : messages.isAnimatedSticker,
                contextInfo: makeContextInfo()
              },
              {
                quoted: this.cht
              }
            );
          }
          if (etc && etc.isAvatar && !this.is.quoted?.sticker?.isAvatar) {
            this.addQuestion(sender, cht.cmd);
            return this.Exp.sendMessage(
              this.cht.id,
              {
                text: etc.avatar !== true ? etc.avatar : messages.isAvatarSticker,
                contextInfo: makeContextInfo()
              },
              {
                quoted: this.cht
              }
            );
          }
        }

        let download = isQuotedMedia
          ? this.is.quoted.download
          : this.is?.reaction
            ? this.is.reaction.download
            : cht.download;
        let save = this.is.quoted
          ? this.is.quoted[mediaType]
          : this.is?.reaction
            ? this.is.reaction[mediaType]
            : cht[mediaType];
        media = ev.media.save
          ? await func.downloadSave(save, mediaType)
          : await download();

        /*
                  if(mediaType == "image"){
                    let prompt = `Kamu adalah AI yang berfungsi untuk mendeteksi apakah sebuah gambar mengandung sosok manusia berkulit gelap atau dengan postur berotot. Tugasmu adalah memberikan respons true jika gambar tersebut sesuai, dan false jika tidak. Jawaban harus berupa boolean (true atau false) tanpa penjelasan tambahan`
                    let ress = await GeminiImage(await func.minimizeImage(media), prompt)
                    console.log(ress)
                    if(ress.trim() == 'true') return cht.reply('Di larang mmebuat stiker dari gambar berisi orang berkulit hitam/jomok')
                  }
                */
      }

      if (ev.energy) {
        await ArchiveMemories.reduceEnergy(cht.sender, ev.energy);
        await cht.reply(`*${ev.energy} _ᴇɴᴇʀɢʏ ᴛᴇʀᴘᴀᴋᴀɪ⚡_*`);
        await sleep(100);
      }

      const resolves = { media, urls, args, cht };
      await ev.resolve(resolves);
      await func.addCmd();
      await func.addCMDForTop(event);
      return true;
    } catch (error) {
      console.error(
        `${bgcolor('[ERROR]', 'red')} ${timestamp()}\n- Error emitting "${event}"`,
        error.stack
      );
      return;
    }
  }
}
