/*!-======[ Module Imports ]======-!*/
const fs = "fs".import()
const { default: ms } = await "ms".import()
const { generateWAMessageFromContent } = "baileys".import()

export default async function on({ cht, Exp, store, ev, is }) {
    const { sender, id, reply, edit, react } = cht
    const { func } = Exp
    let infos = Data.infos

const { catbox } = await (fol[0] + 'catbox.js').r();
const { GeminiImage } = await (fol[2] + "gemini.js").r();

  ev.on(
    {
      cmd: ['buktitf'],
      listmenu: ['buktitf'],
      tag: "layanan",
      args: `Berikan catatan seperti\n.${cht.cmd} gw beli premium 15d`,
      media: {
        type: [
          'image'
        ]
      }
    }, 
    async ({ media, args }) => {

      reply(
        `Woke gw cek dulu yah... (⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧`
      )

      let prompt = `Kamu adalah asisten keuangan otomatis. Tugasmu memverifikasi apakah gambar berikut ini adalah bukti transfer asli dari aplikasi dompet digital seperti DANA, OVO, atau BCA Mobile.\n\nCiri bukti transfer asli:\n- Ada logo aplikasi dompet\n- Tampilan rapi, tidak blur, dan tidak ada font dengan ukuran berbeda\n- Ada tanggal dan jam\n- Ada nomor rekening tujuan\n- Tidak ada watermark aneh atau tulisan 'edited'\n- Nama penerima harus "Chin Cellular". Jika nama penerima berbeda, maka bukti dianggap palsu\n\nJawab hanya dengan format JSON valid berikut:\n{\n  "buktiAsli": true/false,\n  "alasan": "penjelasan singkat"\n}\n\nJangan tambahkan teks lain di luar format JSON.`

      let ress = await GeminiImage(await func.minimizeImage(media), prompt)
      console.log("Raw Response:", ress)

      let parsed
      try {
        parsed = JSON.parse(ress)
      } catch (e) {
        return reply(
          `❗ Format AI tidak sesuai, coba ulangi.\n\nRespon mentah:\n${ress}`
        ) 
      }

      if (!parsed.buktiAsli) {
        return reply(
          `❌ Bukti transaksi tidak dikirim ke owner.\n\nAlasan: ${parsed.alasan}\n\n- Hmphhh (⁎˃ᆺ˂)`
        )
      }

      await Exp.sendMessage(
        owner[0] + from.sender, 
        {
          image: media,
          caption: `📩 Ada yang melakukan transaksi nih (⁠ ⁠ꈍ⁠ᴗ⁠ꈍ⁠)\n\n- Note: ${args}\n- Customer: ${cht.sender}`
        }
      )

      await reply(
        `✅ Bukti transaksi asli\n\nAlasan: ${parsed.alasan}\n\n- Arigatou gozaimasu (⁠≧⁠▽⁠≦⁠)`
      )
    }
  )
  
  /* Otak ngelek jadi ga lanjutin
  ev.on(
    {
      cmd: ['deposit'],
      listmenu: ['deposit'],
      tag: "layanan",
      args: "*❗ Berikan jumlah yang akan di deposit*\nMisal .deposit 100k"
    },
    async ({ args }) => {
      let dataUser = Data.users[sender.split("@")[0]]
      
      if (!dataUser.deposit) dataUser.deposit = {
        Rp: 0,
        depo: 0
      }
      
      let nom = args.replace(/'k'/g, "000")
      let nominal parseInt(nom)
      
      if (isNaN(nominal)) return reply(
        "❗ Nominal tidak valid, dek dek"
      )
        
      if (nominal < 10000) return reply(
        "❗ Minimal deposit 10k ya dek"
      )
      
      let text = "乂  *D E P O S I T E*\n\n" +
      "silahkan scene qris tersebut, dan kirim foto hasil transaksi dengan caption *.buktitf deposit " + args + "* dan pesanan anda akan di proses jika owner telah online, jangan ragu owner ku bukan penipu (⁠◠⁠‿⁠◕⁠)\n\n" +
      "Data deposit*:\n"+
      "• *Nama* : " + cht.pushName + "\n" +
      "• *Jumlah* : " + args + "\n\n" +
      if (dataUser.depo > 1) {
        "kamu telah melakukan deposit sebanyak " + deposit "x, makasih yahh telah mempercayai kami dan silahkan tunggu deposit kali ini sedang di proses"
      } else {
        "sabar yahh deposit nya sedang di proses/nunggu owner online"
      }
      
    }
  )
  */
  
  ev.on(
    {
      cmd: ['price', 'harga'],
      listmenu: ['harga'],
      tag: "layanan",
    }, 
    async ({ args }) => {
    
      if (!args) {
        return Exp.sendMessage(id, 
          {
            location: {
              degreesLatitude: -99999999,
              degreesLongitude: 999999999,
              name: "bapakkau",
              address: "tod"
            },
            caption: "*Nak tengok list harga apa?* ⁠(⁠￣⁠ヘ⁠￣⁠)\n\n" +
            "Berikut daftar yang tersedia:\n" +
            `⟡ ${cht.cmd} premium\n` +
            `⟡ ${cht.cmd} energy\n` +
            `⟡ ${cht.cmd} sewa`,
            footer: `Silahkan klik tombol di bawah jika malas ngetik`,
            buttons: [
              {
                buttonId: '.harga premium',
                buttonText: { displayText: '𝙷𝚊𝚛𝚐𝚊 𝙿𝚛𝚎𝚖𝚒𝚞𝚖' },
                type: 1
              },
              {
                buttonId: '.harga energy',
                buttonText: { displayText: '𝙷𝚊𝚛𝚐𝚊 𝙴𝚗𝚎𝚛𝚐𝚢' },
                type: 1
              },
              {
                buttonId: '.harga sewa',
                buttonText: { displayText: '𝙷𝚊𝚛𝚐𝚊 𝚂𝚎𝚠𝚊 𝙱𝚘𝚝' },
                type: 1
              }
            ],
            headerType: 4
          }, { quoted: cht }
        )
      }
      
      await react('🌸')
      
      let promoInfo = {
        contextInfo: {
          externalAdReply: {
            title: `Haii kak ${cht.pushName}`,
            body: `Terimakasih (⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧`,
            thumbnailUrl: "https://c.termai.cc/i37/QhFJzY1.jpg",
            mediaUrl: cfg.gcurl,
            sourceUrl: '',
            renderLargerThumbnail: true,
            showAdAttribution: true,
            mediaType: 1
          },
          forwardingScore: 19,
          isForwarded: true,
          mentionedJid: [
            sender
          ]
        },
        footer: `Silahkan pilih metode pembayaran\nPembayaran melalui qris dikenakan pajak 500 perak yah kak`,
        buttons: [
          { 
            buttonId: ".qris",
            buttonText: {
              displayText: "payment qris" 
            } 
          },
          { 
            buttonId: ".nogw", 
            buttonText: {
              displayText: "payment dana"
            } 
          },
          {
            buttonId: ".bar", 
            buttonText: {
              displayText: "owner"
            }
          }
        ],
        viewOnce: true,
        headerType: 6
      }
      
      let sendAudio = () => {
        Exp.sendMessage(
          cht.id,
          {
            audio: { url: "https://c.termai.cc/v18/hjL0TC6.mp4" },
            ptt: true,
            mimetype: 'audio/mpeg'
          },
        )
      }
      
      if (args.includes('premium')) {
        await Exp.sendMessage(
          id,
          {
            image: fs.readFileSync(fol[3] + 'bell.jpg'),
            caption: "```\n" +
            "╭─❖ 𝐏𝐑𝐈𝐂𝐄𝐋𝐈𝐒𝐓 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 ❖─╮\n" +
            "│\n" +
            "│  ⟣   3  hari   =  2k\n" +
            "│  ⟣   7  hari   =  4k\n" +
            "│  ⟣  14  hari   =  7k\n" +
            "│  ⟣  30  hari   =  12k\n" +
            "│  ⟣  45  hari   =  16k\n" +
            "│  ⟣  60  hari   =  20k\n" +
            "│  ⟣  90  hari   =  27k\n" +
            "│  ⟣ 120  hari   =  33k\n" +
            "│  ⟣ 150  hari   =  38k\n" +
            "│  ⟣ 200  hari   =  46k\n" +
            "│  ⟣ 365  hari   =  50k\n" +
            "│\n" +
            "╰──────────────────────╯\n" +
            "```\n" +
            "*ℹ️ Keuntungan premium*:\n" +
            "› Bisa mengakses semua fitur \n" +
            "› Dapatkan energy gratis\n" +
            "› Dapatkan unlimited transfer energy\n" +
            "› Berinteraksi dengan " + botnickname + " tanpa batas\n" +
            "› Dapat 1500 energy",
            ...promoInfo
          }, 
          { quoted: Data.fquoted.freply }
        )

        return await sendAudio()
      }

      if (args.includes('energy')) {
        await Exp.sendMessage(
          id,
          {
            image: fs.readFileSync(fol[3] + 'bell.jpg'),
            caption: "```\n" +
            "╭─❖ 𝐏𝐑𝐈𝐂𝐄𝐋𝐈𝐒𝐓 𝐄𝐍𝐄𝐑𝐆𝐘 ❖─╮\n" +
            "│ \n" +
            "│  ⟣    5.000  ⚡   =   1k\n" +
            "│  ⟣   13.000  ⚡   =   3k\n" +
            "│  ⟣   25.000  ⚡   =   5k\n" +
            "│  ⟣   35.000  ⚡   =   8k\n" +
            "│  ⟣   45.000  ⚡   =   10k\n" +
            "│  ⟣  100.000  ⚡   =   15k\n" +
            "│  ⟣  500.000  ⚡   =   20k\n" +
            "│ \n" +
            "╰──────────────────────╯\n" +
            "```\n" +
            "*ℹ️ Kegunaan energi*:\n" +
            "energy digunakan untuk mengakses fitur yang tersedia di bot " + botnickname + " tanpa energy kalian bisa apa wkwk 🗿\n" +
            "dan jadilah topglobalenergy",
            ...promoInfo
          }, 
          { quoted: Data.fquoted.freply }
        )
        
        return await sendAudio()
      }
      
      if (args.includes('sewa')) {
        await Exp.sendMessage(
          id, 
          {
            image: fs.readFileSync(fol[3] + 'bell.jpg'),
            caption: "```\n" +
            "╭─❖ 𝐏𝐑𝐈𝐂𝐄𝐋𝐈𝐒𝐓 𝐒𝐄𝐖𝐀 𝐁𝐎𝐓 ❖─╮\n" +
            "│\n" +
            "│  ⟣   3  hari   =  3k\n" +
            "│  ⟣   7  hari   =  5k\n" +
            "│  ⟣  15  hari   =  9k\n" +
            "│  ⟣  30  hari   =  13k\n" +
            "│  ⟣  45  hari   =  17k\n" +
            "│  ⟣  60  hari   =  20k\n" +
            "│  ⟣  90  hari   =  26k\n" +
            "│  ⟣ 120  hari   =  32k\n" +
            "│  ⟣ 150  hari   =  38k\n" +
            "│  ⟣ 180  hari   =  44k\n" +
            "│  ⟣ selamanya   =  55k\n" +
            "│\n" +
            "╰───────────────────────╯\n" +
            "```\n" +
            "*ℹ️ Fasilitas sewa bot*:\n" +
            "› Bot online 24 jam\n" +
            "› Bergyna untuk menjaga grup\n" +
            "› Free premium 15 hari untuk admin\n" +
            "› Masa sewa tidak berkurang jika ada perbaikan\n" +
            "› Bebas melakukan perpindahan grup selama masa sewa masih aktif, cukup infokan owner untuk melakukan pertukaran grup",
            ...promoInfo
          }, 
          { quoted: Data.fquoted.freply }
        )

        return await sendAudio()
      }
      
      return reply(
        "List harga untun kategori " + args + " tidak tersedia, yang tersedia cuma 3 yaitu energy/premium/sewa"
      )
    }
  )

  ev.on(
    {
      cmd: ['nogw', 'qris'],
      listmenu: ['qris'],
      tag: "layanan"
    }, 
    async () => {

      await react('🌸')
      let { dana, gopay, name, qris } = cfg.pay
      
      let teks2 = "```\n" +
        "╭─【 𝐃𝐔𝐊𝐔𝐍𝐆𝐀𝐍 𝐐𝐑𝐈𝐒 - 𝐃𝐀𝐍𝐀 】─╮\n" +
        "❖ Metode        : Qris\n" +
        "❖ Pajak         : 200p\n" +
        `❖ Nama          : ${qris.name}\n` +
        `❖ No dana       : ${dana}\n` +
        "╰─────────────────────────╯\n" +
        "```\n" +
        "*⫹⫺  𝐍𝐎𝐓𝐄  ⫹⫺*\n" +
        "› Wajib kirim bukti transaksi\n" +
        "› Orderan dikerjakan saat owner online\n" +
        "› Php? malas ta layani"

      let teks = "```\n" +    
        "╭─【 𝐃𝐔𝐊𝐔𝐍𝐆𝐀𝐍 𝐕𝐈𝐀 𝐃𝐀𝐍𝐀 】─╮\n" +
        `❖ Nomor : ${dana}\n` +
        `❖ Nama  : ${name}\n` +
        "╰────────────────────╯\n" +
        "```\n" +
        "*⫹⫺  𝐍𝐎𝐓𝐄  ⫹⫺*\n" +
        "› Wajib kirim bukti transaksi\n" +
        "› Orderan dikerjakan saat owner online\n" +
        "› Php? malas ta layani"
  
      let caption = `Makasih yaa udah menggunakan layanan *${botnickname}*\nSetiap orderan yang kamu lakukan tuh berarti banget (⁠ ⁠ꈍ⁠ᴗ⁠ꈍ⁠)`
 
      if (cht.cmd === "nogw") {
        let message = {
          image: fs.readFileSync(fol[10] + 'thumb1.jpg'),
          caption: teks,
          footer: caption,
          mentions: [
            sender
          ],
          quoted: Data.fquoted.freply,
          fromMe: false,
          interactiveButtons: [
            {
              name: 'cta_copy',
              buttonParamsJson: JSON.stringify(
                {
                  display_text: 'Dana',
                  copy_code: cfg.pay.dana
                }
              )
            }
          ]
        }
  
        return await Exp.sendMessage(
          id,
          message, 
          { quoted: Data.fquoted.freply }
        )
      } else {
        let message = {
          image: fs.readFileSync(fol[10] + 'qris.jpg'),
          caption: teks2,
          footer: caption,
          mentions: [
            sender
          ],
          quoted: Data.fquoted.freply,
          fromMe: false,
          interactiveButtons: [
            {
              name: 'cta_copy',
              buttonParamsJson: JSON.stringify(
                {
                  display_text: 'Dana',
                  copy_code: cfg.pay.dana
                }
              )
            }
          ]
        }

        return await Exp.sendMessage(
          id,
          message, 
          { quoted: Data.fquoted.freply }
        )
      }
    }
  )
}