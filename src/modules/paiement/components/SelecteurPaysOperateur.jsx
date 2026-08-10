import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import paiementsService from '../../../services/paiementsService';

// Construit l'emoji drapeau à partir d'un code pays ISO 3166-1 alpha-2 (ex: "CM" -> 🇨🇲).
const drapeauEmoji = (iso2) =>
  iso2
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));

// Couleurs de marque officielles des opérateurs (badge coloré, pas de logo protégé).
const OPERATEURS_INFO = {
  MTN: { nom: 'MTN Mobile Money', bg: '#FFCC00', texte: '#000000' },
  ORANGE: { nom: 'Orange Money', bg: '#FF7900', texte: '#FFFFFF' },
  MOOV: { nom: 'Moov Money', bg: '#0057A0', texte: '#FFFFFF' },
  WAVE: { nom: 'Wave', bg: '#1DC8F2', texte: '#00213D' },
  AIRTEL: { nom: 'Airtel Money', bg: '#E4022D', texte: '#FFFFFF' },
  FREE: { nom: 'Free Money', bg: '#CE0500', texte: '#FFFFFF' },
  EXPRESSO: { nom: 'Expresso', bg: '#7A1FA2', texte: '#FFFFFF' },
  MPESA: { nom: 'M-Pesa', bg: '#4CB847', texte: '#000000' },
  AFRIMONEY: { nom: 'Afrimoney', bg: '#E2001A', texte: '#FFFFFF' },
  CORIS: { nom: 'Coris Money', bg: '#003DA5', texte: '#FFFFFF' },
  TMONEY: { nom: 'T-Money', bg: '#0072CE', texte: '#FFFFFF' },
  FLOOZ: { nom: 'Flooz', bg: '#F7941D', texte: '#000000' },
  QMONEY: { nom: 'QMoney', bg: '#6E2585', texte: '#FFFFFF' },
};

const infoOperateur = (code) => OPERATEURS_INFO[code] || { nom: code, bg: '#D97706', texte: '#FFFFFF' };

/**
 * Sélecteur pays (drapeau) + opérateur Mobile Money (badge couleur de marque),
 * avec animation de transition à chaque changement.
 */
const SelecteurPaysOperateur = ({ country, operator, onChangeCountry, onChangeOperator, montantXaf }) => {
  const { t } = useTranslation('paiement');
  const [paysListe, setPaysListe] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    paiementsService.getPaysOperateurs()
      .then(setPaysListe)
      .catch(() => setPaysListe([]))
      .finally(() => setChargement(false));
  }, []);

  const paysActuel = paysListe.find((p) => p.pays === country);

  if (chargement) {
    return (
      <div className="flex justify-center py-6">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-amber-700 text-sm font-medium mb-2">{t('pays')}</label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {paysListe.map((p) => (
            <motion.button
              key={p.pays}
              type="button"
              onClick={() => onChangeCountry(p.pays)}
              whileTap={{ scale: 0.94 }}
              animate={{ scale: country === p.pays ? 1.05 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-colors ${
                country === p.pays
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-amber-100 hover:border-amber-300'
              }`}
            >
              <span className="text-2xl leading-none">{drapeauEmoji(p.pays)}</span>
              <span className="text-[11px] text-gray-600 text-center leading-tight">{p.nom}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-amber-700 text-sm font-medium mb-2">{t('operateur')}</label>
        <AnimatePresence mode="wait">
          <motion.div
            key={country}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.18 }}
            className="grid grid-cols-2 gap-2"
          >
            {(paysActuel?.operateurs || []).map((code) => {
              const info = infoOperateur(code);
              const selectionne = operator === code;
              return (
                <motion.button
                  key={code}
                  type="button"
                  onClick={() => onChangeOperator(code)}
                  whileTap={{ scale: 0.96 }}
                  animate={{ scale: selectionne ? 1.03 : 1 }}
                  className={`px-3 py-3 rounded-xl font-semibold text-sm border-2 transition-shadow ${
                    selectionne ? 'border-amber-500 shadow-md' : 'border-transparent opacity-85 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: info.bg, color: info.texte }}
                >
                  {info.nom}
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {paysActuel && montantXaf != null && (
        <motion.div
          key={paysActuel.devise}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 rounded-xl p-3 text-sm text-amber-700 flex justify-between items-center"
        >
          <span>{t('montantAPayer')}</span>
          <span className="font-bold text-base">
            {Math.round(montantXaf * paysActuel.taux_depuis_xaf).toLocaleString()} {paysActuel.devise}
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default SelecteurPaysOperateur;
