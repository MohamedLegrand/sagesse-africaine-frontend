import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import api from '../../../services/api';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
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
    
    // Écouter les changements de localStorage
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Fonction pour récupérer le panier
  const fetchCartCount = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const response = await api.get('/panier/');
        const count = response.data.nombre_livres || 0;
        setCartItemCount(count);
      } catch (error) {
        console.error('Erreur chargement panier:', error);
      }
    } else {
      setCartItemCount(0);
    }
  };

  // Récupérer le panier au chargement et après chaque ajout
  useEffect(() => {
    fetchCartCount();
    
    // Écouter l'événement personnalisé pour mettre à jour le panier
    const handleCartUpdate = () => {
      fetchCartCount();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const menuItems = [
    { nom: 'Accueil', path: '/' },
    { nom: 'Livres', path: '/livres' },
    { nom: 'Qui sommes-nous', path: '/qui-sommes-nous' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    setIsAuthenticated(false);
    setCartItemCount(0);
    navigate('/');
  };

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' 
          : 'bg-white py-5'}
      `}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img
              src="/images/logo.png"
              alt="SAGESSE AFRICAINE"
              className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 to-amber-600/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-playfair text-xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
              SAGESSE AFRICAINE
            </span>
            <span className="text-[10px] text-amber-500 tracking-wider">ÉDITIONS</span>
          </div>
        </Link>

        {/* MENU DESKTOP */}
        <div className="hidden lg:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="relative text-amber-800 hover:text-amber-600 font-medium transition-colors duration-300 group"
            >
              {item.nom}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* ACTIONS DESKTOP */}
        <div className="hidden lg:flex items-center gap-6">

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

          {/* USER ACTIONS */}
          {isAuthenticated ? (
            <div className="flex gap-3 items-center">
              <Link to="/dashboard/profil" className="group">
                <div className="p-2 rounded-full bg-amber-50 group-hover:bg-amber-100 transition-all duration-300">
                  <FaUser className="text-xl text-amber-700 group-hover:text-amber-500 transition-colors" />
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/connexion')}
                className="relative overflow-hidden bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25 hover:scale-105"
              >
                <span className="relative z-10">Connexion</span>
              </button>
              <button
                onClick={() => navigate('/inscription')}
                className="relative overflow-hidden border-2 border-amber-600 text-amber-700 px-6 py-2 rounded-full font-medium transition-all duration-300 hover:bg-amber-600 hover:text-white hover:shadow-lg hover:shadow-amber-500/25"
              >
                Inscription
              </button>
            </div>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="lg:hidden text-amber-700 text-2xl p-2 rounded-lg hover:bg-amber-50 transition-all duration-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-amber-100 py-4 px-4 shadow-lg">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block py-3 text-amber-800 hover:text-amber-600 border-b border-amber-50 hover:border-amber-200 transition-all duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.nom}
            </Link>
          ))}

          {!isAuthenticated ? (
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => navigate('/connexion')}
                className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300"
              >
                Connexion
              </button>
              <button
                onClick={() => navigate('/inscription')}
                className="flex-1 border-2 border-amber-600 text-amber-700 px-4 py-2 rounded-full font-medium hover:bg-amber-600 hover:text-white transition-all duration-300"
              >
                Inscription
              </button>
            </div>
          ) : (
            <div className="mt-6">
              <Link
                to="/dashboard/profil"
                className="block py-3 text-amber-800 hover:text-amber-600 border-b border-amber-50 hover:border-amber-200 transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mon profil
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-3 text-red-600 hover:text-red-700 transition-all duration-300"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      )}

      {/* DÉCORATION OR */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50"></div>
    </nav>
  );
};

export default Header;