import { telegramFetch } from "@/lib/telegram-fetch"

interface SendMessagePayload {
  chat_id: number
  text: string
  parse_mode?: "HTML" | "Markdown" | "MarkdownV2"
  reply_markup?: unknown
}

interface SendPhotoPayload {
  chat_id: number
  photo: string
  caption?: string
  parse_mode?: "HTML" | "Markdown" | "MarkdownV2"
  reply_markup?: unknown
}

const apiBase = "https://api.telegram.org"

function getBotToken() {
  const token = process.env.TELEGRAM_MINI_APP_BOT_TOKEN ?? process.env.TELEGRAM_BOT_TOKEN
  if (!token) {
    throw new Error("Missing TELEGRAM_MINI_APP_BOT_TOKEN")
  }
  return token
}

export async function sendMessage(payload: SendMessagePayload) {
  const token = getBotToken()
  const response = await telegramFetch(`${apiBase}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  return response.json()
}

export async function sendPhoto(payload: SendPhotoPayload) {
  const token = getBotToken()
  const response = await telegramFetch(`${apiBase}/bot${token}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  return response.json()
}

export function getAdminChatId() {
  const adminId = process.env.ADMIN_USER_ID ?? process.env.TELEGRAM_SITE_CHAT_ID ?? process.env.TELEGRAM_CHAT_ID
  if (!adminId) return null
  const numericId = Number(adminId)
  return Number.isNaN(numericId) ? null : numericId
}

export async function getFileUrl(fileId: string) {
  const token = getBotToken()
  const response = await telegramFetch(`${apiBase}/bot${token}/getFile?file_id=${fileId}`)
  const data = await response.json()
  if (!data.ok) return null
  const filePath = data.result?.file_path
  if (!filePath) return null
  return `${apiBase}/file/bot${token}/${filePath}`
}

export async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  const token = getBotToken()
  await telegramFetch(`${apiBase}/bot${token}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
  })
}
