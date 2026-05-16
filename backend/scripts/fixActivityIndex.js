// Script to fix Activity collection index
// Removes the unique constraint from userId_1_date_1 index to allow multiple activities per day
// Run this script once: node backend/scripts/fixActivityIndex.js

require('dotenv').config();
const mongoose = require('mongoose');
const Activity = require('../models/Activity');

const fixActivityIndex = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/health-fitness';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Get the collection
    const collection = mongoose.connection.collection('activities');
    
    // Get all indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes);

    // Check if unique index exists
    const uniqueIndex = indexes.find(
      index => 
        index.key && 
        index.key.userId === 1 && 
        index.key.date === 1 && 
        index.unique === true
    );

    if (uniqueIndex) {
      console.log('Found unique index on userId_1_date_1, removing it...');
      
      // Drop the unique index
      await collection.dropIndex(uniqueIndex.name);
      console.log(`Dropped unique index: ${uniqueIndex.name}`);
      
      // Create non-unique index
      await collection.createIndex({ userId: 1, date: 1 }, { unique: false });
      console.log('Created non-unique index on userId_1_date_1');
    } else {
      console.log('No unique index found on userId_1_date_1');
      
      // Ensure non-unique index exists
      const nonUniqueIndex = indexes.find(
        index => 
          index.key && 
          index.key.userId === 1 && 
          index.key.date === 1
      );

      if (!nonUniqueIndex) {
        await collection.createIndex({ userId: 1, date: 1 }, { unique: false });
        console.log('Created non-unique index on userId_1_date_1');
      } else {
        console.log('Non-unique index already exists');
      }
    }

    // Verify final state
    const finalIndexes = await collection.indexes();
    console.log('\nFinal indexes:');
    finalIndexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)} (unique: ${index.unique || false})`);
    });

    console.log('\n✅ Index fix completed successfully!');
    console.log('You can now add multiple activities per day for the same user.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error fixing index:', error);
    process.exit(1);
  }
};

// Run the script
fixActivityIndex();

