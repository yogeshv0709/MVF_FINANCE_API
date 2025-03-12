const express = require("express");
const {
  addFarmerCrop,
  getFarmerCrops,
  deleteFarmerCrops,
} = require("../controller/farmer.controller");
const validate = require("../middleware/zod.middleware");
const {
  FarmerCropSchema,
  deleteEnquirySchema,
  getFarmersCropSchema,
} = require("../validators/farmer.validator");
const { authMiddleware } = require("../middleware/auth.middleware");
const isCompany = require("../middleware/isCompany.middleware");

const router = express.Router();

// @access company
router.post("/addEnquiry", authMiddleware, isCompany, validate(FarmerCropSchema), addFarmerCrop);

// @access admin=>all company=> company's farmer {"entype":"user"} {"entype":"bank"}
router.post("/getEnquiry", authMiddleware, validate(getFarmersCropSchema), getFarmerCrops);

router.post("/deleteEnquiry", authMiddleware, validate(deleteEnquirySchema), deleteFarmerCrops);

module.exports = router;
