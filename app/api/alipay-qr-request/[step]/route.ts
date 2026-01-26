import { NextResponse } from "next/server"
import { alipayQrRequestImages } from "@/lib/alipay-qr-request"

const getStepKey = (rawStep: string) => {
  const match = rawStep.match(/(\d+)/)
  if (!match) return null
  return `step-${match[1]}` as const
}

export async function GET(_request: Request, { params }: { params: { step: string } }) {
  const stepKey = getStepKey(params.step)
  if (!stepKey || !(stepKey in alipayQrRequestImages)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const base64Data = alipayQrRequestImages[stepKey as keyof typeof alipayQrRequestImages]
  const buffer = Buffer.from(base64Data, "base64")

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
