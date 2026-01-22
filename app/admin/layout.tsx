import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Админ-панель | AlipayFast",
  description: "Административная панель AlipayFast.",
  alternates: {
    canonical: "https://alipayfast.ru/admin/dashboard",
  },
  appleWebApp: {
    title: "AlipayFast Admin",
    capable: true,
    statusBarStyle: "default",
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
