import { apiClient } from './api';
import { ScreeningResult } from '../types';
export const analysisService = {
  startAnalysis: async (id: string) => apiClient.post(`/screenings/${id}/analyze`),
  getAnalysisStatus: async (id: string) => apiClient.get(`/screenings/${id}/analysis-status`),
  getResults: async (id: string) => apiClient.get<ScreeningResult>(`/screenings/${id}/results`),
};