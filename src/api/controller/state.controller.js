const { asyncHandler } = require("../../utils/asyncHandler");
const StateModel = require("../../models/State.model");
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../errors/ApiErrors");
const StateDistrict = require("../../models/District.model");

const getAllState = asyncHandler(async (req, res) => {
  const data = await StateModel.find();
  res.status(200).json(new ApiResponse(200, data, "States retrieved successfully"));
});

// Get Districts by State ID
const getAllDistrict = asyncHandler(async (req, res) => {
  const { stateId } = req.body;
  if (!stateId) {
    throw new ApiError(400, "Please provide a valid stateId");
  }

  const data = await StateDistrict.find({ stateId });

  if (data.length === 0) {
    throw new ApiError(404, "No districts found for the given stateId");
  }

  res.status(200).json(new ApiResponse(200, data, "Districts retrieved successfully"));
});

module.exports = { getAllState, getAllDistrict };
