/*!-======[ Module Imports ]======-!*/
const fs = "fs".import()
const axios = 'axios'.import()
const sharp = (await 'sharp'.import()).default
const exif = await (fol[0] + 'exif.js').r()
const { catbox } = await (fol[0] + 'catbox.js').r()

const { fakeNgl } = await (fol[2] + 'makerMach.js').r()
const { profileKece } = await (fol[2] + 'sharpAll.js').r()
/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
  const { sender, id, reply, edit } = cht
  const { func } = Exp

  ev.on(
    {
      cmd: ['cpp', 'cprofile', 'buatprofile'],
      listmenu: ['cprofile ℗'],
      tag: "maker",
      energy: 25,
      premium: true,
      args: `*❗ Berikan dua link image*\n\nContoh:\n> .${cht.cmd} <url foto panjang> <url foto 1:1> <overlay> <name>\n\n> .${cht.cmd} https://files.catbox.moe/a4cy6s.jpg https://files.catbox.moe/rh49zx.jpg ${botnickname}`
    }, 
    async ({ args }) => {
      try {
        const [
          url1, 
          url2, 
          restName,
          overlay
        ] = args.split(' ').map(v => v.trim());

        if (!url1 || !url2) {
          return reply(
            `❌ Format salah!\n\n${cht.cmd} <url1> <url2> <name>`
          );
        }

        let ovrly = 'dark';
        if (overlay && ['ice', 'dark'].includes(overlay.toLowerCase())) {
          ovrly = overlay.toLowerCase();
        }

        const hasil = await profileKece(url1, url2, restName, ovrly);

        await Exp.sendMessage(
          id, 
          {
            image: hasil,
            caption: `✅ Berhasil membuat profile anda`
          }, { quoted: cht }
        );

      } catch (e) {
        return reply(
          "Gagal membuat profile kece kamu\n\n*Error*:\n" + e
        );
      }
    }
  );

  ev.on(
    {
      cmd: ['emoj2sticker', 'emoj2stik'],
      listmenu: ['emoj2stik'],
      tag: "maker",
      energy: 15,
      args: "*❗ Berikan emojinya*"
    },
    async () => {
      let input = cht.q.slice(0, 2)
      
      try {
        let api = await func.getBuffer(
          "https://api-ditss.vercel.app/tools/emoji?emoji=" + input
        )
        
		let res = await exif["writeExifImg"](
		  api, 
		  {
            packname: "★ CREAT BY ★\n" +
            "• Alya •\n\n" +
            "6283846359386\n" +
            "Online 24 jam\n" +
            "keculai kalau perbaikan\n\n", 
      	    author: '© Alya AI'
	  	  }
	  	)
		
        await Exp.sendMessage(
          id,
          {
            sticker: {
              url: res
            }
          }, { quoted: cht }
        )
      } catch (e) {
        return reply(
          "Gagal membuat stiker emoj ip\n\n*Error*:\n" + e
        )
      }
    }
  )
  
  ev.on(
    {
      cmd: ['fakengl', 'ngl'],
      listmenu: ['fakengl'],
      tag: "maker",
      energy: 15,
      args: "*❗ Masukkan teks nya*"
    }, 
    async ({args}) => {
    
      await Exp.sendMessage(
        id,
        { 
          react: {
             text: "⏱️",
             key: cht.key
          }
        }
      );
  
      if (args.length > 50) return reply(`Maksimun 50 kata aja yah`)
  
      try {
        const hsl = await fakeNgl(args)
        return await Exp.sendMessage(
          id,
          {
            image: hsl,
            caption: "✅ Berhasil membuat fake ngl"
          }, { quoted: cht }
        )
    
      } catch (e) {
        console.error(e)
        return reply(
          `Gagal mebuat fake ngl\n\n*Error*:\n` + e
        )
      }
    }
  )

  ev.on(
    {
      cmd: ['fakexnxx'],
      listmenu: ['fakexnxx'],
      tag: "maker",
      energy: 25,
      args: `*❗ Masukkan teks seperti:\n.${cht.cmd}* Barzz|hy sayang|1k`
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
      );
        
      if (!args.includes('|')) {
        return reply(
          `❌ Format salah\n> Contoh: \`.${cht.cmd} Barzz|hy sayang|1k\``
        );
      }

      const [name, quote, likes] = args.split('|');
      if (!name || !quote || !likes) {
        return reply(
          `❌ Format tidak lengkap\n> Format: \`nama|quote|likes\`\nContoh: \`.${cht.cmd} Barzz|hy sayang|10k\``
        );
      }

      try {
        await Exp.sendMessage(
          id,
          {
            image: {
              url: `https://api.siputzx.my.id/api/m/fake-xnxx?name=${encodeURIComponent(name)}&quote=${encodeURIComponent(quote)}&likes=${encodeURIComponent(likes)}`
            }
          }, { quoted: cht }
        );
        
      } catch (e) {
        console.error(e)
        return reply(
          `Gagal mebuat fake xnxx\n\n• *Error*:\n${e.message}\n\n> segera lapor ke owner`
        )
      }
    }
  )
 
  ev.on(
    {
      cmd: ['phlogo', 'pornohublogo'],
      listmenu: ['phlogo'],
      tag: "maker",
      enrgy: 55,
      args: "*❗ Berikan teksnya*\n\nContoh:\n> `.phlogo Barr|hub`"
    }, 
    async ({ args }) => {
    
      if (!args || !args.includes('|')) return reply(
        'Contoh penggunaan: .ph teks1|teks2'
      );

      let [text1, text2] = args.split('|').map(a => a.trim());
      if (!text1 || !text2) return reply(
        'Kedua teks tidak boleh kosong!\nContoh: .ph Barr|hub'
      );
      
      await Exp.sendMessage(
        id, 
        {
          react: { 
            text: "⏱️",
            key: cht.key 
          }
        }
      );
      
      const apiUrl = `https://apikey.sazxofficial.web.id/api/imagecreator/pornhub?text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}`;
      
      try {
        const res = await fetch(apiUrl);
        const json = await res.json();
        
        await Exp.sendMessage(
          id, 
          {
            image: { 
              url: json.result 
            },
            caption: `✅ Berhasil membuat porn hub logo`,
          }, { quoted: cht }
        );

      } catch (err) {
        return reply(
          'Terjadi kesalahan saat memproses permintaan.'
        );
      }
    }
  )

  ev.on(
    {
      cmd: ['sdmtinggi', 'ppsdmtinggi'],
      listmenu: ['sdmtinggi'],
      tag: "maker",
      energy: 25,
      media: { 
        type: [
          'image'
        ]
      }
    }, 
    async ({ media }) => {
    
      await Exp.sendMessage(
        id, 
        {
          react: { 
            text: "⏱️", 
            key: cht.key 
          }
        }
      );
      
      let ah = await catbox(media);

      try { 
        const hasil = `https://api.botcahx.eu.org/api/maker/jadisdmtinggi?url=${encodeURIComponent(ah)}&apikey=${cfg.bar}`;

        await Exp.sendMessage(
          id,
          {
            image: {
               url: hasil
            }, 
            caption: "Selamat anda telah menjadi orang dengan SDM tinggi 😳🥶🥶🥶🤓" 
          }, { quoted: cht }
        );
        
      } catch (e) {
        console.error(e);
        return reply(
          "Gagal membuat pp sdm tinggi\n\n*Error*:\n" + e
        );
      }
    }
  )

  ev.on(
    {
      cmd: ['sitolol'],      
       listmenu: ['sitolol'],
       tag: "maker",
       energy: 25,
       args: "*❗ Ketik namanya*"
    }, 
    async ({ args }) => {
    
      await Exp.sendMessage(
        id, 
        {
          react: {
            text: "⏱️", 
            key: cht.key 
          },
          caption: "✅ Berhasil membuat sertifikat tolol"
        }
      );
      
      try {
        await Exp.sendMessage(
          id, 
          {
            image: {
               url: `https://api.siputzx.my.id/api/m/sertifikat-tolol?text=${query}`
            }
          }, { qukted: cht }
        );
        
      } catch (e) {
        return reply(
          "Gagal membuat sertifikat tolol\n\n*Error*:\n" + e
        )
      }
    }
  )

  ev.on(
    {
      cmd: ['tulis', 'nulis', 'catet'],
      listmenu: ['tulis'],
      tag: "maker",
      energy: 15
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
      );
        
      try {
        await Exp.sendMessage(
          id, 
          {
            image: { 
              url: `https://abella.icu/nulis?text=${encodeURIComponent(q)}`
            },
            caption: "✅ Berhasil membuat catatan"
          }, { quoted: cht }
        );
      
      } catch (e) {
        return reply(
          "Gagal membuat catatannya\n\n*Error*:\n" + e
        );
      }
    }
  )

  ev.on(
    {
      cmd: ['triggered0'],
      listmenu: ['triggered0'],
      tag: "maker",
      energy: 15,
      media: { 
        type: [
          'image'
        ] 
      }
    },
    async ({ media }) => {
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
        const mediaUrl = await catbox(media)
        const inputImg = await axios.get(
          mediaUrl, 
          {
             responseType: 'arraybuffer' 
          }
        )
    
        const overlayUrl = 'https://files.catbox.moe/kbrmw7.png'
        const overlayImg = await axios.get(
          overlayUrl, 
          { 
            responseType: 'arraybuffer' 
          }
        )

        const resizedOverlay = await sharp(overlayImg.data)
          .resize(1080, 1080, {
            fit: 'contain',
            withoutEnlargement: true
          })
        .toBuffer()

        const resultBuffer = await sharp(inputImg.data)
          .resize(1080, 1080)
          .composite([{ input: resizedOverlay, gravity: 'center' }])
          .png()
          .toBuffer()

        await Exp.sendMessage(
          id, 
          { 
            image: resultBuffer,
            caption: '✅ Berhasil membuat triggered image'
          }, { quoted: cht }
        );

      } catch (e) {
        console.error(e)
        return reply(
          'Gagal membuat triggered\n\n*Error*:\n' + e
        )
      }
    }
  )

  ev.on(
    {
      cmd: [
        'triggered1', 
        'triggered2'
      ],
      listmenu: ['triggered1', 'triggered2'],
      tag: "maker",
      energy: 25,
      media: {
        type: [
          'image', 
          'sticker'
        ]
      }
    },
    async ({ media }) => {
    
      await Exp.sendMessage(
        id,
        { 
          react: {
            text: "⏱️", 
            key: cht.key
          } 
        }
      );
        
      const url = await catbox(media);
  
      if (cht.cmd === "triggered2") {
        try {
          const buff = await func.getBuffer(`${api.xterm.url}/api/maker/triggered-video?url=${url}&key=${api.xterm.key}`);

          const res = await exif.writeExifVid(
            buff, 
            {
              packname: `★ CREAT BY ★\n• Alya •\n\n6283846359386\nOnline 24 jam\nkeculai kalau perbaikan`,
              author: '© Alya AI'
            }
          )

          await Exp.sendMessage(
            id,
            {
              sticker: {
                 url: res
              },
            }, { quoted: cht }
          );

        } catch (e) {
          console.error(e);
          return reply("Gagal membuat triggered gerak\n\n*Error*:\n" + e);
        }
        
      } else {
        try {
          const buff = await func.getBuffer(
            `${api.xterm.url}/api/maker/triggered-image?url=${url}&key=${api.xterm.key}`
          );

          const res = await exif.writeExifVid(
            buff,
            {
              packname: `\n★ CREAT BY ★\n• Alya •\n\n6283846359386\nOnline 24 jam\nkeculai kalau perbaikan`,
              author: '© Alya AI'
            }
          );

          await Exp.sendMessage(
            id,
            {
              sticker: {
                 url: res 
              },
            }, { quoted: cht }
          );

        } catch (e) {
           console.error(e);
          return reply(
            "Gagal membuat triggered image\n\n*Error*:\n" + e
          );
        }  
      }
    }
  );
}
