const ApiError = require("../../errors/ApiErrors");
const OTPModel = require("../../models/OTP.model");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString(); //6-DIGITS

async function generateAndStoreOtp(phoneNumber) {
  try {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Expires in 5 minutes

    // Remove old OTPs for the same phone number
    await OTPModel.deleteMany({ phoneNumber });

    // Store new OTP in DB
    await OTPModel.create({ phoneNumber, otp, expiresAt });

    return otp;
  } catch (error) {
    throw new ApiError(500, "Failed to send OTP");
  }
}

module.exports = generateAndStoreOtp;
