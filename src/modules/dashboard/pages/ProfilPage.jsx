import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUser, FaBook, FaHeart, FaShoppingCart, FaDownload,
  FaCog, FaUserCircle
} from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';

const ProfilPage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profil');
  const [loading, setLoading] = useState(true);
  const [livresAchetes, setLivresAchetes] = useState([]);
  const [favoris] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [telechargements, setTelechargements] = useState([]);
  const [stats, setStats] = useState({ livresAchetes: 0, commandes: 0, telechargements: 0, favoris: 0 });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [userRes, accesRes, commandesRes, telechRes] = await Promise.all([
        api.get('/utilisateurs/me'),
        api.get('/acces-livres/mes-acces'),
        api.get('/commandes/mes-commandes'),
        api.get('/historique-telechargements/mes-telechargements'),
      ]);
      setUser(userRes.data);

      const livres = accesRes.data.acces || [];
      setLivresAchetes(livres);

      const commandesData = commandesRes.data.commandes || [];
      setCommandes(commandesData);

      const telechs = telechRes.data.historique || [];
      setTelechargements(telechs);

      setStats({
        livresAchetes: livres.length,
        commandes: commandesData.length,
        telechargements: telechs.length,
        favoris: 0,
      });
    } catch (error) {
      console.error('Erreur chargement:', error);
      toast.error('Erreur chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profil', label: 'Mon profil', icon: FaUser },
    { id: 'bibliotheque', label: 'Mes livres', icon: FaBook, count: stats.livresAchetes },
    { id: 'favoris', label: 'Mes favoris', icon: FaHeart, count: stats.favoris },
    { id: 'commandes', label: 'Mes commandes', icon: FaShoppingCart, count: stats.commandes },
    { id: 'telechargements', label: 'Téléchargements', icon: FaDownload, count: stats.telechargements },
    { id: 'parametres', label: 'Paramètres', icon: FaCog },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profil': return <ProfilContent user={user} />;
      case 'bibliotheque': return <BibliothequeContent livres={livresAchetes} />;
      case 'favoris': return <FavorisContent />;
      case 'commandes': return <CommandesContent commandes={commandes} />;
      case 'telechargements': return <TelechargementsContent telechargements={telechargements} />;
      case 'parametres': return <ParametresContent user={user} onUpdate={fetchAllData} />;
      default: return <ProfilContent user={user} />;
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-playfair font-bold text-amber-800 mb-4">Mon espace</h1>
          <div className="flex items-center justify-center gap-2">
            <div className="w-16 h-px bg-amber-300"></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            <div className="w-16 h-px bg-amber-300"></div>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg'
                  : 'bg-white text-amber-700 hover:bg-amber-100'
              }`}
            >
              <tab.icon className="text-sm" />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1 text-xs bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Contenu */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-100 p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

// ==================== SUB-COMPONENTS ====================

const ProfilContent = ({ user }) => (
  <div className="space-y-6">
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center overflow-hidden">
        {user?.avatar_url ? (
          <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <FaUserCircle className="text-amber-500 text-5xl" />
        )}
      </div>
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-playfair font-bold text-amber-800">{user?.prenom} {user?.nom}</h2>
        <p className="text-amber-500">{user?.email}</p>
        <p className="text-sm text-gray-400">
          Membre depuis {user?.cree_le ? new Date(user.cree_le).toLocaleDateString('fr-FR') : '—'}
        </p>
        <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
          user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
        }`}>
          {user?.role === 'admin' ? 'Administrateur' : 'Membre'}
        </span>
      </div>
    </div>
  </div>
);

