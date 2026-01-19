import { NextResponse } from "next/server"

function requireAdminKey(request: Request) {
  const expected = process.env.ADMIN_API_KEY
  if (!expected) return false
  const provided = request.headers.get("x-admin-key")
  return expected === provided
}

export async function POST(request: Request) {
  if (!requireAdminKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) {
    return NextResponse.json({ error: "Missing TELEGRAM_BOT_TOKEN" }, { status: 400 })
  }

  const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL ?? `${request.headers.get("origin")}/api/telegram/webhook`
  const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET

  const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: secretToken,
    }),
  })

  const data = await response.json()
  return NextResponse.json({ ok: data.ok, result: data.result, description: data.description })
}
