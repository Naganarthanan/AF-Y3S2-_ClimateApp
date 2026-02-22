// COMPONENT 4: User + Education + Analytics
// File: backend/src/models/QuizQuestion.js
const mongoose = require("mongoose");

const quizQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true },
    disasterType: { type: String, required: true },
    difficulty: { type: String, default: "easy" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuizQuestion", quizQuestionSchema);