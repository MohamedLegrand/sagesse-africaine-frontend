import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaBook, FaTrash, FaPlus, FaMinus, 
  FaShoppingCart, FaArrowLeft, FaCreditCard 
} from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const PanierPage = () => {
  const navigate = useNavigate();
  const [panier, setPanier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchPanier();
  }, []);

  const fetchPanier = async () => {
    try {
      const response = await api.get('/panier/');
      setPanier(response.data);
    } catch (error) {
      console.error('Erreur chargement panier:', error);
      toast.error('Erreur chargement du panier');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantite = async (livreId, nouvelleQuantite) => {
    if (nouvelleQuantite < 1) return;
    setUpdating(true);
    try {
      // Mettre à jour la quantité (ajouter un nouveau avec la quantité ou retirer)
      if (nouvelleQuantite === 0) {
        await api.delete(`/panier/retirer/${livreId}`);
      } else {
        // D'abord retirer l'ancien, puis ajouter le nouveau
        await api.delete(`/panier/retirer/${livreId}`);
        await api.post('/panier/ajouter', { livre_id: livreId, quantite: nouvelleQuantite });
      }
      await fetchPanier();
      toast.success('Panier mis à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setUpdating(false);
    }
  };

  const retirerArticle = async (livreId) => {
    setUpdating(true);
    try {
      await api.delete(`/panier/retirer/${livreId}`);
      await fetchPanier();
      toast.success('Article retiré');
    } catch (error) {
      toast.error('Erreur lors du retrait');
    } finally {
      setUpdating(false);
    }
  };

  const viderPanier = async () => {
    if (!window.confirm('Voulez-vous vraiment vider votre panier ?')) return;
    try {
      await api.delete('/panier/vider');
      await fetchPanier();
      toast.success('Panier vidé');
    } catch (error) {
      toast.error('Erreur lors du vidage');
    }
  };

  const passerCommande = async () => {
    try {
      const response = await api.post('/panier/commander');
      toast.success('Commande passée avec succès !');
      navigate('/dashboard/historique');
    } catch (error) {
      toast.error('Erreur lors de la commande');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-amber-100">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const lignes = panier?.lignes || [];
  const total = panier?.total || 0;
  const nombreLivres = panier?.nombre_livres || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 fixed top-0 right-0 left-0 z-40">
        <div className="px-6 py-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition">
            <FaArrowLeft />
            Retour
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
              <FaShoppingCart className="text-lg" />
              <span>Boutique</span>
            </Link>
            <Link to="/dashboard/panier" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg">
              <FaShoppingCart className="text-lg" />
              <span>Mon panier</span>
            </Link>
            <Link to="/dashboard/bibliotheque" className="flex items-center gap-3 px-4 py-3 rounded-xl text-amber-700 hover:bg-amber-100 transition">
              <FaBook className="text-lg" />
              <span>Ma bibliothèque</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="ml-64 pt-24 p-6">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl font-playfair font-bold text-amber-800 mb-6">
            Mon panier
            {nombreLivres > 0 && (
              <span className="text-lg text-amber-500 ml-2">({nombreLivres} articles)</span>
            )}
          </h1>

          {lignes.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <FaShoppingCart className="text-amber-300 text-6xl mx-auto mb-4" />
              <h2 className="text-2xl font-playfair text-amber-700 mb-2">Votre panier est vide</h2>
              <p className="text-gray-500 mb-6">Découvrez notre catalogue et ajoutez des livres</p>
              <Link to="/dashboard/boutique" className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition inline-block">
                Découvrir la boutique
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Liste des articles */}
              <div className="lg:col-span-2 space-y-4">
                {lignes.map((ligne) => (
                  <div key={ligne.id} className="bg-white rounded-2xl shadow-lg p-4 flex gap-4">
                    {/* Image */}
                    <div className="w-20 h-28 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {ligne.livre?.couverture_url ? (
                        <img src={ligne.livre.couverture_url} alt="" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <FaBook className="text-amber-300 text-3xl" />
                      )}
                    </div>

                    {/* Infos */}
                    <div className="flex-1">
                      <Link to={`/dashboard/livre/${ligne.livre_id}`}>
                        <h3 className="font-playfair font-bold text-amber-800 hover:text-amber-600 transition">
                          {ligne.livre?.titre || 'Livre'}
                        </h3>
                      </Link>
                      <p className="text-amber-500 text-sm">{ligne.livre?.auteur || 'Auteur'}</p>
                      <p className="text-amber-700 font-bold mt-1">{ligne.livre?.prix || 0} €</p>
                    </div>

                    {/* Quantité et actions */}
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-3">
                        <button
                          onClick={() => updateQuantite(ligne.livre_id, ligne.quantite - 1)}
                          disabled={updating}
                          className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition flex items-center justify-center disabled:opacity-50"
                        >
                          <FaMinus className="text-xs" />
                        </button>
                        <span className="w-8 text-center text-amber-800 font-medium">{ligne.quantite}</span>
                        <button
                          onClick={() => updateQuantite(ligne.livre_id, ligne.quantite + 1)}
                          disabled={updating}
                          className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition flex items-center justify-center disabled:opacity-50"
                        >
                          <FaPlus className="text-xs" />
                        </button>
                      </div>
                      <button
                        onClick={() => retirerArticle(ligne.livre_id)}
                        disabled={updating}
                        className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1 ml-auto"
                      >
                        <FaTrash />
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}

                {/* Bouton vider panier */}
                <button
                  onClick={viderPanier}
                  disabled={updating}
                  className="text-red-500 hover:text-red-600 text-sm flex items-center gap-2 mt-4"
                >
                  <FaTrash />
                  Vider le panier
                </button>
              </div>

              {/* Résumé */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                  <h3 className="text-xl font-playfair font-bold text-amber-800 mb-4">
                    Récapitulatif
                  </h3>
                  
                  <div className="space-y-3 border-b border-amber-100 pb-4 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sous-total</span>
                      <span className="text-amber-800 font-medium">{total} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frais de livraison</span>
                      <span className="text-amber-800 font-medium">Gratuit</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mb-6">
                    <span className="text-lg font-bold text-amber-800">Total</span>
                    <span className="text-2xl font-bold text-amber-700">{total} €</span>
                  </div>
                  
                  <button
                    onClick={passerCommande}
                    disabled={updating}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <FaCreditCard />
                    Passer la commande
                  </button>
                  
                  <Link to="/dashboard/boutique" className="block text-center text-amber-600 text-sm mt-4 hover:text-amber-700">
                    Continuer mes achats
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PanierPage;