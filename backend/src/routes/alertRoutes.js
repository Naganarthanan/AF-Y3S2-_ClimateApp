// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: backend/src/routes/alertRoutes.js
const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middleware/validate");
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const { manualAlertSchema } = require("../utils/validators");
const { listAlerts, createManualAlert } = require("../controllers/alertController");

const router = express.Router();

router.get("/", asyncHandler(listAlerts));
router.post("/manual", requireAuth, requireRole("admin", "superadmin"), validate(manualAlertSchema), asyncHandler(createManualAlert));

module.exports = router;