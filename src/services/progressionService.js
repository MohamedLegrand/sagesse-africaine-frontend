import api from './api';

const progressionService = {
  getMesProgressions: async () => {
    const response = await api.get('/progression-lecture/');
    return response.data;
  },

  getProgressionLivre: async (livreId) => {
    const response = await api.get(`/progression-lecture/${livreId}`);
    return response.data;
  },

  sauvegarderProgression: async (data) => {
    const response = await api.post('/progression-lecture/', data);
    return response.data;
  },

  supprimerProgression: async (livreId) => {
    const response = await api.delete(`/progression-lecture/${livreId}`);
    return response.data;
  },
};

export default progressionService;
