// Конфигурация курса обмена
// ВАЖНО: Этот файл должен содержать только статические значения!

export const EXCHANGE_CONFIG = {
  // Базовая надбавка к курсу ЦБ РФ (в рублях) - не используется при динамической надбавке
  DEFAULT_MARKUP: 0.73,

  // Режим по умолчанию (false = автоматический, true = ручной)
  DEFAULT_USE_MANUAL_RATE: false,

  // Ручной курс по умолчанию (null = не установлен)
  DEFAULT_MANUAL_RATE: null as number | null,

  // Запасной курс при ошибках API ЦБ РФ
  FALLBACK_RATE: 12.5,

  // Время кэширования настроек (в миллисекундах)
  CACHE_DURATION: 30 * 60 * 1000, // 30 минут

  DYNAMIC_MARKUP: [
    { maxYuan: 500, markup: 0.96 }, // До 500 юаней: Курс ЦБ + 0.96
    { maxYuan: 2000, markup: 0.84 }, // До 2000 юаней: Курс ЦБ + 0.84
    { maxYuan: 6000, markup: 0.8 }, // От 2000 до 6000 юаней: Курс ЦБ + 0.80
    { maxYuan: Number.POSITIVE_INFINITY, markup: 0.73 }, // От 6000 юаней и выше: Курс ЦБ + 0.73
  ],
} as const

export function getMarkupForAmount(yuanAmount: number): number {
  for (const tier of EXCHANGE_CONFIG.DYNAMIC_MARKUP) {
    if (yuanAmount < tier.maxYuan) {
      return tier.markup
    }
  }
  return EXCHANGE_CONFIG.DEFAULT_MARKUP
}

// Функция для получения настроек по умолчанию
export function getDefaultSettings() {
  return {
    markup: EXCHANGE_CONFIG.DEFAULT_MARKUP,
    useManualRate: EXCHANGE_CONFIG.DEFAULT_USE_MANUAL_RATE,
    manualRate: EXCHANGE_CONFIG.DEFAULT_MANUAL_RATE,
    version: 1,
    lastUpdated: new Date().toISOString(),
  }
}

// Функция для валидации настроек
export function validateSettings(settings: any) {
  const errors: string[] = []

  if (typeof settings.markup !== "number" || settings.markup < 0) {
    errors.push("Надбавка должна быть положительным числом")
  }

  if (settings.useManualRate && (!settings.manualRate || settings.manualRate <= 0)) {
    errors.push("Ручной курс должен быть положительным числом")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// ИНСТРУКЦИЯ ПО ИЗМЕНЕНИЮ ДИНАМИЧЕСКОЙ НАДБАВКИ:
//
// 1. Измените значения в массиве DYNAMIC_MARKUP выше
// 2. maxYuan - максимальная сумма в юанях для данного уровня
// 3. markup - надбавка к курсу ЦБ в рублях для этого уровня (АБСОЛЮТНОЕ ЗНАЧЕНИЕ)
// 4. Сохраните файл и обновите страницу
//
// ПРИМЕРЫ:
// { maxYuan: 500, markup: 0.96 }  // До 500 юаней: Курс ЦБ + 0.96 руб
// { maxYuan: 2000, markup: 0.84 }  // До 2000 юаней: Курс ЦБ + 0.84 руб
// { maxYuan: 6000, markup: 0.80 }  // От 2000 до 6000: Курс ЦБ + 0.80 руб
// { maxYuan: Infinity, markup: 0.73 } // Свыше 6000: Курс ЦБ + 0.73 руб
