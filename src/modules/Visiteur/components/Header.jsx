import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUser, FaShoppingCart, FaBars, FaTimes, FaSignOutAlt, 
  FaBell, FaBook, FaChevronDown, FaSearch
} from 'react-icons/fa';
import api from '../../../services/api';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [collections, setCollections] = useState([]);
  const [showBoutiqueMenu, setShowBoutiqueMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Vérifier l'authentification
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      setIsAuthenticated(!!token);
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Récupérer les collections
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await api.get('/collections/');
        setCollections(response.data.collections || []);
      } catch (error) {
        console.error('Erreur chargement collections:', error);
      }
    };
    fetchCollections();
  }, []);

  // Recherche de livres
  useEffect(() => {
    const searchBooks = async () => {
      if (searchTerm.length > 2) {
        try {
          const response = await api.get('/livres/', { params: { page: 1, taille: 10 } });
          const livres = response.data.livres || [];
          const results = livres.filter(livre => 
            livre.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            livre.auteur?.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setSearchResults(results.slice(0, 5));
          setShowResults(true);
        } catch (error) {
          console.error('Erreur recherche:', error);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    };
    
    const delayDebounce = setTimeout(searchBooks, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // Fermer la recherche au clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Récupérer le panier
  const fetchCartCount = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const response = await api.get('/panier/');
        setCartItemCount(response.data.nombre_livres || 0);
      } catch (error) {
        console.error('Erreur panier:', error);
      }
    } else {
      setCartItemCount(0);
    }
  };

  // Récupérer les notifications
  const fetchNotificationCount = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const response = await api.get('/notifications/');
        const nonLues = response.data.notifications?.filter(n => !n.est_lu).length || 0;
        setNotificationCount(nonLues);
      } catch (error) {
        console.error('Erreur notifications:', error);
      }
    } else {
      setNotificationCount(0);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartCount();
      fetchNotificationCount();
    }
    
    const handleCartUpdate = () => fetchCartCount();
    const handleNotificationUpdate = () => fetchNotificationCount();
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('notificationUpdated', handleNotificationUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('notificationUpdated', handleNotificationUpdate);
    };
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    setIsAuthenticated(false);
    navigate('/');
  };

  const scrollToCollection = (collectionId) => {
    const element = document.getElementById(`collection-${collectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setShowBoutiqueMenu(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/recherche?q=${encodeURIComponent(searchTerm)}`);
      setShowSearch(false);
      setShowResults(false);
      setSearchTerm('');
    }
  };

  const handleResultClick = (livreId) => {
    navigate(`/livre/${livreId}`);
    setShowResults(false);
    setShowSearch(false);
    setSearchTerm('');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-white py-5'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img src="/images/logo.png" alt="SAGESSE AFRICAINE" className="h-12 w-auto transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 to-amber-600/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-playfair text-xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">SAGESSE AFRICAINE</span>
            <span className="text-[10px] text-amber-500 tracking-wider">ÉDITIONS</span>
          </div>
        </Link>

        {/* MENU DESKTOP */}
        <div className="hidden lg:flex items-center gap-8">
          <Link to="/" className="relative text-amber-800 hover:text-amber-600 font-medium transition-colors duration-300 group">
            Accueil
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {/* Boutique avec menu déroulant */}
          <div 
            className="relative"
            onMouseEnter={() => setShowBoutiqueMenu(true)}
            onMouseLeave={() => setShowBoutiqueMenu(false)}
          >
            <button className="relative text-amber-800 hover:text-amber-600 font-medium transition-colors duration-300 group flex items-center gap-1">
              Boutique
              <FaChevronDown className={`text-xs transition-transform duration-300 ${showBoutiqueMenu ? 'rotate-180' : ''}`} />
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300 group-hover:w-full"></span>
            </button>
            
            {showBoutiqueMenu && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-amber-100 overflow-hidden z-50">
                <div className="py-2">
                  {collections.map((collection) => (
                    <button
                      key={collection.id}
                      onClick={() => scrollToCollection(collection.id)}
                      className="block w-full text-left px-4 py-2 text-amber-700 hover:bg-amber-50 transition-colors duration-200 text-sm"
                    >
                      {collection.nom}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {isAuthenticated && (
            <Link to="/dashboard" className="relative text-amber-800 hover:text-amber-600 font-medium transition-colors duration-300 group">
              Mon espace
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          )}

          {!isAuthenticated && (
            <Link to="/qui-sommes-nous" className="relative text-amber-800 hover:text-amber-600 font-medium transition-colors duration-300 group">
              Qui sommes-nous
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          )}
        </div>

        {/* ACTIONS DESKTOP */}
        <div className="hidden lg:flex items-center gap-6">

          {/* BARRE DE RECHERCHE */}
          <div className="relative" ref={searchRef}>
            {showSearch ? (
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un livre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                  autoFocus
                  className="w-64 px-4 py-2 pl-10 pr-8 border border-amber-200 rounded-full focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 text-sm" />
                <button
                  type="button"
                  onClick={() => setShowSearch(false)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-sm" />
                </button>
                
                {/* Résultats de recherche */}
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-amber-100 overflow-hidden z-50">
                    {searchResults.map((livre) => (
                      <button
                        key={livre.id}
                        onClick={() => handleResultClick(livre.id)}
                        className="w-full text-left px-4 py-2 hover:bg-amber-50 transition-colors flex items-center gap-3"
                      >
                        <div className="w-8 h-10 bg-amber-100 rounded flex items-center justify-center">
                          {livre.couverture_url ? (
                            <img src={livre.couverture_url} alt="" className="w-full h-full object-cover rounded" />
                          ) : (
                            <FaBook className="text-amber-400 text-sm" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-amber-800">{livre.titre}</p>
                          <p className="text-xs text-gray-500">{livre.auteur}</p>
                        </div>
                        <span className="text-xs text-amber-600">{livre.prix} FCFA</span>
                      </button>
                    ))}
                  </div>
                )}
              </form>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 rounded-full hover:bg-amber-100 transition-all duration-300"
              >
                <FaSearch className="text-xl text-amber-700" />
              </button>
            )}
          </div>

          {/* PANIER */}
          <Link to="/panier" className="relative group">
            <div className="p-2 rounded-full bg-amber-50 group-hover:bg-amber-100 transition-all duration-300">
              <FaShoppingCart className="text-xl text-amber-700 group-hover:text-amber-500 transition-colors" />
            </div>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* NOTIFICATIONS */}
          {isAuthenticated && (
            <Link to="/mes-notifications" className="relative group">
              <div className="p-2 rounded-full bg-amber-50 group-hover:bg-amber-100 transition-all duration-300">
                <FaBell className="text-xl text-amber-700 group-hover:text-amber-500 transition-colors" />
              </div>
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-lg animate-pulse">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Link>
          )}

          {/* USER ACTIONS */}
          {isAuthenticated ? (
            <div className="flex gap-3 items-center">
              <Link to="/dashboard/profil" className="group">
                <div className="p-2 rounded-full bg-amber-50 group-hover:bg-amber-100 transition-all duration-300">
                  <FaUser className="text-xl text-amber-700 group-hover:text-amber-500 transition-colors" />
                </div>
              </Link>
              <button onClick={handleLogout} className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1">
                <FaSignOutAlt className="mr-1" /> Déconnexion
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => navigate('/connexion')} className="relative overflow-hidden bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25 hover:scale-105">
                Connexion
              </button>
              <button onClick={() => navigate('/inscription')} className="relative overflow-hidden border-2 border-amber-600 text-amber-700 px-6 py-2 rounded-full font-medium transition-all duration-300 hover:bg-amber-600 hover:text-white hover:shadow-lg hover:shadow-amber-500/25">
                Inscription
              </button>
            </div>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button className="lg:hidden text-amber-700 text-2xl p-2 rounded-lg hover:bg-amber-50 transition-all duration-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-amber-100 py-4 px-4 shadow-lg">
          {/* Recherche mobile */}
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400" />
              <input
                type="text"
                placeholder="Rechercher un livre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-amber-200 rounded-full focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
              />
            </div>
          </form>
          
          <Link to="/" className="block py-3 text-amber-800 hover:text-amber-600 border-b border-amber-50" onClick={() => setMobileMenuOpen(false)}>Accueil</Link>
          
          {/* Boutique mobile */}
          <div className="py-2 border-b border-amber-50">
            <p className="text-amber-800 font-medium mb-2">Boutique</p>
            <div className="pl-4 space-y-2">
              {collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => {
                    scrollToCollection(collection.id);
                    setMobileMenuOpen(false);
                  }}
                  className="block text-amber-600 hover:text-amber-500 text-sm py-1"
                >
                  {collection.nom}
                </button>
              ))}
            </div>
          </div>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="block py-3 text-amber-800 hover:text-amber-600 border-b border-amber-50" onClick={() => setMobileMenuOpen(false)}>Mon espace</Link>
              <Link to="/dashboard/profil" className="block py-3 text-amber-800 hover:text-amber-600 border-b border-amber-50" onClick={() => setMobileMenuOpen(false)}>Mon profil</Link>
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block w-full text-left py-3 text-red-600 hover:text-red-700">Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/qui-sommes-nous" className="block py-3 text-amber-800 hover:text-amber-600 border-b border-amber-50" onClick={() => setMobileMenuOpen(false)}>Qui sommes-nous</Link>
              <div className="flex gap-3 mt-4">
                <button onClick={() => navigate('/connexion')} className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-full">Connexion</button>
                <button onClick={() => navigate('/inscription')} className="flex-1 border-2 border-amber-600 text-amber-700 px-4 py-2 rounded-full">Inscription</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* DÉCORATION OR */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50"></div>
    </nav>
  );
};

export default Header;