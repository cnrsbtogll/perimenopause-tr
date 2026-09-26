import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from './locales/en/common.json';
import trCommon from './locales/tr/common.json';

const resources = {
  en: {
    common: enCommon,
  },
  tr: {
    common: trCommon,
  },
} as const;

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'tr',
  supportedLngs: ['en', 'tr'],
  defaultNS: 'common',
  ns: ['common'],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
