
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced retry logic
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 unauthorized - redirect to login
    // But don't redirect for /auth/me requests (used to check auth status)
    if (error.response?.status === 401) {
      const isAuthCheck = originalRequest.url?.includes('/auth/me');

      // Only redirect if not checking auth status and not already on login page
      if (!isAuthCheck && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // Enhanced retry logic for network errors or 5xx errors
    const isNetworkError = !error.response;
    const isServerError = error.response?.status >= 500 && error.response?.status < 600;
    const isRetryableError = isNetworkError || isServerError;
    const maxRetries = 3;
    const retryCount = originalRequest._retryCount || 0;

    if (
      isRetryableError &&
      !originalRequest._retry &&
      retryCount < maxRetries
    ) {
      originalRequest._retry = true;
      originalRequest._retryCount = retryCount + 1;

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, retryCount) * 1000;

      // Log retry attempt (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `Retrying request (${retryCount + 1}/${maxRetries}): ${originalRequest.url}`
        );
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Reset retry flag to allow retry
      originalRequest._retry = false;

      return api(originalRequest);
    }

    // If retries exhausted, show user-friendly error message
    if (isRetryableError && retryCount >= maxRetries) {
      const errorMessage = isNetworkError
        ? 'Network error. Please check your connection and try again.'
        : 'Server error. Please try again later.';

      // You can dispatch a toast notification here if needed
      console.error('Request failed after retries:', errorMessage);
    }

    return Promise.reject(error);
  }
);

export default api;

