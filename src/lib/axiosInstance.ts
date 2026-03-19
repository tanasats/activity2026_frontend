import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
});

// Add a request interceptor to include the token
axiosInstance.interceptors.request.use(
  (config) => {
    // In a real TS environment, we might need to handle types for config
    const token = useAuthStore.getState().token;
    if (token) {
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
