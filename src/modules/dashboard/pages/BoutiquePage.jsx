import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaSearch, FaFilter, FaShoppingCart, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';

const BoutiquePage = () => {
  const [livres, setLivres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [panier, setPanier] = useState({});
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    const fetchPanier = async () => {
      try {
        const response = await api.get('/panier/');
        const panierData = {};
        response.data.lignes?.forEach(ligne => {
          panierData[ligne.livre_id] = ligne.quantite;
        });
        setPanier(panierData);
      } catch {}
    };
    fetchPanier();
  }, []);

  useEffect(() => {
    const fetchLivres = async () => {
      setLoading(true);
      try {
        const response = await api.get('/livres/', { params: { page, taille: 12 } });
        setLivres(response.data.livres || []);
        setTotal(response.data.total || 0);
      } catch (error) {
        console.error('Erreur chargement livres:', error);
        toast.error('Erreur chargement du catalogue');
      } finally {
        setLoading(false);
      }
    };
    fetchLivres();
  }, [page]);

  const ajouterAuPanier = async (livreId) => {
    setAddingToCart(livreId);
    try {
      await api.post('/panier/ajouter', { livre_id: livreId, quantite: 1 });
      setPanier(prev => ({ ...prev, [livreId]: (prev[livreId] || 0) + 1 }));
      toast.success('Livre ajouté au panier');
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Erreur ajout panier:', error);
      toast.error("Erreur lors de l'ajout");
    } finally {
      setAddingToCart(null);
    }
  };

  const livresFiltres = livres.filter(livre => {
    const matchSearch = livre.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       livre.auteur?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategorie = !selectedCategorie || livre.collection_id === selectedCategorie;
    return matchSearch && matchCategorie;
  });

  const renderStars = (note) => {
    const stars = [];
    const fullStars = Math.floor(note);
    const hasHalf = note % 1 >= 0.5;
    for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={i} className="text-amber-500" />);
    if (hasHalf) stars.push(<FaStarHalfAlt key="half" className="text-amber-500" />);
    while (stars.length < 5) stars.push(<FaStar key={stars.length} className="text-gray-300" />);
    return stars;
  };

  const categories = [
    { id: '', nom: 'Toutes les catégories' },
    { id: 'sciences-sociales', nom: 'Sciences Sociales' },
    { id: 'medecine-spirituelle', nom: 'Médecine Spirituelle' },
    { id: 'gouvernance-locale', nom: 'Gouvernance Locale' },
    { id: 'economie-sociale', nom: 'Économie Sociale' },
    { id: 'technologies', nom: 'Technologies & Innovation' },
  ];

  const totalPages = Math.ceil(total / 12);

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-playfair font-bold text-amber-800">Boutique</h1>
          <p className="text-amber-500 text-sm">Découvrez notre catalogue de livres</p>
        </div>

        {/* Recherche et filtres */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400" />
              <input
                type="text"
                placeholder="Rechercher un livre, un auteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
              />
            </div>
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400" />
              <select
                value={selectedCategorie}
                onChange={(e) => setSelectedCategorie(e.target.value)}
                className="pl-10 pr-8 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none appearance-none bg-white"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nom}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Grille */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {livresFiltres.map((livre) => (
                <div key={livre.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <Link to={`/dashboard/livre/${livre.id}`} className="block">
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
                        <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">Gratuit</span>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link to={`/dashboard/livre/${livre.id}`}>
                      <h3 className="font-playfair font-bold text-amber-800 text-lg mb-1 hover:text-amber-600 transition line-clamp-1">
                        {livre.titre}
                      </h3>
                    </Link>
                    <p className="text-amber-500 text-sm mb-2">{livre.auteur}</p>
                    <div className="flex items-center gap-1 mb-3">
                      {renderStars(4.5)}
                      <span className="text-xs text-gray-400 ml-1">(12 avis)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-amber-700">
                        {livre.est_gratuit ? 'Gratuit' : `${livre.prix?.toLocaleString()} FCFA`}
                      </span>
                      <button
                        onClick={() => ajouterAuPanier(livre.id)}
                        disabled={addingToCart === livre.id}
                        className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                      >
                        {addingToCart === livre.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <FaShoppingCart />
                        )}
                        {panier[livre.id] ? `Dans le panier (${panier[livre.id]})` : 'Ajouter'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {livresFiltres.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <FaBook className="text-amber-300 text-6xl mx-auto mb-4" />
                <h2 className="text-xl font-playfair text-amber-700">Aucun livre trouvé</h2>
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
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BoutiquePage;
