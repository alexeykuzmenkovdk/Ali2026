import { NextResponse } from "next/server"
import { requireAdminAuth } from "@/lib/admin-auth"
import { deleteBlogPost, updateBlogPost } from "@/lib/store"

export async function PUT(request: Request, context: { params: { id: string } }) {
  const auth = requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = await request.json()
  const { title, slug, category, excerpt, content, coverImageUrl, coverVideoUrl, isPublished } = payload ?? {}

  try {
    const post = await updateBlogPost(context.params.id, {
      title,
      slug,
      category,
      excerpt: excerpt ?? null,
      content: content ?? null,
      coverImageUrl: coverImageUrl ?? null,
      coverVideoUrl: coverVideoUrl ?? null,
      isPublished: typeof isPublished === "boolean" ? isPublished : undefined,
    })
    return NextResponse.json({ post })
  } catch (error) {
    console.error("Blog post update error:", error)
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
  const auth = requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await deleteBlogPost(context.params.id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Blog post delete error:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
