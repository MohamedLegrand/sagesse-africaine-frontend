import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, Shield, Library, Users } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FormulaireConnexion from '../components/FormulaireConnexion';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import guestCart from '../../../services/guestCart';

const BENEFITS_META = [
  { icon: Library,  cle: 'bibliotheque' },
  { icon: BookOpen, cle: 'lecture' },
  { icon: Users,    cle: 'communaute' },
  { icon: Shield,   cle: 'paiement' },
];

const ConnexionPage = () => {
  const { t } = useTranslation('auth');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        mot_de_passe: formData.mot_de_passe,
      });

      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;

      const userResponse = await api.get('/utilisateurs/me');
      const user = userResponse.data;
      localStorage.setItem('user_role', user.role);

      toast.success(t('messages.connexionReussie'));

      const guestItems = guestCart.getItems();
      if (guestItems.length > 0) {
        await Promise.all(
          guestItems.map(item =>
            api.post('/panier/ajouter', { livre_id: item.livre_id, quantite: item.quantite }).catch(() => {})
          )
        );
        guestCart.clear();
        toast.success(t('messages.articlesTransferes', { count: guestItems.length }));
      }

      const returnTo = localStorage.getItem('auth_return_to');
      if (returnTo) {
        localStorage.removeItem('auth_return_to');
        navigate(returnTo);
        return;
      }

      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error(t('messages.emailMotDePasseIncorrect'));
      } else if (error.response?.status === 422) {
        toast.error(t('messages.donneesInvalides'));
      } else {
        toast.error(t('messages.erreurConnexion'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-24 md:pt-28">
        <div className="min-h-[calc(100vh-80px)] grid grid-cols-1 lg:grid-cols-2">

          {/* Colonne gauche — visuel */}
          <div className="hidden lg:flex flex-col justify-between bg-brown-950 p-12 xl:p-16">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="SAGESSE AFRICAINE"
                className="h-14 w-auto brightness-0 invert"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <span className="font-playfair text-white font-bold text-xl">SAGESSE AFRICAINE</span>
                <div className="h-0.5 w-8 bg-gold-400 mt-1" />
              </div>
            </Link>

            <div>
              <blockquote className="font-playfair italic text-2xl text-white leading-relaxed mb-4">
                {t('connexion.citation')}
              </blockquote>
              <cite className="text-brown-400 text-sm not-italic">{t('connexion.citationAuteur')}</cite>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {BENEFITS_META.map(({ icon: Icon, cle }) => (
                <div key={cle} className="flex items-start gap-2.5 bg-brown-900 rounded-xl p-3">
                  <Icon className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                  <span className="text-brown-200 text-xs leading-relaxed">{t(`connexion.avantages.${cle}`)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Colonne droite — formulaire */}
          <div className="flex items-center justify-center p-6 sm:p-10 bg-cream-50">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <h1 className="font-playfair text-3xl font-bold text-brown-950 mb-2">
                  {t('connexion.titre')}
                </h1>
                <p className="text-brown-500 text-sm">
                  {t('connexion.sousTitre')}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-cream-200 p-6 sm:p-8 shadow-sm">
                <FormulaireConnexion onSubmit={handleLogin} isLoading={isLoading} />
              </div>

              <p className="text-center text-xs text-brown-400 mt-6 flex items-center justify-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                {t('connexion.donneesProtegees')}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ConnexionPage;
