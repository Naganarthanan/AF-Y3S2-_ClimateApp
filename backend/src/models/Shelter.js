// COMPONENT 2: Geo-Location + Safe Route / Shelter Management
// File: backend/src/models/Shelter.js
const mongoose = require("mongoose");

const shelterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    regionId: { type: mongoose.Schema.Types.ObjectId, ref: "Region", required: true, index: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    capacity: { type: Number, required: true },
    currentOccupancy: { type: Number, default: 0 },
    shelterType: { type: String, default: "General" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shelter", shelterSchema);