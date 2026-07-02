import api from '../../../services/api';

const notificationService = {
  getMesNotifications: async () => {
    const response = await api.get('/notifications/');
    return response.data;
  },

  getNotification: async (notificationId) => {
    const response = await api.get(`/notifications/${notificationId}`);
    return response.data;
  },

  marquerCommeLu: async (notificationId) => {
    const response = await api.patch(`/notifications/${notificationId}/lire`);
    return response.data;
  },

  marquerToutLu: async () => {
    const response = await api.patch('/notifications/lire-tout');
    return response.data;
  },

  supprimerNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  supprimerTout: async () => {
    const response = await api.delete('/notifications/');
    return response.data;
  },
};

export default notificationService;
