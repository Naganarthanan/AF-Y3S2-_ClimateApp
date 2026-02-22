// COMPONENT 4: User + Education + Analytics
// File: backend/src/middleware/requireRole.js
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ status: "error", message: "Forbidden" });
    }
    return next();
  };
}

module.exports = requireRole;