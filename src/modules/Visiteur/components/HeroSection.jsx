import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaPlay, FaGem } from 'react-icons/fa';

const HeroSection = () => {
  const navigate = useNavigate();
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
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Fond avec dégradé or et noir */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-100" />
      
      {/* Cercles décoratifs dorés */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-[30rem] h-[30rem] bg-amber-300/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-amber-400/10 rounded-full blur-3xl" />
      
      {/* Lignes décoratives dorées */}
      <div className="absolute top-1/4 left-0 w-40 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent rotate-45" />
      <div className="absolute bottom-1/4 right-0 w-40 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent -rotate-45" />
      <div className="absolute top-1/3 right-[15%] w-20 h-px bg-amber-400/50" />
      <div className="absolute bottom-1/3 left-[15%] w-20 h-px bg-amber-400/50" />

      {/* Icône de couronne décorative */}
      <div className="absolute top-32 right-[20%] text-amber-300/20 text-7xl animate-pulse">
        <FaGem />
      </div>
      <div className="absolute bottom-40 left-[15%] text-amber-300/20 text-7xl animate-pulse delay-700">
        <FaGem />
      </div>

      {/* Particules dorées */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-amber-400 rounded-full opacity-40 animate-ping"
            style={{
              width: Math.random() * 5 + 2 + 'px',
              height: Math.random() * 5 + 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 4 + 's',
              animationDuration: Math.random() * 4 + 2 + 's',
            }}
          />
        ))}
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Titre avec animation */}
        <div className="mb-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold">
            <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 bg-clip-text text-transparent">
              {displayText}
            </span>
          </h1>
          <div className="flex items-center justify-center gap-3 my-6">
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
          </div>
        </div>
        
        {/* Citation */}
        <div className="relative max-w-3xl mx-auto mb-6">
          <div className="absolute -top-8 -left-8 text-amber-400/40 text-7xl font-playfair">«</div>
          <p className="text-xl md:text-2xl text-amber-800 italic leading-relaxed font-medium">
            Un peuple qui maîtrise ses savoirs maîtrise aussi son destin
          </p>
          <div className="absolute -bottom-10 -right-8 text-amber-400/40 text-7xl font-playfair">»</div>
        </div>
        
        {/* Description */}
        <p className="text-base md:text-lg text-amber-600/80 max-w-2xl mx-auto mb-10">
          Plateforme panafricaine de production intellectuelle, scientifique, 
          culturelle et éducative
        </p>

        {/* Boutons CTA - Style OR premium */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <button
            onClick={() => navigate('/livres')}
            className="group relative overflow-hidden bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-amber-500/30 shadow-md"
          >
            <span className="relative z-10 flex items-center gap-2">
              Explorer les livres 
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          <button
            onClick={() => navigate('/inscription')}
            className="relative overflow-hidden border-2 border-amber-600 text-amber-700 px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-amber-600 hover:text-white group bg-white/50 backdrop-blur-sm"
          >
            <span className="relative z-10 flex items-center gap-2">
              S'inscrire
              <FaPlay className="text-xs group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>

        {/* Statistiques avec style OR */}
        <div className="flex flex-wrap justify-center gap-8 mt-20">
          <div className="group text-center p-5 px-8 rounded-2xl bg-white/40 backdrop-blur-sm border border-amber-200 hover:border-amber-400 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/60">
            <div className="text-amber-600 text-4xl md:text-5xl font-bold font-playfair group-hover:scale-110 transition-transform duration-300">100+</div>
            <div className="text-amber-700 text-sm mt-1 font-medium">Livres publiés</div>
            <div className="w-10 h-px bg-amber-400 mx-auto mt-2 group-hover:w-16 transition-all"></div>
          </div>
          <div className="group text-center p-5 px-8 rounded-2xl bg-white/40 backdrop-blur-sm border border-amber-200 hover:border-amber-400 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/60">
            <div className="text-amber-600 text-4xl md:text-5xl font-bold font-playfair group-hover:scale-110 transition-transform duration-300">50+</div>
            <div className="text-amber-700 text-sm mt-1 font-medium">Auteurs</div>
            <div className="w-10 h-px bg-amber-400 mx-auto mt-2 group-hover:w-16 transition-all"></div>
          </div>
          <div className="group text-center p-5 px-8 rounded-2xl bg-white/40 backdrop-blur-sm border border-amber-200 hover:border-amber-400 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/60">
            <div className="text-amber-600 text-4xl md:text-5xl font-bold font-playfair group-hover:scale-110 transition-transform duration-300">10k+</div>
            <div className="text-amber-700 text-sm mt-1 font-medium">Lecteurs</div>
            <div className="w-10 h-px bg-amber-400 mx-auto mt-2 group-hover:w-16 transition-all"></div>
          </div>
        </div>
      </div>

      {/* Scroll indicator - Style OR */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-amber-500 text-xs uppercase tracking-wider font-medium">Découvrir</span>
          <div className="w-6 h-10 border-2 border-amber-500 rounded-full flex justify-center group hover:border-amber-600 transition-colors">
            <div className="w-1.5 h-2 bg-amber-500 rounded-full mt-2 animate-bounce group-hover:bg-amber-600"></div>
          </div>
        </div>
      </div>

      {/* Overlay doré en bas */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-200/20 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default HeroSection;