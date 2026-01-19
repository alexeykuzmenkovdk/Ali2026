import { NextResponse } from "next/server"
import { cancelOrder, listOrderMessages, listOrderSteps } from "@/lib/store"
import { requireTelegramInitData } from "@/lib/telegram"
import { sendMessage } from "@/lib/telegram-bot"

export async function POST(request: Request, { params }: { params: { orderId: string } }) {
  const initData = request.headers.get("x-telegram-init-data")
  const telegram = requireTelegramInitData(initData)
  if (!telegram?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const order = await cancelOrder(params.orderId)
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  const adminId = process.env.ADMIN_USER_ID
  if (adminId) {
    sendMessage({
      chat_id: Number(adminId),
      text: `⛔️ Клиент отменил заявку #${params.orderId.slice(0, 6)}.`,
    }).catch(() => null)
  }

  const steps = await listOrderSteps(order.id)
  const messages = await listOrderMessages(order.id)
  return NextResponse.json({ order, steps, messages })
}
