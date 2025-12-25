"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
// Добавляем импорт для модального окна отзыва
import { ReviewFormModal } from "@/components/review-form-modal"

interface Testimonial {
  id: number
  text: string
  name: string
  location: string
  rating: number
  date: string
}

export function TestimonialsCarousel() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      text: "Собирались с семьей в Харбин на выходные, нужно было срочно пополнить Alipay. Алексей помог с обменом за 15 минут! Курс был даже выгоднее, чем в местных обменниках. Теперь только к вам!",
      name: "Михаил С.",
      location: "Владивосток",
      rating: 5,
      date: "15.04.2025",
    },
    {
      id: 2,
      text: "Регулярно езжу в Суйфэньхэ за товаром для своего магазина. Раньше всегда была проблема с юанями, приходилось возить наличку. Теперь просто пополняю Alipay через этот сервис - быстро, удобно и без лишних вопросов. Очень доволен!",
      name: "Андрей К.",
      location: "Уссурийск",
      rating: 5,
      date: "02.05.2025",
    },
    {
      id: 3,
      text: "Впервые воспользовалась сервисом перед поездкой в Янцзы. Немного переживала, но всё прошло отлично! Деньги поступили на счёт буквально через 7 минут после оплаты. Спасибо за оперативность!",
      name: "Елена В.",
      location: "Артем",
      rating: 5,
      date: "28.04.2025",
    },
    {
      id: 4,
      text: "Алексей, огромное спасибо за помощь! Застрял в Хуньчуне с пустым Alipay, а карты не работали. Написал вам в панике, и через 10 минут уже смог расплатиться за отель. Вы реально выручили!",
      name: "Дмитрий Н.",
      location: "Владивосток",
      rating: 5,
      date: "10.05.2025",
    },
    {
      id: 5,
      text: "Пользуюсь сервисом уже полгода, с тех пор как начала часто ездить в Китай. Всегда быстро, всегда без проблем. Особенно ценю, что можно обменять даже поздно вечером, когда все обменники уже закрыты.",
      name: "Анастасия М.",
      location: "Владивосток",
      rating: 5,
      date: "05.05.2025",
    },
    {
      id: 6,
      text: "Заказывал товары через Taobao, нужно было срочно оплатить, а с юанями проблема. Нашел Alipayfast, рискнул - и не пожалел! Всё чётко, быстро, по хорошему курсу. Теперь только так и буду пополнять.",
      name: "Игорь Л.",
      location: "Артем",
      rating: 4,
      date: "22.04.2025",
    },
    {
      id: 7,
      text: "Собрались с друзьями на выходные в Хуньчунь, вспомнил в последний момент про юани. Алексей помог с обменом поздно вечером, хотя я уже не надеялся. Всё прошло идеально, деньги пришли моментально. Большое спасибо!",
      name: "Сергей Д.",
      location: "Уссурийск",
      rating: 5,
      date: "01.05.2025",
    },
    {
      id: 8,
      text: "Работаю с китайскими поставщиками, постоянно нужны юани на Alipay. Раньше мучился с переводами, теперь всё решается в пару кликов. Отдельное спасибо за консультацию по работе с китайскими платежными системами!",
      name: "Виктор П.",
      location: "Владивосток",
      rating: 5,
      date: "08.05.2025",
    },
    {
      id: 9,
      text: "Ездила с ребенком в Далянь, и прямо там поняла, что наличных юаней не хватит. Нашла Alipayfast по рекомендации знакомых. Алексей всё подробно объяснил, помог с пополнением. Очень выручили, спасибо огромное!",
      name: "Ольга К.",
      location: "Владивосток",
      rating: 5,
      date: "25.04.2025",
    },
    {
      id: 10,
      text: "Постоянно заказываю товары из Китая, и Alipay просто необходим. Перепробовал много способов пополнения, но этот сервис оказался самым удобным и выгодным. Никаких задержек, всё прозрачно. Рекомендую!",
      name: "Александр Т.",
      location: "Находка",
      rating: 5,
      date: "12.05.2025",
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  // Добавляем состояние для открытия/закрытия модального окна
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

  // Показываем по 3 отзыва на десктопе, 2 на планшете, 1 на мобильном
  const getVisibleCount = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1024) return 3
      if (window.innerWidth >= 640) return 2
      return 1
    }
    return 3 // Значение по умолчанию для SSR
  }

  const [visibleCount, setVisibleCount] = useState(3)

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount())
    }

    handleResize() // Инициализация при загрузке
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const nextTestimonial = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % (testimonials.length - visibleCount + 1))
  }

  const prevTestimonial = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - visibleCount : prevIndex - 1))
  }

  // Автоматическая прокрутка
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        nextTestimonial()
      }, 5000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPaused, visibleCount, testimonials.length])

  // Получаем видимые отзывы
  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + visibleCount)

  // Варианты анимации
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  return (
    <div className="relative w-full" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className="overflow-hidden">
        <div className="flex">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            {visibleTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full px-2 sm:w-1/2 lg:w-1/3 flex-shrink-0"
              >
                <div className="h-full rounded-xl border border-orange-100 bg-white p-6 shadow-lg backdrop-blur-sm">
                  <div className="mb-4 flex justify-between">
                    <div className="flex text-orange-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="mr-1 h-4 w-4"
                          fill={i < testimonial.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">{testimonial.date}</span>
                  </div>
                  <p className="mb-4 text-gray-600 italic">{`"${testimonial.text}"`}</p>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Навигационные кнопки */}
      <Button
        variant="outline"
        size="icon"
        className="absolute -left-4 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full border border-orange-200 bg-white/80 text-orange-500 shadow-md backdrop-blur-sm hover:bg-orange-50 hover:text-orange-600"
        onClick={prevTestimonial}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute -right-4 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full border border-orange-200 bg-white/80 text-orange-500 shadow-md backdrop-blur-sm hover:bg-orange-50 hover:text-orange-600"
        onClick={nextTestimonial}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Индикаторы */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: testimonials.length - visibleCount + 1 }).map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentIndex ? "w-6 bg-orange-500" : "bg-orange-200"
            }`}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
            }}
          />
        ))}
      </div>

      {/* Кнопка "Оставить отзыв" */}
      <div className="mt-8 flex justify-center">
        <Button
          onClick={() => setIsReviewModalOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
        >
          Оставить отзыв
        </Button>
      </div>

      {/* Модальное окно для отзыва */}
      <ReviewFormModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} />
    </div>
  )
}
