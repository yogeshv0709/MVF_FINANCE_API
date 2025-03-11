const ReportService = require("../../services/report.service");
const ApiResponse = require("../../utils/ApiResponse");
const { asyncHandler } = require("../../utils/asyncHandler");

// Create a new report
const submitReport = asyncHandler(async (req, res) => {
  const report = await ReportService.createReport(req.body, req.files);
  res.status(200).json(new ApiResponse(200, report));
});

// Get all reports (with pagination)
const getAllReports = asyncHandler(async (req, res) => {
  let { page, limit } = req.query;
  const user = req.user;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const reportsData = await ReportService.getAllReports(user, req.body, page, limit);

  res.status(200).json(new ApiResponse(200, reportsData));
});

module.exports = {
  submitReport,
  getAllReports,
};
