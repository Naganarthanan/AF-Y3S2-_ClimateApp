// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: backend/src/routes/weatherRoutes.js
const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { weatherHistory } = require("../controllers/riskController");

const router = express.Router();
router.get("/history", asyncHandler(weatherHistory));

module.exports = router;