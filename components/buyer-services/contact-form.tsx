"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MessageCircle, Phone, Mail, Loader2, Check, ExternalLink } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface BuyerServicesContactFormProps {
  isOpen?: boolean
}

export function BuyerServicesContactForm({ isOpen = false }: BuyerServicesContactFormProps) {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [contactMethod, setContactMethod] = useState("telegram")
  const [message, setMessage] = useState("")
  const [productLink, setProductLink] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [telegramUsername, setTelegramUsername] = useState("")

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `BUYER-${timestamp}${random}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const orderNumber = generateOrderNumber()

      const orderData = {
        orderNumber,
        name,
        contact,
        contactMethod,
        telegramUsername: telegramUsername || undefined,
        message,
        productLink: productLink || undefined,
        type: "buyer-services",
      }

      console.log("[CLIENT] Отправка заявки на услуги баера:", orderData)

      const response = await fetch("/api/send-buyer-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (result.success) {
        setIsSubmitted(true)
        toast({
          title: "Заявка отправлена!",
          description: result.demo
            ? "Демо-режим: Уведомление было бы отправлено в Telegram"
            : `Заявка №${orderNumber} успешно отправлена. Мы свяжемся с вами в ближайшее время.`,
        })
      } else {
        throw new Error(result.error || "Ошибка отправки заявки")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Ошибка отправки",
        description:
          error instanceof Error ? error.message : "Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.",
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
    setMessage("")
    setProductLink("")
    setTelegramUsername("")
    setIsSubmitted(false)
  }

  return (
    <div
      className={`rounded-xl border bg-white p-6 shadow-lg transition-all duration-300 ${isOpen ? "ring-2 ring-orange-300" : ""}`}
    >
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Ваше имя *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Иванов Иван Иванович"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="contact">Контактные данные *</Label>
              <Input
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Ваш номер телефона или email"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="telegramUsername">Ник в Telegram (при общении через Telegram)</Label>
              <Input
                id="telegramUsername"
                value={telegramUsername}
                onChange={(e) => setTelegramUsername(e.target.value)}
                placeholder="@username"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Предпочтительный способ связи *</Label>
              <RadioGroup value={contactMethod} onValueChange={setContactMethod} className="mt-2 flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="telegram" id="contact-telegram" />
                  <Label htmlFor="contact-telegram" className="flex items-center">
                    <MessageCircle className="mr-1 h-4 w-4" />
                    Telegram
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="whatsapp" id="contact-whatsapp" />
                  <Label htmlFor="contact-whatsapp" className="flex items-center">
                    <Phone className="mr-1 h-4 w-4" />
                    WhatsApp
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="contact-email" />
                  <Label htmlFor="contact-email" className="flex items-center">
                    <Mail className="mr-1 h-4 w-4" />
                    Email
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="productLink">Ссылка на товар (необязательно)</Label>
              <div className="relative mt-1">
                <Input
                  id="productLink"
                  value={productLink}
                  onChange={(e) => setProductLink(e.target.value)}
                  placeholder="https://item.taobao.com/item.htm?id=..."
                  className="pr-10"
                  type="url"
                />
                <ExternalLink className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Вставьте ссылку на товар с Taobao, 1688, Tmall или другой китайской площадки
              </p>
            </div>

            <div>
              <Label htmlFor="message">Описание заказа *</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Опишите, какие товары вы хотите заказать из Китая, количество, размеры, цвета и другие важные детали"
                className="mt-1 min-h-[120px]"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 py-6 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Отправка заявки...
              </>
            ) : (
              "Отправить заявку"
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">* - обязательные поля для заполнения</p>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-6 py-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold">Заявка успешно отправлена!</h3>
            <p className="mt-2 text-gray-600">
              Спасибо за обращение! Мы свяжемся с вами в ближайшее время для обсуждения деталей заказа.
            </p>
          </div>
          <Button onClick={resetForm} className="mt-4">
            Отправить еще одну заявку
          </Button>
        </div>
      )}
    </div>
  )
}
