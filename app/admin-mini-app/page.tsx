"use client"

import { useEffect, useState, useRef, useCallback } from "react"

const ADMIN_USER_ID = Number(process.env.NEXT_PUBLIC_ADMIN_USER_ID || "414430203")

type OrderStatus = "CREATED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED"

interface AdminOrder {
  id: string
  userId: number
  status: OrderStatus
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

const STATUS_LABELS: Record<OrderStatus, string> = {
  CREATED: "🆕 Новая",
  IN_PROGRESS: "⚙️ В работе",
  COMPLETED: "✅ Завершена",
  CANCELED: "❌ Отменена",
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  CREATED: "#3b82f6",
  IN_PROGRESS: "#f59e0b",
  COMPLETED: "#10b981",
  CANCELED: "#ef4444",
}

function getAdminToken(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(/admin_token=([^;]+)/)
  return match ? match[1] : null
}

export default function AdminMiniApp() {
  const [isTelegram, setIsTelegram] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [initData, setInitData] = useState("")
  const [adminToken, setAdminToken] = useState<string | null>(null)
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)
  const [messages, setMessages] = useState<AdminMessage[]>([])
  const [messageText, setMessageText] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [activeTab, setActiveTab] = useState<"active" | "archive">("active")
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollRef = useRef<NodeJS.Timeout | null>(null)

