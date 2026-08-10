import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import commandesService from '../services/commandesService';
import i18n from '../i18n';
import { traduireErreurApi } from '../services/erreurApi';

const extraireNomFichier = (contentDisposition, commandeId) => {
  const match = /filename="?([^"]+)"?/i.exec(contentDisposition || '');
  return match?.[1] || `facture-${commandeId}.pdf`;
};

// Le detail JSON arrive dans un Blob (la requête est faite en responseType
// blob pour recevoir le PDF) : il faut le reconstituer avant de le passer à
// traduireErreurApi, qui attend error.response.data.detail directement.
const reconstituerErreurAvecDetailJson = async (error) => {
  const data = error.response?.data;
  if (!(data instanceof Blob)) return error;
  try {
    const detail = JSON.parse(await data.text()).detail;
    return { ...error, response: { ...error.response, data: { detail } } };
  } catch {
    return error;
  }
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
      const erreurReconstituee = await reconstituerErreurAvecDetailJson(error);

      if (statut === 400) {
        toast.error(traduireErreurApi(erreurReconstituee, 'FACTURE_ACHAT_NON_PAYE'));
      } else if (statut === 401) {
        toast.error(i18n.t('facture.sessionExpiree', { ns: 'commun' }));
        navigate('/connexion');
      } else if (statut === 403) {
        toast.error(i18n.t('facture.nonAutorise', { ns: 'commun' }));
      } else if (statut === 404) {
        toast.error(i18n.t('facture.achatIntrouvable', { ns: 'commun' }));
      } else {
        toast.error(traduireErreurApi(erreurReconstituee, 'facture.erreurTelechargement', 'commun'));
      }
    } finally {
      setCommandeEnCours(null);
    }
  };

  return { telecharger, commandeEnCours };
};

export default useTelechargerFacture;
