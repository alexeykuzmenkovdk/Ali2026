"use client"

import { useState } from "react"
import { OptimizedImage } from "@/components/optimized-image"

export function BrandHeroImage() {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="relative w-full max-w-[500px] h-[300px] md:h-[400px]">
      {/* Показываем плейсхолдер, пока изображение загружается */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-orange-100 to-red-100 rounded-lg">
          <div className="text-orange-500 font-bold text-xl">Alipayfast</div>
        </div>
      )}

      <OptimizedImage
        src="/hero-image.png"
        alt="Alipay wallet illustration"
        fill
        className={`rounded-lg object-contain shadow-lg transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        priority
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 500px"
        quality={90}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  )
}
