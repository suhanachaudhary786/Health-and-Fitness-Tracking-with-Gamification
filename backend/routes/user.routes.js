// User routes
const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getStats,
} = require('../controllers/user.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const {
  validateProfileUpdate,
} = require('../utils/validators');
const { handleValidationErrors } = require('../middleware/validation.middleware');

// All routes require authentication
router.use(requireAuth);

// Get user profile
router.get('/profile', getProfile);

// Update user profile
router.put('/profile', validateProfileUpdate, handleValidationErrors, updateProfile);

// Get user statistics
router.get('/stats', getStats);

module.exports = router;

