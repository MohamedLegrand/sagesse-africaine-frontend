// Catalogue statique des livres disponibles dans public/images/livres-site/
// Chaque livre expose 3 visuels (couverture, sommaire, 4e de couverture) dérivés
// du nom de son dossier, plus un résumé marketing basé sur le vrai texte de la 4e de couverture.

const AUTEUR = 'SIDA ABENA Jean Paul Sylvain';
const COLLECTION = 'Lumière et Vérité sur le Monde des Ténèbres';
const PRIX_DEFAUT = 6500;
const BASE_DIR = '/images/livres-site';

const slugify = (str) =>
  str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const imagePath = (dossier, fichier) => `${BASE_DIR}/${encodeURIComponent(dossier)}/${fichier}`;

// Dossiers dont le sommaire est réparti sur 2 images (sommaire1.png, sommaire2.png)
// au lieu d'une seule image sommaire.png.
const DOSSIERS_SOMMAIRE_DOUBLE = new Set([
  'Comment Comprendre et interpreter le Rêve',
  'Comment obtenir ta Délivrance et ta Victoire contre le Diable les Démons et les Sorciers',
  'CONSEQUENCES SPIRITUELLES DE LA MASTURBATION ET DE LA PORNOGRAPHIE DANS TA VIE',
  "L'Hygiène de l'âme",
  'Sectes et Sociétés Secrètes africaines',
]);

const sommaireUrls = (dossier) =>
  DOSSIERS_SOMMAIRE_DOUBLE.has(dossier)
    ? [imagePath(dossier, 'sommaire1.png'), imagePath(dossier, 'sommaire2.png')]
    : [imagePath(dossier, 'sommaire.png')];

