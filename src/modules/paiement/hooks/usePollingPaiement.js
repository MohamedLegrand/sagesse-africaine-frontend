import { useState, useEffect, useRef, useCallback } from 'react';
import paiementsService from '../../../services/paiementsService';
import { traduireErreurApi } from '../../../services/erreurApi';

// Intervalles de backoff exponentiel (en ms)
const INTERVALLES_MS = [3000, 5000, 8000, 12000, 18000, 25000, 35000];

// Durée max de polling : 5 minutes
const DUREE_MAX_MS = 5 * 60 * 1000;

// Statuts terminaux — on arrête de poller
const STATUTS_TERMINAUX = new Set(['reussi', 'echoue', 'rembourse']);

/**
 * usePollingPaiement
 *
 * Interroge régulièrement le backend pour connaître le statut d'un paiement.
 * Utilise un backoff exponentiel pour réduire la pression sur l'API tout en
 * restant réactif dans les premières secondes.
 *
 * @param {string|null} commandeId  - UUID de la commande à surveiller
 * @param {boolean}     actif       - Démarre/stoppe le polling
 *
 * @returns {{
 *   statut: string|null,
 *   paiement: object|null,
 *   tempsRestantMs: number,
 *   tentatives: number,
 *   isPolling: boolean,
 *   estExpire: boolean,
 *   erreur: string|null,
 * }}
 */
const usePollingPaiement = (commandeId, actif = true) => {
  const [statut, setStatut]               = useState(null);
  const [paiement, setPaiement]           = useState(null);
  const [tentatives, setTentatives]       = useState(0);
  const [isPolling, setIsPolling]         = useState(false);
  const [estExpire, setEstExpire]         = useState(false);
  const [erreur, setErreur]               = useState(null);
  const [tempsRestantMs, setTempsRestantMs] = useState(DUREE_MAX_MS);

  const timerRef        = useRef(null);
  const tickRef         = useRef(null);
  const debutRef        = useRef(null);
  const tentativesRef   = useRef(0);
  const actifRef        = useRef(actif);
  const commandeIdRef   = useRef(commandeId);

  // Synchronise les refs avec les dernières valeurs
  useEffect(() => { actifRef.current = actif; }, [actif]);
  useEffect(() => { commandeIdRef.current = commandeId; }, [commandeId]);

  const arreter = useCallback(() => {
    clearTimeout(timerRef.current);
    clearInterval(tickRef.current);
    setIsPolling(false);
  }, []);

  const interroger = useCallback(async () => {
    if (!actifRef.current || !commandeIdRef.current) return;

    const elapsed = Date.now() - (debutRef.current || Date.now());
    if (elapsed >= DUREE_MAX_MS) {
      arreter();
      setEstExpire(true);
      return;
    }

    try {
      const data = await paiementsService.getPaiementParCommande(commandeIdRef.current);
      setPaiement(data);
      setStatut(data.statut);
      setErreur(null);

      if (STATUTS_TERMINAUX.has(data.statut)) {
        arreter();
        return;
      }
    } catch (err) {
      setErreur(traduireErreurApi(err));
      // On continue le polling même en cas d'erreur réseau temporaire
    }

    // Planifier la prochaine interrogation (backoff exponentiel)
    tentativesRef.current += 1;
    setTentatives(tentativesRef.current);
    const delai = INTERVALLES_MS[Math.min(tentativesRef.current, INTERVALLES_MS.length - 1)];
    timerRef.current = setTimeout(interroger, delai);
  }, [arreter]);

  useEffect(() => {
    if (!actif || !commandeId) return;

    // Réinitialisation
    tentativesRef.current = 0;
    debutRef.current = Date.now();
    setTentatives(0);
    setEstExpire(false);
    setErreur(null);
    setIsPolling(true);
    setTempsRestantMs(DUREE_MAX_MS);

    // Tick toutes les secondes pour mettre à jour le temps restant
    tickRef.current = setInterval(() => {
      const reste = DUREE_MAX_MS - (Date.now() - debutRef.current);
      setTempsRestantMs(Math.max(0, reste));
      if (reste <= 0) clearInterval(tickRef.current);
    }, 1000);

    // Première interrogation immédiate
    interroger();

    return () => {
      arreter();
    };
  }, [commandeId, actif, interroger, arreter]);

  return {
    statut,
    paiement,
    tempsRestantMs,
    tentatives,
    isPolling,
    estExpire,
    erreur,
  };
};

export default usePollingPaiement;
