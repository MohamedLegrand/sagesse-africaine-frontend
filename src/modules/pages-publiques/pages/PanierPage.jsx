import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBook, FaTrash, FaPlus, FaMinus, FaShoppingCart, FaCreditCard } from 'react-icons/fa';
import Header from '../../visiteur/components/Header';
import Footer from '../../visiteur/components/Footer';
import api from '../../../services/api';
import guestCart from '../../../services/guestCart';
import toast from 'react-hot-toast';

const PanierPage = () => {
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
      toast.error('Erreur chargement du panier');
    } finally {
      setLoading(false);
    }
  }, []);

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
      toast.success('Quantité mise à jour');
    } catch {
      toast.error('Erreur lors de la mise à jour');
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
      toast.success('Article retiré');
    } catch {
      toast.error('Erreur lors du retrait');
    } finally {
      setUpdating(false);
    }
  };

  const viderPanier = async () => {
    if (!window.confirm('Voulez-vous vraiment vider votre panier ?')) return;
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
      toast.success('Panier vidé');
    } catch {
      toast.error('Erreur lors du vidage');
    } finally {
      setUpdating(false);
    }
  };

  const procederAuPaiement = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      localStorage.setItem('auth_return_to', '/dashboard/paiement');
      toast('Connectez-vous pour finaliser votre commande', { icon: '🔐' });
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
              Mon panier
            </h1>
            {nombreLivres > 0 && (
              <p className="text-amber-500">{nombreLivres} livre(s) dans votre panier</p>
            )}
            {!isAuthenticated && lignes.length > 0 && (
              <p className="text-sm text-amber-700 mt-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 inline-block">
                Connectez-vous pour finaliser votre commande — votre panier sera conservé
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
              <h2 className="text-2xl font-playfair text-amber-700 mb-2">Votre panier est vide</h2>
              <p className="text-gray-500 mb-6">Découvrez notre catalogue et ajoutez des livres</p>
              <Link to="/livres" className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition inline-block">
                Découvrir les livres
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
                          {ligne.livre?.titre || 'Titre inconnu'}
                        </h3>
                        {ligne.livre?.auteur && (
                          <p className="text-amber-500 text-sm mt-0.5">{ligne.livre.auteur}</p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                          {prixUnitaire > 0 ? (
                            <span className="text-amber-600 text-sm">
                              Prix unitaire : <strong>{prixUnitaire.toLocaleString()} FCFA</strong>
                            </span>
                          ) : (
                            <span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Gratuit</span>
                          )}
                          {ligne.quantite > 1 && prixUnitaire > 0 && (
                            <span className="text-amber-700 text-sm font-bold">
                              Sous-total : {sousTotal.toLocaleString()} FCFA
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantité + actions */}
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-2 mb-3">
                          <button
                            onClick={() => updateQuantite(ligne.livre_id, ligne.quantite - 1)}
                            disabled={updating}
                            className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition flex items-center justify-center disabled:opacity-50"
                          >
                            <FaMinus className="text-xs" />
                          </button>
                          <span className="w-8 text-center text-amber-800 font-medium">{ligne.quantite}</span>
                          <button
                            onClick={() => updateQuantite(ligne.livre_id, ligne.quantite + 1)}
                            disabled={updating}
                            className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition flex items-center justify-center disabled:opacity-50"
                          >
                            <FaPlus className="text-xs" />
                          </button>
                        </div>
                        <button
                          onClick={() => retirerArticle(ligne.livre_id)}
                          disabled={updating}
                          className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1 ml-auto transition"
                        >
                          <FaTrash />
                          Supprimer
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
                  Vider le panier
                </button>
              </div>

              {/* Récapitulatif */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32">
                  <h3 className="text-xl font-playfair font-bold text-amber-800 mb-4">Récapitulatif</h3>
                  <div className="space-y-3 border-b border-amber-100 pb-4 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sous-total</span>
                      <span className="text-amber-800 font-medium">{total.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frais de livraison</span>
                      <span className="text-green-600">Gratuit</span>
                    </div>
                  </div>
                  <div className="flex justify-between mb-6">
                    <span className="text-lg font-bold text-amber-800">Total</span>
                    <span className="text-2xl font-bold text-amber-700">{total.toLocaleString()} FCFA</span>
                  </div>
                  <button
                    onClick={procederAuPaiement}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <FaCreditCard />
                    Procéder au paiement
                  </button>
                  {!isAuthenticated && (
                    <p className="text-xs text-amber-500 text-center mt-3">
                      Une connexion sera demandée pour finaliser
                    </p>
                  )}
                  <Link to="/livres" className="block text-center text-amber-600 text-sm mt-4 hover:text-amber-700 transition">
                    ← Continuer mes achats
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
