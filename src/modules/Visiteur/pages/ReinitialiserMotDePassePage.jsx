import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash, FaBook } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import authService from '../../../services/authService';

const ReinitialiserMotDePassePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nouveauMotDePasse !== confirmation) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (!token) {
      toast.error('Lien de réinitialisation invalide');
      return;
    }
    setLoading(true);
    try {
      await authService.reinitialiserMotDePasse(token, nouveauMotDePasse);
      toast.success('Mot de passe réinitialisé avec succès !');
      navigate('/connexion');
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error('Lien invalide ou expiré. Veuillez recommencer.');
      } else {
        toast.error('Erreur lors de la réinitialisation');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mb-4 shadow-lg">
                <FaBook className="text-amber-600 text-3xl" />
              </div>
              <h1 className="text-3xl font-playfair font-bold text-amber-800 mb-2">
                Nouveau mot de passe
              </h1>
              <p className="text-amber-500">Choisissez un nouveau mot de passe sécurisé</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-100 p-8">
              {!token ? (
                <div className="text-center py-4">
                  <p className="text-red-600 mb-4">Lien de réinitialisation invalide ou manquant.</p>
                  <Link to="/mot-de-passe-oublie" className="text-amber-600 hover:text-amber-700 font-medium">
                    Demander un nouveau lien
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-amber-800 text-sm font-medium mb-2">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-amber-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={nouveauMotDePasse}
                        onChange={(e) => setNouveauMotDePasse(e.target.value)}
                        required
                        minLength={8}
                        className="w-full pl-10 pr-12 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-300 bg-white/50"
                        placeholder="Minimum 8 caractères"
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

                  <div>
                    <label className="block text-amber-800 text-sm font-medium mb-2">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-amber-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmation}
                        onChange={(e) => setConfirmation(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-300 bg-white/50"
                        placeholder="Répétez le mot de passe"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Réinitialisation...
                      </div>
                    ) : (
                      'Réinitialiser le mot de passe'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReinitialiserMotDePassePage;
