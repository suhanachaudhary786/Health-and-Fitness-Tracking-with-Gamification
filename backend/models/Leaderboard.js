// Leaderboard model for caching leaderboard data
// This is optional - can also calculate on the fly
const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['overall', 'weekly', 'monthly'],
      required: true,
    },
    category: {
      type: String,
      enum: ['points', 'steps', 'calories', 'streak'],
      required: true,
    },
    period: {
      type: String, // '2024-W15' for weekly, '2024-03' for monthly
      required: true,
    },
    rankings: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        username: String,
        value: Number,
        rank: Number,
      },
    ],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
leaderboardSchema.index({ type: 1, category: 1, period: 1 }, { unique: true });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);

