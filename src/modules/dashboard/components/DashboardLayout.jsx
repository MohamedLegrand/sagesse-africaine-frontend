import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Store, Library, ShoppingBag, Clock,
  UserCircle, Settings, Bell, LogOut, Menu, X, ChevronRight, BookOpen
} from 'lucide-react';
import api from '../../../services/api';
import authService from '../../../services/authService';
import toast from 'react-hot-toast';

const navItems = [
  { path: '/dashboard',              label: 'Accueil',          icon: LayoutDashboard, exact: true },
  { path: '/dashboard/boutique',     label: 'Boutique',         icon: Store },
  { path: '/dashboard/bibliotheque', label: 'Ma bibliothèque',  icon: Library },
  { path: '/dashboard/panier',       label: 'Mon panier',       icon: ShoppingBag, badge: 'cart' },
  { path: '/dashboard/historique',   label: 'Historique',       icon: Clock },
  { path: '/dashboard/profil',       label: 'Mon profil',       icon: UserCircle },
  { path: '/dashboard/parametres',   label: 'Paramètres',       icon: Settings },
];

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [notifCount, setNotifCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchCounts = async () => {
    try {
      const [panierRes, notifRes] = await Promise.all([
        api.get('/panier/'),
        api.get('/notifications/'),
      ]);
      setCartCount(panierRes.data.nombre_livres || 0);
      setNotifCount((notifRes.data.notifications || []).filter(n => !n.est_lu).length);
    } catch {}
  };

  useEffect(() => {
    const init = async () => {
      try {
        const r = await api.get('/utilisateurs/me');
        setUser(r.data);
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

  // Ferme la sidebar mobile au changement de route
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    await authService.logout();
    toast.success('Déconnexion réussie');
    navigate('/connexion');
  };

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path) && path !== '/dashboard';
  };

  const getUserInitials = () => {
    if (!user) return '?';
    return `${user.prenom?.[0] || ''}${user.nom?.[0] || ''}`.toUpperCase();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Profil */}
      <div className="px-4 py-5 border-b border-cream-100">
        <div className="flex items-center gap-3">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-terra-200" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-terra-100 flex items-center justify-center ring-2 ring-terra-200">
              <span className="text-terra-700 font-bold text-sm">{getUserInitials()}</span>
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-brown-900 text-sm truncate">
              {user ? `${user.prenom} ${user.nom}` : '—'}
            </p>
            <p className="text-xs text-brown-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 scrollbar-thin">
        {navItems.map((item) => {
          const active = isActive(item.path, item.exact) || (item.exact && location.pathname === item.path);
          const Icon = item.icon;
          const badgeCount = item.badge === 'cart' ? cartCount : 0;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={active ? 'nav-item-active' : 'nav-item'}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" style={{ width: '18px', height: '18px' }} />
              <span className="flex-1">{item.label}</span>
              {badgeCount > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  active ? 'bg-white/30 text-white' : 'bg-terra-500 text-white'
                }`}>
                  {badgeCount > 9 ? '9+' : badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Déconnexion */}
      <div className="px-3 py-4 border-t border-cream-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut style={{ width: '18px', height: '18px' }} className="flex-shrink-0" />
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-50">

      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-cream-200 h-16">
        <div className="h-full px-4 flex items-center justify-between gap-4">

          {/* Logo + burger mobile */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 rounded-lg text-brown-600 hover:bg-cream-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <img
                src="/images/logo.png"
                alt="SAGESSE AFRICAINE"
                className="h-11 w-auto"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="hidden sm:flex flex-col leading-none">
                <span className="font-playfair text-base font-bold text-brown-950">SAGESSE AFRICAINE</span>
                <span className="text-[11px] text-terra-500 tracking-widest uppercase">Mon espace</span>
              </div>
            </Link>
          </div>

          {/* Fil d'Ariane — page active */}
          <div className="hidden md:flex items-center gap-1 text-xs text-brown-400">
            <Link to="/dashboard" className="hover:text-brown-700">Tableau de bord</Link>
            {location.pathname !== '/dashboard' && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-brown-600 font-medium capitalize">
                  {navItems.find(n => n.path !== '/dashboard' && location.pathname.startsWith(n.path))?.label || ''}
                </span>
              </>
            )}
          </div>

          {/* Actions droite */}
          <div className="flex items-center gap-1">
            <Link
              to="/dashboard/panier"
              className="relative p-2 rounded-lg text-brown-600 hover:bg-cream-100 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-terra-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            <Link
              to="/mes-notifications"
              className="relative p-2 rounded-lg text-brown-600 hover:bg-cream-100 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notifCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {notifCount > 9 ? '9+' : notifCount}
                </span>
              )}
            </Link>

            <Link to="/dashboard/profil" className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-cream-100 transition-colors">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-terra-100 flex items-center justify-center">
                  <span className="text-terra-700 font-bold text-xs">{getUserInitials()}</span>
                </div>
              )}
              <span className="hidden lg:block text-sm font-medium text-brown-700">
                {user?.prenom}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── OVERLAY MOBILE ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR DESKTOP + DRAWER MOBILE ── */}
      <aside className={`
        fixed top-16 bottom-0 z-40 bg-white border-r border-cream-200 w-60 overflow-hidden
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <SidebarContent />
      </aside>

      {/* Bouton fermeture mobile */}
      {sidebarOpen && (
        <button
          className="fixed top-3 left-56 z-50 p-1 bg-white rounded-full shadow-md lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-4 h-4 text-brown-700" />
        </button>
      )}

      {/* ── CONTENU PRINCIPAL ── */}
      <main className="lg:ml-60 pt-16 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* ── BOTTOM NAV MOBILE ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-cream-200 z-30 safe-area-pb">
        <div className="grid grid-cols-5 h-16">
          {navItems.slice(0, 5).map((item) => {
            const active = isActive(item.path, item.exact) || (item.exact && location.pathname === item.path);
            const Icon = item.icon;
            const badgeCount = item.badge === 'cart' ? cartCount : 0;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-0.5 relative transition-colors ${
                  active ? 'text-terra-500' : 'text-brown-400 hover:text-brown-700'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {badgeCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-terra-500 text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">
                      {badgeCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium leading-none">
                  {item.label.split(' ')[0]}
                </span>
                {active && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-terra-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default DashboardLayout;
