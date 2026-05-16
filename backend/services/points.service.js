// Points calculation service
// Handles all points-related logic including bonuses

const { calculatePoints, calculateStreakBonus } = require('../utils/helpers');

/**
 * Calculate total points for an activity entry
 * @param {Object} activityData - Activity data (steps, distance, exerciseTime, calories)
 * @param {Number} streakDays - Current streak days
 * @returns {Number} Total points earned
 */
const calculateActivityPoints = (activityData, streakDays = 0) => {
  const { steps = 0, distance = 0, exerciseTime = 0, calories = 0 } =
    activityData;

  // Base points from activities
  let totalPoints = calculatePoints(steps, distance, exerciseTime, calories);

  // Add streak bonus
  const streakBonus = calculateStreakBonus(streakDays);
  totalPoints += streakBonus;

  return totalPoints;
};

/**
 * Update user's total points and level
 * @param {Object} user - User document
 * @param {Number} pointsToAdd - Points to add to user's total
 */
const updateUserPoints = async (user, pointsToAdd) => {
  user.totalPoints += pointsToAdd;

  // Update level based on new total points
  await user.updateLevel();

  await user.save();
};

module.exports = {
  calculateActivityPoints,
  updateUserPoints,
};

