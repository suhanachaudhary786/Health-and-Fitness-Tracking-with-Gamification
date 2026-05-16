// Level calculation and management service
// Handles level-related logic

const Level = require('../models/Level');

/**
 * Get level information by level number
 * @param {Number} levelNumber - Level number
 * @returns {Object} Level information
 */
const getLevelInfo = async (levelNumber) => {
  const level = await Level.findOne({ levelNumber });
  return level;
};

/**
 * Get level information by total points
 * @param {Number} totalPoints - User's total points
 * @returns {Object} Current level information
 */
const getLevelByPoints = async (totalPoints) => {
  const levels = await Level.find().sort({ minPoints: -1 });

  for (const level of levels) {
    if (totalPoints >= level.minPoints) {
      return level;
    }
  }

  // Return first level if no match
  return await Level.findOne({ levelNumber: 1 });
};

/**
 * Get next level information
 * @param {Number} currentLevel - Current level number
 * @returns {Object} Next level information or null
 */
const getNextLevel = async (currentLevel) => {
  const nextLevel = await Level.findOne({ levelNumber: currentLevel + 1 });
  return nextLevel;
};

/**
 * Calculate progress to next level
 * @param {Number} currentPoints - Current total points
 * @param {Number} currentLevel - Current level number
 * @returns {Object} Progress information
 */
const calculateLevelProgress = async (currentPoints, currentLevel) => {
  const currentLevelInfo = await getLevelInfo(currentLevel);
  const nextLevelInfo = await getNextLevel(currentLevel);

  if (!nextLevelInfo) {
    // User is at max level
    return {
      currentLevel: currentLevelInfo,
      nextLevel: null,
      progress: 100,
      pointsNeeded: 0,
    };
  }

  const pointsInCurrentLevel = currentPoints - currentLevelInfo.minPoints;
  const pointsNeededForNext = nextLevelInfo.minPoints - currentLevelInfo.minPoints;
  const progress = Math.min(
    Math.floor((pointsInCurrentLevel / pointsNeededForNext) * 100),
    100
  );

  return {
    currentLevel: currentLevelInfo,
    nextLevel: nextLevelInfo,
    progress,
    pointsNeeded: nextLevelInfo.minPoints - currentPoints,
  };
};

/**
 * Initialize default levels in database
 * This should be called once during setup
 */
const initializeDefaultLevels = async () => {
  const existingLevels = await Level.countDocuments();

  if (existingLevels > 0) {
    return; // Levels already initialized
  }

  const defaultLevels = [
    { levelNumber: 1, title: 'Beginner', minPoints: 0, color: '#9E9E9E' },
    { levelNumber: 2, title: 'Active', minPoints: 101, color: '#4CAF50' },
    {
      levelNumber: 3,
      title: 'Fitness Enthusiast',
      minPoints: 501,
      color: '#2196F3',
    },
    { levelNumber: 4, title: 'Athlete', minPoints: 1501, color: '#FF9800' },
    { levelNumber: 5, title: 'Champion', minPoints: 3001, color: '#9C27B0' },
    { levelNumber: 6, title: 'Elite', minPoints: 5001, color: '#F44336' },
  ];

  await Level.insertMany(defaultLevels);
  console.log('Default levels initialized');
};

module.exports = {
  getLevelInfo,
  getLevelByPoints,
  getNextLevel,
  calculateLevelProgress,
  initializeDefaultLevels,
};

