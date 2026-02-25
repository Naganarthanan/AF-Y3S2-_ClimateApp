
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const env = require("./config/env");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const requireAuth = require("./middleware/requireAuth");
const asyncHandler = require("./utils/asyncHandler");
const { me } = require("./controllers/authController");
const authRoutes = require("./routes/authRoutes");
const regionRoutes = require("./routes/regionRoutes");
const riskRoutes = require("./routes/riskRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const alertRoutes = require("./routes/alertRoutes");
const shelterRoutes = require("./routes/shelterRoutes");
const zoneRoutes = require("./routes/zoneRoutes");
const routeRoutes = require("./routes/routeRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const educationRoutes = require("./routes/educationRoutes");
const quizRoutes = require("./routes/quizRoutes");
const prepPlanRoutes = require("./routes/prepPlanRoutes");
const activityRoutes = require("./routes/activityRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

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

app.get("/api/me", requireAuth, asyncHandler(me));
app.use("/api/auth", authRoutes);
app.use("/api/regions", regionRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/shelters", shelterRoutes);
app.use("/api/zones", zoneRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/prep-plan", prepPlanRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
