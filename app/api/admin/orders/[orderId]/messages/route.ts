import { NextResponse } from "next/server"
import { addMessage, getOrderById, listOrderMessages } from "@/lib/store"
import { sendMessage } from "@/lib/telegram-bot"
import { requireAdminAuth } from "@/lib/admin-auth"

export async function GET(request: Request, { params }: { params: { orderId: string } }) {
  const auth = requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const messages = await listOrderMessages(params.orderId)
  return NextResponse.json({ messages })
}

export async function POST(request: Request, { params }: { params: { orderId: string } }) {
  const auth = requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  if (!body.text && !body.fileUrl && !body.telegramText) {
    return NextResponse.json({ error: "Empty message" }, { status: 400 })
  }
  const textForStorage = body.text ?? body.telegramText
  const order = await getOrderById(params.orderId)
  const message = await addMessage({
    orderId: params.orderId,
    senderRole: "admin",
    text: textForStorage,
    fileUrl: body.fileUrl,
  })

  const origin = new URL(request.url).origin
  const fileLink = body.fileUrl ? new URL(body.fileUrl, origin).toString() : null
  const telegramText = body.telegramText ?? body.text ?? ""
  const parseMode = body.parseMode

  const adminId = process.env.ADMIN_USER_ID
  if (adminId) {
    const adminNoticeLines = [
      `✉️ Сообщение отправлено клиенту по заявке #${params.orderId.slice(0, 6)}`,
      textForStorage ?? "",
      fileLink ? `📎 Файл: ${fileLink}` : "",
    ].filter(Boolean)
    sendMessage({
      chat_id: Number(adminId),
      text: adminNoticeLines.join("\n"),
    }).catch(() => null)
  }

  if (order) {
    const noticeLines = [
      `✉️ Оператор ответил по заявке #${params.orderId.slice(0, 6)}`,
      telegramText,
      fileLink ? `📎 Файл: ${fileLink}` : "",
      "Вернуться в комнату сделки: t.me/Manivlbot/alipayfast",
    ].filter(Boolean)
    sendMessage({
      chat_id: order.userId,
      text: noticeLines.join("\n"),
      parse_mode: parseMode,
    }).catch(() => null)
  }

  return NextResponse.json({ message })
}
