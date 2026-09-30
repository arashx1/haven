import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import zh from './locales/zh.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import hi from './locales/hi.json';
import bn from './locales/bn.json';
import as from './locales/as.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
    fr: { translation: fr },
    es: { translation: es },
    hi: { translation: hi },
    bn: { translation: bn },
    as: { translation: as },
  },
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;