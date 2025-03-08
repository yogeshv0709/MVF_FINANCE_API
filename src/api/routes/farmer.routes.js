const express = require("express");
const {
  addFarmerCrop,
  getFarmerCrops,
} = require("../controller/farmer.controller");
const validate = require("../middleware/zodValidate");
const {
  FarmerCropSchema,
  getFarmersCropSchema,
} = require("../validators/farmerValidator");
const { authMiddleware } = require("../middleware/authMiddleware");
const isCompany = require("../middleware/isCompany");
const router = express.Router();

// @access company
router.post(
  "/addEnquiry",
  authMiddleware,
  isCompany,
  validate(FarmerCropSchema),
  addFarmerCrop
);

// @access admin=>all company=> company's farmer {"entype":"user"} {"entype":"bank"}
router.post(
  "/getEnquiry",
  authMiddleware,
  validate(getFarmersCropSchema),
  getFarmerCrops
);

// router.get("/:farmerId", validate(objectIdSchema, "params"), getFarmerCropById);

module.exports = router;
