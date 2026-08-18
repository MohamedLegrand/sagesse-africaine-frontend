import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BookOpen, Users, ShoppingBag, TrendingUp, Star, RefreshCw,
  BookX, Award, ThumbsDown, FileDown, Loader2,
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';

const PERIODES = [
  { key: '1m', mois: 1 },
  { key: '2m', mois: 2 },
  { key: '3m', mois: 3 },
  { key: '6m', mois: 6 },
  { key: '1a', mois: 12 },
  { key: 'tout', mois: null },
];

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

/* ── Bandeau kente (identité visuelle du site, cf. Footer.jsx) ────── */
const BandeauKente = () => (
  <div className="h-1.5 flex flex-shrink-0">
    {['bg-terra-500', 'bg-gold-500', 'bg-terra-700', 'bg-gold-400', 'bg-terra-500', 'bg-gold-500', 'bg-terra-700', 'bg-gold-400'].map((c, i) => (
      <div key={i} className={`flex-1 ${c}`} />
    ))}
  </div>
);

/* ── Carte KPI par livre : couverture + un chiffre clé mis en avant ── */
const KpiLivreTile = ({ livre, rang, valeur, valeurCouleur, sousTexte }) => (
  <div className="relative bg-white rounded-xl border border-cream-200 p-3 flex items-center gap-3">
    {rang && (
      <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-brown-950 text-white text-[10px] font-bold flex items-center justify-center">{rang}</span>
    )}
    <div className="w-9 h-12 bg-cream-200 rounded overflow-hidden flex-shrink-0">
      {livre.couverture_url ? (
        <img src={livre.couverture_url} alt="" className="w-full h-full object-cover" />
      ) : (
        <BookOpen className="w-full h-full p-1.5 text-brown-300" />
      )}
    </div>
    <div className="min-w-0 flex-1">
      <p className={`font-playfair text-lg font-bold leading-tight ${valeurCouleur}`}>{valeur}</p>
      <p className="text-xs font-semibold text-brown-700 truncate" title={livre.titre}>{livre.titre}</p>
      {sousTexte && <p className="text-[11px] text-brown-400 truncate mt-0.5" title={sousTexte}>{sousTexte}</p>}
    </div>
  </div>
);

const SectionKpiLivres = ({ titre, icone: Icon, iconeCouleur, children, estVide, videTexte }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <Icon className={`w-4 h-4 ${iconeCouleur}`} />
      <h2 className="font-playfair font-bold text-brown-950 text-base">{titre}</h2>
    </div>
    {estVide ? (
      <p className="text-center py-8 text-brown-300 text-sm bg-white rounded-xl border border-cream-200">{videTexte}</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">{children}</div>
    )}
  </div>
);

