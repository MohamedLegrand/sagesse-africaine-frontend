import api from './api';

const livresService = {
  getLivres: async (page = 1, taille = 100, recherche = '') => {
    const params = { page, taille };
    if (recherche && recherche.trim()) {
      params.recherche = recherche.trim();
    }
    const response = await api.get('/livres/', { params });
    return response.data;
  },

  // Réservé à l'admin : inclut aussi les livres non publiés (brouillons)
  getLivresAdmin: async (page = 1, taille = 100, recherche = '') => {
    const params = { page, taille };
    if (recherche && recherche.trim()) {
      params.recherche = recherche.trim();
    }
    const response = await api.get('/livres/admin', { params });
    return response.data;
  },

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
