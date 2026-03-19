import axiosInstance from '../lib/axiosInstance';

export const adminService = {
  approveActivity: async (id: string | number) => {
    const response = await axiosInstance.patch(`/activities/${id}/approve`);
    return response.data;
  },
};
