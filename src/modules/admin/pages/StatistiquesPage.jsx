import React, { useState, useEffect } from 'react';
import { BookOpen, Users, ShoppingBag, TrendingUp, Star, Download, BarChart2, RefreshCw } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';

const StatBar = ({ label, value, total, color }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-brown-600 font-medium">{label}</span>
        <span className="text-brown-900 font-bold">{value}</span>
      </div>
      <div className="w-full bg-cream-200 rounded-full h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const StatistiquesPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLivres: 0, livresGratuits: 0, livresPayants: 0, livresPublies: 0,
    totalUtilisateurs: 0, utilisateursActifs: 0, admins: 0,
    totalCommandes: 0, commandesPayees: 0, commandesEnAttente: 0, commandesLivrees: 0,
    chiffreAffaires: 0, panierMoyen: 0,
    totalAvis: 0, avisApprouves: 0, noteMoyenne: 0,
    totalTelechargements: 0, nouvellesCommandes30j: 0, nouveauxUtilisateurs30j: 0,
  });
  const [topBooks, setTopBooks] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  const fetchAllStats = async () => {
    setLoading(true);
    try {
      const [livresRes, usersRes, commandesRes, avisRes, telechargementsRes] = await Promise.all([
        api.get('/livres/', { params: { page: 1, taille: 1000 } }),
        api.get('/utilisateurs/', { params: { page: 1, taille: 1000 } }),
        api.get('/commandes/', { params: { page: 1, taille: 1000 } }),
        api.get('/avis/', { params: { page: 1, taille: 1000 } }),
        api.get('/historique-telechargements/', { params: { page: 1, taille: 1000 } }).catch(() => ({ data: { historique: [] } })),
      ]);

      const livres = livresRes.data.livres || [];
      const utilisateurs = usersRes.data.utilisateurs || [];
      const commandes = commandesRes.data.commandes || [];
      const avis = avisRes.data.avis || [];
      const telechargements = telechargementsRes.data.historique || [];

      const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const avisApprouves = avis.filter(a => a.est_approuve);
      const chiffreAffaires = commandes.reduce((s, c) => s + (c.montant_total || 0), 0);

      const bookSales = {};
      commandes.forEach(c => c.lignes?.forEach(l => {
        if (!bookSales[l.livre_id]) bookSales[l.livre_id] = { quantite: 0, titre: l.livre?.titre || 'Inconnu' };
        bookSales[l.livre_id].quantite += l.quantite;
      }));

      setStats({
        totalLivres: livres.length,
        livresGratuits: livres.filter(l => l.est_gratuit).length,
        livresPayants: livres.filter(l => !l.est_gratuit).length,
        livresPublies: livres.filter(l => l.est_publie).length,
        totalUtilisateurs: utilisateurs.length,
        utilisateursActifs: utilisateurs.filter(u => u.est_actif).length,
        admins: utilisateurs.filter(u => u.role === 'admin').length,
        totalCommandes: commandes.length,
        commandesPayees: commandes.filter(c => c.statut === 'payee' || c.statut === 'payé').length,
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
      });

      setTopBooks(Object.entries(bookSales).map(([id, d]) => ({ id, ...d })).sort((a, b) => b.quantite - a.quantite).slice(0, 5));
      setRecentActivity(commandes.slice(0, 8).map(c => ({ id: c.id, utilisateur: `${c.utilisateur?.prenom} ${c.utilisateur?.nom}`, montant: c.montant_total, date: c.cree_le, statut: c.statut })));
    } catch { toast.error('Erreur chargement'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAllStats(); }, []);

  const statCards = [
    { label: 'Livres',         value: stats.totalLivres,                         icon: BookOpen,    color: 'bg-terra-50 text-terra-600',  sub: `${stats.livresPublies} publiés` },
    { label: 'Utilisateurs',   value: stats.totalUtilisateurs,                    icon: Users,       color: 'bg-blue-50 text-blue-600',    sub: `${stats.utilisateursActifs} actifs` },
    { label: 'Commandes',      value: stats.totalCommandes,                       icon: ShoppingBag, color: 'bg-green-50 text-green-600',  sub: `${stats.commandesPayees} payées` },
    { label: 'CA total',       value: `${stats.chiffreAffaires?.toLocaleString()} F`, icon: TrendingUp,  color: 'bg-gold-50 text-gold-600',    sub: `moyen: ${stats.panierMoyen?.toFixed(0)} F` },
    { label: 'Avis',           value: stats.totalAvis,                            icon: Star,        color: 'bg-yellow-50 text-yellow-600',sub: `${stats.avisApprouves} approuvés • ${stats.noteMoyenne}/5` },
    { label: 'Téléchargements',value: stats.totalTelechargements,                 icon: Download,    color: 'bg-purple-50 text-purple-600',sub: 'fichiers téléchargés' },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-12 h-12 border-4 border-terra-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-brown-500 font-medium">Chargement des statistiques…</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="section-eyebrow">Analyse</span>
          <h1 className="section-title mt-2">Statistiques globales</h1>
        </div>
        <button onClick={fetchAllStats} className="btn-outline text-sm flex-shrink-0">
          <RefreshCw className="w-4 h-4" /> Actualiser
        </button>
      </div>

      {/* Cartes KPI */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="bg-white rounded-xl border border-cream-200 p-4">
            <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center mb-3`}>
              <Icon style={{ width: '18px', height: '18px' }} />
            </div>
            <p className="text-2xl font-bold text-brown-950 font-playfair">{value}</p>
            <p className="text-xs font-semibold text-brown-600 mt-0.5">{label}</p>
            <p className="text-xs text-brown-300 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top livres */}
        <div className="bg-white rounded-xl border border-cream-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChart2 className="w-4 h-4 text-terra-500" />
            <h2 className="font-playfair font-bold text-brown-950 text-lg">Top 5 — Livres les plus vendus</h2>
          </div>
          {topBooks.length > 0 ? (
            <div className="space-y-3">
              {topBooks.map((book, i) => (
                <div key={book.id} className="flex items-center gap-3 p-3 bg-cream-50 rounded-lg">
                  <div className="w-7 h-7 bg-terra-500 text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">{i + 1}</div>
                  <p className="flex-1 font-medium text-brown-900 text-sm truncate">{book.titre}</p>
                  <p className="font-bold text-terra-600 text-sm flex-shrink-0">{book.quantite} vendus</p>
                </div>
              ))}
            </div>
          ) : <p className="text-center py-10 text-brown-300 text-sm">Aucune vente enregistrée</p>}
        </div>

        {/* Activité récente */}
        <div className="bg-white rounded-xl border border-cream-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <ShoppingBag className="w-4 h-4 text-terra-500" />
            <h2 className="font-playfair font-bold text-brown-950 text-lg">Activité récente</h2>
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
                  <p className="font-bold text-brown-800 text-sm flex-shrink-0">{a.montant?.toLocaleString()} F</p>
                </div>
              ))}
            </div>
          ) : <p className="text-center py-10 text-brown-300 text-sm">Aucune activité</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Répartition livres */}
        <div className="bg-white rounded-xl border border-cream-200 p-6">
          <h2 className="font-playfair font-bold text-brown-950 text-base mb-5">Répartition des livres</h2>
          <div className="space-y-4">
            <StatBar label="Gratuits" value={stats.livresGratuits} total={stats.totalLivres} color="bg-green-500" />
            <StatBar label="Payants" value={stats.livresPayants} total={stats.totalLivres} color="bg-terra-500" />
            <StatBar label="Publiés" value={stats.livresPublies} total={stats.totalLivres} color="bg-blue-500" />
          </div>
        </div>

        {/* Statut commandes */}
        <div className="bg-white rounded-xl border border-cream-200 p-6">
          <h2 className="font-playfair font-bold text-brown-950 text-base mb-5">Statut des commandes</h2>
          <div className="space-y-4">
            <StatBar label="Payées" value={stats.commandesPayees} total={stats.totalCommandes} color="bg-green-500" />
            <StatBar label="En attente" value={stats.commandesEnAttente} total={stats.totalCommandes} color="bg-gold-500" />
            <StatBar label="Livrées" value={stats.commandesLivrees} total={stats.totalCommandes} color="bg-blue-500" />
          </div>
        </div>

        {/* Activité 30 jours */}
        <div className="bg-white rounded-xl border border-cream-200 p-6">
          <h2 className="font-playfair font-bold text-brown-950 text-base mb-5">Activité — 30 derniers jours</h2>
          <div className="space-y-3">
            <div className="text-center p-5 bg-terra-50 rounded-xl">
              <p className="font-playfair text-4xl font-bold text-terra-600">{stats.nouvellesCommandes30j}</p>
              <p className="text-sm text-brown-500 mt-1">Nouvelles commandes</p>
            </div>
            <div className="text-center p-5 bg-blue-50 rounded-xl">
              <p className="font-playfair text-4xl font-bold text-blue-600">{stats.nouveauxUtilisateurs30j}</p>
              <p className="text-sm text-brown-500 mt-1">Nouveaux membres</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StatistiquesPage;
