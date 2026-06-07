import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaDownload, FaEye, FaSearch, FaFilePdf } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import Header from '../../visiteur/components/Header';
import Footer from '../../visiteur/components/Footer';

const BibliothequePage = () => {
  const [acces, setAcces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [telechargementId, setTelechargementId] = useState(null);
  const [pdfUrls, setPdfUrls] = useState({});

  useEffect(() => {
    fetchBibliotheque();
  }, []);

  const fetchBibliotheque = async () => {
    try {
      const response = await api.get('/acces-livres/mes-acces');
      const accesData = response.data.acces || [];
      setAcces(accesData);
      
      // Récupérer les URLs des PDF pour chaque livre
      for (const item of accesData) {
        try {
          const fichiersRes = await api.get(`/fichiers-livres/${item.livre_id}`);
          const fichiers = fichiersRes.data.fichiers || [];
          if (fichiers.length > 0) {
            setPdfUrls(prev => ({
              ...prev,
              [item.livre_id]: `/uploads/pdfs/${fichiers[0].chemin_fichier}`
            }));
          }
        } catch (error) {
          console.error(`Erreur récupération PDF pour livre ${item.livre_id}:`, error);
        }
      }
    } catch (error) {
      console.error('Erreur chargement bibliothèque:', error);
      toast.error('Erreur chargement de votre bibliothèque');
    } finally {
      setLoading(false);
    }
  };

  const telechargerPdf = (livreId, livreTitre, pdfUrl) => {
    if (pdfUrl) {
      setTelechargementId(livreId);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', `${livreTitre}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Téléchargement commencé');
      setTelechargementId(null);
    } else {
      toast.error('Fichier PDF non disponible');
    }
  };

  const lirePdf = (pdfUrl) => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    } else {
      toast.error('Fichier PDF non disponible');
    }
  };

  // Filtrer les livres
  const accesFiltres = acces.filter(item => {
    const livre = item.livre;
    if (!livre) return false;
    return livre.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           livre.auteur?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
        <Header />
        <div className="flex justify-center items-center pt-40">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* En-tête */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-amber-800 mb-4">
              Ma bibliothèque
            </h1>
            <p className="text-amber-500 text-lg">
              {acces.length} livre(s) dans votre bibliothèque
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-16 h-px bg-amber-300"></div>
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <div className="w-16 h-px bg-amber-300"></div>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400" />
              <input
                type="text"
                placeholder="Rechercher dans ma bibliothèque..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
              />
            </div>
          </div>

          {accesFiltres.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <FaBook className="text-amber-300 text-6xl mx-auto mb-4" />
              <h2 className="text-2xl font-playfair text-amber-700 mb-2">Votre bibliothèque est vide</h2>
              <p className="text-gray-500 mb-6">Achetez des livres pour les voir apparaître ici</p>
              <Link to="/dashboard/boutique" className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition inline-block">
                Découvrir la boutique
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accesFiltres.map((item) => {
                const livre = item.livre;
                const pdfUrl = pdfUrls[item.livre_id];
                
                if (!livre) return null;
                
                return (
                  <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    {/* Couverture PNG */}
                    <Link to={`/dashboard/livre/${livre.id}`} className="block">
                      <div className="relative h-64 bg-amber-100 flex items-center justify-center overflow-hidden">
                        {livre.couverture_url ? (
                          <img 
                            src={livre.couverture_url} 
                            alt={livre.titre}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/default-book.png';
                            }}
                          />
                        ) : (
                          <FaBook className="text-amber-300 text-6xl" />
                        )}
                      </div>
                    </Link>
                    
                    {/* Infos livre */}
                    <div className="p-4">
                      <Link to={`/dashboard/livre/${livre.id}`}>
                        <h3 className="font-playfair font-bold text-amber-800 text-lg mb-1 hover:text-amber-600 transition line-clamp-1">
                          {livre.titre}
                        </h3>
                      </Link>
                      <p className="text-amber-500 text-sm mb-2">{livre.auteur}</p>
                      
                      <p className="text-xs text-gray-400 mb-3">
                        Ajouté le {new Date(item.accorde_le).toLocaleDateString('fr-FR')}
                      </p>
                      
                      {/* Format PDF */}
                      <div className="flex items-center gap-2 mb-4">
                        <FaFilePdf className="text-red-500 text-sm" />
                        <span className="text-xs text-gray-500">PDF numérique</span>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => lirePdf(pdfUrl)}
                          className="flex-1 bg-amber-100 text-amber-700 px-3 py-2 rounded-xl text-sm font-medium hover:bg-amber-200 transition flex items-center justify-center gap-2"
                        >
                          <FaEye />
                          Lire
                        </button>
                        <button
                          onClick={() => telechargerPdf(livre.id, livre.titre, pdfUrl)}
                          disabled={telechargementId === livre.id}
                          className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-3 py-2 rounded-xl text-sm font-medium hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {telechargementId === livre.id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <FaDownload />
                          )}
                          Télécharger
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BibliothequePage;