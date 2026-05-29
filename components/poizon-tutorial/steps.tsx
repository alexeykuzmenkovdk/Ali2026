"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Smartphone,
  UserPlus,
  ShoppingCart,
  CreditCard,
  Package,
  Star,
  Apple,
  Bot,
  MessageSquare,
  Globe,
  Layout,
  Users,
  Settings,
  Search,
  Camera,
  Filter,
  Wallet,
} from "lucide-react"
import Image from "next/image"

const steps = [
  {
    id: 1,
    title: "Скачайте приложение Poizon",
    description:
      "Установите официальное приложение Poizon на ваш смартфон. Приложение доступно бесплатно и имеет русскоязычный интерфейс.",
    detailedContent: (
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <Apple className="w-5 h-5" />
            Установка на iOS (iPhone):
          </h4>
          <div className="space-y-3 text-sm text-blue-700">
            <p>
              Для установки приложения Poizon на iPhone нужно открыть App Store и ввести в поисковой строке «Dewu» или
              «Poizon». Затем следует выбрать нужное приложение и нажать кнопку «Установить». Важно убедиться, что вы
              скачиваете китайское приложение, предназначенное для покупок на международном рынке, проверив его логотип.
            </p>
            <div className="bg-white p-3 rounded border">
              <Image
                src="/poizon-guide/ios-app-store-install.webp"
                alt="Установка Poizon через App Store"
                width={600}
                height={400}
                className="w-full rounded"
              />
            </div>
            <p>
              <strong>Альтернативный способ</strong> — перейти с телефона на официальный сайт Poizon по адресу{" "}
              <a
                href="https://www.dewu.com/"
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.dewu.com/
              </a>
              . Там необходимо сканировать QR-код, после чего откроется новое окно, позволяющее начать установку
              приложения на ваше устройство.
            </p>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Установка на Android:
          </h4>
          <div className="space-y-3 text-sm text-green-700">
            <p>
              Заходим на официальный сайт{" "}
              <a
                href="https://www.dewu.com/"
                className="text-green-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.dewu.com/
              </a>{" "}
              с другого устройства: компьютера или телефона для сканирования QR-кода. Либо открываем с основного
              устройства, делаем скриншот экрана, открываем сканер кодов и из галереи загружаем сделанный скриншот.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded border">
                <p className="text-xs text-gray-600 mb-2">QR-код на сайте dewu.com:</p>
                <Image
                  src="/poizon-guide/dewu-website-qr.webp"
                  alt="QR-код для скачивания Poizon с сайта"
                  width={400}
                  height={300}
                  className="w-full rounded"
                />
              </div>
              <div className="bg-white p-3 rounded border">
                <p className="text-xs text-gray-600 mb-2">Альтернативный QR-код:</p>
                <Image
                  src="/poizon-guide/android-qr-download.webp"
                  alt="Альтернативный способ скачивания для Android"
                  width={400}
                  height={300}
                  className="w-full rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    icon: <Smartphone className="w-6 h-6" />,
    tips: [
      "Убедитесь, что скачиваете официальное приложение Dewu/Poizon",
      "Приложение работает на iOS и Android устройствах",
      "Интерфейс поддерживает русский язык",
      "Для Android используйте QR-код с официального сайта dewu.com",
      "При установке на iPhone ищите приложение по названию 'Dewu'",
    ],
  },
  {
    id: 2,
    title: "Регистрация учетной записи в приложении",
    description:
      "Процесс регистрации достаточно прост и не занимает много времени. Выберите страну, введите номер телефона и подтвердите его SMS-кодом.",
    detailedContent: (
      <div className="space-y-6">
        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Начало регистрации:
          </h4>
          <div className="space-y-3 text-sm text-orange-700">
            <p>
              Откройте приложение и нажмите на иконку профиля в нижней части экрана. Согласитесь с условиями
              использования, поставив галочку.
            </p>
            <div className="bg-white p-3 rounded border">
              <Image
                src="/poizon-guide/registration-start.webp"
                alt="Начало регистрации в Poizon"
                width={600}
                height={400}
                className="w-full rounded"
                priority
              />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Выбор страны и кода:
          </h4>
          <div className="space-y-3 text-sm text-blue-700">
            <p>
              Нажимаем на телефонный код страны, из выпадающего списка выбираем нужную страну. И ещё раз поставим
              галочку, что согласны с правилами магазина.
            </p>
            <div className="bg-white p-3 rounded border mb-3">
              <Image
                src="/poizon-guide/country-selection.webp"
                alt="Выбор страны и телефонного кода"
                width={600}
                height={400}
                className="w-full rounded"
                priority
              />
            </div>
            <div className="bg-white p-3 rounded border">
              <h5 className="font-semibold mb-2">Коды стран СНГ:</h5>
              <ul className="space-y-1 text-xs">
                <li>
                  🇷🇺 <strong>Россия</strong> - 俄罗斯 с кодом <span className="font-mono">+7</span>
                </li>
                <li>
                  🇧🇾 <strong>Беларусь</strong> - 白俄罗斯 с кодом <span className="font-mono">+375</span>
                </li>
                <li>
                  🇰🇿 <strong>Казахстан</strong> - 哈萨克斯坦 с кодом <span className="font-mono">+7</span>
                </li>
                <li>
                  🇰🇬 <strong>Кыргызстан</strong> - 吉尔吉斯斯坦 с кодом <span className="font-mono">+996</span>
                </li>
                <li>
                  🇺🇦 <strong>Украина</strong> - 乌克兰 с кодом <span className="font-mono">+380</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Подтверждение номера:
          </h4>
          <div className="space-y-3 text-sm text-green-700">
            <div className="bg-yellow-100 p-3 rounded border border-yellow-300">
              <p className="font-semibold text-yellow-800">⚠️ Важно!</p>
              <p className="text-yellow-700">
                Заранее, перед отправкой кода необходимо установить мессенджер <strong>Viber</strong>, это даст более
                высокую вероятность получения кода.
              </p>
            </div>
            <p>
              Далее вводим свой номер телефона и нажимаем основную кнопку <strong>获取验证码</strong> для получения
              SMS-кода.
            </p>
            <div className="bg-white p-3 rounded border">
              <Image
                src="/poizon-guide/sms-verification.webp"
                alt="Ввод SMS-кода подтверждения"
                width={600}
                height={400}
                className="w-full rounded"
                priority
              />
            </div>
            <p>
              Вводим полученный код. Если код не приходит, сделайте повторную отправку. В случае, если после нескольких
              повторных попыток код не приходит, советуем перезагрузить смартфон и сделать еще одну повторную отправку.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-800 mb-2">✅ Готово! Регистрация пройдена.</h4>
          <p className="text-sm text-gray-600">
            Если регистрация прошла успешно, вы увидите главное меню. Обращаем внимание, что в приложении Poizon
            доступен только <strong>китайский язык</strong>, возможности переключить на русский или английский языки
            нет!
          </p>
        </div>
      </div>
    ),
    icon: <UserPlus className="w-6 h-6" />,
    tips: [
      "Установите Viber перед регистрацией для лучшего получения SMS",
      "Выберите правильный код страны из списка",
      "Согласитесь с условиями использования",
      "При проблемах с SMS попробуйте перезагрузить телефон",
      "Приложение работает только на китайском языке",
    ],
  },
  {
    id: 3,
    title: "Краткий обзор интерфейса и вкладок приложения",
    description:
      "Разберем основные разделы приложения Poizon: социальную сеть, маркетплейс, центр идентификации и личный профиль.",
    detailedContent: (
      <div className="space-y-6">
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Первая вкладка - Социальная сеть:
          </h4>
          <div className="space-y-3 text-sm text-purple-700">
            <p>
              Это социальная сеть, куда пользователи Poizon выкладывают свои фото и видео для рекомендации покупок,
              очень похоже на ленту в TikTok. Хороший способ выбрать себе фешн лук, так как из публикации можно сразу
              перейти в карточку этого товара по указанной ссылке. Здесь также можно смотреть прямые эфиры магазинов
              селлеров и китайских блогеров.
            </p>
            <div className="bg-white p-3 rounded border">
              <Image
                src="/poizon-guide/social-network-tabs.webp"
                alt="Разделы социальной сети Poizon"
                width={600}
                height={300}
                className="w-full rounded"
              />
            </div>
            <div className="bg-white p-3 rounded border">
              <Image
                src="/poizon-guide/social-to-product.webp"
                alt="Переход от поста к товару"
                width={600}
                height={300}
                className="w-full rounded"
              />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Вторая вкладка - Маркетплейс:
          </h4>
          <div className="space-y-3 text-sm text-blue-700">
            <p>
              Это сам маркетплейс Poizon с товарами. С помощью поисковой строки (сверху) введите необходимый запрос на
              английском языке. Переход между категориями доступен с помощью свайпа направо и налево.
            </p>
            <div className="bg-white p-3 rounded border">
              <Image
                src="/poizon-guide/marketplace-search.webp"
                alt="Поиск и категории товаров"
                width={600}
                height={400}
                className="w-full rounded"
              />
            </div>
            <div className="bg-white p-3 rounded border">
              <h5 className="font-semibold mb-2">15 основных категорий товаров:</h5>
              <ul className="space-y-1 text-xs">
                <li>
                  <strong>Обувь</strong> — Nike, Adidas, Salomon, Puma и другие
                </li>
                <li>
                  <strong>Одежда</strong> — от китайских дизайнеров до люкса: Burberry, Louis Vuitton, Balenciaga
                </li>
                <li>
                  <strong>Часы</strong> — Tissot, Casio, Rolex, Dickies и другие
                </li>
                <li>
                  <strong>Техника и аксессуары</strong> — телефоны, бытовая техника, телевизоры, фены
                </li>
                <li>
                  <strong>Игрушки</strong> — Bearbrick, Lego, Barbie и множество других брендов
                </li>
                <li>
                  <strong>Сумки</strong> — от молодых китайских дизайнеров до эксклюзивного люкса
                </li>
                <li>
                  <strong>Парфюмерия и косметика</strong> — Issey Miyake, YSL, Lancome, Dior, корейские бренды
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <Star className="w-5 h-5" />
            Третья вкладка - Центр идентификации:
          </h4>
          <div className="space-y-3 text-sm text-green-700">
            <p>
              Полезное в этой части приложения то, что вы можете пройти платную онлайн-проверку ваших личных вещей на
              оригинальность. Можно загрузить фотографии кроссовок по специальному шаблону, оплатить услугу легит чека и
              получить оценку товара на оригинальность с описанием.
            </p>
            <div className="bg-white p-3 rounded border">
              <Image
                src="/poizon-guide/explore-services-screen.webp"
                alt="Центр услуг и идентификации"
                width={400}
                height={600}
                className="w-full rounded"
              />
            </div>
            <div className="bg-yellow-100 p-3 rounded border border-yellow-300">
              <p className="font-semibold text-yellow-800">🐱 Интересно!</p>
              <p className="text-yellow-700">
                Вы можете проверить своего домашнего питомца кота или собаку на соответствие породы всего за 5 ¥ и
                получить электронный сертификат!
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Четвертая вкладка - Личный профиль:
          </h4>
          <div className="space-y-3 text-sm text-orange-700">
            <p>
              Это ваш личный профиль, внутри находится настройка личной информации, раздел с избранными товарами,
              история заказов, кнопка связи со службой поддержки, адрес доставки и другое.
            </p>
            <div className="bg-white p-3 rounded border">
              <Image
                src="/poizon-guide/full-profile-screen.webp"
                alt="Полный экран профиля пользователя"
                width={400}
                height={600}
                className="w-full rounded"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded border">
                <h5 className="font-semibold mb-2">Взаимодействие с товарами:</h5>
                <Image
                  src="/poizon-guide/profile-sections.webp"
                  alt="Разделы профиля"
                  width={400}
                  height={200}
                  className="w-full rounded mb-2"
                />
                <ul className="space-y-1 text-xs">
                  <li>❤️ Избранные товары</li>
                  <li>👣 Недавно просмотренные</li>
                  <li>✅ Приобретенные товары</li>
                  <li>➕ Подписки на магазины</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded border">
                <h5 className="font-semibold mb-2">История заказов:</h5>
                <Image
                  src="/poizon-guide/order-statuses.webp"
                  alt="Статусы заказов"
                  width={400}
                  height={100}
                  className="w-full rounded mb-2"
                />
                <ul className="space-y-1 text-xs">
                  <li>💳 Ожидающие оплаты</li>
                  <li>📦 Ожидающие отправки</li>
                  <li>🚚 В пути</li>
                  <li>📱 Ожидают отзыва</li>
                  <li>💰 Возврат/обмен</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-800 mb-3">Центр услуг:</h4>
          <div className="bg-white p-3 rounded border">
            <Image
              src="/poizon-guide/interface-services-overview.webp"
              alt="Обзор всех услуг"
              width={600}
              height={200}
              className="w-full rounded mb-2"
            />
          </div>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>1. 🎧 Клиентский центр - сообщения и заказы</li>
            <li>2. 🔍 Услуги по сертификации и проверке на оригинальность</li>
            <li>3. 🎮 Игры - зарабатывайте бонусы на покупки</li>
            <li>4. 95 - товары с браком или Б/У</li>
            <li>5. 🧽 Химчистка (только для жителей Китая)</li>
            <li>6. 💰 Рассрочка/займы (только для жителей Китая)</li>
          </ul>
        </div>
      </div>
    ),
    icon: <Layout className="w-6 h-6" />,
    tips: [
      "Социальная сеть поможет найти модные образы и товары",
      "Используйте английский язык для поиска товаров",
      "Проверяйте товары на оригинальность через центр идентификации",
      "В профиле отслеживайте все свои заказы и избранное",
      "Некоторые услуги доступны только жителям Китая",
    ],
  },
  {
    id: 4,
    title: "Поисковая строка, поиск по фото и сортировка результатов поиска",
    description:
      "Изучите различные способы поиска товаров в Poizon: через поисковую строку, по фотографии и с помощью фильтров для получения наилучших результатов.",
    detailedContent: (
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <Search className="w-5 h-5" />
            Поиск товаров через поисковую строку:
          </h4>
          <div className="space-y-3 text-sm text-blue-700">
            <p>
              Основной способ поиска товара в приложении Poizon (Dewu) — это запрос в поисковую строку. Введите название
              бренда и модели на английском языке, например, «Nike AirMax» и нажмите кнопку «Поиск».
            </p>
            <div className="bg-white p-3 rounded border">
              <Image
                src="/poizon-guide/search-bar-highlighted.webp"
                alt="Поисковая строка выделена красной рамкой"
                width={400}
                height={600}
                className="w-full rounded"
              />
            </div>
            <div className="bg-yellow-100 p-3 rounded border border-yellow-300">
              <p className="font-semibold text-yellow-800">💡 Совет:</p>
              <p className="text-yellow-700">
                Введите в строку поиска «nike» и выберите предложенный вариант из списка «nike男鞋» (мужская обувь
                Nike).
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Поиск товаров по фото:
          </h4>
          <div className="space-y-3 text-sm text-green-700">
            <p>
              Нажмите на значок фотоаппарата в поисковой строке и загрузите фото из галереи телефона. После сканирования
              у вас отобразится список поиска товара по фото.
            </p>
            <div className="bg-white p-3 rounded border">
              <Image
                src="/poizon-guide/search-process-overview.jpg"
                alt="Процесс поиска: поисковая строка, камера, результаты по фото, результаты товаров"
                width={600}
                height={300}
                className="w-full rounded"
              />
            </div>
            <p>
              На изображении показан полный процесс: главная страница с поисковой строкой, экран камеры для поиска по
              фото, результаты поиска по изображению и итоговые результаты товаров.
            </p>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Фильтры и сортировка результатов:
          </h4>
          <div className="space-y-3 text-sm text-purple-700">
            <p>
              После поиска товара через категории или по названию бренда можно применять различные фильтры, нажав на
              значок «воронка».
            </p>
            <div className="bg-white p-3 rounded border">
              <Image
                src="/poizon-guide/search-results-nike.webp"
                alt="Результаты поиска Nike с фильтрами и товарами"
                width={400}
                height={600}
                className="w-full rounded"
              />
            </div>
            <div className="bg-white p-3 rounded border">
              <h5 className="font-semibold mb-2">Доступные фильтры:</h5>
              <ul className="space-y-1 text-xs">
                <li>
                  <strong>Диапазон цен</strong> — например, 250-400 ¥
                </li>
                <li>
                  <strong>Категория</strong> — обувь, одежда, аксессуары
                </li>
                <li>
                  <strong>Размер</strong> — укажите нужный размер заранее
                </li>
                <li>
                  <strong>Сортировка по популярности</strong> — самые востребованные товары
                </li>
                <li>
                  <strong>Сортировка по цене</strong> — от дешевых к дорогим и наоборот
                </li>
                <li>
                  <strong>По году выпуска</strong> — новинки или классические модели
                </li>
              </ul>
            </div>
            <div className="bg-orange-100 p-3 rounded border border-orange-300">
              <p className="font-semibold text-orange-800">⚠️ Важно!</p>
              <p className="text-orange-700">
                Цены у одного товара на разные размеры могут сильно отличаться друг от друга. Указав заранее нужный
                размер в фильтрах, вы сможете видеть цены в карточке именно на него.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-800 mb-3">Пример поиска Nike:</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>1. Введите в поисковую строку «nike»</p>
            <p>2. Выберите «nike男鞋» из предложенных вариантов</p>
            <p>3. Примените фильтр: цена 250-400 ¥, категория «обувь», ваш размер</p>
            <p>4. Нажмите бирюзовую кнопку поиска</p>
            <p>5. Просматривайте результаты с учетом ваших фильтров</p>
          </div>
        </div>
      </div>
    ),
    icon: <Search className="w-6 h-6" />,
    tips: [
      "Используйте английские названия брендов для лучших результатов",
      "Поиск по фото поможет найти точно такой же товар",
      "Указывайте размер в фильтрах для корректных цен",
      "Сортируйте по популярности для проверенных товаров",
      "Цены на разные размеры одного товара могут сильно отличаться",
    ],
  },
  {
    id: 5,
    title: "Обзор карточки товара",
    description:
      "После успешного поиска нажимаем на понравившийся товар и переходим в его карточку. Изучите основные элементы интерфейса и варианты покупки.",
    detailedContent: (
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Основные элементы карточки товара:
          </h4>
          <div className="space-y-3 text-sm text-blue-700">
            <p>При переходе в карточку товара вы увидите основную информацию и кнопки для взаимодействия с товаром.</p>
            <div className="bg-white p-3 rounded border">
              <Image
                src="/poizon-guide/product-card-overview.webp"
                alt="Карточка товара Nike Cortez с основными элементами"
                width={600}
                height={400}
                className="w-full rounded"
              />
            </div>
            <div className="bg-white p-3 rounded border">
              <h5 className="font-semibold mb-2">Основные кнопки в карточке:</h5>
              <ul className="space-y-1 text-xs">
                <li>
                  <strong>¥669</strong> — минимальная цена товара в размерной сетке
                </li>
                <li>
                  <strong>★★★★ 8.4</strong> — рейтинг товара от покупателей
                </li>
                <li>
                  <strong>❤️ Сердечко</strong> — добавить товар в избранное
                </li>
                <li>
                  <strong>🎧 Наушники</strong> — связаться с техподдержкой
                </li>
                <li>
                  <strong>🛒 Бирюзовая кнопка</strong> — купить товар
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Выбор размера и цены:
          </h4>
          <div className="space-y-3 text-sm text-green-700">
            <p>
              При нажатии на бирюзовую кнопку "купить товар" откроется окно выбора размера с индивидуальными ценами.
            </p>
            <div className="bg-white p-3 rounded border">
              <Image
                src="/poizon-guide/size-selection-screen.jpg"
                alt="Экран выбора размера с ценами"
                width={400}
                height={600}
                className="w-full rounded"
              />
            </div>
            <div className="bg-yellow-100 p-3 rounded border border-yellow-300">
              <p className="font-semibold text-yellow-800">📏 Важно о размерах!</p>
              <ul className="text-yellow-700 space-y-1 text-xs mt-2">
                <li>• Размеры указаны в формате EU (Европейский)</li>
                <li>• Стоимость для каждого размера индивидуальная</li>
                <li>• Измерьте длину стельки в сантиметрах</li>
                <li>• Сравните с размерной сеткой (кнопка "линейка")</li>
                <li>• Стелька в см указана в правом столбце таблицы</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Типы кнопок покупки:
          </h4>
          <div className="space-y-3 text-sm text-purple-700">
            <p>После выбора размера появятся различные варианты покупки с разными условиями доставки и ценами.</p>
            <div className="bg-white p-3 rounded border">
              <Image
                src="/poizon-guide/purchase-buttons-types.jpg"
                alt="Различные типы кнопок покупки"
                width={600}
                height={400}
                className="w-full rounded"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded border">
                <h5 className="font-semibold mb-2 text-teal-600">🟢 Бирюзовая кнопка</h5>
                <p className="text-xs">
                  Товар на складе Poizon или у официального дистрибьютора. Уже проверен на подлинность. Быстрая доставка
                  4-5 дней.
                </p>
              </div>
              <div className="bg-white p-3 rounded border">
                <h5 className="font-semibold mb-2">⚫ Черная кнопка</h5>
                <p className="text-xs">
                  Товар не проверен, сначала отправляется на склад Poizon для идентификации. Доставка 3-4 дня после
                  проверки.
                </p>
              </div>
              <div className="bg-white p-3 rounded border">
                <h5 className="font-semibold mb-2 text-gray-600">🔘 Серая кнопка "95"</h5>
                <p className="text-xs">
                  Товары с платформы 95 fen: новые, б/у или с дефектами. Значительно дешевле. Быстрая доставка 1-3 дня.
                </p>
              </div>
              <div className="bg-white p-3 rounded border">
                <h5 className="font-semibold mb-2 text-blue-600">🌍 Кнопка с "≈" и флагом</h5>
                <p className="text-xs">
                  Товары из-за пределов Китая (США, ЕС, Япония, Корея). Требуют паспортные данные. Доставка 16-25 дней.
                </p>
              </div>
            </div>
            <div className="bg-orange-100 p-3 rounded border border-orange-300">
              <p className="font-semibold text-orange-800">💰 Кнопки с нулевой стоимостью</p>
              <p className="text-orange-700 text-xs">
                Это услуга постоплаты от WeChat Pay. Реальная цена указана мелким шрифтом снизу. Оплата при получении
                товара. Отключается галочкой выше кнопок.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-800 mb-2">✅ Рекомендации по выбору:</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• Бирюзовая кнопка — самый надежный и быстрый вариант</li>
            <li>• Черная кнопка — хороший компромисс цены и качества</li>
            <li>• Серая "95" — для экономии, но изучите описание товара</li>
            <li>• Кнопки с флагами — только если готовы ждать дольше</li>
            <li>• Избегайте кнопок с нулевой стоимостью без WeChat</li>
          </ul>
        </div>
      </div>
    ),
    icon: <Package className="w-6 h-6" />,
    tips: [
      "Всегда проверяйте размерную сетку перед покупкой",
      "Цены на разные размеры могут сильно отличаться",
      "Бирюзовая кнопка — самый быстрый способ получить товар",
      "Товары с платформы 95 значительно дешевле, но изучите описание",
      "Для товаров с флагами стран нужны паспортные данные китайца",
    ],
  },
  {
    id: 6,
    title: "Процесс покупки товара",
    description:
      "Пошаговый процесс покупки товара в Poizon: от пополнения Alipay до получения чека покупки. Узнайте все нюансы оплаты и оформления заказа.",
    detailedContent: (
      <div className="space-y-6">
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Подготовка к покупке:
          </h4>
          <div className="space-y-3 text-sm text-red-700">
            <p>
              Первым делом перед покупкой необходимо пополнить Alipay на необходимую сумму.{" "}
              <a href="/" className="text-red-600 underline font-semibold">
                Воспользуйтесь нашим калькулятором
              </a>{" "}
              для расчета точной суммы с учетом комиссий.
            </p>
            <div className="bg-yellow-100 p-3 rounded border border-yellow-300">
              <p className="font-semibold text-yellow-800">⚠️ Важно!</p>
              <p className="text-yellow-700">
                Убедитесь, что на вашем счету Alipay достаточно юаней для покупки. Без достаточного баланса оплата не
                пройдет.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Выбор и оформление товара:
          </h4>
          <div className="space-y-3 text-sm text-blue-700">
            <p>
              Для совершения покупки зайдите во вкладку маркетплейса Poizon («Пакет») либо в избранное, где вы заранее
              сохранили товар.
            </p>
            <div className="bg-white p-3 rounded border">
              <Image
                src="/poizon-guide/order-checkout-screen.webp"
                alt="Экран оформления заказа с выбором размера и способа оплаты"
                width={400}
                height={600}
                className="w-full rounded"
              />
            </div>
            <div className="bg-white p-3 rounded border">
              <h5 className="font-semibold mb-2">Пошаговый процесс:</h5>
              <ol className="space-y-1 text-xs list-decimal list-inside">
                <li>Выберите нужную позицию, перейдя в карту товара</li>
                <li>Нажмите на бирюзовую ������опку внизу экрана</li>
                <li>Выберите нужный размер</li>
                <li>
                  Нажмите на кнопку покупки{" "}
                  <span className="text-blue-600">(детальное описание кнопок в предыдущем шаге)</span>
                </li>
              </ol>
            </div>
            <div className="bg-green-100 p-3 rounded border border-green-300">
              <p className="font-semibold text-green-800">📅 Информация о доставке</p>
              <p className="text-green-700 text-xs">
                Вы увидите ориентировочную дату готовности заказа к отправке со склада Poizon на ваш адрес в Китае, а
                также информацию о возможности возврата/обмена в течение 7 дней.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Оплата через Alipay:
          </h4>
          <div className="space-y-3 text-sm text-purple-700">
            <div className="bg-orange-100 p-3 rounded border border-orange-300">
              <p className="font-semibold text-orange-800">🎫 Важно про купоны!</p>
              <p className="text-orange-700 text-xs">
                Если автоматически подтягивается купон на скидку, его нужно отменить, так как иностранные пользователи
                не могут использовать купоны в Poizon.
              </p>
            </div>
            <p>Выбираем способ оплаты - в нашем случае мы будем платить счетом Alipay.</p>
            <div className="bg-white p-3 rounded border">
              <Image
                src="/poizon-guide/alipay-payment-screen.webp"
                alt="Экран оплаты в Alipay с выбором баланса и кнопкой Confirm"
                width={400}
                height={600}
                className="w-full rounded"
              />
            </div>
            <div className="bg-white p-3 rounded border">
              <h5 className="font-semibold mb-2">Процесс оплаты:</h5>
              <ol className="space-y-1 text-xs list-decimal list-inside">
                <li>После выбора способа оплаты нажимаем бирюзовую кнопку «Оплатить»</li>
                <li>Автоматически открывается окно приложения Alipay</li>
                <li>Выбираем баланс счета (Balance)</li>
                <li>Нажимаем синюю кнопку «Confirm»</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Подтверждение покупки и чек:
          </h4>
          <div className="space-y-3 text-sm text-green-700">
            <p>
              Если вы все сделали правильно, ваша покупка во вкладке личного профиля переместится в раздел оплаченные
              товары «бокс со стрелкой» или в отправленные товары «машинка» с отметкой цифрой.
            </p>
            <div className="bg-white p-3 rounded border">
              <Image
                src="/poizon-guide/purchase-receipt-process.jpg"
                alt="Процесс сохранения чека покупки: профиль → мои товары → карточка с печатью → сохранить"
                width={600}
                height={400}
                className="w-full rounded"
              />
            </div>
            <div className="bg-white p-3 rounded border">
              <h5 className="font-semibold mb-2">Сохранение карточки покупки:</h5>
              <ol className="space-y-1 text-xs list-decimal list-inside">
                <li>Во вкладке личного профиля нажмите на «Кружок с галочкой» (приобретенные товары)</li>
                <li>Выберите товар для которого нужна карточка</li>
                <li>Нажмите кнопку для просмотра</li>
                <li>Нажмите на значок «Сохранить изображение»</li>
              </ol>
              <p className="text-xs mt-2 text-gray-600">
                Карточка с печатью Poizon сохранится в галерею телефона как подтверждение покупки.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-800 mb-3">🚚 Варианты доставки:</h4>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="bg-blue-100 p-3 rounded border border-blue-300">
              <p className="font-semibold text-blue-800">🏠 Самостоятельная доставка</p>
              <p className="text-blue-700 text-xs">
                Вы можете самостоятельно покупать товары, договариваясь с посредниками и карго-компаниями, которые
                предоставляют свой адрес в Китае. Заранее добавьте адрес в личный кабинет Poizon.
              </p>
            </div>
            <div className="bg-teal-100 p-3 rounded border border-teal-300">
              <p className="font-semibold text-teal-800">🛍️ Наши услуги баера</p>
              <p className="text-teal-700 text-xs">
                Либо воспользуйтесь{" "}
                <a href="/buyer-services" className="text-teal-600 underline font-semibold">
                  нашими услугами баера
                </a>{" "}
                для полного сопровождения покупки от заказа до доставки в Россию.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    icon: <Wallet className="w-6 h-6" />,
    tips: [
      "Обязательно пополните Alipay перед покупкой",
      "Отменяйте автоматические купоны - они не работают для иностранцев",
      "Сохраняйте карточку покупки как подтверждение заказа",
      "Заранее добавьте адрес доставки в Китае в профиль",
      "Рассмотрите наши услуги баера для удобства",
    ],
  },
]

export function PoisonTutorialSteps() {
  return (
    <div className="space-y-8">
      {steps.map((step, index) => (
        <Card key={step.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-auto">
                {step.id === 1 ? (
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-green-50 h-full flex items-center justify-center">
                    <div className="text-center">
                      <Smartphone className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-800">Установка приложения</h3>
                      <p className="text-sm text-gray-600 mt-2">iOS и Android</p>
                    </div>
                  </div>
                ) : step.id === 2 ? (
                  <div className="p-6 bg-gradient-to-br from-orange-50 to-blue-50 h-full flex items-center justify-center">
                    <div className="text-center">
                      <UserPlus className="w-16 h-16 mx-auto mb-4 text-orange-600" />
                      <h3 className="text-lg font-semibold text-gray-800">Регистрация</h3>
                      <p className="text-sm text-gray-600 mt-2">Создание аккаунта</p>
                    </div>
                  </div>
                ) : step.id === 3 ? (
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 h-full flex items-center justify-center">
                    <div className="text-center">
                      <Layout className="w-16 h-16 mx-auto mb-4 text-purple-600" />
                      <h3 className="text-lg font-semibold text-gray-800">Интерфейс</h3>
                      <p className="text-sm text-gray-600 mt-2">Обзор приложения</p>
                    </div>
                  </div>
                ) : step.id === 4 ? (
                  <div className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 h-full flex items-center justify-center">
                    <div className="text-center">
                      <Search className="w-16 h-16 mx-auto mb-4 text-teal-600" />
                      <h3 className="text-lg font-semibold text-gray-800">Поиск товаров</h3>
                      <p className="text-sm text-gray-600 mt-2">Строка, фото, фильтры</p>
                    </div>
                  </div>
                ) : step.id === 5 ? (
                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-blue-50 h-full flex items-center justify-center">
                    <div className="text-center">
                      <Package className="w-16 h-16 mx-auto mb-4 text-emerald-600" />
                      <h3 className="text-lg font-semibold text-gray-800">Карточка товара</h3>
                      <p className="text-sm text-gray-600 mt-2">Размеры и покупка</p>
                    </div>
                  </div>
                ) : step.id === 6 ? (
                  <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 h-full flex items-center justify-center">
                    <div className="text-center">
                      <Wallet className="w-16 h-16 mx-auto mb-4 text-amber-600" />
                      <h3 className="text-lg font-semibold text-gray-800">Процесс покупки</h3>
                      <p className="text-sm text-gray-600 mt-2">Оплата и оформление</p>
                    </div>
                  </div>
                ) : (
                  <Image src={step.image || "/placeholder.svg"} alt={step.title} fill className="object-cover" />
                )}
              </div>
              <div className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className="flex items-center gap-2">
                    {step.icon}
                    Шаг {step.id}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-orange-600">Полезные советы:</h4>
                  <ul className="space-y-1">
                    {step.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="text-sm text-gray-600 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            {step.detailedContent && <div className="p-6 border-t bg-gray-50">{step.detailedContent}</div>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
