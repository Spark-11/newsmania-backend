const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('Connected to MongoDB');
    return true;
  } catch (err) {
    console.log('MongoDB connection failed:', err.message);
    return false;
  }
};

module.exports = connectDB;