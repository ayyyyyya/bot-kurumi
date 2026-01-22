const fs = "fs".import()
const axios = "axios".import()
const path = await 'path'.import();
const sharp = (await 'sharp'.import()).default

const { TermaiCdn } = await (fol[0] + 'cdn.termai.js').r();
const { tmpFiles } = await (fol[0] + 'tmpfiles.js').r();

let exif = await (fol[0] + 'exif.js').r();
let { convert } = exif;

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
  const { sender, id, reply, edit, react } = cht
  const { func } = Exp

  ev.on(
    {
      cmd: ['144p', 'buriq', 'burik'],
      listmenu: ['144p', 'buriq'],
      tag: 'tools',
      energy: 25,
      media: {
        type: [
          "image", "sticker"
        ] 
      },
    }, 
    async ({ media }) => {
      try {
        if (is.sticker || is.quoted?.sticker) {
          let url = await tmpFiles(media);
          let cv = await convert({
            url,
            from: 'webp',
            to: 'png',
          });
          media = await func.getBuffer(cv);
        }
        
        let output = await sharp(media)
          .resize({ height: 144 }) 
          .jpeg({ quality: 30 })
          .toBuffer();

        await Exp.sendMessage(
          id,
          {
            image: output,
            caption: "✅ Berhasil menurunkan resolusi gambar"
          }, { quoted: cht }
        )
      } catch (e) {
        return reply(
          "Gagal menurunkan resolusi \n\n*Error*:\n" + e
        )
      }
    }
  )
  
  ev.on(
    {
      cmd: ['base64ify', 'base64'],
      listmenu: ['base64ify'],
      tag: "tools",
      energy: 15,
      media: {
        type: [
          'image'
        ]
      }
    },
    async () => {
      try {
        let quoted = cht.quoted.imageMessage.jpegThumbnail
        let res= Buffer.from(quoted).toString('base64')
        
        let message = {
          image: fs.readFileSync(fol[10] + 'thumb1.jpg'),
          caption: "Berhasil mendapatkan data Base64✨",
          footer: "Klik tombol di bawah untuk menyalin dengan praktis",
          fromMe: false,
          interactiveButtons: [
            {
              name: 'cta_copy',
              buttonParamsJson: JSON.stringify(
                {
                  display_text: 'Salin Hasil',
                  copy_code: res
                }
              )
            }
          ]
        }
  
        return Exp.sendMessage(id, message, { quoted: Data.fquoted.fbisnis })
      
      } catch (e) {
        return reply(
          "Gagal mendapatkan data base64\n\n*Error*:\n" + e
        )
      }
    }
  )
  
  ev.on(
    {
      cmd: ['ceknomor'],
      listmenu: ['ceknomor'],
      tag: 'tools',
      energy: 15,
      isMention: "*❗ Ketik nomornya*"
    },
    async () => {
    
      try {
      
        await Exp.sendMessage(
          id, 
          { 
            react: {
               text: "⏱️",
               key: cht.key
            }
          }
        );
        
        const url = `https://htmlweb.ru/geo/api.php?json&telcod=${cht.mention[0].split("@")[0]}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!data || !data.country) return reply('❌ Gagal mendapatkan data. Nomor mungkin tidak valid.');

        const {
          english: countryName,
          location,
          iso,
          country_telcod: kodeNegara,
          capital
        } = data;

        const kota = capital?.english || '-';
        const zona = data.tz || '-';
        const flag = data.ImgFlag?.replace(/^<img src='|'>$/g, '') || '';

        let teks = `╭───『 *📞 CEK NOMOR* 』───⬣\n`;
        teks += `│ 🌍 *Negara:* ${countryName} (${iso})\n`;
        teks += `│ 🗺️ *Lokasi:* ${location}\n`;
        teks += `│ 🏛️ *Ibu Kota:* ${kota}\n`;
        teks += `│ 🕓 *Zona Waktu:* ${zona}\n`;
        teks += `│ 📶 *Kode Negara:* +${kodeNegara}\n`;
        teks += `╰────────────⬣`;

        if (flag) {
          await Exp.sendMessage(
            id,
            {
              image: {
                 url: flag 
              },
              caption: teks
            }, { quoted: cht }
          );
          
        } else {
          await reply(teks);
        }

      } catch (err) {
        console.error(err);
        return reply('Gagal mengecek nomor tersebut\n\n*Error*:\n' + err);
      }
    }
  )

  ev.on(
    {
      cmd: ['codesc', 'codesher'],
      listmenu: ['codecs'],
      tag: "tools",
      energy: 15,
      urls: { 
        fomrats: ['codeshare', 'codeshare.cloudku'],
        msg: true
      }
    }, 
    async ({ urls }) => {
    
      const url = urls[0].trim().replace(/\&raw\=true$/, '') + '&raw=true'
  
      try {
        const res = await fetch(url)
        const code = await res.text()
    
        const message = {
          image: { 
            url: 'https://files.catbox.moe/qyf06k.jpg' 
          }, 
          caption: `*Berikut hasil yang telah di salin:*\`\`\`\n${code}\n\`\`\`\n📎 Link: ${url}\n`,
          footer: "🌐 Codeshare Tools\nKlik tombol di bawah untuk salin semuanya",
          fromMe: false,
          interactiveButtons: [
            {
              name: 'cta_copy',
              buttonParamsJson: JSON.stringify({
                display_text: 'Salin code',
                copy_code: code
              })
            }
          ]
        };

        await Exp.sendMessage(
          id,
          message,
          { quoted: cht }
        );

      } catch (e) {
        console.log(e)
        return reply('Gagal mengambil data codeshare\n\n*Error*\n' +e)
      }
    }
  )

  ev.on(
    {
      cmd: ['get'],
      listmenu: ['get ℗'],
      tag: 'tools',
      premium: true,
      energy: 55,
      args: "*❗ Berikan url yang ingin di get datanya*"
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
        let response = await axios.get(cht.q, { responseType: 'arraybuffer' })
        let contentType = response.headers['content-type'] || ''
        let buffer = Buffer.from(response.data)

        if (
          contentType.startsWith('image/') ||
          contentType.startsWith('video/') ||
          contentType.startsWith('audio/')
        ) {
          let mediaType = contentType.startsWith('image/')
            ? 'image'
            : contentType.startsWith('video/')
            ? 'video'
            : 'audio'
            
          if (mediaType === 'audio') {
            return Exp.sendMessage(
              id,
              { audio: buffer, mimetype: "audio/mpeg" },
              { quoted: cht }
            )
          }

          return Exp.sendMessage(
            id,
            { [mediaType]: buffer },
            { quoted: cht }
          )
        }
        
        let textData = buffer.toString('utf-8')
        let rand = Math.random().toString(36).slice(2, 10)

        try {
          let jsonData = JSON.parse(textData)
          let prettyJson = JSON.stringify(jsonData, null, 2)

          return await Exp.sendMessage(
            id,
            {
              document: Buffer.from(prettyJson),
              mimetype: "text/html",
              fileName: `${botname}-${Date.now().toString(36)}-${rand}.html`
            },
            { quoted: cht }
          )
        } catch {
          return await Exp.sendMessage(
            id,
            {
              document: Buffer.from(textData),
              mimetype: "text/html",
              fileName: `${botname}-${Date.now().toString(36)}-${rand}.html`
            },
            { quoted: cht }
          )
        }
      } catch (e) {
        return reply("Gagal mengambil data dari url\n\n*Error*:\n" + e)
      }
    }
  )

  ev.on(
    {
      cmd: ['hd', 'remini'],
      listmenu: ['hd ℗'],
      tag: "tools",
      premium: true,
      energy: 55,
      media: {
        type: [
          'image'
        ]
      }
    }, 
    async ({ media }) => {
    
      try {
        await react('⏱️')

        const url = await TermaiCdn(media);
        const api1 = `https://api.botcahx.eu.org/api/tools/remini?url=${encodeURIComponent(url)}&apikey=${cfg.bar}`;
        const res1 = await fetch(api1);
        const json1 = await res1.json();

        let hdUrl;
        if (json1.status && json1.url) {
           hdUrl = json1.url;
        } else {
           const api2 = `https://api.botcahx.eu.org/api/tools/remini-v2?url=${encodeURIComponent(url)}&apikey=${cfg.bar}`;
           const res2 = await fetch(api2);
           const json2 = await res2.json();

           if (!json2.status || !json2.url) {
              return reply(
                "❌ Gagal memproses gambar HD."
              );
           }

           hdUrl = json2.url;
        }

        let { key } = await Exp.sendMessage(
          id,
          {
            image: {
               url: hdUrl 
            },
          caption: `🍟 Berhasil memperbaiki resolusi\n\nmumpung aku lagi baik fotonya bakal ku hapus setelah 3 menit`,
          contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: cfg.chId.newsletterJid,
              newsletterName: cfg.chId.newsletterName
            }
          }
        },{ quoted: cht });
        func.autoDelMsg(id, key, 180000)
        
      } catch (e) {
        console.error(e);
        return reply(
          "Gagal memperbaiki resolusi foto\n\n*Error*:\n" + e
        );
      }
    }
  );

  ev.on(
    {
      cmd: ['remini2', 'hd2'],
      listmenu: ['hd2 ℗'],
      tag: 'tools',
      energy: 55,
      premium: true,
      media: {
        type: [
          'image'
        ]
      }
    }, 
    async ({ media }) => {
    
      try {
        await react('⏱️')
        const ext = path.extname(cht.msg?.mimetype || 'jpg').slice(1) || 'jpg';
        const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
        const fileName = Math.random().toString(36).slice(2, 8) + '.' + ext;

        const { 
          data: uploadData 
        } = await axios.default.post("https://pxpic.com/getSignedUrl", 
          {
            folder: "uploads",
            fileName
          }, 
          {
            headers: { 
              "Content-Type": "application/json" 
            }
          }
        );

        await axios.default.put(
          uploadData.presignedUrl, media, {
            headers: {
               "Content-Type": mime 
            }
          }
        );

        const fileUrl = "https://files.fotoenhancer.com/uploads/" + fileName;

        const form = new URLSearchParams({
          imageUrl: fileUrl,
          targetFormat: 'png',
          needCompress: 'no',
          imageQuality: '100',
          compressLevel: '6',
          fileOriginalExtension: 'png',
          aiFunction: 'upscale',
          upscalingLevel: ''
        }).toString();

        const aiResponse = await axios.default.post(
          "https://pxpic.com/callAiFunction", 
          form, 
          {
            headers: {
              'User-Agent': 'Mozilla/5.0',
              'Accept': '*/*',
              'Content-Type': 'application/x-www-form-urlencoded',
              'accept-language': 'id-ID'
            }
          }
        );

        const resultImageUrl = aiResponse?.data?.resultImageUrl;
        if (!resultImageUrl) return reply(
          "❌ Gagal mendapatkan hasil dari AI"
        );

        const imageBuffer = await axios.default.get(
          resultImageUrl, {
             responseType: 'arraybuffer' 
          }
        ).then(res => res.data);

        let { key } = await Exp.sendMessage(id, {
          image: imageBuffer,
          caption: `🍟 Berhasil memperbaiki resolusi\n\nmumpung aku lagi baik fotonya bakal ku hapus setelah 3 menit`,
          contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: cfg.chId.newsletterJid,
              newsletterName: cfg.chId.newsletterName
            }
          }
        }, { quoted: cht });
        func.autoDelMsg(id, key, 180000)
        
      } catch (e) {
        console.error(e);
        return reply(
          "Gagal memperbaiki resolusi foto\n\n*Error*:\n" + e
        );
      }
    }
  )

  ev.on(
    {
      cmd: ['pastebin', 'pastebincopy'],
      listmenu: ['pastebin'],
      tag: "tools",
      energy: 25,
      urls: { 
        formats: [
          'pastebin'
        ],
        msg: true 
      }
    }, 
    async ({ urls }) => {
    
      const link = urls[0];
      const pasteId = link.split('/').pop();

      try {
        const response = await fetch(`https://pastebin.com/raw/${pasteId}`);
        if (!response.ok) throw new Error('Gagal mengambil isi dari Pastebin.');
    
        const content = await response.text();
        if (!content.trim()) {
          return reply('📄 Tidak ada isi yang ditemukan di Pastebin!');
        }

        reply(`📑 *Isi Pastebin:*\n\n${content}`);
        
      } catch (e) {
        console.error(e);
        return reply(
          "Gagal mengambil data pstebin\n\n*Erro*:\n" + e
        );
      }
    }
  )

  ev.on(
    {
      cmd: ['removebg', 'removebackground'],
      listmenu: ['removebg'],
      tag: "tools",
      energy: 55,
      media: { 
        type: [
           'image'
        ] 
      }
    }, 
    async ({ media }) => {
    
       await react('⏱️')
  
       const ppk = await TermaiCdn(media);
       const apih = `https://api.botcahx.eu.org/api/tools/removebg?url=${encodeURIComponent(ppk)}&apikey=${cfg.bar}`;
  
       try {
          const res = await fetch(apih);
          const jjs = await res.json();
     
          if (!jjs.url) return reply(
            `Api tidak merespon saat melakukan removebg`
          );
     
         let { key } = await Exp.sendMessage(
           id,
           { 
             image: { 
               url: jjs.url 
             }, 
             caption: "🍟 Berhasil menghwpus background\n\nmumpung aku lagi baik fotonya bakal ku hapus setelah 3 menit",
             contextInfo: {
               forwardingScore: 1,
               isForwarded: true,
               forwardedNewsletterMessageInfo: {
                 newsletterJid: cfg.chId.newsletterJid,
                 newsletterName: cfg.chId.newsletterName
               }
             }
           }, { quoted: cht }
         )
         func.autoDelMsg(id, key, 180000)
     
       } catch (e) {
         console.error(e);
         return reply(
           `Gagal menghapus background\n\n• *Error*:\n${e.message}\n\n> Segera lapor ke owner`
         );
      }
    }
  )

  ev.on(
    {
      cmd: ['removebg2', 'removebackground2'],
      listmenu: ['removebg2'],
      tag: "tools",
      energy: 55,
      media: {
        type: [
          'image'
        ]
      }
    },
    async ({ media }) => {
    
      await react('⏱️')
      const linkInput = await TermaiCdn(media)
      const hsl = await fetch(
        `https://api.ghostxdzz.web.id/api/imagecreator/removebg?url=${encodeURIComponent(linkInput)}`
      )
      const json = await hsl.json()

      if (!json.result) return cht.reply(
        "❌ API tidak memberikan respon terhadap permintaan kamu."
      );

      try {
        let { key } = await Exp.sendMessage(
           id, 
           {
             image: { url: json.result },
             caption: "🍟 Berhasil menghwpus background\n\nmumpung aku lagi baik fotonya bakal ku hapus setelah 3 menit",
             contextInfo: {
               forwardingScore: 1,
               isForwarded: true,
               forwardedNewsletterMessageInfo: {
                 newsletterJid: cfg.chId.newsletterJid,
                 newsletterName: cfg.chId.newsletterName
               }
             }
           }, { quoted: cht }
         )
         func.autoDelMsg(id, key, 180000)
        
      } catch (e) {
        console.error(e);
        reply("Gagal mengahpus latar belakang foto tersebut \n\n*Error*\n" + e);
      }
    }
  )
  
  ev.on(
    {
      cmd: ['resize', 'ubahukuran'],
      listmenu: ['resize'],
      tag: "tools",
      energy: 15,
      media: {
         type: [
           'image'
         ]
      },
      args: `ga gitu, contoh .${cht.cmd} 1920x1080`
    },
    async ({ media, args }) => {
  
      await Exp.sendMessage(
        id,
        { 
          react: { 
            text: "⏱️",
            key: cht.key
          } 
        }
      );
    
      const mediaUrl = await TermaiCdn(media)

      const [w, h] = args.split(/\D+/).map(v => parseInt(v));
      if (!w || !h || w < 1 || h < 1) {
        return reply("❌ Ukuran tidak valid.\nContoh: .resize 1920 1080");
      }

      try {
        const res = await axios.get(mediaUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(res.data);

        const resized = await sharp(buffer).resize(w, h).toBuffer()

        await Exp.sendMessage(
          id, 
          {
            image: resized,
            caption: `✅ Berhasil ubah ukuran menjadi *${w}x${h}*`
          }, { quoted: cht }
        );

      } catch (e) {
        console.error(e);
        return reply(`gagal mengubah ukuran foto tersebut\n\n*Error*:` + e);
      }
    }
  )

  ev.on(
    {
      cmd: ['spamngl', 'nglspam'],
      listmenu: ['spamngl ℗'],
      tag: "tools",
      energy: 55,
      premium: true,
      urls: {
        formats: [
          'ngl', 'ngl.link'
        ],
        msg: "Berukan url ngl nya contoh nya gini:\n .spamngl https://ngl.link/powerranggers1 10 Haii"
      }
    },
    async ({ urls, args }) => {
      let [link, jumlahStr, ...pesanArr] = args.split(' ')
      let jumlah = parseInt(jumlahStr)
      let pesan = pesanArr.join(' ').trim()

      if (!link || !jumlahStr || !pesan) {
          return reply(`Contoh: .${cht.cmd} https://ngl.link/username 3 pesan kamu`)
      }
    
      if (jumlah < 1 || jumlah > 20) return reply('Jumlah 1-20 saja!')

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
        const username = link.split('ngl.link/')[1]
        if (!username) return reply('Username tidak valid')

        for (let i = 0; i < jumlah; i++) {
            await fetch('https://ngl.link/api/submit', {
                method: 'POST',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                },
                body: `username=${username}&question=${encodeURIComponent(pesan)}&deviceId=1`
            })
            await sleep(1000)
        }

        reply(`✅ Berhasil kirim ${jumlah} pesan ke ${username}`)

      } catch (e) {
        return reply(
          "Gagal mengirim pesan ngl\n\n*Error*:\n" + e
        );
      }
    }
  )
  
  ev.on(
    {
      cmd: ['styletxt'],
      listmenu: ['styletxt'],
      tag: 'tools',
       energy: 10
    },
    async ({ args }) => {

      try {
        const api = `https://api.botcahx.eu.org/api/tools/styletext?text=${encodeURIComponent(args)}&apikey=${cfg.bar}`
        const res = await fetch(api)
        const json = await res.json()

        if (!json.status || !json.result) return reply('❌ Gagal mengambil data.')

        const styledTexts = json.result
          .filter(x => x.result) 
          .map((x, i) => `*${i + 1}.*\n- ${x.result}`)
          .join('\n\n')

        reply(`✅ *Hasil Style Text:*\n\n${styledTexts}`)

      } catch (err) {
         console.error(err)
         reply('Gagal mendapatkan gaya teks\n\n*Error*:\n' + e)
      }
    }
  )

  ev.on(
    {
      cmd: [
        'tojs',
        'tojson', 
        'tofile', 
        'tohtml'
      ],
      listmenu: [
        'tojs', 
        'tojson', 
        'tofile', 
        'tohtml'
      ],
      tag: "tools",
      energy: 55,
      args: "*❗ Harap berikan teks-nya*"
    },
    async () => {

      const teks = cht.q;
      const namaFile = `${botnickname}-${Date.now()}`;

      if (cht.cmd === "tojs") {
        const filePath = `./receptacle/${namaFile}.js`;
        fs.writeFileSync(filePath, teks);
      
        await Exp.sendMessage(
          id, 
          {
            document: fs.readFileSync(filePath),
            fileName: namaFile + '.js',
            mimetype: 'application/javascript',
            caption: "🍜 Berhasil, teks to dokumen js",
            mentions: [
              sender
            ]
          }, { quoted: Data.fquoted.fbisnis }
        );
      }

      else if (cht.cmd === "tojson") {
        let json;
        try {
          json = JSON.parse(teks);
        } catch (e) {
          return cht.reply('❗ Format JSON tidak valid.');
        }
        
        const filePath = `./receptacle/${namaFile}.json`;
        fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
        
        await Exp.sendMessage(
          id,
          {
            document: fs.readFileSync(filePath),
            fileName: namaFile + '.json',
            mimetype: 'application/json',
            caption: "🍜 Berhasil, teks to dokumen json",
            mentions: [
              sender
            ]
          }, { quoted: Data.fquoted.fbisnis }
        );
      }

      else if (cht.cmd === "tofile") {
        const filePath = `./receptacle/${namaFile}.txt`;
        fs.writeFileSync(filePath, teks);
        
        await Exp.sendMessage(
          id,
          {
            document: fs.readFileSync(filePath),
            fileName: namaFile + '.txt',
            mimetype: 'text/plain',
            caption: "🍜 Berhasil, teks to dokumen file",
            mentions: [
              sender
            ]
          }, { quoted: Data.fquoted.fbisnis }
        );
      }

      else if (cht.cmd === "tohtml") {
        const filePath = `./receptacle/${namaFile}.html`;
        const htmlContent = `//${namaFile}\n\n${teks}\n\n//${namaFile}`;
        fs.writeFileSync(filePath, htmlContent);
        
        await Exp.sendMessage(
          id,
          {
            document: fs.readFileSync(filePath),
            fileName: namaFile + '.html',
            mimetype: 'text/html',
            caption: "🍜 Berhasil, teks to dokumen html",
            mentions: [
              sender
            ]
          }, { quoted: Data.fquoted.fbisnis }
        );
      }
    }
  )

  ev.on(
    {
      cmd: [
        'toblur', 
        'tocircle', 
        'todarkness'
      ],
      listmenu: [
        'toblur', 
        'tocircle', 
        'todarkness'
      ],
      tag: "tools",
      energy: 25,
      media: {
        type: [
          'image'
        ]
      }
    }, 
    async ({media, args}) => {
    
      let tmp = await TermaiCdn(media)
      await Exp.sendMessage(
        id, 
        { 
          react: { 
            text: "⏱️", 
            key: cht.key 
          }
        }
      )

      if (cht.cmd === "toblur") {
        const blurApi = `https://api.siputzx.my.id/api/m/blur?image=${tmp}`
     
        try {
           await Exp.sendMessage(id, {
             image: { 
               url: blurApi
              },
             caption: "✅ Berhasil"
           }, { quoted: cht })

        } catch (e) {
           console.error(e)
           return reply(`Gagal mengubah grapik foto tersebut\n\n• *Error*:\n${e.message}\n\n> Segera lapor ke owner`)
        }  
      }
  
      if (cht.cmd === "tocircle") {
        const circleApi = `https://api.siputzx.my.id/api/m/circle?image=${tmp}`
    
        try {
          await Exp.sendMessage(id, {
            image: { url: circleApi },
            caption: "✅ Berhasil"
          }, { quoted: cht })

        } catch (e) {
          console.error(e)
          return reply(`Gagal mengubah grapik foto tersebut\n\n• *Error*:\n${e.message}\n\n> Segera lapor ke owner`)
        }
      }
     
      if (cht.cmd === "todarkness") {
        const angka = parseInt(args)
        if (!angka || angka > 255) {
          return cht.reply('Masukksn angka yang valid, dan maksimum angka 0-255')
        }
     
        const darknessApi = `https://api.siputzx.my.id/api/m/darkness?image=${tmp}&amount=${angka}`
       
        try {
          await Exp.sendMessage(cht.id, {
            image: { 
              url: darknessApi
            },
            caption: "✅ Berhasil"
          }, { quoted: cht })

        } catch (e) {
          console.error(e)
          return reply(`Gagal mengubah grapik foto tersebut\n\n• *Error*:\n${e.message}\n\n> Segera lapor ke owner`)
        }
      }
    }
  )

  ev.on(
    {
      cmd: ['wame'],
      listmenu: ['wame'],
      tag: "tools"
    },
    async () => {
    
      let teks = `乂  *W H A T S A P P  M E*\n\n`;
      teks += `*Nama*: ${func.getName(sender)}\n`;
      teks += `*Nomor*: https://wa.me/${sender.split("@")[0]}`;
    
      await reply(teks)
    }
  )
}