"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { RefreshCw } from "lucide-react"

interface RateData {
  date: string
  rate: number
}

export function ExchangeRateChart() {
  const [data, setData] = useState<RateData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchExchangeHistory()
  }, [])

  const fetchExchangeHistory = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/exchange-history")

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`)
      }

      const result = await response.json()

      if (result.success && result.history) {
        // Преобразуем данные для графика
        const chartData = result.history.map((item: any) => ({
          date: formatDate(item.date),
          rate: Number(item.rate),
        }))

        setData(chartData)
      } else {
        setError(result.message || "Не удалось загрузить историю курса")
      }
    } catch (error) {
      console.error("Failed to fetch exchange history:", error)
      setError("Ошибка при загрузке истории курса")
    } finally {
      setIsLoading(false)
    }
  }

  // Форматирование даты для отображения
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}`
  }

  return (
    <Card className="border-2 shadow-md h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>История курса юаня</CardTitle>
          {isLoading && <RefreshCw className="h-4 w-4 animate-spin text-gray-400" />}
        </div>
        <CardDescription>Динамика изменения курса юаня к рублю за последний период</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex items-center justify-center h-64 text-red-500">{error}</div>
        ) : data.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center h-64 text-gray-500">Нет данных для отображения</div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={10} />
                <YAxis domain={["auto", "auto"]} tick={{ fontSize: 12 }} tickMargin={10} width={40} />
                <Tooltip formatter={(value) => [`${value} ₽`, "Курс"]} labelFormatter={(label) => `Дата: ${label}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rate"
                  name="Курс юаня"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
