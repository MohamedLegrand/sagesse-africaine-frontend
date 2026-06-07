import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaBook, FaHome } from 'react-icons/fa';
import Header from '../../visiteur/components/Header';
import Footer from '../../visiteur/components/Footer';

const ConfirmationPaiementPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <Header />
      
      <main className="pt-40 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Icône de succès */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-green-600 text-5xl" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-amber-800 mb-4">
              Paiement réussi !
            </h1>
            
            <p className="text-gray-600 mb-6">
              Votre commande a été validée avec succès. Vous allez recevoir un email de confirmation.
            </p>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 text-left">
              <h2 className="font-semibold text-amber-800 mb-3">Prochaines étapes :</h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-amber-600 text-sm">1</span>
                  </div>
                  <span className="text-gray-600">Consultez votre email pour le reçu</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-amber-600 text-sm">2</span>
                  </div>
                  <span className="text-gray-600">Accédez à votre bibliothèque pour lire vos livres</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-amber-600 text-sm">3</span>
                  </div>
                  <span className="text-gray-600">Téléchargez vos e-books</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard/bibliotheque" className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2">
                <FaBook />
                Voir ma bibliothèque
              </Link>
              <Link to="/" className="border border-amber-600 text-amber-700 px-6 py-3 rounded-xl font-semibold hover:bg-amber-600 hover:text-white transition flex items-center justify-center gap-2">
                <FaHome />
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ConfirmationPaiementPage;