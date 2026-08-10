import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaBook, FaBookOpen, FaBookReader, FaArrowLeft, FaStar, FaBookmark,
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
import { avecExtrait } from '../../../data/extraitsLivres';
import ExtraitModal from '../../../components/ExtraitModal';

const DetailLivrePage = () => {
  const { t } = useTranslation('dashboard');
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
  const [extraitOuvert, setExtraitOuvert] = useState(false);

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
      setLivre(avecExtrait(livreData));
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
      toast.error(t('detailLivre.messages.livreIntrouvable'));
      navigate('/dashboard/boutique');
    } finally {
      setLoading(false);
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
      toast.success(t('detailLivre.signets.messages.signetAjoute'));
    } catch {
      toast.error(t('detailLivre.signets.messages.erreurAjout'));
    } finally {
      setAjouterSignet(false);
    }
  };

  const handleSupprimerSignet = async (signetId) => {
    try {
      await signetsService.supprimerSignet(signetId);
      setSignets(prev => prev.filter(s => s.id !== signetId));
      toast.success(t('detailLivre.signets.messages.signetSupprime'));
    } catch {
      toast.error(t('detailLivre.signets.messages.erreurSuppression'));
    }
  };

  const handleSoumettreAvis = async (e) => {
    e.preventDefault();
    setSoumettreAvis(true);
    try {
      await avisService.creerAvis(id, noteAvis, commentaireAvis);
      toast.success(t('detailLivre.avis.messages.avisSoumis'));
      setCommentaireAvis('');
      setNoteAvis(5);
      // Recharger les avis
      const updated = await avisService.getAvisLivre(id);
      setAvis(updated.avis || []);
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(t('detailLivre.avis.messages.avisDejaSoumis'));
      } else {
        toast.error(t('detailLivre.avis.messages.erreurSoumission'));
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
            {t('detailLivre.retour')}
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
                <span className="text-sm text-gray-500">({avis.length} {t('detailLivre.avis')})</span>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{livre.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {livre.langue && (
                  <span className="text-xs px-3 py-1 bg-amber-100 text-amber-700 rounded-full">{livre.langue}</span>
                )}
                {livre.isbn && (
                  <span className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full">{t('detailLivre.isbn')} {livre.isbn}</span>
                )}
                <span className={`text-xs px-3 py-1 rounded-full ${livre.est_gratuit ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {livre.est_gratuit ? t('detailLivre.gratuit') : `${livre.prix?.toLocaleString('fr-FR')} XAF`}
                </span>
              </div>

              {/* Accès + actions */}
              {aAcces ? (
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <FaCheckCircle />
                    <span>{t('detailLivre.vousAvezAcces')}</span>
                  </div>
                  {fichiers.length > 0 && (
                    <Link
                      to={`/dashboard/livre/${id}/lire`}
                      className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-xl text-sm hover:shadow-lg transition"
                    >
                      <FaBookOpen />
                      {progression ? t('detailLivre.continuerLecture') : t('detailLivre.commencerLecture')}
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <FaTimesCircle />
                    <span>{t('detailLivre.devezAcheter')}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/dashboard/boutique"
                      className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-xl text-sm hover:shadow-lg transition"
                    >
                      {t('detailLivre.acheter')}
                    </Link>
                    {livre.extrait_url && (
                      <button
                        onClick={() => setExtraitOuvert(true)}
                        className="flex items-center gap-2 border border-amber-300 text-amber-700 px-4 py-2 rounded-xl text-sm hover:bg-amber-50 transition"
                      >
                        <FaBookReader />
                        {t('detailLivre.lireUnExtrait')}
                      </button>
                    )}
                  </div>
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
                {t(`detailLivre.onglets.${tab}`)}
              </button>
            ))}
          </div>

          {/* Contenu onglets */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Détails */}
            {activeTab === 'details' && (
              <div className="space-y-4">
                <h3 className="text-lg font-playfair font-bold text-amber-800">{t('detailLivre.details.descriptionComplete')}</h3>
                <p className="text-gray-600 leading-relaxed">{livre.description || t('detailLivre.details.aucuneDescription')}</p>
                {fichiers.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-amber-700 mb-2">{t('detailLivre.details.formatsDisponibles')}</h4>
                    <div className="flex gap-2 flex-wrap">
                      {fichiers.map(f => (
                        <span key={f.id} className="text-xs px-3 py-1 bg-amber-100 text-amber-700 rounded-full uppercase">
                          {f.format} — {t('detailLivre.details.taille', { taille: (f.taille_octets / 1024 / 1024).toFixed(1) })}
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
                <h3 className="text-lg font-playfair font-bold text-amber-800">{t('detailLivre.progression.titre')}</h3>
                {!aAcces ? (
                  <p className="text-gray-500">{t('detailLivre.progression.achetezPourSuivre')}</p>
                ) : progression ? (
                  <div className="space-y-4">
                    <div className="bg-amber-50 rounded-xl p-4">
                      <div className="flex justify-between text-sm text-amber-700 mb-2">
                        <span>{t('detailLivre.progression.page', { page: progression.page_actuelle, total: progression.total_pages })}</span>
                        <span>{progression.pourcentage}%</span>
                      </div>
                      <div className="w-full bg-amber-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-amber-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${progression.pourcentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {t('detailLivre.progression.derniereLecture', { date: new Date(progression.derniere_lecture_le).toLocaleDateString('fr-FR') })}
                      </p>
                    </div>
                    <Link
                      to={`/dashboard/livre/${id}/lire`}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-xl text-sm hover:shadow-lg transition"
                    >
                      <FaBookOpen />
                      {t('detailLivre.continuerLecture')}
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">{t('detailLivre.progression.pasEncoreCommence')}</p>
                    <Link
                      to={`/dashboard/livre/${id}/lire`}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-xl text-sm hover:shadow-lg transition"
                    >
                      <FaBookOpen />
                      {t('detailLivre.commencerLecture')}
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Signets */}
            {activeTab === 'signets' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-playfair font-bold text-amber-800">{t('detailLivre.signets.titre')}</h3>
                  {aAcces && (
                    <button
                      onClick={handleAjouterSignet}
                      disabled={ajouterSignet}
                      className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-amber-700 transition disabled:opacity-50"
                    >
                      {ajouterSignet ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                      {t('detailLivre.signets.ajouterALaPage', { page: progression?.page_actuelle || 1 })}
                    </button>
                  )}
                </div>
                {!aAcces ? (
                  <p className="text-gray-500">{t('detailLivre.signets.achetezPourAjouter')}</p>
                ) : signets.length === 0 ? (
                  <div className="text-center py-8">
                    <FaBookmark className="text-amber-300 text-5xl mx-auto mb-3" />
                    <p className="text-gray-500">{t('detailLivre.signets.aucunSignet')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="mb-3">
                      <input
                        type="text"
                        value={noteSignet}
                        onChange={(e) => setNoteSignet(e.target.value)}
                        placeholder={t('detailLivre.signets.notePlaceholder')}
                        className="w-full px-4 py-2 border border-amber-200 rounded-xl focus:border-amber-500 outline-none text-sm"
                      />
                    </div>
                    {signets.map(signet => (
                      <div key={signet.id} className="flex items-start justify-between p-4 bg-amber-50 rounded-xl">
                        <div className="flex items-start gap-3">
                          <FaBookmark className="text-amber-500 mt-1" />
                          <div>
                            <p className="font-medium text-amber-800">{t('detailLivre.signets.page', { page: signet.numero_page })}</p>
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
                      placeholder={t('detailLivre.signets.notePlaceholderSeul')}
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
                  {t('detailLivre.avis.titreAvecMoyenne', { count: avis.length, note: noteMoyenne })}
                </h3>

                {/* Formulaire avis */}
                {aAcces && (
                  <form onSubmit={handleSoumettreAvis} className="bg-amber-50 rounded-xl p-4 space-y-4">
                    <h4 className="font-semibold text-amber-700">{t('detailLivre.avis.laisserUnAvis')}</h4>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{t('detailLivre.avis.note')}</p>
                      <div className="flex gap-1">
                        {renderEtoiles(noteAvis, true, setNoteAvis)}
                        <span className="ml-2 text-sm text-gray-500">{noteAvis}/5</span>
                      </div>
                    </div>
                    <textarea
                      value={commentaireAvis}
                      onChange={(e) => setCommentaireAvis(e.target.value)}
                      rows={3}
                      placeholder={t('detailLivre.avis.partagezAvis')}
                      className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 outline-none text-sm resize-none"
                    />
                    <button
                      type="submit"
                      disabled={soumettreAvis}
                      className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-2 rounded-xl text-sm hover:shadow-lg transition disabled:opacity-50"
                    >
                      {soumettreAvis ? t('detailLivre.avis.envoiEnCours') : t('detailLivre.avis.soumettreAvis')}
                    </button>
                  </form>
                )}

                {/* Liste avis */}
                {avis.length === 0 ? (
                  <div className="text-center py-8">
                    <FaStar className="text-amber-300 text-5xl mx-auto mb-3" />
                    <p className="text-gray-500">{t('detailLivre.avis.aucunAvisSoyezPremier')}</p>
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
        {extraitOuvert && (
          <ExtraitModal livre={livre} onClose={() => setExtraitOuvert(false)} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default DetailLivrePage;
