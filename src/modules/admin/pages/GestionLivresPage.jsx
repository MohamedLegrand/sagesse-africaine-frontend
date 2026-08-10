import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Plus, Edit2, Trash2, Eye, EyeOff, Search, Check, X, FileText, Image, Upload, Loader2 } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';
import livresService from '../../../services/livresService';
import { traduireErreurApi } from '../../../services/erreurApi';

const TAILLE_PAGE = 20;

// Carte de gestion d'une image unique (couverture / 4e de couverture) : aperçu
// grand format en priorité, puis actions de remplacement/suppression bien visibles.
const CarteVisuelImage = ({ label, preview, onChange, onDelete, peutSupprimer }) => {
  const { t } = useTranslation('admin');
  return (
    <div>
      <label className="input-label">{label}</label>
      <div className="relative w-28 aspect-[3/4] bg-cream-50 border-2 border-dashed border-cream-200 rounded-xl overflow-hidden flex items-center justify-center">
        {preview ? (
          <img src={preview} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-brown-300">
            <Image className="w-6 h-6" />
            <span className="text-[10px] text-center px-1">{t('livres.modal.aucuneImage')}</span>
          </div>
        )}
        {peutSupprimer && (
          <button
            type="button"
            onClick={onDelete}
            className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow"
            title={t('commun.supprimer')}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <label className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-terra-600 hover:text-terra-800 cursor-pointer">
        <Upload className="w-3.5 h-3.5" />
        {preview ? t('livres.modal.remplacerImage') : t('livres.modal.ajouterImage')}
        <input type="file" accept="image/png,image/jpeg" onChange={onChange} className="hidden" />
      </label>
    </div>
  );
};

const GestionLivresPage = () => {
  const { t } = useTranslation('admin');
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedQuatrieme, setSelectedQuatrieme] = useState(null);
  const [quatriemePreview, setQuatriemePreview] = useState(null);
  const [selectedSommaireFiles, setSelectedSommaireFiles] = useState([]);
  const [sommaireExistants, setSommaireExistants] = useState([]);
  const [selectedExtrait, setSelectedExtrait] = useState(null);
  const [extraitUrlExistant, setExtraitUrlExistant] = useState(null);
  const [fichiersExistants, setFichiersExistants] = useState([]);
  const [chargementFichiers, setChargementFichiers] = useState(false);

  useEffect(() => { fetchCollections(); }, []);
  useEffect(() => { fetchLivres(page, searchTerm); }, [page]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (page !== 1) { setPage(1); } else { fetchLivres(1, searchTerm); }
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const fetchLivres = async (pageActuelle, recherche) => {
    setLoading(true);
    try {
      const data = await livresService.getLivresAdmin(pageActuelle, TAILLE_PAGE, recherche);
      setLivres(data.livres || []);
      setTotal(data.total || 0);
    } catch {
      toast.error(t('livres.messages.impossibleChargerCatalogue'));
    } finally {
      setLoading(false);
    }
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
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else { toast.error(t('livres.messages.imagePngJpegUniquement')); }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/epub+zip' || file.name.endsWith('.epub') || file.name.endsWith('.pdf'))) {
      setSelectedPdf(file);
    } else { toast.error(t('livres.messages.fichierPdfEpubUniquement')); }
  };

  const handleQuatriemeChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setSelectedQuatrieme(file);
      setQuatriemePreview(URL.createObjectURL(file));
    } else { toast.error(t('livres.messages.imagePngJpegUniquement')); }
  };

  const handleSommaireFilesChange = (e) => {
    const fichiers = Array.from(e.target.files || []);
    const valides = fichiers.filter(f => f.type === 'image/png' || f.type === 'image/jpeg');
    if (valides.length < fichiers.length) { toast.error(t('livres.messages.imagePngJpegUniquement')); }
    if (valides.length > 0) { setSelectedSommaireFiles(prev => [...prev, ...valides]); }
    e.target.value = '';
  };

  const retirerSommaireFileEnAttente = (index) => {
    setSelectedSommaireFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleExtraitChange = (e) => {
    const file = e.target.files[0];
    const nomValide = file && (file.name.endsWith('.docx') || file.name.endsWith('.pdf'));
    if (file && nomValide) {
      setSelectedExtrait(file);
    } else { toast.error(t('livres.messages.fichierExtraitInvalide')); }
  };

  const fetchFichiersExistants = async (livreId) => {
    setChargementFichiers(true);
    try {
      const r = await api.get(`/fichiers-livres/${livreId}`);
      setFichiersExistants(r.data.fichiers || []);
    } catch {
      setFichiersExistants([]);
    } finally {
      setChargementFichiers(false);
    }
  };

  const handleSupprimerSommaireExistant = async (url) => {
    if (!editingLivre) return;
    if (!window.confirm(t('livres.messages.confirmSuppressionVisuel'))) return;
    try {
      await api.delete(`/livres/${editingLivre.id}/sommaire`, { data: { url } });
      setSommaireExistants(prev => prev.filter(u => u !== url));
      toast.success(t('livres.messages.sommaireSupprime'));
    } catch (error) {
      toast.error(traduireErreurApi(error, 'livres.messages.erreurSuppression', 'admin'));
    }
  };

  const handleSupprimerCouvertureExistante = async () => {
    if (!editingLivre) return;
    if (!window.confirm(t('livres.messages.confirmSuppressionVisuel'))) return;
    try {
      await api.delete(`/livres/${editingLivre.id}/couverture`);
      setImagePreview(null);
      toast.success(t('livres.messages.imageSupprimee'));
      fetchLivres(page, searchTerm);
    } catch (error) {
      toast.error(traduireErreurApi(error, 'livres.messages.erreurSuppression', 'admin'));
    }
  };

  const handleSupprimerQuatriemeExistante = async () => {
    if (!editingLivre) return;
    if (!window.confirm(t('livres.messages.confirmSuppressionVisuel'))) return;
    try {
      await api.delete(`/livres/${editingLivre.id}/quatrieme-couverture`);
      setQuatriemePreview(null);
      toast.success(t('livres.messages.imageSupprimee'));
      fetchLivres(page, searchTerm);
    } catch (error) {
      toast.error(traduireErreurApi(error, 'livres.messages.erreurSuppression', 'admin'));
    }
  };

  const handleSupprimerExtraitExistant = async () => {
    if (!editingLivre) return;
    if (!window.confirm(t('livres.messages.confirmSuppressionVisuel'))) return;
    try {
      await api.delete(`/livres/${editingLivre.id}/extrait`);
      setExtraitUrlExistant(null);
      toast.success(t('livres.messages.extraitSupprime'));
      fetchLivres(page, searchTerm);
    } catch (error) {
      toast.error(traduireErreurApi(error, 'livres.messages.erreurSuppression', 'admin'));
    }
  };

  const handleSupprimerFichierExistant = async (fichierId) => {
    if (!window.confirm(t('livres.messages.confirmSuppressionVisuel'))) return;
    try {
      await api.delete(`/fichiers-livres/${fichierId}`);
      setFichiersExistants(prev => prev.filter(f => f.id !== fichierId));
      toast.success(t('livres.messages.fichierSupprime'));
    } catch (error) {
      toast.error(traduireErreurApi(error, 'livres.messages.erreurSuppression', 'admin'));
    }
  };

  const handleRemplacerFichierExistant = async (fichierId, e) => {
    const fichier = e.target.files[0];
    e.target.value = '';
    if (!fichier) return;
    const fd = new FormData(); fd.append('fichier', fichier);
    try {
      const r = await api.put(`/fichiers-livres/${fichierId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setFichiersExistants(prev => prev.map(f => (f.id === fichierId ? r.data : f)));
      toast.success(t('livres.messages.fichierRemplace'));
    } catch (error) {
      toast.error(traduireErreurApi(error, 'livres.messages.erreurEnvoiPdf', 'admin'));
    }
  };

  const uploadPdf = async (livreId) => {
    if (!selectedPdf) return;
    const fd = new FormData(); fd.append('fichier', selectedPdf);
    try {
      await api.post(`/fichiers-livres/${livreId}/upload`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    } catch (error) {
      toast.error(traduireErreurApi(error, 'livres.messages.erreurEnvoiPdf', 'admin'));
    }
  };

  const uploadCouverture = async (livreId) => {
    if (!selectedImage) return;
    const fd = new FormData(); fd.append('fichier', selectedImage);
    try {
      await api.post(`/livres/${livreId}/couverture`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    } catch (error) {
      toast.error(traduireErreurApi(error, 'livres.messages.erreurEnvoiImage', 'admin'));
    }
  };

  const uploadQuatriemeCouverture = async (livreId) => {
    if (!selectedQuatrieme) return;
    const fd = new FormData(); fd.append('fichier', selectedQuatrieme);
    try {
      await api.post(`/livres/${livreId}/quatrieme-couverture`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    } catch (error) {
      toast.error(traduireErreurApi(error, 'livres.messages.erreurEnvoiImage', 'admin'));
    }
  };

  const uploadSommaireFiles = async (livreId) => {
    if (selectedSommaireFiles.length === 0) return;
    for (const fichier of selectedSommaireFiles) {
      const fd = new FormData(); fd.append('fichier', fichier);
      try {
        await api.post(`/livres/${livreId}/sommaire`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } catch (error) {
        toast.error(traduireErreurApi(error, 'livres.messages.erreurEnvoiImage', 'admin'));
      }
    }
  };

  const uploadExtrait = async (livreId) => {
    if (!selectedExtrait) return;
    const fd = new FormData(); fd.append('fichier', selectedExtrait);
    try {
      await api.post(`/livres/${livreId}/extrait`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    } catch (error) {
      toast.error(traduireErreurApi(error, 'livres.messages.erreurEnvoiExtrait', 'admin'));
    }
  };

  const openCreateModal = () => {
    setEditingLivre(null);
    setFormData({ titre: '', auteur: '', description: '', prix: 6500, est_gratuit: false, langue: 'francais', isbn: '', couverture_url: '', collection_id: '' });
    setSelectedPdf(null); setSelectedImage(null); setImagePreview(null);
    setSelectedQuatrieme(null); setQuatriemePreview(null);
    setSelectedSommaireFiles([]); setSommaireExistants([]);
    setSelectedExtrait(null); setExtraitUrlExistant(null);
    setFichiersExistants([]);
    setShowModal(true);
  };

  const openEditModal = (livre) => {
    setEditingLivre(livre);
    setFormData({ titre: livre.titre || '', auteur: livre.auteur || '', description: livre.description || '', prix: livre.prix || 6500, est_gratuit: livre.est_gratuit || false, langue: livre.langue || 'francais', isbn: livre.isbn || '', couverture_url: livre.couverture_url || '', collection_id: livre.collection_id || '' });
    setImagePreview(livre.couverture_url); setSelectedPdf(null); setSelectedImage(null);
    setSelectedQuatrieme(null); setQuatriemePreview(livre.quatrieme_couverture_url || null);
    setSelectedSommaireFiles([]); setSommaireExistants(livre.sommaire_urls || []);
    setSelectedExtrait(null); setExtraitUrlExistant(livre.extrait_url || null);
    setFichiersExistants([]); fetchFichiersExistants(livre.id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      let livreId = editingLivre?.id;
      const payload = { titre: formData.titre, auteur: formData.auteur, description: formData.description, prix: formData.prix, est_gratuit: formData.est_gratuit, langue: formData.langue, isbn: formData.isbn, couverture_url: formData.couverture_url, collection_id: formData.collection_id };
      if (editingLivre) { await api.put(`/livres/${editingLivre.id}`, payload); toast.success(t('livres.messages.livreModifie')); }
      else { const r = await api.post('/livres/', payload); livreId = r.data.id; toast.success(t('livres.messages.livreCree')); }
      if (selectedPdf && livreId) await uploadPdf(livreId);
      if (selectedImage && livreId) await uploadCouverture(livreId);
      if (selectedQuatrieme && livreId) await uploadQuatriemeCouverture(livreId);
      if (selectedSommaireFiles.length > 0 && livreId) await uploadSommaireFiles(livreId);
      if (selectedExtrait && livreId) await uploadExtrait(livreId);
      setShowModal(false); fetchLivres(page, searchTerm);
    } catch { toast.error(t('livres.messages.erreurSauvegarde')); } finally { setSubmitting(false); }
  };

  const handleDelete = async (id, titre) => {
    if (!window.confirm(t('livres.messages.confirmSuppression', { titre }))) return;
    try { await api.delete(`/livres/${id}`); toast.success(t('livres.messages.livreSupprime')); fetchLivres(page, searchTerm); } catch { toast.error(t('livres.messages.erreurSuppression')); }
  };

  const handlePublish = async (id, estPublie) => {
    try {
      if (estPublie) { await api.patch(`/livres/${id}/depublier`); toast.success(t('livres.messages.livreDepublie')); }
      else { await api.patch(`/livres/${id}/publier`); toast.success(t('livres.messages.livrePublie')); }
      fetchLivres(page, searchTerm);
    } catch { toast.error(t('livres.messages.erreurPublication')); }
  };

  const totalPages = Math.max(1, Math.ceil(total / TAILLE_PAGE));

  return (
    <AdminLayout>
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="section-eyebrow">{t('livres.eyebrow')}</span>
          <h1 className="section-title mt-2">{t('livres.titre')}</h1>
          <p className="text-brown-400 text-sm mt-1">{t('livres.livreAuTotal', { count: total })}</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary text-sm flex-shrink-0">
          <Plus className="w-4 h-4" /> {t('livres.nouveauLivre')}
        </button>
      </div>

      {/* Recherche */}
      <div className="bg-white rounded-xl border border-cream-200 p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-300" />
          <input
            type="text"
            placeholder={t('livres.rechercherPlaceholder')}
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
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brown-500 uppercase tracking-wider">{t('livres.entetes.couverture')}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brown-500 uppercase tracking-wider">{t('livres.entetes.titreAuteur')}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brown-500 uppercase tracking-wider">{t('livres.entetes.prix')}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brown-500 uppercase tracking-wider">{t('livres.entetes.statut')}</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-brown-500 uppercase tracking-wider">{t('livres.entetes.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {livres.map((livre) => (
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
                          {livre.est_gratuit ? t('livres.gratuit') : `${livre.prix?.toLocaleString('fr-FR')} XAF`}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${livre.est_publie ? 'bg-green-100 text-green-700' : 'bg-cream-100 text-brown-500'}`}>
                          {livre.est_publie ? t('livres.publie') : t('livres.brouillon')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-1">
                          <button onClick={() => handlePublish(livre.id, livre.est_publie)} className="p-1.5 rounded-lg hover:bg-cream-100 transition-colors" title={livre.est_publie ? t('livres.depublier') : t('livres.publier')}>
                            {livre.est_publie ? <EyeOff className="w-4 h-4 text-brown-400" /> : <Eye className="w-4 h-4 text-green-600" />}
                          </button>
                          <button onClick={() => openEditModal(livre)} className="p-1.5 rounded-lg hover:bg-cream-100 transition-colors" title={t('livres.modifierTitle')}>
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </button>
                          <button onClick={() => handleDelete(livre.id, livre.titre)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" title={t('livres.supprimerTitle')}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {livres.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-16 text-brown-300">
                        <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">{t('livres.aucunLivreTrouve')}</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 border border-cream-200 rounded-lg text-sm text-brown-600 disabled:opacity-40 hover:bg-cream-100 transition-colors">{t('commun.precedent')}</button>
              <span className="px-4 py-2 bg-terra-500 text-white rounded-lg text-sm font-medium">{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 border border-cream-200 rounded-lg text-sm text-brown-600 disabled:opacity-40 hover:bg-cream-100 transition-colors">{t('commun.suivant')}</button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-cream-200">
              <h2 className="font-playfair text-xl font-bold text-brown-950">
                {editingLivre ? t('livres.modal.modifierLeLivre') : t('livres.modal.ajouterUnLivre')}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-cream-100 transition-colors">
                <X className="w-5 h-5 text-brown-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* ── Informations ── */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-brown-400">{t('livres.modal.sectionInformations')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">{t('livres.modal.titreLabel')}</label>
                    <input type="text" name="titre" value={formData.titre} onChange={handleInputChange} required className="input-field" />
                  </div>
                  <div>
                    <label className="input-label">{t('livres.modal.auteurLabel')}</label>
                    <input type="text" name="auteur" value={formData.auteur} onChange={handleInputChange} required className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="input-label">{t('livres.modal.descriptionLabel')}</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="input-field resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">{t('livres.modal.prixLabel')}</label>
                    <input type="number" name="prix" value={formData.prix} onChange={handleInputChange} step="100" className="input-field" />
                  </div>
                  <div>
                    <label className="input-label">{t('livres.modal.langueLabel')}</label>
                    <select name="langue" value={formData.langue} onChange={handleInputChange} className="input-field">
                      <option value="francais">Français</option>
                      <option value="anglais">Anglais</option>
                      <option value="espagnol">Espagnol</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">{t('livres.modal.isbnLabel')}</label>
                    <input type="text" name="isbn" value={formData.isbn} onChange={handleInputChange} className="input-field" />
                  </div>
                  <div>
                    <label className="input-label">{t('livres.modal.collectionLabel')}</label>
                    <select name="collection_id" value={formData.collection_id} onChange={handleInputChange} className="input-field">
                      <option value="">{t('livres.modal.selectionner')}</option>
                      {collections.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" name="est_gratuit" id="est_gratuit" checked={formData.est_gratuit} onChange={handleInputChange} className="w-4 h-4 text-terra-500 rounded border-brown-300" />
                  <label htmlFor="est_gratuit" className="text-sm font-medium text-brown-700">{t('livres.modal.livreGratuit')}</label>
                </div>
              </div>

              {/* ── Visuels ── */}
              <div className="border-t border-cream-200 pt-6 space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-brown-400">{t('livres.modal.sectionVisuels')}</h3>
                  <p className="text-xs text-brown-400 mt-0.5">{t('livres.modal.sectionVisuelsDesc')}</p>
                </div>

                <div className="flex flex-wrap gap-6">
                  <CarteVisuelImage
                    label={t('livres.modal.imageCouvertureLabel')}
                    preview={imagePreview}
                    onChange={handleImageChange}
                    onDelete={handleSupprimerCouvertureExistante}
                    peutSupprimer={!!(editingLivre && !selectedImage && imagePreview)}
                  />
                  <CarteVisuelImage
                    label={t('livres.modal.quatriemeCouvertureLabel')}
                    preview={quatriemePreview}
                    onChange={handleQuatriemeChange}
                    onDelete={handleSupprimerQuatriemeExistante}
                    peutSupprimer={!!(editingLivre && !selectedQuatrieme && quatriemePreview)}
                  />
                </div>

                <div>
                  <label className="input-label">{t('livres.modal.sommaireLabel')}</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {sommaireExistants.map((url) => (
                      <div key={url} className="relative group">
                        <img src={url} alt={t('livres.modal.sommaireLabel')} className="w-16 h-24 object-cover rounded-lg border border-cream-200" />
                        <button
                          type="button"
                          onClick={() => handleSupprimerSommaireExistant(url)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow opacity-90 group-hover:opacity-100"
                          title={t('commun.supprimer')}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {selectedSommaireFiles.map((f, i) => (
                      <div key={`${f.name}-${i}`} className="relative w-16 h-24 rounded-lg border-2 border-dashed border-terra-300 bg-terra-50 flex flex-col items-center justify-center gap-1 px-1">
                        <Image className="w-4 h-4 text-terra-500" />
                        <span className="text-[9px] text-terra-700 text-center leading-tight line-clamp-2">{f.name}</span>
                        <button
                          type="button"
                          onClick={() => retirerSommaireFileEnAttente(i)}
                          className="absolute top-1 right-1 w-5 h-5 bg-white hover:bg-red-50 text-red-500 rounded-full flex items-center justify-center shadow"
                          title={t('commun.supprimer')}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {sommaireExistants.length === 0 && selectedSommaireFiles.length === 0 && (
                      <div className="w-16 h-24 rounded-lg border-2 border-dashed border-cream-200 flex items-center justify-center text-[9px] text-brown-300 text-center px-1">
                        {t('livres.modal.aucunSommaire')}
                      </div>
                    )}
                  </div>
                  <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-terra-600 hover:text-terra-800 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    {t('livres.modal.ajouterDesImages')}
                    <input type="file" accept="image/png,image/jpeg" multiple onChange={handleSommaireFilesChange} className="hidden" />
                  </label>
                </div>
              </div>

              {/* ── Fichiers ── */}
              <div className="border-t border-cream-200 pt-6 space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-brown-400">{t('livres.modal.sectionFichiers')}</h3>
                  <p className="text-xs text-brown-400 mt-0.5">{t('livres.modal.sectionFichiersDesc')}</p>
                </div>

                <div>
                  <label className="input-label">{t('livres.modal.fichierEbookLabel')}</label>
                  {chargementFichiers ? (
                    <div className="flex items-center gap-2 text-xs text-brown-400 py-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> {t('livres.modal.chargement')}
                    </div>
                  ) : fichiersExistants.length > 0 ? (
                    <div className="space-y-1.5 mb-2">
                      {fichiersExistants.map((f) => (
                        <div key={f.id} className="flex items-center justify-between gap-2 bg-cream-50 border border-cream-200 rounded-lg px-3 py-2">
                          <span className="flex items-center gap-2 text-xs text-brown-700 min-w-0">
                            <FileText className="w-3.5 h-3.5 text-brown-400 flex-shrink-0" />
                            <span className="truncate">{f.nom_original || `${t('livres.modal.fichierEbookLabel')}.${f.format}`}</span>
                            <span className="text-brown-400 flex-shrink-0">({f.format?.toUpperCase()} — {(f.taille_octets / 1024 / 1024).toFixed(1)} Mo)</span>
                          </span>
                          <span className="flex items-center gap-1 flex-shrink-0">
                            <label className="p-1 rounded-lg hover:bg-cream-200 transition-colors cursor-pointer" title={t('livres.modal.remplacerFichier')}>
                              <Upload className="w-3.5 h-3.5 text-terra-600" />
                              <input type="file" accept={`.${f.format}`} onChange={(e) => handleRemplacerFichierExistant(f.id, e)} className="hidden" />
                            </label>
                            <button type="button" onClick={() => handleSupprimerFichierExistant(f.id)} className="p-1 rounded-lg hover:bg-red-50 transition-colors" title={t('commun.supprimer')}>
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            </button>
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-brown-300 mb-2">{t('livres.modal.aucunFichierEbook')}</p>
                  )}
                  {selectedPdf && (
                    <p className="flex items-center gap-1.5 text-xs text-terra-700 mb-2"><FileText className="w-3.5 h-3.5" /> {selectedPdf.name}</p>
                  )}
                  <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-terra-600 hover:text-terra-800 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    {t('livres.modal.ajouterFichierEbook')}
                    <input type="file" accept=".pdf,.epub,application/pdf,application/epub+zip" onChange={handlePdfChange} className="hidden" />
                  </label>
                </div>

                <div>
                  <label className="input-label">{t('livres.modal.extraitLabel')}</label>
                  {selectedExtrait ? (
                    <p className="flex items-center gap-1.5 text-xs text-terra-700 mb-2"><FileText className="w-3.5 h-3.5" /> {selectedExtrait.name}</p>
                  ) : extraitUrlExistant ? (
                    <div className="flex items-center justify-between gap-2 bg-cream-50 border border-cream-200 rounded-lg px-3 py-2 mb-2">
                      <a href={extraitUrlExistant} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-terra-600 hover:text-terra-800">
                        <FileText className="w-3.5 h-3.5" /> {t('livres.modal.voirExtrait')}
                      </a>
                      <button type="button" onClick={handleSupprimerExtraitExistant} className="p-1 rounded-lg hover:bg-red-50 transition-colors" title={t('commun.supprimer')}>
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-brown-300 mb-2">{t('livres.modal.aucunExtrait')}</p>
                  )}
                  <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-terra-600 hover:text-terra-800 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    {extraitUrlExistant || selectedExtrait ? t('livres.modal.remplacerExtrait') : t('livres.modal.ajouterExtrait')}
                    <input type="file" accept=".docx,.pdf" onChange={handleExtraitChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-cream-200">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline text-sm">{t('commun.annuler')}</button>
                <button type="submit" disabled={submitting} className="btn-primary text-sm disabled:opacity-60">
                  {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                  {editingLivre ? t('commun.modifier') : t('commun.creer')}
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
