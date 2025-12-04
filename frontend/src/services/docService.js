import api from './api';

export const docService = {
    upload: async (applicationId, docType, file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('docType', docType);

        const response = await api.post(`/applications/${applicationId}/documents`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    list: async (applicationId) => {
        const response = await api.get(`/applications/${applicationId}/documents`);
        return response.data;
    },

    getSummary: async (applicationId) => {
        const response = await api.get(`/applications/${applicationId}/documents/summary`);
        return response.data;
    },

    // --- NEW: Staff Verification ---
    verify: async (applicationId, docId, status) => {
        // status must be "VERIFIED" or "REJECTED"
        // URL: /api/applications/{appId}/documents/{docId}/status?status={status}
        const response = await api.patch(
            `/applications/${applicationId}/documents/${docId}/status?status=${status}`
        );
        return response.data;
    },
    getPreview: async (applicationId, docId) => {
        const response = await api.get(`/applications/${applicationId}/documents/${docId}/preview`, {
            responseType: 'blob', // Important: tells Axios to expect binary data
        });
        return response.data;
    }
};