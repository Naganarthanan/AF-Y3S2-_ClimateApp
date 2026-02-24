// COMPONENT 3: Emergency Resource & Shelter Logistics
// File: backend/src/models/ResourceStock.js
const mongoose = require("mongoose");

const resourceStockSchema = new mongoose.Schema(
  {
    shelterId: { type: mongoose.Schema.Types.ObjectId, ref: "Shelter", required: true, index: true },
    category: { type: String, enum: ["food", "water", "medical", "tools"], required: true },
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

resourceStockSchema.index({ shelterId: 1, itemName: 1 }, { unique: true });

module.exports = mongoose.model("ResourceStock", resourceStockSchema);