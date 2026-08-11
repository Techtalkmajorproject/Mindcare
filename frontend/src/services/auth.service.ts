import { apiClient } from './api';
export const authService = {
  login: async (credentials: any) => apiClient.post('/auth/login', credentials),
  logout: async () => apiClient.post('/auth/logout'),
  getCurrentUser: async () => apiClient.get('/auth/me'),
};