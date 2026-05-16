// Gamification service
// Handles all gamification-related API calls

import api from './api';

export const gamificationService = {
  // Get points and level
  getPoints: async () => {
    const response = await api.get('/gamification/points');
    return response.data;
  },

  // Get user's badges
  getBadges: async () => {
    const response = await api.get('/gamification/badges');
    return response.data;
  },

  // Get all available badges
  getAvailableBadges: async () => {
    const response = await api.get('/gamification/available-badges');
    return response.data;
  },

  // Get level information
  getLevel: async () => {
    const response = await api.get('/gamification/level');
    return response.data;
  },
};

