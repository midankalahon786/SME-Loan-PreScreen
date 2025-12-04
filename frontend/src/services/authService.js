import api from './api';

export const authService = {
    login: async (username, password) => {
        const response = await api.post('/auth/login', { id: username, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    register: async (userData) => {
        // Now returns { message, userId }
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    // New function to recover ID
    fetchUserId: async (email) => {
        const response = await api.post('/auth/forgot-id', { email });
        return response.data; // Returns { userId, fullName }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};