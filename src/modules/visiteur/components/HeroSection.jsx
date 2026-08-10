import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, BookOpen, Users, Library, Award } from 'lucide-react';
import livresService from '../../../services/livresService';

const STATS_CLES = [
  { icon: BookOpen, value: '100+', cle: 'ouvrages' },
  { icon: Users,    value: '50+',  cle: 'auteurs' },
  { icon: Library,  value: '10k+', cle: 'lecteurs' },
  { icon: Award,    value: '15+',  cle: 'collections' },
];

const LIVRE_VIDE = { titre: '', couverture_url: null };

// Aligné sur le breakpoint Tailwind `lg` : la mosaïque de livres n'existe que
// sur desktop. En dessous, ni la requête ni les images ne doivent être
// chargées (pas juste masquées en CSS, pour ne pas gaspiller de bande passante
// sur mobile/tablette).
const useEstDesktop = (breakpoint = 1024) => {
  const [estDesktop, setEstDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= breakpoint : false
  );

  useEffect(() => {
    const gererRedimensionnement = () => setEstDesktop(window.innerWidth >= breakpoint);
    window.addEventListener('resize', gererRedimensionnement);
    return () => window.removeEventListener('resize', gererRedimensionnement);
  }, [breakpoint]);

  return estDesktop;
};

const HeroSection = () => {
  const { t } = useTranslation('accueil');
  const [heroBooks, setHeroBooks] = useState([]);
  const estDesktop = useEstDesktop();

  useEffect(() => {
    if (!estDesktop) return;
    livresService.getLivres(1, 5)
      .then((data) => setHeroBooks(data.livres || []))
      .catch(() => {});
  }, [estDesktop]);

  const [heroBook1, heroBook2, heroBook3, heroBook4, heroBook5] = [0, 1, 2, 3, 4].map(
    (i) => heroBooks[i] || LIVRE_VIDE
  );

  return (
    <section className="bg-cream-50 pt-24 pb-10 sm:pt-28 md:pt-32 lg:pb-0 overflow-hidden">
      <div className="container-editorial">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Colonne gauche — Texte (centré sur mobile/tablette, aligné à gauche dès le desktop) */}
          <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">

            {/* Eyebrow */}
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
              <div className="h-0.5 w-8 bg-terra-500" />
              <span className="text-terra-500 text-xs font-bold tracking-[0.2em] uppercase">
                {t('hero.eyebrow')}
              </span>
            </div>

            {/* Titre principal */}
            <h1 className="font-playfair text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-bold text-brown-950 leading-[1.05] mb-6">
              {t('hero.titrePart1')}<br />
              <span className="text-terra-500">{t('hero.titrePart2')}</span>,<br />
              {t('hero.titrePart3')}
            </h1>

            {/* Sous-titre */}
            <p className="text-brown-600 text-base sm:text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
              {t('hero.sousTitre')}
            </p>

            {/* CTA */}
            <div className="flex flex-col xs:flex-row justify-center lg:justify-start gap-3 mb-10 lg:mb-12">
              <Link to="/livres" className="btn-primary text-base px-7 py-3.5 justify-center">
                {t('hero.explorerCatalogue')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/inscription" className="btn-outline text-base px-7 py-3.5 justify-center">
                {t('hero.rejoindreCommunaute')}
              </Link>
            </div>

            {/* Citation */}
            <blockquote className="border-l-4 border-gold-400 pl-4 text-left">
              <p className="font-playfair italic text-brown-700 text-sm sm:text-base leading-relaxed">
                {t('hero.citation')}
              </p>
            </blockquote>
          </div>

          {/* Colonne droite — Visuel livres en mosaïque (desktop uniquement : ni
              chargée ni rendue sur mobile/tablette, cf. useEstDesktop) */}
          {estDesktop && (
          <div className="relative">
            <div className="relative h-[520px]">

              {/* Livre principal */}
              <div className="absolute left-12 top-8 w-44 h-60 bg-brown-950 rounded-lg shadow-2xl overflow-hidden book-shadow">
                <img
                  src={heroBook1.couverture_url}
                  alt={heroBook1.titre}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('flex', 'items-center', 'justify-center', 'bg-gradient-to-b', 'from-brown-800', 'to-brown-950');
                    const icon = document.createElement('div');
                    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-gold-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>';
                    e.target.parentElement.appendChild(icon.firstChild);
                  }}
                />
              </div>

              {/* Livre 2 */}
              <div className="absolute left-60 top-20 w-36 h-48 rounded-lg shadow-xl overflow-hidden book-shadow bg-terra-800">
                <img
                  src={heroBook2.couverture_url}
                  alt={heroBook2.titre}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>

              {/* Livre 3 */}
              <div className="absolute left-4 top-72 w-40 h-52 rounded-lg shadow-xl overflow-hidden book-shadow bg-gold-800">
                <img
                  src={heroBook3.couverture_url}
                  alt={heroBook3.titre}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>

              {/* Livre 4 */}
              <div className="absolute left-52 top-72 w-36 h-48 rounded-lg shadow-xl overflow-hidden book-shadow bg-brown-700">
                <img
                  src={heroBook4.couverture_url}
                  alt={heroBook4.titre}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>

              {/* Livre 5 */}
              <div className="absolute right-8 top-52 w-32 h-44 rounded-lg shadow-xl overflow-hidden book-shadow bg-brown-900 z-10">
                <img
                  src={heroBook5.couverture_url}
                  alt={heroBook5.titre}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>

              {/* Carte flottante nouveauté */}
              <div className="absolute right-0 top-16 bg-white border border-cream-200 rounded-xl p-4 shadow-lg w-48">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-terra-500 rounded-full" />
                  <span className="text-xs font-semibold text-terra-600 uppercase tracking-wide">Nouveau</span>
                </div>
                <p className="font-playfair font-bold text-brown-900 text-sm leading-snug">
                  Découvrez notre dernière parution
                </p>
                <Link to="/livres" className="mt-3 flex items-center gap-1 text-xs font-semibold text-terra-500 hover:text-terra-700">
                  Voir le livre <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Badge collections */}
              <div className="absolute right-4 bottom-20 bg-brown-950 text-white rounded-xl p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <Library className="w-4 h-4 text-gold-400" />
                  <div>
                    <p className="text-xs text-brown-300">Collections</p>
                    <p className="font-bold text-sm">15+ thèmes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Stats bar */}
        <div className="border-t border-cream-200 mt-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS_CLES.map(({ icon: Icon, value, cle }) => (
            <div key={cle} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-terra-50 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-terra-500" />
              </div>
              <div>
                <div className="font-playfair text-2xl font-bold text-brown-950">{value}</div>
                <div className="text-xs text-brown-500 font-medium">{t(`hero.stats.${cle}`)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
