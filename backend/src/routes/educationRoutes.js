// COMPONENT 4: User + Education + Analytics
// File: backend/src/routes/educationRoutes.js
const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middleware/validate");
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const { educationCreateSchema, educationUpdateSchema, educationIdParamSchema } = require("../utils/validators");
const {
  listEducation,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
  listYouTubeEducation,
} = require("../controllers/educationController");

const router = express.Router();

router.get("/", asyncHandler(listEducation));
router.get("/external/youtube", asyncHandler(listYouTubeEducation));
router.get("/:id", asyncHandler(getEducationById));
router.post("/", requireAuth, requireRole("admin", "superadmin"), validate(educationCreateSchema), asyncHandler(createEducation));
router.put("/:id", requireAuth, requireRole("admin", "superadmin"), validate(educationUpdateSchema), asyncHandler(updateEducation));
router.delete("/:id", requireAuth, requireRole("admin", "superadmin"), validate(educationIdParamSchema), asyncHandler(deleteEducation));

module.exports = router;
