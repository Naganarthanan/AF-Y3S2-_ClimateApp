// COMPONENT 4: User + Education + Analytics
// File: backend/src/routes/activityRoutes.js
const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middleware/validate");
const requireAuth = require("../middleware/requireAuth");
const { activitySchema } = require("../utils/validators");
const { logActivity } = require("../controllers/activityController");

const router = express.Router();

router.post("/", requireAuth, validate(activitySchema), asyncHandler(logActivity));

module.exports = router;