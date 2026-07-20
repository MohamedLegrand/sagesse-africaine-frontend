import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {
  ArrowLeft, ChevronLeft, ChevronRight, Bookmark, ZoomIn, ZoomOut, Loader2, BookX,
} from 'lucide-react';
import toast from 'react-hot-toast';
import livresService from '../../../services/livresService';
import accesLivresService from '../../../services/accesLivresService';
import fichiersLivresService from '../../../services/fichiersLivresService';
import progressionService from '../../../services/progressionService';
import signetsService from '../../../services/signetsService';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const DELAI_SAUVEGARDE_MS = 1000;

const LecteurLivrePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [livre, setLivre] = useState(null);
  const [fichier, setFichier] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [signets, setSignets] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [echelle, setEchelle] = useState(1.1);
  const [statut, setStatut] = useState('chargement'); // chargement | pret | sans-acces | sans-fichier | erreur
  const [ajoutSignetEnCours, setAjoutSignetEnCours] = useState(false);

  const delaiSauvegarde = useRef(null);

  useEffect(() => {
    let annule = false;

    const charger = async () => {
      setStatut('chargement');
      try {
        await accesLivresService.verifierAcces(id);
      } catch {
        if (!annule) {
          toast.error("Vous n'avez pas accès à ce livre");
          navigate(`/dashboard/livre/${id}`);
        }
        return;
      }

      try {
        const [livreData, fichiersData, progressionData, signetsData] = await Promise.all([
          livresService.getLivre(id),
          fichiersLivresService.listerFichiers(id).then((d) => d.fichiers || []),
          progressionService.getProgressionLivre(id).catch(() => null),
          signetsService.getMesSignets(id).then((r) => r.signets || []).catch(() => []),
        ]);

        if (annule) return;

        if (fichiersData.length === 0) {
          setStatut('sans-fichier');
          return;
        }

        const premierFichier = fichiersData[0];
        const blob = await fichiersLivresService.telecharger(id, premierFichier.id);
        const buffer = await blob.arrayBuffer();

        if (annule) return;

        setLivre(livreData);
        setFichier(premierFichier);
        setPdfFile({ data: buffer });
        setSignets(signetsData);
        setPageNumber(progressionData?.page_actuelle || 1);
        setStatut('pret');
      } catch (error) {
        console.error('Erreur chargement lecteur:', error);
        if (!annule) setStatut('erreur');
      }
    };

    charger();
    return () => { annule = true; };
  }, [id, navigate]);

  const sauvegarderProgression = useCallback((page, total) => {
    if (delaiSauvegarde.current) clearTimeout(delaiSauvegarde.current);
    delaiSauvegarde.current = setTimeout(() => {
      const pourcentage = total > 0 ? Math.round((page / total) * 100) : 0;
      progressionService.sauvegarderProgression({
        livre_id: id,
        format: fichier?.format || 'pdf',
        page_actuelle: page,
        total_pages: total,
        pourcentage,
      }).catch(() => {});
    }, DELAI_SAUVEGARDE_MS);
  }, [id, fichier]);

  useEffect(() => () => {
    if (delaiSauvegarde.current) clearTimeout(delaiSauvegarde.current);
  }, []);

  const allerALaPage = (page) => {
    if (!numPages) return;
    const pageValide = Math.min(Math.max(page, 1), numPages);
    setPageNumber(pageValide);
    sauvegarderProgression(pageValide, numPages);
  };

  const handleLoadSuccess = ({ numPages: total }) => {
    setNumPages(total);
    setPageNumber((page) => Math.min(page, total));
  };

  const ajouterSignet = async () => {
    setAjoutSignetEnCours(true);
    try {
      const signet = await signetsService.creerSignet({
        livre_id: id,
        format: fichier?.format || 'pdf',
        numero_page: pageNumber,
        note: null,
      });
      setSignets((prev) => [...prev, signet]);
      toast.success(`Signet ajouté à la page ${pageNumber}`);
    } catch {
      toast.error("Erreur lors de l'ajout du signet");
    } finally {
      setAjoutSignetEnCours(false);
    }
  };

  const pdfFileMemo = useMemo(() => pdfFile, [pdfFile]);

  if (statut === 'chargement') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-brown-950 text-cream-100">
        <Loader2 className="w-10 h-10 animate-spin text-terra-400" />
        <p className="text-sm text-brown-300">Chargement du livre...</p>
      </div>
    );
  }

  if (statut === 'sans-fichier' || statut === 'erreur') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-brown-950 text-cream-100 px-4 text-center">
        <BookX className="w-12 h-12 text-terra-400" />
        <p>
          {statut === 'sans-fichier'
            ? "Aucun fichier n'est disponible pour ce livre."
            : "Une erreur est survenue lors du chargement du livre."}
        </p>
        <Link to={`/dashboard/livre/${id}`} className="text-terra-300 hover:text-terra-200 underline text-sm">
          Retour à la fiche du livre
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brown-950 flex flex-col">
      {/* Barre supérieure */}
      <header className="flex items-center justify-between gap-3 px-4 py-3 bg-brown-900/90 backdrop-blur-sm border-b border-brown-800 sticky top-0 z-20">
        <button
          onClick={() => navigate(`/dashboard/livre/${id}`)}
          className="flex items-center gap-2 text-cream-200 hover:text-white transition text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Retour</span>
        </button>

        <h1 className="flex-1 text-center text-sm sm:text-base font-playfair font-semibold text-cream-100 truncate px-2">
          {livre?.titre}
        </h1>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setEchelle((e) => Math.max(0.6, +(e - 0.1).toFixed(1)))}
            className="p-2 rounded-lg text-cream-200 hover:bg-brown-800 transition"
            title="Réduire"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setEchelle((e) => Math.min(2, +(e + 0.1).toFixed(1)))}
            className="p-2 rounded-lg text-cream-200 hover:bg-brown-800 transition"
            title="Agrandir"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={ajouterSignet}
            disabled={ajoutSignetEnCours}
            className="p-2 rounded-lg text-cream-200 hover:bg-brown-800 transition disabled:opacity-50"
            title="Ajouter un signet à cette page"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Signets rapides */}
      {signets.length > 0 && (
        <div className="flex gap-2 overflow-x-auto px-4 py-2 bg-brown-900/60 border-b border-brown-800">
          {signets
            .slice()
            .sort((a, b) => a.numero_page - b.numero_page)
            .map((signet) => (
              <button
                key={signet.id}
                onClick={() => allerALaPage(signet.numero_page)}
                className="flex-shrink-0 flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-brown-800 text-cream-200 hover:bg-terra-600 transition"
              >
                <Bookmark className="w-3 h-3" />
                Page {signet.numero_page}
              </button>
            ))}
        </div>
      )}

      {/* Zone de lecture */}
      <main className="flex-1 overflow-auto flex justify-center py-6 px-4">
        <Document
          file={pdfFileMemo}
          onLoadSuccess={handleLoadSuccess}
          loading={<Loader2 className="w-8 h-8 animate-spin text-terra-400 mt-20" />}
          error={<p className="text-cream-200 mt-20">Impossible d'afficher ce PDF.</p>}
        >
          <Page
            pageNumber={pageNumber}
            scale={echelle}
            renderAnnotationLayer={false}
            className="shadow-2xl"
          />
        </Document>
      </main>

      {/* Navigation */}
      <footer className="flex items-center justify-center gap-4 px-4 py-3 bg-brown-900/90 backdrop-blur-sm border-t border-brown-800 sticky bottom-0">
        <button
          onClick={() => allerALaPage(pageNumber - 1)}
          disabled={pageNumber <= 1}
          className="p-2 rounded-lg text-cream-200 hover:bg-brown-800 transition disabled:opacity-30"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-sm text-cream-200">
          <input
            type="number"
            min={1}
            max={numPages || 1}
            value={pageNumber}
            onChange={(e) => allerALaPage(parseInt(e.target.value, 10) || 1)}
            className="w-14 bg-brown-800 border border-brown-700 rounded-lg text-center py-1 outline-none focus:border-terra-400"
          />
          <span>/ {numPages || '...'}</span>
        </div>

        <button
          onClick={() => allerALaPage(pageNumber + 1)}
          disabled={!numPages || pageNumber >= numPages}
          className="p-2 rounded-lg text-cream-200 hover:bg-brown-800 transition disabled:opacity-30"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
};

export default LecteurLivrePage;
