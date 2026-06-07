import api from '../../../services/api';

const paiementService = {
  // Initier un paiement Stripe
  initierPaiementStripe: async (montant, livres, devise = 'XAF') => {
    try {
      const response = await api.post('/paiements/initier-stripe', {
        montant,
        devise,
        livres: livres.map(l => ({ id: l.livre_id, titre: l.livre?.titre, prix: l.prix_unitaire }))
      });
      return response.data;
    } catch (error) {
      console.error('Erreur init paiement Stripe:', error);
      throw error;
    }
  },

  // Initier un paiement Orange Money
  initierPaiementOrangeMoney: async (montant, telephone, livres) => {
    try {
      const response = await api.post('/paiements/initier-orange', {
        montant,
        telephone,
        livres: livres.map(l => ({ id: l.livre_id, titre: l.livre?.titre, prix: l.prix_unitaire }))
      });
      return response.data;
    } catch (error) {
      console.error('Erreur init paiement Orange Money:', error);
      throw error;
    }
  },

  // Initier un paiement MTN Mobile Money
  initierPaiementMTN: async (montant, telephone, livres) => {
    try {
      const response = await api.post('/paiements/initier-mtn', {
        montant,
        telephone,
        livres: livres.map(l => ({ id: l.livre_id, titre: l.livre?.titre, prix: l.prix_unitaire }))
      });
      return response.data;
    } catch (error) {
      console.error('Erreur init paiement MTN:', error);
      throw error;
    }
  },

  // Vérifier le statut d'un paiement
  verifierStatutPaiement: async (reference) => {
    try {
      const response = await api.get(`/paiements/statut/${reference}`);
      return response.data;
    } catch (error) {
      console.error('Erreur vérification paiement:', error);
      throw error;
    }
  }
};

export default paiementService;