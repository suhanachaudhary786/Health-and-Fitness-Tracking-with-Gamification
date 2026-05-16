// Badge model schema for storing badge definitions
const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Badge name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Badge description is required'],
    },
    icon: {
      type: String,
      default: '🏆',
    },
    category: {
      type: String,
      enum: ['activity', 'streak', 'milestone'],
      required: [true, 'Badge category is required'],
    },
    requirement: {
      type: {
        type: String,
        enum: ['steps', 'streak', 'total_activities', 'points', 'distance', 'calories', 'exerciseTime'],
        required: [true, 'Requirement type is required'],
      },
      value: {
        type: Number,
        required: [true, 'Requirement value is required'],
        min: 0,
      },
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

module.exports = mongoose.model('Badge', badgeSchema);

