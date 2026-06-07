import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBook, FaUser, FaEnvelope, FaLock, FaSave, 
  FaUserCircle, FaCamera, FaArrowLeft 
} from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const ProfilPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    ancien_mot_de_passe: '',
    nouveau_mot_de_passe: '',
    confirmation: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    fetchProfil();
  }, []);

  const fetchProfil = async () => {
    try {
      const response = await api.get('/utilisateurs/me');
      setUser(response.data);
      setFormData({
        prenom: response.data.prenom || '',
        nom: response.data.nom || '',
        email: response.data.email || '',
      });
    } catch (error) {
      console.error('Erreur chargement profil:', error);
      toast.error('Erreur chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const updateProfil = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const response = await api.put('/utilisateurs/me', {
        prenom: formData.prenom,
        nom: formData.nom,
      });
      setUser(response.data);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setUpdating(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.nouveau_mot_de_passe !== passwordData.confirmation) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (passwordData.nouveau_mot_de_passe.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    setUpdating(true);
    try {
      await api.patch('/utilisateurs/me/mot-de-passe', {
        ancien_mot_de_passe: passwordData.ancien_mot_de_passe,
        nouveau_mot_de_passe: passwordData.nouveau_mot_de_passe,
      });
      toast.success('Mot de passe mis à jour');
      setPasswordData({
        ancien_mot_de_passe: '',
        nouveau_mot_de_passe: '',
        confirmation: '',
      });
      setShowPasswordForm(false);
    } catch (error) {
      console.error('Erreur changement mot de passe:', error);
      if (error.response?.status === 401) {
        toast.error('Ancien mot de passe incorrect');
      } else {
        toast.error('Erreur lors du changement');
      }
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-amber-100">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 fixed top-0 right-0 left-0 z-40">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-playfair font-bold text-amber-800">
            Mon profil
          </h1>
          <p className="text-amber-500 text-sm">
            Gérez vos informations personnelles
          </p>
        </div>
      </header>

      {/* Menu latéral */}
      <aside className="w-64 bg-white/80 backdrop-blur-sm border-r border-amber-200 min-h-screen fixed left-0 top-0 pt-24">
        <div className="px-4 py-6">
          <nav className="space-y-1">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-amber-700 hover:bg-amber-100 transition">
              <FaBook className="text-lg" />
              <span>Tableau de bord</span>
            </Link>
            <Link to="/dashboard/boutique" className="flex items-center gap-3 px-4 py-3 rounded-xl text-amber-700 hover:bg-amber-100 transition">
              <FaBook className="text-lg" />
              <span>Boutique</span>
            </Link>
            <Link to="/dashboard/bibliotheque" className="flex items-center gap-3 px-4 py-3 rounded-xl text-amber-700 hover:bg-amber-100 transition">
              <FaBook className="text-lg" />
              <span>Ma bibliothèque</span>
            </Link>
            <Link to="/dashboard/historique" className="flex items-center gap-3 px-4 py-3 rounded-xl text-amber-700 hover:bg-amber-100 transition">
              <FaBook className="text-lg" />
              <span>Historique</span>
            </Link>
            <Link to="/dashboard/profil" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg">
              <FaUser className="text-lg" />
              <span>Mon profil</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="ml-64 pt-24 p-6">
        <div className="container mx-auto max-w-4xl">
          {/* Avatar et infos */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
            <div className="relative inline-block">
              <div className="w-28 h-28 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <FaUserCircle className="text-amber-400 text-7xl" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 bg-amber-600 text-white p-2 rounded-full hover:bg-amber-700 transition">
                <FaCamera className="text-sm" />
              </button>
            </div>
            <h2 className="text-2xl font-playfair font-bold text-amber-800 mt-4">
              {user?.prenom} {user?.nom}
            </h2>
            <p className="text-amber-500">{user?.email}</p>
            <p className="text-sm text-gray-400 mt-1">
              Membre depuis {new Date(user?.cree_le).toLocaleDateString('fr-FR')}
            </p>
          </div>

          {/* Formulaire profil */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-xl font-playfair font-bold text-amber-800 mb-6">
              Informations personnelles
            </h3>
            <form onSubmit={updateProfil}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-amber-700 text-sm font-medium mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-amber-700 text-sm font-medium mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-amber-700 text-sm font-medium mb-2">
                  Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400" />
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl bg-amber-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">L'email ne peut pas être modifié</p>
              </div>
              <button
                type="submit"
                disabled={updating}
                className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
              >
                {updating ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaSave />
                )}
                Enregistrer les modifications
              </button>
            </form>
          </div>

          {/* Changement mot de passe */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-playfair font-bold text-amber-800">
                Mot de passe
              </h3>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="text-amber-600 hover:text-amber-700 text-sm font-medium"
              >
                {showPasswordForm ? 'Annuler' : 'Changer mon mot de passe'}
              </button>
            </div>

            {showPasswordForm && (
              <form onSubmit={updatePassword}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-amber-700 text-sm font-medium mb-2">
                      Ancien mot de passe
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400" />
                      <input
                        type="password"
                        name="ancien_mot_de_passe"
                        value={passwordData.ancien_mot_de_passe}
                        onChange={handlePasswordChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-amber-700 text-sm font-medium mb-2">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400" />
                      <input
                        type="password"
                        name="nouveau_mot_de_passe"
                        value={passwordData.nouveau_mot_de_passe}
                        onChange={handlePasswordChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-amber-700 text-sm font-medium mb-2">
                      Confirmer le nouveau mot de passe
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400" />
                      <input
                        type="password"
                        name="confirmation"
                        value={passwordData.confirmation}
                        onChange={handlePasswordChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={updating}
                    className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {updating ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FaLock />
                    )}
                    Changer le mot de passe
                  </button>
                </div>
              </form>
            )}

            {!showPasswordForm && (
              <p className="text-gray-500 text-sm">
                Sécurisez votre compte en changeant régulièrement votre mot de passe.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilPage;