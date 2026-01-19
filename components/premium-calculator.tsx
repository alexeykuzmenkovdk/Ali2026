"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, RefreshCw, AlertCircle } from "lucide-react"
import { format, parseISO } from "date-fns"
import { ru } from "date-fns/locale"
import { OrderFormModal } from "@/components/order-form-modal"
import { EXCHANGE_CONFIG, getMarkupForAmount } from "@/lib/exchange-config"

interface ExchangeRateResponse {
  success: boolean
  rate: string
  cbrDate: string
  timestamp: string
  nextUpdate: string
  error?: string
}

export function PremiumCalculator() {
  const [rubleAmount, setRubleAmount] = useState<string>("3000")
  const [yuanAmount, setYuanAmount] = useState<string>("0")
  const [baseCbrRate, setBaseCbrRate] = useState<number>(12.5)
  const [exchangeRate, setExchangeRate] = useState<number>(12.5)
  const [cbrDate, setCbrDate] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [nextUpdate, setNextUpdate] = useState<Date | null>(null)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isHovered, setIsHovered] = useState(false)

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const isMounted = useRef(false)
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const fetchExchangeRate = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)
    setUpdateError(null)

    try {
      const response = await fetch("/api/exchange-rate")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Получен не JSON ответ:", text.substring(0, 200))
        throw new Error("Сервер вернул некорректный ответ")
      }

      const data: ExchangeRateResponse = await response.json()

      if (data.success) {
        const rate = Number.parseFloat(data.rate)
        console.log("Received base CBR rate:", rate)

        setBaseCbrRate(rate)
        setExchangeRate(rate)
        setCbrDate(data.cbrDate)
        setNextUpdate(new Date(data.nextUpdate))

        if (data.error) {
          setUpdateError(data.error)
        }
      } else {
        throw new Error(data.error || "Не удалось получить курс валют")
      }
    } catch (error) {
      console.error("Failed to fetch exchange rate:", error)
      setUpdateError("Не удалось обновить курс. Используется последний известный курс.")
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      fetchExchangeRate()
    }

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [fetchExchangeRate])

  useEffect(() => {
    if (nextUpdate) {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }

      const timeUntilNextUpdate = nextUpdate.getTime() - Date.now()

      if (timeUntilNextUpdate > 0) {
        updateTimeoutRef.current = setTimeout(() => {
          fetchExchangeRate()
        }, timeUntilNextUpdate)
      } else {
        fetchExchangeRate()
      }
    }

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [nextUpdate, fetchExchangeRate])

  useEffect(() => {
    if (baseCbrRate && rubleAmount) {
      const rubleNum = Number.parseFloat(rubleAmount)
      if (!isNaN(rubleNum) && rubleNum >= 3000) {
        const approximateYuan = rubleNum / baseCbrRate
        const markup = getMarkupForAmount(approximateYuan)
        const finalRate = baseCbrRate + markup // Курс ЦБ + надбавка (без двойного сложения)

        console.log("[v0] Debug calculation:", {
          rubleNum,
          baseCbrRate,
          approximateYuan,
          markup,
          finalRate,
        })

        setExchangeRate(finalRate)

        const calculatedYuan = rubleNum / finalRate
        setYuanAmount(calculatedYuan % 1 === 0 ? calculatedYuan.toString() : calculatedYuan.toFixed(2))
      }
    }
  }, [baseCbrRate, rubleAmount])

  const handleRubleInputChange = (value: string) => {
    const sanitized = value.replace(/\D/g, "")

    if (sanitized === "") {
      setRubleAmount("")
      setYuanAmount("0")
      return
    }

    const numValue = Number.parseInt(sanitized, 10)

    setRubleAmount(numValue.toString())

    if (baseCbrRate && numValue >= 3000) {
      const approximateYuan = numValue / baseCbrRate
      const markup = getMarkupForAmount(approximateYuan)
      const finalRate = baseCbrRate + markup // Только базовый курс + надбавка по диапазону

      console.log("[v0] Input change calculation:", {
        numValue,
        baseCbrRate,
        approximateYuan,
        markup,
        finalRate,
      })

      setExchangeRate(finalRate)

      const calculatedYuan = numValue / finalRate
      setYuanAmount(calculatedYuan % 1 === 0 ? calculatedYuan.toString() : calculatedYuan.toFixed(2))
    } else {
      setYuanAmount("0")
    }
  }

  const handleRubleInputBlur = () => {
    if (rubleAmount === "") {
      setRubleAmount("3000")
      if (baseCbrRate) {
        const approximateYuan = 3000 / baseCbrRate
        const markup = getMarkupForAmount(approximateYuan)
        const finalRate = baseCbrRate + markup
        setExchangeRate(finalRate)

        const calculatedYuan = 3000 / finalRate
        setYuanAmount(calculatedYuan % 1 === 0 ? calculatedYuan.toString() : calculatedYuan.toFixed(2))
      }
      return
    }

    const numValue = Number.parseInt(rubleAmount, 10)
    const rounded = Math.round(numValue / 1000) * 1000
    const finalValue = Math.max(3000, rounded)

    setRubleAmount(finalValue.toString())

    if (baseCbrRate) {
      const approximateYuan = finalValue / baseCbrRate
      const markup = getMarkupForAmount(approximateYuan)
      const finalRate = baseCbrRate + markup
      setExchangeRate(finalRate)

      const calculatedYuan = finalValue / finalRate
      setYuanAmount(calculatedYuan % 1 === 0 ? calculatedYuan.toString() : calculatedYuan.toFixed(2))
    }
  }

  const getFormattedDate = () => {
    if (!cbrDate) return ""

    try {
      const date = parseISO(cbrDate)
      return format(date, "dd.MM.yyyy", { locale: ru })
    } catch (error) {
      console.error("Error formatting date:", error)
      return ""
    }
  }

  const handleOrderClick = () => {
    setIsModalOpen(true)
  }

  const rateTiers = EXCHANGE_CONFIG.DYNAMIC_MARKUP.reduce<
    Array<{ label: string; rate: number }>
  >((acc, tier, index, tiers) => {
    const previousMax = index === 0 ? 0 : tiers[index - 1].maxYuan
    const label =
      tier.maxYuan === Number.POSITIVE_INFINITY
        ? `от ${previousMax} CNY`
        : index === 0
          ? `до ${tier.maxYuan} CNY`
          : `от ${previousMax} до ${tier.maxYuan} CNY`

    acc.push({
      label,
      rate: baseCbrRate + tier.markup,
    })

    return acc
  }, [])

  return (
    <>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl border-2 border-orange-100 bg-white shadow-xl"
      >
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-orange-100 to-red-100 opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-br from-orange-100 to-red-100 opacity-30 blur-3xl"></div>

        <div className="relative z-10">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 md:p-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Калькулятор обмена</h3>
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700">
                      Текущий курс: 1 CNY = {exchangeRate.toFixed(2)} RUB
                      {isLoading && " (Обновление...)"}
                    </span>

                    {cbrDate && <span className="ml-2 text-xs text-gray-500">от {getFormattedDate()}</span>}
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  Итоговый курс зависит от суммы в юанях:
                  <ul className="mt-1 space-y-1">
                    {rateTiers.map((tier) => (
                      <li key={tier.label} className="flex flex-wrap gap-1">
                        <span className="font-medium text-gray-600">{tier.label}</span>
                        <span>— 1 CNY = {tier.rate.toFixed(2)} RUB</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {updateError && (
                  <div className="mt-2 flex items-center text-sm text-amber-600">
                    <AlertCircle className="mr-1 h-4 w-4" />
                    {updateError}
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={fetchExchangeRate}
                disabled={isLoading}
                className="hover:text-orange-500 shrink-0"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Обновить курс
              </Button>
            </div>

          </div>

          <div className="p-6 md:p-8">
            <div className="grid gap-8">
              <div className="grid gap-4">
                <Label htmlFor="ruble" className="text-base font-medium text-gray-700">
                  Сумма в рублях (RUB)
                </Label>
                <Input
                  id="ruble"
                  type="text"
                  placeholder="Минимум 3000 ₽"
                  value={rubleAmount}
                  onChange={(e) => handleRubleInputChange(e.target.value)}
                  onBlur={handleRubleInputBlur}
                  className="h-14 rounded-xl border-2 border-gray-200 bg-white text-lg shadow-sm transition-all focus:border-orange-500 focus:ring-orange-500"
                />
                <p className="text-xs text-gray-500 font-semibold">
                  Минимальная сумма: 3000 ₽. Заказ кратен 1000 ₽ (3000, 4000, 5000...)
                </p>
              </div>

              <div className="flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 shadow-md">
                  <ArrowRight className="h-6 w-6 text-white rotate-90" />
                </div>
              </div>

              <div className="grid gap-4">
                <Label htmlFor="yuan" className="text-base font-medium text-gray-700">
                  Вы получите (CNY)
                </Label>
                <Input
                  id="yuan"
                  type="text"
                  value={yuanAmount}
                  readOnly
                  className="h-14 rounded-xl border-2 border-gray-200 bg-gray-50 text-lg shadow-sm cursor-not-allowed"
                />
              </div>
            </div>

            <div className="mt-8">
              <Button
                className="group relative h-14 w-full overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-lg font-medium shadow-md transition-all hover:shadow-lg"
                onClick={handleOrderClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                disabled={!rubleAmount || Number.parseInt(rubleAmount) < 3000}
              >
                <span className="relative z-10">Пополнить Alipay на {yuanAmount || "0"} CNY</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-700"
                  initial={{ x: "-100%" }}
                  animate={{ x: isHovered ? 0 : "-100%" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <OrderFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        yuanAmount={yuanAmount}
        rubleAmount={rubleAmount}
        exchangeRate={exchangeRate}
      />
    </>
  )
}
