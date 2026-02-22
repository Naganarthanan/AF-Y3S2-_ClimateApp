// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: backend/src/config/env.js
const dotenv = require("dotenv");

dotenv.config();

const env = {
  PORT: Number(process.env.PORT || 5000),
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/climate_risk_db",
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret",
  OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY || "",
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173"||"http://localhost:5174",
  NODE_ENV: process.env.NODE_ENV || "development",
};

module.exports = env;