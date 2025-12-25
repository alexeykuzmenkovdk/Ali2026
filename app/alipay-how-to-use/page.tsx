import type { Metadata } from "next"
import Link from "next/link"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Smartphone, CreditCard, Shield, Globe } from "lucide-react"
import { AlipayTutorialHeader } from "@/components/alipay-tutorial/header"
import { AlipayTutorialSteps } from "@/components/alipay-tutorial/steps"
import { AlipayTutorialTips } from "@/components/alipay-tutorial/tips"
import { AlipayTutorialFaq } from "@/components/alipay-tutorial/faq"
import { FloatingElements } from "@/components/ui/floating-elements"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Как пользоваться Alipay в России 2025 | Инструкция по настройке Алипей | AlipayFast",
  description:
    "📱 Подробная инструкция по использованию Alipay в России: регистрация, верификация, пополнение кошелька юанями. Как настроить Алипей для покупок в Китае. Актуальная информация 2025 года.",
  keywords:
    "как пользоваться alipay, alipay в россии, регистрация alipay, верификация alipay, настройка алипей, alipay кошелек, alipay инструкция, алипей россия, как настроить alipay, alipay 2025, китайский кошелек, платежи в китае",
  openGraph: {
    title: "Как пользоваться Alipay в России 2025 | Инструкция по настройке",
    description:
      "📱 Подробная инструкция по использованию Alipay в России: регистрация, верификация, пополнение кошелька юанями",
    url: "https://alipayfast.ru/alipay-how-to-use",
    images: [
      {
        url: "/alipay-guide-og.png",
        width: 1200,
        height: 630,
        alt: "Инструкция по использованию Alipay в России",
      },
    ],
  },
  alternates: {
    canonical: "https://alipayfast.ru/alipay-how-to-use",
  },
}

export default function AlipayHowToUsePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <SiteHeader />

      <main className="flex-1">
        {/* Кнопка возврата на главную */}
        <div className="container mt-6">
          <Button variant="ghost" asChild className="flex items-center gap-2 text-gray-600 hover:text-orange-500">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span>Вернуться на главную</span>
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <AlipayTutorialHeader />

        {/* Introduction */}
        <section className="w-full py-12 bg-white">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <ScrollReveal>
                <div className="rounded-xl border border-orange-100 bg-white p-8 shadow-lg">
                  <h1 className="text-2xl font-bold mb-4 text-gray-900">
                    Что такое Alipay и зачем он нужен россиянам?
                  </h1>
                  <p className="text-gray-600 mb-4">
                    Alipay (支付宝) — это ведущая китайская платежная система, разработанная компанией Ant Group
                    (дочерняя компания Alibaba). Это основной способ оплаты на китайских маркетплейсах, таких как
                    Taobao, Tmall, JD.com, Poizon и многих других.
                  </p>
                  <p className="text-gray-600 mb-6">
                    Для россиян Alipay открывает доступ к миллионам товаров из Китая по выгодным ценам. Без Alipay
                    кошелька практически невозможно совершать покупки на китайских площадках, особенно после ограничений
                    на использование международных карт.
                  </p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Мобильные платежи в Китае</h3>
                        <p className="text-sm text-gray-600">
                          Удобная оплата через мобильное приложение с поддержкой QR-кодов для покупок в Китае
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Безопасность транзакций</h3>
                        <p className="text-sm text-gray-600">Высокий уровень защиты платежей и персональных данных</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Широкое покрытие в Китае</h3>
                        <p className="text-sm text-gray-600">
                          Принимается на всех крупных китайских маркетплейсах и в физических магазинах
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Международные переводы</h3>
                        <p className="text-sm text-gray-600">Возможность отправки денег в разные страны и валюты</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="container px-4 md:px-6">
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                    Пошаговая инструкция по настройке Alipay в России
                  </h2>
                  <p className="max-w-[900px] text-gray-600 md:text-xl">
                    Следуйте этой подробной инструкции для успешной регистрации и настройки Alipay кошелька для покупок
                    в Китае
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <AlipayTutorialSteps />
          </div>
        </section>

        {/* Tips Section */}
        <AlipayTutorialTips />

        {/* FAQ Section */}
        <section id="faq" className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="container px-4 md:px-6">
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                    Частые вопросы об использовании Alipay в России
                  </h2>
                  <p className="max-w-[900px] text-gray-600 md:text-xl">
                    Ответы на популярные вопросы об использовании Alipay в России, пополнении кошелька и покупках в
                    Китае
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <div className="mx-auto max-w-3xl mt-12">
              <ScrollReveal delay={0.2}>
                <div className="rounded-xl border border-orange-100 bg-white p-6 shadow-lg">
                  <AlipayTutorialFaq />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-orange-50 to-red-50 relative overflow-hidden">
          <FloatingElements count={20} className="opacity-40" />
          <div className="container px-4 md:px-6 relative z-10">
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                    Готовы пополнить Alipay кошелек юанями?
                  </h2>
                  <p className="max-w-[900px] text-gray-600 md:text-xl">
                    Теперь, когда вы знаете, как пользоваться Alipay, пополните свой кошелек юанями и начните покупки в
                    Китае по выгодным ценам
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <div className="mx-auto max-w-3xl mt-12">
              <ScrollReveal delay={0.2}>
                <div className="rounded-xl border-2 border-orange-500 bg-white p-8 shadow-xl">
                  <h3 className="text-2xl font-bold mb-6 text-center">Наши услуги для пользователей Alipay:</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Пополнение Alipay юанями из России</p>
                        <p className="text-sm text-gray-600">Быстрое пополнение по выгодному курсу без комиссии</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Помощь с верификацией Alipay</p>
                        <p className="text-sm text-gray-600">Поможем пройти верификацию аккаунта для покупок</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Техническая поддержка</p>
                        <p className="text-sm text-gray-600">Консультации по использованию Alipay в России</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Услуги баера для покупок в Китае</p>
                        <p className="text-sm text-gray-600">Покупки в Китае через наших специалистов</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-center gap-4">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 px-8 py-6 text-lg"
                      asChild
                    >
                      <Link href="/#calculator">Пополнить Alipay</Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-6 text-lg"
                      asChild
                    >
                      <Link href="/buyer-services">Услуги баера</Link>
                    </Button>
                  </div>
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
            </div>
            <div className="flex flex-col items-center md:items-end">
              <p className="text-sm text-gray-600">© {new Date().getFullYear()} AlipayFast. Все права защищены.</p>
              <div className="mt-2 flex items-center gap-4">
                <Link href="/terms" className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
                  Условия использования
                </Link>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
                  Политика конфиденциальности
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
