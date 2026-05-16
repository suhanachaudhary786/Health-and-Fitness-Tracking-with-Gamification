// MongoDB database connection configuration
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use environment variable or default to local MongoDB for development
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/health-fitness';
    
    if (!process.env.MONGODB_URI) {
      console.warn('Warning: MONGODB_URI not set in .env file. Using default local MongoDB connection.');
    }

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

