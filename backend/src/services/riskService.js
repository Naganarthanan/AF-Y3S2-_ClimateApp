// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: backend/src/services/riskService.js
const WeatherSnapshot = require("../models/WeatherSnapshot");
const RiskAssessment = require("../models/RiskAssessment");
const { computeRisk } = require("../utils/riskEngine");

async function saveSnapshotAndRisk(regionId, weather) {
  const snapshot = await WeatherSnapshot.create({
    regionId,
    fetchedAt: new Date(),
    raw: weather.raw,
    tempC: weather.tempC,
    windMs: weather.windMs,
    rain1h: weather.rain1h,
    rain3h: weather.rain3h,
    humidity: weather.humidity,
    condition: weather.condition,
  });

  const risk = computeRisk(weather);

  const assessment = await RiskAssessment.create({
    regionId,
    assessedAt: new Date(),
    riskScore: risk.riskScore,
    severity: risk.severity,
    reasons: risk.reasons,
    source: "OWM",
  });

  return { snapshot, assessment };
}

module.exports = { saveSnapshotAndRisk };