// Palette de graphiques dérivée des couleurs de marque (tailwind.config.js) et
// validée avec le script dataviz (CVD ΔE ≥ 11.9, seuil normal-vision 22.3 — voir
// le rapport de validation). Ordre catégoriel FIXE : ne jamais permuter/cycler.
export const CATEGORICAL = ['#c4622d', '#2563eb', '#d4a017', '#059669', '#9333ea'];

// Rampe séquentielle (une seule teinte, clair → foncé) pour les grandeurs à une série.
export const SEQUENTIAL = ['#f6c4a9', '#ef9c74', '#e7703d', '#c4622d', '#a94e22'];

// Couleurs de statut réservées — alignées sur les badges déjà utilisés dans
// l'admin (GestionCommandesPage, DashboardAdminPage) : jamais réutilisées comme
// simples couleurs de série.
export const STATUS = {
  succes: '#16a34a',
  attente: '#d4a017',
  echec: '#ef4444',
  info: '#2563eb',
};

// Le gold (#d4a017) est sous le seuil de contraste 3:1 sur fond blanc (WARN du
// validateur) : toujours l'accompagner d'un libellé direct visible, jamais
// utilisé seul comme porteur d'information.
export const GRID_COLOR = '#f4e3be';
export const AXIS_COLOR = '#a3735a';
export const INK_PRIMARY = '#2c1810';
export const INK_MUTED = '#8a7060';
