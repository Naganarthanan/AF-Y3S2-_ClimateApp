// COMPONENT 4: User + Education + Analytics
// File: backend/src/models/PrepPlan.js
const mongoose = require("mongoose");

const prepPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    checklistItems: [
      {
        text: { type: String, required: true },
        done: { type: Boolean, default: false },
      },
    ],
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PrepPlan", prepPlanSchema);