import i18n from '../i18n';
import api from './api';

// Change la langue d'affichage immédiatement (et la persiste en localStorage via
// le détecteur i18next). Si l'utilisateur est connecté, synchronise aussi son
// compte en base — pour qu'il retrouve sa langue en se connectant ailleurs.
export const changerLangue = async (langue) => {
  i18n.changeLanguage(langue);

  const token = localStorage.getItem('access_token');
  if (!token) return;

  try {
    const { data } = await api.get('/utilisateurs/me');
    await api.put('/utilisateurs/me/preferences', {
      langue,
      notifications: {
        email: data.notif_email,
        commandes: data.notif_commandes,
        promotions: data.notif_promotions,
        newsletter: data.notif_newsletter,
      },
    });
  } catch {
    // Échec silencieux : la langue reste appliquée localement, seule la
    // synchronisation avec le compte a échoué (pas bloquant pour l'utilisateur).
  }
};

// À appeler à la connexion / au chargement si un token existe : la langue
// enregistrée sur le compte fait autorité sur celle détectée localement.
export const synchroniserLangueDepuisCompte = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) return;

  try {
    const { data } = await api.get('/utilisateurs/me');
    if (data.langue && data.langue !== i18n.language) {
      i18n.changeLanguage(data.langue);
    }
  } catch {
    // Pas grave : la langue détectée localement reste utilisée.
  }
};
