import api from './api';

export const msgService = {
  getComments: async (appId) => {
    const response = await api.get(`/applications/${appId}/comments`);
    return response.data;
  },
  postComment: async (appId, message) => {
    const response = await api.post(`/applications/${appId}/comments`, { message });
    return response.data;
  }
};