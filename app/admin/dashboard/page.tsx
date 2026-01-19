"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  LogOut,
  RefreshCw,
  Home,
  ClipboardList,
  MessageSquareText,
  PackagePlus,
} from "lucide-react"
import { Logo } from "@/components/logo-component"
import { useToast } from "@/components/ui/use-toast"

interface AdminOrder {
  id: string
  userId: number
  status: string
  totalRub: number
  totalCny: number
  rate: number
  alipayId?: string | null
  fullName?: string | null
  contactUsername?: string | null
  contactPhone?: string | null
  createdAt: string
  updatedAt: string
  messageCount: number
  lastMessage: string | null
}

interface AdminMessage {
  id: string
  senderRole: "client" | "admin"
  text?: string
  fileUrl?: string
  createdAt: string
}

interface ShowcaseItem {
  id: string
  title: string
  imageUrl: string
  priceCny: number
  priceRub: number
  benefitRub: number
  isPublished: boolean
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("orders")

  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [selectedOrderId, setSelectedOrderId] = useState<string>("")
  const [orderMessages, setOrderMessages] = useState<AdminMessage[]>([])
  const [orderMessageText, setOrderMessageText] = useState<string>("")
  const [isOrdersLoading, setIsOrdersLoading] = useState<boolean>(false)
  const [isMessagesLoading, setIsMessagesLoading] = useState<boolean>(false)
  const [isMessageSending, setIsMessageSending] = useState<boolean>(false)
  const [isQuickActionSending, setIsQuickActionSending] = useState<boolean>(false)

  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([])
  const [showcaseTitle, setShowcaseTitle] = useState<string>("")
  const [showcaseImageUrl, setShowcaseImageUrl] = useState<string>("")
  const [showcasePriceCny, setShowcasePriceCny] = useState<string>("")
  const [showcasePriceRub, setShowcasePriceRub] = useState<string>("")
  const [showcaseBenefitRub, setShowcaseBenefitRub] = useState<string>("")
  const [showcasePublished, setShowcasePublished] = useState<boolean>(true)
  const [isShowcaseLoading, setIsShowcaseLoading] = useState<boolean>(false)
  const [isShowcaseSaving, setIsShowcaseSaving] = useState<boolean>(false)

  const router = useRouter()
  const { toast } = useToast()
  const mountedRef = useRef(true)

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Проверка аутентификации при загрузке стран��цы
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = localStorage.getItem("admin_authenticated")
        const sessionToken = localStorage.getItem("admin_session_token")

        console.log("Проверка аутентификации из localStorage:", isAuthenticated)
        console.log("Токен сессии:", sessionToken)

        if (!isAuthenticated || !sessionToken) {
          console.log("Нет аутентификации, перенаправление на логин")
          router.push("/admin/login")
          return
        }

        // Проверяем токен на сервере
        const response = await fetch(`/api/admin/auth?token=${sessionToken}`)
        const data = await response.json()

        if (!data.authenticated) {
          console.log("Токен недействителен, перенаправление на логин")
          localStorage.removeItem("admin_authenticated")
          localStorage.removeItem("admin_session_token")
          router.push("/admin/login")
          return
        }

        console.log("Аутентификация подтверждена")

