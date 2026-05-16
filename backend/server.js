// Main server file
// Express application entry point

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const connectDB = require('./config/database');
const { initializeDefaultLevels } = require('./services/level.service');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const activityRoutes = require('./routes/activity.routes');
const gamificationRoutes = require('./routes/gamification.routes');
const challengeRoutes = require('./routes/challenge.routes');
const leaderboardRoutes = require('./routes/leaderboard.routes');

// Connect to database and fix Activity index
(async () => {
  await connectDB();

  // Fix Activity collection unique index issue
  // This allows multiple activities per day for the same user
  try {
    const Activity = require('./models/Activity');
    await Activity.fixUniqueIndex();
  } catch (error) {
    console.error('Error fixing Activity index:', error.message);
  }
})();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://health-and-fitness-tracking-with-xhcx.onrender.com',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting (apply before routes)
const rateLimiter = require('./middleware/rateLimiter.middleware');
app.use('/api/', rateLimiter(15 * 60 * 1000, 100)); // 100 requests per 15 minutes

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler (must be before error handler)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware (must be last)
const errorHandler = require('./middleware/errorHandler.middleware');
app.use(errorHandler);

// Initialize default levels on server start
initializeDefaultLevels().catch((err) => {
  console.error('Error initializing levels:', err);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

