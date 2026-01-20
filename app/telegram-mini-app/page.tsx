"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { ContactButtons } from "@/components/contact-buttons"
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCopy,
  MessageSquareText,
  ShieldCheck,
  ShoppingBag,
  UserCircle,
} from "lucide-react"
import { EXCHANGE_CONFIG, getMarkupForAmount } from "@/lib/exchange-config"

interface ExchangeRateData {
  rate: string
  baseRate?: string
  isManual?: boolean
  timestamp?: string
}

type OrderStatus = "CREATED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED"

interface Order {
  id: string
  totalRub: number
  totalCny: number
  rate: number
  status: OrderStatus
}

interface PaymentStep {
  id: string
  stepIndex: number
  status: "WAITING_FOR_DETAILS" | "WAITING_FOR_PAYMENT" | "PAID" | "VERIFIED" | "CANCELED"
  amountRub: number
  method: "CARD" | "SBP"
  requisiteValue: string
  bankName: string
  receiptEmail: string
  receiptFileUrl?: string
}

interface OrderMessage {
  id: string
  senderRole: "client" | "admin"
  text?: string
  createdAt: string
}

interface ShowcaseItem {
  id: string
  title: string
  imageUrl: string
  description?: string
  priceCny: number
  priceRub: number
  benefitRub: number
}

export default function TelegramMiniAppPage() {
  const [activeTab, setActiveTab] = useState("exchange")
  const [initData, setInitData] = useState("")
  const [userLabel, setUserLabel] = useState("demo")
  const [order, setOrder] = useState<Order | null>(null)
  const [steps, setSteps] = useState<PaymentStep[]>([])
  const [messages, setMessages] = useState<OrderMessage[]>([])
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([])
  const [exchangeRate, setExchangeRate] = useState(12.5)
  const [baseRate, setBaseRate] = useState(12.5)
  const [isManualRate, setIsManualRate] = useState(false)
  const [manualRate, setManualRate] = useState<number | null>(null)
  const [rateUpdatedAt, setRateUpdatedAt] = useState("")
  const [rubAmount, setRubAmount] = useState(50000)
  const [cnyAmount, setCnyAmount] = useState(4000)
  const [rubInput, setRubInput] = useState("50000")
  const [cnyInput, setCnyInput] = useState("4000")
  const [lastEdited, setLastEdited] = useState<"rub" | "cny" | null>("rub")
  const [contactPhone, setContactPhone] = useState("")
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null)
  const [orderError, setOrderError] = useState("")
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [stageChecks, setStageChecks] = useState({
    amount: false,
    bank: false,
    receiptApp: false,
    receiptEmail: false,
  })
  const [chatText, setChatText] = useState("")
  const [sourcingCooldown, setSourcingCooldown] = useState(0)
  const [sourcingForm, setSourcingForm] = useState({
    link: "",
    description: "",
    priceRub: "",
    imageUrl: "",
  })

  const activeStep = useMemo(
    () => steps.find((step) => step.status === "WAITING_FOR_PAYMENT" || step.status === "WAITING_FOR_DETAILS"),
    [steps],
  )

  const stageReady = Object.values(stageChecks).every(Boolean) && receiptUrl
  const rateTiers = useMemo(
    () =>
      [
        { label: "До 500 CNY", markup: EXCHANGE_CONFIG.DYNAMIC_MARKUP[0].markup },
        { label: "500–1999 CNY", markup: EXCHANGE_CONFIG.DYNAMIC_MARKUP[1].markup },
        { label: "2000–5999 CNY", markup: EXCHANGE_CONFIG.DYNAMIC_MARKUP[2].markup },
        { label: "От 6000 CNY", markup: EXCHANGE_CONFIG.DYNAMIC_MARKUP[3].markup },
      ].map((tier) => ({
        label: tier.label,
        rate: (baseRate + tier.markup).toFixed(2),
      })),
    [baseRate],
  )
  const formattedRateUpdatedAt = useMemo(() => {
    if (!rateUpdatedAt) return ""
    try {
      return new Date(rateUpdatedAt).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return ""
    }
  }, [rateUpdatedAt])

  const getRateForCny = useCallback(
    (amountCny: number) => {
      if (isManualRate && manualRate) {
        return manualRate
      }
      if (!baseRate || Number.isNaN(baseRate)) {
        return exchangeRate
      }
      const markup = getMarkupForAmount(amountCny)
      return baseRate + markup
    },
    [baseRate, exchangeRate, isManualRate, manualRate],
  )

  const getRateForRub = useCallback(
    (amountRub: number) => {
      if (isManualRate && manualRate) {
        return manualRate
      }
      if (!baseRate || Number.isNaN(baseRate)) {
        return exchangeRate
      }
      const approximateYuan = amountRub / baseRate
      const markup = getMarkupForAmount(approximateYuan)
      return baseRate + markup
    },
    [baseRate, exchangeRate, isManualRate, manualRate],
  )

  useEffect(() => {
    const telegramWebApp = window.Telegram?.WebApp
    if (telegramWebApp) {
      telegramWebApp.ready()
      setInitData(telegramWebApp.initData)
      if (telegramWebApp.initDataUnsafe?.user) {
        const { username, first_name } = telegramWebApp.initDataUnsafe.user
        setUserLabel(username ?? first_name ?? "user")
      }
    }
  }, [])

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch(`/api/exchange-rate?nocache=${Date.now()}`)
        const data: ExchangeRateData = await response.json()
        if (!response.ok) return
        const parsedRate = Number.parseFloat(data.rate)
        const parsedBaseRate = Number.parseFloat(data.baseRate ?? data.rate)
        if (!Number.isNaN(parsedRate)) {
          setBaseRate(!Number.isNaN(parsedBaseRate) ? parsedBaseRate : parsedRate)
          setIsManualRate(Boolean(data.isManual))
          setManualRate(data.isManual && !Number.isNaN(parsedRate) ? parsedRate : null)
          setRateUpdatedAt(data.timestamp ?? "")
        }
      } catch (error) {
        console.error("Не удалось загрузить курс:", error)
      }
    }

    fetchRate()
  }, [])

  const apiHeaders = useMemo(
    () => (initData ? { "x-telegram-init-data": initData } : {}),
    [initData],
  )

  const fetchActiveOrder = useCallback(async () => {
    const response = await fetch("/api/orders/active", { headers: apiHeaders })
    const data = await response.json()
    if (data.order) {
      setOrder(data.order)
      setSteps(data.steps ?? [])
      setMessages(data.messages ?? [])
    } else {
      setOrder(null)
      setSteps([])
      setMessages([])
    }
  }, [apiHeaders])

  const fetchShowcase = useCallback(async () => {
    const response = await fetch("/api/showcase")
    const data = await response.json()
    setShowcaseItems(data.items ?? [])
  }, [])

  useEffect(() => {
    fetchActiveOrder()
    fetchShowcase()
  }, [fetchActiveOrder, fetchShowcase])

  useEffect(() => {
    if (!order) return
    const interval = window.setInterval(() => {
      fetch(`/api/orders/${order.id}/messages`, { headers: apiHeaders })
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data.messages)) {
            setMessages(data.messages)
          }
        })
        .catch(() => null)
    }, 4000)
    return () => window.clearInterval(interval)
  }, [order, apiHeaders])

  useEffect(() => {
    if (!order) return
    const interval = window.setInterval(() => {
      fetchActiveOrder().catch(() => null)
    }, 8000)
    return () => window.clearInterval(interval)
  }, [order, fetchActiveOrder])

  useEffect(() => {
    if (lastEdited === "cny") {
      const rate = getRateForCny(cnyAmount)
      const nextRub = Math.round(cnyAmount * rate)
      setExchangeRate(rate)
      setRubAmount(nextRub)
      setRubInput(nextRub ? String(nextRub) : "")
      return
    }
    if (lastEdited === "rub") {
      const rate = getRateForRub(rubAmount)
      const nextCny = rate ? Math.round(rubAmount / rate) : 0
      setExchangeRate(rate)
      setCnyAmount(nextCny)
      setCnyInput(nextCny ? String(nextCny) : "")
    }
  }, [baseRate, cnyAmount, getRateForCny, getRateForRub, isManualRate, manualRate, lastEdited, rubAmount])

  const sanitizeAmountInput = (value: string) => value.replace(/[^\d]/g, "")

  const handleRubChange = (value: string) => {
    const sanitized = sanitizeAmountInput(value)
    setRubInput(sanitized)
    setLastEdited("rub")
    if (!sanitized) {
      setRubAmount(0)
      setCnyAmount(0)
      setCnyInput("")
      return
    }
    const parsed = Number(sanitized)
    if (!Number.isNaN(parsed)) {
      const rate = getRateForRub(parsed)
      const nextCny = rate ? Math.round(parsed / rate) : 0
      setRubAmount(parsed)
      setExchangeRate(rate)
      setCnyAmount(nextCny)
      setCnyInput(nextCny ? String(nextCny) : "")
    }
  }

  const handleCnyChange = (value: string) => {
    const sanitized = sanitizeAmountInput(value)
    setCnyInput(sanitized)
    setLastEdited("cny")
    if (!sanitized) {
      setCnyAmount(0)
      setRubAmount(0)
      setRubInput("")
      return
    }
    const parsed = Number(sanitized)
    if (!Number.isNaN(parsed)) {
      const rate = getRateForCny(parsed)
      const nextRub = Math.round(parsed * rate)
      setCnyAmount(parsed)
      setExchangeRate(rate)
      setRubAmount(nextRub)
      setRubInput(nextRub ? String(nextRub) : "")
    }
  }

  const handleCreateOrder = async () => {
    if (isCreatingOrder) return
    setOrderError("")
    setIsCreatingOrder(true)
    try {
      const orderRate = getRateForCny(cnyAmount)
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...apiHeaders },
        body: JSON.stringify({
          totalRub: rubAmount,
          totalCny: cnyAmount,
          rate: orderRate,
          contactPhone: contactPhone.trim() || undefined,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
        setSteps(data.steps ?? [])
        setMessages(data.messages ?? [])
        return
      }

      if (response.status === 401) {
        setOrderError("Откройте мини-приложение внутри Telegram, чтобы создать заявку.")
        return
      }

      if (response.status === 409) {
        setOrderError("У вас уже есть активная заявка. Перейдите в комнату сделки.")
        return
      }

      setOrderError("Не удалось создать заявку. Попробуйте еще раз через несколько секунд.")
    } catch (error) {
      console.error("Ошибка при создании заявки:", error)
      setOrderError("Не удалось создать заявку. Проверьте подключение к сети.")
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!order) return
    await fetch(`/api/orders/${order.id}/cancel`, { method: "POST", headers: apiHeaders })
    await fetchActiveOrder()
    setReceiptUrl(null)
    setStageChecks({ amount: false, bank: false, receiptApp: false, receiptEmail: false })
  }

  const handleUpload = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    const response = await fetch("/api/uploads", { method: "POST", headers: apiHeaders, body: formData })
    if (response.ok) {
      const data = await response.json()
      setReceiptUrl(data.url)
      return data.url
    }
    return null
  }

  const handleMarkPaid = async () => {
    if (!order || !activeStep || !receiptUrl) return
    await fetch(`/api/orders/${order.id}/steps/${activeStep.id}/paid`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...apiHeaders },
      body: JSON.stringify({ receiptFileUrl: receiptUrl }),
    })
    await fetchActiveOrder()
  }

  const handleSendMessage = async () => {
    if (!order || !chatText.trim()) return
    const response = await fetch(`/api/orders/${order.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...apiHeaders },
      body: JSON.stringify({ text: chatText.trim() }),
    })
    if (response.ok) {
      const data = await response.json()
      setMessages((prev) => [...prev, data.message])
      setChatText("")
    }
  }

  const handleBuyShowcase = (priceCny: number) => {
    setLastEdited("cny")
    setCnyAmount(priceCny)
    setCnyInput(String(priceCny))
    const rate = getRateForCny(priceCny)
    const nextRub = Math.round(priceCny * rate)
    setExchangeRate(rate)
    setRubAmount(nextRub)
    setRubInput(String(nextRub))
    setActiveTab("exchange")
  }

  const handleCopy = (value: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(value)
    }
  }

  const handleSourcingImageUpload = async (file: File) => {
    const url = await handleUpload(file)
    if (url) {
      setSourcingForm((prev) => ({ ...prev, imageUrl: url }))
    }
  }

  const handleSourcingSubmit = async () => {
    const response = await fetch("/api/sourcing", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...apiHeaders },
      body: JSON.stringify({
        description: sourcingForm.description,
        imageUrl: sourcingForm.imageUrl,
        link: sourcingForm.link || undefined,
        priceRub: sourcingForm.priceRub ? Number(sourcingForm.priceRub) : undefined,
      }),
    })

    if (response.status === 429) {
      const data = await response.json()
      setSourcingCooldown(data.nextAvailableHours)
      return
    }

    if (response.ok) {
      setSourcingCooldown(48)
      setSourcingForm({ link: "", description: "", priceRub: "", imageUrl: "" })
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />

      <main className="flex-1 bg-gradient-to-br from-white via-orange-50 to-red-50">
        <section className="py-10 md:py-14">
          <div className="container px-4 md:px-6">
            <ScrollReveal>
              <div className="mx-auto max-w-5xl grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4">
                  <Badge className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20">Telegram Mini App</Badge>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">AlipayFast Mini App</h1>
                  <p className="text-gray-600">
                    Интерактивное мини-приложение работает внутри Telegram: обмен RUB → Alipay, поэтапные платежи,
                    чат с оператором, витрина выгоды и запросы на поиск цены.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                      Запустить в Telegram
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <ContactButtons variant="default" />
                  </div>
                </div>
                <Card className="border-orange-100 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Ключевые правила</CardTitle>
                    <CardDescription className="text-gray-600">Только Т-Банк, асинхронный обмен, 1 активный этап.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="mt-0.5 h-4 w-4 text-orange-500" />
                      <span>Оплата только из мобильного приложения Т-Банка.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-orange-500" />
                      <span>Чек загружается в Mini App и отправляется на email.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-orange-500" />
                      <span>Пользователь: @{userLabel}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="pb-16">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-5xl">
              <Card className="border-orange-100 shadow-xl">
                <CardHeader className="border-b border-orange-100 bg-white/70">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-xl text-gray-900">Мини-приложение</CardTitle>
                      <CardDescription className="text-gray-600">
                        Встроенный интерфейс для клиента: обмен, витрина, запросы, профиль.
                      </CardDescription>
                    </div>
                    <Badge className="bg-orange-100 text-orange-700">Курс: {exchangeRate.toFixed(2)} ₽ / ¥</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4 bg-orange-50">
                      <TabsTrigger value="exchange">Обмен</TabsTrigger>
                      <TabsTrigger value="showcase">Витрина</TabsTrigger>
                      <TabsTrigger value="requests">Запросы</TabsTrigger>
                      <TabsTrigger value="profile">Профиль</TabsTrigger>
                    </TabsList>

                    <TabsContent value="exchange" className="space-y-6">
                      {!order ? (
                        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
                          <Card className="border-orange-100">
                            <CardHeader>
                              <CardTitle className="text-lg text-gray-900">Калькулятор обмена</CardTitle>
                              <CardDescription className="text-gray-600">
                                Введите сумму в рублях или юанях — пересчет происходит автоматически.
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-sm text-gray-600">Отдаю (RUB)</label>
                                <Input value={rubInput} onChange={(event) => handleRubChange(event.target.value)} inputMode="numeric" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm text-gray-600">Получаю (CNY)</label>
                                <Input value={cnyInput} onChange={(event) => handleCnyChange(event.target.value)} inputMode="numeric" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm text-gray-600">Телефон для связи (если нет username)</label>
                                <Input
                                  value={contactPhone}
                                  onChange={(event) => setContactPhone(event.target.value)}
                                  placeholder="+7 999 000-00-00"
                                />
                              </div>
                              <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-3 text-xs text-gray-600 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span>Текущий курс</span>
                                  <span className="font-semibold text-gray-800">{exchangeRate.toFixed(2)} ₽</span>
                                </div>
                                {!isManualRate && (
                                  <div className="flex items-center justify-between">
                                    <span>Базовый курс ЦБ</span>
                                    <span className="font-semibold text-gray-800">{baseRate.toFixed(2)} ₽</span>
                                  </div>
                                )}
                                {formattedRateUpdatedAt && (
                                  <div className="text-[11px] text-gray-500">Обновлено: {formattedRateUpdatedAt}</div>
                                )}
                                {!isManualRate && (
                                  <div className="space-y-1 text-[11px] text-gray-500">
                                    <div className="font-medium text-gray-600">Ранжиры:</div>
                                    {rateTiers.map((tier) => (
                                      <div key={tier.label} className="flex items-center justify-between">
                                        <span>{tier.label}</span>
                                        <span>{tier.rate} ₽</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <Button
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                                onClick={handleCreateOrder}
                                disabled={isCreatingOrder || !rubAmount || !cnyAmount}
                              >
                                Создать заявку
                              </Button>
                              {orderError && <p className="text-xs text-red-500">{orderError}</p>}
                            </CardContent>
                          </Card>
                          <Card className="border-orange-100 bg-orange-50/70">
                            <CardHeader>
                              <CardTitle className="text-lg text-gray-900">Через Telegram</CardTitle>
                              <CardDescription className="text-gray-600">После создания заявки вы попадаете в комнату сделки.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-gray-700">
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 text-orange-500" />
                                <span>Статус сделки обновляется асинхронно.</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 text-orange-500" />
                                <span>Уведомления приходят в чат Telegram-бота.</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 text-orange-500" />
                                <span>Поддержка 24/7 в комнате сделки.</span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ) : (
                        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                          <Card className="border-orange-100">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-lg text-gray-900">Комната сделки #{order.id.slice(0, 4)}</CardTitle>
                                  <CardDescription className="text-gray-600">Статус: {order.status}</CardDescription>
                                </div>
                                <Badge className="bg-orange-100 text-orange-700">Этап {activeStep?.stepIndex ?? 1}</Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-5">
                              <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                  <p className="text-xs text-gray-500">Сумма</p>
                                  <p className="text-lg font-semibold text-gray-900">{order.totalRub.toLocaleString()} ₽</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Курс</p>
                                  <p className="text-lg font-semibold text-gray-900">{order.rate} ₽</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Получаю</p>
                                  <p className="text-lg font-semibold text-gray-900">{order.totalCny} ¥</p>
                                </div>
                              </div>

                              {activeStep && (
                                <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-4 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-semibold text-gray-900">Этап оплаты {activeStep.stepIndex}</p>
                                      <p className="text-xs text-gray-600">{activeStep.status}</p>
                                    </div>
                                    <Badge className="bg-orange-500 text-white">Активен</Badge>
                                  </div>
                                  <div className="grid gap-3 md:grid-cols-2">
                                    <div>
                                      <p className="text-xs text-gray-500">Сумма к оплате</p>
                                      <p className="text-base font-semibold text-gray-900">{activeStep.amountRub.toLocaleString()} ₽</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Метод</p>
                                      <p className="text-base font-semibold text-gray-900">{activeStep.method}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Реквизит</p>
                                      <p className="text-base font-semibold text-gray-900">{activeStep.requisiteValue}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Банк получателя</p>
                                      <p className="text-base font-semibold text-gray-900">{activeStep.bankName}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Email для чека</p>
                                      <p className="text-base font-semibold text-gray-900">{activeStep.receiptEmail}</p>
                                    </div>
                                  </div>
                                  <div className="grid gap-2 md:grid-cols-2">
                                    {[
                                      { label: "Сумма верна", key: "amount" },
                                      { label: "Банк выбран верно", key: "bank" },
                                      { label: "Чек отправлю из приложения Т-Банка", key: "receiptApp" },
                                      { label: "Чек отправлю на указанный email", key: "receiptEmail" },
                                    ].map((item) => (
                                      <label key={item.key} className="flex items-start gap-2 text-sm text-gray-600">
                                        <input
                                          type="checkbox"
                                          checked={stageChecks[item.key as keyof typeof stageChecks]}
                                          onChange={(event) =>
                                            setStageChecks((prev) => ({
                                              ...prev,
                                              [item.key]: event.target.checked,
                                            }))
                                          }
                                        />
                                        {item.label}
                                      </label>
                                    ))}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <Button
                                      variant="outline"
                                      className="border-orange-200 text-orange-600"
                                      onClick={() => handleCopy(activeStep.requisiteValue)}
                                    >
                                      <ClipboardCopy className="mr-2 h-4 w-4" />
                                      Скопировать реквизит
                                    </Button>
                                    <Button
                                      variant="outline"
                                      className="border-orange-200 text-orange-600"
                                      onClick={() => handleCopy(activeStep.receiptEmail)}
                                    >
                                      <ClipboardCopy className="mr-2 h-4 w-4" />
                                      Скопировать email
                                    </Button>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm text-gray-600">Загрузить чек</label>
                                    <Input type="file" onChange={(event) => event.target.files?.[0] && handleUpload(event.target.files[0])} />
                                  </div>
                                  <Button
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                                    disabled={!stageReady}
                                    onClick={handleMarkPaid}
                                  >
                                    Я оплатил
                                  </Button>
                                </div>
                              )}

                              <Button variant="outline" className="border-gray-200 text-gray-600" onClick={handleCancelOrder}>
                                Отменить сделку
                              </Button>
                            </CardContent>
                          </Card>

                          <div className="space-y-6">
                            <Card className="border-orange-100">
                              <CardHeader>
                                <CardTitle className="text-lg text-gray-900">Чат в ордере</CardTitle>
                                <CardDescription className="text-gray-600">
                                  Асинхронная переписка с оператором в рамках сделки.
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="space-y-3">
                                  {messages.map((message) => (
                                    <div key={message.id} className="rounded-xl border border-orange-100 bg-white p-3">
                                      <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>{message.senderRole === "admin" ? "Оператор" : "Вы"}</span>
                                        <span>{new Date(message.createdAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}</span>
                                      </div>
                                      <p className="text-sm text-gray-700 mt-2">{message.text}</p>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Input value={chatText} onChange={(event) => setChatText(event.target.value)} placeholder="Напишите сообщение..." />
                                  <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSendMessage}>
                                    <MessageSquareText className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="border-orange-100">
                              <CardHeader>
                                <CardTitle className="text-lg text-gray-900">Этапы оплаты</CardTitle>
                                <CardDescription className="text-gray-600">Дополнительные этапы добавляет админ.</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                {steps.map((step) => (
                                  <div key={step.id} className="flex items-center justify-between rounded-xl border border-orange-100 bg-white p-3">
                                    <div>
                                      <p className="text-sm font-semibold text-gray-900">Этап {step.stepIndex}</p>
                                      <p className="text-xs text-gray-500">{step.status}</p>
                                    </div>
                                    {step.id === activeStep?.id ? (
                                      <Badge className="bg-orange-500 text-white">Активен</Badge>
                                    ) : (
                                      <Badge className="bg-gray-100 text-gray-600">Ожидание</Badge>
                                    )}
                                  </div>
                                ))}
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="showcase" className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        {showcaseItems.map((item) => (
                          <Card key={item.id} className="border-orange-100">
                            <CardHeader>
                              <CardTitle className="text-lg text-gray-900">{item.title}</CardTitle>
                              <CardDescription className="text-gray-600">Экономия {item.benefitRub.toLocaleString()} ₽</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <img src={item.imageUrl} alt={item.title} className="h-40 w-full rounded-xl border object-cover" />
                              {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Цена РФ</span>
                                <span className="font-semibold text-gray-900">{item.priceRub.toLocaleString()} ₽</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Цена Китай</span>
                                <span className="font-semibold text-gray-900">{item.priceCny.toLocaleString()} ¥</span>
                              </div>
                              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" onClick={() => handleBuyShowcase(item.priceCny)}>
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                Хочу купить
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="requests" className="space-y-6">
                      <Card className="border-orange-100">
                        <CardHeader>
                          <CardTitle className="text-lg text-gray-900">Хочу узнать цену</CardTitle>
                          <CardDescription className="text-gray-600">Запрос 1 раз в 48 часов. Мини App покажет таймер.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm text-gray-600">Ссылка на товар (опционально)</label>
                            <Input value={sourcingForm.link} onChange={(event) => setSourcingForm((prev) => ({ ...prev, link: event.target.value }))} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-gray-600">Фото товара</label>
                            <Input
                              type="file"
                              onChange={(event) => event.target.files?.[0] && handleSourcingImageUpload(event.target.files[0])}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-gray-600">Описание</label>
                            <Input
                              value={sourcingForm.description}
                              onChange={(event) => setSourcingForm((prev) => ({ ...prev, description: event.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-gray-600">Цена в РФ (опционально)</label>
                            <Input
                              value={sourcingForm.priceRub}
                              onChange={(event) => setSourcingForm((prev) => ({ ...prev, priceRub: event.target.value }))}
                            />
                          </div>
                          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSourcingSubmit} disabled={sourcingCooldown > 0}>
                            Узнать цену в Китае
                          </Button>
                          {sourcingCooldown > 0 && (
                            <div className="rounded-xl border border-orange-100 bg-orange-50 p-3 text-sm text-gray-700">
                              Повторный запрос доступен через {sourcingCooldown} часов.
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="profile" className="space-y-6">
                      <Card className="border-orange-100">
                        <CardHeader>
                          <CardTitle className="text-lg text-gray-900">Профиль</CardTitle>
                          <CardDescription className="text-gray-600">История ордеров и данные пользователя.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center gap-3 rounded-xl border border-orange-100 bg-white p-3">
                            <UserCircle className="h-10 w-10 text-orange-500" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">@{userLabel}</p>
                              <p className="text-xs text-gray-500">T-Банк подтвержден</p>
                            </div>
                          </div>
                          {order && (
                            <div className="rounded-xl border border-orange-100 bg-white p-3">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-gray-900">Активная заявка</p>
                                <Badge className="bg-orange-100 text-orange-700">{order.status}</Badge>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{order.totalRub.toLocaleString()} ₽ → {order.totalCny} ¥</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
