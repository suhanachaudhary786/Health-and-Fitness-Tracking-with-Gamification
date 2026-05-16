// Activity controller
// Handles activity CRUD operations

const Activity = require('../models/Activity');
const User = require('../models/User');
const { calculateActivityPoints, updateUserPoints } = require('../services/points.service');
const { checkAndAwardBadges } = require('../services/badge.service');
const { getStartOfDay, isToday, isYesterday } = require('../utils/helpers');

/**
 * Create new activity entry
 */
const createActivity = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { date, steps, distance, exerciseTime, calories } = req.body;

    // Use provided date or today
    const activityDate = date ? new Date(date) : new Date();
    const startOfDay = getStartOfDay(activityDate);
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    // Get user for streak calculation
    const user = await User.findById(userId);

    // Check if this is the first activity for this day
    const existingActivitiesToday = await Activity.find({
      userId,
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    const isFirstActivityToday = existingActivitiesToday.length === 0;

    // Calculate streak (only update if this is first activity today)
    const oldStreak = user.streakDays || 0;
    let streakDays = user.streakDays || 0;
    
    if (isFirstActivityToday) {
      if (user.lastActivityDate) {
        if (isToday(user.lastActivityDate)) {
          // Already logged today, keep current streak
          streakDays = user.streakDays;
        } else if (isYesterday(user.lastActivityDate)) {
          // Consecutive day
          streakDays = user.streakDays + 1;
        } else {
          // Streak broken, reset to 1
          streakDays = 1;
        }
      } else {
        // First activity ever
        streakDays = 1;
      }
      // Update user streak and last activity date only for first activity of the day
      user.streakDays = streakDays;
      user.lastActivityDate = activityDate;
    }

    // Calculate points for this new activity only (not aggregated)
    let pointsEarned = calculateActivityPoints(
      { steps: steps || 0, distance: distance || 0, exerciseTime: exerciseTime || 0, calories: calories || 0 },
      streakDays
    );

    // Add streak milestone bonus (only for first activity of the day)
    const { calculateStreakMilestoneBonus } = require('../utils/helpers');
    let milestoneBonus = 0;
    if (isFirstActivityToday) {
      milestoneBonus = calculateStreakMilestoneBonus(oldStreak, streakDays);
      if (milestoneBonus > 0) {
        pointsEarned += milestoneBonus;
      }
    }

    // Create new activity entry (each activity is saved separately)
    const activity = await Activity.create({
      userId,
      date: activityDate,
      steps: steps || 0,
      distance: distance || 0,
      exerciseTime: exerciseTime || 0,
      calories: calories || 0,
      pointsEarned,
    });

    // Update user points and level (add points for this activity)
    await updateUserPoints(user, pointsEarned);

    // Save user (streak was updated above if needed)
    await user.save();

    // Get total activities for today to check badges (use aggregated values)
    const totalToday = existingActivitiesToday.reduce(
      (acc, act) => ({
        steps: acc.steps + act.steps,
        distance: acc.distance + act.distance,
        exerciseTime: acc.exerciseTime + act.exerciseTime,
        calories: acc.calories + act.calories,
      }),
      { steps: 0, distance: 0, exerciseTime: 0, calories: 0 }
    );

    // Add current activity values to total
    const aggregatedToday = {
      steps: totalToday.steps + (steps || 0),
      distance: totalToday.distance + (distance || 0),
      exerciseTime: totalToday.exerciseTime + (exerciseTime || 0),
      calories: totalToday.calories + (calories || 0),
    };

    // Check for new badges using aggregated values for the day
    const newBadges = await checkAndAwardBadges(userId, aggregatedToday);

    // Check for completed challenges
    const { checkChallenges } = require('../services/challenge.service');
    const completedChallenges = await checkChallenges(userId);

    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      data: {
        activity,
        newBadges: newBadges.length > 0 ? newBadges : undefined,
        completedChallenges:
          completedChallenges.length > 0 ? completedChallenges : undefined,
        streakMilestoneBonus: milestoneBonus > 0 ? milestoneBonus : undefined,
      },
    });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Get activities with optional filters
 */
