import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBook, FaUsers, FaSearch, FaUserCircle, FaSignOutAlt,
  FaEdit, FaTrash, FaCheck, FaTimes, FaSpinner, FaBan,
  FaUserCheck, FaUserTag, FaArrowLeft
} from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const GestionUtilisateursPage = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    mot_de_passe: '',
    role: 'utilisateur'
  });
  const [submitting, setSubmitting] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    fetchUtilisateurs();
  }, [page]);

  const fetchUtilisateurs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/utilisateurs/', { params: { page, taille: 20 } });
      setUtilisateurs(response.data.utilisateurs || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
      toast.error('Erreur chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      prenom: '',
      nom: '',
      email: '',
      mot_de_passe: '',
      role: 'utilisateur'
    });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      prenom: user.prenom || '',
      nom: user.nom || '',
      email: user.email || '',
      mot_de_passe: '',
      role: user.role || 'utilisateur'
    });
    setShowModal(true);
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingUser) {
        // Mise à jour du profil
        await api.put('/utilisateurs/me', {
          prenom: formData.prenom,
          nom: formData.nom
        });
        toast.success('Utilisateur modifié avec succès');
      } else {
        // Création d'un nouvel utilisateur
        await api.post('/utilisateurs/', {
          email: formData.email,
          mot_de_passe: formData.mot_de_passe,
          prenom: formData.prenom,
          nom: formData.nom
        });
        toast.success('Utilisateur créé avec succès');
      }
      setShowModal(false);
      fetchUtilisateurs();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangeRole = async () => {
    if (!selectedUser) return;
    setSubmitting(true);
    try {
      await api.patch(`/utilisateurs/${selectedUser.id}/role`, { role: newRole });
      toast.success(`Rôle changé en ${newRole === 'admin' ? 'Administrateur' : 'Utilisateur'}`);
      setShowRoleModal(false);
      fetchUtilisateurs();
    } catch (error) {
      console.error('Erreur changement rôle:', error);
      toast.error('Erreur lors du changement de rôle');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActivation = async (user) => {
    try {
      if (user.est_actif) {
        await api.patch(`/utilisateurs/${user.id}/desactiver`);
        toast.success('Utilisateur désactivé');
      } else {
        await api.patch(`/utilisateurs/${user.id}/activer`);
        toast.success('Utilisateur activé');
      }
      fetchUtilisateurs();
    } catch (error) {
      console.error('Erreur activation/désactivation:', error);
      toast.error('Erreur lors de l\'opération');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Supprimer l'utilisateur "${user.prenom} ${user.nom}" ?`)) return;
    try {
      await api.delete(`/utilisateurs/${user.id}`);
      toast.success('Utilisateur supprimé');
      fetchUtilisateurs();
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const filteredUtilisateurs = utilisateurs.filter(user =>
    user.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(total / 20);

  const menuItems = [
    { path: '/admin', icon: FaBook, label: 'Tableau de bord', active: false },
    { path: '/admin/livres', icon: FaBook, label: 'Gestion des livres', active: false },
    { path: '/admin/utilisateurs', icon: FaUsers, label: 'Gestion utilisateurs', active: true },
    { path: '/admin/commandes', icon: FaBook, label: 'Gestion commandes', active: false },
    { path: '/admin/collections', icon: FaBook, label: 'Gestion collections', active: false },
    { path: '/admin/avis', icon: FaBook, label: 'Modération avis', active: false },
  ];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/connexion';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 fixed top-0 right-0 left-0 z-40">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-playfair font-bold text-amber-800">
              Gestion des utilisateurs
            </h1>
            <p className="text-amber-500 text-sm">
              {total} utilisateur(s) au total
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:shadow-lg transition"
            >
              <FaUsers />
              Nouvel utilisateur
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
                placeholder="Rechercher un utilisateur (nom, prénom, email)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
              />
            </div>
          </div>

          {/* Tableau des utilisateurs */}
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
                      <th className="text-left p-4 text-amber-700">Avatar</th>
                      <th className="text-left p-4 text-amber-700">Nom complet</th>
                      <th className="text-left p-4 text-amber-700">Email</th>
                      <th className="text-left p-4 text-amber-700">Rôle</th>
                      <th className="text-left p-4 text-amber-700">Statut</th>
                      <th className="text-left p-4 text-amber-700">Date inscription</th>
                      <th className="text-center p-4 text-amber-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUtilisateurs.map((user) => (
                      <tr key={user.id} className="border-b border-amber-100 hover:bg-amber-50 transition">
                        <td className="p-4">
                          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                            {user.avatar_url ? (
                              <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <FaUserCircle className="text-amber-400 text-2xl" />
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-amber-800">{user.prenom} {user.nom}</p>
                        </td>
                        <td className="p-4 text-gray-600">{user.email}</td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            user.est_actif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {user.est_actif ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600 text-sm">
                          {new Date(user.cree_le).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => openRoleModal(user)}
                              className="p-2 rounded-lg hover:bg-amber-100 transition"
                              title="Changer rôle"
                            >
                              <FaUserTag className="text-purple-600" />
                            </button>
                            <button
                              onClick={() => handleToggleActivation(user)}
                              className="p-2 rounded-lg hover:bg-amber-100 transition"
                              title={user.est_actif ? 'Désactiver' : 'Activer'}
                            >
                              {user.est_actif ? (
                                <FaBan className="text-orange-600" />
                              ) : (
                                <FaUserCheck className="text-green-600" />
                              )}
                            </button>
                            <button
                              onClick={() => openEditModal(user)}
                              className="p-2 rounded-lg hover:bg-amber-100 transition"
                              title="Modifier"
                            >
                              <FaEdit className="text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(user)}
                              className="p-2 rounded-lg hover:bg-amber-100 transition"
                              title="Supprimer"
                            >
                              <FaTrash className="text-red-600" />
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

      {/* Modal Ajout/Modification */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-amber-200">
              <h2 className="text-2xl font-playfair font-bold text-amber-800">
                {editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-amber-700 text-sm mb-1">Prénom *</label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-amber-700 text-sm mb-1">Nom *</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:border-amber-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-amber-700 text-sm mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={!!editingUser}
                  className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:border-amber-500 outline-none disabled:bg-gray-100"
                />
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-amber-700 text-sm mb-1">Mot de passe *</label>
                  <input
                    type="password"
                    name="mot_de_passe"
                    value={formData.mot_de_passe}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:border-amber-500 outline-none"
                  />
                </div>
              )}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-amber-200 rounded-lg text-amber-700 hover:bg-amber-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:shadow-lg transition flex items-center gap-2"
                >
                  {submitting ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                  {editingUser ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Changement de rôle */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-amber-200">
              <h2 className="text-2xl font-playfair font-bold text-amber-800">
                Changer le rôle
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {selectedUser.prenom} {selectedUser.nom}
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-amber-700 text-sm mb-1">Rôle</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:border-amber-500 outline-none"
                >
                  <option value="utilisateur">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="px-4 py-2 border border-amber-200 rounded-lg text-amber-700 hover:bg-amber-50 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={handleChangeRole}
                  disabled={submitting}
                  className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:shadow-lg transition flex items-center gap-2"
                >
                  {submitting ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionUtilisateursPage;