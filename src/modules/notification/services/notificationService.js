import api from '../../../services/api';

const notificationService = {
  // Récupérer toutes les notifications de l'utilisateur
  getMesNotifications: async () => {
    try {
      const response = await api.get('/notifications/');
      return response.data;
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
      throw error;
    }
  },

  // Marquer une notification comme lue
  marquerCommeLu: async (notificationId) => {
    try {
      const response = await api.patch(`/notifications/${notificationId}/lire`);
      return response.data;
    } catch (error) {
      console.error('Erreur marquage notification:', error);
      throw error;
    }
  },

  // Marquer toutes les notifications comme lues
  marquerToutLu: async () => {
    try {
      const response = await api.patch('/notifications/lire-tout');
      return response.data;
    } catch (error) {
      console.error('Erreur marquage tout:', error);
      throw error;
    }
  },

  // Supprimer une notification
  supprimerNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur suppression notification:', error);
      throw error;
    }
  },

  // Compter les notifications non lues
  compterNonLues: async () => {
    try {
      const response = await api.get('/notifications/');
      const nonLues = response.data.notifications?.filter(n => !n.est_lu).length || 0;
      return nonLues;
    } catch (error) {
      console.error('Erreur comptage notifications:', error);
      return 0;
    }
  }
};

export default notificationService;