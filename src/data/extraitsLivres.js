// Extraits marketing (.docx) associés à chaque livre, servis en fichiers statiques
// depuis public/images/extrait/. Ce ne sont pas des données catalogue (elles ne
// viennent pas de l'API) : uniquement un aperçu commercial affiché via ExtraitModal.
// Les clés doivent correspondre aux slugs des livres en base (voir website_backend/seed_livres.py).
const EXTRAIT_DIR = '/images/extrait';

const EXTRAIT_FICHIERS = {
  'ange-ou-demon': 'ange-ou-demon.docx',
  'chretien-africain-et-la-maladie': 'CHRÉTIEN-AFRICAIN-ET-LA-MALADIE.docx',
  'chretien-africain-face-a-la-sorcellerie': 'CHRÉTIEN-AFRICAIN-FACE-A-LA-SORCELLERIE.docx',
  'comment-comprendre-et-interpreter-le-reve': 'COMMENT-COMPRENDRE-ET-INTERPRÉTER-LE-RÊVE.docx',
  'comment-obtenir-ta-delivrance-et-ta-victoire-contre-le-diable-les-demons-et-les-sorciers':
    'Comment-obtenir-ta-Délivrance-et-ta-Victoire-sur-le-Diable.docx',
  'comment-se-soigner-des-persecutions-spirituelles':
    'COMMENT-TE-SOIGNER-DES-PERSÉCUTIONS-SPIRITUELLES.docx',
  'consequences-spirituelles-de-la-masturbation-et-de-la-pornographie-dans-ta-vie':
    'CONSÉQUENCES-SPIRITUELLES-DE-LA-MASTURBATION-ET DE-LA-PORNOGRAPHIE-DANS-TA-VIE.docx',
  'culture-de-la-paix-et-lutte-contre-la-deviance-spirituelle':
    'CULTURE-DE-LA-PAIX-ET-LUTTE-CONTRE-LA-DÉVIANCE-SPIRITUELLE-DANS-LE-MONDE.docx',
  'dix-commandements-de-satan': 'LES-DIX-COMMANDEMENTS-DE-SATAN.docx',
  'envoutement-par-la-bible': 'ENVOUTEMENT-PAR-LA-BIBLE.docx',
  'hindouisme-et-deviance-spirituelle': 'HINDOUISME-ET-DÉVIANCE-SPIRITUELLE.docx',
  'la-guerre-des-spiritualites-en-afrique': 'LA-GUERRE-DES-SPIRITUALITÉS-EN-AFRIQUE.docx',
  'la-puissance-spirituelle-du-sexe': 'LA-PUISSANCE-SPIRITUELLE-DU-SEXE.docx',
  'la-sorcellerie-au-dessus-de-la-foi': 'LA-SORCELLERIE-AU-DESSUS-DE-LA-FOI.docx',
  'la-vie-apres-la-mort': 'LA-VIE-APRES-LA-MORT.docx',
  'la-vie-spirituelle-du-sorcier-univers-astral-de-la-sorcellerie': 'LA-VIE-SPIRITUELLE-DU-SORCIER.docx',
  'le-boudhisme-face-a-la-sorcellerie-et-au-satanisme':
    'LE-BOUDDHISME-FACE-À-LA-SORCELLERIE-ET-AU-SATANISME.docx',
  'le-musulman-face-a-la-sorcellerie': 'LE-MUSULMAN-FACE-A-LA-SORCELLERIE.docx',
  'l-hygiene-de-l-ame': 'HYGENE-DE-AME.docx',
  'maris-et-femmes-de-nuit': 'LES-CONSÉQUENCES-DU-PHÉNOMÈNE-DE-MARIS-ET-FEMMES-DE-NUIT.docx',
  'religion-chinoise-face-a-la-sorcellerie': 'RELIGION-CHINOISE-FACE-À-LA-SORCELLERIE.docx',
  'traditions-africaines-et-christianisme':
    'AVENIR-DES-TRADITION-ANCESTRAL-AFRICAINE-CHRITIANISME.docx',
  'transmission-de-la-sorcellerie-au-sein-de-la-famille':
    'LA-TRANSMISSION-DE-LA-SORCELLERIE-AU-SEIN-DE-LA-FAMILLE.docx',
  'le-satanisme-et-la-derive-du-monde': 'LE-SATANISME-ET-LA-DERIVE-DU-MONDE.docx',
  'comment-vivre-ensemble-avec-les-sorciers': 'COMMENT-VIVRE-ENSEMBLE-AVEC-LES-SORCIERS.docx',
};

export const getExtraitUrl = (slug) => {
  const fichier = EXTRAIT_FICHIERS[slug];
  return fichier ? `${EXTRAIT_DIR}/${encodeURIComponent(fichier)}` : null;
};

// Fusionne l'URL d'extrait dans un livre venant de l'API. Le backend peut
// désormais fournir son propre extrait_url (téléversé depuis l'admin) : on le
// priorise, et on ne retombe sur la table statique que pour les anciens
// livres jamais mis à jour depuis l'admin.
export const avecExtrait = (livre) => ({
  ...livre,
  extrait_url: livre.extrait_url || getExtraitUrl(livre.slug),
});

export default EXTRAIT_FICHIERS;
