import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserPlus, Search, ShoppingBag, BookOpen, ArrowRight } from 'lucide-react';

const STEPS_META = [
  { num: '01', icon: UserPlus,   cle: 'compte',   color: 'bg-terra-500', light: 'bg-terra-50 text-terra-600' },
  { num: '02', icon: Search,     cle: 'explorer', color: 'bg-gold-500',  light: 'bg-gold-50 text-gold-700' },
  { num: '03', icon: ShoppingBag,cle: 'acheter',  color: 'bg-brown-700', light: 'bg-brown-50 text-brown-700' },
  { num: '04', icon: BookOpen,   cle: 'lire',     color: 'bg-terra-700', light: 'bg-terra-50 text-terra-700' },
];

const OnboardingSection = () => {
  const { t } = useTranslation('accueil');
  return (
    <section className="py-20 bg-cream-50 border-t border-cream-100">
      <div className="container-editorial">

        {/* En-tête */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-eyebrow">{t('onboarding.eyebrow')}</span>
          <h2 className="section-title mt-2">
            {t('onboarding.titreLigne1')}<br />
            <span className="text-terra-500">{t('onboarding.titreLigne2')}</span>
          </h2>
          <p className="text-brown-500 mt-4 text-sm leading-relaxed">
            {t('onboarding.sousTitre')}
          </p>
        </div>

        {/* Étapes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {STEPS_META.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.cle} className="relative">
                {/* Connecteur */}
                {idx < STEPS_META.length - 1 && (
                  <div className="hidden lg:block absolute top-9 left-full w-full h-0.5 bg-cream-300 -z-10 -ml-3" />
                )}

                <div className="bg-white rounded-2xl border border-cream-200 p-6 hover:shadow-md transition-shadow">
                  {/* Numéro */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl ${step.light} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-playfair text-4xl font-bold text-cream-300">{step.num}</span>
                  </div>

                  <h3 className="font-playfair font-bold text-brown-900 text-base mb-2">
                    {t(`onboarding.etapes.${step.cle}.titre`)}
                  </h3>
                  <p className="text-sm text-brown-500 leading-relaxed">
                    {t(`onboarding.etapes.${step.cle}.desc`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/inscription" className="btn-primary text-base px-8 py-4">
            {t('onboarding.creerCompteGratuit')}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-brown-400 mt-3">
            {t('onboarding.dejaMembre')}{' '}
            <Link to="/connexion" className="text-terra-500 font-semibold hover:underline">
              {t('onboarding.seConnecter')}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default OnboardingSection;
