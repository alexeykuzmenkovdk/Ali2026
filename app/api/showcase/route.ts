import { NextResponse } from "next/server"
import { listShowcaseItems } from "@/lib/store"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json({ items: await listShowcaseItems() })
}
