import axiosInstance from '../lib/axiosInstance';

export const reportService = {
  getDashboardData: async (year?: number) => {
    const response = await axiosInstance.get('/reports/dashboard', {
      params: { year }
    });
    return response.data;
  },

  getTranscript: async () => {
    const response = await axiosInstance.get('/reports/transcript');
    return response.data;
  },
};
