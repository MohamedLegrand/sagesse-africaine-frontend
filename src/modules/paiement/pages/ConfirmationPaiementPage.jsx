import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaCheckCircle,
  FaBook,
  FaHome,
  FaFileDownload,
  FaSpinner,
  FaHourglassHalf,
  FaTimesCircle,
  FaMobileAlt,
  FaRedo,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import Header from '../../visiteur/components/Header';
import Footer from '../../visiteur/components/Footer';
import commandesService from '../../../services/commandesService';
import useTelechargerFacture from '../../../hooks/useTelechargerFacture';
import usePollingPaiement from '../hooks/usePollingPaiement';

// Durée max de polling (doit correspondre à usePollingPaiement)
const DUREE_MAX_MS = 5 * 60 * 1000;

// ─── Sous-composant : Barre de progression temporelle ────────────────────────
const BarreProgression = ({ tempsRestantMs }) => {
  const { t } = useTranslation('paiement');
  const pct = Math.max(0, Math.min(100, (tempsRestantMs / DUREE_MAX_MS) * 100));
  const secondes = Math.ceil(tempsRestantMs / 1000);
  const minutes  = Math.floor(secondes / 60);
  const sec      = secondes % 60;
  const label    = minutes > 0
    ? `${minutes}m ${sec.toString().padStart(2, '0')}s`
    : `${sec}s`;

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between text-xs text-terra-600 mb-1 font-medium">
        <span>{t('confirmation.confirmationAutomatique')}</span>
        <span>{label} {t('confirmation.restant')}</span>
      </div>
      <div className="w-full h-2 bg-cream-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-terra-400 to-terra-600 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

// ─── Sous-composant : Panneau d'attente avec polling ─────────────────────────
const PanneauAttente = ({ tempsRestantMs, tentatives, erreur }) => {
  const { t } = useTranslation('paiement');
  return (
    <div className="flex flex-col items-center">
      {/* Icône animée */}
      <div className="relative w-24 h-24 flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-full bg-cream-100 animate-ping opacity-40" />
        <div className="w-24 h-24 rounded-full bg-cream-100 flex items-center justify-center">
          <FaHourglassHalf className="text-terra-500 text-4xl animate-pulse" />
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-playfair font-bold text-brown-800 mb-3">
        {t('confirmation.paiementEnCours')}
      </h1>

      {/* Instruction mobile money */}
      <div className="flex items-center gap-2 bg-cream-50 border border-cream-200 rounded-xl px-4 py-3 mb-4 text-terra-700">
        <FaMobileAlt className="text-xl shrink-0" />
        <p className="text-sm font-medium">
          {t('confirmation.accepterDemandeTelephone')}
        </p>
      </div>

      <p className="text-gray-500 text-sm mb-6">
        {erreur
          ? <span className="text-orange-500">⚠️ {erreur} — {t('confirmation.nouvelleTentative')}</span>
          : <>{t('confirmation.verificationEnCours')} <FaSpinner className="inline animate-spin ml-1" /> {tentatives > 0 && <span className="text-xs text-gray-400">{t('confirmation.tentative', { n: tentatives })}</span>}</>
        }
      </p>

      {/* Barre de progression */}
      <BarreProgression tempsRestantMs={tempsRestantMs} />
    </div>
  );
};

// ─── Sous-composant : Paiement réussi ────────────────────────────────────────
const PanneauReussi = ({ commande, telecharger, telechargementFacture }) => {
  const { t } = useTranslation('paiement');
  return (
    <div className="flex flex-col items-center">
      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 animate-bounce-once">
        <FaCheckCircle className="text-green-600 text-5xl" />
      </div>

      <h1 className="text-3xl md:text-4xl font-playfair font-bold text-brown-800 mb-4">
        {t('confirmation.paiementReussi')}
      </h1>
      <p className="text-gray-600 mb-6">
        {t('confirmation.commandeValidee')}
      </p>

      {/* Récapitulatif commande */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 text-left w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-brown-800">{t('confirmation.commande')}</h2>
          <span className="font-mono text-xs text-gray-400">{commande.id}</span>
        </div>
        <div className="space-y-3 mb-4">
          {commande.lignes?.map((ligne) => (
            <div key={ligne.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{t('confirmation.livreQuantite', { n: ligne.quantite })}</span>
              <span className="text-terra-700 font-medium">
                {(ligne.prix_unitaire * ligne.quantite).toLocaleString()} {commande.devise}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-cream-100 pt-4 flex justify-between items-center">
          <span className="font-semibold text-brown-800">{t('confirmation.totalPaye')}</span>
          <span className="text-xl font-bold text-terra-700">
            {commande.montant_total?.toLocaleString()} {commande.devise}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 w-full">
        <Link
          to="/dashboard/bibliotheque"
          className="bg-gradient-to-r from-terra-600 to-terra-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
        >
          <FaBook />
          {t('confirmation.voirBibliotheque')}
        </Link>
        <button
          onClick={() => telecharger(commande.id)}
          disabled={telechargementFacture}
          className="border border-terra-600 text-terra-700 px-6 py-3 rounded-xl font-semibold hover:bg-terra-600 hover:text-white transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {telechargementFacture ? <FaSpinner className="animate-spin" /> : <FaFileDownload />}
          {t('confirmation.telechargerFacture')}
        </button>
      </div>

      <Link to="/" className="text-terra-600 hover:text-terra-700 transition inline-flex items-center gap-2 text-sm">
        <FaHome />
        {t('confirmation.retourAccueil')}
      </Link>
    </div>
  );
};

// ─── Sous-composant : Paiement échoué / expiré ───────────────────────────────
const PanneauEchec = ({ estExpire, navigate }) => {
  const { t } = useTranslation('paiement');
  return (
    <div className="flex flex-col items-center">
      <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
        <FaTimesCircle className="text-red-500 text-5xl" />
      </div>

      <h1 className="text-3xl md:text-4xl font-playfair font-bold text-brown-800 mb-4">
        {estExpire ? t('confirmation.delaiDepasse') : t('confirmation.paiementNonAbouti')}
      </h1>
      <p className="text-gray-600 mb-8">
        {estExpire ? t('confirmation.texteExpire') : t('confirmation.texteEchoue')}
      </p>

      <button
        onClick={() => navigate('/paiement')}
        className="bg-gradient-to-r from-terra-600 to-terra-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-3 mb-4"
      >
        <FaRedo />
        {t('confirmation.reessayerPaiement')}
      </button>

      <Link to="/" className="text-terra-600 hover:text-terra-700 transition inline-flex items-center gap-2 text-sm">
        <FaHome />
        {t('confirmation.retourAccueil')}
      </Link>
    </div>
  );
};

// ─── Composant principal ──────────────────────────────────────────────────────
const ConfirmationPaiementPage = () => {
  const { t } = useTranslation('paiement');
  const { commandeId } = useParams();
  const navigate       = useNavigate();

  const [commande,     setCommande]     = useState(null);
  const [loadingInit,  setLoadingInit]  = useState(true);
  // statut initial chargé depuis la commande (avant que le polling ne prenne le relais)
  const [statutInitial, setStatutInitial] = useState(null);

  const { telecharger, commandeEnCours } = useTelechargerFacture();
  const telechargementFacture = commandeEnCours === commandeId;

  // Démarrer le polling uniquement si la commande est chargée
  // et que le statut initial n'est pas déjà terminal
  const STATUTS_TERMINAUX = new Set(['reussi', 'echoue', 'rembourse']);
  const pollingActif = !loadingInit && commandeId && !STATUTS_TERMINAUX.has(statutInitial);

  const {
    statut: statutPoll,
    paiement: paiementPoll,
    tempsRestantMs,
    tentatives,
    isPolling,
    estExpire,
    erreur: erreurPoll,
  } = usePollingPaiement(commandeId, pollingActif);

  // Statut effectif = celui du polling s'il est disponible, sinon l'initial
  const statutEffectif = statutPoll ?? statutInitial;
  const estPayee       = statutEffectif === 'reussi' || commande?.statut === 'payee';
  const estEchoue      = statutEffectif === 'echoue' || statutEffectif === 'rembourse';
  const estEnAttente   = !estPayee && !estEchoue && !estExpire;

  // Notification toast quand le polling détecte un succès
  useEffect(() => {
    if (statutPoll === 'reussi') {
      toast.success(t('messages.paiementConfirme'));
    }
  }, [statutPoll, t]);

  // Chargement initial de la commande
  useEffect(() => {
    if (!commandeId) {
      navigate('/dashboard');
      return;
    }
    commandesService.getCommande(commandeId)
      .then((cmd) => {
        setCommande(cmd);
        setStatutInitial(cmd.statut === 'payee' ? 'reussi' : cmd.statut);
      })
      .catch(() => toast.error(t('messages.commandeIntrouvable')))
      .finally(() => setLoadingInit(false));
  }, [commandeId, navigate, t]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-cream-100">
      <Header />

      <main className="pt-40 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">

            {/* Chargement initial */}
            {loadingInit && (
              <FaSpinner className="text-terra-500 text-4xl animate-spin mx-auto" />
            )}

            {/* Commande introuvable */}
            {!loadingInit && !commande && (
              <p className="text-gray-500">{t('confirmation.commandeIntrouvable')}</p>
            )}

            {/* Contenu principal */}
            {!loadingInit && commande && (
              <>
                {estPayee && (
                  <PanneauReussi
                    commande={commande}
                    telecharger={telecharger}
                    telechargementFacture={telechargementFacture}
                  />
                )}

                {(estEchoue || estExpire) && (
                  <PanneauEchec estExpire={estExpire} navigate={navigate} />
                )}

                {estEnAttente && (
                  <PanneauAttente
                    tempsRestantMs={tempsRestantMs}
                    tentatives={tentatives}
                    erreur={erreurPoll}
                  />
                )}
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
