import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBook, FaShoppingCart, FaDownload, FaEye,
  FaChevronDown, FaChevronUp, FaSearch
} from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';

const HistoriquePage = () => {
  const [commandes, setCommandes] = useState([]);
  const [telechargements, setTelechargements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('commandes');
  const [expandedCommande, setExpandedCommande] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistorique();
  }, []);

  const fetchHistorique = async () => {
    try {
      const [commandesRes, telechargementsRes] = await Promise.all([
        api.get('/commandes/mes-commandes'),
        api.get('/historique-telechargements/mes-telechargements'),
      ]);
      setCommandes(commandesRes.data.commandes || []);
      setTelechargements(telechargementsRes.data.historique || []);
    } catch (error) {
      console.error('Erreur chargement historique:', error);
      toast.error("Erreur chargement de l'historique");
    } finally {
      setLoading(false);
    }
  };

  const getStatutColor = (statut) => {
    switch (statut?.toLowerCase()) {
      case 'payé': case 'livré': case 'complété': return 'bg-green-100 text-green-700';
      case 'en attente': case 'pending': return 'bg-amber-100 text-amber-700';
      case 'annulé': case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatutText = (statut) => {
    switch (statut?.toLowerCase()) {
      case 'payé': return 'Payée';
      case 'livré': return 'Livrée';
      case 'complété': return 'Complétée';
      case 'en attente': case 'pending': return 'En attente';
      case 'annulé': case 'cancelled': return 'Annulée';
      default: return statut || 'En cours';
    }
  };

  const commandesFiltrees = commandes.filter(c =>
    c.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const telechargementsFiltres = telechargements.filter(t =>
    t.livre?.titre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-playfair font-bold text-amber-800">Historique</h1>
          <p className="text-amber-500 text-sm">
            {activeTab === 'commandes'
              ? `${commandes.length} commande(s) passée(s)`
              : `${telechargements.length} téléchargement(s)`}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Onglets */}
            <div className="flex gap-2 mb-6">
              {[
                { id: 'commandes', label: 'Commandes', icon: FaShoppingCart },
                { id: 'telechargements', label: 'Téléchargements', icon: FaDownload },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg'
                      : 'bg-white text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  <tab.icon />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Barre de recherche */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400" />
                <input
                  type="text"
                  placeholder={`Rechercher dans ${activeTab === 'commandes' ? 'les commandes' : 'les téléchargements'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                />
              </div>
            </div>

            {/* Commandes */}
            {activeTab === 'commandes' && (
              commandesFiltrees.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <FaShoppingCart className="text-amber-300 text-6xl mx-auto mb-4" />
                  <h2 className="text-2xl font-playfair text-amber-700 mb-2">Aucune commande</h2>
                  <p className="text-gray-500 mb-6">Vous n'avez pas encore passé de commande</p>
                  <Link to="/dashboard/boutique" className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition inline-block">
                    Découvrir la boutique
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {commandesFiltrees.map((commande) => (
                    <div key={commande.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                      <div
                        className="p-6 cursor-pointer hover:bg-amber-50 transition flex justify-between items-center"
                        onClick={() => setExpandedCommande(expandedCommande === commande.id ? null : commande.id)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-mono font-bold text-amber-800">{commande.id}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatutColor(commande.statut)}`}>
                              {getStatutText(commande.statut)}
                            </span>
                          </div>
                          <div className="flex gap-4 text-sm text-gray-500">
                            <span>{new Date(commande.cree_le).toLocaleDateString('fr-FR')}</span>
                            <span>{commande.lignes?.length || 0} article(s)</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-amber-700">{commande.montant_total} FCFA</p>
                          <span className="text-amber-500 mt-1 inline-block">
                            {expandedCommande === commande.id ? <FaChevronUp /> : <FaChevronDown />}
                          </span>
                        </div>
                      </div>
                      {expandedCommande === commande.id && (
                        <div className="border-t border-amber-100 p-6 bg-amber-50/30">
                          <h4 className="font-semibold text-amber-800 mb-3">Détails de la commande</h4>
                          <div className="space-y-3">
                            {commande.lignes?.map((ligne) => (
                              <div key={ligne.id} className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-14 bg-amber-200 rounded flex items-center justify-center">
                                    <FaBook className="text-amber-500" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-amber-800">{ligne.livre?.titre || 'Livre'}</p>
                                    <p className="text-sm text-gray-500">Quantité : {ligne.quantite}</p>
                                  </div>
                                </div>
                                <p className="font-medium text-amber-700">{ligne.prix_unitaire * ligne.quantite} FCFA</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Téléchargements */}
            {activeTab === 'telechargements' && (
              telechargementsFiltres.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <FaDownload className="text-amber-300 text-6xl mx-auto mb-4" />
                  <h2 className="text-2xl font-playfair text-amber-700 mb-2">Aucun téléchargement</h2>
                  <p className="text-gray-500 mb-6">Vous n'avez pas encore téléchargé de livre</p>
                  <Link to="/dashboard/bibliotheque" className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition inline-block">
                    Voir ma bibliothèque
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-amber-50 border-b border-amber-200">
                      <tr>
                        <th className="text-left p-4 text-amber-700 font-semibold">Livre</th>
                        <th className="text-left p-4 text-amber-700 font-semibold">Format</th>
                        <th className="text-left p-4 text-amber-700 font-semibold">Date</th>
                        <th className="text-left p-4 text-amber-700 font-semibold">Appareil</th>
                        <th className="text-center p-4 text-amber-700 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {telechargementsFiltres.map((t) => (
                        <tr key={t.id} className="border-b border-amber-100 hover:bg-amber-50 transition">
                          <td className="p-4">
                            <p className="font-medium text-amber-800">{t.livre?.titre || 'Livre'}</p>
                            <p className="text-sm text-gray-500">{t.livre?.auteur || 'Auteur'}</p>
                          </td>
                          <td className="p-4">
                            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                              {t.format?.toUpperCase() || 'PDF'}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600">
                            {new Date(t.telecharge_le).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="p-4 text-gray-600">{t.appareil || 'Inconnu'}</td>
                          <td className="p-4 text-center">
                            <Link
                              to={`/dashboard/livre/${t.livre_id}`}
                              className="text-amber-600 hover:text-amber-700 transition flex items-center justify-center gap-1"
                            >
                              <FaEye />
                              Voir
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HistoriquePage;
