// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: backend/src/server.js
const app = require("./app");
const env = require("./config/env");
const { connectDB } = require("./config/db");
const { startRiskPoller } = require("./jobs/riskPoller");

async function startServer() {
  await connectDB(env.MONGO_URI);
  app.listen(env.PORT, () => {
    console.log(`Backend running on http://localhost:${env.PORT}`);
  });

  startRiskPoller();
}

startServer().catch((error) => {
  console.error("Server bootstrap failed", error);
  process.exit(1);
});