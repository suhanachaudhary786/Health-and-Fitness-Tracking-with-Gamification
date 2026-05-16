// Helper utility functions for frontend

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date to YYYY-MM-DD for input[type="date"]
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDate = () => {
  return formatDateForInput(new Date());
};

/**
 * Calculate BMI
 */
export const calculateBMI = (weight, height) => {
  if (!weight || !height) return null;
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
};

/**
 * Get BMI category
 */
export const getBMICategory = (bmi) => {
  if (!bmi) return null;
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

/**
 * Format number with commas
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toLocaleString();
};

/**
 * Get goal label from value
 */
export const getGoalLabel = (value) => {
  const goals = {
    lose_weight: 'Lose Weight',
    gain_muscle: 'Gain Muscle',
    maintain: 'Maintain Current Weight',
    general_fitness: 'General Fitness',
  };
  return goals[value] || value;
};

