import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, FaWhatsapp, FaYoutube, FaTelegram, 
  FaInstagram, FaLinkedin, FaEnvelope, FaPhone, 
  FaMapMarkerAlt, FaBook, FaArrowUp 
} from 'react-icons/fa';

const Footer = () => {
  const socialLinks = [
    { icon: FaFacebook, href: 'https://facebook.com', color: 'hover:bg-[#1877F2]' },
    { icon: FaWhatsapp, href: 'https://wa.me/237677314412', color: 'hover:bg-[#25D366]' },
    { icon: FaYoutube, href: 'https://youtube.com', color: 'hover:bg-[#FF0000]' },
    { icon: FaTelegram, href: 'https://t.me/sagesseafricaine', color: 'hover:bg-[#26A5E4]' },
    { icon: FaInstagram, href: 'https://instagram.com', color: 'hover:bg-[#E4405F]' },
    { icon: FaLinkedin, href: 'https://linkedin.com', color: 'hover:bg-[#0077B5]' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black-deep text-white pt-16 pb-8 relative">
      {/* Ligne décorative dorée en haut */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Logo et description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gold/10 rounded-lg">
                <FaBook className="text-gold text-2xl" />
              </div>
              <span className="font-playfair text-xl font-bold">
                SAGESSE <span className="text-gold">AFRICAINE</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              « Un peuple qui maîtrise ses savoirs maîtrise aussi son destin »
            </p>
            <div className="w-12 h-0.5 bg-gold mb-3"></div>
            <p className="text-gray-600 text-xs">
              Groupe panafricain de presses, d'édition et de diffusion culturelle
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="font-semibold text-gold mb-4 relative inline-block">
              Liens rapides
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gold"></div>
            </h4>
            <ul className="space-y-3 mt-4">
              <li><Link to="/qui-sommes-nous" className="text-gray-400 hover:text-gold transition-all duration-300 text-sm flex items-center gap-2 group"><span className="w-0 h-0.5 bg-gold group-hover:w-3 transition-all"></span>Qui sommes-nous</Link></li>
              <li><Link to="/etre-edite" className="text-gray-400 hover:text-gold transition-all duration-300 text-sm flex items-center gap-2 group"><span className="w-0 h-0.5 bg-gold group-hover:w-3 transition-all"></span>Être édité chez nous</Link></li>
              <li><Link to="/livres" className="text-gray-400 hover:text-gold transition-all duration-300 text-sm flex items-center gap-2 group"><span className="w-0 h-0.5 bg-gold group-hover:w-3 transition-all"></span>Notre catalogue</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-gold transition-all duration-300 text-sm flex items-center gap-2 group"><span className="w-0 h-0.5 bg-gold group-hover:w-3 transition-all"></span>Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gold mb-4 relative inline-block">
              Contact
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gold"></div>
            </h4>
            <ul className="space-y-4 mt-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm group">
                <div className="p-1.5 rounded-lg bg-gold/10 group-hover:bg-gold/20 transition-colors">
                  <FaMapMarkerAlt className="text-gold" />
                </div>
                <span>Yaoundé - Cameroun</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm group">
                <div className="p-1.5 rounded-lg bg-gold/10 group-hover:bg-gold/20 transition-colors">
                  <FaEnvelope className="text-gold" />
                </div>
                <a href="mailto:Marieconstantin51@yahoo.com" className="hover:text-gold transition">
                  Marieconstantin51@yahoo.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm group">
                <div className="p-1.5 rounded-lg bg-gold/10 group-hover:bg-gold/20 transition-colors">
                  <FaPhone className="text-gold" />
                </div>
                <div>
                  <p>(+237) 677 31 44 12</p>
                  <p>(+237) 693 21 54 31</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h4 className="font-semibold text-gold mb-4 relative inline-block">
              Suivez-nous
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gold"></div>
            </h4>
            <div className="flex gap-3 flex-wrap mt-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 text-lg transition-all duration-300 hover:text-white hover:scale-110 w-9 h-9 rounded-full flex items-center justify-center hover:bg-gold/20 border border-gold/30 hover:border-gold`}
                >
                  <social.icon />
                </a>
              ))}
            </div>
            <p className="text-gray-600 text-xs mt-6">
              Rejoignez notre communauté
            </p>
          </div>
        </div>

        {/* Séparateur doré */}
        <div className="relative">
          <div className="border-t border-gold/30 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} SAGESSE AFRICAINE. Tous droits réservés.
              </p>
              <p className="text-gold/60 text-xs flex items-center gap-2">
                <span className="w-8 h-px bg-gold/50"></span>
                Une école de pensée pour la renaissance intellectuelle africaine
                <span className="w-8 h-px bg-gold/50"></span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton retour haut */}
      <button
        onClick={scrollToTop}
        className="absolute right-6 bottom-6 bg-gold/20 hover:bg-gold text-gold hover:text-black p-3 rounded-full transition-all duration-300 hover:scale-110 border border-gold"
      >
        <FaArrowUp />
      </button>
    </footer>
  );
};

export default Footer;