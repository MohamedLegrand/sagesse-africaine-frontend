import api from './api';

const panierService = {
  getTotalPanier: async () => {
    const response = await api.get('/panier/total');
    return response.data;
  },
};

export default panierService;
