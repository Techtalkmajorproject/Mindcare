import { apiClient } from './api';
import { ScreeningSession } from '../types';
export const screeningService = {
  createScreening: async (childId: string) => apiClient.post<{ success: boolean, screeningId: string }>('/screenings', { childId }),
  getScreening: async (id: string) => apiClient.get<ScreeningSession>(`/screenings/${id}`),
  updateStatus: async (id: string, status: string) => apiClient.patch(`/screenings/${id}/status`, { status }),
  uploadDrawing: async (id: string, formData: FormData) => apiClient.post(`/screenings/${id}/drawing`, formData),
  uploadFacialObservation: async (id: string, formData: FormData) => apiClient.post(`/screenings/${id}/facial-observation`, formData),
  submitContext: async (id: string, data: any) => apiClient.post(`/screenings/${id}/context`, data),
};