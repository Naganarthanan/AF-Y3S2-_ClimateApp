// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: backend/src/models/WeatherSnapshot.js
const mongoose = require("mongoose");

const weatherSnapshotSchema = new mongoose.Schema(
  {
    regionId: { type: mongoose.Schema.Types.ObjectId, ref: "Region", required: true, index: true },
    fetchedAt: { type: Date, required: true, default: Date.now, index: true },
    raw: { type: Object, default: {} },
    tempC: { type: Number, default: 0 },
    windMs: { type: Number, default: 0 },
    rain1h: { type: Number, default: 0 },
    rain3h: { type: Number, default: 0 },
    humidity: { type: Number, default: 0 },
    condition: { type: String, default: "Unknown" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WeatherSnapshot", weatherSnapshotSchema);