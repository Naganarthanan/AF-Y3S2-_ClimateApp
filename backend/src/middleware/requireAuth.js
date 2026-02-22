// COMPONENT 4: User + Education + Analytics
// File: backend/src/middleware/requireAuth.js
const User = require("../models/User");
const { verifyToken } = require("../utils/jwt");

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select("-passwordHash");

    if (!user) {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ status: "error", message: "Invalid or expired token" });
  }
}

module.exports = requireAuth;