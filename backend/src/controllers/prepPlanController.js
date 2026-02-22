// COMPONENT 4: User + Education + Analytics
// File: backend/src/controllers/prepPlanController.js
const PrepPlan = require("../models/PrepPlan");

async function getPrepPlan(req, res) {
  let plan = await PrepPlan.findOne({ userId: req.user._id });
  if (!plan) {
    plan = await PrepPlan.create({
      userId: req.user._id,
      checklistItems: [
        { text: "Keep 3-day drinking water", done: false },
        { text: "Store first-aid kit", done: false },
        { text: "Prepare emergency contacts", done: false },
      ],
    });
  }

  return res.json({ status: "success", data: plan });
}

async function updatePrepPlan(req, res) {
  const { checklistItems } = req.validated.body;
  const plan = await PrepPlan.findOneAndUpdate(
    { userId: req.user._id },
    { checklistItems, updatedAt: new Date() },
    { upsert: true, new: true }
  );

  return res.json({ status: "success", data: plan });
}

module.exports = { getPrepPlan, updatePrepPlan };