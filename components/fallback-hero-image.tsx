"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function FallbackHeroImage() {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Запускаем анимацию периодически
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 2000)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-orange-500 rounded-xl opacity-20" />

      <motion.div
        className="relative z-10 bg-gradient-to-r from-blue-600 to-orange-600 rounded-xl shadow-xl"
        style={{
          width: "85%",
          height: "60%",
          maxWidth: "340px",
          maxHeight: "210px",
        }}
        animate={{
          rotateY: isAnimating ? [0, 180, 0] : 0,
          scale: isAnimating ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isAnimating ? [1, 0, 0, 1] : 1 }}
            transition={{ duration: 2 }}
            className="text-2xl font-bold"
          >
            Alipay
          </motion.div>
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isAnimating ? [1, 0, 0, 1] : 1 }}
            transition={{ duration: 2 }}
            className="text-sm mt-2"
          >
            Быстрое пополнение
          </motion.div>
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isAnimating ? [1, 0, 0, 1] : 1 }}
            transition={{ duration: 2 }}
            className="absolute bottom-4 right-4 text-xl"
          >
            ¥
          </motion.div>
        </div>
      </motion.div>

      {/* Плавающие элементы */}
      <motion.div
        className="absolute w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-red-400 opacity-30"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ top: "20%", left: "20%" }}
      />

      <motion.div
        className="absolute w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-30"
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ bottom: "30%", right: "25%" }}
      />

      <motion.div
        className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 opacity-20"
        animate={{
          x: [0, 40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 7,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ bottom: "15%", left: "30%" }}
      />
    </div>
  )
}
