// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: backend/src/controllers/regionController.js
const Region = require("../models/Region");

async function listRegions(req, res) {
  const regions = await Region.find({}).sort({ name: 1 });
  return res.json({ status: "success", data: regions });
}

module.exports = { listRegions };