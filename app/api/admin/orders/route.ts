import { NextResponse } from "next/server"
import { listOrders } from "@/lib/store"
import { requireAdminAuth } from "@/lib/admin-auth"

export async function GET(request: Request) {
  const auth = requireAdminAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const orders = await listOrders()
  return NextResponse.json({ orders })
}
