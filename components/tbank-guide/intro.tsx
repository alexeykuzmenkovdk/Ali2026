"use client"

import { Shield, CheckCircle2, Clock, AlertTriangle } from "lucide-react"

export function TBankIntro() {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 rounded-full mb-6 font-semibold shadow-lg">
            <AlertTriangle className="w-5 h-5" />
            <span>Только Т-Банк</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-balance">Почему мы работаем только с Т-Банком</h1>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 mb-8">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
              Мы сознательно ограничили список банков и принимаем переводы{" "}
              <span className="font-bold text-orange-600">исключительно через Т-Банк</span>. Это не прихоть, а мера
              безопасности — и для нас, и для клиентов.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-green-500 mt-1" />
                </div>
                <p className="text-gray-700 leading-relaxed">
                  <span className="font-semibold">Т-Банк — практически единственный банк</span>, который позволяет
                  отправлять чек напрямую из банковского приложения, без использования личной почты.
                </p>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-green-500 mt-1" />
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Такой чек приходит <span className="font-semibold">официальным письмом от банка</span>, а не как файл
                  или скриншот.
                </p>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-green-500 mt-1" />
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Это <span className="font-semibold">полностью исключает риск скама</span> и поддельных
                  («отрисованных») чеков.
                </p>
              </div>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg mb-8">
              <p className="text-gray-700 leading-relaxed">
                С учётом большого количества карт физически невозможно проверить каждую вручную. Поэтому мы опираемся на
                официальные подтверждения от самого банка, которым можно доверять.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 md:p-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                Это вынужденная, но обоснованная мера, позволяющая:
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Минимизировать риски</p>
                    <p className="text-sm text-gray-600">Защита от мошенничества</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Ускорить обработку</p>
                    <p className="text-sm text-gray-600">Быстрая проверка заявок</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Обеспечить прозрачность</p>
                    <p className="text-sm text-gray-600">Безопасность обменов</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg">
              <Shield className="w-6 h-6" />
              <span>Безопасность операций для нас — приоритет. Именно поэтому Т-Банк.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
