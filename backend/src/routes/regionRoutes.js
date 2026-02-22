// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: backend/src/routes/regionRoutes.js
const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { listRegions } = require("../controllers/regionController");

const router = express.Router();
router.get("/", asyncHandler(listRegions));

module.exports = router;