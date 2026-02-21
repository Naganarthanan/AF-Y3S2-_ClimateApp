// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: backend/src/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const env = require("./config/env");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const requireAuth = require("./middleware/requireAuth");
const asyncHandler = require("./utils/asyncHandler");
const regionRoutes = require("./routes/regionRoutes");
const riskRoutes = require("./routes/riskRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const alertRoutes = require("./routes/alertRoutes");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ status: "success", message: "API is healthy" });
});

app.use("/api/regions", regionRoutes);//mathu
app.use("/api/risk", riskRoutes);//mathu
app.use("/api/weather", weatherRoutes);//mathu
app.use("/api/alerts", alertRoutes);  //mathu


app.use(notFound);
app.use(errorHandler);

module.exports = app;
