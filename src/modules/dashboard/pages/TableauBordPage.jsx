import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShoppingBag, Heart, ArrowRight, Package } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import livresSite from '../../../data/livresSite';

const BookCard = ({ livre, onAddToCart, adding }) => (
  <div className="book-card group">
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
            GRATUIT
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
      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="font-bold text-brown-900 text-sm">
          {livre.est_gratuit ? <span className="text-green-600">Gratuit</span> : `${livre.prix?.toLocaleString()} F`}
        </span>
        <button
          onClick={() => onAddToCart(livre.id)}
          disabled={adding === livre.id}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-terra-500 hover:bg-terra-600 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {adding === livre.id ? (
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <ShoppingBag className="w-3 h-3" />
          )}
          Ajouter
        </button>
      </div>
    </div>
  </div>
);

const TableauBordPage = () => {
  const [collections, setCollections] = useState([]);
  const [livres, setLivres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);
  const [activeCol, setActiveCol] = useState('all');

  useEffect(() => {
    setLivres(livresSite);
    setLoading(false);
  }, []);

  const handleAddToCart = async (livreId) => {
    setAddingToCart(livreId);
    try {
      await api.post('/panier/ajouter', { livre_id: livreId, quantite: 1 });
      toast.success('Livre ajouté au panier');
      window.dispatchEvent(new Event('cartUpdated'));
    } catch {
      toast.error("Erreur lors de l'ajout");
    } finally {
      setAddingToCart(null);
    }
  };

  const publishedLivres = livres.filter(l => l.est_publie);
  const filteredLivres = activeCol === 'all'
    ? publishedLivres
    : publishedLivres.filter(l => l.collection_id === activeCol);

  const tabs = [{ id: 'all', label: 'Tous' }, ...collections.map(c => ({ id: c.id, label: c.nom }))];

  return (
    <DashboardLayout>
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="section-eyebrow">Boutique</span>
          <h1 className="section-title mt-1">Notre catalogue</h1>
          <p className="text-brown-500 text-sm mt-1">
            {publishedLivres.length} ouvrages disponibles
          </p>
        </div>
        <Link to="/dashboard/panier" className="btn-outline text-sm flex-shrink-0">
          <ShoppingBag className="w-4 h-4" />
          Mon panier
        </Link>
      </div>

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
      ) : (
        <>
          {/* Filtres */}
          {collections.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-thin">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCol(tab.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCol === tab.id
                      ? 'bg-terra-500 text-white'
                      : 'bg-white text-brown-600 hover:bg-cream-100 border border-cream-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Collections groupées (quand "Tous") */}
          {activeCol === 'all' ? (
            <div className="space-y-12">
              {collections.map((collection) => {
                const livresCol = publishedLivres.filter(l => l.collection_id === collection.id);
                if (livresCol.length === 0) return null;
                return (
                  <div key={collection.id} id={`collection-${collection.id}`} className="scroll-mt-20">
                    {/* Titre collection */}
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h2 className="font-playfair text-xl font-bold text-brown-900">
                          {collection.nom}
                        </h2>
                        {collection.description && (
                          <p className="text-brown-400 text-sm mt-0.5">{collection.description}</p>
                        )}
                      </div>
                      <span className="text-xs text-brown-400 bg-cream-100 px-3 py-1 rounded-full">
                        {livresCol.length} ouvrage{livresCol.length > 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {livresCol.map(livre => (
                        <BookCard
                          key={livre.id}
                          livre={livre}
                          onAddToCart={handleAddToCart}
                          adding={addingToCart}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Livres sans collection */}
              {(() => {
                const sans = publishedLivres.filter(l =>
                  !collections.some(c => c.id === l.collection_id)
                );
                if (sans.length === 0) return null;
                return (
                  <div>
                    <h2 className="font-playfair text-xl font-bold text-brown-900 mb-5">Autres ouvrages</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {sans.map(livre => (
                        <BookCard key={livre.id} livre={livre} onAddToCart={handleAddToCart} adding={addingToCart} />
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div>
              {filteredLivres.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredLivres.map(livre => (
                    <BookCard key={livre.id} livre={livre} onAddToCart={handleAddToCart} adding={addingToCart} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-brown-400">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="font-medium">Aucun livre dans cette collection pour l'instant.</p>
                </div>
              )}
            </div>
          )}

          {publishedLivres.length === 0 && (
            <div className="text-center py-20 text-brown-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">Aucun livre disponible pour le moment.</p>
              <p className="text-sm mt-1">Revenez bientôt pour découvrir nos parutions.</p>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default TableauBordPage;
