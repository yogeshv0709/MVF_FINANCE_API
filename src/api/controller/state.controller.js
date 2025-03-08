const { asyncHandler } = require("../../utils/asyncHandler");
const StateModel = require("../../models/State.model");
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../errors/ApiErrors");
const StateDistrict = require("../../models/District.model");
const redis = require("../../config/redis.config");

const CACHE_TTL = 60 * 60 * 24 * 7; // 7 days

const getAllState = asyncHandler(async (req, res) => {
  const cacheKey = "all_states";
  const cachedStates = await redis.get(cacheKey);

  if (cachedStates) {
    console.log("Returning states from cache");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          JSON.parse(cachedStates),
          "States retrieved from cache"
        )
      );
  }

  const data = await StateModel.find();
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(data));

  res
    .status(200)
    .json(new ApiResponse(200, data, "States retrieved successfully"));
});

// Get Districts by State ID with Redis Cache
const getAllDistrict = asyncHandler(async (req, res) => {
  const { stateId } = req.body;
  if (!stateId) {
    throw new ApiError(400, "Please provide a valid stateId");
  }

  const cacheKey = `districts_${stateId}`;
  const cachedDistricts = await redis.get(cacheKey);

  if (cachedDistricts) {
    console.log("Returning districts from cache");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          JSON.parse(cachedDistricts),
          "Districts retrieved from cache"
        )
      );
  }

  const data = await StateDistrict.find({ stateId });

  if (data.length === 0) {
    throw new ApiError(404, "No districts found for the given stateId");
  }

  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(data));

  res
    .status(200)
    .json(new ApiResponse(200, data, "Districts retrieved successfully"));
});

module.exports = { getAllState, getAllDistrict };
