// Activity service
// Handles all activity-related API calls

import api from './api';

export const activityService = {
  // Create new activity
  createActivity: async (activityData) => {
    const response = await api.post('/api/activities', activityData);
    return response.data;
  },

  // Get activities
  getActivities: async (params = {}) => {
    const response = await api.get('/api/activities', { params });
    return response.data;
  },

  // Get today's activity
  getTodayActivity: async () => {
    const response = await api.get('/api/activities/today');
    return response.data;
  },

  // Get activity statistics
  getActivityStats: async (period = 'weekly') => {
    const response = await api.get('/api/activities/stats', {
      params: { period },
    });
    return response.data;
  },

  // Update activity
  updateActivity: async (id, activityData) => {
    const response = await api.put(`/api/activities/${id}`, activityData);
    return response.data;
  },

  // Delete activity
  deleteActivity: async (id) => {
    const response = await api.delete(`/api/activities/${id}`);
    return response.data;
  },
};

