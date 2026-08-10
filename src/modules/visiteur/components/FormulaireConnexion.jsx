import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const FormulaireConnexion = ({ onSubmit, isLoading }) => {
  const { t } = useTranslation('auth');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', mot_de_passe: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Email */}
      <div>
        <label htmlFor="email" className="input-label">{t('formulaire.email')}</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-300" />
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-field pl-10"
            placeholder="votre@email.com"
            autoComplete="email"
          />
        </div>
      </div>

      {/* Mot de passe */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="mot_de_passe" className="input-label mb-0">{t('formulaire.motDePasse')}</label>
          <Link to="/mot-de-passe-oublie" className="text-xs text-terra-500 hover:text-terra-700 transition-colors font-medium">
            {t('formulaire.motDePasseOublie')}
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-300" />
          <input
            id="mot_de_passe"
            type={showPassword ? 'text' : 'password'}
            name="mot_de_passe"
            value={formData.mot_de_passe}
            onChange={handleChange}
            required
            className="input-field pl-10 pr-10"
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-300 hover:text-brown-600 transition-colors"
            aria-label={showPassword ? t('formulaire.masquer') : t('formulaire.afficher')}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Bouton */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary py-3 text-sm justify-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {t('formulaire.seConnecter')}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Séparateur */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-cream-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white text-xs text-brown-400">{t('formulaire.ou')}</span>
        </div>
      </div>

      {/* Lien inscription */}
      <p className="text-center text-sm text-brown-600">
        {t('formulaire.pasDeCompte')}{' '}
        <Link to="/inscription" className="font-semibold text-terra-600 hover:text-terra-800 transition-colors">
          {t('formulaire.creerCompteGratuit')}
        </Link>
      </p>
    </form>
  );
};

export default FormulaireConnexion;
