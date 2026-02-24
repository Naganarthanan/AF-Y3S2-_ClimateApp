// COMPONENT 2: Geo-Location + Safe Route / Shelter Management
// File: backend/src/controllers/zoneController.js
const UnsafeZone = require("../models/UnsafeZone");

async function listActiveZones(req, res) {
  const { regionId, disasterType } = req.query;
  const now = new Date();
  const query = {
    activeFrom: { $lte: now },
    activeTo: { $gte: now },
  };

  if (regionId) query.regionId = regionId;
  if (disasterType) query.disasterType = disasterType;

  const zones = await UnsafeZone.find(query).sort({ createdAt: -1 });
  return res.json({ status: "success", data: zones });
}

async function createZone(req, res) {
  const zone = await UnsafeZone.create(req.validated.body);
  return res.status(201).json({ status: "success", data: zone });
}

module.exports = { listActiveZones, createZone };