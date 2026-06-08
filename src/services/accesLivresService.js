import api from './api';

const accesLivresService = {
  verifierAcces: async (livreId) => {
    const response = await api.get(`/acces-livres/verifier/${livreId}`);
    return response.data;
  },

  getTousAcces: async (page = 1, taille = 10) => {
    const response = await api.get('/acces-livres/', { params: { page, taille } });
    return response.data;
  },

  revoquerAcces: async (accesId) => {
    const response = await api.delete(`/acces-livres/${accesId}`);
    return response.data;
  },
};

export default accesLivresService;
