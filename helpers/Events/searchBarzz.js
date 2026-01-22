const fs = "fs".import()
const axios = await 'axios'.import()

const { zerochan } = await (fol[11] + 'zerochan.js').r();

const { generateWAMessageFromContent } = "baileys".import()
const { danbooru } = await (fol[2] + 'danbooru.js').r();

export default async function on({ cht, Exp, store, ev, is }) {
  let { sender, id, reply } = cht
  let { func } = Exp 
  
  function getTime() {
    return new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
  }
  
  const contextInfo = {
     externalAdReply: {
       title: `❏ 𝓐𝓵𝔂𝓪 [ アリヤ ]`,
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
  
  ev.on(
    {
      cmd: ['chord', 'akor'],
      listmenu: ['chord'],
      tag: "search",
      args: "*❗ Masukkan judul atau lirik lagunya*",
      energy: 25
    },
    async ({ args }) => {
    
      await Exp.sendMessage(
        id,
        { 
          react: {
             text: "⏱️", 
             key: cht.key
          }
        }
      )
      
      const api = await fetch(
        `https://api.botcahx.eu.org/api/search/chord?song=${encodeURIComponent(args)}&apikey=${cfg.bar}`
      )
      const res = await api.json()
      
      if (!res.result) return reply(
        `Data chord *${args}* tidak di temukan`
      )
      
      const { 
        title,
        chord
      } = res.result
      
      try {
      
        await Exp.sendMessage(
          id,
          {
            text: chord,
            contextInfo
          }, { quoted: cht}
        )
        
      } catch (e) {
        return reply(
          `Gagal mengirim chord untuk lagu ${args}\n\n*Error*:\n` + e
        )
      }
    }
  )
  
  ev.on(
    {
      cmd: ['danbooru'],
      listmenu: ['danbooru ℗'],
      tag: "search",
      energy: 25,
      args: "*❓ Mah cari foto apa*",
      premium: true
    },
    async ({ args }) => {
    
      await Exp.sendMessage(
        id,
        {
          react: {
            text: "⏱️",
            key: cht.key 
          }
        }
      )
      
      try {
        let res = await danbooru(args)
        let caption = res.tags
        let url = res.full_file_url
        
        await Exp.sendMessage(
          id,
          {
            image: {
              url
            },
            caption,
            contextInfo
          },
          { quoted: cht }
        )
      } catch (e) {
        return reply(
          "Gagal mendapatkan data danbooru\n\n*Error*:\n" + e
        )
      }
    }
  )
  
  ev.on(
    {
      cmd: ['infocuaca', 'cuaca'],
      listmenu: ['infocuaca'],
      tag: "search",
      args: '*❗ Masukkan nama kota/daerah nya*\nContoh: .cuaca Jakarta'
    }, 
    async ({ args }) => {

      let lokasi = args.toLowerCase()
      if (!lokasi) {
        return reply(
          '❌ Masukkan nama lokasi!\nContoh: .cuaca Jakarta'
        )
      }

      let apiKey = '07a2b10512dc32968ed9a9e812ef625a';
      let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(lokasi)}&appid=${apiKey}&units=metric&lang=id`

      try {
        await reply("⛅ Mencari informasi cuaca...")

        let { data } = await axios.get(apiUrl)
        let cuaca = data.weather[0]

        let hasil = `☁️ *Perkiraan Cuaca - ${data.name}, ${data.sys.country}*\n\n` +
        `• Cuaca: ${cuaca.description}\n` +
        `• Suhu: ${data.main.temp}°C\n` +
        `• Kelembapan: ${data.main.humidity}%\n` +
        `• Angin: ${data.wind.speed} m/s\n` +
        `• Tekanan Udara: ${data.main.pressure} hPa\n` +
        `• Zona Waktu: GMT+${data.timezone / 3600}`

        await Exp.sendMessage(
          id, 
          {
            text: hasil,
            contextInfo 
          }, { quoted: cht }
        )

      } catch (e) {
        return reply(
          'Gagal mengambil data cuaca\n\n*Error*:\n' + e
        )
      }
    }
  )

  ev.on(
    {
      cmd: ['infogempa'],
      listmenu: ['infogempa'],
      tags: "search",
      energy: 25
    }, 
    async () => {

      reply("*Mencari informasi gempa...*");
      await sleep(2500);

      try {
        let response = await fetch(
          "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json"
        )
        let data = await response.json()
        
        if (!data || !data.Infogempa || !data.Infogempa.gempa) {
          return reply(
            "Gagal mendapatkan data gempa dari BMKG."
          )
        }
        
        let gempa = data.Infogempa.gempa
        
        let caption = `*📈 INFO GEMPA TERKINI*\n\n`
        caption += `*Tanggal:* ${gempa.Tanggal}\n`
        caption += `*Waktu:* ${gempa.Jam}\n`
        caption += `*Magnitudo:* ${gempa.Magnitude}\n`
        caption += `*Kedalaman:* ${gempa.Kedalaman}\n`
        caption += `*Lokasi:* ${gempa.Wilayah}\n`
        caption += `*Koordinat:* ${gempa.Lintang} ${gempa.Bujur}\n`
        caption += `*Potensi:* ${gempa.Potensi}\n`
        caption += `*Dirasakan:* ${gempa.Dirasakan}`
        
        if (gempa.Shakemap) {
            let shakemapUrl = `https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}`
            
            await Exp.sendMessage(
              id, 
              {
                image: {
                  url: shakemapUrl 
                },
                caption: caption,
                contextInfo 
              }, { quoted: cht }
            )
            
        } else {
           await Exp.sendMessage(
             id,
             {
               text: caption,
               contextInfo
             }, { quoted: cht }
           )
        }
        
      } catch (error) {
        return reply(
          "Gagal mendapatkan info gempa\n\n*Error*:\n" + e
        )
      }
    }
  )

  ev.on(
    {
      cmd: ['pin2', 'pinterest2', 'pinsh2', 'pinterestsearch2'],
      listmenu: ['pinterest2'],
      tag: "search",
      energy: 25,
      args: "*❓ Mau cari apa*"
    }, 
    async ({ args }) => {
      try {
        let api = `https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(args)}&type=image`
        
        let res = await fetch(api);
        let json = await res.json();

        if (!json?.data || json.data.length === 0) {
          return reply(
            "❌ Tidak ditemukan gambar yang cocok untuk pencarian tersebut."
          )
        }

        let random = json.data[Math.floor(Math.random() * json.data.length)];
        let imageURL = random.image_url;

        await Exp.sendMessage(
          id,
          {
            image: {
              url: imageURL 
            },
            caption: `✅ Berikut hasil dari *${args}*\n`,
            footer: `Klik tombol di bawah jika ingin lanjut mencari *${args}*`,
            buttons: [
              {
                buttonId: `.${cht.cmd} ${args}`, 
                buttonText: {
                  displayText: "lanjut bosku 🗿☕" 
                }
              }
            ],
            viewOnce: true,
            headerType: 6
          }, { quoted: cht }
        )
      } catch (e) {
        return reply(
          "Gagal mendapatkan gambar dari pin\n\n*Error*:\n" + e 
        )
      }
    }
  )

  ev.on(
    {
      cmd: ['ppcp', 'propilcouple'],
      listmenu: ['ppcp'],
      tag: 'search',
      energy: 25
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
      
      try {
        let res = await fetch(
          `https://api.botcahx.eu.org/api/randomgambar/couplepp?apikey=${cfg.bar}`
        )
        let data = await res.json()
        let { male, female } = data.result

        await Exp.sendMessage(
          id, 
          {
            image: { 
              url: male 
            },
            caption: 'Ini untuk pp cowok'
          },
          { quoted: cht }
        )
          
        await sleep(1000)
        
        await Exp.sendMessage(
          id, 
          {
            image: { url: female },
            caption: 'Dan ini untuk pp ceweknya...'
          }, { quoted: cht }
        )

      } catch (e) {
        return reply(
          "Gagal mendapatkan foto couple \n\n*Error*:\n" + e
        )
      }
    }
  )

  ev.on(
    {
      cmd: ['lirik2', 'lyrics2'],
      listmenu: ['lirik2'],
      tag: "search",
      energy: 25,
      args: "*❗ Berikan judul lagunya*"
    },
    async ({ args, }) => {
    
      await Exp.sendMessage(
        id, 
        { 
          react: {
            text: "⏱️",
            key: cht.key 
          }
        }
      )

      let url = `https://api.botcahx.eu.org/api/search/lirik?lirik=${encodeURIComponent(args)}&apikey=${cfg.bar}`

      try {
        let res = await fetch(url);
        let data = await res.json();

        if (!data.status || !data.result) {
          return reply(
            '❌ Lagu tidak ditemukan. Pastikan kata kunci benar dan API aktif.'
          )
        }

        let {
          title,
          artist,
          artistUrl,
          image,
          url: geniusUrl,
          lyrics
        } = data.result;
        
        let caption = "*${title}* — (${artist})\n\n" +
        `• *Profile artis* : ${artistUrl}\n\n` +
        "*Lirik*:\n" +
        `${lyrics}`

        await Exp.sendMessage(
          id, 
          {
            image: { 
              url: image
            },
            caption,
            contextInfo
          }, { quoted: cht }
        )
  
      } catch (err) {
        return reply(
          "Gagal mendapatkan data lagu\n\n*Error*:\n" + e
        )
      }
    }
  )
 
  ev.on(
    {
      cmd: ['xvideosh', 'xvideosearch'],
      listmenu: ['xvideosh ℗'],
      tag: "search",
      args: "*❗ Ketik judul nya*",
      energy: 55,
      premium: true
    }, 
    async ({ args }) => {
   
      await Exp.sendMessage(
        id,
        {
          react: {
            text: "⏱️", 
            key: cht.key 
          } 
        }
      )

      try {
        let res = await fetch(
          `https://api.botcahx.eu.org/api/search/xvideos?query=${encodeURIComponent(args)}&apikey=${cfg.bar}`
        )
        
        let data = await res.json();
        if (!data.result || !Array.isArray(data.result) || data.result.length === 0) {
          return reply(`❌ Tidak ditemukan hasil untuk: *${args}*`);
        }

        let list = data.result.slice(0, 5).map((v, i) => {
          return `${i + 1}. ${v.title}\n› Durasi: ${v.duration}\n› Link: ${v.url}`;
        }).join("\n\n");


        await Exp.sendMessage(
          id, 
          {
            text: `乂  *X V I D S E A R C H*\n\n${list}`,
              contextInfo: {
                externalAdReply: {
                  title: `Nihh kak ${cht.pushName}`,
                  body: `Xnxx Search`,
                  thumbnailUrl: 'https://files.catbox.moe/bh72ga.jpg',
                  mediaUrl: cfg.gcurl,
                  sourceUrl: `${data.result[0]?.url}`,
                  renderLargerThumbnail: true,
                  showAdAttribution: true,
                  mediaType: 1,
               },
              forwardingScore: 1999,
              isForwarded: true,
            }
          }, { quoted: cht}
        )


      } catch (e) {
        return reply(
          "Gagal mendapatkan data xvid\n\n*Error*:\n" + e
        )
      }
    }
  )

  ev.on(
    {
      cmd: ['xnxxsh', 'xnxxsearxh'],
      listmenu: ['xnxxsh ℗'],
      tag: 'search',
      args: "*❗ Ketik judul nya*",
      energy: 55,
      premium: true
    }, 
    async ({ args }) => {
    
      await Exp.sendMessage(
        id, 
        {
          react: {
            text: "⏱️", 
            key: cht.key 
          } 
        } 
      )

      try {
        let res = await fetch(
          `https://api.botcahx.eu.org/api/search/xnxx?query=${encodeURIComponent(args)}&apikey=${cfg.bar}`
        )
        
        let data = await res.json();

        if (!data.result || data.result.length === 0) {
          return reply(`❌ Tidak ditemukan hasil untuk: *${args}*`);
        }

        let listRows = data.result.slice(0, 10).map(
          (v, i) => (
            {
              title: `${i + 1}. ${v.title}`,
              id: `.xnxxdl ${v.link}`,
              description: `Durasi: ${v.duration} | Quality: ${v.quality} | Views: ${v.views}`
            }
          )
        )

        await Exp.sendMessage(
          id, 
          {
            image: {
              url: 'https://files.catbox.moe/bh72ga.jpg'
            },
            caption: `乂  *X N X X S E A R C H*\n\n- Bijaklah dalam memilih konten tontonan, pastikan anda telah cukup umur untuk menggunakan fitur ini`,
            footer: 'Pilih salah satu dari list di bawah',
            buttons: [
              {
                buttonId: 'xnxx_list_result',
                buttonText: {
                  displayText: 'Pilih Hasil Pencarian' 
                },
                type: 4,
                nativeFlowInfo: {
                  name: 'single_select',
                  paramsJson: JSON.stringify({
                    title: `Daftar Video`,
                    sections: [
                      {
                        title: 'Hasil Video',
                        highlight_label: 'Silahkan pilih salah satu',
                        rows: listRows
                      }
                    ]
                  })
                }
              }
            ],
            headerType: 1,
            viewOnce: true
          }, { quoted: cht }
        )

      } catch (e) {
        return reply(
          "Gagal mendapatkan data xnxx\n\n*Error*:\n" + e
        )
      }
    }
  )

  ev.on(
    {
      cmd: ['ytsearch','ytsh'],
      listmenu: ['ytsh'],
      tag: "search",
      energy: 25,
      args: "*❗ Berikan judul nya*"
    },
    async ({ args }) => {
    
      await Exp.sendMessage(
        id,  
        {
          react: {
            text: "⏱️",
            key: cht.key
          }
        }
      )

      try {
        let res = await fetch(
          `https://api.siputzx.my.id/api/s/youtube?query=${encodeURIComponent(args)}`
        )
        
        let json = await res.json()
        let {
          url,
          title,
          description,
          thumbnail,
          seconds,
          timestamp,
          ago,
          views,
          author: {
            name: nameAuthor, url: urlAuthor
          }
        } = json.data[0]
     
        let teks = `\n\`[ YOUTUBE SEARCH ]\`\n\`\`\`\n• Author    : ${nameAuthor}\n• Judul     : ${title}\n• Deskripsi :\n- ${description}\n\n• Durasi    : ${timestamp}\n• Penonton  : ${views}\n• Di buat   :\n- ${ago}\n\n• Link      :\n- ${url}\n\`\`\``.trim();

        await Exp.sendMessage(
          id,
          {
            text: teks,
            contextInfo: {
              externalAdReply: {
                title: `YouTube Search 🔎`,
                body: `© Elaina MD V1.0`,
                thumbnailUrl: `${thumbnail}`,
                mediaUrl: cfg.gcurl,
                sourceUrl: `${urlAuthor}`,
                renderLargerThumbnail: true,
                showAdAttribution: true,
                mediaType: 1,
              },
              forwardingScore: 1999,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: cfg.chId.newsletterJid,
                newsletterName: cfg.chId.newsletterName,
               //serverMessageId: 152
              }
            }
          },
          { quoted: cht }
        )
  
      } catch (e) {
        return reply(
          "Gagal mendapatkan data youtube \n\n*Error*:\n" + e
        )
      }
    }
  )
  
  ev.on(
    {
      cmd: ['zerochan'],
      listmenu: ['zerochan'],
      tag: "search",
      energy: 15,
      args: "*❗ Mau cari foto apa?*",
      badword: true
    },
    async ({ args }) => {
      
      await Exp.sendMessage(
        id,
        { 
          react: {
            text: "⏱️", 
            key: cht.key 
          } 
        }
      )
      
      try {
        let res = await zerochan(args)
        let hasil = res.result[Math.floor(Math.random() * res.result.length)]
        
        await Exp.sendMessage(
          id,
          {
            image: {
              url: hasil,
            },
            caption: "✅ Berikut hasil dari " + args
          },
          { quoted: cht }
        )
      } catch (e) {
       return reply("Gagal mendapatkan respon zerochan\n\n*Error*:\n" + e)
      }
    }
  )
}