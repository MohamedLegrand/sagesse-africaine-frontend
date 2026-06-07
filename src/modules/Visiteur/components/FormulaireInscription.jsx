import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaCheckCircle } from 'react-icons/fa';

const FormulaireInscription = ({ onSubmit, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    mot_de_passe: '',
    confirmation_mot_de_passe: '',
  });
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Vérifier la correspondance des mots de passe
    if (name === 'mot_de_passe' || name === 'confirmation_mot_de_passe') {
      const newMotDePasse = name === 'mot_de_passe' ? value : formData.mot_de_passe;
      const newConfirmation = name === 'confirmation_mot_de_passe' ? value : formData.confirmation_mot_de_passe;
      setPasswordMatch(newMotDePasse === newConfirmation);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.mot_de_passe !== formData.confirmation_mot_de_passe) {
      setPasswordMatch(false);
      return;
    }
    // Envoyer uniquement les champs attendus par l'API
    const submissionData = {
      email: formData.email,
      mot_de_passe: formData.mot_de_passe,
      prenom: formData.prenom,
      nom: formData.nom,
    };
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Prénom et Nom - 2 colonnes */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-amber-800 text-sm font-medium mb-2">
            Prénom
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-amber-400 text-sm" />
            </div>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-300 bg-white/50"
              placeholder="Prénom"
            />
          </div>
        </div>

        <div>
          <label className="block text-amber-800 text-sm font-medium mb-2">
            Nom
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-amber-400 text-sm" />
            </div>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-300 bg-white/50"
              placeholder="Nom"
            />
          </div>
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-amber-800 text-sm font-medium mb-2">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaEnvelope className="text-amber-400" />
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-300 bg-white/50"
            placeholder="votre@email.com"
          />
        </div>
      </div>

      {/* Mot de passe */}
      <div>
        <label className="block text-amber-800 text-sm font-medium mb-2">
          Mot de passe
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaLock className="text-amber-400" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            name="mot_de_passe"
            value={formData.mot_de_passe}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-12 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-300 bg-white/50"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <FaEyeSlash className="text-amber-400 hover:text-amber-600" />
            ) : (
              <FaEye className="text-amber-400 hover:text-amber-600" />
            )}
          </button>
        </div>
      </div>

      {/* Confirmation mot de passe */}
      <div>
        <label className="block text-amber-800 text-sm font-medium mb-2">
          Confirmer le mot de passe
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaLock className="text-amber-400" />
          </div>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmation_mot_de_passe"
            value={formData.confirmation_mot_de_passe}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-12 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-300 bg-white/50"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showConfirmPassword ? (
              <FaEyeSlash className="text-amber-400 hover:text-amber-600" />
            ) : (
              <FaEye className="text-amber-400 hover:text-amber-600" />
            )}
          </button>
        </div>
        {!passwordMatch && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            Les mots de passe ne correspondent pas
          </p>
        )}
      </div>

      {/* Indicateur de sécurité */}
      <div className="flex items-center gap-2 text-xs text-amber-500">
        <FaCheckCircle />
        <span>Le mot de passe doit contenir au moins 8 caractères</span>
      </div>

      {/* Bouton inscription */}
      <button
        type="submit"
        disabled={isLoading || !passwordMatch}
        className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            Créer mon compte
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>

      {/* Séparateur */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-amber-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-amber-400">ou</span>
        </div>
      </div>

      {/* Lien connexion */}
      <p className="text-center text-amber-600">
        Déjà un compte ?{' '}
        <Link to="/connexion" className="text-amber-700 font-semibold hover:text-amber-500 transition">
          Se connecter
        </Link>
      </p>
    </form>
  );
};

export default FormulaireInscription;