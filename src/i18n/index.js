import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import commun_fr from './locales/fr/commun.json';
import commun_en from './locales/en/commun.json';
import accueil_fr from './locales/fr/accueil.json';
import accueil_en from './locales/en/accueil.json';
import auth_fr from './locales/fr/auth.json';
import auth_en from './locales/en/auth.json';
import catalogue_fr from './locales/fr/catalogue.json';
import catalogue_en from './locales/en/catalogue.json';
import panier_fr from './locales/fr/panier.json';
import panier_en from './locales/en/panier.json';
import paiement_fr from './locales/fr/paiement.json';
import paiement_en from './locales/en/paiement.json';
import dashboard_fr from './locales/fr/dashboard.json';
import dashboard_en from './locales/en/dashboard.json';
import admin_fr from './locales/fr/admin.json';
import admin_en from './locales/en/admin.json';
import notifications_fr from './locales/fr/notifications.json';
import notifications_en from './locales/en/notifications.json';
import erreurs_fr from './locales/fr/erreurs.json';
import erreurs_en from './locales/en/erreurs.json';

// Langues disponibles. Le contenu des livres (titre, description, auteur) n'est
// JAMAIS traduit — uniquement le texte d'interface passe par ce système.
export const LANGUES_DISPONIBLES = ['fr', 'en'];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { commun: commun_fr, accueil: accueil_fr, auth: auth_fr, catalogue: catalogue_fr, panier: panier_fr, paiement: paiement_fr, dashboard: dashboard_fr, admin: admin_fr, notifications: notifications_fr, erreurs: erreurs_fr },
      en: { commun: commun_en, accueil: accueil_en, auth: auth_en, catalogue: catalogue_en, panier: panier_en, paiement: paiement_en, dashboard: dashboard_en, admin: admin_en, notifications: notifications_en, erreurs: erreurs_en },
    },
    ns: ['commun', 'accueil', 'auth', 'catalogue', 'panier', 'paiement', 'dashboard', 'admin', 'notifications', 'erreurs'],
    defaultNS: 'commun',
    fallbackLng: 'fr',
    supportedLngs: LANGUES_DISPONIBLES,

    detection: {
      // Priorité : préférence explicite déjà enregistrée (langue utilisateur
      // synchronisée depuis le backend, ou choix précédent d'un visiteur) avant
      // la détection navigateur.
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'langue',
    },

    interpolation: {
      escapeValue: false, // React échappe déjà le contenu, pas besoin d'un double échappement
    },
  });

export default i18n;
