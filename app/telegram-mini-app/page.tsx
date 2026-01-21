"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface SubmissionResult {
  success: boolean
  message?: string
  demo?: boolean
  error?: string
  orderNumber?: string
}

export default function TelegramMiniAppPage() {
  const [isTelegram, setIsTelegram] = useState(false)
  const [initData, setInitData] = useState("")
  const [userLabel, setUserLabel] = useState("Гость")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<SubmissionResult | null>(null)

  const [form, setForm] = useState({
    name: "",
    contact: "",
    contactMethod: "telegram",
    telegramUsername: "",
    productLink: "",
    message: "",
  })

  const orderNumber = useMemo(() => `TG-${Date.now().toString().slice(-6)}`, [])

  useEffect(() => {
    const telegramWebApp = window.Telegram?.WebApp
    if (telegramWebApp) {
      telegramWebApp.ready()
      setIsTelegram(true)
      setInitData(telegramWebApp.initData)
      const user = telegramWebApp.initDataUnsafe?.user
      if (user?.username) {
        setForm((prev) => ({ ...prev, telegramUsername: user.username }))
        setUserLabel(`@${user.username}`)
      } else if (user?.first_name) {
        setUserLabel(user.first_name)
      }
      return
    }

    setIsTelegram(false)
    setUserLabel("Гость")
  }, [])

  const handleChange = (field: keyof typeof form) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    setResult(null)

    try {
      const response = await fetch("/api/send-buyer-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(initData ? { "x-telegram-init-data": initData } : {}),
        },
        body: JSON.stringify({
          orderNumber,
          name: form.name.trim(),
          contact: form.contact.trim(),
          contactMethod: form.contactMethod,
          telegramUsername: form.telegramUsername.trim() || undefined,
          message: form.message.trim(),
          productLink: form.productLink.trim() || undefined,
          type: "telegram-mini-app",
        }),
      })

      const data = (await response.json()) as SubmissionResult
      if (!response.ok) {
        setResult({ success: false, error: data.error || "Ошибка отправки заявки" })
        return
      }

      setResult({
        success: true,
        message: data.message || "Заявка успешно отправлена",
        demo: data.demo,
        orderNumber: data.orderNumber || orderNumber,
      })
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Неизвестная ошибка",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-widest text-slate-400">Telegram Mini App</p>
          <h1 className="text-3xl font-semibold">Отправка заявки</h1>
          <p className="text-slate-300">
            Минимальный одностраничный интерфейс для проверки подключения и отправки заявок.
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
            <CardTitle className="text-lg">Форма заявки</CardTitle>
            <CardDescription className="text-slate-400">
              Заполните данные, чтобы проверить отправку запроса в API.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Ваше имя</label>
              <Input
                className="border-slate-800 bg-slate-950 text-white"
                value={form.name}
                onChange={(event) => handleChange("name")(event.target.value)}
                placeholder="Иван Иванов"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Контакт для связи</label>
              <Input
                className="border-slate-800 bg-slate-950 text-white"
                value={form.contact}
                onChange={(event) => handleChange("contact")(event.target.value)}
                placeholder="+7 900 000-00-00"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Способ связи</label>
              <select
                className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white"
                value={form.contactMethod}
                onChange={(event) => handleChange("contactMethod")(event.target.value)}
              >
                <option value="telegram">Telegram</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
                <option value="phone">Телефон</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Ник в Telegram (если есть)</label>
              <Input
                className="border-slate-800 bg-slate-950 text-white"
                value={form.telegramUsername}
                onChange={(event) => handleChange("telegramUsername")(event.target.value)}
                placeholder="@username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Ссылка на товар (необязательно)</label>
              <Input
                className="border-slate-800 bg-slate-950 text-white"
                value={form.productLink}
                onChange={(event) => handleChange("productLink")(event.target.value)}
                placeholder="https://"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Описание заявки</label>
              <Textarea
                className="border-slate-800 bg-slate-950 text-white"
                value={form.message}
                onChange={(event) => handleChange("message")(event.target.value)}
                placeholder="Что именно нужно заказать, сроки, бюджет..."
              />
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-400">
              Номер заявки: <span className="text-slate-200">{orderNumber}</span>
            </div>

            <Button
              className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400"
              onClick={handleSubmit}
              disabled={isSubmitting || !form.name || !form.contact || !form.message}
            >
              {isSubmitting ? "Отправляем..." : "Отправить заявку"}
            </Button>

            {result && (
              <div
                className={`rounded-lg border px-3 py-3 text-sm ${
                  result.success ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200" : "border-rose-500/40 bg-rose-500/10 text-rose-200"
                }`}
              >
                {result.success ? (
                  <div className="space-y-1">
                    <p className="font-medium">{result.message}</p>
                    <p className="text-xs text-emerald-200/80">Номер заявки: {result.orderNumber}</p>
                    {result.demo && <p className="text-xs text-emerald-200/80">Демо-режим: Telegram не настроен.</p>}
                  </div>
                ) : (
                  <p className="font-medium">{result.error}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
