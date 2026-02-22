// COMPONENT 4: User + Education + Analytics
// File: backend/src/controllers/quizController.js
const QuizQuestion = require("../models/QuizQuestion");
const QuizAttempt = require("../models/QuizAttempt");

async function listQuizQuestions(req, res) {
  const { disasterType } = req.query;
  const query = {};
  if (disasterType) query.disasterType = disasterType;

  const questions = await QuizQuestion.find(query).limit(20);
  return res.json({ status: "success", data: questions });
}

async function submitQuiz(req, res) {
  const { answers, disasterType } = req.validated.body;
  const questionIds = answers.map((a) => a.questionId);
  const questions = await QuizQuestion.find({ _id: { $in: questionIds } });

  const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));
  let score = 0;

  answers.forEach((answer) => {
    const q = questionMap.get(answer.questionId);
    if (q && q.correctIndex === answer.selectedIndex) score += 1;
  });

  const attempt = await QuizAttempt.create({
    userId: req.user._id,
    disasterType,
    score,
    total: questions.length,
  });

  return res.json({ status: "success", data: { score, total: questions.length, attemptId: attempt._id } });
}

module.exports = { listQuizQuestions, submitQuiz };