import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaShoppingCart, FaArrowRight, FaCheck } from 'react-icons/fa';
import api from '../../../services/api';
import guestCart from '../../../services/guestCart';
import toast from 'react-hot-toast';

const CatalogueSection = () => {
  const [livres, setLivres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);
  const [addedIds, setAddedIds] = useState(new Set());

  /* ── GET /livres/ — seul endpoint public utilisé ── */
  useEffect(() => {
    api.get('/livres/', { params: { page: 1, taille: 100 } })
      .then(r => setLivres((r.data.livres || []).filter(l => l.est_publie)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = async (livre) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      guestCart.addItem(livre);
      toast.success('Livre ajouté au panier');
      setAddedIds(p => new Set(p).add(livre.id));
      return;
    }
    setAddingToCart(livre.id);
    try {
      await api.post('/panier/ajouter', { livre_id: livre.id, quantite: 1 });
      toast.success('Livre ajouté au panier');
      window.dispatchEvent(new Event('cartUpdated'));
      setAddedIds(p => new Set(p).add(livre.id));
    } catch {
      toast.error("Erreur lors de l'ajout au panier");
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (livres.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* En-tête */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3 bg-amber-100 px-3 py-1 rounded-full">
            Catalogue
          </span>
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-amber-800 mb-3">
            Nos livres
          </h2>
          <p className="text-amber-600 max-w-xl mx-auto text-sm md:text-base">
            Découvrez notre collection d'ouvrages sur les savoirs africains
          </p>
          <div className="flex items-center justify-center gap-2 mt-5">
            <div className="w-16 h-px bg-amber-300" />
            <div className="w-2 h-2 bg-amber-400 rounded-full" />
            <div className="w-16 h-px bg-amber-300" />
          </div>
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {livres.map((livre) => (
            <div
              key={livre.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              {/* Couverture */}
              <Link to={`/livre/${livre.id}`} className="block flex-shrink-0">
                <div className="relative h-64 bg-amber-100 flex items-center justify-center overflow-hidden">
                  {livre.couverture_url ? (
                    <img
                      src={livre.couverture_url}
                      alt={livre.titre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/images/default-book.png'; }}
                    />
                  ) : (
                    <FaBook className="text-amber-300 text-6xl" />
                  )}
                  {livre.est_gratuit && (
                    <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Gratuit
                    </span>
                  )}
                </div>
              </Link>

              {/* Infos */}
              <div className="p-4 flex flex-col flex-1">
                <Link to={`/livre/${livre.id}`}>
                  <h3 className="font-playfair font-bold text-amber-800 text-base mb-1 line-clamp-2 hover:text-amber-600 transition leading-snug">
                    {livre.titre}
                  </h3>
                </Link>
                <p className="text-amber-500 text-sm mb-3">{livre.auteur}</p>

                <div className="flex justify-between items-center mt-auto">
                  <span className="text-xl font-bold text-amber-700">
                    {livre.est_gratuit ? 'Gratuit' : `${livre.prix?.toLocaleString()} FCFA`}
                  </span>
                  <button
                    onClick={() => handleAddToCart(livre)}
                    disabled={addingToCart === livre.id}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 disabled:opacity-50
                      ${addedIds.has(livre.id)
                        ? 'bg-green-500 text-white'
                        : 'bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:shadow-lg hover:scale-105'
                      }`}
                  >
                    {addingToCart === livre.id
                      ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : addedIds.has(livre.id) ? <FaCheck className="text-xs" /> : <FaShoppingCart className="text-xs" />
                    }
                    {addedIds.has(livre.id) ? 'Ajouté' : 'Ajouter'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            to="/livres"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white
              px-8 py-3 rounded-full font-semibold shadow-md
              hover:shadow-lg hover:shadow-amber-500/30 hover:scale-105 transition-all duration-300"
          >
            Voir tout le catalogue
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CatalogueSection;
