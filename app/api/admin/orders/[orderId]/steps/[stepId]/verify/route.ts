import { NextResponse } from "next/server"
import { getOrderById, verifyPaymentStep } from "@/lib/store"
import { sendMessage } from "@/lib/telegram-bot"

function requireAdminKey(request: Request) {
  const expected = process.env.ADMIN_API_KEY
  if (!expected) return false
  const provided = request.headers.get("x-admin-key")
  return expected === provided
}

export async function POST(request: Request, { params }: { params: { orderId: string; stepId: string } }) {
  if (!requireAdminKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const step = await verifyPaymentStep(params.orderId, params.stepId)
  if (!step) {
    return NextResponse.json({ error: "Step not found" }, { status: 404 })
  }

  const order = await getOrderById(params.orderId)
  if (order) {
    sendMessage({
      chat_id: order.userId,
      text: `✅ Платеж подтвержден по заявке #${params.orderId.slice(0, 6)}. Откройте мини-приложение для продолжения.`,
    }).catch(() => null)
  }

  return NextResponse.json({ step })
}
