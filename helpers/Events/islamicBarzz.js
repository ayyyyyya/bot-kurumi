/*!-======[ Module Imports ]======-!*/
const fs = "fs".import()
const { default: ms } = await "ms".import()

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
    const { id, sender, reply, edit } = cht
    const { func } = Exp

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
      cmd: ['doaharian'],
      listmenu: ['doaharian'],
      tag: "religion",
      energy: 15
    },
    async () => {
    
      await Exp.sendMessage(
        id, {
          react: {
            text: "⏱️",
            key: cht.key
          }
        }
      )
    
      try {
        let api = await fetch(
          `https://api.botcahx.eu.org/api/muslim/doaharian?apikey=${cfg.bar}`
        )
        let json = await api.json()
        
        let hasil = json.result.data[Math.floor(Math.random() * json.result.data.length)]
        let {
          title,
          arabic,
          latin,
          translation 
        } = hasil
        
        let teks = "🕊️ *D O A  H A R I A N*\n\n"
        teks += `• *Judul* : ${title}\n`
        teks += `• *Arabic* :\n`
        teks += `- ${arabic}\n`
        teks += `• *Latin* :\n`
        teks += `- ${latin}\n`
        teks += `• *Artinya* : ${translation}`
        
        Exp.sendMessage(
          id,
          {
            text: teks,
            contextInfo
          }, { quoted: cht }
        )
        
      } catch (e) {
        return reply(
          "Gagal nengambil doa harian\n\n*Error*:\n" + e
        )
      }
    }
  )
  
  ev.on(
    {
      cmd: ['niatsholat'],
      listmenu: ['niatsholat'],
      tag: "religion",
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
      )
      
      try {
        let niat = [
          'isya',
          'subuh',
          'dzuhur',
          'ashar',
          'maghrib'
        ] 
      
        let nt = args.toLowerCase()
      
        if (!niat.includes(nt)) return reply(
          "Niat sholat tidak valid"
        )
      
        let emoji = ""
        let name = ""
        let arabic = ""
        let latin = ""
        let terjemahan = ""
      
        if (nt === "maghrib") {
          emoji = "🌆"
          name = "*Sholat Maghrib*"
          arabic = "اُصَلِّى فَرْضَ الْمَغْرِبِ ثَلاَثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى"
          latin = "Ushalli fardhol maghribi tsalaata raka'aatim mustaqbilal qiblati adaa-an lillaahi ta'aala"
          terjemahan = "Aku berniat shalat fardhu Maghrib tiga raka'at menghadap kiblat karena Allah Ta'ala"
        
        } else if (nt === "isya") {
          emoji = "🌙"
          name = "*Sholat Isya*"
          arabic = "اُصَلِّى فَرْضَ الْعِشَاءِ اَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى"
          latin = "Ushalli fardhol 'isyaa-i arba'a raka'aatim mustaqbilal qiblati adaa-an lillaahi ta'aala"
          terjemahan = "Aku berniat shalat fardhu Isya empat raka'at menghadap kiblat karena Allah Ta'ala"
          
        } else if (nt === "ashar") {
          emoji = "🌇"
          name = "*Sholat Ashar*"
          arabic = "اُصَلِّى فَرْضَ الْعَصْرِاَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى"
          latin =  "Ushalli fardhol 'ashri arba'a raka'aatim mustaqbilal qiblati adaa-an lillaahi ta'aala"
          terjemahan = "Aku berniat shalat fardhu 'Ashar empat raka'at menghadap kiblat karena Allah Ta'ala"
          
        } else if (nt === "dzuhur") {
          emoji = "☀️"
          name = "*Sholat Dzuhur*"
          arabic = "اُصَلِّى فَرْضَ الظُّهْرِاَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى"
          latin = "Ushalli fardhodl dhuhri arba'a raka'aatim mustaqbilal qiblati adaa-an lillaahi ta'aala"
          terjemahan = "Aku berniat shalat fardhu Dzuhur empat raka'at menghadap kiblat karena Allah Ta'ala"
          
        } else {
          let em = ["🌄", "🌅"]
          emoji = em[Math.floor(Math.random() * em.length)]
          name = "*Sholat Subuh*"
          arabic = "اُصَلِّى فَرْضَ الصُّبْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى"
          latin = "Ushalli fardhosh shubhi rok'ataini mustaqbilal qiblati adaa-an lillaahi ta'aala"
          terjemahan = "Aku berniat shalat fardhu Shubuh dua raka'at menghadap kiblat karena Allah Ta'ala"
          
        }

        let teks = emoji + " *N I A T  S H O L A T*"
        teks += "\n\nBerikut adalah niat " + name
        teks += "\n\n• *Arabic* :\n- " + arabic
        teks += "\n\n• *Latin* :\n- " + latin
        teks += "\n\n• *Artinya* :\n- " + terjemahan
        
        Exp.sendMessage(
          id,
          {
            text: teks,
            contextInfo
          }, { quoted: cht }
        )
          
      } catch (e) {
        return reply(
          "Gagal mengambil niat sholat \n\n*Error*:\n" + e
        )
      }
    }
  )
  
  ev.on(
    {
      cmd: ['tahlil'],
      listmenu: ['tahlil'],
      tag: "religion",
      energy: 15
    }, 
    async () => {
    
      await Exp.sendMessage(
        id, {
          react: {
            text: "⏱️",
            key: cht.key
          }
        }
      )
      
      try {
        let api = await fetch(
          `https://api.botcahx.eu.org/api/muslim/tahlil?apikey=${cfg.bar}`
        )
        let data = await api.json()
      
        let res = data.result.data[Math.floor(Math.random() * data.result.data.length)]
        let { 
          title,
          arabic,
          translation
        } = res
      
        let teks = "🤲 *R A N D O M  T A H L I L*\n\n"
        teks += `• *Judul* : ${title}\n`
        teks += "• *Arabic* :\n"
        teks += `- ${arabic}\n`
        teks += "• *Artinya* :\n"
        teks += `- ${translation}`
      
        Exp.sendMessage(
          id,
          {
            text: teks,
            contextInfo 
          }, { quoted: cht }
        )
      
      } catch (e) {
        return reply( 
          "Gagal mengambil tahlil random \n\n*Error*:\n" + e
        )
      }
    }
  )
  
}