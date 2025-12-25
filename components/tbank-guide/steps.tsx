"use client"

import { useState } from "react"
import { CreditCard, Smartphone, Send, Mail, QrCode, AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react"
import Image from "next/image"

export function TBankSteps() {
  const [expandedStep, setExpandedStep] = useState<number | null>(1)

  const toggleStep = (stepNumber: number) => {
    setExpandedStep(expandedStep === stepNumber ? null : stepNumber)
  }

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Пошаговая инструкция</h2>

          <div className="space-y-6">
            {/* Шаг 1 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-yellow-200">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center text-white font-bold text-xl md:text-2xl shadow-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-5 h-5 text-yellow-500" />
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                        Оформляем дебетовую карту Т-Банк «Black»
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm md:text-base">
                      Кэшбэк до 30%, поддержка 24/7, бонус 500₽ при оформлении
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Кэшбэк до 30%, поддержка 24/7. Пополнение, переводы и обслуживание — от 0 ₽
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Оформляя по моей ссылке, займет 2-5 минут в режиме онлайн и можно будет сразу приступить к
                      переводам, кроме того, за оформление{" "}
                      <span className="font-bold text-orange-600">Вам начислят 500 руб.</span> мелочь, а приятно.
                    </p>
                    <a
                      href="https://tbank.ru/baf/97eQXBjyY2P"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold px-8 py-4 rounded-xl shadow-lg transition-all hover:shadow-xl"
                    >
                      <CreditCard className="w-5 h-5" />
                      Оформить карту Т-Банк
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Шаг 2 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-blue-200">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl md:text-2xl shadow-lg">
                    2
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Smartphone className="w-5 h-5 text-blue-500" />
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                        Устанавливаем официальное приложение Т-Банк
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm md:text-base">
                      Важно! Только официальное приложение, не веб-версия
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    Если Вы уже являетесь клиентом Т-Банка или только что успешно преодолели Шаг 1,{" "}
                    <span className="font-bold text-red-600">ОБЯЗАТЕЛЬНО необходимо проверить</span> установлено ли у
                    Вас на телефоне актуальное официальное приложение Т-банка.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                      <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        Android
                      </h4>
                      <p className="text-gray-700 text-sm mb-4">Скачиваем актуальную версию из Google Play</p>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                      <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        iPhone (iOS)
                      </h4>
                      <p className="text-gray-700 text-sm mb-4">
                        В связи с тем, что приложение часто удаляют из AppStore, Т-банк сделал отдельную инструкцию для
                        установки
                      </p>
                      <a
                        href="https://tbank.ru/baf/8lBoxTL05GW"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                      >
                        Инструкция для iOS
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                    <div className="flex gap-3">
                      <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-red-900 mb-2 text-lg">ВНИМАНИЕ!</p>
                        <p className="text-gray-700 leading-relaxed">
                          Только официальное приложение, установленное из{" "}
                          <span className="font-semibold">Google Play или AppStore</span> позволяет отправлять чеки
                          напрямую от Т-Банка (то есть с официальной почты Банка, а не с Вашей личной), именно поэтому
                          нам <span className="font-semibold">не подходят Web-версии</span>, когда доступ к банку
                          происходит через обычный браузер.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Шаг 3 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-orange-200">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-xl md:text-2xl shadow-lg">
                    3
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Send className="w-5 h-5 text-orange-500" />
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">Переводим деньги</h3>
                    </div>
                    <p className="text-gray-600 text-sm md:text-base">Отправка средств на указанные реквизиты</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    На данном этапе после получения Вашей заявки и ее подтверждения, я пришлю Вам реквизиты счета (номер
                    телефона или карты) куда Вам необходимо будет отправить деньги в счет обмена, а также адрес
                    электронной почты, на который необходимо будет отправить Чек ИЗ ПРИЛОЖЕНИЯ Т-БАНК.
                  </p>

                  <div className="space-y-4">
                    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                      <div className="flex gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-bold text-red-900 mb-2 text-lg">ВНИМАНИЕ!</p>
                          <p className="text-gray-700 leading-relaxed font-semibold">
                            Перевод только с Т-Банка и одним платежом
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
                      <div className="flex gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-bold text-red-900 mb-2 text-lg">ВНИМАНИЕ!!</p>
                          <p className="text-gray-700 leading-relaxed mb-3">
                            Перевод <span className="font-bold text-red-700">СТРОГО на тот банк который я укажу</span>,
                            в случае если Вам было сказано отправить деньги к примеру на СБЕР, но Вы ошибочно отправили
                            на ОЗОН-БАНК к сожалению мы не сможем совершить обмен.
                          </p>
                          <p className="text-gray-700 leading-relaxed font-semibold">
                            БОЛЕЕ ТОГО, в 99% из 100% мы физически не сможем вернуть Вам деньги, поскольку как правило
                            ТОТ ДРУГОЙ БАНК – который вы выбрали самостоятельно и по ошибке зачастую уже заблокирован, и
                            технически произвести возврат практически НЕ ВОЗМОЖНО.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 p-8 rounded-xl text-center">
                      <p className="text-xl md:text-2xl font-bold text-gray-900 leading-relaxed">
                        ПОЭТОМУ <span className="text-green-700">НЕ СПЕШИМ</span>, СПОКОЙНО{" "}
                        <span className="text-blue-700">ВЫБИРАЕМ НУЖНЫЙ БАНК</span>,{" "}
                        <span className="text-orange-600">ПРОВЕРЯЕМ СУММУ</span> и только тогда отправляем деньги.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Шаг 4 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-purple-200">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl md:text-2xl shadow-lg">
                    4
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-5 h-5 text-purple-500" />
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">Отправляем чек</h3>
                    </div>
                    <p className="text-gray-600 text-sm md:text-base">Инструкция для iOS и Android</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <p className="text-gray-700 leading-relaxed">
                    В зависимости от устройства Android или iPhone (IOS) отправка чека осуществляется следующим образом:
                  </p>

                  <div className="relative w-full max-w-2xl mx-auto mb-6">
                    <Image
                      src="/images/d0-a8-d0-b0-d0-b3-204.jpg"
                      alt="Выгрузка чека Т-Банк для iOS и Android"
                      width={800}
                      height={600}
                      className="rounded-xl shadow-lg border-2 border-purple-200"
                    />
                  </div>

                  {/* iOS Инструкция */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                    <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Smartphone className="w-6 h-6 text-blue-600" />
                      Инструкция для iOS (iPhone)
                    </h4>
                    <ol className="space-y-3 list-decimal list-inside text-gray-700">
                      <li className="leading-relaxed">Перейдите в историю переводов и нажмите на нужный платеж</li>
                      <li className="leading-relaxed">Нажмите на "Документы по операции"</li>
                      <li className="leading-relaxed">Откроется чек, нажмите на иконку "Поделиться" справа сверху</li>
                      <li className="leading-relaxed">
                        В появившемся снизу меню выберите{" "}
                        <span className="font-bold text-orange-600">"Отправить по почте"</span> (НЕ ПРИЛОЖЕНИЕ ПОЧТЫ, а
                        именно сам пункт <span className="font-bold">"ОТПРАВИТЬ ПО ПОЧТЕ"</span>)
                      </li>
                      <li className="leading-relaxed">Затем нажмите на пункт "Другой e-mail"</li>
                      <li className="leading-relaxed">Вставьте электронную почту которую вам предоставили</li>
                      <li className="leading-relaxed font-semibold">Нажмите "Готово"</li>
                    </ol>
                  </div>

                  {/* Android Инструкция */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                    <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Smartphone className="w-6 h-6 text-green-600" />
                      Инструкция для Android
                    </h4>
                    <ol className="space-y-3 list-decimal list-inside text-gray-700">
                      <li className="leading-relaxed">Перейдите в историю переводов и нажмите на нужный платеж</li>
                      <li className="leading-relaxed">После оплаты нажмите на ссылку «Справка»</li>
                      <li className="leading-relaxed">Затем нажмите на иконку «Поделиться»</li>
                      <li className="leading-relaxed">
                        В появившемся снизу меню выберите кнопку{" "}
                        <span className="font-bold text-orange-600">«Т-Банк - Отправить на email»</span>
                      </li>
                      <li className="leading-relaxed">В разделе «Получатель» выберите «Другой e-mail»</li>
                      <li className="leading-relaxed">Вставьте электронную почту которую вам предоставили</li>
                      <li className="leading-relaxed font-semibold">Нажмите "Готово"</li>
                    </ol>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
                    <p className="font-bold text-yellow-900 mb-2">Важно!</p>
                    <p className="text-gray-700 leading-relaxed">
                      ПОСЛЕ ОТПРАВКИ ЧЕКА НА ПОЧТУ, дублируем скрин чека в нашу переписку в ТГ
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Шаг 5 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-green-200">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl md:text-2xl shadow-lg">
                    5
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <QrCode className="w-5 h-5 text-green-500" />
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">Ожидание и отправка QR-кода</h3>
                    </div>
                    <p className="text-gray-600 text-sm md:text-base">Завершающий этап обмена</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    Это самый последний шаг! В переписке я пришлю Вам ссылку или QR-код для пополнения Вашего{" "}
                    <span className="font-semibold">Alipay</span>.
                  </p>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
                    <h4 className="font-bold text-lg mb-4 text-green-900">Порядок действий:</h4>
                    <ol className="space-y-3 list-decimal list-inside text-gray-700">
                      <li className="leading-relaxed">Открываете QR или переходите по ссылке</li>
                      <li className="leading-relaxed">
                        Попадаете прямо на страницу оплаты в вашем кошельке Alipay с уже указанной суммой
                      </li>
                      <li className="leading-relaxed">
                        <span className="font-bold text-orange-600">ОБЯЗАТЕЛЬНО</span> делаете скриншот странички на
                        которую Вы попали при переходе (или скрин QR-кода)
                      </li>
                      <li className="leading-relaxed">Отправляете скриншот в нашу переписку в Telegram</li>
                      <li className="leading-relaxed font-semibold text-green-700">Нажимаете оплатить</li>
                    </ol>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                      <h4 className="font-bold text-lg mb-4 text-blue-900">
                        Шаг 5.1: Найдите раздел "Оплатить и получить"
                      </h4>
                      <div className="relative w-full max-w-md mx-auto mb-4">
                        <Image
                          src="/images/d0-a8-d0-b0-d0-b3-205-20-281-29.jpg"
                          alt="Находим раздел Оплатить и получить в Alipay"
                          width={400}
                          height={800}
                          className="rounded-lg shadow-lg border-2 border-blue-300"
                        />
                      </div>
                      <p className="text-gray-700 text-center">
                        На главной странице Alipay нажмите на кнопку "Оплатить и получить"
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                      <h4 className="font-bold text-lg mb-4 text-purple-900">Шаг 5.2: Выберите "Прием платежей"</h4>
                      <div className="relative w-full max-w-md mx-auto mb-4">
                        <Image
                          src="/images/d0-a8-d0-b0-d0-b3-205-20-282-29.jpg"
                          alt="Выбираем Прием платежей в Alipay"
                          width={400}
                          height={800}
                          className="rounded-lg shadow-lg border-2 border-purple-300"
                        />
                      </div>
                      <p className="text-gray-700 text-center">В открывшемся меню выберите "Прием платежей"</p>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border-2 border-orange-200">
                      <h4 className="font-bold text-lg mb-4 text-orange-900">Шаг 5.3: Сохраните QR-код</h4>
                      <div className="relative w-full max-w-md mx-auto mb-4">
                        <Image
                          src="/images/d0-a8-d0-b0-d0-b3-205-20-283-29.jpg"
                          alt="Сохраняем QR-код в Alipay"
                          width={400}
                          height={800}
                          className="rounded-lg shadow-lg border-2 border-orange-300"
                        />
                      </div>
                      <p className="text-gray-700 text-center">
                        Ваш личный QR-код для получения платежей. Нажмите "Сохранить изображение"
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                    <div className="flex gap-3">
                      <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-blue-900 mb-2 text-lg">Готово!</p>
                        <p className="text-gray-700 leading-relaxed">
                          После оплаты обмен завершен. Обычно деньги приходят в течение нескольких секунд. Спасибо за
                          ваше доверие!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
