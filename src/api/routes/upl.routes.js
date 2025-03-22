const express = require("express");
const uplController = require("../controller/upl.controller");
const validate = require("../middleware/zod.middleware");
const validation = require("../validators/upl.validator");
const authUPLkey = require("../middleware/authUPLkey.middleware");

const router = express.Router();

router.post("/getFarmerRequest", authUPLkey, uplController.getFarmerRequests);

router.post(
  "/getImageReport",
  authUPLkey,
  validate(validation.uplValidator),
  uplController.getImageReport
);

router.post(
  "/getAlertReport",
  authUPLkey,
  validate(validation.uplValidator),
  uplController.getAlertReport
);

router.post(
  "/addFarmerRequest",
  authUPLkey,
  validate(validation.FarmerCropSchema),
  uplController.addEnquiryForUPL
);

router.post(
  "/getWeatherReport",
  authUPLkey,
  validate(validation.uplValidator),
  uplController.getWeatherReports
);

router.post(
  "/getAdvisoryReport",
  authUPLkey,
  validate(validation.uplValidator),
  uplController.getAdvisoryReport
);

module.exports = router;
