import axiosInstance from '../lib/axiosInstance';

export const userService = {
  updateProfile: async (data: { firstname?: string, lastname?: string, username?: string }) => {
    const response = await axiosInstance.put('/users/profile', data);
    return response.data;
  },

  updateProfileImage: async (formData: FormData) => {
    const response = await axiosInstance.post('/users/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Admin Management
  getUsers: async (params: any) => {
    const response = await axiosInstance.get('/users', { params });
    return response.data;
  },
  adminUpdateUser: async (id: number, data: any) => {
    const response = await axiosInstance.put(`/users/${id}`, data);
    return response.data;
  },
  adminDeleteUser: async (id: number) => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  },
};
