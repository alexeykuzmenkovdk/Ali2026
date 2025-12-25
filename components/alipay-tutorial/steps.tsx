"use client"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Download, UserPlus, User, CreditCard, Shield, Languages, Settings, CheckCircle } from "lucide-react"
import { useState, useRef } from "react"

export function AlipayTutorialSteps() {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleVideoLoad = () => {
    setVideoLoaded(true)
  }

  const handleVideoError = () => {
    console.error("Ошибка загрузки видео")
    setVideoLoaded(false)
  }

  const steps = [
    {
      id: 1,
      title: "Скачайте приложение Alipay",
      description:
        "Загрузите официальное приложение Alipay из Google Play Store или App Store. Убедитесь, что вы скачиваете приложение от официального разработчика Ant Financial.",
      icon: <Download className="h-8 w-8 text-orange-500" />,
      imageUrl: "/alipay-guide/step-01-agreement.jpg",
      imageAlt: "Соглашение об использовании Alipay",
      instruction:
        "Всё просто, скачайте приложение Alipay. Перед входом согласитесь с условиями использования приложения, нажав на синюю кнопку (Agree).",
    },
    {
      id: 2,
      title: "Выберите код страны",
      description:
        "Далее выберите код страны и укажите номер телефона, если у вас уже есть аккаунт Taobao или 1688, то введите номер телефона, на который был зарегистрирован этот аккаунт.",
      icon: <UserPlus className="h-8 w-8 text-orange-500" />,
      imageUrl: "/alipay-guide/step-02-country-selection.jpg",
      imageAlt: "Выбор кода страны и ввод номера телефона",
      instruction: "Выберите код страны (Russia +7) и введите ваш номер телефона для регистрации.",
    },
    {
      id: 3,
      title: "Введите номер телефона",
      description: "После ввода телефона нажмите синюю кнопку ещё раз.",
      icon: <User className="h-8 w-8 text-orange-500" />,
      imageUrl: "/alipay-guide/step-03-phone-registration.jpg",
      imageAlt: "Ввод номера телефона для регистрации",
      instruction: "После ввода телефона нажмите синюю кнопку ещё раз.",
    },
    {
      id: 4,
      title: "Подтвердите номер телефона",
      description:
        "Нажмите на кнопку «Log in via SMS» после чего вам придёт СМС с кодом для входа в приложение, если СМС не пришло, нажмите на кнопку «Resend». После получения кода введите его в поле для ввода.",
      icon: <Shield className="h-8 w-8 text-orange-500" />,
      imageUrl: "/alipay-guide/step-04-sms-verification.jpg",
      imageAlt: "Ввод кода подтверждения из SMS",
      instruction: "Введите код подтверждения, полученный по SMS. Если код не пришел, нажmite кнопку 'Resend'.",
    },
    {
      id: 5,
      title: "Настройте язык интерфейса",
      description:
        "В приложении Alipay пока что нет русского языка, но можно установить английский, это уже лучше, чем вглядываться в иероглифы. Зайдите в приложение Alipay, в нижнем правом углу нажмите на кнопку «Me» (иконка с человечком), потом в верхнем правом углу на шестерёнку и вас перенесёт в настройки.",
      icon: <Languages className="h-8 w-8 text-orange-500" />,
      imageUrl: "/alipay-guide/step-05-main-screen-chinese.jpg",
      imageAlt: "Главный экран Alipay на китайском языке",
      instruction:
        "Зайдите в приложение Alipay, в нижнем правом углу нажмите на кнопку «Me» (иконка с человечком), потом в верхнем правом углу на шестерёнку.",
    },
    {
      id: 6,
      title: "Перейдите в языковые настройки",
      description: "На этом шаге опять зайдите в шестерёнку. Далее необходимо зайти в первый пункт.",
      icon: <Settings className="h-8 w-8 text-orange-500" />,
      imageUrl: "/alipay-guide/step-06-settings-chinese.jpg",
      imageAlt: "Настройки приложения на китайском языке",
      instruction: "В настройках найдите раздел 'Общие' (通用) и выберите 'Многоязычие' (多语言).",
    },
    {
      id: 7,
      title: "Выберите английский язык",
      description: "Выберете English и нажмите сохранить.",
      icon: <Languages className="h-8 w-8 text-orange-500" />,
      imageUrl: "/alipay-guide/step-07-language-selection.jpg",
      imageAlt: "Выбор английского языка",
      instruction: "Выберите English и нажмите кнопку сохранения в правом верхнем углу.",
    },
    {
      id: 8,
      title: "Настройте платежный пароль",
      description:
        "Зайдите в приложение Alipay, в нижнем правом углу нажмите на кнопку «Me», потом в верхнем правом углу на шестерёнку.",
      icon: <Shield className="h-8 w-8 text-orange-500" />,
      imageUrl: "/alipay-guide/step-08-main-screen-english.jpg",
      imageAlt: "Главный экран Alipay на английском языке",
      instruction: "Теперь интерфейс на английском языке. Снова зайдите в настройки через иконку шестеренки.",
    },
    {
      id: 9,
      title: "Перейдите в настройки безопасности",
      description: "В настройках выберете Account & Security и перейдите в Alipay Password.",
      icon: <Shield className="h-8 w-8 text-orange-500" />,
      imageUrl: "/alipay-guide/step-09-security-settings.jpg",
      imageAlt: "Настройки безопасности аккаунта",
      instruction: "В настройках выберите 'Account & Security', затем 'Alipay Password'.",
    },
    {
      id: 10,
      title: "Установите платежный пароль",
      description:
        "Здесь нужно создать платёжный пароль и повторить его, он состоит только из 6 цифр. Будьте внимательны, без этого пароля вы не сможете производить оплату, запомните его, а лучше запишите, чтобы точно не забыть и не потерять его.",
      icon: <CreditCard className="h-8 w-8 text-orange-500" />,
      imageUrl: "/alipay-guide/step-10-payment-password.jpg",
      imageAlt: "Установка 6-значного платежного пароля",
      instruction:
        "Создайте 6-значный платежный пароль. Будьте внимательны - без этого пароля вы не сможете совершать платежи. Обязательно запомните или запишите его!",
    },
    {
      id: 11,
      title: "Верификация кошелька Alipay",
      description:
        "Верификация кошелька Alipay - это обязательный процесс для полноценного использования всех функций приложения. Без верификации у вас будут ограничены лимиты на операции, и вы не сможете совершать крупные покупки или переводы. Верификация включает подтверждение вашей личности через загрузку документов и селфи.",
      icon: <CheckCircle className="h-8 w-8 text-orange-500" />,
      videoUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/authorization%20in%20the%20alipay%20wallet-Q5IBCPXX0ZVwmnSRvw6D5ZvXaHIIsa.mp4",
      isVideo: true,
      imageAlt: "Процесс верификации кошелька Alipay",
      instruction:
        "Пройдите верификацию личности, загрузив фото паспорта и сделав селфи. Это необходимо для снятия лимитов и полноценного использования кошелька.",
      benefits: [
        "Увеличение лимитов на операции до 200,000 юаней в год",
        "Возможность совершать крупные покупки",
        "Доступ к дополнительным финансовым услугам",
        "Повышенная безопасность аккаунта",
        "Возможность получать переводы от других пользователей",
      ],
    },
  ]

  return (
    <section id="steps" className="w-full py-16 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <ScrollReveal>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                Как пользоваться Alipay: пошаговая инструкция
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl">
                Следуйте этим шагам с реальными скриншотами, чтобы настроить и начать использовать Alipay
              </p>
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-16 space-y-20">
          {steps.map((step, index) => (
            <ScrollReveal key={step.id} delay={index * 0.1}>
              <div
                className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center`}
              >
                <div className="w-full md:w-1/2">
                  <div className="relative aspect-[3/4] w-full max-w-[400px] mx-auto overflow-hidden rounded-3xl shadow-xl border-4 border-gray-200">
                    {step.isVideo && step.videoUrl ? (
                      <video
                        src={step.videoUrl}
                        controls
                        className="w-full h-full object-contain bg-black"
                        preload="metadata"
                      >
                        <source src={step.videoUrl} type="video/mp4" />
                        Ваш браузер не поддерживает видео.
                      </video>
                    ) : step.imageUrl ? (
                      <Image
                        src={step.imageUrl || "/placeholder.svg"}
                        alt={step.imageAlt}
                        fill
                        className="object-cover"
                        priority={index < 3}
                      />
                    ) : null}
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <Card className="border-orange-100 shadow-lg">
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                        {step.icon}
                      </div>
                      <div className="mb-4 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white font-bold text-sm">
                          {step.id}
                        </div>
                        <h3 className="text-xl font-bold">{step.title}</h3>
                      </div>
                      {step.instruction && (
                        <div className="mb-4 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                          <p className="text-orange-800 font-medium">{step.instruction}</p>
                        </div>
                      )}
                      <p className="text-gray-600 mb-4">{step.description}</p>

                      {step.benefits && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-800 mb-2">Преимущества верификации:</h4>
                          <ul className="space-y-2">
                            {step.benefits.map((benefit, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
