"use client"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PremiumHeaderProps {
  className?: string
}

export function PremiumHeader({ className }: PremiumHeaderProps) {
  return (
    <div className={cn("text-center mx-auto max-w-4xl py-8", className)}>
      <div className="relative">
        {/* Декоративные элементы */}
        <div className="absolute -left-10 -top-10 h-20 w-20 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 opacity-20 blur-xl"></div>
        <div className="absolute -right-10 -bottom-10 h-20 w-20 rounded-full bg-gradient-to-br from-orange-200 to-red-200 opacity-20 blur-xl"></div>

        {/* Золотой блик */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 opacity-10 blur-lg rounded-3xl"></div>

        {/* Основной заголовок */}
        <h1 className="font-montserrat font-black tracking-wide text-center relative">
          <div className="flex flex-wrap justify-center items-center gap-x-4 mb-2">
            <motion.span
              className="text-4xl sm:text-5xl md:text-6xl bg-gradient-to-b from-orange-400 to-orange-600 bg-clip-text text-transparent drop-shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ textShadow: "0px 2px 4px rgba(0,0,0,0.1)" }}
            >
              ПОПОЛНЕНИЕ
            </motion.span>
            <motion.span
              className="text-4xl sm:text-5xl md:text-6xl bg-gradient-to-b from-blue-400 to-blue-600 bg-clip-text text-transparent drop-shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              whileHover={{
                scale: 1.05,
                textShadow: "0 0 8px rgba(59, 130, 246, 0.5)",
              }}
              style={{ textShadow: "0px 2px 4px rgba(0,0,0,0.1)" }}
            >
              ALIPAY
            </motion.span>
          </div>

          <motion.div
            className="text-3xl sm:text-4xl md:text-5xl bg-gradient-to-b from-orange-500 to-orange-700 bg-clip-text text-transparent relative drop-shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            style={{ textShadow: "0px 2px 4px rgba(0,0,0,0.1)" }}
          >
            <span>КОШЕЛЬКА ЮАНЯМИ</span>

            {/* Декоративная линия под текстом */}
            <motion.div
              className="h-1.5 bg-gradient-to-r from-orange-500 via-blue-500 to-orange-500 rounded-full mt-3 mx-auto"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
            />
          </motion.div>
        </h1>

        {/* Металлический эффект */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent mix-blend-overlay pointer-events-none"></div>

        {/* Декоративные элементы */}
        <div className="flex justify-center mt-6 space-x-3">
          <motion.div
            className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5, delay: 1.2 }}
          />
          <motion.div
            className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5, delay: 1.3 }}
          />
          <motion.div
            className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5, delay: 1.4 }}
          />
        </div>
      </div>
    </div>
  )
}
