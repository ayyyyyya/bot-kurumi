function calcMinThreshold(text) {
  const length = text.length;
    if (length <= 4) return 0.3;
    else if (length <= 7) return 0.4;
    else if (length <= 10) return 0.5;
    else return 0.6;
}

export default async function game({ cht, Exp, store, is, ev, chatDb }) {
  let similar = calcMinThreshold(cht.msg)
  
  let metadata = Data.preferences[cht.id]
  let { game } = chatDb
  let { type, question, answer, answered, startTime, endTime, energy, key } = game
  const { func } = Exp
  let isEnd = Date.now() >= endTime
  if(isEnd) {
    delete metadata.game
    return cht.reply("𝐆𝐀𝐌𝐄 𝐈𝐓𝐔 𝐓𝐄𝐋𝐀𝐇 𝐔𝐒𝐀𝐈")
  }
  try {
    let formatDur = func.formatDuration(endTime - Date.now())
    switch (type) {
      
      /*
      ---------------------------------------
      |  CASE GAME HANDLER
      ---------------------------------------
      */
      
      case "tictactoe": {
        function checkWinner(board, player) {
          for (let i = 0; i < 3; i++) {
              if (board[i].every(cell => cell === player)) return true;
              if ([0, 1, 2].every(j => board[j][i] === player)) return true;
          }
          return [0, 1, 2].every(i => board[i][i] === player) || 
                 [0, 1, 2].every(i => board[i][2 - i] === player);
      }

        let position = parseInt(cht.msg.trim());
        if (isNaN(position) || position < 1 || position > 9) {
            let { key: Key } = await cht.reply("𝐆𝐮𝐧𝐚𝐤𝐚𝐧 𝐚𝐧𝐠𝐤𝐚 𝟏-𝟗 𝐮𝐧𝐭𝐮𝐤 𝐛𝐞𝐫𝐦𝐚𝐢𝐧.");
            metadata.game.id_message.push(Key.id);
            break;
        }
    
        let row = Math.floor((position - 1) / 3);
        let col = (position - 1) % 3;
    
        if (!"123456789".includes(game.grid[row][col])) {
            let { key: Key } = await cht.reply("𝐏𝐨𝐬𝐢𝐬𝐢 𝐬𝐮𝐝𝐚𝐡 𝐝𝐢𝐢𝐬𝐢, 𝐩𝐢𝐥𝐢𝐡 𝐭𝐞𝐦𝐩𝐚𝐭 𝐥𝐚𝐢𝐧.");
            metadata.game.id_message.push(Key.id);
            break;
        }
    
        let currentPlayer = game.turn === 0 ? '❌' : '⭕';
        game.grid[row][col] = currentPlayer;
        game.moves++;
    
        let board = game.grid.map(row => row.join(' ')).join('\n');
    
        if (checkWinner(game.grid, currentPlayer)) {
            await cht.reply(`🎊 *${currentPlayer} 𝐌𝐄𝐍𝐀𝐍𝐆* 🎊\n\n${board}`);
            clearTimeout(global.timeouts[cht.id]);
            Exp.sendMessage(cht.id, { delete: game.key });
            delete Data.preferences[cht.id].game;
            delete global.timeouts[cht.id];
            break;
        }
    
        if (game.moves === 9) {
            await cht.reply(`🤝 *𝐏𝐄𝐑𝐌𝐀𝐈𝐍𝐀𝐍 𝐒𝐄𝐑𝐈* 🤝\n\n${board}`);
            clearTimeout(global.timeouts[cht.id]);
            Exp.sendMessage(cht.id, { delete: game.key });
            delete Data.preferences[cht.id].game;
            delete global.timeouts[cht.id];
            break;
        }
    
        game.turn = 1 - game.turn;
        await cht.reply(`𝐆𝐈𝐋𝐈𝐑𝐀𝐍 𝐁𝐄𝐑𝐈𝐊𝐔𝐓𝐍𝐘𝐀: ${game.turn === 0 ? '❌' : '⭕'}\n\n${board}`);
        break;
    }
      
      case "tebakbom": {
    let chosenPosition = parseInt(cht.msg.trim())
    
    // Validasi input
    if (isNaN(chosenPosition) || chosenPosition < 1 || chosenPosition > 9) {
        let { key:Key } = await cht.reply(
            `𝐈𝐧𝐩𝐮𝐭 𝐭𝐢𝐝𝐚𝐤 𝐯𝐚𝐥𝐢𝐝. 𝐒𝐢𝐥𝐚𝐤𝐚𝐧 𝐩𝐢𝐥𝐢𝐡 𝐚𝐧𝐠𝐤𝐚 𝟏-𝟗.\n\n𝐖𝐚𝐤𝐭𝐮 𝐭𝐞𝐫𝐬𝐢𝐬𝐚: ${formatDur.minutes} 𝐦𝐞𝐧𝐢𝐭 ${formatDur.seconds} 𝐝𝐞𝐭𝐢𝐤`
        )
        metadata.game.id_message.push(Key.id)
        break
    }
    
    // Cek apakah posisi sudah dipilih sebelumnya
    if (game.revealedPositions.includes(chosenPosition)) {
        let { key:Key } = await cht.reply(
            `𝐀𝐧𝐠𝐤𝐚 𝐢𝐧𝐢 𝐬𝐮𝐝𝐚𝐡 𝐝𝐢𝐩𝐢𝐥𝐢𝐡 𝐬𝐞𝐛𝐞𝐥𝐮𝐦𝐧𝐲𝐚. 𝐏𝐢𝐥𝐢𝐡 𝐚𝐧𝐠𝐤𝐚 𝐥𝐚𝐢𝐧.\n\n𝐖𝐚𝐤𝐭𝐮 𝐭𝐞𝐫𝐬𝐢𝐬𝐚: ${formatDur.minutes} 𝐦𝐞𝐧𝐢𝐭 ${formatDur.seconds} 𝐝𝐞𝐭𝐢𝐤`
        )
        metadata.game.id_message.push(Key.id)
        break
    }
    
    // Tambahkan posisi ke daftar posisi yang sudah dipilih
    game.revealedPositions.push(chosenPosition)
    
    // Menambahkan pemain ke daftar jika belum ada
    if (!game.players.includes(cht.sender)) {
        game.players.push(cht.sender)
    }
    
    // Ambil row dan column dari posisi yang dipilih
    const row = Math.floor((chosenPosition - 1) / 3)
    const col = (chosenPosition - 1) % 3
    
    // Cek apakah posisi mengandung bom
    if (chosenPosition === game.bombPosition) {
        // Bom ditemukan, permainan berakhir
        game.grid[row][col] = '💣'
        
        // Tampilkan grid akhir
        let gridDisplay = game.grid.map(row => row.join('')).join('\n')
        
        // Buat history
        let historyText = ""
        for (let i = 0; i < game.history.length; i++) {
            const historyItem = game.history[i]
            historyText += `\n- ${historyItem.position}\n- @${historyItem.player.split('@')[0]}\n- ${historyItem.energy} Energy⚡\n`
        }
        
        // Beri tahu semua pemain bahwa permainan berakhir
        await cht.reply(`𝐊𝐀𝐌𝐔 𝐊𝐀𝐋𝐀𝐇, 𝐏𝐄𝐑𝐌𝐀𝐈𝐍𝐀𝐍 𝐁𝐄𝐑𝐀𝐊𝐇𝐈𝐑\n\n${gridDisplay}\n\n*𝐇𝐈𝐒𝐓𝐎𝐑𝐘*${historyText}`)
        
        // Reset permainan
        clearTimeout(timeouts[cht.id])
        Exp.sendMessage(cht.id, { delete: game.key })
        delete Data.preferences[cht.id].game
        delete timeouts[cht.id]
        break
    }
    
    // Buah ditemukan
    // Pilih buah secara acak untuk ditampilkan (kecuali di posisi bom)
    const randomFruitIndex = Math.floor(Math.random() * game.fruits.length)
    game.grid[row][col] = game.fruits[randomFruitIndex]
    
    // Tingkatkan hadiah energy (dikurangi dari 10 menjadi 5)
    game.currentEnergy += 5
    
    // Tambahkan riwayat pilihan
    game.history.push({
        position: chosenPosition,
        player: cht.sender,
        energy: game.currentEnergy
    })
    
    // Tambahkan energy ke pemain
    await func.archiveMemories["addEnergy"](cht.sender, game.currentEnergy)
    
    // Tampilkan grid saat ini
    let gridDisplay = game.grid.map(row => row.join('')).join('\n')
    
    // Beri tahu pemain bahwa mereka selamat
    let { key:Key } = await cht.reply(`𝐀𝐧𝐝𝐚 𝐬𝐞𝐥𝐚𝐦𝐚𝐭, 𝐡𝐚𝐝𝐢𝐚 :
 +${game.currentEnergy} Energy⚡

${gridDisplay}

𝐒𝐢𝐥𝐚𝐡𝐤𝐚𝐧 𝐩𝐢𝐥𝐢𝐡 𝟏-𝟗`)
    metadata.game.id_message.push(Key.id)
    
    // Cek apakah semua posisi (kecuali bom) sudah terbuka
    if (game.revealedPositions.length === 8) {
        // Semua posisi kecuali bom sudah terbuka, pemain menang
        
        // Tampilkan posisi bom
        const bombRow = Math.floor((game.bombPosition - 1) / 3)
        const bombCol = (game.bombPosition - 1) % 3
        game.grid[bombRow][bombCol] = '💣'
        
        // Tampilkan grid akhir
        gridDisplay = game.grid.map(row => row.join('')).join('\n')
        
        // Buat history
        let historyText = ""
        for (let i = 0; i < game.history.length; i++) {
            const historyItem = game.history[i]
            historyText += `\n- ${historyItem.position}\n- @${historyItem.player.split('@')[0]}\n- ${historyItem.energy} Energy⚡\n`
        }
        
        // Tambahkan bonus untuk menyelesaikan semua posisi (dikurangi dari 100 menjadi 50)
        const bonusEnergy = 50
        await func.archiveMemories["addEnergy"](cht.sender, bonusEnergy)
        
        // Beri tahu pemain bahwa mereka menang
        await cht.reply(`𝐒𝐄𝐋𝐀𝐌𝐀𝐓! 𝐊𝐚𝐦𝐮 𝐦𝐞𝐧𝐠𝐡𝐢𝐧𝐝𝐚𝐫𝐢 𝐬𝐞𝐦𝐮𝐚 𝐛𝐨𝐦 𝐝𝐚𝐧 𝐦𝐞𝐧𝐝𝐚𝐩𝐚𝐭𝐤𝐚𝐧 𝐛𝐨𝐧𝐮𝐬 ${bonusEnergy} Energy⚡!\n\n${gridDisplay}\n\n*𝐇𝐈𝐒𝐓𝐎𝐑𝐘*${historyText}`)
        
        // Reset permainan
        clearTimeout(timeouts[cht.id])
        Exp.sendMessage(cht.id, { delete: game.key })
        delete Data.preferences[cht.id].game
        delete timeouts[cht.id]
    }
    break
}
      
      case "tebakkanji": {
    let userAnswer = cht.msg.trim().toLowerCase();
    let { kanji, hiragana, romaji, answer, contoh } = metadata.game; // Ambil data game dengan benar

    if (userAnswer === answer.trim().toLowerCase()) {
        await cht.reply(`𝐒𝐄𝐋𝐀𝐌𝐀𝐓! 𝐉𝐚𝐰𝐚𝐛𝐚𝐧𝐦𝐮 𝐛𝐞𝐧𝐚𝐫 🎊\n\n`
            + `?? *𝐊𝐀𝐍𝐉𝐈:* ${kanji}\n`
            + `📖 *𝐇𝐈𝐑𝐀𝐆𝐀𝐍𝐀:* ${hiragana}\n`
            + `🗣️ *𝐂𝐀𝐑𝐀 𝐁𝐀𝐂𝐀:* ${romaji}\n`
            + `📌 *𝐂𝐎𝐍𝐓𝐎𝐇 𝐏𝐄𝐍𝐆𝐆𝐔𝐍𝐀𝐀𝐍:* ${contoh}`);

        let isSmart = Date.now() - metadata.game.startTime < 10000;
        let bonusMessage = isSmart
            ? `𝐇𝐞𝐛𝐚𝐭! 𝐊𝐚𝐦𝐮 𝐦𝐞𝐧𝐣𝐚𝐰𝐚𝐛 𝐤𝐮𝐫𝐚𝐧𝐠 𝐝𝐚𝐫𝐢 𝟏𝟎 𝐝𝐞𝐭𝐢𝐤! 🎊\n\`𝐀𝐧𝐝𝐚 𝐦𝐞𝐧𝐝𝐚𝐩𝐚𝐭𝐤𝐚𝐧 𝐛𝐨𝐧𝐮𝐬 𝟐𝐱 𝐥𝐢𝐩𝐚𝐭\`\n\n`
            : "";
        let finalEnergy = isSmart ? metadata.game.energy * 2 : metadata.game.energy;

        await func.archiveMemories["addEnergy"](cht.sender, finalEnergy);
        await cht.reply(`${bonusMessage}+${finalEnergy} Energy⚡`);

        clearTimeout(timeouts[cht.id]);
        Exp.sendMessage(cht.id, { delete: metadata.game.key });
        delete Data.preferences[cht.id].game;
        delete timeouts[cht.id];
    } else {
        let formatDur = func.formatDuration(metadata.game.endTime - Date.now());
        let { key: Key } = await cht.reply(
            `𝐉𝐚𝐰𝐚𝐛𝐚𝐧 𝐬𝐚𝐥𝐚𝐡!\n\n𝐖𝐚𝐤𝐭𝐮 𝐭𝐞𝐫𝐬𝐢𝐬𝐚: ${formatDur.minutes} 𝐦𝐞𝐧𝐢𝐭 ${formatDur.seconds} 𝐝𝐞𝐭𝐢𝐤`
        );
        metadata.game.id_message.push(Key.id);
    }
    break;
}

      case "caklontong": {
    let userAnswer = cht.msg.trim().toLowerCase()
    let clue = metadata.game.clue

    if (userAnswer === answer.trim().toLowerCase()) {
        await cht.reply(`𝐒𝐄𝐋𝐀𝐌𝐀𝐓! 𝐉𝐚𝐰𝐚𝐛𝐚𝐧𝐦𝐮 𝐛𝐞𝐧𝐚𝐫 🎊\n\n*𝐏𝐞𝐧𝐣𝐞𝐥𝐚𝐬𝐚𝐧:* ${clue}`)

        let isSmart = Date.now() - startTime < 10000
        let bonusMessage = isSmart
            ? `𝐇𝐞𝐛𝐚𝐭! 𝐊𝐚𝐦𝐮 𝐦𝐞𝐧𝐣𝐚𝐰𝐚𝐛 𝐤𝐮𝐫𝐚𝐧𝐠 𝐝𝐚𝐫𝐢 𝟏𝟎 𝐝𝐞𝐭𝐢𝐤! 🎊\n\`𝐀𝐧𝐝𝐚 𝐦𝐞𝐧𝐝𝐚𝐩𝐚𝐭𝐤𝐚𝐧 𝐛𝐨𝐧𝐮𝐬 𝟐𝐱 𝐥𝐢𝐩𝐚𝐭\`\n\n`
            : ""
        let finalEnergy = isSmart ? energy * 2 : energy

        await func.archiveMemories["addEnergy"](cht.sender, finalEnergy)
        await cht.reply(`${bonusMessage}+${finalEnergy} Energy⚡`)

        clearTimeout(timeouts[cht.id])
        Exp.sendMessage(cht.id, { delete: key })
        delete Data.preferences[cht.id].game
        delete timeouts[cht.id]
    } else {
        let { key:Key } = await cht.reply(
            `𝐉𝐚𝐰𝐚𝐛𝐚𝐧 𝐬𝐚𝐥𝐚𝐡\n\nWaktu tersisa: ${formatDur.minutes} 𝐦𝐞𝐧𝐢𝐭 ${formatDur.seconds} 𝐝𝐞𝐭𝐢𝐤`
        )
        metadata.game.id_message.push(Key.id)
    }
    break
}


      case "tebakkabupaten":
      case "lengkapikalimat":
      case "tebakbendera":
      case "tebakgambar":
      case "tebakheroml":
      case "tebakkimia":
      case "tebakkata":
      case "tekateki": 
      case "asahotak":
      case "tebakgame":
      case "siapakahaku":
      case "tebaklirik":
      case "tebaklagu":
      case "susunkata": {
        let userAnswer = cht.msg.trim().toLowerCase()
        if (userAnswer === answer.trim().toLowerCase()) {
          await cht.reply(`𝐒𝐄𝐋𝐀𝐌𝐀𝐓! 𝐉𝐚𝐰𝐚𝐛𝐚𝐧𝐦𝐮 𝐛𝐞𝐧𝐚𝐫 🎊`)

          let isSmart = Date.now() - startTime < 10000
          let bonusMessage = isSmart
            ? `𝐇𝐞𝐛𝐚𝐭! 𝐊𝐚𝐦𝐮 𝐦𝐞𝐧𝐣𝐚𝐰𝐚𝐛 𝐤𝐮𝐫𝐚𝐧𝐠 𝐝𝐚𝐫𝐢 𝟏𝟎 𝐝𝐞𝐭𝐢𝐤! 🎊\n\`𝐀𝐧𝐝𝐚 𝐦𝐞𝐧𝐝𝐚𝐩𝐚𝐭𝐤𝐚𝐧 𝐛𝐨𝐧𝐮𝐬 𝟐𝐱 𝐥𝐢𝐩𝐚𝐭\`\n\n`
            : ""
          let finalEnergy = isSmart ? energy * 2 : energy

          await func.archiveMemories["addEnergy"](cht.sender, finalEnergy)
          await cht.reply(`${bonusMessage}+${finalEnergy} Energy⚡`)

          clearTimeout(timeouts[cht.id])
          Exp.sendMessage(cht.id, { delete: key })
          delete Data.preferences[cht.id].game
          delete timeouts[cht.id]
        } else {
          let { key:Key } = await cht.reply(
            `𝐉𝐚𝐰𝐚𝐛𝐚𝐧 𝐬𝐚𝐥𝐚𝐡

Waktu tersisa: ${formatDur.minutes} 𝐦𝐞𝐧𝐢𝐭 ${formatDur.seconds} 𝐝𝐞𝐭𝐢𝐤`
          )
          metadata.game.id_message.push(Key.id)
        }
        break
      }

      case "family100": {
        let _answer = answer.filter(a => cht.msg.length >= a.length)
        cht.msg = (func.getTopSimilar(await func.searchSimilarStrings(cht.msg, answer, similar))).item || "xtermaixyz"
        let userAnswer = cht.msg?.trim()?.toLowerCase()
        let answeredKey = Object.keys(answered)

        if (answered[userAnswer]) {
          return cht.reply(
            `𝐒𝐮𝐝𝐚𝐡 𝐝𝐢 𝐣𝐚𝐰𝐚𝐛 𝐨𝐥𝐞𝐡 @${answered[userAnswer].split("@")[0]}`,
            { mentions: [answered[userAnswer]] }
          )
        }
        let { key: key2 } = await cht.reply("𝐒𝐮𝐫𝐯𝐞𝐲 𝐦𝐞𝐦𝐛𝐮𝐤𝐭𝐢𝐤𝐚𝐧...")
        metadata.game.id_message.push(key2.id)
        let idx = _answer.findIndex(v => v == userAnswer)
        if (idx === -1) {
          let { key:Key } = await cht.reply(`𝐉𝐚𝐰𝐚𝐛𝐚𝐧 𝐭𝐢𝐝𝐚𝐤 𝐚𝐝𝐚 𝐝𝐚𝐥𝐚𝐦 𝐬𝐮𝐫𝐯𝐞𝐲`, { edit: key2 })
          metadata.game.id_message.push(Key.id)
        } else {
          answered[userAnswer] = cht.sender
        }        

        let resultText = `*${question}*\n\n` +
          answer
            .map((item, index) => {
              let isAnswered = answered[item]
              return `${index + 1}. ${
                isAnswered ? item : "??"
              } ${index === 0 ? "`𝐓𝐎𝐏 𝐒𝐔𝐑𝐕𝐄𝐘`" : ""} ${
                isAnswered
                  ? `+(${((cfg.hadiah[type] * (index === 0 ? 1 : 1.5)) / (index + 1)).toFixed()} Energy⚡)\n- _@${
                      isAnswered.split("@")[0]
                    }_`
                  : ""
              }`
            })
            .join("\n")
            
        let isAnswerAll = answer.length == Object.keys(answered).length
        if(!isAnswerAll){
          resultText += `\n\n𝐖𝐚𝐤𝐭𝐮 𝐭𝐞𝐫𝐬𝐢𝐬𝐚: ${formatDur.minutes} 𝐦𝐞𝐧𝐢𝐭 ${formatDur.seconds} 𝐝𝐞𝐭𝐢𝐤`
        }
        
        let { key:Key } = await cht.reply(resultText, { mentions: Object.values(answered) })
        !isAnswerAll && metadata.game.id_message.push(Key.id)
        if(isAnswerAll) {
          await cht.reply("𝐆𝐀𝐌𝐄 𝐁𝐄𝐑𝐀𝐊𝐇𝐈𝐑\n𝐌𝐞𝐦𝐛𝐚𝐠𝐢𝐤𝐚𝐧 𝐡𝐚𝐝𝐢𝐚... 🎁")
          delete Data.preferences[cht.id].game
          Object.entries(answered).forEach(async ([answerKey, user]) => {
            let idx = answer.findIndex(item => item === answerKey);
            if (idx === -1) {
              console.warn(`Jawaban "${answerKey}" tidak ditemukan dalam daftar answer.`);
              return;
            }
            let gift = ((cfg.hadiah[type] * (idx === 0 ? 1 : 1.5)) / (idx + 1)).toFixed();
            await func.archiveMemories["addEnergy"](user, gift);
          })

          clearTimeout(timeouts[cht.id])
        }
        break
      }
    }
  } catch (error) {
    console.error("Error in eventGame.js:", error)
    await cht.reply(`Terjadi kesalahan saat memproses game. Silakan coba lagi nanti.\nError: ${error}`)
  }
}
