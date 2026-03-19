import axiosInstance from '../lib/axiosInstance';

export const reportService = {
  getDashboardData: async () => {
    const response = await axiosInstance.get('/reports/dashboard');
    return response.data;
  },

  getTranscript: async () => {
    const response = await axiosInstance.get('/reports/transcript');
    return response.data;
  },
};
