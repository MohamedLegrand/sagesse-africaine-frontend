import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Library, Award } from 'lucide-react';
import { getLivreSiteById } from '../../../data/livresSite';

const stats = [
  { icon: BookOpen, value: '100+', label: 'Ouvrages publiés' },
  { icon: Users,    value: '50+',  label: 'Auteurs africains' },
  { icon: Library,  value: '10k+', label: 'Lecteurs actifs' },
  { icon: Award,    value: '15+',  label: 'Collections' },
];

const [heroBook1, heroBook2, heroBook3, heroBook4, heroBook5] = [
  'ange-ou-demon',
  'la-puissance-spirituelle-du-sexe',
  'la-guerre-des-spiritualites-en-afrique',
  'la-vie-spirituelle-du-sorcier',
  'la-transmission-de-la-sorcellerie-au-sein-de-la-famille',
].map(getLivreSiteById);

const HeroSection = () => {
  return (
    <section className="bg-cream-50 pt-28 pb-0 md:pt-32 overflow-hidden">
      <div className="container-editorial">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Colonne gauche — Texte */}
          <div className="max-w-xl">

            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-6">
              <div className="h-0.5 w-8 bg-terra-500" />
              <span className="text-terra-500 text-xs font-bold tracking-[0.2em] uppercase">
                Groupe panafricain d'édition
              </span>
            </div>

            {/* Titre principal */}
            <h1 className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-brown-950 leading-[1.05] mb-6">
              Sagesse<br />
              <span className="text-terra-500">africaine</span>,<br />
              votre héritage
            </h1>

            {/* Sous-titre */}
            <p className="text-brown-600 text-lg leading-relaxed mb-8 max-w-md">
              Plateforme panafricaine de production intellectuelle, scientifique,
              culturelle et éducative. Découvrez les savoirs qui honorent notre continent.
            </p>

            {/* CTA */}
            <div className="flex flex-col xs:flex-row gap-3 mb-12">
              <Link to="/livres" className="btn-primary text-base px-7 py-3.5">
                Explorer le catalogue
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/inscription" className="btn-outline text-base px-7 py-3.5">
                Rejoindre la communauté
              </Link>
            </div>

            {/* Citation */}
            <blockquote className="border-l-4 border-gold-400 pl-4">
              <p className="font-playfair italic text-brown-700 text-base leading-relaxed">
                « un peuple qui maîtrise ses savoirs, maîtrise aussi son destin »
              </p>
            </blockquote>
          </div>

          {/* Colonne droite — Visuel livres en mosaïque (desktop) */}
          <div className="relative hidden lg:block">
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
        </div>

        {/* Livres — mosaïque mobile uniquement */}
        <div className="lg:hidden mt-8">

          {/* Séparateur décoratif */}
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-cream-200" />
            <span className="text-terra-500 text-xs font-bold tracking-[0.18em] uppercase">À découvrir</span>
            <div className="h-px flex-1 bg-cream-200" />
          </div>

          {/* Rangée principale : 1 grand livre + 3 empilés */}
          <div className="flex gap-3 h-64">

            {/* Livre phare */}
            <div className="w-[42%] flex-shrink-0 relative">
              <div className="h-full bg-brown-950 rounded-xl overflow-hidden shadow-xl relative">
                <img
                  src={heroBook1.couverture_url}
                  alt={heroBook1.titre}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <span className="absolute top-2 left-2 bg-terra-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Nouveau
                </span>
              </div>
            </div>

            {/* 3 livres empilés */}
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex-1 bg-terra-800 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={heroBook2.couverture_url}
                  alt={heroBook2.titre}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <div className="flex-1 bg-gold-800 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={heroBook3.couverture_url}
                  alt={heroBook3.titre}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <div className="flex-1 bg-brown-900 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={heroBook5.couverture_url}
                  alt={heroBook5.titre}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>
          </div>

          {/* Rangée basse : 4e livre + badge collections */}
          <div className="flex gap-3 mt-3 items-stretch">
            <div className="w-[28%] flex-shrink-0 min-h-[80px]">
              <div className="h-full bg-brown-700 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={heroBook4.couverture_url}
                  alt={heroBook4.titre}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>
            <div className="flex-1 bg-brown-950 text-white rounded-xl p-3 shadow-lg flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <Library className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-brown-300 uppercase tracking-wide">Collections</p>
                  <p className="font-playfair font-bold text-base">15+ thèmes</p>
                </div>
              </div>
              <Link
                to="/livres"
                className="flex items-center gap-1 text-xs font-semibold text-gold-400 hover:text-gold-300 mt-2"
              >
                Explorer le catalogue <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-cream-200 mt-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-terra-50 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-terra-500" />
              </div>
              <div>
                <div className="font-playfair text-2xl font-bold text-brown-950">{value}</div>
                <div className="text-xs text-brown-500 font-medium">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
