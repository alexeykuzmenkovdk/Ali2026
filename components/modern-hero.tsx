"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { AlipayFastLogo, FallbackLogo } from "@/components/3d-logo-model"
import { FloatingElements } from "@/components/ui/floating-elements"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { AnimatedGradientBackground } from "@/components/ui/animated-gradient-background"
import { useState, useEffect } from "react"
import { AnimatedText } from "@/components/animated-text-effects"

export function ModernHero() {
  const [is3DLoaded, setIs3DLoaded] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [debugMessage, setDebugMessage] = useState("Логотип должен отображаться здесь")

  // Обработка ошибок при загрузке 3D-модели
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Проверяем, связана ли ошибка с 3D-моделью
      if (
        event.message.includes("texture") ||
        event.message.includes("three") ||
        event.message.includes("canvas") ||
        event.message.includes("webgl")
      ) {
        setHasError(true)
        setIs3DLoaded(false)
      }
    }

    window.addEventListener("error", handleError)

    // Отладочное сообщение в консоль
    console.log("ModernHero компонент загружен, логотип должен отображаться")

    return () => {
      window.removeEventListener("error", handleError)
    }
  }, [])

  return (
    <AnimatedGradientBackground className="w-full py-12 md:py-24 lg:py-32">
      <FloatingElements count={20} />
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
          <div className="flex flex-col justify-center space-y-4">
            <ScrollReveal>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
              >
                {/* Очень простой текстовый логотип с яркими стилями для отладки */}
                <div
                  className="flex justify-center md:justify-start mb-6 p-4 bg-white/80 rounded-lg border-4 border-red-500 shadow-xl"
                  style={{
                    position: "relative",
                    zIndex: 50,
                    minHeight: "80px",
                    overflow: "visible",
                  }}
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-600 text-transparent bg-clip-text">
                    ALIPAYFAST
                  </div>
                </div>

                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  <AnimatedText text="ПОПОЛНЕНИЕ ALIPAY" className="inline-block font-portugal pb-2" type="chars" />
                  <br />
                  <AnimatedText
                    text="КОШЕЛЬКА ЮАНЯМИ"
                    className="inline-block font-portugal"
                    type="chars"
                    delay={0.3}
                  />
                </h1>
                <p className="max-w-[600px] text-gray-600 md:text-xl">
                  Быстрое и безопасное пополнение вашего Alipay кошелька юанями для пользователей из России.
                </p>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col gap-2 min-[400px]:flex-row"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 font-portugal"
                >
                  <AnimatedText text="НАЧАТЬ СЕЙЧАС" type="words" />
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-orange-500 text-orange-500 hover:bg-orange-50 shadow-sm hover:shadow-md transition-all duration-300 font-portugal"
                >
                  <Link href="#contact">
                    <AnimatedText text="СВЯЗАТЬСЯ С НАМИ" type="words" delay={0.2} />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-orange-500 px-8 py-6 text-lg text-orange-500 shadow-md transition-all duration-300 hover:bg-orange-50 hover:shadow-lg font-portugal"
                  asChild
                >
                  <Link href="/how-to-order-from-china">
                    <AnimatedText text="КАК ЗАКАЗЫВАТЬ ИЗ КИТАЯ" type="words" delay={0.4} />
                  </Link>
                </Button>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center gap-4 pt-4"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <AnimatedText
                    text="БЫСТРО"
                    className="text-sm font-medium font-portugal"
                    type="highlight"
                    delay={0.6}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <AnimatedText
                    text="БЕЗОПАСНО"
                    className="text-sm font-medium font-portugal"
                    type="highlight"
                    delay={0.8}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <AnimatedText
                    text="ВЫГОДНЫЙ КУРС"
                    className="text-sm font-medium font-portugal"
                    type="highlight"
                    delay={1}
                  />
                </div>
              </motion.div>
            </ScrollReveal>
          </div>

          <ScrollReveal direction="left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="flex items-center justify-center"
            >
              <div className="relative w-full h-full">
                {is3DLoaded && !hasError ? <AlipayFastLogo /> : <FallbackLogo />}
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </AnimatedGradientBackground>
  )
}
