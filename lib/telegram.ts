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
    initData
      .split("&")
      .map((part) => part.split("=") as [string, string])
      .map(([key, value]) => [key, decodeURIComponent(value)]),
  )
}

export function validateInitData(initData: string, botToken: string) {
  const data = parseInitData(initData)
  const hash = data.hash
  if (!hash) return false
  const dataCheckString = Object.keys(data)
    .filter((key) => key !== "hash")
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("\n")

  const secretKey = crypto.createHash("sha256").update(botToken).digest()
  const hmac = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex")
  return hmac === hash
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
  const botToken = process.env.TELEGRAM_MINI_APP_BOT_TOKEN ?? process.env.TELEGRAM_BOT_TOKEN
  if (!initData) {
    if (process.env.NODE_ENV === "production") return null
    return { user: { id: 0, username: "demo" } }
  }
  if (!botToken) return null
  if (!validateInitData(initData, botToken)) {
    if (process.env.NODE_ENV === "production") return null
  }
  return getTelegramUser(initData)
}
