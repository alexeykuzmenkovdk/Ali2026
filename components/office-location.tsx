"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Clock, User, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import Link from "next/link"

export function OfficeLocation() {
  const [isMapHovered, setIsMapHovered] = useState(false)

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Карта */}
      <ScrollReveal>
        <motion.div
          className="relative h-[400px] overflow-hidden rounded-xl border-2 border-orange-100 shadow-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          onMouseEnter={() => setIsMapHovered(true)}
          onMouseLeave={() => setIsMapHovered(false)}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2903.1016665286707!2d131.88340307580823!3d43.11700027113983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5fb39276fa26c51f%3A0x2f5e2b2150aaa99f!2z0JrRgNCw0YHQvdC-0LfQvdCw0LzQtdC90L3Ri9C5INC_0LXRgC4sIDUsINCS0LvQsNC00LjQstC-0YHRgtC-0LosINCf0YDQuNC80L7RgNGB0LrQuNC5INC60YDQsNC5LCDQoNC-0YHRgdC40Y8sIDY5MDAzNQ!5e0!3m2!1sru!2s!4v1715702400000!5m2!1sru!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Офис Alipayfast"
            className="absolute inset-0"
          ></iframe>

          {/* Оверлей при наведении */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isMapHovered ? 1 : 0.7 }}
            transition={{ duration: 0.3 }}
          >
            <Button size="lg" className="mb-4 bg-orange-500 hover:bg-orange-600" asChild>
              <Link href="https://yandex.ru/maps/-/CDqZQXK9" target="_blank" rel="noopener noreferrer">
                Построить маршрут
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </ScrollReveal>

      {/* Информация об офисе */}
      <ScrollReveal delay={0.2}>
        <div className="flex flex-col justify-center h-full space-y-6">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent mb-2">
              Наш офис во Владивостоке
            </h3>
            <p className="text-gray-600 text-lg">
              Мы предлагаем не только онлайн-сервис, но и возможность личной встречи для обмена валюты.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold">Адрес</h4>
                <p className="text-gray-600">Владивосток, Краснознаменный переулок, д. 5</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold">Часы работы</h4>
                <p className="text-gray-600">Пн-Пт: 10:00 - 19:00</p>
                <p className="text-gray-600">Сб: 11:00 - 17:00</p>
                <p className="text-gray-600">Вс: Выходной</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold">Личная встреча</h4>
                <p className="text-gray-600">
                  Вы всегда можете встретиться лично с администратором сайта и произвести обмен наличных. Для этого
                  рекомендуем предварительно связаться с нами через Telegram или WhatsApp.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold">Преимущества личного обмена</h4>
                <p className="text-gray-600">
                  • Мгновенное получение юаней
                  <br />• Возможность обсудить индивидуальные условия
                  <br />• Консультация по использованию Alipay
                  <br />• Помощь в установке и настройке приложения
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  )
}
