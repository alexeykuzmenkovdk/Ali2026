"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Эта страница только для отладки и не должна быть доступна в продакшене
export default function DebugPage() {
  const [cbrRate, setCbrRate] = useState<number | null>(null)
  const [rateWithMarkup, setRateWithMarkup] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [responseData, setResponseData] = useState<any>(null)

  const fetchRates = async () => {
    setLoading(true)
    setError(null)

    try {
      // Получаем данные напрямую от ЦБ РФ для сравнения
      const cbrResponse = await fetch("https://www.cbr-xml-daily.ru/daily_json.js")
      const cbrData = await cbrResponse.json()

      if (!cbrData.Valute || !cbrData.Valute.CNY) {
        throw new Error("CNY rate not found in CBR data")
      }

      // Курс юаня к рублю с учетом номинала
      const rawCbrRate = cbrData.Valute.CNY.Value / cbrData.Valute.CNY.Nominal
      setCbrRate(rawCbrRate)

      // Получаем данные из нашего API
      const apiResponse = await fetch("/api/exchange-rate")
      const apiData = await apiResponse.json()
      setResponseData(apiData)

      if (apiData.success) {
        setRateWithMarkup(Number.parseFloat(apiData.rate))
      } else {
        throw new Error(apiData.error || "Failed to get rate from API")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRates()
  }, [])

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Отладка курса валют</h1>
      <p className="text-red-500 mb-4">Эта страница только для отладки и должна быть удалена перед публикацией!</p>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Курс ЦБ РФ (без наценки)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Загрузка...</p>
            ) : cbrRate ? (
              <p className="text-xl">{cbrRate.toFixed(4)} RUB</p>
            ) : (
              <p className="text-red-500">Не удалось получить курс</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Курс с наценкой (наш API)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Загрузка...</p>
            ) : rateWithMarkup ? (
              <p className="text-xl">{rateWithMarkup.toFixed(4)} RUB</p>
            ) : (
              <p className="text-red-500">Не удалось получить курс</p>
            )}

            {cbrRate && rateWithMarkup && (
              <p className="mt-2">Разница: {(rateWithMarkup - cbrRate).toFixed(4)} RUB (должна быть 0.62 RUB)</p>
            )}
          </CardContent>
        </Card>
      </div>

      {error && <div className="mt-4 p-4 bg-red-50 text-red-500 rounded-md">{error}</div>}

      <div className="mt-6">
        <Button onClick={fetchRates} disabled={loading}>
          Обновить данные
        </Button>
      </div>

      {responseData && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Ответ API:</h2>
          <pre className="p-4 bg-gray-100 rounded-md overflow-auto">{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
