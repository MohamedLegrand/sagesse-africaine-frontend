import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaBook, FaShoppingCart, FaArrowLeft, FaDownload, 
  FaStar, FaStarHalfAlt, FaHeart, FaShare, FaCheck
} from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const DetailLivrePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [livre, setLivre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInCart, setIsInCart] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [quantite, setQuantite] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les détails du livre
        const livreResponse = await api.get(`/livres/${id}`);
        setLivre(livreResponse.data);

        // Vérifier si l'utilisateur a déjà accès
        try {
          const accessResponse = await api.get(`/acces-livres/verifier/${id}`);
          setHasAccess(accessResponse.data === true);
        } catch {
          setHasAccess(false);
        }

        // Vérifier si dans le panier
        const panierResponse = await api.get('/panier/');
        const inCart = panierResponse.data.lignes?.some(l => l.livre_id === id);
        setIsInCart(inCart);

      } catch (error) {
        console.error('Erreur chargement:', error);
        toast.error('Livre non trouvé');
        navigate('/dashboard/boutique');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const ajouterAuPanier = async () => {
    try {
      await api.post('/panier/ajouter', { livre_id: id, quantite });
      setIsInCart(true);
      toast.success('Livre ajouté au panier');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout');
    }
  };

  const telechargerLivre = async () => {
    try {
      const fichiersResponse = await api.get(`/fichiers-livres/${id}`);
      const fichiers = fichiersResponse.data.fichiers || [];
      
      if (fichiers.length > 0) {
        const fichier = fichiers[0];
        const response = await api.get(`/fichiers-livres/${id}/telecharger/${fichier.id}`, {
          responseType: 'blob'
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${livre.titre}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        toast.success('Téléchargement commencé');
      } else {
        toast.error('Fichier non disponible');
      }
    } catch (error) {
      toast.error('Erreur lors du téléchargement');
    }
  };

  const renderStars = (note) => {
    const stars = [];
    const fullStars = Math.floor(note);
    const hasHalfStar = note % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-amber-500" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-amber-500" />);
    }
    while (stars.length < 5) {
      stars.push(<FaStar key={stars.length} className="text-gray-300" />);
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-amber-100">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!livre) return null;

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
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              {/* Image de couverture */}
              <div className="bg-amber-100 rounded-2xl flex items-center justify-center p-8 min-h-[400px]">
                {livre.couverture_url ? (
                  <img 
                    src={livre.couverture_url} 
                    alt={livre.titre}
                    className="max-w-full max-h-[400px] object-contain rounded-lg shadow-lg"
                  />
                ) : (
                  <FaBook className="text-amber-300 text-8xl" />
                )}
              </div>

              {/* Infos livre */}
              <div>
                {livre.est_gratuit && (
                  <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full mb-4">
                    Gratuit
                  </span>
                )}
                
                <h1 className="text-3xl font-playfair font-bold text-amber-800 mb-2">
                  {livre.titre}
                </h1>
                
                <p className="text-amber-600 text-lg mb-4">
                  Par {livre.auteur}
                </p>
                
                <div className="flex items-center gap-2 mb-4">
                  {renderStars(4.5)}
                  <span className="text-gray-500 text-sm">(15 avis)</span>
                </div>
                
                <p className="text-gray-600 leading-relaxed mb-6">
                  {livre.description || "Aucune description disponible pour le moment."}
                </p>
                
                <div className="border-t border-amber-100 pt-6 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">ISBN</span>
                      <p className="text-amber-700 font-medium">{livre.isbn || 'Non disponible'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Langue</span>
                      <p className="text-amber-700 font-medium">{livre.langue || 'Français'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Date de publication</span>
                      <p className="text-amber-700 font-medium">
                        {livre.publie_le ? new Date(livre.publie_le).toLocaleDateString('fr-FR') : 'Non disponible'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">Collection</span>
                      <p className="text-amber-700 font-medium">{livre.collection?.nom || 'Générale'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Prix et actions */}
                <div className="border-t border-amber-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl font-bold text-amber-700">
                      {livre.est_gratuit ? 'Gratuit' : `${livre.prix} €`}
                    </span>
                    
                    {hasAccess ? (
                      <button
                        onClick={telechargerLivre}
                        className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition flex items-center gap-2"
                      >
                        <FaDownload />
                        Télécharger
                      </button>
                    ) : isInCart ? (
                      <Link
                        to="/dashboard/panier"
                        className="bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-700 transition flex items-center gap-2"
                      >
                        <FaCheck />
                        Déjà dans le panier
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="flex border border-amber-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setQuantite(Math.max(1, quantite - 1))}
                            className="px-3 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100"
                          >
                            -
                          </button>
                          <span className="px-4 py-2 text-amber-700">{quantite}</span>
                          <button
                            onClick={() => setQuantite(quantite + 1)}
                            className="px-3 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={ajouterAuPanier}
                          className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2"
                        >
                          <FaShoppingCart />
                          Ajouter au panier
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Actions secondaires */}
                <div className="flex gap-4 mt-6">
                  <button className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition">
                    <FaHeart />
                    Ajouter aux favoris
                  </button>
                  <button className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition">
                    <FaShare />
                    Partager
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetailLivrePage;