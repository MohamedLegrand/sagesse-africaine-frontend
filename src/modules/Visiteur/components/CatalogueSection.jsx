import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, BookOpen, Check, ArrowRight, Star } from 'lucide-react';
import api from '../../../services/api';
import guestCart from '../../../services/guestCart';
import toast from 'react-hot-toast';
import livresSite from '../../../data/livresSite';

const BookCard = ({ livre, onAddToCart, addingId, addedIds, prefix = '' }) => {
  const isAdding = addingId === livre.id;
  const isAdded  = addedIds.has(livre.id);
  const to = prefix ? `${prefix}/${livre.id}` : `/livre/${livre.id}`;

  return (
    <div className="book-card group">
      {/* Couverture */}
      <Link to={to} className="block flex-shrink-0">
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
              <BookOpen className="w-10 h-10 text-brown-300" />
            </div>
          )}
          {livre.est_gratuit && (
            <span className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              GRATUIT
            </span>
          )}
        </div>
      </Link>

      {/* Infos */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <Link to={to}>
          <h3 className="font-playfair font-bold text-brown-900 text-sm leading-snug line-clamp-2 hover:text-terra-600 transition-colors">
            {livre.titre}
          </h3>
        </Link>
        <p className="text-xs text-brown-400">{livre.auteur}</p>
        <p className="text-sm font-bold text-terra-600">
          {livre.est_gratuit ? 'Gratuit' : `${livre.prix?.toLocaleString()} XAF`}
        </p>

        <div className="flex flex-col gap-1.5 mt-auto pt-2">
          <Link
            to={to}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold bg-cream-100 text-brown-700 hover:bg-cream-200 transition-colors w-full"
          >
            Voir plus
          </Link>

          <button
            onClick={() => onAddToCart(livre)}
            disabled={isAdding || isAdded}
            className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 w-full
              ${isAdded
                ? 'bg-green-100 text-green-700 cursor-default'
                : 'bg-terra-500 text-white hover:bg-terra-600 disabled:opacity-50'
              }`}
          >
            {isAdding ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isAdded ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <ShoppingBag className="w-3.5 h-3.5" />
            )}
            {isAdded ? 'Ajouté' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
};

const CatalogueSection = () => {
  const [livres, setLivres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);
  const [addedIds, setAddedIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState('all');
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    setLivres(livresSite);
    setLoading(false);
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
      <section className="py-20 bg-white border-t border-cream-100">
        <div className="container-editorial">
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-cream-50 rounded-xl animate-pulse">
                <div className="aspect-[2/3] bg-cream-200 rounded-t-xl" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-cream-200 rounded w-3/4" />
                  <div className="h-2 bg-cream-200 rounded w-1/2" />
                  <div className="h-7 bg-cream-200 rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (livres.length === 0) return null;

  const tabs = [{ id: 'all', label: 'Tous les livres' }, ...collections.map(c => ({ id: c.id, label: c.nom }))];
  const filteredLivres = activeTab === 'all'
    ? livres
    : livres.filter(l => l.collection_id === activeTab);

  return (
    <section className="py-20 bg-white border-t border-cream-100" id="catalogue">
      <div className="container-editorial">

        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="section-eyebrow">Catalogue</span>
            <h2 className="section-title mt-2">Nos livres en vedette</h2>
          </div>
          <Link to="/livres" className="btn-outline text-sm flex-shrink-0">
            Voir tout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Tabs filtres */}
        {collections.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-thin">
            {tabs.slice(0, 6).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-terra-500 text-white'
                    : 'bg-cream-50 text-brown-600 hover:bg-cream-100 border border-cream-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Grille livres */}
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {filteredLivres.map((livre) => (
            <BookCard
              key={livre.id}
              livre={livre}
              onAddToCart={handleAddToCart}
              addingId={addingToCart}
              addedIds={addedIds}
            />
          ))}
        </div>

        {filteredLivres.length === 0 && (
          <div className="text-center py-16 text-brown-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>Aucun livre dans cette collection pour l'instant.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CatalogueSection;
