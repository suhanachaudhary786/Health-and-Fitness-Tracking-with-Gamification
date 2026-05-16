// Activity routes
const express = require('express');
const router = express.Router();
const {
  createActivity,
  getActivities,
  getTodayActivity,
  updateActivity,
  deleteActivity,
  getActivityStats,
} = require('../controllers/activity.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const {
  validateActivity,
} = require('../utils/validators');
const { handleValidationErrors } = require('../middleware/validation.middleware');

// All routes require authentication
router.use(requireAuth);

// Create new activity
router.post('/', validateActivity, handleValidationErrors, createActivity);

// Get activities (with optional filters)
router.get('/', getActivities);

// Get today's activity
router.get('/today', getTodayActivity);

// Get activity statistics
router.get('/stats', getActivityStats);

// Update activity
router.put('/:id', validateActivity, handleValidationErrors, updateActivity);

// Delete activity
router.delete('/:id', deleteActivity);

module.exports = router;

