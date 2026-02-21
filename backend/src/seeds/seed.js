// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: backend/src/seeds/seed.js
const env = require("../config/env");
const { connectDB } = require("../config/db");
const Region = require("../models/Region");
const Shelter = require("../models/Shelter");
const EducationContent = require("../models/EducationContent");
const QuizQuestion = require("../models/QuizQuestion");
const User = require("../models/User");
const ResourceStock = require("../models/ResourceStock");
const { regionSeeds, shelterSeeds, educationSeeds, quizSeeds, buildUsers } = require("./seedData");

async function seed() {
  await connectDB(env.MONGO_URI);

  await Promise.all([
    Region.deleteMany({}),
    Shelter.deleteMany({}),
    EducationContent.deleteMany({}),
    QuizQuestion.deleteMany({}),
    User.deleteMany({}),
    ResourceStock.deleteMany({}),
  ]);

  const regions = await Region.insertMany(regionSeeds);
  const regionMap = new Map(regions.map((region) => [region.name, region]));

  const sheltersPayload = shelterSeeds.map((shelter) => ({
    name: shelter.name,
    address: shelter.address,
    regionId: regionMap.get(shelter.region)._id,
    lat: shelter.lat,
    lng: shelter.lng,
    capacity: shelter.capacity,
    currentOccupancy: shelter.currentOccupancy,
    shelterType: shelter.shelterType,
    isActive: true,
  }));

  const shelters = await Shelter.insertMany(sheltersPayload);
  await EducationContent.insertMany(educationSeeds);
  await QuizQuestion.insertMany(quizSeeds);

  const users = await buildUsers();
  await User.insertMany(users);

  const stockRows = [];
  shelters.slice(0, 5).forEach((shelter) => {
    stockRows.push({ shelterId: shelter._id, category: "food", itemName: "Rice Packs", quantity: 120, unit: "packs" });
    stockRows.push({ shelterId: shelter._id, category: "water", itemName: "Water Bottles", quantity: 200, unit: "bottles" });
    stockRows.push({ shelterId: shelter._id, category: "medical", itemName: "First Aid Kits", quantity: 25, unit: "kits" });
  });

  await ResourceStock.insertMany(stockRows);

  console.log("Seed completed successfully");
  console.log("Superadmin: superadmin@climate.lk / SuperAdmin@123");
  console.log("Admin: admin@climate.lk / Admin@123");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});