const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const s3ErrorHandler = require("../middleware/s3ErrorHandler.middleware");
const processDescriptions = require("../middleware/report/processDescription.middleware");
const validation = require("../validators/report.validator");
const reportController = require("../controller/report.controller");
const isAdmin = require("../middleware/isAdmin.middleware");
const validate = require("../middleware/zod.middleware");

// @access admin only
router.post(
  "/addSubmitReport",
  authMiddleware,
  isAdmin,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "weatherReport", maxCount: 1 },
    { name: "schedule_advisory1", maxCount: 1 },
    { name: "schedule_advisory2", maxCount: 1 },
    { name: "schedule_advisory3", maxCount: 1 },
  ]),
  s3ErrorHandler,
  processDescriptions,
  validate(validation.reportSchema),
  reportController.submitReport
);

// Get all reports (paginated) @access admin will get all and company will get its perticular farmer @requestid in payload
router.post("/getPreviousReports", authMiddleware, reportController.getAllReports);

router.post("/download-pdf", validate(validation.mongoDBreportId), reportController.downloadReport);

router.post(
  "/send-whatsapp",
  validate(validation.mongoDBreportId),
  reportController.sendReportWhatsapp
);

module.exports = router;
