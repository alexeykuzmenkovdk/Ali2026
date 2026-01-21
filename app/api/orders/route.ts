import { NextResponse } from "next/server"
import { createOrder, getActiveOrder, listOrderMessages, listOrderSteps } from "@/lib/store"
import { requireTelegramInitData } from "@/lib/telegram"

export async function POST(request: Request) {
  const initData = request.headers.get("x-telegram-init-data")
  const telegram = requireTelegramInitData(initData)
  if (!telegram?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const existing = await getActiveOrder(telegram.user.id)
  if (existing) {
    return NextResponse.json({ error: "Active order exists" }, { status: 409 })
  }

  const body = await request.json()
  const order = await createOrder({
    userId: telegram.user.id,
    totalRub: body.totalRub,
    totalCny: body.totalCny,
    rate: body.rate,
    fullName: body.fullName,
    contactUsername: telegram.user.username ?? telegram.user.first_name,
    contactPhone: body.contactPhone,
  })

  const steps = await listOrderSteps(order.id)
  const messages = await listOrderMessages(order.id)
  return NextResponse.json({ order, steps, messages })
}
