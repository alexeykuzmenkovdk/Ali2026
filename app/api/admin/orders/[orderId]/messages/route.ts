import { NextResponse } from "next/server"
import { addMessage, getOrderById } from "@/lib/store"
import { sendMessage } from "@/lib/telegram-bot"

function requireAdminKey(request: Request) {
  const expected = process.env.ADMIN_API_KEY
  if (!expected) return false
  const provided = request.headers.get("x-admin-key")
  return expected === provided
}

export async function POST(request: Request, { params }: { params: { orderId: string } }) {
  if (!requireAdminKey(request)) {
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
      text: `✉️ Оператор ответил по заявке #${params.orderId.slice(0, 6)}\n${body.text ?? ""}`,
    }).catch(() => null)
  }

  return NextResponse.json({ message })
}
