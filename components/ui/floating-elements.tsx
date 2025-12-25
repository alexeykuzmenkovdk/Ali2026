"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface FloatingElement {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  rotate: number
  opacity: number
  type: "circle" | "square" | "triangle" | "yuan" | "ruble"
}

interface FloatingElementsProps {
  count?: number
  className?: string
}

// Обновляю функцию FloatingElements, увеличивая количество элементов по умолчанию и меняя распределение типов
export function FloatingElements({ count = 25, className = "" }: FloatingElementsProps) {
  const [elements, setElements] = useState<FloatingElement[]>([])

  useEffect(() => {
    const newElements: FloatingElement[] = []

    for (let i = 0; i < count; i++) {
      // Определяем тип элемента с большим уклоном в сторону символов валют
      let type: "circle" | "square" | "triangle" | "yuan" | "ruble"

      // Увеличиваем вероятность появления символов валют (70% вместо 40%)
      const typeRandom = Math.random()
      if (typeRandom < 0.35) {
        type = "yuan" // 35% шанс на символ юаня
      } else if (typeRandom < 0.7) {
        type = "ruble" // 35% шанс на символ рубля
      } else if (typeRandom < 0.8) {
        type = "circle" // 10% шанс на круг
      } else if (typeRandom < 0.9) {
        type = "square" // 10% шанс на квадрат
      } else {
        type = "triangle" // 10% шанс на треугольник
      }

      // Увеличиваем размер символов валют
      const size =
        type === "yuan" || type === "ruble"
          ? Math.random() * 30 + 15 // Больший размер для символов валют (15-45)
          : Math.random() * 20 + 10 // Стандартный размер для других элементов (10-30)

      // Увеличиваем непрозрачность для символов валют
      const opacity =
        type === "yuan" || type === "ruble"
          ? Math.random() * 0.6 + 0.2 // Более заметные символы валют (0.2-0.8)
          : Math.random() * 0.5 + 0.1 // Стандартная прозрачность (0.1-0.6)

      newElements.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: size,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
        rotate: Math.random() * 360,
        opacity: opacity,
        type: type,
      })
    }

    setElements(newElements)
  }, [count])

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            opacity: element.opacity,
          }}
          animate={{
            y: ["0%", "100%", "0%"],
            x: [`${element.x}%`, `${element.x + (Math.random() * 20 - 10)}%`, `${element.x}%`],
            rotate: [0, element.rotate, 0],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {element.type === "circle" && (
            <div
              className="rounded-full bg-gradient-to-br from-orange-300 to-red-300"
              style={{ width: element.size, height: element.size }}
            />
          )}
          {element.type === "square" && (
            <div
              className="rounded-md bg-gradient-to-br from-orange-300 to-red-300"
              style={{ width: element.size, height: element.size }}
            />
          )}
          {element.type === "triangle" && (
            <div
              className="w-0 h-0 border-solid border-transparent"
              style={{
                borderBottomWidth: element.size,
                borderLeftWidth: element.size / 2,
                borderRightWidth: element.size / 2,
                borderBottomColor: "#FDBA74",
              }}
            />
          )}
          {element.type === "yuan" && (
            <div className="text-orange-300 font-bold" style={{ fontSize: element.size }}>
              ¥
            </div>
          )}
          {element.type === "ruble" && (
            <div className="text-red-300 font-bold" style={{ fontSize: element.size }}>
              ₽
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
