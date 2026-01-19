import { NextResponse } from "next/server"
import { addMessage, listOrderMessages } from "@/lib/store"
import { requireTelegramInitData } from "@/lib/telegram"
import { sendMessage } from "@/lib/telegram-bot"

export async function GET(request: Request, { params }: { params: { orderId: string } }) {
  const initData = request.headers.get("x-telegram-init-data")
  const telegram = requireTelegramInitData(initData)
  if (!telegram?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const messages = await listOrderMessages(params.orderId)
  return NextResponse.json({ messages })
}

export async function POST(request: Request, { params }: { params: { orderId: string } }) {
  const initData = request.headers.get("x-telegram-init-data")
  const telegram = requireTelegramInitData(initData)
  if (!telegram?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const message = await addMessage({
    orderId: params.orderId,
    senderRole: "client",
    text: body.text,
  })

  const adminId = process.env.ADMIN_USER_ID
  if (adminId) {
    sendMessage({
      chat_id: Number(adminId),
      text: `✉️ Новое сообщение по заявке #${params.orderId.slice(0, 6)}\n${body.text ?? ""}`,
    }).catch(() => null)
  }

  return NextResponse.json({ message })
}
