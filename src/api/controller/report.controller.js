const ReportService = require("../../services/report.service");
const ApiResponse = require("../../utils/ApiResponse");
const { asyncHandler } = require("../../utils/asyncHandler");
const { logger } = require("../../utils/helpers/logger.utils");

// Create a new report
const submitReport = asyncHandler(async (req, res) => {
  logger.info("Submitting report", { requestBody: req.body, files: req.files });

  const report = await ReportService.createReport(req.body, req.files);

  logger.info("Report submitted successfully", { report: report._id });
  res.status(200).json(new ApiResponse(200, report));
});

const getAllReports = asyncHandler(async (req, res) => {
  let { page, limit } = req.query;
  const user = req.user;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  logger.info("Fetching all reports", { user, page, limit });

  const reportsData = await ReportService.getAllReports(user, req.body, page, limit);

  logger.info("Reports fetched successfully");
  res.status(200).json(new ApiResponse(200, reportsData));
});

module.exports = {
  submitReport,
  getAllReports,
};
