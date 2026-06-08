import api from './api';

const livresService = {
  getLivre: async (id) => {
    const response = await api.get(`/livres/${id}`);
    return response.data;
  },

  getLivresParCollection: async (collectionId, page = 1, taille = 10) => {
    const response = await api.get(`/livres/collection/${collectionId}`, {
      params: { page, taille },
    });
    return response.data;
  },
};

export default livresService;
