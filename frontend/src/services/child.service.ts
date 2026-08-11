import { apiClient } from './api';
import { Child } from '../types';
export const childService = {
  getChildren: async () => apiClient.get<Child[]>('/children'),
  getChild: async (id: string) => apiClient.get<Child>(`/children/${id}`),
  createChild: async (data: any) => apiClient.post<Child>('/children', data),
};