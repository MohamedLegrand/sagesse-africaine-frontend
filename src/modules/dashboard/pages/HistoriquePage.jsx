import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaBook, FaShoppingCart,
  FaChevronDown, FaChevronUp, FaSearch, FaFileInvoice, FaSpinner,
  FaSync, FaRedo, FaExclamationCircle
} from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import useTelechargerFacture from '../../../hooks/useTelechargerFacture';
import paiementsService from '../../../services/paiementsService';

const HistoriquePage = () => {
  const { t } = useTranslation('dashboard');
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCommande, setExpandedCommande] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { telecharger, commandeEnCours } = useTelechargerFacture();
  const [verifyingMap, setVerifyingMap] = useState({});

  const verifierStatutPaiement = async (commandeId) => {
    setVerifyingMap((prev) => ({ ...prev, [commandeId]: true }));
    const toastId = toast.loading(t('historique.messages.verificationEnCours'));
    try {
      const response = await paiementsService.getPaiementParCommande(commandeId);

      const statusMap = {
        'reussi': 'payee',
        'echoue': 'annulee',
        'rembourse': 'annulee',
      };

      const mappedStatus = statusMap[response.statut];

      if (mappedStatus === 'payee') {
        toast.success(t('historique.messages.paiementReussiDebloque'), { id: toastId });
        setCommandes((prev) =>
          prev.map((c) => (c.id === commandeId ? { ...c, statut: 'payee' } : c))
        );
      } else if (mappedStatus === 'annulee') {
        toast.error(t('historique.messages.paiementEchoue'), { id: toastId });
        setCommandes((prev) =>
          prev.map((c) => (c.id === commandeId ? { ...c, statut: 'annulee' } : c))
        );
      } else {
        toast.error(
          t('historique.messages.operateurPasEncoreValide'),
          { id: toastId }
        );
      }
    } catch (error) {
      console.error('Erreur vérification paiement:', error);
      toast.error(t('historique.messages.impossibleVerifier'), { id: toastId });
    } finally {
      setVerifyingMap((prev) => ({ ...prev, [commandeId]: false }));
    }
  };

  useEffect(() => {
    fetchHistorique();
  }, []);

  const fetchHistorique = async () => {
    try {
      const commandesRes = await api.get('/commandes/mes-commandes');
      setCommandes(commandesRes.data.commandes || []);
    } catch (error) {
      console.error('Erreur chargement historique:', error);
      toast.error(t('historique.messages.erreurChargement'));
    } finally {
      setLoading(false);
    }
  };

  const getStatutColor = (statut) => {
    switch (statut?.toLowerCase()) {
      case 'payé': case 'livré': case 'complété': return 'bg-green-100 text-green-700';
      case 'en attente': case 'pending': return 'bg-amber-100 text-amber-700';
      case 'annulé': case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatutText = (statut) => {
    switch (statut?.toLowerCase()) {
      case 'payé': return t('historique.statuts.payee');
      case 'livré': return t('historique.statuts.livree');
      case 'complété': return t('historique.statuts.completee');
      case 'en attente': case 'pending': return t('historique.statuts.enAttente');
      case 'annulé': case 'cancelled': return t('historique.statuts.annulee');
      default: return statut || t('historique.statuts.enCours');
    }
  };

  const commandesFiltrees = commandes.filter(c =>
    c.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-playfair font-bold text-amber-800">{t('historique.titre')}</h1>
          <p className="text-amber-500 text-sm">
            {t('historique.achatEffectue', { count: commandes.length })}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Barre de recherche */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400" />
                <input
                  type="text"
                  placeholder={t('historique.rechercherAchats')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                />
              </div>
            </div>

            {/* Commandes */}
            {commandesFiltrees.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <FaShoppingCart className="text-amber-300 text-6xl mx-auto mb-4" />
                <h2 className="text-2xl font-playfair text-amber-700 mb-2">{t('historique.aucunAchat')}</h2>
                <p className="text-gray-500 mb-6">{t('historique.pasEncoreAchat')}</p>
                <Link to="/dashboard/boutique" className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition inline-block">
                  {t('historique.decouvrirBoutique')}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {commandesFiltrees.map((commande) => (
                  <div key={commande.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div
                      className="p-6 cursor-pointer hover:bg-amber-50 transition flex justify-between items-center"
                      onClick={() => setExpandedCommande(expandedCommande === commande.id ? null : commande.id)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-mono font-bold text-amber-800">{commande.id}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatutColor(commande.statut)}`}>
                            {getStatutText(commande.statut)}
                          </span>
                        </div>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span>{new Date(commande.cree_le).toLocaleDateString('fr-FR')}</span>
                          <span>{t('historique.article', { count: commande.lignes?.length || 0 })}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-amber-700">{commande.montant_total} XAF</p>
                        <span className="text-amber-500 mt-1 inline-block">
                          {expandedCommande === commande.id ? <FaChevronUp /> : <FaChevronDown />}
                        </span>
                      </div>
                    </div>
                    {expandedCommande === commande.id && (
                      <div className="border-t border-amber-100 p-6 bg-amber-50/30">
                        <h4 className="font-semibold text-amber-800 mb-3">{t('historique.detailsAchat')}</h4>
                        <div className="space-y-3 mb-4">
                          {commande.lignes?.map((ligne) => (
                            <div key={ligne.id} className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-14 bg-amber-200 rounded flex items-center justify-center">
                                  <FaBook className="text-amber-500" />
                                </div>
                                <div>
                                  <p className="font-medium text-amber-800">{ligne.livre?.titre || t('historique.livreFallback')}</p>
                                  <p className="text-sm text-gray-500">{t('historique.quantite', { n: ligne.quantite })}</p>
                                </div>
                              </div>
                              <p className="font-medium text-amber-700">{ligne.prix_unitaire * ligne.quantite} XAF</p>
                            </div>
                          ))}
                        </div>
                        {(() => {
                          const statusLower = commande.statut?.toLowerCase();
                          const isPaid = ['payee', 'payé', 'livré', 'complété'].includes(statusLower);
                          const isPending = ['en attente', 'pending', 'en_attente'].includes(statusLower);
                          const isFailed = ['annulé', 'annulee', 'cancelled', 'echoue'].includes(statusLower);

                          if (isPaid) {
                            return (
                              <div className="flex flex-wrap gap-3">
                                <button
                                  onClick={(e) => { e.stopPropagation(); telecharger(commande.id); }}
                                  disabled={commandeEnCours === commande.id}
                                  className="flex items-center gap-2 text-sm font-semibold text-amber-700 border border-amber-300 rounded-xl px-4 py-2.5 hover:bg-amber-100 transition disabled:opacity-50"
                                >
                                  {commandeEnCours === commande.id ? (
                                    <FaSpinner className="animate-spin" />
                                  ) : (
                                    <FaFileInvoice />
                                  )}
                                  {t('historique.telechargerFacture')}
                                </button>
                                <Link
                                  to="/dashboard/bibliotheque"
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl px-4 py-2.5 hover:shadow-md transition hover:scale-[1.02] active:scale-[0.98]"
                                >
                                  <FaBook size={12} />
                                  {t('historique.accederBibliotheque')}
                                </Link>
                              </div>
                            );
                          }

                          if (isPending) {
                            return (
                              <div className="flex flex-wrap gap-3">
                                <button
                                  onClick={(e) => { e.stopPropagation(); verifierStatutPaiement(commande.id); }}
                                  disabled={verifyingMap[commande.id]}
                                  className="flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl px-4 py-2.5 hover:shadow-md transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                >
                                  {verifyingMap[commande.id] ? (
                                    <FaSpinner className="animate-spin" />
                                  ) : (
                                    <FaSync className="animate-pulse" />
                                  )}
                                  {t('historique.verifierStatutPaiement')}
                                </button>
                                <Link
                                  to={`/paiement/${commande.id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-2 text-sm font-semibold text-amber-700 border border-amber-300 rounded-xl px-4 py-2.5 hover:bg-amber-100 transition"
                                >
                                  <FaRedo size={12} />
                                  {t('historique.reessayerPaiement')}
                                </Link>
                              </div>
                            );
                          }

                          if (isFailed) {
                            return (
                              <div>
                                <p className="text-sm text-red-600 font-medium mb-3 flex items-center gap-1.5">
                                  <FaExclamationCircle /> {t('historique.paiementEchoueOuAnnule')}
                                </p>
                                <Link
                                  to={`/paiement/${commande.id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl px-4 py-2.5 hover:shadow-md transition hover:scale-[1.02] active:scale-[0.98]"
                                >
                                  <FaRedo size={12} />
                                  {t('historique.reessayerPaiement')}
                                </Link>
                              </div>
                            );
                          }

                          return null;
                        })()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HistoriquePage;
