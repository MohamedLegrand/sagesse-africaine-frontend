import React, { useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const ExtraitModal = ({ livre, onClose }) => {
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!livre?.extrait_url) return undefined;

    let annule = false;
    setChargement(true);
    setErreur(null);

    (async () => {
      try {
        const [{ renderAsync }, reponse] = await Promise.all([
          import('docx-preview'),
          fetch(livre.extrait_url),
        ]);
        if (!reponse.ok) throw new Error('Fichier introuvable');
        const blob = await reponse.blob();
        if (annule || !containerRef.current) return;
        containerRef.current.innerHTML = '';
        await renderAsync(blob, containerRef.current, containerRef.current, {
          className: 'docx',
          inWrapper: true,
          ignoreHeight: true,
        });
      } catch {
        if (!annule) setErreur("Impossible de charger l'extrait pour le moment.");
      } finally {
        if (!annule) setChargement(false);
      }
    })();

    return () => { annule = true; };
  }, [livre?.extrait_url]);

  if (!livre) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-100 flex-shrink-0">
          <h3 className="font-playfair font-bold text-amber-800 truncate pr-4">
            Extrait — {livre.titre}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition flex-shrink-0"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-gray-100 p-4 sm:p-8">
          {chargement && (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 text-sm">Chargement de l'extrait...</p>
            </div>
          )}
          {erreur && (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
              <p className="text-red-500 font-medium">{erreur}</p>
            </div>
          )}
          <div ref={containerRef} className={chargement || erreur ? 'hidden' : ''} />
        </div>
      </div>
    </div>
  );
};

export default ExtraitModal;
