// Activity model schema for storing daily activity entries
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    steps: {
      type: Number,
      default: 0,
      min: [0, 'Steps cannot be negative'],
    },
    distance: {
      type: Number,
      default: 0,
      min: [0, 'Distance cannot be negative'],
    },
    exerciseTime: {
      type: Number,
      default: 0,
      min: [0, 'Exercise time cannot be negative'],
    },
    calories: {
      type: Number,
      default: 0,
      min: [0, 'Calories cannot be negative'],
    },
    pointsEarned: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries (non-unique to allow multiple activities per day)
activitySchema.index({ userId: 1, date: 1 });

// Function to fix unique index issue
// Call this after database connection to ensure index is non-unique
activitySchema.statics.fixUniqueIndex = async function() {
  try {
    const collection = this.collection;
    const indexes = await collection.indexes();
    
    // Find unique index on userId_1_date_1
    const uniqueIndex = indexes.find(
      index => 
        index.key && 
        index.key.userId === 1 && 
        index.key.date === 1 && 
        index.unique === true
    );

    if (uniqueIndex) {
      console.log('⚠️  Found unique index on activities.userId_1_date_1, removing it...');
      try {
        await collection.dropIndex(uniqueIndex.name);
        console.log('✅ Dropped unique index:', uniqueIndex.name);
        
        // Recreate as non-unique
        await collection.createIndex({ userId: 1, date: 1 }, { unique: false });
        console.log('✅ Created non-unique index on userId_1_date_1');
      } catch (err) {
        // Index might not exist or already dropped
        if (err.code !== 27 && err.code !== 85) { // 27 = IndexNotFound, 85 = IndexOptionsConflict
          console.error('Error fixing index:', err.message);
        }
      }
    }
  } catch (error) {
    // Silently fail - this is just a fix attempt
    console.error('Error checking indexes:', error.message);
  }
};

module.exports = mongoose.model('Activity', activitySchema);

