import crypto from "crypto"

export interface TelegramUser {
  id: number
  username?: string
  first_name?: string
  last_name?: string
}

export interface TelegramInitData {
  user?: TelegramUser
  query_id?: string
}

export function parseInitData(initData: string): Record<string, string> {
  return Object.fromEntries(
    initData.split("&").map((part) => {
      const separatorIndex = part.indexOf("=")
      if (separatorIndex === -1) {
        return [part, ""]
      }
      const key = part.slice(0, separatorIndex)
      const rawValue = part.slice(separatorIndex + 1)
      const decodedValue = decodeURIComponent(rawValue.replace(/\+/g, " "))
      return [key, decodedValue]
    }),
  )
}

export function normalizeInitData(initData: string) {
  if (initData.startsWith("base64:")) {
    const encoded = initData.slice("base64:".length)
    try {
      return Buffer.from(encoded, "base64").toString("utf-8")
    } catch (error) {
      console.warn("[Telegram] Failed to decode base64 initData header", error)
      return initData
    }
  }
  try {
    return decodeURIComponent(initData)
  } catch (error) {
    console.warn("[Telegram] Failed to decode initData header", error)
    return initData
  }
}

export function validateInitData(initData: string, botToken: string) {
  const params = new URLSearchParams(initData)
  const hash = params.get("hash")
  if (!hash) return false
  params.delete("hash")

  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n")

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest()
  const computedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex")

  return computedHash === hash
}

export function getTelegramUser(initData: string): TelegramInitData {
  const data = parseInitData(initData)
  const user = data.user ? (JSON.parse(data.user) as TelegramUser) : undefined
  return {
    user,
    query_id: data.query_id,
  }
}

export function requireTelegramInitData(initData: string | null) {
  if (!initData) {
    if (process.env.NODE_ENV === "production") return null
    return { user: { id: 0, username: "demo" } }
  }

  const normalizedInitData = normalizeInitData(initData)

  const mini = process.env.TELEGRAM_MINI_APP_BOT_TOKEN
  const main = process.env.TELEGRAM_BOT_TOKEN

  if (!mini && !main) {
    console.warn("[Telegram] Bot token missing")
    if (process.env.NODE_ENV === "production") return null
    return getTelegramUser(normalizedInitData)
  }

  const okMini = mini ? validateInitData(normalizedInitData, mini) : false
  const okMain = main ? validateInitData(normalizedInitData, main) : false

  console.log("[tg] validateInitData mini:", okMini, "main:", okMain)

  if (!okMini && !okMain) {
    if (process.env.NODE_ENV === "production") return null
  }
  return getTelegramUser(normalizedInitData)
}
