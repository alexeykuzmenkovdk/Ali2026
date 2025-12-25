import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { montserrat, inter } from "./fonts"
import { Toaster } from "@/components/toaster"
import { MobileOptimization } from "@/components/mobile-optimization"

export const metadata: Metadata = {
  title: "Пополнение Alipay из России 2025 | Обмен рублей на юани | AlipayFast",
  description:
    "⚡ Быстрое пополнение Alipay кошелька юанями из России. Выгодный курс обмена рублей на юани без комиссии. Пополнить Алипей за 5 минут. Работаем 24/7. Владивосток.",
  keywords:
    "пополнение alipay, пополнить алипей, обмен рублей на юани, alipay кошелек, курс юаня, пополнение алипей из россии, как пополнить alipay, alipay пополнение, юани за рубли, китайские юани, покупки в китае, taobao оплата, tmall оплата, услуги баера, заказ с китая, владивосток обмен валют",
  authors: [{ name: "AlipayFast - Пополнение Alipay" }],
  creator: "AlipayFast",
  publisher: "AlipayFast",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://alipayfast.ru",
    siteName: "AlipayFast - Пополнение Alipay кошелька юанями",
    title: "Пополнение Alipay из России 2025 | Обмен рублей на юани",
    description:
      "⚡ Быстрое пополнение Alipay кошелька юанями из России. Выгодный курс обмена рублей на юани без комиссии. Работаем 24/7.",
    images: [
      {
        url: "/og-alipay-fast.png",
        width: 1200,
        height: 630,
        alt: "AlipayFast - Пополнение Alipay кошелька юанями из России",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Пополнение Alipay из России | Обмен рублей на юани",
    description: "⚡ Быстрое пополнение Alipay кошелька юанями. Выгодный курс, работаем 24/7",
    images: ["/og-alipay-fast.png"],
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: "https://alipayfast.ru",
  },
  other: {
    "msapplication-TileColor": "#ea580c",
    "theme-color": "#ea580c",
  },
  metadataBase: new URL("https://alipayfast.ru"),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
    ],
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${montserrat.variable}`}>
      <head>
        <link rel="canonical" href="https://alipayfast.ru" />
        <meta name="geo.region" content="RU-PRI" />
        <meta name="geo.placename" content="Владивосток, Приморский край" />
        <meta name="geo.position" content="43.1056;131.8735" />
        <meta name="ICBM" content="43.1056, 131.8735" />
        <meta name="format-detection" content="telephone=no" />

        {/* Favicon и иконки */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        <meta name="theme-color" content="#ea580c" />
        <meta name="msapplication-TileColor" content="#ea580c" />

        {/* Дополнительные SEO метатеги */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />
        <meta name="revisit-after" content="1 days" />
        <meta name="language" content="Russian" />
        <meta name="coverage" content="Worldwide" />
        <meta name="target" content="all" />
        <meta name="audience" content="all" />
        <meta name="doc-type" content="Web Page" />
        <meta name="doc-rights" content="Copywritten Work" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="width" />

        {/* Локальный бизнес */}
        <meta name="locality" content="Владивосток" />
        <meta name="region" content="Приморский край" />
        <meta name="country" content="Россия" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://alipayfast.ru/#organization",
                  name: "AlipayFast",
                  alternateName: "Алипей Фаст",
                  description: "Сервис пополнения Alipay кошелька юанями из России",
                  url: "https://alipayfast.ru",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://alipayfast.ru/alipayfast-logo.png",
                    width: 200,
                    height: 80,
                  },
                  image: "https://alipayfast.ru/og-alipay-fast.png",
                  telephone: "+7-XXX-XXX-XXXX",
                  email: "zakaz.alipayfast@gmail.com",
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "ул. Примерная, 1",
                    addressLocality: "Владивосток",
                    addressRegion: "Приморский край",
                    postalCode: "690000",
                    addressCountry: "RU",
                  },
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: 43.1056,
                    longitude: 131.8735,
                  },
                  openingHours: "Mo-Su 00:00-23:59",
                  currenciesAccepted: ["RUB", "CNY"],
                  paymentAccepted: ["Cash", "Credit Card", "Bank Transfer"],
                  priceRange: "$$",
                  serviceType: ["Currency Exchange", "Payment Processing", "Financial Services"],
                  areaServed: {
                    "@type": "Country",
                    name: "Россия",
                  },
                  sameAs: ["https://t.me/whaledator"],
                  mobileApplication: {
                    "@type": "MobileApplication",
                    name: "AlipayFast Mobile",
                    operatingSystem: "iOS, Android",
                    applicationCategory: "FinanceApplication",
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": "https://alipayfast.ru/#website",
                  url: "https://alipayfast.ru",
                  name: "AlipayFast - Пополнение Alipay кошелька юанями",
                  description: "Быстрое и безопасное пополнение Alipay кошелька юанями из России",
                  publisher: {
                    "@id": "https://alipayfast.ru/#organization",
                  },
                  potentialAction: {
                    "@type": "SearchAction",
                    target: "https://alipayfast.ru/?s={search_term_string}",
                    "query-input": "required name=search_term_string",
                  },
                  inLanguage: "ru-RU",
                },
                {
                  "@type": "FinancialService",
                  "@id": "https://alipayfast.ru/#service",
                  name: "Пополнение Alipay кошелька юанями",
                  description: "Сервис обмена рублей на китайские юани с пополнением Alipay кошелька",
                  provider: {
                    "@id": "https://alipayfast.ru/#organization",
                  },
                  areaServed: {
                    "@type": "Country",
                    name: "Россия",
                  },
                  serviceType: "Currency Exchange",
                  currency: ["RUB", "CNY"],
                  offers: {
                    "@type": "Offer",
                    description: "Пополнение Alipay кошелька юанями",
                    priceCurrency: "RUB",
                    availability: "https://schema.org/InStock",
                    validFrom: "2024-01-01",
                    seller: {
                      "@id": "https://alipayfast.ru/#organization",
                    },
                  },
                },
                {
                  "@type": "LocalBusiness",
                  "@id": "https://alipayfast.ru/#localbusiness",
                  name: "AlipayFast Владивосток",
                  description: "Офис AlipayFast во Владивостоке для пополнения Alipay",
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "ул. Примерная, 1",
                    addressLocality: "Владивосток",
                    addressRegion: "Приморский край",
                    postalCode: "690000",
                    addressCountry: "RU",
                  },
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: 43.1056,
                    longitude: 131.8735,
                  },
                  telephone: "+7-XXX-XXX-XXXX",
                  openingHours: "Mo-Su 00:00-23:59",
                  priceRange: "$$",
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.className} cursor-auto`}>
        <MobileOptimization />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
