// COMPONENT 4: User + Education + Analytics
// File: backend/src/services/twilioService.js
const env = require("../config/env");

let twilioClient = null;

function getTwilioClient() {
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_FROM_NUMBER) {
    const error = new Error("Twilio is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER.");
    error.statusCode = 500;
    throw error;
  }

  if (!twilioClient) {
    const twilio = require("twilio");
    twilioClient = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
  }

  return twilioClient;
}

async function sendPasswordResetOtp(phone, otp) {
  const client = getTwilioClient();
  const body = `Your Climate Risk password reset OTP is ${otp}. It expires in ${env.OTP_EXPIRY_MINUTES} minutes.`;

  await client.messages.create({
    to: phone,
    from: env.TWILIO_FROM_NUMBER,
    body,
  });
}

module.exports = { sendPasswordResetOtp };
