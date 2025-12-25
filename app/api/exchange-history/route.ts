import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Путь к файлу с историей курса
const historyFilePath = path.join(process.cwd(), "data", "exchange-history.json")

// Функция для создания директории, если она не существует
function ensureDirectoryExists(filePath: string) {
  const dirname = path.dirname(filePath)
  if (fs.existsSync(dirname)) {
    return true
  }
  fs.mkdirSync(dirname, { recursive: true })
  return true
}

// Функция для получения истории курса
export async function GET() {
  try {
    ensureDirectoryExists(historyFilePath)

    if (!fs.existsSync(historyFilePath)) {
      // Если файл не существует, возвращаем пустую историю
      return NextResponse.json({
        success: true,
        history: [],
      })
    }

    // Читаем файл с историей
    const data = fs.readFileSync(historyFilePath, "utf8")
    const history = JSON.parse(data)

    return NextResponse.json({
      success: true,
      history: Array.isArray(history) ? history : [],
    })
  } catch (error) {
    console.error("Error getting exchange history:", error)
    return NextResponse.json({ success: false, message: "Ошибка при получении истории курса" }, { status: 500 })
  }
}
