// Gamification routes
const express = require('express');
const router = express.Router();
const {
  getPoints,
  getBadges,
  getAvailableBadges,
  getLevel,
} = require('../controllers/gamification.controller');
const { requireAuth } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(requireAuth);

// Get current points and level
router.get('/points', getPoints);

// Get user's earned badges
router.get('/badges', getBadges);

// Get all available badges with status
router.get('/available-badges', getAvailableBadges);

// Get current level information
router.get('/level', getLevel);

module.exports = router;

