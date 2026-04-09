// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: backend/src/routes/riskRoutes.js
const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { currentRiskByCoordinates, riskByRegion, weatherHistory } = require("../controllers/riskController");

const router = express.Router();
router.get("/current", asyncHandler(currentRiskByCoordinates));
router.get("/region/:regionId", asyncHandler(riskByRegion));
router.get("/weather/history", asyncHandler(weatherHistory));

module.exports = router;