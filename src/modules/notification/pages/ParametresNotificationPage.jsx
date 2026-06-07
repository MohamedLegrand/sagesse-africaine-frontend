import React, { useState } from 'react';
import { FaBell, FaEnvelope, FaShoppingCart, FaBook, FaUserCheck } from 'react-icons/fa';
import Header from '../../visiteur/components/Header';
import Footer from '../../visiteur/components/Footer';
import toast from 'react-hot-toast';

const ParametresNotificationPage = () => {
  const [settings, setSettings] = useState({
    email_commandes: true,
    email_promotions: false,
    email_newsletter: true,
    email_publications: true,
    inapp_commandes: true,
    inapp_messages: true,
    inapp_publications: true
  });

  const [loading, setLoading] = useState(false);

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Appel API pour sauvegarder les préférences
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Préférences enregistrées');
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    {
      title: 'Notifications par email',
      icon: FaEnvelope,
      items: [
        { key: 'email_commandes', label: 'Commandes', description: 'Confirmation et suivi des commandes' },
        { key: 'email_promotions', label: 'Promotions', description: 'Offres spéciales et réductions' },
        { key: 'email_newsletter', label: 'Newsletter', description: 'Actualités de SAGESSE AFRICAINE' },
        { key: 'email_publications', label: 'Nouvelles publications', description: 'Nouveaux livres ajoutés' }
      ]
    },
    {
      title: 'Notifications in-app',
      icon: FaBell,
      items: [
        { key: 'inapp_commandes', label: 'Commandes', description: 'Mises à jour de vos commandes' },
        { key: 'inapp_messages', label: 'Messages', description: 'Messages de l\'équipe' },
        { key: 'inapp_publications', label: 'Publications', description: 'Nouveautés éditoriales' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* En-tête */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-amber-800 mb-4">
              Préférences de notification
            </h1>
            <p className="text-amber-500 text-lg">
              Gérez comment vous souhaitez être notifié
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-16 h-px bg-amber-300"></div>
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <div className="w-16 h-px bg-amber-300"></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {sections.map((section, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <section.icon className="text-amber-600 text-xl" />
                  </div>
                  <h2 className="text-xl font-playfair font-bold text-amber-800">
                    {section.title}
                  </h2>
                </div>
                
                <div className="space-y-4">
                  {section.items.map((item) => (
                    <label key={item.key} className="flex justify-between items-center cursor-pointer p-3 rounded-xl hover:bg-amber-50 transition">
                      <div>
                        <p className="font-medium text-gray-700">{item.label}</p>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                      <div
                        onClick={() => handleToggle(item.key)}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                          settings[item.key] ? 'bg-amber-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                          settings[item.key] ? 'right-1' : 'left-1'
                        }`} />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer les préférences'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ParametresNotificationPage;