  // Быстрые шаблоны сообщений
  const QUICK_MESSAGES = [
    { label: "💳 Реквизиты", text: "Пожалуйста, пришлите ваши реквизиты для получения перевода." },
    { label: "✅ Принято", text: "Ваша заявка принята в работу! Обрабатываем..." },
    { label: "📸 QR-код", text: "Пожалуйста, пришлите QR-код вашего Alipay кошелька." },
    { label: "💰 Оплачено", text: "Перевод выполнен! Проверьте ваш Alipay кошелёк." },
    { label: "⏳ Ожидание", text: "Ожидаем подтверждения транзакции, это займёт несколько минут." },
  ]

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (!tg) {
      setError("Откройте приложение через Telegram")
      setIsLoading(false)
      return
    }
    tg.ready()
    tg.expand()
    const user = tg.initDataUnsafe?.user
    if (!user || user.id !== ADMIN_USER_ID) {
      setError("Доступ только для администратора")
      setIsLoading(false)
      return
    }
    setIsTelegram(true)
    setIsAdmin(true)
    setInitData(tg.initData)
    const token = getAdminToken()
    setAdminToken(token)
    setIsLoading(false)
  }, [])

  const authHeaders = useCallback((): Record<string, string> => {
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (adminToken) headers["x-admin-token"] = adminToken
    if (initData) headers["x-telegram-init-data"] = initData
    return headers
  }, [adminToken, initData])

  const loadOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/orders", { headers: authHeaders() })
      if (!res.ok) throw new Error("Ошибка загрузки")
      const data = await res.json()
      const all: AdminOrder[] = data.orders || []
      setOrders(all)
    } catch {
      setError("Не удалось загрузить заявки")
    }
  }, [authHeaders])

  const loadMessages = useCallback(async (orderId: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/messages`, { headers: authHeaders() })
      if (!res.ok) return
      const data = await res.json()
      setMessages(data.messages || [])
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
    } catch {}
  }, [authHeaders])

  useEffect(() => {
    if (!isAdmin) return
    loadOrders()
    pollRef.current = setInterval(loadOrders, 15000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [isAdmin, loadOrders])

  useEffect(() => {
    if (!selectedOrder) return
    loadMessages(selectedOrder.id)
    const interval = setInterval(() => loadMessages(selectedOrder.id), 5000)
    return () => clearInterval(interval)
  }, [selectedOrder, loadMessages])

  const sendMessage = async (text: string) => {
    if (!selectedOrder || !text.trim() || isSending) return
    setIsSending(true)
    try {
      await fetch(`/api/admin/orders/${selectedOrder.id}/messages`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ text: text.trim() }),
      })
      setMessageText("")
      await loadMessages(selectedOrder.id)
    } catch {} finally {
      setIsSending(false)
    }
  }

  const changeStatus = async (status: OrderStatus) => {
    if (!selectedOrder) return
    let endpoint = ""
    if (status === "COMPLETED") endpoint = `/api/admin/orders/${selectedOrder.id}/complete`
    else if (status === "CANCELED") endpoint = `/api/admin/orders/${selectedOrder.id}/cancel`
    else if (status === "IN_PROGRESS") endpoint = `/api/admin/orders/${selectedOrder.id}/steps`
    if (!endpoint) return
    try {
      await fetch(endpoint, { method: "POST", headers: authHeaders(), body: JSON.stringify({}) })
      await loadOrders()
      setSelectedOrder(prev => prev ? { ...prev, status } : null)
    } catch {}
  }

  const activeOrders = orders.filter(o => o.status === "CREATED" || o.status === "IN_PROGRESS")
  const archivedOrders = orders.filter(o => o.status === "COMPLETED" || o.status === "CANCELED")
  const displayedOrders = activeTab === "active" ? activeOrders : archivedOrders

  if (isLoading) return (
    <div style={styles.center}>
      <div style={styles.spinner} />
      <p style={{ color: "#888", marginTop: 12 }}>Загрузка...</p>
    </div>
  )

  if (error) return (
    <div style={styles.center}>
      <p style={{ fontSize: 40 }}>🔒</p>
      <p style={{ color: "#ef4444", textAlign: "center", padding: "0 20px" }}>{error}</p>
    </div>
  )

  // Экран чата
  if (selectedOrder) return (
    <div style={styles.screen}>
      {/* Шапка */}
      <div style={styles.chatHeader}>
        <button onClick={() => setSelectedOrder(null)} style={styles.backBtn}>← Назад</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>
            Заявка #{selectedOrder.id.slice(0, 6)}
          </div>
          <div style={{ fontSize: 12, color: "#aaa" }}>
            {selectedOrder.totalRub.toLocaleString()} ₽ → {selectedOrder.totalCny.toLocaleString()} ¥
          </div>
        </div>
        <span style={{ ...styles.statusBadge, background: STATUS_COLORS[selectedOrder.status] }}>
          {STATUS_LABELS[selectedOrder.status]}
        </span>
      </div>

      {/* Инфо о клиенте */}
      <div style={styles.clientInfo}>
        {selectedOrder.fullName && <span>👤 {selectedOrder.fullName}</span>}
        {selectedOrder.contactUsername && <span>📱 {selectedOrder.contactUsername}</span>}
        {selectedOrder.alipayId && <span>💳 {selectedOrder.alipayId}</span>}
      </div>

      {/* Кнопки смены статуса */}
      <div style={styles.statusRow}>
        {selectedOrder.status === "CREATED" && (
          <button onClick={() => changeStatus("IN_PROGRESS")} style={styles.statusBtn("#f59e0b")}>
            ⚙️ В работу
          </button>
        )}
        {(selectedOrder.status === "CREATED" || selectedOrder.status === "IN_PROGRESS") && (
          <>
            <button onClick={() => changeStatus("COMPLETED")} style={styles.statusBtn("#10b981")}>
              ✅ Завершить
            </button>
            <button onClick={() => changeStatus("CANCELED")} style={styles.statusBtn("#ef4444")}>
              ❌ Отменить
            </button>
          </>
        )}
      </div>

      {/* Быстрые шаблоны */}
      <div style={styles.quickMsgs}>
        {QUICK_MESSAGES.map(q => (
          <button key={q.label} onClick={() => sendMessage(q.text)} style={styles.quickBtn}>
            {q.label}
          </button>
        ))}
      </div>

      {/* Сообщения */}
      <div style={styles.messages}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            ...styles.bubble,
            alignSelf: msg.senderRole === "admin" ? "flex-end" : "flex-start",
            background: msg.senderRole === "admin" ? "#2563eb" : "#2a2a2a",
          }}>
            {msg.text && <p style={{ margin: 0, fontSize: 14, color: "#fff" }}>{msg.text}</p>}
            {msg.fileUrl && (
              <a href={msg.fileUrl} target="_blank" rel="noreferrer" style={{ color: "#93c5fd", fontSize: 13 }}>
                📎 Файл
              </a>
            )}
            <p style={{ margin: "4px 0 0", fontSize: 11, color: "#aaa", textAlign: "right" }}>
              {new Date(msg.createdAt).toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <div style={styles.inputRow}>
        <textarea
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          placeholder="Написать сообщение..."
          rows={2}
          style={styles.textarea}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(messageText) } }}
        />
        <button onClick={() => sendMessage(messageText)} disabled={isSending || !messageText.trim()} style={styles.sendBtn}>
          {isSending ? "..." : "➤"}
        </button>
      </div>
    </div>
  )

  // Список заявок
  return (
    <div style={styles.screen}>
      <div style={styles.header}>
        <h1 style={styles.title}>🛡️ Админ панель</h1>
        <button onClick={loadOrders} style={styles.refreshBtn}>🔄</button>
      </div>

      <div style={styles.tabs}>
        <button onClick={() => setActiveTab("active")} style={styles.tab(activeTab === "active")}>
          Активные ({activeOrders.length})
        </button>
        <button onClick={() => setActiveTab("archive")} style={styles.tab(activeTab === "archive")}>
          Архив ({archivedOrders.length})
        </button>
      </div>

      <div style={styles.orderList}>
        {displayedOrders.length === 0 && (
          <p style={{ color: "#666", textAlign: "center", padding: 20 }}>
            {activeTab === "active" ? "Нет активных заявок" : "Архив пуст"}
          </p>
        )}
        {displayedOrders.map(order => (
          <div key={order.id} onClick={() => setSelectedOrder(order)} style={styles.orderCard}>
            <div style={styles.orderCardTop}>
              <span style={{ fontWeight: 700, color: "#fff" }}>#{order.id.slice(0, 6)}</span>
              <span style={{ ...styles.statusBadge, background: STATUS_COLORS[order.status] }}>
                {STATUS_LABELS[order.status]}
              </span>
            </div>
            <div style={{ fontSize: 13, color: "#ccc", margin: "4px 0" }}>
              {order.totalRub.toLocaleString()} ₽ → {order.totalCny.toLocaleString()} ¥ (курс {order.rate})
            </div>
            {order.fullName && <div style={{ fontSize: 12, color: "#888" }}>👤 {order.fullName}</div>}
            {order.lastMessage && (
              <div style={{ fontSize: 12, color: "#666", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                💬 {order.lastMessage}
              </div>
            )}
            <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>
              {new Date(order.createdAt).toLocaleString("ru")}
            </div>
            {order.messageCount > 0 && (
              <div style={styles.msgCount}>{order.messageCount}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Стили
const styles = {
  screen: { display: "flex" as const, flexDirection: "column" as const, height: "100dvh", background: "#111", color: "#fff", fontFamily: "system-ui, sans-serif", overflow: "hidden" },
  center: { display: "flex" as const, flexDirection: "column" as const, alignItems: "center" as const, justifyContent: "center" as const, height: "100dvh", background: "#111" },
  spinner: { width: 36, height: 36, border: "3px solid #333", borderTop: "3px solid #2563eb", borderRadius: "50%", animation: "spin 1s linear infinite" },
  header: { display: "flex" as const, alignItems: "center" as const, justifyContent: "space-between" as const, padding: "12px 16px", borderBottom: "1px solid #222" },
  title: { margin: 0, fontSize: 18, fontWeight: 700 },
  refreshBtn: { background: "none", border: "none", fontSize: 20, cursor: "pointer" },
  tabs: { display: "flex" as const, borderBottom: "1px solid #222" },
  tab: (active: boolean) => ({ flex: 1, padding: "10px 0", background: active ? "#1e3a5f" : "none", border: "none", color: active ? "#60a5fa" : "#888", fontWeight: active ? 700 : 400, cursor: "pointer", fontSize: 14 }),
  orderList: { flex: 1, overflowY: "auto" as const, padding: "8px" },
  orderCard: { position: "relative" as const, background: "#1a1a1a", borderRadius: 10, padding: "12px", marginBottom: 8, cursor: "pointer", border: "1px solid #2a2a2a" },
  orderCardTop: { display: "flex" as const, justifyContent: "space-between" as const, alignItems: "center" as const },
  statusBadge: { fontSize: 11, padding: "2px 8px", borderRadius: 10, color: "#fff", fontWeight: 600 },
  msgCount: { position: "absolute" as const, top: 12, right: 12, background: "#ef4444", color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "flex" as const, alignItems: "center" as const, justifyContent: "center" as const, fontSize: 11, fontWeight: 700 },
  chatHeader: { display: "flex" as const, alignItems: "center" as const, gap: 8, padding: "10px 12px", borderBottom: "1px solid #222", background: "#1a1a1a" },
  backBtn: { background: "none", border: "none", color: "#60a5fa", fontSize: 16, cursor: "pointer", padding: "4px 8px" },
  clientInfo: { display: "flex" as const, gap: 12, padding: "8px 12px", background: "#161616", fontSize: 12, color: "#888", flexWrap: "wrap" as const, borderBottom: "1px solid #1a1a1a" },
  statusRow: { display: "flex" as const, gap: 6, padding: "6px 10px", background: "#111", borderBottom: "1px solid #1a1a1a" },
  statusBtn: (color: string) => ({ background: color, border: "none", color: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600 }),
  quickMsgs: { display: "flex" as const, gap: 6, padding: "6px 10px", overflowX: "auto" as const, borderBottom: "1px solid #1a1a1a", background: "#111" },
  quickBtn: { background: "#1e3a5f", border: "1px solid #2563eb", color: "#60a5fa", borderRadius: 16, padding: "4px 10px", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" as const },
  messages: { flex: 1, overflowY: "auto" as const, padding: "10px", display: "flex" as const, flexDirection: "column" as const, gap: 8 },
  bubble: { maxWidth: "80%", padding: "8px 12px", borderRadius: 12, display: "flex" as const, flexDirection: "column" as const },
  inputRow: { display: "flex" as const, gap: 8, padding: "8px 10px", borderTop: "1px solid #222", background: "#1a1a1a" },
  textarea: { flex: 1, background: "#2a2a2a", border: "1px solid #333", borderRadius: 10, color: "#fff", padding: "8px 10px", fontSize: 14, resize: "none" as const, outline: "none" },
  sendBtn: { background: "#2563eb", border: "none", borderRadius: 10, color: "#fff", padding: "0 16px", fontSize: 20, cursor: "pointer" },
}
