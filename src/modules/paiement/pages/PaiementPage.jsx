import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import Header from '../../visiteur/components/Header';
import Footer from '../../visiteur/components/Footer';
import RecapitulatifPaiement from '../components/RecapitulatifPaiement';
import FormulaireMobileMoney from '../components/FormulaireMobileMoney';
import usePaiement from '../hooks/usePaiement';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import { traduireErreurApi } from '../../../services/erreurApi';

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
        navigate('/panier');
        return;
      }
      setPanier(response.data);
    } catch (error) {
      console.error('Erreur chargement panier:', error);
      toast.error(t('messages.erreurChargementPanier'));
      navigate('/panier');
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
        <Header />
        <div className="flex justify-center items-center pt-40">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const total = panier?.total || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/panier')}
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-6 transition"
          >
            <FaArrowLeft />
            {t('retourPanier')}
          </button>

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-amber-800 mb-4">
              {t('titre')}
            </h1>
            <p className="text-amber-500 text-lg">
              {t('choisirPaysOperateur')}
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-16 h-px bg-amber-300"></div>
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <div className="w-16 h-px bg-amber-300"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulaire de paiement */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-playfair font-bold text-amber-800 mb-4">
                  {t('mobileMoney')}
                </h2>
                <FormulaireMobileMoney
                  onSubmit={handlePaiementMobileMoney}
                  loading={paiementLoading}
                  montantXaf={total}
                />
              </div>

              {/* Sécurité */}
              <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{t('paiementSecurise')}</p>
                  <p className="text-xs text-gray-500">{t('confirmationTelephone')}</p>
                </div>
              </div>
            </div>

            {/* Récapitulatif */}
            <div className="lg:col-span-1">
              <RecapitulatifPaiement panier={panier} total={total} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaiementPage;
