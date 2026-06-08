import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaBook, FaShoppingCart, FaArrowLeft, FaStar, FaCheck, FaLock } from 'react-icons/fa';
import Header from '../../visiteur/components/Header';
import Footer from '../../visiteur/components/Footer';
import api from '../../../services/api';
import guestCart from '../../../services/guestCart';
import toast from 'react-hot-toast';

const DetailLivrePubliquePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [livre, setLivre] = useState(null);
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [livreRes, avisRes] = await Promise.all([
          api.get(`/livres/${id}`),
          api.get(`/avis/livre/${id}`).catch(() => ({ data: { avis: [] } })),
        ]);
        setLivre(livreRes.data);
        setAvis(avisRes.data?.avis?.filter(a => a.est_approuve) || []);
      } catch {
        toast.error('Livre introuvable');
        navigate('/livres');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      guestCart.addItem(livre);
      toast.success('Livre ajouté au panier');
      setAdded(true);
      return;
    }
    setAdding(true);
    try {
      await api.post('/panier/ajouter', { livre_id: livre.id, quantite: 1 });
      toast.success('Livre ajouté au panier');
      window.dispatchEvent(new Event('cartUpdated'));
      setAdded(true);
    } catch {
      toast.error("Erreur lors de l'ajout au panier");
    } finally {
      setAdding(false);
    }
  };

  const handlePayer = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      localStorage.setItem('auth_return_to', '/dashboard/paiement');
      toast('Connectez-vous pour finaliser votre commande', { icon: '🔐' });
      navigate('/connexion');
      return;
    }
    navigate('/dashboard/paiement');
  };

  const renderEtoiles = (note) =>
    Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} className={i < note ? 'text-amber-500' : 'text-gray-300'} />
    ));

  const noteMoyenne = avis.length > 0
    ? Math.round(avis.reduce((s, a) => s + a.note, 0) / avis.length)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
        <Header />
        <div className="flex justify-center items-center pt-40">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!livre) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">

          {/* Retour */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition mb-6 font-medium"
          >
            <FaArrowLeft />
            Retour
          </button>

          {/* Carte principale */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 flex flex-col md:flex-row gap-8">
            {/* Couverture */}
            <div className="w-full md:w-48 flex-shrink-0">
              <div className="w-full md:w-48 h-64 bg-amber-100 rounded-xl overflow-hidden flex items-center justify-center">
                {livre.couverture_url ? (
                  <img
                    src={livre.couverture_url}
                    alt={livre.titre}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = '/images/default-book.png'; }}
                  />
                ) : (
                  <FaBook className="text-amber-300 text-6xl" />
                )}
              </div>
            </div>

            {/* Infos */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-playfair font-bold text-amber-800 mb-2">
                {livre.titre}
              </h1>
              <p className="text-amber-500 text-lg mb-3">{livre.auteur}</p>

              {/* Note */}
              {avis.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">{renderEtoiles(noteMoyenne)}</div>
                  <span className="text-sm text-gray-500">({avis.length} avis)</span>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {livre.langue && (
                  <span className="text-xs px-3 py-1 bg-amber-100 text-amber-700 rounded-full capitalize">
                    {livre.langue}
                  </span>
                )}
                {livre.isbn && (
                  <span className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                    ISBN : {livre.isbn}
                  </span>
                )}
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  livre.est_gratuit ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {livre.est_gratuit ? 'Gratuit' : `${livre.prix?.toLocaleString()} FCFA`}
                </span>
              </div>

              {/* Description */}
              {livre.description && (
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {livre.description}
                </p>
              )}

              {/* Prix + actions */}
              <div className="border-t border-amber-100 pt-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <span className="text-3xl font-bold text-amber-700">
                  {livre.est_gratuit ? 'Gratuit' : `${livre.prix?.toLocaleString()} FCFA`}
                </span>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={handleAddToCart}
                    disabled={adding}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition hover:shadow-lg ${
                      added
                        ? 'bg-green-500 text-white'
                        : 'bg-gradient-to-r from-amber-600 to-amber-700 text-white disabled:opacity-50'
                    }`}
                  >
                    {adding ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : added ? (
                      <FaCheck />
                    ) : (
                      <FaShoppingCart />
                    )}
                    {added ? 'Ajouté au panier' : 'Ajouter au panier'}
                  </button>

                  {!livre.est_gratuit && (
                    <button
                      onClick={handlePayer}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold border-2 border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white transition"
                    >
                      <FaLock className="text-sm" />
                      Acheter maintenant
                    </button>
                  )}
                </div>
              </div>

              {/* Info connexion */}
              {!localStorage.getItem('access_token') && (
                <p className="text-xs text-amber-500 mt-3 flex items-center gap-1">
                  <FaLock className="text-xs" />
                  Une connexion sera requise pour finaliser le paiement
                </p>
              )}
            </div>
          </div>

          {/* Section avis */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-playfair font-bold text-amber-800 mb-5">
              Avis des lecteurs {avis.length > 0 && `(${avis.length})`}
            </h2>

            {avis.length === 0 ? (
              <div className="text-center py-10">
                <FaStar className="text-amber-300 text-5xl mx-auto mb-3" />
                <p className="text-gray-500">Aucun avis pour ce livre.</p>
                <Link to="/connexion" className="text-amber-600 text-sm hover:underline mt-2 inline-block">
                  Connectez-vous pour laisser un avis
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {avis.map((avisItem) => (
                  <div key={avisItem.id} className="border border-amber-100 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-0.5">{renderEtoiles(avisItem.note)}</div>
                      <span className="text-xs text-gray-400">
                        {new Date(avisItem.cree_le).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {avisItem.commentaire && (
                      <p className="text-gray-600 text-sm italic">"{avisItem.commentaire}"</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* CTA connecté */}
            {!localStorage.getItem('access_token') && avis.length > 0 && (
              <div className="mt-6 text-center">
                <Link
                  to="/connexion"
                  className="text-sm text-amber-600 hover:text-amber-700 underline"
                >
                  Connectez-vous pour laisser votre avis
                </Link>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DetailLivrePubliquePage;
