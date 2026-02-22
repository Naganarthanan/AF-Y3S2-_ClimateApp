// COMPONENT 4: User + Education + Analytics
// File: backend/src/routes/authRoutes.js
const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middleware/validate");
const requireAuth = require("../middleware/requireAuth");
const { authLimiter } = require("../middleware/rateLimit");
const { authRegisterSchema, authLoginSchema } = require("../utils/validators");
const { register, login, me } = require("../controllers/authController");

const router = express.Router();

router.post("/register", authLimiter, validate(authRegisterSchema), asyncHandler(register));
router.post("/login", authLimiter, validate(authLoginSchema), asyncHandler(login));
router.get("/me", requireAuth, asyncHandler(me));

module.exports = router;