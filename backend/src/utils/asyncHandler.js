// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: backend/src/utils/asyncHandler.js
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;