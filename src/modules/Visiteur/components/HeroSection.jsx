import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaBookOpen } from 'react-icons/fa';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-white to-amber-100">

      {/* Cercles décoratifs fond */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[32rem] h-[32rem] bg-amber-300/20 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Petits points décoratifs */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute w-1.5 h-1.5 bg-amber-400 rounded-full opacity-50 top-[15%] left-[8%] animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute w-2 h-2 bg-amber-300 rounded-full opacity-40 top-[70%] left-[5%] animate-ping" style={{ animationDuration: '4.5s', animationDelay: '1s' }} />
        <div className="absolute w-1.5 h-1.5 bg-amber-500 rounded-full opacity-50 top-[20%] right-[10%] animate-ping" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
        <div className="absolute w-2 h-2 bg-amber-400 rounded-full opacity-30 top-[80%] right-[8%] animate-ping" style={{ animationDuration: '5s', animationDelay: '1.5s' }} />
        <div className="absolute w-1 h-1 bg-amber-600 rounded-full opacity-60 top-[45%] left-[92%] animate-ping" style={{ animationDuration: '4s', animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-200 text-amber-700 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-8">
          <FaBookOpen className="text-amber-500" />
          Groupe panafricain d'édition
        </div>

        {/* Titre principal */}
        <h1 className="font-playfair font-bold leading-tight mb-6
          text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
          <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 bg-clip-text text-transparent">
            SAGESSE
          </span>
          <br />
          <span className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-600 bg-clip-text text-transparent">
            AFRICAINE
          </span>
        </h1>

        {/* Séparateur doré */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-20 h-px bg-gradient-to-r from-transparent to-amber-400" />
          <div className="w-3 h-3 bg-amber-400 rounded-full" />
          <div className="w-3 h-3 border-2 border-amber-400 rounded-full" />
          <div className="w-3 h-3 bg-amber-400 rounded-full" />
          <div className="w-20 h-px bg-gradient-to-l from-transparent to-amber-400" />
        </div>

        {/* Citation */}
        <p className="text-lg sm:text-xl md:text-2xl font-playfair italic text-amber-700 max-w-2xl mx-auto mb-5 leading-relaxed">
          « Un peuple qui maîtrise ses savoirs maîtrise aussi son destin »
        </p>

        {/* Description */}
        <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto mb-12 leading-relaxed">
          Plateforme panafricaine de production intellectuelle, scientifique, culturelle et éducative.
          Découvrez des ouvrages qui honorent et transmettent les savoirs africains.
        </p>

        {/* Boutons CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            to="/livres"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700
              text-white px-8 py-4 rounded-full font-semibold text-base
              hover:shadow-xl hover:shadow-amber-500/30 hover:scale-105 transition-all duration-300"
          >
            Explorer le catalogue
            <FaArrowRight />
          </Link>
          <Link
            to="/inscription"
            className="inline-flex items-center justify-center gap-2 border-2 border-amber-600
              text-amber-700 px-8 py-4 rounded-full font-semibold text-base
              hover:bg-amber-600 hover:text-white transition-all duration-300 hover:scale-105"
          >
            Rejoindre la communauté
          </Link>
        </div>

        {/* Statistiques */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16">
          {[
            { value: '100+', label: 'Livres publiés' },
            { value: '50+', label: 'Auteurs' },
            { value: '10k+', label: 'Lecteurs' },
            { value: '15+', label: 'Collections' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold font-playfair text-amber-700">{value}</div>
              <div className="text-xs sm:text-sm text-amber-500 mt-1 tracking-wide">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Vague bas */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="white" fillOpacity="0.5"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
