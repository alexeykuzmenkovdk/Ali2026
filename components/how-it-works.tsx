import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Свяжитесь с нами",
      description: "Напишите нам в Telegram, WhatsApp или по электронной почте, чтобы начать процесс пополнения.",
    },
    {
      number: "02",
      title: "Укажите сумму",
      description: "Сообщите нам, на какую сумму в юанях вы хотите пополнить ваш Alipay кошелек.",
    },
    {
      number: "03",
      title: "Получите реквизиты",
      description: "Мы предоставим вам реквизиты для оплаты в рублях по текущему обменному курсу.",
    },
    {
      number: "04",
      title: "Произведите оплату",
      description: "Переведите указанную сумму в рублях на предоставленные реквизиты.",
    },
    {
      number: "05",
      title: "Подтвердите оплату",
      description: "Отправьте нам подтверждение оплаты и данные вашего Alipay кошелька.",
    },
    {
      number: "06",
      title: "Получите юани",
      description: "Мы пополним ваш Alipay кошелек указанной суммой в юанях в течение нескольких минут.",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {steps.map((step) => (
        <Card
          key={step.number}
          className="relative overflow-hidden border-2 shadow-md transition-all duration-200 hover:shadow-lg"
        >
          <div className="absolute -right-4 -top-4 text-9xl font-bold text-gradient-to-r from-orange-100 to-red-100 opacity-50">
            {step.number}
          </div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-xl text-orange-600">{step.title}</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <CardDescription className="text-base text-gray-600">{step.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
