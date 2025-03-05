const FarmerCropService = require("../../services/FarmerService");
const ApiResponse = require("../../utils/ApiResponse");
const { asyncHandler } = require("../../utils/asyncHandler");

// @access=>company
const addFarmerCrop = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const farmerCrop = await FarmerCropService.addFarmerCrop(userId, req.body);
  res.status(201).json(new ApiResponse(201, farmerCrop));
});

const getFarmerCrops = asyncHandler(async (req, res) => {
  let { page, limit } = req.query;
  const user = req.user;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const result = await FarmerCropService.getFarmerCrops(user, page, limit);
  res.status(200).json(new ApiResponse(200, result));
});

const getFarmerCropById = asyncHandler(async (req, res) => {
  const farmerCrop = await FarmerCropService.getFarmerCropById(
    req.params.farmerId
  );
  res.status(200).json(new ApiResponse(200, farmerCrop));
});

module.exports = {
  addFarmerCrop,
  getFarmerCrops,
  getFarmerCropById,
};
