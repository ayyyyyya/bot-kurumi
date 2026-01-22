const axios = "axios".import()
const cheerio = "cheerio".import()
const fs = "fs".import()
const { zerochan } = await (fol[11] + 'zerochan.js').r();
const { generateWAMessageFromContent } = "baileys".import()

export default async function on({ cht, Exp, store, ev, is }) {
  let { sender, id, reply, edit } = cht
  let { func } = Exp 
  
/* coming soon
  let anime = [
    "animeawoo",
    "animemegumin",
    "animeshinobu",
    "animehandhold",
    "animehighfive",   
    "animecringe",
    "animedance",
    "animehappy",
    "animeglomp",
    "animesmug",
    "animeblush",
    "animewave",
    "animesmile",
    "animepoke",
    "animewink",
    "animebonk",
    "animebully",
    "animeyeet",
    "animebite",
    "animelick",
    "animekill",
    "animecry",
    "animewlp",
    "animekiss",
    "animehug"
  ]*/
  
  let waifu = [
    "elaina",
    "mahiru",
    "yaemiko",
    "priestess",
    "bocchi",
    "furina",
    "ibuki",
    "hoshino",
    "nazuma",
    "arisu",
    "makima",
    "nahida",
    "senkosan",
    "raidenei",
    "nami",
    "hancock",
    "kyokohori",
    "samekosaba",
    "gawrgura",
    "hikari",
    "arona",
    "toruhagakure",
    "himikotoga",
    "reze",
    "ellenjoe",
    "hutao",
    "tenkaizumo",
    "gremory",
    "yamadaanna"
  ]
  
  let cmds = waifu.map(v => `${v} ℗`)
 // let cmds2 = anime.map(v => `${v} ℗`)
  
  ev.on(
    {
      cmd: waifu,
      listmenu: cmds,
      tag: "anime",
      energy: 10,
      premium: true
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
      
        let hasil = await zerochan(cht.cmd)
        let res = hasil.result
        
        let shuffled = res.sort(() => 0.5 - Math.random())
        let picked = shuffled.slice(0, 5)
        
        let cards = []
        for (let i of picked) {
          let img = await Exp.func.uploadToServer(i) 
          cards.push(
            {
              header: {
                imageMessage: img,
                hasMediaAttachment: true,
              },
              body: { 
                text: `foto ke-${cards.length + 1}` 
              },
              footer: {
                text: "Dapatkan kesempatan untuk mengakses semua fitur yang tersedia dengan membeli *premium*, silahkan clik tombol dibawah untuk neli premium (๑˃̵ᴗ˂̵)ﻭ"
              },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                      display_text: "💎 Buy premium",
                      url: `https://wa.me/${owner[0]}?text=mau+beli+premium+bang😋😋`,
                      webview_presentation: null
                    })
                  }
                ]
              }
            }
          )
        }

        let msg = generateWAMessageFromContent(
          id,
          {
            viewOnceMessage: {
              message: {
                interactiveMessage: {
                  body: {
                    text: "✨Berikut foto random *" + cht.cmd + "*"
                  },
                  footer: {
                    text: "Hasil ada dibawah..."
                  },
                  carouselMessage: {
                    cards,
                    messageVersion: 1,
                  },
                },
              },
            },
          },
          { quoted: cht }
        )

        await Exp.relayMessage(
          msg.key.remoteJid, 
          msg.message, {
            messageId: msg.key.id,
          }
        )
      } catch (e) {
        return reply("Gagal mendapatkan foto random waifu\n\n*Error*:\n" + e)
      }
    }
  )
}
/*
case 'animeawoo':{
 if (!isPrem) return replyprem(mess.premium)
replyyoimiya(mess.wait)
 waifudd = await axios.get(`https://waifu.pics/api/sfw/awoo`)       
            await DinzBotz.sendMessage(m.chat, { image: { url:waifudd.data.url} , caption: mess.success}, { quoted:m }).catch(err => {
return('Error!')
})
}
break
case 'animemegumin':{
if (!isPrem) return replyprem(mess.premium)
replyyoimiya(mess.wait)
 waifudd = await axios.get(`https://waifu.pics/api/sfw/megumin`)       
            await DinzBotz.sendMessage(m.chat, { image: { url:waifudd.data.url} , caption: mess.success}, { quoted:m }).catch(err => {
return('Error!')
})
}
break
case 'animeshinobu':{
replyyoimiya(mess.wait)
 waifudd = await axios.get(`https://waifu.pics/api/sfw/shinobu`)       
            await DinzBotz.sendMessage(m.chat, { image: { url:waifudd.data.url} , caption: mess.success}, { quoted:m }).catch(err => {
return('Error!')
})
}
break
case 'animehandhold':{
replyyoimiya(mess.wait)
 waifudd = await axios.get(`https://waifu.pics/api/sfw/handhold`)       
            await DinzBotz.sendMessage(m.chat, { image: { url:waifudd.data.url} , caption: mess.success}, { quoted:m }).catch(err => {
return('Error!')
})
}
break
case 'animehighfive':{
replyyoimiya(mess.wait)
 waifudd = await axios.get(`https://waifu.pics/api/sfw/highfive`)       
            await DinzBotz.sendMessage(m.chat, { image: { url:waifudd.data.url} , caption: mess.success}, { quoted:m }).catch(err => {
return('Error!')
})
}
break
case 'animecringe':{
replyyoimiya(mess.wait)
 waifudd = await axios.get(`https://waifu.pics/api/sfw/cringe`)       
            await DinzBotz.sendMessage(m.chat, { image: { url:waifudd.data.url} , caption: mess.success}, { quoted:m }).catch(err => {
return('Error!')
})
}
break
case 'animedance':{
replyyoimiya(mess.wait)
 waifudd = await axios.get(`https://waifu.pics/api/sfw/dance`)       
            await DinzBotz.sendMessage(m.chat, { image: { url:waifudd.data.url} , caption: mess.success}, { quoted:m }).catch(err => {
return('Error!')
})
}
break
case 'animehappy':{
replyyoimiya(mess.wait)
 waifudd = await axios.get(`https://waifu.pics/api/sfw/happy`)       
            await DinzBotz.sendMessage(m.chat, { image: { url:waifudd.data.url} , caption: mess.success}, { quoted:m }).catch(err => {
return('Error!')
})
}
break
case 'animeglomp':{
replyyoimiya(mess.wait)
 waifudd = await axios.get(`https://waifu.pics/api/sfw/glomp`)       
            await DinzBotz.sendMessage(m.chat, { image: { url:waifudd.data.url} , caption: mess.success}, { quoted:m }).catch(err => {
return('Error!')
})
}
break
case 'animesmug':{
replyyoimiya(mess.wait)
 waifudd = await axios.get(`https://waifu.pics/api/sfw/smug`)       
            await DinzBotz.sendMessage(m.chat, { image: { url:waifudd.data.url} , caption: mess.success}, { quoted:m }).catch(err => {
return('Error!')
})
}
break
case 'animeblush':{
replyyoimiya(mess.wait)
 waifudd = await axios.get(`https://waifu.pics/api/sfw/blush`)       
            await DinzBotz.sendMessage(m.chat, { image: { url:waifudd.data.url} , caption: mess.success}, { quoted:m }).catch(err => {
return('Error!')
})
}
break
case 'animewave':{
replyyoimiya(mess.wait)
 waifudd = await axios.get(`https://waifu.pics/api/sfw/wave`)       
            await DinzBotz.sendMessage(m.chat, { image: { url:waifudd.data.url} , caption: mess.success}, { quoted:m }).catch(err => {
return('Error!')
})
}
break
case 'animesmile':{
replyyoimiya(mess.wait)
 waifudd = await axios.get(`https://waifu.pics/api/sfw/smile`)       
            await DinzBotz.sendMessage(m.chat, { image: { url:waifudd.data.url} , caption: mess.success}, { quoted:m }).catch(err => {
return('Error!')
})
}
break
case 'animepoke':{
replyyoimiya(mess.wait)
 waifudd = await axios.get(`https://waifu.pics/api/sfw/poke`)       
            await DinzBotz.sendMessage(m.chat, { image: { url:waifudd.data.url} , caption: mess.success}, { quoted:m }).catch(err => {
return('Error!')
})
}
break
case 'animewink':{
replyyoimiya(mess.wait)
 waifudd = await axios.get(`https://waifu.pics/api/sfw/wink`)       
            await DinzBotz.sendMessage(m.chat, { image: { url:waifudd.data.url} , caption: mess.success}, { quoted:m }).catch(err => {
return('Error!')
})
}
break
case 'animebonk':{
replyyoimiya(mess.wait)
 waifudd = await axios.get(`https://waifu.pics/api/sfw/bonk`)       
            await DinzBotz.sendMessage(m.chat, { image: { url:waifudd.data.url} , caption: mess.success}, { quoted:m }).catch(err => {
return('Error!')
})
}
break
case 'animebully':{
replyyoimiya(mess.wait)
 waifudd = await axios.get(`https://waifu.pics/api/sfw/bully`)       
            await DinzBotz.sendMessage(m.chat, { image: { url:waifudd.data.url} , caption: mess.success}, { quoted:m }).catch(err => {
return('Error!')
})
}
break
case 'animeyeet':{
replyyoimiya(mess.wait)
 waifudd = await axios.get(`https://waifu.pics/api/sfw/yeet`)       
            await DinzBotz.sendMessage(m.chat, { image: { url:waifudd.data.url} , caption: mess.success}, { quoted:m }).catch(err => {
return('Error!')
})
}
break
case 'animebite':{
replyyoimiya(mess.wait)
 waifudd = await axios.get(`https://waifu.pics/api/sfw/bite`)       
            await DinzBotz.sendMessage(m.chat, { image: { url:waifudd.data.url} , caption: mess.success}, { quoted:m }).catch(err => {
return('Error!')
})
}
break
case 'animelick':{
replyyoimiya(mess.wait)
 waifudd = await axios.get(`https://waifu.pics/api/sfw/lick`)       
            await DinzBotz.sendMessage(m.chat, { image: { url:waifudd.data.url} , caption: mess.success}, { quoted:m }).catch(err => {
return('Error!')
})
}
break
case 'animekill':{
replyyoimiya(mess.wait)
 waifudd = await axios.get(`https://waifu.pics/api/sfw/kill`)       
            await DinzBotz.sendMessage(m.chat, { image: { url:waifudd.data.url} , caption: mess.success}, { quoted:m }).catch(err => {
return('Error!')
})
}
break
case 'animecry':{
replyyoimiya(mess.wait)
 waifudd = await axios.get(`https://waifu.pics/api/sfw/cry`)       
            await DinzBotz.sendMessage(m.chat, { image: { url:waifudd.data.url} , caption: mess.success}, { quoted:m }).catch(err => {
return('Error!')
})
}
break
case 'animewlp':{
replyyoimiya(mess.wait)
 waifudd = await axios.get(`https://nekos.life/api/v2/img/wallpaper`)       
            await DinzBotz.sendMessage(m.chat, { image: { url:waifudd.data.url} , caption: mess.success}, { quoted:m }).catch(err => {
return('Error!')
})
}
break
case 'animekiss':{
replyyoimiya(mess.wait)
 waifudd = await axios.get(`https://nekos.life/api/v2/img/kiss`)       
            await DinzBotz.sendMessage(m.chat, { image: { url:waifudd.data.url} , caption: mess.success}, { quoted:m }).catch(err => {
return('Error!')
})
}
break
case 'animehug':{
replyyoimiya(mess.wait)
 waifudd = await axios.get(`https://nekos.life/api/v2/img/hug`)       
            await DinzBotz.sendMessage(m.chat, { image: { url:waifudd.data.url} , caption: mess.success}, { quoted:m }).catch(err => {
return('Error!')
})
}
break*/