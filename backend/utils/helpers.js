// Helper utility functions

// Calculate points based on activity data
const calculatePoints = (steps, distance, exerciseTime, calories) => {
  let points = 0;

  // Steps: 1 point per 100 steps (max 100 points/day)
  const stepsPoints = Math.min(Math.floor(steps / 100), 100);
  points += stepsPoints;

  // Distance: 10 points per km (max 50 points/day)
  const distancePoints = Math.min(Math.floor(distance * 10), 50);
  points += distancePoints;

  // Exercise Time: 2 points per minute (max 60 points/day)
  const timePoints = Math.min(Math.floor(exerciseTime * 2), 60);
  points += timePoints;

  // Calories: 1 point per 10 calories (max 50 points/day)
  const caloriesPoints = Math.min(Math.floor(calories / 10), 50);
  points += caloriesPoints;

  // Activity Bonus: +10 points for completing 2 or more activity types
  // This allows flexibility (e.g., swimming doesn't need steps, yoga doesn't need distance)
  const activeTypes = [
    steps > 0,
    distance > 0,
    exerciseTime > 0,
    calories > 0,
  ].filter(Boolean).length;
  
  if (activeTypes >= 2) {
    points += 10;
    // Extra bonus if all types are present (optional, not required)
    if (activeTypes === 4) {
      points += 10; // Additional 10 points for all 4 types
    }
  }

  return points;
};

// Calculate streak bonus points
const calculateStreakBonus = (streakDays) => {
  // +10 points per consecutive day (max +50/day)
  return Math.min(streakDays * 10, 50);
};

// Calculate streak milestone bonus
const calculateStreakMilestoneBonus = (oldStreak, newStreak) => {
  const milestones = [7, 14, 30, 60, 100];
  let bonus = 0;

  for (const milestone of milestones) {
    // Check if user just reached this milestone
    if (oldStreak < milestone && newStreak >= milestone) {
      // Bonus points for reaching milestone
      switch (milestone) {
        case 7:
          bonus += 50;
          break;
        case 14:
          bonus += 100;
          break;
        case 30:
          bonus += 200;
          break;
        case 60:
          bonus += 300;
          break;
        case 100:
          bonus += 500;
          break;
      }
    }
  }

  return bonus;
};

// Format date to start of day (for comparison)
const getStartOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Check if two dates are the same day
const isSameDay = (date1, date2) => {
  const d1 = getStartOfDay(date1);
  const d2 = getStartOfDay(date2);
  return d1.getTime() === d2.getTime();
};

// Check if date is yesterday
const isYesterday = (date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
};

// Check if date is today
const isToday = (date) => {
  return isSameDay(date, new Date());
};

module.exports = {
  calculatePoints,
  calculateStreakBonus,
  calculateStreakMilestoneBonus,
  getStartOfDay,
  isSameDay,
  isYesterday,
  isToday,
};

