"use client"

import { Navigation } from "@/components/navigation"
import { ContactButtons } from "@/components/contact-buttons"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container flex h-20 items-center justify-between py-4">
        {/* Мобильное меню слева */}
        <div className="md:hidden">
          <Navigation />
        </div>

        {/* Пустое место слева для баланса на десктопе */}
        <div className="hidden md:flex md:flex-1"></div>

        {/* Навигация по центру на планшетах и десктопе */}
        <div className="hidden md:flex items-center justify-center">
          <Navigation />
        </div>

        {/* Кнопки связи справа */}
        <div className="flex items-center md:flex-1 justify-end">
          <ContactButtons variant="header" />
        </div>
      </div>
    </header>
  )
}
