import { NextResponse } from "next/server"
import { generateAdminSessionToken, getAdminPassword, validateAdminSessionToken } from "@/lib/admin-auth"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    console.log("[SERVER] Попытка аутентификации")

    if (password === getAdminPassword()) {
      console.log("[SERVER] Аутентификация успешна")

      const sessionToken = generateAdminSessionToken()

      console.log("[SERVER] Сессия создана:", sessionToken)

      return NextResponse.json({
        success: true,
        message: "Аутентификация успешна",
        sessionToken: sessionToken,
        redirectUrl: "/admin/dashboard",
      })
    }

    console.log("[SERVER] Неверный пароль")
    return NextResponse.json(
      {
        success: false,
        message: "Неверный пароль",
      },
      { status: 401 },
    )
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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const sessionToken = url.searchParams.get("token")

    console.log("[SERVER] Проверка сессии с токеном:", sessionToken)

    const validation = validateAdminSessionToken(sessionToken)
    if (!validation.valid) {
      console.log("[SERVER] Токен недействителен:", validation.reason)
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    console.log("[SERVER] Сессия действительна, возраст токена:", Math.round(validation.ageMs / 1000), "секунд")
    return NextResponse.json({ authenticated: true, sessionToken })
  } catch (error) {
    console.error("[SERVER] Ошибка при проверке сессии:", error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
