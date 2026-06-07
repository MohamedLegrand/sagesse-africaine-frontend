import { useState } from 'react';
import toast from 'react-hot-toast';
import paiementService from '../services/paiementService';

const usePaiement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initierStripe = async (montant, livres) => {
    setLoading(true);
    setError(null);
    try {
      const result = await paiementService.initierPaiementStripe(montant, livres);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'initialisation du paiement');
      toast.error('Erreur lors de l\'initialisation du paiement');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const initierOrangeMoney = async (montant, telephone, livres) => {
    setLoading(true);
    setError(null);
    try {
      const result = await paiementService.initierPaiementOrangeMoney(montant, telephone, livres);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'initialisation du paiement Orange Money');
      toast.error('Erreur lors de l\'initialisation du paiement');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const initierMTN = async (montant, telephone, livres) => {
    setLoading(true);
    setError(null);
    try {
      const result = await paiementService.initierPaiementMTN(montant, telephone, livres);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'initialisation du paiement MTN');
      toast.error('Erreur lors de l\'initialisation du paiement');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    initierStripe,
    initierOrangeMoney,
    initierMTN
  };
};

export default usePaiement;