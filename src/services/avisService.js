import api from './api';

const avisService = {
  creerAvis: async (livreId, note, commentaire) => {
    const response = await api.post('/avis/', {
      livre_id: livreId,
      note,
      commentaire,
    });
    return response.data;
  },

  getAvisLivre: async (livreId, page = 1, taille = 10) => {
    const response = await api.get(`/avis/livre/${livreId}`, {
      params: { page, taille },
    });
    return response.data;
  },
};

export default avisService;
