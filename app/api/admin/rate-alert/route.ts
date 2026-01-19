import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Путь к файлу с настройками оповещений
const alertsFilePath = path.join(process.cwd(), "data", "rate-alerts.json")

// Функция для проверки аутентификации через токен
function isAuthenticated(request: Request) {
  try {
    // Получаем токен из заголовков или URL параметров
    const url = new URL(request.url)
    const tokenFromUrl = url.searchParams.get("token")
    const authHeader = request.headers.get("authorization")
    const tokenFromHeader = authHeader?.replace("Bearer ", "")

    const token = tokenFromUrl || tokenFromHeader

    if (!token) {
      console.log("[SERVER] Токен не найден в запросе")
      return false
    }

    // Проверяем формат токена (admin_timestamp_randomstring)
    const tokenParts = token.split("_")
    if (tokenParts.length !== 3 || tokenParts[0] !== "admin") {
      console.log("[SERVER] Неверный формат токена:", token)
      return false
    }

    // Проверяем возраст токена (не старше 24 часов)
    const timestamp = Number.parseInt(tokenParts[1])
    const now = Date.now()
    const tokenAge = now - timestamp
    const maxAge = 24 * 60 * 60 * 1000 // 24 часа

    if (tokenAge > maxAge) {
      console.log("[SERVER] Токен истек:", { tokenAge, maxAge })
      return false
    }

    console.log("[SERVER] Токен действителен:", token)
    return true
  } catch (error) {
    console.error("[SERVER] Ошибка проверки токена:", error)
    return false
  }
}

