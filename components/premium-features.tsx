"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Clock, Lock, DollarSign, Users, ThumbsUp, Zap } from "lucide-react"

export function PremiumFeatures() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <section className="w-full bg-gradient-to-br from-white via-orange-50 to-red-50 py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center space-y-4 text-center"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              Почему выбирают Alipayfast
            </h2>
            <p className="max-w-[900px] text-gray-600 md:text-xl">
              Мы предлагаем лучший сервис для пополнения Alipay кошелька юанями.
            </p>
          </div>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-xl border border-orange-100 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-orange-100 to-red-100 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-70"></div>

              <div className="relative z-10">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-orange-50 to-red-50 p-3 shadow-sm">
                  {benefit.icon}
                </div>

                <h3 className="mb-2 text-xl font-bold text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>

              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-300 group-hover:w-full"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
