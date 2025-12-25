"use client"

import { useState, useEffect } from "react"
import { motion, useAnimation, type Variants } from "framer-motion"

interface AnimatedTextProps {
  text: string
  className?: string
  type?: "chars" | "words" | "gradient" | "wave" | "highlight" | "typewriter"
  delay?: number
  duration?: number
  repeat?: boolean | number
  color?: string
  highlightColor?: string
  gradientFrom?: string
  gradientTo?: string
}

export function AnimatedText({
  text,
  className = "",
  type = "chars",
  delay = 0,
  duration = 0.05,
  repeat = false,
  color = "currentColor",
  highlightColor = "#ff4500",
  gradientFrom = "from-orange-500",
  gradientTo = "to-red-600",
}: AnimatedTextProps) {
  const controls = useAnimation()
  const [isClient, setIsClient] = useState(false)
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    setIsClient(true)
    controls.start("visible")
  }, [controls])

  useEffect(() => {
    if (isClient && type === "typewriter" && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 100) // скорость печати

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, isClient, type])

  // Анимация по буквам
  if (type === "chars" && isClient) {
    const letters = Array.from(text)

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: (i = 1) => ({
        opacity: 1,
        transition: { staggerChildren: duration, delayChildren: delay * i },
      }),
    }

    const childVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 100,
        },
      },
    }

    return (
      <motion.div
        style={{ display: "inline-block", overflow: "hidden" }}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className={className}
      >
        {letters.map((letter, index) => (
          <motion.span key={index} style={{ display: "inline-block", color }} variants={childVariants}>
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.div>
    )
  }

  // Анимация по словам
  if (type === "words" && isClient) {
    const words = text.split(" ")

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: (i = 1) => ({
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: delay * i },
      }),
    }

    const childVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 100,
        },
      },
    }

    return (
      <motion.div
        style={{ display: "inline-block" }}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className={className}
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            style={{ display: "inline-block", color, marginRight: "0.25em" }}
            variants={childVariants}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    )
  }

  // Анимация градиентного заполнения
  if (type === "gradient" && isClient) {
    return (
      <div className={`relative inline-block ${className}`}>
        <span className="opacity-0">{text}</span>
        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, delay, ease: "easeInOut" }}
        >
          <span className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent`}>{text}</span>
        </motion.div>
      </div>
    )
  }

  // Эффект волны
  if (type === "wave" && isClient) {
    const letters = Array.from(text)

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: delay },
      },
    }

    const waveVariants: Variants = {
      hidden: { y: 0 },
      visible: (i) => ({
        y: [0, -10, 0],
        transition: {
          delay: i * 0.05,
          repeat: typeof repeat === "number" ? repeat : repeat ? Number.POSITIVE_INFINITY : 0,
          repeatDelay: 2,
          duration: 0.5,
        },
      }),
    }

    return (
      <motion.div
        style={{ display: "inline-block" }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={className}
      >
        {letters.map((letter, index) => (
          <motion.span key={index} style={{ display: "inline-block", color }} custom={index} variants={waveVariants}>
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.div>
    )
  }

  // Эффект выделения
  if (type === "highlight" && isClient) {
    return (
      <div className={`relative inline-block ${className}`}>
        <span style={{ color }}>{text}</span>
        <motion.div
          className="absolute bottom-0 left-0 h-[3px] bg-orange-500"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
        />
      </div>
    )
  }

  // Эффект печатающейся машинки
  if (type === "typewriter" && isClient) {
    return (
      <div className={className} style={{ color }}>
        {displayText}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8 }}
          className="inline-block w-[2px] h-[1em] bg-current ml-1 align-middle"
        />
      </div>
    )
  }

  // Запасной вариант
  return (
    <div className={className} style={{ color }}>
      {text}
    </div>
  )
}

export function AnimatedTextDemo() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-8 font-portugal">АНИМИРОВАННЫЙ ТЕКСТ</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Анимация по буквам</h3>
          <div className="h-16 flex items-center">
            <AnimatedText text="ALIPAYFAST" className="text-2xl font-portugal" type="chars" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Анимация по словам</h3>
          <div className="h-16 flex items-center">
            <AnimatedText text="ОБМЕН ВАЛЮТЫ БЫСТРО" className="text-2xl font-portugal" type="words" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Градиентное заполнение</h3>
          <div className="h-16 flex items-center">
            <AnimatedText text="ВЫГОДНЫЙ КУРС" className="text-2xl font-portugal" type="gradient" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Эффект волны</h3>
          <div className="h-16 flex items-center">
            <AnimatedText text="БЕЗОПАСНЫЕ ПЕРЕВОДЫ" className="text-2xl font-portugal" type="wave" repeat={true} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Эффект выделения</h3>
          <div className="h-16 flex items-center">
            <AnimatedText text="НАДЕЖНЫЙ СЕРВИС" className="text-2xl font-portugal" type="highlight" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Эффект печатающейся машинки</h3>
          <div className="h-16 flex items-center">
            <AnimatedText text="ПОПОЛНЕНИЕ ALIPAY" className="text-2xl font-portugal" type="typewriter" />
          </div>
        </div>
      </div>
    </div>
  )
}
