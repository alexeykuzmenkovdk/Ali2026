"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronRight } from "lucide-react"
import { Portal } from "./portal"

interface NavigationItem {
  label: string
  href: string
  isExternal?: boolean
  description?: string
}

const navigationItems: NavigationItem[] = [
  { label: "Главная", href: "/#hero", description: "Вернуться на главную" },
  { label: "Оставить заявку (калькулятор)", href: "/#calculator", description: "Рассчитать сумму обмена" },
  {
    label: "Оплата через Т-Банк",
    href: "/buyer-services",
    isExternal: true,
    description: "Инструкция по отправке платежа",
  },
  { label: "Alipay гид", href: "/alipay-how-to-use", isExternal: true, description: "Пошаговая инструкция" },
  { label: "Poizon гид", href: "/how-to-order-poizon", isExternal: true, description: "Гид по покупкам" },
  { label: "Блог", href: "/blog", description: "Статьи и полезные материалы" },
  { label: "Офис", href: "/#office", description: "Адрес и контакты" },
  { label: "Отзывы", href: "/#testimonials", description: "Отзывы клиентов" },
  { label: "FAQ", href: "/#faq", description: "Часто задаваемые вопросы" },
]

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  const handleNavigation = (href: string, isExternal?: boolean) => {
    try {
      setIsMobileMenuOpen(false)
      if (isExternal) {
        router.push(href)
      } else if (href.startsWith("/#")) {
        const sectionId = href.substring(2)
        if (pathname === "/") {
          const element = document.getElementById(sectionId)
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        } else {
          router.push(href)
        }
      } else {
        router.push(href)
      }
    } catch (error) {
      console.error("Navigation error:", error)
    }
  }

  return (
    <>
      {/* Desktop Navigation (оставляем как есть) */}
      <nav className="hidden md:flex items-center justify-center">
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-100">
          {navigationItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavigation(item.href, item.isExternal)}
              className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-all duration-300 rounded-full hover:bg-orange-50 group"
            >
              {item.label}
              <span className="absolute inset-0 rounded-full bg-orange-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className="md:hidden relative z-50">
        {/* Кнопка меню с анимацией "пульса" при открытии */}
        <Button
          variant="ghost"
          size="sm"
          className={`relative bg-gradient-to-br from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700
            text-white border border-transparent hover:border-orange-700 shadow-md rounded-full px-4 py-2 flex items-center gap-2 transition-all duration-300 select-none
            ${isMobileMenuOpen ? "animate-pulse" : ""}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <>
              <Menu className="h-5 w-5" />
              <span className="text-sm font-semibold tracking-wide">Меню</span>
            </>
          )}
        </Button>

        {isMobileMenuOpen && (
          <Portal>
            {/* Затенённый фон с размытие и плавной прозрачностью */}
            <div
              className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md transition-opacity duration-300 z-[9998]"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Панель меню с glassmorphism, плавным появлением и масштабированием */}
            <nav
              className="fixed inset-x-4 top-16 bottom-6 bg-white bg-opacity-90 backdrop-blur-lg rounded-3xl shadow-2xl
                overflow-hidden flex flex-col animate-scaleFade z-[9999]"
              role="menu"
            >
              {/* Хедер */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-6 flex flex-col items-center flex-shrink-0 rounded-t-3xl">
                <h2 className="text-3xl font-extrabold text-white select-none">AlipayFast</h2>
                <p className="text-orange-100 text-sm mt-1 select-none">Выберите раздел</p>
              </div>

              {/* Пункты меню */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-transparent">
                {navigationItems.map((item, index) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item.href, item.isExternal)}
                    className={`w-full text-left p-5 rounded-2xl bg-gray-50 border border-gray-200
                    hover:bg-orange-50 hover:border-orange-300 shadow-md
                    transition-all duration-300 ease-out
                    flex items-center justify-between
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400
                    group
                    transform-gpu
                    hover:-translate-y-0.5 hover:scale-105`}
                    role="menuitem"
                    style={{
                      animationDelay: `${index * 70}ms`,
                      animationFillMode: "forwards",
                      animationDuration: "350ms",
                      animationName: "fadeSlideUp",
                      opacity: 0,
                      transform: "translateY(20px)",
                    }}
                  >
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors text-base">
                        {item.label}
                      </div>
                      {item.description && (
                        <div className="text-gray-500 text-sm mt-1 group-hover:text-orange-500 transition-colors leading-tight">
                          {item.description}
                        </div>
                      )}
                    </div>
                    <ChevronRight
                      className="h-6 w-6 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-transform duration-200"
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            </nav>
          </Portal>
        )}
      </div>
    </>
  )
}
