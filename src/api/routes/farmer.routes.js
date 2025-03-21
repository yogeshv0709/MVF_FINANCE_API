const express = require("express");
const {
  addFarmerCrop,
  getFarmerCrops,
  deleteFarmerCrops,
  getFarmerDetail,
  sendOTP,
  verifyOTP,
} = require("../controller/farmer.controller");
const validate = require("../middleware/zod.middleware");
const {
  FarmerCropSchema,
  deleteEnquirySchema,
  getFarmersCropSchema,
  sendOtpSchema,
  verifyOtpSchema,
} = require("../validators/farmer.validator");
const { authMiddleware } = require("../middleware/auth.middleware");
const isCompany = require("../middleware/isCompany.middleware");

const router = express.Router();

// @access company
router.post("/addEnquiry", authMiddleware, isCompany, validate(FarmerCropSchema), addFarmerCrop);

// @access admin=>all company=> company's farmer {"entype":"user"} {"entype":"bank"}
router.post("/getEnquiry", authMiddleware, validate(getFarmersCropSchema), getFarmerCrops);

router.post("/deleteEnquiry", authMiddleware, validate(deleteEnquirySchema), deleteFarmerCrops);

router.post("/getFarmerDetail", authMiddleware, getFarmerDetail);

router.post("/send-otp", authMiddleware, validate(sendOtpSchema), sendOTP);

router.post("/verify-otp", authMiddleware, validate(verifyOtpSchema), verifyOTP);

module.exports = router;
