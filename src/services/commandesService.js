import api from './api';

const commandesService = {
  getCommande: async (id) => {
    const response = await api.get(`/commandes/${id}`);
    return response.data;
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
