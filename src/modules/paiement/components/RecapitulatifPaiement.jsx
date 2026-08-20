import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaBook, FaMoneyBillWave } from 'react-icons/fa';

const RecapitulatifPaiement = ({ panier, total }) => {
  const { t } = useTranslation('paiement');
  const lignes = panier?.lignes || [];
  const nombreLivres = panier?.nombre_livres || 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32">
      <h3 className="text-xl font-playfair font-bold text-brown-800 mb-4">
        {t('recapitulatif')}
      </h3>
      
      <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
        {lignes.map((ligne) => (
          <div key={ligne.id} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <FaBook className="text-terra-500 text-sm" />
              <span className="text-gray-600 line-clamp-1">
                {ligne.livre?.titre} x{ligne.quantite}
              </span>
            </div>
            <span className="text-terra-700 font-medium">
              {(ligne.livre?.prix * ligne.quantite).toLocaleString('fr-FR')} XAF
            </span>
          </div>
        ))}
      </div>
      
      <div className="border-t border-cream-100 pt-4 mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">{t('sousTotal')}</span>
          <span className="text-terra-700">{total?.toLocaleString('fr-FR')} XAF</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">{t('fraisLivraison')}</span>
          <span className="text-green-600">{t('gratuit')}</span>
        </div>
      </div>

      <div className="border-t border-cream-200 pt-4">
        <div className="flex justify-between">
          <span className="text-lg font-bold text-brown-800">{t('totalAPayer')}</span>
          <span className="text-2xl font-bold text-terra-700">
            {total?.toLocaleString('fr-FR')} XAF
          </span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-cream-50 rounded-xl">
        <div className="flex items-center gap-2 text-sm text-terra-700">
          <FaMoneyBillWave />
          <span>{t('paiementMobileMoneySecurise')}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {t('confirmationTelephone')}
        </p>
      </div>
    </div>
  );
};

export default RecapitulatifPaiement;