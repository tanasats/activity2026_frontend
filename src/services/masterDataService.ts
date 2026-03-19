import axiosInstance from '../lib/axiosInstance';

export const masterDataService = {
  getAgencies: async () => {
    const response = await axiosInstance.get('/master/agencies');
    return response.data;
  },

  getActivityTypes: async () => {
    const response = await axiosInstance.get('/master/types');
    return response.data;
  },

  getSkills: async () => {
    const response = await axiosInstance.get('/master/skills');
    return response.data;
  },

  getBudgetSources: async () => {
    const response = await axiosInstance.get('/master/budget-sources');
    return response.data;
  },

  getFaculties: async () => {
    const response = await axiosInstance.get('/master/faculties');
    return response.data;
  },
};
