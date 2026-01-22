const BASE_URL = 'https://z7.veloria.my.id/ai/wormgpt?text='

async function httpGet(text) {
  const url = BASE_URL + encodeURIComponent(text)
  const res = await fetch(url)
  if (!res.ok) throw new Error('HTTP ' + res.status)
  const data = await res.text()
  return (data || '').toString().trim()
}

function extractText(raw) {
  if (!raw) return ''
  try {
    const j = JSON.parse(raw)
    if (j && typeof j === 'object') {
      if (typeof j.result === 'string' && j.result.trim()) return j.result.trim()
      if (typeof j.message === 'string' && j.message.trim()) return j.message.trim()
    }
  } catch {
  }
  return raw
}

export default async function on({ cht, Exp, store, ev, is }) {
  ev.on(
    {
      cmd: ['wgpt', 'wormgpt'],
      listmenu: ['wgpt <prompt>'],
      tag: 'ai',
      energy: 5,
      premium: false,
      args: 'Masukkan teks prompt untuk WormGPT'
    },
    async ({ cht }) => {
      const q = (cht.q || '').trim()
      if (!q) {
        return cht.reply(
          'Masukkan teks prompt.\nContoh: .wgpt tulis pujian untuk kucing hitam.'
        )
      }

      await cht.react('⏳').catch(() => {})

      try {
        const raw = await httpGet(q)
        const text = extractText(raw) || 'Tidak ada respons dari WormGPT.'
        await cht.react('✅').catch(() => {})
        return cht.reply(text)
      } catch (e) {
        await cht.react('❌').catch(() => {})
        const msg = e && e.message ? e.message : String(e || 'unknown error')
        return cht.reply('Gagal menghubungi WormGPT.\nDetail: ' + msg)
      }
    }
  )
}
