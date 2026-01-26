import { NextResponse } from "next/server"
import { addMessage, listOrderMessages } from "@/lib/store"
import { requireTelegramInitData } from "@/lib/telegram"
import { getAdminChatId, sendMessage } from "@/lib/telegram-bot"

export async function GET(request: Request, { params }: { params: { orderId: string } }) {
  const initData = request.headers.get("x-telegram-init-data")
  const telegram = requireTelegramInitData(initData)
  if (!telegram?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const limitParam = searchParams.get("limit")
  const beforeMessageId = searchParams.get("before")
  const limit = limitParam ? Number(limitParam) : undefined
  const messages = await listOrderMessages(params.orderId, {
    limit: Number.isNaN(limit) ? undefined : limit,
    beforeMessageId: beforeMessageId || undefined,
  })
  return NextResponse.json({ messages })
}

export async function POST(request: Request, { params }: { params: { orderId: string } }) {
  const initData = request.headers.get("x-telegram-init-data")
  const telegram = requireTelegramInitData(initData)
  if (!telegram?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  if (!body.text && !body.fileUrl) {
    return NextResponse.json({ error: "Empty message" }, { status: 400 })
  }
  const message = await addMessage({
    orderId: params.orderId,
    senderRole: "client",
    text: body.text,
    fileUrl: body.fileUrl,
  })

  const origin = new URL(request.url).origin
  const fileLink = body.fileUrl ? new URL(body.fileUrl, origin).toString() : null

  const clientNoticeLines = [
    `✉️ Новое сообщение в комнате сделки #${params.orderId.slice(0, 6)}`,
    body.text ?? "",
    fileLink ? `📎 Файл: ${fileLink}` : "",
    "Вернуться в комнату сделки: https://t.me/AlipayFastBot/alipayfast",
  ].filter(Boolean)

  sendMessage({
    chat_id: telegram.user.id,
    text: clientNoticeLines.join("\n"),
  }).catch(() => null)

  const adminChatId = getAdminChatId()
  if (adminChatId) {
    const noticeLines = [
      `✉️ Новое сообщение по заявке #${params.orderId.slice(0, 6)}`,
      body.text ?? "",
      fileLink ? `📎 Файл: ${fileLink}` : "",
      "Вернуться в комнату сделки: https://t.me/AlipayFastBot/alipayfast",
    ].filter(Boolean)
    sendMessage({
      chat_id: adminChatId,
      text: noticeLines.join("\n"),
    }).catch(() => null)
  }

  return NextResponse.json({ message })
}
