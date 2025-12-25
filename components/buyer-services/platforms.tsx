"use client"

import { motion } from "framer-motion"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

export function BuyerServicesPlatforms() {
  const platforms = [
    {
      name: "Taobao",
      logo: "TB",
      color: "#FF4400",
      description: "Крупнейшая торговая площадка Китая с миллионами товаров по низким ценам.",
    },
    {
      name: "Tmall",
      logo: "TM",
      color: "#E43226",
      description: "Премиальная версия Taobao с проверенными продавцами и брендовыми товарами.",
    },
    {
      name: "JD.com",
      logo: "JD",
      color: "#D71C1E",
      description: "Один из крупнейших онлайн-ритейлеров Китая с акцентом на электронику и бытовую технику.",
    },
    {
      name: "Poizon (Dewu)",
      logo: "PZ",
      color: "#000000",
      description: "Популярная платформа для покупки кроссовок, одежды и аксессуаров премиальных брендов.",
    },
    {
      name: "1688",
      logo: "1688",
      color: "#FF6600",
      description: "Оптова�� платформа для бизнеса с минимальными ценами от производителей.",
    },
    {
      name: "Xiaohongshu",
      logo: "XHS",
      color: "#00A0DC",
      description: "Социальная сеть и маркетплейс с уникальными товарами и модными новинками.",
    },
  ]

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <ScrollReveal>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                Площадки, с которыми мы работаем
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl">
                Поможем найти и выкупить товары с любых китайских маркетплейсов
              </p>
            </div>
          </div>
        </ScrollReveal>

        <div className="mx-auto max-w-6xl mt-12">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {platforms.map((platform, index) => (
              <ScrollReveal key={platform.name} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="flex flex-col rounded-xl border border-orange-100 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl h-full"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                      style={{ backgroundColor: platform.color }}
                    >
                      {platform.logo}
                    </div>
                    <h3 className="text-xl font-bold">{platform.name}</h3>
                  </div>
                  <p className="text-gray-600 flex-grow">{platform.description}</p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Комиссия от</span>
                      <span className="font-semibold text-orange-600">5%</span>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
