// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: backend/src/jobs/riskPoller.js
const cron = require("node-cron");
const Region = require("../models/Region");
const { fetchRegionWeather } = require("../services/owmService");
const { saveSnapshotAndRisk } = require("../services/riskService");
const { deriveAlertIfNeeded } = require("./alertDeriver");

async function runRiskPollingCycle() {
  const regions = await Region.find({});

  for (const region of regions) {
    try {
      const weather = await fetchRegionWeather(region);
      const { assessment } = await saveSnapshotAndRisk(region._id, weather);
      await deriveAlertIfNeeded(assessment);
    } catch (error) {
      console.error(`Risk poll failed for region ${region.name}:`, error.message);
    }
  }
}

function startRiskPoller() {
  cron.schedule("*/10 * * * *", async () => {
    await runRiskPollingCycle();
  });

  runRiskPollingCycle().catch((error) => {
    console.error("Initial risk polling cycle failed", error.message);
  });
}

module.exports = { startRiskPoller, runRiskPollingCycle };