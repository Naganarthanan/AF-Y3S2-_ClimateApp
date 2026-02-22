// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: backend/src/middleware/errorHandler.js
function notFound(req, res) {
  res.status(404).json({ status: "error", message: "Route not found" });
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  const payload = { status: "error", message };

  if (err.details) {
    payload.details = err.details;
  }

  if (process.env.NODE_ENV !== "production" && err.stack) {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
}

module.exports = { notFound, errorHandler };