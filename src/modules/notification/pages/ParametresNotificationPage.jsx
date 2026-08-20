import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBell, FaEnvelope, FaShoppingCart, FaBook, FaUserCheck } from 'react-icons/fa';
import Header from '../../visiteur/components/Header';
import Footer from '../../visiteur/components/Footer';
import toast from 'react-hot-toast';

const ParametresNotificationPage = () => {
  const { t } = useTranslation('notifications');
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
      toast.success(t('parametres.messages.enregistre'));
    } catch (error) {
      toast.error(t('parametres.messages.erreur'));
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    {
      title: t('parametres.email.titre'),
      icon: FaEnvelope,
      items: [
        { key: 'email_commandes', label: t('parametres.email.achats.label'), description: t('parametres.email.achats.desc') },
        { key: 'email_promotions', label: t('parametres.email.promotions.label'), description: t('parametres.email.promotions.desc') },
        { key: 'email_newsletter', label: t('parametres.email.newsletter.label'), description: t('parametres.email.newsletter.desc') },
        { key: 'email_publications', label: t('parametres.email.publications.label'), description: t('parametres.email.publications.desc') }
      ]
    },
    {
      title: t('parametres.inapp.titre'),
      icon: FaBell,
      items: [
        { key: 'inapp_commandes', label: t('parametres.inapp.achats.label'), description: t('parametres.inapp.achats.desc') },
        { key: 'inapp_messages', label: t('parametres.inapp.messages.label'), description: t('parametres.inapp.messages.desc') },
        { key: 'inapp_publications', label: t('parametres.inapp.publications.label'), description: t('parametres.inapp.publications.desc') }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-cream-100">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* En-tête */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-brown-800 mb-4">
              {t('parametres.titre')}
            </h1>
            <p className="text-terra-500 text-lg">
              {t('parametres.sousTitre')}
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-16 h-px bg-cream-300"></div>
              <div className="w-2 h-2 bg-terra-400 rounded-full"></div>
              <div className="w-16 h-px bg-cream-300"></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {sections.map((section, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-cream-100 rounded-lg">
                    <section.icon className="text-terra-600 text-xl" />
                  </div>
                  <h2 className="text-xl font-playfair font-bold text-brown-800">
                    {section.title}
                  </h2>
                </div>
                
                <div className="space-y-4">
                  {section.items.map((item) => (
                    <label key={item.key} className="flex justify-between items-center cursor-pointer p-3 rounded-xl hover:bg-cream-50 transition">
                      <div>
                        <p className="font-medium text-gray-700">{item.label}</p>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                      <div
                        onClick={() => handleToggle(item.key)}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                          settings[item.key] ? 'bg-terra-600' : 'bg-gray-300'
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
                className="bg-gradient-to-r from-terra-600 to-terra-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
              >
                {loading ? t('parametres.enregistrementEnCours') : t('parametres.enregistrer')}
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