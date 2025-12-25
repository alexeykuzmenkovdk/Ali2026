"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Smartphone, Send, Receipt } from "lucide-react" // Добавлены новые иконки
import Link from "next/link"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

interface BuyerServicesHeroProps {
  onOpenContactForm: () => void
}

export function BuyerServicesHero({ onOpenContactForm }: BuyerServicesHeroProps) {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-white via-orange-50 to-red-50 py-16 md:py-24 lg:py-32">
      {/* Декоративные круги */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-orange-200 to-red-200 opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-gradient-to-br from-orange-200 to-red-200 opacity-20 blur-3xl"></div>

      {/* Основной контент */}
      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Левая колонка с текстом */}
          <div className="flex flex-col justify-center">
            <ScrollReveal>
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                <span className="block bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                  Оплата через Т-Банк
                </span>
              </h1>

              <p className="mb-8 max-w-[600px] text-lg text-gray-600 md:text-xl">
                Пошаговая инструкция: как установить приложение Т-Банк, отправить перевод и прислать чек для пополнения
                вашего Alipay кошелька.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-600 px-8 py-6 text-lg shadow-lg transition-all duration-300 hover:shadow-xl"
                  onClick={onOpenContactForm}
                >
                  Начать пополнение <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-2 border-orange-500 px-8 py-6 text-lg text-orange-500 shadow-md transition-all duration-300 hover:bg-orange-50 hover:shadow-lg bg-transparent"
                >
                  <Link href="#process">Посмотреть инструкцию</Link>
                </Button>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                    <Smartphone className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Установка приложения Т-Банк</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                    <Send className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Отправка перевода</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                    <Receipt className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Отправка чека</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Быстрое зачисление</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Правая колонка с изображением */}
          <div className="flex items-center justify-center">
            <ScrollReveal direction="left">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-md"
              >
                <div className="relative h-[400px] w-full overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-yellow-400 to-yellow-600">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white">
                    <div className="h-24 w-24 mb-6 rounded-3xl bg-white flex items-center justify-center shadow-2xl">
                      <span className="text-6xl font-black bg-gradient-to-br from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                        Т
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold mb-3 text-center">Т-Банк</h3>
                    <p className="text-center text-lg opacity-90 mb-6">
                      Официальное приложение для безопасных переводов
                    </p>
                    <div className="grid grid-cols-3 gap-4 w-full mt-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                        <Smartphone className="h-6 w-6 mx-auto mb-1" />
                        <span className="text-xs font-medium">Установка</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                        <Send className="h-6 w-6 mx-auto mb-1" />
                        <span className="text-xs font-medium">Перевод</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                        <Receipt className="h-6 w-6 mx-auto mb-1" />
                        <span className="text-xs font-medium">Чек</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  )
}
