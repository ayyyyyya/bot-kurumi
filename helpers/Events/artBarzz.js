const fs = "fs".import()
const { TermaiCdn } = await (fol[0] + 'cdn.termai.js').r()
const { imageEdit } = await (fol[2] + 'imageEdit.js').r();

export default async function on({ cht, Exp, store, ev, is }) {
  const { id, sender, reply, edit } = cht
  const { func } = Exp

  ev.on(
    {
      cmd: ['ijopink','pinkijo'],
      listmenu: ['pinkijo'],
      tag: 'art',
      energy: 25,
      media: { 
        type: [ 
          "image", "sticker"
        ]
      }
    },
    async ({ media }) => {
      try {
        let darkColor = [0, 100, 0];
        let lightColor = [255, 105, 180]; 
        let { data, info } = await sharp(media)
          .grayscale()
          .raw()
          .toBuffer({ resolveWithObject: true })

        let out = Buffer.alloc(data.length * 3)

        for (let i = 0; i < data.length; i++) {
          let t = data[i] / 255
          out[i * 3 + 0] = darkColor[0] * (1 - t) + lightColor[0] * t
          out[i * 3 + 1] = darkColor[1] * (1 - t) + lightColor[1] * t
          out[i * 3 + 2] = darkColor[2] * (1 - t) + lightColor[2] * t
        }

        let output = await sharp(out, {
          raw: {
            width: info.width,
            height: info.height,
            channels: 3,
          },
        })
        .jpeg({ quality: 90 })
        .toBuffer()

        Exp.sendMessage(
          id,
          {
            image: output,
            caption: "✅ Berhasil mengubah warna gambar menajdi pink ijo"
          }, { quoted: cht }
        )

      } catch (e) {
        return reply(
          "Gagal mebgubah warna gambar\n\n*Error*:\n" + e
        )
      }
    }
  )
  
  ev.on(
    {
      cmd: ['tocomic', 'jadikomik'],
      listmenu: ['tocomic'],
      tag: 'art',
      energy: 25,
      media: { 
        type: [
          'image'
        ]
      }
    },
    async ({ media }) => {
      let tmp = await TermaiCdn(media)
      let apih = `https://api.botcahx.eu.org/api/maker/jadicomicbook?url=${encodeURIComponent(tmp)}&apikey=${cfg.bar}`
  
      try {
        await Exp.sendMessage(
          id, 
          {
            image: {
               url: apih
            }, 
            caption: "✅ Berhasil menjadi komik..." 
          }, 
          { quoted: cht }
        )
      } catch (e) {
        return reply(
          "Gagal menjadi komik\n\n*Error*:\n" + e
        )
      }
    }
  )

  ev.on(
    {
      cmd: ['tofigur', 'jadifigur'],
      listmenu: ['tofigur ℗'],
      tag: "art",
      energy: 55,
      premium: true,
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
      )
      
      try {       
        let promp = "use the model 1/7 scale in the ilustration, in a realistic style and environment. place the figure on a computer desk, use in circular transparent acrylic base without any text. on the computer screen, display the 3D modeling process off the figure. next to the computer screen place a tamiya-style toy packaging box printed with the original artwork"
        let res = await imageEdit(await func.minimizeImage(media), promp)
        
        Exp.sendMessage(
          id,
          {
            image: res,
            caption: "✅ Berhasil membuat figur"
          }, { quoted: cht }
        )
      
      } catch (e) {
        return reply(
          "Gagal menjadi figur\n\n*Error*:\n" + e
        )
      }
    }
  )
  
  ev.on(
    {
      cmd: ['toghibli2', 'jadighibli2'],
      listmenu: ['toghibli2'],
      tag: "art",
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
      )
      
      let tmp = await TermaiCdn(media)
      let apih = `https://api.botcahx.eu.org/api/maker/jadighibili?url=${encodeURIComponent(tmp)}&apikey=${cfg.bar}`
  
      try { 
        await Exp.sendMessage(
          id, 
          {
            image: { 
              url: apih 
            }, 
            caption: "✅ Berhasil menjadi ghibli..." 
          },
          { quoted: cht }
        )
      } catch (e) {
        return reply(
          "Gagal menajdi ghibli \n\n*Error*:\n" + e
        )
      }  
    }
  )
  
  ev.on(
    {
      cmd: ['hijabkan', 'tohijab', 'pakaihijab'],
      listmenu: ['tohijab'],
      tag: "art",
      energy: 55,
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
      )
      
      let tmp = await TermaiCdn(media)
      
      try {
        const api = `https://api.botcahx.eu.org/api/maker/jadihijab?url=${encodeURIComponent(tmp)}&apikey=${cfg.bar}`
        
        await Exp.sendMessage(
          id,
          {
            image: {
              url: api
            },
            caption: "✅ Berhasil menggunakan hijab"
          }, { quoted: cht }
        )
        
      } catch (e) {
        return reply(
          "Gagal menggunkan hijab\n\n*Error*:\n" + e
        )
      }
    }
  )

  ev.on(
    {
      cmd: ['topixar', 'jadipixar'],
      listmenu: ['topixar'],
      tag: "art",
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
      )
      
      let tmp = await TermaiCdn(media)
      let yuri = `https://api.botcahx.eu.org/api/maker/jadipixar?url=${encodeURIComponent(tmp)}&apikey=${cfg.bar}`
  
      try {
        await Exp.sendMessage(
          id, 
          {
            image: { 
              url: yuri 
            },
            caption: "✅ Berhasil jadi pixar..." 
          }, 
          { quoted: cht }
        )
      } catch (e) {
        return reply(
          "Gagal menjadi pixar\n\n*Error*:\n" + e
        )
      }
    }
  )

  ev.on(
    {
      cmd: ['topixel', 'jadipixel'],
      listmenu: ['topixel'],
      tag: "art",
      energy: 25,
      media: {
        type: [
          'image'
        ]
      }
    }, 
    async ({media}) => {
    
      await Exp.sendMessage(
        id,
        {
          react: {
            text: "⏱️",
            key: cht.key
          }
        }
      )
      
      let tmp = await TermaiCdn(media)
      let apih = `https://api.botcahx.eu.org/api/maker/jadipixelart?url=${encodeURIComponent(tmp)}&apikey=${cfg.bar}`
  
      try {
        await Exp.sendMessage(
          id, 
          { 
            image: {
              url: apih 
            }, 
            caption: "✅ Berhasil menjadi pixel..." 
          }, 
          { quoted: cht }
        )
      } catch (e) {
        return reply(
          "Gagal menajdi pixel\n\n*Error*:\n" + e
        )
      }
    }
  )

  ev.on(
    {
      cmd: ['tozombie2', 'jadizombie2'],
      listmenu: ['tozombie2'],
      tag: "art",
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
      ) 
      
      let tmp = await TermaiCdn(media)
      let apih = `https://api.botcahx.eu.org/api/maker/jadizombie?url=${encodeURIComponent(tmp)}&apikey=${cfg.bar}`
  
      try {
        let resleting = await fetch(apih)
        let jj = await resleting.json()
    
        await Exp.sendMessage(
          id, 
          {
            image: { 
              url: jj.result 
            }, 
            caption: "🧟‍♀️ Anda telah menjadi zombie..."
          }, 
          { quoted: cht }
        )
      } catch (e) {
        return reply( 
          "Gagal menajdi zonbie\n\n*Error*:\n" + e
        )
      }
    }
  )

  let edits = Object.fromEntries(
    [
      ...['hitamkan', 'irengkan', 'irengin'].map(k => [k, 'change the skin color to black']),
      ...['putihkan', 'putihin'].map(k => [k, 'change the skin color to white']),
      ...['merahkan', 'merahin'].map(k => [k, 'change the skin color to red']),
      ...['orenkan', 'orenin', 'orany', 'oranyekan'].map(k => [k, 'change the skin color to orange']),
      ...['kuningkan', 'kuningin'].map(k => [k, 'change the skin color to yellow']),
      ...['hijaukan', 'hijauin'].map(k => [k, 'change the skin color to green']),
      ...['birukan', 'boruin', 'jadibiru'].map(k => [k, 'change the skin color to blue']),
      ...['ungukan', 'unguin'].map(k => [k, 'change the skin color to purple']),
      ...['gelapkan', 'gelapin'].map(k => [k, 'change the skin color to darker tone']),    
      ...['ironman'].map(k => [k, 'edit the image into Iron Man suit, helmet open showing the original face, keep the face highly accurate and similar to the input photo, cinematic lighting, detailed metallic armor, glowing arc reactor on the chest, realistic Marvel movie style']),
      ...['chibi'].map(k => [k, 'convert the image into cute chibi anime style, small body proportions, oversized head, large sparkling eyes, colorful soft shading, kawaii expression, pastel color palette, clean line art']),
      ...['ghibli'].map(k => [k, 'convert the image into Studio Ghibli style animation, soft hand-drawn colors, warm lighting, dreamy atmosphere, high detail background painting, expressive character design']),
      ...['tofigur', 'jadifigur'].map(k => [k, 'illustration of a 1/7 scale figure, highly detailed and realistic style, placed on a computer desk. the figure is mounted on a circular transparent acrylic base (no text or logos). on the computer screen, show the 3D modeling process of the same figure. next to the monitor, place a Tamiya-style toy packaging box with the original artwork printed on it. scene should look natural, clean, and photorealistic.']),
      ...['salju', 'winter'].map(k => [k, 'change the background into snowy winter forest, cold lighting, character wearing warm clothes, snowflakes in the air']),
      ...['pantai', 'beach'].map(k => [k, 'change the background into tropical beach, bright sunlight, blue ocean, palm trees, summer vibe']),
      ...['lego'].map(k => [k, 'convert the character into LEGO style, blocky body parts, colorful plastic texture, playful composition']),
      ...['mecha'].map(k => [k, 'transform the character into giant mecha pilot, armored cockpit, anime mecha style, dynamic perspective']),
      ...['angel', 'malaikat'].map(k => [k, 'transform the character into angelic style, glowing wings, divine aura, bright heavenly background']),

    ]
  )

  ev.on(
    {
      cmd: Object.keys(edits),
      listmenu: Object.keys(edits),
      tag: 'art',
    },
    () => {
      cht.q = edits[cht.cmd];
      ev.emit('edit', { cht })
    }
  )
}