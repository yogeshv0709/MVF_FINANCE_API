const FarmerCropService = require("../../services/farmer.service");
const ApiResponse = require("../../utils/ApiResponse");
const { asyncHandler } = require("../../utils/asyncHandler");
const { logger } = require("../../utils/helpers/logger.utils");

// @access=>company
const addFarmerCrop = asyncHandler(async (req, res) => {
  const user = req.user;
  logger.info("Adding farmer crop", { user, requestBody: req.body });
  const farmerCrop = await FarmerCropService.addFarmerCrop(user, req.body);
  logger.info("Farmer crop added successfully", { farmerCrop });
  res.status(200).json(new ApiResponse(200, farmerCrop));
});

const getFarmerCrops = asyncHandler(async (req, res) => {
  let { page, limit } = req.query;
  const data = req.body;
  const user = req.user;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  logger.info("Fetching farmer crops", { user, data, page, limit });
  const result = await FarmerCropService.getFarmerCrops(user, data, page, limit);
  logger.info("Farmer crops fetched successfully", { result });
  res.status(200).json(new ApiResponse(200, result));
});

const getFarmerCropById = asyncHandler(async (req, res) => {
  logger.info("Fetching farmer crop by ID", { farmerId: req.params.farmerId });
  const farmerCrop = await FarmerCropService.getFarmerCropById(req.params.farmerId);
  logger.info("Farmer crop fetched successfully", { farmerCrop });
  res.status(200).json(new ApiResponse(200, farmerCrop));
});

module.exports = {
  addFarmerCrop,
  getFarmerCrops,
  getFarmerCropById,
};