/* ── Gabarit d'export : identique au thème du site (logo + bandeau kente) ── */
const RapportEnTete = ({ periodeLabel, t }) => (
  <div className="mb-8">
    <BandeauKente />
    <div className="flex items-center justify-between gap-6 px-2 pt-6 pb-4">
      <div className="flex items-center gap-4">
        <img src="/images/logo.jpeg" alt="SAGESSE AFRICAINE" className="h-16 w-auto rounded-lg" />
        <div>
          <p className="font-playfair text-2xl font-bold text-brown-950">SAGESSE AFRICAINE</p>
          <p className="text-xs text-terra-500 tracking-widest uppercase font-medium">
            {t('statistiques.rapport.titre')} — {periodeLabel}
          </p>
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

const StatistiquesPage = () => {
  const { t } = useTranslation('admin');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [periode, setPeriode] = useState('1m');
  const rapportRef = useRef(null);

  const [rawLivres, setRawLivres] = useState([]);
  const [rawUtilisateurs, setRawUtilisateurs] = useState([]);
  const [rawCommandes, setRawCommandes] = useState([]);
  const [rawAvis, setRawAvis] = useState([]);

  const fetchAllStats = async () => {
    setLoading(true);
    try {
      const [livresRes, usersRes, commandesRes, avisRes] = await Promise.all([
        api.get('/livres/', { params: { page: 1, taille: 1000 } }),
        api.get('/utilisateurs/', { params: { page: 1, taille: 1000 } }),
        api.get('/commandes/', { params: { page: 1, taille: 1000 } }),
        api.get('/avis/', { params: { page: 1, taille: 1000 } }),
      ]);
      setRawLivres(livresRes.data.livres || []);
      setRawUtilisateurs(usersRes.data.utilisateurs || []);
      setRawCommandes(commandesRes.data.commandes || []);
      setRawAvis(avisRes.data.avis || []);
    } catch { toast.error(t('statistiques.messages.erreurChargement')); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAllStats(); }, []);

  const donnees = useMemo(() => {
    const livresById = Object.fromEntries(rawLivres.map(l => [l.id, l]));
    const utilisateursById = Object.fromEntries(rawUtilisateurs.map(u => [u.id, u]));
    const nomUtilisateur = (id) => {
      const u = utilisateursById[id];
      return u ? `${u.prenom || ''} ${u.nom || ''}`.trim() || t('statistiques.utilisateurSupprime') : t('statistiques.utilisateurSupprime');
    };

    const commandesPayeesToutes = rawCommandes.filter(c => c.statut === 'payee' || c.statut === 'payé');

    const periodeMeta = PERIODES.find(p => p.key === periode) || PERIODES[0];
    let dateDebut = null;
    if (periodeMeta.mois !== null) {
      dateDebut = new Date();
      dateDebut.setMonth(dateDebut.getMonth() - periodeMeta.mois);
    }
    const commandesPeriode = dateDebut
      ? commandesPayeesToutes.filter(c => new Date(c.cree_le) >= dateDebut)
      : commandesPayeesToutes;

    // ── Ventes sur la période sélectionnée ──
    const ventesPeriode = {};
    commandesPeriode.forEach(c => c.lignes?.forEach(l => {
      const livre = livresById[l.livre_id];
      if (!ventesPeriode[l.livre_id]) {
        ventesPeriode[l.livre_id] = {
          id: l.livre_id, quantite: 0, montant: 0,
          titre: livre?.titre || t('statistiques.livreSupprime'),
          couverture_url: livre?.couverture_url || null,
        };
      }
      ventesPeriode[l.livre_id].quantite += l.quantite;
      ventesPeriode[l.livre_id].montant += (l.prix_unitaire || 0) * l.quantite;
    }));
    const topVentes = Object.values(ventesPeriode).sort((a, b) => b.quantite - a.quantite).slice(0, 8);

    // ── Livres jamais vendus (toutes périodes confondues) ──
    const venteToutesPeriodes = new Set();
    commandesPayeesToutes.forEach(c => c.lignes?.forEach(l => venteToutesPeriodes.add(l.livre_id)));
    const livresJamaisVendus = rawLivres.filter(l => !venteToutesPeriodes.has(l.id)).slice(0, 10);

    // ── Avis par livre (toutes périodes — la réputation d'un livre ne se limite pas à la période choisie) ──
    const avisApprouves = rawAvis.filter(a => a.est_approuve);
    const avisParLivre = {};
    avisApprouves.forEach(a => {
      if (!avisParLivre[a.livre_id]) avisParLivre[a.livre_id] = [];
      avisParLivre[a.livre_id].push({
        id: a.id, note: a.note, commentaire: a.commentaire,
        nomUtilisateur: nomUtilisateur(a.utilisateur_id), date: a.cree_le,
      });
    });
    const livresNotes = Object.entries(avisParLivre).map(([livreId, avisListe]) => {
      const livre = livresById[livreId];
      const noteMoyenne = avisListe.reduce((s, a) => s + a.note, 0) / avisListe.length;
      return {
        id: livreId,
        titre: livre?.titre || t('statistiques.livreSupprime'),
        couverture_url: livre?.couverture_url || null,
        noteMoyenne,
        avisListe: [...avisListe].sort((a, b) => new Date(b.date) - new Date(a.date)),
      };
    });
    const mieuxNotes = [...livresNotes].sort((a, b) => b.noteMoyenne - a.noteMoyenne || b.avisListe.length - a.avisListe.length).slice(0, 5);
    const moinsBienNotes = [...livresNotes].sort((a, b) => a.noteMoyenne - b.noteMoyenne || b.avisListe.length - a.avisListe.length).slice(0, 5);

    const chiffreAffairesPeriode = commandesPeriode.reduce((s, c) => s + (c.montant_total || 0), 0);
    const noteMoyenneGlobale = avisApprouves.length > 0
      ? (avisApprouves.reduce((s, a) => s + a.note, 0) / avisApprouves.length).toFixed(1) : 0;

    return {
      periodeMeta, dateDebut,
      stats: {
        totalLivres: rawLivres.length,
        livresPublies: rawLivres.filter(l => l.est_publie).length,
        totalUtilisateurs: rawUtilisateurs.length,
        utilisateursActifs: rawUtilisateurs.filter(u => u.est_actif).length,
        commandesPeriode: commandesPeriode.length,
        chiffreAffairesPeriode,
        totalAvis: rawAvis.length,
        avisApprouves: avisApprouves.length,
        noteMoyenneGlobale,
      },
      topVentes,
      livresJamaisVendus,
      mieuxNotes,
      moinsBienNotes,
    };
  }, [rawLivres, rawUtilisateurs, rawCommandes, rawAvis, periode, t]);

  const periodeLabel = t(`statistiques.periodes.${donnees.periodeMeta.key}`);

  const statCards = [
    { label: t('statistiques.cartes.livres.label'), value: donnees.stats.totalLivres, icon: BookOpen, color: 'bg-terra-50 text-terra-600', sub: t('statistiques.cartes.livres.sub', { count: donnees.stats.livresPublies }) },
    { label: t('statistiques.cartes.utilisateurs.label'), value: donnees.stats.totalUtilisateurs, icon: Users, color: 'bg-blue-50 text-blue-600', sub: t('statistiques.cartes.utilisateurs.sub', { count: donnees.stats.utilisateursActifs }) },
    { label: t('statistiques.cartes.achats.label'), value: donnees.stats.commandesPeriode, icon: ShoppingBag, color: 'bg-green-50 text-green-600', sub: periodeLabel },
    { label: t('statistiques.cartes.caTotal.label'), value: `${donnees.stats.chiffreAffairesPeriode.toLocaleString('fr-FR')} XAF`, icon: TrendingUp, color: 'bg-gold-50 text-gold-600', sub: periodeLabel },
    { label: t('statistiques.cartes.avis.label'), value: donnees.stats.totalAvis, icon: Star, color: 'bg-yellow-50 text-yellow-600', sub: t('statistiques.cartes.avis.sub', { approuves: donnees.stats.avisApprouves, note: donnees.stats.noteMoyenneGlobale }) },
  ];

  const capturerNoeud = (noeud) => html2canvas(noeud, {
    scale: 2, useCORS: true, backgroundColor: '#ffffff', windowWidth: noeud.scrollWidth,
  });

  const handleExportPdf = async () => {
    if (!rapportRef.current) return;
    setExporting(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const canvas = await capturerNoeud(rapportRef.current);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/png');

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

  const contenuRapport = (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {statCards.map((card) => <KpiCard key={card.label} {...card} />)}
      </div>

      <div className="mb-6">
        <SectionKpiLivres
          titre={`${t('statistiques.sections.topVentes')} — ${periodeLabel}`} icone={ShoppingBag} iconeCouleur="text-terra-500"
          estVide={donnees.topVentes.length === 0} videTexte={t('statistiques.sections.aucuneVentePeriode')}
        >
          {donnees.topVentes.map((l, i) => (
            <KpiLivreTile
              key={l.id} livre={l} rang={i + 1}
              valeur={t('statistiques.unites.vendu', { count: l.quantite })}
              valeurCouleur="text-terra-600"
              sousTexte={`${l.montant.toLocaleString('fr-FR')} XAF`}
            />
          ))}
        </SectionKpiLivres>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SectionKpiLivres
          titre={t('statistiques.sections.mieuxNotes')} icone={Award} iconeCouleur="text-gold-500"
          estVide={donnees.mieuxNotes.length === 0} videTexte={t('statistiques.sections.aucunAvis')}
        >
          {donnees.mieuxNotes.map((l) => (
            <KpiLivreTile
              key={l.id} livre={l}
              valeur={`${l.noteMoyenne.toFixed(1)}/5`}
              valeurCouleur="text-gold-600"
              sousTexte={t('statistiques.unites.avis', { count: l.avisListe.length }) + (l.avisListe[0]?.commentaire ? ` · « ${l.avisListe[0].commentaire} »` : '')}
            />
          ))}
        </SectionKpiLivres>

        <SectionKpiLivres
          titre={t('statistiques.sections.moinsBienNotes')} icone={ThumbsDown} iconeCouleur="text-red-400"
          estVide={donnees.moinsBienNotes.length === 0} videTexte={t('statistiques.sections.aucunAvis')}
        >
          {donnees.moinsBienNotes.map((l) => (
            <KpiLivreTile
              key={l.id} livre={l}
              valeur={`${l.noteMoyenne.toFixed(1)}/5`}
              valeurCouleur="text-red-500"
              sousTexte={t('statistiques.unites.avis', { count: l.avisListe.length }) + (l.avisListe[0]?.commentaire ? ` · « ${l.avisListe[0].commentaire} »` : '')}
            />
          ))}
        </SectionKpiLivres>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <BookX className="w-4 h-4 text-terra-500" />
          <h2 className="font-playfair font-bold text-brown-950 text-base">{t('statistiques.sections.livresJamaisVendus')}</h2>
        </div>
        <div className="bg-white rounded-xl border border-cream-200 p-4">
          <div className="flex items-center gap-4 mb-1">
            <p className="font-playfair text-3xl font-bold text-brown-950">{donnees.livresJamaisVendus.length}</p>
            <p className="text-xs text-brown-400">
              {donnees.livresJamaisVendus.length === 0 ? t('statistiques.sections.tousVendus') : t('statistiques.sections.aucuneVenteJamais')}
            </p>
          </div>
          {donnees.livresJamaisVendus.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {donnees.livresJamaisVendus.map((l) => (
                <span key={l.id} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-cream-100 text-brown-600 max-w-[220px] truncate" title={l.titre}>
                  {l.titre}
                  {l.est_gratuit && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 flex-shrink-0">{t('statistiques.gratuit')}</span>}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );

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

      {/* Sélecteur de période */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        <span className="text-xs font-semibold text-brown-400 uppercase tracking-wide mr-1">{t('statistiques.periodeLabel')}</span>
        {PERIODES.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriode(p.key)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              periode === p.key ? 'bg-terra-500 text-white shadow-sm' : 'bg-white text-brown-600 border border-cream-200 hover:bg-cream-50'
            }`}
          >
            {t(`statistiques.periodes.${p.key}`)}
          </button>
        ))}
      </div>

      {contenuRapport}

      {/* Gabarit hors-écran capturé pour l'export PDF : même contenu, avec l'entête du rapport */}
      <div style={{ position: 'fixed', top: 0, left: '-10000px', width: '900px', zIndex: -1 }}>
        <div ref={rapportRef} className="bg-white p-8">
          <RapportEnTete periodeLabel={periodeLabel} t={t} />
          {contenuRapport}
          <div className="mt-10">
            <BandeauKente />
            <p className="text-center text-[10px] text-brown-300 pt-3">{t('statistiques.rapport.pied')}</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StatistiquesPage;
