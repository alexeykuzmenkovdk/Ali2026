"use client"

import { motion } from "framer-motion"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

export function BuyerServicesProcess() {
  const steps = [
    {
      number: "01",
      title: "Заявка",
      description: "Отправьте нам ссылку на товар или опишите, что вы хотите найти в Китае.",
    },
    {
      number: "02",
      title: "Расчет стоимости",
      description: "Мы рассчитаем полную стоимость товара с учетом доставки и наших услуг.",
    },
    {
      number: "03",
      title: "Оплата",
      description: "После согласования деталей вы вносите предоплату за товар и услуги.",
    },
    {
      number: "04",
      title: "Выкуп товара",
      description: "Мы выкупаем товар у продавца и проверяем его качество.",
    },
    {
      number: "05",
      title: "Отправка фото",
      description: "Отправляем вам фотографии товара для подтверждения качества.",
    },
    {
      number: "06",
      title: "Доставка",
      description: "Организуем доставку товара в Россию и передаем его вам.",
    },
  ]

  return (
    <section
      id="process"
      className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-white via-orange-50 to-red-50"
    >
      <div className="container px-4 md:px-6">
        <ScrollReveal>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                Как работает наш сервис
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl">
                Простой и понятный процесс заказа товаров из Китая с нашей помощью
              </p>
            </div>
          </div>
        </ScrollReveal>

        <div className="mx-auto max-w-5xl mt-12">
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
        </div>
      </div>
    </section>
  )
}
