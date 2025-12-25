"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function LogoDisplay() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Проверяем, загружается ли изображение
    const img = new Image()
    img.src = "/alipayfast-logo.png"
    img.onload = () => {
      setIsLoaded(true)
      console.log("Логотип успешно загружен")
    }
    img.onerror = () => {
      setHasError(true)
      console.error("Ошибка при загрузке логотипа")
    }
  }, [])

  if (hasError) {
    return (
      <div className="flex justify-center md:justify-start mb-4">
        <div className="h-24 md:h-28 flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 px-4 rounded-md">
          <span className="text-white font-bold text-xl">ALIPAYFAST</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center md:justify-start mb-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8 }}
        transition={{ duration: 0.6 }}
        className="relative h-24 md:h-28"
      >
        <img
          src="/alipayfast-logo.png"
          alt="AlipayFast Logo"
          className="h-full w-auto object-contain"
          style={{ maxWidth: "100%" }}
          onLoad={() => console.log("Логотип загружен в компоненте")}
          onError={() => console.error("Ошибка загрузки логотипа в компоненте")}
        />
      </motion.div>
    </div>
  )
}
