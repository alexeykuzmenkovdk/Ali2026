"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [clicked, setClicked] = useState(false)
  const [linkHovered, setLinkHovered] = useState(false)
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    // Показываем курсор только после загрузки страницы
    const timeout = setTimeout(() => {
      setHidden(false)
    }, 1000)

    const addEventListeners = () => {
      document.addEventListener("mousemove", onMouseMove)
      document.addEventListener("mouseenter", onMouseEnter)
      document.addEventListener("mouseleave", onMouseLeave)
      document.addEventListener("mousedown", onMouseDown)
      document.addEventListener("mouseup", onMouseUp)
    }

    const removeEventListeners = () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseenter", onMouseEnter)
      document.removeEventListener("mouseleave", onMouseLeave)
      document.removeEventListener("mousedown", onMouseDown)
      document.removeEventListener("mouseup", onMouseUp)
    }

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const onMouseDown = () => {
      setClicked(true)
    }

    const onMouseUp = () => {
      setClicked(false)
    }

    const onMouseLeave = () => {
      setHidden(true)
    }

    const onMouseEnter = () => {
      setHidden(false)
    }

    const handleLinkHoverEvents = () => {
      document
        .querySelectorAll("a, button, [role=button], input, select, textarea, [tabindex]:not([tabindex='-1'])")
        .forEach((el) => {
          el.addEventListener("mouseenter", () => setLinkHovered(true))
          el.addEventListener("mouseleave", () => setLinkHovered(false))
        })
    }

    addEventListeners()
    handleLinkHoverEvents()

    return () => {
      removeEventListeners()
      clearTimeout(timeout)
    }
  }, [])

  // Не отображаем кастомный курсор на мобильных устройствах
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (isMobile) {
      document.documentElement.classList.add("no-custom-cursor")
    } else {
      document.documentElement.classList.remove("no-custom-cursor")
    }
  }, [])

  return (
    <div
      className={cn("custom-cursor-container pointer-events-none fixed left-0 top-0 z-[9999]", hidden && "opacity-0")}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
      {/* Основная стрелка курсора */}
      <div
        className={cn(
          "custom-cursor-arrow absolute transition-all duration-200 ease-out",
          clicked ? "scale-90" : "scale-100",
          linkHovered ? "scale-110" : "",
        )}
        style={{
          transform: "translate(-10%, -10%)", // Смещение для правильного позиционирования кончика стрелки
        }}
      >
        <svg
          width={linkHovered ? "36" : "30"}
          height={linkHovered ? "36" : "30"}
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Элегантная стрелка-юань */}
          <path
            d="M8 22L3 3L22 8"
            stroke={linkHovered ? "#FF4D00" : "#FF6B00"}
            strokeWidth={clicked ? "3" : "2"}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Горизонтальные линии символа юаня */}
          <path
            d="M10 14H18"
            stroke={linkHovered ? "#FF4D00" : "#FF6B00"}
            strokeWidth={clicked ? "2.5" : "1.5"}
            strokeLinecap="round"
          />
          <path
            d="M10 18H18"
            stroke={linkHovered ? "#FF4D00" : "#FF6B00"}
            strokeWidth={clicked ? "2.5" : "1.5"}
            strokeLinecap="round"
          />
          {/* Вертикальная линия символа юаня */}
          <path
            d="M14 11V22"
            stroke={linkHovered ? "#FF4D00" : "#FF6B00"}
            strokeWidth={clicked ? "2.5" : "1.5"}
            strokeLinecap="round"
          />

          {/* Дополнительный элемент для эффекта при наведении */}
          {linkHovered && (
            <circle
              cx="14"
              cy="14"
              r="12"
              stroke="#FF4D00"
              strokeWidth="1"
              strokeDasharray="2 2"
              className="animate-spin-slow"
            />
          )}
        </svg>
      </div>

      {/* Эффект свечения при клике */}
      {clicked && (
        <div
          className="absolute rounded-full bg-orange-500 opacity-30 transition-all duration-300"
          style={{
            width: "20px",
            height: "20px",
            transform: "translate(-50%, -50%)",
            filter: "blur(4px)",
          }}
        />
      )}
    </div>
  )
}
