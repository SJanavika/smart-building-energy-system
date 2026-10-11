import api from './api';

export const energyService = {
  getRecords: async (params = {}) => {
    const response = await api.get('/energy', { params });
    return response.data;
  },

  getRecordById: async (id) => {
    const response = await api.get(`/energy/${id}`);
    return response.data;
  },

  createRecord: async (data) => {
    const response = await api.post('/energy', data);
    return response.data;
  },

  updateRecord: async (id, data) => {
    const response = await api.put(`/energy/${id}`, data);
    return response.data;
  },

  deleteRecord: async (id) => {
    const response = await api.delete(`/energy/${id}`);
    return response.data;
  },

  getDistinctDevices: async () => {
    const response = await api.get('/energy/devices');
    return response.data;
  },

  getDistinctFloors: async () => {
    const response = await api.get('/energy/floors');
    return response.data;
  }
};
