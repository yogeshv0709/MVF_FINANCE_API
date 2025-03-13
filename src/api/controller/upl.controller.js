const UplService = require("../../services/upl.service");
const ApiResponse = require("../../utils/ApiResponse");
const { asyncHandler } = require("../../utils/asyncHandler");
const { logger } = require("../../utils/helpers/logger.utils");

const addEnquiryForUPL = asyncHandler(async (req, res) => {
  logger.info("Adding enquiry  for upl", { requestBody: req.body });
  const farmerCrop = await UplService.addEnquiryForUPL(req.body);
  logger.info("Enquiry added for upl");
  res.status(200).json(new ApiResponse(200, farmerCrop, "Saved successfully"));
});

const getFarmerRequests = asyncHandler(async (req, res) => {
  logger.info("Access to farmer request", { requestBody: req.body });
  const farmerCrop = await UplService.getFarmerRequests(user, req.body);
  logger.info("Farmer request success");
  res.status(200).json(new ApiResponse(200, farmerCrop, "Saved successfully"));
});

const getWeatherReports = asyncHandler(async (req, res) => {
  logger.info("Getting weatherReport", { requestBody: req.body });
  const farmerCrop = await UplService.getWeatherReports(req.body);
  logger.info("weatherReport request Success");
  res.status(200).json(new ApiResponse(200, farmerCrop, "Saved successfully"));
});

const getImageReport = asyncHandler(async (req, res) => {
  logger.info("Getting Image report", { requestBody: req.body });
  const farmerCrop = await UplService.getImageReport(req.body);
  logger.info("Image report success");
  res.status(200).json(new ApiResponse(200, farmerCrop, "Saved successfully"));
});

const getAdvisoryReport = asyncHandler(async (req, res) => {
  logger.info("Getting advisoryReports", { requestBody: req.body });
  const farmerCrop = await UplService.getImageReport(req.body);
  logger.info("Advisory Reports Success", { farmer: farmerCrop._id });
  res.status(200).json(new ApiResponse(200, farmerCrop, "Saved successfully"));
});

const getAlertReport = asyncHandler(async (req, res) => {
  logger.info("Getting alert Report", { requestBody: req.body });
  const farmerCrop = await UplService.getAlertReport(req.body);
  logger.info("Alert Report Success");
  res.status(200).json(new ApiResponse(200, farmerCrop, "Saved successfully"));
});

module.exports = {
  addEnquiryForUPL,
  getAdvisoryReport,
  getAlertReport,
  getWeatherReports,
  getImageReport,
  getFarmerRequests,
};
