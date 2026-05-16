// Constants for the application
// Points rules, badge requirements, and other configuration

export const GOAL_OPTIONS = [
  { value: 'lose_weight', label: 'Lose Weight' },
  { value: 'gain_muscle', label: 'Gain Muscle' },
  { value: 'maintain', label: 'Maintain Current Weight' },
  { value: 'general_fitness', label: 'General Fitness' },
];

// Get goal label from value
export const getGoalLabel = (value) => {
  const goal = GOAL_OPTIONS.find((option) => option.value === value);
  return goal ? goal.label : value;
};

export const POINTS_RULES = {
  steps: { per: 100, max: 100 }, // 1 point per 100 steps, max 100 points
  distance: { per: 1, max: 50 }, // 10 points per km, max 50 points
  exerciseTime: { per: 1, max: 60 }, // 2 points per minute, max 60 points
  calories: { per: 10, max: 50 }, // 1 point per 10 calories, max 50 points
  activityBonus: 10, // Bonus for completing 2+ activity types
  allTypesBonus: 10, // Additional bonus for completing all 4 types (optional)
  streakBonus: { per: 1, max: 50 }, // 10 points per consecutive day, max 50
};

// Use relative path to leverage Vite proxy for proper cookie handling
// In development, Vite proxy handles /api requests
// In production, use full URL from environment variable
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

