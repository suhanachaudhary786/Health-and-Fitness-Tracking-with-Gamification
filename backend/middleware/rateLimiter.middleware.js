// Rate limiting middleware
// Basic rate limiting to prevent abuse

const rateLimitMap = new Map();

// Simple in-memory rate limiter (for production, use redis or similar)
const rateLimiter = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!rateLimitMap.has(key)) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const record = rateLimitMap.get(key);

    if (now > record.resetTime) {
      // Reset window
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
      });
    }

    record.count++;
    next();
  };
};

module.exports = rateLimiter;

