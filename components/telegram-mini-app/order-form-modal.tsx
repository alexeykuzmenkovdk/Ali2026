"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface MiniAppOrderFormModalProps {
  isOpen: boolean
  onClose: () => void
  yuanAmount: string
  rubleAmount: string
  exchangeRate: number
  telegramInitData: string
  onOrderCreated: (orderId: string) => void
}

export function MiniAppOrderFormModal({
  isOpen,
  onClose,
  yuanAmount,
  rubleAmount,
  exchangeRate,
  telegramInitData,
  onOrderCreated,
}: MiniAppOrderFormModalProps) {
  const [fullName, setFullName] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setFullName("")
    setContactPhone("")
    setError(null)
    setIsSubmitting(false)
    onClose()
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (!telegramInitData) {
        throw new Error("Откройте мини-приложение внутри Telegram, чтобы отправить заявку.")
      }

      const totalRub = Number.parseFloat(rubleAmount)
      const totalCny = Number.parseFloat(yuanAmount)

      if (Number.isNaN(totalRub) || Number.isNaN(totalCny)) {
        throw new Error("Укажите корректные суммы для расчета сделки.")
      }

      const orderPayload = {
        totalRub,
        totalCny,
        rate: exchangeRate,
        contactPhone,
        fullName,
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
        const activeResult = await activeResponse.json()
        if (activeResult.order?.id) {
          onOrderCreated(activeResult.order.id)
          onClose()
          return
        }
      }

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Telegram не подтвердил данные. Откройте заявку внутри мини-приложения.")
        }

        const errorBody = await response.json().catch(() => ({ error: "Ошибка отправки заявки" }))
        throw new Error(errorBody.error || "Ошибка отправки заявки")
      }

      const result = await response.json()
      const createdOrderId = result.order?.id as string | undefined
      if (!createdOrderId) {
        throw new Error("Не удалось создать заявку.")
      }

      onOrderCreated(createdOrderId)
      onClose()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Неизвестная ошибка")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetForm()}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Заявка на сделку</DialogTitle>
          <DialogDescription>
            Проверьте параметры сделки, заполните контакты и отправьте заявку администратору.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-emerald-200/40 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
          <div className="flex items-center justify-between">
            <span className="text-emerald-700">Сумма сделки</span>
            <span className="font-semibold">
              {yuanAmount} CNY · {rubleAmount} RUB
            </span>
          </div>
          <div className="mt-1 text-xs text-emerald-700">
            Курс сделки: 1 CNY = {exchangeRate.toFixed(2)} RUB
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <div className="grid gap-2">
              <Label htmlFor="mini-full-name">Имя и фамилия</Label>
              <Input
                id="mini-full-name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Например, Иван Иванов"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="mini-contact-phone">Телефон для связи</Label>
              <Input
                id="mini-contact-phone"
                value={contactPhone}
                onChange={(event) => setContactPhone(event.target.value)}
                placeholder="+7 900 000-00-00"
                required
              />
            </div>

            <p className="text-xs text-slate-500">
              Контакты нужны, чтобы администратор быстро подтвердил сделку и написал вам.
            </p>
          </div>

          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <DialogFooter className="gap-2 sm:gap-3">
            <Button type="button" variant="outline" onClick={resetForm}>
              Отмена
            </Button>
            <Button type="submit" className="bg-emerald-500 text-slate-950 hover:bg-emerald-400" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Отправляем заявку...
                </>
              ) : (
                "Отправить заявку"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default MiniAppOrderFormModal