// Функция для отправки уведомления в Telegram
async function sendTelegramNotification(message: string) {
  try {
    const botToken = process.env.TELEGRAM_SITE_BOT_TOKEN ?? process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_SITE_CHAT_ID ?? process.env.TELEGRAM_CHAT_ID

    if (!botToken || !chatId) {
      console.error("[SERVER] Отсутствуют переменные окружения для Telegram")
      return
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`
    const response = await fetch(url, {
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
    if (!response.ok) {
      console.error("[SERVER] Ошибка отправки уведомления в Telegram:", data)
    } else {
      console.log("[SERVER] Уведомление в Telegram отправлено успешно")
    }
  } catch (error) {
    console.error("[SERVER] Ошибка при отправке уведомления в Telegram:", error)
  }
}

// Обработчик GET-запроса для получения настроек оповещений
export async function GET(request: Request) {
  try {
    // Проверяем аутентификацию
    if (!isAuthenticated(request)) {
      console.log("[SERVER] Попытка получения настроек оповещений без аутентификации")
      return NextResponse.json(
        {
          success: false,
          message: "Требуется аутентификация",
        },
        { status: 401 },
      )
    }

    console.log("[SERVER] Запрос настроек оповещений о курсе")

    // Создаем директорию, если она не существует
    const dir = path.dirname(alertsFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // Проверяем существование файла с настройками
    if (!fs.existsSync(alertsFilePath)) {
      // Если файл не существует, создаем его с настройками по умолчанию
      const defaultAlerts = {
        enabled: true,
        thresholdPercent: 3.0,
        lastChecked: new Date().toISOString(),
        lastAlertSent: null,
      }
      fs.writeFileSync(alertsFilePath, JSON.stringify(defaultAlerts, null, 2))
      console.log("[SERVER] Создан файл с настройками оповещений по умолчанию")
    }

    // Читаем файл с настройками
    const alertsData = fs.readFileSync(alertsFilePath, "utf8")
    const alerts = JSON.parse(alertsData)

    console.log("[SERVER] Настройки оповещений получены:", alerts)

    return NextResponse.json({
      success: true,
      ...alerts,
    })
  } catch (error) {
    console.error("[SERVER] Ошибка при получении настроек оповещений:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Ошибка при получении настроек оповещений",
      },
      { status: 500 },
    )
  }
}

// Обработчик POST-запроса для сохранения настроек оповещений
export async function POST(request: Request) {
  try {
    // Проверяем аутентификацию
    if (!isAuthenticated(request)) {
      console.log("[SERVER] Попытка сохранения настроек оповещений без аутентификации")
      return NextResponse.json(
        {
          success: false,
          message: "Требуется аутентификация",
        },
        { status: 401 },
      )
    }

    // Получаем данные из запроса
    const { enabled, thresholdPercent } = await request.json()

    console.log("[SERVER] Запрос на сохранение настроек оповещений:", { enabled, thresholdPercent })

    // Проверяем корректность данных
    if (typeof enabled !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          message: "Некорректное значение для включения/выключения оповещений",
        },
        { status: 400 },
      )
    }

    if (typeof thresholdPercent !== "number" || thresholdPercent <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Некорректное значение порога изменения",
        },
        { status: 400 },
      )
    }

    // Создаем директорию, если она не существует
    const dir = path.dirname(alertsFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // Получаем предыдущие настройки
    let previousAlerts = { enabled: true, thresholdPercent: 3.0, lastChecked: null, lastAlertSent: null }
    if (fs.existsSync(alertsFilePath)) {
      const alertsData = fs.readFileSync(alertsFilePath, "utf8")
      previousAlerts = JSON.parse(alertsData)
    }

    // Сохраняем настройки
    const alerts = {
      enabled,
      thresholdPercent,
      lastChecked: previousAlerts.lastChecked || new Date().toISOString(),
      lastAlertSent: previousAlerts.lastAlertSent,
    }

    fs.writeFileSync(alertsFilePath, JSON.stringify(alerts, null, 2))

    console.log("[SERVER] Настройки оповещений сохранены:", alerts)

    // Отправляем уведомление в Telegram об изменении настроек оповещений
    if (enabled !== previousAlerts.enabled || thresholdPercent !== previousAlerts.thresholdPercent) {
      const notificationMessage = `
<b>⚙️ Изменение настроек оповещений</b>

<b>Оповещения:</b> ${enabled ? "Включены ✅" : "Выключены ❌"}
<b>Порог изменения:</b> ${thresholdPercent}%

<b>Дата изменения:</b> ${new Date().toLocaleString("ru-RU")}
      `
      await sendTelegramNotification(notificationMessage)
    }

    return NextResponse.json({
      success: true,
      message: "Настройки оповещений успешно сохранены",
    })
  } catch (error) {
    console.error("[SERVER] Ошибка при сохранении настроек оповещений:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Ошибка при сохранении настроек оповещений",
      },
      { status: 500 },
    )
  }
}

// Обработчик PUT-запроса для отправки тестового оповещения
export async function PUT(request: Request) {
  try {
    // Проверяем аутентификацию
    if (!isAuthenticated(request)) {
      console.log("[SERVER] Попытка отправки тестового оповещения без аутентификации")
      return NextResponse.json(
        {
          success: false,
          message: "Требуется аутентификация",
        },
        { status: 401 },
      )
    }

    console.log("[SERVER] Запрос на отправку тестового оповещения")

    // Получаем текущий курс
    const rateResponse = await fetch("https://www.cbr-xml-daily.ru/daily_json.js")
    const rateData = await rateResponse.json()
    const currentRate = rateData.Valute.CNY.Value.toFixed(2)

    // Отправляем тестовое уведомление
    const testMessage = `
<b>🔔 ТЕСТОВОЕ ОПОВЕЩЕНИЕ</b>

<b>Текущий курс ЦБ РФ:</b> ${currentRate} ₽
<b>Дата и время:</b> ${new Date().toLocaleString("ru-RU")}

<i>Это тестовое оповещение, отправленное из админ-панели.</i>
    `

    await sendTelegramNotification(testMessage)

    return NextResponse.json({
      success: true,
      message: "Тестовое оповещение успешно отправлено",
    })
  } catch (error) {
    console.error("[SERVER] Ошибка при отправке тестового оповещения:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Ошибка при отправке тестового оповещения",
      },
      { status: 500 },
    )
  }
}
