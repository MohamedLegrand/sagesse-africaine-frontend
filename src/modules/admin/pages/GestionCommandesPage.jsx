import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBook, FaShoppingCart, FaSearch, FaUserCircle, FaSignOutAlt,
  FaEye, FaCheck, FaTimes, FaSpinner, FaSync, 
  FaTruck, FaMoneyBillWave, FaPrint
} from 'react-icons/fa';
import api from '../../../services/api';
import authService from '../../../services/authService';
import toast from 'react-hot-toast';

const GestionCommandesPage = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCommandes();
  }, [page]);

  const fetchCommandes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/commandes/', { params: { page, taille: 20 } });
      setCommandes(response.data.commandes || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
      toast.error('Erreur chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = (commande) => {
    setSelectedCommande(commande);
    setShowDetailModal(true);
  };

  const handleUpdateStatus = async (commandeId, newStatus) => {
    setUpdating(true);
    try {
      await api.patch(`/commandes/${commandeId}/statut`, { statut: newStatus });
      toast.success(`Statut mis à jour : ${getStatusLabel(newStatus)}`);
      fetchCommandes();
      if (selectedCommande && selectedCommande.id === commandeId) {
        setSelectedCommande(prev => ({ ...prev, statut: newStatus }));
      }
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusLabel = (statut) => {
    const statusMap = {
      'en_attente': 'En attente',
      'payee': 'Payée',
      'livree': 'Livrée',
      'annulee': 'Annulée',
      'en_cours': 'En cours'
    };
    return statusMap[statut] || statut;
  };

  const getStatusColor = (statut) => {
    const colorMap = {
      'en_attente': 'bg-amber-100 text-amber-700',
      'payee': 'bg-green-100 text-green-700',
      'livree': 'bg-blue-100 text-blue-700',
      'annulee': 'bg-red-100 text-red-700',
      'en_cours': 'bg-purple-100 text-purple-700'
    };
    return colorMap[statut] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (statut) => {
    const iconMap = {
      'en_attente': <FaSync className="text-amber-600" />,
      'payee': <FaMoneyBillWave className="text-green-600" />,
      'livree': <FaTruck className="text-blue-600" />,
      'annulee': <FaTimes className="text-red-600" />,
      'en_cours': <FaSpinner className="text-purple-600 animate-spin" />
    };
    return iconMap[statut] || <FaSync />;
  };

  const availableStatuses = [
    { value: 'en_attente', label: 'En attente' },
    { value: 'payee', label: 'Payée' },
    { value: 'livree', label: 'Livrée' },
    { value: 'annulee', label: 'Annulée' },
    { value: 'en_cours', label: 'En cours' }
  ];

  const filteredCommandes = commandes.filter(commande =>
    commande.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commande.utilisateur?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commande.utilisateur?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commande.utilisateur?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(total / 20);

  const menuItems = [
    { path: '/admin', icon: FaBook, label: 'Tableau de bord', active: false },
    { path: '/admin/livres', icon: FaBook, label: 'Gestion des livres', active: false },
    { path: '/admin/utilisateurs', icon: FaUserCircle, label: 'Gestion utilisateurs', active: false },
    { path: '/admin/commandes', icon: FaShoppingCart, label: 'Gestion commandes', active: true },
    { path: '/admin/collections', icon: FaBook, label: 'Gestion collections', active: false },
    { path: '/admin/avis', icon: FaBook, label: 'Modération avis', active: false },
  ];

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = '/connexion';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 fixed top-0 right-0 left-0 z-40">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-playfair font-bold text-amber-800">
              Gestion des commandes
            </h1>
            <p className="text-amber-500 text-sm">
              {total} commande(s) au total
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchCommandes}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-300 transition"
            >
              <FaSync className={loading ? 'animate-spin' : ''} />
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
          {/* Barre de recherche */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400" />
              <input
                type="text"
                placeholder="Rechercher une commande (ID, client, email)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
              />
            </div>
          </div>

          {/* Tableau des commandes */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-amber-50 border-b border-amber-200">
                    <tr>
                      <th className="text-left p-4 text-amber-700">ID Commande</th>
                      <th className="text-left p-4 text-amber-700">Client</th>
                      <th className="text-left p-4 text-amber-700">Email</th>
                      <th className="text-left p-4 text-amber-700">Montant</th>
                      <th className="text-left p-4 text-amber-700">Statut</th>
                      <th className="text-left p-4 text-amber-700">Date</th>
                      <th className="text-center p-4 text-amber-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCommandes.map((commande) => (
                      <tr key={commande.id} className="border-b border-amber-100 hover:bg-amber-50 transition">
                        <td className="p-4">
                          <p className="font-mono font-semibold text-amber-800 text-sm">
                            {commande.id?.slice(0, 8)}...
                          </p>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-amber-800">
                            {commande.utilisateur?.prenom} {commande.utilisateur?.nom}
                          </p>
                        </td>
                        <td className="p-4 text-gray-600 text-sm">
                          {commande.utilisateur?.email}
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-amber-700">
                            {commande.montant_total} €
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit ${getStatusColor(commande.statut)}`}>
                            {getStatusIcon(commande.statut)}
                            {getStatusLabel(commande.statut)}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600 text-sm">
                          {new Date(commande.cree_le).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => openDetailModal(commande)}
                              className="p-2 rounded-lg hover:bg-amber-100 transition"
                              title="Voir détails"
                            >
                              <FaEye className="text-blue-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-amber-200 rounded-xl text-amber-600 disabled:opacity-50 hover:bg-amber-50 transition"
                  >
                    Précédent
                  </button>
                  <span className="px-4 py-2 bg-amber-600 text-white rounded-xl">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-amber-200 rounded-xl text-amber-600 disabled:opacity-50 hover:bg-amber-50 transition"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modal Détails commande */}
      {showDetailModal && selectedCommande && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-amber-200 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-playfair font-bold text-amber-800">
                  Détails de la commande
                </h2>
                <p className="text-sm text-gray-500 font-mono mt-1">
                  ID: {selectedCommande.id}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Informations client */}
              <div className="bg-amber-50 rounded-xl p-4">
                <h3 className="font-semibold text-amber-800 mb-3">Informations client</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nom complet</p>
                    <p className="font-medium text-amber-800">
                      {selectedCommande.utilisateur?.prenom} {selectedCommande.utilisateur?.nom}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-amber-800">{selectedCommande.utilisateur?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date de commande</p>
                    <p className="font-medium text-amber-800">
                      {new Date(selectedCommande.cree_le).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Statut actuel</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getStatusColor(selectedCommande.statut)}`}>
                        {getStatusIcon(selectedCommande.statut)}
                        {getStatusLabel(selectedCommande.statut)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Changement de statut */}
              <div className="border border-amber-200 rounded-xl p-4">
                <h3 className="font-semibold text-amber-800 mb-3">Changer le statut</h3>
                <div className="flex flex-wrap gap-2">
                  {availableStatuses.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => handleUpdateStatus(selectedCommande.id, status.value)}
                      disabled={updating || selectedCommande.statut === status.value}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                        selectedCommande.statut === status.value
                          ? 'bg-amber-600 text-white cursor-default'
                          : 'bg-gray-100 text-gray-700 hover:bg-amber-100'
                      } disabled:opacity-50`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Articles commandés */}
              <div>
                <h3 className="font-semibold text-amber-800 mb-3">Articles commandés</h3>
                <div className="space-y-2">
                  {selectedCommande.lignes?.map((ligne) => (
                    <div key={ligne.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 bg-amber-100 rounded-lg flex items-center justify-center">
                          {ligne.livre?.couverture_url ? (
                            <img src={ligne.livre.couverture_url} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <FaBook className="text-amber-400 text-2xl" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-amber-800">{ligne.livre?.titre}</p>
                          <p className="text-sm text-gray-500">{ligne.livre?.auteur}</p>
                          <p className="text-xs text-gray-400">Quantité: {ligne.quantite}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-amber-700">{ligne.prix_unitaire} €</p>
                        <p className="text-sm text-gray-500">/ unité</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Résumé */}
              <div className="border-t border-amber-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-amber-800">Total</span>
                  <span className="text-2xl font-bold text-amber-700">
                    {selectedCommande.montant_total} €
                  </span>
                </div>
              </div>

              {/* Boutons actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 border border-amber-200 rounded-lg text-amber-700 hover:bg-amber-50 transition flex items-center gap-2"
                >
                  <FaPrint />
                  Imprimer
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionCommandesPage;