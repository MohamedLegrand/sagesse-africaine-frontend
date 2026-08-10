import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Search, Edit2, Trash2, Check, X, UserCog, Ban, UserCheck } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';

const GestionUtilisateursPage = () => {
  const { t } = useTranslation('admin');
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ prenom: '', nom: '', email: '', mot_de_passe: '', role: 'utilisateur' });
  const [submitting, setSubmitting] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => { fetchUtilisateurs(); }, [page]);

  const fetchUtilisateurs = async () => {
    setLoading(true);
    try {
      const r = await api.get('/utilisateurs/', { params: { page, taille: 20 } });
      setUtilisateurs(r.data.utilisateurs || []); setTotal(r.data.total || 0);
    } catch { toast.error(t('utilisateurs.messages.erreurChargement')); } finally { setLoading(false); }
  };

  const handleInputChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({ prenom: '', nom: '', email: '', mot_de_passe: '', role: 'utilisateur' });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({ prenom: user.prenom || '', nom: user.nom || '', email: user.email || '', mot_de_passe: '', role: user.role || 'utilisateur' });
    setShowModal(true);
  };

  const openRoleModal = (user) => { setSelectedUser(user); setNewRole(user.role); setShowRoleModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      if (editingUser) { await api.put(`/utilisateurs/${editingUser.id}`, { prenom: formData.prenom, nom: formData.nom }); toast.success(t('utilisateurs.messages.utilisateurModifie')); }
      else { await api.post('/utilisateurs/', { email: formData.email, mot_de_passe: formData.mot_de_passe, prenom: formData.prenom, nom: formData.nom }); toast.success(t('utilisateurs.messages.utilisateurCree')); }
      setShowModal(false); fetchUtilisateurs();
    } catch { toast.error(t('utilisateurs.messages.erreurSauvegarde')); } finally { setSubmitting(false); }
  };

  const handleChangeRole = async () => {
    if (!selectedUser) return; setSubmitting(true);
    try {
      await api.patch(`/utilisateurs/${selectedUser.id}/role`, { role: newRole });
      toast.success(t('utilisateurs.messages.roleChangeEn', { role: newRole === 'admin' ? t('utilisateurs.modalRole.administrateur') : t('utilisateurs.modalRole.utilisateur') }));
      setShowRoleModal(false); fetchUtilisateurs();
    } catch { toast.error(t('utilisateurs.messages.erreurChangementRole')); } finally { setSubmitting(false); }
  };

  const handleToggleActivation = async (user) => {
    try {
      if (user.est_actif) { await api.patch(`/utilisateurs/${user.id}/desactiver`); toast.success(t('utilisateurs.messages.utilisateurDesactive')); }
      else { await api.patch(`/utilisateurs/${user.id}/activer`); toast.success(t('utilisateurs.messages.utilisateurActive')); }
      fetchUtilisateurs();
    } catch { toast.error(t('utilisateurs.messages.erreur')); }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(t('utilisateurs.messages.confirmSuppression', { nom: `${user.prenom} ${user.nom}` }))) return;
    try { await api.delete(`/utilisateurs/${user.id}`); toast.success(t('utilisateurs.messages.supprime')); fetchUtilisateurs(); }
    catch { toast.error(t('utilisateurs.messages.erreurSuppression')); }
  };

  const filtered = utilisateurs.filter(u =>
    u.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(total / 20);

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="section-eyebrow">{t('utilisateurs.eyebrow')}</span>
          <h1 className="section-title mt-2">{t('utilisateurs.titre')}</h1>
          <p className="text-brown-400 text-sm mt-1">{t('utilisateurs.membreAuTotal', { count: total })}</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary text-sm flex-shrink-0">
          <Users className="w-4 h-4" /> {t('utilisateurs.nouvelUtilisateur')}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-cream-200 p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-300" />
          <input type="text" placeholder={t('utilisateurs.rechercherPlaceholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-10" />
        </div>
      </div>

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
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brown-500 uppercase tracking-wider">{t('utilisateurs.entetes.utilisateur')}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brown-500 uppercase tracking-wider">{t('utilisateurs.entetes.email')}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brown-500 uppercase tracking-wider">{t('utilisateurs.entetes.role')}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brown-500 uppercase tracking-wider">{t('utilisateurs.entetes.statut')}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brown-500 uppercase tracking-wider">{t('utilisateurs.entetes.inscription')}</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-brown-500 uppercase tracking-wider">{t('utilisateurs.entetes.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {filtered.map((user) => (
                    <tr key={user.id} className="hover:bg-cream-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-terra-100 flex items-center justify-center flex-shrink-0">
                            {user.avatar_url ? (
                              <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <span className="text-terra-700 font-bold text-xs">{`${user.prenom?.[0] || ''}${user.nom?.[0] || ''}`.toUpperCase()}</span>
                            )}
                          </div>
                          <p className="font-semibold text-brown-900 text-sm">{user.prenom} {user.nom}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-brown-500 text-sm">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.role === 'admin' ? 'bg-brown-100 text-brown-700' : 'bg-blue-50 text-blue-700'}`}>
                          {user.role === 'admin' ? t('utilisateurs.admin') : t('utilisateurs.membre')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.est_actif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {user.est_actif ? t('utilisateurs.actif') : t('utilisateurs.inactif')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-brown-400 text-sm">{new Date(user.cree_le).toLocaleDateString('fr-FR')}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-1">
                          <button onClick={() => openRoleModal(user)} className="p-1.5 rounded-lg hover:bg-cream-100 transition-colors" title={t('utilisateurs.changerRoleTitle')}><UserCog className="w-4 h-4 text-purple-600" /></button>
                          <button onClick={() => handleToggleActivation(user)} className="p-1.5 rounded-lg hover:bg-cream-100 transition-colors" title={user.est_actif ? t('utilisateurs.desactiverTitle') : t('utilisateurs.activerTitle')}>
                            {user.est_actif ? <Ban className="w-4 h-4 text-orange-500" /> : <UserCheck className="w-4 h-4 text-green-600" />}
                          </button>
                          <button onClick={() => openEditModal(user)} className="p-1.5 rounded-lg hover:bg-cream-100 transition-colors" title={t('utilisateurs.modifierTitle')}><Edit2 className="w-4 h-4 text-blue-600" /></button>
                          <button onClick={() => handleDelete(user)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" title={t('utilisateurs.supprimerTitle')}><Trash2 className="w-4 h-4 text-red-500" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-16 text-brown-300"><Users className="w-10 h-10 mx-auto mb-2 opacity-30" /><p className="text-sm">{t('utilisateurs.aucunUtilisateur')}</p></td></tr>
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

      {/* Modal utilisateur */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-cream-200">
              <h2 className="font-playfair text-xl font-bold text-brown-950">{editingUser ? t('utilisateurs.modal.modifier') : t('utilisateurs.modal.ajouterUnUtilisateur')}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-cream-100"><X className="w-5 h-5 text-brown-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="input-label">{t('utilisateurs.modal.prenomLabel')}</label><input type="text" name="prenom" value={formData.prenom} onChange={handleInputChange} required className="input-field" /></div>
                <div><label className="input-label">{t('utilisateurs.modal.nomLabel')}</label><input type="text" name="nom" value={formData.nom} onChange={handleInputChange} required className="input-field" /></div>
              </div>
              <div><label className="input-label">{t('utilisateurs.modal.emailLabel')}</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} required disabled={!!editingUser} className="input-field disabled:opacity-60" /></div>
              {!editingUser && <div><label className="input-label">{t('utilisateurs.modal.motDePasseLabel')}</label><input type="password" name="mot_de_passe" value={formData.mot_de_passe} onChange={handleInputChange} required className="input-field" /></div>}
              <div className="flex justify-end gap-3 pt-4 border-t border-cream-200">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline text-sm">{t('commun.annuler')}</button>
                <button type="submit" disabled={submitting} className="btn-primary text-sm disabled:opacity-60">
                  {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                  {editingUser ? t('commun.modifier') : t('commun.creer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal rôle */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-cream-200">
              <div><h2 className="font-playfair text-xl font-bold text-brown-950">{t('utilisateurs.modalRole.titre')}</h2><p className="text-brown-400 text-sm mt-0.5">{selectedUser.prenom} {selectedUser.nom}</p></div>
              <button onClick={() => setShowRoleModal(false)} className="p-1.5 rounded-lg hover:bg-cream-100"><X className="w-5 h-5 text-brown-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="input-label">{t('utilisateurs.modalRole.roleLabel')}</label><select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="input-field"><option value="utilisateur">{t('utilisateurs.modalRole.utilisateur')}</option><option value="admin">{t('utilisateurs.modalRole.administrateur')}</option></select></div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowRoleModal(false)} className="btn-outline text-sm">{t('commun.annuler')}</button>
                <button onClick={handleChangeRole} disabled={submitting} className="btn-primary text-sm disabled:opacity-60">
                  {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />} {t('commun.confirmer')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default GestionUtilisateursPage;
