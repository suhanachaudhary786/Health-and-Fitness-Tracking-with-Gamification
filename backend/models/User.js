// User model schema for storing user information
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    age: {
      type: Number,
      min: [13, 'Age must be at least 13'],
      max: [120, 'Age must be less than 120'],
    },
    weight: {
      type: Number,
      min: [20, 'Weight must be at least 20 kg'],
      max: [300, 'Weight must be less than 300 kg'],
    },
    height: {
      type: Number,
      min: [100, 'Height must be at least 100 cm'],
      max: [250, 'Height must be less than 250 cm'],
    },
    goal: {
      type: String,
      enum: ['lose_weight', 'gain_muscle', 'maintain', 'general_fitness'],
      default: 'general_fitness',
    },
    totalPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    currentLevel: {
      type: Number,
      default: 1,
      min: 1,
    },
    badges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Badge',
      },
    ],
    streakDays: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastActivityDate: {
      type: Date,
    },
    // Password reset fields
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to update user level based on total points
userSchema.methods.updateLevel = async function () {
  const Level = mongoose.model('Level');
  const levels = await Level.find().sort({ minPoints: 1 });

  for (let i = levels.length - 1; i >= 0; i--) {
    if (this.totalPoints >= levels[i].minPoints) {
      this.currentLevel = levels[i].levelNumber;
      break;
    }
  }

  await this.save();
};

module.exports = mongoose.model('User', userSchema);

