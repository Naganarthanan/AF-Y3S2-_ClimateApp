// COMPONENT 4: User + Education + Analytics
// File: backend/src/routes/quizRoutes.js
const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middleware/validate");
const requireAuth = require("../middleware/requireAuth");
const { quizSubmitSchema } = require("../utils/validators");
const { listQuizQuestions, submitQuiz } = require("../controllers/quizController");

const router = express.Router();

router.get("/", asyncHandler(listQuizQuestions));
router.post("/submit", requireAuth, validate(quizSubmitSchema), asyncHandler(submitQuiz));

module.exports = router;