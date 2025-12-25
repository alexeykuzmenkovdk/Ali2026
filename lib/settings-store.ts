import { getDefaultSettings } from "./exchange-config"

// Централизованное хранилище настроек
interface ExchangeSettings {
  markup: number
  useManualRate: boolean
  manualRate: number | null
  version: number
  lastUpdated: string
}

// Глобальное хранилище с правильной инициализацией
class SettingsStore {
  private static instance: SettingsStore
  private settings: ExchangeSettings | null = null

  private constructor() {}

  static getInstance(): SettingsStore {
    if (!SettingsStore.instance) {
      SettingsStore.instance = new SettingsStore()
    }
    return SettingsStore.instance
  }

  getSettings(): ExchangeSettings {
    if (!this.settings) {
      // Инициализируем настройки из конфигурации
      this.settings = getDefaultSettings()
      console.log("[STORE] Инициализированы настройки из конфигурации:", this.settings)
    }
    return this.settings
  }

  setSettings(newSettings: Partial<ExchangeSettings>): ExchangeSettings {
    const current = this.getSettings()
    this.settings = {
      ...current,
      ...newSettings,
      version: current.version + 1,
      lastUpdated: new Date().toISOString(),
    }
    console.log("[STORE] Настройки обновлены:", this.settings)
    return this.settings
  }

  // Метод для сброса настроек к значениям по умолчанию из конфигурации
  resetToDefaults(): ExchangeSettings {
    this.settings = getDefaultSettings()
    console.log("[STORE] Настройки сброшены к значениям по умолчанию:", this.settings)
    return this.settings
  }

  // Добавляем метод для получения информации о настройках
  getSettingsInfo(): string {
    if (!this.settings) {
      return "Настройки не инициализированы"
    }
    return `Версия: ${this.settings.version}, Режим: ${
      this.settings.useManualRate ? `Ручной (${this.settings.manualRate}₽)` : `Авто (${this.settings.markup}₽)`
    }`
  }
}

// Экспортируем единственный экземпляр
export const settingsStore = SettingsStore.getInstance()
