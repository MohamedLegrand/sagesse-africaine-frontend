import { useState } from 'react';
import panierService from '../../../services/panierService';
import paiementsService from '../../../services/paiementsService';

const usePaiement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const payer = async (fournisseur, { fournisseurPaiementId, metadonnees } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const commande = await panierService.commander();
      const paiement = await paiementsService.initierPaiement(commande.id, fournisseur);
      const paiementConfirme = await paiementsService.confirmerPaiement(paiement.id, {
        fournisseurPaiementId,
        metadonnees,
      });
      return { commande, paiement: paiementConfirme };
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors du paiement');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPaiementParCommande = async (commandeId) => {
    setLoading(true);
    setError(null);
    try {
      return await paiementsService.getPaiementParCommande(commandeId);
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors de la récupération du paiement');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, payer, getPaiementParCommande };
};

export default usePaiement;
