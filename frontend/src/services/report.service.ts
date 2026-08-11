import { apiClient } from './api';
import { Report } from '../types';
export const reportService = {
  getReport: async (id: string) => apiClient.get<Report>(`/screenings/${id}/report`),
  updateReport: async (id: string, data: any) => apiClient.put<Report>(`/screenings/${id}/report`, data),
  approveReport: async (id: string) => apiClient.post(`/screenings/${id}/report/approve`),
  downloadReportPdf: async (id: string) => apiClient.get(`/screenings/${id}/report/pdf`, { responseType: 'blob' }),
};