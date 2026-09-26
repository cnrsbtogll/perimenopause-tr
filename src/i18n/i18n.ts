import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import trCommon from './locales/tr/common.json';
import enCommon from './locales/en/common.json';
import frCommon from './locales/fr/common.json';
import deCommon from './locales/de/common.json';
import nlCommon from './locales/nl/common.json';
import ptCommon from './locales/pt/common.json';
import elCommon from './locales/el/common.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'tr', label: 'Türkçe', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'nl', label: 'Nederlands', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'pt', label: 'Português', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'el', label: 'Ελληνικά', nativeName: 'Ελληνικά', flag: '🇬🇷' },
] as const;

export type SupportedLanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

const resources = {
  tr: { common: trCommon },
  en: { common: enCommon },
  fr: { common: frCommon },
  de: { common: deCommon },
  nl: { common: nlCommon },
  pt: { common: ptCommon },
  el: { common: elCommon },
} as const;

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'tr',
  supportedLngs: ['tr', 'en', 'fr', 'de', 'nl', 'pt', 'el'],
  defaultNS: 'common',
  ns: ['common'],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
