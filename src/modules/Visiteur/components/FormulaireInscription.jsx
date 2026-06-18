import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check, X } from 'lucide-react';

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: '8 caractères minimum', ok: password.length >= 8 },
    { label: 'Une majuscule', ok: /[A-Z]/.test(password) },
    { label: 'Un chiffre', ok: /\d/.test(password) },
  ];
  if (!password) return null;
  return (
    <div className="mt-2 space-y-1">
      {checks.map(({ label, ok }) => (
        <div key={label} className={`flex items-center gap-1.5 text-xs ${ok ? 'text-green-600' : 'text-brown-400'}`}>
          {ok ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          {label}
        </div>
      ))}
    </div>
  );
};

const FormulaireInscription = ({ onSubmit, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    mot_de_passe: '',
    confirmation_mot_de_passe: '',
  });

  const passwordMatch =
    !formData.confirmation_mot_de_passe ||
    formData.mot_de_passe === formData.confirmation_mot_de_passe;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.mot_de_passe !== formData.confirmation_mot_de_passe) return;
    onSubmit({
      email: formData.email,
      mot_de_passe: formData.mot_de_passe,
      prenom: formData.prenom,
      nom: formData.nom,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Prénom / Nom */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="prenom" className="input-label">Prénom</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-300" />
            <input
              id="prenom"
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
              className="input-field pl-10"
              placeholder="Jean"
              autoComplete="given-name"
            />
          </div>
        </div>
        <div>
          <label htmlFor="nom" className="input-label">Nom</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-300" />
            <input
              id="nom"
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className="input-field pl-10"
              placeholder="Dupont"
              autoComplete="family-name"
            />
          </div>
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="reg-email" className="input-label">Adresse e-mail</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-300" />
          <input
            id="reg-email"
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
        <label htmlFor="reg-password" className="input-label">Mot de passe</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-300" />
          <input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            name="mot_de_passe"
            value={formData.mot_de_passe}
            onChange={handleChange}
            required
            className="input-field pl-10 pr-10"
            placeholder="••••••••"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-300 hover:text-brown-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <PasswordStrength password={formData.mot_de_passe} />
      </div>

      {/* Confirmation */}
      <div>
        <label htmlFor="confirm-password" className="input-label">Confirmer le mot de passe</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-300" />
          <input
            id="confirm-password"
            type={showConfirm ? 'text' : 'password'}
            name="confirmation_mot_de_passe"
            value={formData.confirmation_mot_de_passe}
            onChange={handleChange}
            required
            className={`input-field pl-10 pr-10 ${
              !passwordMatch ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
            }`}
            placeholder="••••••••"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-300 hover:text-brown-600 transition-colors"
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {!passwordMatch && (
          <p className="text-red-500 text-xs mt-1">Les mots de passe ne correspondent pas.</p>
        )}
      </div>

      {/* Bouton */}
      <button
        type="submit"
        disabled={isLoading || !passwordMatch}
        className="w-full btn-primary py-3 text-sm justify-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            Créer mon compte
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
          <span className="px-3 bg-white text-xs text-brown-400">ou</span>
        </div>
      </div>

      {/* Lien connexion */}
      <p className="text-center text-sm text-brown-600">
        Déjà membre ?{' '}
        <Link to="/connexion" className="font-semibold text-terra-600 hover:text-terra-800 transition-colors">
          Se connecter
        </Link>
      </p>
    </form>
  );
};

export default FormulaireInscription;
