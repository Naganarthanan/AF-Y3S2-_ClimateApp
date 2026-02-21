// COMPONENT 2: Geo-Location + Safe Route / Shelter Management
// File: backend/src/routes/shelterRoutes.js
const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middleware/validate");
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const { shelterSchema } = require("../utils/validators");
const { nearbyShelters, shelterById, createShelter, updateShelter } = require("../controllers/shelterController");

const router = express.Router();

router.get("/nearby", asyncHandler(nearbyShelters));
router.get("/:id", asyncHandler(shelterById));
router.post("/", requireAuth, requireRole("admin", "superadmin"), validate(shelterSchema), asyncHandler(createShelter));
router.put("/:id", requireAuth, requireRole("admin", "superadmin"), validate(shelterSchema), asyncHandler(updateShelter));

module.exports = router;