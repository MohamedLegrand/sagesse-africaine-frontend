import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaBook, FaSearch, FaStar, FaStarHalfAlt, FaShoppingCart } from 'react-icons/fa';
import Header from '../../visiteur/components/Header';
import Footer from '../../visiteur/components/Footer';
import api from '../../../services/api';
import guestCart from '../../../services/guestCart';
import toast from 'react-hot-toast';
import livresService from '../../../services/livresService';
import { avecExtrait } from '../../../data/extraitsLivres';

const RecherchePage = () => {
  const { t } = useTranslation('catalogue');
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';

  const [terme, setTerme] = useState(q);
  const [livres, setLivres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    setTerme(q);
    setLoading(true);
    livresService.getLivres(1, 100, q)
      .then((data) => setLivres((data.livres || []).map(avecExtrait)))
      .catch(() => toast.error(t('messages.impossibleChargerResultats')))
      .finally(() => setLoading(false));
  }, [q, t]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setSearchParams(terme.trim() ? { q: terme.trim() } : {});
  }, [terme, setSearchParams]);

  const handleAddToCart = async (livre) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      guestCart.addItem(livre);
      toast.success(t('messages.livreAjoutePanier'));
      return;
    }
    setAddingToCart(livre.id);
    try {
      await api.post('/panier/ajouter', { livre_id: livre.id, quantite: 1 });
      toast.success(t('messages.livreAjoutePanier'));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Erreur ajout panier:', error);
      toast.error(t('messages.erreurAjoutPanier'));
    } finally {
      setAddingToCart(null);
    }
  };

  const renderStars = (note) => {
    const stars = [];
    const fullStars = Math.floor(note);
    const hasHalfStar = note % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-amber-500" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-amber-500" />);
    }
    while (stars.length < 5) {
      stars.push(<FaStar key={stars.length} className="text-gray-300" />);
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-amber-800 mb-4">
              {t('resultatsRecherche')}
            </h1>
            {q && (
              <p className="text-amber-500 text-lg max-w-2xl mx-auto">
                {t('pourTerme', { terme: q })}
              </p>
            )}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-16 h-px bg-amber-300"></div>
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <div className="w-16 h-px bg-amber-300"></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400" />
              <input
                type="text"
                placeholder={t('rechercherPlaceholder')}
                value={terme}
                onChange={(e) => setTerme(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
              />
            </div>
          </form>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-amber-600">
                  {t('livreTrouve', { count: livres.length })}
                </p>
              </div>

              {livres.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <FaBook className="text-amber-300 text-6xl mx-auto mb-4" />
                  <h2 className="text-2xl font-playfair text-amber-700 mb-2">{t('aucunLivreTrouve')}</h2>
                  <p className="text-gray-500">{t('essayezAutreTitreAuteur')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {livres.map((livre) => (
                    <div key={livre.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                      <Link to={`/livre/${livre.id}`} className="block">
                        <div className="relative h-64 bg-amber-100 flex items-center justify-center overflow-hidden">
                          {livre.couverture_url ? (
                            <img
                              src={livre.couverture_url}
                              alt={livre.titre}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/images/default-book.png';
                              }}
                            />
                          ) : (
                            <FaBook className="text-amber-300 text-6xl" />
                          )}
                          {livre.est_gratuit && (
                            <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                              {t('gratuit')}
                            </span>
                          )}
                        </div>
                      </Link>

                      <div className="p-4">
                        <Link to={`/livre/${livre.id}`}>
                          <h3 className="font-playfair font-bold text-amber-800 text-lg mb-1 hover:text-amber-600 transition line-clamp-1">
                            {livre.titre}
                          </h3>
                        </Link>
                        <p className="text-amber-500 text-sm mb-2">{livre.auteur}</p>

                        <div className="flex items-center gap-1 mb-3">
                          {renderStars(4.5)}
                          <span className="text-xs text-gray-400 ml-1">({t('avis')})</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-amber-700">
                            {livre.est_gratuit ? t('gratuit') : `${livre.prix.toLocaleString('fr-FR')} XAF`}
                          </span>
                          <button
                            onClick={() => handleAddToCart(livre)}
                            disabled={addingToCart === livre.id}
                            className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {addingToCart === livre.id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <FaShoppingCart />
                            )}
                            {t('ajouter')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RecherchePage;
