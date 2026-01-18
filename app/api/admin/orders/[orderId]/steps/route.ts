import { NextResponse } from "next/server"
import { addPaymentStep, getOrderById } from "@/lib/store"
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
  const step = await addPaymentStep({
    orderId: params.orderId,
    amountRub: body.amountRub,
    method: body.method,
    requisiteValue: body.requisiteValue,
    bankName: body.bankName,
    receiptEmail: body.receiptEmail,
    status: body.status,
  })

  if (order) {
    sendMessage({
      chat_id: order.userId,
      text: `✅ Заявка #${params.orderId.slice(0, 6)} принята. Добавлен этап оплаты #${step.stepIndex}.`,
    }).catch(() => null)
  }

  return NextResponse.json({ step })
}
