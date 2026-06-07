import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBook, FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash,
  FaSearch, FaArrowLeft, FaUserCircle, FaSignOutAlt, FaCog,
  FaCheck, FaTimes, FaSpinner
} from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const GestionLivresPage = () => {
  const [livres, setLivres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingLivre, setEditingLivre] = useState(null);
  const [formData, setFormData] = useState({
    titre: '',
    auteur: '',
    description: '',
    prix: 0,
    est_gratuit: false,
    langue: 'francais',
    isbn: '',
    couverture_url: '',
    collection_id: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    fetchLivres();
    fetchCollections();
  }, [page]);

  const fetchLivres = async () => {
    setLoading(true);
    try {
      const response = await api.get('/livres/', { params: { page, taille: 20 } });
      setLivres(response.data.livres || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error('Erreur chargement livres:', error);
      toast.error('Erreur chargement des livres');
    } finally {
      setLoading(false);
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await api.get('/collections/', { params: { page: 1, taille: 100 } });
      setCollections(response.data.collections || []);
    } catch (error) {
      console.error('Erreur chargement collections:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openCreateModal = () => {
    setEditingLivre(null);
    setFormData({
      titre: '',
      auteur: '',
      description: '',
      prix: 0,
      est_gratuit: false,
      langue: 'francais',
      isbn: '',
      couverture_url: '',
      collection_id: ''
    });
    setShowModal(true);
  };

  const openEditModal = (livre) => {
    setEditingLivre(livre);
    setFormData({
      titre: livre.titre || '',
      auteur: livre.auteur || '',
      description: livre.description || '',
      prix: livre.prix || 0,
      est_gratuit: livre.est_gratuit || false,
      langue: livre.langue || 'francais',
      isbn: livre.isbn || '',
      couverture_url: livre.couverture_url || '',
      collection_id: livre.collection_id || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingLivre) {
        await api.put(`/livres/${editingLivre.id}`, formData);
        toast.success('Livre modifié avec succès');
      } else {
        await api.post('/livres/', formData);
        toast.success('Livre créé avec succès');
      }
      setShowModal(false);
      fetchLivres();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, titre) => {
    if (!window.confirm(`Supprimer le livre "${titre}" ?`)) return;
    try {
      await api.delete(`/livres/${id}`);
      toast.success('Livre supprimé');
      fetchLivres();
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handlePublish = async (id, estPublie) => {
    try {
      if (estPublie) {
        await api.patch(`/livres/${id}/depublier`);
        toast.success('Livre dépublié');
      } else {
        await api.patch(`/livres/${id}/publier`);
        toast.success('Livre publié');
      }
      fetchLivres();
    } catch (error) {
      console.error('Erreur publication:', error);
      toast.error('Erreur lors de la publication');
    }
  };

  const filteredLivres = livres.filter(livre =>
    livre.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    livre.auteur?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(total / 20);

  const menuItems = [
    { path: '/admin', icon: FaBook, label: 'Tableau de bord', active: false },
    { path: '/admin/livres', icon: FaBook, label: 'Gestion des livres', active: true },
    { path: '/admin/utilisateurs', icon: FaUserCircle, label: 'Gestion utilisateurs', active: false },
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
              Gestion des livres
            </h1>
            <p className="text-amber-500 text-sm">
              {total} livre(s) au total
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:shadow-lg transition"
            >
              <FaPlus />
              Nouveau livre
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
                placeholder="Rechercher un livre (titre, auteur)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
              />
            </div>
          </div>

          {/* Tableau des livres */}
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
                      <th className="text-left p-4 text-amber-700">Couverture</th>
                      <th className="text-left p-4 text-amber-700">Titre / Auteur</th>
                      <th className="text-left p-4 text-amber-700">Prix</th>
                      <th className="text-left p-4 text-amber-700">Statut</th>
                      <th className="text-left p-4 text-amber-700">Date</th>
                      <th className="text-center p-4 text-amber-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLivres.map((livre) => (
                      <tr key={livre.id} className="border-b border-amber-100 hover:bg-amber-50 transition">
                        <td className="p-4">
                          <div className="w-12 h-16 bg-amber-100 rounded-lg flex items-center justify-center">
                            {livre.couverture_url ? (
                              <img src={livre.couverture_url} alt="" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <FaBook className="text-amber-400 text-2xl" />
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-amber-800">{livre.titre}</p>
                          <p className="text-sm text-amber-500">{livre.auteur}</p>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-amber-700">
                            {livre.est_gratuit ? 'Gratuit' : `${livre.prix} €`}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            livre.est_publie ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {livre.est_publie ? 'Publié' : 'Brouillon'}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600 text-sm">
                          {new Date(livre.cree_le).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handlePublish(livre.id, livre.est_publie)}
                              className="p-2 rounded-lg hover:bg-amber-100 transition"
                              title={livre.est_publie ? 'Dépublier' : 'Publier'}
                            >
                              {livre.est_publie ? (
                                <FaEyeSlash className="text-gray-500" />
                              ) : (
                                <FaEye className="text-green-600" />
                              )}
                            </button>
                            <button
                              onClick={() => openEditModal(livre)}
                              className="p-2 rounded-lg hover:bg-amber-100 transition"
                              title="Modifier"
                            >
                              <FaEdit className="text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(livre.id, livre.titre)}
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
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-amber-200">
              <h2 className="text-2xl font-playfair font-bold text-amber-800">
                {editingLivre ? 'Modifier le livre' : 'Ajouter un livre'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-amber-700 text-sm mb-1">Titre *</label>
                  <input
                    type="text"
                    name="titre"
                    value={formData.titre}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-amber-700 text-sm mb-1">Auteur *</label>
                  <input
                    type="text"
                    name="auteur"
                    value={formData.auteur}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:border-amber-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-amber-700 text-sm mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:border-amber-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-amber-700 text-sm mb-1">Prix (€)</label>
                  <input
                    type="number"
                    name="prix"
                    value={formData.prix}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-amber-700 text-sm mb-1">Langue</label>
                  <select
                    name="langue"
                    value={formData.langue}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:border-amber-500 outline-none"
                  >
                    <option value="francais">Français</option>
                    <option value="anglais">Anglais</option>
                    <option value="espagnol">Espagnol</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-amber-700 text-sm mb-1">ISBN</label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-amber-700 text-sm mb-1">Collection</label>
                  <select
                    name="collection_id"
                    value={formData.collection_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:border-amber-500 outline-none"
                  >
                    <option value="">Sélectionner une collection</option>
                    {collections.map(col => (
                      <option key={col.id} value={col.id}>{col.nom}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-amber-700 text-sm mb-1">URL de couverture</label>
                <input
                  type="text"
                  name="couverture_url"
                  value={formData.couverture_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:border-amber-500 outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="est_gratuit"
                  checked={formData.est_gratuit}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-amber-600"
                />
                <label className="text-amber-700">Livre gratuit</label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-amber-200">
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
                  {editingLivre ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionLivresPage;