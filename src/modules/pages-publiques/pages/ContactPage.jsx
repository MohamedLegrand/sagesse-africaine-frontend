import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaWhatsapp, FaYoutube, FaTelegram, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Header from '../../visiteur/components/Header';
import Footer from '../../visiteur/components/Footer';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulation d'envoi (à connecter avec ton API)
    setTimeout(() => {
      toast.success('Message envoyé ! Nous vous répondrons rapidement.');
      setFormData({ nom: '', email: '', sujet: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  const socialLinks = [
    { icon: FaFacebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: FaWhatsapp, href: 'https://wa.me/237677314412', label: 'WhatsApp' },
    { icon: FaYoutube, href: 'https://youtube.com', label: 'YouTube' },
    { icon: FaTelegram, href: 'https://t.me/sagesseafricaine', label: 'Telegram' },
    { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* En-tête */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-amber-800 mb-4">
              Contactez-nous
            </h1>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-16 h-px bg-amber-300"></div>
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <div className="w-16 h-px bg-amber-300"></div>
            </div>
            <p className="text-lg text-amber-600 max-w-2xl mx-auto">
              Une question ? Un projet d'édition ? N'hésitez pas à nous contacter
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Formulaire de contact */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-playfair font-bold text-amber-800 mb-6">
                Envoyez-nous un message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-amber-700 mb-2">Nom complet *</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-amber-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-amber-700 mb-2">Sujet *</label>
                  <input
                    type="text"
                    name="sujet"
                    value={formData.sujet}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-amber-700 mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            </div>

            {/* Informations de contact */}
            <div className="space-y-8">
              {/* Coordonnées */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-playfair font-bold text-amber-800 mb-6">
                  Nos coordonnées
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <FaMapMarkerAlt className="text-amber-600 text-xl mt-1" />
                    <div>
                      <p className="font-semibold text-amber-800">Adresse</p>
                      <p className="text-gray-600">Yaoundé - Cameroun</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <FaEnvelope className="text-amber-600 text-xl mt-1" />
                    <div>
                      <p className="font-semibold text-amber-800">Email</p>
                      <a href="mailto:Marieconstantin51@yahoo.com" className="text-gray-600 hover:text-amber-600 transition">
                        Marieconstantin51@yahoo.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <FaPhone className="text-amber-600 text-xl mt-1" />
                    <div>
                      <p className="font-semibold text-amber-800">Téléphone</p>
                      <p className="text-gray-600">(+237) 677 31 44 12</p>
                      <p className="text-gray-600">(+237) 693 21 54 31</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-playfair font-bold text-amber-800 mb-6">
                  Suivez-nous
                </h2>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl text-amber-700 hover:bg-amber-100 transition"
                    >
                      <social.icon />
                      <span>{social.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;