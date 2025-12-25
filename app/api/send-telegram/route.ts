import { NextResponse } from "next/server"

// Интерфейс для данных заявки
interface OrderData {
  orderNumber: string
  name: string
  contact: string
  contactMethod: string
  telegramUsername?: string
  yuanAmount: string
  rubleAmount: string
  exchangeRate: number
  comment?: string
}

// Функция для отправки сообщения в Telegram
async function sendTelegramMessage(message: string) {
  console.log("[SERVER] Попытка отправки сообщения в Telegram")

  // Получаем токен бота и ID чата из переменных окружения
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  // Проверяем наличие необходимых переменных окружения
  if (!botToken || botToken === "YOUR_BOT_TOKEN") {
    console.log("[SERVER] Отсутствует или некорректный TELEGRAM_BOT_TOKEN")
    return {
      success: false,
      demo: true,
      error: "Не настроен токен бота Telegram. Пожалуйста, добавьте TELEGRAM_BOT_TOKEN в переменные окружения.",
    }
  }

  if (!chatId || chatId === "YOUR_CHAT_ID") {
    console.log("[SERVER] Отсутствует или некорректный TELEGRAM_CHAT_ID")
    return {
      success: false,
      demo: true,
      error: "Не настроен ID чата Telegram. Пожалуйста, добавьте TELEGRAM_CHAT_ID в переменные окружения.",
    }
  }

  try {
    console.log(`[SERVER] Отправка сообщения в Telegram, chat_id: ${chatId}`)

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
      console.error("[SERVER] Ошибка от Telegram API:", data.description)

      // Проверяем конкретные ошибки и даем рекомендации
      if (data.description?.includes("chat not found")) {
        return {
          success: false,
          error: "Чат не найден. Убедитесь, что вы правильно настроили TELEGRAM_CHAT_ID и инициировали бота.",
          telegramError: data.description,
        }
      }

      if (data.description?.includes("bot was blocked")) {
        return {
          success: false,
          error: "Бот был заблокирован пользователем. Разблокируйте бота в Telegram.",
          telegramError: data.description,
        }
      }

      throw new Error(data.description || "Ошибка отправки сообщения в Telegram")
    }

    console.log("[SERVER] Сообщение в Telegram успешно отправлено")
    return { success: true }
  } catch (error) {
    console.error("[SERVER] Ошибка отправки сообщения в Telegram:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Неизвестная ошибка при отправке сообщения",
    }
  }
}

// API endpoint для отправки заявки
export async function POST(request: Request) {
  try {
    const data: OrderData = await request.json()

    // Формируем сообщение для отправки
    const message = `
<b>🔔 Новая заявка на пополнение Alipay!</b>

<b>Номер заявки:</b> ${data.orderNumber}
<b>Имя клиента:</b> ${data.name}
<b>Контакт:</b> ${data.contact} (${data.contactMethod})
${data.telegramUsername ? `<b>Ник в Telegram:</b> ${data.telegramUsername.startsWith("@") ? data.telegramUsername : "@" + data.telegramUsername}` : ""}
<b>Сумма:</b> ${data.yuanAmount} CNY (${data.rubleAmount} RUB)
<b>Курс:</b> ${data.exchangeRate} RUB
${data.comment ? `<b>Комментарий:</b> ${data.comment}` : ""}

<i>Дата и время:</i> ${new Date().toLocaleString("ru-RU")}
`.trim()

    // Отправляем сообщение в Telegram
    const result = await sendTelegramMessage(message)

    if (result.demo) {
      return NextResponse.json({
        success: true,
        demo: true,
        message: "Демо-режим: Уведомление было бы отправлено в Telegram",
        setupRequired: true,
        setupInstructions:
          "Для настройки уведомлений в Telegram, добавьте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в переменные окружения.",
      })
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Заявка успешно отправлена в Telegram",
      })
    } else {
      // Если есть ошибка от Telegram API, возвращаем её с инструкциями
      if (result.telegramError) {
        return NextResponse.json(
          {
            success: false,
            error: result.error,
            telegramError: result.telegramError,
            setupInstructions: `
Для корректной настройки Telegram-бота:
1. Создайте бота через @BotFather в Telegram
2. Получите токен бота и добавьте его как TELEGRAM_BOT_TOKEN
3. Отправьте сообщение боту в Telegram, чтобы инициировать чат
4. Получите ID чата через @userinfobot или API и добавьте его как TELEGRAM_CHAT_ID
5. Убедитесь, что ID чата - это числовое значение (например, 123456789)
          `,
          },
          { status: 400 },
        )
      }

      throw new Error(result.error || "Не удалось отправить уведомление в Telegram")
    }
  } catch (error) {
    console.error("[SERVER] Ошибка обработки заявки:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Произошла ошибка при обработке заявки",
      },
      { status: 500 },
    )
  }
}
