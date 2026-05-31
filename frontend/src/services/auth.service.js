// Authentication service
// Handles all authentication-related API calls

import api from './api';

export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    console.log('Register response:', response.data);

    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    console.log("login...", response.data);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  // Get current user
  getMe: async () => {

    const response = await api.get('/api/auth/me');

    return response.data;
  },

  // Request password reset
  forgotPassword: async (email) => {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  // Verify reset token
  verifyResetToken: async (email, token) => {
    const response = await api.post('/api/auth/verify-reset-token', { email, token });
    return response.data;
  },

  // Reset password with token
  resetPassword: async (email, token, newPassword) => {
    const response = await api.post('/api/auth/reset-password', { email, token, newPassword });
    return response.data;
  },
};

