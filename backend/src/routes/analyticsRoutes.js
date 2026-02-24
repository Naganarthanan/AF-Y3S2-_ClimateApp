// COMPONENT 4: User + Education + Analytics
// File: backend/src/routes/analyticsRoutes.js
const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const { analyticsSummary } = require("../controllers/analyticsController");

const router = express.Router();

router.get("/summary", requireAuth, requireRole("admin", "superadmin"), asyncHandler(analyticsSummary));

module.exports = router;