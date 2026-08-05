import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import FormulaireMobileMoney from '../../paiement/components/FormulaireMobileMoney';
import usePaiement from '../../paiement/hooks/usePaiement';

const PaiementPage = () => {
  const navigate = useNavigate();
  const [panier, setPanier] = useState(null);
  const [loading, setLoading] = useState(true);
  const { loading: paiementLoading, payer } = usePaiement();

  useEffect(() => {
    fetchPanier();
  }, []);

  const fetchPanier = async () => {
    try {
      const response = await api.get('/panier/');
      if (!response.data.lignes || response.data.lignes.length === 0) {
        toast.error('Votre panier est vide');
        navigate('/dashboard/panier');
        return;
      }
      setPanier(response.data);
    } catch (error) {
      console.error('Erreur chargement panier:', error);
      toast.error('Erreur chargement du panier');
      navigate('/dashboard/panier');
    } finally {
      setLoading(false);
    }
  };

  const handlePaiementMobileMoney = async ({ operator, phoneNumber, country }) => {
    const toastId = toast.loading('Envoi de la demande...');
    try {
      const { commande } = await payer({ operator, phoneNumber, country });
      toast.success('Demande envoyée ! Confirmez sur votre téléphone.', { id: toastId });
      navigate(`/confirmation-paiement/${commande.id}`);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Le paiement a échoué', { id: toastId });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!panier || panier.lignes?.length === 0) {
    return null;
  }

  const total = panier?.total || 0;

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-2xl font-playfair font-bold text-amber-800 mb-6">
          Paiement
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulaire de paiement */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
              <h2 className="text-xl font-playfair font-bold text-amber-800 mb-6">
                Mobile Money
              </h2>
              <FormulaireMobileMoney
                onSubmit={handlePaiementMobileMoney}
                loading={paiementLoading}
                montantXaf={total}
              />
            </div>

            {/* Sécurité */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-3">
              <FaLock className="text-green-500 text-xl" />
              <div>
                <p className="text-sm font-medium text-gray-700">Paiement sécurisé</p>
                <p className="text-xs text-gray-500">Confirmation directement sur votre téléphone</p>
              </div>
            </div>
          </div>

          {/* Résumé de la commande */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-playfair font-bold text-amber-800 mb-4">
                Résumé de la commande
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {panier.lignes?.map((ligne) => (
                  <div key={ligne.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {ligne.livre?.titre} x{ligne.quantite}
                    </span>
                    <span className="text-amber-700 font-medium">
                      {((ligne.prix_unitaire ?? ligne.livre?.prix ?? 0) * ligne.quantite).toLocaleString()} XAF
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-amber-100 pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="text-amber-700">{total.toLocaleString()} XAF</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Frais de livraison</span>
                  <span className="text-green-600">Gratuit</span>
                </div>
              </div>

              <div className="border-t border-amber-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-amber-800">Total</span>
                  <span className="text-2xl font-bold text-amber-700">{total.toLocaleString()} XAF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaiementPage;
