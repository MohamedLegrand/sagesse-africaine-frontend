import api from './api';

const paiementsService = {
  initierPaiement: async (commandeId, fournisseur) => {
    const response = await api.post('/paiements/', { commande_id: commandeId, fournisseur });
    return response.data;
  },

  confirmerPaiement: async (paiementId, { fournisseurPaiementId, metadonnees } = {}) => {
    const response = await api.post(`/paiements/${paiementId}/confirmer`, {
      fournisseur_paiement_id: fournisseurPaiementId,
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
