import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaHome, FaStore, FaBook, FaShoppingCart, FaHistory,
  FaUserCircle, FaCog, FaBell, FaSignOutAlt
} from 'react-icons/fa';
import api from '../../../services/api';
import authService from '../../../services/authService';
import toast from 'react-hot-toast';

const navItems = [
  { path: '/dashboard',              label: 'Accueil',         icon: FaHome,         exact: true },
  { path: '/dashboard/boutique',     label: 'Boutique',        icon: FaStore },
  { path: '/dashboard/bibliotheque', label: 'Ma bibliothèque', icon: FaBook },
  { path: '/dashboard/panier',       label: 'Mon panier',      icon: FaShoppingCart, showBadge: true },
  { path: '/dashboard/historique',   label: 'Historique',      icon: FaHistory },
  { path: '/dashboard/profil',       label: 'Mon profil',      icon: FaUserCircle },
  { path: '/dashboard/parametres',   label: 'Paramètres',      icon: FaCog },
];

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [notifCount, setNotifCount] = useState(0);

  const fetchCounts = async () => {
    try {
      const [panierRes, notifRes] = await Promise.all([
        api.get('/panier/'),
        api.get('/notifications/'),
      ]);
      setCartCount(panierRes.data.nombre_livres || 0);
      const nonLues = (notifRes.data.notifications || []).filter(n => !n.est_lu).length;
      setNotifCount(nonLues);
    } catch {}
  };

  useEffect(() => {
    const init = async () => {
      try {
        const userRes = await api.get('/utilisateurs/me');
        setUser(userRes.data);
      } catch {}
      fetchCounts();
    };
    init();

    window.addEventListener('cartUpdated', fetchCounts);
    window.addEventListener('notificationUpdated', fetchCounts);
    return () => {
      window.removeEventListener('cartUpdated', fetchCounts);
      window.removeEventListener('notificationUpdated', fetchCounts);
    };
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    toast.success('Déconnexion réussie');
    navigate('/connexion');
  };

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">

      {/* ── HEADER FIXE ── */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-amber-200 fixed top-0 right-0 left-0 z-40 h-16">
        <div className="h-full px-6 flex justify-between items-center">

          {/* Logo → Accueil dashboard */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <img src="/images/logo.png" alt="SAGESSE AFRICAINE" className="h-9 w-auto" />
            <div className="flex flex-col leading-tight">
              <span className="font-playfair text-base font-bold text-amber-800">SAGESSE AFRICAINE</span>
              <span className="text-[9px] text-amber-500 tracking-wider uppercase">Mon espace</span>
            </div>
          </Link>

          {/* Actions droite */}
          <div className="flex items-center gap-2">

            {/* Panier */}
            <Link to="/dashboard/panier" className="relative p-2 rounded-full hover:bg-amber-100 transition group">
              <FaShoppingCart className="text-xl text-amber-700 group-hover:text-amber-500 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Notifications */}
            <Link to="/mes-notifications" className="relative p-2 rounded-full hover:bg-amber-100 transition group">
              <FaBell className="text-xl text-amber-700 group-hover:text-amber-500 transition" />
              {notifCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold animate-pulse">
                  {notifCount > 9 ? '9+' : notifCount}
                </span>
              )}
            </Link>

            {/* Avatar + Nom */}
            <Link to="/dashboard/profil" className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-amber-50 transition group">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-amber-200 group-hover:border-amber-500 transition" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-amber-200 flex items-center justify-center group-hover:border-amber-500 transition">
                  <FaUserCircle className="text-amber-500 text-lg" />
                </div>
              )}
              {user && (
                <span className="text-amber-700 font-medium text-sm hidden lg:block">
                  {user.prenom} {user.nom}
                </span>
              )}
            </Link>

            {/* Déconnexion */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-red-600 hover:text-red-700 text-sm font-medium transition px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              <FaSignOutAlt />
              <span className="hidden md:block">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── SIDEBAR ── */}
      <aside className="w-64 bg-white/80 backdrop-blur-sm border-r border-amber-200 fixed left-0 top-16 bottom-0 overflow-y-auto z-30">
        <div className="px-4 py-6">

          {/* Mini-profil */}
          {user && (
            <div className="text-center mb-5 pb-4 border-b border-amber-100">
              <div className="w-14 h-14 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-2 overflow-hidden">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <FaUserCircle className="text-amber-500 text-3xl" />
                )}
              </div>
              <p className="font-semibold text-amber-800 text-sm truncate">{user.prenom} {user.nom}</p>
              <p className="text-xs text-amber-500 truncate">{user.email}</p>
            </div>
          )}

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.path, item.exact);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg'
                      : 'text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  <item.icon className="text-lg flex-shrink-0" />
                  <span className="font-medium flex-1">{item.label}</span>
                  {item.showBadge && cartCount > 0 && (
                    <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${active ? 'bg-white/30 text-white' : 'bg-amber-600 text-white'}`}>
                      {cartCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-amber-200 mt-4 pt-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all w-full"
            >
              <FaSignOutAlt className="text-lg" />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── CONTENU PRINCIPAL ── */}
      <main className="ml-64 pt-16 min-h-screen p-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
