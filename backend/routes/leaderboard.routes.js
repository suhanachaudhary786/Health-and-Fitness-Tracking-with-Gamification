// Leaderboard routes
const express = require('express');
const router = express.Router();
const {
  getOverall,
  getWeekly,
  getMonthly,
  getMyRank,
} = require('../controllers/leaderboard.controller');
const { requireAuth } = require('../middleware/auth.middleware');

// Get overall leaderboard (public)
router.get('/overall', getOverall);

// Get weekly leaderboard
router.get('/weekly', getWeekly);

// Get monthly leaderboard
router.get('/monthly', getMonthly);

// Get user's rank (requires auth)
router.get('/my-rank', requireAuth, getMyRank);

module.exports = router;

