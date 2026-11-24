const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/aaradhya_setu';

  try {
    // First, attempt connecting to the configured MONGO_URI with a short timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`⚠️  Could not connect to external MongoDB at ${uri}: ${err.message}`);
    console.log('🔄 Spun up In-Memory MongoDB instance for quick prototyping...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const memUri = mongodInstance.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`✅ In-Memory MongoDB connected: ${memUri}`);
      return conn;
    } catch (memErr) {
      console.error(`❌ Failed to start in-memory MongoDB: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
