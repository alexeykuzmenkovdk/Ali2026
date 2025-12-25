import type { Metadata } from "next"
import { TBankIntro } from "@/components/tbank-guide/intro"
import { TBankSteps } from "@/components/tbank-guide/steps"
import { BackToHome } from "@/components/back-to-home"
import { SiteHeader } from "@/components/site-header"
import { ContactButtons } from "@/components/contact-buttons"
import { TermsModal } from "@/components/terms-modal"
import { PrivacyModal } from "@/components/privacy-modal"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Оплата через Т-Банк | AlipayFast - Подробная инструкция",
  description:
    "Подробная пошаговая инструкция по оплате через приложение Т-Банк для пополнения Alipay. Оформление карты, установка приложения, перевод денег и отправка чека.",
  keywords: "т-банк, тинькофф, оплата alipay, перевод т-банк, инструкция т-банк, как оплатить через т-банк, чек т-банк",
  openGraph: {
    title: "Оплата через Т-Банк | AlipayFast",
    description: "Подробная пошаговая инструкция по оплате через Т-Банк для пополнения Alipay кошелька",
    images: ["/og-alipay-fast.png"],
  },
}

export default function TBankGuidePage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <BackToHome />
        <TBankIntro />
        <TBankSteps />
        <ContactButtons />
      </main>
      <footer className="bg-white py-8 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 text-sm">© {new Date().getFullYear()} AlipayFast. Все права защищены.</p>
            </div>
            <div className="flex space-x-6">
              <TermsModal />
              <PrivacyModal />
              <Link href="https://t.me/whaledator" className="text-gray-600 hover:text-orange-500 text-sm">
                Связаться с нами
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
