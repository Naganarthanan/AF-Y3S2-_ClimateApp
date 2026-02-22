// COMPONENT 4: User + Education + Analytics
// File: backend/src/controllers/authController.js
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { signToken } = require("../utils/jwt");

async function register(req, res) {
  const { name, email, password, defaultRegionId } = req.validated.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ status: "error", message: "Email already in use" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: "citizen",
    defaultRegionId,
  });

  const token = signToken({ userId: user._id, role: user.role });
  return res.status(201).json({
    status: "success",
    message: "Registered successfully",
    data: {
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, defaultRegionId: user.defaultRegionId },
    },
  });
}

async function login(req, res) {
  const { email, password } = req.validated.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ status: "error", message: "Invalid credentials" });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ status: "error", message: "Invalid credentials" });
  }

  const token = signToken({ userId: user._id, role: user.role });
  return res.json({
    status: "success",
    message: "Login successful",
    data: {
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, defaultRegionId: user.defaultRegionId },
    },
  });
}

async function me(req, res) {
  return res.json({ status: "success", data: req.user });
}

module.exports = { register, login, me };