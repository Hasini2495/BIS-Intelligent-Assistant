import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import enNavigation from './locales/en/navigation.json';
import enChat from './locales/en/chat.json';
import enErrors from './locales/en/errors.json';

import hiCommon from './locales/hi/common.json';
import hiNavigation from './locales/hi/navigation.json';
import hiChat from './locales/hi/chat.json';
import hiErrors from './locales/hi/errors.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        navigation: enNavigation,
        chat: enChat,
        errors: enErrors
      },
      hi: {
        common: hiCommon,
        navigation: hiNavigation,
        chat: hiChat,
        errors: hiErrors
      }
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
