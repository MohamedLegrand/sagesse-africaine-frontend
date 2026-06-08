import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaShieldAlt } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FormulaireConnexion from '../components/FormulaireConnexion';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import guestCart from '../../../services/guestCart';

const ConnexionPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        mot_de_passe: formData.mot_de_passe,
      });

      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;

      const userResponse = await api.get('/utilisateurs/me');
      const user = userResponse.data;
      localStorage.setItem('user_role', user.role);
      
      toast.success('Connexion réussie !');

      // 6. Fusionner le panier invité dans le panier serveur
      const guestItems = guestCart.getItems();
      if (guestItems.length > 0) {
        await Promise.all(
          guestItems.map(item =>
            api.post('/panier/ajouter', { livre_id: item.livre_id, quantite: item.quantite }).catch(() => {})
          )
        );
        guestCart.clear();
        toast.success(`${guestItems.length} article(s) de votre panier invité transféré(s)`);
      }

      // 7. Redirection — returnTo prioritaire, sinon selon le rôle
      const returnTo = localStorage.getItem('auth_return_to');
      if (returnTo) {
        localStorage.removeItem('auth_return_to');
        navigate(returnTo);
        return;
      }

      if (formData.email === 'sagesse@gmail.com') {
        navigate('/admin');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      
    } catch (error) {
      console.error('=== ERREUR DE CONNEXION ===');
      console.error('Message:', error.message);
      console.error('Status:', error.response?.status);
      console.error('Données erreur:', error.response?.data);
      
      if (error.response?.status === 401) {
        toast.error('Email ou mot de passe incorrect');
      } else if (error.response?.status === 422) {
        toast.error('Données invalides');
      } else {
        toast.error('Erreur de connexion. Veuillez réessayer.');
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
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mb-4 shadow-lg">
                <FaBook className="text-amber-600 text-3xl" />
              </div>
              <h1 className="text-3xl font-playfair font-bold text-amber-800 mb-2">
                Connexion
              </h1>
              <p className="text-amber-500">
                Accédez à votre bibliothèque personnelle
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="w-12 h-px bg-amber-300"></div>
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                <div className="w-12 h-px bg-amber-300"></div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-100 p-8">
              <FormulaireConnexion onSubmit={handleLogin} isLoading={isLoading} />
            </div>

            <div className="text-center mt-8">
              <p className="text-xs text-amber-400 flex items-center justify-center gap-2">
                <FaShieldAlt />
                Vos données sont sécurisées
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ConnexionPage;