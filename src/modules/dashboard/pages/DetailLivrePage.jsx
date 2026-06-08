import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FaBook, FaDownload, FaArrowLeft, FaStar, FaBookmark,
  FaTrash, FaPlus, FaCheckCircle, FaTimesCircle, FaSpinner
} from 'react-icons/fa';
import api from '../../../services/api';
import livresService from '../../../services/livresService';
import accesLivresService from '../../../services/accesLivresService';
import progressionService from '../../../services/progressionService';
import signetsService from '../../../services/signetsService';
import avisService from '../../../services/avisService';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';

const DetailLivrePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [livre, setLivre] = useState(null);
  const [aAcces, setAAcces] = useState(false);
  const [fichiers, setFichiers] = useState([]);
  const [progression, setProgression] = useState(null);
  const [signets, setSignets] = useState([]);
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  // Formulaire avis
  const [noteAvis, setNoteAvis] = useState(5);
  const [commentaireAvis, setCommentaireAvis] = useState('');
  const [soumettreAvis, setSoumettreAvis] = useState(false);

  // Formulaire signet
  const [noteSignet, setNoteSignet] = useState('');
  const [ajouterSignet, setAjouterSignet] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [id]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [livreData, fichiersData, avisData] = await Promise.all([
        livresService.getLivre(id),
        api.get(`/fichiers-livres/${id}`).then(r => r.data.fichiers || []),
        avisService.getAvisLivre(id).then(r => r.avis || []).catch(() => []),
      ]);
      setLivre(livreData);
      setFichiers(fichiersData);
      setAvis(avisData);

      // Vérifier l'accès
      try {
        await accesLivresService.verifierAcces(id);
        setAAcces(true);

        // Charger progression et signets si accès
        const [prog, signetsData] = await Promise.all([
          progressionService.getProgressionLivre(id).catch(() => null),
          signetsService.getMesSignets(id).then(r => r.signets || []).catch(() => []),
        ]);
        setProgression(prog);
        setSignets(signetsData);
      } catch {
        setAAcces(false);
      }
    } catch (error) {
      toast.error('Livre introuvable');
      navigate('/dashboard/boutique');
    } finally {
      setLoading(false);
    }
  };

  const telecharger = async () => {
    if (fichiers.length === 0) {
      toast.error('Aucun fichier disponible');
      return;
    }
    try {
      const response = await api.get(
        `/fichiers-livres/${id}/telecharger/${fichiers[0].id}`,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${livre.titre}.${fichiers[0].format || 'pdf'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Téléchargement commencé');
    } catch {
      toast.error('Erreur lors du téléchargement');
    }
  };

  const handleSauvegarderProgression = async (page, totalPages) => {
    try {
      const pourcentage = totalPages > 0 ? Math.round((page / totalPages) * 100) : 0;
      const updated = await progressionService.sauvegarderProgression({
        livre_id: id,
        format: fichiers[0]?.format || 'pdf',
        page_actuelle: page,
        total_pages: totalPages,
        pourcentage,
      });
      setProgression(updated);
      toast.success('Progression sauvegardée');
    } catch {
      toast.error('Erreur sauvegarde progression');
    }
  };

  const handleAjouterSignet = async () => {
    setAjouterSignet(true);
    try {
      const signet = await signetsService.creerSignet({
        livre_id: id,
        format: fichiers[0]?.format || 'pdf',
        numero_page: progression?.page_actuelle || 1,
        note: noteSignet || null,
      });
      setSignets(prev => [...prev, signet]);
      setNoteSignet('');
      toast.success('Signet ajouté');
    } catch {
      toast.error('Erreur ajout signet');
    } finally {
      setAjouterSignet(false);
    }
  };

  const handleSupprimerSignet = async (signetId) => {
    try {
      await signetsService.supprimerSignet(signetId);
      setSignets(prev => prev.filter(s => s.id !== signetId));
      toast.success('Signet supprimé');
    } catch {
      toast.error('Erreur suppression signet');
    }
  };

  const handleSoumettreAvis = async (e) => {
    e.preventDefault();
    setSoumettreAvis(true);
    try {
      await avisService.creerAvis(id, noteAvis, commentaireAvis);
      toast.success('Avis soumis, en attente de modération');
      setCommentaireAvis('');
      setNoteAvis(5);
      // Recharger les avis
      const updated = await avisService.getAvisLivre(id);
      setAvis(updated.avis || []);
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error('Vous avez déjà soumis un avis pour ce livre');
      } else {
        toast.error('Erreur lors de la soumission');
      }
    } finally {
      setSoumettreAvis(false);
    }
  };

  const renderEtoiles = (note, interactive = false, onSelect = null) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`${i < note ? 'text-amber-500' : 'text-gray-300'} ${interactive ? 'cursor-pointer hover:text-amber-400 text-xl' : ''}`}
        onClick={interactive && onSelect ? () => onSelect(i + 1) : undefined}
      />
    ));
  };

  const noteMoyenne = avis.length > 0
    ? Math.round(avis.reduce((s, a) => s + a.note, 0) / avis.length)
    : 0;

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-5xl">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="text-amber-500 text-4xl animate-spin" />
          </div>
        ) : !livre ? null : (
          <>
          {/* Bouton retour */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition mb-5 font-medium"
          >
            <FaArrowLeft />
            Retour
          </button>

          {/* Infos livre */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col md:flex-row gap-6">
            <div className="w-40 h-56 bg-amber-100 rounded-xl overflow-hidden flex-shrink-0">
              {livre.couverture_url ? (
                <img src={livre.couverture_url} alt={livre.titre} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaBook className="text-amber-300 text-5xl" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-playfair font-bold text-amber-800 mb-1">{livre.titre}</h2>
              <p className="text-amber-500 mb-2">{livre.auteur}</p>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5">{renderEtoiles(noteMoyenne)}</div>
                <span className="text-sm text-gray-500">({avis.length} avis)</span>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{livre.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {livre.langue && (
                  <span className="text-xs px-3 py-1 bg-amber-100 text-amber-700 rounded-full">{livre.langue}</span>
                )}
                {livre.isbn && (
                  <span className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full">ISBN: {livre.isbn}</span>
                )}
                <span className={`text-xs px-3 py-1 rounded-full ${livre.est_gratuit ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {livre.est_gratuit ? 'Gratuit' : `${livre.prix} €`}
                </span>
              </div>

              {/* Accès + actions */}
              {aAcces ? (
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <FaCheckCircle />
                    <span>Vous avez accès à ce livre</span>
                  </div>
                  {fichiers.length > 0 && (
                    <button
                      onClick={telecharger}
                      className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-xl text-sm hover:shadow-lg transition"
                    >
                      <FaDownload />
                      Télécharger
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <FaTimesCircle />
                    <span>Vous n'avez pas accès à ce livre</span>
                  </div>
                  <Link
                    to="/dashboard/boutique"
                    className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-xl text-sm hover:shadow-lg transition"
                  >
                    Acheter
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Onglets */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {['details', 'progression', 'signets', 'avis'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-300 capitalize ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg'
                    : 'bg-white text-amber-700 hover:bg-amber-100'
                }`}
              >
                {tab === 'details' ? 'Détails' : tab === 'progression' ? 'Progression' : tab === 'signets' ? 'Signets' : 'Avis'}
              </button>
            ))}
          </div>

          {/* Contenu onglets */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Détails */}
            {activeTab === 'details' && (
              <div className="space-y-4">
                <h3 className="text-lg font-playfair font-bold text-amber-800">Description complète</h3>
                <p className="text-gray-600 leading-relaxed">{livre.description || 'Aucune description disponible.'}</p>
                {fichiers.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-amber-700 mb-2">Formats disponibles</h4>
                    <div className="flex gap-2 flex-wrap">
                      {fichiers.map(f => (
                        <span key={f.id} className="text-xs px-3 py-1 bg-amber-100 text-amber-700 rounded-full uppercase">
                          {f.format} — {(f.taille_octets / 1024 / 1024).toFixed(1)} Mo
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Progression */}
            {activeTab === 'progression' && (
              <div className="space-y-6">
                <h3 className="text-lg font-playfair font-bold text-amber-800">Ma progression de lecture</h3>
                {!aAcces ? (
                  <p className="text-gray-500">Achetez ce livre pour suivre votre progression.</p>
                ) : progression ? (
                  <div className="space-y-4">
                    <div className="bg-amber-50 rounded-xl p-4">
                      <div className="flex justify-between text-sm text-amber-700 mb-2">
                        <span>Page {progression.page_actuelle} / {progression.total_pages}</span>
                        <span>{progression.pourcentage}%</span>
                      </div>
                      <div className="w-full bg-amber-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-amber-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${progression.pourcentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Dernière lecture : {new Date(progression.derniere_lecture_le).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex gap-3 items-center">
                      <input
                        type="number"
                        min={1}
                        max={progression.total_pages || 9999}
                        defaultValue={progression.page_actuelle}
                        className="w-24 px-3 py-2 border border-amber-200 rounded-lg text-center focus:border-amber-500 outline-none"
                        id="pageInput"
                      />
                      <span className="text-gray-500 text-sm">/ {progression.total_pages || '?'} pages</span>
                      <button
                        onClick={() => {
                          const val = parseInt(document.getElementById('pageInput').value);
                          if (val > 0) handleSauvegarderProgression(val, progression.total_pages);
                        }}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700 transition"
                      >
                        Mettre à jour
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Aucune progression enregistrée pour ce livre.</p>
                    <div className="flex gap-3 items-center justify-center">
                      <input
                        type="number"
                        min={1}
                        defaultValue={1}
                        className="w-24 px-3 py-2 border border-amber-200 rounded-lg text-center focus:border-amber-500 outline-none"
                        id="pageInputNew"
                      />
                      <span className="text-gray-500 text-sm">/ </span>
                      <input
                        type="number"
                        min={1}
                        defaultValue={100}
                        className="w-24 px-3 py-2 border border-amber-200 rounded-lg text-center focus:border-amber-500 outline-none"
                        id="totalPagesInput"
                      />
                      <button
                        onClick={() => {
                          const page = parseInt(document.getElementById('pageInputNew').value);
                          const total = parseInt(document.getElementById('totalPagesInput').value);
                          if (page > 0 && total > 0) handleSauvegarderProgression(page, total);
                        }}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700 transition"
                      >
                        Démarrer le suivi
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Signets */}
            {activeTab === 'signets' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-playfair font-bold text-amber-800">Mes signets</h3>
                  {aAcces && (
                    <button
                      onClick={handleAjouterSignet}
                      disabled={ajouterSignet}
                      className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-amber-700 transition disabled:opacity-50"
                    >
                      {ajouterSignet ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                      Ajouter à la page {progression?.page_actuelle || 1}
                    </button>
                  )}
                </div>
                {!aAcces ? (
                  <p className="text-gray-500">Achetez ce livre pour ajouter des signets.</p>
                ) : signets.length === 0 ? (
                  <div className="text-center py-8">
                    <FaBookmark className="text-amber-300 text-5xl mx-auto mb-3" />
                    <p className="text-gray-500">Aucun signet pour ce livre.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="mb-3">
                      <input
                        type="text"
                        value={noteSignet}
                        onChange={(e) => setNoteSignet(e.target.value)}
                        placeholder="Note pour le prochain signet (optionnel)..."
                        className="w-full px-4 py-2 border border-amber-200 rounded-xl focus:border-amber-500 outline-none text-sm"
                      />
                    </div>
                    {signets.map(signet => (
                      <div key={signet.id} className="flex items-start justify-between p-4 bg-amber-50 rounded-xl">
                        <div className="flex items-start gap-3">
                          <FaBookmark className="text-amber-500 mt-1" />
                          <div>
                            <p className="font-medium text-amber-800">Page {signet.numero_page}</p>
                            {signet.note && <p className="text-sm text-gray-600">{signet.note}</p>}
                            <p className="text-xs text-gray-400">
                              {new Date(signet.cree_le).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleSupprimerSignet(signet.id)}
                          className="text-red-400 hover:text-red-600 transition p-1"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {aAcces && signets.length === 0 && (
                  <div className="mt-4">
                    <input
                      type="text"
                      value={noteSignet}
                      onChange={(e) => setNoteSignet(e.target.value)}
                      placeholder="Note pour le signet (optionnel)..."
                      className="w-full px-4 py-2 border border-amber-200 rounded-xl focus:border-amber-500 outline-none text-sm"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Avis */}
            {activeTab === 'avis' && (
              <div className="space-y-6">
                <h3 className="text-lg font-playfair font-bold text-amber-800">
                  Avis ({avis.length}) — Moyenne {noteMoyenne}/5
                </h3>

                {/* Formulaire avis */}
                {aAcces && (
                  <form onSubmit={handleSoumettreAvis} className="bg-amber-50 rounded-xl p-4 space-y-4">
                    <h4 className="font-semibold text-amber-700">Laisser un avis</h4>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Note</p>
                      <div className="flex gap-1">
                        {renderEtoiles(noteAvis, true, setNoteAvis)}
                        <span className="ml-2 text-sm text-gray-500">{noteAvis}/5</span>
                      </div>
                    </div>
                    <textarea
                      value={commentaireAvis}
                      onChange={(e) => setCommentaireAvis(e.target.value)}
                      rows={3}
                      placeholder="Partagez votre avis sur ce livre..."
                      className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 outline-none text-sm resize-none"
                    />
                    <button
                      type="submit"
                      disabled={soumettreAvis}
                      className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-2 rounded-xl text-sm hover:shadow-lg transition disabled:opacity-50"
                    >
                      {soumettreAvis ? 'Envoi...' : 'Soumettre l\'avis'}
                    </button>
                  </form>
                )}

                {/* Liste avis */}
                {avis.length === 0 ? (
                  <div className="text-center py-8">
                    <FaStar className="text-amber-300 text-5xl mx-auto mb-3" />
                    <p className="text-gray-500">Aucun avis pour ce livre. Soyez le premier !</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {avis.filter(a => a.est_approuve).map(avisItem => (
                      <div key={avisItem.id} className="border border-amber-100 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex gap-0.5">{renderEtoiles(avisItem.note)}</div>
                          <span className="text-xs text-gray-400">
                            {new Date(avisItem.cree_le).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm italic">"{avisItem.commentaire}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DetailLivrePage;
