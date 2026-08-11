import api from './api';
import type { ScreeningSession } from '../types/screening';

export const screeningService = {
    createScreening: async (childId: string): Promise<ScreeningSession> => {
        const { data } = await api.post<ScreeningSession>('/screenings', { childId });
        return data;
    },

    getScreening: async (id: string): Promise<ScreeningSession> => {
        const { data } = await api.get<ScreeningSession>(`/screenings/${id}`);
        return data;
    },

    uploadDrawing: async (id: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await api.post(`/screenings/${id}/drawing`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },

    uploadFacialObservation: async (id: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await api.post(`/screenings/${id}/facial`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },

    submitContext: async (id: string, payload: any) => {
        const { data } = await api.post(`/screenings/${id}/context`, payload);
        return data;
    },

    analyzeScreening: async (id: string) => {
        const { data } = await api.post(`/screenings/${id}/analyze`);
        return data;
    },

    getResults: async (id: string) => {
        const { data } = await api.get(`/screenings/${id}/results`);
        return data;
    }
};
