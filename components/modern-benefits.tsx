"use client"

import { Clock, Lock, DollarSign, Users, ThumbsUp, Zap } from "lucide-react"
import { HoverEffect } from "@/components/ui/card-hover-effect"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

export function ModernBenefits() {
  const benefits = [
    {
      title: "Быстрое пополнение",
      description: "Пополнение вашего Alipay кошелька происходит в течение нескольких минут после оплаты.",
      icon: <Clock className="h-8 w-8 text-orange-500" />,
    },
    {
      title: "Безопасность",
      description: "Мы гарантируем безопасность всех транзакций и защиту ваших личных данных.",
      icon: <Lock className="h-8 w-8 text-orange-500" />,
    },
    {
      title: "Выгодный курс",
      description: "Мы предлагаем конкурентный обменный курс рубль-юань без скрытых комиссий.",
      icon: <DollarSign className="h-8 w-8 text-orange-500" />,
    },
    {
      title: "Поддержка 24/7",
      description: "Наша команда поддержки доступна круглосуточно, чтобы помочь вам с любыми вопросами.",
      icon: <Users className="h-8 w-8 text-orange-500" />,
    },
    {
      title: "Удобство",
      description: "Простой и понятный процесс пополнения, доступный для всех пользователей.",
      icon: <ThumbsUp className="h-8 w-8 text-orange-500" />,
    },
    {
      title: "Проверенный сервис",
      description: "Тысячи довольных клиентов уже воспользовались нашими услугами.",
      icon: <Zap className="h-8 w-8 text-orange-500" />,
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-orange-50 to-red-50 relative overflow-hidden">
      <div className="container px-4 md:px-6">
        <ScrollReveal>
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                Почему выбирают Alipayfast
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl">
                Мы предлагаем лучший сервис для пополнения Alipay кошелька юанями.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <HoverEffect items={benefits} />
        </ScrollReveal>
      </div>
    </section>
  )
}
