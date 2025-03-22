const ApiError = require("../errors/ApiErrors");
const DistrictModel = require("../models/District.model");
const FarmerModel = require("../models/FarmerCrop.model");
const ReportModel = require("../models/Report.model");
const StateModel = require("../models/State.model");

class UplService {
  static async addEnquiryForUPL(data) {
    const frenchiseId = "UPL1000";
    const { state, district } = data;

    const isState = await StateModel.findOne({ stateId: state });
    if (!isState) {
      throw new ApiError("No state found");
    }

    const isDistrict = await DistrictModel.findOne({ districtId: district });
    if (!isDistrict) {
      throw new ApiError("No district found");
    }

    // Prepare the document with necessary fields
    const modifiedData = {
      ...data,
      userId: frenchiseId, // Set userId manually
      state: isState._id,
      district: isDistrict._id,
      enquiryType: "farmer",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Use Mongoose model (this will trigger pre("save") hook)
    const farmer = new FarmerModel(modifiedData);
    const result = await farmer.save(); // Now requestId and fieldId are generated

    return result;
  }

  static async getFarmerRequests() {
    const detail = await FarmerModel.find({ userId: "UPL1000" });
    if (!detail) {
      throw new ApiError(400, "No Detail found");
    }
    return detail;
  }

  static async getWeatherReports(data) {
    const { requestId } = data;
    if (!requestId) {
      throw new ApiError("requestId is required");
    }
    const detail = await ReportModel.findOne({ requestId }).sort({ createdAt: -1 });
    if (!detail) {
      throw new ApiError("detail not found");
    }
    return { weatherReport: detail?.weatherReport, createdAt: detail?.createdAt };
  }

  static async getImageReport(data) {
    const { requestId } = data;
    if (!requestId) {
      throw new ApiError("requestId is required");
    }
    const detail = await ReportModel.findOne({ requestId }).sort({ createdAt: -1 });
    if (!detail) {
      throw new ApiError("detail not found");
    }
    return { imagesReports: detail?.images, createdAt: detail?.createdAt };
  }

  static async getAdvisoryReport(data) {
    const { requestId } = data;
    if (!requestId) {
      throw new ApiError("requestId is required");
    }
    const detail = await ReportModel.findOne({ requestId }).sort({ createdAt: -1 });
    if (!detail) {
      throw new ApiError("detail not found");
    }
    return { advisory_report: detail?.excel, createdAt: detail?.createdAt };
  }

  static async getAlertReport(data) {
    const { requestId } = data;
    if (!requestId) {
      throw new ApiError("requestId is required");
    }
    const detail = await ReportModel.findOne({ requestId }).sort({ createdAt: -1 });
    if (!detail) {
      throw new ApiError("detail not found");
    }
    return { alert_notifications: detail?.alert_notifications, createdAt: detail?.createdAt };
  }
}

module.exports = UplService;
