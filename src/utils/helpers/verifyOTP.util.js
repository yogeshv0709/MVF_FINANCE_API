const ApiError = require("../../errors/ApiErrors");
const OTPModel = require("../../models/OTP.model");

async function verifyOtp(phoneNumber, userOtp) {
  try {
    const otpEntry = await OTPModel.findOne({ phoneNumber, otp: userOtp });

    if (!otpEntry) {
      return { success: false, message: "Invalid or expired OTP" };
    }

    // Check if OTP has expired
    if (otpEntry.expiresAt < new Date()) {
      await OTPModel.deleteOne({ _id: otpEntry._id }); // Remove expired OTP
      return { success: false, message: "OTP expired" };
    }

    // Mark OTP as verified
    await OTPModel.updateOne({ _id: otpEntry._id }, { verified: true });

    return { success: true, message: "OTP verified successfully" };
  } catch (error) {
    throw new ApiError(500, "serve Error");
  }
}

module.exports = verifyOtp;
