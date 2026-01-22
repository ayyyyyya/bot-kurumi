/*!-======[ Module Imports ]======-!*/
const axios = 'axios'.import();

/*!-======[ Function Imports ]======-!*/
const { mediafireDl } = await (fol[0] + 'mediafire.js').r();
const { tiktok } = await (fol[11] + 'tiktok.js').r();

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
  let infos = Data.infos;
  let { func } = Exp;
  let { archiveMemories: memories } = func;
  let { sender, id, reply, edit } = cht;

function numFormatter(num) {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'jt';
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'rb';
  return num.toString();
}

  ev.on(
    {
      cmd: ['pinterestdl', 'pindl'],
      listmenu: ['pinterestdl'],
      tag: 'downloader',
      urls: {
        formats: ['pinterest', 'pin'],
        msg: true,
      },
      energy: 15,
    },
    async ({ urls }) => {
      await cht.reply('```Processing...```');
      let p = (
        await fetch(
          api.xterm.url +
            '/api/downloader/pinterest?url=' +
            urls[0] +
            '&key=' +
            api.xterm.key
        ).then((a) => a.json())
      ).data;
      let pin = Object.values(p.videos)[0].url;
      Exp.sendMessage(
        id,
        { video: { url: pin }, mimetype: 'video/mp4' },
        { quoted: cht }
      );
    }
  );

  ev.on(
    {
      cmd: ['mediafire', 'mediafiredl'],
      listmenu: ['mediafire'],
      tag: 'downloader',
      urls: {
        formats: ['mediafire'],
        msg: true,
      },
      energy: 75,
    },
    async ({ urls }) => {
      const _key = keys[sender];

      await cht.edit('```Processing...```', _key);
      try {
        let m = await mediafireDl(urls[0]);
        let { headers } = await axios.get(m.link);
        let type = headers['content-type'];
        await cht.edit('Sending...', _key);
        await Exp.sendMessage(
          id,
          { document: { url: m.link }, mimetype: type, fileName: m.title },
          { quoted: cht }
        );
      } catch (e) {
        await cht.edit('TypeErr: ' + e, _key);
      }
    }
  );

  ev.on(
    {
      cmd: ['tiktok', 'tt', 'tiktoksearch', 'tintokdownload', 'ttdl'],
      listmenu: ['tiktok'],
      tag: "downloader",
      energy: 15
    },
    async ({ args, urls }) => {

      let s = urls?.[0] || args || null
      if (!s) return reply("*❗ Berikan link tiktok atau judulnya*")
      const _key = keys[sender]
      
      try {
        if (s.startsWith('https://')) {
          await cht.edit(infos.messages.wait, _key)
          let data = (
            await fetch(
              api.xterm.url +
              '/api/downloader/tiktok?url=' +
                s +
                '&key=' +
              api.xterm.key
            ).then((a) => a.json())
          ).data
          
          await cht.edit(infos.messages.sending, _key)
      
          let {
            type,
            author,
            stats,
            createTime,
            title,
            thumbnail,
            media,
            audio
          } = data
        
          let text = "乂  *T I K T O K  D L*\n\n" +
          `𖤓 Author : ${author.nickname}\n` +
          `𖤓 Like : ${numFormatter(stats.diggCount)}\n` +
          `𖤓 Command : ${numFormatter(stats.commentCount)}\n` +
          `𖤓 Sher : ${numFormatter(stats.shareCount)}\n` +
          `𖤓 View : ${numFormatter(stats.playCount)}\n` +
          `𖤓 Repost : ${numFormatter(stats.collectCount)}\n` +
          `𖤓 Type : ${type}\n` +
          `𖤓 Uploaded : ${createTime}\n\n` +
          `𖤓 Caption : \n` +
          `${title}\n\n` +
          "_Video segera dikirim harap tunggu..._"
          
          await Exp.sendMessage(
            id,
            {
              text,
              contextInfo: {
                externalAdReply: {
                  title: `Nihh kak ` + cht.pushName,
                  body: `Tiktok @${author.uniqueId}`,
                  thumbnailUrl: thumbnail,
                  mediaUrl: cfg.linkGC,
                  sourceUrl: ``,
                  renderLargerThumbnail: true,
                  showAdAttribution: true,
                  mediaType: 1,
                },
                forwardingScore: 2,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                  newsletterJid: cfg.chId.newsletterJid,
                  newsletterName: cfg.chId.newsletterName
                }
              }
            },
           { quoted: cht }
          )
          
          if (type == 'image') {
            for (let image of data.media) {
              await Exp.sendMessage(
                id,
                { 
                  image: { url: image.url } 
                }, { quoted: cht }
              )
            }
          } else if (type == 'video') {
            let isHD = args.includes('hd');
            let chosenMedia = isHD && media[2] ? media[2] : media[1];
        
            await Exp.sendMessage(
              id,
              { 
                video: { url: chosenMedia.url }, 
                caption: isHD ? '✅ Berhasil terkirim (HD)' : '✅ Berhasil terkirim'
              },
              { quoted: cht }
            )
          }
          
          await Exp.sendMessage(
            id,
            { 
              audio: { url: audio.url }, 
              mimetype: 'audio/mpeg' 
            }, { quoted: cht }
          )
          
        } else {
          if (!Data.users[sender.split("@")[0]].premium?.time) {
            let name = await func.getName(owner[0] + from.sender)
            await sleep(1500)
            await edit("*❗ Khusus pengguna premium*", _key)
            return await Exp.relayMessage(id, {
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
                "X-WA-BIZ-DESCRIPTION:♥︎ Silahkan hubungi owner untuk membeli premium\n" +
                `X-WA-BIZ-NAME:${name}\n` +
                "END:VCARD"
              }
            }, { quoted: cht })
          }
          
          await cht.edit(infos.messages.wait, _key)
          
          let r = await tiktok(args)
          let {
            region,
            title,
            duration,
            play,
            music,
            share_count,
            download_count,
            comment_count,
            digg_count,
            play_count,
            author,
          } = r[Math.floor(Math.random() * r.length)]
          
          await cht.edit(infos.messages.sending, _key)
          
          let footer = "⌗ *INFORMASI VIDEO*\n" +
            "⤷ ۪۪┈────────────────────\n\n" +
            `▎ Author: ${author.nickname}\n` +
            `▎ Region: ${region}\n` +
            `▎ Durasi: ${duration} detik\n\n` +
            "⌗ *STATISTIK VIDEO*\n" +
            "⤷ ۪۪┈────────────────────\n" +
            `▎ Penonton: ${numFormatter(play_count)}\n` +
            `▎ Disukai: ${numFormatter(digg_count)}\n` +
            `▎ Komentar: ${numFormatter(comment_count)}\n` +
            `▎ Dibagikan: ${numFormatter(share_count)}\n` +
            `▎ Diunduh: ${numFormatter(download_count)}\n\n` +
            "⌗ *CAPTION VIDEO*\n" +
            "⤷ ۪۪┈────────────────────\n" +
            `▎ ${title}\n\n` +
            "⤷ ۪۪┈────────────────────\n" +
            "▎ jika ada keluh kesah mengenai bot " + botname + " silakan hubungi owner yahh.."
            
          await Exp.sendMessage(
            id,
            {
              video: { url: play },
              caption: `✅ Berikut hasil dari *${s}*`,
              footer,
              buttons: [
                {
                  buttonId: `.${cht.cmd} ${s}`, 
                  buttonText: {
                    displayText: "🎥 Lanjut mencari" 
                  }
                },
                {
                  buttonId: `.get ${music}`, 
                  buttonText: {
                    displayText: "🎵 Audio" 
                  }
                },
                {
                  buttonId: `.bar`, 
                  buttonText: {
                    displayText: "🍀 Hubungi owner" 
                  }
                }
              ],
              viewOnce: true,
              headerType: 6
            }, { quoted: cht }
          )
        }
      } catch (e) {
        return reply("Gagal mendapatkan video tiktok\n\n*Error*:\n" + e)
      }
    }
  )
  
  ev.on(
    {
      cmd: ['rednote', 'renotedl', 'xiaohongshu'],
      listmenu: ['rednote', 'xiaohongshu'],
      tag: 'downloader',
      urls: {
        formats: ['xhslink.com', 'xiaohongshu.com'],
        msg: true,
      },
      energy: 15,
    },
    async ({ urls }) => {
      const _key = keys[sender];
      await cht.edit(infos.messages.wait, _key);

      let res = await await fetch(
        api.xterm.url +
          '/api/downloader/rednote?url=' +
          urls[0] +
          '&key=' +
          api.xterm.key
      ).then((a) => a.json());
      if (!res.status) return cht.reply(res.msg);
      let data = res.data;
      let text = '*!-======[ Rednote ]======-!*\n';
      text += `\nTitle: ${data.title}`;
      text += `\nAccount: ${data.user.nickName}`;
      text += `\nLikes: ${data.interactInfo.likedCount}`;
      text += `\nComments: ${data.commentCountL1}`;
      text += `\nPostTime: ${func.dateFormatter(data.time, 'Asia/Jakarta')}`;
      const info = {
        text,
        contextInfo: {
          externalAdReply: {
            title: cht.pushName,
            body: 'Rednote Downloader',
            thumbnailUrl: data.images[0].url,
            sourceUrl: `${cfg.ig}`,
            mediaUrl:
              `http://ẉa.me/${owner[0]}/` +
              Math.floor(Math.random() * 100000000000000000),
            renderLargerThumbnail: true,
            mediaType: 1,
          },
          forwardingScore: 19,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterName: `${cfg.chid.newsletterName}`,
            newsletterJid: `${cfg.chid.newsletterJid}`,
          },
        },
      };
      await Exp.sendMessage(id, info, { quoted: cht });
      await cht.edit(infos.messages.sending, _key);
      let type = data.type;
      if (type == 'image') {
        for (let image of data.images) {
          await Exp.sendMessage(
            id,
            {
              image: { url: image.url },
             // caption: image.width + 'x' + image.height,
            },
            { quoted: cht }
          );
        }
      } else if (type == 'video') {
        await Exp.sendMessage(
          id,
          { video: { url: data.video.url } },
          { quoted: cht }
        );
      }
    }
  );

  ev.on(
    {
      cmd: ['ytmp3', 'ytm4a', 'play', 'ytmp4', 'playvn'],
      listmenu: ['ytmp3', 'ytm4a', 'play', 'ytmp4'],
      tag: 'downloader',
      badword: true,
      args: 'Harap sertakan url/judul videonya!',
      energy: 15,
    },
    async ({ args, urls }) => {
      const _key = keys[sender];
      let q = urls?.[0] || args || null;
      if (!q) return cht.reply('Harap sertakan url/judul videonya!');
      try {
        await cht.edit('Searching...', _key);
        let search = (
          await fetch(
            `${api.xterm.url}/api/search/youtube?query=${q}&key=${api.xterm.key}`
          ).then((a) => a.json())
        ).data;
        await cht.edit('Downloading...', _key);
        let item = search.items[0];
        let data = (
          await fetch(
            api.xterm.url +
              '/api/downloader/youtube?key=' +
              api.xterm.key +
              '&url=https://www.youtube.com/watch?v=' +
              item.id +
              '&type=' +
              (cht.cmd === 'ytmp4' ? 'mp4' : 'mp3')
          ).then((a) => a.json())
        ).data;

        let audio = {
          [cht.cmd === 'ytmp4'
            ? 'video'
            : cht.cmd === 'ytmp3'
              ? 'document'
              : 'audio']: { url: data.dlink },
          mimetype:
            cht.cmd === 'ytmp4'
              ? 'video/mp4'
              : cht.cmd === 'ytmp3'
                ? 'audio/mp3'
                : 'audio/mpeg',
          fileName: item.title + (cht.cmd === 'ytmp4' ? '.mp4' : '.mp3'),
          ptt: cht.cmd === 'playvn',
          contextInfo: {
            externalAdReply: {
              title: 'Title: ' + item.title,
              body: '© Alisa Mikhailovna Kujou',
              thumbnailUrl: item.thumbnail,
              sourceUrl: item.url,
              mediaUrl:
                `http://ẉa.me/${owner[0]}?text=Idmsg: ` +
                Math.floor(Math.random() * 100000000000000000),
              renderLargerThumbnail: true,
              showAdAttribution: true,
              mediaType: 1,
            },
          },
        };
        await cht.edit('Sending...', _key);
        await Exp.sendMessage(id, audio, { quoted: cht });
      } catch (e) {
        console.log(e);
        cht.reply("Can't download from that url!");
      }
    }
  );

  ev.on(
    {
      cmd: ['facebookdl', 'fb', 'fbdl', 'facebook'],
      listmenu: ['facebookdl'],
      tag: 'downloader',
      urls: {
        msg: true,
        formats: ['facebook', 'fb'],
      },
      energy: 15,
    },
    async ({ urls }) => {
      const _key = keys[sender];
      await cht.edit('```Processing...```', _key);
      let f = (
        await fetch(
          api.xterm.url +
            '/api/downloader/facebook?url=' +
            urls[0] +
            '&key=' +
            api.xterm.key
        ).then((a) => a.json())
      ).data;
      await cht.edit('Sending...', _key);
      Exp.sendMessage(
        id,
        { video: { url: f.urls.sd }, mimetype: 'video/mp4', caption: f.title },
        { quoted: cht }
      );
    }
  );

  ev.on(
    {
      cmd: ['instagramdl', 'ig', 'igdl', 'instagram'],
      listmenu: ['instagramdl'],
      tag: 'downloader',
      urls: {
        msg: true,
        formats: ['instagram'],
      },
      energy: 15,
    },
    async ({ urls }) => {
      const _key = keys[sender];
      await cht.edit('```Processing...```', _key);
      let f = (
        await fetch(
          api.xterm.url +
            '/api/downloader/instagram?url=' +
            urls[0] +
            '&key=' +
            api.xterm.key
        ).then((a) => a.json())
      ).data;
      let text = '*!-======[ Instagram ]======-!*\n';
      text += `\nTitle: ${f.title}`;
      text += `\nAccount: ${f.accountName}`;
      text += `\nLikes: ${f.likes}`;
      text += `\nComments: ${f.comments}`;
      text += `\nPostTime: ${f.postingTime}`;
      text += `\nPostUrl: ${f.postUrl}`;
      const info = {
        text,
        contextInfo: {
          externalAdReply: {
            title: cht.pushName,
            body: 'Instagram Downloader',
            thumbnailUrl: f.imageUrl,
            sourceUrl: `${cfg.ig}`,
            mediaUrl:
              `http://ẉa.me/${owner[0]}/` +
              Math.floor(Math.random() * 100000000000000000),
            renderLargerThumbnail: true,
            showAdAttribution: true,
            mediaType: 1,
          },
          forwardingScore: 19,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterName: `${cfg.chId.newsletterName}`,
            newsletterJid: `${cfg.chId.newsletterJid}`,
          },
        },
      };
      await Exp.sendMessage(id, info, { quoted: cht });
      let { content } = f;
      for (let i of content) {
        try {
          await Exp.sendMessage(
            id,
            { [i.type]: { url: i.url } },
            { quoted: cht }
          );
        } catch (e) {
          console.log(e);
        }
      }
    }
  );

  ev.on(
    {
      cmd: ['gitclone'],
      listmenu: ['gitclone'],
      tag: 'downloader',
      urls: {
        formats: ['github.com'],
        msg: true,
      },
      energy: 15,
    },
    async () => {
      const repo = cht.q.split('https://github.com/')[1]?.replace('.git', '');
      const repoName = repo?.split('/')[1];
      const { default_branch } = await fetch(
        `https://api.github.com/repos/${repo}`
      ).then((res) => res.json());
      const zipUrl = `https://github.com/${repo}/archive/refs/heads/${default_branch}.zip`;
      Exp.sendMessage(
        cht.id,
        {
          document: { url: zipUrl },
          mimetype: 'application/zip',
          fileName: `${repoName}.zip`,
        },
        { quoted: cht }
      ).catch((e) =>
        cht.reply(
          `[❗LINK ERROR ❗]\n\nExample : ${cht.prefix}${cht.cmd} https://github.com/adiwajshing/baileys.git`
        )
      );
    }
  );

  ev.on(
    {
      cmd: ['youtube', 'ytdl', 'youtubedl', 'youtubedownloader'],
      listmenu: ['youtube'],
      tag: 'downloader',
      badword: true,
      args: 'Harap sertakan url/judul videonya!',
    },
    async ({ args, urls }) => {
      let [url, _type] = args.split(' ');
      let type = _type?.toLowerCase();
      let auds = {
        mp3: 'ytmp3',
        m4a: 'ytm4a',
        audio: 'ytm4a',
        vn: 'playvn',
      };
      let videos = {
        mp4: 'ytmp4',
        video: 'ytmp4',
      };

      let audio = auds[type];
      let video = videos[type];
      console.log({ video, audio });
      if (!type) {
        memories.setItem(sender, 'questionCmd', {
          emit: `${cht.cmd} ${urls[0]}`,
          exp: Date.now() + 15000,
          accepts: [Object.keys(auds), Object.keys(videos)].flat(),
        });
        return cht.reply('audio/video?');
      }
      cht.cmd = audio || video;
      ev.emit(audio || video);
    }
  );
}
