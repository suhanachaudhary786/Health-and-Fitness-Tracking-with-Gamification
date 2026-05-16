// User service
// Handles all user-related API calls

import api from './api';

export const userService = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Get user statistics
  getStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },
};

