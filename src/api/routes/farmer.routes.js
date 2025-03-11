const express = require("express");
const { addFarmerCrop, getFarmerCrops } = require("../controller/farmer.controller");
const validate = require("../middleware/zod.middleware");
const { FarmerCropSchema, getFarmersCropSchema } = require("../validators/farmer.validator");
const { authMiddleware } = require("../middleware/auth.middleware");
const isCompany = require("../middleware/isCompany.middleware");

const router = express.Router();

// @access company
router.post("/addEnquiry", authMiddleware, isCompany, validate(FarmerCropSchema), addFarmerCrop);

// @access admin=>all company=> company's farmer {"entype":"user"} {"entype":"bank"}
router.post("/getEnquiry", authMiddleware, validate(getFarmersCropSchema), getFarmerCrops);

module.exports = router;
