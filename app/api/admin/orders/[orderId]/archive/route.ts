import { NextResponse } from "next/server"
import { completeOrder, getOrderById } from "@/lib/store"
import { requireAdminAuth } from "@/lib/admin-auth"
import { sendMessage } from "@/lib/telegram-bot"

export async function POST(request: Request, { params }: { params: { orderId: string } }) {
  const auth = requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const result = await completeOrder(params.orderId)
  if (!result) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  const order = await getOrderById(params.orderId)
  if (order) {
    sendMessage({
      chat_id: order.userId,
      text: `✅ Заявка #${params.orderId.slice(0, 6)} закрыта и перемещена в архив.`,
    }).catch(() => null)
  }

  return NextResponse.json({ order: result })
}
