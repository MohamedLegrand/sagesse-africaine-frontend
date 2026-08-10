import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, BookOpen, Users, Feather, Globe, Heart, Lightbulb } from 'lucide-react';
import api from '../../../services/api';

const iconsByKeyword = {
  histoire:   Globe,
  culture:    Heart,
  science:    Lightbulb,
  jeunesse:   Users,
  poésie:     Feather,
  default:    BookOpen,
};

const palette = [
  { bg: 'bg-terra-50',  border: 'border-terra-200',  text: 'text-terra-700',  icon: 'bg-terra-100 text-terra-600'  },
  { bg: 'bg-gold-50',   border: 'border-gold-200',   text: 'text-gold-700',   icon: 'bg-gold-100 text-gold-700'    },
  { bg: 'bg-brown-50',  border: 'border-brown-200',  text: 'text-brown-700',  icon: 'bg-brown-100 text-brown-700'  },
  { bg: 'bg-cream-100', border: 'border-cream-300',  text: 'text-brown-800',  icon: 'bg-cream-200 text-brown-600'  },
];

const ParcoursSection = ({ livres = [] }) => {
  const { t } = useTranslation('accueil');
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    api.get('/collections/')
      .then(r => setCollections(r.data.collections || []))
      .catch(() => {});
  }, []);

  if (collections.length === 0) return null;

  return (
    <section className="bg-white py-20 border-t border-cream-100">
      <div className="container-editorial">

        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="section-eyebrow">{t('parcours.eyebrow')}</span>
            <h2 className="section-title mt-2">
              {t('parcours.titre')}
            </h2>
            <p className="text-brown-500 mt-3 max-w-lg text-sm leading-relaxed">
              {t('parcours.sousTitre')}
            </p>
          </div>
          <Link to="/livres" className="btn-outline flex-shrink-0 text-sm">
            {t('parcours.voirTout')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grille parcours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {collections.map((collection, idx) => {
            const colors = palette[idx % palette.length];
            const keyword = collection.nom?.toLowerCase() || '';
            const IconMatch = Object.entries(iconsByKeyword).find(([k]) => keyword.includes(k));
            const Icon = IconMatch ? IconMatch[1] : iconsByKeyword.default;

            const livresCollection = livres.filter(
              l => l.collection_id === collection.id && l.est_publie
            );
            const count = livresCollection.length;
            const covers = livresCollection.slice(0, 3).map(l => l.couverture_url).filter(Boolean);

            return (
              <Link
                key={collection.id}
                to={`/livres?collection=${collection.id}`}
                className={`group relative rounded-2xl border ${colors.border} ${colors.bg} p-5 hover:shadow-md transition-all duration-300 flex flex-col gap-4`}
              >
                {/* Icône + titre */}
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg ${colors.icon} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className={`font-playfair font-bold text-base ${colors.text} leading-snug line-clamp-2`}>
                      {collection.nom}
                    </h3>
                    {count > 0 && (
                      <span className="text-xs text-brown-400 mt-0.5 block">
                        {t('parcours.ouvrage', { count })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                {collection.description && (
                  <p className="text-xs text-brown-500 leading-relaxed line-clamp-2">
                    {collection.description}
                  </p>
                )}

                {/* Mini couvertures */}
                {covers.length > 0 && (
                  <div className="flex gap-1.5">
                    {covers.map((url, i) => (
                      <div key={i} className="w-10 h-13 rounded overflow-hidden bg-cream-200 flex-shrink-0" style={{ height: '52px' }}>
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {count > 3 && (
                      <div className="w-10 flex-shrink-0 flex items-center justify-center text-xs font-bold text-brown-500" style={{ height: '52px' }}>
                        +{count - 3}
                      </div>
                    )}
                  </div>
                )}

                {/* CTA */}
                <div className={`flex items-center gap-1 text-xs font-semibold ${colors.text} group-hover:gap-2 transition-all`}>
                  {t('parcours.commencerParcours')}
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ParcoursSection;
