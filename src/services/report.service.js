const ApiError = require("../errors/ApiErrors");
const CompanyModel = require("../models/Company.model");
const FarmerCropModel = require("../models/FarmerCrop.model");
const Report = require("../models/Report.model");
const { userType } = require("../utils/constants/constant");
const { generatePresignedUrl } = require("../utils/helpers/s3UrlGenerator");

class ReportService {
  static async createReport(data, files) {
    const { imageDescriptions, requestId, description } = data;
    const farmer = await FarmerCropModel.findOne({ requestId });
    if (!farmer) {
      throw new Error("Invalid requestId.");
    }
    // Map descriptions into the required format
    const formattedImages = imageDescriptions.map((desc) => ({
      images: desc.images || " ",
      imagedescription: desc.imageDescriptions || "",
    }));

    const getFileUrl = (fieldName) => (files[fieldName] ? files[fieldName][0].location : null);

    const weatherReportUrl = getFileUrl("weatherReport");
    const excelUrl = getFileUrl("excel");
    const advisory1Url = getFileUrl("schedule_advisory1");
    const advisory2Url = getFileUrl("schedule_advisory2");

    // Create new report entry
    const report = new Report({
      requestId: requestId,
      images: formattedImages,
      farmerId: farmer._id,
      alert_notifications: description,
      weatherReport: weatherReportUrl,
      excel: excelUrl,
      schedule_advisory1: advisory1Url,
      schedule_advisory2: advisory2Url,
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

    // Generate pre-signed URLs for all reports
    const reportsWithUrls = await Promise.all(
      reports.map(async (report) => {
        const reportObj = report.toObject();

        // Generate pre-signed URLs for main files
        if (reportObj.weatherReport) {
          reportObj.weatherReport = await generatePresignedUrl(reportObj.weatherReport);
        }

        if (reportObj.excel) {
          reportObj.excel = await generatePresignedUrl(reportObj.excel);
        }

        if (reportObj.schedule_advisory1) {
          reportObj.schedule_advisory1 = await generatePresignedUrl(reportObj.schedule_advisory1);
        }

        if (reportObj.schedule_advisory2) {
          reportObj.schedule_advisory2 = await generatePresignedUrl(reportObj.schedule_advisory2);
        }

        // Process images array if it exists
        if (reportObj.images && reportObj.images.length > 0) {
          for (let i = 0; i < reportObj.images.length; i++) {
            if (reportObj.images[i].images && reportObj.images[i].images !== " ") {
              reportObj.images[i].images = await generatePresignedUrl(reportObj.images[i].images);
            }
          }
        }
        return reportObj;
      })
    );

    return {
      reports: reportsWithUrls,
      totalReports,
      currentPage: page,
      totalPages: Math.ceil(totalReports / limit),
    };
  }
}

module.exports = ReportService;
