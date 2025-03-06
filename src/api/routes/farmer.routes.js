const express = require("express");
const {
  addFarmerCrop,
  getFarmerCrops,
  getFarmerCropById,
  getFarmerCropsByCompany,
} = require("../controller/farmer.controller");
const validate = require("../middleware/zodValidate");
const { FarmerCropSchema } = require("../validators/farmerValidator");
const { authMiddleware } = require("../middleware/authMiddleware");
const isCompany = require("../middleware/isCompany");
const isAdmin = require("../middleware/isAdmin");
const { objectIdSchema } = require("../validators/objectIdValidator");
const router = express.Router();

// @access company
router.post(
  "/addEnquiry",
  authMiddleware,
  isCompany,
  // validate(FarmerCropSchema),
  addFarmerCrop
);

// @access admin=>all company=> company's farmer {entype:"user"} "bank"
router.post("/getEnquiry", authMiddleware, getFarmerCrops);

// router.get("/:farmerId", validate(objectIdSchema, "params"), getFarmerCropById);

module.exports = router;
