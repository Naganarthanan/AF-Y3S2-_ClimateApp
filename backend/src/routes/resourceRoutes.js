// COMPONENT 3: Emergency Resource & Shelter Logistics
// File: backend/src/routes/resourceRoutes.js
const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middleware/validate");
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const { resourceUpsertSchema, resourceUpdateSchema, resourceIdParamSchema } = require("../utils/validators");
const { listResources, upsertResource, lowStock, updateResource, deleteResource } = require("../controllers/resourceController");

const router = express.Router();

router.get("/", asyncHandler(listResources));
router.get("/low-stock", requireAuth, requireRole("admin", "superadmin"), asyncHandler(lowStock));
router.post("/", requireAuth, requireRole("admin", "superadmin"), validate(resourceUpsertSchema), asyncHandler(upsertResource));
router.put("/:id", requireAuth, requireRole("admin", "superadmin"), validate(resourceUpdateSchema), asyncHandler(updateResource));
router.delete("/:id", requireAuth, requireRole("admin", "superadmin"), validate(resourceIdParamSchema), asyncHandler(deleteResource));

module.exports = router;
