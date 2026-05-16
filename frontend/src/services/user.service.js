// User service
// Handles all user-related API calls

import api from './api';

export const userService = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/api/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/api/users/profile', profileData);
    return response.data;
  },

  // Get user statistics
  getStats: async () => {
    const response = await api.get('/api/users/stats');
    return response.data;
  },
};

