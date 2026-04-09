// COMPONENT 4: User + Education + Analytics
// File: backend/src/middleware/rateLimit.js
const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { status: "error", message: "Too many auth requests. Try again later." },
});

module.exports = { authLimiter };