// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: backend/src/models/Region.js
const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    province: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    radiusKm: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Region", regionSchema);