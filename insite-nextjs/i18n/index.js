import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enTranslations from './locales/en.json'
import esTranslations from './locales/es.json'
import frTranslations from './locales/fr.json'
import deTranslations from './locales/de.json'
import arTranslations from './locales/ar.json'
import ptTranslations from './locales/pt.json'

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: enTranslations },
        es: { translation: esTranslations },
        fr: { translation: frTranslations },
        de: { translation: deTranslations },
        ar: { translation: arTranslations },
        pt: { translation: ptTranslations },
      },
      lng: 'en',           // default; LanguageSwitcher overrides at runtime
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    })
}

// Attach browser language detection after init — client only
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('i18nextLng')
  if (saved && saved !== i18n.language) i18n.changeLanguage(saved)
}

export default i18n

export const supportedLanguages = [
  { code: 'en', name: 'English',    flag: '🇺🇸' },
  { code: 'es', name: 'Español',    flag: '🇪🇸' },
  { code: 'fr', name: 'Français',   flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch',    flag: '🇩🇪' },
  { code: 'ar', name: 'العربية',    flag: '🇸🇦' },
  { code: 'pt', name: 'Português',  flag: '🇧🇷' },
]
