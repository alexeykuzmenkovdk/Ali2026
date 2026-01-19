import { NextResponse } from "next/server"
import { addShowcaseItem, listAllShowcaseItems, setShowcasePublish, updateShowcaseItem } from "@/lib/store"
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
    description: body.description,
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
  if (!body.id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  const updates = {
    title: body.title,
    imageUrl: body.imageUrl,
    description: body.description,
    priceCny: body.priceCny !== undefined ? Number(body.priceCny) : undefined,
    priceRub: body.priceRub !== undefined ? Number(body.priceRub) : undefined,
    benefitRub: body.benefitRub !== undefined ? Number(body.benefitRub) : undefined,
    isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : undefined,
  }

  const updateEntries = Object.entries(updates).filter(([, value]) => value !== undefined)
  if (updateEntries.length === 0) {
    return NextResponse.json({ error: "No updates provided" }, { status: 400 })
  }

  const item = updateEntries.length === 1 && updateEntries[0][0] === "isPublished"
    ? await setShowcasePublish(body.id, updates.isPublished)
    : await updateShowcaseItem(body.id, updates)
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  return NextResponse.json({ item })
}
