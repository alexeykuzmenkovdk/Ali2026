export type BlogCategory = {
  slug: string
  title: string
  description: string
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    slug: "popolnenie-alipay",
    title: "Пополнение Alipay",
    description: "Инструкции, лимиты и советы по безопасному пополнению Alipay.",
  },
  {
    slug: "oplata-i-pokupki-v-kitae",
    title: "Оплата и покупки в Китае",
    description: "Практические советы по оплатам, покупкам и сервисам в КНР.",
  },
  {
    slug: "kitayskie-marketpleysy",
    title: "Китайские маркетплейсы",
    description: "Обзоры площадок, подборки продавцов и нюансы заказов.",
  },
  {
    slug: "problemy-i-blokirovki-alipay",
    title: "Проблемы и блокировки Alipay",
    description: "Разбираем частые ошибки, блокировки и способы восстановления.",
  },
]

export const BLOG_CATEGORY_LOOKUP = new Map(BLOG_CATEGORIES.map((category) => [category.slug, category]))
