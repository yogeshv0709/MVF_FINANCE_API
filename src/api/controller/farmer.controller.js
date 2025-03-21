const FarmerCropService = require("../../services/farmer.service");
const ApiResponse = require("../../utils/ApiResponse");
const { asyncHandler } = require("../../utils/asyncHandler");
const { logger } = require("../../utils/helpers/logger.utils");

// @access=>company
const addFarmerCrop = asyncHandler(async (req, res) => {
  const user = req.user;
  logger.info("Adding farmer crop", { user, requestBody: req.body });
  const farmerCrop = await FarmerCropService.addFarmerCrop(user, req.body);
  logger.info("Farmer crop added successfully", { farmer: farmerCrop._id });
  res.status(200).json(new ApiResponse(200, farmerCrop));
});

const getFarmerCrops = asyncHandler(async (req, res) => {
  let { page, limit } = req.query;
  const data = req.body;
  const user = req.user;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  logger.info("Fetching farmer crops", { user: user.userId, reqBody: req.body });
  const result = await FarmerCropService.getFarmerCrops(user, data, page, limit);
  logger.info("Farmer crops fetched successfully");
  res.status(200).json(new ApiResponse(200, result));
});

const sendOTP = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;
  logger.info(`Send OTP request to :${phoneNumber}`);
  await FarmerCropService.sendOtp(phoneNumber);
  logger.info(`OTP send success to:${phoneNumber}`);
  res.status(200).json(new ApiResponse(200, {}, "OTP sent successfully"));
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { phoneNumber, otp } = req.body;
  const user = req.user;
  logger.info(`verify OTP request of :${phoneNumber}`);
  const response = await FarmerCropService.verifyOtp(phoneNumber, otp, user);
  logger.info(`verify OTP success of :${phoneNumber}`);
  res.status(200).json(new ApiResponse(200, response));
});

const getFarmerDetail = asyncHandler(async (req, res) => {
  let { page, limit } = req.query;
  const data = req.body;
  const user = req.user;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  logger.info("Fetching farmer Details", { user: user.userId, reqBody: req.body });
  const result = await FarmerCropService.getFarmerDetails(user, data, page, limit);
  logger.info("Farmer Details fetched successfully");
  res.status(200).json(new ApiResponse(200, result));
});

const deleteFarmerCrops = asyncHandler(async (req, res) => {
  const { requestId } = req.body;
  const user = req.user;
  logger.info("Fetching farmer crop by ID", { requestId });
  await FarmerCropService.deleteFarmerCrops(user, requestId);
  logger.info("Farmer crop deleted successfully");
  res.status(200).json(new ApiResponse(200, {}, "Farmer Deleted "));
});

module.exports = {
  addFarmerCrop,
  getFarmerCrops,
  deleteFarmerCrops,
  getFarmerDetail,
  sendOTP,
  verifyOTP,
};
