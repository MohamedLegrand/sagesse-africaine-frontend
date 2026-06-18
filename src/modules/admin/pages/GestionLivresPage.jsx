import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Eye, EyeOff, Search, Check, X, FileText, Image } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';

const GestionLivresPage = () => {
  const [livres, setLivres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingLivre, setEditingLivre] = useState(null);
  const [formData, setFormData] = useState({
    titre: '', auteur: '', description: '', prix: 6500,
    est_gratuit: false, langue: 'francais', isbn: '', couverture_url: '', collection_id: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => { fetchLivres(); fetchCollections(); }, [page]);

  const fetchLivres = async () => {
    setLoading(true);
    try {
      const r = await api.get('/livres/', { params: { page, taille: 20 } });
      setLivres(r.data.livres || []); setTotal(r.data.total || 0);
    } catch { toast.error('Erreur chargement des livres'); } finally { setLoading(false); }
  };

  const fetchCollections = async () => {
    try { const r = await api.get('/collections/', { params: { page: 1, taille: 100 } }); setCollections(r.data.collections || []); } catch {}
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setImagePreview(URL.createObjectURL(file));
    } else { toast.error('Image PNG ou JPEG uniquement'); }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') { setSelectedPdf(file); }
    else { toast.error('Fichier PDF uniquement'); }
  };

  const uploadPdf = async (livreId) => {
    if (!selectedPdf) return;
    const fd = new FormData(); fd.append('fichier', selectedPdf);
    try { await api.post(`/fichiers-livres/${livreId}/upload`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }); } catch {}
  };

  const openCreateModal = () => {
    setEditingLivre(null);
    setFormData({ titre: '', auteur: '', description: '', prix: 6500, est_gratuit: false, langue: 'francais', isbn: '', couverture_url: '', collection_id: '' });
    setSelectedPdf(null); setImagePreview(null); setShowModal(true);
  };

  const openEditModal = (livre) => {
    setEditingLivre(livre);
    setFormData({ titre: livre.titre || '', auteur: livre.auteur || '', description: livre.description || '', prix: livre.prix || 6500, est_gratuit: livre.est_gratuit || false, langue: livre.langue || 'francais', isbn: livre.isbn || '', couverture_url: livre.couverture_url || '', collection_id: livre.collection_id || '' });
    setImagePreview(livre.couverture_url); setSelectedPdf(null); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      let livreId = editingLivre?.id;
      const payload = { titre: formData.titre, auteur: formData.auteur, description: formData.description, prix: formData.prix, est_gratuit: formData.est_gratuit, langue: formData.langue, isbn: formData.isbn, couverture_url: formData.couverture_url, collection_id: formData.collection_id };
      if (editingLivre) { await api.put(`/livres/${editingLivre.id}`, payload); toast.success('Livre modifié'); }
      else { const r = await api.post('/livres/', payload); livreId = r.data.id; toast.success('Livre créé'); }
      if (selectedPdf && livreId) await uploadPdf(livreId);
      setShowModal(false); fetchLivres();
    } catch { toast.error('Erreur lors de la sauvegarde'); } finally { setSubmitting(false); }
  };

  const handleDelete = async (id, titre) => {
    if (!window.confirm(`Supprimer "${titre}" ?`)) return;
    try { await api.delete(`/livres/${id}`); toast.success('Livre supprimé'); fetchLivres(); } catch { toast.error('Erreur suppression'); }
  };

  const handlePublish = async (id, estPublie) => {
    try {
      if (estPublie) { await api.patch(`/livres/${id}/depublier`); toast.success('Livre dépublié'); }
      else { await api.patch(`/livres/${id}/publier`); toast.success('Livre publié'); }
      fetchLivres();
    } catch { toast.error('Erreur publication'); }
  };

  const filtered = livres.filter(l =>
    l.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.auteur?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(total / 20);

  return (
    <AdminLayout>
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="section-eyebrow">Catalogue</span>
          <h1 className="section-title mt-2">Gestion des livres</h1>
          <p className="text-brown-400 text-sm mt-1">{total} livre(s) au total</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary text-sm flex-shrink-0">
          <Plus className="w-4 h-4" /> Nouveau livre
        </button>
      </div>

      {/* Recherche */}
      <div className="bg-white rounded-xl border border-cream-200 p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-300" />
          <input
            type="text"
            placeholder="Rechercher un livre (titre, auteur)…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Tableau */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-terra-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-cream-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-cream-50 border-b border-cream-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brown-500 uppercase tracking-wider">Couverture</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brown-500 uppercase tracking-wider">Titre / Auteur</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brown-500 uppercase tracking-wider">Prix</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brown-500 uppercase tracking-wider">Statut</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-brown-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {filtered.map((livre) => (
                    <tr key={livre.id} className="hover:bg-cream-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="w-10 h-14 bg-cream-100 rounded overflow-hidden">
                          {livre.couverture_url ? (
                            <img src={livre.couverture_url} alt={livre.titre} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="w-4 h-4 text-brown-300" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-brown-900 text-sm">{livre.titre}</p>
                        <p className="text-xs text-brown-400">{livre.auteur}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold text-sm ${livre.est_gratuit ? 'text-green-600' : 'text-brown-800'}`}>
                          {livre.est_gratuit ? 'Gratuit' : `${livre.prix?.toLocaleString()} FCFA`}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${livre.est_publie ? 'bg-green-100 text-green-700' : 'bg-cream-100 text-brown-500'}`}>
                          {livre.est_publie ? 'Publié' : 'Brouillon'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-1">
                          <button onClick={() => handlePublish(livre.id, livre.est_publie)} className="p-1.5 rounded-lg hover:bg-cream-100 transition-colors" title={livre.est_publie ? 'Dépublier' : 'Publier'}>
                            {livre.est_publie ? <EyeOff className="w-4 h-4 text-brown-400" /> : <Eye className="w-4 h-4 text-green-600" />}
                          </button>
                          <button onClick={() => openEditModal(livre)} className="p-1.5 rounded-lg hover:bg-cream-100 transition-colors" title="Modifier">
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </button>
                          <button onClick={() => handleDelete(livre.id, livre.titre)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Supprimer">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-16 text-brown-300">
                        <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Aucun livre trouvé</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 border border-cream-200 rounded-lg text-sm text-brown-600 disabled:opacity-40 hover:bg-cream-100 transition-colors">← Précédent</button>
              <span className="px-4 py-2 bg-terra-500 text-white rounded-lg text-sm font-medium">{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 border border-cream-200 rounded-lg text-sm text-brown-600 disabled:opacity-40 hover:bg-cream-100 transition-colors">Suivant →</button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-cream-200">
              <h2 className="font-playfair text-xl font-bold text-brown-950">
                {editingLivre ? 'Modifier le livre' : 'Ajouter un livre'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-cream-100 transition-colors">
                <X className="w-5 h-5 text-brown-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Titre *</label>
                  <input type="text" name="titre" value={formData.titre} onChange={handleInputChange} required className="input-field" />
                </div>
                <div>
                  <label className="input-label">Auteur *</label>
                  <input type="text" name="auteur" value={formData.auteur} onChange={handleInputChange} required className="input-field" />
                </div>
              </div>
              <div>
                <label className="input-label">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="input-field resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Prix (FCFA)</label>
                  <input type="number" name="prix" value={formData.prix} onChange={handleInputChange} step="100" className="input-field" />
                </div>
                <div>
                  <label className="input-label">Langue</label>
                  <select name="langue" value={formData.langue} onChange={handleInputChange} className="input-field">
                    <option value="francais">Français</option>
                    <option value="anglais">Anglais</option>
                    <option value="espagnol">Espagnol</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">ISBN</label>
                  <input type="text" name="isbn" value={formData.isbn} onChange={handleInputChange} className="input-field" />
                </div>
                <div>
                  <label className="input-label">Collection</label>
                  <select name="collection_id" value={formData.collection_id} onChange={handleInputChange} className="input-field">
                    <option value="">Sélectionner…</option>
                    {collections.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="input-label">Image de couverture (PNG/JPEG)</label>
                <div className="flex items-center gap-3">
                  <input type="file" accept="image/png,image/jpeg" onChange={handleImageChange} className="flex-1 text-sm text-brown-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-terra-50 file:text-terra-600 hover:file:bg-terra-100" />
                  {imagePreview && <img src={imagePreview} alt="Aperçu" className="w-10 h-14 object-cover rounded" />}
                </div>
              </div>
              <div>
                <label className="input-label">Fichier PDF</label>
                <input type="file" accept="application/pdf" onChange={handlePdfChange} className="w-full text-sm text-brown-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cream-100 file:text-brown-600 hover:file:bg-cream-200" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="est_gratuit" id="est_gratuit" checked={formData.est_gratuit} onChange={handleInputChange} className="w-4 h-4 text-terra-500 rounded border-brown-300" />
                <label htmlFor="est_gratuit" className="text-sm font-medium text-brown-700">Livre gratuit</label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-cream-200">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline text-sm">Annuler</button>
                <button type="submit" disabled={submitting} className="btn-primary text-sm disabled:opacity-60">
                  {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                  {editingLivre ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default GestionLivresPage;
