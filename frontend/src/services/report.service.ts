import { apiClient } from './api';
import { Report } from '../types';
export const reportService = {
  createReport: async (data: { childId: string, screeningId: string }) => apiClient.post<{ success: boolean, reportId: string }>('/reports', data),
  getReport: async (id: string) => apiClient.get<Report>(`/reports/${id}`),
  updateReport: async (id: string, data: any) => apiClient.put<Report>(`/reports/${id}`, data),
  approveReport: async (id: string) => apiClient.post(`/reports/${id}/approve`),
  downloadReportPdf: async (id: string) => apiClient.get(`/reports/${id}/pdf`, { responseType: 'blob' }),
};