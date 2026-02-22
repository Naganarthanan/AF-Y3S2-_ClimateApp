// COMPONENT 4: User + Education + Analytics
// File: backend/src/routes/prepPlanRoutes.js
const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middleware/validate");
const requireAuth = require("../middleware/requireAuth");
const { prepPlanSchema } = require("../utils/validators");
const { getPrepPlan, updatePrepPlan } = require("../controllers/prepPlanController");

const router = express.Router();

router.get("/", requireAuth, asyncHandler(getPrepPlan));
router.put("/", requireAuth, validate(prepPlanSchema), asyncHandler(updatePrepPlan));

module.exports = router;