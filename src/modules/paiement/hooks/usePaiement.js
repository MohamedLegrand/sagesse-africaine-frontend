import { useState } from 'react';
import panierService from '../../../services/panierService';
import paiementsService from '../../../services/paiementsService';
import { traduireErreurApi } from '../../../services/erreurApi';

const usePaiement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const payer = async ({ operator, phoneNumber, country, metadonnees } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const commande = await panierService.commander();
      const paiement = await paiementsService.initierPaiement(commande.id, {
        operator,
        phoneNumber,
        country,
        metadonnees,
      });
      return { commande, paiement };
    } catch (err) {
      setError(traduireErreurApi(err));
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
      setError(traduireErreurApi(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Vérification ponctuelle du statut d'un paiement par commande.
   * Contrairement à getPaiementParCommande, ne passe pas loading à true
   * pour ne pas interférer avec les composants qui affichent leur propre état.
   */
  const verifierStatutPaiement = async (commandeId) => {
    try {
      return await paiementsService.getPaiementParCommande(commandeId);
    } catch (err) {
      throw err;
    }
  };

  return { loading, error, payer, getPaiementParCommande, verifierStatutPaiement };
};

export default usePaiement;
