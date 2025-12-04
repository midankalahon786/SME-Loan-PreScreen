import axios from 'axios';

const BASE_URL = import.meta.env.MODE === 'development'
    ? 'http://localhost:8081/api'
    : '/api';

const api = axios.create({
    baseURL: BASE_URL,
});

// Request Interceptor: Auto-attach JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;