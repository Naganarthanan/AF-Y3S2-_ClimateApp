// COMPONENT 2: Geo-Location + Safe Route / Shelter Management
// File: backend/src/routes/zoneRoutes.js
const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middleware/validate");
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const { zoneSchema } = require("../utils/validators");
const { listActiveZones, createZone } = require("../controllers/zoneController");

const router = express.Router();

router.get("/active", asyncHandler(listActiveZones));
router.post("/", requireAuth, requireRole("admin", "superadmin"), validate(zoneSchema), asyncHandler(createZone));

module.exports = router;