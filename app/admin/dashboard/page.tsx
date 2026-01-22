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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  LogOut,
  RefreshCw,
  Home,
  ClipboardList,
  MessageSquareText,
  PackagePlus,
  BookOpen,
} from "lucide-react"
import { Logo } from "@/components/logo-component"
import { useToast } from "@/components/ui/use-toast"
import { BLOG_CATEGORIES } from "@/lib/blog"
import { RichTextEditor } from "@/components/rich-text-editor"

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
  description?: string
  priceCny: number
  priceRub: number
  benefitRub: number
  isPublished: boolean
}

interface BlogPost {
  id: string
  title: string
  slug: string
  category: string
  excerpt?: string | null
  content?: string | null
  coverImageUrl?: string | null
  coverVideoUrl?: string | null
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("orders")

  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [selectedOrderId, setSelectedOrderId] = useState<string>("")
  const [orderMessages, setOrderMessages] = useState<AdminMessage[]>([])
  const [orderMessageText, setOrderMessageText] = useState<string>("")
  const [orderMessageFile, setOrderMessageFile] = useState<File | null>(null)
  const [isOrdersLoading, setIsOrdersLoading] = useState<boolean>(false)
  const [isMessagesLoading, setIsMessagesLoading] = useState<boolean>(false)
  const [isMessageSending, setIsMessageSending] = useState<boolean>(false)
  const [isMessageUploading, setIsMessageUploading] = useState<boolean>(false)
  const [isQuickActionSending, setIsQuickActionSending] = useState<boolean>(false)
  const [isOrderClosing, setIsOrderClosing] = useState<boolean>(false)
  const [mediaPreview, setMediaPreview] = useState<{ url: string; type: "image" | "video" } | null>(null)
  const [isOrderChatPinnedToBottom, setIsOrderChatPinnedToBottom] = useState<boolean>(true)
  const orderChatContainerRef = useRef<HTMLDivElement | null>(null)
  const orderChatBottomRef = useRef<HTMLDivElement | null>(null)
  const selectedOrderIdRef = useRef<string>("")

  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([])
  const [showcaseTitle, setShowcaseTitle] = useState<string>("")
  const [showcaseImageUrl, setShowcaseImageUrl] = useState<string>("")
  const [showcaseDescription, setShowcaseDescription] = useState<string>("")
  const [showcasePriceCny, setShowcasePriceCny] = useState<string>("")
  const [showcasePriceRub, setShowcasePriceRub] = useState<string>("")
  const [showcaseBenefitRub, setShowcaseBenefitRub] = useState<string>("")
  const [showcasePublished, setShowcasePublished] = useState<boolean>(true)
  const [isShowcaseLoading, setIsShowcaseLoading] = useState<boolean>(false)
  const [isShowcaseSaving, setIsShowcaseSaving] = useState<boolean>(false)
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false)
  const [isShowcaseUpdating, setIsShowcaseUpdating] = useState<boolean>(false)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState<string>("")
  const [editImageUrl, setEditImageUrl] = useState<string>("")
  const [editDescription, setEditDescription] = useState<string>("")
  const [editPriceCny, setEditPriceCny] = useState<string>("")
  const [editPriceRub, setEditPriceRub] = useState<string>("")
  const [editBenefitRub, setEditBenefitRub] = useState<string>("")
  const [editPublished, setEditPublished] = useState<boolean>(false)
  const [isEditImageUploading, setIsEditImageUploading] = useState<boolean>(false)

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [blogTitle, setBlogTitle] = useState<string>("")
  const [blogSlug, setBlogSlug] = useState<string>("")
  const [blogCategory, setBlogCategory] = useState<string>(BLOG_CATEGORIES[0]?.slug ?? "popolnenie-alipay")
  const [blogExcerpt, setBlogExcerpt] = useState<string>("")
  const [blogContent, setBlogContent] = useState<string>("")
  const [blogCoverImageUrl, setBlogCoverImageUrl] = useState<string>("")
  const [blogCoverVideoUrl, setBlogCoverVideoUrl] = useState<string>("")
  const [blogPublished, setBlogPublished] = useState<boolean>(true)
  const [isBlogLoading, setIsBlogLoading] = useState<boolean>(false)
  const [isBlogSaving, setIsBlogSaving] = useState<boolean>(false)
  const [isBlogUpdating, setIsBlogUpdating] = useState<boolean>(false)
  const [isBlogMediaUploading, setIsBlogMediaUploading] = useState<boolean>(false)
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null)
  const [editBlogTitle, setEditBlogTitle] = useState<string>("")
  const [editBlogSlug, setEditBlogSlug] = useState<string>("")
  const [editBlogCategory, setEditBlogCategory] = useState<string>(BLOG_CATEGORIES[0]?.slug ?? "popolnenie-alipay")
  const [editBlogExcerpt, setEditBlogExcerpt] = useState<string>("")
  const [editBlogContent, setEditBlogContent] = useState<string>("")
  const [editBlogCoverImageUrl, setEditBlogCoverImageUrl] = useState<string>("")
  const [editBlogCoverVideoUrl, setEditBlogCoverVideoUrl] = useState<string>("")
  const [editBlogPublished, setEditBlogPublished] = useState<boolean>(false)

  const router = useRouter()
  const { toast } = useToast()
  const mountedRef = useRef(true)

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    selectedOrderIdRef.current = selectedOrderId
  }, [selectedOrderId])

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

  const transliterationMap: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "yo",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "kh",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "shch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
  }

  const transliterate = (value: string) =>
    value.replace(/[а-яё]/g, (char) => transliterationMap[char] ?? char)

  const slugify = (value: string) =>
    transliterate(value.trim().toLowerCase())
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")


  const fetchOrders = async ({ silent = false }: { silent?: boolean } = {}) => {
    const sessionToken = checkAuthBeforeRequest()
    if (!sessionToken) return

    if (!silent) {
      setIsOrdersLoading(true)
    }
    try {
      const response = await fetch(`/api/admin/orders?token=${sessionToken}`)
      const data = await response.json()
      if (response.ok && mountedRef.current) {
        setOrders(data.orders ?? [])
        const availableOrders = data.orders ?? []
        const hasSelectedOrder =
          selectedOrderIdRef.current && availableOrders.some((order) => order.id === selectedOrderIdRef.current)
        if (!hasSelectedOrder && availableOrders.length > 0) {
          setSelectedOrderId(availableOrders[0].id)
        }
      }
    } catch (error) {
      console.error("Orders fetch error:", error)
      if (mountedRef.current && !silent) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить список заявок",
          variant: "destructive",
        })
      }
    } finally {
      if (mountedRef.current && !silent) {
        setIsOrdersLoading(false)
      }
    }
  }

  const fetchOrderMessages = async (orderId: string, { silent = false }: { silent?: boolean } = {}) => {
    const sessionToken = checkAuthBeforeRequest()
    if (!sessionToken) return

    if (!silent) {
      setIsMessagesLoading(true)
    }
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/messages?token=${sessionToken}`)
      const data = await response.json()
      if (response.ok && mountedRef.current) {
        setOrderMessages(data.messages ?? [])
      }
    } catch (error) {
      console.error("Messages fetch error:", error)
      if (mountedRef.current && !silent) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить сообщения по заявке",
          variant: "destructive",
        })
      }
    } finally {
      if (mountedRef.current && !silent) {
        setIsMessagesLoading(false)
      }
    }
  }

  const uploadOrderMessageFile = async (file: File) => {
    const sessionToken = checkAuthBeforeRequest()
    if (!sessionToken) {
      throw new Error("No session")
    }

    const formData = new FormData()
    formData.append("file", file)
    const response = await fetch(`/api/admin/orders/uploads?token=${sessionToken}`, {
      method: "POST",
      body: formData,
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error ?? "Upload failed")
    }

    return data.url as string
  }

  const resolveMessageFileType = (fileUrl: string) => {
    const lower = fileUrl.toLowerCase()
    if (/\.(png|jpe?g|gif|webp|bmp|svg)$/.test(lower)) return "image"
    if (/\.(mp4|webm|mov|ogg)$/.test(lower)) return "video"
    if (/\.(pdf)$/.test(lower)) return "pdf"
    return "file"
  }

  const openMediaPreview = (fileUrl: string) => {
    const type = resolveMessageFileType(fileUrl)
    if (type === "image" || type === "video") {
      setMediaPreview({ url: fileUrl, type })
    }
  }

  const handleOrderChatScroll = () => {
    const container = orderChatContainerRef.current
    if (!container) return
    const threshold = 80
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight
    setIsOrderChatPinnedToBottom(distanceFromBottom < threshold)
  }

  useEffect(() => {
    if (!isOrderChatPinnedToBottom) return
    orderChatBottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [orderMessages, isOrderChatPinnedToBottom])

  useEffect(() => {
    setIsOrderChatPinnedToBottom(true)
  }, [selectedOrderId])

  const sendOrderMessage = async () => {
    const sessionToken = checkAuthBeforeRequest()
    if (!sessionToken || !selectedOrderId) return

    const trimmedMessage = orderMessageText.trim()
    if (!trimmedMessage && !orderMessageFile) {
      toast({
        title: "Пустое сообщение",
        description: "Введите текст или прикрепите файл перед отправкой.",
        variant: "destructive",
      })
      return
    }

    setIsMessageSending(true)
    try {
      let fileUrl: string | undefined
      if (orderMessageFile) {
        setIsMessageUploading(true)
        fileUrl = await uploadOrderMessageFile(orderMessageFile)
      }
      const response = await fetch(`/api/admin/orders/${selectedOrderId}/messages?token=${sessionToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmedMessage || undefined, fileUrl }),
      })
      const data = await response.json()
      if (response.ok && mountedRef.current) {
        setOrderMessageText("")
        setOrderMessageFile(null)
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
        setIsMessageUploading(false)
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

  const closeOrder = async () => {
    const sessionToken = checkAuthBeforeRequest()
    if (!sessionToken || !selectedOrderId) return
    if (!window.confirm("Закрыть сделку и переместить в архив?")) return

    setIsOrderClosing(true)
    try {
      const response = await fetch(`/api/admin/orders/${selectedOrderId}/archive?token=${sessionToken}`, {
        method: "POST",
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error ?? "Не удалось закрыть заявку")
      }
      toast({
        title: "Сделка закрыта",
        description: "Заявка перемещена в архив, клиент может создать новую.",
      })
      await fetchOrders()
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось закрыть сделку",
        variant: "destructive",
      })
    } finally {
      if (mountedRef.current) {
        setIsOrderClosing(false)
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
        description: "Заполните название и загрузите изображение.",
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
          description: showcaseDescription,
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
        setShowcaseDescription("")
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

  const handleShowcaseImageUpload = async (file: File) => {
    const sessionToken = checkAuthBeforeRequest()
    if (!sessionToken) return

    setIsImageUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const response = await fetch(`/api/admin/uploads?token=${sessionToken}`, {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error ?? "Upload failed")
      }
      setShowcaseImageUrl(data.url)
      toast({ title: "Файл загружен", description: "Изображение сохранено на сервере." })
    } catch (error) {
      console.error("Showcase upload error:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить изображение.",
        variant: "destructive",
      })
    } finally {
      setIsImageUploading(false)
    }
  }

  const startEditShowcaseItem = (item: ShowcaseItem) => {
    setEditingItemId(item.id)
    setEditTitle(item.title)
    setEditImageUrl(item.imageUrl)
    setEditDescription(item.description ?? "")
    setEditPriceCny(String(item.priceCny))
    setEditPriceRub(String(item.priceRub))
    setEditBenefitRub(String(item.benefitRub))
    setEditPublished(item.isPublished)
  }

  const cancelEditShowcaseItem = () => {
    setEditingItemId(null)
    setEditTitle("")
    setEditImageUrl("")
    setEditDescription("")
    setEditPriceCny("")
    setEditPriceRub("")
    setEditBenefitRub("")
    setEditPublished(false)
  }

  const handleEditImageUpload = async (file: File) => {
    const sessionToken = checkAuthBeforeRequest()
    if (!sessionToken) return

    setIsEditImageUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const response = await fetch(`/api/admin/uploads?token=${sessionToken}`, {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error ?? "Upload failed")
      }
      setEditImageUrl(data.url)
      toast({ title: "Файл загружен", description: "Новое изображение сохранено." })
    } catch (error) {
      console.error("Edit upload error:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить изображение.",
        variant: "destructive",
      })
    } finally {
      setIsEditImageUploading(false)
    }
  }

  const updateShowcaseItem = async () => {
    const sessionToken = checkAuthBeforeRequest()
    if (!sessionToken || !editingItemId) return

    if (!editTitle || !editImageUrl) {
      toast({
        title: "Недостаточно данных",
        description: "Название и изображение обязательны.",
        variant: "destructive",
      })
      return
    }

    setIsShowcaseUpdating(true)
    try {
      const response = await fetch(`/api/admin/showcase?token=${sessionToken}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingItemId,
          title: editTitle,
          imageUrl: editImageUrl,
          description: editDescription,
          priceCny: editPriceCny,
          priceRub: editPriceRub,
          benefitRub: editBenefitRub,
          isPublished: editPublished,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error ?? "Update failed")
      }
      if (mountedRef.current) {
        setShowcaseItems((prev) => prev.map((entry) => (entry.id === editingItemId ? data.item : entry)))
        cancelEditShowcaseItem()
        toast({ title: "Позиция обновлена", description: "Данные сохранены." })
      }
    } catch (error) {
      console.error("Showcase update error:", error)
      if (mountedRef.current) {
        toast({
          title: "Ошибка",
          description: "Не удалось обновить позицию.",
          variant: "destructive",
        })
      }
    } finally {
      if (mountedRef.current) {
        setIsShowcaseUpdating(false)
      }
    }
  }

  const fetchBlogPosts = async () => {
    const sessionToken = checkAuthBeforeRequest()
    if (!sessionToken) return

    setIsBlogLoading(true)
    try {
      const response = await fetch(`/api/admin/blog?token=${sessionToken}`)
      const data = await response.json()
      if (response.ok && mountedRef.current) {
        setBlogPosts(data.posts ?? [])
      }
    } catch (error) {
      console.error("Blog fetch error:", error)
      if (mountedRef.current) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить список публикаций",
          variant: "destructive",
        })
      }
    } finally {
      if (mountedRef.current) {
        setIsBlogLoading(false)
      }
    }
  }

  const uploadBlogMedia = async (file: File) => {
    const sessionToken = checkAuthBeforeRequest()
    if (!sessionToken) return null

    setIsBlogMediaUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const response = await fetch(`/api/admin/blog/uploads?token=${sessionToken}`, {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error ?? "Upload failed")
      }
      const uploadedUrl = data.url as string
      toast({ title: "Файл загружен", description: "Медиа сохранено на сервере." })
      return uploadedUrl
    } catch (error) {
      console.error("Blog upload error:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить медиа.",
        variant: "destructive",
      })
      return null
    } finally {
      setIsBlogMediaUploading(false)
    }
  }

  const createBlogPost = async () => {
    const sessionToken = checkAuthBeforeRequest()
    if (!sessionToken) return

    if (!blogTitle || !blogSlug || !blogCategory) {
      toast({
        title: "Недостаточно данных",
        description: "Заполните заголовок, slug и раздел.",
        variant: "destructive",
      })
      return
    }

    setIsBlogSaving(true)
    try {
      const response = await fetch(`/api/admin/blog?token=${sessionToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: blogTitle,
          slug: blogSlug,
          category: blogCategory,
          excerpt: blogExcerpt,
          content: blogContent,
          coverImageUrl: blogCoverImageUrl,
          coverVideoUrl: blogCoverVideoUrl,
          isPublished: blogPublished,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error ?? "Create failed")
      }
      if (mountedRef.current) {
        setBlogPosts((prev) => [data.post, ...prev])
        setBlogTitle("")
        setBlogSlug("")
        setBlogCategory(BLOG_CATEGORIES[0]?.slug ?? "popolnenie-alipay")
        setBlogExcerpt("")
        setBlogContent("")
        setBlogCoverImageUrl("")
        setBlogCoverVideoUrl("")
        setBlogPublished(true)
        toast({ title: "Публикация добавлена", description: "Запись опубликована в блоге." })
      }
    } catch (error) {
      console.error("Blog create error:", error)
      if (mountedRef.current) {
        toast({
          title: "Ошибка",
          description: "Не удалось создать публикацию",
          variant: "destructive",
        })
      }
    } finally {
      if (mountedRef.current) {
        setIsBlogSaving(false)
      }
    }
  }

  const startEditBlogPost = (post: BlogPost) => {
    setEditingBlogId(post.id)
    setEditBlogTitle(post.title)
    setEditBlogSlug(post.slug)
    setEditBlogCategory(post.category)
    setEditBlogExcerpt(post.excerpt ?? "")
    setEditBlogContent(post.content ?? "")
    setEditBlogCoverImageUrl(post.coverImageUrl ?? "")
    setEditBlogCoverVideoUrl(post.coverVideoUrl ?? "")
    setEditBlogPublished(post.isPublished)
  }

  const cancelEditBlogPost = () => {
    setEditingBlogId(null)
    setEditBlogTitle("")
    setEditBlogSlug("")
    setEditBlogCategory(BLOG_CATEGORIES[0]?.slug ?? "popolnenie-alipay")
    setEditBlogExcerpt("")
    setEditBlogContent("")
    setEditBlogCoverImageUrl("")
    setEditBlogCoverVideoUrl("")
    setEditBlogPublished(false)
  }

  const updateBlogPostItem = async () => {
    const sessionToken = checkAuthBeforeRequest()
    if (!sessionToken || !editingBlogId) return

    if (!editBlogTitle || !editBlogSlug || !editBlogCategory) {
      toast({
        title: "Недостаточно данных",
        description: "Заполните заголовок, slug и раздел.",
        variant: "destructive",
      })
      return
    }

    setIsBlogUpdating(true)
    try {
      const response = await fetch(`/api/admin/blog/${editingBlogId}?token=${sessionToken}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editBlogTitle,
          slug: editBlogSlug,
          category: editBlogCategory,
          excerpt: editBlogExcerpt,
          content: editBlogContent,
          coverImageUrl: editBlogCoverImageUrl,
          coverVideoUrl: editBlogCoverVideoUrl,
          isPublished: editBlogPublished,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error ?? "Update failed")
      }
      if (mountedRef.current) {
        setBlogPosts((prev) => prev.map((entry) => (entry.id === editingBlogId ? data.post : entry)))
        cancelEditBlogPost()
        toast({ title: "Публикация обновлена", description: "Изменения сохранены." })
      }
    } catch (error) {
      console.error("Blog update error:", error)
      if (mountedRef.current) {
        toast({
          title: "Ошибка",
          description: "Не удалось обновить публикацию",
          variant: "destructive",
        })
      }
    } finally {
      if (mountedRef.current) {
        setIsBlogUpdating(false)
      }
    }
  }

  const toggleBlogPublish = async (post: BlogPost) => {
    const sessionToken = checkAuthBeforeRequest()
    if (!sessionToken) return

    try {
      const response = await fetch(`/api/admin/blog/${post.id}?token=${sessionToken}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !post.isPublished }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error ?? "Update failed")
      }
      if (mountedRef.current) {
        setBlogPosts((prev) => prev.map((entry) => (entry.id === post.id ? data.post : entry)))
      }
    } catch (error) {
      console.error("Blog publish error:", error)
      if (mountedRef.current) {
        toast({
          title: "Ошибка",
          description: "Не удалось обновить статус публикации",
          variant: "destructive",
        })
      }
    }
  }

  const deleteBlogPostItem = async (post: BlogPost) => {
    const sessionToken = checkAuthBeforeRequest()
    if (!sessionToken) return

    const confirmed = window.confirm(`Удалить публикацию \"${post.title}\"?`)
    if (!confirmed) return

    try {
      const response = await fetch(`/api/admin/blog/${post.id}?token=${sessionToken}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? "Delete failed")
      }
      if (mountedRef.current) {
        setBlogPosts((prev) => prev.filter((entry) => entry.id !== post.id))
        if (editingBlogId === post.id) {
          cancelEditBlogPost()
        }
        toast({ title: "Публикация удалена", description: "Запись удалена из блога." })
      }
    } catch (error) {
      console.error("Blog delete error:", error)
      if (mountedRef.current) {
        toast({
          title: "Ошибка",
          description: "Не удалось удалить публикацию",
          variant: "destructive",
        })
      }
    }
  }

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders()
      const interval = window.setInterval(() => fetchOrders({ silent: true }), 10000)
      return () => window.clearInterval(interval)
    }
    if (activeTab === "showcase") {
      fetchShowcase()
    }
    if (activeTab === "blog") {
      fetchBlogPosts()
    }
  }, [activeTab])

  useEffect(() => {
    if (!selectedOrderId || activeTab !== "orders") return
    fetchOrderMessages(selectedOrderId)
    const interval = window.setInterval(() => fetchOrderMessages(selectedOrderId, { silent: true }), 5000)
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

  const selectedOrder = orders.find((order) => order.id === selectedOrderId)

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
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="orders" className="text-base py-3">
              <ClipboardList className="h-4 w-4 mr-2" />
              Заявки
            </TabsTrigger>
            <TabsTrigger value="showcase" className="text-base py-3">
              <PackagePlus className="h-4 w-4 mr-2" />
              Витрина
            </TabsTrigger>
            <TabsTrigger value="blog" className="text-base py-3">
              <BookOpen className="h-4 w-4 mr-2" />
              Блог
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
                              if (!selectedOrder) return "-"
                              if (selectedOrder.contactUsername) return `@${selectedOrder.contactUsername}`
                              if (selectedOrder.contactPhone) return selectedOrder.contactPhone
                              return `ID ${selectedOrder.userId}`
                            })()}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-600">
                          <span>
                            Статус: <span className="font-medium">{selectedOrder?.status ?? "—"}</span>
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={closeOrder}
                            disabled={
                              !selectedOrder ||
                              isOrderClosing ||
                              selectedOrder.status === "COMPLETED" ||
                              selectedOrder.status === "CANCELED"
                            }
                          >
                            {isOrderClosing ? "Закрытие..." : "Закрыть и в архив"}
                          </Button>
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

                      <div
                        ref={orderChatContainerRef}
                        onScroll={handleOrderChatScroll}
                        className="max-h-[320px] space-y-3 overflow-y-auto rounded-lg border bg-white p-4"
                      >
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
                              {message.text && <div className="mt-1 whitespace-pre-wrap">{message.text}</div>}
                              {message.fileUrl && (
                                <div className="mt-2 space-y-2">
                                  {resolveMessageFileType(message.fileUrl) === "image" ? (
                                    <button
                                      type="button"
                                      onClick={() => openMediaPreview(message.fileUrl ?? "")}
                                      className="block"
                                    >
                                      <img
                                        src={message.fileUrl}
                                        alt="Вложение"
                                        className="max-h-48 rounded-md border transition hover:opacity-90"
                                      />
                                    </button>
                                  ) : resolveMessageFileType(message.fileUrl) === "video" ? (
                                    <video
                                      src={message.fileUrl}
                                      controls
                                      className="max-h-48 w-full rounded-md border"
                                    />
                                  ) : (
                                    <a
                                      href={message.fileUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-sm text-orange-600 underline"
                                    >
                                      Открыть файл
                                    </a>
                                  )}
                                  <div className="flex flex-wrap gap-3 text-xs">
                                    {(resolveMessageFileType(message.fileUrl) === "image" ||
                                      resolveMessageFileType(message.fileUrl) === "video") && (
                                      <button
                                        type="button"
                                        onClick={() => openMediaPreview(message.fileUrl ?? "")}
                                        className="text-orange-600 underline"
                                      >
                                        Открыть
                                      </button>
                                    )}
                                    <a href={message.fileUrl} download className="text-orange-600 underline">
                                      Скачать
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                        <div ref={orderChatBottomRef} />
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
                        <Input
                          type="file"
                          accept="image/*,video/*,application/pdf"
                          onChange={(event) => setOrderMessageFile(event.target.files?.[0] ?? null)}
                          disabled={isMessageSending || isMessageUploading || !selectedOrderId}
                        />
                        {orderMessageFile && (
                          <div className="text-xs text-gray-500">Прикреплено: {orderMessageFile.name}</div>
                        )}
                        <Button
                          onClick={sendOrderMessage}
                          disabled={
                            isMessageSending ||
                            isMessageUploading ||
                            (!orderMessageText.trim() && !orderMessageFile) ||
                            !selectedOrderId
                          }
                          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                        >
                          <MessageSquareText className="h-4 w-4 mr-2" />
                          {isMessageSending || isMessageUploading ? "Отправка..." : "Отправить сообщение"}
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
                    <Label htmlFor="showcase-image">Изображение товара</Label>
                    <Input
                      id="showcase-image"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0]
                        if (file) {
                          handleShowcaseImageUpload(file)
                        }
                      }}
                      disabled={isImageUploading}
                    />
                    {showcaseImageUrl && (
                      <div className="mt-2">
                        <img src={showcaseImageUrl} alt="Preview" className="h-24 w-24 rounded-md border object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="showcase-description">Описание</Label>
                    <Textarea
                      id="showcase-description"
                      value={showcaseDescription}
                      onChange={(event) => setShowcaseDescription(event.target.value)}
                      placeholder="Короткое описание товара"
                      className="min-h-[100px]"
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
                    disabled={isShowcaseSaving || isImageUploading}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  >
                    <PackagePlus className="h-4 w-4 mr-2" />
                    {isShowcaseSaving ? "Сохранение..." : isImageUploading ? "Загрузка изображения..." : "Добавить в витрину"}
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
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <img src={item.imageUrl} alt={item.title} className="h-14 w-14 rounded-md border object-cover" />
                                <div>
                                  <div className="text-sm font-semibold">{item.title}</div>
                                  <div className="text-xs text-gray-500">
                                    {item.priceCny} CNY · {item.priceRub} ₽ · выгода {item.benefitRub} ₽
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant={item.isPublished ? "outline" : "default"}
                                  onClick={() => toggleShowcasePublish(item)}
                                  size="sm"
                                >
                                  {item.isPublished ? "Скрыть" : "Опубликовать"}
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => startEditShowcaseItem(item)}>
                                  Редактировать
                                </Button>
                              </div>
                            </div>
                            {item.description && <p className="text-xs text-gray-500">{item.description}</p>}
                            {editingItemId === item.id && (
                              <div className="rounded-lg border bg-gray-50 p-4 space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-title-${item.id}`}>Название</Label>
                                  <Input
                                    id={`edit-title-${item.id}`}
                                    value={editTitle}
                                    onChange={(event) => setEditTitle(event.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-image-${item.id}`}>Изображение</Label>
                                  <Input
                                    id={`edit-image-${item.id}`}
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => {
                                      const file = event.target.files?.[0]
                                      if (file) {
                                        handleEditImageUpload(file)
                                      }
                                    }}
                                    disabled={isEditImageUploading}
                                  />
                                  {editImageUrl && (
                                    <img
                                      src={editImageUrl}
                                      alt="Preview"
                                      className="h-24 w-24 rounded-md border object-cover"
                                    />
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-description-${item.id}`}>Описание</Label>
                                  <Textarea
                                    id={`edit-description-${item.id}`}
                                    value={editDescription}
                                    onChange={(event) => setEditDescription(event.target.value)}
                                    className="min-h-[90px]"
                                  />
                                </div>
                                <div className="grid gap-4 md:grid-cols-3">
                                  <div className="space-y-2">
                                    <Label htmlFor={`edit-price-cny-${item.id}`}>Цена CNY</Label>
                                    <Input
                                      id={`edit-price-cny-${item.id}`}
                                      value={editPriceCny}
                                      onChange={(event) => setEditPriceCny(event.target.value)}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`edit-price-rub-${item.id}`}>Цена RUB</Label>
                                    <Input
                                      id={`edit-price-rub-${item.id}`}
                                      value={editPriceRub}
                                      onChange={(event) => setEditPriceRub(event.target.value)}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`edit-benefit-${item.id}`}>Выгода RUB</Label>
                                    <Input
                                      id={`edit-benefit-${item.id}`}
                                      value={editBenefitRub}
                                      onChange={(event) => setEditBenefitRub(event.target.value)}
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border bg-white p-3">
                                  <div>
                                    <div className="text-sm font-medium">Опубликовано</div>
                                    <div className="text-xs text-gray-500">Меняйте видимость позиции.</div>
                                  </div>
                                  <Switch checked={editPublished} onCheckedChange={setEditPublished} />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Button
                                    onClick={updateShowcaseItem}
                                    disabled={isShowcaseUpdating || isEditImageUploading}
                                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                                  >
                                    {isShowcaseUpdating ? "Сохранение..." : "Сохранить изменения"}
                                  </Button>
                                  <Button variant="outline" onClick={cancelEditShowcaseItem}>
                                    Отмена
                                  </Button>
                                </div>
                              </div>
                            )}
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

          <TabsContent value="blog">
            <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
              <Card className="border-2 shadow-md">
                <CardHeader>
                  <CardTitle>Новая публикация</CardTitle>
                  <CardDescription>Добавьте пост для нужного раздела блога</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="blog-title">Заголовок</Label>
                    <Input
                      id="blog-title"
                      value={blogTitle}
                      onChange={(event) => setBlogTitle(event.target.value)}
                      placeholder="Например: Как платить в Китае"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="blog-slug">Slug</Label>
                      <Input
                        id="blog-slug"
                        value={blogSlug}
                        onChange={(event) => setBlogSlug(event.target.value)}
                        placeholder="popolnenie-alipay"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setBlogSlug(slugify(blogTitle))}
                      disabled={!blogTitle}
                    >
                      Авто
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="blog-category">Раздел</Label>
                    <select
                      id="blog-category"
                      value={blogCategory}
                      onChange={(event) => setBlogCategory(event.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {BLOG_CATEGORIES.map((category) => (
                        <option key={category.slug} value={category.slug}>
                          {category.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="blog-excerpt">Анонс</Label>
                    <Textarea
                      id="blog-excerpt"
                      value={blogExcerpt}
                      onChange={(event) => setBlogExcerpt(event.target.value)}
                      placeholder="Короткое описание статьи"
                      className="min-h-[90px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="blog-content">Текст публикации</Label>
                    <RichTextEditor
                      id="blog-content"
                      value={blogContent}
                      onChange={setBlogContent}
                      onUploadMedia={uploadBlogMedia}
                      placeholder="Основной текст статьи"
                      disabled={isBlogSaving || isBlogMediaUploading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="blog-cover-image">Обложка (фото)</Label>
                    <Input
                      id="blog-cover-image"
                      type="file"
                      accept="image/*"
                      onChange={async (event) => {
                        const file = event.target.files?.[0]
                        if (file) {
                          const uploadedUrl = await uploadBlogMedia(file)
                          if (uploadedUrl) {
                            setBlogCoverImageUrl(uploadedUrl)
                          }
                        }
                      }}
                      disabled={isBlogMediaUploading}
                    />
                    {blogCoverImageUrl && (
                      <img src={blogCoverImageUrl} alt="Preview" className="h-24 w-24 rounded-md border object-cover" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="blog-cover-video">Обложка (видео)</Label>
                    <Input
                      id="blog-cover-video"
                      type="file"
                      accept="video/*"
                      onChange={async (event) => {
                        const file = event.target.files?.[0]
                        if (file) {
                          const uploadedUrl = await uploadBlogMedia(file)
                          if (uploadedUrl) {
                            setBlogCoverVideoUrl(uploadedUrl)
                          }
                        }
                      }}
                      disabled={isBlogMediaUploading}
                    />
                    {blogCoverVideoUrl && (
                      <video src={blogCoverVideoUrl} className="h-24 w-36 rounded-md border object-cover" controls />
                    )}
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <div className="text-sm font-medium">Публиковать сразу</div>
                      <div className="text-xs text-gray-500">Можно скрыть, пока текст не готов.</div>
                    </div>
                    <Switch checked={blogPublished} onCheckedChange={setBlogPublished} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={createBlogPost}
                    disabled={isBlogSaving || isBlogMediaUploading}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    {isBlogSaving ? "Сохранение..." : isBlogMediaUploading ? "Загрузка медиа..." : "Добавить публикацию"}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-2 shadow-md">
                <CardHeader>
                  <CardTitle>Управление публикациями</CardTitle>
                  <CardDescription>Редактируйте и скрывайте статьи</CardDescription>
                </CardHeader>
                <CardContent>
                  {isBlogLoading ? (
                    <div className="text-sm text-gray-500">Загрузка публикаций...</div>
                  ) : blogPosts.length === 0 ? (
                    <div className="text-sm text-gray-500">Публикаций пока нет.</div>
                  ) : (
                    <div className="space-y-4">
                      {blogPosts.map((post) => (
                        <div key={post.id} className="rounded-lg border p-4">
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                              <div>
                                <div className="text-sm font-semibold text-gray-900">{post.title}</div>
                                <div className="text-xs text-gray-500">
                                  {post.category} · {new Date(post.createdAt).toLocaleDateString("ru-RU")}
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  variant={post.isPublished ? "outline" : "default"}
                                  onClick={() => toggleBlogPublish(post)}
                                  size="sm"
                                >
                                  {post.isPublished ? "Скрыть" : "Опубликовать"}
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => startEditBlogPost(post)}>
                                  Редактировать
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => deleteBlogPostItem(post)}>
                                  Удалить
                                </Button>
                              </div>
                            </div>
                            {post.excerpt && <p className="text-xs text-gray-500">{post.excerpt}</p>}
                            {editingBlogId === post.id && (
                              <div className="rounded-lg border bg-gray-50 p-4 space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-blog-title-${post.id}`}>Заголовок</Label>
                                  <Input
                                    id={`edit-blog-title-${post.id}`}
                                    value={editBlogTitle}
                                    onChange={(event) => setEditBlogTitle(event.target.value)}
                                  />
                                </div>
                                <div className="flex items-end gap-2">
                                  <div className="flex-1 space-y-2">
                                    <Label htmlFor={`edit-blog-slug-${post.id}`}>Slug</Label>
                                    <Input
                                      id={`edit-blog-slug-${post.id}`}
                                      value={editBlogSlug}
                                      onChange={(event) => setEditBlogSlug(event.target.value)}
                                    />
                                  </div>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditBlogSlug(slugify(editBlogTitle))}
                                    disabled={!editBlogTitle}
                                  >
                                    Авто
                                  </Button>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-blog-category-${post.id}`}>Раздел</Label>
                                  <select
                                    id={`edit-blog-category-${post.id}`}
                                    value={editBlogCategory}
                                    onChange={(event) => setEditBlogCategory(event.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                  >
                                    {BLOG_CATEGORIES.map((category) => (
                                      <option key={category.slug} value={category.slug}>
                                        {category.title}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-blog-excerpt-${post.id}`}>Анонс</Label>
                                  <Textarea
                                    id={`edit-blog-excerpt-${post.id}`}
                                    value={editBlogExcerpt}
                                    onChange={(event) => setEditBlogExcerpt(event.target.value)}
                                    className="min-h-[90px]"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-blog-content-${post.id}`}>Текст</Label>
                                  <RichTextEditor
                                    id={`edit-blog-content-${post.id}`}
                                    value={editBlogContent}
                                    onChange={setEditBlogContent}
                                    onUploadMedia={uploadBlogMedia}
                                    placeholder="Основной текст статьи"
                                    disabled={isBlogUpdating || isBlogMediaUploading}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-blog-cover-image-${post.id}`}>Обложка (фото)</Label>
                                  <Input
                                    id={`edit-blog-cover-image-${post.id}`}
                                    type="file"
                                    accept="image/*"
                                    onChange={async (event) => {
                                      const file = event.target.files?.[0]
                                      if (file) {
                                        const uploadedUrl = await uploadBlogMedia(file)
                                        if (uploadedUrl) {
                                          setEditBlogCoverImageUrl(uploadedUrl)
                                        }
                                      }
                                    }}
                                    disabled={isBlogMediaUploading}
                                  />
                                  {editBlogCoverImageUrl && (
                                    <img
                                      src={editBlogCoverImageUrl}
                                      alt="Preview"
                                      className="h-24 w-24 rounded-md border object-cover"
                                    />
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-blog-cover-video-${post.id}`}>Обложка (видео)</Label>
                                  <Input
                                    id={`edit-blog-cover-video-${post.id}`}
                                    type="file"
                                    accept="video/*"
                                    onChange={async (event) => {
                                      const file = event.target.files?.[0]
                                      if (file) {
                                        const uploadedUrl = await uploadBlogMedia(file)
                                        if (uploadedUrl) {
                                          setEditBlogCoverVideoUrl(uploadedUrl)
                                        }
                                      }
                                    }}
                                    disabled={isBlogMediaUploading}
                                  />
                                  {editBlogCoverVideoUrl && (
                                    <video
                                      src={editBlogCoverVideoUrl}
                                      className="h-24 w-36 rounded-md border object-cover"
                                      controls
                                    />
                                  )}
                                </div>
                                <div className="flex items-center justify-between rounded-lg border bg-white p-3">
                                  <div>
                                    <div className="text-sm font-medium">Опубликовано</div>
                                    <div className="text-xs text-gray-500">Меняйте видимость публикации.</div>
                                  </div>
                                  <Switch checked={editBlogPublished} onCheckedChange={setEditBlogPublished} />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Button
                                    onClick={updateBlogPostItem}
                                    disabled={isBlogUpdating || isBlogMediaUploading}
                                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                                  >
                                    {isBlogUpdating ? "Сохранение..." : "Сохранить изменения"}
                                  </Button>
                                  <Button variant="outline" onClick={cancelEditBlogPost}>
                                    Отмена
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={fetchBlogPosts} disabled={isBlogLoading} className="w-full">
                    <RefreshCw className={`h-4 w-4 mr-2 ${isBlogLoading ? "animate-spin" : ""}`} />
                    Обновить публикации
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

        </Tabs>
      </main>

      <Dialog open={!!mediaPreview} onOpenChange={(open) => !open && setMediaPreview(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Просмотр вложения</DialogTitle>
          </DialogHeader>
          {mediaPreview?.type === "image" ? (
            <img src={mediaPreview.url} alt="Вложение" className="max-h-[70vh] w-full rounded-md object-contain" />
          ) : mediaPreview?.type === "video" ? (
            <video src={mediaPreview.url} controls className="max-h-[70vh] w-full rounded-md" />
          ) : null}
          {mediaPreview && (
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <a
                href={mediaPreview.url}
                target="_blank"
                rel="noreferrer"
                className="text-orange-600 underline"
              >
                Открыть в новой вкладке
              </a>
              <a href={mediaPreview.url} download className="text-orange-600 underline">
                Скачать
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
