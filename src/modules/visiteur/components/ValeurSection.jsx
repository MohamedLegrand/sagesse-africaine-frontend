import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Globe, BookMarked, Zap } from 'lucide-react';

const VALEURS_META = [
  { icon: BookMarked, cle: 'authenticite', stat: '100%' },
  { icon: Globe,       cle: 'portee',       stat: '20+' },
  { icon: Zap,         cle: 'acces',        stat: '< 1 min' },
  { icon: Shield,      cle: 'paiement',     stat: '3' },
];

const ValeurSection = () => {
  const { t } = useTranslation('accueil');
  return (
    <section className="py-20 bg-brown-950 text-white overflow-hidden">
      <div className="container-editorial">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Gauche : Texte principal */}
          <div>
            <span className="text-terra-400 text-xs font-bold tracking-[0.2em] uppercase">
              {t('valeur.eyebrow')}
            </span>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mt-3 mb-6 leading-tight">
              {t('valeur.titreLigne1')}<br />
              <span className="text-gold-400">{t('valeur.titreLigne2')}</span>
            </h2>
            <p className="text-brown-200 leading-relaxed mb-8 text-sm">
              {t('valeur.texte')}
            </p>

            {/* Ligne dorée */}
            <div className="h-0.5 w-16 bg-gold-400 mb-8" />

            <blockquote className="border-l-2 border-terra-500 pl-4">
              <p className="font-playfair italic text-brown-100 text-lg leading-relaxed">
                {t('valeur.citation')}
              </p>
              <cite className="text-brown-400 text-xs mt-2 block not-italic">{t('valeur.citationAuteur')}</cite>
            </blockquote>
          </div>

          {/* Droite : Grille de valeurs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VALEURS_META.map(({ icon: Icon, cle, stat }) => (
              <div
                key={cle}
                className="bg-brown-900 rounded-2xl p-5 border border-brown-800 hover:border-terra-600 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-terra-500/20 flex items-center justify-center mb-4 group-hover:bg-terra-500/30 transition-colors">
                  <Icon className="w-5 h-5 text-terra-400" />
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-playfair text-2xl font-bold text-gold-400">{stat}</span>
                  <span className="text-xs text-brown-400">{t(`valeur.items.${cle}.statLabel`)}</span>
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">{t(`valeur.items.${cle}.titre`)}</h3>
                <p className="text-brown-400 text-xs leading-relaxed">{t(`valeur.items.${cle}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValeurSection;
