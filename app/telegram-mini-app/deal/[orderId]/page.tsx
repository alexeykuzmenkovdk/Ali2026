"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useTelegramSwipeDownGuard } from "@/lib/telegram-swipe-guard"

const MESSAGE_PAGE_SIZE = 50
const SCROLL_BOTTOM_THRESHOLD = 80
const DRAFT_DEBOUNCE_MS = 400
const READ_DEBOUNCE_MS = 1200

const QUICK_REPLIES = ["Я оплатил", "Отправляю чек", "Не получается оплатить"]

type OrderStatus = "CREATED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED"

type MessageStatus = "sending" | "sent" | "error"

type MessageRole = "client" | "admin"

interface Order {
  id: string
  status: OrderStatus
  totalRub: number
  totalCny: number
  rate: number
  createdAt: string
  alipayId: string | null
  fullName: string | null
  contactUsername: string | null
  contactPhone: string | null
}

interface PaymentStep {
  id: string
  stepIndex: number
  status: string
  amountRub: number
  method: string
  requisiteValue: string
  bankName: string
  receiptEmail: string
  receiptFileUrl?: string
}

interface OrderMessage {
  id: string
  senderRole: MessageRole
  text?: string
  fileUrl?: string
  createdAt: string
}

interface LocalMessage extends OrderMessage {
  status: MessageStatus
  clientGeneratedId: string
  isSystem?: boolean
  file?: File
}

interface ToastState {
  message: string
  tone?: "success" | "error"
}

