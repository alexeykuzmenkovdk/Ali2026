import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[API] Получена заявка на услуги баера:", body)

    const { orderNumber, name, contact, contactMethod, telegramUsername, message, productLink, type } = body

    // Проверяем наличие переменных окружения
    const botToken = process.env.TELEGRAM_SITE_BOT_TOKEN ?? process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_SITE_CHAT_ID ?? process.env.TELEGRAM_CHAT_ID

    if (!botToken || !chatId) {
      console.log("[API] Переменные окружения не настроены, работаем в демо-режиме")
      return NextResponse.json({
        success: true,
        demo: true,
        message: "Демо-режим: Telegram не настроен",
      })
    }

    // Формируем сообщение для Telegram
    const contactMethodText =
      {
        telegram: "Telegram",
        whatsapp: "WhatsApp",
        email: "Email",
      }[contactMethod] || contactMethod

    const telegramMessage = `🛒 Новая заявка на услуги баера!

📋 Номер заявки: ${orderNumber}
👤 Имя клиента: ${name}
📞 Контакт: ${contact} (${contactMethodText})${telegramUsername ? `\n💬 Ник в Telegram: ${telegramUsername}` : ""}${productLink ? `\n🔗 Ссылка на товар: ${productLink}` : ""}
📝 Описание заказа: ${message}

🕐 Дата и время: ${new Date().toLocaleString("ru-RU", {
      timeZone: "Europe/Moscow",
    })}`

    console.log("[API] Отправляем сообщение в Telegram:", telegramMessage)

    // Отправляем сообщение в Telegram
    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage,
        parse_mode: "HTML",
      }),
    })

    const telegramResult = await telegramResponse.json()
    console.log("[API] Ответ от Telegram:", telegramResult)

    if (!telegramResponse.ok) {
      throw new Error(`Ошибка Telegram API: ${telegramResult.description || "Неизвестная ошибка"}`)
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      message: "Заявка успешно отправлена",
    })
  } catch (error) {
    console.error("[API] Ошибка при отправке заявки:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Внутренняя ошибка сервера",
      },
      { status: 500 },
    )
  }
}
