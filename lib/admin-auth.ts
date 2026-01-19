const DEFAULT_SESSION_TTL_MS = 24 * 60 * 60 * 1000

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "Gjrhjdrf1991"
}

export function generateAdminSessionToken() {
  return `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function validateAdminSessionToken(token: string | null) {
  if (!token) return { valid: false, reason: "missing" }
  if (!token.startsWith("admin_")) return { valid: false, reason: "format" }

  const parts = token.split("_")
  if (parts.length !== 3) return { valid: false, reason: "structure" }

  const timestamp = Number.parseInt(parts[1], 10)
  if (Number.isNaN(timestamp)) return { valid: false, reason: "timestamp" }

  const ttl = process.env.ADMIN_SESSION_TTL_MS
  const ttlMs = ttl ? Number.parseInt(ttl, 10) : DEFAULT_SESSION_TTL_MS
  if (Number.isNaN(ttlMs) || ttlMs <= 0) {
    return { valid: false, reason: "ttl" }
  }

  const tokenAge = Date.now() - timestamp
  if (tokenAge > ttlMs) return { valid: false, reason: "expired" }

  return { valid: true, ageMs: tokenAge }
}

export function requireAdminAuth(request: Request) {
  const adminKey = process.env.ADMIN_API_KEY
  const providedKey = request.headers.get("x-admin-key")
  if (adminKey && providedKey && adminKey === providedKey) {
    return { ok: true, mode: "key" as const }
  }

  const url = new URL(request.url)
  const token = url.searchParams.get("token") || request.headers.get("x-admin-token")
  const validation = validateAdminSessionToken(token)
  if (!validation.valid) {
    return { ok: false, mode: "token" as const, reason: validation.reason }
  }

  return { ok: true, mode: "token" as const }
}
