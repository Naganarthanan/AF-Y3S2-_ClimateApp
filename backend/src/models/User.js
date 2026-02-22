// COMPONENT 4: User + Education + Analytics
// File: backend/src/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["citizen", "admin", "superadmin"], default: "citizen" },
    defaultRegionId: { type: mongoose.Schema.Types.ObjectId, ref: "Region" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);