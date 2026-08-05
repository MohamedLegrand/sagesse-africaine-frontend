import api from './api';

const paiementsService = {
  getPaysOperateurs: async () => {
    const response = await api.get('/paiements/pays-operateurs');
    return response.data;
  },

  initierPaiement: async (commandeId, { operator, phoneNumber, country, metadonnees } = {}) => {
    const response = await api.post(`/paiements/${commandeId}/initier`, {
      operator,
      phone_number: phoneNumber,
      country,
      metadonnees,
    });
    return response.data;
  },

  getPaiementParCommande: async (commandeId) => {
    const response = await api.get(`/paiements/commande/${commandeId}`);
    return response.data;
  },

  getTousPaiements: async (page = 1, taille = 10) => {
    const response = await api.get('/paiements/', { params: { page, taille } });
    return response.data;
  },
};

export default paiementsService;
