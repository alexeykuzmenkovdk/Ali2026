import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"

const mimeTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".bmp": "image/bmp",
  ".tif": "image/tiff",
  ".tiff": "image/tiff",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".avi": "video/x-msvideo",
  ".mkv": "video/x-matroska",
  ".m4v": "video/x-m4v",
  ".ogg": "video/ogg",
}

const getContentType = (filePath: string) => mimeTypes[path.extname(filePath).toLowerCase()] ?? "application/octet-stream"

export async function GET(_: Request, { params }: { params: { path: string[] } }) {
  const uploadsDir = process.env.UPLOADS_DIR ?? path.join(process.cwd(), "public", "uploads")
  const safePath = params.path.map((segment) => decodeURIComponent(segment))
  const resolvedPath = path.resolve(uploadsDir, ...safePath)
  if (!resolvedPath.startsWith(path.resolve(uploadsDir))) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 })
  }

  try {
    const fileBuffer = await readFile(resolvedPath)
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": getContentType(resolvedPath),
        "Cache-Control": "no-store, max-age=0",
      },
    })
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
}
