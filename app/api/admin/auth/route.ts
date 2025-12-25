import { NextResponse } from "next/server"

// Обработчик POST-запроса для аутентификации
export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    console.log("[SERVER] Попытка аутентификации")

    // Проверяем пароль
    if (password === "Gjrhjdrf1991") {
      console.log("[SERVER] Аутентификация успешна")

      // Создаем токен сессии
      const sessionToken = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      console.log("[SERVER] Сессия создана:", sessionToken)

      return NextResponse.json({
        success: true,
        message: "Аутентификация успешна",
        sessionToken: sessionToken,
        redirectUrl: "/admin/dashboard",
      })
    } else {
      console.log("[SERVER] Неверный пароль")
      return NextResponse.json(
        {
          success: false,
          message: "Неверный пароль",
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("[SERVER] Ошибка при аутентификации:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Ошибка при обработке запроса",
      },
      { status: 500 },
    )
  }
}

// Функция для проверки сессии - упрощенная версия
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const sessionToken = url.searchParams.get("token")

    console.log("[SERVER] Проверка сессии с токеном:", sessionToken)

    if (!sessionToken) {
      console.log("[SERVER] Токен не предоставлен")
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Простая проверка формата токена (начинается с admin_ и содержит timestamp)
    if (!sessionToken.startsWith("admin_")) {
      console.log("[SERVER] Неверный формат токена")
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Извлекаем timestamp из токена
    const parts = sessionToken.split("_")
    if (parts.length !== 3) {
      console.log("[SERVER] Неверная структура токена")
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const timestamp = Number.parseInt(parts[1])
    const now = Date.now()
    const tokenAge = now - timestamp

    // Проверяем, что токен не старше 24 часов (86400000 мс)
    if (tokenAge > 86400000) {
      console.log("[SERVER] Токен истек")
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    console.log("[SERVER] Сессия действительна, возраст токена:", Math.round(tokenAge / 1000), "секунд")
    return NextResponse.json({ authenticated: true, sessionToken })
  } catch (error) {
    console.error("[SERVER] Ошибка при проверке сессии:", error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
