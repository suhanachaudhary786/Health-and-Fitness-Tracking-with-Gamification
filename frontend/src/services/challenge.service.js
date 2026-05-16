// Challenge service
// Handles all challenge-related API calls

import api from './api';

export const challengeService = {
  // Get active challenges
  getActiveChallenges: async () => {
    const response = await api.get('/api/challenges/active');
    return response.data;
  },

  // Create default daily challenges
  createDefaultChallenges: async () => {
    const response = await api.post('/api/challenges/create-default');
    return response.data;
  },

  // Check challenges
  checkChallenges: async () => {
    const response = await api.post('/api/challenges/check');
    return response.data;
  },
};

