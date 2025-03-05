const ApiError = require("../errors/ApiErrors");
const FarmerCropModel = require("../models/FarmerCrop.model");
const Report = require("../models/Report.model");
const { userType } = require("../utils/constant");

class ReportService {
  static async createReport(data, files) {
    const { descriptions, farmerId, alert_notifications } = data;
    if (!farmerId) {
      throw new Error("Farmer ID is required.");
    }

    // Map descriptions into the required format
    const formattedImages = descriptions.map((desc) => ({
      images: desc.images,
      imagedescription: desc.imagedescription,
    }));

    // Create new report entry
    const report = new Report({
      requestId: crypto.randomUUID(),
      images: formattedImages,
      farmerId,
      alert_notifications,
      weatherReport: files["weatherForecastFile"]
        ? files["weatherForecastFile"][0].path
        : null,
      otherReportFile: files["otherReportFile"]
        ? files["otherReportFile"][0].path
        : null,
    });

    await report.save();
    return report;
  }
  // Get paginated reports
  static async getAllReports(user, page = 1, limit = 10) {
    const userId = user.userId;
    const userRole = user.type;

    const skip = (page - 1) * limit;

    let reports, totalReports;
    if (userRole === userType.Admin) {
      totalReports = await Report.countDocuments();
      reports = await Report.find()
        .skip(skip)
        .limit(limit)
        .populate("farmerId submittedBy", "farmerName contactNumber email");
    } else if (userRole === userType.RSVC) {
      const farmers = await FarmerCropModel.find({ userId }).select("_id");
      const farmerIds = farmers.map((farmer) => farmer._id);

      totalReports = await Report.countDocuments({
        farmerId: { $in: farmerIds },
      });

      reports = await Report.find({ farmerId: { $in: farmerIds } })
        .skip(skip)
        .limit(limit)
        .populate("farmerId submittedBy", "farmerName contactNumber email");
    } else {
      throw new ApiError(403, "Access denied");
    }

    return {
      reports,
      currentPage: page,
      totalPages: Math.ceil(totalReports / limit),
      totalReports,
    };
  }

  static async getAllFarmerReports(user, farmerId, page, limit) {
    if (user.type !== userType.RSVC) {
      throw new ApiError(403, "Unauthorized: Access denied.");
    }
    const farmer = await FarmerCropModel.exists({
      _id: farmerId,
      userId: user.userId,
    });
    if (!farmer) {
      throw new ApiError(
        403,
        "Unauthorized: Farmer does not belong to your company."
      );
    }
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    const skip = (page - 1) * limit;

    const reports = await Report.find({ farmerId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalReports = await Report.countDocuments({ farmerId });
    return {
      page,
      limit,
      totalReports,
      totalPages: Math.ceil(totalReports / limit),
      reports,
    };
  }

  // Get a single report by ID
  static async getReportById(user, reportId) {
    const report = await Report.findById(reportId).populate(
      "farmerId submittedBy",
      "farmerName contactNumber email"
    );

    if (!report) {
      throw new ApiError(404, "Report not found");
    }
    if (user.type === "RSVC") {
      const hasAccess = await FarmerCropModel.exists({
        _id: report.farmerId,
        userId: user.userId,
      });

      if (!hasAccess) {
        throw new ApiError(
          403,
          "Access denied. You don't have permission to view this report."
        );
      }
    }

    return report;
  }
}

module.exports = ReportService;
