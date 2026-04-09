// COMPONENT 4: User + Education + Analytics
// File: backend/src/routes/authRoutes.js
const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middleware/validate");
const requireAuth = require("../middleware/requireAuth");
const { authLimiter } = require("../middleware/rateLimit");
const {
  authRegisterSchema,
  authLoginSchema,
  authForgotPasswordSchema,
  authVerifyResetOtpSchema,
  authResetPasswordSchema,
} = require("../utils/validators");
const {
  register,
  login,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  me,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", authLimiter, validate(authRegisterSchema), asyncHandler(register));
router.post("/login", authLimiter, validate(authLoginSchema), asyncHandler(login));
router.post("/forgot-password", authLimiter, validate(authForgotPasswordSchema), asyncHandler(forgotPassword));
router.post("/verify-reset-otp", authLimiter, validate(authVerifyResetOtpSchema), asyncHandler(verifyResetOtp));
router.post("/reset-password", authLimiter, validate(authResetPasswordSchema), asyncHandler(resetPassword));
router.get("/me", requireAuth, asyncHandler(me));

module.exports = router;
