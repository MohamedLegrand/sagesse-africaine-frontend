import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaBook, FaCreditCard, FaMoneyBillWave, FaMobileAlt, 
  FaCheckCircle, FaArrowLeft, FaLock 
} from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const PaiementPage = () => {
  const navigate = useNavigate();
  const [panier, setPanier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('carte');
  const [formData, setFormData] = useState({
    nom: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  useEffect(() => {
    fetchPanier();
  }, []);

  const fetchPanier = async () => {
    try {
      const response = await api.get('/panier/');
      if (!response.data.lignes || response.data.lignes.length === 0) {
        toast.error('Votre panier est vide');
        navigate('/dashboard/panier');
        return;
      }
      setPanier(response.data);
    } catch (error) {
      console.error('Erreur chargement panier:', error);
      toast.error('Erreur chargement du panier');
      navigate('/dashboard/panier');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    
    try {
      // Appel API pour passer la commande
      const response = await api.post('/panier/commander');
      
      toast.success('Paiement effectué avec succès !');
      navigate('/dashboard/historique');
    } catch (error) {
      console.error('Erreur paiement:', error);
      toast.error('Erreur lors du paiement. Veuillez réessayer.');
    } finally {
      setProcessing(false);
    }
  };

  const methodes = [
    { id: 'carte', nom: 'Carte bancaire', icon: FaCreditCard },
    { id: 'mobile', nom: 'Orange Money', icon: FaMobileAlt },
    { id: 'especes', nom: 'Paiement à la livraison', icon: FaMoneyBillWave },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-amber-100">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!panier || panier.lignes?.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 fixed top-0 right-0 left-0 z-40">
        <div className="px-6 py-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition">
            <FaArrowLeft />
            Retour au panier
          </button>
        </div>
      </header>

      {/* Menu latéral */}
      <aside className="w-64 bg-white/80 backdrop-blur-sm border-r border-amber-200 min-h-screen fixed left-0 top-0 pt-24">
        <div className="px-4 py-6">
          <nav className="space-y-1">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-amber-700 hover:bg-amber-100 transition">
              <FaBook className="text-lg" />
              <span>Tableau de bord</span>
            </Link>
            <Link to="/dashboard/boutique" className="flex items-center gap-3 px-4 py-3 rounded-xl text-amber-700 hover:bg-amber-100 transition">
              <FaBook className="text-lg" />
              <span>Boutique</span>
            </Link>
            <Link to="/dashboard/panier" className="flex items-center gap-3 px-4 py-3 rounded-xl text-amber-700 hover:bg-amber-100 transition">
              <FaBook className="text-lg" />
              <span>Mon panier</span>
            </Link>
            <Link to="/dashboard/paiement" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg">
              <FaCreditCard className="text-lg" />
              <span>Paiement</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="ml-64 pt-24 p-6">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-3xl font-playfair font-bold text-amber-800 mb-6">
            Paiement
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulaire de paiement */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                <h2 className="text-xl font-playfair font-bold text-amber-800 mb-6">
                  Mode de paiement
                </h2>

                {/* Méthodes de paiement */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {methodes.map((methode) => (
                    <button
                      key={methode.id}
                      onClick={() => setSelectedMethod(methode.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                        selectedMethod === methode.id
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-amber-200 hover:border-amber-300'
                      }`}
                    >
                      <methode.icon className={`text-2xl ${
                        selectedMethod === methode.id ? 'text-amber-600' : 'text-amber-400'
                      }`} />
                      <span className={`text-sm font-medium ${
                        selectedMethod === methode.id ? 'text-amber-700' : 'text-gray-600'
                      }`}>
                        {methode.nom}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Formulaire carte bancaire */}
                {selectedMethod === 'carte' && (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-amber-700 text-sm font-medium mb-2">
                        Nom sur la carte
                      </label>
                      <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                        placeholder="Jean Dupont"
                      />
                    </div>
                    <div>
                      <label className="block text-amber-700 text-sm font-medium mb-2">
                        Numéro de carte
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        required
                        maxLength="19"
                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-amber-700 text-sm font-medium mb-2">
                          Date d'expiration
                        </label>
                        <input
                          type="text"
                          name="expiry"
                          value={formData.expiry}
                          onChange={handleChange}
                          required
                          placeholder="MM/AA"
                          className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-amber-700 text-sm font-medium mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleChange}
                          required
                          maxLength="4"
                          className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                          placeholder="123"
                        />
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
                    >
                      {processing ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <FaLock />
                          Payer {panier?.total} €
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Formulaire Orange Money */}
                {selectedMethod === 'mobile' && (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-amber-700 text-sm font-medium mb-2">
                        Numéro Orange Money
                      </label>
                      <input
                        type="tel"
                        required
                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                        placeholder="6X XX XX XX"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {processing ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <FaMobileAlt />
                          Payer {panier?.total} €
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Paiement à la livraison */}
                {selectedMethod === 'especes' && (
                  <form onSubmit={handleSubmit}>
                    <div className="bg-amber-50 rounded-xl p-4 mb-6">
                      <p className="text-amber-700 text-sm">
                        Vous payez à la réception de votre commande. Un livreur vous contactera pour la livraison.
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {processing ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <FaCheckCircle />
                          Confirmer la commande
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Sécurité */}
              <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-3">
                <FaLock className="text-green-500 text-xl" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Paiement sécurisé</p>
                  <p className="text-xs text-gray-500">Vos informations bancaires sont cryptées</p>
                </div>
              </div>
            </div>

            {/* Résumé de la commande */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-playfair font-bold text-amber-800 mb-4">
                  Résumé de la commande
                </h3>
                
                <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                  {panier.lignes?.map((ligne) => (
                    <div key={ligne.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {ligne.livre?.titre} x{ligne.quantite}
                      </span>
                      <span className="text-amber-700 font-medium">
                        {ligne.livre?.prix * ligne.quantite} €
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-amber-100 pt-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="text-amber-700">{panier?.total} €</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Livraison</span>
                    <span className="text-green-600">Gratuit</span>
                  </div>
                </div>
                
                <div className="border-t border-amber-200 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-amber-800">Total</span>
                    <span className="text-2xl font-bold text-amber-700">{panier?.total} €</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaiementPage;