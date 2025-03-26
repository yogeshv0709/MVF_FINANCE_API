const express = require("express");
const farmerController = require("../controller/farmer.controller");
const validate = require("../middleware/zod.middleware");
const validation = require("../validators/farmer.validator");
const { authMiddleware } = require("../middleware/auth.middleware");
const isCompany = require("../middleware/isCompany.middleware");

const router = express.Router();

// @access company
router.post(
  "/addEnquiry",
  authMiddleware,
  isCompany,
  validate(validation.FarmerCropSchema),
  farmerController.addFarmerCrop
);

// @access admin=>all company=> company's farmer {"entype":"user"} {"entype":"bank"}
router.post(
  "/getEnquiry",
  authMiddleware,
  validate(validation.getFarmersCropSchema),
  farmerController.getFarmerCrops
);

router.post(
  "/deleteEnquiry",
  authMiddleware,
  validate(validation.deleteEnquirySchema),
  farmerController.deleteFarmerCrops
);

router.post("/getFarmerDetail", authMiddleware, farmerController.getFarmerDetail);

router.post(
  "/send-otp",
  authMiddleware,
  validate(validation.sendOtpSchema),
  farmerController.sendOTP
);

router.post(
  "/verify-otp",
  authMiddleware,
  validate(validation.verifyOtpSchema),
  farmerController.verifyOTP
);

router.post(
  "/updateFarmerDetail",
  authMiddleware,
  validate(validation.verifyOtpSchema),
  farmerController.updateFarmerCrops
);
//edit-farmer
module.exports = router;
