"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { getMarkupForAmount } from "@/lib/exchange-config"
import { Badge } from "@/components/ui/badge"

interface ExchangeRateData {
  rate: string
  baseRate: string
  isManual: boolean
  timestamp: string
}

interface Order {
  id: string
  userId: number
  status: string
  totalRub: number
  totalCny: number
  rate: number
  createdAt: string
  updatedAt: string
}

interface PaymentStep {
  id: string
  orderId: string
  stepIndex: number
  status: string
  amountRub: number
  method: string
  requisiteValue: string
  bankName: string
  receiptEmail: string
  receiptFileUrl?: string
  createdAt: string
  updatedAt: string
}

interface OrderMessage {
  id: string
  senderRole: "client" | "admin"
  text?: string
  fileUrl?: string
  createdAt: string
}

const STATUS_LABELS: Record<string, string> = {
  CREATED: "Создана",
  IN_PROGRESS: "В работе",
  COMPLETED: "Завершена",
  CANCELED: "Отменена",
}

const STEP_STATUS_LABELS: Record<string, string> = {
  WAITING_FOR_DETAILS: "Ожидаем реквизиты",
  WAITING_FOR_PAYMENT: "Ожидаем оплату",
  PAID: "Оплачено",
  VERIFIED: "Подтверждено",
  CANCELED: "Отменено",
}

export default function TelegramMiniAppPage() {
  const [isTelegram, setIsTelegram] = useState(false)
  const [initData, setInitData] = useState("")
  const [userLabel, setUserLabel] = useState("Гость")

  const [amount, setAmount] = useState<string>("1000")
  const [result, setResult] = useState<number | null>(null)
  const [exchangeRate, setExchangeRate] = useState<number>(12.5)
  const [baseRate, setBaseRate] = useState<number>(12.5)
  const [manualRate, setManualRate] = useState<number | null>(null)
  const [isManual, setIsManual] = useState<boolean>(false)
  const [isRateLoading, setIsRateLoading] = useState<boolean>(false)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  const [contactPhone, setContactPhone] = useState("")
  const [order, setOrder] = useState<Order | null>(null)
  const [orderSteps, setOrderSteps] = useState<PaymentStep[]>([])
  const [orderMessages, setOrderMessages] = useState<OrderMessage[]>([])
  const [orderMessageText, setOrderMessageText] = useState("")
  const [orderError, setOrderError] = useState<string | null>(null)
  const [isOrderLoading, setIsOrderLoading] = useState(false)
  const [isMessageSending, setIsMessageSending] = useState(false)

  const mountedRef = useRef(true)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const orderNumber = useMemo(() => (order?.id ? `#${order.id.slice(0, 6)}` : "—"), [order])
  const initDataHeader = useMemo(() => {
    if (!initData) return ""
    const encoded = encodeURIComponent(initData)
    try {
      new Headers({ "x-telegram-init-data": encoded })
      return encoded
    } catch (error) {
      console.warn("[Telegram] Failed to set initData header, fallback to base64", error)
      const base64Value = typeof window !== "undefined" ? window.btoa(unescape(encodeURIComponent(initData))) : ""
      return base64Value ? `base64:${base64Value}` : encoded
    }
  }, [initData])

  useEffect(() => {
    return () => {
      mountedRef.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const telegramWebApp = window.Telegram?.WebApp
    if (telegramWebApp) {
      telegramWebApp.ready()
      setIsTelegram(true)
      setInitData(telegramWebApp.initData)
      const user = telegramWebApp.initDataUnsafe?.user
      if (user?.username) {
        setUserLabel(`@${user.username}`)
      } else if (user?.first_name) {
        setUserLabel(user.first_name)
      }
      return
    }

    setIsTelegram(false)
    setUserLabel("Гость")
  }, [])

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        setIsRateLoading(true)
        const response = await fetch(`/api/exchange-rate?nocache=${Date.now()}`)
        const data: ExchangeRateData = await response.json()

        if (!mountedRef.current) return

        if (response.ok) {
          const rate = Number.parseFloat(data.rate)
          const parsedBaseRate = Number.parseFloat(data.baseRate || data.rate)

          setExchangeRate(rate)
          setLastUpdated(data.timestamp)
          setIsManual(data.isManual)
          setBaseRate(!isNaN(parsedBaseRate) ? parsedBaseRate : rate)
          setManualRate(data.isManual && !isNaN(rate) ? rate : null)
        }
      } catch (error) {
        console.error("Ошибка при загрузке курса:", error)
      } finally {
        if (mountedRef.current) {
          setIsRateLoading(false)
        }
      }
    }

    fetchExchangeRate()
  }, [])

  const getRateForAmount = (amountNum: number) => {
    if (isManual && manualRate) {
      return manualRate
    }

    if (!baseRate || isNaN(baseRate)) {
      return exchangeRate
    }

    const approximateYuan = amountNum / baseRate
    const markup = getMarkupForAmount(approximateYuan)
    return baseRate + markup
  }

  const recalculate = (amountValue: string) => {
    if (!amountValue || amountValue === "") {
      setResult(null)
      return
    }

    const amountNum = Number.parseFloat(amountValue)
    if (!isNaN(amountNum) && amountNum > 0) {
      const finalRate = getRateForAmount(amountNum)
      setExchangeRate(finalRate)
      setResult(amountNum / finalRate)
    } else {
      setResult(null)
    }
  }

  useEffect(() => {
    if (amount) {
      recalculate(amount)
    }
  }, [baseRate, manualRate, isManual])

  const handleAmountChange = (value: string) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, "")
    const parts = sanitizedValue.split(".")
    if (parts.length > 2) {
      return
    }

    setAmount(sanitizedValue)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      if (mountedRef.current) {
        if (!sanitizedValue || sanitizedValue === "") {
          setResult(null)
          return
        }

        recalculate(sanitizedValue)
      }
    }, 300)
  }

  const formatDate = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "Неизвестно"
    }
  }

  const loadActiveOrder = async () => {
    if (!initData) return
    setIsOrderLoading(true)
    try {
      const response = await fetch("/api/orders/active", {
        headers: {
          "x-telegram-init-data": initDataHeader,
        },
      })
      const data = await response.json()
      if (!response.ok) {
        setOrderError(data.error || "Не удалось получить активную заявку")
        return
      }

      if (data.order) {
        setOrder(data.order)
        setOrderSteps(data.steps ?? [])
        setOrderMessages(data.messages ?? [])
      }
    } catch (error) {
      setOrderError(error instanceof Error ? error.message : "Не удалось получить активную заявку")
    } finally {
      setIsOrderLoading(false)
    }
  }

  useEffect(() => {
    if (!initData) return
    loadActiveOrder()
  }, [initData])

  useEffect(() => {
    if (!order?.id || !initData) return

    const refreshMessages = async () => {
      try {
        const response = await fetch(`/api/orders/${order.id}/messages`, {
          headers: { "x-telegram-init-data": initDataHeader },
        })
        const data = await response.json()
        if (response.ok) {
          setOrderMessages(data.messages ?? [])
        }
      } catch (error) {
        console.error("Ошибка обновления сообщений:", error)
      }
    }

    refreshMessages()
    const interval = window.setInterval(refreshMessages, 5000)
    return () => window.clearInterval(interval)
  }, [order?.id, initData, initDataHeader])

  const handleCreateOrder = async () => {
    setOrderError(null)
    if (!initData) {
      setOrderError("Откройте мини-приложение в Telegram для подачи заявки.")
      return
    }

    if (!result || !amount) {
      setOrderError("Укажите сумму для расчета.")
      return
    }

    setIsOrderLoading(true)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-telegram-init-data": initDataHeader,
        },
        body: JSON.stringify({
          totalRub: Number.parseFloat(amount),
          totalCny: Number.parseFloat(result.toFixed(2)),
          rate: exchangeRate,
          contactPhone: contactPhone.trim() || undefined,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        if (response.status === 409) {
          await loadActiveOrder()
          return
        }
        setOrderError(data.error || "Не удалось создать заявку")
        return
      }

      setOrder(data.order)
      setOrderSteps(data.steps ?? [])
      setOrderMessages(data.messages ?? [])
    } catch (error) {
      setOrderError(error instanceof Error ? error.message : "Не удалось создать заявку")
    } finally {
      setIsOrderLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!order?.id || !orderMessageText.trim()) return
    if (!initData) {
      setOrderError("Откройте мини-приложение в Telegram для отправки сообщения.")
      return
    }

    setIsMessageSending(true)
    setOrderError(null)

    try {
      const response = await fetch(`/api/orders/${order.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-telegram-init-data": initDataHeader,
        },
        body: JSON.stringify({ text: orderMessageText.trim() }),
      })
      const data = await response.json()
      if (!response.ok) {
        setOrderError(data.error || "Не удалось отправить сообщение")
        return
      }

      setOrderMessages((prev) => [...prev, data.message])
      setOrderMessageText("")
    } catch (error) {
      setOrderError(error instanceof Error ? error.message : "Не удалось отправить сообщение")
    } finally {
      setIsMessageSending(false)
    }
  }

  const exchangeRates = useMemo(() => {
    return [
      { range: "До 500 CNY", rate: (baseRate + 0.96).toFixed(2) },
      { range: "500–1999 CNY", rate: (baseRate + 0.84).toFixed(2) },
      { range: "2000–5999 CNY", rate: (baseRate + 0.8).toFixed(2) },
      { range: "От 6000 CNY", rate: (baseRate + 0.73).toFixed(2) },
    ]
  }, [baseRate])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-widest text-slate-400">Telegram Mini App</p>
          <h1 className="text-3xl font-semibold">Комната сделки</h1>
          <p className="text-slate-300">
            Обменивайте юани, отправляйте заявку и общайтесь с оператором в одном окне.
          </p>
        </div>

        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-lg">Статус подключения</CardTitle>
            <CardDescription className="text-slate-400">
              Проверяем, что мини-приложение открыто в Telegram WebApp.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
              <span>Среда запуска</span>
              <span className={isTelegram ? "text-emerald-400" : "text-amber-400"}>
                {isTelegram ? "Telegram WebApp" : "Обычный браузер"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
              <span>Пользователь</span>
              <span className="text-slate-200">{userLabel}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
              <span>InitData</span>
              <span className="text-slate-200">{initData ? `${initData.length} символов` : "нет"}</span>
            </div>
          </CardContent>
        </Card>

        {order && (
          <Card className="border-emerald-500/40 bg-emerald-500/10">
            <CardContent className="flex flex-col gap-2 py-4 text-sm text-emerald-100">
              <div className="flex items-center justify-between">
                <span>Активная заявка</span>
                <Badge className="bg-emerald-500/20 text-emerald-100" variant="outline">
                  {orderNumber}
                </Badge>
              </div>
              <div className="text-xs text-emerald-100/80">
                Статус: {STATUS_LABELS[order.status] ?? order.status}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-lg">Подать заявку</CardTitle>
            <CardDescription className="text-slate-400">
              Заполните сумму и отправьте заявку — она сразу появится в админ-панели.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Текущий курс</span>
                <span className="text-emerald-300">1 CNY = {exchangeRate.toFixed(2)} RUB</span>
              </div>
              {!isManual && (
                <div className="mt-2 text-xs text-slate-400">Базовый курс ЦБ: {baseRate.toFixed(2)} RUB</div>
              )}
              <div className="mt-1 text-xs text-slate-500">
                {isManual ? "Ручной курс" : "Автоматический курс"} • Обновлено: {lastUpdated ? formatDate(lastUpdated) : "Загрузка..."}
              </div>
            </div>

            {!isManual && (
              <div className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-slate-300">
                <div className="mb-2 text-slate-400">Курсы по диапазонам:</div>
                <div className="grid gap-1">
                  {exchangeRates.map((tier) => (
                    <div key={tier.range} className="flex items-center justify-between">
                      <span>{tier.range}</span>
                      <span>1 CNY = {tier.rate} RUB</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm text-slate-300" htmlFor="rub-amount">
                Сумма в рублях
              </Label>
              <Input
                id="rub-amount"
                className="border-slate-800 bg-slate-950 text-white"
                value={amount}
                onChange={(event) => handleAmountChange(event.target.value)}
                placeholder="Введите сумму"
                disabled={isRateLoading}
              />
            </div>

            {result !== null && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                Вы получите: <span className="font-semibold">{result.toFixed(2)} CNY</span>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm text-slate-300" htmlFor="contact-phone">
                Контактный телефон (необязательно)
              </Label>
              <Input
                id="contact-phone"
                className="border-slate-800 bg-slate-950 text-white"
                value={contactPhone}
                onChange={(event) => setContactPhone(event.target.value)}
                placeholder="+7 900 000-00-00"
              />
            </div>

            {orderError && <p className="text-sm text-rose-300">{orderError}</p>}

            <Button
              className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400"
              onClick={handleCreateOrder}
              disabled={isOrderLoading || !amount || !result || isRateLoading}
            >
              {isOrderLoading ? "Создаем заявку..." : "Подать заявку"}
            </Button>

            {!isTelegram && (
              <p className="text-xs text-amber-300">
                Для создания заявки откройте мини-приложение в Telegram — иначе запрос не пройдет проверку.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-lg">Комната ордера</CardTitle>
            <CardDescription className="text-slate-400">
              Здесь можно всегда вернуться к заявке и продолжить диалог до исполнения.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!order ? (
              <div className="text-sm text-slate-400">
                Активной заявки нет. Создайте заявку в форме выше, чтобы открыть комнату сделки.
              </div>
            ) : (
              <>
                  <div className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-xs text-slate-400">Заявка {orderNumber}</div>
                        <div className="mt-1 text-lg font-semibold">{order.totalRub.toLocaleString("ru-RU")} ₽</div>
                      </div>
                      <Badge variant="outline" className="border-emerald-400/50 text-emerald-200">
                        {STATUS_LABELS[order.status] ?? order.status}
                      </Badge>
                    </div>
                    <div className="mt-3 grid gap-2 text-xs text-slate-400 md:grid-cols-2">
                      <div>Сумма в CNY: {order.totalCny.toFixed(2)}</div>
                      <div>Курс: {order.rate.toFixed(2)} RUB</div>
                      <div>Создана: {formatDate(order.createdAt)}</div>
                      <div>Обновлена: {formatDate(order.updatedAt)}</div>
                    </div>
                  </div>

                  {orderSteps.length > 0 && (
                    <div className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-slate-300">
                      <div className="mb-2 text-slate-400">Этапы оплаты</div>
                      <div className="space-y-2">
                        {orderSteps.map((step) => (
                          <div key={step.id} className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              Этап {step.stepIndex}: {step.amountRub.toLocaleString("ru-RU")} ₽
                            </div>
                            <Badge variant="outline" className="border-slate-600 text-slate-200">
                              {STEP_STATUS_LABELS[step.status] ?? step.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-3">
                    <div className="mb-3 text-sm text-slate-300">Сообщения по заявке</div>
                    <div className="max-h-[320px] space-y-3 overflow-y-auto pr-1 text-sm">
                      {orderMessages.length === 0 ? (
                        <div className="text-slate-400">Сообщений пока нет.</div>
                      ) : (
                        orderMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`rounded-lg px-3 py-2 ${
                              message.senderRole === "admin"
                                ? "ml-auto w-fit bg-emerald-500/20 text-emerald-100"
                                : "mr-auto w-fit bg-slate-800 text-slate-200"
                            }`}
                          >
                            <div className="text-xs text-slate-400">
                              {message.senderRole === "admin" ? "Оператор" : "Вы"} · {formatDate(message.createdAt)}
                            </div>
                            <div className="mt-1 whitespace-pre-wrap">{message.text ?? "—"}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-slate-300" htmlFor="order-message">
                      Написать в комнату ордера
                    </Label>
                    <Textarea
                      id="order-message"
                      className="border-slate-800 bg-slate-950 text-white"
                      value={orderMessageText}
                      onChange={(event) => setOrderMessageText(event.target.value)}
                      placeholder="Опишите детали или задайте вопрос"
                    />
                    {orderError && <p className="text-sm text-rose-300">{orderError}</p>}
                    <Button
                      className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                      onClick={handleSendMessage}
                      disabled={isMessageSending || !orderMessageText.trim()}
                    >
                      {isMessageSending ? "Отправляем..." : "Отправить сообщение"}
                    </Button>
                  </div>
                </>
              )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
