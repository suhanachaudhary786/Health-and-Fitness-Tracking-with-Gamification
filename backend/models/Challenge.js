// Challenge model schema for daily/weekly challenges
const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    type: {
      type: String,
      enum: ['daily', 'weekly'],
      required: [true, 'Challenge type is required'],
    },
    target: {
      type: {
        type: String,
        enum: ['steps', 'distance', 'calories', 'exerciseTime', 'points'],
        required: [true, 'Target type is required'],
      },
      value: {
        type: Number,
        required: [true, 'Target value is required'],
        min: 0,
      },
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedDate: {
      type: Date,
    },
    pointsReward: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
challengeSchema.index({ userId: 1, startDate: 1, completed: 1 });

module.exports = mongoose.model('Challenge', challengeSchema);

