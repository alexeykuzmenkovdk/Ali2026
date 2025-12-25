"use client"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Globe, CreditCard, ShieldCheck, Smartphone } from "lucide-react"

export function AlipayTutorialTips() {
  const tips = [
    {
      title: "Используйте VPN в Китае",
      description:
        "Для стабильной работы некоторых функций Alipay в Китае может потребоваться VPN, особенно если вы используете иностранный номер телефона.",
      icon: <Globe className="h-6 w-6 text-orange-500" />,
    },
    {
      title: "Следите за курсом обмена",
      description:
        "Курс обмена юаня может меняться. Следите за выгодными предложениями на нашем сайте для пополнения вашего Alipay кошелька.",
      icon: <CreditCard className="h-6 w-6 text-orange-500" />,
    },
    {
      title: "Не делитесь данными аккаунта",
      description:
        "Никогда не передавайте свои данные для входа в Alipay третьим лицам, даже если они представляются сотрудниками сервиса.",
      icon: <ShieldCheck className="h-6 w-6 text-orange-500" />,
    },
    {
      title: "Обновляйте приложение",
      description:
        "Регулярно обновляйте приложение Alipay до последней версии для получения новых функций и исправления ошибок безопасности.",
      icon: <Smartphone className="h-6 w-6 text-orange-500" />,
    },
  ]

  const warnings = [
    {
      title: "Ограничения для иностранцев",
      description:
        "Некоторые функции Alipay могут быть недоступны для иностранных пользователей. Функциональность может отличаться от той, что доступна китайским гражданам.",
    },
    {
      title: "Проверяйте QR-коды перед сканированием",
      description:
        "Сканируйте только QR-коды в проверенных местах. Мошенники могут использовать поддельные QR-коды для кражи средств.",
    },
    {
      title: "Внимательно проверяйте сумму перед оплатой",
      description:
        "Всегда проверяйте сумму перед подтверждением платежа. В Китае используется юань (CNY), не путайте с другими валютами.",
    },
  ]

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container px-4 md:px-6">
        <ScrollReveal>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                Полезные советы по использованию Alipay
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl">
                Рекомендации для эффективного и безопасного использования Alipay
              </p>
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tips.map((tip, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <Card className="h-full border-orange-100 shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                    {tip.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-bold">{tip.title}</h3>
                  <p className="text-gray-600">{tip.description}</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3}>
          <div className="mt-16">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              <h3 className="text-xl font-bold">Важные предупреждения</h3>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {warnings.map((warning, index) => (
                <Card key={index} className="border-amber-200 bg-amber-50 shadow-md">
                  <CardContent className="p-6">
                    <h4 className="mb-2 font-bold text-amber-800">{warning.title}</h4>
                    <p className="text-amber-700">{warning.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
