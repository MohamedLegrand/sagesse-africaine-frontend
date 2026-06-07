import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBook, FaBell, FaPalette, FaLanguage, FaGlobe, 
  FaEnvelope, FaMoon, FaSun, FaSave, FaArrowLeft 
} from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const ParametresPage = () => {
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      commandes: true,
      promotions: false,
      newsletter: true,
    },
    apparence: {
      theme: 'clair',
    },
    langue: 'fr',
  });

  useEffect(() => {
    // Charger les préférences depuis localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setSettings(prev => ({
        ...prev,
        apparence: { theme: savedTheme }
      }));
    }
  }, []);

  const handleNotificationChange = (key) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handleThemeChange = (theme) => {
    setSettings(prev => ({
      ...prev,
      apparence: { theme },
    }));
    localStorage.setItem('theme', theme);
    
    // Appliquer le thème (simulation)
    if (theme === 'sombre') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLangueChange = (e) => {
    setSettings(prev => ({
      ...prev,
      langue: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      // Sauvegarder les préférences
      localStorage.setItem('notifications', JSON.stringify(settings.notifications));
      localStorage.setItem('langue', settings.langue);
      
      // Appel API pour sauvegarder les préférences (si ton backend le supporte)
      // await api.post('/utilisateurs/me/preferences', settings);
      
      toast.success('Paramètres enregistrés avec succès');
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 fixed top-0 right-0 left-0 z-40">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-playfair font-bold text-amber-800">
            Paramètres
          </h1>
          <p className="text-amber-500 text-sm">
            Gérez vos préférences
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
            <Link to="/dashboard/profil" className="flex items-center gap-3 px-4 py-3 rounded-xl text-amber-700 hover:bg-amber-100 transition">
              <FaBook className="text-lg" />
              <span>Mon profil</span>
            </Link>
            <Link to="/dashboard/parametres" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg">
              <FaBell className="text-lg" />
              <span>Paramètres</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="ml-64 pt-24 p-6">
        <div className="container mx-auto max-w-4xl">
          <form onSubmit={handleSubmit}>
            {/* Notifications */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <FaBell className="text-amber-600 text-2xl" />
                <h2 className="text-xl font-playfair font-bold text-amber-800">
                  Notifications
                </h2>
              </div>
              
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-700">Notifications par email</p>
                    <p className="text-sm text-gray-400">Recevez des notifications par email</p>
                  </div>
                  <div 
                    onClick={() => handleNotificationChange('email')}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                      settings.notifications.email ? 'bg-amber-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                      settings.notifications.email ? 'right-1' : 'left-1'
                    }`} />
                  </div>
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-700">Commandes</p>
                    <p className="text-sm text-gray-400">Suivi de vos commandes</p>
                  </div>
                  <div 
                    onClick={() => handleNotificationChange('commandes')}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                      settings.notifications.commandes ? 'bg-amber-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                      settings.notifications.commandes ? 'right-1' : 'left-1'
                    }`} />
                  </div>
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-700">Promotions</p>
                    <p className="text-sm text-gray-400">Offres et réductions</p>
                  </div>
                  <div 
                    onClick={() => handleNotificationChange('promotions')}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                      settings.notifications.promotions ? 'bg-amber-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                      settings.notifications.promotions ? 'right-1' : 'left-1'
                    }`} />
                  </div>
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-700">Newsletter</p>
                    <p className="text-sm text-gray-400">Actualités de SAGESSE AFRICAINE</p>
                  </div>
                  <div 
                    onClick={() => handleNotificationChange('newsletter')}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                      settings.notifications.newsletter ? 'bg-amber-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                      settings.notifications.newsletter ? 'right-1' : 'left-1'
                    }`} />
                  </div>
                </label>
              </div>
            </div>

            {/* Apparence */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <FaPalette className="text-amber-600 text-2xl" />
                <h2 className="text-xl font-playfair font-bold text-amber-800">
                  Apparence
                </h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleThemeChange('clair')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-3 ${
                    settings.apparence.theme === 'clair'
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-amber-200 hover:border-amber-300'
                  }`}
                >
                  <FaSun className={`text-xl ${settings.apparence.theme === 'clair' ? 'text-amber-600' : 'text-gray-400'}`} />
                  <span className={settings.apparence.theme === 'clair' ? 'text-amber-700 font-medium' : 'text-gray-600'}>
                    Clair
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleThemeChange('sombre')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-3 ${
                    settings.apparence.theme === 'sombre'
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-amber-200 hover:border-amber-300'
                  }`}
                >
                  <FaMoon className={`text-xl ${settings.apparence.theme === 'sombre' ? 'text-amber-600' : 'text-gray-400'}`} />
                  <span className={settings.apparence.theme === 'sombre' ? 'text-amber-700 font-medium' : 'text-gray-600'}>
                    Sombre
                  </span>
                </button>
              </div>
            </div>

            {/* Langue */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <FaLanguage className="text-amber-600 text-2xl" />
                <h2 className="text-xl font-playfair font-bold text-amber-800">
                  Langue
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-amber-200 cursor-pointer hover:bg-amber-50 transition">
                  <input
                    type="radio"
                    name="langue"
                    value="fr"
                    checked={settings.langue === 'fr'}
                    onChange={handleLangueChange}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <FaGlobe className="text-amber-500" />
                  <span>Français</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-amber-200 cursor-pointer hover:bg-amber-50 transition">
                  <input
                    type="radio"
                    name="langue"
                    value="en"
                    checked={settings.langue === 'en'}
                    onChange={handleLangueChange}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <FaGlobe className="text-amber-500" />
                  <span>English</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-amber-200 cursor-pointer hover:bg-amber-50 transition">
                  <input
                    type="radio"
                    name="langue"
                    value="es"
                    checked={settings.langue === 'es'}
                    onChange={handleLangueChange}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <FaGlobe className="text-amber-500" />
                  <span>Español</span>
                </label>
              </div>
            </div>

            {/* Bouton sauvegarde */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updating}
                className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
              >
                {updating ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaSave />
                )}
                Enregistrer les paramètres
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ParametresPage;