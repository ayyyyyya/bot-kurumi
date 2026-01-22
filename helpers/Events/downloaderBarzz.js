/*!-======[ Module Imports ]======-!*/
const axios = "axios".import()
const fs = "fs".import()

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
  let infos = Data.infos
  let { func } = Exp
  let { archiveMemories:memories } = func
  let { edit, sender, id, reply, react } = cht
    
  const bar = cfg.bar; 
    
  ev.on(
    {
      cmd: ['capcutdl','capcutdownload'],
      listmenu: ['capcutdl'],
      tag: 'downloader',
      urls: {
        formats: [
          "capcut"
        ],
        msg: true
      },
      energy: 25
    },
    async ({ urls }) => {
    
      await Exp.sendMessage(
        id, 
        {
          react: { 
            text: "⏱️", 
            key: cht.key
          } 
        }
      );
      
      try {
      
        const res = await fetch(
          `https://api.botcahx.eu.org/api/dowloader/capcut?url=${encodeURIComponent(urls[0])}&apikey=${bar}`
        )
        const json = await res.json()
        
        const { 
          id, 
          title, 
          author, 
          owner, 
          video, 
          thumbnail 
        } = json.result

        let teks = `乂  *C A P C U T  D L*\n\n`;
        teks += `• *Id* ′: *${id}*\n`;
        teks += `• *Author* ′: *${author || 'Tidak diketahui'}*\n`;
        teks += `• *Owner* ′: *${owner || 'Tidak diketahui'}*\n`;
        teks += `• *Hastag* ′:\n`;
        teks += `- ${title || 'No Hastag'}\n\n`;
        teks += `_Video segera dikirim..._`

        await Exp.sendMessage(
          id,
          {
            image: {
              url: thumbnail 
            },
            caption: teks 
          }, { quoted: Data.fquoted.fbisnis }
        );

        await Exp.sendMessage(
          id, 
          {
            video: {
              url: video 
            },
            caption: '✅ Nih video nya berhasil terkirim' 
          }, { quoted: cht }
        );
    
      } catch (e) {
        return reply(
          "Gagal mengunduh video capcut\n\n*Error*:\n" + e
        )
     }
    }
  )

  ev.on(
    {
      cmd: ['douyindl', 'dydl', 'douyindownload'],
      listmenu: ['douyindl'],
      tag: "downloader",
      energy: 25,
      urls: { 
        formats: [
          'douyin'
        ],
        msg: true
      }
    },
    async ({ urls }) => {
      
      await Exp.sendMessage(
        id,
        { 
          react: {
            text: "⏱️", 
            key: cht.key
          }
        }
      );
      
      try {
        const api = await fetch(
          `https://api.botcahx.eu.org/api/dowloader/douyin?url=${encodeURIComponent(urls[0])}&apikey=${bar}`
        );
        const res = await api.json();
        
        let teks = `乂  *D O U Y I N  D L*\n\n`;
        teks += `• *Caption* ′: ${res.result.title}\n`;
        teks += `• *Status* ′; sukses\n\n`;
        teks += `_Video dan audio segera di kirim..._`;
        
        await Exp.sendMessage(
          id,
          {
            text: teks,
            contextInfo: {
              externalAdReply: {
                title: "Haii kak " + cht.pushName,
                body: "Douyin Downl",
                thumbnail: fs.readFileSync(fol[3] + 'bell.jpg'),
                mediaUrl: cfg.gcurl,
                sourceUrl: `https://wa.me/${owner[0]}`,
                renderLargerThumbnail: true,
                showAdAttribution: true,
                mediaType: 1,
              },
              forwardingScore: 19,
              isForwarded: true,
            }
          }, { quoted: Data.fquoted.fbisnis }
        );
        
        await Exp.sendMessage(
          id,
          {
            video: {
              url: res.result.video[0]
            },
            caption: "✅ Video douyin berhasil terkirim"
          }, { quoted: cht }
        );
        
        await Exp.sendMessage(
          id,
          {
            audio: {
              url: res.result.audio[0]
            },
            mimetype: 'audio/mpeg'
          }, { quoted: cht }
        )
          
      } catch (e) {
        return reply(
          "Gagal mengunduh video dan audio douyin\n\n*Error*:\n" + e
        );
      }
    }
  )

  ev.on(
    {
      cmd: ['instagramdl2', 'igdl2', 'instagramdownload2'],
      listmenu: ['instagramdl2'],
      tag: "downloader",
      energy: 25,
      urls: {
        formats: [
          'instagram'
        ],
        msg: true
      }
    }, 
    async ({ urls }) => {
    
      await Exp.sendMessage(
        id, 
        {
          react: {
            text: "⏱️",
            key: cht.key 
          }
        }
      );
      
      try {
        const api = await fetch(
          `https://api.botcahx.eu.org/api/dowloader/igdowloader?url=${urls[0]}&apikey=${bar}`
        );
        const res = await api.json();
        
        const {
          wm,
          thumbnail,
          url
        } = res.result[0];
        
        let teks = `乂  *I N S T A G R A M  D L*\n\n`;
        teks += `• *Wm* ′: ${wm}\n`;
        teks += `• *Satatus* ′: sukses\n\n`;
        teks += `_Video segera di kirim..._`;
        
        await Exp.sendMessage(
          id,
          {
            text: teks,
            contextInfo: {
              externalAdReply: {
                title: "Haii kak " + cht.pushName,
                body: "Instagram Download",
                thumbnail: fs.readFileSync(fol[3] + 'bell.jpg'),
                mediaUrl: cfg.gcurl,
                sourceUrl: `https://wa.me/${owner[0]}`,
                renderLargerThumbnail: true,
                showAdAttribution: true,
                mediaType: 1,
              },
              forwardingScore: 19,
              isForwarded: true,
            }
          }, { quoted: Data.fquoted.fbisnis }
        );
        
        await Exp.sendMessage(
          id,
          {
            video: {
              url
            },
            caption: "✅ Video instagram berhasil terkirim..."
          }, { quoted: cht }
        )
        
      } catch (e) {
        return reply(
          "Gagal mengunduh video instagram\n\n*Error*:\n" + e
        );
      }
    }
  )
  
  ev.on(
    {
      cmd: ['facebookdl2', 'facebookdownload2', 'fbdl2'],
      listmenu: ['facebookdl2'],
      tag: "downloader",
      energy: 25,
      urls: {
        formats: [
          'facebook'
        ],
        msg: true
      }
    }, 
    async ({ urls }) => {
    
      await Exp.sendMessage(
        id,
        { 
          react: {
            text: "⏱️",
            key: cht.key 
          }
        }
      );
      
      try {
        const api = await fetch(
          `https://api.botcahx.eu.org/api/dowloader/fbdown3?url=${encodeURIComponent(urls[0])}&apikey=${bar}`
        );
        const res = await api.json();
        
        const {
          urls: rs
        } = res.result.url;
        
        let teks = `乂  *F A C E B O O K  D L*\n\n`;
        teks += `• *Tautan* ′: ${urls[0]}\n`;
        teks += `• *Resolusi* ′: HD`;
        
        await Exp.sendMessage(
          id,
          {
            video: {
              url: rs[0].hd
            },
            caption: teks
          }, { quoted: cht}
        );
        
      } catch (e) {
        return reply(
          "Gagal mengunduh video facebook\n\n*Error*:\n" + e 
        );
      }
    }
  )
  
  ev.on(
    {
      cmd: ['gdrive', 'gdrivedl', 'gdownload'],
      listmenu: ['gdrivedl'],
      tag: "downloader",
      energy: 25,
      urls: { 
        formats: [
          'drive.google'
        ], 
        msg: true 
      }
    }, 
    async ({ urls }) => {
    
      await Exp.sendMessage(
        id,
        { 
          react: { 
            text: "⏱️",
            key: cht.key
          }
        }
      );
  
      try {
      
        const res = await fetch(
          `https://api.botcahx.eu.org/api/download/gdrive?url=${encodeURIComponent(urls[0])}&apikey=${bar}`
        );
        const json = await res.json();

        const { 
          data: dl_link, 
          fileName, 
          fileSize,
          mimetype
        } = json.result;

        let teks = `乂  *G D R I V E  D L*\n\n`;
        teks += `• Nama File ′: *${fileName}*\n`;
        teks += `• Ukuran ′: *${fileSize}*\n\n`;
        teks += `_✅ Sukses terkirim..._`;

        await Exp.sendMessage(
          id, 
          {
            document: { 
              url: dl_link 
            },
            fileName,
            mimetype,
            caption: teks
          }, { quoted: cht }
        );

      } catch (e) {
        return reply( 
          "Gagal mengunduh file gdrive\n\n*Error*:\n" + e
        );
      }
    }
  )
  
  ev.on(
    {
      cmd: ['snackviddl', 'snackvideodl', 'snaviddl'],
      listmenu: ['snackviddl'],
      tag: "downloader",
      energy: 25,
      urls: {
        formats: [
          'snackvideo'
        ]
      }
    },
    async ({ urls }) => {
    
      await Exp.sendMessage(
        id,
        { 
          react: {
            text: "⏱️", 
            key: cht.key 
          }
        }
      );
      
      try {
        const api = await fetch(
          `https://api.botcahx.eu.org/api/download/snackvideo?url=${encodeURIComponent(urls[0])}&apikey=${bar}`
        );
        const res = await api.json();
        
        const {
          title,
          thumbnail,
          media,
          author,
          authorImage,
          share,
          comment,
          like
        } = res.result;
        
        let teks = `乂  *S N A C K V I D E O  D L*\n\n`;
        teks += `• *Author* ′: ${author}\n`;
        teks += `• *Like* ′: ${like}\n`;
        teks += `• *komen* ′: ${comment}\n`;
        teks += `• *Berbagi* ′:  ${share}\n\n`;
        teks += `_Video segera di kirim..._`;
        
        await Exp.sendMessage(
          id,
          {
            text: teks,
            contextInfo: {
              externalAdReply: {
                title: "Haii kak" + cht.pushName,
                body: 'Snackvideo Download',
                thumbnail: fs.readFileSync(fol[3] + 'bell.jpg'),
                mediaUrl: cfg.gcurl,
                sourceUrl: `https://wa.me/${owner[0]}`,
                renderLargerThumbnail: true,
                showAdAttribution: true,
                mediaType: 1,
              },
              forwardingScore: 19,
              isForwarded: true,
            }
          }, { quoted: Data.fquoted.fbisnis }
        );
        
        await Exp.sendMessage(
          id,
          {
            video: {
              url: media
            },
            caption: "✅ Video snack vid berhasil terkirim..."
          }, { quoted: cht }
        );
        
      } catch (e) {
        return reply(
          "Gagal mengunduh video snack vid\n\n*Error*:\n" + e
        );
      }
    }
  )

  ev.on(
    {
      cmd: ['song', 'lagu', 'musik'],
      listmenu: ['song'],
      tag: "downloader",
      args: "*❗ Berikan judul lagunya*",
      energy: 25
    },
    async ({ args }) => {
      try {
        let searchRes = await fetch(
          `https://api.siputzx.my.id/api/s/soundcloud?query=${encodeURIComponent(args)}`
        ).then(res => res.json())
      
        let data = searchRes.data || []
        if (!Array.isArray(data) || data.length === 0) {
          return reply("❌ Data lagu tersebut kosong...")
        }
      
        let yo = data[Math.floor(Math.random() * data.length)]
        let url = yo.permalink_url  

        try {
          let dlRes = await fetch(
            `https://api.siputzx.my.id/api/d/soundcloud?url=${encodeURIComponent(url)}`
          ).then(ros => ros.json())
        
          let dt = dlRes.data 
        
          if (!dt || !dt.url) {
            return reply("❌ Url lagu tersebut kosong...")
          }
          
          /*
          let text = `乂 *S O U N D  C L O U D*\n\n` +
          `• *Author* : ${dt.user}\n` +
          `• *Judul* : ${dt.title}\n` +
          `• *Durasi* : ${Math.floor(dt.duration/1000)} detik\n` +
          `• *Deskripsi* : ${dt.description || "-"}\n\n` +
          `_Audio akan segera dikirim..._`
        
          await Exp.sendMessage(
            id,
            { 
              text,
              contextInfo: {
                externalAdReply: {
                  title: dt.title,
                  body: 'Sound Cloud 🎧',
                  thumbnailUrl: dt.thumbnail,
                  sourceUrl: url,
                  mediaUrl: `http://wa.me/${owner[0]}`,
                  renderLargerThumbnail: true,
                  showAdAttribution: true,
                  mediaType: 1,
                }
              }
            }, { quoted: Data.fquoted.fbisnis }
          )
          */
          
          await Exp.sendMessage(
            id,
            {
              audio: {
                url: dt.url
              },
              mimetype: "audio/mpeg",
              contextInfo: {
                externalAdReply: {
                  title: dt.title,
                  body: 'Sound Cloud 🎧',
                  thumbnailUrl: dt.thumbnail,
                  sourceUrl: url,
                  mediaUrl: `http://wa.me/${owner[0]}`,
                  renderLargerThumbnail: true,
                  showAdAttribution: true,
                  mediaType: 1,
                }
              }
            }, { quoted: cht }
          )
      
        } catch (e) {
          return reply("Gagal mendapatkan data lagu tersebut\n\n*Error*:\n" + e)
        }
      
      } catch (e) {
        return reply("Gagal mengirim lagu tersebut\n\n*Error*:\n" + e)
      }
    }
  )
  
  ev.on(
    {
      cmd: ['spotify', 'spo'],
      listmenu: ['spotify'],
      tag: "downloader",
      energy: 20,
      args: "❗ Berikan url/judul lagu"
    },
    async ({ args, urls }) => {
      let _key = keys[sender]
      let q = urls?.[0] || args || null
      if (!q) return await edit("❗ Berikan url/judul lagu", _key)
      
      try {
        if (/open\.spotify\.com/.test(q)) {
          await edit('```Searching...```', _key)
          
          let res = await fetch(`https://api.botcahx.eu.org/api/download/spotify?url=${encodeURIComponent(q)}&apikey=${cfg.bar}`)  
          let jsn = await res.json()  
      
          let {  
            thumbnail,  
            title,  
            url: ur
          } = jsn.result.data  
          
          await edit('```Sending...```', _key)
          await sleep(2500)
          
          return Exp.sendMessage(
            id,   
            {  
              audio: { url: ur },  
              mimetype: "audio/mpeg",
              contextInfo: {  
                externalAdReply: {  
                  title: title,  
                  body: "🎧 Spotify Download",  
                  thumbnailUrl: thumbnail,  
                  mediaUrl: "",  
                  sourceUrl: "",  
                  renderLargerThumbnail: true,  
                  showAdAttribution: true,  
                  mediaType: 1,  
                }
              }  
            }, { quoted: cht }
          )
        }    
        
        await react('⏱️')
        let res = await fetch(`https://api.botcahx.eu.org/api/search/spotify?query=${encodeURIComponent(q)}&apikey=${cfg.bar}`)  
        let jsn = await res.json()  
        let data = jsn.result.data
      
        let rows = data.slice(0, 25).map((a, i) => ({
          title: `🎶 ${a.title}`,
          id: `.spotify ${a.url}`,
          description: `durasi ${a.duration} | popularitas ${a.popularity}`
        }))
      
        let sections = [
          { 
            title: '🎧 Spotify Searching',
            highlight_label: 'Teratas...',
            rows
          }
        ]
        
        await Exp.sendMessage(
          id,
          {
            image: fs.readFileSync(fol[3] + 'bell.jpg'),
            caption: `✅ Berikut hasil dari: *${q}*`,
            footer: 'Pilih lagu di bawah untuk download',
            buttons: [
              {
                buttonId: 'spotify_search',
                buttonText: { displayText: '[ LIST LAGU ]' },
                type: 4,
                nativeFlowInfo: {
                  name: 'single_select',
                  paramsJson: JSON.stringify({
                    title: 'DAFTAR LAGU SPOTIFY',
                    sections
                  })
                }
              }
            ],
            headerType: 6,
            viewOnce: true
          }, { quoted: Data.fquoted.fbisnis }
        )
      } catch (e) {
        return reply("Gagal mendapatkan data dari spotify\n\n*Error*:\n" + e)
      }
    }
  )
    
  ev.on(
    {
      cmd: ['pinterestdl2', 'pindl2', 'pindownload2'],
      listmenu: ['pindl2'],
      tag: "downloader",
      energy: 25,
      urls: {
        formats: [
          'pin'
        ],
        msg: true
      }
    },
    async ({ urls }) => {
    
      await Exp.sendMessage(
        id, 
        {
          react: {
            text: "⏱️", 
            key: cht.key 
          }
        }
      );
     
      let type = ''
        
      try {
        const api = await fetch(
          `https://api.botcahx.eu.org/api/download/pinterest?url=${encodeURIComponent(urls[0])}&apikey=${bar}`
        );
        
        const res = await api.json();
        
        const {
          media_type,
          poster,
          title
        } = res.result.data;
        
        if (media_type === "image") {
          type = "foto"
        } else if (media_type === "video/mp4") {
          type = "video"
        } else {
          type = media_type
        }
        
        let teks = `乂  *P I N T E R E S T  D L*\n\n`;
        teks += `• *Judul* ′: ${title || "-"}\n`;
        teks += `• *Tipe* ′: ${type}\n\n`;
        teks += `_${type} segera di kirim..._`
        
        await Exp.sendMessage(
          id,
          {
            text: teks,
            contextInfo: {
              externalAdReply: {
                title: "Haii kak " + cht.pushName,
                body: `Pinterest Download`,
                thumbnail: fs.readFileSync(fol[3] + 'bell.jpg'),
                mediaUrl: cfg.gcurl,
                sourceUrl: `https://wa.me/${owner[0]}`,
                renderLargerThumbnail: true,
                showAdAttribution: true,
                mediaType: 1,
              },
              forwardingScore: 19,
              isForwarded: true,
            }
          }, { quoted: Data.fquoted.fbisnis }
        );
        
        if (type === "foto") {
          Exp.sendMessage(
            id,
            {
              image: {
                url: res.result.data.image
              },
              caption: "✅ Foto pinterest berhssil terkirim..."
            }, { quoted: cht }
          )
        } else {
          Exp.sendMessage(
            id,
            { 
              video: {
                url: res.result.data.video
              },
              caption: "✅ Video pinterest berhasil terkirim..."
            }, { quoted: cht }
          )
        }
      
      } catch (e) {
        return reply(
          `Gagal mengunduh ${type} pinterest\n\n*Error*:\n` + e
        )
      }
    }
  )

  ev.on(
    {
      cmd: ['twitterdl', 'twitterdownload', 'twdl'],
      listmenu: ['twitterdl'],
      tag: "downloader",
      energy: 25,
      urls: {
        formats: [ 
          'twitter'
        ]
      }
    },
    async ({ urls }) => {
    
      await Exp.sendMessage(
        id, 
        {
          react: { 
            text: "⏱️",
            key: cht.key
          } 
        }
      );
      
      try {
        const api = await fetch(
          `https://api.botcahx.eu.org/api/dowloader/twitter?url=${encodeURIComponent(urls[0])}&apikey=${bar}`
        )
        const res = await api.json()
        
        const {
          title,
          url
        } = res.result;
        
        let teks = `乂  *T W I T T E R  D L*\n\n`;
        teks += `• *Judul* ′: ${title}\n`;
        teks += `• *Tautan* ′: ${urls[0]}\n`;
        teks += `• *Resolusi* ′: HD\n`;
        teks += `Video segera di kirim..._`;
        
        await Exp.sendMessage(
          id,
          {
            text: teks,
            contextInfo: {
              externalAdReply: {
                title: "Haii kak " + cht.pushName,
                body: `Twitter Download`,
                thumbnail: fs.readFileSync(fol[3] + 'bell.jpg'),
                mediaUrl: cfg.gcurl,
                sourceUrl: `https://wa.me/${owner[0]}`,
                renderLargerThumbnail: true,
                showAdAttribution: true,
                mediaType: 1,
              },
              forwardingScore: 19,
              isForwarded: true,
            }
          }, { quoted: Data.fquoted.fbisnis }
        );
        
        await Exp.sendMessage(
          id,
          {
            video: {
              url: url[0].hd
            },
            caption: "✅ Video twitter berhasil dikirim..."
          }, { quoted: cht }
        );
      
      } catch (e) {
        return reply(
          "Gagal mengunduh video twitter\n\n*Error*:\n" + e
        );
      }
    }
  )
 
  ev.on(
    {
      cmd: ['videydl', 'videydownload'],
      listmenu: ['videydl'],
      tag: "downloader",
      energy: 25,
      urls: { 
        formats: [
          'videy'
        ], 
        msg : true 
      }
    }, 
    async ({ urls }) => {
    
      await Exp.sendMessage(
        id, 
        { 
          react: { 
            text: "⏱️",
            key: cht.key
          } 
        }
      );
      
      try {
      
        const match = urls[0].match(/id=([^&]+)/);
        const cdnUrl = `https://cdn.videy.co/${match[1]}.mp4`;
       
        let teks = `乂  *V I D E Y  D L*\n\n`;
        teks += `• *Tautan* ′: ${urls[0]}\n`;
        teks += `• *Status* ′: Sukses terkirim`;
        
        await Exp.sendMessage(
          id,
          {
            video: {
              url: cdnUrl
            },
            caption: teks
          }, { quoted: cht }
        )
        
      } catch (e) {
        return reply(
          "Gagal mengunduh video videy\n\n*Error*:\n" + e
        );
      }
    }
  )
          

  ev.on(
    {
      cmd: ['idcnzscuzcun','cajiufhaiH'],
      listmenu: ['xnxxdl ℗'],
      tag: "downloader",
      energy: 25,
      premium: true,
      urls: {
        formats: [
          'xnxx'
        ],
        msg: true
      }
    }, 
    async ({ urls }) => {
    
      await Exp.sendMessage(
        id,
        { 
          react: {
            text: "⏱️", 
            key: cht.key 
          }
        }
      );

      try {
      
        const res = await fetch(
          `https://api.botcahx.eu.org/api/download/xnxxdl?url=${encodeURIComponent(urls[0])}&apikey=${bar}`
        );
        const json = await res.json();
        const result = json.result;
        
        let teks = `乂  *X N X X  D L*\n\n`
        teks += `- Bijaklah dalam memilih konten tontonan, pastikan anda telah cukup umur untuk menggunakan fitur ini`;

        await Exp.sendMessage(
          id, 
          {
            video: {
              url: result.url 
            },
            caption: teks
          }, { quoted: cht }
        );

      } catch (e) {
        return reply(
          "Gagal mengunduh video xnxx\n\n*Error*:\n" + e
        );
      }
    }
  );
}