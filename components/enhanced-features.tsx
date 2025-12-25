"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  Clock,
  Lock,
  DollarSign,
  Users,
  ThumbsUp,
  Zap,
  ShoppingCart,
  CreditCard,
  Truck,
  Search,
  Globe,
  Headphones,
} from "lucide-react"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

export function EnhancedFeatures() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const basicFeatures = [
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

  const advancedFeatures = [
    {
      title: "Прямая оплата продавцам",
      description:
        "Мы можем напрямую перевести деньги продавцу на китайских площадках, избавляя вас от необходимости самостоятельного перевода.",
      icon: <CreditCard className="h-8 w-8 text-orange-500" />,
    },
    {
      title: "Выкуп товаров",
      description:
        "Поможем выкупить товары с китайских сайтов, даже если у вас нет аккаунта или возникли сложности с оплатой.",
      icon: <ShoppingCart className="h-8 w-8 text-orange-500" />,
    },
    {
      title: "Услуги баера",
      description:
        "Предоставляем полный спектр услуг баера: поиск товара, проверка качества, выкуп, консолидация и доставка.",
      icon: <Search className="h-8 w-8 text-orange-500" />,
    },
    {
      title: "Работа со всеми площадками",
      description:
        "Работаем со всеми популярными китайскими площадками: Taobao, Tmall, JD, Poizon (Dewu), 1688 и другими.",
      icon: <Globe className="h-8 w-8 text-orange-500" />,
    },
    {
      title: "Помощь с доставкой",
      description: "Организуем доставку ваших товаров из Китая в Россию с таможенным оформлением и отслеживанием.",
      icon: <Truck className="h-8 w-8 text-orange-500" />,
    },
    {
      title: "Консультации по шоппингу",
      description: "Предоставляем консультации по выбору товаров, особенностям китайских площадок и способам экономии.",
      icon: <Headphones className="h-8 w-8 text-orange-500" />,
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
              Мы предлагаем не только пополнение Alipay, но и полный спектр услуг для работы с китайскими площадками.
            </p>
          </div>
        </motion.div>

        {/* Основные преимущества */}
        <ScrollReveal>
          <h3 className="text-xl font-semibold text-center mt-12 mb-6 text-gray-800">Основные преимущества</h3>
        </ScrollReveal>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {basicFeatures.map((feature, index) => (
            <motion.div
              key={`basic-${index}`}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-xl border border-orange-100 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-orange-100 to-red-100 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-70"></div>

              <div className="relative z-10">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-orange-50 to-red-50 p-3 shadow-sm">
                  {feature.icon}
                </div>

                <h3 className="mb-2 text-xl font-bold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>

              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-300 group-hover:w-full"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Дополнительные возможности */}
        <ScrollReveal>
          <div className="relative mt-20 mb-6">
            <h3 className="text-xl font-semibold text-center text-gray-800">Дополнительные возможности</h3>
            <div className="absolute left-1/2 -bottom-4 h-1 w-20 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-600"></div>
          </div>
        </ScrollReveal>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {advancedFeatures.map((feature, index) => (
            <motion.div
              key={`advanced-${index}`}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-xl border border-orange-100 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-orange-100 to-red-100 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-70"></div>

              <div className="relative z-10">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-orange-50 to-red-50 p-3 shadow-sm">
                  {feature.icon}
                </div>

                <h3 className="mb-2 text-xl font-bold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>

              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-300 group-hover:w-full"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Секция с логотипами площадок */}
        <ScrollReveal delay={0.3}>
          <div className="mt-20 rounded-xl border border-orange-100 bg-white p-8 shadow-lg">
            <h3 className="text-xl font-semibold text-center mb-8 text-gray-800">
              Работаем со всеми популярными китайскими площадками
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-[#FF4400] flex items-center justify-center text-white font-bold text-xl">
                  TB
                </div>
                <span className="mt-2 text-sm font-medium">Taobao</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-[#E43226] flex items-center justify-center text-white font-bold text-xl">
                  TM
                </div>
                <span className="mt-2 text-sm font-medium">Tmall</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-[#D71C1E] flex items-center justify-center text-white font-bold text-xl">
                  JD
                </div>
                <span className="mt-2 text-sm font-medium">JD.com</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-[#000000] flex items-center justify-center text-white font-bold text-xl">
                  PZ
                </div>
                <span className="mt-2 text-sm font-medium">Poizon</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-[#FF6600] flex items-center justify-center text-white font-bold text-xl">
                  1688
                </div>
                <span className="mt-2 text-sm font-medium">1688</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-[#00A0DC] flex items-center justify-center text-white font-bold text-xl">
                  XHS
                </div>
                <span className="mt-2 text-sm font-medium">Xiaohongshu</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
