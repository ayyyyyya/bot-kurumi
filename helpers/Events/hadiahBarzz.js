const fs = 'fs'.import()

export default async function on({ cht, Exp, store, ev, is }) {
  const { id, sender, reply } = cht
  const { func } = Exp
  let { archiveMemories:memories, parseTimeString, clearSessionConfess, findSenderCodeConfess, formatDuration } = func
  const infos = Data.infos 

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
      cmd: [
        "harian", "daily",
        "mingguan", "weekly",
        "bulanan", "monthly",
        "tahunan", "yearly"
      ],
      listmenu: [
        "harian",
        "mingguan",
        "bulanan",
        "tahunan"
      ],
      tag: "hadiah"
    },
    async () => {
      let user = Data.users[sender.split("@")[0]]
      
      await Exp.sendMessage(
        id, 
        {
          react: { 
            text: "🌸",
            key: cht.key
          } 
        }
      )
      
      if (!user.reward) {
        user.reward = {
          daily: 0,
          weekly: 0,
          monthly: 0,
          yearly: 0,
          per: 0.1
        }
      }
      
      let ganda = user.premium?.time >= Date.now() ? 0.6 : 0.2
      let allGanda = ganda + (user.reward.per || 0.1)

      let bonus, key, cooldown
      if (cht.cmd === "daily" || cht.cmd === "harian") {
        bonus = 50
        key = "daily"
        cooldown = 24 * 60 * 60 * 1000
      } else if (cht.cmd === "weekly" || cht.cmd === "mingguan") {
        bonus = 50 * 7
        key = "weekly"
        cooldown = 7 * 24 * 60 * 60 * 1000
      } else if (cht.cmd === "monthly" || cht.cmd === "bulanan") {
        bonus = 50 * 31
        key = "monthly"
        cooldown = 30 * 24 * 60 * 60 * 1000
      } else if (cht.cmd === "yearly" || cht.cmd === "tahunan") {
        bonus = 50 * 351
        key = "yearly"
        cooldown = 365 * 24 * 60 * 60 * 1000
      }

      if (Date.now() - user.reward[key] < cooldown) {
        let sisa = cooldown - (Date.now() - user.reward[key])
        let formatDur = formatDuration(sisa)
        return reply(
          `❗ Kamu sebelum nya udah klaim hadiah *${key}*\n` +
          `> Kamu bisa klaim lagi setelah: \`${formatDur.days} hari ${formatDur.hours} jam ${formatDur.minutes} menit\``
        )
      }

      let total = Math.floor(bonus * allGanda)
      await func.archiveMemories["addEnergy"](sender,total)
      
      user.reward[key] = Date.now()
      user.reward.per += 0.1

      let teks = `🎁 *C L A I M  R E W A R D*\n\n`
      teks += `Berhasil klaim hadiah *${key}*, dan mendapatkan *${total} Energy⚡*`
      
      await Exp.sendMessage(
        id,
        {
          text: teks,
          contextInfo
        }, { quoted: cht }
      )
      
    }
  )
  
}