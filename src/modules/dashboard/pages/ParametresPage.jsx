import React, { useState, useEffect } from 'react';
import { FaBell, FaPalette, FaLanguage, FaGlobe, FaMoon, FaSun, FaSave } from 'react-icons/fa';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';

const ParametresPage = () => {
  const [updating, setUpdating] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      commandes: true,
      promotions: false,
      newsletter: true,
    },
    apparence: { theme: 'clair' },
    langue: 'fr',
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) setSettings(prev => ({ ...prev, apparence: { theme: savedTheme } }));
  }, []);

  const handleNotificationChange = (key) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: !prev.notifications[key] },
    }));
  };

  const handleThemeChange = (theme) => {
    setSettings(prev => ({ ...prev, apparence: { theme } }));
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'sombre');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      localStorage.setItem('notifications', JSON.stringify(settings.notifications));
      localStorage.setItem('langue', settings.langue);
      toast.success('Paramètres enregistrés avec succès');
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setUpdating(false);
    }
  };

  const Toggle = ({ value, onChange }) => (
    <div
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${value ? 'bg-amber-600' : 'bg-gray-300'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${value ? 'right-1' : 'left-1'}`} />
    </div>
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-playfair font-bold text-amber-800">Paramètres</h1>
          <p className="text-amber-500 text-sm">Gérez vos préférences</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Notifications */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <FaBell className="text-amber-600 text-2xl" />
              <h2 className="text-xl font-playfair font-bold text-amber-800">Notifications</h2>
            </div>
            <div className="space-y-4">
              {[
                { key: 'email', label: 'Notifications par email', desc: 'Recevez des notifications par email' },
                { key: 'commandes', label: 'Commandes', desc: 'Suivi de vos commandes' },
                { key: 'promotions', label: 'Promotions', desc: 'Offres et réductions' },
                { key: 'newsletter', label: 'Newsletter', desc: 'Actualités de SAGESSE AFRICAINE' },
              ].map(item => (
                <label key={item.key} className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-700">{item.label}</p>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                  <Toggle
                    value={settings.notifications[item.key]}
                    onChange={() => handleNotificationChange(item.key)}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Apparence */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <FaPalette className="text-amber-600 text-2xl" />
              <h2 className="text-xl font-playfair font-bold text-amber-800">Apparence</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'clair', label: 'Clair', icon: FaSun },
                { value: 'sombre', label: 'Sombre', icon: FaMoon },
              ].map(theme => (
                <button
                  key={theme.value}
                  type="button"
                  onClick={() => handleThemeChange(theme.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-3 ${
                    settings.apparence.theme === theme.value
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-amber-200 hover:border-amber-300'
                  }`}
                >
                  <theme.icon className={`text-xl ${settings.apparence.theme === theme.value ? 'text-amber-600' : 'text-gray-400'}`} />
                  <span className={settings.apparence.theme === theme.value ? 'text-amber-700 font-medium' : 'text-gray-600'}>
                    {theme.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Langue */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <FaLanguage className="text-amber-600 text-2xl" />
              <h2 className="text-xl font-playfair font-bold text-amber-800">Langue</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: 'fr', label: 'Français' },
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Español' },
              ].map(lang => (
                <label key={lang.value} className="flex items-center gap-3 p-3 rounded-xl border border-amber-200 cursor-pointer hover:bg-amber-50 transition">
                  <input
                    type="radio"
                    name="langue"
                    value={lang.value}
                    checked={settings.langue === lang.value}
                    onChange={() => setSettings(prev => ({ ...prev, langue: lang.value }))}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <FaGlobe className="text-amber-500" />
                  <span>{lang.label}</span>
                </label>
              ))}
            </div>
          </div>

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
    </DashboardLayout>
  );
};

export default ParametresPage;
