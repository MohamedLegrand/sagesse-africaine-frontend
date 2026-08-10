import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BookOpen, Users, ShoppingBag, TrendingUp, Eye, Star,
  Plus, ArrowRight, BarChart2, Clock, CheckCircle
} from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';

const DashboardAdminPage = () => {
  const { t } = useTranslation('admin');
  const [stats, setStats] = useState({
    totalLivres: 0, totalUtilisateurs: 0, totalCommandes: 0,
    totalVentes: 0, livresPublies: 0, avisEnAttente: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [livresRes, usersRes, commandesRes, avisRes] = await Promise.all([
          api.get('/livres/', { params: { page: 1, taille: 100 } }),
          api.get('/utilisateurs/', { params: { page: 1, taille: 100 } }),
          api.get('/commandes/', { params: { page: 1, taille: 100 } }),
          api.get('/avis/', { params: { page: 1, taille: 100 } }),
        ]);
        const livres = livresRes.data.livres || [];
        const commandes = commandesRes.data.commandes || [];
        const avis = avisRes.data.avis || [];
        setStats({
          totalLivres: livresRes.data.total || 0,
          livresPublies: livres.filter(l => l.est_publie).length,
          totalUtilisateurs: usersRes.data.total || 0,
          totalCommandes: commandesRes.data.total || 0,
          totalVentes: commandes.reduce((s, c) => s + (c.montant_total || 0), 0),
          avisEnAttente: avis.filter(a => !a.est_approuve).length,
        });
        setRecentOrders(commandes.slice(0, 5));
        setRecentUsers((usersRes.data.utilisateurs || []).slice(0, 5));
      } catch {
        toast.error(t('dashboard.messages.erreurChargementDonnees'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t]);

  const statCards = [
    { label: t('dashboard.cartes.totalLivres'),       value: stats.totalLivres,                          icon: BookOpen,   color: 'bg-terra-50 text-terra-600',  border: 'border-terra-100',  path: '/admin/livres' },
    { label: t('dashboard.cartes.livresPublies'),     value: stats.livresPublies,                        icon: Eye,        color: 'bg-brown-50 text-brown-700',  border: 'border-brown-100',  path: '/admin/livres' },
    { label: t('dashboard.cartes.utilisateurs'),       value: stats.totalUtilisateurs,                    icon: Users,      color: 'bg-blue-50 text-blue-600',    border: 'border-blue-100',   path: '/admin/utilisateurs' },
    { label: t('dashboard.cartes.achats'),             value: stats.totalCommandes,                       icon: ShoppingBag,color: 'bg-green-50 text-green-600',  border: 'border-green-100',  path: '/admin/commandes' },
    { label: t('dashboard.cartes.chiffreAffaires'),value: `${stats.totalVentes.toLocaleString('fr-FR')} XAF`,  icon: TrendingUp, color: 'bg-gold-50 text-gold-600',    border: 'border-gold-100',   path: '/admin/statistiques' },
    { label: t('dashboard.cartes.avisEnAttente'),    value: stats.avisEnAttente,                        icon: Star,       color: 'bg-red-50 text-red-600',      border: 'border-red-100',    path: '/admin/avis' },
  ];

  const getStatusStyle = (statut) => {
    const map = {
      'payee':      'bg-green-100 text-green-700',
      'payé':       'bg-green-100 text-green-700',
      'livree':     'bg-blue-100 text-blue-700',
      'annulee':    'bg-red-100 text-red-700',
      'en_attente': 'bg-gold-100 text-gold-700',
      'en_cours':   'bg-purple-100 text-purple-700',
    };
    return map[statut] || 'bg-cream-100 text-brown-600';
  };

  const getStatusLabel = (statut) => {
    const map = {
      'payee': t('dashboard.statuts.payee'), 'payé': t('dashboard.statuts.payee'), 'livree': t('dashboard.statuts.livree'),
      'annulee': t('dashboard.statuts.annulee'), 'en_attente': t('dashboard.statuts.enAttente'), 'en_cours': t('dashboard.statuts.enCours'),
    };
    return map[statut] || statut;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-12 h-12 border-4 border-terra-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-brown-500 font-medium">{t('dashboard.chargement')}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* En-tête */}
      <div className="mb-8">
        <span className="section-eyebrow">{t('dashboard.eyebrow')}</span>
        <h1 className="section-title mt-2">{t('dashboard.titre')}</h1>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, border, path }) => (
          <Link
            key={label}
            to={path}
            className={`bg-white rounded-xl border ${border} p-4 hover:shadow-md transition-all duration-200 group`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center`}>
                <Icon className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-brown-300 group-hover:text-terra-500 transition-colors" />
            </div>
            <p className="text-2xl font-bold text-brown-950 font-playfair">{value}</p>
            <p className="text-xs text-brown-400 mt-0.5 font-medium">{label}</p>
          </Link>
        ))}
      </div>

      {/* Grilles principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Dernières commandes */}
        <div className="bg-white rounded-xl border border-cream-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-terra-500" />
              <h2 className="font-playfair font-bold text-brown-950 text-lg">{t('dashboard.derniersAchats')}</h2>
            </div>
            <Link to="/admin/commandes" className="text-xs font-semibold text-terra-500 hover:text-terra-700 flex items-center gap-1">
              {t('dashboard.voirTout')} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentOrders.length > 0 ? (
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-cream-50 rounded-lg hover:bg-cream-100 transition-colors">
                  <div>
                    <p className="font-medium text-brown-900 text-sm font-mono">{order.id?.slice(0, 8)}…</p>
                    <p className="text-xs text-brown-400">{new Date(order.cree_le).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brown-800 text-sm">{order.montant_total?.toLocaleString('fr-FR')} XAF</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusStyle(order.statut)}`}>
                      {getStatusLabel(order.statut)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-brown-300">
              <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">{t('dashboard.aucunAchat')}</p>
            </div>
          )}
        </div>

        {/* Derniers inscrits */}
        <div className="bg-white rounded-xl border border-cream-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-terra-500" />
              <h2 className="font-playfair font-bold text-brown-950 text-lg">{t('dashboard.derniersInscrits')}</h2>
            </div>
            <Link to="/admin/utilisateurs" className="text-xs font-semibold text-terra-500 hover:text-terra-700 flex items-center gap-1">
              {t('dashboard.voirTout')} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentUsers.length > 0 ? (
            <div className="space-y-2">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-3 bg-cream-50 rounded-lg hover:bg-cream-100 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-terra-100 flex items-center justify-center flex-shrink-0">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-terra-700 font-bold text-sm">
                        {`${user.prenom?.[0] || ''}${user.nom?.[0] || ''}`.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-brown-900 text-sm truncate">{user.prenom} {user.nom}</p>
                    <p className="text-xs text-brown-400 truncate">{user.email}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                    user.role === 'admin' ? 'bg-brown-100 text-brown-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {user.role === 'admin' ? t('dashboard.admin') : t('dashboard.membre')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-brown-300">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">{t('dashboard.aucunUtilisateur')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-xl border border-cream-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <BarChart2 className="w-4 h-4 text-terra-500" />
          <h2 className="font-playfair font-bold text-brown-950 text-lg">{t('dashboard.actionsRapides')}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/admin/livres"
            className="flex items-center gap-3 p-4 bg-terra-50 border border-terra-100 rounded-xl hover:bg-terra-100 transition-colors group"
          >
            <div className="w-10 h-10 bg-terra-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-brown-900 text-sm">{t('dashboard.ajouterLivre.titre')}</p>
              <p className="text-xs text-brown-400">{t('dashboard.ajouterLivre.desc')}</p>
            </div>
          </Link>
          <Link
            to="/admin/utilisateurs"
            className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors group"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-brown-900 text-sm">{t('dashboard.gererMembres.titre')}</p>
              <p className="text-xs text-brown-400">{t('dashboard.gererMembres.desc')}</p>
            </div>
          </Link>
          <Link
            to="/admin/avis"
            className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors group"
          >
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-brown-900 text-sm">{t('dashboard.modererAvis.titre')}</p>
              <p className="text-xs text-brown-400">{t('dashboard.modererAvis.desc', { count: stats.avisEnAttente })}</p>
            </div>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardAdminPage;
