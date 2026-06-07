import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaShieldAlt, FaUserPlus } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FormulaireInscription from '../components/FormulaireInscription';
import toast from 'react-hot-toast';
import api from '../../../services/api';

const InscriptionPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (formData) => {
    setIsLoading(true);
    try {
      // Appel API vers le backend FastAPI
      const response = await api.post('/auth/register', {
        email: formData.email,
        mot_de_passe: formData.mot_de_passe,
        prenom: formData.prenom,
        nom: formData.nom,
      });

      console.log('Inscription réussie:', response.data);
      toast.success('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      navigate('/connexion');
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      if (error.response?.status === 422) {
        toast.error('Données invalides. Vérifiez votre email.');
      } else if (error.response?.status === 400) {
        toast.error('Cet email est déjà utilisé.');
      } else {
        toast.error('Erreur lors de l\'inscription. Veuillez réessayer.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {/* Header de la page */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mb-4 shadow-lg">
                <FaUserPlus className="text-amber-600 text-3xl" />
              </div>
              <h1 className="text-3xl font-playfair font-bold text-amber-800 mb-2">
                Inscription
              </h1>
              <p className="text-amber-500">
                Rejoignez la communauté SAGESSE AFRICAINE
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="w-12 h-px bg-amber-300"></div>
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                <div className="w-12 h-px bg-amber-300"></div>
              </div>
            </div>

            {/* Carte du formulaire */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-100 p-8">
              <FormulaireInscription onSubmit={handleRegister} isLoading={isLoading} />
            </div>

            {/* Avantages */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/40 rounded-xl border border-amber-100">
                <FaBook className="text-amber-500 mx-auto mb-2" />
                <p className="text-xs text-amber-700">Accès à votre bibliothèque</p>
              </div>
              <div className="text-center p-3 bg-white/40 rounded-xl border border-amber-100">
                <FaShieldAlt className="text-amber-500 mx-auto mb-2" />
                <p className="text-xs text-amber-700">Téléchargements sécurisés</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InscriptionPage;