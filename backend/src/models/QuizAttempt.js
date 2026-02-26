// COMPONENT 4: User + Education + Analytics
// File: backend/src/models/QuizAttempt.js
const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    disasterType: { type: String, required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);