import React from 'react';
import { Shield, Globe, BookMarked, Zap } from 'lucide-react';

const valeurs = [
  {
    icon: BookMarked,
    title: 'Authenticité africaine',
    desc: 'Des ouvrages écrits par et pour les Africains. Une curation rigoureuse qui valorise nos savoirs ancestraux et contemporains.',
    stat: '100%',
    statLabel: 'auteurs africains',
  },
  {
    icon: Globe,
    title: 'Portée panafricaine',
    desc: 'De Dakar à Nairobi, de Lagos à Yaoundé — nos auteurs viennent de tout le continent et de la diaspora.',
    stat: '20+',
    statLabel: 'pays représentés',
  },
  {
    icon: Zap,
    title: 'Accès instantané',
    desc: 'Achetez et lisez immédiatement. Nos livres numériques sont disponibles sur tous vos appareils, en ligne et hors ligne.',
    stat: '< 1 min',
    statLabel: 'délai d\'accès',
  },
  {
    icon: Shield,
    title: 'Paiement local sécurisé',
    desc: 'Orange Money, MTN Mobile Money, carte bancaire — payez avec les méthodes que vous connaissez et en toute sécurité.',
    stat: '3',
    statLabel: 'modes de paiement',
  },
];

const ValeurSection = () => {
  return (
    <section className="py-20 bg-brown-950 text-white overflow-hidden">
      <div className="container-editorial">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Gauche : Texte principal */}
          <div>
            <span className="text-terra-400 text-xs font-bold tracking-[0.2em] uppercase">
              Pourquoi nous choisir
            </span>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mt-3 mb-6 leading-tight">
              Une bibliothèque<br />
              <span className="text-gold-400">taillée pour l'Afrique</span>
            </h2>
            <p className="text-brown-200 leading-relaxed mb-8 text-sm">
              Sagesse Africaine n'est pas une librairie ordinaire. C'est un projet éditorial
              qui place la culture et l'intelligence africaines au centre. Chaque livre publié
              est un acte de souveraineté intellectuelle.
            </p>

            {/* Ligne dorée */}
            <div className="h-0.5 w-16 bg-gold-400 mb-8" />

            <blockquote className="border-l-2 border-terra-500 pl-4">
              <p className="font-playfair italic text-brown-100 text-lg leading-relaxed">
                « La culture est l'arme la plus puissante pour changer le monde »
              </p>
              <cite className="text-brown-400 text-xs mt-2 block not-italic">— Nelson Mandela</cite>
            </blockquote>
          </div>

          {/* Droite : Grille de valeurs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {valeurs.map(({ icon: Icon, title, desc, stat, statLabel }, idx) => (
              <div
                key={idx}
                className="bg-brown-900 rounded-2xl p-5 border border-brown-800 hover:border-terra-600 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-terra-500/20 flex items-center justify-center mb-4 group-hover:bg-terra-500/30 transition-colors">
                  <Icon className="w-5 h-5 text-terra-400" />
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-playfair text-2xl font-bold text-gold-400">{stat}</span>
                  <span className="text-xs text-brown-400">{statLabel}</span>
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">{title}</h3>
                <p className="text-brown-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValeurSection;
