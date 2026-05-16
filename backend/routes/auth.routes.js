// Authentication routes
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  verifyResetToken,
  resetPassword,
} = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const {
  validateRegister,
  validateLogin,
} = require('../utils/validators');
const { handleValidationErrors } = require('../middleware/validation.middleware');

// Register new user
router.post('/register', validateRegister, handleValidationErrors, register);

// Login user
router.post('/login', validateLogin, handleValidationErrors, login);

// Logout user
router.post('/logout', logout);

// Get current user from session
router.get('/me', requireAuth, getMe);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-token', verifyResetToken);
router.post('/reset-password', resetPassword);

module.exports = router;

