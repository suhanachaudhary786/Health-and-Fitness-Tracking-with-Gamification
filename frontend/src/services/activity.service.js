// Activity service
// Handles all activity-related API calls

import api from './api';

export const activityService = {
  // Create new activity
  createActivity: async (activityData) => {
    const response = await api.post('/activities', activityData);
    return response.data;
  },

  // Get activities
  getActivities: async (params = {}) => {
    const response = await api.get('/activities', { params });
    return response.data;
  },

  // Get today's activity
  getTodayActivity: async () => {
    const response = await api.get('/activities/today');
    return response.data;
  },

  // Get activity statistics
  getActivityStats: async (period = 'weekly') => {
    const response = await api.get('/activities/stats', {
      params: { period },
    });
    return response.data;
  },

  // Update activity
  updateActivity: async (id, activityData) => {
    const response = await api.put(`/activities/${id}`, activityData);
    return response.data;
  },

  // Delete activity
  deleteActivity: async (id) => {
    const response = await api.delete(`/activities/${id}`);
    return response.data;
  },
};

