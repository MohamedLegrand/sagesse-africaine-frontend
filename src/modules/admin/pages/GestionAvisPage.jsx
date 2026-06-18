import React, { useState, useEffect } from 'react';
import { Star, Search, Check, Trash2, Eye, X, Filter, BookOpen } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';

const Stars = ({ note }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(i => (
      <Star key={i} className={`w-3.5 h-3.5 ${i <= note ? 'text-gold-500 fill-gold-500' : 'text-brown-200'}`} />
    ))}
  </div>
);

const NOTE_LABELS = { 1: 'Très mauvais', 2: 'Mauvais', 3: 'Moyen', 4: 'Bien', 5: 'Excellent' };

const GestionAvisPage = () => {
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAvis, setSelectedAvis] = useState(null);

  useEffect(() => { fetchAvis(); }, [page, filter]);

  const fetchAvis = async () => {
    setLoading(true);
    try {
      const r = await api.get('/avis/', { params: { page, taille: 20 } });
      let data = r.data.avis || [];
      if (filter === 'pending') data = data.filter(a => !a.est_approuve);
      else if (filter === 'approved') data = data.filter(a => a.est_approuve);
      setAvis(data); setTotal(r.data.total || 0);
    } catch { toast.error('Erreur chargement'); } finally { setLoading(false); }
  };

  const handleApprove = async (id) => {
    setUpdating(true);
    try { await api.patch(`/avis/${id}/approuver`); toast.success('Avis approuvé'); fetchAvis(); }
    catch { toast.error('Erreur'); } finally { setUpdating(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet avis ?')) return;
    setUpdating(true);
    try { await api.delete(`/avis/${id}`); toast.success('Avis supprimé'); fetchAvis(); if (selectedAvis?.id === id) setShowModal(false); }
    catch { toast.error('Erreur'); } finally { setUpdating(false); }
  };

  const pendingCount = avis.filter(a => !a.est_approuve).length;
  const filtered = avis.filter(a =>
    a.livre?.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.utilisateur?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.utilisateur?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.commentaire?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(total / 20);

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="section-eyebrow">Modération</span>
          <h1 className="section-title mt-2">Gestion des avis</h1>
          <p className="text-brown-400 text-sm mt-1">{pendingCount} avis en attente</p>
        </div>
      </div>

      {/* Barre de recherche + filtres */}
      <div className="bg-white rounded-xl border border-cream-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-300" />
            <input type="text" placeholder="Rechercher (livre, auteur, commentaire)…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-10" />
          </div>
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'Tous' },
              { value: 'pending', label: `En attente (${pendingCount})` },
              { value: 'approved', label: 'Approuvés' },
            ].map(f => (
              <button key={f.value} onClick={() => setFilter(f.value)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${filter === f.value ? 'bg-terra-500 text-white' : 'bg-cream-100 text-brown-600 hover:bg-cream-200'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-terra-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-cream-200 p-16 text-center text-brown-300">
              <Star className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Aucun avis ne correspond aux critères</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((avisItem) => (
                <div key={avisItem.id} className="bg-white rounded-xl border border-cream-200 p-5 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-terra-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-terra-700 font-bold text-xs">
                          {`${avisItem.utilisateur?.prenom?.[0] || ''}${avisItem.utilisateur?.nom?.[0] || ''}`.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-brown-900 text-sm">{avisItem.utilisateur?.prenom} {avisItem.utilisateur?.nom}</p>
                          <span className="text-xs text-brown-300">{new Date(avisItem.cree_le).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Stars note={avisItem.note} />
                          <span className="text-xs text-brown-400">({NOTE_LABELS[avisItem.note]})</span>
                        </div>
                        <p className="text-xs text-terra-600 font-medium mb-1">Livre : {avisItem.livre?.titre || '—'}</p>
                        <p className="text-brown-600 text-sm italic">« {avisItem.commentaire || 'Aucun commentaire'} »</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button onClick={() => { setSelectedAvis(avisItem); setShowModal(true); }} className="p-1.5 rounded-lg hover:bg-cream-100 transition-colors"><Eye className="w-4 h-4 text-blue-600" /></button>
                      {!avisItem.est_approuve && (
                        <button onClick={() => handleApprove(avisItem.id)} disabled={updating} className="p-1.5 rounded-lg hover:bg-green-50 transition-colors"><Check className="w-4 h-4 text-green-600" /></button>
                      )}
                      <button onClick={() => handleDelete(avisItem.id)} disabled={updating} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4 text-red-500" /></button>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-cream-100">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${avisItem.est_approuve ? 'bg-green-100 text-green-700' : 'bg-gold-100 text-gold-700'}`}>
                      {avisItem.est_approuve ? '✓ Approuvé' : '⏳ En attente de modération'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 border border-cream-200 rounded-lg text-sm text-brown-600 disabled:opacity-40 hover:bg-cream-100 transition-colors">← Précédent</button>
              <span className="px-4 py-2 bg-terra-500 text-white rounded-lg text-sm font-medium">{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 border border-cream-200 rounded-lg text-sm text-brown-600 disabled:opacity-40 hover:bg-cream-100 transition-colors">Suivant →</button>
            </div>
          )}
        </>
      )}

      {/* Modal détails */}
      {showModal && selectedAvis && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-cream-200">
              <h2 className="font-playfair text-xl font-bold text-brown-950">Détails de l'avis</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-cream-100"><X className="w-5 h-5 text-brown-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-terra-100 flex items-center justify-center">
                  <span className="text-terra-700 font-bold">{`${selectedAvis.utilisateur?.prenom?.[0] || ''}${selectedAvis.utilisateur?.nom?.[0] || ''}`.toUpperCase()}</span>
                </div>
                <div><p className="font-semibold text-brown-900">{selectedAvis.utilisateur?.prenom} {selectedAvis.utilisateur?.nom}</p><p className="text-sm text-brown-400">{selectedAvis.utilisateur?.email}</p></div>
              </div>
              <div className="bg-cream-50 rounded-lg p-3 flex items-center gap-3">
                <div className="w-10 h-14 bg-cream-200 rounded overflow-hidden flex-shrink-0">
                  {selectedAvis.livre?.couverture_url ? <img src={selectedAvis.livre.couverture_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-4 h-4 text-brown-300" /></div>}
                </div>
                <div><p className="font-semibold text-brown-900 text-sm">{selectedAvis.livre?.titre}</p><p className="text-xs text-brown-400">{selectedAvis.livre?.auteur}</p></div>
              </div>
              <div>
                <p className="text-xs text-brown-400 mb-2">Note</p>
                <div className="flex items-center gap-2"><Stars note={selectedAvis.note} /><span className="font-semibold text-brown-800">{selectedAvis.note}/5</span><span className="text-sm text-brown-400">({NOTE_LABELS[selectedAvis.note]})</span></div>
              </div>
              <div>
                <p className="text-xs text-brown-400 mb-2">Commentaire</p>
                <p className="text-brown-700 italic bg-cream-50 p-3 rounded-lg text-sm">« {selectedAvis.commentaire || 'Aucun commentaire'} »</p>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-cream-100">
                {!selectedAvis.est_approuve && (
                  <button onClick={() => { handleApprove(selectedAvis.id); setShowModal(false); }} disabled={updating} className="btn-primary text-sm"><Check className="w-4 h-4" /> Approuver</button>
                )}
                <button onClick={() => { handleDelete(selectedAvis.id); }} disabled={updating} className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors"><Trash2 className="w-4 h-4" /> Supprimer</button>
                <button onClick={() => setShowModal(false)} className="btn-outline text-sm">Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default GestionAvisPage;
