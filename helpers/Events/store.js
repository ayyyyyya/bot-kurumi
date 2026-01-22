const fs = "fs".import()

export default async function on({ cht, Exp, store, ev, is }) {
  const { sender, id, reply, edit } = cht
  const { func } = Exp

  async function orderFunc(text, buyer, orderan, status) {
    let now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }))
    let waktu = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    let tanggal = now.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })

    let tag = buyer ? '@' + buyer.split('@')[0] : '@unknown'
    let stat = status === 'done' ? '✅Selesai' : '⏳Diproses'

    text = text.replace(/@buyer/g, tag)
    text = text.replace(/@orderan/g, orderan || 'tanpa pesan')
    text = text.replace(/@tanggal/g, tanggal)
    text = text.replace(/@waktu/g, waktu + ' WIB')
    text = text.replace(/@status/g, stat)

    return text
  }
   
  async function emojiFunc(text, sender, store) {
    let now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }))
    let jam = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    let tanggal = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

    let ucapan = () => {
      let h = now.getHours()
      if (h >= 4 && h < 10) return "Selamat Pagi🌅"
      if (h >= 10 && h < 15) return "Selamat Siang☀️"
      if (h >= 15 && h < 18) return "Selamat Sore🌇"
      return "Selamat Malam🌙"
    }

    let userId = sender ? sender.split('@')[0] : 'unknown'
    text = text.replace(/👤/g, '@' + userId)
    text = text.replace(/🌤️/g, tanggal)
    text = text.replace(/⏳/g, jam)
    text = text.replace(/💬/g, ucapan())
    text = text.replace(/📍/g, store.symbol || '𐚁๋࣭⭑')
    
    if (Array.isArray(store.list)) {
      store.list.sort((a, b) =>
        a.produk.localeCompare(b.produk, 'id', { sensitivity: 'base' })
      )
    }
    
    if (text.includes('⏺️')) {
      let produkList = (store.list || [])
        .map(v => `*${store.symbol || '𐚁๋࣭⭑'} ${v.produk}*`)
        .join('\n') || '_Belum ada produk_'
      text = text.replace(/⏺️/g, produkList)
    }
  
    return text
  }
  
  ev.on(
    {
      cmd: ['addlist', 'dellist', 'updatelist'],
      listmenu: ['addlist', 'dellist', 'updatelist'],
      tag: "store",
      isAdmin: true,
      isGroup: true,
      args: `🪶 Panduan ${
        cht.cmd === 'addlist'
          ? `Menambah List\n\nContoh:\n.addlist nama_produk | list_harga\n.addlist alight motion | 5k/tahun\n\nJika ingin melihat panduan lainnya, ketik aja *.panduan*`
          : cht.cmd === 'dellist'
            ? `Menghapus List\n\nContoh:\n.dellist nama_produk`
            : `Memperbarui List\n\nContoh:\n.updatelist nama_produk | harga_baru`
      }`
    },
    async ({ args }) => {
      Data.preferences[id].store ??= {}
      Data.preferences[id].store.list ??= []
      Data.preferences[id].store.desain ??= null
      Data.preferences[id].store.proses ??= {}
      
      let cd = cht.cmd
      let [produkRaw, harga] = args.split('|')
      let produk = produkRaw.toLowerCase().trim()

      let cekin = Data.preferences[id].store.list.findIndex(v => v.produk.toLowerCase() === produk)
      
      switch (cd) {
        case 'addlist': {
          if (!produk || !harga)
            return reply("‼️ Nama produk dan harga perlu diisi")

          if (cekin !== -1)
            return reply(`‼️ Produk *${produk}* sudah ada, gunakan *.updatelist* jika ingin memperbarui harga`)

          Data.preferences[id].store.list.push({ produk, harga })

          return reply("✅ Berhasil menambahkan produk *" + produk + "*, untuk mengecek nya ketik *.list*")
        }
  
        case 'dellist': {
          if (!produk)
            return reply("‼️ Berikan nama produk yang ingin dihapus")

          if (cekin === -1)
            return reply("‼️ Produk *" + produk + "* tidak ditemukan di list")

          Data.preferences[id].store.list.splice(cekin, 1)

          return reply("✅ Berhasil menghapus produk *" + produk + "*, dari list")
        }

        case 'updatelist': {
          if (!produk || !harga)
            return reply("‼️ Harap berikan nama produk dan harga barunya")

          if (cekin === -1)
            return reply("‼️ Produk *" + produk + "* tidak ditemukan di list")
 
          Data.preferences[id].store.list[cekin].harga = harga
  
          return reply("✅ Harga produk *" + produk + "* berhasil diperbarui")
        }

        default:
          return reply("‼️ Perintah tidak dikenal")
      }
    }
  )
  
  ev.on(
    {
      cmd: ['setlist'],
      listmenu: ['setlist'],
      tag: "store",
      isGroup: true,
      isAdmin: true
    },
    async ({ args }) => {
      let store = Data.preferences[id].store ??= {}
      store.list ??= []
      store.desain ??= null
      store.proses ??= {}
      store.symbol ??= '𐚁๋࣭⭑'

      let defaultDesain =
        "📦 *LIST PRODUK*\n" +
        "﹉﹉﹉﹉﹉﹉﹉﹉\n" +
        "Haii kak 👤\n" +
        "💬\n" +
        "Tanggal: 🌤️\n" +
        "Jam: ⏳\n\n" +
        "⏺️\n\n" +
        "Ketik nama produk yang ada di atas\n\n" +
        "ⓘ ketik .owner jika ingin sewa bot"

      if (!args) {
        let current = store.desain || defaultDesain
        let tek =
          "*❗ Berikan desain list-nya*\n\n" +
          "*Contoh*: \n" +
          ".setlist 「 𝗟𝗜𝗦𝗧 𝗠𝗘𝗡𝗨 𝗦𝗧𝗢𝗥𝗘 」\n" +
          "ᯤ.﹀﹀﹀﹀﹀﹀﹀﹀﹀.ᯤ\n" +
          "⊱┊ *Holla Kak* 👤\n" +
          "⊱┊ *💬*\n" +
          "⊱┊ *Tanggal : 🌤️*\n" +
          "⊱┊ *Jam : ⏳*\n" +
          "⊱┊ *Simbol Awal : 📍*\n" +
          "﹉﹉﹉﹉﹉﹉﹉﹉\n\n" +
          "📍 ⏺️\n\n" +
          "*Arti dari emoji tersebut*:\n\n" +
          "👤 ➟ Tag user\n" +
          "💬 ➟ Ucapan pagi/siang/sore/malam\n" +
          "🌤️ ➟ Tanggal sekarang\n" +
          "⏳ ➟ Jam sekarang\n" +
          "📍 ➟ Simbol awal list (bisa diganti)\n" +
          "⏺️ ➟ List produk\n\n" +
          "*Desain saat ini:*\n\n" +
           current
        
        return Exp.sendMessage(
          id, 
          {
            text: tek 
          }, 
          { quoted: cht }
        )
      }

      store.desain = args
      return reply("✅ Berhasil mengubah tampilan list, dan gunkaan setsymbol untuk mengganti simbol '𐚁๋࣭⭑'")
    }
  )

  ev.on(
    {
      cmd: ['setsymbol'],
      listmenu: ['setsymbol'],
      tag: "store",
      isGroup: true,
      isAdmin: true
    },
    async () => {
      let store = Data.preferences[id].store ??= {}
      store.symbol ??= '𐚁๋࣭⭑'
      
      if (!cht.q) return reply("‼️ Contoh: .setsymbol 𖤍 atau .setsymbol ☆")
      store.symbol = cht.q
      reply(`✅ Simbol awal list berhasil diganti menjadi: ${cht.q}`)
    }
  )
  
  ev.on(
    {
      cmd: ['setpay'],
      listmenu: ['setpay'],
      tag: "store",
      isGroup: true,
      isAdmin: true,
      args: "*❗ Berikan catatan pay beserta qris jika ada*"
    },
    async ({ args }) => {
      let store = Data.preferences[id].store ??= {}
      store.pay ??= {}
      
      let { quoted, type: mediaType } = ev.getMediaType()
      let pay = null
      
      if (quoted) {
        let p = await cht.quoted.download()
        pay = p.toString('base64')
      }
      
      store.pay = { 
        text: args || "_Tanpa Pesan Apapun_", 
        image: pay 
      }
      
      return reply("✅ Berhasil mengatur pay")
    }
  )
  
  ev.on(
    {
      cmd: ['setdone', 'setproses'],
      listmenu: ['setdone', 'setproses'],
      tag: "store",
      isGroup: true,
      isAdmin: true
    },
    async ({ args }) => {
      let store = (Data.preferences[id].store ??= {})
      store.text ??= {}
      store.text.done ??= ''
      store.text.proses ??= ''

      let defaultProses =
          " ㅤ 𝓒𝓸𝓻𝓮–𝓢𝽍𝓸𝔀 ↓ 𓈒 𝗼𝗿𝗱𝗲𝗿⌧ 𓈒\n" +
          "ㅤㅤ𝗼𝗿𝗱𝗲𝗿𝗮𝗻 𝗱𝗶𝗽𝗿𝗼𝘀𝗲𝘀\n" +
          "    ㅤㅤ ˳ ⊹ ׁ ۪  𝆯 ┈─⃘♡⃘‌─┈ 𝆯  ۪  ׁ ⊹ ˳ ࣪\n" +
          `ㅤ꒰ ⋆⋅✩⋅⋆ ─ ࣪ ⁞ pembeli  : @buyer\n` +
          `ㅤ꒰ ⋆⋅✩⋅⋆ ─ ࣪ ⁞ pesanan  : @orderan\n` +
          `ㅤ꒰ ⋆⋅✩⋅⋆ ─ ࣪ ⁞ tanggal  : @tanggal\n` +
          `ㅤ꒰ ⋆⋅✩⋅⋆ ─ ࣪ ⁞ waktu    : @waktu\n` +
          "ㅤ꒰ ⋆⋅✩⋅⋆ ─ ࣪ ⁞ status : *@status*\n" +
          "    ׅ ׄ ⊱  ֵ ─ׅ─๋┈︪─ׄ─ׅ┈ ׄ ⚶  ׅ┈ׅ─︪ׄ─┈ׅ─๋─   ֵ⊰\n" +
          "      *𖣁.   _pesanan sedang diproses, mohon tunggu_*\n" +
          "    ׅ ׄ ⊱  ֵ ─ׅ─๋┈︪─ׄ─ׅ┈ ׄ ⚶  ׅ┈ׅ─︪ׄ─┈ׅ─๋─   ֵ⊰"
          
      let defaultDone =          
          " ㅤ 𝓒𝓸𝓻𝓮–𝓢𝽍𝓸𝔀 ↓ 𓈒 𝗼𝗿𝗱𝗲𝗿⌧ 𓈒\n" +
          "ㅤㅤ𝗼𝗿𝗱𝗲𝗿𝗮𝗻 𝘀𝗲𝗹𝗲𝘀𝗮𝗶\n" +
          "    ㅤㅤ ˳ ⊹ ׁ ۪  𝆯 ┈─⃘♡⃘‌─┈ 𝆯  ۪  ׁ ⊹ ˳ ࣪\n" +
          `ㅤ꒰ ⋆⋅✩⋅⋆ ─ ࣪ ⁞ pembeli  : @buyer\n` +
          `ㅤ꒰ ⋆⋅✩⋅⋆ ─ ࣪ ⁞ pesanan  : @orderan\n` +
          `ㅤ꒰ ⋆⋅✩⋅⋆ ─ ࣪ ⁞ tanggal  : @tanggal\n` +
          `ㅤ꒰ ⋆⋅✩⋅⋆ ─ ࣪ ⁞ waktu    : @waktu\n` +
          "ㅤ꒰ ⋆⋅✩⋅⋆ ─ ࣪ ⁞ status : *@status*\n" +
          "    ׅ ׄ ⊱  ֵ ─ׅ─๋┈︪─ׄ─ׅ┈ ׄ ⚶  ׅ┈ׅ─︪ׄ─┈ׅ─๋─   ֵ⊰\n" +
          "      *𖣁.   _pesanan telah selesai diproses, silahkan di cek yahh_*\n" +
          "    ׅ ׄ ⊱  ֵ ─ׅ─๋┈︪─ׄ─ׅ┈ ׄ ⚶  ׅ┈ׅ─︪ׄ─┈ׅ─๋─   ֵ⊰"
          
      let tipe = cht.cmd === 'setproses' ? 'proses' : 'done'
      let sekarang = tipe === 'proses' ? store.text.proses : store.text.done
      let defaultTeks = tipe === 'proses' ? defaultProses : defaultDone

      if (!args) {
        let teksPanduan = `🪶 *Panduan Mengatur Desain ${tipe === 'proses' ? 'Proses' : 'Selesai'} Orderan*\n\n` +
          `Gunakan tag berikut di dalam teks desainmu:\n` +
          `┌───────────────┐\n` +
          `│ @buer     ➜ Tag pembeli\n` +
          `│ @orderan  ➜ Isi pesanan\n` +
          `│ @tanggal  ➜ Tanggal saat ini\n` +
          `│ @waktu    ➜ Waktu saat ini\n` +
          `│ @status   ➜ Status otomatis (⏳Diproses / ✅Selesai)\n` +
          `└───────────────┘\n\n` +
          `*Contoh penggunaan:*\n` +
          `> .${cht.cmd} Pesanan @orderan oleh @buer sedang @status pada @tanggal @waktu\n\n` +
          `*Desain saat ini:*\n` +
          `${sekarang || defaultTeks}`

        return Exp.sendMessage(
          id,
          {
            text: teksPanduan 
          },
          { quoted: cht }
        )
      }

      if (cht.cmd === 'setproses') {
        store.text.proses = args
        cht.reply("✅ Desain *proses* berhasil diperbarui!")
      } else {
        store.text.done = args
        cht.reply("✅ Desain *selesai* berhasil diperbarui!")
      }
    }
  )
  
  ev.on(
    {
      cmd: ['pay', 'payment'],
      listmenu: ['pay'],
      tag: "store",
      isGroup: true
    },
    async () => {
      let store = Data.preferences[id].store ??= {}
      store.pay ??= {}
      
      if (!store.pay.image && !store.pay.text) return reply("‼️ Belum ada payment yang disiapkan")
      
      if (!store.pay.image) {
        return reply(store.pay.text)
      
      } else {
        let buf = Buffer.from(store.pay.image, 'base64')
        return Exp.sendMessage(
          id,
          {
            image: buf,
            caption: store.pay.text
          },
          { quoted: cht }
        )
      }
    }
  )
  
  ev.on(
    {
      cmd: ['list'],
      listmenu: ['list'],
      tag: 'store',
      isGroup: true
    },
    async () => {
      let store = Data.preferences[id].store ??= {}
      store.list ??= []
      store.desain ??= null
      store.proses ??= {}
      store.symbol ??= '𐚁๋࣭⭑'
  
      if (!store.list.length) 
        return reply("‼️ Belum ada list produk yang disiapkan")

      let defaultDesain =
        "📦 *LIST PRODUK*\n" +
        "﹉﹉﹉﹉﹉﹉﹉﹉\n" +
        "Haii kak 👤\n" +
        "💬\n" +
        "Tanggal: 🌤️\n" +
        "Jam: ⏳\n\n" +
        "⏺️\n\n" +
        "Ketik nama produk yang ada di atas\n\n" +
        "ⓘ ketik .owner jika ingin sewa bot"

      let desain = store.desain || defaultDesain
      let teks = await emojiFunc(desain, cht.sender, store)

      return Exp.sendMessage(
        id,
        {
          text: teks,
          mentions: [sender]
        },
        { quoted: cht }
      )
    }
  )
  
  ev.on(
    {
      cmd: ['done', 'proses'],
      listmenu: ['done', 'proses'],
      tag: "store",
      isGroup: true,
      isAdmin: true,
      isMention: "*❗ Tag orangnya*"
    },
    async () => {
      let store = Data.preferences[id].store ??= {}
      store.text ??= {}
      store.proses ??= {}
      store.text.done ??= ''
      store.text.proses ??= ''
      
      let b = cht.mention[0]
      let now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }))
 
      let waktu = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      let tanggal = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })

      let orderan = cht.q || 'tanpa pesan'
      
      if (cht.cmd === 'done') {
        if (!store.proses[b]) return reply("‼️ Orang tersebut belum pernah melakukan proses.")

        delete store.proses[b]

        let text =
          store.text.done ||
          " ㅤ 𝓒𝓸𝓻𝓮–𝓢𝽍𝓸𝔀 ↓ 𓈒 𝗼𝗿𝗱𝗲𝗿⌧ 𓈒\n" +
          "ㅤㅤ𝗼𝗿𝗱𝗲𝗿𝗮𝗻 𝘀𝗲𝗹𝗲𝘀𝗮𝗶\n" +
          "    ㅤㅤ ˳ ⊹ ׁ ۪  𝆯 ┈─⃘♡⃘‌─┈ 𝆯  ۪  ׁ ⊹ ˳ ࣪\n" +
          `ㅤ꒰ ⋆⋅✩⋅⋆ ─ ࣪ ⁞ pembeli  : @buyer\n` +
          `ㅤ꒰ ⋆⋅✩⋅⋆ ─ ࣪ ⁞ pesanan  : @orderan\n` +
          `ㅤ꒰ ⋆⋅✩⋅⋆ ─ ࣪ ⁞ tanggal  : @tanggal\n` +
          `ㅤ꒰ ⋆⋅✩⋅⋆ ─ ࣪ ⁞ waktu    : @waktu\n` +
          "ㅤ꒰ ⋆⋅✩⋅⋆ ─ ࣪ ⁞ status : *@status*\n" +
          "    ׅ ׄ ⊱  ֵ ─ׅ─๋┈︪─ׄ─ׅ┈ ׄ ⚶  ׅ┈ׅ─︪ׄ─┈ׅ─๋─   ֵ⊰\n" +
          "      *𖣁.   _pesanan telah selesai diproses, silahkan di cek yahh_*\n" +
          "    ׅ ׄ ⊱  ֵ ─ׅ─๋┈︪─ׄ─ׅ┈ ׄ ⚶  ׅ┈ׅ─︪ׄ─┈ׅ─๋─   ֵ⊰"

        let res = await orderFunc(text, b, orderan, 'done')
        return reply(res, { mentions: [b] })
      }

      if (cht.cmd === 'proses') {
        store.proses[b] = {
          user: b,
          orderan,
          waktu,
          tanggal
        }

        let text =
          store.text.proses ||
          " ㅤ 𝓒𝓸𝓻𝓮–𝓢𝽍𝓸𝔀 ↓ 𓈒 𝗼𝗿𝗱𝗲𝗿⌧ 𓈒\n" +
          "ㅤㅤ𝗼𝗿𝗱𝗲𝗿𝗮𝗻 𝗱𝗶𝗽𝗿𝗼𝘀𝗲𝘀\n" +
          "    ㅤㅤ ˳ ⊹ ׁ ۪  𝆯 ┈─⃘♡⃘‌─┈ 𝆯  ۪  ׁ ⊹ ˳ ࣪\n" +
          `ㅤ꒰ ⋆⋅✩⋅⋆ ─ ࣪ ⁞ pembeli  : @buyer\n` +
          `ㅤ꒰ ⋆⋅✩⋅⋆ ─ ࣪ ⁞ pesanan  : @orderan\n` +
          `ㅤ꒰ ⋆⋅✩⋅⋆ ─ ࣪ ⁞ tanggal  : @tanggal\n` +
          `ㅤ꒰ ⋆⋅✩⋅⋆ ─ ࣪ ⁞ waktu    : @waktu\n` +
          "ㅤ꒰ ⋆⋅✩⋅⋆ ─ ࣪ ⁞ status : *@status*\n" +
          "    ׅ ׄ ⊱  ֵ ─ׅ─๋┈︪─ׄ─ׅ┈ ׄ ⚶  ׅ┈ׅ─︪ׄ─┈ׅ─๋─   ֵ⊰\n" +
          "      *𖣁.   _pesanan sedang diproses, mohon tunggu_*\n" +
          "    ׅ ׄ ⊱  ֵ ─ׅ─๋┈︪─ׄ─ׅ┈ ׄ ⚶  ׅ┈ׅ─︪ׄ─┈ׅ─๋─   ֵ⊰"
          
          let res = await orderFunc(text, b, orderan, 'proses')
        return reply(res, { mentions: [b] })
      }
    }
  )
}