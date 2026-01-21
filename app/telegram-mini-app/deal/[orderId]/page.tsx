"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const telegramWebApp = window.Telegram?.WebApp
    if (telegramWebApp) {
      telegramWebApp.ready()
      setIsTelegram(true)
      setInitData(telegramWebApp.initData)
      return
    }
    setIsTelegram(false)
    setInitData("")
  }, [])

  const fetchActiveOrder = async (activeOrderId: string, initDataHeader: string) => {
    const response = await fetch("/api/orders/active", {
      headers: {
        "x-telegram-init-data": initDataHeader,
      },
    })

    if (!response.ok) {
      throw new Error("Не удалось загрузить данные заявки.")
    }

    const data = await response.json()
    if (!data.order) {
      throw new Error("Активная заявка не найдена.")
    }

    if (data.order.id !== activeOrderId) {
      throw new Error("Неверный номер заявки.")
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
        await fetchActiveOrder(orderId, initData)
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
    if (!initData || !orderId) return
    const interval = window.setInterval(() => {
      fetchMessages(orderId, initData).catch(() => null)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [initData, orderId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!messageText.trim() || !initData || !orderId) return
    setIsSending(true)

    try {
      const response = await fetch(`/api/orders/${orderId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-telegram-init-data": initData,
        },
        body: JSON.stringify({ text: messageText.trim() }),
      })

      if (!response.ok) {
        throw new Error("Не удалось отправить сообщение.")
      }

      setMessageText("")
      await fetchMessages(orderId, initData)
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Не удалось отправить сообщение.")
    } finally {
      setIsSending(false)
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
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-widest text-slate-400">Комната сделки</p>
          <h1 className="text-3xl font-semibold">Чат по заявке</h1>
          <p className="text-slate-300">Ведите переписку с администратором прямо в мини-приложении.</p>
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
            <CardTitle className="text-lg">Данные заявки</CardTitle>
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

        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-lg">Переписка</CardTitle>
            <CardDescription className="text-slate-400">
              Сообщения синхронизируются с админ-панелью и Telegram-ботом.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-[360px] space-y-3 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm">
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
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        message.senderRole === "client"
                          ? "bg-emerald-500/20 text-emerald-100"
                          : "bg-slate-800 text-slate-100"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.text}</div>
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
                placeholder="Напишите сообщение..."
                className="border-slate-800 bg-slate-950 text-white"
                disabled={isSending || !initData}
              />
              <Button onClick={handleSend} disabled={isSending || !messageText.trim() || !initData}>
                {isSending ? "Отправка..." : "Отправить"}
              </Button>
            </div>
            <div className="text-xs text-slate-500">
              Если нужно закрыть комнату, вернитесь в каталог услуг.
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
    </div>
  )
}
