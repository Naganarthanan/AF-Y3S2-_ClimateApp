// COMPONENT 2: Geo-Location + Safe Route / Shelter Management
// File: backend/src/controllers/shelterController.js
const Shelter = require("../models/Shelter");
const UnsafeZone = require("../models/UnsafeZone");
const { distanceKm, insideCircle } = require("../utils/geo");

async function nearbyShelters(req, res) {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const radiusKm = Number(req.query.radiusKm || 50);

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return res.status(400).json({ status: "error", message: "lat and lng are required" });
  }

  const shelters = await Shelter.find({ isActive: true });
  const withDistance = shelters
    .map((shelter) => ({
      ...shelter.toObject(),
      distanceKm: distanceKm(lat, lng, shelter.lat, shelter.lng),
    }))
    .filter((shelter) => shelter.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 50);

  return res.json({ status: "success", data: withDistance });
}

async function shelterById(req, res) {
  const shelter = await Shelter.findById(req.params.id).populate("regionId");
  if (!shelter) {
    return res.status(404).json({ status: "error", message: "Shelter not found" });
  }

  return res.json({ status: "success", data: shelter });
}

async function createShelter(req, res) {
  const shelter = await Shelter.create(req.validated.body);
  return res.status(201).json({ status: "success", data: shelter });
}

async function updateShelter(req, res) {
  const shelter = await Shelter.findByIdAndUpdate(req.params.id, req.validated.body, { new: true });
  if (!shelter) {
    return res.status(404).json({ status: "error", message: "Shelter not found" });
  }

  return res.json({ status: "success", data: shelter });
}

async function safeRouteFallback(req, res) {
  const fromLat = Number(req.query.fromLat);
  const fromLng = Number(req.query.fromLng);
  const disasterType = req.query.disasterType || "Flood";

  if (Number.isNaN(fromLat) || Number.isNaN(fromLng)) {
    return res.status(400).json({ status: "error", message: "fromLat and fromLng are required" });
  }

  const [shelters, zones] = await Promise.all([
    Shelter.find({ isActive: true }),
    UnsafeZone.find({
      disasterType,
      activeFrom: { $lte: new Date() },
      activeTo: { $gte: new Date() },
    }),
  ]);

  const ranked = shelters
    .map((shelter) => {
      const distance = distanceKm(fromLat, fromLng, shelter.lat, shelter.lng);
      const insideUnsafe = zones.some((zone) => insideCircle(shelter.lat, shelter.lng, zone.lat, zone.lng, zone.radiusKm));
      return {
        ...shelter.toObject(),
        distanceKm: distance,
        insideUnsafeZone: insideUnsafe,
        navigationUrl: `https://www.google.com/maps/dir/?api=1&destination=${shelter.lat},${shelter.lng}`,
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 3);

  let recommendedId = null;
  const safeShelter = ranked.find((shelter) => !shelter.insideUnsafeZone);
  if (safeShelter) recommendedId = safeShelter._id.toString();

  return res.json({
    status: "success",
    data: ranked.map((shelter) => ({ ...shelter, recommended: shelter._id.toString() === recommendedId })),
  });
}

module.exports = { nearbyShelters, shelterById, createShelter, updateShelter, safeRouteFallback };