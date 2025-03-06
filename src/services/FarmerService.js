const ApiError = require("../errors/ApiErrors");
const CompanyModel = require("../models/Company.model");
const Farmer = require("../models/FarmerCrop.model");
const { checkCompanyAccess } = require("../utils/authHelper");
const { userType } = require("../utils/constant");

class FarmerCropService {
  // Create a new Farmer Crop entry
  static async addFarmerCrop(userId, data) {
    const company = await CompanyModel.findOne({ userId });
    if (!company) {
      throw new ApiError(400, "No company found related Farmer");
    }
    data.companyId = company._id;
    const farmer = new Farmer(data);
    const result = await farmer.save();
    const { companyId: _, ...rest } = result.toObject();
    return rest;
  }

  // Get all Farmer Crop entries with pagination
  static async getFarmerCrops(user, data, page = 1, limit = 10) {
    console.log("in");
    const userId = user.userId;
    const userRole = user.type;
    console.log(user);
    let farmerCrops;
    let totalFarmerCrops;
    const skip = (page - 1) * limit;
    if (userRole === userType.Admin) {
      farmerCrops = await Farmer.find().skip(skip).limit(limit);
      totalFarmerCrops = await Farmer.countDocuments();
    } else if (userRole === userType.RSVC) {
      if (data.entype === "bank") {
        const company = await CompanyModel.findOne({ userId });
        farmerCrops = await Farmer.find({ companyId: company._id })
          .skip(skip)
          .limit(limit);
        totalFarmerCrops = await Farmer.countDocuments({
          companyId: company._id,
        });
      }
    } else {
      throw new ApiError(403, "Access Denied");
    }

    // return {
    //   farmerCrops,
    //   currentPage: page,
    //   totalPages: Math.ceil(totalFarmerCrops / limit),
    //   totalFarmerCrops,
    // };
    return farmerCrops;
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
