import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we have a response from the server (e.g. 400, 401, 500)
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        // Handle unauthorized (token expired/invalid)
        localStorage.removeItem('token');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/signup' && window.location.pathname !== '/') {
          toast.error('Session expired. Please log in again.');
          window.location.href = '/login';
        }
      } else {
        // Show toast for other errors if it has a message
        if (data && data.message && status >= 500) {
           toast.error(data.message || 'Server error occurred');
        } else if (data && data.message && status >= 400 && status !== 401 && status !== 404) {
           toast.error(data.message);
        }
      }
    } else if (error.request) {
      // Network error (no response received)
      console.error('Network Error:', error.message);
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
