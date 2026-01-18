import { NextResponse } from "next/server"
import { requireTelegramInitData } from "@/lib/telegram"
import { mkdir, writeFile } from "fs/promises"
import path from "path"

export async function POST(request: Request) {
  const initData = request.headers.get("x-telegram-init-data")
  const telegram = requireTelegramInitData(initData)
  if (!telegram?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const uploadsDir = process.env.UPLOADS_DIR ?? path.join(process.cwd(), "public", "uploads")
  await mkdir(uploadsDir, { recursive: true })
  const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`
  const filePath = path.join(uploadsDir, safeName)
  await writeFile(filePath, buffer)

  const baseUrl = process.env.UPLOADS_BASE_URL ?? "/uploads"
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl
  return NextResponse.json({ url: `${normalizedBase}/${safeName}` })
}
