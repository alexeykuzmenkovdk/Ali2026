import { randomUUID } from "crypto"
import { ensureSchema, getPool } from "@/lib/db"

export type OrderStatus = "CREATED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED"
export type PaymentStatus =
  | "WAITING_FOR_DETAILS"
  | "WAITING_FOR_PAYMENT"
  | "PAID"
  | "VERIFIED"
  | "CANCELED"
export type MessageRole = "client" | "admin"
export type SourcingStatus = "PENDING" | "ANSWERED" | "DECLINED"

export interface Order {
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
}

export interface PaymentStep {
  id: string
  orderId: string
  stepIndex: number
  status: PaymentStatus
  amountRub: number
  method: "CARD" | "SBP"
  requisiteValue: string
  bankName: string
  receiptEmail: string
  receiptFileUrl?: string
  createdAt: string
  updatedAt: string
}

export interface OrderMessage {
  id: string
  orderId: string
  senderRole: MessageRole
  text?: string
  fileUrl?: string
  createdAt: string
}

export interface ShowcaseItem {
  id: string
  title: string
  imageUrl: string
  description?: string
  priceCny: number
  priceRub: number
  benefitRub: number
  isPublished: boolean
}

export interface BlogPost {
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

export interface SourcingRequest {
  id: string
  userId: number
  description: string
  imageUrl: string
  link?: string
  priceRub?: number
  answerCny?: number
  comment?: string
  status: SourcingStatus
  createdAt: string
  answeredAt?: string
}

interface AdminSession {
  stage: "idle" | "await_photo" | "await_details" | "await_sourcing_answer"
  photoUrl?: string
  sourcingRequestId?: string
}

const DEFAULT_SHOWCASE = [
  {
    title: "Dyson Airwrap",
    imageUrl: "/showcase/dyson.png",
    description: "Стайлер для волос с насадками в комплекте.",
    priceCny: 4200,
    priceRub: 65000,
    benefitRub: 18000,
  },
  {
    title: "Nike Air Force 1",
    imageUrl: "/showcase/nike.png",
    description: "Классические кроссовки в нескольких цветах.",
    priceCny: 980,
    priceRub: 15000,
    benefitRub: 4500,
  },
  {
    title: "iPhone 15 Pro 256",
    imageUrl: "/showcase/iphone.png",
    description: "Флагманский смартфон в титановом корпусе.",
    priceCny: 8999,
    priceRub: 125000,
    benefitRub: 22000,
  },
]

async function seedShowcase() {
  const pool = getPool()
  const existing = await pool.query("SELECT id FROM showcase_items LIMIT 1")
  if (existing.rowCount && existing.rowCount > 0) return
  for (const item of DEFAULT_SHOWCASE) {
    await pool.query(
      `INSERT INTO showcase_items (id, title, image_url, description, price_cny, price_rub, benefit_rub, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)`,
      [randomUUID(), item.title, item.imageUrl, item.description ?? null, item.priceCny, item.priceRub, item.benefitRub],
    )
  }
}

async function ensureReady() {
  await ensureSchema()
  await seedShowcase()
}

export async function getActiveOrder(userId: number) {
  await ensureReady()
  const pool = getPool()
  const result = await pool.query(
    `SELECT * FROM orders WHERE user_id = $1 AND status IN ('CREATED', 'IN_PROGRESS') ORDER BY created_at DESC LIMIT 1`,
    [userId],
  )
  return result.rows[0] ? mapOrder(result.rows[0]) : undefined
}

export async function listArchivedOrders(userId: number) {
  await ensureReady()
  const pool = getPool()
  const result = await pool.query(
    `SELECT * FROM orders WHERE user_id = $1 AND status IN ('COMPLETED', 'CANCELED') ORDER BY created_at DESC`,
    [userId],
  )
  return result.rows.map(mapOrder)
}

export async function getOrderByIdForUser(orderId: string, userId: number) {
  await ensureReady()
  const pool = getPool()
  const result = await pool.query("SELECT * FROM orders WHERE id = $1 AND user_id = $2", [orderId, userId])
  return result.rows[0] ? mapOrder(result.rows[0]) : undefined
}

export async function listOrderSteps(orderId: string) {
  await ensureReady()
  const pool = getPool()
  const result = await pool.query(
    "SELECT * FROM payment_steps WHERE order_id = $1 ORDER BY step_index ASC",
    [orderId],
  )
  return result.rows.map(mapStep)
}

export async function listOrderMessages(orderId: string) {
  await ensureReady()
  const pool = getPool()
  const result = await pool.query(
    "SELECT * FROM order_messages WHERE order_id = $1 ORDER BY created_at ASC",
    [orderId],
  )
  return result.rows.map(mapMessage)
}

export async function listBlogPosts(options?: { category?: string; publishedOnly?: boolean }) {
  await ensureReady()
  const pool = getPool()
  const params: Array<string | boolean> = []
  const conditions: string[] = []

  if (options?.category) {
    params.push(options.category)
    conditions.push(`category = $${params.length}`)
  }
  if (options?.publishedOnly) {
    params.push(true)
    conditions.push(`is_published = $${params.length}`)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""
  const result = await pool.query(`SELECT * FROM blog_posts ${whereClause} ORDER BY created_at DESC`, params)
  return result.rows.map(mapBlogPost)
}

export async function getBlogPostBySlug(category: string, slug: string, publishedOnly = true) {
  await ensureReady()
  const pool = getPool()
  const params: Array<string | boolean> = [category, slug]
  let query = "SELECT * FROM blog_posts WHERE category = $1 AND slug = $2"
  if (publishedOnly) {
    params.push(true)
    query += " AND is_published = $3"
  }
  const result = await pool.query(query, params)
  return result.rows[0] ? mapBlogPost(result.rows[0]) : undefined
}

export async function createBlogPost(data: {
  title: string
  slug: string
  category: string
  excerpt?: string | null
  content?: string | null
  coverImageUrl?: string | null
  coverVideoUrl?: string | null
  isPublished?: boolean
}) {
  await ensureReady()
  const pool = getPool()
  const now = new Date().toISOString()
  const id = randomUUID()
  const result = await pool.query(
    `INSERT INTO blog_posts
      (id, title, slug, category, excerpt, content, cover_image_url, cover_video_url, is_published, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING *`,
    [
      id,
      data.title,
      data.slug,
      data.category,
      data.excerpt ?? null,
      data.content ?? null,
      data.coverImageUrl ?? null,
      data.coverVideoUrl ?? null,
      data.isPublished ?? false,
      now,
      now,
    ],
  )
  return mapBlogPost(result.rows[0])
}

export async function updateBlogPost(
  id: string,
  data: Partial<{
    title: string
    slug: string
    category: string
    excerpt?: string | null
    content?: string | null
    coverImageUrl?: string | null
    coverVideoUrl?: string | null
    isPublished: boolean
  }>,
) {
  await ensureReady()
  const pool = getPool()
  const now = new Date().toISOString()
  const fields: string[] = []
  const values: Array<string | boolean | null> = []

  const assignField = (field: string, value: string | boolean | null | undefined) => {
    if (value === undefined) return
    values.push(value)
    fields.push(`${field} = $${values.length}`)
  }

  assignField("title", data.title)
  assignField("slug", data.slug)
  assignField("category", data.category)
  assignField("excerpt", data.excerpt ?? null)
  assignField("content", data.content ?? null)
  assignField("cover_image_url", data.coverImageUrl ?? null)
  assignField("cover_video_url", data.coverVideoUrl ?? null)
  assignField("is_published", data.isPublished)

  values.push(now)
  fields.push(`updated_at = $${values.length}`)
  values.push(id)

  if (fields.length === 0) {
    const result = await pool.query("SELECT * FROM blog_posts WHERE id = $1", [id])
    return result.rows[0] ? mapBlogPost(result.rows[0]) : undefined
  }

  const result = await pool.query(
    `UPDATE blog_posts SET ${fields.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values,
  )
  return result.rows[0] ? mapBlogPost(result.rows[0]) : undefined
}

export async function deleteBlogPost(id: string) {
  await ensureReady()
  const pool = getPool()
  await pool.query("DELETE FROM blog_posts WHERE id = $1", [id])
}

export async function getOrderById(orderId: string) {
  await ensureReady()
  const pool = getPool()
  const result = await pool.query("SELECT * FROM orders WHERE id = $1", [orderId])
  return result.rows[0] ? mapOrder(result.rows[0]) : undefined
}

export async function createOrder(data: {
  userId: number
  totalRub: number
  totalCny: number
  rate: number
  alipayId?: string
  fullName?: string
  contactUsername?: string
  contactPhone?: string
}) {
  await ensureReady()
  const pool = getPool()
  const now = new Date().toISOString()
  const orderId = randomUUID()
  const stepId = randomUUID()
  await pool.query("BEGIN")
  try {
    await pool.query(
      `INSERT INTO orders
        (id, user_id, status, total_rub, total_cny, rate, alipay_id, full_name, contact_username, contact_phone, created_at, updated_at)
       VALUES ($1, $2, 'CREATED', $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        orderId,
        data.userId,
        data.totalRub,
        data.totalCny,
        data.rate,
        data.alipayId ?? null,
        data.fullName ?? null,
        data.contactUsername ?? null,
        data.contactPhone ?? null,
        now,
        now,
      ],
    )

    await pool.query(
      `INSERT INTO payment_steps
        (id, order_id, step_index, status, amount_rub, method, requisite_value, bank_name, receipt_email, created_at, updated_at)
       VALUES ($1, $2, 1, 'WAITING_FOR_PAYMENT', $3, 'SBP', $4, $5, $6, $7, $8)`,
      [stepId, orderId, Math.round(data.totalRub / 2), "+7 999 888-77-66", "Т-Банк", "pay@alipayfast.ru", now, now],
    )

    await pool.query("COMMIT")
  } catch (error) {
    await pool.query("ROLLBACK")
    throw error
  }

  const order = await pool.query("SELECT * FROM orders WHERE id = $1", [orderId])
  return mapOrder(order.rows[0])
}

export async function cancelOrder(orderId: string) {
  await ensureReady()
  const pool = getPool()
  const now = new Date().toISOString()
  const result = await pool.query(
    "UPDATE orders SET status = 'CANCELED', updated_at = $2 WHERE id = $1 AND status != 'COMPLETED' RETURNING *",
    [orderId, now],
  )
  if (!result.rows[0]) return undefined
  await pool.query(
    "UPDATE payment_steps SET status = 'CANCELED', updated_at = $2 WHERE order_id = $1 AND status != 'VERIFIED'",
    [orderId, now],
  )
  return mapOrder(result.rows[0])
}

export async function markStepPaid(orderId: string, stepId: string, receiptFileUrl?: string) {
  await ensureReady()
  const pool = getPool()
  const now = new Date().toISOString()
  const result = await pool.query(
    "UPDATE payment_steps SET status = 'PAID', receipt_file_url = $3, updated_at = $4 WHERE id = $1 AND order_id = $2 RETURNING *",
    [stepId, orderId, receiptFileUrl ?? null, now],
  )
  if (!result.rows[0]) return undefined
  await pool.query("UPDATE orders SET status = 'IN_PROGRESS', updated_at = $2 WHERE id = $1", [orderId, now])
  return mapStep(result.rows[0])
}

export async function addMessage(data: { orderId: string; senderRole: MessageRole; text?: string; fileUrl?: string }) {
  await ensureReady()
  const pool = getPool()
  const messageId = randomUUID()
  const now = new Date().toISOString()
  await pool.query(
    `INSERT INTO order_messages (id, order_id, sender_role, text, file_url, created_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [messageId, data.orderId, data.senderRole, data.text ?? null, data.fileUrl ?? null, now],
  )
  return {
    id: messageId,
    orderId: data.orderId,
    senderRole: data.senderRole,
    text: data.text,
    fileUrl: data.fileUrl,
    createdAt: now,
  }
}

export async function listShowcaseItems() {
  await ensureReady()
  const pool = getPool()
  const result = await pool.query("SELECT * FROM showcase_items WHERE is_published = TRUE")
  return result.rows.map(mapShowcase)
}

export async function listAllShowcaseItems() {
  await ensureReady()
  const pool = getPool()
  const result = await pool.query("SELECT * FROM showcase_items ORDER BY title ASC")
  return result.rows.map(mapShowcase)
}

export async function addShowcaseItem(
  item: Omit<ShowcaseItem, "id" | "isPublished"> & { isPublished?: boolean },
) {
  await ensureReady()
  const pool = getPool()
  const id = randomUUID()
  const published = item.isPublished ?? false
  await pool.query(
    `INSERT INTO showcase_items (id, title, image_url, description, price_cny, price_rub, benefit_rub, is_published)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [id, item.title, item.imageUrl, item.description ?? null, item.priceCny, item.priceRub, item.benefitRub, published],
  )
  return { ...item, id, isPublished: published }
}

export async function setShowcasePublish(id: string, isPublished: boolean) {
  await ensureReady()
  const pool = getPool()
  const result = await pool.query(
    "UPDATE showcase_items SET is_published = $2 WHERE id = $1 RETURNING *",
    [id, isPublished],
  )
  return result.rows[0] ? mapShowcase(result.rows[0]) : undefined
}

export async function updateShowcaseItem(
  id: string,
  updates: Partial<Omit<ShowcaseItem, "id">>,
) {
  await ensureReady()
  const pool = getPool()
  const existing = await pool.query("SELECT * FROM showcase_items WHERE id = $1", [id])
  if (!existing.rows[0]) return undefined
  const current = mapShowcase(existing.rows[0])
  const next = {
    title: updates.title ?? current.title,
    imageUrl: updates.imageUrl ?? current.imageUrl,
    description: updates.description ?? current.description ?? null,
    priceCny: updates.priceCny ?? current.priceCny,
    priceRub: updates.priceRub ?? current.priceRub,
    benefitRub: updates.benefitRub ?? current.benefitRub,
    isPublished: updates.isPublished ?? current.isPublished,
  }
  const result = await pool.query(
    `UPDATE showcase_items
      SET title = $2,
          image_url = $3,
          description = $4,
          price_cny = $5,
          price_rub = $6,
          benefit_rub = $7,
          is_published = $8
      WHERE id = $1
      RETURNING *`,
    [
      id,
      next.title,
      next.imageUrl,
      next.description ?? null,
      next.priceCny,
      next.priceRub,
      next.benefitRub,
      next.isPublished,
    ],
  )
  return result.rows[0] ? mapShowcase(result.rows[0]) : undefined
}

export async function publishShowcaseItem(id: string) {
  await ensureReady()
  const pool = getPool()
  const result = await pool.query(
    "UPDATE showcase_items SET is_published = TRUE WHERE id = $1 RETURNING *",
    [id],
  )
  return result.rows[0] ? mapShowcase(result.rows[0]) : undefined
}

export async function listOrders() {
  await ensureReady()
  const pool = getPool()
  const result = await pool.query(
    `SELECT o.*,
      (SELECT COUNT(*) FROM order_messages m WHERE m.order_id = o.id) as message_count,
      (SELECT CASE WHEN text IS NOT NULL THEN text ELSE '📎 Файл' END
       FROM order_messages m WHERE m.order_id = o.id ORDER BY created_at DESC LIMIT 1) as last_message
     FROM orders o
     ORDER BY created_at DESC`,
  )

  return result.rows.map((row) => ({
    ...mapOrder(row),
    messageCount: Number(row.message_count ?? 0),
    lastMessage: row.last_message ?? null,
  }))
}

export async function createSourcingRequest(data: {
  userId: number
  description: string
  imageUrl: string
  link?: string
  priceRub?: number
}) {
  await ensureReady()
  const pool = getPool()
  const id = randomUUID()
  const now = new Date().toISOString()
  await pool.query(
    `INSERT INTO sourcing_requests
      (id, user_id, description, image_url, link, price_rub, status, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, 'PENDING', $7)`,
    [id, data.userId, data.description, data.imageUrl, data.link ?? null, data.priceRub ?? null, now],
  )
  return {
    id,
    userId: data.userId,
    description: data.description,
    imageUrl: data.imageUrl,
    link: data.link,
    priceRub: data.priceRub,
    status: "PENDING",
    createdAt: now,
  }
}

export async function getLastSourcingRequest(userId: number) {
  await ensureReady()
  const pool = getPool()
  const result = await pool.query(
    "SELECT * FROM sourcing_requests WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1",
    [userId],
  )
  return result.rows[0] ? mapSourcing(result.rows[0]) : undefined
}

export async function getSourcingRequestById(requestId: string) {
  await ensureReady()
  const pool = getPool()
  const result = await pool.query("SELECT * FROM sourcing_requests WHERE id = $1", [requestId])
  return result.rows[0] ? mapSourcing(result.rows[0]) : undefined
}

export async function answerSourcingRequest(data: { requestId: string; answerCny: number; comment?: string }) {
  await ensureReady()
  const pool = getPool()
  const now = new Date().toISOString()
  const result = await pool.query(
    `UPDATE sourcing_requests
      SET answer_cny = $2,
          comment = $3,
          status = 'ANSWERED',
          answered_at = $4
      WHERE id = $1
      RETURNING *`,
    [data.requestId, data.answerCny, data.comment ?? null, now],
  )
  return result.rows[0] ? mapSourcing(result.rows[0]) : undefined
}

export async function declineSourcingRequest(requestId: string) {
  await ensureReady()
  const pool = getPool()
  const now = new Date().toISOString()
  const result = await pool.query(
    `UPDATE sourcing_requests
      SET status = 'DECLINED',
          answered_at = $2
      WHERE id = $1
      RETURNING *`,
    [requestId, now],
  )
  return result.rows[0] ? mapSourcing(result.rows[0]) : undefined
}

export async function getAdminSession(adminId: number) {
  await ensureReady()
  const pool = getPool()
  const result = await pool.query("SELECT * FROM admin_sessions WHERE admin_id = $1", [adminId])
  const row = result.rows[0]
  if (!row) return { stage: "idle" as const }
  return {
    stage: row.stage as AdminSession["stage"],
    photoUrl: row.photo_url ?? undefined,
    sourcingRequestId: row.sourcing_request_id ?? undefined,
  }
}

export async function setAdminSession(adminId: number, session: AdminSession) {
  await ensureReady()
  const pool = getPool()
  await pool.query(
    `INSERT INTO admin_sessions (admin_id, stage, photo_url, sourcing_request_id)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (admin_id) DO UPDATE
      SET stage = EXCLUDED.stage,
          photo_url = EXCLUDED.photo_url,
          sourcing_request_id = EXCLUDED.sourcing_request_id`,
    [adminId, session.stage, session.photoUrl ?? null, session.sourcingRequestId ?? null],
  )
}

export async function addPaymentStep(data: {
  orderId: string
  amountRub: number
  method: "CARD" | "SBP"
  requisiteValue: string
  bankName: string
  receiptEmail: string
  status?: PaymentStatus
}) {
  await ensureReady()
  const pool = getPool()
  const result = await pool.query(
    "SELECT COALESCE(MAX(step_index), 0) as max_index FROM payment_steps WHERE order_id = $1",
    [data.orderId],
  )
  const nextIndex = Number(result.rows[0]?.max_index ?? 0) + 1
  const now = new Date().toISOString()
  const id = randomUUID()
  const status = data.status ?? "WAITING_FOR_PAYMENT"
  await pool.query(
    `INSERT INTO payment_steps
      (id, order_id, step_index, status, amount_rub, method, requisite_value, bank_name, receipt_email, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [
      id,
      data.orderId,
      nextIndex,
      status,
      data.amountRub,
      data.method,
      data.requisiteValue,
      data.bankName,
      data.receiptEmail,
      now,
      now,
    ],
  )
  const step = await pool.query("SELECT * FROM payment_steps WHERE id = $1", [id])
  return mapStep(step.rows[0])
}

export async function verifyPaymentStep(orderId: string, stepId: string) {
  await ensureReady()
  const pool = getPool()
  const now = new Date().toISOString()
  const result = await pool.query(
    "UPDATE payment_steps SET status = 'VERIFIED', updated_at = $3 WHERE id = $1 AND order_id = $2 RETURNING *",
    [stepId, orderId, now],
  )
  return result.rows[0] ? mapStep(result.rows[0]) : undefined
}

export async function completeOrder(orderId: string) {
  await ensureReady()
  const pool = getPool()
  const blocking = await pool.query(
    "SELECT 1 FROM payment_steps WHERE order_id = $1 AND status IN ('WAITING_FOR_PAYMENT', 'PAID') LIMIT 1",
    [orderId],
  )
  if (blocking.rowCount && blocking.rowCount > 0) {
    return { error: "Active steps exist" as const }
  }
  const now = new Date().toISOString()
  const result = await pool.query(
    "UPDATE orders SET status = 'COMPLETED', updated_at = $2 WHERE id = $1 RETURNING *",
    [orderId, now],
  )
  return result.rows[0] ? mapOrder(result.rows[0]) : undefined
}

export async function adminCancelOrder(orderId: string) {
  await ensureReady()
  const pool = getPool()
  const now = new Date().toISOString()
  const result = await pool.query(
    "UPDATE orders SET status = 'CANCELED', updated_at = $2 WHERE id = $1 RETURNING *",
    [orderId, now],
  )
  return result.rows[0] ? mapOrder(result.rows[0]) : undefined
}

function mapOrder(row: any): Order {
  return {
    id: row.id,
    userId: Number(row.user_id),
    status: row.status,
    totalRub: Number(row.total_rub),
    totalCny: Number(row.total_cny),
    rate: Number(row.rate),
    alipayId: row.alipay_id ?? null,
    fullName: row.full_name ?? null,
    contactUsername: row.contact_username ?? null,
    contactPhone: row.contact_phone ?? null,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  }
}

function mapStep(row: any): PaymentStep {
  return {
    id: row.id,
    orderId: row.order_id,
    stepIndex: Number(row.step_index),
    status: row.status,
    amountRub: Number(row.amount_rub),
    method: row.method,
    requisiteValue: row.requisite_value,
    bankName: row.bank_name,
    receiptEmail: row.receipt_email,
    receiptFileUrl: row.receipt_file_url ?? undefined,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  }
}

function mapMessage(row: any): OrderMessage {
  return {
    id: row.id,
    orderId: row.order_id,
    senderRole: row.sender_role,
    text: row.text ?? undefined,
    fileUrl: row.file_url ?? undefined,
    createdAt: row.created_at.toISOString(),
  }
}

function mapShowcase(row: any): ShowcaseItem {
  return {
    id: row.id,
    title: row.title,
    imageUrl: row.image_url,
    description: row.description ?? undefined,
    priceCny: Number(row.price_cny),
    priceRub: Number(row.price_rub),
    benefitRub: Number(row.benefit_rub),
    isPublished: row.is_published,
  }
}

function mapBlogPost(row: any): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    excerpt: row.excerpt,
    content: row.content,
    coverImageUrl: row.cover_image_url,
    coverVideoUrl: row.cover_video_url,
    isPublished: row.is_published,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  }
}

function mapSourcing(row: any): SourcingRequest {
  return {
    id: row.id,
    userId: Number(row.user_id),
    description: row.description,
    imageUrl: row.image_url,
    link: row.link ?? undefined,
    priceRub: row.price_rub ? Number(row.price_rub) : undefined,
    answerCny: row.answer_cny ? Number(row.answer_cny) : undefined,
    comment: row.comment ?? undefined,
    status: row.status,
    createdAt: row.created_at.toISOString(),
    answeredAt: row.answered_at ? row.answered_at.toISOString() : undefined,
  }
}
