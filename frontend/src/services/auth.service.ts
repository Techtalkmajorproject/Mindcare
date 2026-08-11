import api from './api';
import type { AuthResponse } from '../types/auth';

export const authService = {
    login: async (credentials: any): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>('/auth/login', credentials);
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    getCurrentUser: async () => {
        const { data } = await api.get('/auth/me');
        return data;
    }
};
