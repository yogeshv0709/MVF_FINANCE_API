const express = require("express");
const router = express.Router();
const upload = require("../../api/middleware/upload");
const {
  getAllReports,
  getReportById,
  submitReport,
  getAllFarmerReports,
} = require("../controller/report.controller");
const { authMiddleware } = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");
const validate = require("../middleware/zodValidate");
const reportSchema = require("../validators/reportValidator");
const processDescriptions = require("../middleware/report/processDescription.middleware");
const { objectIdSchema } = require("../validators/objectIdValidator");

// @access admin only
router.post(
  "/addSubmitReport",
  authMiddleware,
  isAdmin,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "weatherReport", maxCount: 1 },
    { name: "excel", maxCount: 1 },
  ]),
  processDescriptions, // Middleware to handle descriptions
  // validate(reportSchema),
  submitReport
);

// Get all reports (paginated) @access admin will get all and company will get its perticular farmer @requestid in payload
router.post("/getPreviousReports", authMiddleware, getAllReports);

//Get all farmer reports
router.get(
  "/:farmerId",
  authMiddleware,
  validate(objectIdSchema, "params"),
  getAllFarmerReports
);

// Get a single report by ID
router.get(
  "/:reportId",
  authMiddleware,
  validate(objectIdSchema, "params"),
  getReportById
);

module.exports = router;
