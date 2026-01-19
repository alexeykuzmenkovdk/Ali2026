import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { TermsModal } from "@/components/terms-modal"
import { PrivacyModal } from "@/components/privacy-modal"
import { BLOG_CATEGORY_LOOKUP } from "@/lib/blog"
import { getBlogPostBySlug } from "@/lib/store"

export const dynamic = "force-dynamic"

type BlogPostPageProps = {
  params: { category: string; slug: string }
}

const formatDate = (value: string) => new Date(value).toLocaleDateString("ru-RU")

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.category, params.slug, true)
  if (!post) {
    return { title: "Публикация не найдена" }
  }

  return {
    title: `${post.title} | Блог AlipayFast`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: `${post.title} | Блог AlipayFast`,
      description: post.excerpt ?? undefined,
      images: [post.coverImageUrl ?? "/og-alipay-fast.png"],
    },
  }
}

const renderContentParagraphs = (content?: string | null) => {
  if (!content) return null
  return content.split(/\n{2,}/).map((paragraph, index) => {
    const lines = paragraph.split("\n")
    return (
      <p key={`${paragraph.slice(0, 10)}-${index}`} className="mt-4 text-base leading-7 text-gray-700">
        {lines.map((line, lineIndex) => (
          <span key={`${line.slice(0, 10)}-${lineIndex}`}>
            {line}
            {lineIndex < lines.length - 1 ? <br /> : null}
          </span>
        ))}
      </p>
    )
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const category = BLOG_CATEGORY_LOOKUP.get(params.category)
  if (!category) {
    notFound()
  }

  const post = await getBlogPostBySlug(params.category, params.slug, true)
  if (!post) {
    notFound()
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-white">
        <section className="container mx-auto px-4 py-12">
          <nav className="text-sm text-gray-500">
            <Link href="/blog" className="hover:text-orange-600">
              Блог
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/blog/${category.slug}`} className="hover:text-orange-600">
              {category.title}
            </Link>
          </nav>

          <h1 className="mt-4 text-4xl font-bold text-gray-900">{post.title}</h1>
          <p className="mt-2 text-sm text-gray-400">{formatDate(post.createdAt)}</p>
          {post.excerpt && <p className="mt-4 text-lg text-gray-600 max-w-3xl">{post.excerpt}</p>}
        </section>

        <section className="container mx-auto px-4 pb-16">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {post.coverImageUrl ? (
              <img src={post.coverImageUrl} alt={post.title} className="h-96 w-full object-cover" />
            ) : post.coverVideoUrl ? (
              <video src={post.coverVideoUrl} className="h-96 w-full object-cover" controls />
            ) : null}
            <article className="px-6 py-8">
              {renderContentParagraphs(post.content) ?? (
                <p className="text-base text-gray-700">Скоро здесь появится подробный текст публикации.</p>
              )}
            </article>
          </div>
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
