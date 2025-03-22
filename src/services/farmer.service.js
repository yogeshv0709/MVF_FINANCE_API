const mongoose = require("mongoose");
const ApiError = require("../errors/ApiErrors");
const CompanyModel = require("../models/Company.model");
const StateDistrict = require("../models/District.model");
const Farmer = require("../models/FarmerCrop.model");
const StateModel = require("../models/State.model");
const { checkCompanyAccess } = require("../utils/authHelper");
const { userType } = require("../utils/constants/constant");
const { logger } = require("../utils/helpers/logger.utils");
const { deleteFileFromS3 } = require("../utils/helpers/s3Fileops");
const Report = require("../models/Report.model");
const generateAndStoreOtp = require("../utils/helpers/generateOTP.util");
const verifyOtp = require("../utils/helpers/verifyOTP.util");
const OTPModel = require("../models/OTP.model");
const { sendWhatsAppOTP } = require("../utils/helpers/sendWhatsapp.util");

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

  static async sendOtp(phoneNumber) {
    const otp = await generateAndStoreOtp(phoneNumber);
    console.log(otp);
    // await sendWhatsAppOTP(phoneNumber, otp);
  }

  static async verifyOtp(phoneNumber, otp, user) {
    const response = await verifyOtp(phoneNumber, otp);
    if (!response.success) {
      throw new ApiError(400, "Invalid or expired OTP");
    }
    let farmer;
    const { userId } = user;
    if (response.success) {
      const company = await CompanyModel.findOne({ userId });
      if (!company) {
        throw new ApiError(404, "No company found");
      }
      farmer = await Farmer.findOne({ contact: phoneNumber, companyId: company._id })
        .sort({
          createdAt: -1,
        })
        .populate("state")
        .populate("district");
      if (!farmer) {
        return response;
      }
    } else {
      farmer = {};
    }
    return farmer;
  }

  static async getFarmerDetails(user, data, page = 1, limit = 10) {
    const userId = user.userId;
    const userRole = user.type;
    const { contact } = data;
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
      const filter = contact ? { contact } : {};
      farmerCrops = await Farmer.find(filter)
        .sort({ createdAt: -1 })
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
        const isVerified = await OTPModel.findOne({
          phoneNumber: contact,
          verified: true,
          expiresAt: { $gt: new Date() },
        });

        if (!isVerified) {
          throw new ApiError(400, "Phone number is not verified or OTP expired");
        }
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
        const filter = { companyId: company._id };
        if (contact) filter.contact = contact;
        const farmers = await Farmer.find(filter)
          .sort({ createdAt: -1 })
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

  static async deleteFarmerCrops(user, requestId) {
    const session = await mongoose.startSession(); // Start transaction
    session.startTransaction();

    try {
      const farmerCrop = await Farmer.findOne({ requestId }).populate("companyId").session(session);
      if (!farmerCrop) {
        throw new ApiError(404, "RequestId not found");
      }

      const company = farmerCrop.companyId;
      if (!checkCompanyAccess(user, company)) {
        throw new ApiError(403, "Unauthorized access");
      }

      const reports = await Report.find({ farmerId: farmerCrop._id }).session(session);
      if (reports.length > 0) {
        logger.info(`Found ${reports.length} reports to delete for farmer ${requestId}`);

        // Collect all S3 file URLs from reports
        const s3Urls = [];
        reports.forEach((report) => {
          if (report.images && report.images.length > 0) {
            report.images.forEach((image) => {
              if (image.images) s3Urls.push(image.images);
            });
          }
          if (report.weatherReport) s3Urls.push(report.weatherReport);
          if (report.excel) s3Urls.push(report.excel);
          if (report.schedule_advisory1) s3Urls.push(report.schedule_advisory1);
          if (report.schedule_advisory2) s3Urls.push(report.schedule_advisory2);
        });
        // Delete reports from the database
        await Report.deleteMany({ farmerId: farmerCrop._id }).session(session);
        logger.info(`Deleted ${reports.length} reports for farmer ${requestId}`);

        // Step 3: Delete media files from S3
        if (s3Urls.length > 0) {
          logger.info(`Deleting ${s3Urls.length} S3 files for farmer ${requestId}`);
          await Promise.all(
            s3Urls.map(async (url) => {
              try {
                const deleted = await deleteFileFromS3(url);
                if (deleted) {
                  logger.info(`Deleted S3 file: ${url}`);
                  return true;
                } else {
                  logger.warn(`Failed to delete S3 file (might not exist): ${url}`);
                  return false;
                }
              } catch (err) {
                logger.error(`Error deleting S3 file ${url}:`, err);
                return false; // Continue despite failure
              }
            })
          );
        } else {
          logger.info(`No S3 files found to delete for farmer ${requestId}`);
        }
      } else {
        logger.info(`No reports found for farmer ${requestId}`);
      }
      await Farmer.deleteOne({ _id: farmerCrop._id }).session(session);
      logger.info(`Deleted farmer crop with requestId: ${requestId}`);

      // Commit the transaction
      await session.commitTransaction();
      logger.info(`Successfully completed deletion for farmer ${requestId}`);

      return { message: "Farmer and associated data deleted successfully" };
    } catch (error) {
      await session.abortTransaction();
      logger.error(`Error deleting farmer ${requestId}:`, error);
      throw new ApiError(500, "Failed to delete farmer data");
    } finally {
      session.endSession();
    }
  }
}

module.exports = FarmerCropService;
