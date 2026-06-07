import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBook, FaStar, FaSearch, FaUserCircle, FaSignOutAlt,
  FaCheck, FaTimes, FaSpinner, FaTrash, FaEye,
  FaFilter, FaCalendarAlt
} from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const GestionAvisPage = () => {
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('all'); // all, pending, approved
  const [updating, setUpdating] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAvis, setSelectedAvis] = useState(null);

  useEffect(() => {
    fetchAvis();
  }, [page, filter]);

  const fetchAvis = async () => {
    setLoading(true);
    try {
      const response = await api.get('/avis/', { params: { page, taille: 20 } });
      let avisData = response.data.avis || [];
      
      // Filtrer côté client selon l'onglet
      if (filter === 'pending') {
        avisData = avisData.filter(a => !a.est_approuve);
      } else if (filter === 'approved') {
        avisData = avisData.filter(a => a.est_approuve);
      }
      
      setAvis(avisData);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error('Erreur chargement avis:', error);
      toast.error('Erreur chargement des avis');
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = (avisItem) => {
    setSelectedAvis(avisItem);
    setShowDetailModal(true);
  };

  const handleApprove = async (avisId) => {
    setUpdating(true);
    try {
      await api.patch(`/avis/${avisId}/approuver`);
      toast.success('Avis approuvé avec succès');
      fetchAvis();
    } catch (error) {
      console.error('Erreur approbation:', error);
      toast.error('Erreur lors de l\'approbation');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (avisId) => {
    if (!window.confirm('Supprimer définitivement cet avis ?')) return;
    setUpdating(true);
    try {
      await api.delete(`/avis/${avisId}`);
      toast.success('Avis supprimé');
      fetchAvis();
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast.error('Erreur lors de la suppression');
    } finally {
      setUpdating(false);
    }
  };

  const renderStars = (note) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar 
          key={i} 
          className={`${i <= note ? 'text-amber-500' : 'text-gray-300'} text-sm`} 
        />
      );
    }
    return stars;
  };

  const getNoteLabel = (note) => {
    const labels = {
      1: 'Très mauvais',
      2: 'Mauvais',
      3: 'Moyen',
      4: 'Bien',
      5: 'Excellent'
    };
    return labels[note] || 'Non noté';
  };

  const filteredAvis = avis.filter(avisItem =>
    avisItem.livre?.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    avisItem.utilisateur?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    avisItem.utilisateur?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    avisItem.commentaire?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = avis.filter(a => !a.est_approuve).length;
  const totalPages = Math.ceil(total / 20);

  const menuItems = [
    { path: '/admin', icon: FaBook, label: 'Tableau de bord', active: false },
    { path: '/admin/livres', icon: FaBook, label: 'Gestion des livres', active: false },
    { path: '/admin/utilisateurs', icon: FaUserCircle, label: 'Gestion utilisateurs', active: false },
    { path: '/admin/commandes', icon: FaBook, label: 'Gestion commandes', active: false },
    { path: '/admin/collections', icon: FaBook, label: 'Gestion collections', active: false },
    { path: '/admin/avis', icon: FaStar, label: 'Modération avis', active: true },
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
              Modération des avis
            </h1>
            <p className="text-amber-500 text-sm">
              {pendingCount} avis en attente de modération
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchAvis}
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
          {/* Barre de recherche et filtres */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400" />
                <input
                  type="text"
                  placeholder="Rechercher un avis (livre, utilisateur, commentaire)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 transition ${
                    filter === 'all' 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FaFilter />
                  Tous
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 transition ${
                    filter === 'pending' 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FaTimes />
                  En attente ({pendingCount})
                </button>
                <button
                  onClick={() => setFilter('approved')}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 transition ${
                    filter === 'approved' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FaCheck />
                  Approuvés
                </button>
              </div>
            </div>
          </div>

          {/* Liste des avis */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {filteredAvis.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <FaStar className="text-amber-300 text-6xl mx-auto mb-4" />
                    <h2 className="text-2xl font-playfair text-amber-700 mb-2">Aucun avis</h2>
                    <p className="text-gray-500">Aucun avis ne correspond à vos critères</p>
                  </div>
                ) : (
                  filteredAvis.map((avisItem) => (
                    <div key={avisItem.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                <FaUserCircle className="text-amber-500 text-2xl" />
                              </div>
                              <div>
                                <p className="font-semibold text-amber-800">
                                  {avisItem.utilisateur?.prenom} {avisItem.utilisateur?.nom}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {new Date(avisItem.cree_le).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                            </div>
                            <div className="ml-13 mt-2">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex gap-1">
                                  {renderStars(avisItem.note)}
                                </div>
                                <span className="text-xs text-gray-500">
                                  ({getNoteLabel(avisItem.note)})
                                </span>
                              </div>
                              <p className="text-gray-700 mb-2">
                                <span className="font-medium text-amber-700">Livre:</span>{' '}
                                {avisItem.livre?.titre || 'Titre inconnu'}
                              </p>
                              <p className="text-gray-600 italic">
                                "{avisItem.commentaire || 'Aucun commentaire'}"
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openDetailModal(avisItem)}
                              className="p-2 rounded-lg hover:bg-amber-100 transition"
                              title="Voir détails"
                            >
                              <FaEye className="text-blue-600" />
                            </button>
                            {!avisItem.est_approuve && (
                              <button
                                onClick={() => handleApprove(avisItem.id)}
                                disabled={updating}
                                className="p-2 rounded-lg hover:bg-green-100 transition"
                                title="Approuver"
                              >
                                <FaCheck className="text-green-600" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(avisItem.id)}
                              disabled={updating}
                              className="p-2 rounded-lg hover:bg-red-100 transition"
                              title="Supprimer"
                            >
                              <FaTrash className="text-red-600" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Badge statut */}
                        <div className="mt-3 pt-3 border-t border-amber-100">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            avisItem.est_approuve 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {avisItem.est_approuve ? '✓ Approuvé' : '⏳ En attente de modération'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
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

      {/* Modal Détails avis */}
      {showDetailModal && selectedAvis && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b border-amber-200 flex justify-between items-center">
              <h2 className="text-2xl font-playfair font-bold text-amber-800">
                Détails de l'avis
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <FaUserCircle className="text-amber-500 text-3xl" />
                </div>
                <div>
                  <p className="font-semibold text-amber-800">
                    {selectedAvis.utilisateur?.prenom} {selectedAvis.utilisateur?.nom}
                  </p>
                  <p className="text-sm text-gray-500">{selectedAvis.utilisateur?.email}</p>
                </div>
              </div>

              <div className="border-t border-amber-100 pt-4">
                <p className="text-sm text-gray-500 mb-1">Livre concerné</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-16 bg-amber-100 rounded-lg flex items-center justify-center">
                    {selectedAvis.livre?.couverture_url ? (
                      <img src={selectedAvis.livre.couverture_url} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <FaBook className="text-amber-400 text-2xl" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-amber-800">{selectedAvis.livre?.titre}</p>
                    <p className="text-sm text-gray-500">{selectedAvis.livre?.auteur}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-amber-100 pt-4">
                <p className="text-sm text-gray-500 mb-1">Note</p>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {renderStars(selectedAvis.note)}
                  </div>
                  <span className="font-medium text-amber-700">{selectedAvis.note}/5</span>
                  <span className="text-sm text-gray-500">({getNoteLabel(selectedAvis.note)})</span>
                </div>
              </div>

              <div className="border-t border-amber-100 pt-4">
                <p className="text-sm text-gray-500 mb-1">Commentaire</p>
                <p className="text-gray-700 italic bg-amber-50 p-3 rounded-lg">
                  "{selectedAvis.commentaire || 'Aucun commentaire'}"
                </p>
              </div>

              <div className="border-t border-amber-100 pt-4">
                <p className="text-sm text-gray-500 mb-1">Date de publication</p>
                <p className="text-gray-700">
                  {new Date(selectedAvis.cree_le).toLocaleString('fr-FR')}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-amber-100">
                {!selectedAvis.est_approuve && (
                  <button
                    onClick={() => {
                      handleApprove(selectedAvis.id);
                      setShowDetailModal(false);
                    }}
                    disabled={updating}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                  >
                    <FaCheck />
                    Approuver
                  </button>
                )}
                <button
                  onClick={() => {
                    handleDelete(selectedAvis.id);
                    setShowDetailModal(false);
                  }}
                  disabled={updating}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                >
                  <FaTrash />
                  Supprimer
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-amber-200 rounded-lg text-amber-700 hover:bg-amber-50 transition"
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

export default GestionAvisPage;