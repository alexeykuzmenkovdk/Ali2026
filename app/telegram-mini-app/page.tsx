"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMarkupForAmount } from "@/lib/exchange-config"
import { MiniAppOrderFormModal } from "@/components/telegram-mini-app/order-form-modal"

interface ExchangeRateData {
  rate: string
  baseRate: string
  isManual: boolean
  timestamp: string
}

type OrderStatus = "CREATED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED"

interface ActiveOrder {
  id: string
  status: OrderStatus
  totalRub: number
  totalCny: number
  rate: number
  createdAt: string
}

export default function TelegramMiniAppPage() {
  const router = useRouter()
  const [isTelegram, setIsTelegram] = useState(false)
  const [initData, setInitData] = useState("")
  const [userLabel, setUserLabel] = useState("Гость")
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null)
  const [isActiveOrderLoading, setIsActiveOrderLoading] = useState(false)
  const [activeOrderError, setActiveOrderError] = useState<string | null>(null)
  const [archivedOrders, setArchivedOrders] = useState<ActiveOrder[]>([])
  const [isArchiveLoading, setIsArchiveLoading] = useState(false)
  const [archiveError, setArchiveError] = useState<string | null>(null)

  const [amount, setAmount] = useState<string>("1000")
  const [result, setResult] = useState<number | null>(null)
  const [exchangeRate, setExchangeRate] = useState<number>(12.5)
  const [baseRate, setBaseRate] = useState<number>(12.5)
  const [manualRate, setManualRate] = useState<number | null>(null)
  const [isManual, setIsManual] = useState<boolean>(false)
  const [isRateLoading, setIsRateLoading] = useState<boolean>(false)
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)

  const mountedRef = useRef(true)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

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

  useEffect(() => {
    if (!isTelegram || !initData) {
      setActiveOrder(null)
      setActiveOrderError(null)
      return
    }

    let isMounted = true

    const fetchActiveOrder = async () => {
      try {
        setIsActiveOrderLoading(true)
        setActiveOrderError(null)
        const response = await fetch("/api/orders/active", {
          headers: {
            "x-telegram-init-data": initData,
          },
        })

        if (!isMounted) return

        if (!response.ok) {
          throw new Error("Не удалось загрузить активную заявку.")
        }

        const data = await response.json()
        setActiveOrder(data.order ?? null)
      } catch (error) {
        if (isMounted) {
          setActiveOrderError(error instanceof Error ? error.message : "Не удалось загрузить активную заявку.")
        }
      } finally {
        if (isMounted) {
          setIsActiveOrderLoading(false)
        }
      }
    }

    fetchActiveOrder()

    return () => {
      isMounted = false
    }
  }, [initData, isTelegram])

  useEffect(() => {
    if (!isTelegram || !initData) {
      setArchivedOrders([])
      setArchiveError(null)
      return
    }

    let isMounted = true

    const fetchArchivedOrders = async () => {
      try {
        setIsArchiveLoading(true)
        setArchiveError(null)
        const response = await fetch("/api/orders/archive", {
          headers: {
            "x-telegram-init-data": initData,
          },
        })

        if (!isMounted) return

        if (!response.ok) {
          throw new Error("Не удалось загрузить архив сделок.")
        }

        const data = await response.json()
        setArchivedOrders(data.orders ?? [])
      } catch (error) {
        if (isMounted) {
          setArchiveError(error instanceof Error ? error.message : "Не удалось загрузить архив сделок.")
        }
      } finally {
        if (isMounted) {
          setIsArchiveLoading(false)
        }
      }
    }

    fetchArchivedOrders()

    return () => {
      isMounted = false
    }
  }, [initData, isTelegram])

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

  const exchangeRates = useMemo(() => {
    return [
      { range: "До 500 CNY", rate: (baseRate + 0.96).toFixed(2) },
      { range: "500–1999 CNY", rate: (baseRate + 0.84).toFixed(2) },
      { range: "2000–5999 CNY", rate: (baseRate + 0.8).toFixed(2) },
      { range: "От 6000 CNY", rate: (baseRate + 0.73).toFixed(2) },
    ]
  }, [baseRate])

  const yuanAmount = result !== null ? result.toFixed(2) : ""
  const rubleAmount = amount || ""
  const handleOrderCreated = (orderId: string) => {
    router.push(`/telegram-mini-app/deal/${orderId}`)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-950 to-emerald-500/10 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">AlipayFast · Premium</p>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">
              Сервис по быстрому пополнению Alipay и WeChat для клиентов AlipayFast
            </h1>
            <p className="text-slate-300">
              Быстрые заявки, прозрачный курс и сопровождение админом в одной комфортной комнате сделки.
            </p>
          </div>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-900/70">
            <TabsTrigger value="active" className="text-sm">
              Активная сделка
            </TabsTrigger>
            <TabsTrigger value="archive" className="text-sm">
              Архив сделок
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <Card className="border-emerald-500/30 bg-emerald-500/10">
              <CardHeader>
                <CardTitle className="text-lg">Активная заявка</CardTitle>
                <CardDescription className="text-emerald-100/80">
                  Если вы уже открывали сделку, вернитесь в комнату и продолжайте общение с админом.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {isActiveOrderLoading && <div className="text-emerald-100/80">Проверяем активную заявку...</div>}
                {!isActiveOrderLoading && activeOrderError && (
                  <div className="rounded-lg border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-amber-100">
                    {activeOrderError}
                  </div>
                )}
                {!isActiveOrderLoading && !activeOrder && !activeOrderError && (
                  <div className="text-emerald-100/80">Активных сделок нет.</div>
                )}
                {!isActiveOrderLoading && activeOrder && (
                  <>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-lg border border-emerald-500/30 bg-slate-950/60 px-3 py-2">
                        <div className="text-emerald-200/80">Статус</div>
                        <div className="text-base font-semibold text-white">{statusLabel(activeOrder.status)}</div>
                      </div>
                      <div className="rounded-lg border border-emerald-500/30 bg-slate-950/60 px-3 py-2">
                        <div className="text-emerald-200/80">Номер заявки</div>
                        <div className="text-base font-semibold text-white">#{activeOrder.id.slice(0, 6)}</div>
                      </div>
                      <div className="rounded-lg border border-emerald-500/30 bg-slate-950/60 px-3 py-2">
                        <div className="text-emerald-200/80">Сумма</div>
                        <div className="text-base font-semibold text-white">
                          {activeOrder.totalRub.toLocaleString("ru-RU")} ₽
                        </div>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-emerald-500 text-slate-950 transition hover:bg-emerald-400"
                      onClick={() => router.push(`/telegram-mini-app/deal/${activeOrder.id}`)}
                    >
                      Вернуться в комнату сделки
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="archive">
            <Card className="border-slate-800 bg-slate-900/60">
              <CardHeader>
                <CardTitle className="text-lg">Архив сделок</CardTitle>
                <CardDescription className="text-slate-400">
                  Завершённые сделки доступны только для просмотра.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {isArchiveLoading && <div className="text-slate-400">Загрузка архива...</div>}
                {!isArchiveLoading && archiveError && (
                  <div className="rounded-lg border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-amber-100">
                    {archiveError}
                  </div>
                )}
                {!isArchiveLoading && !archiveError && archivedOrders.length === 0 && (
                  <div className="text-slate-400">Архив пока пуст.</div>
                )}
                {!isArchiveLoading && archivedOrders.length > 0 && (
                  <div className="space-y-3">
                    {archivedOrders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <div className="text-slate-200">Заявка #{order.id.slice(0, 6)}</div>
                            <div className="text-xs text-slate-400">
                              {statusLabel(order.status)} • {formatDate(order.createdAt)}
                            </div>
                          </div>
                          <div className="text-right text-sm text-slate-200">
                            {order.totalRub.toLocaleString("ru-RU")} ₽
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="mt-3 w-full border-slate-700 text-slate-100 hover:bg-slate-800"
                          onClick={() => router.push(`/telegram-mini-app/deal/${order.id}`)}
                        >
                          Смотреть детали
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-lg">Калькулятор P2P</CardTitle>
            <CardDescription className="text-slate-400">
              Укажите сумму в рублях, чтобы увидеть итоговую сумму в CNY по актуальному курсу.
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
                {isManual ? "Ручной курс" : "Автоматический курс"} • Обновлено:{" "}
                {lastUpdated ? formatDate(lastUpdated) : "Загрузка..."}
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

            <Button
              className="h-12 w-full bg-emerald-500 text-slate-950 transition hover:bg-emerald-400"
              onClick={() => setIsOrderModalOpen(true)}
              disabled={result === null || !amount || !isTelegram}
            >
              Подать заявку на сделку
            </Button>

            {!isTelegram && (
              <p className="text-xs text-amber-300">
                Отправка заявки доступна только внутри Telegram. Откройте мини-приложение, чтобы продолжить.
              </p>
            )}
          </CardContent>
        </Card>

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

        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-lg">Этапы сделки</CardTitle>
            <CardDescription className="text-slate-400">
              Поток как в P2P: заявка → подтверждение → чат → обработка админом.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm">
            {[
              {
                title: "Подать заявку",
                description: "Заполните сумму и подтвердите отправку заявки в Telegram.",
              },
              {
                title: "Заявка принята",
                description: "Сделка фиксируется, и вы сразу попадаете в комнату сделки.",
              },
              {
                title: "Комната сделки",
                description: "Чат с админом синхронизируется с админ-панелью.",
              },
              {
                title: "Админ обрабатывает",
                description: "Администратор ведёт заявку через панель и подтверждает шаги.",
              },
            ].map((step, index) => (
              <div
                key={step.title}
                className="flex gap-4 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-200">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-white">{step.title}</div>
                  <div className="text-slate-400">{step.description}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

      </main>

      <MiniAppOrderFormModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        yuanAmount={yuanAmount}
        rubleAmount={rubleAmount}
        exchangeRate={exchangeRate}
        telegramInitData={initData}
        onOrderCreated={handleOrderCreated}
      />
    </div>
  )
}
