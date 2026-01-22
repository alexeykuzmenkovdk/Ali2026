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
  if (!body.text && !body.fileUrl) {
    return NextResponse.json({ error: "Empty message" }, { status: 400 })
  }
  const order = await getOrderById(params.orderId)
  const message = await addMessage({
    orderId: params.orderId,
    senderRole: "admin",
    text: body.text,
    fileUrl: body.fileUrl,
  })

  if (order) {
    const noticeLines = [
      `✉️ Оператор ответил по заявке #${params.orderId.slice(0, 6)}`,
      body.text ?? "",
      body.fileUrl ? `📎 Файл: ${body.fileUrl}` : "",
      "Откройте мини-приложение для продолжения.",
    ].filter(Boolean)
    sendMessage({
      chat_id: order.userId,
      text: noticeLines.join("\n"),
    }).catch(() => null)
  }

  return NextResponse.json({ message })
}
