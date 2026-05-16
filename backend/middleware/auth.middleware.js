// Authentication middleware to protect routes
// Checks if user is authenticated via session

const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: 'Authentication required. Please login.',
  });
};

module.exports = { requireAuth };

