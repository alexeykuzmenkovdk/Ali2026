"use client"

import { motion } from "framer-motion"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export function BuyerServicesPricing() {
  return (
    <section
      id="pricing"
      className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-white via-orange-50 to-red-50"
    >
      <div className="container px-4 md:px-6">
        <ScrollReveal>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                Тариф на услуги баера
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl">Прозрачное ценообразование без скрытых платежей</p>
            </div>
          </div>
        </ScrollReveal>

        <div className="mx-auto max-w-3xl mt-12">
          <ScrollReveal>
            <motion.div
              whileHover={{ y: -5 }}
              className="flex flex-col rounded-xl border border-orange-500 bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl h-full relative"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold">Единый тариф</h3>
                <p className="text-gray-600 mt-2">Оптимальное решение для всех типов заказов</p>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold text-orange-600">5%</div>
                <p className="text-gray-500 mt-1">от стоимости товара</p>
              </div>
              <div className="mb-6 bg-green-50 p-3 rounded-lg border border-green-100">
                <p className="text-green-700 font-medium">Никаких скрытых платежей!</p>
                <p className="text-green-600 text-sm mt-1">
                  Стоимость товара оценивается по самому выгодному курсу обменника Alipayfast
                </p>
              </div>
              <div className="flex-grow">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>Поиск товаров по ссылке</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>Поиск товаров по фото (бесплатно)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>Выкуп товаров</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>Проверка качества</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>Фото товара перед отправкой</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>
                      Консолидация посылок <strong className="text-green-600">(бесплатно)</strong>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>Поддержка по WhatsApp/Telegram</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <Button
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  asChild
                >
                  <Link href="#contact">Заказать услуги баера</Link>
                </Button>
              </div>
            </motion.div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="mt-16 rounded-xl border border-orange-100 bg-white p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-center mb-6">Дополнительные услуги и информация</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3">Дополнительные услуги:</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Предпроверка товара по фото</p>
                        <p className="text-sm text-gray-600">250 ₽ за товар</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Детальные фотографии</p>
                        <p className="text-sm text-gray-600">от 200 ₽ за товар</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Видеообзор товара</p>
                        <p className="text-sm text-gray-600">от 500 ₽ за товар</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Упаковка в пузырчатую пленку</p>
                        <p className="text-sm text-gray-600">от 100 ₽ за товар</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3">Стоимость доставки:</h4>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="font-medium text-orange-700">570 ₽ за 1 кг</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Килограмм делится до граммов (оплата за фактический вес)
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3">Консолидация посылок:</h4>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <p className="font-medium text-green-700">Бесплатная консолидация всех ваших заказов</p>
                    <p className="text-sm text-green-600 mt-1">
                      Мы бесплатно объединяем все ваши товары в одну посылку, что позволяет существенно сэкономить на
                      доставке. Вы платите только за фактический вес посылки.
                    </p>

                    <div className="mt-4 pt-4 border-t border-green-200">
                      <p className="font-medium text-green-700">Примеры экономии при консолидации:</p>

                      <div className="mt-3 grid gap-4 md:grid-cols-2">
                        <div className="bg-white rounded-lg p-3 shadow-sm border-2 border-green-300">
                          <h5 className="font-medium text-gray-800">Пример 1: Три небольших заказа</h5>
                          <div className="mt-2 space-y-1 text-sm">
                            <p>
                              <span className="font-medium">Без консолидации:</span>
                            </p>
                            <ul className="list-disc pl-5 text-gray-600">
                              <li>Доставка СДЭК заказа 1: 400₽</li>
                              <li>Доставка СДЭК заказа 2: 400₽</li>
                              <li>Доставка СДЭК заказа 3: 400₽</li>
                              <li className="font-medium text-gray-700">Итого за доставку: 1200₽</li>
                            </ul>

                            <p className="mt-2">
                              <span className="font-medium">С консолидацией:</span>
                            </p>
                            <ul className="list-disc pl-5 text-gray-600">
                              <li>Доставка СДЭК одной посылки: 450₽</li>
                              <li className="font-medium text-green-600">Экономия: 750₽ (63%)</li>
                            </ul>

                            <p className="mt-2 text-gray-600 italic">
                              При консолидации вы платите за доставку только один раз вместо оплаты за каждую посылку
                              отдельно.
                            </p>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-3 shadow-sm border-2 border-green-300">
                          <h5 className="font-medium text-gray-800">Пример 2: Заказы с разных площадок</h5>
                          <div className="mt-2 space-y-1 text-sm">
                            <p>
                              <span className="font-medium">Без консолидации:</span>
                            </p>
                            <ul className="list-disc pl-5 text-gray-600">
                              <li>Доставка заказа с Taobao: 350₽</li>
                              <li>Доставка заказа с 1688: 350₽</li>
                              <li>Доставка заказа с Poizon: 350₽</li>
                              <li className="font-medium text-gray-700">Итого за доставку: 1050₽</li>
                            </ul>

                            <p className="mt-2">
                              <span className="font-medium">С консолидацией:</span>
                            </p>
                            <ul className="list-disc pl-5 text-gray-600">
                              <li>Доставка одной посылки: 450₽</li>
                              <li className="font-medium text-green-600">Экономия: 600₽ (57%)</li>
                            </ul>

                            <p className="mt-2 text-gray-600 italic">
                              Консолидация позволяет объединить заказы с разных китайских площадок в одну посылку.
                            </p>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-3 shadow-sm border-2 border-green-300">
                          <h5 className="font-medium text-gray-800">Пример 3: Крупные заказы</h5>
                          <div className="mt-2 space-y-1 text-sm">
                            <p>
                              <span className="font-medium">Без консолидации:</span>
                            </p>
                            <ul className="list-disc pl-5 text-gray-600">
                              <li>Доставка Боксберри заказа 1 (5 кг): 650₽</li>
                              <li>Доставка Боксберри заказа 2 (4 кг): 600₽</li>
                              <li>Доставка Боксберри заказа 3 (6 кг): 700₽</li>
                              <li className="font-medium text-gray-700">Итого за доставку: 1950₽</li>
                            </ul>

                            <p className="mt-2">
                              <span className="font-medium">С консолидацией:</span>
                            </p>
                            <ul className="list-disc pl-5 text-gray-600">
                              <li>Доставка одной посылки (15 кг): 850₽</li>
                              <li className="font-medium text-green-600">Экономия: 1100₽ (56%)</li>
                            </ul>

                            <p className="mt-2 text-gray-600 italic">
                              Чем больше заказов вы консолидируете, тем больше экономия на доставке по России.
                            </p>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-3 shadow-sm border-2 border-green-300">
                          <h5 className="font-medium text-gray-800">Пример 4: Заказы в разное время</h5>
                          <div className="mt-2 space-y-1 text-sm">
                            <p>
                              <span className="font-medium">Без консолидации:</span>
                            </p>
                            <ul className="list-disc pl-5 text-gray-600">
                              <li>Доставка СДЭК заказа от 1 мая: 400₽</li>
                              <li>Доставка СДЭК заказа от 5 мая: 400₽</li>
                              <li>Доставка СДЭК заказа от 10 мая: 400₽</li>
                              <li className="font-medium text-gray-700">Итого за доставку: 1200₽</li>
                            </ul>

                            <p className="mt-2">
                              <span className="font-medium">С консолидацией:</span>
                            </p>
                            <ul className="list-disc pl-5 text-gray-600">
                              <li>Доставка одной посылки: 450₽</li>
                              <li className="font-medium text-green-600">Экономия: 750₽ (63%)</li>
                            </ul>

                            <p className="mt-2 text-gray-600 italic">
                              Мы бесплатно храним ваши заказы до 14 дней, чтобы вы могли консолидировать посылки,
                              заказанные в разное время.
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 text-sm text-green-700 font-medium">Главные преимущества консолидации:</p>
                      <ul className="mt-1 text-sm text-green-600 list-disc pl-5">
                        <li>Значительная экономия на доставке по России (до 60%)</li>
                        <li>Удобство получения одной посылки вместо нескольких</li>
                        <li>Снижение рисков потери или задержки отдельных посылок</li>
                        <li>Возможность оптимизации таможенных платежей</li>
                        <li>Бесплатное хранение заказов до 14 дней для удобной консолидации</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3">Доставка по России и таможенные пошлины:</h4>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-3">
                    <p className="text-blue-800">
                      <span className="font-medium">Доставка по России:</span> Покупатель оплачивает только доставку по
                      России в случае отправки товара СДЭК или Боксберри.
                    </p>

                    <div>
                      <p className="font-medium text-blue-800">Таможенные пошлины:</p>
                      <ul className="mt-2 space-y-2 text-blue-700">
                        <li className="flex items-start">
                          <span className="h-5 w-5 text-blue-500 mr-2 mt-0.5 shrink-0">•</span>
                          <span>Беспошлинный лимит по цене составляет 200 евро, и по весу — 31 кг на 1 посылку.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="h-5 w-5 text-blue-500 mr-2 mt-0.5 shrink-0">•</span>
                          <span>
                            При достижении этого лимита по стоимости или весу вам придется оплатить пошлину в размере
                            15% от сверхлимитной стоимости товара, но не менее 2 евро за 1 кг веса в части превышения
                            стоимостной или весовой нормы.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="h-5 w-5 text-blue-500 mr-2 mt-0.5 shrink-0">•</span>
                          <span>
                            Лимит распространяется на 1 посылку. Таким образом вы можете заказать 10 посылок по 200 евро
                            без пошлины.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3">Способы получения:</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <p>СДЭК (по всей России)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <p>Боксберри (по всей России)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <p>Лично в городе Владивостоке</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <p>В пункте вывоза во Владивостоке</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
