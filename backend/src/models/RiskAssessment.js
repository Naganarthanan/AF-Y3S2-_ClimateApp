// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: backend/src/models/RiskAssessment.js
const mongoose = require("mongoose");

const riskAssessmentSchema = new mongoose.Schema(
  {
    regionId: { type: mongoose.Schema.Types.ObjectId, ref: "Region", required: true, index: true },
    assessedAt: { type: Date, required: true, default: Date.now, index: true },
    riskScore: { type: Number, required: true },
    severity: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], required: true },
    reasons: [{ type: String }],
    source: { type: String, default: "OWM" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RiskAssessment", riskAssessmentSchema);