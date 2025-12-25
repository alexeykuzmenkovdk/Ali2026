"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Lock } from "lucide-react"
import { Logo } from "@/components/logo-component"

export default function AdminLogin() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password) {
      setError("Пожалуйста, введите пароль")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log("Отправка запроса аутентификации...")
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()
      console.log("Ответ аутентификации:", data)

      if (response.ok && data.success) {
        console.log("Аутентификация успешна, сохранение токена...")

        // Сохраняем токен сессии в localStorage
        localStorage.setItem("admin_session_token", data.sessionToken)
        localStorage.setItem("admin_authenticated", "true")

        console.log("Токен сохранен:", data.sessionToken)

        // Проверяем, что токен действительно сохранился
        const savedToken = localStorage.getItem("admin_session_token")
        console.log("Проверка сохраненного токена:", savedToken)

        if (savedToken) {
          console.log("Перенаправление на админ-панель...")
          window.location.href = "/admin/dashboard"
        } else {
          setError("Ошибка сохранения сессии")
        }
      } else {
        setError(data.message || "Ошибка аутентификации")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Произошла ошибка при попытке входа")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo size="medium" />
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Вход в админ-панель</h1>
          <p className="mt-2 text-gray-600">Введите пароль для доступа к административным функциям</p>
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle>Аутентификация</CardTitle>
            <CardDescription>Доступ только для авторизованных пользователей</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Пароль
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10 border-2"
                      placeholder="Введите пароль"
                    />
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {error}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                disabled={isLoading}
              >
                {isLoading ? "Вход..." : "Войти"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
