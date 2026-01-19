import { NextResponse } from "next/server"
import { completeOrder, getOrderById } from "@/lib/store"
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

  const result = await completeOrder(params.orderId)
  if (!result) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 409 })
  }

  const order = await getOrderById(params.orderId)
  if (order) {
    sendMessage({
      chat_id: order.userId,
      text: `🎉 Заявка #${params.orderId.slice(0, 6)} завершена. Спасибо! Откройте мини-приложение для истории.`,
    }).catch(() => null)
  }

  return NextResponse.json({ order: result })
}