const BibliothequeContent = ({ livres }) => {
  const handleDownload = async (livreId, livreTitre) => {
    try {
      const fichiersRes = await api.get(`/fichiers-livres/${livreId}`);
      const fichiers = fichiersRes.data.fichiers || [];
      if (fichiers.length > 0) {
        const response = await api.get(`/fichiers-livres/${livreId}/telecharger/${fichiers[0].id}`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${livreTitre}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success('Téléchargement commencé');
      }
    } catch {
      toast.error('Erreur lors du téléchargement');
    }
  };

  if (livres.length === 0) {
    return (
      <div className="text-center py-12">
        <FaBook className="text-amber-300 text-6xl mx-auto mb-4" />
        <h3 className="text-xl font-playfair text-amber-700 mb-2">Aucun livre</h3>
        <p className="text-gray-500">Vous n'avez pas encore acheté de livres</p>
        <Link to="/dashboard/boutique" className="inline-block mt-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-2 rounded-full">
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {livres.map((access) => {
        const livre = access.livre;
        return (
          <div key={access.id} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow hover:shadow-md transition">
            <div className="w-16 h-20 bg-amber-100 rounded-lg flex items-center justify-center overflow-hidden">
              {livre?.couverture_url ? (
                <img src={livre.couverture_url} alt={livre.titre} className="w-full h-full object-cover" />
              ) : (
                <FaBook className="text-amber-400 text-2xl" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-800">{livre?.titre || 'Titre inconnu'}</h3>
              <p className="text-sm text-amber-500">{livre?.auteur || 'Auteur inconnu'}</p>
              <p className="text-xs text-gray-400">
                Ajouté le {new Date(access.accorde_le).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div className="flex gap-2">
              <Link to={`/dashboard/livre/${access.livre_id}`} className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm hover:bg-amber-200 transition">
                Lire
              </Link>
              <button onClick={() => handleDownload(access.livre_id, livre?.titre)} className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg text-sm hover:shadow-lg transition">
                Télécharger
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const FavorisContent = () => (
  <div className="text-center py-12">
    <FaHeart className="text-amber-300 text-6xl mx-auto mb-4" />
    <h3 className="text-xl font-playfair text-amber-700 mb-2">Mes favoris</h3>
    <p className="text-gray-500">Fonctionnalité à venir</p>
  </div>
);

const CommandesContent = ({ commandes }) => {
  const getStatusColor = (statut) => {
    const colors = {
      'payé': 'bg-green-100 text-green-700',
      'livré': 'bg-blue-100 text-blue-700',
      'en_attente': 'bg-amber-100 text-amber-700',
      'annulé': 'bg-red-100 text-red-700',
    };
    return colors[statut] || 'bg-gray-100 text-gray-700';
  };

  if (commandes.length === 0) {
    return (
      <div className="text-center py-12">
        <FaShoppingCart className="text-amber-300 text-6xl mx-auto mb-4" />
        <h3 className="text-xl font-playfair text-amber-700 mb-2">Aucune commande</h3>
        <p className="text-gray-500">Vous n'avez pas encore passé de commande</p>
        <Link to="/dashboard/boutique" className="inline-block mt-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-2 rounded-full">
          Commander maintenant
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {commandes.map((commande) => (
        <div key={commande.id} className="border border-amber-100 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="font-mono text-sm text-amber-800">{commande.id?.slice(0, 8)}...</p>
              <p className="text-xs text-gray-400">{new Date(commande.cree_le).toLocaleDateString('fr-FR')}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-amber-700">{commande.montant_total?.toLocaleString()} FCFA</p>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(commande.statut)}`}>
                {commande.statut || 'En cours'}
              </span>
            </div>
          </div>
          <div className="border-t border-amber-100 pt-3">
            <p className="text-sm text-gray-500 mb-2">Articles commandés :</p>
            <div className="space-y-1">
              {commande.lignes?.map((ligne) => (
                <div key={ligne.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{ligne.livre?.titre} x{ligne.quantite}</span>
                  <span className="text-amber-600">{(ligne.prix_unitaire * ligne.quantite)?.toLocaleString()} FCFA</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const TelechargementsContent = ({ telechargements }) => {
  if (telechargements.length === 0) {
    return (
      <div className="text-center py-12">
        <FaDownload className="text-amber-300 text-6xl mx-auto mb-4" />
        <h3 className="text-xl font-playfair text-amber-700 mb-2">Aucun téléchargement</h3>
        <p className="text-gray-500">Vous n'avez pas encore téléchargé de livres</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-amber-50">
          <tr>
            {['Livre', 'Format', 'Date', 'Appareil', 'Action'].map(h => (
              <th key={h} className="text-left p-3 text-amber-700">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {telechargements.map((t) => (
            <tr key={t.id} className="border-b border-amber-100">
              <td className="p-3">
                <p className="font-medium text-amber-800">{t.livre?.titre || 'Inconnu'}</p>
                <p className="text-xs text-gray-500">{t.livre?.auteur}</p>
              </td>
              <td className="p-3">
                <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                  {t.format?.toUpperCase() || 'PDF'}
                </span>
              </td>
              <td className="p-3 text-gray-600">{new Date(t.telecharge_le).toLocaleDateString('fr-FR')}</td>
              <td className="p-3 text-gray-600">{t.appareil || 'Inconnu'}</td>
              <td className="p-3 text-center">
                <Link to={`/dashboard/livre/${t.livre_id}`} className="text-amber-600 hover:text-amber-700">Voir</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ParametresContent = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({ prenom: user?.prenom || '', nom: user?.nom || '' });
  const [passwordData, setPasswordData] = useState({ ancien_mot_de_passe: '', nouveau_mot_de_passe: '', confirmation: '' });
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [updating, setUpdating] = useState(false);

  const handleAvatarUpdate = async (e) => {
    e.preventDefault();
    if (!avatarUrl.trim()) return;
    setUpdating(true);
    try {
      await api.patch('/utilisateurs/me/avatar', { avatar_url: avatarUrl });
      toast.success('Avatar mis à jour');
      onUpdate();
    } catch {
      toast.error("Erreur lors de la mise à jour de l'avatar");
    } finally {
      setUpdating(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await api.put('/utilisateurs/me', formData);
      toast.success('Profil mis à jour');
      onUpdate();
    } catch {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.nouveau_mot_de_passe !== passwordData.confirmation) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    setUpdating(true);
    try {
      await api.patch('/utilisateurs/me/mot-de-passe', {
        ancien_mot_de_passe: passwordData.ancien_mot_de_passe,
        nouveau_mot_de_passe: passwordData.nouveau_mot_de_passe,
      });
      toast.success('Mot de passe modifié');
      setPasswordData({ ancien_mot_de_passe: '', nouveau_mot_de_passe: '', confirmation: '' });
    } catch {
      toast.error('Ancien mot de passe incorrect');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Avatar */}
      <div>
        <h3 className="text-lg font-playfair font-bold text-amber-800 mb-4">Photo de profil</h3>
        <form onSubmit={handleAvatarUpdate} className="flex gap-3 max-w-md items-center">
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="URL de votre avatar..."
            className="flex-1 px-4 py-2 border border-amber-200 rounded-lg focus:border-amber-500 outline-none text-sm"
          />
          <button type="submit" disabled={updating} className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition text-sm">
            Mettre à jour
          </button>
        </form>
      </div>

      <div className="border-t border-amber-100 pt-6">
        <h3 className="text-lg font-playfair font-bold text-amber-800 mb-4">Informations personnelles</h3>
        <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-amber-700 text-sm mb-1">Prénom</label>
              <input
                type="text"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-amber-700 text-sm mb-1">Nom</label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:border-amber-500 outline-none"
              />
            </div>
          </div>
          <button type="submit" disabled={updating} className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition">
            {updating ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      </div>

      <div className="border-t border-amber-100 pt-6">
        <h3 className="text-lg font-playfair font-bold text-amber-800 mb-4">Changer mon mot de passe</h3>
        <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
          {[
            { field: 'ancien_mot_de_passe', label: 'Ancien mot de passe' },
            { field: 'nouveau_mot_de_passe', label: 'Nouveau mot de passe' },
            { field: 'confirmation', label: 'Confirmer le mot de passe' },
          ].map(({ field, label }) => (
            <div key={field}>
              <label className="block text-amber-700 text-sm mb-1">{label}</label>
              <input
                type="password"
                value={passwordData[field]}
                onChange={(e) => setPasswordData({ ...passwordData, [field]: e.target.value })}
                className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:border-amber-500 outline-none"
                required
              />
            </div>
          ))}
          <button type="submit" disabled={updating} className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition">
            {updating ? 'Modification...' : 'Modifier le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilPage;
