import React, { useState, useEffect } from 'react';
import { Library, Plus, Edit2, Trash2, Search, Check, X } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';

const GestionCollectionsPage = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [formData, setFormData] = useState({ nom: '', description: '', collection_parent_id: '' });
  const [submitting, setSubmitting] = useState(false);
  const [parentCollections, setParentCollections] = useState([]);

  useEffect(() => { fetchCollections(); fetchParentCollections(); }, [page]);

  const fetchCollections = async () => {
    setLoading(true);
    try { const r = await api.get('/collections/', { params: { page, taille: 20 } }); setCollections(r.data.collections || []); setTotal(r.data.total || 0); }
    catch { toast.error('Erreur chargement'); } finally { setLoading(false); }
  };

  const fetchParentCollections = async () => {
    try { const r = await api.get('/collections/', { params: { page: 1, taille: 100 } }); setParentCollections(r.data.collections || []); } catch {}
  };

  const handleInputChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const openCreateModal = () => {
    setEditingCollection(null);
    setFormData({ nom: '', description: '', collection_parent_id: '' });
    setShowModal(true);
  };

  const openEditModal = (col) => {
    setEditingCollection(col);
    setFormData({ nom: col.nom || '', description: col.description || '', collection_parent_id: col.collection_parent_id || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      const payload = { nom: formData.nom, description: formData.description, collection_parent_id: formData.collection_parent_id || null };
      if (editingCollection) { await api.put(`/collections/${editingCollection.id}`, payload); toast.success('Collection modifiée'); }
      else { await api.post('/collections/', payload); toast.success('Collection créée'); }
      setShowModal(false); fetchCollections(); fetchParentCollections();
    } catch { toast.error('Erreur sauvegarde'); } finally { setSubmitting(false); }
  };

  const handleDelete = async (id, nom) => {
    if (!window.confirm(`Supprimer "${nom}" ?`)) return;
    try { await api.delete(`/collections/${id}`); toast.success('Supprimée'); fetchCollections(); fetchParentCollections(); }
    catch { toast.error('Erreur suppression'); }
  };

  const getParentName = (parentId) => parentCollections.find(p => p.id === parentId)?.nom || 'Principale';

  const filtered = collections.filter(c =>
    c.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(total / 20);

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="section-eyebrow">Catalogue</span>
          <h1 className="section-title mt-2">Gestion des collections</h1>
          <p className="text-brown-400 text-sm mt-1">{total} collection(s) au total</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary text-sm flex-shrink-0">
          <Plus className="w-4 h-4" /> Nouvelle collection
        </button>
      </div>

      <div className="bg-white rounded-xl border border-cream-200 p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-300" />
          <input type="text" placeholder="Rechercher une collection…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-10" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-terra-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((col) => (
              <div key={col.id} className="bg-white rounded-xl border border-cream-200 overflow-hidden hover:shadow-md transition-all duration-200">
                <div className="bg-brown-950 px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Library className="w-4 h-4 text-gold-400 flex-shrink-0" />
                    <h3 className="font-playfair font-bold text-white text-base">{col.nom}</h3>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => openEditModal(col)} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" title="Modifier">
                      <Edit2 className="w-3.5 h-3.5 text-white" />
                    </button>
                    <button onClick={() => handleDelete(col.id, col.nom)} className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/50 transition-colors" title="Supprimer">
                      <Trash2 className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-brown-500 text-sm mb-3 min-h-[40px]">{col.description || 'Aucune description'}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-brown-300">Slug: {col.slug || '—'}</span>
                    <span className="text-terra-500 font-medium">
                      {col.collection_parent_id ? `Sous ${getParentName(col.collection_parent_id)}` : 'Principale'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-3 text-center py-16 text-brown-300">
                <Library className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Aucune collection</p>
              </div>
            )}
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
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-cream-200">
              <h2 className="font-playfair text-xl font-bold text-brown-950">{editingCollection ? 'Modifier la collection' : 'Ajouter une collection'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-cream-100"><X className="w-5 h-5 text-brown-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className="input-label">Nom *</label><input type="text" name="nom" value={formData.nom} onChange={handleInputChange} required className="input-field" placeholder="Ex: Sciences Sociales" /></div>
              <div><label className="input-label">Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="input-field resize-none" placeholder="Description de la collection…" /></div>
              <div>
                <label className="input-label">Collection parente</label>
                <select name="collection_parent_id" value={formData.collection_parent_id} onChange={handleInputChange} className="input-field">
                  <option value="">Aucune (principale)</option>
                  {parentCollections.filter(c => !editingCollection || c.id !== editingCollection.id).map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-cream-200">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline text-sm">Annuler</button>
                <button type="submit" disabled={submitting} className="btn-primary text-sm disabled:opacity-60">
                  {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                  {editingCollection ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default GestionCollectionsPage;
