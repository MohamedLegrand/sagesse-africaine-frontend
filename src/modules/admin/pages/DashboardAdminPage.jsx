import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBook, FaUsers, FaShoppingCart, FaEye, FaStar, 
  FaArrowRight, FaUserCircle, FaSignOutAlt, FaCog,
  FaMoneyBillWave, FaDownload, FaHeart
} from 'react-icons/fa';
import api from '../../../services/api';
import authService from '../../../services/authService';
import toast from 'react-hot-toast';

const DashboardAdminPage = () => {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({
    totalLivres: 0,
    totalUtilisateurs: 0,
    totalCommandes: 0,
    totalVentes: 0,
    livresPublies: 0,
    avisEnAttente: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Récupérer le profil admin
        const userResponse = await api.get('/utilisateurs/me');
        setAdmin(userResponse.data);

        // Récupérer tous les livres
        const livresResponse = await api.get('/livres/', { params: { page: 1, taille: 100 } });
        const livres = livresResponse.data.livres || [];
        setStats(prev => ({ 
          ...prev, 
          totalLivres: livresResponse.data.total || 0,
          livresPublies: livres.filter(l => l.est_publie).length 
        }));

        // Récupérer tous les utilisateurs
        const usersResponse = await api.get('/utilisateurs/', { params: { page: 1, taille: 100 } });
        setStats(prev => ({ ...prev, totalUtilisateurs: usersResponse.data.total || 0 }));
        setRecentUsers((usersResponse.data.utilisateurs || []).slice(0, 5));

        // Récupérer toutes les commandes
        const commandesResponse = await api.get('/commandes/', { params: { page: 1, taille: 100 } });
        const commandes = commandesResponse.data.commandes || [];
        setStats(prev => ({ 
          ...prev, 
          totalCommandes: commandesResponse.data.total || 0,
          totalVentes: commandes.reduce((sum, c) => sum + (c.montant_total || 0), 0)
        }));
        setRecentOrders(commandes.slice(0, 5));

        // Récupérer les avis en attente
        const avisResponse = await api.get('/avis/', { params: { page: 1, taille: 100 } });
        const avisEnAttente = (avisResponse.data.avis || []).filter(a => !a.est_approuve).length;
        setStats(prev => ({ ...prev, avisEnAttente }));

        setLoading(false);
      } catch (error) {
        console.error('Erreur chargement dashboard admin:', error);
        toast.error('Erreur chargement des données');
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    toast.success('Déconnexion réussie');
    window.location.href = '/connexion';
  };

  const statsCards = [
    { 
      label: 'Total livres', 
      value: stats.totalLivres, 
      icon: FaBook, 
      bg: 'from-amber-500 to-amber-600',
      path: '/admin/livres'
    },
    { 
      label: 'Utilisateurs', 
      value: stats.totalUtilisateurs, 
      icon: FaUsers, 
      bg: 'from-blue-500 to-blue-600',
      path: '/admin/utilisateurs'
    },
    { 
      label: 'Commandes', 
      value: stats.totalCommandes, 
      icon: FaShoppingCart, 
      bg: 'from-green-500 to-green-600',
      path: '/admin/commandes'
    },
    { 
      label: 'Chiffre d\'affaires', 
      value: `${stats.totalVentes} €`, 
      icon: FaMoneyBillWave, 
      bg: 'from-emerald-500 to-emerald-600',
      path: '/admin/statistiques'
    },
    { 
      label: 'Livres publiés', 
      value: stats.livresPublies, 
      icon: FaEye, 
      bg: 'from-purple-500 to-purple-600',
      path: '/admin/livres'
    },
    { 
      label: 'Avis en attente', 
      value: stats.avisEnAttente, 
      icon: FaStar, 
      bg: 'from-rose-500 to-rose-600',
      path: '/admin/avis'
    },
  ];

  const menuItems = [
    { path: '/admin', icon: FaBook, label: 'Tableau de bord', active: true },
    { path: '/admin/livres', icon: FaBook, label: 'Gestion des livres', active: false },
    { path: '/admin/utilisateurs', icon: FaUsers, label: 'Gestion utilisateurs', active: false },
    { path: '/admin/commandes', icon: FaShoppingCart, label: 'Gestion commandes', active: false },
    { path: '/admin/collections', icon: FaBook, label: 'Gestion collections', active: false },
    { path: '/admin/avis', icon: FaStar, label: 'Modération avis', active: false },
    { path: '/admin/statistiques', icon: FaDownload, label: 'Statistiques', active: false },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-amber-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-600">Chargement de l'espace administrateur...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      {/* Header fixe */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 fixed top-0 right-0 left-0 z-40">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-playfair font-bold text-amber-800">
              Administration
            </h1>
            <p className="text-amber-500 text-sm">
              Bienvenue, {admin?.prenom} {admin?.nom}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/admin/parametres">
              <FaCog className="text-amber-600 text-xl hover:text-amber-700 transition" />
            </Link>
            <Link to="/admin/profil">
              {admin?.avatar_url ? (
                <img src={admin.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-amber-400" />
              ) : (
                <FaUserCircle className="text-amber-600 text-3xl hover:text-amber-700 transition" />
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Menu latéral */}
      <aside className="w-64 bg-white/80 backdrop-blur-sm border-r border-amber-200 min-h-screen fixed left-0 top-0 pt-24">
        <div className="px-4 py-6">
          {/* Profil admin dans menu */}
          <div className="text-center mb-6 pb-4 border-b border-amber-200">
            <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-2">
              {admin?.avatar_url ? (
                <img src={admin.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <FaUserCircle className="text-amber-500 text-4xl" />
              )}
            </div>
            <p className="font-semibold text-amber-800">{admin?.prenom} {admin?.nom}</p>
            <p className="text-xs text-amber-500">{admin?.email}</p>
            <span className="inline-block mt-2 text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full">
              Administrateur
            </span>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  item.path === '/admin'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg'
                    : 'text-amber-700 hover:bg-amber-100'
                }`}
              >
                <item.icon className="text-lg" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="border-t border-amber-200 my-4"></div>

          {/* Lien vers le front office */}
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-blue-600 hover:bg-blue-50 transition-all duration-300 w-full mb-2"
          >
            <FaEye className="text-lg" />
            <span className="font-medium">Voir le site</span>
          </Link>

          {/* Déconnexion */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300 w-full"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="ml-64 pt-24 p-6">
        <div className="container mx-auto">
          {/* Cartes statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {statsCards.map((stat, index) => (
              <Link
                key={index}
                to={stat.path}
                className="bg-white rounded-2xl shadow-lg p-4 border border-amber-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-amber-500 text-xs">{stat.label}</p>
                    <p className="text-xl font-bold text-amber-800 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.bg} text-white group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="text-sm" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dernières commandes */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-playfair font-bold text-amber-800">
                  Dernières commandes
                </h2>
                <Link to="/admin/commandes" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                  Voir tout →
                </Link>
              </div>
              {recentOrders.length > 0 ? (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex justify-between items-center p-3 bg-amber-50 rounded-xl hover:bg-amber-100 transition">
                      <div>
                        <p className="font-semibold text-amber-800 text-sm">{order.id?.slice(0, 8)}...</p>
                        <p className="text-xs text-amber-500">
                          {new Date(order.cree_le).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-amber-700">{order.montant_total} €</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.statut === 'payé' || order.statut === 'livré'
                            ? 'bg-green-100 text-green-700' 
                            : order.statut === 'annulé'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {order.statut || 'En cours'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-amber-400 text-center py-8">Aucune commande</p>
              )}
            </div>

            {/* Derniers utilisateurs */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-playfair font-bold text-amber-800">
                  Derniers inscrits
                </h2>
                <Link to="/admin/utilisateurs" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                  Voir tout →
                </Link>
              </div>
              {recentUsers.length > 0 ? (
                <div className="space-y-3">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl hover:bg-amber-100 transition">
                      <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <FaUserCircle className="text-amber-500 text-2xl" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-amber-800 text-sm">{user.prenom} {user.nom}</p>
                        <p className="text-xs text-amber-500">{user.email}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-amber-400 text-center py-8">Aucun utilisateur</p>
              )}
            </div>
          </div>

          {/* Actions rapides */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/admin/livres" className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 rounded-xl text-center hover:shadow-lg transition">
              <FaBook className="text-2xl mx-auto mb-2" />
              <p className="font-semibold">Ajouter un livre</p>
              <p className="text-xs opacity-80">Nouvelle publication</p>
            </Link>
            <Link to="/admin/utilisateurs" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl text-center hover:shadow-lg transition">
              <FaUsers className="text-2xl mx-auto mb-2" />
              <p className="font-semibold">Gérer les utilisateurs</p>
              <p className="text-xs opacity-80">Modifier les rôles</p>
            </Link>
            <Link to="/admin/avis" className="bg-gradient-to-r from-rose-600 to-rose-700 text-white p-4 rounded-xl text-center hover:shadow-lg transition">
              <FaStar className="text-2xl mx-auto mb-2" />
              <p className="font-semibold">Modérer les avis</p>
              <p className="text-xs opacity-80">{stats.avisEnAttente} avis en attente</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardAdminPage;