"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Check, Copy, MessageCircle, Phone, Mail, Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface OrderFormModalProps {
  isOpen: boolean
  onClose: () => void
  yuanAmount: string
  rubleAmount: string
  exchangeRate: number
  submissionVariant?: "site" | "mini-app"
  telegramInitData?: string
  onOrderCreated?: (orderId: string) => void
}

export function OrderFormModal({
  isOpen,
  onClose,
  yuanAmount,
  rubleAmount,
  exchangeRate,
  submissionVariant = "site",
  telegramInitData,
  onOrderCreated,
}: OrderFormModalProps) {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [contactMethod, setContactMethod] = useState("telegram")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [setupInstructions, setSetupInstructions] = useState<string | null>(null)
  const [telegramUsername, setTelegramUsername] = useState("")

  const generateOrderNumber = () => {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
    return `AP-${year}${month}${day}-${random}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSetupInstructions(null)

    try {
      const newOrderNumber = generateOrderNumber()
      setOrderNumber(newOrderNumber)

      if (submissionVariant === "mini-app") {
        if (!telegramInitData) {
          throw new Error("Mini App не получил данные Telegram. Откройте заявку внутри Telegram.")
        }

        const totalRub = Number.parseFloat(rubleAmount)
        const totalCny = Number.parseFloat(yuanAmount)

        if (Number.isNaN(totalRub) || Number.isNaN(totalCny)) {
          throw new Error("Укажите сумму обмена корректно.")
        }

        const orderPayload = {
          totalRub,
          totalCny,
          rate: exchangeRate,
          contactPhone: contact,
          fullName: name,
        }

        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-telegram-init-data": telegramInitData,
          },
          body: JSON.stringify(orderPayload),
        })

        if (response.status === 409) {
          const activeResponse = await fetch("/api/orders/active", {
            headers: {
              "x-telegram-init-data": telegramInitData,
            },
          })
          if (activeResponse.ok) {
            const activeResult = await activeResponse.json()
            if (activeResult.order?.id) {
              onOrderCreated?.(activeResult.order.id)
              onClose()
              return
            }
          }
          throw new Error("Активная заявка уже существует. Откройте комнату сделки.")
        }

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({ error: "Ошибка отправки заявки" }))
          throw new Error(errorBody.error || "Ошибка отправки заявки")
        }

        const result = await response.json()
        const createdOrderId = result.order?.id as string | undefined
        if (!createdOrderId) {
          throw new Error("Не удалось создать заявку.")
        }

        onOrderCreated?.(createdOrderId)
        onClose()
        return
      }

      const orderData = {
        orderNumber: newOrderNumber,
        name,
        contact,
        contactMethod,
        telegramUsername,
        yuanAmount,
        rubleAmount,
        exchangeRate,
        comment,
      }

      const response = await fetch("/api/send-telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (!result.success && result.telegramError) {
        setError(result.error || "Ошибка отправки заявки в Telegram")
        setSetupInstructions(result.setupInstructions)
        console.error("Telegram error:", result.telegramError)

        toast({
          title: "Ошибка Telegram",
          description: result.error,
          variant: "destructive",
        })

        setIsSubmitted(true)
        return
      }

      if (!result.success) {
        throw new Error(result.error || "Ошибка отправки заявки")
      }

      if (result.demo) {
        toast({
          title: "Демо-режим",
          description: result.setupRequired
            ? "Для отправки реальных уведомлений настройте Telegram бота"
            : "Заявка обработана в демо-режиме",
        })

        if (result.setupInstructions) {
          setSetupInstructions(result.setupInstructions)
        }
      }

      setIsSubmitted(true)
      console.log("Заявка отправлена:", orderData)
    } catch (error) {
      console.error("Error submitting order:", error)
      setError(error instanceof Error ? error.message : "Неизвестная ошибка")
      toast({
        title: "Ошибка отправки заявки",
        description: "Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setName("")
    setContact("")
    setContactMethod("telegram")
    setTelegramUsername("")
    setComment("")
    setIsSubmitted(false)
    setOrderNumber("")
    setError(null)
    setSetupInstructions(null)
    onClose()
  }

  const openDirectChat = () => {
    let url = ""
    const message = `Здравствуйте! Хочу пополнить Alipay на сумму ${yuanAmount} CNY (${rubleAmount} RUB). Номер заявки: ${orderNumber}`

    switch (contactMethod) {
      case "telegram":
        url = `https://t.me/alipayfast?text=${encodeURIComponent(message)}`
        break
      case "whatsapp":
        url = `https://wa.me/79243394924?text=${encodeURIComponent(message)}`
        break
      case "email":
        url = `mailto:zakaz.alipayfast@gmail.com?subject=${encodeURIComponent(
          `Заявка на пополнение Alipay #${orderNumber}`,
        )}&body=${encodeURIComponent(message)}`
        break
    }

    if (url) {
      window.open(url, "_blank")
    }
  }

  const copyOrderDetails = () => {
    const details = `
