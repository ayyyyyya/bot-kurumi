const { WAMessageStubType: StubType } = 'baileys'.import();
const fs = 'fs'.import();
let infos = Data.infos;

export default async function stub({ Exp, cht, ev, is }) {
  switch (cht?.messageStubType) {
    case StubType.GROUP_PARTICIPANT_ADD:
      {
        if (!Data.preferences[cht.id]?.welcome) return;
        let newMember = await Promise.all(
          cht.messageStubParameters?.map(async (a) => {
            return await Exp.func.getSender(a, { cht });
          }) || []
        );
        
        let members = newMember.map((a) => `@${a.split('@')[0]}`).join(', ');
        let group = await Exp.groupMetadata(cht.id);
        let pp;
        try {
          pp = await Exp.profilePictureUrl(newMember[0]);
        } catch {
          pp = 'https://files.catbox.moe/7e4y9f.jpg';
        }
        let text = (Data.preferences[cht.id]?.welcomeCard?.welcome[0] || `\`[ WELCOME ]\`\n\nHaii bujang @user, selamat bergabung`).replace('@user', members);

        if (cfg.welcome == 'text') {
          cht.reply(
            text,
            { mentions: newMember },
            { quoted: Data.fquoted?.welcome }
          );
        } else if (cfg.welcome == 'linkpreview') {
          let welcome = {
            text,

            contextInfo: {
              externalAdReply: {
                title:
                  'Haiii ' + newMember.map((a) => Exp.func.getName(a)).join(', '),
                body: `Welcome to ${group.subject}`,
                thumbnailUrl: pp,
                sourceUrl: cfg.gcurl,
                mediaUrl: `http://ẉa.me/${owner[0]}/${Math.floor(Math.random() * 100000000000000000)}`,
                renderLargerThumbnail: true,
                showAdAttribution: true,
                mediaType: 1,
              },
              forwardingScore: 1,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: cfg.chId.newsletterJid,
                newsletterName: cfg.chId.newsletterName,
                //serverMessageId: 152,
              },
              mentionedJid: newMember,
            },
          };
          await Exp.sendMessage(cht.id, welcome, {
            quoted: Data.fquoted?.welcome,
          });
        } else if (cfg.welcome == 'image') {
          let welcome = {
            image: { url: pp },
            mentions: newMember,
            caption: text,
          };
          await Exp.sendMessage(cht.id, welcome, {
            quoted: Data.fquoted?.welcome,
          });
        } else if (cfg.welcome == 'order') {
          Exp.relayMessage(
            cht.id,
            {
              orderMessage: {
                orderId: '530240676665078',
                status: 'INQUIRY',
                surface: 'CATALOG',
                ItemCount: 0,
                message: `Haiii ${members}`,
                totalCurrencyCode: `Welcome to ${group.subject}`,
                sellerJid: `${owner[0]}@s.whatsapp.net`,
                token: 'AR6oiV5cQjZsGfjvfDwl0DXfnAE+OPRkWAQtFDaB9wxPlQ==',
                thumbnail: await Buffer.from(
                  await fetch(pp).then((a) => a.arrayBuffer())
                ).toString('base64'),
              },
            },
            {}
          );
        } else if (cfg.welcome == 'product') {
          Exp.relayMessage(
            cht.id,
            {
              productMessage: {
                product: {
                  productImage: await Exp.func.uploadToServer(pp),
                  productId: '8080277038663215',
                  title: `Haiii ${members}`,
                  description: `Haiii ${members}`,
                  currencyCode: `${botnickname}`,
                  priceAmount1000: `Welcome to ${group.subject}`,
                  productImageCount: 8,
                },
                businessOwnerJid: `${owner[0]}@s.whatsapp.net`,
                contextInfo: {
                  expiration: 86400,
                  ephemeralSettingTimestamp: '1723572108',
                  disappearingMode: {
                    initiator: 'CHANGED_IN_CHAT',
                    trigger: 'ACCOUNT_SETTING',
                  },
                },
              },
            },
            {}
          );
        } else {
          let welcome = {
            text,
            mentions: newMember,
            contextInfo: {
              externalAdReply: {
                title:
                  'Haiii ' + newMember.map((a) => Exp.func.getName(a)).join(', '),
                body: `Welcome to ${group.subject}`,
                thumbnailUrl: pp,
                sourceUrl: cfg.gcurl,
                mediaUrl: `http://ẉa.me/${owner[0]}/${Math.floor(Math.random() * 100000000000000000)}`,
                renderLargerThumbnail: true,
                showAdAttribution: true,
                mediaType: 1,
              },
              forwardingScore: 1,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: cfg.chId.newsletterJid,
                newsletterName: cfg.chId.newsletterName,
                //serverMessageId: 152,
              },
            },
          };
          await Exp.sendMessage(cht.id, welcome, {
            quoted: Data.fquoted?.welcome,
          });
        }

        Data.audio?.welcome?.length > 0 &&
          Exp.sendMessage(
            cht.id,
            {
              audio: { url: Data.audio.welcome.getRandom() },
              mimetype: 'audio/mpeg',
            },
            { quoted: Data.fquoted?.welcome }
          );
      }
      break;

    case StubType.GROUP_PARTICIPANT_REMOVE:
    case StubType.GROUP_PARTICIPANT_LEAVE:
      {
        let oldMember = await Promise.all(
          cht.messageStubParameters?.map(async (a) => {
            return await Exp.func.getSender(a, { cht });
          }) || []
        );
        if (oldMember.includes(Exp.number)) {
          delete Data.preferences[cht.id];
          return;
        }
        if (!Data.preferences[cht.id]?.welcome) return;
        let members = oldMember.map((a) => `@${a?.split('@')[0]}`).join(', ');
        let group = await Exp.groupMetadata(cht.id);
        let pp;
        try {
          pp = await Exp.profilePictureUrl(oldMember[0]);
        } catch {
          pp = 'https://files.catbox.moe/7e4y9f.jpg';
        }
        let text = (Data.preferences[cht.id]?.welcomeCard?.bye[0] || `\`[ BYE BYE ]\`\n\nDadahh bujang @user, jangan balik lagi`).replace('@user', members);

        cfg.welcome = cfg?.welcome || 'linkpreview';

        if (cfg.welcome == 'text') {
          cht.reply(
            text,
            { mentions: oldMember },
            { quoted: Data.fquoted?.welcome }
          );
        } else if (cfg.welcome == 'linkpreview') {
          let welcome = {
            text,
            contextInfo: {
              externalAdReply: {
                title:
                  'See you next time ' +
                  oldMember.map((a) => Exp.func.getName(a)).join(', '),
                body: `${group.subject}`,
                thumbnailUrl: pp,
                sourceUrl: cfg.gcurl,
                mediaUrl: `http://ẉa.me/${owner[0]}/${Math.floor(Math.random() * 100000000000000000)}`,
                renderLargerThumbnail: true,
                showAdAttribution: true,
                mediaType: 1,
              },
              forwardingScore: 1,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: cfg.chId.newsletterJid,
                newsletterName: cfg.chId.newsletterName,
                //serverMessageId: 152,
              },
              mentionedJid: oldMember,
            },
          };
          await Exp.sendMessage(cht.id, welcome, {
            quoted: Data.fquoted?.welcome,
          });
        } else if (cfg.welcome == 'image') {
          let welcome = {
            image: { url: pp },
            mentions: oldMember,
            caption: text,
          };
          await Exp.sendMessage(cht.id, welcome, {
            quoted: Data.fquoted?.welcome,
          });
        } else if (cfg.welcome == 'order') {
          Exp.relayMessage(
            cht.id,
            {
              orderMessage: {
                orderId: '530240676665078',
                status: 'INQUIRY',
                surface: 'CATALOG',
                ItemCount: 0,
                message: `See you next time ${members}`,
                totalCurrencyCode: `${group.subject}`,
                sellerJid: `${owner[0]}@s.whatsapp.net`,
                token: 'AR6oiV5cQjZsGfjvfDwl0DXfnAE+OPRkWAQtFDaB9wxPlQ==',
                thumbnail: await Buffer.from(
                  await fetch(pp).then((a) => a.arrayBuffer())
                ).toString('base64'),
              },
            },
            {}
          );
        } else if (cfg.welcome == 'product') {
          Exp.relayMessage(
            cht.id,
            {
              productMessage: {
                product: {
                  productImage: await Exp.func.uploadToServer(pp),
                  productId: '8080277038663215',
                  title: `Haii ${members}`,
                  description: `See you next time${members}`,
                  currencyCode: `${botnickname}`,
                  priceAmount1000: `${group.subject}`,
                  productImageCount: 8,
                },
                businessOwnerJid: `${owner[0]}@s.whatsapp.net`,
                contextInfo: {
                  expiration: 86400,
                  ephemeralSettingTimestamp: '1723572108',
                  disappearingMode: {
                    initiator: 'CHANGED_IN_CHAT',
                    trigger: 'ACCOUNT_SETTING',
                  },
                },
              },
            },
            {}
          );
        } else {
          let welcome = {
            text,
            mentions: oldMember,
            contextInfo: {
              externalAdReply: {
                title:
                  'See you next time ' +
                  oldMember.map((a) => Exp.func.getName(a)).join(', '),
                body: `${group.subject}`,
                thumbnailUrl: pp,
                sourceUrl: cfg.gcurl,
                mediaUrl: `http://ẉa.me/${owner[0]}/${Math.floor(Math.random() * 100000000000000000)}`,
                renderLargerThumbnail: true,
                showAdAttribution: true,
                mediaType: 1,
              },
              forwardingScore: 1,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: cfg.chId.newsletterJid,
                newsletterName: cfg.chId.newsletterName,
                //serverMessageId: 152,
              },
            },
          };
          await Exp.sendMessage(cht.id, welcome, {
            quoted: Data.fquoted?.welcome,
          });
        }

        Data.audio?.leave?.length > 0 &&
          Exp.sendMessage(
            cht.id,
            {
              audio: { url: Data.audio.leave.getRandom() },
              mimetype: 'audio/mpeg',
            },
            { quoted: Data.fquoted?.welcome }
          );
      }
      break;
      
    case StubType.GROUP_PARTICIPANT_PROMOTE: 
      {
        let promoted = await Promise.all(
          cht.messageStubParameters?.map(async (a) => {
            return await Exp.func.getSender(a, { cht })
          }) || []
        );

        if (promoted.includes(Exp.number)) {
          let group = await Exp.groupMetadata(cht.id);
  
          await Exp.sendMessage(cht.id, {
            text: "┈─꯭─꯭ֺ─┈\n" +
            "  𖦹.ᐟ 𝚂𝚃𝙰𝚃𝚄𝚂 𝙱𝙾𝚃\n" +
            "┈─꯭─꯭ֺ─┈\n\n" +
            `*${botname}* telah di promote menjadi admin…\n\n` +
            "Sekarang aku admin di grup:\n" +
            `「 ${group.subject} 」\n\n` +
            "   (｡˃ ᵕ ˂ )♥︎\n" +
            "  terima kasih sudah percaya sama aku\n" +
            "        ೀ",
            contextInfo: {
              externalAdReply: {
                title: `${botname} telah menjadi admin`,
                body: "",
                thumbnail: fs.readFileSync(fol[3] + 'bell.jpg'),
                sourceUrl: "",
                mediaUrl: "",
                renderLargerThumbnail: true,
                showAdAttribution: true,
                mediaType: 1,
              },
              forwardingScore: 1,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: cfg.chId.newsletterJid,
                newsletterName: cfg.chId.newsletterName
              }
            }
          });
        } else {
          let members = promoted.map(a => `@${a.split('@')[0]}`).join(', ');
          
          let text = "📣 `INFORMASI`\n\n" +
          `Kini ${members} telah menjadi admin grup ini, kalian harus sungkan sama dia🗿`
          
          await Exp.sendMessage(cht.id, {
            text,
            contextInfo: {
              mentionedJid: promoted,
              forwardingScore: 1,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: cfg.chId.newsletterJid,
                newsletterName: cfg.chId.newsletterName,
              }
            }
          });
        }
      }
      break;

    case StubType.GROUP_PARTICIPANT_DEMOTE: 
      {
        let demoted = await Promise.all(
          cht.messageStubParameters?.map(async (a) => {
            return await Exp.func.getSender(a, { cht })
          }) || []
        );

        if (demoted.includes(Exp.number)) {
          let group = await Exp.groupMetadata(cht.id);

          await Exp.sendMessage(cht.id, {
            text: "┈─꯭─꯭ֺ─┈\n" +
            "  𖦹.ᐟ 𝚂𝚃𝙰𝚃𝚄𝚂 𝙱𝙾𝚃\n" +
            "┈─꯭─꯭ֺ─┈\n\n" +
            `*${botname}* telah di demote oleh admin…\n\n` +
            "Status admin dicabut di grup:\n" +
            `「 \`${group.subject}\` 」\n\n` +
            "ට  mohon jadikan bot admin kembali yaa, biar aku bisa jaga grup nya hehe~\n" +
            " ೀ",
            contextInfo: {
              externalAdReply: {
                title: `${botname} bukan admin lagi`,
                body: "",
                thumbnail: fs.readFileSync(fol[3] + 'bell.jpg'),
                sourceUrl: "",
                mediaUrl: "",
                renderLargerThumbnail: true,
                showAdAttribution: true,
                mediaType: 1,
              },
              forwardingScore: 1,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: cfg.chId.newsletterJid,
                newsletterName: cfg.chId.newsletterName
              }
            }
          });
        } else {
          let members = demoted.map(a => `@${a.split('@')[0]}`).join(', ');

          let text = "📣 `INFORMASI`\n\n" +
          `Kini ${members} bukan admin lagi, ga usah sungkan lagi sama dia🗿`

          await Exp.sendMessage(cht.id, {
            text,
            contextInfo: {
              mentionedJid: demoted,
              forwardingScore: 1,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: cfg.chId.newsletterJid,
                newsletterName: cfg.chId.newsletterName,
              }
            }
          });
        }
      }
      break;

    case StubType.GROUP_CHANGE_INVITE_LINK:
      {
        if (!is.botAdmin) return;
        let group = await Exp.groupMetadata(cht.id);
        let memb = group.participants.map(a => a.id)
        let code = await Exp.groupInviteCode(cht.id);
        let newLink = `https://chat.whatsapp.com/${code}`;

        let text = "┈─꯭─꯭ֺ─┈\n" +
        "  𖦹.ᐟ 𝙶𝚁𝙾𝚄𝙿 𝚄𝙿𝙳𝙰𝚃𝙴\n" +
        "┈─꯭─꯭ֺ─┈\n\n" +
        `Link grup ini telah diubah\n\n` +
        `🔗 Link baru:\n${newLink}\n\n` +
        "Link grup telah di-reset oleh admin.\n" +
        "Pastikan pakai link terbaru yaa~\n" +
        "﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏";

        await Exp.sendMessage(cht.id, {
          text,
          contextInfo: {
            mentionedJid: memb,
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: cfg.chId.newsletterJid,
              newsletterName: cfg.chId.newsletterName,
            },
          },
        });
      }
      break;
     
  }
}