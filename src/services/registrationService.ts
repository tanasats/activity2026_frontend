import axiosInstance from '../lib/axiosInstance';

export const registrationService = {
  /**
   * Get all participants for an activity (Management)
   */
  getParticipants: async (activityId: string | number) => {
    const response = await axiosInstance.get(`/activities/${activityId}/participants`);
    return response.data;
  },

  /**
   * Update participant status (Attendance/Evaluation)
   */
  updateParticipantStatus: async (registrationId: string | number, data: { isAttended?: boolean, evaluationNote?: string, evaluationResult?: string }) => {
    const response = await axiosInstance.patch(`/activities/participants/${registrationId}/status`, data);
    return response.data;
  },

  /**
   * Get Excel export URL
   */
  getRegistrationById: async (id: string | number) => {
    const response = await axiosInstance.get(`/activities/registrations/${id}`);
    return response.data;
  },

  checkIn: async (activityId: string | number, qrHash: string) => {
    const response = await axiosInstance.post(`/activities/${activityId}/check-in`, { qrHash });
    return response.data;
  },

  getImages: async (registrationId: string | number) => {
    const response = await axiosInstance.get(`/activities/registrations/${registrationId}/images`);
    return response.data;
  },

  uploadImage: async (registrationId: string | number, formData: FormData) => {
    const response = await axiosInstance.post(`/activities/registrations/${registrationId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteImage: async (imageId: string | number) => {
    const response = await axiosInstance.delete(`/activities/registrations/images/${imageId}`);
    return response.data;
  },

  getExportUrl: (activityId: string | number) => {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    return `${baseURL}/activities/${activityId}/participants/export`;
  }
};
