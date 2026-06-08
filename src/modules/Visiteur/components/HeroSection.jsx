import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaBookOpen, FaCrown, FaChevronDown } from 'react-icons/fa';

const HeroSection = () => {
  const [displayText, setDisplayText] = useState('');
  const fullText = 'SAGESSE AFRICAINE';

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setDisplayText(fullText.substring(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">

      {/* Cercles décoratifs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[32rem] h-[32rem] bg-amber-400/15 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45rem] h-[45rem] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Couronnes décoratives */}
      <div className="absolute top-24 left-[10%] text-amber-400/10 text-7xl animate-pulse pointer-events-none">
        <FaCrown />
      </div>
      <div className="absolute bottom-32 right-[8%] text-amber-400/10 text-7xl animate-pulse delay-700 pointer-events-none">
        <FaCrown />
      </div>

      {/* Étoiles scintillantes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-amber-400 rounded-full animate-ping"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDuration: Math.random() * 3 + 2 + 's',
              animationDelay: Math.random() * 3 + 's',
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-amber-200 text-amber-700 text-xs font-semibold tracking-widest uppercase px-5 py-2.5 rounded-full mb-8 shadow-sm hover:shadow-md hover:bg-white transition-all duration-300">
          <FaBookOpen className="text-amber-500" />
          Groupe panafricain d'édition
        </div>

        {/* Titre avec animation */}
        <div className="mb-6">
          <h1 className="font-playfair font-bold leading-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 bg-clip-text text-transparent">
              SAGESSE
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 bg-clip-text text-transparent">
              AFRICAINE
            </span>
          </h1>
        </div>

        {/* Séparateur doré animé */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-amber-500 rounded-full" />
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-300" />
          </div>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
        </div>

        {/* Citation avec guillemets */}
        <div className="relative max-w-2xl mx-auto mb-6">
          <div className="absolute -top-6 -left-6 text-amber-400/30 text-5xl font-playfair">«</div>
          <p className="text-lg sm:text-xl md:text-2xl font-playfair italic text-amber-800 leading-relaxed px-8">
            Un peuple qui maîtrise ses savoirs maîtrise aussi son destin
          </p>
          <div className="absolute -bottom-8 -right-6 text-amber-400/30 text-5xl font-playfair">»</div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto mb-12 leading-relaxed">
          Plateforme panafricaine de production intellectuelle, scientifique, culturelle et éducative.
          Découvrez des ouvrages qui honorent et transmettent les savoirs africains.
        </p>

        {/* Boutons CTA */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center mb-20">
          <Link
            to="/livres"
            className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700
              text-white px-8 py-4 rounded-full font-semibold text-base
              hover:shadow-xl hover:shadow-amber-500/30 hover:scale-105 transition-all duration-300"
          >
            Explorer le catalogue
            <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <Link
            to="/inscription"
            className="group inline-flex items-center justify-center gap-2 border-2 border-amber-600
              text-amber-700 px-8 py-4 rounded-full font-semibold text-base
              hover:bg-amber-600 hover:text-white hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 hover:scale-105"
          >
            Rejoindre la communauté
          </Link>
        </div>

        {/* Statistiques avec animations */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {[
            { value: '100+', label: 'Livres publiés', delay: 0 },
            { value: '50+', label: 'Auteurs', delay: 100 },
            { value: '10k+', label: 'Lecteurs', delay: 200 },
            { value: '15+', label: 'Collections', delay: 300 },
          ].map(({ value, label, delay }) => (
            <div 
              key={label} 
              className="text-center group animate-fade-in-up cursor-pointer"
              style={{ animationDelay: `${delay}ms` }}
            >
              <div className="text-2xl sm:text-3xl font-bold font-playfair text-amber-700 group-hover:scale-110 transition-transform duration-300">
                {value}
              </div>
              <div className="text-xs sm:text-sm text-amber-500 mt-1 tracking-wide group-hover:text-amber-600 transition-colors">
                {label}
              </div>
              <div className="w-8 h-px bg-amber-300 mx-auto mt-2 group-hover:w-12 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Flèche vers le bas */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer z-20">
        <div className="flex flex-col items-center gap-1">
          <span className="text-amber-400 text-xs uppercase tracking-wider font-medium">Découvrir</span>
          <div className="w-6 h-9 border-2 border-amber-400 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-amber-400 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Vagues dorées en bas */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80L60 70C120 60 240 40 360 35C480 30 600 40 720 45C840 50 960 50 1080 45C1200 40 1320 30 1380 25L1440 20V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="url(#waveGradient)" fillOpacity="0.4"/>
          <defs>
            <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;