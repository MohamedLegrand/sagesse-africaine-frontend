import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBook, FaLayerGroup, FaSearch, FaUserCircle, FaSignOutAlt,
  FaEdit, FaTrash, FaPlus, FaCheck, FaTimes, FaSpinner,
  FaArrowLeft
} from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const GestionCollectionsPage = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    collection_parent_id: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [parentCollections, setParentCollections] = useState([]);

  useEffect(() => {
    fetchCollections();
    fetchParentCollections();
  }, [page]);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const response = await api.get('/collections/', { params: { page, taille: 20 } });
      setCollections(response.data.collections || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error('Erreur chargement collections:', error);
      toast.error('Erreur chargement des collections');
    } finally {
      setLoading(false);
    }
  };

  const fetchParentCollections = async () => {
    try {
      const response = await api.get('/collections/', { params: { page: 1, taille: 100 } });
      setParentCollections(response.data.collections || []);
    } catch (error) {
      console.error('Erreur chargement collections parentes:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setEditingCollection(null);
    setFormData({
      nom: '',
      description: '',
      collection_parent_id: ''
    });
    setShowModal(true);
  };

  const openEditModal = (collection) => {
    setEditingCollection(collection);
    setFormData({
      nom: collection.nom || '',
      description: collection.description || '',
      collection_parent_id: collection.collection_parent_id || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCollection) {
        await api.put(`/collections/${editingCollection.id}`, {
          nom: formData.nom,
          description: formData.description,
          collection_parent_id: formData.collection_parent_id || null
        });
        toast.success('Collection modifiée avec succès');
      } else {
        await api.post('/collections/', {
          nom: formData.nom,
          description: formData.description,
          collection_parent_id: formData.collection_parent_id || null
        });
        toast.success('Collection créée avec succès');
      }
      setShowModal(false);
      fetchCollections();
      fetchParentCollections();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, nom) => {
    if (!window.confirm(`Supprimer la collection "${nom}" ?`)) return;
    try {
      await api.delete(`/collections/${id}`);
      toast.success('Collection supprimée');
      fetchCollections();
      fetchParentCollections();
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const filteredCollections = collections.filter(collection =>
    collection.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(total / 20);

  const menuItems = [
    { path: '/admin', icon: FaBook, label: 'Tableau de bord', active: false },
    { path: '/admin/livres', icon: FaBook, label: 'Gestion des livres', active: false },
    { path: '/admin/utilisateurs', icon: FaUserCircle, label: 'Gestion utilisateurs', active: false },
    { path: '/admin/commandes', icon: FaBook, label: 'Gestion commandes', active: false },
    { path: '/admin/collections', icon: FaLayerGroup, label: 'Gestion collections', active: true },
    { path: '/admin/avis', icon: FaBook, label: 'Modération avis', active: false },
  ];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/connexion';
  };

  const getParentName = (parentId) => {
    const parent = parentCollections.find(p => p.id === parentId);
    return parent ? parent.nom : 'Aucune';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 fixed top-0 right-0 left-0 z-40">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-playfair font-bold text-amber-800">
              Gestion des collections
            </h1>
            <p className="text-amber-500 text-sm">
              {total} collection(s) au total
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:shadow-lg transition"
            >
              <FaPlus />
              Nouvelle collection
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
                placeholder="Rechercher une collection..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
              />
            </div>
          </div>

          {/* Grille des collections */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCollections.map((collection) => (
                  <div key={collection.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 text-white">
                          <FaLayerGroup className="text-xl" />
                          <h3 className="font-playfair font-bold text-lg">{collection.nom}</h3>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(collection)}
                            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition text-white"
                            title="Modifier"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(collection.id, collection.nom)}
                            className="p-2 rounded-lg bg-white/20 hover:bg-red-500/50 transition text-white"
                            title="Supprimer"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-600 text-sm mb-3">
                        {collection.description || 'Aucune description'}
                      </p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">
                          Slug: {collection.slug || '-'}
                        </span>
                        <span className="text-amber-500">
                          Parent: {collection.collection_parent_id ? getParentName(collection.collection_parent_id) : 'Principale'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
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
                {editingCollection ? 'Modifier la collection' : 'Ajouter une collection'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-amber-700 text-sm mb-1">Nom *</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:border-amber-500 outline-none"
                  placeholder="Ex: Sciences Sociales"
                />
              </div>
              <div>
                <label className="block text-amber-700 text-sm mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:border-amber-500 outline-none"
                  placeholder="Description de la collection..."
                />
              </div>
              <div>
                <label className="block text-amber-700 text-sm mb-1">Collection parente</label>
                <select
                  name="collection_parent_id"
                  value={formData.collection_parent_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:border-amber-500 outline-none"
                >
                  <option value="">Aucune (collection principale)</option>
                  {parentCollections
                    .filter(c => !editingCollection || c.id !== editingCollection.id)
                    .map(col => (
                      <option key={col.id} value={col.id}>{col.nom}</option>
                    ))}
                </select>
              </div>
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
                  {editingCollection ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionCollectionsPage;