import api from './api';

const signetsService = {
  getMesSignets: async (livreId = null) => {
    const params = livreId ? { livre_id: livreId } : {};
    const response = await api.get('/signets/', { params });
    return response.data;
  },

  creerSignet: async (data) => {
    const response = await api.post('/signets/', data);
    return response.data;
  },

  modifierSignet: async (signetId, note) => {
    const response = await api.patch(`/signets/${signetId}`, { note });
    return response.data;
  },

  supprimerSignet: async (signetId) => {
    const response = await api.delete(`/signets/${signetId}`);
    return response.data;
  },
};

export default signetsService;