export default function DealRoomPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = useMemo(() => (typeof params.orderId === "string" ? params.orderId : ""), [params.orderId])

  const [initData, setInitData] = useState("")
  const [isTelegram, setIsTelegram] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [steps, setSteps] = useState<PaymentStep[]>([])
  const [serverMessages, setServerMessages] = useState<OrderMessage[]>([])
  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([])
  const [messageText, setMessageText] = useState("")
  const [messageFile, setMessageFile] = useState<File | null>(null)
  const [messageFilePreview, setMessageFilePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastState | null>(null)
  const [mediaPreview, setMediaPreview] = useState<{ url: string; type: "image" | "video" } | null>(null)
  const [isChatPinnedToBottom, setIsChatPinnedToBottom] = useState(true)
  const [chatScrollRatio, setChatScrollRatio] = useState(0)
  const [unreadCount, setUnreadCount] = useState(0)
  const [firstUnreadId, setFirstUnreadId] = useState<string | null>(null)
  const [lastReadMessageId, setLastReadMessageId] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<"chat" | "details">("chat")

  const chatContainerRef = useRef<HTMLDivElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const firstUnreadRef = useRef<HTMLDivElement | null>(null)
  const messageInputRef = useRef<HTMLInputElement | null>(null)
  const readDebounceRef = useRef<number | null>(null)
  const draftDebounceRef = useRef<number | null>(null)
  const initialScrollDoneRef = useRef(false)
  const toastTimerRef = useRef<number | null>(null)
  const localMessagesRef = useRef<LocalMessage[]>([])

  const handleBack = useCallback(() => router.push("/telegram-mini-app"), [router])

  useEffect(() => {
    const telegramWebApp = window.Telegram?.WebApp
    const updateViewport = () => {
      const viewportHeight = telegramWebApp?.viewportHeight ?? window.innerHeight
      document.documentElement.style.setProperty("--tg-viewport-height", `${viewportHeight}px`)
    }

    if (telegramWebApp) {
      telegramWebApp.ready()
      telegramWebApp.expand()
      try {
        telegramWebApp.requestFullscreen?.()
      } catch (error) {
        console.warn("Не удалось запросить fullscreen в Telegram WebApp", error)
      }
      telegramWebApp.enableClosingConfirmation?.()
      telegramWebApp.BackButton?.show()
      telegramWebApp.BackButton?.onClick(handleBack)
      telegramWebApp.onEvent?.("viewportChanged", updateViewport)
      setIsTelegram(true)
      setInitData(telegramWebApp.initData)
      updateViewport()
      return () => {
        telegramWebApp.disableClosingConfirmation?.()
        telegramWebApp.BackButton?.offClick(handleBack)
        telegramWebApp.offEvent?.("viewportChanged", updateViewport)
      }
    }

    updateViewport()
    setIsTelegram(false)
    setInitData("")
  }, [handleBack])

  const pullOffset = useTelegramSwipeDownGuard(isTelegram)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
    initialScrollDoneRef.current = false
  }, [orderId])

  useEffect(() => {
    if (!messageFile) {
      setMessageFilePreview(null)
      return
    }

    const previewUrl = URL.createObjectURL(messageFile)
    setMessageFilePreview(previewUrl)
    return () => {
      URL.revokeObjectURL(previewUrl)
    }
  }, [messageFile])

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current)
      }
      localMessagesRef.current.forEach(revokeLocalMessageUrl)
    }
  }, [])

  const showToast = useCallback((message: string, tone: ToastState["tone"] = "success") => {
    setToast({ message, tone })
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current)
    }
    toastTimerRef.current = window.setTimeout(() => setToast(null), 2500)
  }, [])

  const cloudStorageGet = useCallback(
    async (key: string) => {
      const telegramWebApp = window.Telegram?.WebApp
      if (!telegramWebApp?.CloudStorage) {
        return localStorage.getItem(key)
      }

      return new Promise<string | null>((resolve) => {
        telegramWebApp.CloudStorage.getItem(key, (error, value) => {
          if (error) {
            resolve(localStorage.getItem(key))
            return
          }
          resolve(value)
        })
      })
    },
    [],
  )

  const cloudStorageSet = useCallback(
    async (key: string, value: string) => {
      const telegramWebApp = window.Telegram?.WebApp
      if (!telegramWebApp?.CloudStorage) {
        localStorage.setItem(key, value)
        return
      }

      telegramWebApp.CloudStorage.setItem(key, value, (error) => {
        if (error) {
          localStorage.setItem(key, value)
        }
      })
    },
    [],
  )

  const cloudStorageRemove = useCallback(
    async (key: string) => {
      const telegramWebApp = window.Telegram?.WebApp
      if (!telegramWebApp?.CloudStorage) {
        localStorage.removeItem(key)
        return
      }

      telegramWebApp.CloudStorage.removeItem(key, (error) => {
        if (error) {
          localStorage.removeItem(key)
        }
      })
    },
    [],
  )

  const draftKey = useMemo(() => `order:${orderId}:draft`, [orderId])
  const lastReadKey = useMemo(() => `order:${orderId}:lastReadMessageId`, [orderId])

  const fetchOrderDetails = async (currentOrderId: string, initDataHeader: string) => {
    const response = await fetch(`/api/orders/${currentOrderId}`, {
      headers: {
        "x-telegram-init-data": initDataHeader,
      },
    })

    if (!response.ok) {
      throw new Error("Не удалось загрузить данные заявки.")
    }

    const data = await response.json()
    if (!data.order) {
      throw new Error("Заявка не найдена.")
    }

    setOrder(data.order)
    setSteps(data.steps ?? [])
    setServerMessages(data.messages ?? [])
    setHasMore((data.messages ?? []).length >= MESSAGE_PAGE_SIZE)
  }

  const mergeServerMessages = useCallback((incoming: OrderMessage[]) => {
    setServerMessages((prev) => {
      const map = new Map<string, OrderMessage>()
      prev.forEach((message) => map.set(message.id, message))
      incoming.forEach((message) => map.set(message.id, message))
      return Array.from(map.values()).sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
    })
  }, [])

  const fetchLatestMessages = useCallback(
    async (activeOrderId: string, initDataHeader: string) => {
      const response = await fetch(
        `/api/orders/${activeOrderId}/messages?limit=${MESSAGE_PAGE_SIZE}`,
        {
          headers: {
            "x-telegram-init-data": initDataHeader,
          },
        },
      )

      if (!response.ok) return
      const data = await response.json()
      mergeServerMessages(data.messages ?? [])
    },
    [mergeServerMessages],
  )

  const combinedMessages = useMemo(() => {
    const map = new Map<string, OrderMessage | LocalMessage>()
    serverMessages.forEach((message) => map.set(message.id, message))
    localMessages.forEach((message) => map.set(message.id, message))
    return Array.from(map.values()).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
  }, [localMessages, serverMessages])

  useEffect(() => {
    localMessagesRef.current = localMessages
  }, [localMessages])

  useEffect(() => {
    const container = chatContainerRef.current
    if (!container) return
    const maxScroll = container.scrollHeight - container.clientHeight
    setChatScrollRatio(maxScroll > 0 ? container.scrollTop / maxScroll : 0)
  }, [combinedMessages])

  useEffect(() => {
    if (!orderId) return
    if (!initData) {
      setIsLoading(false)
      setError("Откройте мини-приложение внутри Telegram, чтобы увидеть чат.")
      return
    }

    let isActive = true

    const load = async () => {
      try {
        setIsLoading(true)
        await fetchOrderDetails(orderId, initData)
        setError(null)
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить чат.")
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      isActive = false
    }
  }, [orderId, initData])

  useEffect(() => {
    if (!orderId) return

    cloudStorageGet(draftKey)
      .then((value) => {
        if (value) {
          setMessageText(value)
        }
      })
      .catch(() => null)

    cloudStorageGet(lastReadKey)
      .then((value) => {
        if (value) {
          setLastReadMessageId(value)
        }
      })
      .catch(() => null)
  }, [cloudStorageGet, draftKey, lastReadKey, orderId])

  useEffect(() => {
    if (!messageText && !draftDebounceRef.current) {
      cloudStorageRemove(draftKey).catch(() => null)
      return
    }

    if (draftDebounceRef.current) {
      window.clearTimeout(draftDebounceRef.current)
    }

    draftDebounceRef.current = window.setTimeout(() => {
      if (messageText.trim()) {
        cloudStorageSet(draftKey, messageText).catch(() => null)
      } else {
        cloudStorageRemove(draftKey).catch(() => null)
      }
    }, DRAFT_DEBOUNCE_MS)
  }, [cloudStorageRemove, cloudStorageSet, draftKey, messageText])

  const isChatReadOnly = order ? order.status === "COMPLETED" || order.status === "CANCELED" : false

  useEffect(() => {
    if (!initData || !orderId || isChatReadOnly) return
    const interval = window.setInterval(() => {
      fetchLatestMessages(orderId, initData).catch(() => null)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [fetchLatestMessages, initData, orderId, isChatReadOnly])

  useEffect(() => {
    if (!combinedMessages.length) return
    if (!lastReadMessageId) {
      setUnreadCount(combinedMessages.length)
      setFirstUnreadId(combinedMessages[0]?.id ?? null)
      return
    }

    const lastReadIndex = combinedMessages.findIndex((message) => message.id === lastReadMessageId)
    const unreadStartIndex = lastReadIndex >= 0 ? lastReadIndex + 1 : 0
    const unread = combinedMessages.length - unreadStartIndex
    setUnreadCount(unread > 0 ? unread : 0)
    setFirstUnreadId(unread > 0 ? combinedMessages[unreadStartIndex]?.id ?? null : null)
  }, [combinedMessages, lastReadMessageId])

  useEffect(() => {
    if (!combinedMessages.length) return
    if (initialScrollDoneRef.current) return

    requestAnimationFrame(() => {
      if (firstUnreadId) {
        firstUnreadRef.current?.scrollIntoView({ behavior: "auto", block: "center" })
      } else {
        bottomRef.current?.scrollIntoView({ behavior: "auto" })
      }
      initialScrollDoneRef.current = true
    })
  }, [combinedMessages, firstUnreadId])

  useEffect(() => {
    if (isChatPinnedToBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [combinedMessages, isChatPinnedToBottom])

  const updateLastRead = useCallback(
    (messageId: string | null) => {
      if (!messageId) return
      setLastReadMessageId(messageId)
      cloudStorageSet(lastReadKey, messageId).catch(() => null)
    },
    [cloudStorageSet, lastReadKey],
  )

  const scheduleReadUpdate = useCallback(
    (messageId: string | null) => {
      if (readDebounceRef.current) {
        window.clearTimeout(readDebounceRef.current)
      }
      readDebounceRef.current = window.setTimeout(() => updateLastRead(messageId), READ_DEBOUNCE_MS)
    },
    [updateLastRead],
  )

  const handleChatScroll = () => {
    const container = chatContainerRef.current
    if (!container) return
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight
    const maxScroll = container.scrollHeight - container.clientHeight
    setIsChatPinnedToBottom(distanceFromBottom < SCROLL_BOTTOM_THRESHOLD)
    setChatScrollRatio(maxScroll > 0 ? container.scrollTop / maxScroll : 0)

    if (container.scrollTop <= 40 && hasMore && !isFetchingMore) {
      void loadOlderMessages()
    }

    if (distanceFromBottom < SCROLL_BOTTOM_THRESHOLD && combinedMessages.length > 0) {
      scheduleReadUpdate(combinedMessages[combinedMessages.length - 1]?.id ?? null)
    }
  }

  const loadOlderMessages = async () => {
    if (!orderId || !initData) return
    const container = chatContainerRef.current
    const oldestMessage = serverMessages[0]
    if (!oldestMessage) return

    setIsFetchingMore(true)
    const prevScrollHeight = container?.scrollHeight ?? 0

    try {
      const response = await fetch(
        `/api/orders/${orderId}/messages?limit=${MESSAGE_PAGE_SIZE}&before=${oldestMessage.id}`,
        {
          headers: {
            "x-telegram-init-data": initData,
          },
        },
      )

      if (!response.ok) {
        return
      }

      const data = await response.json()
      const olderMessages: OrderMessage[] = data.messages ?? []
      if (olderMessages.length === 0) {
        setHasMore(false)
        return
      }

      setServerMessages((prev) => {
        const map = new Map<string, OrderMessage>()
        olderMessages.forEach((message) => map.set(message.id, message))
        prev.forEach((message) => map.set(message.id, message))
        return Array.from(map.values()).sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )
      })

      requestAnimationFrame(() => {
        if (!container) return
        const newScrollHeight = container.scrollHeight
        container.scrollTop = newScrollHeight - prevScrollHeight
      })

      if (olderMessages.length < MESSAGE_PAGE_SIZE) {
        setHasMore(false)
      }
    } finally {
      setIsFetchingMore(false)
    }
  }

  const uploadMessageFile = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    const response = await fetch("/api/uploads", {
      method: "POST",
      headers: {
        "x-telegram-init-data": initData,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Не удалось загрузить файл.")
    }

    const data = await response.json()
    return data.url as string
  }

  const revokeLocalMessageUrl = (message: LocalMessage) => {
    if (message.fileUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(message.fileUrl)
    }
  }

  const makeLocalMessage = (text?: string, file?: File, isSystem = false): LocalMessage => {
    const now = new Date().toISOString()
    const clientGeneratedId = crypto.randomUUID()
    return {
      id: `client-${clientGeneratedId}`,
      senderRole: "client",
      text,
      fileUrl: file ? URL.createObjectURL(file) : undefined,
      createdAt: now,
      status: "sending",
      clientGeneratedId,
      isSystem,
      file,
    }
  }

  const sendLocalMessage = async (localMessage: LocalMessage, textOverride?: string, fileOverride?: File | null) => {
    if (!orderId || !initData) {
      return
    }
    const trimmedText = (textOverride ?? localMessage.text ?? "").trim()
    const file = fileOverride ?? localMessage.file ?? null

    try {
      let fileUrl: string | undefined
      if (file) {
        setIsUploading(true)
        fileUrl = await uploadMessageFile(file)
      }

      const response = await fetch(`/api/orders/${orderId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-telegram-init-data": initData,
        },
        body: JSON.stringify({
          text: trimmedText || undefined,
          fileUrl,
          client_generated_id: localMessage.clientGeneratedId,
        }),
      })

      if (!response.ok) {
        throw new Error("Не удалось отправить сообщение.")
      }

      const data = await response.json()
      if (data.message) {
        mergeServerMessages([data.message])
      }

      setLocalMessages((prev) => {
        const next = prev.filter((message) => message.clientGeneratedId !== localMessage.clientGeneratedId)
        revokeLocalMessageUrl(localMessage)
        return next
      })
      if (trimmedText) {
        cloudStorageRemove(draftKey).catch(() => null)
      }
    } catch (sendError) {
      setLocalMessages((prev) =>
        prev.map((message) =>
          message.clientGeneratedId === localMessage.clientGeneratedId
            ? { ...message, status: "error" }
            : message,
        ),
      )
      setError(sendError instanceof Error ? sendError.message : "Не удалось отправить сообщение.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSend = async (options?: { textOverride?: string; fileOverride?: File | null; isSystem?: boolean }) => {
    if (!initData || !orderId || isChatReadOnly) return
    const trimmedText = (options?.textOverride ?? messageText).trim()
    const file = options?.fileOverride ?? messageFile
    if (!trimmedText && !file) return

    const localMessage = makeLocalMessage(trimmedText || undefined, file ?? undefined, options?.isSystem ?? false)

    setLocalMessages((prev) => [...prev, localMessage])
    setIsSending(true)

    try {
      await sendLocalMessage(localMessage, trimmedText, file ?? null)
      if (!options?.textOverride) {
        setMessageText("")
      }
      if (!options?.fileOverride) {
        setMessageFile(null)
      }
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Не удалось отправить сообщение.")
    } finally {
      setIsSending(false)
    }
  }

  const handleRetryMessage = async (message: LocalMessage) => {
    setLocalMessages((prev) =>
      prev.map((item) => (item.id === message.id ? { ...item, status: "sending" } : item)),
    )

    await sendLocalMessage(message, message.text ?? "", message.file ?? null)
  }

  const resolveFileType = (fileUrl: string) => {
    const lower = fileUrl.toLowerCase()
    if (/\.(png|jpe?g|gif|webp|bmp|svg)$/.test(lower)) return "image"
    if (/\.(mp4|webm|mov|ogg)$/.test(lower)) return "video"
    if (/\.(pdf)$/.test(lower)) return "pdf"
    return "file"
  }

  const decodeUnicodeEscapes = (value: string) => {
    if (!/\\u[0-9a-fA-F]{4}/.test(value)) return value
    return value.replace(/\\u([0-9a-fA-F]{4})/g, (_, code) => String.fromCharCode(Number.parseInt(code, 16)))
  }

  const renderMessageText = (text: string) => {
    const normalizedText = decodeUnicodeEscapes(text)
    const match = normalizedText.match(/^\*\*([\s\S]+)\*\*$/)
    if (match) {
      return <div className="whitespace-pre-wrap font-bold">{match[1]}</div>
    }
    return <div className="whitespace-pre-wrap">{normalizedText}</div>
  }

  const openMediaPreview = (fileUrl: string) => {
    const type = resolveFileType(fileUrl)
    if (type === "image" || type === "video") {
      setMediaPreview({ url: fileUrl, type })
    }
  }

  const statusLabel = (status: OrderStatus | undefined) => {
    switch (status) {
      case "CREATED":
        return "Ожидает оплату"
      case "IN_PROGRESS":
        return "Проверка"
      case "COMPLETED":
        return "Выполнен"
      case "CANCELED":
        return "Отменен"
      default:
        return "Неизвестно"
    }
  }

  const resolveMessageKind = (message: OrderMessage | LocalMessage) => {
    if ("isSystem" in message && message.isSystem) return "system"
    if (message.text?.startsWith("Системное событие:")) return "system"
    return message.senderRole
  }

  const formatCopyLine = (label: string, value?: string | number | null) => {
    if (!value) return null
    return `${label}: ${value}`
  }

  const copyText = async (text: string, successMessage = "Скопировано") => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (clipboardError) {
      const fallback = document.createElement("textarea")
      fallback.value = text
      fallback.setAttribute("readonly", "")
      fallback.style.position = "absolute"
      fallback.style.left = "-9999px"
      document.body.appendChild(fallback)
      fallback.select()
      document.execCommand("copy")
      document.body.removeChild(fallback)
      console.warn("Clipboard fallback", clipboardError)
    }

    showToast(successMessage, "success")
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("light")
  }

  const handleCopyAll = () => {
    if (!order) return

    const activeStep = steps[0]
    const lines = [
      formatCopyLine("Заявка", `#${order.id.slice(0, 6)}`),
      formatCopyLine("Сумма", `${order.totalRub.toLocaleString("ru-RU")} ₽ / ${order.totalCny.toFixed(2)} CNY`),
      formatCopyLine("Курс", `${order.rate.toFixed(2)} RUB`),
      formatCopyLine("Ник", order.contactUsername ? `@${order.contactUsername}` : null),
      formatCopyLine("Телефон", order.contactPhone),
      formatCopyLine("Alipay ID", order.alipayId),
      formatCopyLine("Банк", activeStep?.bankName),
      formatCopyLine("Реквизиты", activeStep?.requisiteValue),
    ]
      .filter(Boolean)
      .join("\n")

    void copyText(lines, "Реквизиты скопированы")
  }

  const handleCopyValue = (label: string, value?: string | number | null) => {
    if (!value) return
    void copyText(`${label}: ${value}`)
  }

  const handleOrderAction = (label: string) => {
    const systemText = `Системное событие: ${label}`
    void handleSend({ textOverride: systemText, isSystem: true })
  }

  const handleReceiptAction = (file: File | null) => {
    if (!file) return
    void handleSend({ textOverride: "Системное событие: Отправляю чек", fileOverride: file, isSystem: true })
  }

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div
      className="min-h-screen bg-slate-950 text-white"
      style={{ height: "var(--tg-viewport-height, 100vh)" }}
    >
      <main
        className={`mx-auto flex h-full w-full max-w-5xl flex-col px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] ${
          isTelegram ? "pt-[calc(4.5rem+env(safe-area-inset-top))]" : "pt-[calc(3.5rem+env(safe-area-inset-top))]"
        } transition-transform duration-200`}
        style={{ transform: `translateY(${pullOffset}px)`, willChange: "transform" }}
      >
        <header className="sticky top-[calc(env(safe-area-inset-top)+0.75rem)] z-30 space-y-3 rounded-2xl border border-orange-500/20 bg-slate-950/90 p-4 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-orange-200/70">Комната сделки</p>
              <h1 className="text-2xl font-semibold">
                {order ? `Ордер #${order.id.slice(0, 6)}` : "Загрузка ордера"}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-orange-500/20 text-orange-100">{statusLabel(order?.status)}</Badge>
              <div className="flex items-center gap-3 rounded-full border border-orange-500/30 bg-slate-900/80 px-3 py-2 text-xs text-orange-200">
                <span>{activeView === "chat" ? "Детали сделки" : "Вернуться в чат"}</span>
                <Switch
                  checked={activeView === "details"}
                  onCheckedChange={(checked) => setActiveView(checked ? "details" : "chat")}
                  className="data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-slate-700"
                  aria-label={activeView === "chat" ? "Открыть детали сделки" : "Вернуться в чат"}
                />
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-300">
            Общайтесь с оператором и быстро переключайтесь между чатом и деталями сделки.
          </p>
        </header>

        {!isTelegram && (
          <Card className="mt-6 border-amber-400/40 bg-amber-500/10 text-amber-100">
            <CardContent className="py-4 text-sm">
              Чтобы отправлять сообщения, откройте эту страницу в Telegram WebApp.
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="mt-4 border-red-500/40 bg-red-500/10 text-red-100">
            <CardContent className="py-4 text-sm">{error}</CardContent>
          </Card>
        )}

        <section className="mt-6 flex flex-1 flex-col gap-4 overflow-hidden">
          {activeView === "chat" ? (
            <div className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50">
              <div className="relative flex-1 overflow-hidden">
                <div
                  ref={chatContainerRef}
                  onScroll={handleChatScroll}
                  className="chat-scrollbar-hidden flex h-full flex-col gap-4 overflow-y-auto bg-slate-950/80 p-4 text-base leading-relaxed"
                >
                  {isLoading ? (
                    <div className="text-slate-400">Загрузка сообщений...</div>
                  ) : combinedMessages.length === 0 ? (
                    <div className="text-slate-400">Сообщений пока нет. Напишите администратору первым.</div>
                  ) : (
                    combinedMessages.map((message) => {
                      const kind = resolveMessageKind(message)
                      const isClient = kind === "client"
                      const isSystem = kind === "system"
                      const status = "status" in message ? message.status : "sent"
                      const isError = status === "error"
                      const showUnreadDivider = firstUnreadId && message.id === firstUnreadId

                      return (
                        <div key={message.id} ref={showUnreadDivider ? firstUnreadRef : null}>
                          {showUnreadDivider && unreadCount > 0 && (
                            <div className="my-2 flex items-center gap-3">
                              <span className="text-xs text-orange-200">Новые сообщения ({unreadCount})</span>
                              <div className="h-px flex-1 bg-orange-500/30" />
                            </div>
                          )}
                          <div
                            className={`flex ${
                              isSystem ? "justify-center" : isClient ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                                isSystem
                                  ? "bg-slate-800/70 text-slate-200"
                                  : isClient
                                    ? "bg-orange-500/20 text-orange-100"
                                    : "bg-slate-800 text-slate-100"
                              }`}
                            >
                              {message.text && renderMessageText(message.text)}
                              {message.fileUrl && (
                                <div className="mt-2 space-y-2">
                                  {resolveFileType(message.fileUrl) === "image" ? (
                                    <button
                                      type="button"
                                      onClick={() => openMediaPreview(message.fileUrl ?? "")}
                                      className="block"
                                    >
                                      <img
                                        src={message.fileUrl}
                                        alt="Вложение"
                                        className="max-h-48 rounded-md border transition hover:opacity-90"
                                      />
                                    </button>
                                  ) : resolveFileType(message.fileUrl) === "video" ? (
                                    <video src={message.fileUrl} controls className="max-h-48 w-full rounded-md border" />
                                  ) : (
                                    <a
                                      href={message.fileUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center text-orange-200 underline"
                                    >
                                      Открыть файл
                                    </a>
                                  )}
                                  <div className="flex flex-wrap gap-3 text-xs">
                                    {(resolveFileType(message.fileUrl) === "image" ||
                                      resolveFileType(message.fileUrl) === "video") && (
                                      <button
                                        type="button"
                                        onClick={() => openMediaPreview(message.fileUrl ?? "")}
                                        className="text-orange-200 underline"
                                      >
                                        Открыть
                                      </button>
                                    )}
                                    <a href={message.fileUrl} download className="text-orange-200 underline">
                                      Скачать
                                    </a>
                                  </div>
                                </div>
                              )}
                              <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-slate-400">
                                <span>
                                  {new Date(message.createdAt).toLocaleString("ru-RU", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                                {isClient && !isSystem && (
                                  <span className={isError ? "text-red-300" : "text-slate-400"}>
                                    {status === "sending" && "Отправляется"}
                                    {status === "sent" && "Отправлено"}
                                    {status === "error" && "Ошибка"}
                                  </span>
                                )}
                              </div>
                              {isError && "clientGeneratedId" in message && (
                                <button
                                  type="button"
                                  onClick={() => handleRetryMessage(message)}
                                  className="mt-2 text-xs text-orange-200 underline"
                                >
                                  Повторить отправку
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={bottomRef} />
                </div>
                <div className="pointer-events-none absolute right-2 top-3 h-[calc(100%-1.5rem)] w-1 rounded-full bg-slate-800/80">
                  <div
                    className="w-full rounded-full bg-orange-400"
                    style={{ height: "24%", transform: `translateY(${chatScrollRatio * 76}%)` }}
                  />
                </div>

                {!isChatPinnedToBottom && (
                  <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-orange-500 px-3 py-1 text-xs text-white">+{unreadCount}</span>
                    )}
                    <Button size="sm" onClick={scrollToBottom}>
                      ↓ Вниз
                    </Button>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 flex flex-col gap-2 border-t border-slate-800 bg-slate-900/90 px-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur">
                <div className="flex flex-wrap gap-2">
                  {QUICK_REPLIES.map((reply) => (
                    <button
                      key={reply}
                      type="button"
                      className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200"
                      onClick={() => {
                        setMessageText(reply)
                        messageInputRef.current?.focus()
                      }}
                      disabled={isChatReadOnly}
                    >
                      {reply}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    ref={messageInputRef}
                    value={messageText}
                    onChange={(event) => setMessageText(event.target.value)}
                    onFocus={() => window.Telegram?.WebApp?.expand()}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault()
                        void handleSend()
                      }
                    }}
                    placeholder="Напишите сообщение..."
                    className="border-slate-800 bg-slate-950 text-white"
                    disabled={isSending || isUploading || !initData || isChatReadOnly}
                  />
                  <label className="inline-flex">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(event) => setMessageFile(event.target.files?.[0] ?? null)}
                      className="hidden"
                      disabled={isSending || isUploading || !initData || isChatReadOnly}
                    />
                    <span className="inline-flex items-center justify-center rounded-md border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white">
                      📎
                    </span>
                  </label>
                  <Button
                    onClick={() => void handleSend()}
                    disabled={
                      isSending || isUploading || (!messageText.trim() && !messageFile) || !initData || isChatReadOnly
                    }
                  >
                    {isSending || isUploading ? "Отправка..." : "Отправить"}
                  </Button>
                </div>
                {messageFile && (
                  <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300">
                    {messageFilePreview && messageFile.type.startsWith("image/") && (
                      <img src={messageFilePreview} alt="Превью" className="h-10 w-10 rounded-md object-cover" />
                    )}
                    <span className="flex-1">{messageFile.name}</span>
                    <button
                      type="button"
                      className="text-orange-200 underline"
                      onClick={() => setMessageFile(null)}
                    >
                      Удалить
                    </button>
                  </div>
                )}
                {isChatReadOnly && (
                  <div className="text-xs text-slate-400">Сделка закрыта, чат доступен только для просмотра.</div>
                )}
                <div className="text-xs text-slate-500">
                  Если нужно выйти, вернитесь на главный экран мини-приложения.
                  <button
                    type="button"
                    className="ml-2 text-orange-300 underline-offset-2 hover:underline"
                    onClick={() => router.push("/telegram-mini-app")}
                  >
                    Вернуться назад
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900/60 p-4">
              <Card className="border-orange-500/30 bg-slate-950/80">
                <CardHeader>
                  <CardTitle className="text-lg text-orange-200">Детали сделки</CardTitle>
                  <CardDescription className="text-slate-400">
                    Реквизиты появятся только после отправки администратором.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
                      <span>Сумма</span>
                      <span className="text-slate-200">
                        {order ? `${order.totalRub.toLocaleString("ru-RU")} ₽` : "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
                      <span>Сумма (CNY)</span>
                      <span className="text-slate-200">{order ? `${order.totalCny.toFixed(2)} CNY` : "—"}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
                      <span>Курс</span>
                      <span className="text-slate-200">{order ? `${order.rate.toFixed(2)} RUB` : "—"}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
                      <span>Ник</span>
                      <span className="text-slate-200">{order?.contactUsername ? `@${order.contactUsername}` : "—"}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
                      <span>Телефон</span>
                      <span className="text-slate-200">{order?.contactPhone ?? "—"}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
                      <span>Alipay ID</span>
                      <span className="text-slate-200">{order?.alipayId ?? "—"}</span>
                    </div>
                  </div>

                  {steps[0] ? (
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
                        <span>Банк</span>
                        <div className="flex items-center gap-2 text-slate-200">
                          <span>{steps[0].bankName}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-orange-400/40 text-orange-200"
                            onClick={() => handleCopyValue("Банк", steps[0].bankName)}
                          >
                            Копировать
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
                        <span>Реквизиты</span>
                        <div className="flex items-center gap-2 text-slate-200">
                          <span className="break-all">{steps[0].requisiteValue}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-orange-400/40 text-orange-200"
                            onClick={() => handleCopyValue("Реквизиты", steps[0].requisiteValue)}
                          >
                            Копировать
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
                        <span>Email для чека</span>
                        <div className="flex items-center gap-2 text-slate-200">
                          <span>{steps[0].receiptEmail}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-orange-400/40 text-orange-200"
                            onClick={() => handleCopyValue("Email для чека", steps[0].receiptEmail)}
                          >
                            Копировать
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-orange-400/40 bg-orange-500/10 px-4 py-3 text-sm text-orange-100">
                      Реквизиты появятся после того, как администратор отправит их в чате.
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      className="border-orange-400/40 text-orange-200"
                      onClick={handleCopyAll}
                      disabled={!steps[0]}
                    >
                      Скопировать все
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-700 text-slate-100"
                      onClick={() => handleOrderAction("Я оплатил")}
                      disabled={isChatReadOnly}
                    >
                      Я оплатил
                    </Button>
                    <label className="inline-flex">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={(event) => handleReceiptAction(event.target.files?.[0] ?? null)}
                        disabled={isChatReadOnly}
                      />
                      <span className="inline-flex items-center rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-100">
                        Отправить чек
                      </span>
                    </label>
                    <Button
                      variant="outline"
                      className="border-slate-700 text-slate-100"
                      onClick={() => handleOrderAction("Позвать оператора")}
                      disabled={isChatReadOnly}
                    >
                      Позвать оператора
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </section>
      </main>

      {toast && (
        <div className="pointer-events-none fixed bottom-[calc(2.5rem+env(safe-area-inset-bottom))] left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900/90 px-4 py-2 text-xs text-slate-100 shadow-lg">
          {toast.message}
        </div>
      )}

      <Dialog open={!!mediaPreview} onOpenChange={(open) => !open && setMediaPreview(null)}>
        <DialogContent className="max-w-3xl bg-slate-950 text-white">
          <DialogHeader>
            <DialogTitle>Просмотр вложения</DialogTitle>
          </DialogHeader>
          {mediaPreview?.type === "image" ? (
            <img src={mediaPreview.url} alt="Вложение" className="max-h-[70vh] w-full rounded-md object-contain" />
          ) : mediaPreview?.type === "video" ? (
            <video src={mediaPreview.url} controls className="max-h-[70vh] w-full rounded-md" />
          ) : null}
          {mediaPreview && (
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <a href={mediaPreview.url} target="_blank" rel="noreferrer" className="text-orange-200 underline">
                Открыть в новой вкладке
              </a>
              <a href={mediaPreview.url} download className="text-orange-200 underline">
                Скачать
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