const getActivities = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { date, startDate, endDate, limit = 30 } = req.query;

    let query = { userId };

    // Filter by single date
    if (date) {
      const startOfDay = getStartOfDay(new Date(date));
      query.date = {
        $gte: startOfDay,
        $lt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000),
      };
    }
    // Filter by date range
    else if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = getStartOfDay(new Date(startDate));
      }
      if (endDate) {
        const endOfDay = getStartOfDay(new Date(endDate));
        query.date.$lt = new Date(endOfDay.getTime() + 24 * 60 * 60 * 1000);
      }
    }

    const activities = await Activity.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: activities,
      count: activities.length,
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Get today's activity (aggregated from all activities today)
 */
const getTodayActivity = async (req, res) => {
  try {
    const userId = req.session.userId;
    const todayStart = getStartOfDay();
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    // Get all activities for today
    const activities = await Activity.find({
      userId,
      date: { $gte: todayStart, $lt: todayEnd },
    }).sort({ createdAt: -1 });

    if (activities.length === 0) {
      return res.json({
        success: true,
        data: null,
        message: 'No activity logged for today',
      });
    }

    // Aggregate all activities for today
    const aggregated = activities.reduce(
      (acc, activity) => ({
        steps: acc.steps + (activity.steps || 0),
        distance: acc.distance + (activity.distance || 0),
        exerciseTime: acc.exerciseTime + (activity.exerciseTime || 0),
        calories: acc.calories + (activity.calories || 0),
        pointsEarned: acc.pointsEarned + (activity.pointsEarned || 0),
        activityCount: acc.activityCount + 1,
      }),
      {
        steps: 0,
        distance: 0,
        exerciseTime: 0,
        calories: 0,
        pointsEarned: 0,
        activityCount: 0,
      }
    );

    // Return aggregated data with metadata
    // Note: _id is only returned if there's a single activity
    // Multiple activities per day are aggregated and should not be updated individually
    const responseData = {
      userId,
      date: todayStart,
      steps: aggregated.steps,
      distance: aggregated.distance,
      exerciseTime: aggregated.exerciseTime,
      calories: aggregated.calories,
      pointsEarned: aggregated.pointsEarned,
      activities: activities, // Include all individual activities
      activityCount: aggregated.activityCount,
      createdAt: activities[0].createdAt,
      updatedAt: activities[activities.length - 1].updatedAt,
      isAggregated: aggregated.activityCount > 1, // Flag to indicate this is aggregated data
    };

    // Only include _id if there's exactly one activity (for backward compatibility)
    // Multiple activities should not be updated - always create new ones
    if (aggregated.activityCount === 1) {
      responseData._id = activities[0]._id;
    }

    res.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error('Get today activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Update activity
 */
const updateActivity = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { id } = req.params;
    const { steps, distance, exerciseTime, calories } = req.body;

    const activity = await Activity.findOne({ _id: id, userId });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found',
      });
    }

    // Calculate old points to subtract
    const oldPoints = activity.pointsEarned;
    const user = await User.findById(userId);

    // Update activity fields
    if (steps !== undefined) activity.steps = steps;
    if (distance !== undefined) activity.distance = distance;
    if (exerciseTime !== undefined) activity.exerciseTime = exerciseTime;
    if (calories !== undefined) activity.calories = calories;

    // Recalculate points
    const newPoints = calculateActivityPoints(
      {
        steps: activity.steps,
        distance: activity.distance,
        exerciseTime: activity.exerciseTime,
        calories: activity.calories,
      },
      user.streakDays
    );

    activity.pointsEarned = newPoints;
    await activity.save();

    // Update user points (subtract old, add new)
    user.totalPoints = user.totalPoints - oldPoints + newPoints;
    await user.updateLevel();
    await user.save();

    // Check for new badges with updated activity data
    const newBadges = await checkAndAwardBadges(userId, {
      steps: activity.steps,
      distance: activity.distance,
      exerciseTime: activity.exerciseTime,
      calories: activity.calories,
    });

    // Check for completed challenges
    const { checkChallenges } = require('../services/challenge.service');
    const completedChallenges = await checkChallenges(userId);

    res.json({
      success: true,
      message: 'Activity updated successfully',
      data: {
        activity,
        newBadges: newBadges.length > 0 ? newBadges : undefined,
        completedChallenges:
          completedChallenges.length > 0 ? completedChallenges : undefined,
      },
    });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Delete activity
 */
