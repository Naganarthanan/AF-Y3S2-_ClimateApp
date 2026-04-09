// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: backend/src/controllers/alertController.js
const Alert = require("../models/Alert");

async function listAlerts(req, res) {
  const { regionId, severity, source, from, to } = req.query;
  const query = {};

  if (regionId) query.regionId = regionId;
  if (severity) query.severity = severity;
  if (source) query.source = source;
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

async function updateManualAlert(req, res) {
  const { regionId, severity, title, description, expiresAt } = req.validated.body;
  const alert = await Alert.findById(req.params.id);

  if (!alert) {
    return res.status(404).json({ status: "error", message: "Alert not found" });
  }
  if (alert.source !== "Manual") {
    return res.status(400).json({ status: "error", message: "Only manual alerts can be edited" });
  }

  alert.regionId = regionId;
  alert.severity = severity;
  alert.title = title;
  alert.description = description;
  alert.expiresAt = expiresAt;
  await alert.save();

  return res.json({ status: "success", data: alert });
}

async function deleteAlert(req, res) {
  const alert = await Alert.findById(req.params.id);
  if (!alert) {
    return res.status(404).json({ status: "error", message: "Alert not found" });
  }
  if (alert.source !== "Manual") {
    return res.status(400).json({ status: "error", message: "Only manual alerts can be deleted" });
  }

  await Alert.findByIdAndDelete(req.params.id);
  return res.json({ status: "success", message: "Alert deleted successfully" });
}

module.exports = { listAlerts, createManualAlert, updateManualAlert, deleteAlert };
