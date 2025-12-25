import { Montserrat, Inter } from "next/font/google"

// Используем только Google шрифты, так как с локальным шрифтом возникают проблемы
export const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
})

// Добавляем Inter как основной шрифт
export const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
})

// Экспортируем объект fonts для удобства использования
export const fonts = {
  montserrat,
  inter,
}
