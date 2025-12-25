"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"

export default function DebugSettingsPage() {
  const [debugData, setDebugData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchDebugData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/debug/settings")
      const data = await response.json()
      setDebugData(data)
    } catch (error) {
      console.error("Ошибка получения debug данных:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDebugData()
  }, [])

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Debug: Состояние файла настроек</h1>
        <Button onClick={fetchDebugData} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Обновить
        </Button>
      </div>

      {debugData && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Общая информация</CardTitle>
              <CardDescription>Основные данные о файле настроек</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Путь к файлу:</strong>
                  <p className="text-sm text-gray-600 break-all">{debugData.debug?.filePath}</p>
                </div>
                <div>
                  <strong>Директория существует:</strong>
                  <p className={debugData.debug?.directoryExists ? "text-green-600" : "text-red-600"}>
                    {debugData.debug?.directoryExists ? "Да" : "Нет"}
                  </p>
                </div>
                <div>
                  <strong>Файл существует:</strong>
                  <p className={debugData.debug?.fileExists ? "text-green-600" : "text-red-600"}>
                    {debugData.debug?.fileExists ? "Да" : "Нет"}
                  </p>
                </div>
                <div>
                  <strong>Права доступа:</strong>
                  <p className="text-sm">{debugData.debug?.permissions}</p>
                </div>
                <div>
                  <strong>Размер файла:</strong>
                  <p className="text-sm">{debugData.debug?.fileSize} байт</p>
                </div>
                <div>
                  <strong>Последнее изменение:</strong>
                  <p className="text-sm">
                    {debugData.debug?.lastModified
                      ? new Date(debugData.debug.lastModified).toLocaleString("ru-RU")
                      : "Неизвестно"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {debugData.debug?.fileContent && (
            <Card>
              <CardHeader>
                <CardTitle>Содержимое файла (raw)</CardTitle>
                <CardDescription>Сырое содержимое файла настроек</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{debugData.debug.fileContent}</pre>
              </CardContent>
            </Card>
          )}

          {debugData.debug?.parsedContent && (
            <Card>
              <CardHeader>
                <CardTitle>Распарсенные настройки</CardTitle>
                <CardDescription>Настройки после парсинга JSON</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Режим:</strong>
                    <p className={debugData.debug.parsedContent.useManualRate ? "text-blue-600" : "text-orange-600"}>
                      {debugData.debug.parsedContent.useManualRate ? "Ручной курс" : "Автоматический"}
                    </p>
                  </div>
                  <div>
                    <strong>Ручной курс:</strong>
                    <p className="text-sm">{debugData.debug.parsedContent.manualRate || "Не установлен"}</p>
                  </div>
                  <div>
                    <strong>Надбавка:</strong>
                    <p className="text-sm">{debugData.debug.parsedContent.markup}</p>
                  </div>
                  <div>
                    <strong>Версия:</strong>
                    <p className="text-sm">{debugData.debug.parsedContent.version}</p>
                  </div>
                  <div>
                    <strong>Последнее обновление:</strong>
                    <p className="text-sm">
                      {debugData.debug.parsedContent.lastUpdated
                        ? new Date(debugData.debug.parsedContent.lastUpdated).toLocaleString("ru-RU")
                        : "Неизвестно"}
                    </p>
                  </div>
                  <div>
                    <strong>Текущий курс:</strong>
                    <p className="text-sm">{debugData.debug.parsedContent.currentRate || "Не установлен"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Полные debug данные</CardTitle>
              <CardDescription>Все данные в JSON формате</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
                {JSON.stringify(debugData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
