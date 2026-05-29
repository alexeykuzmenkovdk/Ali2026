import { Montserrat, Inter } from "next/font/google"

// Montserrat — только для заголовков, загружаем опционально
export const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
  preload: true,
  // Загружаем только кириллицу и латиницу — убираем лишние subsets
})

// Inter — основной шрифт, важен для первого экрана
export const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  // Только нужные начертания
  weight: ["400", "500", "600"],
})

export const fonts = {
  montserrat,
  inter,
}

