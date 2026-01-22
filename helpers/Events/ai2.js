/* ✦ CAP HYTAM LEGAM DAKIAN KEK ARANG ✦

 Berbagi fitur SC Bella

 NAMA FITUR : OVERCHAT AI (STREAM) - AI2
 SOURCE : https://api.overchat.ai

 CREATOR : AlbertLazovsky
 CONTACT : 083846359386
 LINK GC : https://chat.whatsapp.com/GGjR1bhh12vBsXtkkcgPAo
 LINK CH : https://whatsapp.com/channel/0029Vb71Xk7EFeXeX06Gpf1
*/

export default async function on({ Exp, ev, store, cht, ai, is }) {
 const axiosMod = await "axios".import()
 const axios = axiosMod?.default || axiosMod

 const cryptoMod = await "crypto".import()
 const crypto = cryptoMod?.default || cryptoMod

 const personaMap = {
 "deepseek/deepseek-non-thinking-v3.2-exp": "deepseek-v-3-2-landing",
 "openai/gpt-4o": "gpt-4o-landing",
 "claude-haiku-4-5-20251001": "claude-haiku-4-5-landing"
 }

 const aliasToModel = {
 deepseek: "deepseek/deepseek-non-thinking-v3.2-exp",
 ds: "deepseek/deepseek-non-thinking-v3.2-exp",
 "4o": "openai/gpt-4o",
 gpt4o: "openai/gpt-4o",
 haiku: "claude-haiku-4-5-20251001"
 }

 const splitText = (text, size = 3500) => {
 const s = String(text || "")
 const out = []
 for (let i = 0; i < s.length; i += size) out.push(s.slice(i, i + size))
 return out
 }

 const overchatAI = async (message, model) => {
 const url = "https://api.overchat.ai/v1/chat/completions"
 const chatId = crypto.randomUUID()
 const messageId = crypto.randomUUID()

 const requestData = {
 chatId,
 model,
 messages: [
 { id: messageId, role: "user", content: message },
 { id: crypto.randomUUID(), role: "system", content: "" }
 ],
 personaId: personaMap[model] || "deepseek-v-3-2-landing",
 frequency_penalty: 0,
 max_tokens: 4000,
 presence_penalty: 0,
 stream: true,
 temperature: 0.5,
 top_p: 0.95
 }

 const headers = {
 "Content-Type": "application/json",
 Accept: "*/*",
 "X-Device-Platform": "web",
 "X-Device-Language": "en-US",
 "X-Device-Uuid": crypto.randomUUID(),
 "X-Device-Version": "1.0.44",
 Origin: "https://overchat.ai"
 }

 try {
 const res = await axios.post(url, requestData, {
 headers,
 responseType: "stream",
 timeout: 60000,
 maxBodyLength: Infinity,
 maxContentLength: Infinity
 })

 let fullResponse = ""
 let carry = ""

 return await new Promise((resolve) => {
 const done = (payload) => resolve(payload)

 res.data.on("data", (chunk) => {
 const str = carry + chunk.toString()
 const lines = str.split("\n")
 carry = lines.pop() || ""

 for (const line of lines) {
 const l = String(line || "").trim()
 if (!l.startsWith("data:")) continue
 if (l.includes("[DONE]")) continue

 const jsonStr = l.replace(/^data:\s*/, "")
 if (!jsonStr) continue

 try {
 const data = JSON.parse(jsonStr)
 const delta = data?.choices?.[0]?.delta?.content
 if (delta) fullResponse += String(delta)
 } catch {}
 }
 })

 res.data.on("end", () => {
 done({ success: true, response: fullResponse, model, author: "AgungDevX" })
 })

 res.data.on("error", (err) => {
 done({ success: false, error: String(err?.message || err), model, author: "AgungDevX" })
 })
 })
 } catch (err) {
 return { success: false, error: String(err?.message || err), model, author: "AgungDevX" }
 }
 }

 ev.on(
 {
 cmd: ["ai2"],
 listmenu: ["ai2"],
 tag: "ai",
 energy: 20
 },
 async ({ args, cht }) => {
 const prefix = cht?.prefix || "."
 const q = String(cht?.q || "").trim()

 let tokens = []
 if (q) tokens = q.split(/\s+/).filter(Boolean)
 else if (Array.isArray(args)) tokens = args.map((v) => String(v || "").trim()).filter(Boolean)
 else if (typeof args === "string") tokens = args.trim().split(/\s+/).filter(Boolean)

 const first = String(tokens[0] || "").toLowerCase()
 const chosenModel = aliasToModel[first] || null
 const model = chosenModel || "deepseek/deepseek-non-thinking-v3.2-exp"
 const prompt = chosenModel ? tokens.slice(1).join(" ").trim() : tokens.join(" ").trim()

 if (!prompt) {
 return cht.reply(
 [
 `Pakai: ${prefix}ai2 <prompt>`,
 `Model opsional: ${prefix}ai2 (deepseek|4o|haiku) <prompt>`
 ].join("\n")
 )
 }

 await cht.react("⏳").catch(() => {})

 const res = await overchatAI(prompt, model)
 if (!res?.success) {
 await cht.react("❌").catch(() => {})
 return cht.reply(`Gagal.\n${String(res?.error || "unknown error")}`)
 }

 const out = String(res?.response || "").trim()
 if (!out) {
 await cht.react("❌").catch(() => {})
 return cht.reply("Respon kosong.")
 }

 const header = ["╭─〔 Alya 〕", `│ Model : ${model}`, "╰────────────"].join("\n")
 const parts = splitText(out, 3500)

 await cht.reply(header + "\n\n" + parts.shift()).catch(() => null)
 for (const p of parts) {
 await Exp.sendMessage(cht.id, { text: p }, { quoted: cht }).catch(() => null)
 }

 await cht.react("✅").catch(() => {})
 }
 )
}
