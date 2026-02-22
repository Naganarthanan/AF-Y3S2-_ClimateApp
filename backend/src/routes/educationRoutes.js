// COMPONENT 4: User + Education + Analytics
// File: backend/src/routes/educationRoutes.js
const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middleware/validate");
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const { educationCreateSchema } = require("../utils/validators");
const { listEducation, getEducationById, createEducation } = require("../controllers/educationController");

const router = express.Router();

router.get("/", asyncHandler(listEducation));
router.get("/:id", asyncHandler(getEducationById));
router.post("/", requireAuth, requireRole("admin", "superadmin"), validate(educationCreateSchema), asyncHandler(createEducation));

module.exports = router;