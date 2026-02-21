// COMPONENT 4: User + Education + Analytics
// File: backend/tests/app.test.js
const request = require("supertest");
const bcrypt = require("bcryptjs");
const app = require("../src/app");
const Region = require("../src/models/Region");
const User = require("../src/models/User");
const RiskAssessment = require("../src/models/RiskAssessment");
const Shelter = require("../src/models/Shelter");

require("./setup");

async function createAdmin(regionId) {
  const passwordHash = await bcrypt.hash("Admin@123", 10);
  const admin = await User.create({ name: "Admin", email: "admin@test.com", passwordHash, role: "admin", defaultRegionId: regionId });

  const login = await request(app).post("/api/auth/login").send({ email: "admin@test.com", password: "Admin@123" });
  return { admin, token: login.body.data.token };
}

describe("Core API tests", () => {
  test("register and login", async () => {
    const region = await Region.create({ name: "Colombo", type: "District", province: "Western Province", lat: 6.9271, lng: 79.8612, radiusKm: 25 });

    const registerRes = await request(app)
      .post("/api/auth/register")
      .send({ name: "Citizen", email: "citizen@test.com", password: "Password@123", defaultRegionId: region._id.toString() });

    expect(registerRes.statusCode).toBe(201);
    expect(registerRes.body.data.token).toBeDefined();

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "citizen@test.com", password: "Password@123" });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.data.token).toBeDefined();
  });

  test("get regions", async () => {
    await Region.insertMany([
      { name: "Colombo", type: "District", province: "Western Province", lat: 6.9271, lng: 79.8612, radiusKm: 25 },
      { name: "Kandy", type: "District", province: "Central Province", lat: 7.2906, lng: 80.6337, radiusKm: 25 },
    ]);

    const res = await request(app).get("/api/regions");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(2);
  });

  test("get risk by region", async () => {
    const region = await Region.create({ name: "Jaffna", type: "District", province: "Northern Province", lat: 9.6615, lng: 80.0255, radiusKm: 30 });
    await RiskAssessment.create({ regionId: region._id, riskScore: 95, severity: "HIGH", reasons: ["High wind"], source: "OWM" });

    const res = await request(app).get(`/api/risk/region/${region._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.severity).toBe("HIGH");
  });

  test("create manual alert (admin)", async () => {
    const region = await Region.create({ name: "Galle", type: "District", province: "Southern Province", lat: 6.0535, lng: 80.221, radiusKm: 25 });
    const { token } = await createAdmin(region._id);

    const res = await request(app)
      .post("/api/alerts/manual")
      .set("Authorization", `Bearer ${token}`)
      .send({ regionId: region._id.toString(), severity: "HIGH", title: "Manual Alert", description: "Heavy rain expected" });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.source).toBe("Manual");
  });

  test("get shelters nearby", async () => {
    const region = await Region.create({ name: "Anuradhapura", type: "District", province: "North Central Province", lat: 8.3114, lng: 80.4037, radiusKm: 35 });
    await Shelter.create({
      name: "Anuradhapura Shelter",
      address: "Main Rd",
      regionId: region._id,
      lat: 8.3242,
      lng: 80.4081,
      capacity: 200,
      currentOccupancy: 50,
      shelterType: "School",
      isActive: true,
    });

    const res = await request(app).get("/api/shelters/nearby?lat=8.31&lng=80.40&radiusKm=20");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test("analytics summary (admin)", async () => {
    const region = await Region.create({ name: "Colombo", type: "District", province: "Western Province", lat: 6.9271, lng: 79.8612, radiusKm: 25 });
    const { token } = await createAdmin(region._id);

    const res = await request(app).get("/api/analytics/summary").set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.totalUsers).toBeDefined();
  });
});