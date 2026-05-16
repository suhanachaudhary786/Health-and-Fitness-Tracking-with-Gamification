// Gamification controller
// Handles points, badges, and levels

const { calculateLevelProgress } = require('../services/level.service');
const { getAllBadgesWithStatus } = require('../services/badge.service');
const User = require('../models/User');

/**
 * Get current points and level information
 */
const getPoints = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select(
      'totalPoints currentLevel'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const levelProgress = await calculateLevelProgress(
      user.totalPoints,
      user.currentLevel
    );

    res.json({
      success: true,
      data: {
        totalPoints: user.totalPoints,
        currentLevel: user.currentLevel,
        levelProgress,
      },
    });
  } catch (error) {
    console.error('Get points error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Get user's earned badges
 */
const getBadges = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId)
      .select('badges')
      .populate('badges', 'name icon description category pointsReward');

    res.json({
      success: true,
      data: user.badges,
    });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Get all available badges with user's earned status
 */
const getAvailableBadges = async (req, res) => {
  try {
    const badges = await getAllBadgesWithStatus(req.session.userId);

    res.json({
      success: true,
      data: badges,
    });
  } catch (error) {
    console.error('Get available badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Get current level information
 */
const getLevel = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select(
      'totalPoints currentLevel'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const levelProgress = await calculateLevelProgress(
      user.totalPoints,
      user.currentLevel
    );

    res.json({
      success: true,
      data: levelProgress,
    });
  } catch (error) {
    console.error('Get level error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = {
  getPoints,
  getBadges,
  getAvailableBadges,
  getLevel,
};

