import i18n from '../i18n';

/**
 * Traduit une erreur API dans la langue active.
 *
 * Le backend renvoie soit un detail structuré { code, message, ...donnees }
 * (nouveaux endpoints migrés vers des codes sémantiques), soit une chaîne
 * française brute (endpoints pas encore migrés). Dans ce dernier cas, on ne
 * l'affiche jamais telle quelle si l'utilisateur est en anglais — on retombe
 * sur un message générique traduit plutôt que de laisser fuir du français.
 */
export function traduireErreurApi(error, fallbackKey = 'GENERIQUE', fallbackNs = 'erreurs') {
  const detail = error?.response?.data?.detail;

  if (detail && typeof detail === 'object' && detail.code) {
    const { code, message, ...donnees } = detail;
    if (i18n.exists(code, { ns: 'erreurs' })) {
      return i18n.t(code, { ns: 'erreurs', ...donnees });
    }
    // Code inconnu du frontend (ajouté côté backend sans traduction) : on
    // n'affiche jamais le message français brut si la langue active n'est
    // pas le français.
    if (i18n.language?.startsWith('fr') && message) {
      return message;
    }
  }

  return i18n.t(fallbackKey, { ns: fallbackNs });
}

export default traduireErreurApi;
