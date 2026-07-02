import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, LogOut, Menu, X, ChevronDown, BookOpen } from 'lucide-react';
import api from '../../../services/api';
import authService from '../../../services/authService';
import guestCart from '../../../services/guestCart';
import ClocheNotification from '../../notification/components/ClocheNotification';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [collections, setCollections] = useState([]);
  const [showBoutiqueMenu, setShowBoutiqueMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = () => setIsAuthenticated(!!localStorage.getItem('access_token'));
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  useEffect(() => {
    api.get('/collections/')
      .then(r => setCollections(r.data.collections || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      try {
        const r = await api.get('/livres/', { params: { page: 1, taille: 10 } });
        const livres = r.data.livres || [];
        setSearchResults(
          livres.filter(l =>
            l.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.auteur?.toLowerCase().includes(searchTerm.toLowerCase())
          ).slice(0, 5)
        );
      } catch {}
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCartCount = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const r = await api.get('/panier/');
        setCartItemCount(r.data.nombre_livres || 0);
      } catch {}
    } else {
      setCartItemCount(guestCart.getCount());
    }
  };

  useEffect(() => {
    fetchCartCount();
    const onCart = () => fetchCartCount();
    window.addEventListener('cartUpdated', onCart);
    return () => window.removeEventListener('cartUpdated', onCart);
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/recherche?q=${encodeURIComponent(searchTerm)}`);
      setShowSearch(false);
      setSearchResults([]);
      setSearchTerm('');
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white border-b border-cream-200 shadow-sm py-0' : 'bg-white py-0'
    }`}>
      {/* Bande supérieure dorée */}
      <div className="bg-brown-950 text-gold-300 text-center text-sm py-2 px-4 hidden md:block">
        <span>Groupe panafricain d'édition · Production intellectuelle, scientifique & culturelle</span>
      </div>

      <div className="container-editorial h-20 flex items-center justify-between gap-4">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
          <img
            src="/images/logo.png"
            alt="SAGESSE AFRICAINE"
            className="h-14 w-auto"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden items-center justify-center w-14 h-14 bg-brown-950 rounded-lg">
            <BookOpen className="text-gold-400 w-7 h-7" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-playfair text-xl font-bold text-brown-950 tracking-tight">
              SAGESSE AFRICAINE
            </span>
            <span className="text-xs text-terra-500 tracking-[0.15em] uppercase font-medium">
              Éditions
            </span>
          </div>
        </Link>

        {/* NAV DESKTOP */}
        <div className="hidden lg:flex items-center gap-1">
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="px-4 py-2 text-base font-medium text-brown-700 hover:text-brown-950 hover:bg-cream-100 rounded-lg transition-colors"
          >
            Accueil
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setShowBoutiqueMenu(true)}
            onMouseLeave={() => setShowBoutiqueMenu(false)}
          >
            <button className="flex items-center gap-1 px-4 py-2 text-base font-medium text-brown-700 hover:text-brown-950 hover:bg-cream-100 rounded-lg transition-colors">
              Boutique
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showBoutiqueMenu ? 'rotate-180' : ''}`} />
            </button>
            {showBoutiqueMenu && (
              <div className="absolute top-full left-0 mt-1 w-60 bg-white border border-cream-200 rounded-xl shadow-xl py-2 z-50">
                <Link
                  to="/livres"
                  className="flex items-center gap-2.5 px-4 py-3 text-base text-brown-700 hover:bg-cream-50 hover:text-brown-950 transition-colors"
                  onClick={() => setShowBoutiqueMenu(false)}
                >
                  <BookOpen className="w-5 h-5 text-terra-400" />
                  Tout le catalogue
                </Link>
                {collections.length > 0 && (
                  <div className="my-1 border-t border-cream-100" />
                )}
                {collections.map((c) => (
                  <Link
                    key={c.id}
                    to={`/livres?collection=${c.id}`}
                    className="block px-4 py-2.5 text-base text-brown-600 hover:bg-cream-50 hover:text-brown-950 transition-colors"
                    onClick={() => setShowBoutiqueMenu(false)}
                  >
                    {c.nom}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {!isAuthenticated && (
            <Link
              to="/qui-sommes-nous"
              className="px-4 py-2 text-base font-medium text-brown-700 hover:text-brown-950 hover:bg-cream-100 rounded-lg transition-colors"
            >
              Qui sommes-nous
            </Link>
          )}

          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="px-4 py-2 text-base font-medium text-brown-700 hover:text-brown-950 hover:bg-cream-100 rounded-lg transition-colors"
            >
              Mon espace
            </Link>
          )}

          <Link
            to="/contact"
            className="px-4 py-2 text-base font-medium text-brown-700 hover:text-brown-950 hover:bg-cream-100 rounded-lg transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* ACTIONS DROITE */}
        <div className="flex items-center gap-1">

          {/* RECHERCHE */}
          <div className="relative" ref={searchRef}>
            {showSearch ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  placeholder="Rechercher un livre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                  className="w-52 px-3 py-2 pl-9 border border-brown-200 rounded-lg text-sm focus:border-terra-400 focus:ring-2 focus:ring-terra-400/20 focus:outline-none"
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400" />
                <button
                  type="button"
                  onClick={() => { setShowSearch(false); setSearchTerm(''); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-cream-200 rounded-xl shadow-xl overflow-hidden z-50">
                    {searchResults.map((livre) => (
                      <button
                        key={livre.id}
                        onClick={() => {
                          navigate(`/livre/${livre.id}`);
                          setShowSearch(false);
                          setSearchTerm('');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-cream-50 transition-colors text-left"
                      >
                        <div className="w-8 h-10 bg-cream-200 rounded flex-shrink-0 overflow-hidden">
                          {livre.couverture_url ? (
                            <img src={livre.couverture_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="w-4 h-4 text-brown-400" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-brown-900 truncate">{livre.titre}</p>
                          <p className="text-xs text-brown-500">{livre.auteur}</p>
                        </div>
                        <span className="text-xs text-terra-600 font-medium flex-shrink-0 ml-auto">
                          {livre.est_gratuit ? 'Gratuit' : `${livre.prix?.toLocaleString()} F`}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </form>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 rounded-lg text-brown-600 hover:text-brown-900 hover:bg-cream-100 transition-colors hidden lg:flex"
                aria-label="Rechercher"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* PANIER */}
          <Link
            to="/panier"
            className="relative p-2 rounded-lg text-brown-600 hover:text-brown-900 hover:bg-cream-100 transition-colors"
            aria-label="Panier"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-terra-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </span>
            )}
          </Link>

          {/* NOTIFICATIONS */}
          {isAuthenticated && <ClocheNotification />}

          {/* AUTH */}
          {isAuthenticated ? (
            <div className="hidden lg:flex items-center gap-1 ml-1">
              <Link
                to="/dashboard/profil"
                className="p-2 rounded-lg text-brown-600 hover:text-brown-900 hover:bg-cream-100 transition-colors"
                aria-label="Mon profil"
              >
                <User className="w-6 h-6" />
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2 ml-2">
              <button
                onClick={() => navigate('/connexion')}
                className="px-5 py-2.5 text-base font-semibold text-brown-800 border border-brown-300 rounded-lg hover:bg-cream-100 transition-colors"
              >
                Connexion
              </button>
              <button
                onClick={() => navigate('/inscription')}
                className="btn-primary text-base"
              >
                S'inscrire
              </button>
            </div>
          )}

          {/* BURGER MOBILE */}
          <button
            className="lg:hidden p-2 rounded-lg text-brown-700 hover:bg-cream-100 transition-colors ml-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-cream-200 shadow-lg">
          <div className="container-editorial py-4 space-y-1">
            {/* Recherche mobile */}
            <form onSubmit={handleSearchSubmit} className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400" />
                <input
                  type="text"
                  placeholder="Rechercher un livre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-brown-200 rounded-lg text-sm focus:border-terra-400 focus:outline-none"
                />
              </div>
            </form>

            <Link to={isAuthenticated ? '/dashboard' : '/'} onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-brown-700 hover:bg-cream-100 text-base font-medium">
              Accueil
            </Link>
            <Link to="/livres" onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-brown-700 hover:bg-cream-100 text-base font-medium">
              <BookOpen className="w-5 h-5 text-terra-400" /> Catalogue
            </Link>
            {!isAuthenticated && (
              <Link to="/qui-sommes-nous" onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-lg text-brown-700 hover:bg-cream-100 text-base font-medium">
                Qui sommes-nous
              </Link>
            )}
            {isAuthenticated && (
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-lg text-brown-700 hover:bg-cream-100 text-base font-medium">
                Mon espace
              </Link>
            )}
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-3 rounded-lg text-brown-700 hover:bg-cream-100 text-base font-medium">
              Contact
            </Link>

            <div className="border-t border-cream-200 pt-3 mt-3">
              {isAuthenticated ? (
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 text-base font-medium w-full">
                  <LogOut className="w-5 h-5" /> Déconnexion
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => { navigate('/connexion'); setMobileMenuOpen(false); }}
                    className="flex-1 py-3 text-base font-semibold text-brown-800 border border-brown-300 rounded-lg hover:bg-cream-100 transition-colors">
                    Connexion
                  </button>
                  <button onClick={() => { navigate('/inscription'); setMobileMenuOpen(false); }}
                    className="flex-1 btn-primary text-base">
                    S'inscrire
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
