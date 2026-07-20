import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import commandesService from '../services/commandesService';

const extraireNomFichier = (contentDisposition, commandeId) => {
  const match = /filename="?([^"]+)"?/i.exec(contentDisposition || '');
  return match?.[1] || `facture-${commandeId}.pdf`;
};

const lireDetailErreur = async (error) => {
  const data = error.response?.data;
  if (data instanceof Blob) {
    try {
      const json = JSON.parse(await data.text());
      return json.detail;
    } catch {
      return null;
    }
  }
  return error.response?.data?.detail;
};

const useTelechargerFacture = () => {
  const [commandeEnCours, setCommandeEnCours] = useState(null);
  const navigate = useNavigate();

  const telecharger = async (commandeId) => {
    setCommandeEnCours(commandeId);
    try {
      const response = await commandesService.telechargerFacture(commandeId);
      const nomFichier = extraireNomFichier(response.headers?.['content-disposition'], commandeId);

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const lien = document.createElement('a');
      lien.href = url;
      lien.setAttribute('download', nomFichier);
      document.body.appendChild(lien);
      lien.click();
      lien.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      const statut = error.response?.status;
      const detail = await lireDetailErreur(error);

      if (statut === 400) {
        toast.error(detail || 'Facture indisponible : commande non payée');
      } else if (statut === 401) {
        toast.error('Votre session a expiré, veuillez vous reconnecter');
        navigate('/connexion');
      } else if (statut === 403) {
        toast.error("Vous n'êtes pas autorisé à télécharger cette facture");
      } else if (statut === 404) {
        toast.error('Commande introuvable');
      } else {
        toast.error(detail || 'Erreur lors du téléchargement de la facture');
      }
    } finally {
      setCommandeEnCours(null);
    }
  };

  return { telecharger, commandeEnCours };
};

export default useTelechargerFacture;
