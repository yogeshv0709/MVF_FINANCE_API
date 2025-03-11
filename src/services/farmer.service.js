const ApiError = require("../errors/ApiErrors");
const CompanyModel = require("../models/Company.model");
const StateDistrict = require("../models/District.model");
const Farmer = require("../models/FarmerCrop.model");
const StateModel = require("../models/State.model");
const { checkCompanyAccess } = require("../utils/authHelper");
const { userType } = require("../utils/constants/constant");

class FarmerCropService {
  // Create a new Farmer Crop entry
  static async addFarmerCrop(user, data) {
    const { state, district } = data;
    const { userId, type } = user;
    const company = await CompanyModel.findOne({ userId });
    if (!company) {
      throw new ApiError(400, "No company found related Farmer");
    }
    const isState = await StateModel.findOne({ stateId: state });
    if (!isState) {
      throw new ApiError("No state found");
    }
    const isDistrict = await StateDistrict.findOne({
      districtId: district,
    });
    if (!isDistrict) {
      throw new ApiError("No district found");
    }
    data.companyId = company._id;
    data.state = isState._id;
    data.district = isDistrict._id;
    data.enquiryType = type === userType.RSVC ? "bank" : "";
    const farmer = new Farmer(data);
    const result = await farmer.save();
    const { companyId: _, ...rest } = result.toObject();
    return rest;
  }

  // Get all Farmer Crop entries with pagination
  static async getFarmerCrops(user, data, page = 1, limit = 10) {
    const userId = user.userId;
    const userRole = user.type;
    let farmerCrops;

    let totalFarmerCrops;
    const skip = (page - 1) * limit;
    if (userRole === userType.Admin) {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      // Update status in real-time when fetching farmer data
      await Farmer.updateMany(
        { lastReportDate: { $lt: oneWeekAgo }, status: "accept" },
        { $set: { status: "pending" } }
      );

      farmerCrops = await Farmer.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("state")
        .populate("district")
        .populate("companyId", "firmName");

      farmerCrops = farmerCrops.map((farmer) => ({
        ...farmer.toObject(), // Convert Mongoose document to plain object
        state: farmer.state?.name || null, // Extract state name
        district: farmer.district?.name || null, // Extract district name
      }));

      totalFarmerCrops = await Farmer.countDocuments();
    } else if (userRole === userType.RSVC) {
      if (data.entype === "bank") {
        const company = await CompanyModel.findOne({ userId });
        if (!company) {
          throw new ApiError("No company found");
        }
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // Update status in real-time when fetching farmer data
        await Farmer.updateMany(
          { lastReportDate: { $lt: oneWeekAgo }, status: "accept" },
          { $set: { status: "pending" } }
        );
        const farmers = await Farmer.find({ companyId: company._id })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate("state")
          .populate("district")
          .populate("companyId", "firmName")
          .lean();

        farmerCrops = farmers.map((farmer) => ({
          ...farmer,
          state: farmer.state.name,
          district: farmer.district.name,
        }));

        totalFarmerCrops = await Farmer.countDocuments({
          companyId: company._id,
        });
      } else if (data.entype === "user") {
        farmerCrops = [];
      }
    } else {
      throw new ApiError(403, "Access Denied");
    }

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
