"use client"

import { useEffect, useRef, useState } from "react"

const DEFAULT_ALLOWED_ZONE_PX = 32
const LONG_PRESS_MS = 350
const MAX_PULL_PX = 120

export function useTelegramSwipeDownGuard(isEnabled: boolean, allowedZonePx = DEFAULT_ALLOWED_ZONE_PX) {
  const touchStartYRef = useRef(0)
  const allowCloseGestureRef = useRef(false)
  const scrollContainerRef = useRef<HTMLElement | null>(null)
  const longPressTimeoutRef = useRef<number | null>(null)
  const longPressActiveRef = useRef(false)
  const pullOffsetRef = useRef(0)
  const [pullOffset, setPullOffset] = useState(0)

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
      longPressActiveRef.current = false
      if (longPressTimeoutRef.current) {
        window.clearTimeout(longPressTimeoutRef.current)
      }
      longPressTimeoutRef.current = window.setTimeout(() => {
        longPressActiveRef.current = true
      }, LONG_PRESS_MS)
    }

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (!touch) return
      const delta = touch.clientY - touchStartYRef.current

      if (longPressActiveRef.current && delta > 0) {
        const nextOffset = Math.min(delta, MAX_PULL_PX)
        if (nextOffset !== pullOffsetRef.current) {
          pullOffsetRef.current = nextOffset
          setPullOffset(nextOffset)
        }
        event.preventDefault()
        return
      }

      if (allowCloseGestureRef.current) return

      const scrollElement = scrollContainerRef.current || document.scrollingElement || document.documentElement
      const isAtTop = scrollElement ? scrollElement.scrollTop <= 0 : true
      const isPullingDown = delta > 0

      if (isAtTop && isPullingDown) {
        event.preventDefault()
      }
    }

    const resetGesture = () => {
      allowCloseGestureRef.current = false
      longPressActiveRef.current = false
      if (longPressTimeoutRef.current) {
        window.clearTimeout(longPressTimeoutRef.current)
        longPressTimeoutRef.current = null
      }
      if (pullOffsetRef.current !== 0) {
        pullOffsetRef.current = 0
        setPullOffset(0)
      }
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
      if (longPressTimeoutRef.current) {
        window.clearTimeout(longPressTimeoutRef.current)
        longPressTimeoutRef.current = null
      }
    }
  }, [allowedZonePx, isEnabled])

  return pullOffset
}
