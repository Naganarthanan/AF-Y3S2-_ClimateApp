// COMPONENT 4: User + Education + Analytics
// File: backend/src/controllers/analyticsController.js
const { getAnalyticsSummary } = require("../services/analyticsService");

async function analyticsSummary(req, res) {
  const summary = await getAnalyticsSummary();
  return res.json({ status: "success", data: summary });
}

module.exports = { analyticsSummary };