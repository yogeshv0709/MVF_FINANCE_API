const ReportService = require("../../services/ReportService");
const ApiResponse = require("../../utils/ApiResponse");
const { asyncHandler } = require("../../utils/asyncHandler");

// Create a new report
const submitReport = asyncHandler(async (req, res) => {
  const report = await ReportService.createReport(req.body, req.files);
  res.status(201).json(new ApiResponse(201, report));
});

// Get all reports (with pagination)
const getAllReports = asyncHandler(async (req, res) => {
  let { page, limit } = req.query;
  const user = req.user;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const reportsData = await ReportService.getAllReports(user, page, limit);

  res.status(200).json(new ApiResponse(200, reportsData));
});

//Get all report by farmer Id
const getAllFarmerReports = asyncHandler(async (req, res) => {
  let { page, limit } = req.query;
  const user = req.user;
  const { farmerId } = req.params;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const reportsData = await ReportService.getAllFarmerReports(
    user,
    farmerId,
    page,
    limit
  );
  res.status(200).json(new ApiResponse(200, reportsData));
});

// Get a single report by ID
const getReportById = asyncHandler(async (req, res) => {
  const user = req.user;
  const report = await ReportService.getReportById(user, req.params.reportId);

  res.status(200).json(new ApiResponse(200, report));
});

module.exports = {
  submitReport,
  getAllReports,
  getReportById,
  getAllFarmerReports,
};
