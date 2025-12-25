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
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Star } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ReviewFormModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ReviewFormModal({ isOpen, onClose }: ReviewFormModalProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [reviewData, setReviewData] = useState({
    name: "",
    location: "",
    text: "",
    rating: 5,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setReviewData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRatingChange = (rating: number) => {
    setReviewData((prev) => ({ ...prev, rating }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Отправляем данные на сервер
      const response = await fetch("/api/send-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...reviewData,
          date: new Date().toLocaleDateString("ru-RU"),
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Ошибка отправки отзыва")
      }

      // Если это демо-режим, показываем уведомление
      if (result.demo) {
        toast({
          title: "Демо-режим",
          description: "Для отправки реальных уведомлений настройте Telegram бота",
        })
      }

      // Отмечаем успешную отправку
      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "Ошибка отправки отзыва",
        description: "Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setReviewData({
      name: "",
      location: "",
      text: "",
      rating: 5,
    })
    setIsSubmitted(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetForm()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{isSubmitted ? "Спасибо за ваш отзыв!" : "Оставить отзыв"}</DialogTitle>
          <DialogDescription>
            {isSubmitted
              ? "Ваш отзыв отправлен на модерацию и скоро будет опубликован."
              : "Поделитесь своим опытом использования нашего сервиса."}
          </DialogDescription>
        </DialogHeader>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Ваше имя</Label>
                <Input
                  id="name"
                  name="name"
                  value={reviewData.name}
                  onChange={handleChange}
                  placeholder="Иван Иванов"
                  required
                  className="border-orange-200 focus:border-orange-500"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location">Город</Label>
                <Input
                  id="location"
                  name="location"
                  value={reviewData.location}
                  onChange={handleChange}
                  placeholder="Владивосток"
                  required
                  className="border-orange-200 focus:border-orange-500"
                />
              </div>

              <div className="grid gap-2">
                <Label>Ваша оценка</Label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className="h-6 w-6 cursor-pointer"
                        fill={star <= reviewData.rating ? "#f59e0b" : "none"}
                        stroke={star <= reviewData.rating ? "#f59e0b" : "currentColor"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="text">Ваш отзыв</Label>
                <Textarea
                  id="text"
                  name="text"
                  value={reviewData.text}
                  onChange={handleChange}
                  placeholder="Поделитесь своими впечатлениями о нашем сервисе"
                  className="min-h-[120px] resize-none border-orange-200 focus:border-orange-500"
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  "Отправить отзыв"
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-center p-4 bg-green-50 rounded-md text-green-600">
              <div className="text-center">
                <p className="font-medium">Спасибо за ваш отзыв!</p>
                <p className="text-sm mt-1">Ваш отзыв отправлен на модерацию и будет опубликован после проверки.</p>
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={resetForm}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                Закрыть
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
