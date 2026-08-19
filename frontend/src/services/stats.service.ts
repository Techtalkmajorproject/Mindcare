import { apiClient } from './api';

export const statsService = {
    getDashboardStats: async () => apiClient.get<{
        totalChildren: number;
        activeScreenings: number;
        pendingReviews: number;
        completedReports: number;
        recentScreenings: any[];
    }>('/stats')
};
