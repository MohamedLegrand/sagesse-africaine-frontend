import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, BookOpen, Users, ShoppingBag, Library,
  Star, BarChart2, Eye, LogOut, Menu, X, ChevronRight
} from 'lucide-react';
import api from '../../../services/api';
import authService from '../../../services/authService';
import toast from 'react-hot-toast';

const navItems = [
  { path: '/admin',               key: 'tableauDeBord', icon: LayoutDashboard, exact: true },
  { path: '/admin/livres',        key: 'livres',         icon: BookOpen },
  { path: '/admin/utilisateurs',  key: 'utilisateurs',   icon: Users },
  { path: '/admin/commandes',     key: 'achats',         icon: ShoppingBag },
  { path: '/admin/collections',   key: 'collections',    icon: Library },
  { path: '/admin/avis',          key: 'avis',           icon: Star },
  { path: '/admin/statistiques',  key: 'statistiques',   icon: BarChart2 },
];

const AdminLayout = ({ children }) => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    api.get('/utilisateurs/me').then(r => setUser(r.data)).catch(() => {});
  }, []);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    await authService.logout();
    toast.success(t('layout.messages.deconnexionReussie'));
    navigate('/connexion');
  };

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path) && path !== '/admin';
  };

  const getInitials = () => {
    if (!user) return 'A';
    return `${user.prenom?.[0] || ''}${user.nom?.[0] || ''}`.toUpperCase();
  };

  const currentNav = navItems.find(n => {
    if (n.exact) return location.pathname === n.path;
    return location.pathname.startsWith(n.path) && n.path !== '/admin';
  }) || navItems[0];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Profil admin */}
      <div className="px-4 py-5 border-b border-cream-100">
        <div className="flex items-center gap-3">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-terra-200" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-brown-950 flex items-center justify-center ring-2 ring-brown-800">
              <span className="text-gold-400 font-bold text-sm">{getInitials()}</span>
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-brown-900 text-sm truncate">
              {user ? `${user.prenom} ${user.nom}` : '—'}
            </p>
            <span className="text-[10px] font-bold text-terra-500 uppercase tracking-wider">{t('layout.administrateur')}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const active = isActive(item.path, item.exact) || (item.exact && location.pathname === item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={active ? 'nav-item-active' : 'nav-item'}
            >
              <Icon style={{ width: '18px', height: '18px' }} className="flex-shrink-0" />
              <span className="flex-1">{t(`layout.nav.${item.key}`)}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Bas sidebar */}
      <div className="px-3 py-4 border-t border-cream-100 space-y-0.5">
        <Link to="/dashboard" className="nav-item">
          <Eye style={{ width: '18px', height: '18px' }} className="flex-shrink-0" />
          <span>{t('layout.voirLeSite')}</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut style={{ width: '18px', height: '18px' }} className="flex-shrink-0" />
          {t('layout.deconnexion')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-50">

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-cream-200 h-16">
        <div className="h-full px-4 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 rounded-lg text-brown-600 hover:bg-cream-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/admin" className="flex items-center gap-2.5">
              <img
                src="/images/logo.png"
                alt="SAGESSE AFRICAINE"
                className="h-10 w-auto"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="hidden sm:flex flex-col leading-none">
                <span className="font-playfair text-sm font-bold text-brown-950">SAGESSE AFRICAINE</span>
                <span className="text-[10px] text-terra-500 tracking-widest uppercase font-medium">{t('layout.administrateur')}</span>
              </div>
            </Link>
          </div>

          {/* Fil d'Ariane */}
          <div className="hidden md:flex items-center gap-1 text-xs text-brown-400">
            <Link to="/admin" className="hover:text-brown-700">{t('layout.admin')}</Link>
            {location.pathname !== '/admin' && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-brown-600 font-medium">{currentNav ? t(`layout.nav.${currentNav.key}`) : ''}</span>
              </>
            )}
          </div>

          {/* Actions droite */}
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-brown-600 hover:bg-cream-100 transition-colors"
            >
              <Eye className="w-4 h-4" />
              {t('layout.voirLeSite')}
            </Link>
            <Link to="/dashboard/profil" className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-cream-100 transition-colors">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-brown-950 flex items-center justify-center">
                  <span className="text-gold-400 font-bold text-xs">{getInitials()}</span>
                </div>
              )}
              <span className="hidden lg:block text-sm font-medium text-brown-700">{user?.prenom}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed top-16 bottom-0 z-40 bg-white border-r border-cream-200 w-60 overflow-hidden
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <button
          className="fixed top-3 left-56 z-50 p-1 bg-white rounded-full shadow-md lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-4 h-4 text-brown-700" />
        </button>
      )}

      {/* CONTENU PRINCIPAL */}
      <main className="lg:ml-60 pt-16 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
