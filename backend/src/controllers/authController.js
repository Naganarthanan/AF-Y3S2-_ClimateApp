// COMPONENT 4: User + Education + Analytics
// File: backend/src/controllers/authController.js
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const { signToken } = require("../utils/jwt");
const env = require("../config/env");
const { sendPasswordResetOtp } = require("../services/twilioService");

const OTP_MAX_ATTEMPTS = 5;
const FORGOT_PASSWORD_MESSAGE =
  "If an account exists for this email, an OTP has been sent to the registered phone number.";

function hashOtp(otp) {
  return crypto.createHash("sha256").update(`${otp}:${env.JWT_SECRET}`).digest("hex");
}

function isOtpExpired(user) {
  return !user.resetOtpExpiresAt || user.resetOtpExpiresAt.getTime() < Date.now();
}

async function invalidateOtp(user) {
  user.resetOtpHash = undefined;
  user.resetOtpExpiresAt = undefined;
  user.resetOtpAttempts = 0;
  await user.save();
}

async function register(req, res) {
  const { name, email, phone, password, defaultRegionId } = req.validated.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ status: "error", message: "Email already in use" });
  }
  const existingPhone = await User.findOne({ phone });
  if (existingPhone) {
    return res.status(409).json({ status: "error", message: "Phone number already in use" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    phone,
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
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        defaultRegionId: user.defaultRegionId,
      },
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
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        defaultRegionId: user.defaultRegionId,
      },
    },
  });
}

async function forgotPassword(req, res) {
  const { email } = req.validated.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !user.phone) {
    return res.json({ status: "success", message: FORGOT_PASSWORD_MESSAGE });
  }

  const otp = String(crypto.randomInt(100000, 1000000));
  user.resetOtpHash = hashOtp(otp);
  user.resetOtpExpiresAt = new Date(Date.now() + env.OTP_EXPIRY_MINUTES * 60 * 1000);
  user.resetOtpAttempts = 0;
  await user.save();

  try {
    await sendPasswordResetOtp(user.phone, otp);
  } catch (error) {
    // Log provider details for debugging delivery issues without exposing them to API clients.
    console.error("[forgotPassword] Twilio send failed", {
      email: user.email,
      phone: user.phone,
      statusCode: error.statusCode || error?.status,
      code: error?.code,
      message: error?.message,
      moreInfo: error?.moreInfo,
    });
    error.statusCode = error.statusCode || 502;
    throw error;
  }

  return res.json({ status: "success", message: FORGOT_PASSWORD_MESSAGE });
}

async function verifyResetOtp(req, res) {
  const { email, otp } = req.validated.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !user.resetOtpHash) {
    return res.status(400).json({ status: "error", message: "Invalid or expired OTP" });
  }

  if (isOtpExpired(user)) {
    await invalidateOtp(user);
    return res.status(400).json({ status: "error", message: "Invalid or expired OTP" });
  }

  if (user.resetOtpAttempts >= OTP_MAX_ATTEMPTS) {
    await invalidateOtp(user);
    return res.status(429).json({ status: "error", message: "Too many invalid OTP attempts. Request a new OTP." });
  }

  const isValid = hashOtp(otp) === user.resetOtpHash;
  if (!isValid) {
    user.resetOtpAttempts += 1;
    await user.save();
    return res.status(400).json({ status: "error", message: "Invalid or expired OTP" });
  }

  return res.json({ status: "success", message: "OTP verified successfully" });
}

async function resetPassword(req, res) {
  const { email, otp, newPassword } = req.validated.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !user.resetOtpHash) {
    return res.status(400).json({ status: "error", message: "Invalid or expired OTP" });
  }

  if (isOtpExpired(user)) {
    await invalidateOtp(user);
    return res.status(400).json({ status: "error", message: "Invalid or expired OTP" });
  }

  if (user.resetOtpAttempts >= OTP_MAX_ATTEMPTS) {
    await invalidateOtp(user);
    return res.status(429).json({ status: "error", message: "Too many invalid OTP attempts. Request a new OTP." });
  }

  const isValid = hashOtp(otp) === user.resetOtpHash;
  if (!isValid) {
    user.resetOtpAttempts += 1;
    await user.save();
    return res.status(400).json({ status: "error", message: "Invalid or expired OTP" });
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await invalidateOtp(user);

  return res.json({ status: "success", message: "Password reset successful" });
}

async function me(req, res) {
  return res.json({ status: "success", data: req.user });
}

module.exports = { register, login, forgotPassword, verifyResetOtp, resetPassword, me };
