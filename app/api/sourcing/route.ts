import { NextResponse } from "next/server"
import { createSourcingRequest, getLastSourcingRequest } from "@/lib/store"
import { requireTelegramInitData } from "@/lib/telegram"
import { getAdminChatId, sendMessage, sendPhoto } from "@/lib/telegram-bot"

const HOURS_LIMIT = 48

export async function POST(request: Request) {
  const initData = request.headers.get("x-telegram-init-data")
  const telegram = requireTelegramInitData(initData)
  if (!telegram?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const lastRequest = await getLastSourcingRequest(telegram.user.id)
  if (lastRequest) {
    const hoursSince = (Date.now() - new Date(lastRequest.createdAt).getTime()) / 36e5
    if (hoursSince < HOURS_LIMIT) {
      return NextResponse.json(
        { error: "Cooldown", nextAvailableHours: Math.ceil(HOURS_LIMIT - hoursSince) },
        { status: 429 },
      )
    }
  }

  const body = await request.json()
  const requestItem = await createSourcingRequest({
    userId: telegram.user.id,
    description: body.description,
    imageUrl: body.imageUrl,
    link: body.link,
    priceRub: body.priceRub,
  })

  const adminChatId = getAdminChatId()
  if (adminChatId) {
    const captionLines = [
      `🔍 Запрос #${requestItem.id.slice(0, 6)}`,
      `Описание: ${requestItem.description}`,
    ]
    if (requestItem.priceRub) {
      captionLines.push(`Цена РФ: ${requestItem.priceRub.toLocaleString()} ₽`)
    }
    if (requestItem.link) {
      captionLines.push(`Ссылка: ${requestItem.link}`)
    }
    const caption = captionLines.join("\n")

    const replyMarkup = {
      inline_keyboard: [
        [
          { text: "Ответить ценой", callback_data: `sourcing_answer:${requestItem.id}` },
          { text: "Отклонить", callback_data: `sourcing_decline:${requestItem.id}` },
        ],
      ],
    }

    const photoUrl = requestItem.imageUrl
    if (photoUrl) {
      sendPhoto({ chat_id: adminChatId, photo: photoUrl, caption, reply_markup: replyMarkup }).catch(() => null)
    } else {
      sendMessage({ chat_id: adminChatId, text: caption, reply_markup: replyMarkup }).catch(() => null)
    }
  }

  return NextResponse.json({ request: requestItem })
}
