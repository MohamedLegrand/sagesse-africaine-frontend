import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, Search, ShoppingBag, Package, BookOpenText } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import livresService from '../../../services/livresService';
import { avecExtrait } from '../../../data/extraitsLivres';
import ExtraitModal from '../../../components/ExtraitModal';

const TAILLE_PAGE = 20;

const BoutiquePage = () => {
  const { t } = useTranslation('dashboard');
  const [livres, setLivres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [panier, setPanier] = useState({});
  const [extraitLivre, setExtraitLivre] = useState(null);
  const [ownedBookIds, setOwnedBookIds] = useState(new Set());
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    api.get('/panier/')
      .then(r => {
        const data = {};
        r.data.lignes?.forEach(l => { data[l.livre_id] = l.quantite; });
        setPanier(data);
      })
      .catch(() => {});

    api.get('/acces-livres/mes-acces')
      .then(r => {
        const owned = new Set((r.data.acces || []).map(a => a.livre_id));
        setOwnedBookIds(owned);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    livresService.getLivres(page, TAILLE_PAGE)
      .then((data) => {
        setLivres((data.livres || []).map(avecExtrait));
        setTotal(data.total || 0);
      })
      .catch(() => toast.error(t('boutique.messages.impossibleChargerCatalogue')))
      .finally(() => setLoading(false));
  }, [page, t]);

  const ajouterAuPanier = async (livreId) => {
    setAddingToCart(livreId);
    try {
      await api.post('/panier/ajouter', { livre_id: livreId, quantite: 1 });
      setPanier(prev => ({ ...prev, [livreId]: (prev[livreId] || 0) + 1 }));
      toast.success(t('boutique.messages.livreAjoutePanier'));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch {
      toast.error(t('boutique.messages.erreurAjout'));
    } finally {
      setAddingToCart(null);
    }
  };

  const livresFiltres = livres.filter(l =>
    l.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.auteur?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(total / TAILLE_PAGE));

  return (
    <DashboardLayout>
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="section-eyebrow">{t('boutique.eyebrow')}</span>
          <h1 className="section-title mt-1">{t('boutique.titre')}</h1>
        </div>
        <Link to="/dashboard/panier" className="btn-outline text-sm flex-shrink-0">
          <ShoppingBag className="w-4 h-4" /> {t('boutique.monPanier')}
        </Link>
      </div>

      {/* Recherche */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-300" />
          <input
            type="text"
            placeholder={t('boutique.rechercherPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Grille */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="rounded-xl bg-cream-100 animate-pulse">
              <div className="aspect-[2/3] bg-cream-200 rounded-t-xl" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-cream-200 rounded w-3/4" />
                <div className="h-2 bg-cream-200 rounded w-1/2" />
                <div className="h-7 bg-cream-200 rounded mt-3" />
              </div>
            </div>
          ))}
        </div>
      ) : livresFiltres.length === 0 ? (
        <div className="text-center py-20 text-brown-400">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium">{t('boutique.aucunLivreTrouve')}</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-brown-400 mb-4">{t('boutique.resultat', { count: livresFiltres.length })}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {livresFiltres.map((livre) => (
              <div key={livre.id} className="book-card group">
                <Link to={`/dashboard/livre/${livre.id}`} className="block flex-shrink-0">
                  <div className="relative aspect-[2/3] bg-cream-100 overflow-hidden">
                    {livre.couverture_url ? (
                      <img
                        src={livre.couverture_url}
                        alt={livre.titre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.onerror = null; e.target.src = '/images/default-book.png'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-cream-200">
                        <BookOpen className="w-8 h-8 text-brown-300" />
                      </div>
                    )}
                    {livre.est_gratuit && (
                      <span className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        {t('carteLivre.gratuitBadge')}
                      </span>
                    )}
                  </div>
                </Link>
                <div className="p-3 flex flex-col flex-1 gap-1.5">
                  <Link to={`/dashboard/livre/${livre.id}`}>
                    <h3 className="font-playfair font-bold text-brown-900 text-sm leading-snug line-clamp-2 hover:text-terra-600 transition-colors">
                      {livre.titre}
                    </h3>
                  </Link>
                  <p className="text-xs text-brown-400">{livre.auteur}</p>
                  <div className="flex items-center gap-2 mt-auto pt-2">
                    <Link
                      to={`/dashboard/livre/${livre.id}`}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-cream-100 text-brown-700 hover:bg-cream-200 transition-colors flex-shrink-0"
                    >
                      {t('carteLivre.voirPlus')}
                    </Link>
                    {livre.extrait_url && (
                      <button
                        onClick={() => setExtraitLivre(livre)}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50 transition-colors flex-shrink-0"
                        title={t('carteLivre.lireUnExtrait')}
                      >
                        <BookOpenText className="w-3 h-3" />
                      </button>
                    )}
                    {ownedBookIds.has(livre.id) || livre.est_gratuit ? (
                      <Link
                        to="/dashboard/bibliotheque"
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors ml-auto flex-shrink-0"
                      >
                        <BookOpen className="w-3 h-3" />
                        {t('carteLivre.lire')}
                      </Link>
                    ) : (
                      <button
                        onClick={() => ajouterAuPanier(livre.id)}
                        disabled={addingToCart === livre.id}
                        className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 ml-auto ${
                          panier[livre.id]
                            ? 'bg-green-100 text-green-700'
                            : 'bg-terra-500 hover:bg-terra-600 text-white'
                        }`}
                      >
                        {addingToCart === livre.id ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ShoppingBag className="w-3 h-3" />
                        )}
                        {panier[livre.id] ? `(${panier[livre.id]})` : t('carteLivre.ajouter')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {extraitLivre && (
            <ExtraitModal livre={extraitLivre} onClose={() => setExtraitLivre(null)} />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-cream-200 rounded-lg text-sm text-brown-600 disabled:opacity-40 hover:bg-cream-100 transition-colors"
              >
                {t('boutique.precedent')}
              </button>
              <span className="px-4 py-2 bg-terra-500 text-white rounded-lg text-sm font-medium">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-cream-200 rounded-lg text-sm text-brown-600 disabled:opacity-40 hover:bg-cream-100 transition-colors"
              >
                {t('boutique.suivant')}
              </button>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default BoutiquePage;
