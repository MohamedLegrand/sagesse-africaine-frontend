import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, ArrowRight, RotateCcw, ArrowLeft } from 'lucide-react';

const FormulaireOtp = ({ email, onConfirm, onRenvoyer, onRetour, isLoading, isRenvoiEnCours }) => {
  const { t } = useTranslation('auth');
  const [code, setCode] = useState('');

  const handleChange = (e) => {
    const valeur = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(valeur);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.length !== 6) return;
    onConfirm(code);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col items-center text-center mb-2">
        <div className="w-12 h-12 rounded-full bg-terra-50 flex items-center justify-center mb-3">
          <ShieldCheck className="w-6 h-6 text-terra-500" />
        </div>
        <p className="text-brown-600 text-sm">
          {t('formulaireOtp.instruction')}<br />
          <strong className="text-brown-900">{email}</strong>
        </p>
      </div>

      <div>
        <label htmlFor="code-otp" className="input-label">{t('formulaireOtp.codeLabel')}</label>
        <input
          id="code-otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={code}
          onChange={handleChange}
          required
          maxLength={6}
          className="input-field text-center text-2xl tracking-[0.5em] font-bold"
          placeholder="000000"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || code.length !== 6}
        className="w-full btn-primary py-3 text-sm justify-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {t('formulaireOtp.confirmer')}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <div className="flex items-center justify-between text-sm pt-2">
        <button
          type="button"
          onClick={onRetour}
          className="flex items-center gap-1 text-brown-500 hover:text-brown-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> {t('formulaireOtp.retour')}
        </button>
        <button
          type="button"
          onClick={onRenvoyer}
          disabled={isRenvoiEnCours}
          className="flex items-center gap-1.5 font-semibold text-terra-600 hover:text-terra-800 transition-colors disabled:opacity-60"
        >
          <RotateCcw className="w-3.5 h-3.5" /> {t('formulaireOtp.renvoyerCode')}
        </button>
      </div>
    </form>
  );
};

export default FormulaireOtp;
