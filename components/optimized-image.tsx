"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  quality?: number
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
  loading?: "lazy" | "eager"
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
  quality = 85,
  placeholder = "blur",
  blurDataURL,
  objectFit = "cover",
  loading = "lazy",
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Автоматические размеры для адаптивности
  const defaultSizes =
    sizes ||
    `
    (max-width: 640px) 100vw,
    (max-width: 768px) 50vw,
    (max-width: 1024px) 33vw,
    25vw
  `

  // Генерация blur placeholder для лучшего UX
  const generateBlurDataURL = (w: number, h: number) => {
    return `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f97316;stop-opacity:0.1" />
            <stop offset="100%" style="stop-color:#dc2626;stop-opacity:0.1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" />
      </svg>`,
    ).toString("base64")}`
  }

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100 text-orange-600",
          className,
        )}
        style={{ width, height }}
      >
        <div className="text-center p-4">
          <div className="text-2xl mb-2">📷</div>
          <div className="text-sm">Изображение недоступно</div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Skeleton loader */}
      {isLoading && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-orange-100 to-red-100 animate-pulse"
          style={{ width, height }}
        />
      )}

      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        sizes={defaultSizes}
        quality={quality}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL || (width && height ? generateBlurDataURL(width, height) : undefined)}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          objectFit === "cover" && "object-cover",
          objectFit === "contain" && "object-contain",
          objectFit === "fill" && "object-fill",
          objectFit === "none" && "object-none",
          objectFit === "scale-down" && "object-scale-down",
        )}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        // Оптимизация для мобильных устройств
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      />
    </div>
  )
}

// Компонент для адаптивных изображений с разными источниками
interface ResponsiveImageProps extends OptimizedImageProps {
  mobileSrc?: string
  tabletSrc?: string
  desktopSrc?: string
}

export function ResponsiveImage({ src, mobileSrc, tabletSrc, desktopSrc, alt, ...props }: ResponsiveImageProps) {
  return (
    <picture>
      {/* Мобильные устройства */}
      {mobileSrc && <source media="(max-width: 640px)" srcSet={mobileSrc} type="image/webp" />}

      {/* Планшеты */}
      {tabletSrc && <source media="(max-width: 1024px)" srcSet={tabletSrc} type="image/webp" />}

      {/* Десктоп */}
      {desktopSrc && <source media="(min-width: 1025px)" srcSet={desktopSrc} type="image/webp" />}

      {/* Fallback */}
      <OptimizedImage src={src} alt={alt} {...props} />
    </picture>
  )
}

// Компонент для изображений с lazy loading и intersection observer
export function LazyImage(props: OptimizedImageProps) {
  return <OptimizedImage {...props} loading="lazy" />
}

// Компонент для критических изображений (hero, логотипы)
export function CriticalImage(props: OptimizedImageProps) {
  return <OptimizedImage {...props} priority loading="eager" />
}
