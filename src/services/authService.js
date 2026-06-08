import api from './api';

const authService = {
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // On nettoie le localStorage même si le backend échoue
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_role');
    }
  },

  oublierMotDePasse: async (email) => {
    const response = await api.post('/auth/oublier-mot-de-passe', { email });
    return response.data;
  },

  reinitialiserMotDePasse: async (token, nouveau_mot_de_passe) => {
    const response = await api.post('/auth/reinitialiser-mot-de-passe', {
      token,
      nouveau_mot_de_passe,
    });
    return response.data;
  },
};

export default authService;
