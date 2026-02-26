// COMPONENT 4: User + Education + Analytics
// File: backend/src/models/ActivityLog.js
const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    action: {
      type: String,
      enum: ["view_alert", "view_shelter", "take_quiz", "create_plan", "open_map"],
      required: true,
    },
    regionId: { type: mongoose.Schema.Types.ObjectId, ref: "Region" },
    createdAt: { type: Date, default: Date.now, index: true },
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);