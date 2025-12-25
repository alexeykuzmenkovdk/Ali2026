"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lightbulb, AlertTriangle, Shield, Zap } from "lucide-react"

export function PoisonTutorialTips() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Полезные советы для покупок на Poizon
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Выбор товара</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Всегда проверяйте рейтинг продавца</li>
                <li>• Читайте отзывы других покупателей</li>
                <li>• Сравнивайте цены у разных продавцов</li>
                <li>• Обращайте внимание на фото товара</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Размеры и доставка</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Используйте размерную таблицу бренда</li>
                <li>• Китайские размеры часто меньше</li>
                <li>• Выбирайте проверенные способы доставки</li>
                <li>• Учитывайте время доставки 7-14 дней</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Важно:</strong> Всегда проверяйте подлинность товара по сертификатам и отзывам. Poizon гарантирует
          аутентичность, но дополнительная проверка не помешает.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" />
            Безопасность покупок
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Оплата через Alipay</h4>
              <p className="text-sm text-gray-600">
                Используйте только Alipay для оплаты. Это самый безопасный способ, который защищает ваши деньги и
                предоставляет возможность возврата.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Проверка продавца</h4>
              <p className="text-sm text-gray-600">
                Выбирайте продавцов с высоким рейтингом и большим количеством положительных отзывов. Это гарантирует
                качество товара и сервиса.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            Нужны юани для покупки?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Для покупок на Poizon вам понадобятся юани на счету Alipay. Мы предлагаем быстрое и выгодное пополнение
            кошелька.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Выгодный курс
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Быстрое зачисление
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Безопасные переводы
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
