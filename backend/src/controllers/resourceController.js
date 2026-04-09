// COMPONENT 3: Emergency Resource & Shelter Logistics
// File: backend/src/controllers/resourceController.js
const ResourceStock = require("../models/ResourceStock");

async function listResources(req, res) {
  const { shelterId } = req.query;
  const query = {};
  if (shelterId) query.shelterId = shelterId;

  const resources = await ResourceStock.find(query).sort({ updatedAt: -1 });
  return res.json({ status: "success", data: resources });
}

async function upsertResource(req, res) {
  const { shelterId, category, itemName, quantity, unit } = req.validated.body;

  const resource = await ResourceStock.findOneAndUpdate(
    { shelterId, itemName },
    {
      shelterId,
      category,
      itemName,
      quantity,
      unit,
      updatedBy: req.user._id,
      updatedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  return res.status(201).json({ status: "success", data: resource });
}

async function lowStock(req, res) {
  const threshold = Number(req.query.threshold || 20);
  const query = { quantity: { $lte: threshold } };
  if (req.query.shelterId) query.shelterId = req.query.shelterId;

  const resources = await ResourceStock.find(query).sort({ quantity: 1 });
  return res.json({ status: "success", data: resources });
}

async function updateResource(req, res) {
  const { id } = req.validated.params;
  const updates = {
    ...req.validated.body,
    updatedBy: req.user._id,
    updatedAt: new Date(),
  };

  const resource = await ResourceStock.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!resource) {
    return res.status(404).json({ status: "error", message: "Resource not found" });
  }
  return res.json({ status: "success", data: resource });
}

async function deleteResource(req, res) {
  const { id } = req.validated.params;
  const resource = await ResourceStock.findByIdAndDelete(id);
  if (!resource) {
    return res.status(404).json({ status: "error", message: "Resource not found" });
  }
  return res.json({ status: "success", message: "Resource deleted" });
}

module.exports = { listResources, upsertResource, lowStock, updateResource, deleteResource };