const LIVRES_BRUTS = [
  {
    dossier: 'Ange ou demon',
    titre: 'Ange ou Démon ?',
    sousTitre: "La nature spirituelle profonde de l'Homme",
    description:
      "Découvrez dans « Ange ou Démon ? » une exploration saisissante de la nature spirituelle profonde de l'Homme, composé de quatre entités indissociables : le corps, l'esprit-central, le Saint-Esprit et l'esprit de tentation. Entre monde visible et invisible, ce livre dévoile comment l'âme, guidée par le Saint-Esprit, affronte sans cesse les forces obscures qui tentent de dominer notre destin. Grâce à une approche clinique inédite de la Médecine Traditionnelle des Handicapés Spirituels, l'auteur offre des clés concrètes pour comprendre ces luttes invisibles et reprendre le contrôle de sa vie spirituelle.",
  },
  {
    dossier: 'Chrétien Africain et la Maladie',
    titre: 'Chrétien Africain et la Maladie',
    sousTitre: 'Enjeux et défis de la pastorale des Malades au 3ème millénaire',
    description:
      "Dans « Chrétien Africain et la Maladie », l'Association Mariale d'Abili livre une œuvre dense et audacieuse au carrefour de la théologie pastorale, de l'anthropologie africaine et de la Médecine Traditionnelle des Handicapés Spirituels. La maladie y est envisagée non comme un simple fait biologique, mais comme une épreuve existentielle mêlant souffrances psychiques, blessures spirituelles et quête de sens. Face aux dérives du 3ème millénaire, l'ouvrage plaide pour une pastorale renouvelée et responsable — un appel vibrant à une Église africaine guérissante, lucide et compatissante envers les malades.",
  },
  {
    dossier: 'CHRÉTIEN AFRICAIN FACE  À LA SORCELLERIE',
    titre: 'Chrétien Africain face à la Sorcellerie',
    sousTitre: 'Approche clinique de la Médecine Traditionnelle des Handicapés Spirituels (MTHS)',
    description:
      "La sorcellerie en Afrique n'est pas un mythe mais une réalité vécue, qui fragilise les consciences et enferme de nombreux « handicapés spirituels » dans la peur, la culpabilité et le silence. Face à ce phénomène, le chrétien africain se retrouve souvent désarmé, tiraillé entre une foi peu incarnée et des pratiques traditionnelles mal comprises. Grâce à la Médecine Traditionnelle des Handicapés Spirituels (MTHS), ce livre propose une lecture audacieuse et thérapeutique de la sorcellerie, éclairée par l'anthropologie africaine et la foi chrétienne — un véritable guide pastoral pour dépasser la peur et accompagner les âmes blessées vers la guérison.",
  },
  {
    dossier: 'Comment Comprendre et interpreter le Rêve',
    titre: 'Comment Comprendre et Interpréter le Rêve ?',
    sousTitre: 'Approche clinique de la Médecine Traditionnelle des Handicapés Spirituels (MTHS)',
    description:
      "Et si vos rêves étaient bien plus que de simples images nocturnes, mais un langage subtil reliant le visible à l'invisible, le corps à l'esprit ? À travers l'approche originale de la Médecine Traditionnelle des Handicapés Spirituels (MTHS), ce livre offre une lecture clinique et spirituelle du monde onirique, alliant observation, discernement et sagesse traditionnelle. Il donne des clés concrètes pour interpréter les symboles, identifier les blocages spirituels et amorcer un chemin de guérison intérieure — un ouvrage audacieux pour donner du sens à vos nuits et transformer vos jours.",
  },
  {
    dossier: 'Comment obtenir ta Délivrance et ta Victoire contre le Diable les Démons et les Sorciers',
    titre: 'Comment obtenir ta Délivrance et ta Victoire sur le Diable, les Démons et les Sorciers',
    sousTitre:
      'Code de conduite et de discipline spirituelle des Usagers de la Médecine Traditionnelle des Handicapés Spirituels (MTHS)',
    description:
      "Depuis toujours, l'humanité reconnaît l'existence d'un combat invisible qui influence profondément la vie des hommes : attaques spirituelles, envoûtements, manipulations occultes et sorcellerie sont, pour beaucoup, une source réelle d'angoisse et de désorientation. Ce guide pratique rappelle une vérité essentielle : nul n'est condamné à vivre sous l'emprise des forces des ténèbres. Fondé sur l'expérience thérapeutique de la Médecine Traditionnelle des Handicapés Spirituels (MTHS), il accompagne pas à pas le lecteur vers la prise de conscience, la rupture avec les forces obscures et une protection spirituelle durable.",
  },
  {
    dossier: 'Comment se soigner des persécutions spirituelles',
    titre: 'Comment te Soigner des Persécutions Spirituelles, des Maladies et Sorts de Sorcellerie ?',
    sousTitre: 'Approche clinique de la « Médecine Traditionnelle des Handicapés Spirituels »',
    description:
      "La Médecine Traditionnelle des Handicapés Spirituels, née il y a trente ans au sein de la Clinique spirituelle Marie Reine de la Miséricorde d'Abili au Cameroun, vient en aide aux « handicapés spirituels » — ces personnes envoûtées, perturbées et exploitées par le Malin sans même le savoir. Troubles du comportement, cauchemars récurrents, maux persistants : autant de signes qui poussent souvent les victimes vers des marabouts et charlatans, au risque de trahir leur foi. Ce livre répond à une question essentielle : comment se soigner des persécutions spirituelles sans renier le Seigneur Jésus-Christ ? Un guide clinique et spirituel pour se protéger et guérir en toute fidélité à l'Évangile.",
  },
  {
    dossier: 'Comment vivre-ensemble avec les Sorciers',
    titre: 'Comment Vivre-ensemble avec les Sorciers',
    sousTitre: 'Afin de préserver la paix dans ta famille',
    description:
      "La sorcellerie divise, effraie et détruit silencieusement de nombreuses familles africaines : accusations hâtives, délivrances violentes, exclusions injustes sacrifient trop souvent la paix familiale au nom de la lutte contre le mal. À contre-courant des discours extrêmes, ce livre invite à un changement radical de regard, où la sorcellerie n'est ni niée ni banalisée mais comprise comme un handicap spirituel nécessitant discernement et soin. Un ouvrage nécessaire pour transformer la peur en discernement, et la violence en paix durable au sein de la famille.",
  },
  {
    dossier: 'CONSEQUENCES SPIRITUELLES DE LA MASTURBATION ET DE LA PORNOGRAPHIE DANS TA VIE',
    titre: 'Les Conséquences Spirituelles de la Masturbation et de la Pornographie dans ta Vie',
    sousTitre: "Décharge d'énergie, maladies mystiques, blocages socioprofessionnels",
    description:
      "Ce livre percutant lève le voile sur les dimensions invisibles et souvent taboues de la masturbation et de la pornographie, révélant leurs impacts sur l'énergie vitale, l'équilibre spirituel et la réussite sociale. À travers une plume immersive, l'auteur décrypte le concept de « décharge d'énergie » et les « maladies mystiques » qui en découleraient, ainsi que les blocages socioprofessionnels : perte de motivation, stagnation, difficultés relationnelles. Un ouvrage révélateur qui invite à une véritable prise de conscience et à un chemin de restauration personnelle.",
  },
  {
    dossier: 'CULTURE DE LA PAIX ET LUTTE CONTRE LA DÉVIANCE SPIRITUELLE',
    titre: 'Culture de la Paix et Lutte contre la Déviance Spirituelle dans le Monde',
    sousTitre:
      'Approche méthodologique de la pratique interreligieuse de la Médecine Traditionnelle des Handicapés Spirituels (MTHS)',
    description:
      "Dans un monde bousculé par l'anxiété existentielle et la fragmentation du sens humain, cet ouvrage de référence propose une approche inédite de la Médecine Traditionnelle des Handicapés Spirituels (MTHS) pour comprendre, prévenir et guérir les désordres spirituels qui minent individus et sociétés. Par une méthodologie interreligieuse et intégrale, l'auteur montre comment restaurer la paix intérieure et la cohésion sociale en considérant l'homme dans sa totalité corps-âme-esprit-destin. Un appel universel à la réconciliation entre science et sagesse, essentiel pour thérapeutes, leaders religieux et éducateurs.",
  },
  {
    dossier: 'La Guerre des Spiritualités en Afrique',
    titre: 'La Guerre des Spiritualités en Afrique',
    sousTitre:
      'Fondements spirituels et luttes de leadership entre les religions du Décalogue, les religions traditionnelles africaines et les loges secrètes occidentales',
    description:
      "Une plongée lucide et courageuse au cœur des conflits spirituels silencieux qui traversent l'Afrique, entre religions du Décalogue, traditions africaines et loges ésotériques occidentales. À travers l'approche clinique de la Médecine Traditionnelle des Handicapés Spirituels (MTHS), l'auteur décrypte syncrétisme, doubles appartenances et pactes invisibles à l'origine de fragmentation identitaire et de dépendance spirituelle. Un ouvrage qui invite leaders spirituels, thérapeutes et décideurs à repenser la guérison comme réconciliation profonde entre foi, culture et vie.",
  },
  {
    dossier: 'la puissance spirituelle du sexe',
    titre: 'La Puissance Spirituelle du Sexe',
    sousTitre:
      'Comment le Diable et les démons dominent les hommes par le pouvoir spirituel caché derrière le sexe',
    description:
      "Et si le sexe était l'un des plus puissants vecteurs d'influence spirituelle sur l'être humain ? Cet ouvrage audacieux explore les liens méconnus entre sexualité, vulnérabilité spirituelle et domination invisible. À la croisée de la clinique traditionnelle africaine et d'une lecture spirituelle approfondie, l'auteur dévoile comment des forces obscures exploiteraient les déséquilibres intimes pour asservir les consciences et perturber les trajectoires de vie. Un livre puissant, destiné à éveiller et à équiper toute personne en quête de liberté intérieure et de maîtrise de soi.",
  },
  {
    dossier: 'la Sorcellerie au Dessus de la foi',
    titre: 'La Sorcellerie au-dessus de la Foi',
    sousTitre: 'Pourquoi le Mal, la Déviance spirituelle et la sorcellerie dominent-ils les hommes sur Terre',
    description:
      "Pourquoi le Mal, la déviance spirituelle et la sorcellerie semblent-ils dominer les hommes sur Terre ? Cet ouvrage audacieux et interdisciplinaire croise anthropologie, psychologie clinique et savoirs endogènes africains pour interroger les mécanismes par lesquels le mal devient une grille de lecture du monde. En s'appuyant sur la Médecine Traditionnelle des Handicapés Spirituels (MTHS), l'auteur propose une lecture innovante des troubles dits « spirituels », loin des oppositions simplistes entre science et croyance — une invitation à repenser les frontières entre visible et invisible.",
  },
  {
    dossier: 'La Vie après la Mort',
    titre: 'La Vie après la Mort',
    sousTitre: 'Approche clinique de la « Médecine Traditionnelle des Handicapés Spirituels »',
    description:
      "Et si la mort n'était pas une fin, mais un passage vers une existence exigeante et merveilleusement ordonnée ? Ayant vécu simultanément parmi les vivants et les défunts, l'auteur livre ici un témoignage et un guide unique sur le Purgatoire et le monde spirituel. À travers une approche clinique de la Médecine Traditionnelle des Handicapés Spirituels, il explique comment dialoguer avec les âmes, intercéder pour les défunts et renforcer sa protection spirituelle. Un voyage initiatique entre vie terrestre et vie spirituelle, une invitation à la foi, à la connaissance et à la délivrance.",
  },
  {
    dossier: 'La Vie spirituelle du Sorcier -Univers Astral de la Sorcellerie',
    titre: 'La Vie Spirituelle du Sorcier',
    sousTitre: "(L'Univers Astral de la Sorcellerie)",
    description:
      "Que se passe-t-il vraiment la nuit, lorsque le corps du sorcier repose mais que son esprit voyage dans l'univers astral de la sorcellerie ? Ce livre saisissant dévoile le phénomène du dédoublement astral, jusqu'aux lieux où se tiendraient les réunions spirituelles des sorciers et les sorts qui s'y décident. Une plongée rare et troublante dans l'invisible, qui révèle une activité nocturne réelle mais ignorée de la plupart, pour mieux comprendre et combattre ces phénomènes.",
  },
  {
    dossier: 'LE MUSULMAN FACE A LA SORCELLERIE',
    titre: 'Le Musulman face à la Sorcellerie',
    sousTitre: 'Approche clinique de la Médecine Traditionnelle des Handicapés Spirituels (MTHS)',
    description:
      "Dans l'Afrique contemporaine, la sorcellerie fragilise les familles, isole les victimes et met à l'épreuve la foi. À travers la Médecine Traditionnelle des Handicapés Spirituels (MTHS), fondée sur la théologie islamique, la sagesse soufie et l'anthropologie africaine, ce guide offre aux imams, praticiens et leaders communautaires des outils concrets pour identifier, accompagner et guérir. Un ouvrage initiatique et thérapeutique qui transforme la peur en compréhension et restaure dignité, foi et harmonie au sein des communautés.",
  },
  {
    dossier: 'Le Remède Traditionnel Amélioré',
    titre: 'Le Remède Traditionnel Amélioré post-Covid-19',
    sousTitre: 'Une médecine alternative, pilier de la souveraineté sanitaire des États africains',
    description:
      "La pandémie de Covid-19 a révélé les failles des systèmes de santé africains, mais aussi la richesse trop souvent négligée des savoirs thérapeutiques endogènes. Ancré dans la Médecine Traditionnelle des Handicapés Spirituels (MTHS), cet ouvrage défend une approche holistique du soin, alliant remèdes traditionnels améliorés, validation scientifique et accompagnement spirituel. Un plaidoyer rigoureux et visionnaire pour une souveraineté sanitaire africaine, destiné aux décideurs, chercheurs et professionnels de santé en quête de solutions durables et enracinées.",
  },
  {
    dossier: "L'Hygiène de l'âme",
    titre: "L'Hygiène de l'Âme",
    sousTitre: "Le secret d'une santé spirituelle et d'une vie de foi épanouissantes",
    description:
      "Et si la véritable santé commençait au cœur de l'âme ? Face au stress et à la perte de repères spirituels, ce livre propose une approche novatrice à la croisée de la science, de la théologie et des savoirs traditionnels, fondée sur la Médecine Traditionnelle des Handicapés Spirituels (MTHS). Guide pratique, réflexion et parcours initiatique à la fois, il invite chacun à entreprendre le voyage décisif de sa propre guérison spirituelle, vers une âme équilibrée et une vie profondément transformée.",
  },
  {
    dossier: 'MARIS ET FEMMES DE NUIT',
    titre: 'Les Conséquences du Phénomène de Maris et Femmes de Nuit',
    sousTitre:
      "Pourquoi beaucoup de femmes et d'hommes de qualité n'arrivent pas à se marier, ni avoir une relation conjugale stable et épanouissante",
    description:
      "Pourquoi tant de femmes et d'hommes de qualité peinent-ils à construire une relation conjugale stable et épanouissante ? À travers une approche clinique novatrice inspirée de la Médecine Traditionnelle des Handicapés Spirituels (MTHS), ce livre décrypte les blocages affectifs, les échecs relationnels répétés et les expériences spirituelles souvent tues. Un ouvrage éclairant qui ouvre des pistes concrètes de libération, de reconstruction intérieure et de réconciliation avec soi et avec l'autre.",
  },
  {
    dossier: 'Sectes et Sociétés Secrètes africaines',
    titre: 'Enjeux et Défis du Contrôle Spirituel de l\'Homme',
    sousTitre:
      'Par les Sociétés Initiatiques Secrètes africaines, les Sectes et les Loges Exotériques Occidentales',
    description:
      "Dans un monde où le pouvoir invisible façonne les consciences, ce livre explore avec rigueur les mécanismes de contrôle spirituel à l'œuvre dans les sociétés initiatiques secrètes africaines, les sectes contemporaines et les loges exotériques occidentales. Grâce à la Médecine Traditionnelle des Handicapés Spirituels (MTHS), il décrypte comment traditions, rituels et symboles peuvent être détournés pour dominer l'homme, et propose des clés de prévention et de réhabilitation. Un ouvrage essentiel pour comprendre l'emprise invisible et retrouver une spiritualité libre et consciente.",
  },
  {
    dossier: 'Traditions africaines et Christianisme',
    titre: "L'Avenir des Traditions ancestrales africaines et le Christianisme",
    sousTitre: 'Mariage ou divorce ?',
    description:
      "Entre héritages ancestraux et christianisme importé, l'Afrique contemporaine se tient à une croisée décisive : faut-il tout rejeter pour croire, ou tout mélanger pour survivre ? S'appuyant sur la Médecine Traditionnelle des Handicapés Spirituels (MTHS), ce livre explore les souffrances nées des syncrétismes inconscients et des ruptures culturelles mal accompagnées, à l'origine de maladies, d'échecs et de conflits familiaux. Il trace une voie de guérison qui réconcilie foi chrétienne, culture africaine et dignité humaine.",
  },
  {
    dossier: 'Transmission de la Sorcellerie au sein de la famille',
    titre: 'La Transmission de la Sorcellerie au sein de la Famille',
    sousTitre: "(L'Évu : le germe de l'envoûtement)",
    description:
      "Comment la sorcellerie se transmet-elle au sein des familles ? Ce livre plonge au cœur de l'Évu, ce germe de l'envoûtement transmis comme une empreinte spirituelle à travers les lignées, à la lumière de la Médecine Traditionnelle des Handicapés Spirituels (MTHS). L'auteur y dévoile les liens entre maladies mystiques, blocages répétitifs et héritages spirituels non purifiés, révélant comment la famille peut devenir aussi bien lieu de contamination que terrain privilégié de guérison.",
  },
];

export const livresSite = LIVRES_BRUTS.map((livre) => ({
  id: slugify(livre.titre),
  titre: livre.titre,
  sousTitre: livre.sousTitre,
  auteur: AUTEUR,
  collection: COLLECTION,
  langue: 'francais',
  prix: PRIX_DEFAUT,
  est_gratuit: false,
  est_publie: true,
  description: livre.description,
  couverture_url: imagePath(livre.dossier, 'premiere_couverture.png'),
  sommaire_urls: sommaireUrls(livre.dossier),
  quatrieme_couverture_url: imagePath(livre.dossier, 'quatrieme_couverture.png'),
}));

export const getLivreSiteById = (id) => livresSite.find((livre) => livre.id === id);

export default livresSite;
