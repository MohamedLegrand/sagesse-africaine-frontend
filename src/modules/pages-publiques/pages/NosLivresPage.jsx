import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaSearch, FaStar, FaStarHalfAlt, FaShoppingCart } from 'react-icons/fa';
import Header from '../../visiteur/components/Header';
import Footer from '../../visiteur/components/Footer';
import api from '../../../services/api';
import guestCart from '../../../services/guestCart';
import toast from 'react-hot-toast';

const NosLivresPage = () => {
  const [livres, setLivres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [addingToCart, setAddingToCart] = useState(null);

  const fetchLivres = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/livres/', { params: { page, taille: 12 } });
      setLivres(response.data.livres || []);
      setTotalPages(Math.ceil((response.data.total || 0) / 12));
    } catch (error) {
      console.error('Erreur chargement livres:', error);
      toast.error('Erreur lors du chargement des livres');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchLivres();
  }, [fetchLivres]);

  const handleAddToCart = async (livre) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      guestCart.addItem(livre);
      toast.success('Livre ajouté au panier');
      return;
    }
    setAddingToCart(livre.id);
    try {
      await api.post('/panier/ajouter', { livre_id: livre.id, quantite: 1 });
      toast.success('Livre ajouté au panier');
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Erreur ajout panier:', error);
      toast.error("Erreur lors de l'ajout au panier");
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

  const livresFiltres = livres.filter(livre =>
    livre.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    livre.auteur?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          {/* En-tête */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-amber-800 mb-4">
              Notre catalogue
            </h1>
            <p className="text-amber-500 text-lg max-w-2xl mx-auto">
              Découvrez notre collection de livres sur les savoirs africains
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-16 h-px bg-amber-300"></div>
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <div className="w-16 h-px bg-amber-300"></div>
            </div>
          </div>

          {/* Recherche */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400" />
              <input
                type="text"
                placeholder="Rechercher un livre, un auteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
              />
            </div>
          </div>

          {/* Nombre de livres trouvés */}
          <div className="mb-4">
            <p className="text-amber-600">
              {livresFiltres.length} livre(s) trouvé(s)
            </p>
          </div>

          {/* Grille des livres */}
          {livresFiltres.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <FaBook className="text-amber-300 text-6xl mx-auto mb-4" />
              <h2 className="text-2xl font-playfair text-amber-700 mb-2">Aucun livre trouvé</h2>
              <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {livresFiltres.map((livre) => (
                <div key={livre.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  {/* Couverture avec image PNG */}
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
                          Gratuit
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
                      <span className="text-xs text-gray-400 ml-1">(avis)</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-amber-700">
                        {livre.est_gratuit ? 'Gratuit' : `${livre.prix.toLocaleString()} FCFA`}
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
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-amber-200 rounded-xl text-amber-600 disabled:opacity-50 hover:bg-amber-50 transition"
              >
                Précédent
              </button>
              <span className="px-4 py-2 bg-amber-600 text-white rounded-xl">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-amber-200 rounded-xl text-amber-600 disabled:opacity-50 hover:bg-amber-50 transition"
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NosLivresPage;