const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const { getAllReports, submitReport } = require("../controller/report.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const isAdmin = require("../middleware/isAdmin.middleware");
const validate = require("../middleware/zod.middleware");
const reportSchema = require("../validators/report.validator");
const processDescriptions = require("../middleware/report/processDescription.middleware");

// @access admin only
router.post(
  "/addSubmitReport",
  authMiddleware,
  isAdmin,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "weatherReport", maxCount: 1 },
    { name: "excel", maxCount: 1 },
    { name: "schedule_advisory1", maxCount: 1 },
    { name: "schedule_advisory2", maxCount: 1 },
  ]),
  processDescriptions,
  validate(reportSchema),
  submitReport
);

// Get all reports (paginated) @access admin will get all and company will get its perticular farmer @requestid in payload
router.post("/getPreviousReports", authMiddleware, getAllReports);

module.exports = router;
