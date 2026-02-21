// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: backend/src/middleware/validate.js
function validate(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!parsed.success) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        details: parsed.error.issues,
      });
    }

    req.validated = parsed.data;
    return next();
  };
}

module.exports = validate;