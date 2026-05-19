import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';
import frTranslations from './locales/fr.json';
import deTranslations from './locales/de.json';
import arTranslations from './locales/ar.json';
import ptTranslations from './locales/pt.json';

const resources = {
  en: {
    translation: enTranslations
  },
  es: {
    translation: esTranslations
  },
  fr: {
    translation: frTranslations
  },
  de: {
    translation: deTranslations
  },
  ar: {
    translation: arTranslations
  },
  pt: {
    translation: ptTranslations
  }
};

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Default language
    debug: false, // Set to true for development debugging

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    detection: {
      // Options for language detection
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'], // Cache user language preference
    },

    // Language switching options
    load: 'languageOnly', // Load only language code (en, not en-US)
    cleanCode: true,
    
    // React specific options
    react: {
      useSuspense: false, // Disable suspense for now
    }
  });

export default i18n;

// Export supported languages for the language switcher
export const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' }
];