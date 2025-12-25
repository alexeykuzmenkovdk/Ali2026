"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X } from "lucide-react"

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              Условия использования
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-gray-100">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="px-6 pb-6 max-h-[calc(90vh-120px)]">
          <div className="space-y-6 text-sm leading-relaxed">
            <p className="text-gray-700">
              Добро пожаловать на наш сайт! Пожалуйста, внимательно ознакомьтесь с настоящими Условиями использования
              перед тем, как воспользоваться услугами по пополнению кошельков алипей (Alipay) (支付宝) юанями за рубли.
            </p>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Общие положения</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>1.1.</strong> Использование сайта и услуг означает полное согласие с настоящими Условиями.
                  Если вы не согласны с каким-либо из пунктов, пожалуйста, не используйте наш сервисы.
                </p>
                <p>
                  <strong>1.2.</strong> Наш сайт предоставляет услуги обмена и пополнения электронных кошельков Alipay,
                  осуществляя конвертацию рублей в китайские юани (CNY) с последующим зачислением на указанный вами
                  кошелек.
                </p>
                <p>
                  <strong>1.3.</strong> Мы не являемся официальным представителем Alipay или любого банка. Наш сервис
                  выступает посредником для упрощения и ускорения процесса пополнения.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Услуги и порядок работы</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>2.1.</strong> Пользователь самостоятельно вводит реквизиты кошелька Alipay и сумму для
                  пополнения в рублях.
                </p>
                <p>
                  <strong>2.2.</strong> Конвертация валюты происходит по курсу, актуальному на момент оформления заявки,
                  который может включать комиссию сервиса.
                </p>
                <p>
                  <strong>2.3.</strong> После подтверждения оплаты мы осуществляем перевод эквивалентной суммы в юанях
                  на указанный кошелек Alipay.
                </p>
                <p>
                  <strong>2.4.</strong> Сроки зачисления средств зависят от внутренних процедур Alipay и банковских
                  процессов, обычно не превышают 20 минут.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Обязанности пользователя</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>3.1.</strong> Пользователь обязуется предоставлять корректные и полные данные для пополнения,
                  включая номер кошелька Alipay и личные данные, если это необходимо.
                </p>
                <p>
                  <strong>3.2.</strong> Ответственность за правильность введенных реквизитов и выбор суммы лежит на
                  пользователе.
                </p>
                <p>
                  <strong>3.3.</strong> Пользователь обязуется не использовать сервис для незаконных целей, в том числе
                  для отмывания денег, финансирования запрещенной деятельности или мошенничества.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Ограничения и ответственность</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>4.1.</strong> Мы не несем ответственность за задержки или отказы в зачислении, вызванные
                  техническими сбоями или политикой Alipay и банков.
                </p>
                <p>
                  <strong>4.2.</strong> В случае ошибок, связанных с некорректно введенными реквизитами, сервис не
                  гарантирует возврат средств.
                </p>
                <p>
                  <strong>4.3.</strong> Сервис оставляет за собой право отказать в предоставлении услуг без объяснения
                  причин.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">5. Конфиденциальность и безопасность</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>5.1.</strong> Мы обязуемся защищать персональные данные пользователей и не передавать их
                  третьим лицам, за исключением случаев, предусмотренных законодательством.
                </p>
                <p>
                  <strong>5.2.</strong> Все платежные операции осуществляются через защищенные каналы связи.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">6. Возврат и отмена</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>6.1.</strong> После подтверждения оплаты и передачи данных о переводе возврат средств
                  невозможен.
                </p>
                <p>
                  <strong>6.2.</strong> В случае технических ошибок или неполучения средств пользователем, возврат
                  рассматривается индивидуально после проверки.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">7. Изменения условий</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>7.1.</strong> Мы оставляем за собой право вносить изменения в настоящие Условия без
                  предварительного уведомления.
                </p>
                <p>
                  <strong>7.2.</strong> Новая редакция вступает в силу с момента публикации на сайте.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">8. Контакты</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  Если у вас возникли вопросы или проблемы при использовании сервиса, пожалуйста, свяжитесь с нашей
                  службой поддержки по электронной почте:
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
                Используя наш сайт и сервис, вы подтверждаете свое согласие с настоящими Условиями использования.
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
