import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft, FaBook } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import authService from '../../../services/authService';

const OublierMotDePassePage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [envoye, setEnvoye] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.oublierMotDePasse(email);
      setEnvoye(true);
      toast.success('Email de réinitialisation envoyé !');
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error('Aucun compte associé à cet email');
      } else {
        toast.error('Erreur lors de l\'envoi. Veuillez réessayer.');
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
                Mot de passe oublié
              </h1>
              <p className="text-amber-500">
                Entrez votre email pour recevoir un lien de réinitialisation
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-100 p-8">
              {envoye ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaEnvelope className="text-green-600 text-3xl" />
                  </div>
                  <h2 className="text-xl font-playfair font-bold text-amber-800 mb-2">
                    Email envoyé !
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Vérifiez votre boite mail et cliquez sur le lien de réinitialisation.
                  </p>
                  <Link
                    to="/connexion"
                    className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition"
                  >
                    <FaArrowLeft />
                    Retour à la connexion
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-amber-800 text-sm font-medium mb-2">
                      Adresse email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-amber-400" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-300 bg-white/50"
                        placeholder="votre@email.com"
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
                        Envoi en cours...
                      </div>
                    ) : (
                      'Envoyer le lien de réinitialisation'
                    )}
                  </button>

                  <div className="text-center">
                    <Link
                      to="/connexion"
                      className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-700 text-sm transition"
                    >
                      <FaArrowLeft />
                      Retour à la connexion
                    </Link>
                  </div>
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

export default OublierMotDePassePage;
