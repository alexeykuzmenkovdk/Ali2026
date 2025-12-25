"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft, Copy, ExternalLink, Send } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Logo } from "@/components/logo-component"

export default function TelegramSetupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSending, setIsSending] = useState(false)
  const [botToken, setBotToken] = useState<string | null>(null)
  const [chatId, setChatId] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Проверяем аутентификацию
    const checkAuth = async () => {
      try {
        const isAuth = localStorage.getItem("admin_authenticated") === "true"

        if (!isAuth) {
          const response = await fetch("/api/admin/auth")
          const data = await response.json()

          if (!response.ok || !data.authenticated) {
            router.push("/admin/login")
            return
          } else {
            localStorage.setItem("admin_authenticated", "true")
          }
        }

        setIsAuthenticated(true)
      } catch (error) {
        console.error("Ошибка при проверке аутентификации:", error)
        router.push("/admin/login")
      }
    }

    checkAuth()
  }, [router])

  // Отправка тестового сообщения
  const sendTestMessage = async () => {
    setIsSending(true)

    try {
      const response = await fetch("/api/admin/rate-alert", {
        method: "PUT",
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Тестовое сообщение отправлено",
          description: "Проверьте ваш Telegram для подтверждения",
        })
      } else {
        toast({
          title: "Ошибка отправки",
          description: data.message || "Не удалось отправить тестовое сообщение",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Ошибка при отправке тестового сообщения:", error)
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при отправке тестового сообщения",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  // Копирование команды в буфер обмена
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Скопировано!",
      description: "Текст скопирован в буфер обмена",
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto text-orange-500" />
          <p className="mt-4 text-gray-600">Проверка аутентификации...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Logo size="small" />
            <span className="text-lg font-bold text-gray-800">Настройка Telegram</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin/dashboard")} className="text-gray-600">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Вернуться в админ-панель
          </Button>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Настройка уведомлений Telegram</h1>
          <p className="text-gray-600 mb-8">
            Следуйте инст��укциям ниже, чтобы настроить отправку уведомлений в Telegram для вашего сайта.
          </p>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Шаг 1: Создание бота в Telegram</CardTitle>
                <CardDescription>Создайте нового бота через BotFather и получите токен</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="list-decimal pl-5 space-y-3">
                  <li>
                    Откройте Telegram и найдите{" "}
                    <a
                      href="https://t.me/BotFather"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center"
                    >
                      @BotFather <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </li>
                  <li>
                    Отправьте команду <code className="bg-gray-100 px-2 py-1 rounded">/newbot</code>
                  </li>
                  <li>Следуйте инструкциям для создания бота (укажите имя и username)</li>
                  <li>После создания бота вы получите токен API (длинная строка символов)</li>
                  <li>
                    <div className="flex items-center">
                      <span className="mr-2">
                        Скопируйте этот токен и сохраните его в переменной окружения{" "}
                        <code className="bg-gray-100 px-2 py-1 rounded">TELEGRAM_BOT_TOKEN</code>
                      </span>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard("TELEGRAM_BOT_TOKEN")}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Шаг 2: Получение ID чата</CardTitle>
                <CardDescription>Получите ID чата, в который будут отправляться уведомления</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-md text-amber-800 text-sm mb-4">
                  <p className="font-medium">Важно!</p>
                  <p>
                    Вы должны сначала отправить сообщение боту, чтобы инициировать чат, иначе бот не сможет отправлять
                    вам сообщения.
                  </p>
                </div>

                <h3 className="font-medium text-lg">Способ 1: Через @userinfobot</h3>
                <ol className="list-decimal pl-5 space-y-3">
                  <li>
                    Откройте Telegram и найдите{" "}
                    <a
                      href="https://t.me/userinfobot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center"
                    >
                      @userinfobot <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </li>
                  <li>Отправьте любое сообщение этому боту</li>
                  <li>Бот ответит вам информацией о вашем аккаунте, включая ваш ID</li>
                  <li>
                    <div className="flex items-center">
                      <span className="mr-2">
                        Скопируйте этот ID и сохраните его в переменной окружения{" "}
                        <code className="bg-gray-100 px-2 py-1 rounded">TELEGRAM_CHAT_ID</code>
                      </span>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard("TELEGRAM_CHAT_ID")}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </li>
                </ol>

                <h3 className="font-medium text-lg mt-6">Способ 2: Через API Telegram</h3>
                <ol className="list-decimal pl-5 space-y-3">
                  <li>Отправьте сообщение вашему боту в Telegram</li>
                  <li>
                    Откройте в браузере URL (замените YOUR_BOT_TOKEN на токен вашего бота):
                    <div className="flex items-center mt-1">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm block overflow-x-auto w-full">
                        https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-2 flex-shrink-0"
                        onClick={() => copyToClipboard("https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </li>
                  <li>
                    В ответе найдите поле <code className="bg-gray-100 px-2 py-1 rounded">chat.id</code> - это и есть
                    ваш ID чата
                  </li>
                  <li>
                    <div className="flex items-center">
                      <span className="mr-2">
                        Сохраните этот ID в переменной окружения{" "}
                        <code className="bg-gray-100 px-2 py-1 rounded">TELEGRAM_CHAT_ID</code>
                      </span>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard("TELEGRAM_CHAT_ID")}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Шаг 3: Добавление переменных окружения</CardTitle>
                <CardDescription>Добавьте полученные значения в переменные окружения вашего проекта</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Добавьте следующие переменные окружения в ваш проект на Vercel:</p>
                <div className="bg-gray-100 p-4 rounded-md font-mono text-sm">
                  <div className="flex items-center justify-between">
                    <span>TELEGRAM_BOT_TOKEN=ваш_токен_бота</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard("TELEGRAM_BOT_TOKEN=ваш_токен_бота")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>TELEGRAM_CHAT_ID=ваш_id_чата</span>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard("TELEGRAM_CHAT_ID=ваш_id_чата")}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-md text-blue-800 text-sm">
                  <p className="font-medium">Примечание:</p>
                  <p>
                    ID чата должен быть числовым значением (например, 123456789). Если вы используете username или
                    другой формат, уведомления не будут работать.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Шаг 4: Проверка настройки</CardTitle>
                <CardDescription>Отправьте тестовое сообщение для проверки работы уведомлений</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>После добавления переменных окружения и перезапуска проекта, отправьте тестовое сообщение:</p>
                <div className="flex justify-center">
                  <Button onClick={sendTestMessage} disabled={isSending} className="bg-blue-600 hover:bg-blue-700">
                    {isSending ? (
                      <>
                        <Send className="h-4 w-4 mr-2 animate-pulse" />
                        Отправка...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Отправить тестовое сообщение
                      </>
                    )}
                  </Button>
                </div>
                <div className="bg-gray-50 p-4 rounded-md text-sm">
                  <p className="font-medium">Что делать, если сообщение не приходит:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Убедитесь, что вы отправили хотя бы одно сообщение боту</li>
                    <li>Проверьте правильность токена бота и ID чата</li>
                    <li>Убедитесь, что ID чата - это числовое значение</li>
                    <li>Проверьте, не заблокирован ли бот</li>
                    <li>Перезапустите проект после добавления переменных окружения</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => router.push("/admin/dashboard")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Вернуться в админ-панель
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
