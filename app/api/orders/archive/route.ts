import { NextResponse } from "next/server"
import { listArchivedOrders } from "@/lib/store"
import { requireTelegramInitData } from "@/lib/telegram"

export async function GET(request: Request) {
  const initData = request.headers.get("x-telegram-init-data")
  const telegram = requireTelegramInitData(initData)
  if (!telegram?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const orders = await listArchivedOrders(telegram.user.id)
  return NextResponse.json({ orders })
}
