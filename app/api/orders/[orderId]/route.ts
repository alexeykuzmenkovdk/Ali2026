import { NextResponse } from "next/server"
import { getOrderByIdForUser, listOrderMessages, listOrderSteps } from "@/lib/store"
import { requireTelegramInitData } from "@/lib/telegram"

export async function GET(request: Request, { params }: { params: { orderId: string } }) {
  const initData = request.headers.get("x-telegram-init-data")
  const telegram = requireTelegramInitData(initData)
  if (!telegram?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const order = await getOrderByIdForUser(params.orderId, telegram.user.id)
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  const steps = await listOrderSteps(order.id)
  const messages = await listOrderMessages(order.id)
  return NextResponse.json({ order, steps, messages })
}
