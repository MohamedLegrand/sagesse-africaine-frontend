import api from './api';

const paiementsService = {
  getPaiementParCommande: async (commandeId) => {
    const response = await api.get(`/paiements/${commandeId}`);
    return response.data;
  },

  getTousPaiements: async (page = 1, taille = 10) => {
    const response = await api.get('/paiements/', { params: { page, taille } });
    return response.data;
  },
};

export default paiementsService;