        if (mountedRef.current) {
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Ошибка при проверке аутентификации:", error)
        if (mountedRef.current) {
          router.push("/admin/login")
        }
      }
    }

    checkAuth()
  }, [router])


  // Функция для проверки аутентификации перед API запросами
  const checkAuthBeforeRequest = () => {
    const sessionToken = localStorage.getItem("admin_session_token")
    if (!sessionToken) {
      router.push("/admin/login")
      return null
    }
    return sessionToken
  }


  const fetchOrders = async () => {
    const sessionToken = checkAuthBeforeRequest()
    if (!sessionToken) return

    setIsOrdersLoading(true)
    try {
      const response = await fetch(`/api/admin/orders?token=${sessionToken}`)
      const data = await response.json()
      if (response.ok && mountedRef.current) {
        setOrders(data.orders ?? [])
        if (!selectedOrderId && data.orders?.length > 0) {
          setSelectedOrderId(data.orders[0].id)
        }
      }
    } catch (error) {
      console.error("Orders fetch error:", error)
      if (mountedRef.current) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить список заявок",
          variant: "destructive",
        })
      }
    } finally {
      if (mountedRef.current) {
        setIsOrdersLoading(false)
      }
    }
  }

  const fetchOrderMessages = async (orderId: string) => {
    const sessionToken = checkAuthBeforeRequest()
    if (!sessionToken) return

    setIsMessagesLoading(true)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/messages?token=${sessionToken}`)
      const data = await response.json()
      if (response.ok && mountedRef.current) {
        setOrderMessages(data.messages ?? [])
      }
    } catch (error) {
      console.error("Messages fetch error:", error)
      if (mountedRef.current) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить сообщения по заявке",
          variant: "destructive",
        })
      }
    } finally {
      if (mountedRef.current) {
        setIsMessagesLoading(false)
      }
    }
  }

  const sendOrderMessage = async () => {
    const sessionToken = checkAuthBeforeRequest()
    if (!sessionToken || !selectedOrderId) return

    if (!orderMessageText.trim()) {
      toast({
        title: "Пустое сообщение",
        description: "Введите текст сообщения перед отправкой.",
        variant: "destructive",
      })
      return
    }

    setIsMessageSending(true)
    try {
      const response = await fetch(`/api/admin/orders/${selectedOrderId}/messages?token=${sessionToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: orderMessageText }),
      })
      const data = await response.json()
      if (response.ok && mountedRef.current) {
        setOrderMessageText("")
        setOrderMessages((prev) => [...prev, data.message])
        toast({
          title: "Сообщение отправлено",
          description: "Клиент получил уведомление в Telegram.",
        })
      }
    } catch (error) {
      console.error("Send message error:", error)
      if (mountedRef.current) {
        toast({
          title: "Ошибка",
          description: "Не удалось отправить сообщение клиенту",
          variant: "destructive",
        })
      }
    } finally {
      if (mountedRef.current) {
        setIsMessageSending(false)
      }
    }
  }

  const sendQuickAction = async (text: string) => {
    const sessionToken = checkAuthBeforeRequest()
    if (!sessionToken || !selectedOrderId) return

    setIsQuickActionSending(true)
    try {
      const response = await fetch(`/api/admin/orders/${selectedOrderId}/messages?token=${sessionToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      if (!response.ok) {
        throw new Error("Failed to send quick action")
      }
      toast({
        title: "Сообщение отправлено",
        description: "Запрос отправлен клиенту в Telegram.",
      })
    } catch (error) {
      console.error("Quick action error:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось отправить запрос клиенту",
        variant: "destructive",
      })
    } finally {
      if (mountedRef.current) {
        setIsQuickActionSending(false)
      }
    }
  }

  const fetchShowcase = async () => {
    const sessionToken = checkAuthBeforeRequest()
    if (!sessionToken) return

    setIsShowcaseLoading(true)
    try {
      const response = await fetch(`/api/admin/showcase?token=${sessionToken}`)
      const data = await response.json()
      if (response.ok && mountedRef.current) {
        setShowcaseItems(data.items ?? [])
      }
    } catch (error) {
      console.error("Showcase fetch error:", error)
      if (mountedRef.current) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить витрину",
          variant: "destructive",
        })
      }
    } finally {
      if (mountedRef.current) {
        setIsShowcaseLoading(false)
      }
    }
  }

  const createShowcaseItem = async () => {
    const sessionToken = checkAuthBeforeRequest()
    if (!sessionToken) return

    if (!showcaseTitle || !showcaseImageUrl) {
      toast({
        title: "Недостаточно данных",
        description: "Заполните название и ссылку на изображение.",
        variant: "destructive",
      })
      return
    }

    setIsShowcaseSaving(true)
    try {
      const response = await fetch(`/api/admin/showcase?token=${sessionToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: showcaseTitle,
          imageUrl: showcaseImageUrl,
          priceCny: showcasePriceCny,
          priceRub: showcasePriceRub,
          benefitRub: showcaseBenefitRub,
          isPublished: showcasePublished,
        }),
      })
      const data = await response.json()
      if (response.ok && mountedRef.current) {
        setShowcaseItems((prev) => [data.item, ...prev])
        setShowcaseTitle("")
        setShowcaseImageUrl("")
        setShowcasePriceCny("")
        setShowcasePriceRub("")
        setShowcaseBenefitRub("")
        setShowcasePublished(true)
        toast({ title: "Позиция добавлена", description: "Витрина обновлена." })
      }
    } catch (error) {
      console.error("Showcase create error:", error)
      if (mountedRef.current) {
        toast({
          title: "Ошибка",
          description: "Не удалось создать позицию витрины",
          variant: "destructive",
        })
      }
    } finally {
      if (mountedRef.current) {
        setIsShowcaseSaving(false)
      }
    }
  }

  const toggleShowcasePublish = async (item: ShowcaseItem) => {
    const sessionToken = checkAuthBeforeRequest()
    if (!sessionToken) return

    try {
      const response = await fetch(`/api/admin/showcase?token=${sessionToken}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, isPublished: !item.isPublished }),
      })
      const data = await response.json()
      if (response.ok && mountedRef.current) {
        setShowcaseItems((prev) =>
          prev.map((entry) => (entry.id === item.id ? { ...entry, isPublished: data.item?.isPublished } : entry)),
        )
      }
    } catch (error) {
      console.error("Showcase publish error:", error)
      if (mountedRef.current) {
        toast({
          title: "Ошибка",
          description: "Не удалось обновить статус публикации",
          variant: "destructive",
        })
      }
    }
  }

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders()
      const interval = window.setInterval(fetchOrders, 10000)
      return () => window.clearInterval(interval)
    }
    if (activeTab === "showcase") {
      fetchShowcase()
    }
  }, [activeTab])

  useEffect(() => {
    if (!selectedOrderId || activeTab !== "orders") return
    fetchOrderMessages(selectedOrderId)
    const interval = window.setInterval(() => fetchOrderMessages(selectedOrderId), 5000)
    return () => window.clearInterval(interval)
  }, [selectedOrderId, activeTab])

  // Выход из админ-панели
  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated")
    localStorage.removeItem("admin_session_token")
    router.push("/admin/login")
  }

  const formatOrderLabel = (orderItem: AdminOrder) => {
    const dateLabel = new Date(orderItem.createdAt).toLocaleDateString("ru-RU")
    const amountLabel = `${orderItem.totalRub.toLocaleString("ru-RU")} ₽`
    const contactLabel = orderItem.contactUsername
      ? `@${orderItem.contactUsername}`
      : orderItem.contactPhone
        ? orderItem.contactPhone
        : `ID ${orderItem.userId}`
    return `${dateLabel} • ${amountLabel} • ${contactLabel}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-500" />
          <p className="mt-4 text-gray-600">Загрузка...</p>
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
            <span className="text-lg font-bold text-gray-800">Админ-панель</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="text-gray-600">
              <Home className="h-4 w-4 mr-2" />
              На главную
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600">
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="orders" className="text-base py-3">
              <ClipboardList className="h-4 w-4 mr-2" />
              Заявки
            </TabsTrigger>
            <TabsTrigger value="showcase" className="text-base py-3">
              <PackagePlus className="h-4 w-4 mr-2" />
              Витрина
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
              <Card className="border-2 shadow-md">
                <CardHeader>
                  <CardTitle>Входящие заявки</CardTitle>
                  <CardDescription>Список заказов, поступивших от клиентов</CardDescription>
                </CardHeader>
                <CardContent>
                  {isOrdersLoading ? (
                    <div className="text-sm text-gray-500">Загрузка заявок...</div>
                  ) : orders.length === 0 ? (
                    <div className="text-sm text-gray-500">Заявок пока нет.</div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <button
                          key={order.id}
                          type="button"
                          onClick={() => setSelectedOrderId(order.id)}
                          className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                            selectedOrderId === order.id ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-white"
                          }`}
                        >
                          <div className="text-sm font-semibold text-gray-900">{formatOrderLabel(order)}</div>
                          <div className="mt-2 text-xs text-gray-600">
                            Статус: <span className="font-medium">{order.status}</span>
                          </div>
                          <div className="mt-1 text-xs text-gray-600">
                            Сумма: <span className="font-medium">{order.totalRub} ₽</span>
                          </div>
                          {order.lastMessage && (
                            <div className="mt-2 text-xs text-gray-500 line-clamp-2">Последнее: {order.lastMessage}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={fetchOrders} disabled={isOrdersLoading} className="w-full">
                    <RefreshCw className={`h-4 w-4 mr-2 ${isOrdersLoading ? "animate-spin" : ""}`} />
                    Обновить список
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-2 shadow-md">
                <CardHeader>
                  <CardTitle>Комната сделки</CardTitle>
                  <CardDescription>Пишите сообщения клиенту и отправляйте уведомления</CardDescription>
                </CardHeader>
                <CardContent>
                  {!selectedOrderId ? (
                    <div className="text-sm text-gray-500">Выберите заявку слева, чтобы увидеть переписку.</div>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-lg border bg-gray-50 p-4 text-sm">
                        <div className="font-medium">Заявка #{selectedOrderId.slice(0, 6)}</div>
                        <div className="mt-1 text-gray-600">
                          Клиент:{" "}
                          <span className="font-medium">
                            {(() => {
                              const currentOrder = orders.find((order) => order.id === selectedOrderId)
                              if (!currentOrder) return "-"
                              if (currentOrder.contactUsername) return `@${currentOrder.contactUsername}`
                              if (currentOrder.contactPhone) return currentOrder.contactPhone
                              return `ID ${currentOrder.userId}`
                            })()}
                          </span>
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <Button
                          variant="outline"
                          disabled={isQuickActionSending}
                          onClick={() =>
                            sendQuickAction(
                              "Пожалуйста, отправьте QR-код для оплаты или скриншот экрана с QR-кодом. После этого вернитесь в мини-приложение.",
                            )
                          }
                        >
                          Запросить QR-код
                        </Button>
                        <Button
                          variant="outline"
                          disabled={isQuickActionSending}
                          onClick={() =>
                            sendQuickAction(
                              "Пожалуйста, отправьте фото/видео подтверждения или нужный файл. После отправки вернитесь в мини-приложение.",
                            )
                          }
                        >
                          Запросить медиа
                        </Button>
                      </div>

                      <div className="rounded-lg border bg-white p-4 text-sm">
                        <div className="font-medium text-gray-900">QR-код Telegram</div>
                        <p className="mt-1 text-xs text-gray-500">Можно отправить клиенту для быстрого перехода.</p>
                        <img src="/telegram-qr.png" alt="QR Telegram" className="mt-3 h-32 w-32 rounded-md border" />
                      </div>

                      <div className="max-h-[320px] space-y-3 overflow-y-auto rounded-lg border bg-white p-4">
                        {isMessagesLoading ? (
                          <div className="text-sm text-gray-500">Загрузка сообщений...</div>
                        ) : orderMessages.length === 0 ? (
                          <div className="text-sm text-gray-500">Сообщений пока нет.</div>
                        ) : (
                          orderMessages.map((message) => (
                            <div
                              key={message.id}
                              className={`rounded-lg px-3 py-2 text-sm ${
                                message.senderRole === "admin"
                                  ? "ml-auto w-fit bg-orange-100 text-gray-800"
                                  : "mr-auto w-fit bg-gray-100 text-gray-700"
                              }`}
                            >
                              <div className="text-xs text-gray-500">
                                {message.senderRole === "admin" ? "Администратор" : "Клиент"} ·{" "}
                                {new Date(message.createdAt).toLocaleString("ru-RU")}
                              </div>
                              <div className="mt-1 whitespace-pre-wrap">{message.text ?? "—"}</div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="order-message">Сообщение клиенту</Label>
                        <Textarea
                          id="order-message"
                          value={orderMessageText}
                          onChange={(event) => setOrderMessageText(event.target.value)}
                          placeholder="Введите текст уведомления или сообщение по заявке"
                          className="min-h-[120px]"
                        />
                        <Button
                          onClick={sendOrderMessage}
                          disabled={isMessageSending || !selectedOrderId}
                          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                        >
                          <MessageSquareText className="h-4 w-4 mr-2" />
                          {isMessageSending ? "Отправка..." : "Отправить сообщение"}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="showcase">
            <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
              <Card className="border-2 shadow-md">
                <CardHeader>
                  <CardTitle>Новая позиция витрины</CardTitle>
                  <CardDescription>Добавьте товар и опубликуйте его на витрине</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="showcase-title">Название</Label>
                    <Input
                      id="showcase-title"
                      value={showcaseTitle}
                      onChange={(event) => setShowcaseTitle(event.target.value)}
                      placeholder="Например: AirPods Pro"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="showcase-image">Ссылка на изображение</Label>
                    <Input
                      id="showcase-image"
                      value={showcaseImageUrl}
                      onChange={(event) => setShowcaseImageUrl(event.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="showcase-price-cny">Цена CNY</Label>
                      <Input
                        id="showcase-price-cny"
                        value={showcasePriceCny}
                        onChange={(event) => setShowcasePriceCny(event.target.value)}
                        placeholder="1200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="showcase-price-rub">Цена RUB</Label>
                      <Input
                        id="showcase-price-rub"
                        value={showcasePriceRub}
                        onChange={(event) => setShowcasePriceRub(event.target.value)}
                        placeholder="18500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="showcase-benefit">Выгода RUB</Label>
                      <Input
                        id="showcase-benefit"
                        value={showcaseBenefitRub}
                        onChange={(event) => setShowcaseBenefitRub(event.target.value)}
                        placeholder="2500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <div className="text-sm font-medium">Публиковать сразу</div>
                      <div className="text-xs text-gray-500">Если выключить, позиция останется скрытой.</div>
                    </div>
                    <Switch checked={showcasePublished} onCheckedChange={setShowcasePublished} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={createShowcaseItem}
                    disabled={isShowcaseSaving}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  >
                    <PackagePlus className="h-4 w-4 mr-2" />
                    {isShowcaseSaving ? "Сохранение..." : "Добавить в витрину"}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-2 shadow-md">
                <CardHeader>
                  <CardTitle>Управление витриной</CardTitle>
                  <CardDescription>Публикуйте и скрывайте позиции</CardDescription>
                </CardHeader>
                <CardContent>
                  {isShowcaseLoading ? (
                    <div className="text-sm text-gray-500">Загрузка витрины...</div>
                  ) : showcaseItems.length === 0 ? (
                    <div className="text-sm text-gray-500">Позиции не найдены.</div>
                  ) : (
                    <div className="space-y-3">
                      {showcaseItems.map((item) => (
                        <div key={item.id} className="rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-semibold">{item.title}</div>
                              <div className="text-xs text-gray-500">
                                {item.priceCny} CNY · {item.priceRub} ₽ · выгода {item.benefitRub} ₽
                              </div>
                            </div>
                            <Button
                              variant={item.isPublished ? "outline" : "default"}
                              onClick={() => toggleShowcasePublish(item)}
                              size="sm"
                            >
                              {item.isPublished ? "Скрыть" : "Опубликовать"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={fetchShowcase} disabled={isShowcaseLoading} className="w-full">
                    <RefreshCw className={`h-4 w-4 mr-2 ${isShowcaseLoading ? "animate-spin" : ""}`} />
                    Обновить витрину
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  )
}
