import { NextResponse } from "next/server"
import { addShowcaseItem, listAllShowcaseItems, setShowcasePublish } from "@/lib/store"
import { requireAdminAuth } from "@/lib/admin-auth"

export async function GET(request: Request) {
  const auth = requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const items = await listAllShowcaseItems()
  return NextResponse.json({ items })
}

export async function POST(request: Request) {
  const auth = requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const item = await addShowcaseItem({
    title: body.title,
    imageUrl: body.imageUrl,
    priceCny: Number(body.priceCny),
    priceRub: Number(body.priceRub),
    benefitRub: Number(body.benefitRub),
    isPublished: Boolean(body.isPublished),
  })

  return NextResponse.json({ item })
}

export async function PATCH(request: Request) {
  const auth = requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const item = await setShowcasePublish(body.id, Boolean(body.isPublished))
  return NextResponse.json({ item })
}
