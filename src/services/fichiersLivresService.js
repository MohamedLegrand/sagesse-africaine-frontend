import api from './api';

const fichiersLivresService = {
  listerFichiers: async (livreId) => {
    const response = await api.get(`/fichiers-livres/${livreId}`);
    return response.data;
  },

  telecharger: async (livreId, fichierId) => {
    const response = await api.get(`/fichiers-livres/${livreId}/telecharger/${fichierId}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default fichiersLivresService;
