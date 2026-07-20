import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaBook, FaHome, FaFileDownload, FaSpinner, FaHourglassHalf } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Header from '../../visiteur/components/Header';
import Footer from '../../visiteur/components/Footer';
import commandesService from '../../../services/commandesService';
import useTelechargerFacture from '../../../hooks/useTelechargerFacture';

const ConfirmationPaiementPage = () => {
  const { commandeId } = useParams();
  const navigate = useNavigate();
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const { telecharger, commandeEnCours } = useTelechargerFacture();

  useEffect(() => {
    if (!commandeId) {
      navigate('/dashboard');
      return;
    }
    commandesService.getCommande(commandeId)
      .then(setCommande)
      .catch(() => toast.error('Commande introuvable'))
      .finally(() => setLoading(false));
  }, [commandeId, navigate]);

  const estPayee = commande?.statut === 'payee';
  const telechargementFacture = commandeEnCours === commandeId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <Header />

      <main className="pt-40 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            {loading ? (
              <FaSpinner className="text-amber-500 text-4xl animate-spin mx-auto" />
            ) : !commande ? (
              <p className="text-gray-500">Commande introuvable.</p>
            ) : (
              <>
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${estPayee ? 'bg-green-100' : 'bg-amber-100'}`}>
                  {estPayee ? (
                    <FaCheckCircle className="text-green-600 text-5xl" />
                  ) : (
                    <FaHourglassHalf className="text-amber-600 text-5xl" />
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-playfair font-bold text-amber-800 mb-4">
                  {estPayee ? 'Paiement réussi !' : 'Paiement en cours de traitement'}
                </h1>

                <p className="text-gray-600 mb-6">
                  {estPayee
                    ? 'Votre commande a été validée avec succès.'
                    : "Nous confirmons votre paiement avec le prestataire. Cette page se mettra à jour une fois validé."}
                </p>

                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 text-left">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-amber-800">Commande</h2>
                    <span className="font-mono text-xs text-gray-400">{commande.id}</span>
                  </div>
                  <div className="space-y-3 mb-4">
                    {commande.lignes?.map((ligne) => (
                      <div key={ligne.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">Livre x{ligne.quantite}</span>
                        <span className="text-amber-700 font-medium">
                          {(ligne.prix_unitaire * ligne.quantite).toLocaleString()} {commande.devise}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-amber-100 pt-4 flex justify-between items-center">
                    <span className="font-semibold text-amber-800">Total payé</span>
                    <span className="text-xl font-bold text-amber-700">
                      {commande.montant_total?.toLocaleString()} {commande.devise}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                  <Link to="/dashboard/bibliotheque" className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2">
                    <FaBook />
                    Voir ma bibliothèque
                  </Link>
                  <button
                    onClick={() => telecharger(commande.id)}
                    disabled={!estPayee || telechargementFacture}
                    className="border border-amber-600 text-amber-700 px-6 py-3 rounded-xl font-semibold hover:bg-amber-600 hover:text-white transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-amber-700"
                  >
                    {telechargementFacture ? <FaSpinner className="animate-spin" /> : <FaFileDownload />}
                    Télécharger la facture
                  </button>
                </div>

                <Link to="/" className="text-amber-600 hover:text-amber-700 transition inline-flex items-center gap-2 text-sm">
                  <FaHome />
                  Retour à l'accueil
                </Link>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ConfirmationPaiementPage;
