/*!-======[ Module Imports ]======-!*/
const fs = "fs".import()

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
    let { sender, id } = cht
    let { func } = Exp 

/*=========[ CREDITS BARZZ ]=========*/
// JAGAN DI HAPUS NANTI BARR NGAMBEK
// •• Elaina number (6282396640727)
// •• Barr number (6282238228919)
// •• kalau punya ide fitur hubungi Barr aja🤭
/*=========[ AWAS JATOH ]=========*/

const Barr = cfg.bar;

function emojiBool(value) {
  return value === true ? '✅' : value === false ? '❌' : value;
}

ev.on({
  cmd: ['stalkig','stalktt','stalktwit','stalkyt'],
  listmenu: ['stalkig ℗','stalktt ℗','stalktwit ℗','stalkyt ℗'],
  tag: "stalking",
  premium: true,
  energy: 55,
  args: "*❗ Masukkan username-nya*"
}, async ({ cht, args }) => {
  if (cht.cmd === "stalktt") {
     try { 
        const res = await fetch(`https://api.botcahx.eu.org/api/stalk/tt?username=${encodeURIComponent(args)}&apikey=${Barr}`);
     
        const json = await res.json();
     
        if (!json.status || !json.result) {
           return cht.reply("👾 Gagal mengambil data akun tersebut, mungkin apinnya *Error*");
        }
     
        const {
          profile,
          username,
          description,
          likes,
          followers,
          following,
          totalPosts
        } = json.result;
     
        const teks = `\n\`[ TIKTOK STALKING ]\`\n\`\`\`\n• Nama       : ${username}\n• Bio        : ${description}\n• Like       : ${likes}\n\n• Pengikut   : ${followers}\n• Diikuti    : ${following}\n\n⊹₊⋆ Total Postingan ⋆₊⊹\n- ${totalPosts}\n\`\`\`\n───────────────\n`.trim();

        await Exp.sendMessage(cht.id, {
          text: teks,
           contextInfo: {
             externalAdReply: {
                title: `Stalking Sosmed 🙈`,
                body: `© Alya AI`,
                thumbnail: fs.readFileSync(fol[10] + 'tiktok.jpg'),
                mediaUrl: cfg.gcurl,
                sourceUrl: `https://www.tiktok.com/@${username}`,
                renderLargerThumbnail: false,
                showAdAttribution: true,
                mediaType: 2,
             },
             forwardingScore: 1999,
             isForwarded: true,
           }
        }, { quoted: cht });

    } catch (err) {
       console.error(err);
       return cht.reply(`Gagal mengambil data akun tersebut\n\n• *Error:*\n${err.message}\n\n> Segera lapor ke owner`);
    }
    
  } else if (cht.cmd === "stalkig") {
     try {
        const res = await fetch (`https://api.botcahx.eu.org/api/stalk/ig?username=${encodeURIComponent(args)}&apikey=${Barr}`);
    
        const json = await res.json();
     
        if (!json.status || !json.result) {
           return cht.reply("👾 Gagal mengambil data akun tersebut, mungkin apinnya *Error*");
        }
    
        const {
           username,
           fullName,
           bio,
           followers,
           following,
           postsCount,
           photoUrl
        } = json.result;
   
        const teks = `\n\`[ INSTAGRAM STALKING ]\`\n\`\`\`\n• User Name    : ${username}\n• Full Name    : ${fullName}\n• Bio          :\n- ${bio || 'No Bio'}\n\n• Pengikut     : ${followers}\n• Diikuti      : ${following}\n\n⊹₊⋆ Total Postingan ⋆₊⊹\n- ${postsCount}\n\`\`\`\n─────────────────\n`.trim();

        await Exp.sendMessage(cht.id, {
          text: teks,
           contextInfo: {
             externalAdReply: {
                title: `Stalking Sosmed 🙈`,
                body: `© Alya AI`,
                thumbnailUrl: photoUrl,
                mediaUrl: cfg.gcurl,
                sourceUrl: `https://www.instagram.com/@${username}`,
                renderLargerThumbnail: false,
                showAdAttribution: true,
                mediaType: 2,
             },
             forwardingScore: 1999,
             isForwarded: true,
           }
        }, { quoted: cht });
     
    } catch (err) {
       console.error(err);
       return cht.reply(`Gagal mengambil data akun tersebut\n\n• *Error:*\n${err.message}\n\n> Segera lapor ke owner`);
    }
    
  } else if (cht.cmd === "stalktwit") {
    try {
        const res = await fetch(`https://api.botcahx.eu.org/api/stalk/twitter?username=${encodeURIComponent(args)}&apikey=${Barr}`);
       
        const json = await res.json();

        if (!json.status || !json.result) {
           return cht.reply("👾 Gagal mengambil data akun tersebut, mungkin apinnya *Error*");
        }
        
        const {
          profileImage,
          bio,
          id,
          fullName,
          follower,
          following,
          totalPosts,
          favoritCount,
          createdAt,
          location
        } = json.result;

        const teks = `\n\`[ TWITTER STALKING ]\`\n\`\`\`\n• Nama       : ${fullName}\n• Id         : ${id}\n• Bio        :\n- ${bio || 'No Bio'}\n\n• Pengikut   : ${follower}\n• Diikuti    : ${following}\n\n• Favorit    : ${favoritCount}\n• Dibuat     :\n- ${createdAt}\n\n• Lokasi     :\n- ${location}\n\`\`\`\n─────────────────\n`.trim();
        
        await Exp.sendMessage(cht.id, {
          text: teks,
           contextInfo: {
             externalAdReply: {
                title: `Stalking Sosmed 🙈`,
                body: `© Alya AI`,
                thumbnail: fs.readFileSync(fol[10] + 'twitter.jpg'),
                mediaUrl: cfg.gcurl,
                sourceUrl: `https://wa.me/6282238228919`,
                renderLargerThumbnail: false,
                showAdAttribution: true,
                mediaType: 2,
             },
             forwardingScore: 1999,
             isForwarded: true,
           }
        }, { quoted: cht });

    } catch (err) {
       console.error(err);
       return cht.reply(`Gagal mengambil data akun tersebut\n\n• *Error:*\n${err.message}\n\n> Segera lapor ke owner`);
    }
    
  } else {
    try {
        const res = await fetch(`https://api.botcahx.eu.org/api/stalk/yt?username=${encodeURIComponent(args)}&apikey=${Barr}`);
        
        const json = await res.json();

        if (!json.status || !json.result.data[0]) {
           return cht.reply("👾 Gagal mengambil data akun tersebut, mungkin apinnya *Error*");
        }
        
        const {
          channelId,
          channelName,
          avatar,
          isVerified,
          subscriberH,
          subscriber,
          description
        } = json.result.data[0];
        
        const statusVerif = emojiBool(isVerified);
        const teks = `\n\`[ YOUTUBE STALKING ]\`\n\`\`\`\n• Nama          : ${channelName}\n• Id            : ${channelId}\n• Verified      : ${statusVerif}\n\n• Subscriber    : ${subscriber}\n• Deskripsi     :\n- ${description || 'No Bio'}\n\`\`\`\n─────────────────\n`.trim();
        
        await Exp.sendMessage(cht.id, {
          text: teks,
           contextInfo: {
             externalAdReply: {
                title: `Stalking Sosmed 🙈`,
                body: `© Alya AI`,
                thumbnailUrl: avatar,
                mediaUrl: cfg.gcurl,
                sourceUrl: `https://wa.me/${owner[0]}`,
                renderLargerThumbnail: false,
                showAdAttribution: true,
                mediaType: 2,
             },
             forwardingScore: 1999,
             isForwarded: true,
           }
        }, { quoted: cht });
        
    } catch (err) {
       console.error(err);
       return cht.reply(`Gagal mengambil data akun tersebut\n\n• *Error:*\n${err.message}\n\n> Segera lapor ke owner`);
    }
    
  }
  
});
}