import { NextResponse } from "next/server"
import { adminCancelOrder } from "@/lib/store"
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

  const order = await adminCancelOrder(params.orderId)
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  sendMessage({
    chat_id: order.userId,
    text: `⛔️ Заявка #${params.orderId.slice(0, 6)} отменена администратором. Откройте мини-приложение для деталей.`,
  }).catch(() => null)

  return NextResponse.json({ order })
}
