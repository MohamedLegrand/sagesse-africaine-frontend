import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Download, Eye, Search, Library, ShoppingBag } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';

const BibliothequePage = () => {
  const [acces, setAcces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [telechargementId, setTelechargementId] = useState(null);

  useEffect(() => {
    api.get('/acces-livres/mes-acces')
      .then(r => setAcces(r.data.acces || []))
      .catch(() => toast.error('Erreur chargement de votre bibliothèque'))
      .finally(() => setLoading(false));
  }, []);

  const telechargerLivre = async (livreId, livreTitre) => {
    setTelechargementId(livreId);
    try {
      const fichiersRes = await api.get(`/fichiers-livres/${livreId}`);
      const fichiers = fichiersRes.data.fichiers || [];
      if (fichiers.length > 0) {
        const fichier = fichiers[0];
        const response = await api.get(`/fichiers-livres/${livreId}/telecharger/${fichier.id}`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${livreTitre}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success('Téléchargement commencé');
      } else {
        toast.error('Fichier non disponible');
      }
    } catch {
      toast.error('Erreur lors du téléchargement');
    } finally {
      setTelechargementId(null);
    }
  };

  const accesFiltres = acces.filter(item => {
    const livre = item.livre;
    if (!livre) return false;
    const q = searchTerm.toLowerCase();
    return livre.titre?.toLowerCase().includes(q) || livre.auteur?.toLowerCase().includes(q);
  });

  return (
    <DashboardLayout>
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="section-eyebrow">Bibliothèque</span>
          <h1 className="section-title mt-1">Mes livres</h1>
          <p className="text-brown-500 text-sm mt-1">
            {acces.length} ouvrage{acces.length > 1 ? 's' : ''} dans votre collection
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-xl bg-cream-100 animate-pulse">
              <div className="aspect-[2/3] bg-cream-200 rounded-t-xl" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-cream-200 rounded w-3/4" />
                <div className="h-2 bg-cream-200 rounded w-1/2" />
                <div className="h-8 bg-cream-200 rounded mt-3" />
              </div>
            </div>
          ))}
        </div>
      ) : acces.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-cream-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Library className="w-8 h-8 text-brown-300" />
          </div>
          <h2 className="font-playfair text-xl font-bold text-brown-900 mb-2">Votre bibliothèque est vide</h2>
          <p className="text-brown-400 text-sm mb-6">
            Achetez des livres dans la boutique pour les retrouver ici.
          </p>
          <Link to="/dashboard/boutique" className="btn-primary text-sm">
            <ShoppingBag className="w-4 h-4" /> Découvrir la boutique
          </Link>
        </div>
      ) : (
        <>
          {/* Recherche */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-300" />
              <input
                type="text"
                placeholder="Rechercher dans ma bibliothèque..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {accesFiltres.length === 0 ? (
            <div className="text-center py-12 text-brown-400">
              <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>Aucun résultat pour « {searchTerm} »</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {accesFiltres.map((item) => {
                const livre = item.livre;
                if (!livre) return null;
                return (
                  <div key={item.id} className="book-card group">
                    <Link to={`/dashboard/livre/${livre.id}`} className="block flex-shrink-0">
                      <div className="relative aspect-[2/3] bg-cream-100 overflow-hidden">
                        {livre.couverture_url ? (
                          <img
                            src={livre.couverture_url}
                            alt={livre.titre}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-cream-200">
                            <BookOpen className="w-8 h-8 text-brown-300" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-brown-900 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
                            <Eye className="w-3 h-3" /> Lire
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="p-3 flex flex-col flex-1 gap-1.5">
                      <Link to={`/dashboard/livre/${livre.id}`}>
                        <h3 className="font-playfair font-bold text-brown-900 text-sm leading-snug line-clamp-2 hover:text-terra-600 transition-colors">
                          {livre.titre}
                        </h3>
                      </Link>
                      <p className="text-xs text-brown-400">{livre.auteur}</p>
                      <p className="text-[10px] text-brown-300 mt-0.5">
                        Ajouté le {new Date(item.accorde_le).toLocaleDateString('fr-FR')}
                      </p>
                      <div className="flex gap-1.5 mt-auto pt-2">
                        <Link
                          to={`/dashboard/livre/${livre.id}`}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-cream-100 hover:bg-cream-200 text-brown-700 text-xs font-semibold rounded-lg transition-colors"
                        >
                          <Eye className="w-3 h-3" /> Lire
                        </Link>
                        <button
                          onClick={() => telechargerLivre(livre.id, livre.titre)}
                          disabled={telechargementId === livre.id}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-terra-500 hover:bg-terra-600 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                        >
                          {telechargementId === livre.id ? (
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Download className="w-3 h-3" />
                          )}
                          PDF
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default BibliothequePage;
