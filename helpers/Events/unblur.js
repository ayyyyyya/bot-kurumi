const fs = "fs".import()
const sharpMod = "sharp".import()

const sharpFn =
 typeof sharpMod === "function"
 ? sharpMod
 : typeof sharpMod?.default === "function"
 ? sharpMod.default
 : typeof sharpMod?.default?.default === "function"
 ? sharpMod.default.default
 : typeof sharpMod?.sharp === "function"
 ? sharpMod.sharp
 : null

const PROGRESS_MIN_INTERVAL = 1700
const _pState = new Map()
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function getQuotedRaw(cht) {
 const c = cht || {}
 const cand = [c?.msg, c?.m, c?.message, c?.raw, c?.quoted?.msg, c?.quoted?.m, c?.quoted]
 for (const x of cand) if (x && x.key && typeof x.key === "object") return x
 return null
}

async function progressStart(cht, Exp, opts, text) {
 try {
 const msg = await Exp.sendMessage(cht.id, { text }, opts)
 const k = msg?.key?.id || ""
 if (k) _pState.set(k, { t: Date.now(), last: text })
 return msg
 } catch {
 return null
 }
}

async function progressUpdate(cht, Exp, msg, text) {
 if (!msg?.key?.id) return
 const k = msg.key.id
 const st = _pState.get(k) || { t: 0, last: "" }
 if (st.last === text) return
 const now = Date.now()
 const wait = PROGRESS_MIN_INTERVAL - (now - st.t)
 if (wait > 0) await sleep(wait)
 try {
 await Exp.sendMessage(cht.id, { text, edit: msg.key })
 st.t = Date.now()
 st.last = text
 _pState.set(k, st)
 } catch {}
}

async function localUnblur(buffer, amount = 1.2) {
 if (!sharpFn) throw new Error('sharp gak kebaca. Coba reinstall: npm i sharp')
 const out = await sharpFn(buffer, { failOnError: false })
 .rotate()
 .sharpen(amount, 1, 2)
 .modulate({ brightness: 1.03, saturation: 1.05 })
 .jpeg({ quality: 92, mozjpeg: true })
 .toBuffer()
 return out
}

function clamp(n, a, b, d) {
 const x = parseFloat(n)
 if (!isFinite(x)) return d
 return Math.max(a, Math.min(b, x))
}

export default async function on({ cht, Exp, store, ev, is }) {
 ev.on(
 {
 cmd: ["unblur"],
 listmenu: ["unblur (reply image)"],
 tag: "image",
 premium: true,
 energy: 50,
 limit: true,
 args: "Reply/kirim gambar. Opsional: .unblur 1.2 (0.6 - 2.5)",
 media: { type: ["image"], msg: "Kirim atau reply gambar dulu." }
 },
 async ({ cht, media }) => {
 const quoted = getQuotedRaw(cht)
 const opts = quoted ? { quoted } : {}

 const strength = clamp((cht.q || "").trim(), 0.6, 2.5, 1.2)

 await cht.react("⏳").catch(() => {})
 const prog = await progressStart(cht, Exp, opts, "🧠 unblur • siapin dulu…")

 try {
 await progressUpdate(cht, Exp, prog, "🖼️ unblur • ngambil gambar…")

 let buf = media
 if (typeof buf === "string") buf = fs.readFileSync(buf)
 if (!Buffer.isBuffer(buf)) throw new Error("Media bukan buffer")

 await progressUpdate(cht, Exp, prog, `✨ unblur • ngasah detail (x${strength})…`)
 const outBuf = await localUnblur(buf, strength)

 await progressUpdate(cht, Exp, prog, "📤 unblur • ngirim hasil…")
 await Exp.sendMessage(cht.id, { image: outBuf, caption: "✨ jadi" }, opts)

 await cht.react("✅").catch(() => {})
 await progressUpdate(cht, Exp, prog, "✅ unblur • kelar")
 } catch (e) {
 await cht.react("❌").catch(() => {})
 await progressUpdate(cht, Exp, prog, "❌ unblur • gagal")
 return cht.reply("Error: " + (e?.message || String(e)))
 }
 }
 )
}
