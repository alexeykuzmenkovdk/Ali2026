"use client"

import { useEffect, useRef } from "react"

const DEFAULT_ALLOWED_ZONE_PX = 32

export function useTelegramSwipeDownGuard(isEnabled: boolean, allowedZonePx = DEFAULT_ALLOWED_ZONE_PX) {
  const touchStartYRef = useRef(0)
  const allowCloseGestureRef = useRef(false)
  const scrollContainerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isEnabled) return

    const previousBodyOverscroll = document.body.style.overscrollBehaviorY
    const previousHtmlOverscroll = document.documentElement.style.overscrollBehaviorY
    document.body.style.overscrollBehaviorY = "none"
    document.documentElement.style.overscrollBehaviorY = "none"

    const resolveScrollContainer = (target: EventTarget | null) => {
      let element = target instanceof HTMLElement ? target : null
      while (element) {
        const style = window.getComputedStyle(element)
        const overflowY = style.overflowY
        if ((overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") && element.scrollHeight > element.clientHeight) {
          return element
        }
        element = element.parentElement
      }
      return document.scrollingElement instanceof HTMLElement ? document.scrollingElement : document.documentElement
    }

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (!touch) return
      scrollContainerRef.current = resolveScrollContainer(event.target)
      touchStartYRef.current = touch.clientY
      allowCloseGestureRef.current = touch.clientY <= allowedZonePx
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (allowCloseGestureRef.current) return
      const touch = event.touches[0]
      if (!touch) return

      const scrollElement = scrollContainerRef.current || document.scrollingElement || document.documentElement
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
      document.body.style.overscrollBehaviorY = previousBodyOverscroll
      document.documentElement.style.overscrollBehaviorY = previousHtmlOverscroll
    }
  }, [allowedZonePx, isEnabled])
}
