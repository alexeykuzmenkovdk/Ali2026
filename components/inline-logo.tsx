"use client"
import { motion } from "framer-motion"

interface InlineLogoProps {
  className?: string
  width?: number
  height?: number
}

export function InlineLogo({ className = "", width = 200, height = 100 }: InlineLogoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className={`relative ${className}`}
      style={{ width, height }}
    >
      <svg viewBox="0 0 1000 600" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B00" />
            <stop offset="100%" stopColor="#D10000" />
          </linearGradient>
        </defs>
        {/* Стилизованный логотип на основе предоставленного изображения */}
        <g fill="url(#logoGradient)">
          {/* Левая часть (рубль) */}
          <path d="M200,150 C100,150 50,250 50,350 C50,450 100,550 200,550 C250,550 300,500 300,450 L200,450 L200,350 L300,350 L300,250 L200,250 L200,150 Z" />

          {/* Средняя часть (юань) */}
          <path d="M400,150 L500,150 L500,250 L550,250 L550,350 L500,350 L500,550 L400,550 L400,350 L350,350 L350,250 L400,250 L400,150 Z" />

          {/* Правая часть (волна) */}
          <path d="M600,150 C700,150 750,250 750,350 C750,450 700,550 600,550 C550,550 500,500 500,450 L600,450 C650,450 650,400 650,350 C650,300 650,250 600,250 L500,250 C500,200 550,150 600,150 Z" />

          {/* Внешняя дуга */}
          <path
            d="M800,150 C900,150 950,250 950,350 C950,450 900,550 800,550"
            fill="none"
            stroke="url(#logoGradient)"
            strokeWidth="40"
          />
        </g>

        {/* Текст ALIPAYFAST */}
        <text x="500" y="650" textAnchor="middle" fontSize="80" fontWeight="bold" fill="url(#logoGradient)">
          ALIPAYFAST
        </text>
      </svg>
    </motion.div>
  )
}
