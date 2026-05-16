// Leaderboard controller
// Handles leaderboard-related operations

const {
  getOverallLeaderboard,
  getWeeklyLeaderboard,
  getMonthlyLeaderboard,
  getUserRank,
} = require('../services/leaderboard.service');

/**
 * Get overall leaderboard
 */
const getOverall = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = await getOverallLeaderboard(limit);

    res.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    console.error('Get overall leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Get weekly leaderboard
 */
const getWeekly = async (req, res) => {
  try {
    const category = req.query.category || 'points';
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = await getWeeklyLeaderboard(category, limit);

    res.json({
      success: true,
      data: leaderboard,
      category,
      period: 'weekly',
    });
  } catch (error) {
    console.error('Get weekly leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Get monthly leaderboard
 */
const getMonthly = async (req, res) => {
  try {
    const category = req.query.category || 'points';
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = await getMonthlyLeaderboard(category, limit);

    res.json({
      success: true,
      data: leaderboard,
      category,
      period: 'monthly',
    });
  } catch (error) {
    console.error('Get monthly leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Get user's rank
 */
const getMyRank = async (req, res) => {
  try {
    const userId = req.session.userId;
    const type = req.query.type || 'overall';
    const category = req.query.category || 'points';

    const rank = await getUserRank(userId, type, category);

    res.json({
      success: true,
      data: rank,
    });
  } catch (error) {
    console.error('Get user rank error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = {
  getOverall,
  getWeekly,
  getMonthly,
  getMyRank,
};

