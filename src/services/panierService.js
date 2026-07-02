import api from './api';

const panierService = {
  getTotalPanier: async () => {
    const response = await api.get('/panier/total');
    return response.data;
  },

  commander: async () => {
    const response = await api.post('/panier/commander');
    return response.data;
  },
};

export default panierService;
