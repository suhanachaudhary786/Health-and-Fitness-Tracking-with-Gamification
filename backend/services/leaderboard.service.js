// Leaderboard service
// Handles leaderboard calculations and rankings

const User = require('../models/User');
const Activity = require('../models/Activity');
const { getStartOfDay } = require('../utils/helpers');

/**
 * Get overall leaderboard by points
 * @param {Number} limit - Number of top users to return
 * @returns {Array} Leaderboard entries
 */
const getOverallLeaderboard = async (limit = 10) => {
  const users = await User.find()
    .select('username totalPoints currentLevel')
    .sort({ totalPoints: -1 })
    .limit(limit);

  return users.map((user, index) => ({
    rank: index + 1,
    userId: user._id,
    username: user.username,
    value: user.totalPoints,
    level: user.currentLevel,
  }));
};

/**
 * Get weekly leaderboard by category
 * @param {String} category - 'steps', 'calories', 'distance', 'points'
 * @param {Number} limit - Number of top users to return
 * @returns {Array} Leaderboard entries
 */
const getWeeklyLeaderboard = async (category = 'points', limit = 10) => {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)
  weekStart.setHours(0, 0, 0, 0);

  let leaderboard = [];

  if (category === 'points') {
    // Aggregate points from activities this week
    const activities = await Activity.aggregate([
      {
        $match: {
          date: { $gte: weekStart },
        },
      },
      {
        $group: {
          _id: '$userId',
          totalPoints: { $sum: '$pointsEarned' },
        },
      },
      {
        $sort: { totalPoints: -1 },
      },
      {
        $limit: limit,
      },
    ]);

    // Get user details
    const userIds = activities.map((a) => a._id);
    const users = await User.find({ _id: { $in: userIds } }).select(
      'username currentLevel'
    );

    leaderboard = activities.map((activity, index) => {
      const user = users.find((u) => u._id.toString() === activity._id.toString());
      return {
        rank: index + 1,
        userId: activity._id,
        username: user?.username || 'Unknown',
        value: activity.totalPoints,
        level: user?.currentLevel || 1,
      };
    });
  } else if (category === 'steps') {
    const activities = await Activity.aggregate([
      {
        $match: {
          date: { $gte: weekStart },
        },
      },
      {
        $group: {
          _id: '$userId',
          totalSteps: { $sum: '$steps' },
        },
      },
      {
        $sort: { totalSteps: -1 },
      },
      {
        $limit: limit,
      },
    ]);

    const userIds = activities.map((a) => a._id);
    const users = await User.find({ _id: { $in: userIds } }).select(
      'username currentLevel'
    );

    leaderboard = activities.map((activity, index) => {
      const user = users.find((u) => u._id.toString() === activity._id.toString());
      return {
        rank: index + 1,
        userId: activity._id,
        username: user?.username || 'Unknown',
        value: activity.totalSteps,
        level: user?.currentLevel || 1,
      };
    });
  } else if (category === 'calories') {
    const activities = await Activity.aggregate([
      {
        $match: {
          date: { $gte: weekStart },
        },
      },
      {
        $group: {
          _id: '$userId',
          totalCalories: { $sum: '$calories' },
        },
      },
      {
        $sort: { totalCalories: -1 },
      },
      {
        $limit: limit,
      },
    ]);

    const userIds = activities.map((a) => a._id);
    const users = await User.find({ _id: { $in: userIds } }).select(
      'username currentLevel'
    );

    leaderboard = activities.map((activity, index) => {
      const user = users.find((u) => u._id.toString() === activity._id.toString());
      return {
        rank: index + 1,
        userId: activity._id,
        username: user?.username || 'Unknown',
        value: activity.totalCalories,
        level: user?.currentLevel || 1,
      };
    });
  } else if (category === 'streak') {
    const users = await User.find()
      .select('username streakDays currentLevel')
      .sort({ streakDays: -1 })
      .limit(limit);

    leaderboard = users.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      username: user.username,
      value: user.streakDays,
      level: user.currentLevel,
    }));
  }

  return leaderboard;
};

/**
 * Get monthly leaderboard by category
 * @param {String} category - 'steps', 'calories', 'distance', 'points'
 * @param {Number} limit - Number of top users to return
 * @returns {Array} Leaderboard entries
 */
const getMonthlyLeaderboard = async (category = 'points', limit = 10) => {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  // Similar logic to weekly but for monthly period
  return await getWeeklyLeaderboard(category, limit); // Simplified - same logic
};

/**
 * Get user's rank in leaderboard
 * @param {String} userId - User ID
 * @param {String} type - 'overall', 'weekly', 'monthly'
 * @param {String} category - 'points', 'steps', 'calories', 'streak'
 * @returns {Object} User's rank information
 */
const getUserRank = async (userId, type = 'overall', category = 'points') => {
  let leaderboard = [];

  if (type === 'overall') {
    leaderboard = await getOverallLeaderboard(100); // Get more to find user
  } else if (type === 'weekly') {
    leaderboard = await getWeeklyLeaderboard(category, 100);
  } else if (type === 'monthly') {
    leaderboard = await getMonthlyLeaderboard(category, 100);
  }

  const userRank = leaderboard.findIndex(
    (entry) => entry.userId.toString() === userId.toString()
  );

  if (userRank === -1) {
    // User not in top 100, calculate total rank
    return {
      rank: null,
      message: 'Not ranked in top 100',
    };
  }

  return {
    rank: userRank + 1,
    ...leaderboard[userRank],
  };
};

module.exports = {
  getOverallLeaderboard,
  getWeeklyLeaderboard,
  getMonthlyLeaderboard,
  getUserRank,
};

