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
    const response = await OTPModel.findByIdAndUpdate(
      { _id: otpEntry._id },
      { verified: true },
      { new: true }
    );
    return {
      success: true,
      message: "OTP verified successfully",
      contact: response.phoneNumber,
      verified: response.verified,
    };
  } catch (error) {
    throw new ApiError(500, "server Error");
  }
}

module.exports = verifyOtp;
