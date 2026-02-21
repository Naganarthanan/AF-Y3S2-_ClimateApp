// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: backend/src/seeds/seedData.js
const bcrypt = require("bcryptjs");

const regionSeeds = [
  { name: "Colombo", type: "District", province: "Western Province", lat: 6.9271, lng: 79.8612, radiusKm: 25 },
  { name: "Gampaha", type: "District", province: "Western Province", lat: 7.0873, lng: 79.999, radiusKm: 25 },
  { name: "Kalutara", type: "District", province: "Western Province", lat: 6.5831, lng: 79.9593, radiusKm: 25 },
  { name: "Jaffna", type: "District", province: "Northern Province", lat: 9.6615, lng: 80.0255, radiusKm: 30 },
  { name: "Trincomalee", type: "District", province: "Eastern Province", lat: 8.5874, lng: 81.2152, radiusKm: 30 },
  { name: "Batticaloa", type: "District", province: "Eastern Province", lat: 7.7102, lng: 81.6924, radiusKm: 30 },
  { name: "Kandy", type: "District", province: "Central Province", lat: 7.2906, lng: 80.6337, radiusKm: 25 },
  { name: "Nuwara Eliya", type: "District", province: "Central Province", lat: 6.9497, lng: 80.7891, radiusKm: 25 },
  { name: "Anuradhapura", type: "District", province: "North Central Province", lat: 8.3114, lng: 80.4037, radiusKm: 35 },
  { name: "Galle", type: "District", province: "Southern Province", lat: 6.0535, lng: 80.221, radiusKm: 25 },
];

const shelterSeeds = [
  { name: "Colombo Central Shelter", region: "Colombo", address: "Town Hall Rd, Colombo", lat: 6.9147, lng: 79.8642, capacity: 700, currentOccupancy: 120, shelterType: "School" },
  { name: "Wellawatte Relief Center", region: "Colombo", address: "Galle Rd, Wellawatte", lat: 6.8762, lng: 79.8598, capacity: 450, currentOccupancy: 90, shelterType: "Community Hall" },
  { name: "Pettah Emergency Hub", region: "Colombo", address: "Main St, Pettah", lat: 6.936, lng: 79.8504, capacity: 500, currentOccupancy: 140, shelterType: "Relief Camp" },
  { name: "Jaffna North Shelter", region: "Jaffna", address: "Hospital Rd, Jaffna", lat: 9.668, lng: 80.0074, capacity: 550, currentOccupancy: 160, shelterType: "School" },
  { name: "Nallur Safe Center", region: "Jaffna", address: "Nallur, Jaffna", lat: 9.6741, lng: 80.0284, capacity: 350, currentOccupancy: 95, shelterType: "Temple Hall" },
  { name: "Kandy Lake Shelter", region: "Kandy", address: "Temple St, Kandy", lat: 7.2966, lng: 80.635, capacity: 420, currentOccupancy: 80, shelterType: "Public Hall" },
  { name: "Peradeniya Support Camp", region: "Kandy", address: "Peradeniya Rd, Kandy", lat: 7.2676, lng: 80.5948, capacity: 380, currentOccupancy: 100, shelterType: "University Hall" },
  { name: "Anuradhapura City Shelter", region: "Anuradhapura", address: "Maithripala Senanayake Mawatha", lat: 8.3242, lng: 80.4081, capacity: 600, currentOccupancy: 110, shelterType: "School" },
  { name: "Mihintale Relief Point", region: "Anuradhapura", address: "Mihintale Rd", lat: 8.3564, lng: 80.5094, capacity: 300, currentOccupancy: 60, shelterType: "Temple Hall" },
  { name: "Medawachchiya Transit Shelter", region: "Anuradhapura", address: "A9 Junction", lat: 8.533, lng: 80.492, capacity: 280, currentOccupancy: 50, shelterType: "Transit Center" },
];

