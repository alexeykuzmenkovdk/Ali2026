import { NextResponse } from "next/server"
import { markStepPaid } from "@/lib/store"
import { requireTelegramInitData } from "@/lib/telegram"
import { sendMessage } from "@/lib/telegram-bot"

export async function POST(request: Request, { params }: { params: { orderId: string; stepId: string } }) {
  const initData = request.headers.get("x-telegram-init-data")
  const telegram = requireTelegramInitData(initData)
  if (!telegram?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const step = await markStepPaid(params.orderId, params.stepId, body.receiptFileUrl)
  if (!step) {
    return NextResponse.json({ error: "Step not found" }, { status: 404 })
  }

  const adminId = process.env.ADMIN_USER_ID
  if (adminId) {
    sendMessage({
      chat_id: Number(adminId),
      text: `✅ Клиент отметил оплату по заявке #${params.orderId.slice(0, 6)}. Проверьте чек в админ-панели.`,
    }).catch(() => null)
  }

  return NextResponse.json({ step })
}
