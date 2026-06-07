import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AccueilPage, ConnexionPage, InscriptionPage } from './modules/visiteur';
import { NosLivresPage, QuiSommesNousPage, ContactPage, PanierPage } from './modules/pages-publiques';
import { 
  TableauBordPage, BoutiquePage, DetailLivrePage, PanierPage as DashboardPanierPage, 
  PaiementPage, BibliothequePage, HistoriquePage, ProfilPage, ParametresPage 
} from './modules/dashboard';
import { 
  DashboardAdminPage,
  GestionLivresPage,
  GestionUtilisateursPage,
  GestionCommandesPage,
  GestionCollectionsPage,
  GestionAvisPage,
  StatistiquesPage
} from './modules/admin';
import RouteProtegee from './modules/dashboard/components/RouteProtegee';
import RouteAdmin from './modules/admin/components/RouteAdmin';

function App() {
  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1A1A1A',
            color: '#D4AF37',
            border: '1px solid #D4AF37',
          },
          success: {
            iconTheme: {
              primary: '#D4AF37',
              secondary: '#1A1A1A',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#1A1A1A',
            },
          },
        }}
      />
      
      <Routes>
        {/* Pages publiques */}
        <Route path="/" element={<AccueilPage />} />
        <Route path="/connexion" element={<ConnexionPage />} />
        <Route path="/inscription" element={<InscriptionPage />} />
        <Route path="/livres" element={<NosLivresPage />} />
        <Route path="/qui-sommes-nous" element={<QuiSommesNousPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/panier" element={<PanierPage />} />
        
        {/* Dashboard utilisateur (protégé) */}
        <Route path="/dashboard" element={
          <RouteProtegee>
            <TableauBordPage />
          </RouteProtegee>
        } />
        <Route path="/dashboard/boutique" element={
          <RouteProtegee>
            <BoutiquePage />
          </RouteProtegee>
        } />
        <Route path="/dashboard/livre/:id" element={
          <RouteProtegee>
            <DetailLivrePage />
          </RouteProtegee>
        } />
        <Route path="/dashboard/panier" element={
          <RouteProtegee>
            <DashboardPanierPage />
          </RouteProtegee>
        } />
        <Route path="/dashboard/paiement" element={
          <RouteProtegee>
            <PaiementPage />
          </RouteProtegee>
        } />
        <Route path="/dashboard/bibliotheque" element={
          <RouteProtegee>
            <BibliothequePage />
          </RouteProtegee>
        } />
        <Route path="/dashboard/historique" element={
          <RouteProtegee>
            <HistoriquePage />
          </RouteProtegee>
        } />
        <Route path="/dashboard/profil" element={
          <RouteProtegee>
            <ProfilPage />
          </RouteProtegee>
        } />
        <Route path="/dashboard/parametres" element={
          <RouteProtegee>
            <ParametresPage />
          </RouteProtegee>
        } />
        
        {/* Dashboard administrateur (protégé + rôle admin) */}
        <Route path="/admin" element={
          <RouteAdmin>
            <DashboardAdminPage />
          </RouteAdmin>
        } />
        <Route path="/admin/livres" element={
          <RouteAdmin>
            <GestionLivresPage />
          </RouteAdmin>
        } />
        <Route path="/admin/utilisateurs" element={
          <RouteAdmin>
            <GestionUtilisateursPage />
          </RouteAdmin>
        } />
        <Route path="/admin/commandes" element={
          <RouteAdmin>
            <GestionCommandesPage />
          </RouteAdmin>
        } />
        <Route path="/admin/collections" element={
          <RouteAdmin>
            <GestionCollectionsPage />
          </RouteAdmin>
        } />
        <Route path="/admin/avis" element={
          <RouteAdmin>
            <GestionAvisPage />
          </RouteAdmin>
        } />
        <Route path="/admin/statistiques" element={
          <RouteAdmin>
            <StatistiquesPage />
          </RouteAdmin>
        } />
      </Routes>
    </Router>
  );
}

export default App;