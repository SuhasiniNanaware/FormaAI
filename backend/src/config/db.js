const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let memoryServer;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URL || process.env.MONGO_URI;

    if (!mongoUri) {
      memoryServer = memoryServer || (await MongoMemoryServer.create());
      mongoUri = memoryServer.getUri();
      console.log("No Mongo URL configured. Using an in-memory MongoDB instance for local development.");
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    try {
      memoryServer = memoryServer || (await MongoMemoryServer.create());
      const fallbackUri = memoryServer.getUri();
      const conn = await mongoose.connect(fallbackUri);
      console.log(`MongoDB Connected via fallback in-memory server: ${conn.connection.host}`);
    } catch (fallbackError) {
      console.error("MongoDB Connection Failed");
      console.error(fallbackError.message || error.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;