import { NextResponse } from "next/server"
import { requireAdminAuth } from "@/lib/admin-auth"
import { mkdir, writeFile } from "fs/promises"
import path from "path"

const ALLOWED_TYPES = ["image/", "video/", "application/pdf"]

export async function POST(request: Request) {
  const auth = requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 })
  }
  const isAllowed = ALLOWED_TYPES.some((type) => (type.endsWith("/") ? file.type.startsWith(type) : file.type === type))
  if (!isAllowed) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const uploadsDir = process.env.UPLOADS_DIR ?? path.join(process.cwd(), "public", "uploads", "orders")
  await mkdir(uploadsDir, { recursive: true })
  const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`
  const filePath = path.join(uploadsDir, safeName)
  await writeFile(filePath, buffer)

  const baseUrl = process.env.UPLOADS_BASE_URL ?? "/uploads/orders"
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl
  return NextResponse.json({ url: `${normalizedBase}/${safeName}` })
}
