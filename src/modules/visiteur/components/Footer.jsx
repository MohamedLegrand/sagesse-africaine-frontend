import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, BookOpen, ArrowUp } from 'lucide-react';
import { FaFacebook, FaWhatsapp, FaYoutube, FaInstagram, FaLinkedin, FaTelegram } from 'react-icons/fa';

const socialLinks = [
  { icon: FaFacebook,  href: 'https://facebook.com',              label: 'Facebook'  },
  { icon: FaWhatsapp,  href: 'https://wa.me/237677314412',        label: 'WhatsApp'  },
  { icon: FaYoutube,   href: 'https://youtube.com',               label: 'YouTube'   },
  { icon: FaInstagram, href: 'https://instagram.com',             label: 'Instagram' },
  { icon: FaLinkedin,  href: 'https://linkedin.com',              label: 'LinkedIn'  },
  { icon: FaTelegram,  href: 'https://t.me/sagesseafricaine',     label: 'Telegram'  },
];

const Footer = () => {
  const { t } = useTranslation('accueil');
  return (
    <footer className="bg-brown-950 text-white">

      {/* Bande kente */}
      <div className="h-1 flex">
        <div className="flex-1 bg-terra-500" />
        <div className="flex-1 bg-gold-500" />
        <div className="flex-1 bg-terra-700" />
        <div className="flex-1 bg-gold-400" />
        <div className="flex-1 bg-terra-500" />
        <div className="flex-1 bg-gold-500" />
        <div className="flex-1 bg-terra-700" />
        <div className="flex-1 bg-gold-400" />
      </div>

      <div className="container-editorial py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Marque */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/images/logo.png"
                alt="SAGESSE AFRICAINE"
                className="h-14 w-auto brightness-0 invert"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <span className="font-playfair text-lg font-bold text-white">SAGESSE AFRICAINE</span>
                <div className="h-0.5 w-8 bg-gold-400 mt-1" />
              </div>
            </div>
            <p className="text-brown-400 text-sm leading-relaxed mb-5">
              {t('footer.description')}
            </p>
            <div className="flex gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-brown-900 border border-brown-800 flex items-center justify-center text-brown-400 hover:text-white hover:border-terra-500 hover:bg-terra-500/20 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">{t('footer.navigation')}</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/',               label: t('footer.liens.accueil') },
                { to: '/livres',         label: t('footer.liens.catalogue') },
                { to: '/qui-sommes-nous',label: t('footer.liens.quiSommesNous') },
                { to: '/etre-edite',     label: t('footer.liens.etreEdite') },
                { to: '/contact',        label: t('footer.liens.contact') },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-brown-400 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-terra-400 group-hover:w-3 transition-all duration-200" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">{t('footer.contact')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-terra-400 mt-0.5 flex-shrink-0" />
                <span className="text-brown-400 text-sm">{t('footer.ville')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-terra-400 flex-shrink-0" />
                <a href="mailto:Marieconstantin51@yahoo.com" className="text-brown-400 hover:text-white text-sm transition-colors">
                  Marieconstantin51@yahoo.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-terra-400 mt-0.5 flex-shrink-0" />
                <div className="text-brown-400 text-sm">
                  <p>(+237) 641 42 99 18</p>
                  <p>(+237) 677 75 73 56</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">{t('footer.restezInforme')}</h4>
            <p className="text-brown-400 text-sm mb-4 leading-relaxed">
              {t('footer.newsletterTexte')}
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); }}
              className="flex flex-col gap-2"
            >
              <input
                type="email"
                placeholder={t('footer.newsletterPlaceholder')}
                className="px-3 py-2.5 bg-brown-900 border border-brown-800 rounded-lg text-sm text-white placeholder-brown-500 focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500/30"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-terra-500 hover:bg-terra-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {t('footer.sabonner')}
              </button>
            </form>
          </div>
        </div>

        {/* Séparateur et bas de page */}
        <div className="border-t border-brown-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-brown-500 text-xs">
              © {new Date().getFullYear()} SAGESSE AFRICAINE — {t('footer.droitsReserves')}
            </p>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-1">
              {[
                { to: '/confidentialite',  label: t('footer.liens.confidentialite') },
                { to: '/mentions-legales', label: t('footer.liens.mentionsLegales') },
                { to: '/cgv',              label: t('footer.liens.cgv') },
              ].map(({ to, label }) => (
                <Link key={to} to={to} className="text-brown-500 hover:text-brown-300 transition-colors text-xs">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bouton retour en haut */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed right-5 bottom-5 w-10 h-10 bg-terra-500 hover:bg-terra-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 z-20"
        aria-label={t('footer.retourHaut')}
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </footer>
  );
};

export default Footer;
