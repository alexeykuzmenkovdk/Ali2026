export const normalizeMediaUrl = (value?: string | null) => {
  if (!value) return null
  if (value.startsWith("http") || value.startsWith("/")) {
    return value
  }
  return `/${value}`
}
