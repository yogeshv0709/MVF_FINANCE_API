const ApiError = require("../errors/ApiErrors");
const CompanyModel = require("../models/Company.model");
const FarmerCropModel = require("../models/FarmerCrop.model");
const Report = require("../models/Report.model");
const { userType } = require("../utils/constants/constant");
const { sendWhatsAppMessage } = require("../utils/helpers/sendWhatsapp.util");
const { generatePresignedUrl } = require("../utils/helpers/s3UrlGenerator");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const {
  addDocumentHeader,
  addReportDetails,
  addImagesSection,
  addSummarySection,
  addDocumentFooter,
} = require("../utils/helpers/pdf.utils");
const { logger } = require("../utils/helpers/logger.utils");

class ReportService {
  static async createReport(data, files) {
    const { imageDescriptions, requestId, description } = data;
    const farmer = await FarmerCropModel.findOneAndUpdate(
      { requestId },
      { status: "accept", lastReportDate: new Date() },
      { new: true }
    );
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
      ome;

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

    return reportsWithUrls;
  }

  static async notifyFarmer(user, reportId) {
    const report = await Report.findOne({ _id: reportId });
    if (!report) {
      throw new ApiError("No report found");
    }
    const farmer = await FarmerCropModel.findOne({ requestId: report.requestId });
    if (!farmer) {
      throw new ApiError("No farmer found to related reportId");
    }
    const phoneNumber = farmer.contact;
    const documentUrl = await generatePresignedUrl(report.weatherReport);
    const filename = report?.weatherReport?.split("/")?.pop() || "";
    const name = farmer.farmerName;
    const fieldId = farmer.fieldId;
    await sendWhatsAppMessage({ phoneNumber, documentUrl, filename, name, fieldId });
    return "Weather Report sent..";
  }

  static async generateReportPDF(reportId) {
    try {
      const report = await Report.findById(reportId).populate(
        "farmerId",
        "farmerName contactNumber email fieldId"
      );

      if (!report) {
        throw new ApiError(404, "Report not found");
      }

      // Set up document with better configuration
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
        bufferPages: true,
        info: {
          Title: `Farmer Report - ${report.farmerId.farmerName}`,
          Author: "Farm Management System",
          Subject: `Report ID: ${reportId}`,
          Keywords: "farmer, agriculture, report",
          CreationDate: new Date(),
        },
      });

      const filePath = `./temp/report_${reportId}_${Date.now()}.pdf`;
      const tempDir = "./temp";
      await fs.promises.mkdir(tempDir, { recursive: true });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Store useful dimensions
      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const pageHeight = doc.page.height - doc.page.margins.bottom - doc.page.margins.top;

      // Add a styled header with logo placeholder
      addDocumentHeader(doc, report, pageWidth);

      // Add detailed report info in a styled box
      addReportDetails(doc, report);

      // Add images section with better layout and pagination
      if (report.images?.length > 0) {
        await addImagesSection(doc, report.images, pageHeight, pageWidth);
      }

      // Add summary content if needed
      if (report.summary || report.recommendations) {
        addSummarySection(doc, report);
      }

      // Add proper footer on each page with pagination
      addDocumentFooter(doc);

      doc.end();

      return new Promise((resolve, reject) => {
        stream.on("finish", async () => {
          // ✅ Ensure file is fully written
          fs.stat(filePath, (err, stats) => {
            if (err) {
              logger.error("Error verifying PDF file");
              reject(new ApiError(500, "Error verifying PDF file"));
            } else if (stats.size === 0) {
              logger.error("Generated PDF is empty");
              reject(new ApiError(500, "Generated PDF is empty"));
            } else {
              resolve(filePath);
            }
          });
        });
        stream.on("error", reject);
      });
    } catch (error) {
      logger.error("PDF Generation Error:", error);
      throw new ApiError(500, `Failed to generate PDF: ${error.message}`);
    }
  }
}

module.exports = ReportService;
