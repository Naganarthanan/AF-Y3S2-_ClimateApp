// COMPONENT 4: User + Education + Analytics
// File: backend/src/controllers/educationController.js
const EducationContent = require("../models/EducationContent");

async function listEducation(req, res) {
  const docs = await EducationContent.find({}).sort({ createdAt: -1 });
  return res.json({ status: "success", data: docs });
}

async function getEducationById(req, res) {
  const doc = await EducationContent.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ status: "error", message: "Content not found" });
  }

  return res.json({ status: "success", data: doc });
}

async function createEducation(req, res) {
  const doc = await EducationContent.create(req.validated.body);
  return res.status(201).json({ status: "success", data: doc });
}

module.exports = { listEducation, getEducationById, createEducation };