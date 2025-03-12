const { asyncHandler } = require("../../utils/asyncHandler");
const StateModel = require("../../models/State.model");
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../errors/ApiErrors");
const StateDistrict = require("../../models/District.model");
const { logger } = require("../../utils/helpers/logger.utils");

const getAllState = asyncHandler(async (req, res) => {
  logger.info("Fetching all states");
  const data = await StateModel.find();
  logger.info("States retrieved successfully", { data });
  res.status(200).json(new ApiResponse(200, data, "States retrieved successfully"));
});

// Get Districts by State ID
const getAllDistrict = asyncHandler(async (req, res) => {
  const { stateId } = req.body;
  if (!stateId) {
    logger.warn("State ID not provided in request body");
    throw new ApiError(400, "Please provide a valid stateId");
  }

  logger.info("Fetching districts for state", { stateId });
  const data = await StateDistrict.find({ stateId });

  if (data.length === 0) {
    logger.warn("No districts found for the given stateId", { stateId });
    throw new ApiError(404, "No districts found for the given stateId");
  }

  logger.info("Districts retrieved successfully", { data });
  res.status(200).json(new ApiResponse(200, data, "Districts retrieved successfully"));
});

module.exports = { getAllState, getAllDistrict };
