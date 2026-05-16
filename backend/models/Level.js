// Level model schema for storing level configurations
const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema(
  {
    levelNumber: {
      type: Number,
      required: [true, 'Level number is required'],
      unique: true,
      min: 1,
    },
    title: {
      type: String,
      required: [true, 'Level title is required'],
      trim: true,
    },
    minPoints: {
      type: Number,
      required: [true, 'Minimum points is required'],
      min: 0,
    },
    maxPoints: {
      type: Number,
    },
    color: {
      type: String,
      default: '#4CAF50',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient level lookup
levelSchema.index({ minPoints: 1 });

module.exports = mongoose.model('Level', levelSchema);

