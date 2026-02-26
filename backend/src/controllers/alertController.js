// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: backend/src/controllers/alertController.js
const Alert = require("../models/Alert");

async function listAlerts(req, res) {
  const { regionId, severity, from, to } = req.query;
  const query = {};

  if (regionId) query.regionId = regionId;
  if (severity) query.severity = severity;
  if (from || to) {
    query.createdAt = {};
    if (from) query.createdAt.$gte = new Date(from);
    if (to) query.createdAt.$lte = new Date(to);
  }

  const alerts = await Alert.find(query).sort({ createdAt: -1 }).limit(200);
  return res.json({ status: "success", data: alerts });
}

async function createManualAlert(req, res) {
  const { regionId, severity, title, description, expiresAt } = req.validated.body;

  const alert = await Alert.create({
    regionId,
    severity,
    title,
    description,
    source: "Manual",
    expiresAt,
  });

  return res.status(201).json({ status: "success", data: alert });
}

module.exports = { listAlerts, createManualAlert };