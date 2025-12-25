"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface BackToHomeProps {
  className?: string
}

export function BackToHome({ className = "" }: BackToHomeProps) {
  const router = useRouter()

  const handleBackToHome = () => {
    router.push("/")
  }

  return (
    <div className={`container mt-6 ${className}`}>
      <Button
        variant="ghost"
        onClick={handleBackToHome}
        className="flex items-center gap-2 text-gray-600 hover:text-orange-500"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Вернуться на главную</span>
      </Button>
    </div>
  )
}
