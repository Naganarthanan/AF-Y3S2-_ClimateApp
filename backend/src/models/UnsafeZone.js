// COMPONENT 2: Geo-Location + Safe Route / Shelter Management
// File: backend/src/models/UnsafeZone.js
const mongoose = require("mongoose");

const unsafeZoneSchema = new mongoose.Schema(
  {
    regionId: { type: mongoose.Schema.Types.ObjectId, ref: "Region", required: true, index: true },
    disasterType: { type: String, enum: ["Flood", "Cyclone", "Heat"], required: true },
    shapeType: { type: String, enum: ["circle"], default: "circle" },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    radiusKm: { type: Number, required: true },
    severity: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], required: true },
    activeFrom: { type: Date, required: true },
    activeTo: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UnsafeZone", unsafeZoneSchema);