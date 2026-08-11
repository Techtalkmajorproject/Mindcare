const fs = require('fs');
const path = require('path');

const files = {
    'src/types/index.ts': `export interface User { id: string; email: string; name: string; role: string; }
export interface Child { id: string; age: number; sex: 'Male'|'Female'|'Other'; createdAt: string; }
export interface ScreeningSession { id: string; childId: string; date: string; status: 'Active'|'Completed'; }
export interface DrawingData { fileBlob: Blob; timestamp: number; }
export interface DrawingAnalysis { dominantEmotion: string; distribution: Record<string, number>; confidence: number; quality: number; modelVersion: string; }
export interface FacialObservation { videoBlob: Blob; duration: number; }
export interface FacialAnalysis { dominantEmotion: string; distribution: Record<string, number>; observationDuration: number; framesAnalyzed: number; confidence: number; quality: number; modelVersion: string; }
export interface ContextData { notes: string; }
export interface AnxietyIndicator { level: 'Low'|'Moderate'|'Elevated'|'High'|'Unavailable'; confidence: number; quality: number; modelVersion: string; }
export interface FusionResult { consistency: 'High'|'Moderate'|'Low'|'Unavailable'; indicator: AnxietyIndicator; }
export interface ScreeningResult { drawing: DrawingAnalysis | null; facial: FacialAnalysis | null; fusion: FusionResult | null; status: string; }
export interface Report { id: string; screeningId: string; status: 'Draft'|'Pending Review'|'Reviewed'|'Approved'; notes: string; recommendation: string; priority: string; }`,

    'src/services/api.ts': `import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const apiClient = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } });
`,

    'src/services/auth.service.ts': `import { apiClient } from './api';
export const authService = {
  login: async (credentials: any) => apiClient.post('/auth/login', credentials),
  logout: async () => apiClient.post('/auth/logout'),
  getCurrentUser: async () => apiClient.get('/auth/me'),
};`,

    'src/services/child.service.ts': `import { apiClient } from './api';
import { Child } from '../types';
export const childService = {
  getChildren: async () => apiClient.get<Child[]>('/children'),
  getChild: async (id: string) => apiClient.get<Child>(\`/children/\${id}\`),
  createChild: async (data: any) => apiClient.post<Child>('/children', data),
};`,

    'src/services/screening.service.ts': `import { apiClient } from './api';
import { ScreeningSession } from '../types';
export const screeningService = {
  createScreening: async (childId: string) => apiClient.post<ScreeningSession>('/screenings', { childId }),
  getScreening: async (id: string) => apiClient.get<ScreeningSession>(\`/screenings/\${id}\`),
  uploadDrawing: async (id: string, formData: FormData) => apiClient.post(\`/screenings/\${id}/drawing\`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadFacialObservation: async (id: string, formData: FormData) => apiClient.post(\`/screenings/\${id}/facial-observation\`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  submitContext: async (id: string, data: any) => apiClient.post(\`/screenings/\${id}/context\`, data),
};`,

    'src/services/analysis.service.ts': `import { apiClient } from './api';
import { ScreeningResult } from '../types';
export const analysisService = {
  startAnalysis: async (id: string) => apiClient.post(\`/screenings/\${id}/analyze\`),
  getAnalysisStatus: async (id: string) => apiClient.get(\`/screenings/\${id}/analysis-status\`),
  getResults: async (id: string) => apiClient.get<ScreeningResult>(\`/screenings/\${id}/results\`),
};`,

    'src/services/report.service.ts': `import { apiClient } from './api';
import { Report } from '../types';
export const reportService = {
  getReport: async (id: string) => apiClient.get<Report>(\`/screenings/\${id}/report\`),
  updateReport: async (id: string, data: any) => apiClient.put<Report>(\`/screenings/\${id}/report\`, data),
  approveReport: async (id: string) => apiClient.post(\`/screenings/\${id}/report/approve\`),
  downloadReportPdf: async (id: string) => apiClient.get(\`/screenings/\${id}/report/pdf\`, { responseType: 'blob' }),
};`
};

Object.entries(files).forEach(([filepath, content]) => {
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, content);
});
console.log('UI Generator step 5 complete.');
