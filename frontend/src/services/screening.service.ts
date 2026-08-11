import { apiClient } from './api';
import { ScreeningSession } from '../types';
export const screeningService = {
  createScreening: async (childId: string) => apiClient.post<ScreeningSession>('/screenings', { childId }),
  getScreening: async (id: string) => apiClient.get<ScreeningSession>(`/screenings/${id}`),
  uploadDrawing: async (id: string, formData: FormData) => apiClient.post(`/screenings/${id}/drawing`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadFacialObservation: async (id: string, formData: FormData) => apiClient.post(`/screenings/${id}/facial-observation`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  submitContext: async (id: string, data: any) => apiClient.post(`/screenings/${id}/context`, data),
};