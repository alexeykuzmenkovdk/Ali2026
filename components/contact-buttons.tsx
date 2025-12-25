"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { MessageCircle, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { EmailModal } from "./email-modal"

interface ContactButtonsProps {
  variant: "header" | "large"
}

export function ContactButtons({ variant }: ContactButtonsProps) {
  const { toast } = useToast()
  const [showEmailModal, setShowEmailModal] = useState(false)

  const handleEmailClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      await navigator.clipboard.writeText("zakaz.alipayfast@gmail.com")
    } catch (err) {
      console.log("Clipboard API not available", err)
    }

    try {
      toast({
        title: "📧 Наша электронная почта",
        description: "Вы всегда можете написать нам на почту по следующему адресу - zakaz.alipayfast@gmail.com",
        duration: 5000,
      })

      setTimeout(() => {
        setShowEmailModal(true)
      }, 100)
    } catch (err) {
      setShowEmailModal(true)
    }
  }

  const contacts = [
    {
      name: "Telegram",
      icon: <MessageCircle className={variant === "large" ? "h-6 w-6" : "h-4 w-4"} />,
      href: "https://t.me/alipayfast",
      color: "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white",
      isEmail: false,
    },
    {
      name: "WhatsApp",
      icon: <Phone className={variant === "large" ? "h-6 w-6" : "h-4 w-4"} />,
      href: "https://wa.me/79243394924",
      color: "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white",
      isEmail: false,
    },
    {
      name: "Email",
      icon: <Mail className={variant === "large" ? "h-6 w-6" : "h-4 w-4"} />,
      href: "#",
      color: "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white",
      isEmail: true,
    },
  ]

  if (variant === "header") {
    return (
      <>
        {contacts.map((contact) =>
          contact.isEmail ? (
            <Button
              key={contact.name}
              variant="ghost"
              size="icon"
              className="hover:text-orange-500 cursor-pointer"
              onClick={handleEmailClick}
              aria-label={contact.name}
              type="button"
            >
              {contact.icon}
            </Button>
          ) : (
            <Button key={contact.name} variant="ghost" size="icon" asChild className="hover:text-orange-500">
              <Link href={contact.href} target="_blank" rel="noopener noreferrer" aria-label={contact.name}>
                {contact.icon}
              </Link>
            </Button>
          ),
        )}
        <EmailModal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} />
      </>
    )
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {contacts.map((contact) =>
        contact.isEmail ? (
          <Button
            key={contact.name}
            className={`${contact.color} ${variant === "large" ? "text-lg px-6 py-6 h-auto shadow-md" : ""} cursor-pointer`}
            onClick={handleEmailClick}
            type="button"
          >
            {contact.icon}
            <span className="ml-2">{contact.name}</span>
          </Button>
        ) : (
          <Button
            key={contact.name}
            className={`${contact.color} ${variant === "large" ? "text-lg px-6 py-6 h-auto shadow-md" : ""}`}
            asChild
          >
            <Link href={contact.href} target="_blank" rel="noopener noreferrer">
              {contact.icon}
              <span className="ml-2">{contact.name}</span>
            </Link>
          </Button>
        ),
      )}
      <EmailModal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} />
    </div>
  )
}
