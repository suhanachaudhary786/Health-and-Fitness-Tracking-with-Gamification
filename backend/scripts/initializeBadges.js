// Script to initialize default badges in the database
// Run this once: node backend/scripts/initializeBadges.js

require('dotenv').config();
const mongoose = require('mongoose');
const Badge = require('../models/Badge');
const connectDB = require('../config/database');

const defaultBadges = [
  {
    name: 'First Steps',
    description: 'Logged your first activity',
    icon: '👣',
    category: 'activity',
    requirement: {
      type: 'total_activities',
      value: 1,
    },
    pointsReward: 10,
  },
  {
    name: 'Week Warrior',
    description: '7 consecutive days of activity',
    icon: '🔥',
    category: 'streak',
    requirement: {
      type: 'streak',
      value: 7,
    },
    pointsReward: 50,
  },
  {
    name: 'Consistency King',
    description: '14 consecutive days of activity',
    icon: '👑',
    category: 'streak',
    requirement: {
      type: 'streak',
      value: 14,
    },
    pointsReward: 100,
  },
  {
    name: 'Month Master',
    description: '30 consecutive days of activity',
    icon: '🏆',
    category: 'streak',
    requirement: {
      type: 'streak',
      value: 30,
    },
    pointsReward: 200,
  },
  {
    name: 'Step Champion',
    description: '10,000 steps in one day',
    icon: '🚶',
    category: 'activity',
    requirement: {
      type: 'steps',
      value: 10000,
    },
    pointsReward: 25,
  },
  {
    name: 'Distance Explorer',
    description: '10 km in one day',
    icon: '🌍',
    category: 'activity',
    requirement: {
      type: 'distance',
      value: 10,
    },
    pointsReward: 30,
  },
  {
    name: 'Calorie Crusher',
    description: '500 calories burned in one day',
    icon: '💪',
    category: 'activity',
    requirement: {
      type: 'calories',
      value: 500,
    },
    pointsReward: 25,
  },
  {
    name: 'Point Collector',
    description: 'Reach 1000 total points',
    icon: '⭐',
    category: 'milestone',
    requirement: {
      type: 'points',
      value: 1000,
    },
    pointsReward: 0,
  },
  {
    name: 'Level Up',
    description: 'Reach level 5',
    icon: '🎯',
    category: 'milestone',
    requirement: {
      type: 'points',
      value: 3001, // Level 5 starts at 3001 points
    },
    pointsReward: 0,
  },
  {
    name: 'Century Streak',
    description: '100 consecutive days of activity',
    icon: '💯',
    category: 'streak',
    requirement: {
      type: 'streak',
      value: 100,
    },
    pointsReward: 500,
  },
  {
    name: 'Step Master',
    description: '15,000 steps in one day',
    icon: '🏃',
    category: 'activity',
    requirement: {
      type: 'steps',
      value: 15000,
    },
    pointsReward: 50,
  },
  {
    name: 'Marathon Walker',
    description: '20 km in one day',
    icon: '🚴',
    category: 'activity',
    requirement: {
      type: 'distance',
      value: 20,
    },
    pointsReward: 75,
  },
  {
    name: 'Calorie Master',
    description: '1000 calories burned in one day',
    icon: '🔥',
    category: 'activity',
    requirement: {
      type: 'calories',
      value: 1000,
    },
    pointsReward: 50,
  },
  {
    name: 'Early Bird',
    description: 'Log activity before 8 AM',
    icon: '🌅',
    category: 'activity',
    requirement: {
      type: 'total_activities',
      value: 5, // Simplified - in real app would check time
    },
    pointsReward: 20,
  },
  {
    name: 'Night Owl',
    description: 'Log activity after 10 PM',
    icon: '🌙',
    category: 'activity',
    requirement: {
      type: 'total_activities',
      value: 5, // Simplified - in real app would check time
    },
    pointsReward: 20,
  },
  {
    name: 'Weekend Warrior',
    description: 'Complete activities on 5 weekends',
    icon: '🎉',
    category: 'activity',
    requirement: {
      type: 'total_activities',
      value: 10, // Simplified
    },
    pointsReward: 30,
  },
  {
    name: 'Point Millionaire',
    description: 'Reach 10,000 total points',
    icon: '💎',
    category: 'milestone',
    requirement: {
      type: 'points',
      value: 10000,
    },
    pointsReward: 0,
  },
  {
    name: 'Elite Athlete',
    description: 'Reach level 6 (Elite)',
    icon: '👑',
    category: 'milestone',
    requirement: {
      type: 'points',
      value: 5001, // Level 6 starts at 5001 points
    },
    pointsReward: 0,
  },
  {
    name: 'Activity Addict',
    description: 'Log 50 activities',
    icon: '📊',
    category: 'milestone',
    requirement: {
      type: 'total_activities',
      value: 50,
    },
    pointsReward: 100,
  },
  {
    name: 'Century Club',
    description: 'Log 100 activities',
    icon: '🏅',
    category: 'milestone',
    requirement: {
      type: 'total_activities',
      value: 100,
    },
    pointsReward: 200,
  },
  {
    name: 'Half Marathon',
    description: 'Complete 21 km total distance',
    icon: '🏁',
    category: 'milestone',
    requirement: {
      type: 'points',
      value: 500, // Simplified - would track total distance
    },
    pointsReward: 50,
  },
  {
    name: 'Speed Demon',
    description: 'Complete 5 km in under 30 minutes',
    icon: '⚡',
    category: 'activity',
    requirement: {
      type: 'distance',
      value: 5,
    },
    pointsReward: 40,
  },
  {
    name: 'Dedication Master',
    description: '60 consecutive days of activity',
    icon: '💪',
    category: 'streak',
    requirement: {
      type: 'streak',
      value: 60,
    },
    pointsReward: 300,
  },
  {
    name: 'Ultra Runner',
    description: '25,000 steps in one day',
    icon: '🏃‍♂️',
    category: 'activity',
    requirement: {
      type: 'steps',
      value: 25000,
    },
    pointsReward: 100,
  },
  {
    name: 'Marathon Distance',
    description: '42 km total distance in activities',
    icon: '🏃',
    category: 'milestone',
    requirement: {
      type: 'distance',
      value: 42,
    },
    pointsReward: 150,
  },
  {
    name: 'Calorie Beast',
    description: '1500 calories burned in one day',
    icon: '🔥',
    category: 'activity',
    requirement: {
      type: 'calories',
      value: 1500,
    },
    pointsReward: 100,
  },
  {
    name: 'Exercise Enthusiast',
    description: '120 minutes of exercise in one day',
    icon: '⏱️',
    category: 'activity',
    requirement: {
      type: 'exerciseTime',
      value: 120,
    },
    pointsReward: 60,
  },
  {
    name: 'Daily Dedication',
    description: 'Complete 7 days with all activity types',
    icon: '📅',
    category: 'milestone',
    requirement: {
      type: 'total_activities',
      value: 7,
    },
    pointsReward: 75,
  },
  {
    name: 'Triple Digit Streak',
    description: '100 consecutive days of activity',
    icon: '💯',
    category: 'streak',
    requirement: {
      type: 'streak',
      value: 100,
    },
    pointsReward: 500,
  },
  {
    name: 'Point Master',
    description: 'Reach 5,000 total points',
    icon: '⭐',
    category: 'milestone',
    requirement: {
      type: 'points',
      value: 5000,
    },
    pointsReward: 0,
  },
  {
    name: 'Step Legend',
    description: '20,000 steps in one day',
    icon: '👑',
    category: 'activity',
    requirement: {
      type: 'steps',
      value: 20000,
    },
    pointsReward: 75,
  },
  {
    name: 'Distance King',
    description: '30 km in one day',
    icon: '🌐',
    category: 'activity',
    requirement: {
      type: 'distance',
      value: 30,
    },
    pointsReward: 100,
  },
  {
    name: 'Power Hour',
    description: '60 minutes of exercise in one session',
    icon: '⚡',
    category: 'activity',
    requirement: {
      type: 'exerciseTime',
      value: 60,
    },
    pointsReward: 40,
  },
  {
    name: 'Weekend Champion',
    description: 'Log activities on 10 weekends',
    icon: '🎊',
    category: 'milestone',
    requirement: {
      type: 'total_activities',
      value: 20,
    },
    pointsReward: 50,
  },
  {
    name: 'Monthly Master',
    description: 'Complete 30 days of activities',
    icon: '📆',
    category: 'milestone',
    requirement: {
      type: 'total_activities',
      value: 30,
    },
    pointsReward: 150,
  },
  {
    name: 'Calorie Warrior',
    description: '750 calories burned in one day',
    icon: '🛡️',
    category: 'activity',
    requirement: {
      type: 'calories',
      value: 750,
    },
    pointsReward: 40,
  },
  {
    name: 'Consistency Pro',
    description: '21 consecutive days of activity',
    icon: '🎯',
    category: 'streak',
    requirement: {
      type: 'streak',
      value: 21,
    },
    pointsReward: 150,
  },
];

const initializeBadges = async () => {
  try {
    await connectDB();

    // Get existing badges by name to avoid duplicates
    const existingBadges = await Badge.find({}, 'name');
    const existingBadgeNames = new Set(existingBadges.map(b => b.name));

    // Filter out badges that already exist
    const newBadges = defaultBadges.filter(badge => !existingBadgeNames.has(badge.name));

    if (newBadges.length === 0) {
      console.log('All badges already exist. No new badges to add.');
      process.exit(0);
    }

    // Insert only new badges
    await Badge.insertMany(newBadges);
    console.log(`Successfully added ${newBadges.length} new badges`);
    console.log(`Total badges in database: ${existingBadges.length + newBadges.length}`);
    process.exit(0);
  } catch (error) {
    console.error('Error initializing badges:', error);
    process.exit(1);
  }
};

initializeBadges();

