import { NextResponse } from "next/server"
import { createOrder, listActiveOrders, listOrderMessages, listOrderSteps } from "@/lib/store"
import { sendMessage } from "@/lib/telegram-bot"
import { requireTelegramInitData } from "@/lib/telegram"

export async function POST(request: Request) {
  const initData = request.headers.get("x-telegram-init-data")
  const telegram = requireTelegramInitData(initData)
  if (!telegram?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const activeOrders = await listActiveOrders(telegram.user.id)
  if (activeOrders.length >= 2) {
    return NextResponse.json({ error: "У вас уже есть две активные заявки." }, { status: 409 })
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

  const adminId = process.env.ADMIN_USER_ID
  if (adminId && messages.length > 0) {
    const origin = new URL(request.url).origin
    messages.forEach((message) => {
      if (!message.text && !message.fileUrl) return
      const fileLink = message.fileUrl ? new URL(message.fileUrl, origin).toString() : null
      const noticeLines = [
        `✉️ Новое сообщение по заявке #${order.id.slice(0, 6)}`,
        message.text ?? "",
        fileLink ? `📎 Файл: ${fileLink}` : "",
      ].filter(Boolean)
      sendMessage({
        chat_id: Number(adminId),
        text: noticeLines.join("\n"),
      }).catch(() => null)
    })
  }

  return NextResponse.json({ order, steps, messages })
}
