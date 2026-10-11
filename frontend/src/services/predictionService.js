import api from './api';

export const predictionService = {
  predict: async (data) => {
    const response = await api.post('/prediction/predict', data);
    return response.data;
  },

  calculateCostEstimate: async (data) => {
    const response = await api.post('/prediction/cost-estimate', data);
    return response.data;
  },

  getRecommendations: async (params = {}) => {
    const response = await api.get('/prediction/recommendations', { params });
    return response.data;
  }
};
