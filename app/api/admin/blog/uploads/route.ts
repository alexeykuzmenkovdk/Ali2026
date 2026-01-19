import { NextResponse } from "next/server"
import { requireAdminAuth } from "@/lib/admin-auth"
import { mkdir, writeFile } from "fs/promises"
import path from "path"

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

  const mimeType = file.type?.toLowerCase() ?? ""
  const extension = file.name.split(".").pop()?.toLowerCase() ?? ""
  const isImageMime = mimeType.startsWith("image/")
  const isVideoMime = mimeType.startsWith("video/")
  const allowedImageExtensions = new Set(["jpg", "jpeg", "png", "gif", "webp", "avif", "bmp", "tiff", "tif", "svg"])
  const allowedVideoExtensions = new Set(["mp4", "webm", "mov", "avi", "mkv", "m4v", "ogg"])
  const isAllowedByExtension =
    extension.length > 0 && (allowedImageExtensions.has(extension) || allowedVideoExtensions.has(extension))

  if (!isImageMime && !isVideoMime && !isAllowedByExtension) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const uploadsDir = process.env.UPLOADS_DIR ?? path.join(process.cwd(), "public", "uploads", "blog")
  await mkdir(uploadsDir, { recursive: true })
  const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`
  const filePath = path.join(uploadsDir, safeName)
  await writeFile(filePath, buffer)

  const baseUrl = process.env.UPLOADS_BASE_URL ?? "/uploads/blog"
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl
  return NextResponse.json({ url: `${normalizedBase}/${safeName}` })
}
