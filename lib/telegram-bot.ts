interface SendMessagePayload {
  chat_id: number
  text: string
  reply_markup?: unknown
}

interface SendPhotoPayload {
  chat_id: number
  photo: string
  caption?: string
  reply_markup?: unknown
}

const apiBase = "https://api.telegram.org"

function getBotToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) {
    throw new Error("Missing TELEGRAM_BOT_TOKEN")
  }
  return token
}

export async function sendMessage(payload: SendMessagePayload) {
  const token = getBotToken()
  const response = await fetch(`${apiBase}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  return response.json()
}

export async function sendPhoto(payload: SendPhotoPayload) {
  const token = getBotToken()
  const response = await fetch(`${apiBase}/bot${token}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  return response.json()
}

export async function getFileUrl(fileId: string) {
  const token = getBotToken()
  const response = await fetch(`${apiBase}/bot${token}/getFile?file_id=${fileId}`)
  const data = await response.json()
  if (!data.ok) return null
  const filePath = data.result?.file_path
  if (!filePath) return null
  return `${apiBase}/file/bot${token}/${filePath}`
}

export async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  const token = getBotToken()
  await fetch(`${apiBase}/bot${token}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
  })
}
