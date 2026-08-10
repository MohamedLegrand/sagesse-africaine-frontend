import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaLock } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import { traduireErreurApi } from '../../../services/erreurApi';
import DashboardLayout from '../components/DashboardLayout';
import FormulaireMobileMoney from '../../paiement/components/FormulaireMobileMoney';
import usePaiement from '../../paiement/hooks/usePaiement';

const PaiementPage = () => {
  const { t } = useTranslation('paiement');
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
        toast.error(t('messages.panierVide'));
        navigate('/dashboard/panier');
        return;
      }
      setPanier(response.data);
    } catch (error) {
      console.error('Erreur chargement panier:', error);
      toast.error(t('messages.erreurChargementPanier'));
      navigate('/dashboard/panier');
    } finally {
      setLoading(false);
    }
  };

  const handlePaiementMobileMoney = async ({ operator, phoneNumber, country }) => {
    const toastId = toast.loading(t('messages.envoiDemande'));
    try {
      const { commande } = await payer({ operator, phoneNumber, country });
      toast.success(t('messages.demandeEnvoyeeConfirmez'), { id: toastId });
      navigate(`/confirmation-paiement/${commande.id}`);
    } catch (error) {
      toast.error(traduireErreurApi(error, 'messages.paiementEchoue', 'paiement'), { id: toastId });
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
          {t('titre')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulaire de paiement */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
              <h2 className="text-xl font-playfair font-bold text-amber-800 mb-6">
                {t('mobileMoney')}
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
                <p className="text-sm font-medium text-gray-700">{t('paiementSecurise')}</p>
                <p className="text-xs text-gray-500">{t('confirmationTelephone')}</p>
              </div>
            </div>
          </div>

          {/* Résumé de la commande */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-playfair font-bold text-amber-800 mb-4">
                {t('resumeCommande')}
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
                  <span className="text-gray-600">{t('sousTotal')}</span>
                  <span className="text-amber-700">{total.toLocaleString()} XAF</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">{t('fraisLivraison')}</span>
                  <span className="text-green-600">{t('gratuit')}</span>
                </div>
              </div>

              <div className="border-t border-amber-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-amber-800">{t('totalAPayer')}</span>
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
