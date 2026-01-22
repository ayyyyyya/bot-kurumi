export default async function on({ cht, Exp, store, ev, is }) {
    const { sender, id, reply, edit } = cht;
    const { func } = Exp;
    
    const {
        emoji_role,
        sesi,
        playerOnGame,
        playerOnRoom,
        playerExit,
        dataPlayer,
        dataPlayerById,
        getPlayerById,
        getPlayerById2,
        killWerewolf,
        killww,
        dreamySeer,
        sorcerer,
        tembakSeriff,
        protectGuardian,
        roleShuffle,
        roleChanger,
        roleAmount,
        roleGenerator,
        addTimer,
        startGame,
        playerHidup,
        playerMati,
        vote,
        voteResult,
        clearAllVote,
        getWinner,
        win,
        pagi,
        malam,
        skill,
        voteStart,
        voteDone,
        voting,
        run,
        run_vote,
        run_malam,
        run_pagi
    } = await (fol[2] + 'werewolf.js').r()

    const thumb =
    "https://files.catbox.moe/lt87sa.jpg";
    
ev.on({
  cmd: ['ww', 'werewolf'],
  listmenu: ['werewolf'],
  tag: 'fun'
}, async ({ cht, args }) => {
 
     Exp.werewolf = Exp.werewolf ?? {}
     let ww = Exp.werewolf

     const [command, nomor] = args.split(' ')
     const value = command.toLowerCase()
     const target = parseInt(nomor)
  
    // [ Membuat Room ]
    if (value === "create") {
        if (id in ww) return reply("Group masih dalam sesi permainan");
        if (playerOnGame(sender, ww) === true)
            return reply("Kamu masih dalam sesi game");
        ww[id] = {
            room: id,
            owner: sender,
            status: false,
            iswin: null,
            cooldown: null,
            day: 0,
            time: "malem",
            player: [],
            dead: [],
            voting: false,
            seer: false,
            guardian: [],
        };
        await reply("Room berhasil dibuat, ketik *.ww join* untuk bergabung");

    } else if (value === "join") {
        if (!ww[id]) return reply("Belum ada sesi permainan");
        if (ww[id].status === true)
            return reply("Sesi permainan sudah dimulai");
        if (ww[id].player.length > 16)
            return reply("Maaf jumlah player telah penuh");
        if (playerOnRoom(sender, id, ww) === true)
            return reply("Kamu sudah join dalam room ini");
        if (playerOnGame(sender, ww) === true)
            return reply("Kamu masih dalam sesi game");
        let data = {
            id: sender,
            number: ww[id].player.length + 1,
            sesi: id,
            status: false,
            role: false,
            effect: [],
            vote: 0,
            isdead: false,
            isvote: false,
        };
        ww[id].player.push(data);
        let player = [];
        let text = `\n*⌂ W E R E W O L F - P L A Y E R*\n\n`;
        for (let i = 0; i < ww[id].player.length; i++) {
            text += `${ww[id].player[i].number}) @${ww[id].player[i].id.replace(
          "@s.whatsapp.net",
          ""
        )}\n`;
            player.push(ww[id].player[i].id);
        }
        text += "\nJumlah player minimal adalah 5 dan maximal 15";
        Exp.sendMessage(
            cht.id, {
                text: text.trim(),
                contextInfo: {
                    externalAdReply: {
                        title: "W E R E W O L F",
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        thumbnailUrl: thumb,
                        sourceUrl: "",
                        mediaUrl: thumb,
                    },
                    mentionedJid: player,
                },
            }, {
                quoted: cht
            }
        );

        // [ Game Play ]
    } else if (value === "start") {
        if (!ww[id]) return reply("Belum ada sesi permainan");
        if (ww[id].player.length === 0)
            return reply("Room belum memiliki player");
        if (ww[id].player.length < 5)
            return reply("Maaf jumlah player belum memenuhi syarat");
        if (playerOnRoom(sender, id, ww) === false)
            return reply("Kamu belum join dalam room ini");
        if (ww[id].cooldown > 0) {
            if (ww[id].time === "voting") {
                clearAllVote(id, ww);
                addTimer(id, ww);
                return await run_vote(Exp, id, ww);
            } else if (ww[id].time === "malem") {
                clearAllVote(id, ww);
                addTimer(id, ww);
                return await run_malam(Exp, id, ww);
            } else if (ww[id].time === "pagi") {
                clearAllVote(id, ww);
                addTimer(id, ww);
                return await run_pagi(Exp, id, ww);
            }
        }
        if (ww[id].status === true)
            return reply("Sesi permainan telah dimulai");
        if (ww[id].owner !== sender)
            return reply(
                `Hanya pemain yang membuat room yang dapat memulai permainan`);
        let list1 = "";
        let list2 = "";
        let player = [];
        roleGenerator(id, ww);
        addTimer(id, ww);
        startGame(id, ww);
        for (let i = 0; i < ww[id].player.length; i++) {
            list1 += `(${ww[id].player[i].number}) @${ww[id].player[
          i
        ].id.replace("@s.whatsapp.net", "")}\n`;
            player.push(ww[id].player[i].id);
        }
        for (let i = 0; i < ww[id].player.length; i++) {
            list2 += `(${ww[id].player[i].number}) @${ww[id].player[
          i
        ].id.replace("@s.whatsapp.net", "")} ${
          ww[id].player[i].role === "werewolf" ||
          ww[id].player[i].role === "sorcerer"
            ? `[${ww[id].player[i].role}]`
            : ""
        }\n`;
            player.push(ww[id].player[i].id);
        }
        for (let i = 0; i < ww[id].player.length; i++) {
            // [ Werewolf ]
            if (ww[id].player[i].role === "werewolf") {
                if (ww[id].player[i].isdead != true) {
                    var text = `Hai ${func.getName(
              ww[id].player[i].id
            )}, Kamu telah dipilih untuk memerankan *Werewolf* ${emoji_role(
              "werewolf"
            )} pada permainan kali ini, silahkan pilih salah satu player yang ingin kamu makan pada malam hari ini\n\n\`[ LIST PLAYER ]\`\n${list2}\nKetik *.wwpc kill nomor* untuk membunuh player`;                 
                    await Exp.sendMessage(ww[id].player[i].id, {
                        text: text,
                        mentions: player,
                    });
                }
              // [ Jester ]
            } else if (ww[id].player[i].role === "jester") {
                if (ww[id].player[i].isdead != true) {
                    let text = `Hai ${func.getName(ww[id].player[i].id)}, Kamu adalah seorang *Jester* ${emoji_role("jester")} dalam game ini. Tujuanmu adalah membuat warga mencurigaimu dan menggantungmu melalui voting. Jika kamu berhasil *dieksekusi oleh warga* saat voting, kamu menang sendiri\n\n[ LIST PLAYER ]\`\n${list1}\nPintar lah dalam melakukan acting agar warga memilih mu dalam voting nanti`;

                    await Exp.sendMessage(ww[id].player[i].id, {
                        text: text,
                        mentions: player,
                    });
                }
                
                // [ seriff ]
            } else if (ww[id].player[i].role === "seriff") {
                if (ww[id].player[i].isdead != true) {
                    let text = `Hai ${func.getName(ww[id].player[i].id)}, Kamu adalah seorang *seriff* ${emoji_role("seriff")}, tugas kamu adalah menebak siapa werewolf atau jester nya, jika sasaran kamu salah maka sebagai ganti nya kamu yang hakal mati\n\n[ LIST PLAYER ]\`\n${list1}\nKetik *.wwpc shoot nomor* untuk menembak yang kamu anggap werewolf`;

                    await Exp.sendMessage(ww[id].player[i].id, {
                        text: text,
                        mentions: player,
                    });
                }
                
                // [ villager ]
            } else if (ww[id].player[i].role === "warga") {
                if (ww[id].player[i].isdead != true) {
                    let text = `*⌂ W E R E W O L F - G A M E*\n\nHai ${func.getName(
              ww[id].player[i].id
            )} Peran kamu adalah *Warga Desa* ${emoji_role(
              "warga"
            )}, tetap waspada, mungkin *Werewolf* akan memakanmu malam ini, silakan masuk kerumah masing masing.\n\n\`[ LIST PLAYER ]\`\n${list1}`;
                    await Exp.sendMessage(ww[id].player[i].id, {
                        text: text,
                        mentions: player,
                    });
                }

                // [ Penerawangan ]
            } else if (ww[id].player[i].role === "seer") {
                if (ww[id].player[i].isdead != true) {
                    let text = `Hai ${func.getName(
              ww[id].player[i].id
            )} Kamu telah terpilih  untuk menjadi *Penerawang* ${emoji_role(
              "seer"
            )}. Dengan sihir yang kamu punya, kamu bisa mengetahui peran pemain pilihanmu.\n\n\`[ LIST PLAYER ]\`\n${list1}\nKetik *.wwpc dreamy nomor* untuk melihat role player`;
                 
                    await Exp.sendMessage(ww[id].player[i].id, {
                        text: text,
                        mentions: player,
                    });
                }

                // [ Guardian ]
            } else if (ww[id].player[i].role === "guardian") {
                if (ww[id].player[i].isdead != true) {
                    let text = `Hai ${func.getName(
              ww[id].player[i].id
            )} Kamu terpilih untuk memerankan *Malaikat Pelindung* ${emoji_role(
              "guardian"
            )}, dengan kekuatan yang kamu miliki, kamu bisa melindungi para warga, silahkan pilih salah 1 player yang ingin kamu lindungi\n\n\`[ LIST PLAYER ]\`\n${list1}\nKetik *.wwpc deff nomor* untuk melindungi player`;
                 
                    await Exp.sendMessage(ww[id].player[i].id, {
                        text: text,
                        mentions: player,
                    });
                }

                // [ Sorcerer ]
            } else if (ww[id].player[i].role === "sorcerer") {
                if (ww[id].player[i].isdead != true) {
                    let text = `Hai ${func.getName(
              ww[id].player[i].id
            )} Kamu terpilih sebagai Penyihir ${emoji_role(
              "sorcerer"
            )}, dengan kekuasaan yang kamu punya, kamu bisa membuka identitas para player, silakan pilih 1 orang yang ingin kamu buka identitasnya\n\n\`[ LIST PLAYER ]\`\n${list2}\nKetik *.wwpc sorcerer nomor* untuk melihat role player`;
                
                    await Exp.sendMessage(ww[id].player[i].id, {
                        text: text,
                        mentions: player,
                    });
                }
            }
        }
        await Exp.sendMessage(cht.id, {
            text: "*⌂ W E R E W O L F - G A M E*\n\nGame telah dimulai, para player akan memerankan perannya masing masing, silahkan cek chat pribadi untuk melihat role kalian. Berhati-hatilah para warga, mungkin malam ini adalah malah terakhir untukmu",
            contextInfo: {
                externalAdReply: {
                    title: "W E R E W O L F",
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    thumbnailUrl: thumb,
                    sourceUrl: "",
                    mediaUrl: thumb,
                },
                mentionedJid: player,
            },
        });
        await run(Exp, id, ww);
    } else if (value === "vote") {
        if (!ww[id]) return reply("Belum ada sesi permainan");
        if (ww[id].status === false)
            return reply("Sesi permainan belum dimulai");
        if (ww[id].time !== "voting")
            return reply("Sesi voting belum dimulai");
        if (playerOnRoom(sender, id, ww) === false)
            return reply("Kamu bukan player");
        if (dataPlayer(sender, ww).isdead === true)
            return reply("Kamu sudah mati");
        if (!target || target.length < 1)
            return reply("Masukan nomor player");
        if (isNaN(target)) return reply("Gunakan hanya nomor");
        if (dataPlayer(sender, ww).isvote === true)
            return reply("Kamu sudah melakukan voting");
        let b = getPlayerById(id, sender, parseInt(target), ww);
        if (b.db.isdead === true)
            return reply(`Player @${targetId} sudah mati.`);
        if (ww[id].player.length < parseInt(target))
            return reply("Invalid");
        if (getPlayerById(id, sender, parseInt(target), ww) === false)
            return reply("Player tidak terdaftar!");
        vote(id, parseInt(target), sender, ww);
        Exp.sendMessage(cht.id, {
            react: {
                text: '✅',
                key: cht.key,
            }
        })
    } else if (value == "exit") {
        if (!ww[id]) return reply("Tidak ada sesi permainan");
        if (playerOnRoom(sender, id, ww) === false)
            return reply("Kamu tidak dalam sesi permainan");
        if (ww[id].status === true)
            return reply("Permainan sudah dimulai, kamu tidak bisa keluar");
        reply(`@${sender.split("@")[0]} Keluar dari permainan`, {
            withTag: true,
        });
        playerExit(id, sender, ww);
    } else if (value === "delete") {
        if (!ww[id]) return reply("Tidak ada sesi permainan");
        if (ww[id].owner !== sender)
            return reply(
                `Hanya @${
            ww[id].owner.split("@")[0]
          } yang dapat menghapus sesi permainan ini`
            );
        reply("Sesi permainan berhasil dihapus").then(() => {
            delete ww[id];
        });
    } else if (value === "player") {
        if (!ww[id]) return reply("Tidak ada sesi permainan");
        if (playerOnRoom(sender, id, ww) === false)
            return reply("Kamu tidak dalam sesi permainan");
        if (ww[id].player.length === 0)
            return reply("Sesi permainan belum memiliki player");
        let player = [];
        let text = "\n*⌂  W E R E W O L F - G A M E*\n\nLIST PLAYER:\n";
        for (let i = 0; i < ww[id].player.length; i++) {
            text += `(${ww[id].player[i].number}) @${ww[id].player[i].id.replace(
          "@s.whatsapp.net",
          ""
        )} ${
          ww[id].player[i].isdead === true
            ? `☠️ ${ww[id].player[i].role}`
            : ""
        }\n`;
            player.push(ww[id].player[i].id);
        }
        Exp.sendMessage(
            cht.id, {
                text: text,
                contextInfo: {
                    externalAdReply: {
                        title: "W E R E W O L F",
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        thumbnailUrl: thumb,
                        sourceUrl: "",
                        mediaUrl: thumb,
                    },
                    mentionedJid: player,
                },
            }, {
                quoted: cht
            }
        );
    } else {
        let text = `\n*⌂ W E R E W O L F - G A M E*\n\nPermainan Sosial Yang Berlangsung Dalam Beberapa Putaran/ronde. Para Pemain Dituntut Untuk Mencari Seorang Penjahat Yang Ada Dipermainan. Para Pemain Diberi Waktu, Peran, Serta Kemampuannya Masing-masing Untuk Bermain Permainan Ini\n\n*⌂  C O M M A N D*\n`;
        text += ` • ww create\n`;
        text += ` • ww join\n`;
        text += ` • ww start\n`;
        text += ` • ww exit\n`;
        text += ` • ww delete\n`;
        text += ` • ww player\n`;
        text += `\nPermainan ini dapat dimainkan oleh 5 sampai 15 orang.`;
        Exp.sendMessage(
            cht.id, {
                text: text.trim(),
                contextInfo: {
                    externalAdReply: {
                        title: "W E R E W O L F",
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        thumbnailUrl: thumb,
                        sourceUrl: "",
                        mediaUrl: thumb,
                    },
                },
            }, {
                quoted: cht
            }
        );
        
    }
    
})

ev.on({
  cmd: ['wwpc']
}, async ({args, cht}) => {

  if (cht.id.endsWith('@g.us')) {
    return cht.reply(`Perintah ini cuma bisa di akses di private message!`)
  }
  
  Exp.werewolf = Exp.werewolf ?? {}
  let ww = Exp.werewolf

  const [command, nomor] = args.split(' ')
  const value = command.toLowerCase()
  const target = parseInt(nomor)
     
  if (!value || isNaN(target)) return cht.reply(`⚠️ Gunakan format: .ww [kill|dreamy|deff|sorcerer|shoot] [nomorPlayer]`)

  if (!playerOnGame(sender, ww)) return cht.reply("❌ Kamu tidak dalam sesi game")
  const player = dataPlayer(sender, ww)
  if (player.isdead) return cht.reply("💀 Kamu sudah mati")
  if (player.status) return cht.reply("❌ Skill hanya bisa digunakan sekali per malam")

  const byId = getPlayerById2(sender, target, ww)
  if (!byId || !byId.db) return cht.reply("❌ Player tidak ditemukan")
  if (byId.db.id === sender) return cht.reply("❌ Tidak bisa menargetkan diri sendiri")
  if (byId.db.isdead) return cht.reply("☠️ Player tersebut sudah mati")

  if (value === "kill") {
    if (player.role !== "werewolf") return cht.reply("❌ Peran ini bukan untuk kamu")
    if (byId.db.role === "sorcerer") return cht.reply("❌ Tidak bisa membunuh teman (sorcerer)")
    
    killWerewolf(sender, target, ww)
    player.status = true
    return cht.reply(`☠️ Berhasi, kamul membunuh player ${target}`)
  }
  
  if (value === "shoot") {
    if (player.role !== "seriff") return cht.reply("❌ Peran ini bukan untuk kamu");
    if (byId.db.id === sender) return cht.reply("❌ Tidak bisa menargetkan diri sendiri")
    
    const sukses = tembakSeriff(sender, target, ww);
    player.status = true;

    if (!sukses) return cht.reply("❌ Gagal menembak. Pastikan nomor valid.");

    const result = getPlayerById2(sender, target, ww);
    if (!result) return cht.reply("❌ Player tidak ditemukan setelah ditembak.");

    const targetData = result.db;
    const isEnemy = ["werewolf", "jester"].includes(targetData.role);

    if (isEnemy) {
      return cht.reply(`☠️ Tembakan kamu tepat sasaran\nPlayer ${target} (${targetData.role}) telah mati.`);
    } else {
      return cht.reply(`☠️ Tembakan kamu meleset\nPlayer ${target} ternyata teman, kamu mati karena salah tembak.`);
    }
  }

  else if (value === "dreamy") {
    if (player.role !== "seer") return cht.reply("❌ Peran ini bukan untuk kamu")
    
    const role = dreamySeer(sender, target, ww)
    player.status = true
    return cht.reply(`🔮 Player ${target} memiliki peran: \`${role}\``)
  }

  else if (value === "deff") {
    if (player.role !== "guardian") return cht.reply("❌ Peran ini bukan untuk kamu")
    
    protectGuardian(sender, target, ww)
    player.status = true
    return cht.reply(`🛡️ Kamu telah melindungi player \`${target}\``)
  }

  else if (value === "sorcerer") {
    if (player.role !== "sorcerer") return cht.reply("❌ Peran ini bukan untuk kamu")
    
    const role = sorcerer(sender, target, ww)
    player.status = true
    return cht.reply(`🧙‍♀️ Player ${target} memiliki peran: \`${role}\``)
  }

  else {
    return cht.reply("❌ Perintah tidak dikenal. Gunakan: kill, shoot, dreamy, deff, atau sorcerer")
  }
})
}