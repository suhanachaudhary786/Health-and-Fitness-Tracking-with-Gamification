// Challenge controller
// Handles challenge-related operations

const {
  createDefaultDailyChallenges,
  checkChallenges,
  getActiveChallenges,
} = require('../services/challenge.service');
const { requireAuth } = require('../middleware/auth.middleware');

/**
 * Get active challenges for user
 */
const getActiveChallengesController = async (req, res) => {
  try {
    const userId = req.session.userId;
    const challenges = await getActiveChallenges(userId);

    res.json({
      success: true,
      data: challenges,
    });
  } catch (error) {
    console.error('Get active challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Create default daily challenges
 */
const createDefaultChallenges = async (req, res) => {
  try {
    const userId = req.session.userId;
    const challenges = await createDefaultDailyChallenges(userId);

    res.json({
      success: true,
      message: 'Daily challenges created',
      data: challenges,
    });
  } catch (error) {
    console.error('Create challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Check challenges (called after activity creation)
 */
const checkChallengesController = async (req, res) => {
  try {
    const userId = req.session.userId;
    const completedChallenges = await checkChallenges(userId);

    res.json({
      success: true,
      data: {
        completedChallenges,
        count: completedChallenges.length,
      },
    });
  } catch (error) {
    console.error('Check challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = {
  getActiveChallengesController,
  createDefaultChallenges,
  checkChallengesController,
};

