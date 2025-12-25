"use client"

import { useEffect, useState } from "react"

// Компонент для оптимизации мобильного опыта
export function MobileOptimization() {
  const [isMobile, setIsMobile] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Определяем мобильное устройство
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent))
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    // Предотвращаем зум при фокусе на input на iOS
    if (isIOS) {
      const inputs = document.querySelectorAll(
        'input[type="number"], input[type="text"], input[type="email"], input[type="tel"]',
      )
      inputs.forEach((input) => {
        input.addEventListener("focus", () => {
          const viewport = document.querySelector('meta[name="viewport"]')
          if (viewport) {
            viewport.setAttribute(
              "content",
              "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
            )
          }
        })

        input.addEventListener("blur", () => {
          const viewport = document.querySelector('meta[name="viewport"]')
          if (viewport) {
            viewport.setAttribute(
              "content",
              "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes",
            )
          }
        })
      })
    }

    // Улучшаем производительность скролла на мобильных
    if (isMobile) {
      document.body.style.webkitOverflowScrolling = "touch"
    }

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [isIOS, isMobile])

  return null
}
