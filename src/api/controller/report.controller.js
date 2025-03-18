const ApiError = require("../../errors/ApiErrors");
const ReportService = require("../../services/report.service");
const ApiResponse = require("../../utils/ApiResponse");
const { asyncHandler } = require("../../utils/asyncHandler");
const { logger } = require("../../utils/helpers/logger.utils");
const fs = require("fs");
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
  const data = req.body;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  logger.info("Fetching all reports", { user, page, limit, data });

  const reportsData = await ReportService.getAllReports(user, data, page, limit);

  logger.info("Reports fetched successfully");
  res.status(200).json(new ApiResponse(200, reportsData));
});

const notifyFarmer = asyncHandler(async (req, res) => {
  const user = req.user;
  const { reportId } = req.body;
  logger.info("Sending report via WhatsApp", { reportId });

  const response = await ReportService.notifyFarmer(user, reportId);

  logger.info("Reports send by WhatsApp successfully");
  res.status(200).json(new ApiResponse(200, response));
});

const downloadReport = asyncHandler(async (req, res) => {
  const { reportId } = req.body;
  logger.info("request for download pdf", { reportId });

  const pdfPath = await ReportService.generateReportPDF(reportId);
  // ✅ Check if file exists before sending
  if (!fs.existsSync(pdfPath)) {
    throw new ApiError(500, "Generated PDF file not found");
  }

  res.download(pdfPath, `report_${reportId}.pdf`, (err) => {
    if (err) {
      logger.error("Download Error:", err);
      // return res.status(500).json({ message: "Failed to download PDF" });
      throw new ApiError(500, "Failed to download PDF");
    }
    // ✅ Delete file **after** the response is sent
    setTimeout(() => {
      fs.unlink(pdfPath, (err) => {
        if (err) logger.error("File Deletion Error:", err);
      });
    }, 10000); // Wait 10s to ensure frontend receives file
  });
  logger.info("pdf download success");
});

module.exports = {
  submitReport,
  getAllReports,
  notifyFarmer,
  downloadReport,
};
