import api from './api';
import { API_BASE_URL } from '../utils/constants';

export const reportService = {
  getAllReports: async () => {
    const response = await api.get('/reports');
    return response.data;
  },

  generateReport: async (type = 'MONTHLY') => {
    const response = await api.post('/reports/generate', null, { params: { type } });
    return response.data;
  },

  downloadPdf: async (type = 'MONTHLY') => {
    const response = await api.get('/reports/export/pdf', {
      params: { type },
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Energy_Audit_${type}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  downloadExcel: async (type = 'MONTHLY') => {
    const response = await api.get('/reports/export/excel', {
      params: { type },
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Energy_Audit_${type}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};
