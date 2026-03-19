import axiosInstance from '../lib/axiosInstance';

export const authService = {
  login: async (email: string) => {
    const response = await axiosInstance.post('/auth/login', { email });
    return response.data;
  },

  // Other auth methods could go here
};
