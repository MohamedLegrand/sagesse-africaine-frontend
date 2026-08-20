import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaMobileAlt } from 'react-icons/fa';
import SelecteurPaysOperateur from './SelecteurPaysOperateur';

const FormulaireMobileMoney = ({ onSubmit, loading, montantXaf }) => {
  const { t } = useTranslation('paiement');
  const [country, setCountry] = useState('CM');
  const [operator, setOperator] = useState(null);
  const [telephone, setTelephone] = useState('');

  // On efface l'opérateur sélectionné à chaque changement de pays pour éviter
  // de soumettre une combinaison invalide (ex: MTN encore choisi après passage au Sénégal).
  useEffect(() => {
    setOperator(null);
  }, [country]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!operator) return;
    onSubmit({ operator, phoneNumber: telephone, country });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-cream-50 rounded-xl p-4">
        <p className="text-terra-700 text-sm">
          {t('notificationTelephone')}
        </p>
      </div>

      <SelecteurPaysOperateur
        country={country}
        operator={operator}
        onChangeCountry={setCountry}
        onChangeOperator={setOperator}
        montantXaf={montantXaf}
      />

      <div>
        <label className="block text-terra-700 text-sm font-medium mb-2">
          {t('numeroMobileMoney')}
        </label>
        <div className="relative">
          <FaMobileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-terra-400" />
          <input
            type="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            required
            pattern="[0-9]{8,10}"
            className="w-full pl-10 pr-4 py-3 border border-cream-200 rounded-xl focus:border-terra-500 focus:ring-2 focus:ring-terra-500/20 outline-none"
            placeholder={t('numeroPlaceholder')}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">{t('chiffresIndicatif')}</p>
      </div>

      <button
        type="submit"
        disabled={loading || !operator}
        className="w-full bg-gradient-to-r from-terra-600 to-terra-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            <FaMobileAlt />
            {t('payerAvecMobileMoney')}
          </>
        )}
      </button>
    </form>
  );
};

export default FormulaireMobileMoney;
