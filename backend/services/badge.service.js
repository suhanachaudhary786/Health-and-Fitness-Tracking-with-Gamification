// Badge checking and awarding service
// Handles badge logic and automatic badge awarding

const Badge = require('../models/Badge');
const User = require('../models/User');
const Activity = require('../models/Activity');

/**
 * Check and award badges based on user achievements
 * @param {String} userId - User ID
 * @param {Object} activityData - Current activity data (optional)
 * @returns {Array} Array of newly awarded badges
 */
const checkAndAwardBadges = async (userId, activityData = null) => {
  const user = await User.findById(userId).populate('badges');
  const newlyAwardedBadges = [];

  // Get all available badges
  const allBadges = await Badge.find();

  // Get user's existing badge IDs
  const existingBadgeIds = user.badges.map((badge) =>
    badge._id ? badge._id.toString() : badge.toString()
  );

  // Calculate total stats for milestone badges (only once, cached)
  let totalStats = null;
  const getTotalStats = async () => {
    if (totalStats === null) {
      const stats = await Activity.aggregate([
        { $match: { userId: user._id } },
        {
          $group: {
            _id: null,
            totalSteps: { $sum: '$steps' },
            totalDistance: { $sum: '$distance' },
            totalExerciseTime: { $sum: '$exerciseTime' },
            totalCalories: { $sum: '$calories' },
          },
        },
      ]);
      totalStats = stats[0] || {
        totalSteps: 0,
        totalDistance: 0,
        totalExerciseTime: 0,
        totalCalories: 0,
      };
    }
    return totalStats;
  };

  // Check each badge requirement
  for (const badge of allBadges) {
    // Skip if user already has this badge
    if (existingBadgeIds.includes(badge._id.toString())) {
      continue;
    }

    let shouldAward = false;

    // Determine if we should check daily value or total value
    // activity category badges check daily values, milestone badges check totals
    const isDailyBadge = badge.category === 'activity';

    switch (badge.requirement.type) {
      case 'steps':
        if (isDailyBadge) {
          // Check daily activity value
          if (activityData && activityData.steps >= badge.requirement.value) {
            shouldAward = true;
          }
        } else {
          // Check total steps
          const stats = await getTotalStats();
          if (stats.totalSteps >= badge.requirement.value) {
            shouldAward = true;
          }
        }
        break;

      case 'distance':
        if (isDailyBadge) {
          // Check daily activity value
          if (activityData && activityData.distance >= badge.requirement.value) {
            shouldAward = true;
          }
        } else {
          // Check total distance
          const stats = await getTotalStats();
          if (stats.totalDistance >= badge.requirement.value) {
            shouldAward = true;
          }
        }
        break;

      case 'calories':
        if (isDailyBadge) {
          // Check daily activity value
          if (activityData && activityData.calories >= badge.requirement.value) {
            shouldAward = true;
          }
        } else {
          // Check total calories
          const stats = await getTotalStats();
          if (stats.totalCalories >= badge.requirement.value) {
            shouldAward = true;
          }
        }
        break;

      case 'exerciseTime':
        if (isDailyBadge) {
          // Check daily activity value
          if (activityData && activityData.exerciseTime >= badge.requirement.value) {
            shouldAward = true;
          }
        } else {
          // Check total exercise time
          const stats = await getTotalStats();
          if (stats.totalExerciseTime >= badge.requirement.value) {
            shouldAward = true;
          }
        }
        break;

      case 'streak':
        // Streak badges always check total streak
        if (user.streakDays >= badge.requirement.value) {
          shouldAward = true;
        }
        break;

      case 'total_activities':
        // Total activities always checks count
        const activityCount = await Activity.countDocuments({ userId });
        if (activityCount >= badge.requirement.value) {
          shouldAward = true;
        }
        break;

      case 'points':
        // Points badges always check total points
        if (user.totalPoints >= badge.requirement.value) {
          shouldAward = true;
        }
        break;
    }

    if (shouldAward) {
      // Award the badge
      user.badges.push(badge._id);
      if (badge.pointsReward > 0) {
        user.totalPoints += badge.pointsReward;
        await user.updateLevel();
      }
      newlyAwardedBadges.push(badge);
    }
  }

  if (newlyAwardedBadges.length > 0) {
    await user.save();
  }

  return newlyAwardedBadges;
};

/**
 * Get all badges with user's earned status
 * @param {String} userId - User ID
 * @returns {Array} Array of badges with earned status
 */
const getAllBadgesWithStatus = async (userId) => {
  const user = await User.findById(userId).select('badges');
  const userBadgeIds = user.badges.map((badge) =>
    badge._id ? badge._id.toString() : badge.toString()
  );

  const allBadges = await Badge.find().sort({ category: 1, minPoints: 1 });

  return allBadges.map((badge) => ({
    ...badge.toObject(),
    earned: userBadgeIds.includes(badge._id.toString()),
  }));
};

module.exports = {
  checkAndAwardBadges,
  getAllBadgesWithStatus,
};

