import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaBook, FaTrash, FaPlus, FaMinus, FaShoppingCart, FaCreditCard } from 'react-icons/fa';
import Header from '../../visiteur/components/Header';
import Footer from '../../visiteur/components/Footer';
import api from '../../../services/api';
import guestCart from '../../../services/guestCart';
import toast from 'react-hot-toast';

const PanierPage = () => {
  const { t } = useTranslation('panier');
  const navigate = useNavigate();
  const [panier, setPanier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchPanier = useCallback(async () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      const items = guestCart.getItems();
      setPanier({
        lignes: items,
        total: guestCart.getTotal(),
        nombre_livres: guestCart.getCount(),
      });
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/panier/');
      const panierData = response.data;
      const lignes = panierData.lignes || [];

      if (lignes.length > 0 && !lignes[0].livre) {
        const livresDetails = await Promise.all(
          lignes.map(async (ligne) => {
            try {
              const res = await api.get(`/livres/${ligne.livre_id}`);
              return { livre_id: ligne.livre_id, livre: res.data };
            } catch {
              return { livre_id: ligne.livre_id, livre: null };
            }
          })
        );
        const livreMap = Object.fromEntries(livresDetails.map(l => [l.livre_id, l.livre]));
        panierData.lignes = lignes.map(ligne => ({ ...ligne, livre: livreMap[ligne.livre_id] }));
      }

      setPanier({ ...panierData });
    } catch (error) {
      console.error('Erreur chargement panier:', error);
      toast.error(t('messages.erreurChargement'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchPanier();
    window.addEventListener('cartUpdated', fetchPanier);
    return () => window.removeEventListener('cartUpdated', fetchPanier);
  }, [fetchPanier]);

  const updateQuantite = async (livreId, nouvelleQuantite) => {
    if (nouvelleQuantite < 1) return;
    setUpdating(true);

    const token = localStorage.getItem('access_token');
    if (!token) {
      guestCart.updateQuantite(livreId, nouvelleQuantite);
      await fetchPanier();
      setUpdating(false);
      return;
    }

    try {
      await api.delete(`/panier/retirer/${livreId}`);
      await api.post('/panier/ajouter', { livre_id: livreId, quantite: nouvelleQuantite });
      await fetchPanier();
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success(t('messages.quantiteMiseAJour'));
    } catch {
      toast.error(t('messages.erreurMiseAJour'));
    } finally {
      setUpdating(false);
    }
  };

  const retirerArticle = async (livreId) => {
    setUpdating(true);

    const token = localStorage.getItem('access_token');
    if (!token) {
      guestCart.removeItem(livreId);
      await fetchPanier();
      setUpdating(false);
      return;
    }

    try {
      await api.delete(`/panier/retirer/${livreId}`);
      await fetchPanier();
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success(t('messages.articleRetire'));
    } catch {
      toast.error(t('messages.erreurRetrait'));
    } finally {
      setUpdating(false);
    }
  };

  const viderPanier = async () => {
    if (!window.confirm(t('messages.confirmViderPanier'))) return;
    setUpdating(true);

    const token = localStorage.getItem('access_token');
    if (!token) {
      guestCart.clear();
      await fetchPanier();
      setUpdating(false);
      return;
    }

    try {
      await api.delete('/panier/vider');
      await fetchPanier();
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success(t('messages.panierVideMessage'));
    } catch {
      toast.error(t('messages.erreurVidage'));
    } finally {
      setUpdating(false);
    }
  };

  const procederAuPaiement = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      localStorage.setItem('auth_return_to', '/dashboard/paiement');
      toast(t('messages.connectezVousFinaliserAchat'), { icon: '🔐' });
      navigate('/connexion');
      return;
    }
    navigate('/paiement');
  };

  const lignes = panier?.lignes || [];
  const total = panier?.total || 0;
  const nombreLivres = panier?.nombre_livres || 0;
  const isAuthenticated = !!localStorage.getItem('access_token');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-amber-800 mb-4">
              {t('titre')}
            </h1>
            {nombreLivres > 0 && (
              <p className="text-amber-500">{t('livreDansPanier', { count: nombreLivres })}</p>
            )}
            {!isAuthenticated && lignes.length > 0 && (
              <p className="text-sm text-amber-700 mt-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 inline-block">
                {t('connectezVousFinaliserAchatConserve')}
              </p>
            )}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-16 h-px bg-amber-300"></div>
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <div className="w-16 h-px bg-amber-300"></div>
            </div>
          </div>

          {lignes.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <FaShoppingCart className="text-amber-300 text-6xl mx-auto mb-4" />
              <h2 className="text-2xl font-playfair text-amber-700 mb-2">{t('panierVide')}</h2>
              <p className="text-gray-500 mb-6">{t('decouvrezCatalogue')}</p>
              <Link to="/livres" className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition inline-block">
                {t('decouvrirLivres')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Liste des articles */}
              <div className="lg:col-span-2 space-y-4">
                {lignes.map((ligne) => {
                  const prixUnitaire = ligne.prix_unitaire ?? ligne.livre?.prix ?? 0;
                  const sousTotal = prixUnitaire * ligne.quantite;
                  return (
                    <div key={ligne.id} className="bg-white rounded-2xl shadow-lg p-4 flex gap-4 hover:shadow-xl transition">
                      {/* Couverture */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-32 bg-amber-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {ligne.livre?.couverture_url ? (
                            <img
                              src={ligne.livre.couverture_url}
                              alt={ligne.livre?.titre}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              onError={(e) => { e.target.onerror = null; e.target.src = '/images/default-book.png'; }}
                            />
                          ) : (
                            <FaBook className="text-amber-300 text-4xl" />
                          )}
                        </div>
                      </div>

                      {/* Infos livre */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-playfair font-bold text-amber-800 text-lg line-clamp-2">
                          {ligne.livre?.titre || t('titreInconnu')}
                        </h3>
                        {ligne.livre?.auteur && (
                          <p className="text-amber-500 text-sm mt-0.5">{ligne.livre.auteur}</p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                          {prixUnitaire > 0 ? (
                            <span className="text-amber-600 text-sm">
                              {t('prixUnitaire')} <strong>{prixUnitaire.toLocaleString('fr-FR')} XAF</strong>
                            </span>
                          ) : (
                            <span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{t('gratuit')}</span>
                          )}
                          {ligne.quantite > 1 && prixUnitaire > 0 && (
                            <span className="text-amber-700 text-sm font-bold">
                              {t('sousTotal')} {sousTotal.toLocaleString('fr-FR')} XAF
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantité + actions */}
                      <div className="text-right flex-shrink-0">
                        <div className="mb-3 text-amber-700 text-sm font-medium">
                          {t('quantite')}
                        </div>
                        <button
                          onClick={() => retirerArticle(ligne.livre_id)}
                          disabled={updating}
                          className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1 ml-auto transition"
                        >
                          <FaTrash />
                          {t('supprimer')}
                        </button>
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={viderPanier}
                  disabled={updating}
                  className="text-red-500 hover:text-red-600 text-sm flex items-center gap-2 mt-4 transition"
                >
                  <FaTrash />
                  {t('viderPanier')}
                </button>
              </div>

              {/* Récapitulatif */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32">
                  <h3 className="text-xl font-playfair font-bold text-amber-800 mb-4">{t('recapitulatif')}</h3>
                  <div className="space-y-3 border-b border-amber-100 pb-4 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('sousTotal')}</span>
                      <span className="text-amber-800 font-medium">{total.toLocaleString('fr-FR')} XAF</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('fraisLivraison')}</span>
                      <span className="text-green-600">{t('gratuit')}</span>
                    </div>
                  </div>
                  <div className="flex justify-between mb-6">
                    <span className="text-lg font-bold text-amber-800">{t('total')}</span>
                    <span className="text-2xl font-bold text-amber-700">{total.toLocaleString('fr-FR')} XAF</span>
                  </div>
                  <button
                    onClick={procederAuPaiement}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <FaCreditCard />
                    {t('procederAuPaiement')}
                  </button>
                  {!isAuthenticated && (
                    <p className="text-xs text-amber-500 text-center mt-3">
                      {t('connexionSeraDemandee')}
                    </p>
                  )}
                  <Link to="/livres" className="block text-center text-amber-600 text-sm mt-4 hover:text-amber-700 transition">
                    {t('continuerAchats')}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PanierPage;