const deleteActivity = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { id } = req.params;

    const activity = await Activity.findOne({ _id: id, userId });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found',
      });
    }

    // Subtract points from user
    const user = await User.findById(userId);
    user.totalPoints = Math.max(0, user.totalPoints - activity.pointsEarned);
    await user.updateLevel();
    await user.save();

    // Delete activity
    await Activity.deleteOne({ _id: id });

    res.json({
      success: true,
      message: 'Activity deleted successfully',
    });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Get activity statistics
 */
const getActivityStats = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { period = 'weekly' } = req.query; // daily, weekly, monthly

    const now = new Date();
    let startDate;

    switch (period) {
      case 'daily':
        startDate = getStartOfDay();
        break;
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Get all activities in the period
    const allActivities = await Activity.find({
      userId,
      date: { $gte: startDate },
    }).sort({ date: 1 });

    // Group activities by day and aggregate
    const activitiesByDay = {};
    allActivities.forEach((activity) => {
      const dayKey = getStartOfDay(activity.date).toISOString();
      if (!activitiesByDay[dayKey]) {
        activitiesByDay[dayKey] = {
          date: getStartOfDay(activity.date),
          steps: 0,
          distance: 0,
          exerciseTime: 0,
          calories: 0,
          points: 0,
        };
      }
      activitiesByDay[dayKey].steps += activity.steps || 0;
      activitiesByDay[dayKey].distance += activity.distance || 0;
      activitiesByDay[dayKey].exerciseTime += activity.exerciseTime || 0;
      activitiesByDay[dayKey].calories += activity.calories || 0;
      activitiesByDay[dayKey].points += activity.pointsEarned || 0;
    });

    // Convert to array and sort by date
    const activities = Object.values(activitiesByDay).sort(
      (a, b) => a.date - b.date
    );

    // Calculate aggregates
    const stats = activities.reduce(
      (acc, activity) => {
        acc.totalSteps += activity.steps;
        acc.totalDistance += activity.distance;
        acc.totalExerciseTime += activity.exerciseTime;
        acc.totalCalories += activity.calories;
        acc.totalPoints += activity.points;
        acc.daysCount += 1;
        return acc;
      },
      {
        totalSteps: 0,
        totalDistance: 0,
        totalExerciseTime: 0,
        totalCalories: 0,
        totalPoints: 0,
        daysCount: 0,
      }
    );

    // Calculate averages
    const averages = {
      avgSteps: stats.daysCount > 0 ? Math.round(stats.totalSteps / stats.daysCount) : 0,
      avgDistance:
        stats.daysCount > 0 ? parseFloat((stats.totalDistance / stats.daysCount).toFixed(2)) : 0,
      avgExerciseTime:
        stats.daysCount > 0 ? Math.round(stats.totalExerciseTime / stats.daysCount) : 0,
      avgCalories:
        stats.daysCount > 0 ? Math.round(stats.totalCalories / stats.daysCount) : 0,
      avgPoints:
        stats.daysCount > 0 ? Math.round(stats.totalPoints / stats.daysCount) : 0,
    };

    res.json({
      success: true,
      data: {
        period,
        totals: {
          steps: stats.totalSteps,
          distance: parseFloat(stats.totalDistance.toFixed(2)),
          exerciseTime: stats.totalExerciseTime,
          calories: stats.totalCalories,
          points: stats.totalPoints,
        },
        averages,
        daysCount: stats.daysCount,
        activities: activities.map((a) => ({
          date: a.date,
          steps: a.steps,
          distance: a.distance,
          exerciseTime: a.exerciseTime,
          calories: a.calories,
          points: a.pointsEarned,
        })),
      },
    });
  } catch (error) {
    console.error('Get activity stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = {
  createActivity,
  getActivities,
  getTodayActivity,
  updateActivity,
  deleteActivity,
  getActivityStats,
};

