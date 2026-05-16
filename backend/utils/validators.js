// Validation rules using express-validator
const { body } = require('express-validator');

// Registration validation rules
const validateRegister = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('age')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 13, max: 120 })
    .withMessage('Age must be between 13 and 120'),
  body('weight')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 20, max: 300 })
    .withMessage('Weight must be between 20 and 300 kg'),
  body('height')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 100, max: 250 })
    .withMessage('Height must be between 100 and 250 cm'),
  body('goal')
    .optional()
    .isIn(['lose_weight', 'gain_muscle', 'maintain', 'general_fitness'])
    .withMessage('Invalid goal type'),
];

// Login validation rules
const validateLogin = [
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Profile update validation rules
const validateProfileUpdate = [
  body('age')
    .optional()
    .isInt({ min: 13, max: 120 })
    .withMessage('Age must be between 13 and 120'),
  body('weight')
    .optional()
    .isFloat({ min: 20, max: 300 })
    .withMessage('Weight must be between 20 and 300 kg'),
  body('height')
    .optional()
    .isFloat({ min: 100, max: 250 })
    .withMessage('Height must be between 100 and 250 cm'),
  body('goal')
    .optional()
    .isIn(['lose_weight', 'gain_muscle', 'maintain', 'general_fitness'])
    .withMessage('Invalid goal type'),
];

// Activity validation rules
const validateActivity = [
  body('date').optional().isISO8601().withMessage('Invalid date format'),
  body('steps')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Steps must be a positive number'),
  body('distance')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Distance must be a positive number'),
  body('exerciseTime')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Exercise time must be a positive number'),
  body('calories')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Calories must be a positive number'),
  // Custom validation: At least one activity field must have a value
  body().custom((value) => {
    const steps = parseFloat(value.steps) || 0;
    const distance = parseFloat(value.distance) || 0;
    const exerciseTime = parseFloat(value.exerciseTime) || 0;
    const calories = parseFloat(value.calories) || 0;

    if (steps === 0 && distance === 0 && exerciseTime === 0 && calories === 0) {
      return Promise.reject('At least one activity value must be provided (steps, distance, exercise time, or calories)');
    }
    return true;
  }),
];

module.exports = {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validateActivity,
};

