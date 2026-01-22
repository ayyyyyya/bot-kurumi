/* ✦ CAP HYTAM LEGAM DAKIAN KEK ARANG ✦

 Berbagi fitur SC Bella

 NAMA FITUR : CODEAI (PROMPT/DETECT/CONVERT/EXPLAIN/IMAGE)
 SOURCE : https://django-app-4tbtjdxw2a-uc.a.run.app

 CREATOR : AlbertLazovsky
 CONTACT : 083846359386
 LINK GC : https://chat.whatsapp.com/GGjR1bhh12vBsXtkkcgPAo
 LINK CH : https://whatsapp.com/channel/0029Vb71Xk7EFeXeX06Gpf1
*/

export default async function on({ Exp, ev, store, cht, ai, is }) {
 const axiosMod = await "axios".import()
 const axios = axiosMod?.default || axiosMod

 const fdMod = await "form-data".import()
 const FormData = fdMod?.default || fdMod

 const fsMod = await "fs".import()
 const fs = fsMod?.default || fsMod

 const pathMod = await "path".import()
 const path = pathMod?.default || pathMod

 const osMod = await "os".import()
 const os = osMod?.default || osMod

 const cryptoMod = await "crypto".import()
 const crypto = cryptoMod?.default || cryptoMod

 const codeAI = {
 api: {
 base: "https://django-app-4tbtjdxw2a-uc.a.run.app",
 endpoints: {
 promptToCode: "/prompt_to_code/",
 detectBugs: "/detect_bugs/",
 convertCode: "/convert_code/",
 explainCode: "/code_explainer/",
 imageToSolve: "/image_to_solve/"
 }
 },
 headers: {
 "user-agent": "AgungDevX Android/1.0.0",
 "content-type": "application/json",
 accept: "application/json"
 },
 languages: {
 html: 1,
 c: 2,
 "c++": 3,
 "c#": 4,
 dart: 5,
 java: 6,
 swift: 7,
 python: 8,
 r: 9,
 javascript: 10,
 matlab: 11,
 ruby: 12,
 typescript: 13,
 kotlin: 14,
 go: 15,
 jshell: 16,
 python2: 17,
 groovy: 18,
 nodejs: 19,
 scala: 20,
 assembly: 21,
 julia: 22,
 "objective-j": 23,
 rust: 24,
 react: 25,
 angular: 26,
 perlu: 27,
 lua: 28,
 php: 29,
 jquery: 30,
 bootstrap: 31,
 vue: 32,
 "objective-c": 33,
 clojure: 34,
 vue3: 35,
 fotran: 36,
 cobol: 37,
 crystal: 38
 },
 ip: () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join(".")
 }

 const splitText = (text, size = 3500) => {
 const s = String(text || "")
 const out = []
 for (let i = 0; i < s.length; i += size) out.push(s.slice(i, i + size))
 return out
 }

 const parseTokens = (cht, args) => {
 const q = String(cht?.q || "").trim()
 if (q) return q.split(/\s+/).filter(Boolean)
 if (Array.isArray(args)) return args.map((v) => String(v || "").trim()).filter(Boolean)
 if (typeof args === "string") return args.trim().split(/\s+/).filter(Boolean)
 return []
 }

 const pickCodeText = (cht, fallback = "") => {
 const q = String(fallback || "").trim()
 const qt =
 String(cht?.quoted?.text || cht?.quoted?.caption || cht?.quoted?.q || "").trim() ||
 String(cht?.quoted?.msg || "").trim()
 if (qt) return qt
 return q
 }

 const safeSend = async (cht, text) => {
 try {
 return await cht.reply(text)
 } catch {
 return await Exp.sendMessage(cht.id, { text }, { quoted: cht }).catch(() => null)
 }
 }

 const getImageBuffer = async (cht) => {
 try {
 if (cht?.quoted?.download) {
 const q = await cht.quoted.download().catch(() => null)
 if (Buffer.isBuffer(q)) return q
 if (q?.data && Buffer.isBuffer(q.data)) return q.data
 }
 } catch {}
 try {
 if (cht?.download) {
 const m = await cht.download().catch(() => null)
 if (Buffer.isBuffer(m)) return m
 if (m?.data && Buffer.isBuffer(m.data)) return m.data
 }
 } catch {}
 return null
 }

 const ensureDir = (p) => {
 try {
 if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true })
 return true
 } catch {
 return false
 }
 }

 const langId = (lang) => {
 const k = String(lang || "").toLowerCase().trim()
 return codeAI.languages[k] || null
 }

 const renderResult = (title, language, code, explanation) => {
 const t = String(title || "-")
 const l = String(language || "-")
 const e = String(explanation || "").trim()
 const c = String(code || "").trim()

 const parts = []
 parts.push(["╭─〔 CODEAI 〕", `│ Title : ${t}`, `│ Lang : ${l}`, "╰────────────"].join("\n"))

 if (e) parts.push(e)
 if (c) parts.push("```" + "\n" + c + "\n" + "```")

 return parts.join("\n\n").trim()
 }

 const apiPromptToCode = async (prompt, language) => {
 const id = langId(language)
 if (!prompt || !id) return { error: "Prompt dan bahasa diperlukan" }

 try {
 const { data } = await axios.post(
 `${codeAI.api.base}${codeAI.api.endpoints.promptToCode}`,
 { prompt: String(prompt).trim(), language: id, ip_address: codeAI.ip() },
 { headers: codeAI.headers, timeout: 60000, maxBodyLength: Infinity, maxContentLength: Infinity }
 )
 if (data?.Status !== 1 || !data?.Data) return { error: data?.Message || "Gagal" }
 const { title, language: lang, code, explanation } = data.Data
 return { title, language: lang, code, explanation }
 } catch (err) {
 return { error: String(err?.response?.data?.Message || err?.message || err) }
 }
 }

 const apiDetectBugs = async (code) => {
 if (!String(code || "").trim()) return { error: "Kode diperlukan" }

 try {
 const { data } = await axios.post(
 `${codeAI.api.base}${codeAI.api.endpoints.detectBugs}`,
 { code: String(code).trim(), ip_address: codeAI.ip() },
 { headers: codeAI.headers, timeout: 60000, maxBodyLength: Infinity, maxContentLength: Infinity }
 )
 if (data?.Status !== 1 || !data?.Data) return { error: data?.Message || "Gagal" }
 const { title, language, code: fixedCode, explanation } = data.Data
 return { title, language, code: fixedCode, explanation }
 } catch (err) {
 return { error: String(err?.response?.data?.Message || err?.message || err) }
 }
 }

 const apiConvertCode = async (code, targetLanguage, sourceLanguage) => {
 const targetId = langId(targetLanguage)
 if (!String(code || "").trim() || !targetId) return { error: "Kode dan bahasa target diperlukan" }

 const prompt = sourceLanguage ? `${sourceLanguage}\n\n${String(code).trim()}`.trim() : String(code).trim()

 try {
 const { data } = await axios.post(
 `${codeAI.api.base}${codeAI.api.endpoints.convertCode}`,
 { prompt, language: targetId, ip_address: codeAI.ip() },
 { headers: codeAI.headers, timeout: 60000, maxBodyLength: Infinity, maxContentLength: Infinity }
 )
 if (data?.Status !== 1 || !data?.Data) return { error: data?.Message || "Gagal" }
 const { title, language, code: convertedCode, explanation } = data.Data
 return { title, language, code: convertedCode, explanation }
 } catch (err) {
 return { error: String(err?.response?.data?.Message || err?.message || err) }
 }
 }

 const apiExplainCode = async (code, language) => {
 if (!String(code || "").trim()) return { error: "Kode diperlukan" }

 try {
 const { data } = await axios.post(
 `${codeAI.api.base}${codeAI.api.endpoints.explainCode}`,
 { code: String(code).trim(), optional_param: String(language || "").trim(), ip_address: codeAI.ip() },
 { headers: codeAI.headers, timeout: 60000, maxBodyLength: Infinity, maxContentLength: Infinity }
 )
 if (data?.Status !== 1 || !data?.Data) return { error: data?.Message || "Gagal" }
 const { title, language: lang, code: explainedCode, explanation } = data.Data
 return { title, language: lang, code: explainedCode, explanation }
 } catch (err) {
 return { error: String(err?.response?.data?.Message || err?.message || err) }
 }
 }

 const apiImageToSolve = async (imageBuffer, prompt = "", language) => {
 const id = langId(language)
 if (!id || !imageBuffer) return { error: "Gambar dan bahasa diperlukan" }

 const base = path.join(process.cwd(), "toolkit", "tmp")
 const fallback = path.join(os.tmpdir(), "bella_tmp")
 ensureDir(base) || ensureDir(fallback)
 const dir = ensureDir(base) ? base : fallback

 const filePath = path.join(dir, `codeai_${Date.now()}.jpg`)
 fs.writeFileSync(filePath, imageBuffer)

 try {
 const form = new FormData()
 form.append("prompt", String(prompt || ""))
 form.append("image", fs.createReadStream(filePath))
 form.append("ip_address", codeAI.ip())
 form.append("language", id)

 const { data } = await axios.post(`${codeAI.api.base}${codeAI.api.endpoints.imageToSolve}`, form, {
 headers: form.getHeaders(),
 timeout: 60000,
 maxBodyLength: Infinity,
 maxContentLength: Infinity
 })

 if (data?.Status !== 1 || !data?.Data) return { error: data?.Message || "Gagal" }
 const { title, language: lang, code, explanation } = data.Data
 return { title, language: lang, code, explanation }
 } catch (err) {
 return { error: String(err?.response?.data?.Message || err?.message || err) }
 } finally {
 try {
 if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
 } catch {}
 }
 }

 ev.on(
 {
 cmd: ["codeai"],
 listmenu: ["codeai"],
 tag: "tools",
 energy: 35,
 args: 0
 },
 async ({ cht, args }) => {
 const prefix = cht?.prefix || "."
 const tokens = parseTokens(cht, args)
 const sub = String(tokens[0] || "").toLowerCase()

 const langList = Object.keys(codeAI.languages)
 const shortLangs = langList.slice(0, 20).join(", ")

 const usage = [
 "╭─〔 CODEAI 〕",
 `│ ${prefix}codeai prompt <bahasa> <prompt...>`,
 `│ ${prefix}codeai detect <kode...> (atau reply kode)`,
 `│ ${prefix}codeai convert <target> [source] <kode...> (atau reply kode)`,
 `│ ${prefix}codeai explain [bahasa] <kode...> (atau reply kode)`,
 `│ ${prefix}codeai image <bahasa> [prompt...] (reply gambar)`,
 `│ ${prefix}codeai langs`,
 "╰────────────",
 "",
 "Bahasa (contoh):",
 shortLangs
 ].join("\n")

 if (!sub) return safeSend(cht, usage)

 if (sub === "langs") {
 const full = langList.join(", ")
 const msg = ["╭─〔 CODEAI LANGS 〕", "╰────────────", "", full].join("\n")
 const parts = splitText(msg, 3500)
 await safeSend(cht, parts.shift())
 for (const p of parts) await Exp.sendMessage(cht.id, { text: p }, { quoted: cht }).catch(() => null)
 return
 }

 await cht.react("⏳").catch(() => {})

 if (sub === "prompt" || sub === "p") {
 const language = tokens[1]
 const prompt = tokens.slice(2).join(" ").trim()
 if (!language || !prompt) {
 await cht.react("❌").catch(() => {})
 return safeSend(cht, usage)
 }

 const res = await apiPromptToCode(prompt, language)
 if (res?.error) {
 await cht.react("❌").catch(() => {})
 return safeSend(cht, `Gagal.\n${res.error}`)
 }

 const msg = renderResult(res.title, res.language, res.code, res.explanation)
 const parts = splitText(msg, 3500)
 await safeSend(cht, parts.shift())
 for (const p of parts) await Exp.sendMessage(cht.id, { text: p }, { quoted: cht }).catch(() => null)
 await cht.react("✅").catch(() => {})
 return
 }

 if (sub === "detect" || sub === "d") {
 const inline = tokens.slice(1).join(" ").trim()
 const code = pickCodeText(cht, inline)
 if (!code) {
 await cht.react("❌").catch(() => {})
 return safeSend(cht, `Pakai: ${prefix}codeai detect <kode...>\nAtau reply pesan kode lalu ketik: ${prefix}codeai detect`)
 }

 const res 
 const res = await apiDetectBugs(code)
 if (res?.error) {
 await cht.react("❌").catch(() => {})
 return safeSend(cht, `Gagal.\n${res.error}`)
 }

 const msg = renderResult(res.title, res.language, res.code, res.explanation)
 const parts = splitText(msg, 3500)
 await safeSend(cht, parts.shift())
 for (const p of parts) await Exp.sendMessage(cht.id, { text: p }, { quoted: cht }).catch(() => null)
 await cht.react("✅").catch(() => {})
 return
 }

 if (sub === "convert" || sub === "c") {
 const target = tokens[1]
 if (!target) {
 await cht.react("❌").catch(() => {})
 return safeSend(cht, usage)
 }

 const maybeSource = tokens[2]
 const hasSource = !!langId(maybeSource)
 const source = hasSource ? maybeSource : ""
 const inline = (hasSource ? tokens.slice(3) : tokens.slice(2)).join(" ").trim()
 const code = pickCodeText(cht, inline)

 if (!code) {
 await cht.react("❌").catch(() => {})
 return safeSend(
 cht,
 `Pakai: ${prefix}codeai convert <target> [source] <kode...>\nAtau reply pesan kode lalu: ${prefix}codeai convert <target> [source]`
 )
 }

 const res = await apiConvertCode(code, target, source)
 if (res?.error) {
 await cht.react("❌").catch(() => {})
 return safeSend(cht, `Gagal.\n${res.error}`)
 }

 const msg = renderResult(res.title, res.language, res.code, res.explanation)
 const parts = splitText(msg, 3500)
 await safeSend(cht, parts.shift())
 for (const p of parts) await Exp.sendMessage(cht.id, { text: p }, { quoted: cht }).catch(() => null)
 await cht.react("✅").catch(() => {})
 return
 }

 if (sub === "explain" || sub === "e") {
 const maybeLang = tokens[1]
 const hasLang = !!langId(maybeLang)
 const language = hasLang ? maybeLang : ""
 const inline = (hasLang ? tokens.slice(2) : tokens.slice(1)).join(" ").trim()
 const code = pickCodeText(cht, inline)

 if (!code) {
 await cht.react("❌").catch(() => {})
 return safeSend(
 cht,
 `Pakai: ${prefix}codeai explain [bahasa] <kode...>\nAtau reply pesan kode lalu: ${prefix}codeai explain [bahasa]`
 )
 }

 const res = await apiExplainCode(code, language)
 if (res?.error) {
 await cht.react("❌").catch(() => {})
 return safeSend(cht, `Gagal.\n${res.error}`)
 }

 const msg = renderResult(res.title, res.language, res.code, res.explanation)
 const parts = splitText(msg, 3500)
 await safeSend(cht, parts.shift())
 for (const p of parts) await Exp.sendMessage(cht.id, { text: p }, { quoted: cht }).catch(() => null)
 await cht.react("✅").catch(() => {})
 return
 }

 if (sub === "image" || sub === "i") {
 const language = tokens[1]
 const prompt = tokens.slice(2).join(" ").trim()

 if (!language) {
 await cht.react("❌").catch(() => {})
 return safeSend(cht, `Pakai: ${prefix}codeai image <bahasa> [prompt...] (reply gambar)`)
 }

 const img = await getImageBuffer(cht)
 if (!img) {
 await cht.react("❌").catch(() => {})
 return safeSend(cht, `Reply gambar, lalu ketik:\n${prefix}codeai image ${language} ${prompt || ""}`.trim())
 }

 const res = await apiImageToSolve(img, prompt, language)
 if (res?.error) {
 await cht.react("❌").catch(() => {})
 return safeSend(cht, `Gagal.\n${res.error}`)
 }

 const msg = renderResult(res.title, res.language, res.code, res.explanation)
 const parts = splitText(msg, 3500)
 await safeSend(cht, parts.shift())
 for (const p of parts) await Exp.sendMessage(cht.id, { text: p }, { quoted: cht }).catch(() => null)
 await cht.react("✅").catch(() => {})
 return
 }

 await cht.react("❌").catch(() => {})
 return safeSend(cht, usage)
 }
 )
}
