import React from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaUsers, FaGlobe, FaHeart, FaStar, FaTrophy } from 'react-icons/fa';
import Header from '../../visiteur/components/Header';
import Footer from '../../visiteur/components/Footer';

const QuiSommesNousPage = () => {
  const values = [
    { icon: FaBook, title: 'Authenticité', description: 'Des contenus enracinés dans les réalités africaines' },
    { icon: FaStar, title: 'Excellence', description: 'Une exigence permanente de qualité éditoriale et scientifique' },
    { icon: FaHeart, title: 'Éthique', description: 'Le respect de la dignité humaine et de l\'intégrité intellectuelle' },
    { icon: FaUsers, title: 'Diversité', description: 'La reconnaissance du pluralisme culturel africain' },
    { icon: FaTrophy, title: 'Impact', description: 'Des publications utiles à la transformation sociale' },
  ];

  const stats = [
    { value: '100+', label: 'Livres publiés' },
    { value: '50+', label: 'Auteurs accompagnés' },
    { value: '10k+', label: 'Lecteurs' },
    { value: '15+', label: 'Collections' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-amber-800 mb-4">
              Qui sommes-nous ?
            </h1>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-16 h-px bg-amber-300"></div>
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <div className="w-16 h-px bg-amber-300"></div>
            </div>
            <p className="text-xl text-amber-600 max-w-3xl mx-auto">
              Une plateforme panafricaine de production intellectuelle, scientifique, 
              culturelle et éducative
            </p>
          </div>

          {/* Citation */}
          <div className="bg-amber-800/10 rounded-2xl p-8 mb-16 text-center">
            <p className="text-2xl md:text-3xl font-playfair italic text-amber-800">
              « Un peuple qui maîtrise ses savoirs maîtrise aussi son destin »
            </p>
          </div>

          {/* Histoire */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-playfair font-bold text-amber-800 mb-4">
                Notre histoire
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Fondée en 2026 à Yaoundé, SAGESSE AFRICAINE est née d'une conviction forte : 
                aucun peuple ne peut construire durablement son avenir sans maîtriser ses 
                propres savoirs, ses récits et ses instruments de transmission culturelle.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Aujourd'hui, nous sommes un groupe panafricain de presses, d'édition et de 
                diffusion culturelle, présent sur tout le continent et dans la diaspora.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-playfair font-bold text-amber-800 mb-4">
                Notre mission
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <FaBook className="text-amber-600 mt-1" />
                  <span className="text-gray-700">Produire des contenus scientifiques et culturels de haute qualité</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaGlobe className="text-amber-600 mt-1" />
                  <span className="text-gray-700">Valoriser les patrimoines africains à l'échelle mondiale</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaUsers className="text-amber-600 mt-1" />
                  <span className="text-gray-700">Former une nouvelle génération d'auteurs et de leaders africains</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Valeurs */}
          <div className="mb-16">
            <h2 className="text-2xl font-playfair font-bold text-amber-800 text-center mb-8">
              Nos valeurs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {values.map((value, index) => (
                <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="text-amber-600 text-xl" />
                  </div>
                  <h3 className="font-bold text-amber-800 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chiffres clés */}
          <div className="bg-amber-800 rounded-2xl p-8 mb-16">
            <h2 className="text-2xl font-playfair font-bold text-white text-center mb-8">
              SAGESSE AFRICAINE en chiffres
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-amber-300">{stat.value}</div>
                  <div className="text-white/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-playfair font-bold text-amber-800 mb-4">
              Rejoignez l'aventure SAGESSE AFRICAINE
            </h2>
            <p className="text-gray-600 mb-6">
              Publiez avec nous, devenez auteur ou simplement lecteur
            </p>
            <Link to="/etre-edite" className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition inline-block">
              Être édité chez nous
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default QuiSommesNousPage;