"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X } from "lucide-react"

interface PrivacyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              Политика конфиденциальности
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-gray-100">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="px-6 pb-6 max-h-[calc(90vh-120px)]">
          <div className="space-y-6 text-sm leading-relaxed">
            <p className="text-gray-700">
              Мы ценим вашу конфиденциальность и стремимся защищать ваши персональные данные при использовании нашего
              сайта и сервисов по пополнению кошельков Alipay. Настоящая Политика конфиденциальности описывает, какие
              данные мы собираем, как используем и защищаем их.
            </p>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Сбор персональных данных</h3>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>1.1.</strong> При использовании нашего сайта мы можем собирать следующие данные:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Контактная информация (например, имя, телефон, электронная почта).</li>
                  <li>Реквизиты для пополнения (номер кошелька Alipay, сумма перевода).</li>
                  <li>Данные платежей (информация о транзакциях, способ оплаты).</li>
                  <li>Техническая информация (IP-адрес, данные браузера, cookies).</li>
                </ul>
                <p>
                  <strong>1.2.</strong> Мы собираем данные только с вашего согласия и для выполнения обязательств по
                  предоставлению услуг.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Использование персональных данных</h3>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>2.1.</strong> Персональные данные используются для:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Обработки и выполнения ваших заявок на пополнение.</li>
                  <li>Связи с вами для уточнения деталей или решения вопросов.</li>
                  <li>Улучшения качества сервиса и пользовательского опыта.</li>
                  <li>Выполнения требований законодательства.</li>
                </ul>
                <p>
                  <strong>2.2.</strong> Мы не используем ваши данные для маркетинга без отдельного согласия.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Передача и хранение данных</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>3.1.</strong> Ваши данные могут передаваться третьим сторонам, только если это необходимо для
                  выполнения услуги (например, платежным системам), или если это требует законодательство.
                </p>
                <p>
                  <strong>3.2.</strong> Мы принимаем технические и организационные меры для защиты данных от
                  несанкционированного доступа, изменения или уничтожения.
                </p>
                <p>
                  <strong>3.3.</strong> Данные хранятся не дольше, чем это необходимо для целей обработки.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Cookies и технологии слежения</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>4.1.</strong> Наш сайт использует cookies для улучшения работы и анализа трафика.
                </p>
                <p>
                  <strong>4.2.</strong> Вы можете настроить браузер на отказ от cookies, но это может ограничить
                  функциональность сайта.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">5. Права пользователей</h3>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>5.1.</strong> Вы имеете право:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Запрашивать доступ к своим данным.</li>
                  <li>Требовать исправления или удаления данных.</li>
                  <li>Отозвать согласие на обработку данных.</li>
                  <li>Подавать жалобы в контролирующие органы.</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">6. Безопасность данных</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>6.1.</strong> Мы используем современные технологии шифрования и защиты для предотвращения
                  утечек и взломов.
                </p>
                <p>
                  <strong>6.2.</strong> Доступ к данным имеют только уполномоченные сотрудники.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">7. Изменения в Политике конфиденциальности</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>7.1.</strong> Мы можем обновлять данную политику, информируя пользователей через сайт.
                </p>
                <p>
                  <strong>7.2.</strong> Рекомендуем периодически пр��верять актуальность документа.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">8. Контакты</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  Если у вас есть вопросы по обработке персональных данных, по электронной почте:
                  <a
                    href="mailto:zakaz.alipayfast@gmail.com"
                    className="text-orange-600 hover:text-orange-700 font-medium ml-1"
                  >
                    zakaz.alipayfast@gmail.com
                  </a>
                  , или написав в телеграмм админу сервиса
                  <a
                    href="https://t.me/whaledator"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-700 font-medium ml-1"
                  >
                    @whaledator
                  </a>
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-gray-700 font-medium">
                Используя наш сайт и сервис, вы подтверждаете свое согласие с настоящими Политикой конфиденциальности.
              </p>
            </div>
          </div>
        </ScrollArea>

        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-center">
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-2"
            >
              Вернуться к главной странице
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
