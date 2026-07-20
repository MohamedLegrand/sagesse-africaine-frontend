import api from './api';

const commandesService = {
  getCommande: async (id) => {
    const response = await api.get(`/commandes/${id}`);
    return response.data;
  },

  getMesCommandes: async (page = 1, taille = 10) => {
    const response = await api.get('/commandes/mes-commandes', { params: { page, taille } });
    return response.data;
  },

  telechargerFacture: async (id) => {
    return api.get(`/commandes/${id}/facture`, { responseType: 'blob' });
  },

  annulerCommande: async (id) => {
    const response = await api.patch(`/commandes/${id}/annuler`);
    return response.data;
  },

  supprimerCommande: async (id) => {
    const response = await api.delete(`/commandes/${id}`);
    return response.data;
  },
};

export default commandesService;
