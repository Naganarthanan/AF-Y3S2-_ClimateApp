const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

module.exports = {
  PORT: Number(process.env.PORT) || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/climate_risk_db",
  JWT_SECRET: process.env.JWT_SECRET || "replace_with_secure_secret",
  OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY || "",
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || "",
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || "",
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || "",
  TWILIO_FROM_NUMBER: process.env.TWILIO_FROM_NUMBER || "",
  OTP_EXPIRY_MINUTES: Number(process.env.OTP_EXPIRY_MINUTES) || 5,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
};
