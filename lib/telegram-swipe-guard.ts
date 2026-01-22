"use client"

import { useEffect, useRef } from "react"

const DEFAULT_ALLOWED_ZONE_PX = 32

export function useTelegramSwipeDownGuard(isEnabled: boolean, allowedZonePx = DEFAULT_ALLOWED_ZONE_PX) {
  const touchStartYRef = useRef(0)
  const allowCloseGestureRef = useRef(false)

  useEffect(() => {
    if (!isEnabled) return

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (!touch) return
      touchStartYRef.current = touch.clientY
      allowCloseGestureRef.current = touch.clientY <= allowedZonePx
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (allowCloseGestureRef.current) return
      const touch = event.touches[0]
      if (!touch) return

      const scrollElement = document.scrollingElement || document.documentElement
      const isAtTop = scrollElement ? scrollElement.scrollTop <= 0 : true
      const isPullingDown = touch.clientY - touchStartYRef.current > 0

      if (isAtTop && isPullingDown) {
        event.preventDefault()
      }
    }

    const resetGesture = () => {
      allowCloseGestureRef.current = false
    }

    document.addEventListener("touchstart", handleTouchStart, { passive: true })
    document.addEventListener("touchmove", handleTouchMove, { passive: false })
    document.addEventListener("touchend", resetGesture)
    document.addEventListener("touchcancel", resetGesture)

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", resetGesture)
      document.removeEventListener("touchcancel", resetGesture)
    }
  }, [allowedZonePx, isEnabled])
}
