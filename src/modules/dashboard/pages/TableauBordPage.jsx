import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBook, 
  FaShoppingCart, 
  FaHeart, 
  FaUserCircle,
  FaSignOutAlt,
  FaBell
} from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import { useNotificationContext } from '../../notification/contextes/NotificationContext';
import Header from '../../visiteur/components/Header';
import Footer from '../../visiteur/components/Footer';

const TableauBordPage = () => {
  const [user, setUser] = useState(null);
  const [collections, setCollections] = useState([]);
  const [livres, setLivres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);
  const [addingToFav, setAddingToFav] = useState(null);
  
  const { nonLues } = useNotificationContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await api.get('/utilisateurs/me');
        setUser(userResponse.data);

        const collectionsRes = await api.get('/collections/');
        setCollections(collectionsRes.data.collections || []);
        
        const livresRes = await api.get('/livres/');
        setLivres(livresRes.data.livres || []);
        
      } catch (error) {
        console.error('Erreur chargement:', error);
        toast.error('Erreur chargement du catalogue');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = async (livreId) => {
    setAddingToCart(livreId);
    try {
      await api.post('/panier/ajouter', { livre_id: livreId, quantite: 1 });
      toast.success('Livre ajouté au panier');
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Erreur ajout panier:', error);
      toast.error('Erreur lors de l\'ajout');
    } finally {
      setAddingToCart(null);
    }
  };

  const handleAddToFavorites = async (livreId) => {
    setAddingToFav(livreId);
    try {
      // TODO: Appel API pour ajouter aux favoris
      toast.success('Ajouté à vos favoris');
    } catch (error) {
      console.error('Erreur ajout favoris:', error);
      toast.error('Erreur lors de l\'ajout');
    } finally {
      setAddingToFav(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    toast.success('Déconnexion réussie');
    window.location.href = '/connexion';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
        <Header />
        <div className="flex justify-center items-center pt-40">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-amber-600 mt-4">Chargement du catalogue...</p>
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
            <p className="text-amber-500 text-lg">
              Découvrez tous nos livres par collection
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-16 h-px bg-amber-300"></div>
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <div className="w-16 h-px bg-amber-300"></div>
            </div>
          </div>

          {/* Livres par collection */}
          {collections.map((collection) => {
            const livresCollection = livres.filter(l => l.collection_id === collection.id && l.est_publie);
            if (livresCollection.length === 0) return null;
            
            return (
              <div key={collection.id} id={`collection-${collection.id}`} className="mb-16 scroll-mt-32">
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-playfair font-bold text-amber-800 border-l-4 border-amber-500 pl-3">
                    {collection.nom}
                  </h2>
                  {collection.description && (
                    <p className="text-gray-500 text-sm mt-2 ml-3">{collection.description}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {livresCollection.map((livre) => (
                    <div key={livre.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                      {/* Couverture avec image PNG */}
                      <Link to={`/dashboard/livre/${livre.id}`} className="block">
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
                        <Link to={`/dashboard/livre/${livre.id}`}>
                          <h3 className="font-playfair font-bold text-amber-800 text-lg mb-1 hover:text-amber-600 transition line-clamp-1">
                            {livre.titre}
                          </h3>
                        </Link>
                        <p className="text-amber-500 text-sm mb-2">{livre.auteur}</p>
                        
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-2xl font-bold text-amber-700">
                            {livre.est_gratuit ? 'Gratuit' : `${livre.prix.toLocaleString()} FCFA`}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAddToFavorites(livre.id)}
                              disabled={addingToFav === livre.id}
                              className="p-2 rounded-full hover:bg-amber-100 transition text-amber-500 disabled:opacity-50"
                              title="Ajouter aux favoris"
                            >
                              {addingToFav === livre.id ? (
                                <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <FaHeart />
                              )}
                            </button>
                            <button
                              onClick={() => handleAddToCart(livre.id)}
                              disabled={addingToCart === livre.id}
                              className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-3 py-2 rounded-xl text-sm font-medium hover:shadow-lg transition flex items-center gap-1 disabled:opacity-50"
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
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {collections.length === 0 && (
            <div className="text-center py-20">
              <FaBook className="text-amber-300 text-6xl mx-auto mb-4" />
              <h2 className="text-2xl font-playfair text-amber-700 mb-2">Aucun livre disponible</h2>
              <p className="text-gray-500">Revenez plus tard pour découvrir notre catalogue</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TableauBordPage;