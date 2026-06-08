import { useState } from 'react';
import paiementService from '../services/paiementService';

const usePaiement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPaiementParCommande = async (commandeId) => {
    setLoading(true);
    setError(null);
    try {
      return await paiementService.getPaiementParCommande(commandeId);
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors de la récupération du paiement');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, getPaiementParCommande };
};

export default usePaiement;
