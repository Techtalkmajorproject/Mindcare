import axios from 'axios';
import { auth } from '../firebase/config';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const apiClient = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } });

apiClient.interceptors.request.use(async (config) => {
    // Let the browser generate the multipart boundary. The instance default is
    // JSON, which prevents Multer from parsing FormData if it reaches the API.
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
        config.headers.delete('Content-Type');
    }

    // Firebase restores persisted sessions asynchronously. Wait for that process so
    // the first protected request is not sent without an Authorization header.
    await auth.authStateReady();

    if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
