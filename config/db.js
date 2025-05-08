const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log("⏳ Waiting before MongoDB connection...");

    // ✅ Delay to let Render cold-start MongoDB or AI service (Step 3)
    await new Promise(resolve => setTimeout(resolve, 2000));

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // timeout for initial server selection
    });

    console.log('✅ Connected to MongoDB');
    return true;
  } catch (err) {
    console.log('❌ MongoDB connection failed:', err.message);
    return false;
  }
};

module.exports = connectDB;
