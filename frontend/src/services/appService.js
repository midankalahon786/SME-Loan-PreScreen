import api from './api';

export const appService = {
    // Get all applications (Applicant sees theirs, Staff sees all)
    getAll: async () => {
        const response = await api.get('/applications');
        return response.data;
    },

    // Create a new application
    create: async (applicationData) => {
        const response = await api.post('/applications', applicationData);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`/applications/${id}`);
    },

    // Get single application details
    getById: async (id) => {
        const response = await api.get(`/applications/${id}`);
        return response.data;
    },

    // Run Pre-Screen Check (Staff Only)
    runPreScreen: async (id) => {
        const response = await api.get(`/applications/${id}/pre-screen`);
        return response.data;
    }
};