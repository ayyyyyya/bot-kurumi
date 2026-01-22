/*  ✦ CAP HYTAM LEGAM DAKIAN KEK ARANG ✦

   Berbagi fitur SC Bella

   NAMA FITUR : CAPCUT UPSCALE VIDEO (STABLE BOT ARCH)

   SOURCE     : CAPCUT MAGIC (WEB)

   CREATOR    : AlbertLazovsky

   CONTACT    : 083846359386

   LINK GC    : https://chat.whatsapp.com/GGjR1bhh12vBsXtkkcgPAo

   LINK CH    : https://whatsapp.com/channel/0029Vb71Xk7EFeXeX06Gpf1

*/

export default async function on({ ev, Exp }) {

  const cacheKey = "__capcut_magic_deps__"

  if (!global[cacheKey]) {

    const crypto = await "crypto".import()

    const axiosMod = await "axios".import()

    const aws4Mod = await "aws4".import()

    const fs = await "fs".import()

    const path = await "path".import()

    const crc32Mod = await "crc32".import()

    const childProcess = await "child_process".import()

    const ffmpegStaticMod = await "ffmpeg-static".import()

    const axios = axiosMod?.default || axiosMod

    const aws4 = aws4Mod?.default || aws4Mod

    const crc32 = crc32Mod?.default || crc32Mod

    const ffmpegPath = ffmpegStaticMod?.default || ffmpegStaticMod

    const spawn = childProcess?.spawn

    if (!axios || !aws4 || !fs || !path || !crc32 || !ffmpegPath || !spawn || !crypto) {

      throw new Error("Dependency capcutup tidak lengkap. Pastikan axios/aws4/crc32/ffmpeg-static tersedia.")

    }

    global[cacheKey] = { crypto, axios, aws4, fs, path, crc32, spawn, ffmpegPath }

  }

  const { crypto, axios, aws4, fs, path, crc32, spawn, ffmpegPath } = global[cacheKey]

  const fsPromises = fs.promises

  const TEMP_DIR = path.join(process.cwd(), "toolkit", "tmp", "capcut_magic")

  const MAX_VIDEO_DURATION_SECONDS = 600

  const MAX_VIDEO_WIDTH = 4096

  const MAX_VIDEO_HEIGHT = 2160

  const DEFAULT_POLL_INTERVAL_MS = 2000

  const LONG_POLL_INTERVAL_MS = 10000

  const DEFAULT_POLL_ATTEMPTS = 30

  const LONG_POLL_ATTEMPTS = 120

  const REQUEST_MAX_RETRIES = 2

  const REQUEST_RETRY_DELAY_MS = 1500

  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true })

  const getJid = (cht) =>

    cht?.from || cht?.chat || cht?.key?.remoteJid || cht?.msg?.key?.remoteJid || cht?.m?.key?.remoteJid || null

  const pickQuotedCandidate = (cht) =>

    cht?.quoted?.msg || cht?.quoted?.m || cht?.msg || cht?.m || null

  const isValidQuoted = (q) =>

    q && typeof q === "object" && q.key && typeof q.key.fromMe === "boolean"

  const buildOptions = (cht) => {

    const q = pickQuotedCandidate(cht)

    if (isValidQuoted(q)) return { quoted: q }

    return {}

  }

  const sendMessageSafe = async (jid, content, opt) => {

    const o = opt && typeof opt === "object" ? opt : {}

    try {

      return await Exp.sendMessage(jid, content, o)

    } catch (e) {

      if (o.quoted) {

        return await Exp.sendMessage(jid, content, {})

      }

      throw e

    }

  }

  const safeReply = async (cht, text) => {

    if (typeof cht?.reply === "function") return cht.reply(text)

    const jid = getJid(cht)

    if (!jid) return null

    if (typeof Exp?.sendMessage !== "function") return null

    const opt = buildOptions(cht)

    return sendMessageSafe(jid, { text }, opt)

  }

  const safeSendVideo = async (cht, buffer, fileName = "capcut_upscale.mp4", caption = "") => {

    if (typeof cht?.sendFile === "function") return cht.sendFile(buffer, fileName, caption)

    const jid = getJid(cht)

    if (!jid) throw new Error("Tujuan chat tidak ditemukan (jid null).")

    if (typeof Exp?.sendMessage !== "function") throw new Error("Exp.sendMessage tidak tersedia di bot ini.")

    const opt = buildOptions(cht)

    try {

      return await sendMessageSafe(jid, { video: buffer, mimetype: "video/mp4", caption }, opt)

    } catch {

      return await sendMessageSafe(jid, { document: buffer, mimetype: "video/mp4", fileName, caption }, opt)

    }

  }

  const toCrcHex = (val) => {

    if (typeof val === "number") return (val >>> 0).toString(16).padStart(8, "0")

    const s = String(val || "").replace(/^0x/i, "")

    if (!s) return "00000000"

    if (s.startsWith("-")) return (Number(val) >>> 0).toString(16).padStart(8, "0")

    return s.padStart(8, "0")

  }

  const guessVideoExt = (buf) => {

    try {

      if (!Buffer.isBuffer(buf) || buf.length < 16) return "mp4"

      const head = buf.subarray(0, 256)

      const s = head.toString("latin1")

      if (s.slice(0, 4) === "RIFF" && s.slice(8, 12) === "AVI ") return "avi"

      if (head[0] === 0x1a && head[1] === 0x45 && head[2] === 0xdf && head[3] === 0xa3) {

        const lower = s.toLowerCase()

        if (lower.includes("webm")) return "webm"

        return "mkv"

      }

      if (s.includes("ftyp")) {

        const idx = s.indexOf("ftyp")

        const brand = s.slice(idx + 4, idx + 8)

        if (brand === "qt  ") return "mov"

        return "mp4"

      }

      return "mp4"

    } catch {

      return "mp4"

    }

  }

  const pickVideoBuffer = async ({ cht, media }) => {

    if (Buffer.isBuffer(media)) return media

    if (Buffer.isBuffer(media?.buffer)) return media.buffer

    if (Buffer.isBuffer(media?.data)) return media.data

    const tryDl = async (obj) => {

      if (!obj) return null

      const dl = await obj.download?.().catch(() => null)

      if (Buffer.isBuffer(dl)) return dl

      if (Buffer.isBuffer(dl?.buffer)) return dl.buffer

      if (Buffer.isBuffer(dl?.data)) return dl.data

      return null

    }

    const a = await tryDl(cht?.quoted)

    if (a) return a

    const b = await tryDl(cht)

    if (b) return b

    throw new Error("Reply/kirim video dulu, lalu ketik .capcutup")

  }

  class CapcutMagic {

    constructor(isDebug = false) {

      this.isDebug = isDebug

      this.config = {

        PF: "7",

        APP_VERSION: "5.8.0",

        SIGN_VERSION: "1",

        USER_AGENT:

          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",

        X_TT_ENV: "boe",

        APP_SDK_VERSION: "48.0.0",

        AUTHORITY: "edit-api-sg.capcut.com",

        ORIGIN: "https://www.capcut.com",

        REFERER: "https://www.capcut.com/",

        API_BASE_URL: "https://edit-api-sg.capcut.com",

        VOD_HOST: "vod-ap-singapore-1.bytevcloudapi.com",

        VOD_REGION: "sg",

        VOD_API_VERSION: "2020-11-19",

        VOD_SERVICE_NAME: "vod",

        DEFAULT_CHUNK_SIZE: 5 * 1024 * 1024,

        SIGN_SALT_1: "9e2c",

        SIGN_SALT_2: "11ac",

        BIZ_WEB_VIDEO: "web_video",

        FILE_TYPE_VIDEO: 0,

        TOOL_TYPE_UPSCALE_VIDEO: 11,

      }

      this.tempId = null

    }

    async _request(method, url, config = {}, retryOptions = {}) {

      const maxRetries = retryOptions.maxRetries ?? REQUEST_MAX_RETRIES

      const retryDelay = retryOptions.retryDelay ?? REQUEST_RETRY_DELAY_MS

      for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {

        try {

          const response = await axios.request({

            method,

            url,

            ...config,

            validateStatus: (status) => status >= 200 && status < 400,

          })

          return response.data

        } catch (err) {

          if (attempt > maxRetries) {

            const e = new Error("Operasi gagal setelah beberapa percobaan. Coba lagi nanti.")

            e.cause = err

            throw e

          }

          await new Promise((r) => setTimeout(r, retryDelay))

        }

      }

      throw new Error("Request gagal.")

    }

    _generateSign({ url, pf, appvr, tdid }) {

      const ts = Math.floor(Date.now() / 1000)

      const sliceLast = (x, n = 7) => String(x).slice(-n)

      const md5 = (x) => crypto.createHash("md5").update(x).digest("hex")

      const sig = (...args) => md5(args.join("|")).toLowerCase()

      return {

        sign: sig(this.config.SIGN_SALT_1, sliceLast(url), pf, appvr, ts, tdid, this.config.SIGN_SALT_2),

        "device-time": ts,

      }

    }

    _generateHeaders(url, payload, cookie) {

      const { sign, "device-time": deviceTime } = this._generateSign({

        url,

        pf: this.config.PF,

        appvr: this.config.APP_VERSION,

        tdid: "",

      })

      const payloadLength = payload ? Buffer.byteLength(JSON.stringify(payload), "utf-8") : 0

      return {

        authority: this.config.AUTHORITY,

        "app-sdk-version": this.config.APP_SDK_VERSION,

        appvr: this.config.APP_VERSION,

        "cache-control": "no-cache",

        "content-length": String(payloadLength),

        "content-type": "application/json",

        cookie,

        "device-time": String(deviceTime),

        origin: this.config.ORIGIN,

        pf: this.config.PF,

        pragma: "no-cache",

        priority: "u=1, i",

        referer: this.config.REFERER,

        sign,

        "sign-ver": this.config.SIGN_VERSION,

        tdid: "",

        "user-agent": this.config.USER_AGENT,

        "x-tt-env": this.config.X_TT_ENV,

      }

    }

    _sha256(payload) {

      return crypto.createHash("sha256").update(payload).digest("hex")

    }

    async _getMetaVideo(videoBuffer, tempFileName) {

      const tempVideoPath = path.join(TEMP_DIR, tempFileName)

      try {

        await fsPromises.writeFile(tempVideoPath, videoBuffer)

        const p = spawn(ffmpegPath, ["-i", tempVideoPath, "-f", "null", "-"], { stdio: ["ignore", "ignore", "pipe"] })

        let stderr = ""

        p.stderr.on("data", (d) => (stderr += d.toString()))

        const meta = await new Promise((resolve, reject) => {

          p.on("close", (code) => {

            if (code !== 0) return reject(new Error("Gagal baca metadata video (FFmpeg)."))

            const dur = stderr.match(/Duration: (\d{2}):(\d{2}):(\d{2})\.(\d+)/)

            if (!dur) return reject(new Error("Tidak bisa parsing durasi video."))

            const seconds =

              parseInt(dur[1], 10) * 3600 +

              parseInt(dur[2], 10) * 60 +

              parseInt(dur[3], 10) +

              parseInt(dur[4], 10) / 1000

            if (seconds > MAX_VIDEO_DURATION_SECONDS) {

              return reject(new Error(`Durasi video ${seconds.toFixed(2)}s melebihi batas ${MAX_VIDEO_DURATION_SECONDS}s.`))

            }

            const res = stderr.match(/Stream #\d+:\d+.*Video:.*\s(\d{2,5})x(\d{2,5})[\s,]/)

            if (!res) return reject(new Error("Tidak bisa parsing resolusi video."))

            const w = parseInt(res[1], 10)

            const h = parseInt(res[2], 10)

            if (w > MAX_VIDEO_WIDTH || h > MAX_VIDEO_HEIGHT) {

              return reject(new Error(`Resolusi video ${w}x${h} melebihi batas ${MAX_VIDEO_WIDTH}x${MAX_VIDEO_HEIGHT}.`))

            }

            resolve({ width: w, height: h, duration: seconds })

          })

          p.on("error", () => reject(new Error("FFmpeg gagal dijalankan.")))

        })

        return meta

      } finally {

        if (fs.existsSync(tempVideoPath)) await fsPromises.unlink(tempVideoPath).catch(() => {})

      }

    }

    async getCookie() {

      const paths = ["/magic-tools/upscale-video", "/magic-tools/upscale-image"]

      for (const p of paths) {

        try {

          const url = `${this.config.ORIGIN}${p}`

          const r = await axios.get(url, { headers: { "User-Agent": this.config.USER_AGENT } })

          const cookies = r.headers["set-cookie"]

          if (cookies && cookies.length) return cookies.map((c) => c.split(";")[0]).join("; ")

        } catch {}

      }

      throw new Error("Gagal ambil cookie CapCut.")

    }

    async getUploadCredentials(cookie, payload) {

      const url = `${this.config.API_BASE_URL}/lv/v1/upload_sign`

      const headers = this._generateHeaders(url, payload, cookie)

      const r = await this._request("post", url, { headers, data: payload })

      if (r?.ret !== "0") throw new Error("Gagal ambil kredensial upload dari CapCut.")

      const d = r?.data

      if (!d?.access_key_id || !d?.session_token || !d?.secret_access_key || !d?.space_name) {

        throw new Error("Kredensial upload tidak valid.")

      }

      return d

    }

    async getUploadAddress(credentials, fileSize, params = {}) {

      const q = {

        Action: "ApplyUploadInner",

        Version: this.config.VOD_API_VERSION,

        SpaceName: credentials.space_name,

        IsInner: "1",

        FileSize: fileSize,

        s: Math.random().toString(36).substring(2),

        ...params,

      }

      const requestOptions = {

        method: "GET",

        host: this.config.VOD_HOST,

        path: "/?" + new URLSearchParams(q).toString(),

        service: this.config.VOD_SERVICE_NAME,

        region: this.config.VOD_REGION,

      }

      const signed = aws4.sign(requestOptions, {

        accessKeyId: credentials.access_key_id,

        secretAccessKey: credentials.secret_access_key,

        sessionToken: credentials.session_token,

      })

      const url = `https://${signed.host}${signed.path}`

      const headers = { ...signed.headers }

      if (!headers["x-amz-security-token"] && credentials.session_token) headers["x-amz-security-token"] = credentials.session_token

      const r = await this._request("get", url, { headers })

      const node = r?.Result?.UploadAddress || r?.Result?.InnerUploadAddress?.UploadNodes?.[0]

      let info = null

      if (node?.UploadHosts?.[0] && node?.StoreInfos?.[0]?.StoreUri && node?.SessionKey && node?.StoreInfos?.[0]?.Auth) {

        info = { uploadHost: node.UploadHosts[0], uploadUri: node.StoreInfos[0].StoreUri, auth: node.StoreInfos[0].Auth, sessionKey: node.SessionKey }

      } else if (node?.UploadHost && node?.StoreInfos?.[0]?.StoreUri && node?.SessionKey && node?.StoreInfos?.[0]?.Auth) {

        info = { uploadHost: node.UploadHost, uploadUri: node.StoreInfos[0].StoreUri, auth: node.StoreInfos[0].Auth, sessionKey: node.SessionKey }

      }

      if (!info) throw new Error("Gagal ambil alamat upload VOD.")

      return info

    }

    async commitUpload(credentials, sessionKey) {

      const payload = { SessionKey: sessionKey, Functions: [] }

      const body = JSON.stringify(payload)

      const sha = this._sha256(body)

      const q = { Action: "CommitUploadInner", Version: this.config.VOD_API_VERSION, SpaceName: credentials.space_name }

      const req = {

        method: "POST",

        host: this.config.VOD_HOST,

        path: "/?" + new URLSearchParams(q).toString(),

        headers: { "Content-Type": "application/json", "x-amz-content-sha256": sha },

        body,

        service: this.config.VOD_SERVICE_NAME,

        region: this.config.VOD_REGION,

      }

      const signed = aws4.sign(req, {

        accessKeyId: credentials.access_key_id,

        secretAccessKey: credentials.secret_access_key,

        sessionToken: credentials.session_token,

      })

      const url = `https://${signed.host}${signed.path}`

      const r = await this._request("post", url, { headers: signed.headers, data: signed.body })

      const assetId = r?.Result?.Results?.[0]?.Uri || r?.Result?.Results?.[0]?.Vid

      if (!assetId) throw new Error("CommitUploadInner gagal / assetId tidak ditemukan.")

      return assetId

    }

    async uploadFile(info, tempId, fileBuffer, chunkSize = this.config.DEFAULT_CHUNK_SIZE) {

      const token = info.auth

      const totalSize = fileBuffer.length

      const numChunks = Math.ceil(totalSize / chunkSize)

      const baseUriPath = info.uploadUri.startsWith("/") ? info.uploadUri : `/${info.uploadUri}`

      const baseUrl = numChunks > 1 ? `https://${info.uploadHost}/upload/v1${baseUriPath}` : `https://${info.uploadHost}${baseUriPath}`

      if (numChunks === 1) return this._uploadNonChunkFile(baseUrl, token, tempId, fileBuffer)

      const uploadId = await this._initiateMultipartUpload(baseUrl, token, tempId)

      const parts = []

      for (let partNumber = 1; partNumber <= numChunks; partNumber++) {

        const offset = (partNumber - 1) * chunkSize

        const end = Math.min(offset + chunkSize, totalSize)

        const chunk = fileBuffer.slice(offset, end)

        const chunkUrl = `${baseUrl}?uploadid=${uploadId}&part_number=${partNumber}&phase=transfer&part_offset=${offset}`

        parts.push(await this._uploadSingleChunk(chunkUrl, token, tempId, chunk, partNumber, numChunks))

      }

      return this._finishMultipartUpload(baseUrl, token, tempId, uploadId, parts)

    }

    async _uploadNonChunkFile(url, token, tempId, fileBuffer) {

      const crc = toCrcHex(crc32(fileBuffer))

      const headers = {

        Authorization: token,

        "Content-Type": "application/octet-stream",

        "Content-CRC32": crc,

        "Content-Length": String(fileBuffer.length),

        "x-storage-u": tempId,

      }

      const r = await this._request("post", url, { headers, data: fileBuffer, maxBodyLength: Infinity, maxContentLength: Infinity })

      if (r?.code && r.code !== 2000) throw new Error("Upload ditolak storage.")

    }

    async _initiateMultipartUpload(baseUrl, token, tempId) {

      const url = `${baseUrl}?uploadmode=part&phase=init`

      const headers = { Authorization: token, "x-storage-u": tempId, "Content-Length": "0" }

      const r = await this._request("post", url, { headers, data: null })

      if (r?.code === 2000 && r?.data?.uploadid) return r.data.uploadid

      throw new Error("Gagal init multipart upload.")

    }

    async _uploadSingleChunk(chunkUrl, token, tempId, chunkBuffer, partNumber, totalChunks) {

      const crc = toCrcHex(crc32(chunkBuffer))

      const headers = {

        Authorization: token,

        "Content-Type": "application/octet-stream",

        "Content-CRC32": crc,

        "Content-Length": String(chunkBuffer.length),

        "x-storage-u": tempId,

      }

      const r = await this._request("post", chunkUrl, { headers, data: chunkBuffer, maxBodyLength: Infinity, maxContentLength: Infinity })

      if (r?.code && r.code !== 2000) throw new Error(`Chunk ${partNumber}/${totalChunks} gagal diupload.`)

      return { partNumber, crc32: crc }

    }

    async _finishMultipartUpload(baseUrl, token, tempId, uploadId, uploadedParts) {

      const url = `${baseUrl}?uploadmode=part&phase=finish&uploadid=${uploadId}`

      const payload = uploadedParts

        .sort((a, b) => a.partNumber - b.partNumber)

        .map((p) => `${p.partNumber}:${p.crc32}`)

        .join(",")

      const buf = Buffer.from(payload, "utf-8")

      const headers = {

        Authorization: token,

        "Content-Type": "text/plain;charset=UTF-8",

        "Content-Length": String(buf.length),

        "x-storage-u": tempId,

      }

      const r = await this._request("post", url, { headers, data: buf })

      if (r?.code !== 2000) throw new Error("Gagal finalize multipart upload.")

    }

    async createUploadTask(cookie, assetId, ext) {

      const safeExt = String(ext || "mp4").replace(/[^a-z0-9]/gi, "").toLowerCase() || "mp4"

      const fileName = `${Date.now()}_${crypto.randomBytes(4).toString("hex")}.${safeExt}`

      const payload = {

        vid: assetId,

        tmp_id: this.tempId,

        file_name: fileName,

        file_type: this.config.FILE_TYPE_VIDEO,

        source_path: fileName,

      }

      const url = `${this.config.API_BASE_URL}/lv/v1/upload/create_upload_task`

      const headers = this._generateHeaders(url, payload, cookie)

      const r = await this._request("post", url, { headers, data: payload })

      if (r?.ret !== "0" || !r?.data?.task_id) throw new Error("Gagal create_upload_task.")

      return r.data.task_id

    }

    async poolForUploadTask(cookie, taskId) {

      const url = `${this.config.API_BASE_URL}/lv/v1/upload/get_upload_task`

      const payload = { tmp_id: this.tempId, task_id: taskId, is_support_webp: 0 }

      for (let i = 1; i <= 60; i++) {

        const headers = this._generateHeaders(url, payload, cookie)

        const r = await this._request("post", url, { headers, data: payload }, { maxRetries: 1, retryDelay: 1000 })

        if (r?.ret === "0") {

          if (r?.data?.status === 1) return r.data

          if (r?.data?.status === 2) throw new Error("Upload task gagal diproses di server.")

        }

        await new Promise((s) => setTimeout(s, 3000))

      }

      throw new Error("Timeout upload task (server terlalu lama).")

    }

    async createIntelegence(cookie, slug, payload) {

      const slugPath = slug ? `${String(slug).replace(/_$/, "")}_` : ""

      const url = `${this.config.API_BASE_URL}/lv/v1/intelligence/${slugPath}create`

      const headers = this._generateHeaders(url, payload, cookie)

      const r = await this._request("post", url, { headers, data: payload })

      if (r?.errmsg !== "success" || !r?.data) throw new Error("Gagal create intelligence task.")

      const taskId = slug ? r.data.pipeline_id : r.data.task_id

      if (!taskId) throw new Error("Task ID tidak ditemukan.")

      return taskId

    }

    async pollForResult(cookie, slug, taskId, maxAttempts = DEFAULT_POLL_ATTEMPTS) {

      const slugPath = slug ? `${String(slug).replace(/_$/, "")}_` : ""

      const url = `${this.config.API_BASE_URL}/lv/v1/intelligence/${slugPath}query`

      const taskIdKey = slug ? "pipeline_id" : "task_id"

      const statusKey = slug ? "pipeline_status" : "status"

      const payload = { [taskIdKey]: taskId, workspace_id: "" }

      const delay = maxAttempts === LONG_POLL_ATTEMPTS ? LONG_POLL_INTERVAL_MS : DEFAULT_POLL_INTERVAL_MS

      for (let i = 1; i <= maxAttempts; i++) {

        const headers = this._generateHeaders(url, payload, cookie)

        const r = await this._request("post", url, { headers, data: payload }, { maxRetries: 1, retryDelay: 1000 })

        if (r?.errmsg === "success" && r?.data) {

          const status = r.data[statusKey]

          if (status === 2) return (slug ? r.data.pipeline_result : (r.data.task_detail ?? r.data)) ?? null

          if (status === 3) throw new Error("Task upscale gagal.")

        }

        await new Promise((s) => setTimeout(s, delay))

      }

      return null

    }

    async _downloadAndDecryptVideo(url, key, decryptedOutputPath) {

      const uuid = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString("hex")

      const encryptedFilePath = path.join(TEMP_DIR, `encrypted_${uuid}.mp4`)

      let writer = null

      try {

        const r = await axios({ method: "GET", url, responseType: "stream" })

        if (r.status !== 200) throw new Error("Gagal download video hasil (encrypted).")

        writer = fs.createWriteStream(encryptedFilePath)

        r.data.pipe(writer)

        await new Promise((resolve, reject) => {

          writer.on("finish", resolve)

          writer.on("error", reject)

          r.data.on("error", reject)

        })

        writer = null

        await new Promise((resolve, reject) => {

          const args = ["-v", "error", "-decryption_key", key, "-i", encryptedFilePath, "-c", "copy", "-movflags", "+faststart", "-y", decryptedOutputPath]

          const p = spawn(ffmpegPath, args)

          let stderr = ""

          p.stderr.on("data", (d) => (stderr += d.toString()))

          p.on("close", (code) => (code === 0 ? resolve() : reject(new Error(stderr || "Decrypt gagal."))))

          p.on("error", () => reject(new Error("FFmpeg decrypt gagal dijalankan.")))

        })

      } finally {

        if (writer && !writer.closed) writer.close()

        if (fs.existsSync(encryptedFilePath)) await fsPromises.unlink(encryptedFilePath).catch(() => {})

      }

    }

    async processVideo(videoBuffer) {

      if (!Buffer.isBuffer(videoBuffer)) throw new Error("Input harus Buffer video.")

      const ext = guessVideoExt(videoBuffer)

      const meta = await this._getMetaVideo(videoBuffer, `temp_video_${Date.now()}.mp4`)

      const targetWidth = Math.min(meta.width * 2, MAX_VIDEO_WIDTH)

      const targetHeight = Math.min(meta.height * 2, MAX_VIDEO_HEIGHT)

      this.tempId = crypto.randomBytes(6).toString("base64url")

      const cookie = await this.getCookie()

      const creds = await this.getUploadCredentials(cookie, { key_version: "v5", biz: this.config.BIZ_WEB_VIDEO })

      const uploadInfo = await this.getUploadAddress(creds, videoBuffer.length, { FileType: "video" })

      await this.uploadFile(uploadInfo, this.tempId, videoBuffer)

      const assetId = await this.commitUpload(creds, uploadInfo.sessionKey)

      const uploadTaskId = await this.createUploadTask(cookie, assetId, ext)

      const taskResult = await this.poolForUploadTask(cookie, uploadTaskId)

      const sourceAssetId = taskResult?.video?.source

      if (!sourceAssetId) throw new Error("Source asset ID tidak ditemukan setelah upload task.")

      const createPayload = {

        asset_id: sourceAssetId,

        platform: 2,

        resource_idc: "sg1",

        smart_tool_type: this.config.TOOL_TYPE_UPSCALE_VIDEO,

        tmp_id: this.tempId,

        params: JSON.stringify({ width: targetWidth, height: targetHeight }),

      }

      const intelId = await this.createIntelegence(cookie, "", createPayload)

      const result = await this.pollForResult(cookie, "", intelId, LONG_POLL_ATTEMPTS)

      if (result === null) throw new Error("Timeout menunggu hasil upscale.")

      const list = Array.isArray(result) ? result : result?.result || result?.data || result?.task_result || []

      const first = Array.isArray(list) ? list[0] : null

      const playInfo = first?.video?.play_info || result?.[0]?.video?.play_info

      if (!playInfo?.url || !playInfo?.key) throw new Error("URL/key decrypt hasil upscale tidak ditemukan.")

      const outPath = path.join(TEMP_DIR, `decrypted_upscaled_${Date.now()}.${ext || "mp4"}`)

      try {

        await this._downloadAndDecryptVideo(playInfo.url, playInfo.key, outPath)

        const outBuf = await fsPromises.readFile(outPath)

        if (!outBuf?.length) throw new Error("Buffer hasil kosong.")

        return outBuf

      } finally {

        if (fs.existsSync(outPath)) await fsPromises.unlink(outPath).catch(() => {})

      }

    }

  }

  ev.on(

    {

      cmd: ["capcutup", "upscalevideo", "upvid"],

      tag: "tools",

      energy: 25,

      media: { type: ["video"], save: false },

    },

    async (res) => {

      const cht = res?.cht

      try {

        if (!cht) throw new Error("Context (cht) kosong dari dispatcher.")

        if (typeof cht.react === "function") cht.react("⏳")

        const videoBuffer = await pickVideoBuffer({ cht, media: res?.media })

        const capcut = new CapcutMagic(false)

        const out = await capcut.processVideo(videoBuffer)

        await safeSendVideo(cht, out, "capcut_upscale.mp4", "✅ Upscale selesai.")

        if (typeof cht.react === "function") cht.react("✅")

      } catch (e) {

        if (typeof cht?.react === "function") cht.react("❌")

        await safeReply(cht, `Gagal upscale.\n${e?.message || e}`)

      }

    }

  )

}