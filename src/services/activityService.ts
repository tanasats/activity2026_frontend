import axiosInstance from '../lib/axiosInstance';

export const activityService = {
  getAllPublic: async (params?: any) => {
    const response = await axiosInstance.get('/activities', { params });
    return response.data;
  },

  getManageActivities: async (params?: any) => {
    const response = await axiosInstance.get('/activities/manage', { params });
    return response.data;
  },

  getActivityById: async (id: string | number) => {
    const response = await axiosInstance.get(`/activities/${id}`);
    return response.data;
  },

  createActivity: async (data: any) => {
    // If data is FormData, headers will be set automatically by axios
    const response = await axiosInstance.post('/activities', data);
    return response.data;
  },
  
  updateActivity: async (id: string | number, data: any) => {
    const response = await axiosInstance.put(`/activities/${id}`, data);
    return response.data;
  },

  deleteActivity: async (id: string | number) => {
    const response = await axiosInstance.delete(`/activities/${id}`);
    return response.data;
  },

  register: async (id: string | number) => {
    const response = await axiosInstance.post(`/activities/${id}/register`);
    return response.data;
  },

  updateVisibility: async (id: string | number, publishStatus: string) => {
    const response = await axiosInstance.patch(`/activities/${id}/visibility`, { publishStatus });
    return response.data;
  },

  updateStatus: async (id: string | number, status: string) => {
    const response = await axiosInstance.patch(`/activities/${id}/status`, { status });
    return response.data;
  },

  updateAttachmentVisibility: async (attachmentId: string | number, isPublished: boolean) => {
    const response = await axiosInstance.patch(`/activities/attachments/${attachmentId}/visibility`, { isPublished });
    return response.data;
  },

  deleteAttachment: async (attachmentId: string | number) => {
    const response = await axiosInstance.delete(`/activities/attachments/${attachmentId}`);
    return response.data;
  }
};
