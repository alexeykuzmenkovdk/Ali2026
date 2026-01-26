import { NextResponse } from "next/server"
import { addMessage, getOrderById, listOrderMessages } from "@/lib/store"
import { sendMessage } from "@/lib/telegram-bot"
import { requireAdminAuth } from "@/lib/admin-auth"

const DEAL_ROOM_LINK = "https://t.me/AlipayFastBot/alipayfast"

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
  const order = await getOrderById(params.orderId)
  const message = await addMessage({
    orderId: params.orderId,
    senderRole: "admin",
    text: body.text,
  })

  if (order) {
    sendMessage({
      chat_id: order.userId,
      text: `✉️ Оператор ответил по заявке #${params.orderId.slice(0, 6)}\n${body.text ?? ""}\n\nВернуться в комнату сделки: ${DEAL_ROOM_LINK}`,
    }).catch(() => null)
  }

  return NextResponse.json({ message })
}
