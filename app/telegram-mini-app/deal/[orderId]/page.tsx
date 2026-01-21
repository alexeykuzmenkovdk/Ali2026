"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
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

interface PaymentStep {
  id: string
  status: "WAITING_FOR_DETAILS" | "WAITING_FOR_PAYMENT" | "PAID" | "VERIFIED" | "CANCELED"
  amountRub: number
  method: "CARD" | "SBP"
  requisiteValue: string
  bankName: string
  receiptEmail: string
}

export default function DealRoomPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = useMemo(() => (typeof params.orderId === "string" ? params.orderId : ""), [params.orderId])

  const [initData, setInitData] = useState("")
  const [isTelegram, setIsTelegram] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [messages, setMessages] = useState<OrderMessage[]>([])
  const [steps, setSteps] = useState<PaymentStep[]>([])
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
    setSteps(data.steps ?? [])
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

  const stepStatusLabel = (status: PaymentStep["status"] | undefined) => {
    switch (status) {
      case "WAITING_FOR_DETAILS":
        return "Ожидаем реквизиты"
      case "WAITING_FOR_PAYMENT":
        return "Ожидаем оплату"
      case "PAID":
        return "Оплачено"
      case "VERIFIED":
        return "Подтверждено"
      case "CANCELED":
        return "Отменено"
      default:
        return "Неизвестно"
    }
  }

  const primaryStep = steps[0]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-widest text-slate-400">Комната сделки</p>
            <h1 className="text-3xl font-semibold">Сделка P2P</h1>
            <p className="text-slate-300">Ведите переписку с администратором и отслеживайте статус заявки.</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-slate-200">
            <span>Статус</span>
            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-200">
              {order ? statusLabel(order.status) : "Загрузка"}
            </Badge>
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

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
          <div className="space-y-6">
            <Card className="border-slate-800 bg-slate-900/60">
              <CardHeader>
                <CardTitle className="text-lg">Детали сделки</CardTitle>
                <CardDescription className="text-slate-400">
                  {order ? `Заявка #${order.id.slice(0, 6)}` : "Загрузка данных"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Сумма к оплате</span>
                    <span className="text-base font-semibold text-white">
                      {order ? `${order.totalRub.toLocaleString("ru-RU")} ₽` : "—"}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Получаете</span>
                    <span>{order ? `${order.totalCny.toFixed(2)} CNY` : "—"}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                    <span>Курс</span>
                    <span>{order ? `${order.rate.toFixed(2)} RUB` : "—"}</span>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-xs text-slate-400">Партнер</div>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <span>Администратор</span>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-200">
                      Онлайн
                    </Badge>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-xs text-slate-400">Реквизиты оплаты</div>
                  {primaryStep ? (
                    <div className="mt-2 space-y-2 text-sm text-slate-200">
                      <div className="flex items-center justify-between">
                        <span>{primaryStep.bankName}</span>
                        <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-200">
                          {stepStatusLabel(primaryStep.status)}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-400">{primaryStep.requisiteValue}</div>
                      <div className="text-xs text-slate-500">
                        Метод: {primaryStep.method === "SBP" ? "СБП" : "Карта"}
                      </div>
                      <div className="text-xs text-slate-500">Чек: {primaryStep.receiptEmail}</div>
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-slate-500">
                      Реквизиты появятся после подтверждения заявки.
                    </div>
                  )}
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-400">
                  После оплаты нажмите «Отправить» в чате, чтобы подтвердить перевод. Мы ответим в течение нескольких
                  минут.
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/60">
              <CardHeader>
                <CardTitle className="text-lg">Навигация</CardTitle>
                <CardDescription className="text-slate-400">Быстрые действия по заявке.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => navigator.clipboard.writeText(order?.id ?? "")} disabled={!order}>
                  Скопировать номер
                </Button>
                <Button variant="outline" onClick={() => router.push("/telegram-mini-app")}>
                  Вернуться к расчету
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="border-slate-800 bg-slate-900/60">
            <CardHeader>
              <CardTitle className="text-lg">Чат сделки</CardTitle>
              <CardDescription className="text-slate-400">
                Как в P2P: быстрые ответы, статус и история переписки.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-[440px] space-y-3 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm">
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
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          message.senderRole === "client"
                            ? "bg-emerald-500/20 text-emerald-100"
                            : "bg-slate-800 text-slate-100"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.text}</div>
                        <div className="mt-1 text-[10px] text-slate-400">
                          {message.senderRole === "client" ? "Вы" : "Админ"} •{" "}
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
                Если чат не обновляется, подождите 5 секунд или отправьте новое сообщение.
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
