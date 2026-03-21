import axiosInstance from '../lib/axiosInstance';

export const activityImageService = {
  /**
   * Get all photos for an activity
   */
  getImages: async (activityId: string | number) => {
    const response = await axiosInstance.get(`/activities/${activityId}/images`);
    return response.data;
  },

  /**
   * Upload an activity photo
   */
  uploadImage: async (activityId: string | number, file: File, caption?: string) => {
    const formData = new FormData();
    formData.append('image', file);
    if (caption) formData.append('caption', caption);

    const response = await axiosInstance.post(`/activities/${activityId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  /**
   * Delete an activity photo
   */
  deleteImage: async (imageId: string | number) => {
    const response = await axiosInstance.delete(`/activities/images/${imageId}`);
    return response.data;
  }
};
