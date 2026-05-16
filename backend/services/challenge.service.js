// Challenge service
// Handles challenge creation, checking, and completion

const Challenge = require('../models/Challenge');
const Activity = require('../models/Activity');
const User = require('../models/User');
const { getStartOfDay } = require('../utils/helpers');

/**
 * Create a daily challenge for user
 * @param {String} userId - User ID
 * @param {Object} target - Challenge target (type and value)
 * @returns {Object} Created challenge
 */
const createDailyChallenge = async (userId, target) => {
  const today = getStartOfDay();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Check if user already has a daily challenge for today
  const existingChallenge = await Challenge.findOne({
    userId,
    type: 'daily',
    startDate: { $gte: today },
    completed: false,
  });

  if (existingChallenge) {
    return existingChallenge;
  }

  const challenge = await Challenge.create({
    userId,
    type: 'daily',
    target,
    startDate: today,
    endDate: tomorrow,
    pointsReward: 50, // Default reward
  });

  return challenge;
};

/**
 * Create default daily challenges
 * Creates smart challenges based on user's average activity
 * @param {String} userId - User ID
 * @returns {Array} Created challenges
 */
const createDefaultDailyChallenges = async (userId) => {
  const challenges = [];

  // Get user's average activity from last 7 days to create smart challenges
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentActivities = await Activity.find({
    userId,
    date: { $gte: sevenDaysAgo },
  });

  // Calculate averages
  let avgSteps = 5000; // Default
  let avgCalories = 300; // Default
  let avgDistance = 3.0; // Default
  let avgExerciseTime = 30; // Default

  if (recentActivities.length > 0) {
    const totals = recentActivities.reduce(
      (acc, activity) => {
        acc.steps += activity.steps || 0;
        acc.calories += activity.calories || 0;
        acc.distance += activity.distance || 0;
        acc.exerciseTime += activity.exerciseTime || 0;
        return acc;
      },
      { steps: 0, calories: 0, distance: 0, exerciseTime: 0 }
    );

    const count = recentActivities.length;
    avgSteps = Math.round(totals.steps / count);
    avgCalories = Math.round(totals.calories / count);
    avgDistance = parseFloat((totals.distance / count).toFixed(1));
    avgExerciseTime = Math.round(totals.exerciseTime / count);
  }

  // Create challenges that are 20% above average (motivating but achievable)
  const stepsTarget = Math.max(5000, Math.round(avgSteps * 1.2));
  const caloriesTarget = Math.max(300, Math.round(avgCalories * 1.2));
  const distanceTarget = Math.max(3.0, parseFloat((avgDistance * 1.2).toFixed(1)));
  const exerciseTimeTarget = Math.max(30, Math.round(avgExerciseTime * 1.2));

  // Steps challenge
  const stepsChallenge = await createDailyChallenge(userId, {
    type: 'steps',
    value: stepsTarget,
  });
  challenges.push(stepsChallenge);

  // Calories challenge
  const caloriesChallenge = await createDailyChallenge(userId, {
    type: 'calories',
    value: caloriesTarget,
  });
  challenges.push(caloriesChallenge);

  // Distance challenge (if user has distance activities)
  if (avgDistance > 0) {
    const distanceChallenge = await createDailyChallenge(userId, {
      type: 'distance',
      value: distanceTarget,
    });
    challenges.push(distanceChallenge);
  }

  return challenges;
};

/**
 * Check and update challenge progress
 * @param {String} userId - User ID
 * @returns {Array} Updated challenges
 */
const checkChallenges = async (userId) => {
  const today = getStartOfDay();
  const challenges = await Challenge.find({
    userId,
    completed: false,
    endDate: { $gte: today },
  });

  const updatedChallenges = [];

  for (const challenge of challenges) {
    let currentValue = 0;

    // Get current progress based on challenge type
    if (challenge.type === 'daily') {
      const todayEnd = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      const todayActivities = await Activity.find({
        userId,
        date: { $gte: today, $lt: todayEnd },
      });

      // Aggregate all activities for today
      const aggregated = todayActivities.reduce(
        (acc, activity) => ({
          steps: acc.steps + (activity.steps || 0),
          distance: acc.distance + (activity.distance || 0),
          calories: acc.calories + (activity.calories || 0),
          exerciseTime: acc.exerciseTime + (activity.exerciseTime || 0),
          points: acc.points + (activity.pointsEarned || 0),
        }),
        { steps: 0, distance: 0, calories: 0, exerciseTime: 0, points: 0 }
      );

      switch (challenge.target.type) {
        case 'steps':
          currentValue = aggregated.steps;
          break;
        case 'distance':
          currentValue = aggregated.distance;
          break;
        case 'calories':
          currentValue = aggregated.calories;
          break;
        case 'exerciseTime':
          currentValue = aggregated.exerciseTime;
          break;
        case 'points':
          currentValue = aggregated.points;
          break;
      }
    }

    // Check if challenge is completed
    if (currentValue >= challenge.target.value && !challenge.completed) {
      challenge.completed = true;
      challenge.completedDate = new Date();

      // Award points
      if (challenge.pointsReward > 0) {
        const user = await User.findById(userId);
        user.totalPoints += challenge.pointsReward;
        await user.updateLevel();
        await user.save();
      }

      await challenge.save();
      updatedChallenges.push(challenge);
    }
  }

  return updatedChallenges;
};

/**
 * Get user's active challenges
 * Automatically creates default daily challenges if none exist
 * @param {String} userId - User ID
 * @returns {Array} Active challenges
 */
const getActiveChallenges = async (userId) => {
  const today = getStartOfDay();
  let challenges = await Challenge.find({
    userId,
    completed: false,
    endDate: { $gte: today },
  }).sort({ startDate: -1 });

  // If no active challenges exist, create default daily challenges
  if (challenges.length === 0) {
    const defaultChallenges = await createDefaultDailyChallenges(userId);
    challenges = await Challenge.find({
      userId,
      completed: false,
      endDate: { $gte: today },
    }).sort({ startDate: -1 });
  }

  // Get current progress for each challenge
  const challengesWithProgress = await Promise.all(
    challenges.map(async (challenge) => {
      let currentValue = 0;
      let progress = 0;

      if (challenge.type === 'daily') {
        const todayEnd = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        const todayActivities = await Activity.find({
          userId,
          date: { $gte: today, $lt: todayEnd },
        });

        // Aggregate all activities for today
        const aggregated = todayActivities.reduce(
          (acc, activity) => ({
            steps: acc.steps + (activity.steps || 0),
            distance: acc.distance + (activity.distance || 0),
            calories: acc.calories + (activity.calories || 0),
            exerciseTime: acc.exerciseTime + (activity.exerciseTime || 0),
            points: acc.points + (activity.pointsEarned || 0),
          }),
          { steps: 0, distance: 0, calories: 0, exerciseTime: 0, points: 0 }
        );

        switch (challenge.target.type) {
          case 'steps':
            currentValue = aggregated.steps;
            break;
          case 'distance':
            currentValue = aggregated.distance;
            break;
          case 'calories':
            currentValue = aggregated.calories;
            break;
          case 'exerciseTime':
            currentValue = aggregated.exerciseTime;
            break;
          case 'points':
            currentValue = aggregated.points;
            break;
        }
      }

      progress = Math.min((currentValue / challenge.target.value) * 100, 100);

      return {
        ...challenge.toObject(),
        currentValue,
        progress: Math.round(progress),
      };
    })
  );

  return challengesWithProgress;
};

module.exports = {
  createDailyChallenge,
  createDefaultDailyChallenges,
  checkChallenges,
  getActiveChallenges,
};

