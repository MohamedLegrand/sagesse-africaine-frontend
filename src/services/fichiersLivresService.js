import api from './api';

const fichiersLivresService = {
  listerFichiers: async (livreId) => {
    const response = await api.get(`/fichiers-livres/${livreId}`);
    return response.data;
  },

  // Lecture en ligne : illimitée, jamais filigranée, ne consomme pas le quota de téléchargement.
  lire: async (livreId, fichierId) => {
    const response = await api.get(`/fichiers-livres/${livreId}/telecharger/${fichierId}`, {
      params: { mode: 'lecture' },
      responseType: 'blob',
    });
    return response.data;
  },

  // Téléchargement explicite : soumis au quota, filigrané (PDF) avec l'email de l'acheteur.
  telecharger: async (livreId, fichierId) => {
    const response = await api.get(`/fichiers-livres/${livreId}/telecharger/${fichierId}`, {
      params: { mode: 'telechargement' },
      responseType: 'blob',
    });
    return response.data;
  },
};

export default fichiersLivresService;
