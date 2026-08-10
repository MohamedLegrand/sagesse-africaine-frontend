import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BookOpen, Users, ShoppingBag, TrendingUp, Star, Download, BarChart2, RefreshCw,
  CreditCard, Smartphone, Clock, BookX, BookCheck, LayoutGrid, Library, FileDown, Loader2,
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';
import PartToWholeBar from '../components/charts/PartToWholeBar';
import BarVertical from '../components/charts/BarVertical';
import BarHorizontalTop from '../components/charts/BarHorizontalTop';
import LineMulti from '../components/charts/LineMulti';
import { CATEGORICAL } from '../components/charts/chartTheme';

const KpiCard = ({ label, value, icon: Icon, color, sub }) => (
  <div className="bg-white rounded-xl border border-cream-200 p-4">
    <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center mb-3`}>
      <Icon style={{ width: '18px', height: '18px' }} />
    </div>
    <p className="text-2xl font-bold text-brown-950 font-playfair">{value}</p>
    <p className="text-xs font-semibold text-brown-600 mt-0.5">{label}</p>
    <p className="text-xs text-brown-300 mt-0.5">{sub}</p>
  </div>
);

const ONGLETS_META = [
  { key: 'apercu', icon: LayoutGrid },
  { key: 'paiements', icon: CreditCard },
  { key: 'revenu', icon: TrendingUp },
  { key: 'catalogue', icon: BookOpen },
  { key: 'lecture', icon: Library },
  { key: 'activite', icon: ShoppingBag },
];

/* ── Bandeau kente (identité visuelle du site, cf. Footer.jsx) ────── */
const BandeauKente = () => (
  <div className="h-1.5 flex flex-shrink-0">
    {['bg-terra-500', 'bg-gold-500', 'bg-terra-700', 'bg-gold-400', 'bg-terra-500', 'bg-gold-500', 'bg-terra-700', 'bg-gold-400'].map((c, i) => (
      <div key={i} className={`flex-1 ${c}`} />
    ))}
  </div>
);

/* ── Sections (réutilisées à l'écran ET dans l'export PDF) ─────────── */

const SectionApercu = ({ statCards, croissanceMensuelle, repartitionLivres, repartitionCommandes, stats }) => {
  const { t } = useTranslation('admin');
  return (
  <>
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {statCards.map((card) => <KpiCard key={card.label} {...card} />)}
    </div>

    <div className="bg-white rounded-xl border border-cream-200 p-6 mb-6">
      <h2 className="font-playfair font-bold text-brown-950 text-lg mb-1">{t('statistiques.sections.croissancePlateforme')}</h2>
      <p className="text-xs text-brown-300 mb-4">{t('statistiques.sections.croissanceSousTitre')}</p>
      <LineMulti
        data={croissanceMensuelle}
        series={[
          { key: 'commandes', name: t('statistiques.sections.achats') },
          { key: 'utilisateurs', name: t('statistiques.sections.nouveauxMembres') },
        ]}
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl border border-cream-200 p-6">
        <h2 className="font-playfair font-bold text-brown-950 text-base mb-4">{t('statistiques.sections.repartitionLivres')}</h2>
        <PartToWholeBar data={repartitionLivres} colors={[CATEGORICAL[0], CATEGORICAL[1]]} />
      </div>
      <div className="bg-white rounded-xl border border-cream-200 p-6">
        <h2 className="font-playfair font-bold text-brown-950 text-base mb-4">{t('statistiques.sections.statutAchats')}</h2>
        <PartToWholeBar
          data={repartitionCommandes}
          colors={[CATEGORICAL[0], CATEGORICAL[1], CATEGORICAL[2], CATEGORICAL[3]]}
        />
      </div>
      <div className="bg-white rounded-xl border border-cream-200 p-6">
        <h2 className="font-playfair font-bold text-brown-950 text-base mb-5">{t('statistiques.sections.activite30j')}</h2>
        <div className="space-y-3">
          <div className="text-center p-5 bg-terra-50 rounded-xl">
            <p className="font-playfair text-4xl font-bold text-terra-600">{stats.nouvellesCommandes30j}</p>
            <p className="text-sm text-brown-500 mt-1">{t('statistiques.sections.nouveauxAchats')}</p>
          </div>
          <div className="text-center p-5 bg-blue-50 rounded-xl">
            <p className="font-playfair text-4xl font-bold text-blue-600">{stats.nouveauxUtilisateurs30j}</p>
            <p className="text-sm text-brown-500 mt-1">{t('statistiques.sections.nouveauxMembres')}</p>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

const SectionPaiements = ({ paiementCards, repartitionPaiements, operateurs, devises }) => {
  const { t } = useTranslation('admin');
  return (
  <>
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
      {paiementCards.map((card) => <KpiCard key={card.label} {...card} />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl border border-cream-200 p-6">
        <h2 className="font-playfair font-bold text-brown-950 text-base mb-4">{t('statistiques.sections.reussitePaiements')}</h2>
        <PartToWholeBar data={repartitionPaiements} colors={[CATEGORICAL[0], CATEGORICAL[1], CATEGORICAL[2]]} />
      </div>
      <div className="bg-white rounded-xl border border-cream-200 p-6">
        <h2 className="font-playfair font-bold text-brown-950 text-base mb-1 flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-terra-500" /> {t('statistiques.sections.parOperateur')}
        </h2>
        <BarVertical
          data={operateurs.map(([label, value]) => ({ label, value }))}
          colors={CATEGORICAL}
          height={220}
        />
      </div>
      <div className="bg-white rounded-xl border border-cream-200 p-6">
        <h2 className="font-playfair font-bold text-brown-950 text-base mb-1 flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-terra-500" /> {t('statistiques.sections.parDevise')}
        </h2>
        <BarVertical
          data={devises.map(([label, value]) => ({ label, value }))}
          colors={CATEGORICAL}
          height={220}
        />
      </div>
    </div>
  </>
  );
};

const SectionRevenu = ({ revenuMensuel, topBooks, topBooksRevenue, livresJamaisVendus }) => {
  const { t } = useTranslation('admin');
  return (
  <>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-white rounded-xl border border-cream-200 p-6">
        <h2 className="font-playfair font-bold text-brown-950 text-lg mb-5">{t('statistiques.sections.revenu6mois')}</h2>
        <BarVertical
          data={revenuMensuel.map(m => ({ label: m.label, value: m.montant }))}
          color={CATEGORICAL[0]}
          valueFormatter={(v) => `${v.toLocaleString('fr-FR')} XAF`}
        />
      </div>

      <div className="bg-white rounded-xl border border-cream-200 p-6">
        <div className="flex items-center gap-2 mb-2">
          <BarChart2 className="w-4 h-4 text-terra-500" />
          <h2 className="font-playfair font-bold text-brown-950 text-lg">{t('statistiques.sections.topVentes')}</h2>
        </div>
        <BarHorizontalTop
          data={topBooks.map(b => ({ label: b.titre, value: b.quantite }))}
          valueFormatter={(v) => t('statistiques.unites.vendu', { count: v })}
        />
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-cream-200 p-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-terra-500" />
          <h2 className="font-playfair font-bold text-brown-950 text-lg">{t('statistiques.sections.topRentables')}</h2>
        </div>
        <BarHorizontalTop
          data={topBooksRevenue.map(b => ({ label: b.titre, value: b.montant }))}
          valueFormatter={(v) => `${v.toLocaleString('fr-FR')} XAF`}
        />
      </div>

      <div className="bg-white rounded-xl border border-cream-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <BookX className="w-4 h-4 text-terra-500" />
          <h2 className="font-playfair font-bold text-brown-950 text-lg">{t('statistiques.sections.livresJamaisVendus')}</h2>
        </div>
        {livresJamaisVendus.length > 0 ? (
          <div className="space-y-2">
            {livresJamaisVendus.map((l) => (
              <div key={l.id} className="flex items-center gap-3 p-3 bg-cream-50 rounded-lg">
                <div className="w-7 h-9 bg-cream-200 rounded overflow-hidden flex-shrink-0">
                  {l.couverture_url ? (
                    <img src={l.couverture_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="w-full h-full p-1 text-brown-300" />
                  )}
                </div>
                <p className="flex-1 font-medium text-brown-900 text-sm truncate">{l.titre}</p>
                {l.est_gratuit && <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex-shrink-0">{t('statistiques.gratuit')}</span>}
              </div>
            ))}
          </div>
        ) : <p className="text-center py-10 text-brown-300 text-sm">{t('statistiques.sections.tousVendus')}</p>}
      </div>
    </div>
  </>
  );
};

const SectionCatalogue = ({ repartitionLivres, stats }) => {
  const { t } = useTranslation('admin');
  return (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-white rounded-xl border border-cream-200 p-6">
      <h2 className="font-playfair font-bold text-brown-950 text-base mb-4">{t('statistiques.sections.repartitionLivres')}</h2>
      <PartToWholeBar data={repartitionLivres} colors={[CATEGORICAL[0], CATEGORICAL[1]]} />
    </div>
    <div className="bg-white rounded-xl border border-cream-200 p-6">
      <h2 className="font-playfair font-bold text-brown-950 text-base mb-2">{t('statistiques.sections.conversionParType')}</h2>
      <BarVertical
        data={[
          { label: t('statistiques.sections.gratuitsConsultes'), value: stats.tauxConversionGratuits },
          { label: t('statistiques.sections.payantsAchetes'), value: stats.tauxConversionPayants },
        ]}
        colors={[CATEGORICAL[0], CATEGORICAL[1]]}
        valueFormatter={(v) => `${v}%`}
        height={220}
      />
    </div>
  </div>
  );
};

const SectionLecture = ({ engagementCards, topLivresLus, repartitionLecture }) => {
  const { t } = useTranslation('admin');
  return (
  <>
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {engagementCards.map((card) => <KpiCard key={card.label} {...card} />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-cream-200 p-6">
        <h2 className="font-playfair font-bold text-brown-950 text-base mb-2">{t('statistiques.sections.topLus')}</h2>
        <BarHorizontalTop
          data={topLivresLus.map(l => ({ label: l.titre, value: l.count }))}
          valueFormatter={(v) => t('statistiques.unites.session', { count: v })}
        />
      </div>
      <div className="bg-white rounded-xl border border-cream-200 p-6">
        <h2 className="font-playfair font-bold text-brown-950 text-base mb-4">{t('statistiques.sections.lectureEnLigneVsTelechargement')}</h2>
        <PartToWholeBar data={repartitionLecture} colors={[CATEGORICAL[0], CATEGORICAL[1]]} />
      </div>
    </div>
  </>
  );
};

const SectionActivite = ({ recentActivity }) => {
  const { t } = useTranslation('admin');
  return (
  <div className="bg-white rounded-xl border border-cream-200 p-6">
    <div className="flex items-center gap-2 mb-5">
      <ShoppingBag className="w-4 h-4 text-terra-500" />
      <h2 className="font-playfair font-bold text-brown-950 text-lg">{t('statistiques.sections.activiteRecente')}</h2>
    </div>
    {recentActivity.length > 0 ? (
      <div className="space-y-2">
        {recentActivity.map((a, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-cream-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-3.5 h-3.5 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-brown-900 text-sm truncate">{a.utilisateur}</p>
              <p className="text-xs text-brown-400">{new Date(a.date).toLocaleDateString('fr-FR')}</p>
            </div>
            <p className="font-bold text-brown-800 text-sm flex-shrink-0">{a.montant?.toLocaleString('fr-FR')} XAF</p>
          </div>
        ))}
      </div>
    ) : <p className="text-center py-10 text-brown-300 text-sm">{t('statistiques.sections.aucuneActivite')}</p>}
  </div>
  );
};

/* ── Gabarit d'export : identique au thème du site (logo + bandeau kente) ── */
const RapportEnTete = () => {
  const { t } = useTranslation('admin');
  return (
  <div className="mb-8">
    <BandeauKente />
    <div className="flex items-center justify-between gap-6 px-2 pt-6 pb-4">
      <div className="flex items-center gap-4">
        <img src="/images/logo.png" alt="SAGESSE AFRICAINE" className="h-16 w-auto" />
        <div>
          <p className="font-playfair text-2xl font-bold text-brown-950">SAGESSE AFRICAINE</p>
          <p className="text-xs text-terra-500 tracking-widest uppercase font-medium">{t('statistiques.rapport.titre')}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-brown-400">{t('statistiques.rapport.genereLe')}</p>
        <p className="text-sm font-semibold text-brown-800">
          {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
    <BandeauKente />
  </div>
  );
};

const RapportSectionTitre = ({ children }) => (
  <h1 className="font-playfair font-bold text-brown-950 text-xl border-l-4 border-terra-500 pl-3 mb-5">
    {children}
  </h1>
);

const RapportCouverture = ({ stats }) => {
  const { t } = useTranslation('admin');
  return (
  <div className="bg-white flex flex-col" style={{ minHeight: '1120px' }}>
    <RapportEnTete />
    <div className="flex-1 flex flex-col items-center justify-center px-10 text-center">
      <img src="/images/logo.png" alt="SAGESSE AFRICAINE" className="h-32 w-auto mb-8" />
      <p className="text-xs text-terra-500 tracking-[0.3em] uppercase font-semibold mb-3">{t('statistiques.rapport.titre')}</p>
      <h1 className="font-playfair text-4xl font-bold text-brown-950 mb-4">{t('statistiques.rapport.tableauDeBord')}</h1>
      <p className="text-brown-400 mb-12">
        {t('statistiques.rapport.genereLe')} {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
      </p>
      <div className="grid grid-cols-3 gap-6 w-full max-w-2xl">
        <div className="bg-cream-50 rounded-2xl p-6">
          <p className="font-playfair text-3xl font-bold text-terra-600">{stats.totalCommandes}</p>
          <p className="text-xs text-brown-500 mt-1">{t('statistiques.rapport.achatsAuTotal')}</p>
        </div>
        <div className="bg-cream-50 rounded-2xl p-6">
          <p className="font-playfair text-3xl font-bold text-gold-600">{stats.montantEncaisse?.toLocaleString('fr-FR')} XAF</p>
          <p className="text-xs text-brown-500 mt-1">{t('statistiques.rapport.montantEncaisse')}</p>
        </div>
        <div className="bg-cream-50 rounded-2xl p-6">
          <p className="font-playfair text-3xl font-bold text-blue-600">{stats.totalUtilisateurs}</p>
          <p className="text-xs text-brown-500 mt-1">{t('statistiques.rapport.utilisateurs')}</p>
        </div>
      </div>
    </div>
    <div>
      <BandeauKente />
      <p className="text-center text-[10px] text-brown-300 py-3">
        {t('statistiques.rapport.pied')}
      </p>
    </div>
  </div>
  );
};

const StatistiquesPage = () => {
  const { t } = useTranslation('admin');
  const MOIS_LABELS = t('statistiques.mois', { returnObjects: true });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState('apercu');
  const coverRef = useRef(null);
  const sectionRefs = useRef({});
  const [stats, setStats] = useState({
    totalLivres: 0, livresGratuits: 0, livresPayants: 0, livresPublies: 0,
    totalUtilisateurs: 0, utilisateursActifs: 0, admins: 0,
    totalCommandes: 0, commandesPayees: 0, commandesEnAttente: 0, commandesLivrees: 0,
    chiffreAffaires: 0, panierMoyen: 0,
    totalAvis: 0, avisApprouves: 0, noteMoyenne: 0,
    totalTelechargements: 0, nouvellesCommandes30j: 0, nouveauxUtilisateurs30j: 0,
    livresVendusTotal: 0, montantEncaisse: 0,
    // Paiements & conversion
    tauxReussitePaiements: 0, tauxConversionCommandes: 0, fraisMoyen: 0,
    commandesBloquees: 0, panierMoyenPaye: 0,
    // Rétention / conversion catalogue
    tauxRetention30j: 0, tauxConversionGratuits: 0, tauxConversionPayants: 0,
    // Lecture / engagement
    tauxCompletionMoyen: 0, utilisateursAvecLivreNonLu: 0, totalLecturesEnLigne: 0,
  });
  const [topBooks, setTopBooks] = useState([]);
  const [topBooksRevenue, setTopBooksRevenue] = useState([]);
  const [livresJamaisVendus, setLivresJamaisVendus] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [revenuMensuel, setRevenuMensuel] = useState([]);
  const [operateurs, setOperateurs] = useState([]);
  const [devises, setDevises] = useState([]);
  const [livrePlusLu, setLivrePlusLu] = useState(null);
  const [topLivresLus, setTopLivresLus] = useState([]);
  const [croissanceMensuelle, setCroissanceMensuelle] = useState([]);
  const [repartitionCommandes, setRepartitionCommandes] = useState([]);
  const [repartitionPaiements, setRepartitionPaiements] = useState([]);
  const [repartitionLivres, setRepartitionLivres] = useState([]);
  const [repartitionLecture, setRepartitionLecture] = useState([]);

  const fetchAllStats = async () => {
    setLoading(true);
    try {
      const [
        livresRes, usersRes, commandesRes, avisRes, telechargementsRes,
        paiementsRes, accesRes, progressionsRes,
      ] = await Promise.all([
        api.get('/livres/', { params: { page: 1, taille: 1000 } }),
        api.get('/utilisateurs/', { params: { page: 1, taille: 1000 } }),
        api.get('/commandes/', { params: { page: 1, taille: 1000 } }),
        api.get('/avis/', { params: { page: 1, taille: 1000 } }),
        api.get('/historique-telechargements/', { params: { page: 1, taille: 1000 } }).catch(() => ({ data: { historique: [] } })),
        api.get('/paiements/', { params: { page: 1, taille: 1000 } }).catch(() => ({ data: { paiements: [] } })),
        api.get('/acces-livres/', { params: { page: 1, taille: 1000 } }).catch(() => ({ data: { acces: [] } })),
        api.get('/progression-lecture/admin/toutes').catch(() => ({ data: { progressions: [] } })),
      ]);

      const livres = livresRes.data.livres || [];
      const utilisateurs = usersRes.data.utilisateurs || [];
      const commandes = commandesRes.data.commandes || [];
      const avis = avisRes.data.avis || [];
      const telechargements = telechargementsRes.data.historique || [];
      const paiements = paiementsRes.data.paiements || [];
      const acces = accesRes.data.acces || [];
      const progressions = progressionsRes.data.progressions || [];

      const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const avisApprouves = avis.filter(a => a.est_approuve);
      const chiffreAffaires = commandes.reduce((s, c) => s + (c.montant_total || 0), 0);

      // Les commandes/lignes renvoyées par l'API ne contiennent que des ids
      // (livre_id, utilisateur_id) : on les enrichit avec les catalogues déjà chargés.
      const livresById = Object.fromEntries(livres.map(l => [l.id, l]));
      const utilisateursById = Object.fromEntries(utilisateurs.map(u => [u.id, u]));

      const commandesPayeesListe = commandes.filter(c => c.statut === 'payee' || c.statut === 'payé');
      const montantEncaisse = commandesPayeesListe.reduce((s, c) => s + (c.montant_total || 0), 0);

      // ── Ventes par livre (quantité + montant), uniquement commandes payées ──
      const bookSales = {};
      let livresVendusTotal = 0;
      commandesPayeesListe.forEach(c => c.lignes?.forEach(l => {
        const livre = livresById[l.livre_id];
        if (!bookSales[l.livre_id]) {
          bookSales[l.livre_id] = {
            quantite: 0, montant: 0,
            titre: livre?.titre || t('statistiques.livreSupprime'),
            couverture_url: livre?.couverture_url || null,
          };
        }
        bookSales[l.livre_id].quantite += l.quantite;
        bookSales[l.livre_id].montant += (l.prix_unitaire || 0) * l.quantite;
        livresVendusTotal += l.quantite;
      }));
      const livresJamaisVendusListe = livres.filter(l => !bookSales[l.id]);

      // ── Paiements & conversion ──
      const paiementsReussis = paiements.filter(p => p.statut === 'reussi');
      const paiementsEchoues = paiements.filter(p => p.statut === 'echoue');
      const totalPaiementsTermines = paiementsReussis.length + paiementsEchoues.length;
      const tauxReussitePaiements = totalPaiementsTermines > 0
        ? Math.round((paiementsReussis.length / totalPaiementsTermines) * 100) : 0;

      const tauxConversionCommandes = commandes.length > 0
        ? Math.round((commandesPayeesListe.length / commandes.length) * 100) : 0;

      const operateurCounts = {};
      paiements.forEach(p => {
        const op = p.metadonnees?.operator || t('statistiques.autre');
        operateurCounts[op] = (operateurCounts[op] || 0) + 1;
      });
      const deviseCounts = {};
      paiements.forEach(p => { deviseCounts[p.devise] = (deviseCounts[p.devise] || 0) + 1; });

      const fraisValides = paiements.map(p => p.metadonnees?.fee).filter(f => typeof f === 'number');
      const fraisMoyen = fraisValides.length > 0 ? fraisValides.reduce((s, f) => s + f, 0) / fraisValides.length : 0;

      const cinqMinutesMs = 5 * 60 * 1000;
      const maintenant = Date.now();
      const commandesBloquees = commandes.filter(
        c => c.statut === 'en_attente' && (maintenant - new Date(c.cree_le).getTime()) > cinqMinutesMs
      ).length;

      const panierMoyenPaye = commandesPayeesListe.length > 0 ? montantEncaisse / commandesPayeesListe.length : 0;

      // ── Revenu par mois (6 derniers mois avec des commandes payées) ──
      const revenuParMois = {};
      commandesPayeesListe.forEach(c => {
        const d = new Date(c.cree_le);
        const cle = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        revenuParMois[cle] = (revenuParMois[cle] || 0) + (c.montant_total || 0);
      });
      const revenuMensuelListe = Object.entries(revenuParMois)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6)
        .map(([cle, montant]) => {
          const [, mois] = cle.split('-');
          return { cle, label: MOIS_LABELS[parseInt(mois, 10) - 1], montant };
        });

      // ── Croissance sur 6 mois (nouvelles commandes / nouveaux membres) ──
      const commandesParMois = {};
      commandes.forEach(c => {
        const d = new Date(c.cree_le);
        const cle = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        commandesParMois[cle] = (commandesParMois[cle] || 0) + 1;
      });
      const utilisateursParMois = {};
      utilisateurs.forEach(u => {
        const d = new Date(u.cree_le);
        const cle = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        utilisateursParMois[cle] = (utilisateursParMois[cle] || 0) + 1;
      });
      const clesMois = new Set([...Object.keys(commandesParMois), ...Object.keys(utilisateursParMois)]);
      const croissanceMensuelleListe = Array.from(clesMois).sort().slice(-6).map(cle => {
        const [, mois] = cle.split('-');
        return {
          cle,
          label: MOIS_LABELS[parseInt(mois, 10) - 1],
          commandes: commandesParMois[cle] || 0,
          utilisateurs: utilisateursParMois[cle] || 0,
        };
      });

      // ── Répartitions (barres empilées) ──
      const repartitionCommandesListe = [
        { name: t('commandes.statuts.payee'), value: commandesPayeesListe.length },
        { name: t('commandes.statuts.enAttente'), value: commandes.filter(c => c.statut === 'en_attente').length },
        { name: t('commandes.statuts.livree'), value: commandes.filter(c => c.statut === 'livree').length },
        { name: t('commandes.statuts.annulee'), value: commandes.filter(c => c.statut === 'annulee').length },
      ].filter(d => d.value > 0);

      const repartitionPaiementsListe = [
        { name: t('statistiques.sections.reussis'), value: paiementsReussis.length },
        { name: t('statistiques.sections.echoues'), value: paiementsEchoues.length },
        { name: t('commandes.statuts.enAttente'), value: paiements.filter(p => p.statut === 'en_attente').length },
      ].filter(d => d.value > 0);

      // ── Conversion gratuit vs payant (accès accordés / catalogue) ──
      const accesByLivre = {};
      acces.forEach(a => { accesByLivre[a.livre_id] = (accesByLivre[a.livre_id] || 0) + 1; });
      const livresGratuitsListe = livres.filter(l => l.est_gratuit);
      const livresPayantsListe = livres.filter(l => !l.est_gratuit);
      const gratuitsAvecAcces = livresGratuitsListe.filter(l => accesByLivre[l.id]).length;
      const payantsAvecAcces = livresPayantsListe.filter(l => accesByLivre[l.id]).length;
      const tauxConversionGratuits = livresGratuitsListe.length > 0
        ? Math.round((gratuitsAvecAcces / livresGratuitsListe.length) * 100) : 0;
      const tauxConversionPayants = livresPayantsListe.length > 0
        ? Math.round((payantsAvecAcces / livresPayantsListe.length) * 100) : 0;

      const repartitionLivresListe = [
        { name: t('statistiques.sections.gratuits'), value: livresGratuitsListe.length },
        { name: t('statistiques.sections.payants'), value: livresPayantsListe.length },
      ].filter(d => d.value > 0);

      // ── Rétention (proxy : commande passée dans les 30 derniers jours, pas de suivi
      // de dernière connexion en base) ──
      const utilisateursAvecCommande30j = new Set(
        commandes.filter(c => new Date(c.cree_le) >= thirtyDaysAgo).map(c => c.utilisateur_id)
      ).size;
      const tauxRetention30j = utilisateurs.length > 0
        ? Math.round((utilisateursAvecCommande30j / utilisateurs.length) * 100) : 0;

      // ── Lecture / engagement ──
      const lecturesParLivre = {};
      progressions.forEach(p => {
        if (!lecturesParLivre[p.livre_id]) {
          lecturesParLivre[p.livre_id] = { count: 0, titre: livresById[p.livre_id]?.titre || t('statistiques.livreSupprime') };
        }
        lecturesParLivre[p.livre_id].count += 1;
      });
      const topLivresLusListe = Object.values(lecturesParLivre).sort((a, b) => b.count - a.count).slice(0, 5);
      const livrePlusLuTrouve = topLivresLusListe[0] || null;

      const tauxCompletionMoyen = progressions.length > 0
        ? Math.round(progressions.reduce((s, p) => s + (p.pourcentage || 0), 0) / progressions.length) : 0;

      const clesLues = new Set(progressions.map(p => `${p.utilisateur_id}_${p.livre_id}`));
      const utilisateursAvecLivreNonLu = new Set(
        acces.filter(a => !clesLues.has(`${a.utilisateur_id}_${a.livre_id}`)).map(a => a.utilisateur_id)
      ).size;
      const totalLecturesEnLigne = new Set(progressions.map(p => `${p.utilisateur_id}_${p.livre_id}`)).size;

      const repartitionLectureListe = [
        { name: t('statistiques.sections.lecturesEnLigneLabel'), value: totalLecturesEnLigne },
        { name: t('statistiques.sections.telechargementsLabel'), value: telechargements.length },
      ].filter(d => d.value > 0);

      setStats({
        totalLivres: livres.length,
        livresGratuits: livres.filter(l => l.est_gratuit).length,
        livresPayants: livres.filter(l => !l.est_gratuit).length,
        livresPublies: livres.filter(l => l.est_publie).length,
        totalUtilisateurs: utilisateurs.length,
        utilisateursActifs: utilisateurs.filter(u => u.est_actif).length,
        admins: utilisateurs.filter(u => u.role === 'admin').length,
        totalCommandes: commandes.length,
        commandesPayees: commandesPayeesListe.length,
        commandesEnAttente: commandes.filter(c => c.statut === 'en_attente').length,
        commandesLivrees: commandes.filter(c => c.statut === 'livree').length,
        chiffreAffaires,
        panierMoyen: commandes.length > 0 ? chiffreAffaires / commandes.length : 0,
        totalAvis: avis.length,
        avisApprouves: avisApprouves.length,
        noteMoyenne: avisApprouves.length > 0 ? (avisApprouves.reduce((s, a) => s + a.note, 0) / avisApprouves.length).toFixed(1) : 0,
        totalTelechargements: telechargements.length,
        nouvellesCommandes30j: commandes.filter(c => new Date(c.cree_le) >= thirtyDaysAgo).length,
        nouveauxUtilisateurs30j: utilisateurs.filter(u => new Date(u.cree_le) >= thirtyDaysAgo).length,
        livresVendusTotal,
        montantEncaisse,
        tauxReussitePaiements,
        tauxConversionCommandes,
        fraisMoyen,
        commandesBloquees,
        panierMoyenPaye,
        tauxRetention30j,
        tauxConversionGratuits,
        tauxConversionPayants,
        tauxCompletionMoyen,
        utilisateursAvecLivreNonLu,
        totalLecturesEnLigne,
      });

      setTopBooks(Object.entries(bookSales).map(([id, d]) => ({ id, ...d })).sort((a, b) => b.quantite - a.quantite).slice(0, 5));
      setTopBooksRevenue(Object.entries(bookSales).map(([id, d]) => ({ id, ...d })).sort((a, b) => b.montant - a.montant).slice(0, 5));
      setLivresJamaisVendus(livresJamaisVendusListe.slice(0, 8));
      setRevenuMensuel(revenuMensuelListe);
      setOperateurs(Object.entries(operateurCounts).sort(([, a], [, b]) => b - a));
      setDevises(Object.entries(deviseCounts).sort(([, a], [, b]) => b - a));
      setLivrePlusLu(livrePlusLuTrouve);
      setTopLivresLus(topLivresLusListe);
      setCroissanceMensuelle(croissanceMensuelleListe);
      setRepartitionCommandes(repartitionCommandesListe);
      setRepartitionPaiements(repartitionPaiementsListe);
      setRepartitionLivres(repartitionLivresListe);
      setRepartitionLecture(repartitionLectureListe);
      setRecentActivity(commandes.slice(0, 8).map(c => {
        const u = utilisateursById[c.utilisateur_id];
        return {
          id: c.id,
          utilisateur: u ? `${u.prenom || ''} ${u.nom || ''}`.trim() : t('statistiques.utilisateurSupprime'),
          montant: c.montant_total,
          date: c.cree_le,
          statut: c.statut,
        };
      }));
    } catch { toast.error(t('statistiques.messages.erreurChargement')); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAllStats(); }, []);

  const statCards = [
    { label: t('statistiques.cartes.livres.label'),         value: stats.totalLivres,                         icon: BookOpen,    color: 'bg-terra-50 text-terra-600',  sub: t('statistiques.cartes.livres.sub', { count: stats.livresPublies }) },
    { label: t('statistiques.cartes.utilisateurs.label'),   value: stats.totalUtilisateurs,                    icon: Users,       color: 'bg-blue-50 text-blue-600',    sub: t('statistiques.cartes.utilisateurs.sub', { count: stats.utilisateursActifs }) },
    { label: t('statistiques.cartes.achats.label'),         value: stats.totalCommandes,                       icon: ShoppingBag, color: 'bg-green-50 text-green-600',  sub: t('statistiques.cartes.achats.sub', { count: stats.commandesPayees }) },
    { label: t('statistiques.cartes.caTotal.label'),       value: `${stats.chiffreAffaires?.toLocaleString('fr-FR')} XAF`, icon: TrendingUp,  color: 'bg-gold-50 text-gold-600',    sub: t('statistiques.cartes.caTotal.sub', { montant: Math.round(stats.panierMoyen || 0).toLocaleString('fr-FR') }) },
    { label: t('statistiques.cartes.avis.label'),           value: stats.totalAvis,                            icon: Star,        color: 'bg-yellow-50 text-yellow-600',sub: t('statistiques.cartes.avis.sub', { approuves: stats.avisApprouves, note: stats.noteMoyenne }) },
    { label: t('statistiques.cartes.telechargements.label'),value: stats.totalTelechargements,                 icon: Download,    color: 'bg-purple-50 text-purple-600',sub: t('statistiques.cartes.telechargements.sub') },
    { label: t('statistiques.cartes.exemplairesVendus.label'), value: stats.livresVendusTotal,                icon: ShoppingBag, color: 'bg-emerald-50 text-emerald-600', sub: t('statistiques.cartes.exemplairesVendus.sub') },
    { label: t('statistiques.cartes.montantEncaisse.label'), value: `${stats.montantEncaisse?.toLocaleString('fr-FR')} XAF`, icon: TrendingUp, color: 'bg-lime-50 text-lime-600', sub: t('statistiques.cartes.montantEncaisse.sub') },
  ];

  const paiementCards = [
    { label: t('statistiques.cartesPaiements.tauxReussite.label'), value: `${stats.tauxReussitePaiements}%`, icon: CreditCard, color: 'bg-green-50 text-green-600', sub: t('statistiques.cartesPaiements.tauxReussite.sub') },
    { label: t('statistiques.cartesPaiements.conversionPaye.label'), value: `${stats.tauxConversionCommandes}%`, icon: TrendingUp, color: 'bg-teal-50 text-teal-600', sub: t('statistiques.cartesPaiements.conversionPaye.sub') },
    { label: t('statistiques.cartesPaiements.fraisMoyen.label'), value: `${Math.round(stats.fraisMoyen).toLocaleString('fr-FR')} XAF`, icon: CreditCard, color: 'bg-orange-50 text-orange-600', sub: t('statistiques.cartesPaiements.fraisMoyen.sub') },
    { label: t('statistiques.cartesPaiements.achatsBloques.label'), value: stats.commandesBloquees, icon: Clock, color: 'bg-red-50 text-red-600', sub: t('statistiques.cartesPaiements.achatsBloques.sub') },
    { label: t('statistiques.cartesPaiements.panierMoyenPaye.label'), value: `${Math.round(stats.panierMoyenPaye).toLocaleString('fr-FR')} XAF`, icon: ShoppingBag, color: 'bg-lime-50 text-lime-600', sub: t('statistiques.cartesPaiements.panierMoyenPaye.sub') },
  ];

  const engagementCards = [
    { label: t('statistiques.cartesEngagement.retention.label'), value: `${stats.tauxRetention30j}%`, icon: Users, color: 'bg-blue-50 text-blue-600', sub: t('statistiques.cartesEngagement.retention.sub') },
    { label: t('statistiques.cartesEngagement.conversionGratuits.label'), value: `${stats.tauxConversionGratuits}%`, icon: BookCheck, color: 'bg-green-50 text-green-600', sub: t('statistiques.cartesEngagement.conversionGratuits.sub') },
    { label: t('statistiques.cartesEngagement.conversionPayants.label'), value: `${stats.tauxConversionPayants}%`, icon: BookCheck, color: 'bg-terra-50 text-terra-600', sub: t('statistiques.cartesEngagement.conversionPayants.sub') },
    { label: t('statistiques.cartesEngagement.completionMoyenne.label'), value: `${stats.tauxCompletionMoyen}%`, icon: BookOpen, color: 'bg-purple-50 text-purple-600', sub: t('statistiques.cartesEngagement.completionMoyenne.sub') },
    { label: t('statistiques.cartesEngagement.achetesJamaisLus.label'), value: stats.utilisateursAvecLivreNonLu, icon: BookX, color: 'bg-red-50 text-red-600', sub: t('statistiques.cartesEngagement.achetesJamaisLus.sub') },
    { label: t('statistiques.cartesEngagement.lecturesEnLigne.label'), value: stats.totalLecturesEnLigne, icon: BookOpen, color: 'bg-indigo-50 text-indigo-600', sub: t('statistiques.cartesEngagement.lecturesEnLigne.sub', { count: stats.totalTelechargements }) },
  ];

  const capturerNoeud = (noeud) => html2canvas(noeud, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    windowWidth: noeud.scrollWidth,
  });

  const ajouterCanvasAuPdf = (pdf, canvas, nouvellePageAvant) => {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL('image/png');

    if (nouvellePageAvant) pdf.addPage();

    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
  };

  const handleExportPdf = async () => {
    if (!coverRef.current) return;
    setExporting(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');

      const coverCanvas = await capturerNoeud(coverRef.current);
      ajouterCanvasAuPdf(pdf, coverCanvas, false);

      for (const onglet of ONGLETS_META) {
        const noeud = sectionRefs.current[onglet.key];
        if (!noeud) continue;
        const canvas = await capturerNoeud(noeud);
        ajouterCanvasAuPdf(pdf, canvas, true);
      }

      const dateFichier = new Date().toISOString().slice(0, 10);
      pdf.save(`rapport-statistiques-sagesse-africaine-${dateFichier}.pdf`);
      toast.success(t('statistiques.messages.rapportGenere'));
    } catch {
      toast.error(t('statistiques.messages.erreurGenerationPdf'));
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-12 h-12 border-4 border-terra-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-brown-500 font-medium">{t('statistiques.chargement')}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="section-eyebrow">{t('statistiques.eyebrow')}</span>
          <h1 className="section-title mt-2">{t('statistiques.titre')}</h1>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={fetchAllStats} className="btn-outline text-sm">
            <RefreshCw className="w-4 h-4" /> {t('statistiques.actualiser')}
          </button>
          <button onClick={handleExportPdf} disabled={exporting} className="btn-primary text-sm disabled:opacity-60">
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            {exporting ? t('statistiques.generationEnCours') : t('statistiques.exporterPdf')}
          </button>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {ONGLETS_META.map((onglet) => (
          <button
            key={onglet.key}
            onClick={() => setActiveTab(onglet.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              activeTab === onglet.key
                ? 'bg-terra-500 text-white shadow-md'
                : 'bg-white text-brown-600 border border-cream-200 hover:bg-cream-50'
            }`}
          >
            <onglet.icon className="w-4 h-4" />
            {t(`statistiques.onglets.${onglet.key}`)}
          </button>
        ))}
      </div>

      {activeTab === 'apercu' && (
        <SectionApercu
          statCards={statCards}
          croissanceMensuelle={croissanceMensuelle}
          repartitionLivres={repartitionLivres}
          repartitionCommandes={repartitionCommandes}
          stats={stats}
        />
      )}
      {activeTab === 'paiements' && (
        <SectionPaiements
          paiementCards={paiementCards}
          repartitionPaiements={repartitionPaiements}
          operateurs={operateurs}
          devises={devises}
        />
      )}
      {activeTab === 'revenu' && (
        <SectionRevenu
          revenuMensuel={revenuMensuel}
          topBooks={topBooks}
          topBooksRevenue={topBooksRevenue}
          livresJamaisVendus={livresJamaisVendus}
        />
      )}
      {activeTab === 'catalogue' && (
        <SectionCatalogue repartitionLivres={repartitionLivres} stats={stats} />
      )}
      {activeTab === 'lecture' && (
        <SectionLecture
          engagementCards={engagementCards}
          topLivresLus={topLivresLus}
          repartitionLecture={repartitionLecture}
        />
      )}
      {activeTab === 'activite' && (
        <SectionActivite recentActivity={recentActivity} />
      )}

      {/* Gabarit hors-écran capturé pour l'export PDF : une page de couverture + une
          section par onglet, capturées séparément pour ne jamais couper un graphique
          entre deux pages. Même thème visuel que le reste du site. */}
      <div style={{ position: 'fixed', top: 0, left: '-10000px', width: '900px', zIndex: -1 }}>
        <div ref={coverRef}>
          <RapportCouverture stats={stats} />
        </div>

        <div ref={(el) => { sectionRefs.current.apercu = el; }} className="bg-white p-8">
          <RapportEnTete />
          <RapportSectionTitre>{t('statistiques.onglets.apercu')}</RapportSectionTitre>
          <SectionApercu
            statCards={statCards}
            croissanceMensuelle={croissanceMensuelle}
            repartitionLivres={repartitionLivres}
            repartitionCommandes={repartitionCommandes}
            stats={stats}
          />
        </div>

        <div ref={(el) => { sectionRefs.current.paiements = el; }} className="bg-white p-8">
          <RapportEnTete />
          <RapportSectionTitre>{t('statistiques.onglets.paiements')}</RapportSectionTitre>
          <SectionPaiements
            paiementCards={paiementCards}
            repartitionPaiements={repartitionPaiements}
            operateurs={operateurs}
            devises={devises}
          />
        </div>

        <div ref={(el) => { sectionRefs.current.revenu = el; }} className="bg-white p-8">
          <RapportEnTete />
          <RapportSectionTitre>{t('statistiques.onglets.revenu')}</RapportSectionTitre>
          <SectionRevenu
            revenuMensuel={revenuMensuel}
            topBooks={topBooks}
            topBooksRevenue={topBooksRevenue}
            livresJamaisVendus={livresJamaisVendus}
          />
        </div>

        <div ref={(el) => { sectionRefs.current.catalogue = el; }} className="bg-white p-8">
          <RapportEnTete />
          <RapportSectionTitre>{t('statistiques.onglets.catalogue')}</RapportSectionTitre>
          <SectionCatalogue repartitionLivres={repartitionLivres} stats={stats} />
        </div>

        <div ref={(el) => { sectionRefs.current.lecture = el; }} className="bg-white p-8">
          <RapportEnTete />
          <RapportSectionTitre>{t('statistiques.onglets.lecture')}</RapportSectionTitre>
          <SectionLecture
            engagementCards={engagementCards}
            topLivresLus={topLivresLus}
            repartitionLecture={repartitionLecture}
          />
        </div>

        <div ref={(el) => { sectionRefs.current.activite = el; }} className="bg-white p-8">
          <RapportEnTete />
          <RapportSectionTitre>{t('statistiques.onglets.activite')}</RapportSectionTitre>
          <SectionActivite recentActivity={recentActivity} />
          <div className="mt-10">
            <BandeauKente />
            <p className="text-center text-[10px] text-brown-300 pt-3">
              {t('statistiques.rapport.pied')}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StatistiquesPage;
