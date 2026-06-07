import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBook, FaUsers, FaShoppingCart, FaMoneyBillWave, FaDownload,
  FaUserCircle, FaSignOutAlt, FaEye, FaStar, FaCalendarAlt,
  FaChartLine, FaChartBar, FaChartPie, FaSpinner
} from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const StatistiquesPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    // Livres
    totalLivres: 0,
    livresGratuits: 0,
    livresPayants: 0,
    livresPublies: 0,
    // Utilisateurs
    totalUtilisateurs: 0,
    utilisateursActifs: 0,
    admins: 0,
    // Commandes
    totalCommandes: 0,
    commandesPayees: 0,
    commandesEnAttente: 0,
    commandesLivrees: 0,
    // Ventes
    chiffreAffaires: 0,
    panierMoyen: 0,
    // Avis
    totalAvis: 0,
    avisApprouves: 0,
    noteMoyenne: 0,
    // Téléchargements
    totalTelechargements: 0,
    // Activité récente
    nouvellesCommandes30j: 0,
    nouveauxUtilisateurs30j: 0
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    setLoading(true);
    try {
      // Récupérer tous les livres
      const livresResponse = await api.get('/livres/', { params: { page: 1, taille: 1000 } });
      const livres = livresResponse.data.livres || [];
      const livresGratuits = livres.filter(l => l.est_gratuit).length;
      const livresPayants = livres.filter(l => !l.est_gratuit).length;
      const livresPublies = livres.filter(l => l.est_publie).length;

      // Récupérer tous les utilisateurs
      const usersResponse = await api.get('/utilisateurs/', { params: { page: 1, taille: 1000 } });
      const utilisateurs = usersResponse.data.utilisateurs || [];
      const utilisateursActifs = utilisateurs.filter(u => u.est_actif).length;
      const admins = utilisateurs.filter(u => u.role === 'admin').length;

      // Récupérer toutes les commandes
      const commandesResponse = await api.get('/commandes/', { params: { page: 1, taille: 1000 } });
      const commandes = commandesResponse.data.commandes || [];
      const commandesPayees = commandes.filter(c => c.statut === 'payee' || c.statut === 'payé').length;
      const commandesEnAttente = commandes.filter(c => c.statut === 'en_attente').length;
      const commandesLivrees = commandes.filter(c => c.statut === 'livree').length;
      const chiffreAffaires = commandes.reduce((sum, c) => sum + (c.montant_total || 0), 0);
      const panierMoyen = commandes.length > 0 ? chiffreAffaires / commandes.length : 0;

      // Récupérer les avis
      const avisResponse = await api.get('/avis/', { params: { page: 1, taille: 1000 } });
      const avis = avisResponse.data.avis || [];
      const avisApprouves = avis.filter(a => a.est_approuve).length;
      const noteMoyenne = avisApprouves > 0 
        ? avis.filter(a => a.est_approuve).reduce((sum, a) => sum + a.note, 0) / avisApprouves 
        : 0;

      // Récupérer les téléchargements
      const telechargementsResponse = await api.get('/historique-telechargements/', { params: { page: 1, taille: 1000 } });
      const telechargements = telechargementsResponse.data.historique || [];

      // Commandes des 30 derniers jours
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const nouvellesCommandes = commandes.filter(c => new Date(c.cree_le) >= thirtyDaysAgo);
      const nouveauxUsers = utilisateurs.filter(u => new Date(u.cree_le) >= thirtyDaysAgo);

      // Top livres les plus vendus
      const bookSales = {};
      commandes.forEach(commande => {
        commande.lignes?.forEach(ligne => {
          const bookId = ligne.livre_id;
          if (!bookSales[bookId]) {
            bookSales[bookId] = { quantite: 0, titre: ligne.livre?.titre || 'Inconnu' };
          }
          bookSales[bookId].quantite += ligne.quantite;
        });
      });
      const topBooksList = Object.entries(bookSales)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.quantite - a.quantite)
        .slice(0, 5);

      // Activité récente
      const recentCommands = commandes.slice(0, 10).map(c => ({
        id: c.id,
        type: 'commande',
        date: c.cree_le,
        montant: c.montant_total,
        utilisateur: `${c.utilisateur?.prenom} ${c.utilisateur?.nom}`,
        statut: c.statut
      }));

      setStats({
        totalLivres: livres.length,
        livresGratuits,
        livresPayants,
        livresPublies,
        totalUtilisateurs: utilisateurs.length,
        utilisateursActifs,
        admins,
        totalCommandes: commandes.length,
        commandesPayees,
        commandesEnAttente,
        commandesLivrees,
        chiffreAffaires,
        panierMoyen,
        totalAvis: avis.length,
        avisApprouves,
        noteMoyenne: noteMoyenne.toFixed(1),
        totalTelechargements: telechargements.length,
        nouvellesCommandes30j: nouvellesCommandes.length,
        nouveauxUtilisateurs30j: nouveauxUsers.length
      });
      setTopBooks(topBooksList);
      setRecentActivity(recentCommands);

    } catch (error) {
      console.error('Erreur chargement statistiques:', error);
      toast.error('Erreur chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { path: '/admin', icon: FaBook, label: 'Tableau de bord', active: false },
    { path: '/admin/livres', icon: FaBook, label: 'Gestion des livres', active: false },
    { path: '/admin/utilisateurs', icon: FaUserCircle, label: 'Gestion utilisateurs', active: false },
    { path: '/admin/commandes', icon: FaShoppingCart, label: 'Gestion commandes', active: false },
    { path: '/admin/collections', icon: FaBook, label: 'Gestion collections', active: false },
    { path: '/admin/avis', icon: FaStar, label: 'Modération avis', active: false },
    { path: '/admin/statistiques', icon: FaChartLine, label: 'Statistiques', active: true },
  ];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/connexion';
  };

  const statCards = [
    { label: 'Livres', value: stats.totalLivres, icon: FaBook, color: 'from-amber-500 to-amber-600', sub: `${stats.livresPublies} publiés` },
    { label: 'Utilisateurs', value: stats.totalUtilisateurs, icon: FaUsers, color: 'from-blue-500 to-blue-600', sub: `${stats.utilisateursActifs} actifs` },
    { label: 'Commandes', value: stats.totalCommandes, icon: FaShoppingCart, color: 'from-green-500 to-green-600', sub: `${stats.commandesPayees} payées` },
    { label: 'CA total', value: `${stats.chiffreAffaires.toLocaleString()} €`, icon: FaMoneyBillWave, color: 'from-emerald-500 to-emerald-600', sub: `moyen: ${stats.panierMoyen.toFixed(2)} €` },
    { label: 'Avis', value: stats.totalAvis, icon: FaStar, color: 'from-yellow-500 to-yellow-600', sub: `${stats.avisApprouves} approuvés (${stats.noteMoyenne}/5)` },
    { label: 'Téléchargements', value: stats.totalTelechargements, icon: FaDownload, color: 'from-purple-500 to-purple-600', sub: `${stats.totalTelechargements} fichiers` },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-amber-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-600">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 fixed top-0 right-0 left-0 z-40">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-playfair font-bold text-amber-800">
              Statistiques globales
            </h1>
            <p className="text-amber-500 text-sm">
              Vue d'ensemble de la plateforme
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchAllStats}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-300 transition"
            >
              <FaSpinner className={loading ? 'animate-spin' : ''} />
              Actualiser
            </button>
            <Link to="/admin/profil">
              <FaUserCircle className="text-amber-600 text-3xl hover:text-amber-700 transition" />
            </Link>
          </div>
        </div>
      </header>

      {/* Menu latéral */}
      <aside className="w-64 bg-white/80 backdrop-blur-sm border-r border-amber-200 min-h-screen fixed left-0 top-0 pt-24">
        <div className="px-4 py-6">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  item.active
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
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition w-full"
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
            {statCards.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-4 border border-amber-100 hover:shadow-xl transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-amber-500 text-xs">{stat.label}</p>
                    <p className="text-xl font-bold text-amber-800 mt-1">{stat.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
                  </div>
                  <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.color} text-white`}>
                    <stat.icon className="text-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top livres */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaChartBar className="text-amber-600 text-xl" />
                <h2 className="text-xl font-playfair font-bold text-amber-800">
                  Top 5 des livres les plus vendus
                </h2>
              </div>
              {topBooks.length > 0 ? (
                <div className="space-y-3">
                  {topBooks.map((book, index) => (
                    <div key={book.id} className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                      <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-amber-800">{book.titre}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-amber-700">{book.quantite} vendus</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-amber-400 text-center py-8">Aucune vente enregistrée</p>
              )}
            </div>

            {/* Activité récente */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaCalendarAlt className="text-amber-600 text-xl" />
                <h2 className="text-xl font-playfair font-bold text-amber-800">
                  Activité récente
                </h2>
              </div>
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <FaShoppingCart className="text-green-600 text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-amber-800 text-sm">
                          Commande {activity.id?.slice(0, 8)}...
                        </p>
                        <p className="text-xs text-gray-500">{activity.utilisateur}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-amber-700">{activity.montant} €</p>
                        <p className="text-xs text-gray-400">
                          {new Date(activity.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-amber-400 text-center py-8">Aucune activité récente</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Répartition livres */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaChartPie className="text-amber-600 text-xl" />
                <h2 className="text-xl font-playfair font-bold text-amber-800">
                  Répartition des livres
                </h2>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Gratuits</span>
                    <span className="text-amber-700 font-semibold">{stats.livresGratuits}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(stats.livresGratuits / stats.totalLivres) * 100}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Payants</span>
                    <span className="text-amber-700 font-semibold">{stats.livresPayants}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(stats.livresPayants / stats.totalLivres) * 100}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Publiés</span>
                    <span className="text-amber-700 font-semibold">{stats.livresPublies}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(stats.livresPublies / stats.totalLivres) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Répartition commandes */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaChartPie className="text-amber-600 text-xl" />
                <h2 className="text-xl font-playfair font-bold text-amber-800">
                  Statut des commandes
                </h2>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Payées</span>
                    <span className="text-green-600 font-semibold">{stats.commandesPayees}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(stats.commandesPayees / stats.totalCommandes) * 100}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">En attente</span>
                    <span className="text-orange-600 font-semibold">{stats.commandesEnAttente}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(stats.commandesEnAttente / stats.totalCommandes) * 100}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Livrées</span>
                    <span className="text-blue-600 font-semibold">{stats.commandesLivrees}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(stats.commandesLivrees / stats.totalCommandes) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activité 30 jours */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaChartLine className="text-amber-600 text-xl" />
                <h2 className="text-xl font-playfair font-bold text-amber-800">
                  Activité (30 jours)
                </h2>
              </div>
              <div className="space-y-4">
                <div className="text-center p-4 bg-amber-50 rounded-xl">
                  <div className="text-3xl font-bold text-amber-700">{stats.nouvellesCommandes30j}</div>
                  <div className="text-sm text-gray-500">Nouvelles commandes</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-xl">
                  <div className="text-3xl font-bold text-amber-700">{stats.nouveauxUtilisateurs30j}</div>
                  <div className="text-sm text-gray-500">Nouveaux utilisateurs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StatistiquesPage;