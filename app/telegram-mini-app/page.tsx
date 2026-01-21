"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getMarkupForAmount } from "@/lib/exchange-config"
import { OrderFormModal } from "@/components/order-form-modal"

interface ExchangeRateData {
  rate: string
  baseRate: string
  isManual: boolean
  timestamp: string
}

export default function TelegramMiniAppPage() {
  const router = useRouter()
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
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-widest text-slate-400">Telegram Mini App</p>
          <h1 className="text-3xl font-semibold">Обмен валют</h1>
          <p className="text-slate-300">
            Рассчитайте сумму обмена юаней по актуальному курсу.
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

        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-lg">Калькулятор обмена</CardTitle>
            <CardDescription className="text-slate-400">
              Укажите сумму в рублях, чтобы увидеть итоговую сумму в CNY.
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

            <Button
              className="h-12 w-full bg-emerald-500 text-slate-950 transition hover:bg-emerald-400"
              onClick={() => setIsOrderModalOpen(true)}
              disabled={result === null || !amount}
            >
              Подать заявку на обмен
            </Button>

            {!isTelegram && (
              <p className="text-xs text-amber-300">
                Для получения персонального курса откройте мини-приложение в Telegram.
              </p>
            )}
          </CardContent>
        </Card>
      </main>

      <OrderFormModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        yuanAmount={yuanAmount}
        rubleAmount={rubleAmount}
        exchangeRate={exchangeRate}
        submissionVariant="mini-app"
        telegramInitData={initData}
        onOrderCreated={handleOrderCreated}
      />
    </div>
  )
}
