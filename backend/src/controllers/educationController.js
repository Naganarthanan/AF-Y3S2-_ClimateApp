// COMPONENT 4: User + Education + Analytics
// File: backend/src/controllers/educationController.js
const EducationContent = require("../models/EducationContent");
const { fetchYouTubeEducation } = require("../services/externalEducationService");

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

async function updateEducation(req, res) {
  const { id } = req.validated.params;
  const doc = await EducationContent.findByIdAndUpdate(id, req.validated.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return res.status(404).json({ status: "error", message: "Content not found" });
  }

  return res.json({ status: "success", data: doc });
}

async function deleteEducation(req, res) {
  const { id } = req.validated.params;
  const doc = await EducationContent.findByIdAndDelete(id);

  if (!doc) {
    return res.status(404).json({ status: "error", message: "Content not found" });
  }

  return res.json({ status: "success", message: "Content deleted" });
}

async function listYouTubeEducation(req, res) {
  const data = await fetchYouTubeEducation({
    q: req.query.q,
    disasterType: req.query.disasterType,
    limit: req.query.limit,
  });
  return res.json({ status: "success", data });
}

module.exports = {
  listEducation,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
  listYouTubeEducation,
};
