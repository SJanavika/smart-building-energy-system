import api from './api';

export const dashboardService = {
  getSummary: async () => {
    const response = await api.get('/dashboard/summary');
    return response.data;
  },

  getDailyTrends: async () => {
    const response = await api.get('/dashboard/trends/daily');
    return response.data;
  },

  getWeeklyTrends: async () => {
    const response = await api.get('/dashboard/trends/weekly');
    return response.data;
  },

  getMonthlyTrends: async () => {
    const response = await api.get('/dashboard/trends/monthly');
    return response.data;
  },

  getDeviceBreakdown: async () => {
    const response = await api.get('/dashboard/breakdown/devices');
    return response.data;
  }
};
