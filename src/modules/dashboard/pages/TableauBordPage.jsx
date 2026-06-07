import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBook, 
  FaShoppingCart, 
  FaDownload, 
  FaEye, 
  FaArrowRight,
  FaUserCircle,
  FaHistory,
  FaHeart,
  FaCog,
  FaSignOutAlt,
  FaBell
} from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import { useNotificationContext } from '../../notification/contextes/NotificationContext';

const TableauBordPage = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    livresAchetes: 0,
    commandes: 0,
    telechargements: 0,
    favoris: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Utiliser le contexte des notifications
  const { notifications, nonLues, marquerCommeLu, fetchNotifications } = useNotificationContext();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Récupérer le profil utilisateur
        const userResponse = await api.get('/utilisateurs/me');
        setUser(userResponse.data);

        // Récupérer les accès (livres achetés)
        const accesResponse = await api.get('/acces-livres/mes-acces');
        const livresAchetes = accesResponse.data.acces || [];
        setStats(prev => ({ ...prev, livresAchetes: livresAchetes.length }));

        // Récupérer les commandes
        const commandesResponse = await api.get('/commandes/mes-commandes');
        const commandes = commandesResponse.data.commandes || [];
        setStats(prev => ({ ...prev, commandes: commandes.length }));
        setRecentOrders(commandes.slice(0, 5));

        // Récupérer l'historique des téléchargements
        const telechargementsResponse = await api.get('/historique-telechargements/mes-telechargements');
        const telechargements = telechargementsResponse.data.historique || [];
        setStats(prev => ({ ...prev, telechargements: telechargements.length }));

        setRecentBooks(livresAchetes.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error('Erreur chargement dashboard:', error);
        toast.error('Erreur chargement des données');
        setLoading(false);
      }
    };

    fetchDashboardData();
    fetchNotifications();
  }, [fetchNotifications]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    toast.success('Déconnexion réussie');
    window.location.href = '/connexion';
  };

  const handleMarkAsRead = async (notificationId) => {
    await marquerCommeLu(notificationId);
    toast.success('Notification marquée comme lue');
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'commande': <FaShoppingCart className="text-green-600" />,
      'livre': <FaBook className="text-blue-600" />,
      'default': <FaBell className="text-amber-600" />
    };
    return icons[type] || icons.default;
  };

  const statsCards = [
    { 
      label: 'Livres achetés', 
      value: stats.livresAchetes, 
      icon: FaBook, 
      bg: 'from-amber-500 to-amber-600',
      path: '/dashboard/bibliotheque'
    },
    { 
      label: 'Commandes', 
      value: stats.commandes, 
      icon: FaShoppingCart, 
      bg: 'from-amber-600 to-amber-700',
      path: '/dashboard/historique'
    },
    { 
      label: 'Téléchargements', 
      value: stats.telechargements, 
      icon: FaDownload, 
      bg: 'from-amber-500 to-amber-600',
      path: '/dashboard/historique'
    },
    { 
      label: 'Favoris', 
      value: stats.favoris, 
      icon: FaHeart, 
      bg: 'from-rose-500 to-rose-600',
      path: '/dashboard/favoris'
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-amber-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-600">Chargement de votre espace...</p>
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
              Tableau de bord
            </h1>
            <p className="text-amber-500 text-sm">
              Bienvenue, {user?.prenom} {user?.nom}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Notifications dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-amber-100 transition"
              >
                <FaBell className="text-amber-600 text-xl" />
                {nonLues > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {nonLues > 9 ? '9+' : nonLues}
                  </span>
                )}
              </button>
              
              {/* Dropdown notifications */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-amber-100 z-50 overflow-hidden">
                  <div className="p-4 border-b border-amber-100 flex justify-between items-center">
                    <h3 className="font-semibold text-amber-800">Notifications</h3>
                    <Link to="/mes-notifications" className="text-xs text-amber-600 hover:text-amber-700">
                      Voir tout
                    </Link>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        Aucune notification
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notif) => (
                        <div 
                          key={notif.id} 
                          className={`p-3 border-b border-amber-50 hover:bg-amber-50 transition cursor-pointer ${!notif.est_lu ? 'bg-amber-50' : ''}`}
                          onClick={() => handleMarkAsRead(notif.id)}
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                                {getNotificationIcon(notif.type)}
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-amber-800">{notif.titre}</p>
                              <p className="text-xs text-gray-500">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notif.cree_le).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            {!notif.est_lu && (
                              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 5 && (
                    <div className="p-2 text-center border-t border-amber-100">
                      <Link to="/mes-notifications" className="text-sm text-amber-600 hover:text-amber-700">
                        Voir toutes les notifications
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Profil */}
            <Link to="/dashboard/profil">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-amber-400" />
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
          {/* Profil utilisateur dans menu */}
          <div className="text-center mb-6 pb-4 border-b border-amber-200">
            <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-2">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <FaUserCircle className="text-amber-500 text-4xl" />
              )}
            </div>
            <p className="font-semibold text-amber-800">{user?.prenom} {user?.nom}</p>
            <p className="text-xs text-amber-500">{user?.email}</p>
          </div>

          <nav className="space-y-1">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg">
              <FaBook className="text-lg" />
              <span className="font-medium">Tableau de bord</span>
            </Link>
            <Link to="/dashboard/boutique" className="flex items-center gap-3 px-4 py-3 rounded-xl text-amber-700 hover:bg-amber-100 transition-all duration-300">
              <FaShoppingCart className="text-lg" />
              <span className="font-medium">Boutique</span>
            </Link>
            <Link to="/dashboard/panier" className="flex items-center gap-3 px-4 py-3 rounded-xl text-amber-700 hover:bg-amber-100 transition-all duration-300">
              <FaShoppingCart className="text-lg" />
              <span className="font-medium">Mon panier</span>
            </Link>
            <Link to="/dashboard/bibliotheque" className="flex items-center gap-3 px-4 py-3 rounded-xl text-amber-700 hover:bg-amber-100 transition-all duration-300">
              <FaBook className="text-lg" />
              <span className="font-medium">Ma bibliothèque</span>
            </Link>
            <Link to="/dashboard/historique" className="flex items-center gap-3 px-4 py-3 rounded-xl text-amber-700 hover:bg-amber-100 transition-all duration-300">
              <FaHistory className="text-lg" />
              <span className="font-medium">Historique</span>
            </Link>
            <Link to="/dashboard/favoris" className="flex items-center gap-3 px-4 py-3 rounded-xl text-amber-700 hover:bg-amber-100 transition-all duration-300">
              <FaHeart className="text-lg" />
              <span className="font-medium">Mes favoris</span>
            </Link>
            <Link to="/dashboard/profil" className="flex items-center gap-3 px-4 py-3 rounded-xl text-amber-700 hover:bg-amber-100 transition-all duration-300">
              <FaUserCircle className="text-lg" />
              <span className="font-medium">Mon profil</span>
            </Link>
            <Link to="/dashboard/parametres" className="flex items-center gap-3 px-4 py-3 rounded-xl text-amber-700 hover:bg-amber-100 transition-all duration-300">
              <FaCog className="text-lg" />
              <span className="font-medium">Paramètres</span>
            </Link>
            <Link to="/mes-notifications" className="flex items-center gap-3 px-4 py-3 rounded-xl text-amber-700 hover:bg-amber-100 transition-all duration-300 relative">
              <FaBell className="text-lg" />
              <span className="font-medium">Notifications</span>
              {nonLues > 0 && (
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {nonLues}
                </span>
              )}
            </Link>
          </nav>

          <div className="border-t border-amber-200 my-4"></div>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, index) => (
              <Link
                key={index}
                to={stat.path}
                className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-amber-500 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-amber-800 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.bg} text-white group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="text-xl" />
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
                <Link to="/dashboard/historique" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
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
                          order.statut === 'payé' || order.statut === 'livré' || order.statut === 'completed'
                            ? 'bg-green-100 text-green-700' 
                            : order.statut === 'annulé' || order.statut === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {order.statut === 'payé' ? 'Payée' : 
                           order.statut === 'livré' ? 'Livrée' :
                           order.statut === 'completed' ? 'Complétée' :
                           order.statut === 'annulé' ? 'Annulée' :
                           order.statut === 'cancelled' ? 'Annulée' : 'En cours'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaShoppingCart className="text-amber-300 text-4xl mx-auto mb-2" />
                  <p className="text-amber-400">Aucune commande pour le moment</p>
                  <Link to="/dashboard/boutique" className="text-amber-600 text-sm mt-2 inline-block">
                    Commencer mes achats →
                  </Link>
                </div>
              )}
            </div>

            {/* Livres récents */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-playfair font-bold text-amber-800">
                  Mes derniers livres
                </h2>
                <Link to="/dashboard/bibliotheque" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                  Voir tout →
                </Link>
              </div>
              {recentBooks.length > 0 ? (
                <div className="space-y-3">
                  {recentBooks.map((access, index) => {
                    const book = access.livre;
                    return (
                      <div key={index} className="flex items-center gap-4 p-3 bg-amber-50 rounded-xl hover:bg-amber-100 transition">
                        <div className="w-12 h-16 bg-amber-200 rounded-lg flex items-center justify-center overflow-hidden">
                          {book?.couverture_url ? (
                            <img src={book.couverture_url} alt={book.titre} className="w-full h-full object-cover" />
                          ) : (
                            <FaBook className="text-amber-500 text-2xl" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-amber-800 text-sm line-clamp-1">{book?.titre || 'Titre inconnu'}</p>
                          <p className="text-xs text-amber-500">{book?.auteur || 'Auteur inconnu'}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Ajouté le {new Date(access.accorde_le).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <Link 
                          to={`/dashboard/livre/${access.livre_id}`} 
                          className="bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-amber-700 transition"
                        >
                          Lire
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaBook className="text-amber-300 text-4xl mx-auto mb-2" />
                  <p className="text-amber-400">Aucun livre acheté pour le moment</p>
                  <Link to="/dashboard/boutique" className="text-amber-600 text-sm mt-2 inline-block">
                    Découvrir la boutique →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TableauBordPage;