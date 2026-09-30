import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mahaconnect_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to format errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';
    
    // Auto logout on 401 token expiration (if not on login/register)
    if (error.response?.status === 401) {
      const isAuthRoute =
        window.location.pathname.includes('/login') ||
        window.location.pathname.includes('/register');
      if (!isAuthRoute && localStorage.getItem('mahaconnect_token')) {
        localStorage.removeItem('mahaconnect_token');
        localStorage.removeItem('mahaconnect_user');
        window.location.href = '/login?session_expired=true';
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
