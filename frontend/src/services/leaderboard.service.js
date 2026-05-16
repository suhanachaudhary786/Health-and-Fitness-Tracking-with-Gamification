// Leaderboard service
// Handles all leaderboard-related API calls

import api from './api';

export const leaderboardService = {
  // Get overall leaderboard
  getOverall: async (limit = 10) => {
    const response = await api.get('/leaderboard/overall', {
      params: { limit },
    });
    return response.data;
  },

  // Get weekly leaderboard
  getWeekly: async (category = 'points', limit = 10) => {
    const response = await api.get('/leaderboard/weekly', {
      params: { category, limit },
    });
    return response.data;
  },

  // Get monthly leaderboard
  getMonthly: async (category = 'points', limit = 10) => {
    const response = await api.get('/leaderboard/monthly', {
      params: { category, limit },
    });
    return response.data;
  },

  // Get user's rank
  getMyRank: async (type = 'overall', category = 'points') => {
    const response = await api.get('/leaderboard/my-rank', {
      params: { type, category },
    });
    return response.data;
  },
};

