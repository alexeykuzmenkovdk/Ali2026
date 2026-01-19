import { NextResponse } from "next/server"
import { getActiveOrder, listOrderMessages, listOrderSteps } from "@/lib/store"
import { requireTelegramInitData } from "@/lib/telegram"

export async function GET(request: Request) {
  const initData = request.headers.get("x-telegram-init-data")
  const telegram = requireTelegramInitData(initData)
  if (!telegram?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const order = await getActiveOrder(telegram.user.id)
  if (!order) {
    return NextResponse.json({ order: null })
  }

  const steps = await listOrderSteps(order.id)
  const messages = await listOrderMessages(order.id)
  return NextResponse.json({ order, steps, messages })
}
