// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: backend/src/jobs/alertDeriver.js
const Alert = require("../models/Alert");

async function deriveAlertIfNeeded(assessment) {
  if (!["HIGH", "CRITICAL"].includes(assessment.severity)) {
    return null;
  }

  const dedupeCutoff = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const existing = await Alert.findOne({
    regionId: assessment.regionId,
    severity: assessment.severity,
    source: "OWM",
    createdAt: { $gte: dedupeCutoff },
  });

  if (existing) {
    return existing;
  }

  return Alert.create({
    regionId: assessment.regionId,
    severity: assessment.severity,
    title: `${assessment.severity} climate risk detected`,
    description: assessment.reasons.join(" | "),
    source: "OWM",
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000),
  });
}

module.exports = { deriveAlertIfNeeded };