import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Удаляем куки сессии
    cookies().delete("admin_session")

    return NextResponse.json({
      success: true,
      message: "Выход выполнен успешно",
    })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ success: false, message: "Ошибка при выходе из системы" }, { status: 500 })
  }
}
