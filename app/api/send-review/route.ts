import { NextResponse } from "next/server"

// Интерфейс для данных отзыва
interface ReviewData {
  name: string
  location: string
  text: string
  rating: number
  date: string
}

// Функция для отправки сообщения в Telegram
async function sendTelegramMessage(message: string) {
  // Telegram username получателя (без символа @)
  const username = "whaledator"

  // Токен бота (в реальном приложении должен храниться в переменных окружения)
  // Для тестирования используем заглушку
  const botToken = process.env.TELEGRAM_BOT_TOKEN || "YOUR_BOT_TOKEN"

  // ID чата (в реальном приложении должен быть получен и сохранен заранее)
  // Для тестирования используем заглушку
  const chatId = process.env.TELEGRAM_CHAT_ID || "YOUR_CHAT_ID"

  try {
    // Проверяем наличие токена и chat_id
    if (botToken === "YOUR_BOT_TOKEN" || chatId === "YOUR_CHAT_ID") {
      console.log("Telegram notification would be sent to @" + username + " with message:", message)
      return { success: true, demo: true }
    }

    // Отправляем сообщение через Telegram Bot API
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    })

    const data = await response.json()

    if (!data.ok) {
      throw new Error(data.description || "Failed to send Telegram message")
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending Telegram message:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// API endpoint для отправки отзыва
export async function POST(request: Request) {
  try {
    const data: ReviewData = await request.json()

    // Формируем сообщение для отправки
    const message = `
<b>⭐ Новый отзыв!</b>

<b>Имя:</b> ${data.name}
<b>Город:</b> ${data.location}
<b>Оценка:</b> ${"⭐".repeat(data.rating)}
<b>Дата:</b> ${data.date}

<b>Текст отзыва:</b>
${data.text}

<i>Отзыв отправлен на модерацию</i>
`.trim()

    // Отправляем сообщение в Telegram
    const result = await sendTelegramMessage(message)

    if (result.demo) {
      return NextResponse.json({
        success: true,
        demo: true,
        message: "Демо-режим: Уведомление было бы отправлено в Telegram",
      })
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Отзыв успешно отправлен в Telegram",
      })
    } else {
      throw new Error(result.error || "Failed to send Telegram notification")
    }
  } catch (error) {
    console.error("Error processing review:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Произошла ошибка при обработке отзыва",
      },
      { status: 500 },
    )
  }
}
