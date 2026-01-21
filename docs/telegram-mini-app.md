# Telegram Mini App — подключение

Этот проект содержит страницу мини-приложения: `/telegram-mini-app` (см. `app/telegram-mini-app/page.tsx`).
Ниже — пошаговая инструкция, как подключить мини-приложение к боту и корректно передавать `initData`.

## 1. Подготовьте бота

1. Откройте Telegram и найдите **@BotFather**.
2. Создайте бота командой `/newbot` и сохраните токен.
3. Создайте Web App для мини‑приложения командой **/newapp**:
   - Укажите имя и описание приложения.
   - В качестве URL укажите публичный HTTPS‑адрес вашего мини‑приложения (например, `https://your-domain.ru/telegram-mini-app`).
4. Разрешите домен командой **/setdomain** и выберите своего бота.

> ⚠️ Telegram принимает **только HTTPS** домены. Для локальной разработки используйте туннелирование (ngrok, cloudflared и т.д.).

## 2. Настройте Menu Button (запуск мини‑приложения)

Чтобы открывать мини‑приложение из бота:

1. В **@BotFather** выполните команду `/setmenubutton`.
2. Выберите вашего бота.
3. Включите кнопку **Web App** и укажите URL на `/telegram-mini-app`.

Дополнительно вы можете отправлять inline‑кнопки с `web_app` в чатах.

## 3. Переменные окружения

В проекте используется валидация `initData` из Telegram WebApp:

- `TELEGRAM_MINI_APP_BOT_TOKEN` — токен бота, созданного для мини‑приложения.
- (fallback) `TELEGRAM_BOT_TOKEN` — будет использован, если `TELEGRAM_MINI_APP_BOT_TOKEN` не задан.

Добавьте в `.env.local`:

```bash
TELEGRAM_MINI_APP_BOT_TOKEN=123456:ABCDEF...
```

## 4. Проверка работы

1. Запустите проект и откройте URL вида `https://your-domain.ru/telegram-mini-app` через Telegram.
2. На странице должно появиться имя пользователя Telegram (или `demo` в режиме разработки).
3. Запросы к API будут отправляться с заголовком `x-telegram-init-data`.

Если открывается обычная страница сайта или не уходят запросы:

- Проверьте, что мини‑приложение открывается именно **внутри Telegram** (в обычном браузере `initData` не передается).
- Убедитесь, что подключен скрипт Telegram WebApp: `https://telegram.org/js/telegram-web-app.js`.
- Проверьте, что URL в BotFather указывает на `/telegram-mini-app`, а не на корень сайта.

## 5. Ошибка “The string did not match the expected pattern”

Эта ошибка означает, что строка данных не соответствует формату, который ожидает Telegram или ваш код.
Чаще всего проблема связана с `initData`.

### Самые частые причины

1. **Неверный формат данных**
   - Ожидался JSON, а пришла строка параметров (или наоборот).
   - Ожидалась дата в формате `YYYY-MM-DD`, а пришла `DD.MM.YYYY`.
   - Ожидался URL, но строка не начинается с `https://`.
2. **Ошибки при передаче `initData`**
   - `initData`/`initDataUnsafe` отсутствует, потому что мини‑приложение открыто не из Telegram.
   - Строка была изменена до валидации (например, лишние пробелы или конкатенация).
   - Данные не были декодированы через `decodeURIComponent`.

### Что проверить

- Убедитесь, что вы не парсите `initData` как JSON:
  ```js
  // ❌ неверно
  JSON.parse(window.Telegram.WebApp.initData)
  ```
- Убедитесь, что отправляете `initData` в виде исходной строки параметров (как приходит из Telegram).
- Если передаете `initData` в заголовке, сначала декодируйте:
  ```ts
  const initData = decodeURIComponent(rawInitData)
  ```
- В этом проекте `initData` валидируется из заголовка `x-telegram-init-data` и нормализуется на сервере (`decodeURIComponent`). Поэтому в запросах используйте оригинальную строку без изменений.

## 6. Локальная разработка

Пример с ngrok:

```bash
ngrok http 3000
```

Далее используйте HTTPS‑URL из ngrok:

- Укажите его в `/setdomain` в BotFather.
- Обновите Web App URL в `/newapp` и `/setmenubutton`.

## Полезные ссылки

- Документация Telegram Web Apps: https://core.telegram.org/bots/webapps
