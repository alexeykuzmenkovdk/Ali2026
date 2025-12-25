"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"

const faqItems = [
  {
    question: "Безопасно ли покупать на Poizon?",
    answer:
      "Да, Poizon - это официальная платформа, которая гарантирует подлинность товаров. Все товары проходят проверку на аутентичность перед отправкой покупателю.",
  },
  {
    question: "Сколько времени занимает доставка в Россию?",
    answer:
      "Обычно доставка занимает от 7 до 14 дней в зависимости от выбранного способа доставки и региона. Экспресс-доставка может быть быстрее, но дороже.",
  },
  {
    question: "Можно ли вернуть товар, если он не подошел?",
    answer:
      "Да, Poizon предоставляет возможность возврата в течение определенного периода. Условия возврата зависят от типа товара и причины возврата.",
  },
  {
    question: "Какие способы оплаты доступны?",
    answer:
      "Основной способ оплаты - Alipay. Это самый удобный и безопасный метод для российских покупателей. Также доступны другие китайские платежные системы.",
  },
  {
    question: "Как узнать правильный размер?",
    answer:
      "Используйте размерную табл��цу конкретного бренда в карточке товара. Китайские размеры часто отличаются от российских, поэтому внимательно изучайте таблицу размеров.",
  },
  {
    question: "Что делать, если товар не соответствует описанию?",
    answer:
      "Обратитесь в службу поддержки Poizon через приложение. Платформа защищает права покупателей и поможет решить спорные ситуации.",
  },
  {
    question: "Нужно ли платить таможенные пошлины?",
    answer:
      "При заказах на сумму свыше 200 евро или весом более 31 кг может потребоваться доплата таможенных пошлин. Обычно небольшие заказы проходят без дополнительных платежей.",
  },
  {
    question: "Как пополнить Alipay для покупок?",
    answer:
      "Вы можете пополнить Alipay через наш сервис. Мы предлагаем выгодный курс и быстрое зачисление средств на ваш кошелек.",
  },
]

export function PoisonTutorialFAQ() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-500" />
          Часто задаваемые вопросы о Poizon
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
              <AccordionContent className="text-gray-600">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
