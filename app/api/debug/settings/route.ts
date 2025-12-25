import { NextResponse } from "next/server"
import { settingsStore } from "@/lib/settings-store"

export async function GET() {
  try {
    console.log("[DEBUG] Проверка настроек из централизованного хранилища...")

    // Получаем настройки из хранилища
    const settings = settingsStore.getSettings()

    console.log("[DEBUG] Настройки из хранилища:", settings)

    return NextResponse.json({
      success: true,
      debug: {
        storageType: "centralized_store",
        settings: settings,
        timestamp: new Date().toISOString(),
        note: "Настройки хранятся в централизованном хранилище с синглтоном",
      },
    })
  } catch (error) {
    console.error("[DEBUG] Критическая ошибка:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
}
