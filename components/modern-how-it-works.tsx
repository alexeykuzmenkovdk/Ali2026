"use client"

import { motion } from "framer-motion"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

export function ModernHowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Свяжитесь с нами",
      description: "Напишите нам в Telegram, WhatsApp или по электронной почте, чтобы начать процесс пополнения.",
    },
    {
      number: "02",
      title: "Укажите сумму",
      description: "Сообщите нам, на какую сумму в юанях вы хотите пополнить ваш Alipay кошелек.",
    },
    {
      number: "03",
      title: "Получите реквизиты",
      description: "Мы предоставим вам реквизиты для оплаты в рублях по текущему обменному курсу.",
    },
    {
      number: "04",
      title: "Произведите оплату",
      description: "Переведите указанную сумму в рублях на предоставленные реквизиты.",
    },
    {
      number: "05",
      title: "Подтвердите оплату",
      description: "Отправьте нам подтверждение оплаты и данные вашего Alipay кошелька.",
    },
    {
      number: "06",
      title: "Получите юани",
      description: "Мы пополним ваш Alipay кошелек указанной суммой в юанях в течение нескольких минут.",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {steps.map((step, index) => (
        <ScrollReveal key={step.number} delay={index * 0.1}>
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="relative overflow-hidden rounded-xl border-2 shadow-md transition-all duration-200 hover:shadow-lg bg-white"
          >
            <div className="absolute -right-4 -top-4 text-9xl font-bold text-gradient-to-r from-orange-100 to-red-100 opacity-50">
              {step.number}
            </div>
            <div className="relative z-10 p-6">
              <h3 className="text-xl font-bold text-orange-600 mb-2">{step.title}</h3>
              <p className="text-base text-gray-600">{step.description}</p>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-orange-500 to-red-600"></div>
          </motion.div>
        </ScrollReveal>
      ))}
    </div>
  )
}
