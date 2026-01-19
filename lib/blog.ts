export type BlogCategory = {
  slug: string
  title: string
  description: string
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    slug: "oplata-v-kitae",
    title: "Оплата в Китае",
    description: "Способы оплаты, нюансы переводов и советы по расчетам.",
  },
  {
    slug: "shopping-v-kitae",
    title: "Шопинг в Китае",
    description: "Гайды по покупкам, подборки сервисов и лайфхаки.",
  },
  {
    slug: "sravnenie-tsen",
    title: "Сравнение цен",
    description: "Сравниваем цены и находим оптимальные решения.",
  },
  {
    slug: "instrukcii",
    title: "Инструкции",
    description: "Пошаговые инструкции и ответы на популярные вопросы.",
  },
  {
    slug: "rynki-i-platformy",
    title: "Рынки и платформы",
    description: "Обзор маркетплейсов, сервисов и торговых площадок.",
  },
]

export const BLOG_CATEGORY_LOOKUP = new Map(BLOG_CATEGORIES.map((category) => [category.slug, category]))
