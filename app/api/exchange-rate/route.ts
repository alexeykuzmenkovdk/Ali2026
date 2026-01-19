import { NextResponse } from "next/server"
import { EXCHANGE_CONFIG } from "@/lib/exchange-config"

export const dynamic = "force-dynamic"

// Простая функция для получения курса юаня к рублю от ЦБ РФ
export async function GET(request: Request) {
  try {
    console.log("[SERVER] GET exchange-rate - Запрос курса")

    // Безопасное получение конфигурации
    let markup: number
    try {
      markup = EXCHANGE_CONFIG.DEFAULT_MARKUP
      console.log("[SERVER] Успешно загружена надбавка из конфига:", markup)
    } catch (configError) {
      console.error("[SERVER] Ошибка загрузки конфига, используется fallback:", configError)
      markup = 0.63 // fallback значение
    }

    // Проверяем параметры запроса
    const { searchParams } = new URL(request.url)
    const forceUpdate = searchParams.get("forceUpdate") === "true"

    console.log("[SERVER] Параметры запроса:", { forceUpdate, markup })

    // Получаем текущую дату для API ЦБ РФ
    const now = new Date()
    const formattedDate = `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${now.getFullYear()}`

    const url = `https://www.cbr.ru/scripts/XML_daily.asp?date_req=${formattedDate}`

    try {
      console.log("[SERVER] Запрос к ЦБ РФ:", url)

      // Делаем запрос к API ЦБ РФ
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; AlipayFast/1.0)",
        },
        timeout: 10000, // 10 секунд таймаут
      })

      if (!response.ok) {
        throw new Error(`Ошибка при запросе к API ЦБ РФ: ${response.status}`)
      }

      // Получаем XML-ответ
      const xml = await response.text()
      console.log("[SERVER] Получен XML от ЦБ РФ, длина:", xml.length)

      // Ищем курс юаня в XML
      const yuanMatch = xml.match(/<CharCode>CNY<\/CharCode>[\s\S]*?<Value>(.*?)<\/Value>/)

      if (!yuanMatch || !yuanMatch[1]) {
        throw new Error("Не удалось найти курс юаня в ответе ЦБ РФ")
      }

      // Получаем курс юаня из XML и преобразуем его в число
      let baseRate = Number.parseFloat(yuanMatch[1].replace(",", "."))

      if (isNaN(baseRate) || baseRate <= 0) {
        throw new Error("Некорректный курс юаня от ЦБ РФ")
      }

      console.log("[SERVER] Базовый курс ЦБ:", baseRate)

      // НЕ добавляем markup здесь, возвращаем чистый курс ЦБ
      let rate = baseRate

      console.log("[SERVER] Чистый курс ЦБ (без надбавки):", rate)

      // Округляем до двух знаков после запятой
      rate = Math.round(rate * 100) / 100
      baseRate = Math.round(baseRate * 100) / 100

      // Получаем дату курса из XML
      const dateMatch = xml.match(/<ValCurs Date="(.*?)"/)
      const cbrDate = dateMatch && dateMatch[1] ? dateMatch[1] : formattedDate

      // Преобразуем дату в формат ISO
      const [day, month, year] = cbrDate.split(".")
      const isoDate = `${year}-${month}-${day}T00:00:00.000Z`

      // Вычисляем время следующего обновления
      const nextUpdate = new Date()
      nextUpdate.setDate(nextUpdate.getDate() + 1)
      nextUpdate.setHours(12, 0, 0, 0)

      console.log("[SERVER] Успешно получен курс:", rate)

      // Возвращаем результат
      return NextResponse.json({
        success: true,
        rate: rate.toString(),
        baseRate: baseRate.toString(),
        cbrDate: isoDate,
        timestamp: now.toISOString(),
        nextUpdate: nextUpdate.toISOString(),
        isManual: false,
      })
    } catch (fetchError) {
      console.error("Ошибка при получении курса от ЦБ РФ:", fetchError)

      const fallbackRate = "11.50" // Чистый курс ЦБ без надбавки
      console.log("[SERVER] Используется запасной курс:", fallbackRate)

      return NextResponse.json({
        success: true,
        rate: fallbackRate,
        baseRate: fallbackRate,
        cbrDate: now.toISOString(),
        timestamp: now.toISOString(),
        nextUpdate: new Date(now.getTime() + 3600000).toISOString(),
        error: "Используется запасной курс из-за ошибки при получении данных от ЦБ РФ",
        fallbackRate: true,
        isManual: false,
      })
    }
  } catch (error) {
    console.error("Критическая ошибка в API exchange-rate:", error)

    return NextResponse.json(
      {
        success: true,
        rate: "11.50", // Чистый курс ЦБ без надбавки
        baseRate: "11.50",
        cbrDate: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        nextUpdate: new Date(new Date().getTime() + 3600000).toISOString(),
        error: "Критическая ошибка при обработке запроса",
        fallbackRate: true,
        isManual: false,
      },
      { status: 200 },
    )
  }
}
