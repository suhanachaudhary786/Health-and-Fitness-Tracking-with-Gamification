// User controller
// Handles user profile operations

const User = require('../models/User');

/**
 * Get user profile
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId)
      .select('-password')
      .populate('badges', 'name icon description category');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
  try {
    const { age, weight, height, goal } = req.body;

    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update only provided fields
    if (age !== undefined) user.age = age;
    if (weight !== undefined) user.weight = weight;
    if (height !== undefined) user.height = height;
    if (goal !== undefined) user.goal = goal;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        age: user.age,
        weight: user.weight,
        height: user.height,
        goal: user.goal,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Get user statistics summary
 */
const getStats = async (req, res) => {
  try {
    const Activity = require('../models/Activity');
    const { isToday, getStartOfDay } = require('../utils/helpers');

    const userId = req.session.userId;

    // Get today's activities (aggregated)
    const todayStart = getStartOfDay();
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    const todayActivities = await Activity.find({
      userId,
      date: { $gte: todayStart, $lt: todayEnd },
    });

    // Aggregate today's activities
    const todayActivity = todayActivities.reduce(
      (acc, activity) => ({
        steps: acc.steps + (activity.steps || 0),
        distance: acc.distance + (activity.distance || 0),
        exerciseTime: acc.exerciseTime + (activity.exerciseTime || 0),
        calories: acc.calories + (activity.calories || 0),
        pointsEarned: acc.pointsEarned + (activity.pointsEarned || 0),
      }),
      { steps: 0, distance: 0, exerciseTime: 0, calories: 0, pointsEarned: 0 }
    );

    // Get total activities count
    const totalActivities = await Activity.countDocuments({ userId });

    // Get total stats
    const mongoose = require('mongoose');
    const totalStats = await Activity.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalSteps: { $sum: '$steps' },
          totalDistance: { $sum: '$distance' },
          totalExerciseTime: { $sum: '$exerciseTime' },
          totalCalories: { $sum: '$calories' },
          totalPoints: { $sum: '$pointsEarned' },
        },
      },
    ]);

    const user = await User.findById(userId).select('totalPoints currentLevel streakDays');

    res.json({
      success: true,
      data: {
        today: todayActivity || {
          steps: 0,
          distance: 0,
          exerciseTime: 0,
          calories: 0,
          pointsEarned: 0,
        },
        totals: totalStats[0] || {
          totalSteps: 0,
          totalDistance: 0,
          totalExerciseTime: 0,
          totalCalories: 0,
          totalPoints: 0,
        },
        totalActivities,
        userStats: {
          totalPoints: user.totalPoints,
          currentLevel: user.currentLevel,
          streakDays: user.streakDays,
        },
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getStats,
};

