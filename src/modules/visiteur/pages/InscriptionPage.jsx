import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, Shield, Star, Globe } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FormulaireInscription from '../components/FormulaireInscription';
import toast from 'react-hot-toast';
import api from '../../../services/api';

const PERKS_META = [
  { icon: BookOpen, cle: 'bibliotheque' },
  { icon: Globe,    cle: 'communaute' },
  { icon: Star,     cle: 'recommandations' },
  { icon: Shield,   cle: 'securite' },
];

const InscriptionPage = () => {
  const { t } = useTranslation('auth');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (formData) => {
    setIsLoading(true);
    try {
      await api.post('/auth/register', {
        email: formData.email,
        mot_de_passe: formData.mot_de_passe,
        prenom: formData.prenom,
        nom: formData.nom,
      });
      toast.success(t('messages.compteCree'));
      navigate('/connexion');
    } catch (error) {
      if (error.response?.status === 422) {
        toast.error(t('messages.donneesInvalidesEmail'));
      } else if (error.response?.status === 400) {
        toast.error(t('messages.emailDejaUtilise'));
      } else {
        toast.error(t('messages.erreurInscription'));
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

          {/* Colonne formulaire */}
          <div className="flex items-center justify-center p-6 sm:p-10 bg-cream-50 order-2 lg:order-1">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <h1 className="font-playfair text-3xl font-bold text-brown-950 mb-2">
                  {t('inscription.titre')}
                </h1>
                <p className="text-brown-500 text-sm">
                  {t('inscription.sousTitre')}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-cream-200 p-6 sm:p-8 shadow-sm">
                <FormulaireInscription onSubmit={handleRegister} isLoading={isLoading} />
              </div>

              <p className="text-center text-xs text-brown-400 mt-6 flex items-center justify-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                {t('inscription.gratuitSansCarte')}
              </p>
            </div>
          </div>

          {/* Colonne avantages */}
          <div className="hidden lg:flex flex-col justify-between bg-terra-600 p-12 xl:p-16 order-1 lg:order-2">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="SAGESSE AFRICAINE"
                className="h-14 w-auto brightness-0 invert"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <span className="font-playfair text-white font-bold text-xl">SAGESSE AFRICAINE</span>
                <div className="h-0.5 w-8 bg-white/50 mt-1" />
              </div>
            </Link>

            <div>
              <h2 className="font-playfair text-3xl font-bold text-white mb-2">
                {t('inscription.titreColonneDroite')}
              </h2>
              <p className="text-terra-100 text-sm leading-relaxed mb-8">
                {t('inscription.texteColonneDroite')}
              </p>

              <div className="space-y-4">
                {PERKS_META.map(({ icon: Icon, cle }) => (
                  <div key={cle} className="flex items-start gap-4 bg-terra-500/50 rounded-xl p-4">
                    <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4.5 h-4.5 text-white" style={{ width: '18px', height: '18px' }} />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{t(`inscription.perks.${cle}.titre`)}</p>
                      <p className="text-terra-100 text-xs mt-0.5 leading-relaxed">{t(`inscription.perks.${cle}.desc`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-white/30 border-2 border-terra-500 flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{i}</span>
                  </div>
                ))}
              </div>
              <p className="text-white text-xs">
                <strong>10 000+</strong> {t('inscription.lecteursRejoints')}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InscriptionPage;
