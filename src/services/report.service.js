const ApiError = require("../errors/ApiErrors");
const CompanyModel = require("../models/Company.model");
const FarmerCropModel = require("../models/FarmerCrop.model");
const Report = require("../models/Report.model");
const { userType } = require("../utils/constants/constant");

class ReportService {
  static async createReport(data, files) {
    const { imageDescriptions, requestId, description } = data;
    const farmer = await FarmerCropModel.findOne({ requestId });
    if (!farmer) {
      throw new Error("Invalid requestId.");
    }
    console.log("Incoming imageDescriptions:", imageDescriptions);
    // Map descriptions into the required format
    const formattedImages = imageDescriptions.map((desc) => ({
      images: desc.images || " ",
      imagedescription: desc.imageDescriptions || "",
    }));

    // Create new report entry
    const report = new Report({
      requestId: requestId,
      images: formattedImages,
      farmerId: farmer._id,
      alert_notifications: description,
      weatherReport: files["weatherReport"] ? files["weatherReport"][0].path : null,
      excel: files["excel"] ? files["excel"][0].path : null,
      schedule_advisory1: files["schedule_advisory1"] ? files["schedule_advisory1"][0].path : null,
      schedule_advisory2: files["schedule_advisory2"] ? files["schedule_advisory2"][0].path : null,
    });

    await report.save();

    farmer.status = "accept";
    farmer.lastReportDate = new Date();
    await farmer.save();

    return report;
  }

  // Get paginated reports
  static async getAllReports(user, data, page = 1, limit = 10) {
    const userId = user.userId;
    const userRole = user.type;
    const { requestId } = data;

    const skip = (page - 1) * limit;

    let reports, totalReports;
    const farmer = await FarmerCropModel.findOne({ requestId }).select("_id");
    if (!farmer) {
      throw new ApiError(404, "Farmer not found for the given requestId");
    }

    const farmerId = farmer._id;
    if (userRole === userType.Admin) {
      totalReports = await Report.countDocuments({ farmerId });
      reports = await Report.find({ farmerId })
        .sort({ createdAt: -1 })
        .populate("farmerId", "farmerName contactNumber email");
    } else if (userRole === userType.RSVC) {
      const company = await CompanyModel.findOne({ userId });

      if (!company) {
        throw new ApiError(404, "Company not found for the user");
      }

      const farmers = await FarmerCropModel.find({
        companyId: company._id,
      }).select("_id");

      const farmerIds = farmers.map((farmer) => farmer._id);

      if (!farmerIds.includes(farmerId)) {
        throw new ApiError(403, "Access denied: Farmer does not belong to the company");
      }
      totalReports = await Report.countDocuments({
        farmerId: { $in: farmerId },
      });

      reports = await Report.find({ farmerId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("farmerId submittedBy", "farmerName contactNumber email");
    } else {
      throw new ApiError(403, "Access denied");
    }

    return reports;
  }
}

module.exports = ReportService;
