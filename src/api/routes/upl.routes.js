const express = require("express");
const {
  addEnquiryForUPL,
  getAdvisoryReport,
  getAlertReport,
  getFarmerRequests,
  getImageReport,
  getWeatherReports,
} = require("../controller/upl.controller");
const validate = require("../middleware/zod.middleware");
const { FarmerCropSchema } = require("../validators/farmer.validator");
const { uplValidator } = require("../validators/upl.valdidator");
const authUPLkey = require("../middleware/authUPLkey.middleware");
const router = express.Router();

router.post("/addFarmerRequest", authUPLkey, validate(FarmerCropSchema), addEnquiryForUPL);
router.post("/getFarmerRequest", authUPLkey, getFarmerRequests);

router.post("/getWeatherReport", authUPLkey, validate(uplValidator), getWeatherReports);
router.post("/getImageReport", authUPLkey, validate(uplValidator), getImageReport);
router.post("/getAlertReport", authUPLkey, validate(uplValidator), getAlertReport);
router.post("/getAdvisoryReport", authUPLkey, validate(uplValidator), getAdvisoryReport);

module.exports = router;
