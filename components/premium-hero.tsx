"use client"

import type React from "react"
import Link from "next/link"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Clock, Award, ChevronRight } from "lucide-react"
import { FloatingElements } from "@/components/ui/floating-elements"
import { AnimatedText } from "@/components/animated-text-effects"
import { CriticalImage } from "@/components/optimized-image"

interface PremiumHeroProps {
  exchangeRate?: number
}

export function PremiumHero({ exchangeRate = 12.5 }: PremiumHeroProps) {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [buttonHovered, setButtonHovered] = useState(false)
  const [secondButtonHovered, setSecondButtonHovered] = useState(false)

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  // Функции для навигации
  const scrollToCalculator = () => {
    // Проверяем размер экрана
    const isMobile = window.innerWidth < 768

    if (isMobile) {
      // На мобильных ищем элемент с калькулятором обмена
      const calculatorElement =
        document.querySelector('[data-calculator="exchange"]') ||
        document.getElementById("premium-calculator") ||
        document.querySelector(".calculator-container") ||
        document.getElementById("calculator")

      if (calculatorElement) {
        // Прокручиваем так, чтобы калькулятор был в верхней части экрана
        const elementTop = calculatorElement.getBoundingClientRect().top + window.pageYOffset
        const offsetTop = elementTop - 20 // Небольшой отступ сверху

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    } else {
      // На десктопе стандартная прокрутка к секции
      const element = document.getElementById("calculator")
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }

  const scrollToContact = () => {
    const element = document.getElementById("contact")
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-white via-orange-50 to-red-50 py-8 md:py-12 lg:py-16">
      {/* Фоновые элементы */}
      <FloatingElements count={40} className="opacity-60" />

      {/* Декоративные круги */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-orange-200 to-red-200 opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-gradient-to-br from-orange-200 to-red-200 opacity-20 blur-3xl"></div>

      <div className="container relative z-20 px-4 md:px-6 mb-4 md:mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-3xl"
        >
          <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 p-0.5 md:p-1 shadow-lg md:shadow-2xl">
            <div className="rounded-lg md:rounded-xl bg-white p-3 md:p-5">
              <div className="flex items-center gap-3 md:gap-4">
                {/* Иконка Т-Банка */}
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-md">
                    <span className="text-xl md:text-2xl font-black text-white">Т</span>
                  </div>
                </div>

                {/* Текстовый контент */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 leading-tight mb-0.5">
                    Обмен только через Т-Банк
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-snug">
                    Переводы принимаются исключительно с приложения Т-Банк для максимальной скорости и безопасности
                  </p>
                </div>

                {/* Кнопка установки */}
                <div className="flex-shrink-0">
                  <Link href="/buyer-services">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold shadow-md text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2"
                    >
                      Установить
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Основной контент */}
      <div className="container relative z-10 px-4 md:px-6">
        {/* Новая структура с тремя колонками на десктопе */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center" ref={ref}>
          {/* Левая колонка с логотипом и заголовком */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start">
            {/* Логотип - оптимизированный */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 w-full max-w-[220px] md:max-w-[250px]"
            >
              <CriticalImage
                src="/images/alipaifest.png"
                alt="AlipayFast Logo"
                width={250}
                height={140}
                className="w-full h-auto"
                sizes="(max-width: 640px) 220px, (max-width: 768px) 250px, 250px"
                quality={90}
                priority
              />
            </motion.div>

            {/* Заголовок */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center lg:text-left text-3xl font-bold tracking-tighter md:text-4xl bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent mb-6"
            >
              ПОПОЛНЕНИЕ
              <br />
              ALIPAY
              <br />
              КОШЕЛЬКА ЮАНЯМИ
            </motion.h1>

            {/* Кнопки для мобильных устройств */}
            <div className="flex flex-col sm:flex-row gap-4 mt-2 lg:hidden">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-600 px-6 py-5 text-base shadow-lg transition-all duration-300 hover:shadow-xl"
                onMouseEnter={() => setButtonHovered(true)}
                onMouseLeave={() => setButtonHovered(false)}
                onClick={scrollToCalculator}
              >
                <span className="relative z-10">НАЧАТЬ СЕЙЧАС</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-700"
                  initial={{ x: "-100%" }}
                  animate={{ x: buttonHovered ? 0 : "-100%" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute right-4"
                  animate={{ x: buttonHovered ? 0 : -5, opacity: buttonHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-orange-500 px-6 py-5 text-base text-orange-500 shadow-md transition-all duration-300 hover:bg-orange-50 hover:shadow-lg bg-transparent"
                onMouseEnter={() => setSecondButtonHovered(true)}
                onMouseLeave={() => setSecondButtonHovered(false)}
                onClick={scrollToContact}
              >
                <span>СВЯЗАТЬСЯ С НАМИ</span>
                <motion.div
                  animate={{ x: secondButtonHovered ? 5 : 0, opacity: secondButtonHovered ? 1 : 0.5 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronRight className="h-5 w-5 ml-1" />
                </motion.div>
              </Button>
            </div>
          </div>

          {/* Центральная колонка с описанием и преимуществами */}
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            className="lg:col-span-4 flex flex-col items-center lg:items-start"
          >
            {/* Описание */}
            <p className="mb-6 text-base md:text-lg text-gray-600 text-center lg:text-left">
              Быстрое и безопасное пополнение вашего Alipay кошелька юанями для пользователей из России без скрытых
              комиссий по самому выгодному курсу, наше предложение выгоднее чем в любом банке твоего города.
            </p>

            {/* Премиальные преимущества */}
            <div className="mb-8 space-y-4 w-full">
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 shadow-md">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">БЕЗОПАСНОСТЬ</h3>
                  <p className="text-sm text-gray-600">Гарантированная защита всех транзакций</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 shadow-md">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">СКОРОСТЬ</h3>
                  <p className="text-sm text-gray-600">Пополнение в течение 15 минут</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 shadow-md">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">ВЫГОДНЫЙ КУРС</h3>
                  <p className="text-sm text-gray-600">Лучшие условия обмена на рынке</p>
                </div>
              </motion.div>
            </div>

            {/* Кнопки для десктопа */}
            <div className="hidden lg:flex flex-col sm:flex-row gap-4 mt-2">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-600 px-6 py-5 text-base shadow-lg transition-all duration-300 hover:shadow-xl"
                onMouseEnter={() => setButtonHovered(true)}
                onMouseLeave={() => setButtonHovered(false)}
                onClick={scrollToCalculator}
              >
                <span className="relative z-10">НАЧАТЬ СЕЙЧАС</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-700"
                  initial={{ x: "-100%" }}
                  animate={{ x: buttonHovered ? 0 : "-100%" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute right-4"
                  animate={{ x: buttonHovered ? 0 : -5, opacity: buttonHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-orange-500 px-6 py-5 text-base text-orange-500 shadow-md transition-all duration-300 hover:bg-orange-50 hover:shadow-lg bg-transparent"
                onMouseEnter={() => setSecondButtonHovered(true)}
                onMouseLeave={() => setSecondButtonHovered(false)}
                onClick={scrollToContact}
              >
                <span>СВЯЗАТЬСЯ С НАМИ</span>
                <motion.div
                  animate={{ x: secondButtonHovered ? 5 : 0, opacity: secondButtonHovered ? 1 : 0.5 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronRight className="h-5 w-5 ml-1" />
                </motion.div>
              </Button>
            </div>

            {/* Премиальная сноска */}
            <motion.div
              className="mt-6 border-l-4 border-orange-500 pl-4 py-2 bg-orange-50 rounded-r-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <p className="text-sm text-gray-600 italic">
                <span className="font-semibold">Примечание:</span> Для новых клиентов действует специальное предложение
                — специальный курс на первое пополнение после подписки на телеграм канал.
              </p>
            </motion.div>
          </motion.div>

          {/* Правая колонка с премиальной карточкой */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <motion.div
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="relative w-full max-w-[320px] md:max-w-[350px]"
            >
              <PremiumCard exchangeRate={exchangeRate} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface PremiumCardProps {
  exchangeRate: number
}

function PremiumCard({ exchangeRate }: PremiumCardProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [qrHovered, setQrHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (y - centerY) / 20
    const rotateY = (centerX - x) / 20

    setRotation({ x: rotateX, y: rotateY })
  }

  const resetRotation = () => {
    setRotation({ x: 0, y: 0 })
    setIsHovered(false)
  }

  // Массивы символов валют для анимации
  const rubleSymbols = [
    { size: "text-3xl", x: "10%", y: "15%", delay: 0.2, duration: 8 },
    { size: "text-2xl", x: "85%", y: "70%", delay: 1.5, duration: 10 },
    { size: "text-xl", x: "20%", y: "80%", delay: 0.8, duration: 12 },
    { size: "text-4xl", x: "75%", y: "20%", delay: 0.5, duration: 9 },
    { size: "text-lg", x: "30%", y: "30%", delay: 1.2, duration: 11 },
  ]

  const yuanSymbols = [
    { size: "text-3xl", x: "80%", y: "25%", delay: 0.3, duration: 9 },
    { size: "text-2xl", x: "15%", y: "65%", delay: 1.0, duration: 11 },
    { size: "text-xl", x: "70%", y: "85%", delay: 0.6, duration: 10 },
    { size: "text-4xl", x: "25%", y: "10%", delay: 1.8, duration: 8 },
    { size: "text-lg", x: "60%", y: "40%", delay: 0.9, duration: 12 },
  ]

  return (
    <motion.div
      ref={cardRef}
      className="relative h-[400px] w-full overflow-hidden rounded-2xl"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
      animate={{
        rotateX: rotation.x,
        rotateY: rotation.y,
      }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={resetRotation}
    >
      {/* Фоновый градиент */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-red-600"
        animate={{
          backgroundPosition: isHovered ? "100% 100%" : "0% 0%",
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Стеклянная карта */}
      <div className="absolute inset-0 rounded-2xl bg-white/10 p-6 shadow-2xl backdrop-blur-sm">
        {/* Плавающие символы рубля */}
        {rubleSymbols.map((symbol, index) => (
          <motion.div
            key={`ruble-${index}`}
            className={`absolute ${symbol.size} font-bold text-white/20`}
            initial={{ x: symbol.x, y: symbol.y, opacity: 0 }}
            animate={{
              y: ["0%", "10%", "-5%", "15%", "0%"],
              opacity: isHovered ? [0.1, 0.3, 0.1] : 0.1,
            }}
            transition={{
              y: { duration: symbol.duration, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" },
              opacity: { duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
              delay: symbol.delay,
            }}
            style={{ left: symbol.x, top: symbol.y }}
          >
            ₽
          </motion.div>
        ))}

        {/* Плавающие символы юаня */}
        {yuanSymbols.map((symbol, index) => (
          <motion.div
            key={`yuan-${index}`}
            className={`absolute ${symbol.size} font-bold text-white/20`}
            initial={{ x: symbol.x, y: symbol.y, opacity: 0 }}
            animate={{
              y: ["0%", "-10%", "5%", "-15%", "0%"],
              opacity: isHovered ? [0.1, 0.3, 0.1] : 0.1,
            }}
            transition={{
              y: { duration: symbol.duration, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" },
              opacity: { duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
              delay: symbol.delay,
            }}
            style={{ left: symbol.x, top: symbol.y }}
          >
            ¥
          </motion.div>
        ))}

        {/* Логотип - теперь по центру */}
        <div className="mb-3 flex flex-col items-center justify-center text-center">
          <AnimatedText text="ALIPAYFAST" className="text-xl font-bold text-white" type="wave" repeat={isHovered} />
          <AnimatedText
            text="ОБМЕН РУБЛЕЙ НА ЮАНИ"
            className="text-xs text-white/70"
            type="chars"
            delay={0.2}
            duration={0.02}
          />
        </div>

        {/* QR-код в центре - с новым изображением */}
        <motion.div
          className="relative mx-auto flex items-center justify-center my-2"
          onMouseEnter={() => setQrHovered(true)}
          onMouseLeave={() => setQrHovered(false)}
          whileHover={{ scale: 1.05 }}
          animate={{
            y: isHovered ? -5 : 0,
            boxShadow: qrHovered ? "0 10px 25px rgba(0,0,0,0.2)" : "0 5px 15px rgba(0,0,0,0.1)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <div className="relative w-48 overflow-hidden rounded-lg bg-white p-1 shadow-lg">
            <CriticalImage
              src="/telegram-qr.png"
              alt="Telegram QR код @ALIPAYFAST"
              width={200}
              height={220}
              className="h-auto w-full"
              sizes="(max-width: 640px) 180px, 200px"
              quality={95}
              priority
            />
            {/* Блик на QR-коде */}
            <motion.div
              className="absolute inset-0 rounded-lg bg-white/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: qrHovered ? 0.2 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Символы валют - увеличены на 15% */}
        <div className="relative flex items-center justify-between px-4 mt-1">
          <motion.div
            className="text-[2.5rem] font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            animate={{ y: isHovered ? -10 : 0, rotate: isHovered ? -5 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            style={{ textShadow: "0 0 10px rgba(255,255,255,0.3)" }}
          >
            ₽
          </motion.div>

          <motion.div
            className="text-[2.5rem] font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            animate={{ y: isHovered ? -10 : 0, rotate: isHovered ? 5 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
            style={{ textShadow: "0 0 10px rgba(255,255,255,0.3)" }}
          >
            ¥
          </motion.div>
        </div>

        {/* Курс обмена с датой - уменьшенная высота */}
        <motion.div
          className="absolute bottom-4 left-0 right-0 mx-auto px-4"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/30 p-2 shadow-lg max-w-[200px] mx-auto relative overflow-hidden"
            animate={{
              boxShadow: [
                "0 4px 12px rgba(0,0,0,0.1)",
                "0 8px 24px rgba(255,255,255,0.2)",
                "0 4px 12px rgba(0,0,0,0.1)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            {/* Анимированный блик */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 1,
              }}
            />

            <div className="text-center">
              <p className="text-xs font-medium text-white/90">ТЕКУЩИЙ КУРС</p>
              <p className="text-base font-bold text-white mt-0.5 bg-gradient-to-r from-white to-white/80 bg-clip-text">
                1 CNY = {(exchangeRate + 0.65).toFixed(2)} RUB
              </p>
              <p className="text-xs text-white/70 mt-0.5">{new Date().toLocaleDateString("ru-RU")}</p>
            </div>

            {/* Пульсирующая обводка */}
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-white/50"
              animate={{
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Плавающие частицы */}
      <AnimatePresence>
        {isHovered && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-2 w-2 rounded-full bg-white"
                initial={{
                  x: Math.random() * 300 - 150,
                  y: Math.random() * 300 - 150,
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  x: Math.random() * 400 - 200,
                  y: Math.random() * 400 - 200,
                  opacity: [0, 0.5, 0],
                  scale: [0, 1, 0],
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  ease: "easeInOut",
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
                style={{
                  left: `${50 + Math.random() * 40 - 20}%`,
                  top: `${50 + Math.random() * 40 - 20}%`,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
