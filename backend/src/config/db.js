// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: backend/src/config/db.js
const mongoose = require("mongoose");

async function connectDB(mongoUri) {
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed", error.message);
    throw error;
  }
}

module.exports = { connectDB };