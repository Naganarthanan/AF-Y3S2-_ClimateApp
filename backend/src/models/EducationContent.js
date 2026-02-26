// COMPONENT 4: User + Education + Analytics
// File: backend/src/models/EducationContent.js
const mongoose = require("mongoose");

const educationContentSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["article", "video"], required: true },
    title: { type: String, required: true },
    bodyOrUrl: { type: String, required: true },
    tags: [{ type: String }],
    disasterType: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EducationContent", educationContentSchema);