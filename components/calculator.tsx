"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { CalculatorIcon, ArrowRight, TrendingUp, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ExchangeRateData {
  rate: string
  baseRate: string
  isManual: boolean
  timestamp: string
}

export function Calculator() {
  const [amount, setAmount] = useState<string>("1000")
  const [result, setResult] = useState<number | null>(null)
  const [exchangeRate, setExchangeRate] = useState<number>(12.5)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [isManual, setIsManual] = useState<boolean>(false)
  const [baseRate, setBaseRate] = useState<string>("")

  // Refs для очистки
  const mountedRef = useRef(true)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      mountedRef.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Загрузка курса обмена
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/exchange-rate?nocache=${Date.now()}`)
        const data: ExchangeRateData = await response.json()

        // Проверяем, что компонент еще смонтирован
        if (!mountedRef.current) return

        if (response.ok) {
          const rate = Number.parseFloat(data.rate)
          setExchangeRate(rate)
          setLastUpdated(data.timestamp)
          setIsManual(data.isManual)
          setBaseRate(data.baseRate)
        }
      } catch (error) {
        console.error("Ошибка при загрузке курса:", error)
      } finally {
        // Проверяем, что компонент еще смонтирован перед обновлением состояния
        if (mountedRef.current) {
          setIsLoading(false)
        }
      }
    }

    fetchExchangeRate()
  }, [])

  // Автоматический расчет при загрузке курса
  useEffect(() => {
    if (exchangeRate && amount) {
      const amountNum = Number.parseFloat(amount)
      if (!isNaN(amountNum) && amountNum > 0) {
        const calculatedResult = amountNum / exchangeRate
        setResult(calculatedResult)
      }
    }
  }, [exchangeRate]) // Запускается когда курс загружен

  const calculateExchange = () => {
    if (!amount || amount === "") {
      setResult(null)
      return
    }

    const amountNum = Number.parseFloat(amount)
    if (!isNaN(amountNum) && amountNum > 0) {
      const calculatedResult = amountNum / exchangeRate
      setResult(calculatedResult)
    } else {
      setResult(null)
    }
  }

  const handleAmountChange = (value: string) => {
    // Разрешаем только цифры и точку
    const sanitizedValue = value.replace(/[^0-9.]/g, "")

    // Предотвращаем множественные точки
    const parts = sanitizedValue.split(".")
    if (parts.length > 2) {
      return
    }

    setAmount(sanitizedValue)

    // Автоматический расчет с задержкой
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      if (mountedRef.current) {
        // Если поле пустое, очищаем результат
        if (!sanitizedValue || sanitizedValue === "") {
          setResult(null)
          return
        }

        const amountNum = Number.parseFloat(sanitizedValue)
        if (!isNaN(amountNum) && amountNum > 0) {
          const calculatedResult = amountNum / exchangeRate
          setResult(calculatedResult)
        } else {
          setResult(null)
        }
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

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-2 border-orange-100">
      <CardHeader className="text-center bg-gradient-to-r from-orange-50 to-red-50">
        <CardTitle className="flex items-center justify-center gap-2 text-xl font-bold text-gray-800">
          <CalculatorIcon className="h-6 w-6 text-orange-500" />
          Калькулятор обмена
        </CardTitle>
        <CardDescription className="text-gray-600">Рассчитайте количество юаней за ваши рубли</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* Информация о курсе */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Текущий курс:</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="font-bold text-lg text-gray-800">1 CNY = {exchangeRate.toFixed(2)} RUB</span>
            </div>
          </div>

          {!isManual && baseRate && <div className="text-xs text-gray-500 mb-1">Базовый курс ЦБ: {baseRate} RUB</div>}

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>
              {isManual ? "Ручной курс" : "Автоматический курс"} • Обновлено:{" "}
              {lastUpdated ? formatDate(lastUpdated) : "Загрузка..."}
            </span>
          </div>
        </div>

        {/* Поле ввода суммы */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-base font-medium text-gray-700">
            Сумма в рублях (RUB)
          </Label>
          <div className="relative">
            <Input
              id="amount"
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="Введите сумму в рублях"
              className="text-lg h-12 pr-16 border-2 border-gray-200 focus:border-orange-500"
              disabled={isLoading}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₽</span>
          </div>
        </div>

        {/* Кнопка расчета */}
        <Button
          onClick={calculateExchange}
          disabled={!amount || isLoading}
          className="w-full h-12 text-base font-medium bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 transition-all duration-300"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Загрузка курса...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              Рассчитать
              <ArrowRight className="h-4 w-4" />
            </div>
          )}
        </Button>

        {/* Результат */}
        <AnimatePresence mode="wait">
          {result !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200"
            >
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Вы получите:</p>
                <p className="text-2xl font-bold text-green-700">{result.toFixed(2)} CNY</p>
                <p className="text-xs text-gray-500 mt-1">По курсу {exchangeRate.toFixed(2)} RUB за 1 CNY</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Дополнительная информация */}
        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>• Курс обновляется автоматически</p>
          <p>• Комиссия уже включена в курс</p>
          <p>• Минимальная сумма пополнения: 100 RUB</p>
        </div>
      </CardContent>
    </Card>
  )
}
