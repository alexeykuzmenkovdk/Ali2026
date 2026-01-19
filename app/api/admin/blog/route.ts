import { NextResponse } from "next/server"
import { requireAdminAuth } from "@/lib/admin-auth"
import { createBlogPost, listBlogPosts } from "@/lib/store"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const auth = requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const posts = await listBlogPosts({ publishedOnly: false })
  return NextResponse.json({ posts })
}

export async function POST(request: Request) {
  const auth = requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = await request.json()
  const { title, slug, category, excerpt, content, coverImageUrl, coverVideoUrl, isPublished } = payload ?? {}

  if (!title || !slug || !category) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    const post = await createBlogPost({
      title,
      slug,
      category,
      excerpt: excerpt ?? null,
      content: content ?? null,
      coverImageUrl: coverImageUrl ?? null,
      coverVideoUrl: coverVideoUrl ?? null,
      isPublished: Boolean(isPublished),
    })
    return NextResponse.json({ post })
  } catch (error) {
    console.error("Blog post create error:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
