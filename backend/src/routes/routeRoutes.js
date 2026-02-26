// COMPONENT 2: Geo-Location + Safe Route / Shelter Management
// File: backend/src/routes/routeRoutes.js
const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { safeRouteFallback } = require("../controllers/shelterController");

const router = express.Router();
router.get("/safe", asyncHandler(safeRouteFallback));

module.exports = router;