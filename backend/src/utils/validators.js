// COMPONENT 4: User + Education + Analytics
// File: backend/src/utils/validators.js
const { z } = require("zod");

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);
const isoDateString = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: "Invalid ISO date string",
});

const authRegisterSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    defaultRegionId: objectId.optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const authLoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const manualAlertSchema = z.object({
  body: z.object({
    regionId: objectId,
    severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
    title: z.string().min(3),
    description: z.string().min(5),
    expiresAt: isoDateString.optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const shelterSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    address: z.string().min(3),
    regionId: objectId,
    lat: z.number(),
    lng: z.number(),
    capacity: z.number().int().positive(),
    currentOccupancy: z.number().int().nonnegative().default(0),
    shelterType: z.string().default("General"),
    isActive: z.boolean().default(true),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const zoneSchema = z.object({
  body: z.object({
    regionId: objectId,
    disasterType: z.enum(["Flood", "Cyclone", "Heat"]),
    shapeType: z.literal("circle").default("circle"),
    lat: z.number(),
    lng: z.number(),
    radiusKm: z.number().positive(),
    severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
    activeFrom: isoDateString,
    activeTo: isoDateString,
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const resourceUpsertSchema = z.object({
  body: z.object({
    shelterId: objectId,
    category: z.enum(["food", "water", "medical", "tools"]),
    itemName: z.string().min(2),
    quantity: z.number().nonnegative(),
    unit: z.string().min(1),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const educationCreateSchema = z.object({
  body: z.object({
    type: z.enum(["article", "video"]),
    title: z.string().min(3),
    bodyOrUrl: z.string().min(4),
    tags: z.array(z.string()).default([]),
    disasterType: z.string().min(2),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const quizSubmitSchema = z.object({
  body: z.object({
    disasterType: z.string().min(2),
    answers: z.array(
      z.object({
        questionId: objectId,
        selectedIndex: z.number().int().nonnegative(),
      })
    ),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const prepPlanSchema = z.object({
  body: z.object({
    checklistItems: z.array(
      z.object({
        text: z.string().min(2),
        done: z.boolean(),
      })
    ),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const activitySchema = z.object({
  body: z.object({
    action: z.enum(["view_alert", "view_shelter", "take_quiz", "create_plan", "open_map"]),
    regionId: objectId.optional(),
    meta: z.record(z.any()).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

module.exports = {
  authRegisterSchema,
  authLoginSchema,
  manualAlertSchema,
  shelterSchema,
  zoneSchema,
  resourceUpsertSchema,
  educationCreateSchema,
  quizSubmitSchema,
  prepPlanSchema,
  activitySchema,
};