Заявка на пополнение Alipay
Номер заявки: ${orderNumber}
Сумма: ${yuanAmount} CNY (${rubleAmount} RUB)
Курс: ${exchangeRate} RUB
    `.trim()

    navigator.clipboard.writeText(details)
    toast({
      title: "Скопировано!",
      description: "Детали заявки скопированы в буфер обмена",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetForm()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isSubmitted ? "Заявка успешно отправлена!" : "Заявка на пополнение Alipay"}
          </DialogTitle>
          <DialogDescription>
            {isSubmitted
              ? `Ваша заявка #${orderNumber} принята. Выберите удобный способ связи для продолжения.`
              : `Сумма: ${yuanAmount} CNY (${rubleAmount} RUB) по курсу ${exchangeRate} RUB`}
          </DialogDescription>
        </DialogHeader>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Ваше имя</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Иванов Иван Иванович"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contact">Контактные данные</Label>
                <Input
                  id="contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Ваш номер телефона или username"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="telegramUsername">Ник в Telegram (при общении через Telegram)</Label>
                <Input
                  id="telegramUsername"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  placeholder="@username"
                />
              </div>

              <div className="grid gap-2">
                <Label>Предпочтительный способ связи</Label>
                <RadioGroup value={contactMethod} onValueChange={setContactMethod} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="telegram" id="telegram" />
                    <Label htmlFor="telegram" className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Telegram
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="whatsapp" id="whatsapp" />
                    <Label htmlFor="whatsapp" className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      WhatsApp
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email" />
                    <Label htmlFor="email" className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="comment">Комментарий (необязательно)</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Дополнительная информация"
                  className="resize-none"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  "Отправить заявку"
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-center p-4 bg-green-50 rounded-md text-green-600">
              <Check className="h-6 w-6 mr-2" />
              <span>Заявка успешно отправлена!</span>
            </div>

            {error && (
              <div className="flex items-start p-4 bg-amber-50 rounded-md text-amber-700">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="font-medium">{error}</p>
                  {setupInstructions && (
                    <div className="text-xs space-y-1 mt-2">
                      <p className="font-medium">Инструкции по настройке:</p>
                      <pre className="whitespace-pre-wrap bg-amber-100 p-2 rounded text-xs">{setupInstructions}</pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <span className="font-medium">Номер заявки: {orderNumber}</span>
              <Button variant="ghost" size="sm" onClick={copyOrderDetails}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500">Выберите способ связи для продолжения:</p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  className="flex flex-col items-center py-4 h-auto"
                  onClick={() => {
                    setContactMethod("telegram")
                    openDirectChat()
                  }}
                >
                  <MessageCircle className="h-6 w-6 mb-1" />
                  <span>Telegram</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center py-4 h-auto"
                  onClick={() => {
                    setContactMethod("whatsapp")
                    openDirectChat()
                  }}
                >
                  <Phone className="h-6 w-6 mb-1" />
                  <span>WhatsApp</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center py-4 h-auto"
                  onClick={() => {
                    setContactMethod("email")
                    openDirectChat()
                  }}
                >
                  <Mail className="h-6 w-6 mb-1" />
                  <span>Email</span>
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={resetForm}>Закрыть</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default OrderFormModal
