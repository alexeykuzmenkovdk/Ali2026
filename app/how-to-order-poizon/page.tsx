import { SiteHeader } from "@/components/site-header"
import { PoisonTutorialSteps } from "@/components/poizon-tutorial/steps"
import { PoisonTutorialTips } from "@/components/poizon-tutorial/tips"
import { PoisonTutorialFAQ } from "@/components/poizon-tutorial/faq"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingBag, Smartphone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const metadata = {
  title: "Как заказывать с Пойзон (Poizon) - Пошаговая инструкция | AlipayFast",
  description:
    "Подробная инструкция по заказу товаров с платформы Пойзон (Poizon). Узнайте, как безопасно покупать оригинальные кроссовки и одежду из Китая.",
}

export default function HowToOrderPoizonPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Image src="/poizon-logo.png" alt="Логотип Poizon" width={200} height={80} className="mb-4" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Как заказывать с Пойзон (Poizon)</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Пошаговая инструкция по покупке оригинальных кроссовок, одежды и аксессуаров на популярной китайской
              платформе Poizon. Безопасно, просто и выгодно!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Smartphone className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Мобильное приложение</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <ShoppingBag className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Оригинальные товары</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <span className="w-5 h-5 text-orange-500 font-bold">¥</span>
                <span className="text-sm font-medium">Оплата юанями</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Что такое Poizon?</h2>
              <p className="text-gray-600 mb-4">
                Poizon (также известен как Dewu) - это ведущая китайская платформа для покупки оригинальных кроссовок,
                одежды и аксессуаров от мировых брендов. Платформа специализируется на аутентичных товарах и имеет
                строгую систему проверки подлинности.
              </p>
              <p className="text-gray-600">
                Особенность Poizon в том, что все товары проходят обязательную проверку на подлинность перед отправкой
                покупателю. Это гарантирует, что вы получите именно оригинальный товар, а не подделку.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Пошаговая инструкция по заказу</h2>
            <PoisonTutorialSteps />
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Полезные советы и рекомендации</h2>
            <PoisonTutorialTips />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <PoisonTutorialFAQ />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-6">Готовы начать покупки на Poizon?</h2>
            <p className="text-xl mb-8 opacity-90">
              Пополните ваш Alipay кошелек юанями и начните покупать оригинальные товары по выгодным ценам прямо из
              Китая!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" variant="secondary">
                <Link href="/#calculator">Пополнить Alipay</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-orange-500"
              >
                <Link href="/buyer-services">Услуги баера</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Button asChild variant="ghost">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Вернуться на главную
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
