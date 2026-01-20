"use client"

import { useEffect, useRef, useState } from "react"

type BlogImageLightboxProps = {
  children: React.ReactNode
}

export function BlogImageLightbox({ children }: BlogImageLightboxProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [activeImage, setActiveImage] = useState<{ src: string; alt: string } | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target || target.tagName !== "IMG") return
      const image = target as HTMLImageElement
      if (!image.src) return
      setActiveImage({ src: image.src, alt: image.alt || "" })
    }

    container.addEventListener("click", handleClick)
    return () => container.removeEventListener("click", handleClick)
  }, [])

  useEffect(() => {
    if (!activeImage) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveImage(null)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [activeImage])

  return (
    <div ref={containerRef} className="relative">
      {children}
      {activeImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveImage(null)}
        >
          <button
            type="button"
            aria-label="Закрыть просмотр"
            className="absolute right-6 top-6 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-gray-900 shadow transition hover:bg-white"
            onClick={(event) => {
              event.stopPropagation()
              setActiveImage(null)
            }}
          >
            Закрыть
          </button>
          <img
            src={activeImage.src}
            alt={activeImage.alt}
            className="max-h-[90vh] w-auto max-w-[90vw] rounded-xl border border-white/20 object-contain shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  )
}
