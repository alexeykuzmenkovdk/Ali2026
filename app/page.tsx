"use client"

import { ContactButtons } from "@/components/contact-buttons"
import { Faq } from "@/components/faq"
import { SiteHeader } from "@/components/site-header"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { PremiumHero } from "@/components/premium-hero"
import { EnhancedFeatures } from "@/components/enhanced-features"
import { PremiumCalculator } from "@/components/premium-calculator"
import { ModernHowItWorks } from "@/components/modern-how-it-works"
import { useState, useEffect } from "react"
import { FloatingElements } from "@/components/ui/floating-elements"
import { OfficeLocation } from "@/components/office-location"
import { TestimonialsCarousel } from "@/components/testimonials-carousel"
import { SectionDivider } from "@/components/ui/section-divider"
import { TermsModal } from "@/components/terms-modal"
import { PrivacyModal } from "@/components/privacy-modal"

export default function Home() {
  const [exchangeRate, setExchangeRate] = useState<number>(12.5)
  const [isLoading, setIsLoading] = useState(true)
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false)

  // Получаем курс обмена при загрузке страницы
  useEffect(() => {
    async function fetchExchangeRate() {
      try {
        setIsLoading(true)
        console.log("Запрос курса обмена...")

        const response = await fetch("/api/exchange-rate", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        console.log("Статус ответа:", response.status)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text()
          console.error("Получен не JSON ответ:", text.substring(0, 200))
          throw new Error("Сервер вернул не JSON ответ")
        }

        const data = await response.json()
        console.log("Получены данные курса:", data)

        if (data.success && data.rate) {
          const rate = Number.parseFloat(data.rate)
          if (!isNaN(rate) && rate > 0) {
            setExchangeRate(rate)
            console.log("Курс установлен:", rate)
          } else {
            throw new Error("Некорректный курс в ответе")
          }
        } else {
          throw new Error("Неуспешный ответ от API")
        }
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error)
        // Используем значение по умолчанию при ошибке
        setExchangeRate(12.5)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExchangeRate()
  }, [])

  useEffect(() => {
    // Добавляем структурированные данные для главной страницы
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Пополнение Alipay кошелька юанями из России",
      description:
        "Быстрое пополнение Alipay кошелька юанями из России. Выгодный курс обмена рублей на юани без комиссии.",
      url: "https://alipayfast.ru",
      mainEntity: {
        "@type": "FinancialService",
        name: "Пополнение Alipay",
        description: "Сервис пополнения Alipay кошелька юанями",
        provider: {
          "@type": "Organization",
          name: "AlipayFast",
        },
      },
    }

    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.text = JSON.stringify(structuredData)
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section id="hero">
          <PremiumHero exchangeRate={exchangeRate} />
        </section>

        {/* Переход от Hero к Calculator */}
        <div className="relative w-full overflow-hidden h-16 bg-gradient-to-br from-white via-orange-50 to-red-50">
          <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
              className="fill-current text-white"
            />
          </svg>
        </div>

        {/* Calculator Section */}
        <section id="calculator" className="w-full py-16 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                    Калькулятор пополнения Alipay: обмен рублей на юани
                  </h1>
                  <p className="max-w-[900px] text-gray-600 md:text-xl">
                    Узнайте точную стоимость пополнения вашего Alipay кошелька в рублях по актуальному курсу юаня.
                    Быстрый расчет без комиссии за конвертацию валют.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <div className="mx-auto max-w-3xl mt-8">
              <PremiumCalculator />
            </div>
          </div>
        </section>

        {/* Переход от Calculator к Features */}
        <SectionDivider type="curve" fromColor="from-white" toColor="to-gray-50" waveColor="text-white" height="h-16" />

        {/* Enhanced Features Section */}
        <section id="features">
          <EnhancedFeatures />
        </section>

        {/* Переход от Features к How It Works */}
        <SectionDivider type="gradient" fromColor="from-gray-50" toColor="to-white" height="h-16" />

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-16 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                    Как пополнить Alipay кошелек из России за 5 минут
                  </h2>
                  <p className="max-w-[900px] text-gray-600 md:text-xl">
                    Простая инструкция по пополнению Alipay кошелька юанями без зарубежной карты. Работаем с любыми
                    российскими банками и картами МИР.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <div className="mx-auto max-w-5xl mt-12">
              <ModernHowItWorks />
            </div>
          </div>
        </section>

        {/* Переход от How It Works к Office */}
        <SectionDivider
          type="dots"
          fromColor="from-white"
          toColor="to-gray-50"
          waveColor="bg-orange-200"
          height="h-16"
          subtle={true}
        />

        {/* Office Location Section */}
        <section id="office" className="w-full py-16 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                    Обмен валют во Владивостоке: наш офис
                  </h2>
                  <p className="max-w-[900px] text-gray-600 md:text-xl">
                    Физический офис во Владивостоке для обмена рублей на юани и пополнения Alipay. Личные консультации
                    по покупкам в Китае и работе с китайскими платежными системами.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <OfficeLocation />
          </div>
        </section>

        {/* Переход от Office к Testimonials */}
        <SectionDivider
          type="wave"
          fromColor="from-gray-50"
          toColor="to-orange-50"
          waveColor="text-orange-100"
          height="h-24"
          subtle={true}
        />

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-orange-50 to-red-50"
        >
          <FloatingElements count={20} className="opacity-40" />
          <div className="container px-4 md:px-6 relative z-10">
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                    Отзывы клиентов о пополнении Alipay в России
                  </h2>
                  <p className="max-w-[900px] text-gray-600 md:text-xl">
                    Реальные отзывы клиентов из Владивостока и Приморского края о нашем сервисе пополнения Alipay
                    кошелька. Более 1000 успешных операций по обмену рублей на юани.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="mx-auto max-w-6xl">
                <TestimonialsCarousel />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Переход от Testimonials к FAQ */}
        <SectionDivider type="curve" fromColor="from-red-50" toColor="to-white" waveColor="text-white" height="h-16" />

        {/* FAQ Section */}
        <section id="faq" className="w-full py-16 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                    Частые вопросы о пополнении Alipay из России
                  </h2>
                  <p className="max-w-[900px] text-gray-600 md:text-xl">
                    Ответы на популярные вопросы о пополнении Alipay кошелька юанями, курсе обмена валют и покупках в
                    Китае. Все что нужно знать о работе с китайскими платежными системами.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <div className="mx-auto max-w-3xl mt-12">
              <ScrollReveal delay={0.2}>
                <div className="rounded-xl border border-orange-100 bg-white p-6 shadow-lg">
                  <Faq />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Переход от FAQ к Contact */}
        <SectionDivider type="gradient" fromColor="from-white" toColor="to-orange-100" height="h-16" />

        {/* Contact Section */}
        <section id="contact" className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-orange-100 to-red-100">
          <div className="container px-4 md:px-6">
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                    Связаться с нами для пополнения Alipay
                  </h2>
                  <p className="max-w-[900px] text-gray-600 md:text-xl">
                    Выберите удобный способ связи для пополнения Alipay кошелька юанями. Консультации по обмену валют,
                    покупкам в Китае и услугам баера. Работаем 24/7.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <div className="mx-auto max-w-3xl mt-12 flex flex-col items-center">
              <ScrollReveal delay={0.2}>
                <ContactButtons variant="large" />
              </ScrollReveal>
              <ScrollReveal delay={0.3}>
                <div className="mt-12 text-center">
                  <p className="text-gray-600">Время работы: Пн-Вс, 24/7</p>
                  <p className="text-gray-600 mt-2">Консультации на русском, английском и китайском языках</p>
                  <p className="text-gray-600 mt-2">Офис во Владивостоке, обслуживаем весь Приморский край</p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-white py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start">
              <p className="mt-2 text-sm text-gray-600">ПОПОЛНЕНИЕ ALIPAY КОШЕЛЬКА ЮАНЯМИ ИЗ РОССИИ</p>
              <p className="mt-1 text-xs text-gray-500">Обмен рублей на китайские юани • Владивосток • 24/7</p>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <p className="text-sm text-gray-600">© {new Date().getFullYear()} AlipayFast. Все права защищены.</p>
              <div className="mt-2 flex items-center gap-4">
                <button
                  onClick={() => setIsTermsModalOpen(true)}
                  className="text-sm text-gray-600 hover:text-orange-500 transition-colors cursor-pointer"
                >
                  Условия использования
                </button>
                <button
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="text-sm text-gray-600 hover:text-orange-500 transition-colors cursor-pointer"
                >
                  Политика конфиденциальности
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TermsModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
      <PrivacyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
    </div>
  )
}
