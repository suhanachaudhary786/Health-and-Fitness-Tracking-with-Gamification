// Validation middleware using express-validator
const { validationResult } = require('express-validator');

// Middleware to check validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Get first error message for better user experience
    const firstError = errors.array()[0];
    return res.status(400).json({
      success: false,
      message: firstError.msg || 'Validation failed',
      errors: errors.array(),
    });
  }

  next();
};

module.exports = { handleValidationErrors };

