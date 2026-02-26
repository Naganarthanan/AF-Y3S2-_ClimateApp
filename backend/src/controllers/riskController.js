
const Region = require("../models/Region");
const RiskAssessment = require("../models/RiskAssessment");
const WeatherSnapshot = require("../models/WeatherSnapshot");
const { nearestRegion } = require("../utils/geo");
const { RISK_THRESHOLDS } = require("../utils/riskEngine");

async function currentRiskByCoordinates(req, res) {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return res.status(400).json({ status: "error", message: "lat and lng are required" });
  }

  const regions = await Region.find({});
  const nearest = nearestRegion(lat, lng, regions);

  if (!nearest.nearest) {
    return res.status(404).json({ status: "error", message: "No region found" });
  }

  const risk = await RiskAssessment.findOne({ regionId: nearest.nearest._id }).sort({ assessedAt: -1 });
  return res.json({ status: "success", data: { region: nearest.nearest, distanceKm: nearest.distanceKm, risk } });
}

async function riskByRegion(req, res) {
  const { regionId } = req.params;
  const risk = await RiskAssessment.findOne({ regionId }).sort({ assessedAt: -1 });

  if (!risk) {

    return res.json({
      status: "success",
      data: {
        regionId,
        assessedAt: new Date(),
        riskScore: 0,
        severity: "LOW",
        reasons: ["No weather data yet. Check OPENWEATHER_API_KEY activation and polling."],
        explain: {
          version: "risk-rules-v1",
          inputs: { rain1h: 0, rain3h: 0, windMs: 0, tempC: 0, humidity: 0, condition: "Unknown", alertsCount: 0 },
          matchedRules: [],
          thresholds: RISK_THRESHOLDS,
          totalFromRules: 0,
        },
        source: "OWM",
      },
    });
  }

  return res.json({ status: "success", data: risk });
}

async function weatherHistory(req, res) {
  const { regionId, days = 7 } = req.query;
  const startDate = new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000);
  const query = { fetchedAt: { $gte: startDate } };
  if (regionId) query.regionId = regionId;

  const snapshots = await WeatherSnapshot.find(query).sort({ fetchedAt: 1 }).limit(500);
  return res.json({ status: "success", data: snapshots });
}

module.exports = { currentRiskByCoordinates, riskByRegion, weatherHistory };
