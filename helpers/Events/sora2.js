export default async function on({ cht, Exp, store, ev, is }) {

  ev.on({
    cmd: ['sora','video','sora2'],
    tag: 'ai',
    args: 1,
    energy: 5
  }, async (m,{arg,reply,sendMedia}) => {

    const apikey = 'fgsiapi-3061477d-6d'
    const prompt = arg

    let res
    try {
      res = await fetch(`https://fgsi.dpdns.org/api/ai/sora2?apikey=${apikey}&prompt=${encodeURIComponent(prompt)}`)
    } catch {
      return reply('Gagal terhubung ke server Sora2.')
    }

    if(!res.ok) return reply('Server Sora2 error (create task): '+res.status)

    let json
    try { json = await res.json() } catch {
      return reply('Respon server Sora2 tidak valid.')
    }

    const data = json?.data
    if(!data?.pollUrl) return reply('pollUrl tidak ditemukan dari server.')

    let pollUrl = data.pollUrl
    if(pollUrl.startsWith('http://')) pollUrl = 'https://' + pollUrl.slice(7)

    await reply('Sedang membuat video...')

    let videoUrl = null
    let tries = 0

    while(!videoUrl && tries < 40){
      await new Promise(r=>setTimeout(r,5000))
      tries++

      let s
      try { s = await fetch(pollUrl) } catch { continue }

      if(!s.ok){
        if(s.status >= 500) continue
        return reply('Server status Sora2 error: '+s.status)
      }

      let j
      try { j = await s.json() } catch { continue }

      const st = j?.data?.status

      if(st === 'Completed'){
        videoUrl = j?.data?.result?.videoUrl || j?.data?.videoUrl
        break
      }

      if(st === 'Failed') return reply('Pembuatan video gagal di server.')
    }

    if(!videoUrl) return reply('Video tidak berhasil dibuat. Coba lagi nanti.')

    let v
    try { v = await fetch(videoUrl) } catch {
      return reply('Gagal mengunduh video.')
    }

    if(!v.ok) return reply('Server video error: '+v.status)

    const buff = Buffer.from(await v.arrayBuffer())

    await sendMedia(buff,'video/mp4',{caption:`Prompt: ${prompt}`})
  })

}
