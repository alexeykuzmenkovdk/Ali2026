import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { TermsModal } from "@/components/terms-modal"
import { PrivacyModal } from "@/components/privacy-modal"
import { BLOG_CATEGORIES } from "@/lib/blog"
import { listBlogPosts } from "@/lib/store"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Блог | AlipayFast",
  description: "Статьи о платежах, шопинге в Китае, маркетплейсах и инструкциях AlipayFast.",
  openGraph: {
    title: "Блог | AlipayFast",
    description: "Статьи о платежах, шопинге в Китае, маркетплейсах и инструкциях AlipayFast.",
    images: ["/og-alipay-fast.png"],
  },
}

const formatDate = (value: string) => new Date(value).toLocaleDateString("ru-RU")

export default async function BlogPage() {
  const posts = await listBlogPosts({ publishedOnly: true })

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-white">
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-gray-900">Блог</h1>
            <p className="mt-4 text-lg text-gray-600">
              Держим вас в курсе новостей и делимся гайдами по оплате в Китае, покупкам и работе с площадками.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16 space-y-12">
          {BLOG_CATEGORIES.map((category) => {
            const categoryPosts = posts.filter((post) => post.category === category.slug)
            return (
              <div key={category.slug} className="space-y-6">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">{category.title}</h2>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                  <Link
                    href={`/blog/${category.slug}`}
                    className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                  >
                    Смотреть все →
                  </Link>
                </div>

                {categoryPosts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500">
                    В этом разделе пока нет публикаций.
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {categoryPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.category}/${post.slug}`}
                        className="group rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="relative h-48 overflow-hidden rounded-t-2xl bg-gray-100">
                          {post.coverImageUrl ? (
                            <img
                              src={post.coverImageUrl}
                              alt={post.title}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                          ) : post.coverVideoUrl ? (
                            <video
                              src={post.coverVideoUrl}
                              className="h-full w-full object-cover"
                              muted
                              playsInline
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm text-gray-400">Нет медиа</div>
                          )}
                        </div>
                        <div className="p-5">
                          <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
                          <h3 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-orange-600">
                            {post.title}
                          </h3>
                          <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                            {post.excerpt || "Скоро здесь появится подробное описание публикации."}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </section>
      </main>
      <footer className="bg-white py-8 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 text-sm">© {new Date().getFullYear()} AlipayFast. Все права защищены.</p>
            </div>
            <div className="flex space-x-6">
              <TermsModal />
              <PrivacyModal />
              <Link href="https://t.me/whaledator" className="text-gray-600 hover:text-orange-500 text-sm">
                Связаться с нами
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
