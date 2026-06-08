import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaPenFancy, FaCheckCircle, FaEnvelope, FaPhone,
  FaFileAlt, FaUsers, FaGlobe, FaStar, FaArrowRight
} from 'react-icons/fa';
import Header from '../../visiteur/components/Header';
import Footer from '../../visiteur/components/Footer';
import toast from 'react-hot-toast';

const EtreEditePage = () => {
  const [formData, setFormData] = useState({
    nom: '', email: '', telephone: '', titre: '', genre: '', resume: '', pages: '', message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success('Votre manuscrit a été soumis ! Nous vous répondrons sous 15 jours ouvrables.');
      setFormData({ nom: '', email: '', telephone: '', titre: '', genre: '', resume: '', pages: '', message: '' });
      setLoading(false);
    }, 1200);
  };

  const etapes = [
    { num: '01', titre: 'Soumission', desc: 'Envoyez votre manuscrit ou synopsis via le formulaire ci-dessous.' },
    { num: '02', titre: 'Lecture', desc: 'Notre comité éditorial analyse votre projet sous 15 jours ouvrables.' },
    { num: '03', titre: 'Réponse', desc: 'Nous vous contactons pour vous communiquer notre décision et nos retours.' },
    { num: '04', titre: 'Édition', desc: 'En cas d\'accord, nous co-construisons votre ouvrage avec vous.' },
  ];

  const avantages = [
    { icon: FaUsers, titre: 'Accompagnement personnalisé', desc: 'Un éditeur dédié vous accompagne de la rédaction à la publication.' },
    { icon: FaGlobe, titre: 'Diffusion panafricaine', desc: 'Votre ouvrage distribué en Afrique et dans la diaspora mondiale.' },
    { icon: FaStar, titre: 'Excellence éditoriale', desc: 'Correction, mise en page et couverture professionnelles.' },
    { icon: FaFileAlt, titre: 'Droits d\'auteur protégés', desc: 'Contrat clair, transparence totale sur vos droits et royalties.' },
  ];

  const genres = ['Roman', 'Essai', 'Biographie', 'Poésie', 'Conte', 'Jeunesse', 'Sciences humaines', 'Histoire', 'Développement personnel', 'Autre'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">

          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
              <FaPenFancy /> Pour les auteurs
            </div>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-amber-800 mb-4">
              Être édité chez nous
            </h1>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-16 h-px bg-amber-300" />
              <div className="w-2 h-2 bg-amber-400 rounded-full" />
              <div className="w-16 h-px bg-amber-300" />
            </div>
            <p className="text-lg text-amber-600 max-w-2xl mx-auto leading-relaxed">
              SAGESSE AFRICAINE publie des auteurs qui contribuent à la valorisation
              des savoirs, cultures et identités africaines. Proposez-nous votre manuscrit.
            </p>
          </div>

          {/* Avantages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {avantages.map((a, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition">
                <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <a.icon className="text-amber-600 text-2xl" />
                </div>
                <h3 className="font-bold text-amber-800 mb-2">{a.titre}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>

          {/* Processus */}
          <div className="mb-20">
            <h2 className="text-3xl font-playfair font-bold text-amber-800 text-center mb-12">
              Le processus d'édition
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {etapes.map((e, i) => (
                <div key={i} className="relative">
                  <div className="bg-white rounded-2xl p-6 shadow-lg h-full">
                    <div className="text-5xl font-playfair font-bold text-amber-100 mb-3 leading-none">{e.num}</div>
                    <h3 className="font-bold text-amber-800 text-lg mb-2">{e.titre}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{e.desc}</p>
                  </div>
                  {i < etapes.length - 1 && (
                    <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-amber-500 rounded-full items-center justify-center text-white text-xs">
                      <FaArrowRight />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Ce que nous publions */}
          <div className="bg-amber-800 rounded-2xl p-8 md:p-12 mb-20">
            <h2 className="text-3xl font-playfair font-bold text-white text-center mb-8">
              Ce que nous publions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                'Ouvrages sur l\'histoire et les civilisations africaines',
                'Essais politiques, économiques et sociaux',
                'Romans et récits ancrés dans les réalités africaines',
                'Biographies de personnalités africaines',
                'Livres de développement personnel inspirés des valeurs africaines',
                'Ouvrages scientifiques et académiques',
                'Littérature jeunesse et contes africains',
                'Poésie et théâtre africains',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <FaCheckCircle className="text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/80 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Formulaire de soumission */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <h2 className="text-2xl font-playfair font-bold text-amber-800 mb-2 text-center">
                Soumettre votre manuscrit
              </h2>
              <p className="text-gray-500 text-sm text-center mb-8">
                Remplissez ce formulaire. Nous vous répondrons sous 15 jours ouvrables.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-amber-700 text-sm font-medium mb-2">Nom complet *</label>
                    <input type="text" name="nom" value={formData.nom} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-amber-700 text-sm font-medium mb-2">Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-amber-700 text-sm font-medium mb-2">Téléphone</label>
                    <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange}
                      placeholder="(+237) ..."
                      className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-amber-700 text-sm font-medium mb-2">Genre littéraire *</label>
                    <select name="genre" value={formData.genre} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm bg-white">
                      <option value="">Sélectionnez un genre</option>
                      {genres.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-amber-700 text-sm font-medium mb-2">Titre de l'ouvrage *</label>
                    <input type="text" name="titre" value={formData.titre} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-amber-700 text-sm font-medium mb-2">Nombre de pages estimé</label>
                    <input type="number" name="pages" value={formData.pages} onChange={handleChange} min="1"
                      className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-amber-700 text-sm font-medium mb-2">Résumé / Synopsis *</label>
                  <textarea name="resume" value={formData.resume} onChange={handleChange} required rows="4"
                    placeholder="Décrivez brièvement votre ouvrage (thème, public cible, originalité...)"
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm resize-none" />
                </div>

                <div>
                  <label className="block text-amber-700 text-sm font-medium mb-2">Message complémentaire</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows="3"
                    placeholder="Toute autre information utile (expérience, publications précédentes...)"
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm resize-none" />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><FaPenFancy /> Soumettre mon manuscrit</>
                  )}
                </button>
              </form>
            </div>

            {/* Contact direct */}
            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
              <p className="text-amber-700 font-medium mb-3">Préférez-vous nous contacter directement ?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:Marieconstantin51@yahoo.com"
                  className="flex items-center justify-center gap-2 text-amber-600 hover:text-amber-800 transition text-sm">
                  <FaEnvelope /> Marieconstantin51@yahoo.com
                </a>
                <a href="tel:+237677314412"
                  className="flex items-center justify-center gap-2 text-amber-600 hover:text-amber-800 transition text-sm">
                  <FaPhone /> (+237) 677 31 44 12
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EtreEditePage;
