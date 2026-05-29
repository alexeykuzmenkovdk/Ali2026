import type React from "react"
import Script from "next/script"

export default function TelegramMiniAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Script
        src="/telegram-web-app.js"
        strategy="beforeInteractive"
      />
      {children}
    </>
  )
}
