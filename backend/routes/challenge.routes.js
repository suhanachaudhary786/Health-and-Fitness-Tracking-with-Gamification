// Challenge routes
const express = require('express');
const router = express.Router();
const {
  getActiveChallengesController,
  createDefaultChallenges,
  checkChallengesController,
} = require('../controllers/challenge.controller');
const { requireAuth } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(requireAuth);

// Get active challenges
router.get('/active', getActiveChallengesController);

// Create default daily challenges
router.post('/create-default', createDefaultChallenges);

// Check challenges (internal use, can be called after activity creation)
router.post('/check', checkChallengesController);

module.exports = router;