const educationSeeds = [
  { type: "article", title: "Flood Preparedness Basics", bodyOrUrl: "Keep emergency kits ready and avoid low-lying roads during heavy rain.", tags: ["flood", "preparedness"], disasterType: "Flood" },
  { type: "article", title: "Cyclone Safety Indoors", bodyOrUrl: "Stay inside strong buildings and avoid windows during high winds.", tags: ["cyclone", "safety"], disasterType: "Cyclone" },
  { type: "article", title: "Heatwave Health Tips", bodyOrUrl: "Drink water frequently and avoid direct sun from 11am-3pm.", tags: ["heat", "health"], disasterType: "Heat" },
  { type: "video", title: "How to Read Early Warning Alerts", bodyOrUrl: "https://example.com/videos/alert-reading", tags: ["alerts"], disasterType: "Flood" },
  { type: "video", title: "Safe Evacuation Planning", bodyOrUrl: "https://example.com/videos/evacuation", tags: ["evacuation"], disasterType: "Cyclone" },
  { type: "article", title: "Family Emergency Checklist", bodyOrUrl: "Store food, medicine, power backup, and important documents.", tags: ["family", "checklist"], disasterType: "Flood" },
  { type: "article", title: "Shelter Etiquette", bodyOrUrl: "Respect shelter rules and report missing resources immediately.", tags: ["shelter"], disasterType: "Cyclone" },
  { type: "video", title: "First Aid During Disasters", bodyOrUrl: "https://example.com/videos/first-aid", tags: ["medical"], disasterType: "Heat" },
];

const quizSeeds = [
  { question: "What is the first action during flash flood warning?", options: ["Move to higher ground", "Go to basement", "Stand near river", "Ignore warning"], correctIndex: 0, disasterType: "Flood", difficulty: "easy" },
  { question: "Wind speed above 18 m/s indicates what level in this system?", options: ["No risk", "High wind risk rule", "Only temperature risk", "Low humidity"], correctIndex: 1, disasterType: "Cyclone", difficulty: "medium" },
  { question: "Best heatwave action is:", options: ["Drink less water", "Stay hydrated", "Run at noon", "Wear heavy jacket"], correctIndex: 1, disasterType: "Heat", difficulty: "easy" },
  { question: "What is safer during cyclone?", options: ["Stand near windows", "Secure loose objects", "Drive to coast", "Climb power pole"], correctIndex: 1, disasterType: "Cyclone", difficulty: "easy" },
  { question: "Emergency bag must include:", options: ["Batteries and torch", "Fireworks", "Glass bottles", "Jewelry only"], correctIndex: 0, disasterType: "Flood", difficulty: "easy" },
  { question: "Which shelter should be preferred?", options: ["Nearest active and outside unsafe zone", "Any closed building", "Far location only", "Unsafe zone center"], correctIndex: 0, disasterType: "Flood", difficulty: "medium" },
  { question: "When should alert be shared to family?", options: ["Immediately", "After two days", "Never", "Only if power fails"], correctIndex: 0, disasterType: "Cyclone", difficulty: "easy" },
  { question: "In heat emergency, who needs priority help?", options: ["Elderly and children", "Only athletes", "Nobody", "Drivers only"], correctIndex: 0, disasterType: "Heat", difficulty: "medium" },
  { question: "What does LOW severity mean?", options: ["0-39 risk score", "120+", "Always evacuate", "No monitoring"], correctIndex: 0, disasterType: "Flood", difficulty: "easy" },
  { question: "What is a valid response to high rainfall alert?", options: ["Avoid flood-prone roads", "Swim in canals", "Park near drains", "Disable phone alerts"], correctIndex: 0, disasterType: "Flood", difficulty: "easy" },
];

async function buildUsers() {
  const superadminHash = await bcrypt.hash("SuperAdmin@123", 10);
  const adminHash = await bcrypt.hash("Admin@123", 10);

  return [
    { name: "System Superadmin", email: "superadmin@climate.lk", passwordHash: superadminHash, role: "superadmin" },//SuperAdmin@123
    { name: "District Admin", email: "admin@climate.lk", passwordHash: adminHash, role: "admin" },//Admin@123
  ];
}

module.exports = { regionSeeds, shelterSeeds, educationSeeds, quizSeeds, buildUsers };