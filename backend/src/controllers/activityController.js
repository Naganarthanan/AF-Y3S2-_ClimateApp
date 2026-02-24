// COMPONENT 4: User + Education + Analytics
// File: backend/src/controllers/activityController.js
const ActivityLog = require("../models/ActivityLog");

async function logActivity(req, res) {
  const log = await ActivityLog.create({
    userId: req.user._id,
    action: req.validated.body.action,
    regionId: req.validated.body.regionId,
    meta: req.validated.body.meta || {},
  });

  return res.status(201).json({ status: "success", data: log });
}

module.exports = { logActivity };