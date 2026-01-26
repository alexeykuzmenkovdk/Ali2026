"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useTelegramSwipeDownGuard } from "@/lib/telegram-swipe-guard"

type OrderStatus = "CREATED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED"

interface Order {
  id: string
  status: OrderStatus
  totalRub: number
  totalCny: number
  rate: number
  createdAt: string
}

interface OrderMessage {
  id: string
  senderRole: "client" | "admin"
  text?: string
  fileUrl?: string
  createdAt: string
}

export default function DealRoomPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = useMemo(() => (typeof params.orderId === "string" ? params.orderId : ""), [params.orderId])

  const [initData, setInitData] = useState("")
  const [isTelegram, setIsTelegram] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [messages, setMessages] = useState<OrderMessage[]>([])
  const [messageText, setMessageText] = useState("")
  const [messageFile, setMessageFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mediaPreview, setMediaPreview] = useState<{ url: string; type: "image" | "video" } | null>(null)

  const chatContainerRef = useRef<HTMLDivElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const [isChatPinnedToBottom, setIsChatPinnedToBottom] = useState(true)

  useEffect(() => {
    const telegramWebApp = window.Telegram?.WebApp
    if (telegramWebApp) {
      telegramWebApp.ready()
      telegramWebApp.expand()
      try {
        telegramWebApp.requestFullscreen?.()
      } catch (error) {
        console.warn("Не удалось запросить fullscreen в Telegram WebApp", error)
      }
      telegramWebApp.enableClosingConfirmation?.()
      setIsTelegram(true)
      setInitData(telegramWebApp.initData)
      return () => {
        telegramWebApp.disableClosingConfirmation?.()
      }
    }
    setIsTelegram(false)
    setInitData("")
  }, [])

  const pullOffset = useTelegramSwipeDownGuard(isTelegram)

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
    setMessages(data.messages ?? [])
  }

  const fetchMessages = async (activeOrderId: string, initDataHeader: string) => {
    const response = await fetch(`/api/orders/${activeOrderId}/messages`, {
      headers: {
        "x-telegram-init-data": initDataHeader,
      },
    })

    if (!response.ok) return
    const data = await response.json()
    setMessages(data.messages ?? [])
  }

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

  const isChatReadOnly = order ? order.status === "COMPLETED" || order.status === "CANCELED" : false

  useEffect(() => {
    if (!initData || !orderId || isChatReadOnly) return
    const interval = window.setInterval(() => {
      fetchMessages(orderId, initData).catch(() => null)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [initData, orderId, isChatReadOnly])

  const handleChatScroll = () => {
    const container = chatContainerRef.current
    if (!container) return
    const threshold = 80
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight
    setIsChatPinnedToBottom(distanceFromBottom < threshold)
  }

  useEffect(() => {
    if (!isChatPinnedToBottom) return
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isChatPinnedToBottom])

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

  const handleSend = async () => {
    if (!initData || !orderId || isChatReadOnly) return
    const trimmedText = messageText.trim()
    if (!trimmedText && !messageFile) return
    setIsSending(true)

    try {
      let fileUrl: string | undefined
      if (messageFile) {
        setIsUploading(true)
        fileUrl = await uploadMessageFile(messageFile)
      }
      const response = await fetch(`/api/orders/${orderId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-telegram-init-data": initData,
        },
        body: JSON.stringify({ text: trimmedText || undefined, fileUrl }),
      })

      if (!response.ok) {
        throw new Error("Не удалось отправить сообщение.")
      }

      setMessageText("")
      setMessageFile(null)
      await fetchMessages(orderId, initData)
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Не удалось отправить сообщение.")
    } finally {
      setIsSending(false)
      setIsUploading(false)
    }
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
        return "Создана"
      case "IN_PROGRESS":
        return "В работе"
      case "COMPLETED":
        return "Завершена"
      case "CANCELED":
        return "Отменена"
      default:
        return "Неизвестно"
    }
  }

  return (
    <div className="min-h-screen overscroll-none bg-slate-950 text-white">
      <main
        className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 pb-8 pt-[calc(5.5rem+env(safe-area-inset-top))] transition-transform duration-200"
        style={{ transform: `translateY(${pullOffset}px)`, willChange: "transform" }}
      >
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-950 to-emerald-500/10 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Комната сделки</p>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">P2P-сделка открыта</h1>
            <p className="text-slate-300">Общайтесь с админом и отслеживайте статус заявки в реальном времени.</p>
          </div>
          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
              <div className="text-slate-400">Статус</div>
              <div className="text-lg font-semibold text-emerald-300">
                {order ? statusLabel(order.status) : "Загрузка"}
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
              <div className="text-slate-400">Номер заявки</div>
              <div className="text-lg font-semibold text-white">{order ? `#${order.id.slice(0, 6)}` : "—"}</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
              <div className="text-slate-400">Чат</div>
              <div className="text-lg font-semibold text-white">С админом</div>
            </div>
          </div>
        </div>

        {!isTelegram && (
          <Card className="border-amber-400/40 bg-amber-500/10 text-amber-100">
            <CardContent className="py-4 text-sm">
              Чтобы отправлять сообщения, откройте эту страницу в Telegram WebApp.
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-red-500/40 bg-red-500/10 text-red-100">
            <CardContent className="py-4 text-sm">{error}</CardContent>
          </Card>
        )}

        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-lg">Детали сделки</CardTitle>
            <CardDescription className="text-slate-400">
              {order ? `Заявка #${order.id.slice(0, 6)} • статус: ${statusLabel(order.status)}` : "Загрузка данных"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
              <span>Сумма в рублях</span>
              <span className="text-slate-200">{order ? `${order.totalRub.toLocaleString("ru-RU")} ₽` : "—"}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
              <span>Сумма в юанях</span>
              <span className="text-slate-200">{order ? `${order.totalCny.toFixed(2)} CNY` : "—"}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
              <span>Курс</span>
              <span className="text-slate-200">{order ? `${order.rate.toFixed(2)} RUB` : "—"}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-1 flex-col border-slate-800 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-lg">Чат сделки</CardTitle>
            <CardDescription className="text-slate-400">
              Сообщения синхронизируются с админ-панелью, оператор видит вашу заявку.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <div
              ref={chatContainerRef}
              onScroll={handleChatScroll}
              className="flex-1 min-h-[50vh] max-h-[70vh] space-y-4 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 p-4 text-base leading-relaxed sm:min-h-[55vh] lg:min-h-[60vh]"
            >
              {isLoading ? (
                <div className="text-slate-400">Загрузка сообщений...</div>
              ) : messages.length === 0 ? (
                <div className="text-slate-400">Сообщений пока нет. Напишите администратору первым.</div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderRole === "client" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.senderRole === "client"
                          ? "bg-emerald-500/20 text-emerald-100"
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
                              className="inline-flex items-center text-emerald-200 underline"
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
                                className="text-emerald-200 underline"
                              >
                                Открыть
                              </button>
                            )}
                            <a href={message.fileUrl} download className="text-emerald-200 underline">
                              Скачать
                            </a>
                          </div>
                        </div>
                      )}
                      <div className="mt-1 text-[10px] text-slate-400">
                        {new Date(message.createdAt).toLocaleString("ru-RU", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Напишите сообщение..."
                className="border-slate-800 bg-slate-950 text-white"
                disabled={isSending || isUploading || !initData || isChatReadOnly}
              />
              <Input
                type="file"
                accept="image/*,video/*,application/pdf"
                onChange={(event) => setMessageFile(event.target.files?.[0] ?? null)}
                className="border-slate-800 bg-slate-950 text-white file:text-white"
                disabled={isSending || isUploading || !initData || isChatReadOnly}
              />
              <Button
                onClick={handleSend}
                disabled={
                  isSending || isUploading || (!messageText.trim() && !messageFile) || !initData || isChatReadOnly
                }
              >
                {isSending || isUploading ? "Отправка..." : "Отправить"}
              </Button>
            </div>
            {messageFile && (
              <div className="text-xs text-slate-400">Прикреплено: {messageFile.name}</div>
            )}
            {isChatReadOnly && (
              <div className="text-xs text-slate-400">Сделка закрыта, чат доступен только для просмотра.</div>
            )}
            <div className="text-xs text-slate-500">
              Если нужно выйти, вернитесь на главный экран мини-приложения.
              <button
                type="button"
                className="ml-2 text-emerald-300 underline-offset-2 hover:underline"
                onClick={() => router.push("/telegram-mini-app")}
              >
                Вернуться назад
              </button>
            </div>
          </CardContent>
        </Card>
      </main>

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
              <a
                href={mediaPreview.url}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-200 underline"
              >
                Открыть в новой вкладке
              </a>
              <a href={mediaPreview.url} download className="text-emerald-200 underline">
                Скачать
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
