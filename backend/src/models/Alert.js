// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: backend/src/models/Alert.js
const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    regionId: { type: mongoose.Schema.Types.ObjectId, ref: "Region", required: true, index: true },
    createdAt: { type: Date, default: Date.now, index: true },
    expiresAt: { type: Date },
    severity: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    source: { type: String, enum: ["OWM", "Manual"], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);