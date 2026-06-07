import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';

const FormulaireConnexion = ({ onSubmit, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    mot_de_passe: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      {/* Mot de passe oublié */}
      <div className="text-right">
        <Link
          to="/mot-de-passe-oublie"
          className="text-sm text-amber-500 hover:text-amber-700 transition"
        >
          Mot de passe oublié ?
        </Link>
      </div>

      {/* Bouton connexion */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            Se connecter
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

      {/* Lien inscription */}
      <p className="text-center text-amber-600">
        Pas encore de compte ?{' '}
        <Link to="/inscription" className="text-amber-700 font-semibold hover:text-amber-500 transition">
          Créer un compte
        </Link>
      </p>
    </form>
  );
};

export default FormulaireConnexion;