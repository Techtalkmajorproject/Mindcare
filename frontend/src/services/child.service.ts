import { apiClient } from './api';
import { Child, ScreeningSession } from '../types';
export const childService = {
  getChildren: async () => apiClient.get<Child[]>('/children'),
  getChild: async (id: string) => apiClient.get<Child>(`/children/${id}`),
  createChild: async (data: any) => apiClient.post<{ success: boolean, childId: string }>('/children', data),
  updateChild: async (id: string, data: any) => apiClient.put(`/children/${id}`, data),
  deleteChild: async (id: string) => apiClient.delete(`/children/${id}`),
  getChildScreenings: async (id: string) => apiClient.get<ScreeningSession[]>(`/children/${id}/screenings`),
};