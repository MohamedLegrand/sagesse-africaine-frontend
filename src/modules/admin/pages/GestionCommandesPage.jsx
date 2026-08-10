import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Search, Eye, X, RefreshCw, Printer, BookOpen, Clock, Truck, CheckCircle, XCircle, Loader, Trash2 } from 'lucide-react';
import api from '../../../services/api';
import commandesService from '../../../services/commandesService';
import toast from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';

const STATUS_ICON = {
  en_attente: Clock, payee: CheckCircle, payé: CheckCircle,
  livree: Truck, annulee: XCircle, en_cours: Loader,
};
const STATUS_STYLE = {
  en_attente: 'bg-gold-100 text-gold-700', payee: 'bg-green-100 text-green-700', payé: 'bg-green-100 text-green-700',
  livree: 'bg-blue-100 text-blue-700', annulee: 'bg-red-100 text-red-700', en_cours: 'bg-purple-100 text-purple-700',
};
const STATUS_KEY = {
  en_attente: 'enAttente', payee: 'payee', payé: 'payee',
  livree: 'livree', annulee: 'annulee', en_cours: 'enCours',
};

const StatusBadge = ({ statut }) => {
  const { t } = useTranslation('admin');
  const Icon = STATUS_ICON[statut] || Clock;
  const style = STATUS_STYLE[statut] || 'bg-cream-100 text-brown-500';
  const label = STATUS_KEY[statut] ? t(`commandes.statuts.${STATUS_KEY[statut]}`) : statut;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${style}`}>
      <Icon className="w-3 h-3" /> {label}
    </span>
  );
};

const GestionCommandesPage = () => {
  const { t } = useTranslation('admin');
  const AVAILABLE_STATUSES = [
    { value: 'en_attente', label: t('commandes.statuts.enAttente') }, { value: 'payee', label: t('commandes.statuts.payee') },
    { value: 'livree', label: t('commandes.statuts.livree') }, { value: 'annulee', label: t('commandes.statuts.annulee') }, { value: 'en_cours', label: t('commandes.statuts.enCours') },
  ];
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchCommandes(); }, [page]);

  const fetchCommandes = async () => {
    setLoading(true);
    try {
      const r = await api.get('/commandes/', { params: { page, taille: 20 } });
      setCommandes(r.data.commandes || []); setTotal(r.data.total || 0);
    } catch { toast.error(t('commandes.messages.erreurChargement')); } finally { setLoading(false); }
  };

  const handleUpdateStatus = async (commandeId, newStatus) => {
    setUpdating(true);
    try {
      await api.patch(`/commandes/${commandeId}/statut`, { statut: newStatus });
      toast.success(t('commandes.messages.statutMisAJour', { statut: STATUS_KEY[newStatus] ? t(`commandes.statuts.${STATUS_KEY[newStatus]}`) : newStatus }));
      fetchCommandes();
      if (selectedCommande?.id === commandeId) setSelectedCommande(p => ({ ...p, statut: newStatus }));
    } catch { toast.error(t('commandes.messages.erreurMiseAJour')); } finally { setUpdating(false); }
  };

  const handleDelete = async (commandeId) => {
    if (!window.confirm(t('commandes.messages.confirmSuppression'))) return;
    setDeleting(true);
    try {
      await commandesService.supprimerCommande(commandeId);
      toast.success(t('commandes.messages.achatSupprime'));
      if (selectedCommande?.id === commandeId) setShowModal(false);
      fetchCommandes();
    } catch { toast.error(t('commandes.messages.erreurSuppression')); } finally { setDeleting(false); }
  };

  const filtered = commandes.filter(c =>
    c.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.utilisateur?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.utilisateur?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.utilisateur?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(total / 20);

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="section-eyebrow">{t('commandes.eyebrow')}</span>
          <h1 className="section-title mt-2">{t('commandes.titre')}</h1>
          <p className="text-brown-400 text-sm mt-1">{t('commandes.achatAuTotal', { count: total })}</p>
        </div>
        <button onClick={fetchCommandes} className="btn-outline text-sm flex-shrink-0">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> {t('commandes.actualiser')}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-cream-200 p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-300" />
          <input type="text" placeholder={t('commandes.rechercherPlaceholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-10" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-terra-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-cream-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-cream-50 border-b border-cream-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brown-500 uppercase tracking-wider">{t('commandes.entetes.id')}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brown-500 uppercase tracking-wider">{t('commandes.entetes.client')}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brown-500 uppercase tracking-wider">{t('commandes.entetes.montant')}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brown-500 uppercase tracking-wider">{t('commandes.entetes.statut')}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brown-500 uppercase tracking-wider">{t('commandes.entetes.date')}</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-brown-500 uppercase tracking-wider">{t('commandes.entetes.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-cream-50 transition-colors">
                      <td className="px-4 py-3"><p className="font-mono text-sm font-semibold text-brown-800">{c.id?.slice(0, 8)}…</p></td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-brown-900 text-sm">{c.utilisateur?.prenom} {c.utilisateur?.nom}</p>
                        <p className="text-xs text-brown-400">{c.utilisateur?.email}</p>
                      </td>
                      <td className="px-4 py-3"><span className="font-bold text-brown-800 text-sm">{c.montant_total?.toLocaleString('fr-FR')} XAF</span></td>
                      <td className="px-4 py-3"><StatusBadge statut={c.statut} /></td>
                      <td className="px-4 py-3 text-brown-400 text-sm">{new Date(c.cree_le).toLocaleDateString('fr-FR')}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-1">
                          <button onClick={() => { setSelectedCommande(c); setShowModal(true); }} className="p-1.5 rounded-lg hover:bg-cream-100 transition-colors" title={t('commandes.voirDetailsTitle')}>
                            <Eye className="w-4 h-4 text-blue-600" />
                          </button>
                          <button onClick={() => handleDelete(c.id)} disabled={deleting} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50" title={t('commandes.supprimerTitle')}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-16 text-brown-300"><ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30" /><p className="text-sm">{t('commandes.aucunAchat')}</p></td></tr>
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

      {/* Modal détails */}
      {showModal && selectedCommande && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-cream-200">
              <div>
                <h2 className="font-playfair text-xl font-bold text-brown-950">{t('commandes.modal.detailsAchat')}</h2>
                <p className="text-xs text-brown-400 font-mono mt-0.5">ID: {selectedCommande.id}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-cream-100"><X className="w-5 h-5 text-brown-500" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-cream-50 rounded-xl p-4 grid grid-cols-2 gap-4">
                <div><p className="text-xs text-brown-400 mb-1">{t('commandes.modal.nomComplet')}</p><p className="font-semibold text-brown-900 text-sm">{selectedCommande.utilisateur?.prenom} {selectedCommande.utilisateur?.nom}</p></div>
                <div><p className="text-xs text-brown-400 mb-1">{t('commandes.modal.email')}</p><p className="font-semibold text-brown-900 text-sm">{selectedCommande.utilisateur?.email}</p></div>
                <div><p className="text-xs text-brown-400 mb-1">{t('commandes.modal.date')}</p><p className="font-semibold text-brown-900 text-sm">{new Date(selectedCommande.cree_le).toLocaleString('fr-FR')}</p></div>
                <div><p className="text-xs text-brown-400 mb-1">{t('commandes.modal.statut')}</p><StatusBadge statut={selectedCommande.statut} /></div>
              </div>

              <div>
                <p className="text-sm font-semibold text-brown-700 mb-3">{t('commandes.modal.changerLeStatut')}</p>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_STATUSES.map(s => (
                    <button key={s.value} onClick={() => handleUpdateStatus(selectedCommande.id, s.value)} disabled={updating || selectedCommande.statut === s.value}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${selectedCommande.statut === s.value ? 'bg-terra-500 text-white' : 'bg-cream-100 text-brown-700 hover:bg-cream-200'}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-brown-700 mb-3">{t('commandes.modal.articlesAchetes')}</p>
                <div className="space-y-2">
                  {selectedCommande.lignes?.map((ligne) => (
                    <div key={ligne.id} className="flex items-center gap-3 p-3 bg-cream-50 rounded-lg">
                      <div className="w-10 h-14 bg-cream-200 rounded overflow-hidden flex-shrink-0">
                        {ligne.livre?.couverture_url ? <img src={ligne.livre.couverture_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-4 h-4 text-brown-300" /></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-brown-900 text-sm truncate">{ligne.livre?.titre}</p>
                        <p className="text-xs text-brown-400">{ligne.livre?.auteur}</p>
                        <p className="text-xs text-brown-400">{t('commandes.modal.quantiteAbregee', { n: ligne.quantite })}</p>
                      </div>
                      <p className="font-bold text-brown-800 text-sm flex-shrink-0">{ligne.prix_unitaire?.toLocaleString('fr-FR')} XAF</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-cream-200 pt-4 flex items-center justify-between">
                <span className="font-bold text-brown-950 text-lg">{t('commandes.modal.total')}</span>
                <span className="font-playfair text-2xl font-bold text-terra-600">{selectedCommande.montant_total?.toLocaleString('fr-FR')} XAF</span>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => handleDelete(selectedCommande.id)} disabled={deleting} className="btn-outline text-sm text-red-600 border-red-200 hover:bg-red-50 disabled:opacity-50">
                  <Trash2 className="w-4 h-4" /> {t('commandes.modal.supprimer')}
                </button>
                <button onClick={() => window.print()} className="btn-outline text-sm"><Printer className="w-4 h-4" /> {t('commandes.modal.imprimer')}</button>
                <button onClick={() => setShowModal(false)} className="btn-primary text-sm">{t('commandes.modal.fermer')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default GestionCommandesPage;
