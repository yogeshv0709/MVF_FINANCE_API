const ApiError = require("../errors/ApiErrors");
const Farmer = require("../models/FarmerCrop.model");
const { checkCompanyAccess } = require("../utils/authHelper");
const { userType } = require("../utils/constant");

class FarmerCropService {
  // Create a new Farmer Crop entry
  static async addFarmerCrop(userId, data) {
    const result = await Farmer.create(data);
    result.userId = userId;
    result.save();
    return result;
  }

  // Get all Farmer Crop entries with pagination
  static async getFarmerCrops(user, page = 1, limit = 10) {
    const userId = user.userId;
    const userRole = user.type;

    let farmerCrops;
    let totalFarmerCrops;
    const skip = (page - 1) * limit;
    if (userRole === userType.Admin) {
      farmerCrops = await Farmer.find().skip(skip).limit(limit);
      totalFarmerCrops = await Farmer.countDocuments();
    } else if (userRole === userType.RSVC) {
      farmerCrops = await Farmer.find({ userId }).skip(skip).limit(limit);
      totalFarmerCrops = await Farmer.countDocuments({ userId });
    } else {
      throw new ApiError(403, "Access Denied");
    }

    return {
      farmerCrops,
      currentPage: page,
      totalPages: Math.ceil(totalFarmerCrops / limit),
      totalFarmerCrops,
    };
  }

  static async getFarmerCropById(farmerId) {
    const farmerCrop = await Farmer.findById(farmerId);
    if (!checkCompanyAccess) {
      throw new ApiError(403, "Unauthorized access");
    }
    if (!farmerCrop) {
      throw new ApiError(404, "Farmer Crop not found");
    }
    return farmerCrop;
  }
}

module.exports = FarmerCropService;
